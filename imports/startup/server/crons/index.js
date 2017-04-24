import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import { getEvents } from './getEvents';
import { backfillData } from './getMembers';
import { sendThankYouComeAgain } from './thankYouComeAgain';
import { sendWeMissYou } from './weMissYou';

// Schedule the crons to be run
SyncedCron.config({ log: true, utc: true });
SyncedCron.start();

SyncedCron.add({
  name: "getMembers & backfillData",
  schedule(parser) {
    return parser.text('at 3:50 am'); // This ('at 3:50 am') is UTC time -> 11:50pm EST
  },
  job() {
    backfillData();
  },
});

SyncedCron.add({
  name: "getEvents",
  schedule(parser) {
    return parser.text('at 3:45 am'); // This is UTC time -> 11:40pm EST
  },
  job() {
    let organizations = [ "playsoccer2give" ]; // Change this to include all organizations to pull data from. Note that we have to account for eventID parsing and new API keys when this happens!!
    organizations.forEach( (organization) => {
      getEvents(organization);
    });
  },
});

SyncedCron.add({
  name: "thankYouComeAgain",
  schedule(parser) {
    return parser.text('at 3:55 am'); // This is UTC time -> 11:55pm EST
  },
  job() {
    sendThankYouComeAgain();
  },
});

SyncedCron.add({
  name: "weMissYou",
  schedule(parser) {
    return parser.text('at 8:00 pm'); // This is UTC time -> 4:00pm EST
  },
  job() {
    sendWeMissYou();
  },
});


// When I make a lastMinuteOpenings notification:
// The HTTP call should be made when the cron runs, once per organizationID.
// After making the call, logic runs to see if there is at least one game in the next 24 hours that has at least one opening.
// If true, then send out the basic email to all users who are not already in those games.
