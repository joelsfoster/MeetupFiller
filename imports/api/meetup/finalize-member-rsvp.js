import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../../startup/server/environment-variables';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import DiscountLog from '../discountLog/discountLog';
import moment from 'moment';


Meteor.methods({
  finalizeMemberMeetupRsvp(organizationID, eventID, userID) {
    check(organizationID, String);
    check(eventID, Number);
    check(userID, Number);

    const url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '/rsvps?&sign=true&response=yes&photo-host=public&omit=created,updated,response,guests,event,member.bio,member.photo,group,member.role,member.event_context,member.title,venue,answers.question_id,answers.updated,answers.question&key=' + MEETUP_API_KEY;
    // https://api.meetup.com/playsoccer2give/events/240219167/rsvps?&sign=true&response=yes&photo-host=public&omit=created,updated,response,guests,event,member.bio,member.photo,group,member.role,member.event_context,member.title,venue,answers.question_id,answers.updated,answers.question&key=

    HTTP.call( 'GET', url, {}, function( error, response ) {
      if ( error ) {
        console.log( error );
        return error;
      } else {
        const data = response.data;

        data.forEach( (object) => {
          if (object["member"]["id"] === userID) {

            // If the member is found to be on the event, log their rsvpTime (thus preventing automatic timed removal)
            DiscountLog.update( {"organizationID": organizationID, "eventID": eventID, "userID": userID}, { $set: { "rsvpTime": moment.utc().format("x") } }, (error, response) => {
              if (error) {
                console.log(error);
              };
            });
          }
        });
      }
    });
  }
});
