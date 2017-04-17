import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import { weMissYou } from '../../../notifications/weMissYou';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import NotificationLog from '../../../api/notificationLog/notificationLog';
import moment from 'moment';


let sendEmails = () => {
  let unixDay = 86400000;
  let nowUnix = moment.utc().format("x");
  const TRIGGER_DAYS = 11; // "7" will mean a week before yesterday (if today's Saturday, "7" will include games last Friday)
  let upperRangeYesterday = parseInt(nowUnix) - (parseInt(TRIGGER_DAYS) * parseInt(unixDay));
  let lowerRangeYesterday = parseInt(nowUnix) - ((parseInt(TRIGGER_DAYS) + 1) * parseInt(unixDay));

  // Note: Grabs all events with a start time (TRIGGER_DAYS ago) within the last 24 hours of the moment run
  let members = Members.find(
    { "lastSeen": { $gte : parseInt(lowerRangeYesterday), $lt: parseInt(upperRangeYesterday) } },
    { fields: { "userName": 1, "userID": 1, "lastEvent": 1, "askedEmail": 1, "paymentEmail": 1, "organizationID": 1, "lastEvent": 1 } }
  ).fetch();

  console.log("Starting weMissYou for " + members.length + " members who last played " + TRIGGER_DAYS + " days ago...");

  if (members.length > 0) {
    members.forEach( (object) => {
      let organizationID = object["organizationID"];
      let eventID = object["lastEvent"];
      let userID = object["userID"];
      let userName = object["userName"];
      let askedEmail = object["askedEmail"];
      let paymentEmail = object["paymentEmail"];
      let emailAddress = paymentEmail ? paymentEmail : askedEmail;

      if (emailAddress !== undefined) {
        let notificationRecord = {
          "notificationName": "weMissYou",
          "organizationID": organizationID,
          "eventID": eventID,
          "userID": userID,
          "emailAddress": emailAddress
        };

        if (!NotificationLog.findOne(notificationRecord) ) {
          NotificationLog.insert( {
            "notificationName": "weMissYou",
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

// Add the cron to the scheduler
SyncedCron.config({ log: true, utc: true });

SyncedCron.add({
  name: "weMissYou",
  schedule(parser) {
    return parser.text('at 8:00 pm'); // This is UTC time -> 4:00pm EST
  },
  job() {
    sendEmails();
  },
});
