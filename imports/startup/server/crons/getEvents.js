import { HTTP } from 'meteor/http';
import Events from '../../../api/events/events';
import AccountSettings from '../../../api/accountSettings/accountSettings';


export const getEvents = (organizationID, meetupAPIKey) => {
  const MAX_SCRAPES = 200; // Meetup's max is 200. If this number exceeds count of games today, it will continue into the past. If you want to try implementing "scroll", this is the <moment.js> format required: "YYYY-MM-DDTHH:mm:ss.0Z"
  const url = 'https://api.meetup.com/' + organizationID + '/events?&sign=true&photo-host=public&page=' + MAX_SCRAPES + '&desc=true&status=past&offset=0&omit=fee.accepts,fee.currency,fee.description,fee.label,fee.required,manual_attendance_count,created,duration,id,status,updated,utc_offset,rsvp_open_offset,waitlist_count,venue,group,description,how_to_find_us,visibility&key=' + meetupAPIKey;
  // https://api.meetup.com/playsoccer2give/events?&sign=true&photo-host=public&page=200&desc=true&status=past&offset=0&omit=fee.accepts,fee.currency,fee.description,fee.label,fee.required,manual_attendance_count,created,duration,id,status,updated,utc_offset,rsvp_open_offset,waitlist_count,venue,group,description,how_to_find_us,visibility&key=

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
        const eventName = object["name"];
        const eventTime = parseInt(object["time"]);
        const eventAttendance = object["yes_rsvp_count"] ? parseInt(object["yes_rsvp_count"]) : 0;
        const eventCapacity = object["rsvp_limit"] ? parseInt(object["rsvp_limit"]) : eventAttendance; // If no capacity, use attendance
        const eventPrice = (object["fee"] && object["fee"]["amount"]) ? parseFloat(object["fee"]["amount"]).toFixed(2) : 0;

        // ...and add each event to the database if it doesn't already exist
        if (!Events.findOne({"organizationID": organizationID, "eventID": eventID})) {
          Events.insert({
            "organizationID": organizationID,
            "eventID": eventID,
            "eventName": eventName,
            "eventTime": eventTime,
            "eventAttendance": eventAttendance,
            "eventCapacity": eventCapacity,
            "eventPrice": eventPrice
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
