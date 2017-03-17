import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import { thankYouComeAgain } from '../../../notifications/thankYouComeAgain';


/*
SyncedCron.config({ log: true, utc: true });

SyncedCron.add({
  name: "Send members who played yesterday a re-book notification.",
  schedule(parser) {
    // return parser.text('every 2 mins');
    return parser.text('at 2:00 pm'); // This is UTC time -> 10:00am EST
  },
  job() {
    let recipients = ["joelsfoster@gmail.com"]; // Add the list of emails here
    recipients.forEach( (recipient) => {
      thankYouComeAgain(recipient);
    });
  },
});

SyncedCron.start();
*/


// let timeStamp = moment(unixTimeStamp).format("YYYY-MM-DD");
// let todaysDate = moment().format("YYYY-MM-DD");
// if (timeStamp === todaysDate) then...
