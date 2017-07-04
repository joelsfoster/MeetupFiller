import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'; // This is a subset of the Collection2 package

// Create a new collection and export it from this file for methods to use
const Members = new Mongo.Collection('members');
export default Members;

// Opt out of using allow-deny functionality in favor of methods
Members.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Members.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// Define the schema as a property of the collection
Members.schema = new SimpleSchema({
  "organizationID": {
    type: String,
    label: "organizationID",
  },
  "userID": {
    type: Number,
    label: "userID",
  },
  "userName": {
    type: String,
    label: "userName",
  },
  "dateAdded": {
    type: Number,
    label: "dateAdded",
  },
  "askedEmail": {
    type: String,
    label: "askedEmail",
    optional: true,
  },
  "paymentEmail": {
    type: String,
    label: "paymentEmail",
    optional: true,
  },
  "lastEvent": {
    type: Number,
    label: "lastEvent",
  },
  "lastSeen": {
    type: Number,
    label: "lastSeen",
  },
  "discountUnsubUntil": {
    type: Number,
    label: "discountUnsubUntil",
    optional: true,
  },
});

// Attach the schema to the collection so that it is applied. This is actually a Collection2 method.
Members.attachSchema(Members.schema);
