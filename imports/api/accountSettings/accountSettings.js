import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'; // This is a subset of the Collection2 package

// Create a new collection and export it from this file for methods to use
const AccountSettings = new Mongo.Collection('accountSettings');
export default AccountSettings;

// Opt out of using allow-deny functionality in favor of methods
AccountSettings.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

AccountSettings.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// Put all discount configuration settings here as well
AccountSettings.schema = new SimpleSchema({
  "organizationID": {
    type: String,
    label: "organizationID",
  },
  "organizationName": {
    type: String,
    label: "organizationName",
  },
  "meetupAPIKey": {
    type: String,
    label: "meetupAPIKey",
  },
  "paypalPayoutID": {
    type: String,
    label: "paypalPayoutID",
    optional: true,
  },
  "emailFrom": {
    type: String,
    label: "emailFrom",
  },
  "emailFromName": {
    type: String,
    label: "emailFromName",
  },
  "emailSignature": {
    type: String,
    label: "emailSignature",
  },
  "thankYouComeAgainMessage": {
    type: String,
    label: "thankYouComeAgainMessage",
  },
  "flatDiscountsNormal.$.originalPrice": {
    type: Number,
    decimal: true,
    label: "originalPrice",
    optional: true,
  },
  "flatDiscountsNormal.$.discountAmount": {
    type: Number,
    decimal: true,
    label: "discountAmount",
    optional: true,
  },
  "flatDiscountsBig.$.originalPrice": {
    type: Number,
    decimal: true,
    label: "originalPrice",
    optional: true,
  },
  "flatDiscountsBig.$.discountAmount": {
    type: Number,
    decimal: true,
    label: "discountAmount",
    optional: true,
  },
  "memberBeenAwayDays": {
    type: Number,
    label: "memberBeenAwayDays",
    optional: true,
  },
  "attendanceDiscountCeiling": {
    type: Number,
    decimal: true,
    label: "attendanceDiscountCeiling",
    optional: true,
  },
  "attendanceBigDiscountCeiling": {
    type: Number,
    decimal: true,
    label: "attendanceBigDiscountCeiling",
    optional: true,
  },
});

// Attach the schema to the collection so that it is applied. This is actually a Collection2 method.
AccountSettings.attachSchema(AccountSettings.schema);
