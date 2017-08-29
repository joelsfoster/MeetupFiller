import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import { runGetEvents } from './getEvents';
import { runGetMembers } from './getMembers';
import { sendThankYouComeAgain } from './thankYouComeAgain';
import { logLastMinuteDiscounts } from './logLastMinuteDiscounts';
import { payoutOrganizations } from './payoutOrganizations';
import { sendLastMinuteDiscounts } from './sendLastMinuteDiscounts';
import { sendWeeklyRecap } from './weeklyRecap';


// Schedule the crons to be run
SyncedCron.config({ log: true, utc: true });
SyncedCron.start();

SyncedCron.add({
  name: "getEvents",
  schedule(parser) {
    return parser.text('at 3:40 am'); // This is UTC time -> 11:40pm EST
  },
  job() {
    runGetEvents();
  },
});

SyncedCron.add({
  name: "getMembers",
  schedule(parser) {
    return parser.text('at 3:45 am'); // This is UTC time -> 11:45pm EST
  },
  job() {
    runGetMembers();
  },
});

SyncedCron.add({
  name: "thankYouComeAgain",
  schedule(parser) {
    return parser.text('at 3:48 am'); // This is UTC time -> 11:48pm EST
  },
  job() {
    sendThankYouComeAgain();
  },
});

SyncedCron.add({
  name: "logLastMinuteDiscounts",
  schedule(parser) {
    return parser.text('at 3:51 am'); // This is UTC time -> 11:51pm EST
  },
  job() {
    logLastMinuteDiscounts();
  },
});

SyncedCron.add({
  name: "sendLastMinuteDiscounts",
  schedule(parser) {
    return parser.text('at 3:54 am'); // This is UTC time -> 11:54pm EST
  },
  job() {
    sendLastMinuteDiscounts();
  },
});

SyncedCron.add({
  name: "payoutOrganizations",
  schedule(parser) {
    return parser.text('at 3:56 am on Sun'); // This is UTC time -> 11:56pm EST
  },
  job() {
    payoutOrganizations();
  },
});

SyncedCron.add({
  name: "weeklyRecap",
  schedule(parser) {
    return parser.text('at 3:58 am on Sun'); // This is UTC time -> 11:58pm EST
  },
  job() {
    sendWeeklyRecap();
  },
});
