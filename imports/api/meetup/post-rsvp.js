import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import AccountSettings from '../accountSettings/accountSettings';
import DiscountLog from '../discountLog/discountLog';
import moment from 'moment';


Meteor.methods({
  postMeetupRsvp(organizationID, eventID, userID, rsvpStatus) {
    check(organizationID, String);
    check(eventID, Number);
    check(userID, Number);
    check(rsvpStatus, String);

    const organization = AccountSettings.findOne({"organizationID": organizationID});
    const meetupAPIKey = organization["meetupAPIKey"];
    const get_url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '?&sign=true&photo-host=public&page=10&fields=rsvp_rules&omit=created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset,rsvp_rules.open_time,rsvp_rules.guest_limit,rsvp_rules.waitlisting,rsvp_rules.refund_policy&key=' + meetupAPIKey;
    // https://api.meetup.com/playsoccer2give/events/241159577?&sign=true&photo-host=public&page=10&fields=rsvp_rules&omit=created,duration,fee.accepts,fee.currency,fee.description,fee.label,fee.required,id,updated,utc_offset,description,how_to_find_us,visibility,group,venue,rsvp_open_offset,rsvp_rules.open_time,rsvp_rules.guest_limit,rsvp_rules.waitlisting,rsvp_rules.refund_policy&key=

    // First, get an up-to-date status report on the game
    const getMeetupData = () => {
      return new Promise((resolve, reject) => {
        HTTP.call('GET', get_url, {}, (error, response) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            const data = response.data;
            resolve(data);
          }
        });
      });
    };

    return getMeetupData()
    .then((data) => {

      // If the game is in the past, throw an error
      if (data["time"] > moment.utc().format("x")) {

        // If the game's RSVPs are closed, throw an error
        if (data["rsvp_rules"]["closed"] !== true) {

          // If the event is full, throw an error
          if (data["yes_rsvp_count"] < data["rsvp_limit"]) {

            const discountRecord = DiscountLog.findOne({"organizationID": organizationID, "eventID": eventID, "userID": userID});

            // If the member has already completed booking, throw an error
            if (!discountRecord["rsvpTime"]) {

              // api version 2:
              const post_url = "https://api.meetup.com/2/rsvp?event_id=" + eventID + "&agree_to_refund=true&member_id=" + userID + "&rsvp=" + rsvpStatus + "&key=" + meetupAPIKey; // API version 2
              // https://api.meetup.com/2/rsvp?event_id=239885114&agree_to_refund=true&member_id=58124462&rsvp=yes&key=282a2c7858483325b5b6c5510422e5b;

              // If the event is valid, mark the member as attending.
              HTTP.call('POST', post_url, {}, (error) => {
                if ( error ) {
                  console.log( error );
                  throw new Meteor.Error('500', error);
                } else {
                  return;
                }
              });
            } else {
              throw new Meteor.Error("rsvped-already", "Member already finalized RSVPing (" + organizationID + "/" + eventID + " - userID:" + userID + ")");
            }
          } else {
            throw new Meteor.Error("event-full", "Event full, unable to RSVP (" + organizationID + "/" + eventID + " - userID:" + userID + ")");
          }
        } else {
          throw new Meteor.Error("rsvp-closed", "Event RSVP closed (" + organizationID + "/" + eventID + " - userID:" + userID + ")");
        }
      } else {
        throw new Meteor.Error("past-event", "Event is in the past (" + organizationID + "/" + eventID + " - userID:" + userID + ")");
      }
    })
  }
});
