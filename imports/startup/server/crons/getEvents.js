import { HTTP } from 'meteor/http';
import Events from '../../../api/events/events';
import AccountSettings from '../../../api/accountSettings/accountSettings';


const getEvents = (organizationID, meetupAPIKey) => {
  const MAX_SCRAPES = 200; // Meetup's max is 200. If this number exceeds count of games today, it will continue into the past. If you want to try implementing "scroll", this is the <moment.js> format required: "YYYY-MM-DDTHH:mm:ss.0Z"
  const url = 'https://api.meetup.com/' + organizationID + '/events?&sign=true&photo-host=public&page=' + MAX_SCRAPES + '&desc=true&status=past&offset=0&omit=manual_attendance_count,created,duration,fee,id,rsvp_limit,status,updated,utc_offset,waitlist_count,yes_rsvp_count,venue,group,description,how_to_find_us,visibility&key=' + meetupAPIKey;
  // https://api.meetup.com/playsoccer2give/events?&sign=true&photo-host=public&page=200&desc=true&status=past&offset=0&omit=manual_attendance_count,created,duration,fee,id,rsvp_limit,status,updated,utc_offset,waitlist_count,yes_rsvp_count,venue,group,description,how_to_find_us,visibility&key=

  // ...grab the past 200 events...
  HTTP.call( 'GET', url, {}, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      const data = response.data;

      data.forEach( (object) => {

        const eventURL = object["link"];
        const eventURLSplitArray = eventURL.split("/");
        const eventID = parseInt(eventURLSplitArray[5]); // Example URL: https://www.meetup.com/PlaySoccer2Give/events/241664470/

        // ...and add each event to the database if it doesn't already exist
        if (!Events.findOne({"organizationID": organizationID, "eventID": eventID})) {
          Events.insert({
            "organizationID": organizationID,
            "eventID": eventID,
            "eventName": object["name"],
            "eventTime": parseInt(object["time"])
          }, (error, response) => {
            if (error) {
              console.log(error)
            } else {
              console.log("Event: " + organizationID + "/" + eventID + " has been added to the Events collection");
            }
          });
        };
      });
    };
  });
};


// Grabs all events for each account in AccountSettings. This is what the cron uses.
// Important because the getEvents function can be used to get a one-time pull of any organization it's passed, so long as the API key passed to it can read that organization
export const runGetEvents = () => {
  const organizations = AccountSettings.find().fetch();

  organizations.forEach( (organization) => {
    const organizationID = organization["organizationID"];
    const meetupAPIKey = organization["meetupAPIKey"];
    getEvents(organizationID, meetupAPIKey);
  });
}
