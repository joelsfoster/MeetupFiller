import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import { thankYouComeAgain } from '../../../notifications/thankYouComeAgain';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import moment from 'moment';


let sendEmails = () => {
  let todayUnix = moment(moment().format("YYYY-MM-DD")).format("x");
  let unixDay = 86400000;
  let yesterdayUnix = parseInt(todayUnix) - parseInt(unixDay);

  let yesterdaysEvents = Events.find(
    { "eventTime": { $gte : parseInt(yesterdayUnix), $lt: parseInt(todayUnix) } },
    { fields: { "eventMemberIDs": 1 } }
  ).fetch();

  yesterdaysEvents.forEach( (object) => {
    object["eventMemberIDs"].forEach( (userID) => {
      let askedEmail = Members.findOne( { "userID": userID } )["askedEmail"];

      if (askedEmail !== undefined) {
        console.log("Test result: email would've been sent to " + askedEmail);
        // thankYouComeAgain(askedEmail); 
      }
    });
  });
};


SyncedCron.config({ log: true, utc: true });

SyncedCron.add({
  name: "thankYouComeAgain",
  schedule(parser) {
    return parser.text('at 2:00 pm'); // This is UTC time -> 10:00am EST
  },
  job() {
    sendEmails();
  },
});
