import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../environment-variables';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import AccountSettings from '../../../api/accountSettings/accountSettings';
import DiscountLog from '../../../api/discountLog/discountLog';
import NotificationLog from '../../../api/notificationLog/notificationLog';
import { lastMinuteDiscounts } from '../../../notifications/lastMinuteDiscounts';
import moment from 'moment';


export const sendLastMinuteDiscounts = () => {
  const accountOrganizationIDs = AccountSettings.find({}, {fields: {"_id": 0, "organizationID": 1} }).fetch();

  // For each organization...
  accountOrganizationIDs.forEach( (accountOrganizationID) => {
    const organizationID = accountOrganizationID["organizationID"];
    const url = 'https://api.meetup.com/' + organizationID + '/events?&sign=true&photo-host=public&page=10&omit=created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=' + MEETUP_API_KEY;
    // https://api.meetup.com/playsoccer2give/events?&sign=true&photo-host=public&page=10&omit=created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=282a2c7858483325b5b6c5510422e5b

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

          // ...and if the game starts within the next 24 hours...
          if (object["time"] <= tomorrowUnix) {

            // ...and if the game has open spots...
            if (object["yes_rsvp_count"] < object["rsvp_limit"]) {

              // ...then find the members of this organization who have been away for at least 11 days...
              const TRIGGER_DAYS = 11; // "7" will mean a week before yesterday (if today's Saturday, "7" will include games last Friday)
              const beenAwayTime = parseInt(nowUnix) - (parseInt(TRIGGER_DAYS) * parseInt(unixDay));
              const members = Members.find(
                { "lastSeen": { $gte : parseInt(beenAwayTime) } },
                { fields: { "userName": 1, "userID": 1, "lastEvent": 1, "askedEmail": 1, "paymentEmail": 1, "organizationID": 1 } }
              ).fetch();

              // ENSURE EMAILS DONT GET SENT OUT TO PEOPLE ALREADY ATTENDING
              // (Don't worry, this will make HTTP calls only for games that are tomorrow that aren't full)

              // ...and log the discount that is offered to them (if it wasn't already offered)...
              members.forEach( (member) => {
                const discountAmount = object["fee"]["amount"].toFixed(2) * .66; // HARD-CODED TO 66% FOR NOW
                const eventID = parseInt(object["link"].slice(46, 55)); // UPDATE THIS WHEN SCRAPING OTHER WEBSITES!!
                const userID = member["userID"];
                const userName = member["userName"];
                const askedEmail = member["askedEmail"];
                const paymentEmail = member["paymentEmail"];
                const emailAddress = paymentEmail ? paymentEmail : askedEmail;

                if (!DiscountLog.findOne({"organizationID": organizationID, "eventID": eventID, "userID": userID}) ) {
                  DiscountLog.insert( {
                    "organizationID": organizationID,
                    "eventID": eventID,
                    "userID": userID,
                    "originalPrice": object["fee"]["amount"].toFixed(2),
                    "discountAmount": discountAmount.toFixed(2),
                  }, (error, response) => {
                    if (error) {
                      console.log(error);
                    } else {

                      // ...and log that the discount was offered, and send the email.
                      if (emailAddress !== undefined) {
                        let notificationRecord = {
                          "notificationName": "lastMinuteDiscounts",
                          "organizationID": organizationID,
                          "eventID": eventID,
                          "userID": userID,
                          "emailAddress": emailAddress
                        };

                        if (!NotificationLog.findOne(notificationRecord) ) {
                          const eventName = Events.findOne({"organizationID": organizationID, "eventID": eventID})["eventName"];

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
                              lastMinuteDiscounts(emailAddress, eventName, discountID);
                            }
                          });
                        } else {
                          console.log("Error: Did not send lastMinuteDiscounts, NotificationLog indicates it was already sent");
                        }
                      }
                    }
                  });
                }
              })
            }
          }
        });
      }
    });
  });

  // Here, sometime in the future, consider adding a script that cleans up old DiscountLog records if they linger too long

}
