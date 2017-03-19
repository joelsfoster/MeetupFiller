import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import './getTodaysEventLinks';
import './getMembers';
import './thankYouComeAgain';
import './backfillData.js';


SyncedCron.config({ log: true, utc: true });

SyncedCron.start();
