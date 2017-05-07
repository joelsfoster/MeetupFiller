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

// CHANGE THIS TO JUST HOLD THE PAYOUT ADDRESS INSTEAD OF PAYPAL IDS 
AccountSettings.schema = new SimpleSchema({
  "organizationID": {
    type: String,
    label: "organizationID",
  },
  "organizationName": {
    type: String,
    label: "organizationName",
  },
  "payPalClientID": {
    type: String,
    label: "payPalClientID",
  },
  "payPalClientSecret": {
    type: String,
    label: "payPalClientSecret",
  },
});

// Attach the schema to the collection so that it is applied. This is actually a Collection2 method.
AccountSettings.attachSchema(AccountSettings.schema);
