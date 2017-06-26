import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../environment-variables';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import AccountSettings from '../../../api/accountSettings/accountSettings';
import DiscountLog from '../../../api/discountLog/discountLog';
import NotificationLog from '../../../api/notificationLog/notificationLog';
import { lastMinuteDiscounts } from '../../../api/notifications/lastMinuteDiscounts';
import moment from 'moment';


export const sendLastMinuteDiscounts = () => {
  const accountOrganizationIDs = AccountSettings.find({}, {fields: {"_id": 0, "organizationID": 1} }).fetch();

  // For each organization...
  accountOrganizationIDs.forEach( (accountOrganizationID) => {
    const organizationID = accountOrganizationID["organizationID"];
    const url = 'https://api.meetup.com/' + organizationID + '/events?&sign=true&photo-host=public&page=20&fields=rsvp_rules&omit=rsvp_rules.open_time,rsvp_rules.guest_limit,rsvp_rules.waitlisting,rsvp_rules.refund_policy,rsvp_rules.notes,created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=' + MEETUP_API_KEY;
    // https://api.meetup.com/playsoccer2give/events?&sign=true&photo-host=public&page=20&fields=rsvp_rules&omit=rsvp_rules.open_time,rsvp_rules.guest_limit,rsvp_rules.waitlisting,rsvp_rules.refund_policy,rsvp_rules.notes,created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=

    // ...get the next 20 games in the future...
    HTTP.call( 'GET', url, {}, function( error, response ) {
      if ( error ) {
        console.log( error );
      } else {
        const data = response.data;

        // ...and look through each to determine if it should be discounted (logic below in PART 2).
        data.forEach( (object) => {
          const unixDay = 86400000;
          const nowUnix = moment.utc().format("x");
          const tomorrowUnix = parseInt(nowUnix) + parseInt(unixDay);
          const dayAfterTomorrowUnix = parseInt(nowUnix) + (parseInt(unixDay) * 2);
          const eventID = parseInt(object["link"].slice(46, 55)); // UPDATE THIS WHEN SCRAPING OTHER WEBSITES!!
          const eventName = object["name"];
          const originalPrice = object["fee"]["amount"].toFixed(2);

          // PART 1:
          // First, we define the function to send discounts, so we can run it after the logic in PART 2 runs.
          const sendDiscounts = (discountAmount) => {

            // For this event, find the members of this organization who have been away for at least XYZ days and have an email address...
            const BEEN_AWAY_DAYS = 19; // NOTE: As per time of script run! UPDATE THIS TO BE VARIABLE FROM accountSettings!
            const beenAwayTime = parseInt(nowUnix) - (parseInt(BEEN_AWAY_DAYS) * parseInt(unixDay));
            const members = Members.find(
              { "lastSeen": { $lte : parseInt(beenAwayTime) }, "askedEmail": { $ne: "" || undefined } },
              { fields: { "userName": 1, "userID": 1, "lastEvent": 1, "askedEmail": 1, "paymentEmail": 1, "organizationID": 1 } }
            ).fetch();

            // ...then announce that we're starting the process...
            console.log("Starting lastMinuteDiscounts for " + organizationID + ":" + eventID + " --> " + members.length + " recipients.");

            // ENSURE EMAILS DONT GET SENT OUT TO PEOPLE ALREADY ATTENDING
            // (Don't worry, this will make HTTP calls only for games that are tomorrow that aren't full)

            // ...and log the discount that will be offered to them...
            members.forEach( (member) => {
              const userID = member["userID"];
              const userName = member["userName"];
              const askedEmail = member["askedEmail"];
              const paymentEmail = member["paymentEmail"];
              const emailAddress = paymentEmail ? paymentEmail : askedEmail;

              if (!DiscountLog.findOne({"organizationID": organizationID, "eventID": eventID, "userID": userID}) ) {
                DiscountLog.insert( {
                  "organizationID": organizationID,
                  "eventID": eventID,
                  "eventName": eventName,
                  "userID": userID,
                  "originalPrice": originalPrice,
                  "discountAmount": discountAmount,
                }, (error, response) => {
                  if (error) {
                    console.log(error);
                  } else {

                    // ...and log that the discount email was sent (after sending the email).
                    if (!(emailAddress === "" || emailAddress === undefined)) {
                      let notificationRecord = {
                        "notificationName": "lastMinuteDiscounts",
                        "organizationID": organizationID,
                        "eventID": eventID,
                        "userID": userID,
                        "emailAddress": emailAddress
                      };

                      if (!NotificationLog.findOne(notificationRecord) ) {
                        NotificationLog.insert( {
                          "notificationName": "lastMinuteDiscounts",
                          "notificationTime": moment.utc().format("x"),
                          "organizationID": organizationID,
                          "eventID": eventID,
                          "userID": userID,
                          "userName": userName,
                          "emailAddress": emailAddress
                        }, (error, response) => {
                          if (error) {
                            console.log(error);
                          } else {
                            const discountID = DiscountLog.findOne({"organizationID": organizationID, "eventID": eventID, "userID": userID})["_id"];                            

                            lastMinuteDiscounts(emailAddress, discountID);
                          }
                        });
                      } else {
                        console.log("Error: Did not send lastMinuteDiscounts for " + userID + ":" + emailAddress + ", NotificationLog indicates it was already sent");
                      }
                    }
                  }
                });
              } else {
                console.log("Error: Did not send lastMinuteDiscounts for " + userID + ":" + emailAddress + ", DiscountLog indicates it was already logged");
              }
            });
          } // End of sendDiscounts function definition.


          // PART 2:
          // We define the logic that determines if a discount should be sent out
          // If a game starts between the next 24-48 hours...
          if (object["time"] >= tomorrowUnix && object["time"] <= dayAfterTomorrowUnix) {

            // ...and if that game is open to RSVPs...
            if (object["rsvp_rules"]["closed"] !== true) {

              // ...then use the logic specified by the account to determine how much discount to offer based off original price and how empty the event is...
              const DONT_DISCOUNT_IF_OVER = .70; // Need to make variable from accountSettings
              const BIG_DISCOUNT_IF_UNDER = .50; // Need to make variable from accountSettings
              const currentAttendeesCount = object["yes_rsvp_count"];
              const rsvpLimit = object["rsvp_limit"];
              const percentageFilled = (currentAttendeesCount / rsvpLimit).toFixed(2);
              const dontDiscount = percentageFilled > DONT_DISCOUNT_IF_OVER;
              const bigDiscount = percentageFilled <= BIG_DISCOUNT_IF_UNDER;
              const originalPrice = parseFloat(object["fee"]["amount"].toFixed(2));

              // PART 2.1
              // If the game doesn't qualify for a big discount, and should be sent a discount, then send a normal discount
              if (!dontDiscount && !bigDiscount) {

                const flatDiscountsNormal = AccountSettings.findOne({"organizationID": organizationID }, {fields: {"_id": 0, "flatDiscountsNormal": 1} });

                if (flatDiscountsNormal !== undefined) {
                  let discounts = flatDiscountsNormal["flatDiscountsNormal"];

                  discounts.forEach( (discount) => {
                    if (discount["originalPrice"] == originalPrice) {
                      let discountAmount = discount["discountAmount"].toFixed(2);
                      sendDiscounts(discountAmount);
                    }
                  });

                } else {
                  console.log("ERROR: originalPrice $" + originalPrice + " has no corresponding flatDiscountsNormal amount");
                }

              // PART 2.2
              // If the game qualifies for a bigDiscount, send it
              } else if (!dontDiscount && bigDiscount) {

                const flatDiscountsBig = AccountSettings.findOne({"organizationID": organizationID }, {fields: {"_id": 0, "flatDiscountsBig": 1} });

                if (flatDiscountsBig !== undefined) {
                  let discounts = flatDiscountsBig["flatDiscountsBig"];

                  discounts.forEach( (discount) => {
                    if (discount["originalPrice"] == originalPrice) {
                      let discountAmount = discount["discountAmount"].toFixed(2);
                      sendDiscounts(discountAmount);
                    }
                  });

                } else {
                  console.log("ERROR: originalPrice $" + originalPrice + " has no corresponding flatDiscountsBig amount");
                }

              // PART 2.3
              // If the game doesn't qualify for a discount because it's almost full, don't send any discount
              } else {
                console.log(organizationID + ":" + eventID + " filled above capacity ceiling specified (" + (DONT_DISCOUNT_IF_OVER * 100).toFixed(0) + "%), no discount offered.");
              }
            }
          } // End of logic, and function execution.

        }); // End of "for each event..." loop.
      }
    });
  });

  // ***
  // FUTURE WORK: Here, sometime in the future, consider adding a script that cleans up old DiscountLog records if they linger too long
  // ***

}
