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
  let emailsSent = 0;

  // For each organization...
  accountOrganizationIDs.forEach( (accountOrganizationID) => {
    const organizationID = accountOrganizationID["organizationID"];
    const url = 'https://api.meetup.com/' + organizationID + '/events?&sign=true&photo-host=public&page=10&fields=rsvp_rules&omit=rsvp_rules.open_time,rsvp_rules.guest_limit,rsvp_rules.waitlisting,rsvp_rules.refund_policy,rsvp_rules.notes,created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=' + MEETUP_API_KEY;
    // https://api.meetup.com/playsoccer2give/events?&sign=true&photo-host=public&page=10&fields=rsvp_rules&omit=rsvp_rules.open_time,rsvp_rules.guest_limit,rsvp_rules.waitlisting,rsvp_rules.refund_policy,rsvp_rules.notes,created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=

    // ...get the next 10 games in the future...
    HTTP.call( 'GET', url, {}, function( error, response ) {
      if ( error ) {
        console.log( error );
      } else {
        const data = response.data;

        data.forEach( (object) => {
          const unixDay = 86400000;
          const nowUnix = moment.utc().format("x");
          const tomorrowUnix = parseInt(nowUnix) + parseInt(unixDay);

          // ...and if a game starts within the next 24 hours...
          if (object["time"] <= tomorrowUnix) {

            // ... and if that game is open to RSVPs...
            if (object["rsvp_rules"]["closed"] !== true) {

              // ...and if that game has open spots...
              if (object["yes_rsvp_count"] < object["rsvp_limit"]) {

                // ...then find the members of this organization who have been away for at least 11 days and have an email address...
                const TRIGGER_DAYS = 11; // "7" will mean a week before yesterday (if today is Saturday, "7" will include games last Friday)
                const beenAwayTime = parseInt(nowUnix) - (parseInt(TRIGGER_DAYS) * parseInt(unixDay));
                const members = Members.find(
                  { "lastSeen": { $lte : parseInt(beenAwayTime) }, "askedEmail": { $ne: "" || undefined } },
                  { fields: { "userName": 1, "userID": 1, "lastEvent": 1, "askedEmail": 1, "paymentEmail": 1, "organizationID": 1 } }
                ).fetch();

                const eventID = parseInt(object["link"].slice(46, 55)); // UPDATE THIS WHEN SCRAPING OTHER WEBSITES!!
                console.log("Starting lastMinuteDiscounts for " + organizationID + ":" + eventID + " --> " + members.length + " recipients.");

                // ENSURE EMAILS DONT GET SENT OUT TO PEOPLE ALREADY ATTENDING
                // (Don't worry, this will make HTTP calls only for games that are tomorrow that aren't full)

                // ...and log the discount that will be offered to them...
                members.forEach( (member) => {
                  const originalPrice = object["fee"]["amount"].toFixed(2);
                  const discountAmount = (originalPrice * .33).toFixed(2); // HARD-CODED TO 33% OFF FOR NOW
                  const eventName = object["name"];
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
                                const price = (originalPrice - discountAmount).toFixed(2);

                                lastMinuteDiscounts(emailAddress, price, eventName, discountID);
                                emailsSent += 1;
                              }
                            });
                          } else {
                            console.log("Error: Did not send lastMinuteDiscounts, NotificationLog indicates it was already sent");
                          }
                        }
                      }
                    });
                  } else {
                    console.log("Error: Did not send lastMinuteDiscounts, DiscountLog indicates it was already logged");
                  }
                })
              }
            }
          }
        });
      }
    });
  });

  // ***
  // FUTURE WORK: Here, sometime in the future, consider adding a script that cleans up old DiscountLog records if they linger too long
  // ***

  // Report back on how many were sent
  const announceEmailSendCount = () => {
    if (emailsSent > 0) {
      console.log("lastMinuteDiscounts emails sent: " + emailsSent);
    }
  }
  Meteor.setTimeout(announceEmailSendCount, 30000);
}


// For testing:
/*
DiscountLog.insert({
  "organizationID": "playsoccer2give",
  "eventID": 240467973,
  "eventName": "Wednesday 8pm Tron Ball - Night Soccer @ LIC (7v7 game) for PS2G",
  "userID": 58124462,
  "originalPrice": 5.00,
  "discountAmount": 4.92,
}, (error, response) => {
  if (error) {
    console.log(error);
  } else {
    console.log(DiscountLog.find({"userID": 58124462}).fetch());
    let discountID = DiscountLog.findOne({"userID": 58124462})["_id"];
    lastMinuteDiscounts("joelsfoster@gmail.com", 0.08, "Wednesday 8pm Tron Ball - Night Soccer @ LIC (7v7 game) for PS2G", discountID);
  }
});


_id = t9HvMzW4cb66jmBrp
*/
