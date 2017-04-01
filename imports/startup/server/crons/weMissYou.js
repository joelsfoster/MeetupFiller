import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import { weMissYou } from '../../../notifications/weMissYou';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import moment from 'moment';


let sendEmails = () => {
  let estOffset = 14400000;
  let unixDay = 86400000;
  let nowUnix = moment.utc().format("x");
  let nowEST = parseInt(nowUnix) - parseInt(estOffset);
  const TRIGGER_DAYS = 12;
  let upperRangePastEST = parseInt(nowUnix) - (parseInt(TRIGGER_DAYS) * parseInt(unixDay)) - parseInt(estOffset);
  let lowerRangePastEST = parseInt(nowUnix) - ((parseInt(TRIGGER_DAYS) + 1) * parseInt(unixDay)) - parseInt(estOffset);

  // Note: Grabs all events with a start time within the last 24 hours of the moment run
  let members = Members.find(
    { "lastSeen": { $gte : parseInt(lowerRangePastEST), $lt: parseInt(upperRangePastEST) } },
    { fields: { "userName": 1, "lastEvent": 1, "lastSeen": 1, "askedEmail": 1 } }
  ).fetch();

  members.forEach( (object) => {

    if (object["askedEmail"] !== undefined) {
      console.log("weMissYou email sent to: " + object["askedEmail"] + " for eventID: " + object["lastEvent"]);
      // weMissYou(object["askedEmail"]);
    }
  });
};

// Add the cron to the scheduler
SyncedCron.config({ log: true, utc: true });

SyncedCron.add({
  name: "weMissYou",
  schedule(parser) {
    return parser.text('at 5:30 pm'); // This is UTC time -> 3:30pm EST
  },
  job() {
    sendEmails();
  },
});
