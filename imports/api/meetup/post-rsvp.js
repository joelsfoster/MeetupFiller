import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../../startup/server/environment-variables';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';


Meteor.methods({
  postMeetupRsvp(organizationID, eventID, userID, rsvpStatus) {
    check(organizationID, String);
    check(eventID, Number);
    check(userID, Number);
    check(rsvpStatus, String);

    const get_url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '?&sign=true&photo-host=public&page=10&omit=created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=' + MEETUP_API_KEY;
    // https://api.meetup.com/playsoccer2give/events/240395923?&sign=true&photo-host=public&page=10&omit=created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=282a2c7858483325b5b6c5510422e5b

    HTTP.call( 'GET', get_url, {}, function( error, response ) {
      if ( error ) {
        console.log( error );
        throw error;
      } else {
        const data = response.data;

        if (data["yes_rsvp_count"] < data["rsvp_limit"]) {

          // api version 2:
          const post_url = "https://api.meetup.com/2/rsvp?event_id=" + eventID + "&agree_to_refund=true&member_id=" + userID + "&rsvp=" + rsvpStatus + "&key=" + MEETUP_API_KEY; // API version 2
          // https://api.meetup.com/2/rsvp?event_id=239885114&agree_to_refund=true&member_id=58124462&rsvp=yes&key=282a2c7858483325b5b6c5510422e5b;

          HTTP.call( 'POST', post_url, {}, function( error, response ) {
            if ( error ) {
              console.log( error );
              throw error;
            } else {
              return response;
            }
          });
        } else {
          console.log("ERROR: Event full, unable to RSVP");
          throw error;
        }
      }
    });
  }
});
