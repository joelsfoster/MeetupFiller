import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import DiscountLog from '../discountLog';


// Meteor.publish('discountLog.list', () => DiscountLog.find());

Meteor.publish('getDiscountID', (_id) => {
  check(_id, String);
  return DiscountLog.find(_id);
});
