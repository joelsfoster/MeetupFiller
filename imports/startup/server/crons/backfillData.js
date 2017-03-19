import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import Events from '../../../api/events/events';
import getMembers from './getMembers';


let backfillData = () => {

  let eventArray = Events.find(
    { "eventMemberIDs": null },
    { fields: { "organizationID": 1, "eventID": 1 }}
  ).fetch();

  let api_counter = 0;

  eventArray.forEach((object) => {
    let delayedFunction = () => {
      getMembers(object["organizationID"], object["eventID"]);
    };

    api_counter += 1;
    Meteor.setTimeout(delayedFunction, 1000 * api_counter);
  });
}


SyncedCron.add({
  name: "backfillData",
  schedule(parser) {
    return parser.text('at 7:30 am'); // This is UTC time -> 3:30am EST
  },
  job() {
    backfillData();
  },
});
