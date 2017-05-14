import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../../startup/server/environment-variables';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

// This method calls the function that houses the promise
Meteor.methods({
  postMeetupRsvp(organizationID, eventID, userID, rsvpStatus) {
    check(organizationID, String);
    check(eventID, Number);
    check(userID, Number);
    check(rsvpStatus, String);

    const url = "https://api.meetup.com/2/rsvp?event_id=" + eventID + "&agree_to_refund=true&member_id=" + userID + "&rsvp=" + rsvpStatus + "&key=" + MEETUP_API_KEY; // API version 2
    // api version 2: "https://api.meetup.com/2/rsvp?event_id=239885114&agree_to_refund=true&member_id=58124462&rsvp=yes&key=282a2c7858483325b5b6c5510422e5b";
    // 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '/members/' + userID + '/rsvps?&sign=true&photo-host=public&response=yes&key=' + MEETUP_API_KEY;
    // https://api.meetup.com/playsoccer2give/events/239885114/members/58124462/rsvps?&sign=true&photo-host=public&response=yes&key=282a2c7858483325b5b6c5510422e5b

    HTTP.call( 'POST', url, {}, function( error, response ) {
      if ( error ) {
        console.log( error );
        return error;
      } else {
        return response;
      }
    });
  }
});
