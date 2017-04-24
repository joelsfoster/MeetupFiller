import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../environment-variables';
import Events from '../../../api/events/events';

// Capture the past 200 events hosted by this organization and log it in the DB
export const getEvents = (organizationID) => {
  const MAX_SCRAPES = 200; // Meetup's max is 200. If this number exceeds count of games today, it will continue into the past. If you want to try implementing "scroll", this is the <moment.js> format required: "YYYY-MM-DDTHH:mm:ss.0Z"
  const url = 'https://api.meetup.com/' + organizationID + '/events?&sign=true&photo-host=public&page=' + MAX_SCRAPES + '&desc=true&status=past&offset=0&omit=manual_attendance_count,created,duration,fee,id,rsvp_limit,status,updated,utc_offset,waitlist_count,yes_rsvp_count,venue,group,description,how_to_find_us,visibility&key=' + MEETUP_API_KEY;
  // https://api.meetup.com/playsoccer2give/events?&sign=true&photo-host=public&page=200&desc=true&status=past&offset=0&omit=manual_attendance_count,created,duration,fee,id,rsvp_limit,status,updated,utc_offset,waitlist_count,yes_rsvp_count,venue,group,description,how_to_find_us,visibility&key=282a2c7858483325b5b6c5510422e5b

  HTTP.call( 'GET', url, {}, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      const data = response.data;

      data.forEach( (object) => {
        const record = {
          "organizationID": organizationID,
          "eventID": parseInt(object["link"].slice(46, 55)), // Update this when we start scraping other websites!!
          "eventName": object["name"],
          "eventTime": parseInt(object["time"])
        };

        // Add the event to the database if it doesn't already exist
        if (!Events.findOne(record)) {
          Events.insert(record, (error, response) => {
            if (error) {
              console.log(error)
            } else {
              console.log("Event: " + organizationID + "/" + record["eventID"] + " has been added to the Events collection");
            }
          });
        };
      });
    };
  });
};
