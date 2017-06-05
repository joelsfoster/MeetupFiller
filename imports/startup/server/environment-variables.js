import { Meteor } from 'meteor/meteor';
import paypal from 'paypal-rest-sdk';


if (!Meteor.isProduction) {
  process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;
}

paypal.configure({
  'mode': Meteor.settings.private.PayPal.mode,
  'client_id': Meteor.settings.private.PayPal.client_id,
  'client_secret': Meteor.settings.private.PayPal.client_secret,
  'headers' : {
      'custom': 'customHeader'
  }
});

export const MEETUP_API_KEY = Meteor.settings.private.MEETUP_API_KEY;


// Will have to re-architect this when the app supports other groups
