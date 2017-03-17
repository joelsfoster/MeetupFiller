import Meteor from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../environment-variables';
import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import moment from 'moment';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';


let getMembers = (organizationID, eventID) => {
  let url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '/rsvps?&sign=true&response=yes&photo-host=public&fields=answers&omit=created,updated,response,guests,event,member.bio,member.photo,group,member.role,member.event_context,member.title,venue,answers.question_id,answers.updated,answers.question&key=' + MEETUP_API_KEY;

  HTTP.call( 'GET', url, {}, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      let data = response.data;
      console.log("getMembers GET for " + organizationID + "/" + eventID + ": Success!");

      data.forEach( (object) => {
        let userID = parseInt(object["member"]["id"]);
        let userName = object["member"]["name"];
        let askedEmail = object["answers"][0]["answer"]; // Does this work for all permutations of data returned???
        let record = {
          "organizationID": organizationID,
          "userID": userID,
          "userName": userName,
          "askedEmail": askedEmail,
        };

        // Add the member to the database if he/she doesn't already exist
        if (!Members.findOne( { "organizationID": organizationID, "userID": userID } )) {
          Members.insert(record, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(organizationID + ":\"" + record["userName"] + "\" has been added to the Members collection as _id:" + response);
            }
          });
        };

        // Log the member as having attended this event if not already logged
        Events.update(record["_id"], { $addToSet: {eventMemberIDs: userID} }, (error, response) => {
          if (error) {
            console.log(error);
          } else {
            if (response !== 0) {
              console.log(organizationID + ":\"" + record["userName"] + "\" was logged as having attended eventID:" + eventID);
            }
          }
        });
      });
    };
  });
};


let scrapeSince = (date) => { // Must be in format "YYYY-MM-DD"
  let startDate = moment(date).format("x");
  let unixDay = 86400000;
  let endOfStartDateUnix = parseInt(startDate) + parseInt(unixDay);

  let eventArray = Events.find(
    { "eventTime": { $gte : parseInt(startDate), $lt: parseInt(endOfStartDateUnix) }},
    { fields: { "organizationID": 1, "eventID": 1 }}
  ).fetch();

  eventArray.forEach((object) => {
    getMembers(object["organizationID"], object["eventID"]);
  });
};


SyncedCron.config({ log: true, utc: true });

SyncedCron.add({
  name: "getMembers",
  schedule(parser) {
    return parser.text('at 3:45 am'); // This is UTC time -> 11:45pm EST
  },
  job() {
    let date = moment().format("YYYY-MM-DD"); // WARNING: Only scrape one day at a time or else the API will be throttled!!!
    scrapeSince(date);
  },
});
