import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import { thankYouComeAgain } from '../../../notifications/thankYouComeAgain';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import NotificationLog from '../../../api/notificationLog/notificationLog';
import moment from 'moment';


let sendEmails = () => {
  let unixDay = 86400000;
  let nowUnix = moment.utc().format("x");
  let yesterdayUnix = parseInt(nowUnix) - parseInt(unixDay);

  // Note: Grabs all events with a start time within the last 24 hours of the moment run
  let yesterdaysEvents = Events.find(
    { "eventTime": { $gte : parseInt(yesterdayUnix), $lt: parseInt(nowUnix) } },
    { fields: { "organizationID": 1, "eventName": 1, "eventID": 1, "eventTime": 1, "eventMemberIDs": 1 } }
  ).fetch();

  console.log("Starting thankYouComeAgain for the " + yesterdaysEvents.length + " events yesterday...");

  if (yesterdaysEvents.length > 0) {
    yesterdaysEvents.forEach( (object) => {
      let organizationID = object["organizationID"];
      let eventID = object["eventID"];

      object["eventMemberIDs"].forEach( (userID) => {
        let member = Members.findOne( { "organizationID": organizationID, "userID": userID } );
        let userName = member["userName"];
        let askedEmail = member["askedEmail"];
        let paymentEmail = member["paymentEmail"];
        let emailAddress = paymentEmail ? paymentEmail : askedEmail;

        if (emailAddress !== undefined) {
          let notificationRecord = {
            "notificationName": "thankYouComeAgain",
            "organizationID": organizationID,
            "eventID": eventID,
            "userID": userID,
            "emailAddress": emailAddress
          };

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
      });
    });
  } else {
    console.log("thankYouComeAgain: No events yesterday");
  }
};

// Add the cron to the scheduler
SyncedCron.config({ log: true, utc: true });

SyncedCron.add({
  name: "thankYouComeAgain",
  schedule(parser) {
    return parser.text('at 3:50 am'); // This is UTC time -> 11:50pm EST
  },
  job() {
    sendEmails();
  },
});
