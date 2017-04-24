import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'; // This is a subset of the Collection2 package

// Create a new collection and export it from this file for methods to use
const NotificationLog = new Mongo.Collection('notificationLog');
export default NotificationLog;

// Opt out of using allow-deny functionality in favor of methods
NotificationLog.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

NotificationLog.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// Define the schema as a property of the collection
NotificationLog.schema = new SimpleSchema({
  "notificationName": {
    type: String,
    label: "notificationName",
  },
  "notificationTime": {
    type: Number,
    label: "notificationTime",
  },
  "organizationID": {
    type: String,
    label: "organizationID",
  },
  "eventID": {
    type: Number,
    label: "eventID",
    optional: true,
  },
  "userID": {
    type: Number,
    label: "userID",
  },
  "userName": {
    type: String,
    label: "userName",
  },
  "emailAddress": {
    type: String,
    label: "emailAddress",
  }
});

// Attach the schema to the collection so that it is applied. This is actually a Collection2 method.
NotificationLog.attachSchema(NotificationLog.schema);
