import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import { thankYouComeAgain } from '../../../notifications/thankYouComeAgain';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import moment from 'moment';


let sendEmails = () => {
  let estOffset = 14400000;
  let unixDay = 86400000;
  let nowUnix = moment.utc().format("x");
  let nowEST = parseInt(nowUnix) - parseInt(estOffset);
  let yesterdayUnix = parseInt(nowUnix) - parseInt(unixDay);
  let yesterdayEST = parseInt(yesterdayUnix) - parseInt(estOffset);

  // Note: Grabs all events with a start time within the last 24 hours of the moment run
  let yesterdaysEvents = Events.find(
    { "eventTime": { $gte : parseInt(yesterdayEST), $lt: parseInt(nowEST) } },
    { fields: { "eventName": 1, "eventTime": 1, "eventMemberIDs": 1 } }
  ).fetch();

  yesterdaysEvents.forEach( (object) => {
    object["eventMemberIDs"].forEach( (userID) => {
      let askedEmail = Members.findOne( { "userID": userID } )["askedEmail"];

      if (askedEmail !== undefined) {
        console.log("thankYouComeAgain email sent! Event: " + object["eventName"] + " --> " + askedEmail);
        // thankYouComeAgain(askedEmail);
      }
    });
  });
};

// Add the cron to the scheduler
SyncedCron.config({ log: true, utc: true });

SyncedCron.add({
  name: "thankYouComeAgain",
  schedule(parser) {
    return parser.text('at 6:00 pm'); // This is UTC time -> 4:00pm EST
  },
  job() {
    sendEmails();
  },
});
