import { weMissYou } from '../../../api/notifications/weMissYou';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import NotificationLog from '../../../api/notificationLog/notificationLog';
import moment from 'moment';


export const sendWeMissYou = () => {
  let unixDay = 86400000;
  let nowUnix = moment.utc().format("x");
  const TRIGGER_DAYS = 11; // "7" will mean a week before yesterday (if today's Saturday, "7" will include games last Friday)
  let upperRangeYesterday = parseInt(nowUnix) - (parseInt(TRIGGER_DAYS) * parseInt(unixDay));
  let lowerRangeYesterday = parseInt(nowUnix) - ((parseInt(TRIGGER_DAYS) + 1) * parseInt(unixDay));

  // Grab all events with a start time within a 24 hour window of runtime, "TRIGGER_DAYS" ago
  let members = Members.find(
    { "lastSeen": { $gte : parseInt(lowerRangeYesterday), $lt: parseInt(upperRangeYesterday) } },
    { fields: { "userName": 1, "userID": 1, "lastEvent": 1, "askedEmail": 1, "paymentEmail": 1, "organizationID": 1 } }
  ).fetch();

  console.log("Starting weMissYou for " + members.length + " members who last played " + TRIGGER_DAYS + " days ago...");

  // If at least one member meets this criteria, loop through each attendee
  if (members.length > 0) {
    members.forEach( (object) => {
      let organizationID = object["organizationID"];
      let eventID = object["lastEvent"];
      let userID = object["userID"];
      let userName = object["userName"];
      let askedEmail = object["askedEmail"];
      let paymentEmail = object["paymentEmail"];
      let emailAddress = paymentEmail ? paymentEmail : askedEmail;

      // If an attendee has an email address...
      if (emailAddress && emailAddress !== "") {
        let notificationRecord = {
          "notificationName": "weMissYou",
          "organizationID": organizationID,
          "eventID": eventID,
          "userID": userID,
          "emailAddress": emailAddress
        };

        // Send them a notification and log that it was sent
        if (!NotificationLog.findOne(notificationRecord) ) {
          NotificationLog.insert( {
            "notificationName": "weMissYou",
            "notificationTime": moment.utc().format("x"),
            "organizationID": organizationID,
            "eventID": Array.of(eventID),
            "userID": userID,
            "userName": userName,
            "emailAddress": emailAddress
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              weMissYou(emailAddress, userID);
              console.log("weMissYou sent -> " + eventID + ":" + emailAddress);
            }
          });
        } else {
          console.log("Error: Did not send weMissYou, NotificationLog indicates it was already sent");
        }
      }
    });
  } else {
    console.log("weMissYou: No members attended " + TRIGGER_DAYS + " days ago");
  }
};
