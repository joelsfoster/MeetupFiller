import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import './getEvents';
import './getMembers';
import './thankYouComeAgain';
import './weMissYou';

// Schedule the crons to be run
SyncedCron.config({ log: true, utc: true });
SyncedCron.start();

// When I make a lastMinuteOpenings notification:
// The HTTP call should be made when the cron runs, once per organizationID.
// After making the call, logic runs to see if there is at least one game in the next 24 hours that has at least one opening.
// If true, then send out the basic email to all users who are not already in those games.
