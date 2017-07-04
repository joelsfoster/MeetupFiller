import paypal from 'paypal-rest-sdk';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import DiscountLog from '../discountLog/discountLog';
import AccountSettings from '../accountSettings/accountSettings';
import Members from '../members/members';
import moment from 'moment';

// This method calls the function that houses the promise
Meteor.methods({
  paypalPayout(_id) {
    check(_id, String);

    if (Meteor.isProduction) {
      const sender_batch_id = Math.random().toString(36).substring(9); // Must be unique so generating a random number
      const discountLog = DiscountLog.findOne({"_id": _id});
      const organizationID = discountLog["organizationID"];
      const eventID = discountLog["eventID"];
      const eventName = discountLog["eventName"];
      const userID = discountLog["userID"];
      const userName = Members.findOne({"organizationID": organizationID, "userID": userID})["userName"];
      const originalPrice = discountLog["originalPrice"].toFixed(2);
      const discountAmount = discountLog["discountAmount"].toFixed(2);
      const finalPrice = originalPrice - discountAmount;
      const paypalFee = (finalPrice * .029 + .3).toFixed(2);
      const amountToPayout = finalPrice - paypalFee;
      const paypalPayoutID = AccountSettings.findOne({"organizationID": organizationID})["paypalPayoutID"];

      const create_payout_json = {
          "sender_batch_header": {
              "sender_batch_id": sender_batch_id,
              "email_subject": "Payment for " + eventName,
          },
          "items": [
              {
                  "recipient_type": "EMAIL",
                  "amount": {
                      "value": amountToPayout.toFixed(2),
                      "currency": "USD"
                  },
                  "receiver": paypalPayoutID,
                  "note": eventName + " | originalPrice:$" + originalPrice + " discountAmount:$" + discountAmount + " paypalFee:$" + paypalFee,
                  "sender_item_id": "eventID:" + eventID + " userID:" + userID + " userName:" + userName
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
              console.log("Paid out $" + amountToPayout.toFixed(2) + " ($" + finalPrice.toFixed(2) + ") for " + organizationID + "/" + eventID + " userID:" + userID + " (_id:" + _id + ")");
              resolve(payout);
            }
          });
        });
      };

      const logPayoutTime = () => {
        DiscountLog.update( {"_id": _id}, { $set: { "payoutTime": moment.utc().format("x") } }, (error, response) => {
          if (error) {
            console.log(error);
          } else {
            console.log(_id + " was paid out successfully.");
          }
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
