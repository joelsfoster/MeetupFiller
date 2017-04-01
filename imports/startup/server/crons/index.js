import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import './getEvents';
import './getMembers';
import './thankYouComeAgain';
import './weMissYou';

// Schedule the crons to be run
SyncedCron.config({ log: true, utc: true });
SyncedCron.start();
