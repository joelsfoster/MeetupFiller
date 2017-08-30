import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import AccountSettings from '../../../api/accountSettings/accountSettings';
import Events from '../../../api/events/events';
import Members from '../../../api/members/members';
import moment from 'moment';
import findEmailsInString from 'find-emails-in-string';


export const getMembers = (organizationID, meetupAPIKey) => {

  // Find all unscraped events in this organization.
  const unscrapedEvents = Events.find({ "organizationID": organizationID, "eventMemberIDs": undefined }).fetch();
  let api_counter = 0;

  // For each unscraped event...
  unscrapedEvents.forEach( (event) => {
    const eventID = event["eventID"];
    const delayedFunction = () => {

      const url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '/rsvps?&sign=true&response=yes&photo-host=public&fields=answers&omit=created,updated,response,guests,event,member.bio,member.photo,group,member.role,member.event_context,member.title,venue,answers.question_id,answers.updated,answers.question&key=' + meetupAPIKey;
      // https://api.meetup.com/playsoccer2give/events/238454295/rsvps?&sign=true&response=yes&photo-host=public&fields=answers&omit=created,updated,response,guests,event,member.bio,member.photo,group,member.role,member.event_context,member.title,venue,answers.question_id,answers.updated,answers.question&key=

      // PART 1
      // ...make an API call to get the members.
      HTTP.call( 'GET', url, {}, function( error, response ) {
        if ( error ) {
          console.log( error );
        } else {
          const data = response.data;
          console.log("getMembers GET for " + organizationID + "/" + eventID + ": Success!");

          // Define what the event was and what time it was held, for use elsewhere in this function
          const event = { "organizationID": organizationID, "eventID": eventID };
          const eventTime = Events.findOne( event )["eventTime"];

          // Loop through each member that attended this event
          data.forEach( (member) => {
            const userID = parseInt(member["member"]["id"]);
            const userName = member["member"]["name"].trim(); // If we don't .trim(), records that have whitespace at the ends will duplicate on insert

            // First check if there was an email given. Then clean up any "\n" separations.
            const askedEmailCheck = member["answers"] ? member["answers"][0]["answer"] : undefined; // If answer exists, use answer
            const askedEmailArray = askedEmailCheck ? askedEmailCheck.split("\n") : undefined; // Split text according to "\n"
            const askedEmailString = askedEmailArray ? askedEmailArray.join(" ").toLowerCase() : undefined; // Replace "\n" with " " and make the whole email lowercase
            const askedEmail = askedEmailString ? findEmailsInString(askedEmailString)[0] : undefined; // Now we can extract the email

            // PART 3 (used below, inside part 2)
            // Log the member as having attended this event if not already logged, and update the member's lastSeen date. This function is called below.
            const logAttendance = () => {
              const memberAttendedEvent = Events.findOne( { "organizationID": organizationID, "eventID": eventID, "eventMemberIDs": { $in: [ userID ] } } );

              if (!memberAttendedEvent) {
                Events.update( event, { $addToSet: { eventMemberIDs: userID } }, (error, response) => {
                  if (error) {
                    console.log(error);
                  }
                });

                if (eventTime > Members.findOne( {"organizationID": organizationID, "userID": userID} )["lastSeen"]) {
                  Members.update( {"organizationID": organizationID, "userID": userID}, { $set: { "lastEvent": eventID, "lastSeen": eventTime } }, (error, response) => {
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

            // PART 2
            // If the member doesn't exist, add them to the DB and log their attendance
            if (!Members.findOne( {"organizationID": organizationID, "userID": userID} )) {
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
              let noEmailOnRecord = !Members.findOne( {"organizationID": organizationID, "userID": userID} )["askedEmail"];

              if (noEmailOnRecord && emailGiven) {
                Members.update( {"organizationID": organizationID, "userID": userID}, { $set: { "askedEmail": askedEmail } }, (error, response) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(organizationID + ":\"" + userName + "\" has a new email address: " + Members.findOne({"organizationID": organizationID, "userID": userID})["askedEmail"]);
                  }
                });
              };
            };
          });
        };
      });
    };

    // We put a timed delay here because Meetup throttles API calls if it gets too many too quickly
    api_counter += 1;
    const MILLISECONDS_BETWEEN_CALLS = 550; // Keeping it at a little more than 1 call a second
    Meteor.setTimeout(delayedFunction, MILLISECONDS_BETWEEN_CALLS * api_counter);
  });
};


// For each organization in AccountSettings, grab all the members for any "empty" events. This is what the cron uses.
// Important because the getMembers function can be used to get a one-time pull of any organization it's passed, so long as the API key passed to it can read that organization
export const runGetMembers = () => {
  const organizations = AccountSettings.find().fetch();

  organizations.forEach( (organization) => {
    const organizationID = organization["organizationID"];
    const meetupAPIKey = organization["meetupAPIKey"];
    getMembers(organizationID, meetupAPIKey);
  });
};
