import { Meteor } from 'meteor/meteor';

if (!Meteor.isProduction) {
  process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;
}

export const MEETUP_API_KEY = Meteor.settings.private.MEETUP_API_KEY;
