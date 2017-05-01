import paypal from 'paypal-rest-sdk';
import AccountSettings from '../api/accountSettings/accountSettings';

//Name needs to be unique so just generating a random one
const profile_name = Math.random().toString(36).substring(7);
const price = 1; // full dollars only until I fix it
const organizationID = AccountSettings.findOne({"organizationID": "playsoccer2give"})["organizationID"];
const organizationLogo = "https://a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg"
const eventName = "Wednesday game 545pm CO-ED Soccer @ LIC (7v7 game) for PS2G";
const eventID = 239520355;
const gameURL = "https://www.meetup.com/" + organizationID + "/events/" + eventID;


const create_web_profile_json = {
    "name": profile_name,
    "presentation": {
        "brand_name": organizationID,
        "logo_image": organizationLogo,
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

export const handlePayment = paypal.webProfile.create(create_web_profile_json, function (error, web_profile) {
    if (error) {
        throw error;
    } else {
        create_payment_json.experience_profile_id = web_profile.id;

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
            }
        });
    }
});
