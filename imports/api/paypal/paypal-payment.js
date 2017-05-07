import paypal from 'paypal-rest-sdk';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { DiscountLog } from '../discountLog/discountLog';
import { AccountSettings } from '../accountSettings/accountSettings';
import { Events } from '../events/events';

// Set the parameters for the code below. Replace this with variable parameters later.
const PASSED_FROM_URL = "";
// const discountRecord = DiscountLog.findOne({"_id": PASSED_FROM_URL});
const profile_name = Math.random().toString(36).substring(7); // Name needs to be unique so just generating a random one
const price = 1; // parseInt(discountRecord["originalPrice"]) - parseInt(discountRecord["discountAmount"]); // full dollars only until I fix it
const organizationID = "playsoccer2give"; // discountRecord["organizationID"];
const organizationName = "Play Soccer 2 Give"; // AccountSettings.findOne({"organizationID": organizationID})["organizationName"];
const eventID = 239520355; // discountRecord["eventID"];
const eventName = "Wednesday game 545pm CO-ED Soccer @ LIC (7v7 game) for PS2G"; // Events.findOne({"eventID": eventID, "organizationID": organizationID})["eventName"];
const gameURL = "https://www.meetup.com/" + organizationID + "/events/" + eventID;

// Create the display profile of the Paypal portal
const create_web_profile_json = {
    "name": profile_name,
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
        "bank_txn_pending_url": "https://www.meetup.com/" // What is this?
    }
};

// Configure the payment that will be in the Paypal portal
const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": gameURL,
        "cancel_url": gameURL
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": eventName,
                "sku": gameURL,
                "price": price.toString() + ".00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": price.toString() + ".00"
        },
        "description": eventName
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
            reject(error); // This passes to the .catch() method below.
          } else {
            resolve(payment); // This passed to the .then() method below.
          }
        });
      }
    });
  });
};

// This method calls the function that houses the promise
Meteor.methods({
  generatePaypalPortal(params) {
    check(params, {
      /*
      spicy: Boolean,
      protein: String,
      guacamole: Boolean,
      orderSize: Number,
      */
    });

    return callPaypal()
    .then((response) => {
      return response["links"][1]["href"]; // Accessible via the response argument on the Meteor.call callback
    })
    .catch((error) => {
      throw new Meteor.Error('500', error); // Accessible via the error argument on the Meteor.call callback
    });
  }
});
