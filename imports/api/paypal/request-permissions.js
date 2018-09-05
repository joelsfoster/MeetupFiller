/*
import paypal from 'paypal-rest-sdk';
import PermissionsApi from 'paypal-permissions-sdk';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

// ***
// THIS FILE IS IN PROGRESS!! IT IS NOT COMPLETE!!
// ***

// This method calls the function that houses the promise
Meteor.methods({
  requestPermissions(organizationID) {
    check(organizationID, String);

    const root_url = Meteor.isProduction ? "https://www.meetupfiller.com/" : "http://localhost:3000/"

    let api = new PermissionsApi({
      mode: 'sandbox',
      userId: 'joelsfoster@gmail.com',
      password: 'Fred0564!',
      signature: '',
      appId: ''
    });

    // For scope values, check https://developer.paypal.com/docs/classic/api/permissions/GetPermissions_API_Operation
    let scope = ['TRANSACTION_DETAILS', 'TRANSACTION_SEARCH'];
    let returnUrl = root_url + "token";
    api.requestPermissions(scope, returnUrl, (error, response) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log(api.getGrantPermissionUrl(response.token));  // redirect url to grant permissions
      }
    });
*/
    /*
    // A function that houses a promise to handle the async nature of the response
    const callPaypal = () => {
      return new Promise((resolve, reject) => {
        paypal.webProfile.create(create_web_profile_json, function (error, web_profile) {
          if (error) {
            throw error;
          } else {
            create_payment_json.experience_profile_id = web_profile.id;

            paypal.payment.create(create_payment_json, function (error, response) {
              if (error) {
                reject(error);
              } else {
                resolve(response);
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

    */
  }
});
/*
Meteor.call('requestPermissions', '', (error, response) => {
  if (error) {
    console.log(error);
  } else {
    console.log("method called");
  }
});
*/
