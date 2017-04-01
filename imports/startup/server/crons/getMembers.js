import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../environment-variables';
import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import moment from 'moment';

// Get all the members from a specific event that a specific organization hosted and log it in the DB
const getMembers = (organizationID, eventID) => {
  const url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '/rsvps?&sign=true&response=yes&photo-host=public&fields=answers&omit=created,updated,response,guests,event,member.bio,member.photo,group,member.role,member.event_context,member.title,venue,answers.question_id,answers.updated,answers.question&key=' + MEETUP_API_KEY;
  // https://api.meetup.com/playsoccer2give/events/238454295/rsvps?&sign=true&response=yes&photo-host=public&fields=answers&omit=created,updated,response,guests,event,member.bio,member.photo,group,member.role,member.event_context,member.title,venue,answers.question_id,answers.updated,answers.question&key=

  HTTP.call( 'GET', url, {}, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      const data = response.data;
      console.log("getMembers GET for " + organizationID + "/" + eventID + ": Success!");

      data.forEach( (object) => {
        const userID = parseInt(object["member"]["id"]);
        const userName = object["member"]["name"].trim(); // If we don't .trim(), records that have whitespace will duplicate on insert
        const askedEmail = object["answers"] ? object["answers"][0]["answer"].split(" ")[0] : undefined; // If we don't .split(" ")[0], records with whitespace will not be valid emails
        let event = { "organizationID": organizationID, "eventID": eventID };
        let eventTime = Events.findOne( event )["eventTime"];

        // Format and define each uniquely identifiable record using the raw data above (note that "dateAdded" and "askedEmail" are defined below, so as not to accidentally create duplicate records)
        const record = {
          "organizationID": organizationID,
          "userID": userID,
          "userName": userName
        };

        // Log the member as having attended this event if not already logged, and update the member's lastSeen date
        const logAttendance = () => {
          let eventHasMembers = Events.findOne( { "organizationID": organizationID, "eventID": eventID, "eventMemberIDs": { $in: [ userID ] } } );

          if (!eventHasMembers) {
            Events.update( event, { $addToSet: { eventMemberIDs: userID } }, (error, response) => {
              if (error) {
                console.log(error);
              }
            });

            if (eventTime > Members.findOne( record )["lastSeen"]) {
              Members.update( record, { $set: { "lastEvent": eventID, "lastSeen": eventTime } }, (error, response) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log(organizationID + ":\"" + userName + "\" was last seen at eventID --> " + eventID + ":" + eventTime);
                }
              });
            }

          } else {
            console.log("Error: " + userName + " already was logged as having attended eventID:" + eventID);
          }
        };

        // If the member doesn't exist, add them to the DB and log their attendance
        if (!Members.findOne( record )) {
          Members.insert( {
            "organizationID": organizationID,
            "userID": userID,
            "userName": userName,
            "askedEmail": askedEmail,
            "dateAdded": moment.utc().format("x"),
            "lastEvent": eventID,
            "lastSeen": eventTime
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log("New member added --> " + organizationID + ":\"" + userName + "\"");
              logAttendance();
            }
          });

        } else { // If member exists, log their attendance, then update their email address if it was previously blank

          logAttendance();

          let emailGiven = !(askedEmail === "" || askedEmail === undefined);
          let noEmailOnRecord = !Members.findOne( record )["askedEmail"];

          if (noEmailOnRecord && emailGiven) {
            Members.update( record, { $set: { "askedEmail": askedEmail } }, (error, response) => {
              if (error) {
                console.log(error);
              } else {
                console.log(organizationID + ":\"" + userName + "\" has a new email address: " + Members.findOne(record)["askedEmail"]);
              }
            });
          };

        };
      });
    };
  });
};

// This function gathers all events that don't have players logged as having attended them, and runs getMembers on them
export const backfillData = () => {
  const eventArray = Events.find(
    { "eventMemberIDs": undefined }, // Will have to put smarter logic around this in the future!!
    { fields: { "organizationID": 1, "eventID": 1 }}
  ).fetch();

  let api_counter = 0;

  eventArray.forEach((object) => {
    const delayedFunction = () => {
      getMembers(object["organizationID"], object["eventID"]);
    };

    api_counter += 1;
    Meteor.setTimeout(delayedFunction, 1000 * api_counter);
  });
}

// Add the cron to the scheduler
SyncedCron.add({
  name: "getMembers & backfillData",
  schedule(parser) {
    return parser.text('at 3:50 am'); // This ('at 3:50 am') is UTC time -> 11:50pm EST
  },
  job() {
    backfillData();
  },
});
