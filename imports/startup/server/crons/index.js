import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import './getTodaysEventLinks';
import './getMembers';
import './thankYouComeAgain';

SyncedCron.start();
