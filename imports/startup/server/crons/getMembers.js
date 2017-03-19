import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../environment-variables';
import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import moment from 'moment';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';


// Get all the members from a specific event that a specific organization hosted
const getMembers = (organizationID, eventID) => {
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
        let askedEmail = "";
        if (object["answers"] !== undefined) { // Will return error "cannot read [0] of undefined" if no answer was asked in this event
          let askedEmail = object["answers"][0]["answer"];
        }

        // Format and define each record using the raw data above
        let record = {
          "organizationID": organizationID,
          "userID": userID,
          "userName": userName,
          "askedEmail": askedEmail,
        };

        // Log the member as having attended this event if not already logged
        let logAttendance = () => {
          if (!Events.findOne( { "organizationID": organizationID, "eventID": eventID, "eventMemberIDs": { $in: [ userID ] } } )) {
            Events.update( { "organizationID": organizationID, "eventID": eventID }, { $addToSet: { eventMemberIDs: userID } }, (error, response) => {
              if (error) {
                console.log(error);
              } else {
                console.log(organizationID + ":\"" + record["userName"] + "\" was logged as having attended eventID:" + eventID);
              }
            });
          } else {
            console.log("Error: " + record["userName"] + " already was logged as having attended eventID:" + eventID);
          }
        };

        // Add the member to the database if he/she doesn't already exist, then log their attendance whether or not they were just added
        if (!Members.findOne( { "organizationID": organizationID, "userID": userID } )) {
          Members.insert(record, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(organizationID + ":\"" + record["userName"] + "\" has been added to the Members collection as _id:" + response);
              logAttendance();
            }
          });
        } else {
          logAttendance();
        };

      });
    };
  });
};

// Specify a range of dates to run the getMembers function on
let scrapeSince = (date) => { // Must be in format "YYYY-MM-DD"
  let startDate = moment(date).format("x");
  let unixDay = 86400000;
  let endOfStartDateUnix = parseInt(startDate) + parseInt(unixDay);

  let eventArray = Events.find(
    { "eventTime": { $gte : parseInt(startDate), $lt: parseInt(endOfStartDateUnix) }},
    { fields: { "organizationID": 1, "eventID": 1 }}
  ).fetch();

  // Impose a delay on the looping API calls so as not to get throttled
  let api_counter = 0;

  eventArray.forEach((object) => {
    let delayedFunction = () => {
      getMembers(object["organizationID"], object["eventID"]);
    };

    api_counter += 1;
    Meteor.setTimeout(delayedFunction, 1000 * api_counter);
  });
};

// Schedule the cron to run
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

// Expose this function for use elsewhere, such as in the backfillData cron
export default getMembers;
