import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import { getEvents } from './getEvents';
import { backfillData } from './getMembers';
import { sendThankYouComeAgain } from './thankYouComeAgain';
import { sendLastMinuteDiscounts } from './lastMinuteDiscounts';
import { payoutOrganizations } from './payoutOrganizations';

// Schedule the crons to be run
SyncedCron.config({ log: true, utc: true });
SyncedCron.start();

SyncedCron.add({
  name: "getMembers & backfillData",
  schedule(parser) {
    return parser.text('at 3:45 am'); // This is UTC time -> 11:45pm EST
  },
  job() {
    backfillData();
  },
});

SyncedCron.add({
  name: "getEvents",
  schedule(parser) {
    return parser.text('at 3:40 am'); // This is UTC time -> 11:40pm EST
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
    return parser.text('at 3:50 am'); // This is UTC time -> 11:50pm EST
  },
  job() {
    sendThankYouComeAgain();
  },
});

SyncedCron.add({
  name: "payoutOrganizations",
  schedule(parser) {
    return parser.text('at 3:35 am'); // This is UTC time -> 11:35pm EST
  },
  job() {
    payoutOrganizations();
  },
});

SyncedCron.add({
  name: "lastMinuteDiscounts",
  schedule(parser) {
    return parser.text('at 3:55 am'); // This is UTC time -> 11:55pm EST
  },
  job() {
    sendLastMinuteDiscounts();
  },
});
