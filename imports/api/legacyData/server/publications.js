import { Meteor } from 'meteor/meteor';
// import { check } from 'meteor/check';
import LegacyData from '../legacyData';

Meteor.publish('legacyData.list', () => LegacyData.find());


// I'm not sure I think I need the below because I could just look up the whole list instead of looping through individuals
/*
Meteor.publish('legacyEmails.view', (_id) => {
  check(_id, String);
  return Documents.find(_id);
});
*/
