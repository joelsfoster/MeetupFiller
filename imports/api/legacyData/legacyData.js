import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'; // This is a subset of the Collection2 package
import { Factory } from 'meteor/dburles:factory';

// Create a new collection and export it from this file for methods to use
const LegacyData = new Mongo.Collection('legacyData');
export default LegacyData;

// Opt out of using allow-deny functionality in favor of methods
LegacyData.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

LegacyData.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// Define the schema as a property of the collection
LegacyData.schema = new SimpleSchema({
  eventID: {
    type: Number,
    label: "Unique ID and URL tag.",
  },
  eventName: {
    type: String,
    label: 'Describes the event.',
  },
  eventTime: {
    type: Number,
    label: 'UNIX time, in UTC time.',
  },
  eventDate: {
    type: String,
    label: 'Date in M/D/YY format.',
  },
  legacyUserID: {
    type: Number,
    label: 'Unique ID.',
  },
  legacyUserName: {
    type: String,
    label: 'Display name in legacy UI.',
  },
  legacyGivenEmail: {
    type: String,
    label: 'Value given when asked upon booking.',
    optional: true,
  },
  legacyPaymentEmail: {
    type: String,
    label: 'Value associated with payment method.',
    optional: true,
  }
});

// Attach the schema to the collection so that it is applied. This is actually a Collection2 method.
LegacyData.attachSchema(LegacyData.schema);
