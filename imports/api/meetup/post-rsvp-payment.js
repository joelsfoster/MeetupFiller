import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../../startup/server/environment-variables';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import DiscountLog from '../discountLog/discountLog';


Meteor.methods({
  postMeetupRsvpPayment(organizationID, eventID, userID) {
    check(organizationID, String);
    check(eventID, Number);
    check(userID, Number);

    const discountRecord = DiscountLog.findOne({"organizationID": organizationID, "eventID": eventID, "userID": userID});
    const price = discountRecord["originalPrice"].toFixed(2) - discountRecord["discountAmount"].toFixed(2);

    if (discountRecord) {
      const url = 'https://api.meetup.com/' + organizationID + '/events/' + eventID + '/payments?amount=' + price.toFixed(2) + '&member=' + userID + '&key=' + MEETUP_API_KEY;

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
