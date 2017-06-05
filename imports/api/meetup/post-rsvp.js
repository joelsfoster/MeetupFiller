import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../../startup/server/environment-variables';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';


Meteor.methods({
  postMeetupRsvp(organizationID, eventID, userID, rsvpStatus) {
    check(organizationID, String);
    check(eventID, Number);
    check(userID, Number);
    check(rsvpStatus, String);

    const get_url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '?&sign=true&photo-host=public&page=10&omit=created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=' + MEETUP_API_KEY;
    // https://api.meetup.com/playsoccer2give/events/240395923?&sign=true&photo-host=public&page=10&omit=created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset&key=282a2c7858483325b5b6c5510422e5b

    // First, get an up-to-date status report on the game
    HTTP.call( 'GET', get_url, {}, function( error, response ) {
      if ( error ) {
        console.log( error );
        throw error;
      } else {
        const data = response.data;

        // If the game is in the past, throw an error
        if (data["time"] > moment.utc().format("x")) {

          // If the event is full, throw an error
          if (data["yes_rsvp_count"] < data["rsvp_limit"]) {

            // api version 2:
            const post_url = "https://api.meetup.com/2/rsvp?event_id=" + eventID + "&agree_to_refund=true&member_id=" + userID + "&rsvp=" + rsvpStatus + "&key=" + MEETUP_API_KEY; // API version 2
            // https://api.meetup.com/2/rsvp?event_id=239885114&agree_to_refund=true&member_id=58124462&rsvp=yes&key=282a2c7858483325b5b6c5510422e5b;

            // If the event is valid, mark the member as attending (other mechanisms may mark them as not attending based on certain triggers)
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
        } else {
          console.log("ERROR: Event is in the past");
          throw error;
        }
      }
    });
  }
});
