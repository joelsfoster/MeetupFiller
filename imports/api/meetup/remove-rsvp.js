import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import DiscountLog from '../discountLog/discountLog';


Meteor.methods({
  timedRemoveMeetupRsvp(organizationID, eventID, userID) {
    check(organizationID, String);
    check(eventID, Number);
    check(userID, Number);

    const rsvpStatus = "no";
    const DELAY_MINUTES = 20; // This is based off what Meetup specifies
    const delayMilliseconds = (DELAY_MINUTES * 60 * 1000);

    // Allow this function to be run after a delay
    const delayedFunction = () => {
      const discountRecord = DiscountLog.findOne( { "organizationID": organizationID, "eventID": eventID, "userID": userID } );

      // If the discountRecord does not have an rsvpTime stamp...
      if (discountRecord["rsvpTime"] === undefined) {
        // ...remove that user's RSVP (since it was presumably already set to "yes" when they navigated to PayPal)
        Meteor.call('postMeetupRsvp', organizationID, eventID, userID, rsvpStatus, (error, response) => {
          if (error) {
            console.warn(error.reason);
          } else {
            console.log("User: " + userID + " removed from " + organizationID + ":" + eventID + " because of " + DELAY_MINUTES + " minute PayPal timeout.");
          }
        });
      }
    }

    // Run the delayed query 
    Meteor.setTimeout(delayedFunction, delayMilliseconds);

  }
});
