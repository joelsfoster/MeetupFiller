import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import AccountSettings from '../accountSettings/accountSettings';
import DiscountLog from '../discountLog/discountLog';
import Members from '../members/members';
import moment from 'moment';


Meteor.methods({
  finalizeMemberMeetupRsvp(organizationID, eventID, userID) {
    check(organizationID, String);
    check(eventID, Number);
    check(userID, Number);

    const organization = AccountSettings.findOne({"organizationID": organizationID});
    const meetupAPIKey = organization["meetupAPIKey"];

    const get_url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '?&sign=true&photo-host=public&page=10&fields=rsvp_rules&omit=created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset,rsvp_rules.open_time,rsvp_rules.guest_limit,rsvp_rules.waitlisting,rsvp_rules.refund_policy&key=' + meetupAPIKey;
    // https://api.meetup.com/playsoccer2give/events/241159577?&sign=true&photo-host=public&page=10&fields=rsvp_rules&omit=created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset,rsvp_rules.open_time,rsvp_rules.guest_limit,rsvp_rules.waitlisting,rsvp_rules.refund_policy&key=282a2c7858483325b5b6c5510422e5b

    // First, get the eventTime from that future event so that we can log a future "lastSeen" date for the member, preventing extra discount emails
    HTTP.call( 'GET', get_url, {}, function( error, response ) {
      if ( error ) {
        console.log( error );
        throw new Meteor.Error('500', error);
      } else {
        const data = response.data;
        const eventTime = data["time"];

        const url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '/rsvps?&sign=true&response=yes&photo-host=public&omit=created,updated,response,guests,event,member.bio,member.photo,group,member.role,member.event_context,member.title,venue,answers.question_id,answers.updated,answers.question&key=' + meetupAPIKey;
        // https://api.meetup.com/playsoccer2give/events/240219167/rsvps?&sign=true&response=yes&photo-host=public&omit=created,updated,response,guests,event,member.bio,member.photo,group,member.role,member.event_context,member.title,venue,answers.question_id,answers.updated,answers.question&key=

        // Then, look through each member in the event until you find the member that's been RSVP'd
        HTTP.call( 'GET', url, {}, function( error, response ) {
          if ( error ) {
            console.log( error );
            throw new Meteor.Error('500', error);
          } else {
            const data = response.data;

            data.forEach( (object) => {
              if (object["member"]["id"] === userID) {

                // If the member is found to be on the event, log their rsvpTime (thus preventing automatic timed removal)...
                DiscountLog.update( {"organizationID": organizationID, "eventID": eventID, "userID": userID}, { $set: { "rsvpTime": moment.utc().format("x") } }, (error, response) => {
                  if (error) {
                    console.log(error);
                    throw new Meteor.Error('500', error);
                  } else {

                    // ...and update their latest "lastSeen" date so that they don't get any discounts between now and that game
                    Members.update( {"organizationID": organizationID, "userID": userID}, { $set: { "lastEvent": eventID, "lastSeen": eventTime } }, (error, response) => {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log("userID:" + userID + " successfully RSVP'd for eventID:" + eventID + "!");
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});
