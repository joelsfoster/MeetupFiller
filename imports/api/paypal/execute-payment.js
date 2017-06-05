import paypal from 'paypal-rest-sdk';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import DiscountLog from '../discountLog/discountLog';
import AccountSettings from '../accountSettings/accountSettings';
import Events from '../events/events';

// This method calls the function that houses the promise
Meteor.methods({
  executePaypalPayment(_id, payerID, paymentID) {
    check(_id, String);
    check(payerID, String);
    check(paymentID, String);

    // Set the parameters for the code below
    const discountRecord = DiscountLog.findOne({"_id": _id});

    if (discountRecord) {
      const price = (discountRecord["originalPrice"] - discountRecord["discountAmount"]).toFixed(2);

      // Create the payment execution object
      const execute_payment_json = {
        "payer_id": payerID,
        "transactions": [{
          "amount": {
            "currency": "USD",
            "total": price.toString()
          }
        }]
      };

      // A function that houses a promise to handle the async nature of the response
      const callPaypal = () => {
        return new Promise((resolve, reject) => {
          paypal.payment.execute(paymentID, execute_payment_json, function (error, payment) {
            if (error) {
              console.log(error.response);
              reject(error);
            } else {
              resolve(payment);
            }
          });
        });
      };

      // Run the promise that executes the payment
      return callPaypal()
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new Meteor.Error('500', error);
      });
    } else {
      console.log("There is no record of discount " + _id);
    }
  }
});
