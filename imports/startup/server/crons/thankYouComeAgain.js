import { thankYouComeAgain } from '../../../notifications/thankYouComeAgain';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import NotificationLog from '../../../api/notificationLog/notificationLog';
import moment from 'moment';


export const sendThankYouComeAgain = () => {
  const unixDay = 86400000;
  const nowUnix = moment.utc().format("x");
  const yesterdayUnix = parseInt(nowUnix) - parseInt(unixDay);

  // Grab all events with a start time within the last 24 hours of the moment run
  const yesterdaysEvents = Events.find(
    { "eventTime": { $gte : parseInt(yesterdayUnix), $lt: parseInt(nowUnix) } },
    { fields: { "organizationID": 1, "eventName": 1, "eventID": 1, "eventTime": 1, "eventMemberIDs": 1 } }
  ).fetch();

  console.log("Starting thankYouComeAgain for the " + yesterdaysEvents.length + " events yesterday...");

  // If there were events yesterday (the last 24 hours at runtime), loop through each event
  if (yesterdaysEvents.length > 0) {
    yesterdaysEvents.forEach( (object) => {
      const organizationID = object["organizationID"];
      const eventID = object["eventID"];

      // Loop through each event's attendees
      object["eventMemberIDs"].forEach( (userID) => {
        const member = Members.findOne( { "organizationID": organizationID, "userID": userID } );
        const userName = member["userName"];
        const askedEmail = member["askedEmail"];
        const paymentEmail = member["paymentEmail"];
        const emailAddress = paymentEmail ? paymentEmail : askedEmail;

        // If an attendee has an email address...
        if (emailAddress || emailAddress !== "") {
          const notificationRecord = {
            "notificationName": "thankYouComeAgain",
            "organizationID": organizationID,
            "eventID": eventID,
            "userID": userID,
            "emailAddress": emailAddress
          };

          // ...and this email+organizationID pair was not sent a thankYouComeAgain notification in the last 24 hours...
          if (!NotificationLog.findOne( {
            "notificationName": "thankYouComeAgain",
            "emailAddress": emailAddress,
            "notificationTime": { $gte : parseInt(yesterdayUnix) }
          } )) {

            // ...and this specific notification instance wasn't sent, send them a notification and log it
            if (!NotificationLog.findOne(notificationRecord) ) {
              NotificationLog.insert( {
                "notificationName": "thankYouComeAgain",
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
                  thankYouComeAgain(emailAddress, userID);
                  console.log("thankYouComeAgain sent -> " + eventID + ":" + emailAddress);
                }
              });
            } else {
              console.log("Error: Did not send thankYouComeAgain, NotificationLog indicates it was already sent");
            }
          }
        }
      });
    });
  } else {
    console.log("thankYouComeAgain: No events yesterday");
  }
};
