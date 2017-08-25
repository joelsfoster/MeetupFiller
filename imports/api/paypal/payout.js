import paypal from 'paypal-rest-sdk';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import DiscountLog from '../discountLog/discountLog';
import AccountSettings from '../accountSettings/accountSettings';
import Members from '../members/members';
import moment from 'moment';

// This method calls the function that houses the promise
Meteor.methods({
  paypalPayout(paypalPayoutID, discountIDs) {
    check(paypalPayoutID, String);
    check(discountIDs, [String]);

    if (Meteor.isProduction) {
      const sender_batch_id = Math.random().toString(36).substring(9); // Must be unique so generating a random number
      const sampleDiscount = DiscountLog.findOne({"_id": discountIDs[0]});
      const organizationID = sampleDiscount["organizationID"];

      const amountToPayoutArray = discountIDs.map( (_id) => {
        const discountLog = DiscountLog.findOne({"_id": _id});
        const originalPrice = discountLog["originalPrice"].toFixed(2);
        const discountAmount = discountLog["discountAmount"].toFixed(2);
        const discountedPrice = (originalPrice - discountAmount).toFixed(2);
        const paypalFee = ((discountedPrice * .029) + .30).toFixed(2); // Paypal's 2.9% + $0.30 fee
        const meetupFillerFee = (discountedPrice * .18).toFixed(2); // 18% fee
        const amountToPayout = (discountedPrice - paypalFee - meetupFillerFee).toFixed(2);

        return amountToPayout;
      });

      const amountToPayoutTotal = amountToPayoutArray.reduce( (sum, value) => parseFloat(sum) + parseFloat(value), 0).toFixed(2);

      const create_payout_json = {
          "sender_batch_header": {
              "sender_batch_id": sender_batch_id,
              "email_subject": "Here's the money MeetupFiller made you this week!",
          },
          "items": [
              {
                  "recipient_type": "EMAIL",
                  "amount": {
                      "value": amountToPayoutTotal,
                      "currency": "USD"
                  },
                  "receiver": paypalPayoutID,
                  "note": "Check your email for a breakdown of the RSVPs made via MeetupFiller this week",
                  "sender_item_id": "MeetupFiller"
              }
          ]
      };

      // A function that houses a promise to handle the async nature of the response
      const callPaypal = () => {
        return new Promise((resolve, reject) => {
          paypal.payout.create(create_payout_json, function (error, payout) {
            if (error) {
              console.log(error.response);
              reject(error);
            } else {
              console.log("Payout for " + organizationID + " completed!");
              resolve(payout);
            }
          });
        });
      };

      // A function to mark the discount as paid, so we don't pay it twice
      const logPayoutTime = () => {
        discountIDs.forEach( (_id) => {
          DiscountLog.update( {"_id": _id}, { $set: { "payoutTime": moment.utc().format("x") } }, (error, response) => {
            if (error) {
              console.log(error);
            }
          });
        });
      }

      // Run the promise that executes the payment
      return callPaypal()
      .then((response) => {
        return response;
      })
      .then(logPayoutTime)
      .catch((error) => {
        throw new Meteor.Error('500', error);
      });
    } else {
      console.log("WARNING! paypalPayout is not allowed to run outside of Production!");
    }
  }
});
