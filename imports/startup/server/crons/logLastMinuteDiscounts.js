import { HTTP } from 'meteor/http';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import AccountSettings from '../../../api/accountSettings/accountSettings';
import DiscountLog from '../../../api/discountLog/discountLog';
import { lastMinuteDiscounts } from '../../../api/notifications/lastMinuteDiscounts';
import moment from 'moment';


export const logLastMinuteDiscounts = () => {
  const organizations = AccountSettings.find().fetch();

  // For each organization...
  organizations.forEach( (organization) => {
    const organizationID = organization["organizationID"];
    const meetupAPIKey = organization["meetupAPIKey"];
    const url = 'https://api.meetup.com/' + organizationID + '/events?&sign=true&photo-host=public&page=20&fields=rsvp_rules&omit=rsvp_rules.open_time,rsvp_rules.guest_limit,rsvp_rules.waitlisting,rsvp_rules.refund_policy,rsvp_rules.notes,created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=' + meetupAPIKey;
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
          const nowUnix = parseInt(moment.utc().format("x"));
          const tomorrowUnix = parseInt(nowUnix) + parseInt(unixDay);
          const dayAfterTomorrowUnix = parseInt(nowUnix) + (parseInt(unixDay) * 2);
          const eventURL = object["link"];
          const eventURLSplitArray = eventURL.split("/");
          const eventID = parseInt(eventURLSplitArray[5]); // Example URL: https://www.meetup.com/PlaySoccer2Give/events/241664470/
          const eventName = object["name"];
          const eventTime = object["time"];
          const originalPrice = object["fee"]["amount"].toFixed(2);

          // PART 1:
          // First, we define the function to send discounts, so we can run it after the logic in PART 2 runs.
          const logDiscounts = (discountAmount) => {

            // For this event, find the members of this organization who have been away for at least X days, have an email address, and are not snoozed/unsubscribed...
            const BEEN_AWAY_DAYS = 19; // NOTE: As per time of script run! UPDATE THIS TO BE VARIABLE FROM accountSettings!
            const beenAwayTime = parseInt(nowUnix) - (parseInt(BEEN_AWAY_DAYS) * parseInt(unixDay));
            const members = Members.find({
              "lastSeen": { $lte: parseInt(beenAwayTime) },
              "askedEmail": { $ne: "" || undefined },
              $or: [ {"snoozeUntil": undefined}, {"snoozeUntil": { $lte: parseInt(nowUnix) }} ]
            }).fetch();

            // ...then announce that we're starting the process...
            console.log("Starting lastMinuteDiscounts for " + organizationID + ":" + eventID + " --> " + members.length + " recipients.");

            // ...and log the discount that will be offered to them, so another function can send them out.
            members.forEach( (member) => {
              const userID = member["userID"];

              if (!DiscountLog.findOne({"organizationID": organizationID, "eventID": eventID, "userID": userID}) ) {
                DiscountLog.insert( {
                  "organizationID": organizationID,
                  "eventID": eventID,
                  "eventName": eventName,
                  "eventTime": eventTime,
                  "userID": userID,
                  "originalPrice": originalPrice,
                  "discountAmount": discountAmount,
                  "createdAt": parseInt(moment.utc().format("x")),
                }, (error, response) => {
                  if (error) {
                    console.log(error);
                  }
                });
              } else {
                console.log("Error: Did not send lastMinuteDiscounts for " + userID + ":" + member["askedEmail"] + ", DiscountLog indicates it was already logged");
              }
            });
          } // End of logDiscounts function definition.


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
                      logDiscounts(discountAmount);
                    }
                  });
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
                      logDiscounts(discountAmount);
                    }
                  });
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
}
