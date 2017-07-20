import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import DiscountLog from '../discountLog/discountLog';
import AccountSettings from '../accountSettings/accountSettings';


Meteor.methods({
  postMeetupRsvpPayment(organizationID, eventID, userID) {
    check(organizationID, String);
    check(eventID, Number);
    check(userID, Number);

    const organization = AccountSettings.findOne({"organizationID": organizationID});
    const meetupAPIKey = organization["meetupAPIKey"];
    const discountRecord = DiscountLog.findOne({"organizationID": organizationID, "eventID": eventID, "userID": userID});
    const price = discountRecord["originalPrice"].toFixed(2) - discountRecord["discountAmount"].toFixed(2);

    // If there is indeed a discount for this combination of organizationID, eventID, and userID...
    if (discountRecord) {
      const url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '/payments?amount=' + price.toFixed(2) + '&member=' + userID + '&key=' + meetupAPIKey;

      // ...post their payment on that Meetup event.
      HTTP.call( 'POST', url, {}, function( error, response ) {
        if ( error ) {
          console.log( error );
          return error;
        } else {
          return response;
        }
      });
    } else {
      throw error
    }
  }
});
