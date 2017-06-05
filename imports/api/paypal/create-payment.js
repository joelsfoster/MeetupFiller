import paypal from 'paypal-rest-sdk';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import DiscountLog from '../discountLog/discountLog';
import AccountSettings from '../accountSettings/accountSettings';
import Events from '../events/events';

// This method calls the function that houses the promise
Meteor.methods({
  generatePaypalPortal(_id) {
    check(_id, String);

    // Set the parameters for the code below
    const discountRecord = DiscountLog.findOne({"_id": _id});

    if (discountRecord) {
      const profile_name = Math.random().toString(36).substring(7); // Name needs to be unique so just generating a random one
      const price = (discountRecord["originalPrice"] - discountRecord["discountAmount"]).toFixed(2);
      const organizationID = discountRecord["organizationID"];
      const organizationName = AccountSettings.findOne({"organizationID": organizationID})["organizationName"];
      const eventID = discountRecord["eventID"];
      const eventName = discountRecord["eventName"];
      const event_url = "https://www.meetup.com/" + organizationID + "/events/" + eventID + "/";
      const userID = discountRecord["userID"];

      // Create the display profile of the Paypal portal
      const create_web_profile_json = {
          "name": profile_name,
          "temporary": true,
          "presentation": {
              "brand_name": organizationName,
              // "logo_image": organizationLogo,
              "locale_code": "US"
          },
          "input_fields": {
              "allow_note": false,
              "no_shipping": 1,
              "address_override": 1
          },
          "flow_config": {
              "landing_page_type": "billing",
              "bank_txn_pending_url": "https://www.meetup.com/"
          }
      };

      const root_url = Meteor.isProduction ? "https://www.meetupfiller.com/" : "http://localhost:3000/"

      // Configure the payment that will be in the Paypal portal
      const create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": root_url + "rsvp-payment-success/" + _id,
              "cancel_url": root_url + "rsvp-payment-canceled" + _id
          },
          "transactions": [{
              "item_list": {
                  "items": [{
                      "name": eventName + " (userID=" + userID + ")",
                      "sku": event_url,
                      "price": price.toString(),
                      "currency": "USD",
                      "quantity": 1
                  }]
              },
              "amount": {
                  "currency": "USD",
                  "total": price.toString()
              },
              "description": eventName + " (userID=" + userID + ")"
          }]
      };

      // A function that houses a promise to handle the async nature of the response
      const callPaypal = () => {
        return new Promise((resolve, reject) => {
          paypal.webProfile.create(create_web_profile_json, function (error, web_profile) {
            if (error) {
              throw error;
            } else {
              create_payment_json.experience_profile_id = web_profile.id;

              paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                  reject(error);
                } else {
                  resolve(payment);
                }
              });
            }
          });
        });
      };

      return callPaypal()
      .then((response) => {
        return response["links"][1]["href"];
      })
      .catch((error) => {
        throw new Meteor.Error('500', error);
      });
    } else {
      console.log("There is no record of discount " + _id);
    }
  }
});
