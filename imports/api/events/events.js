import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'; // This is a subset of the Collection2 package

// Create a new collection and export it from this file for methods to use
const Events = new Mongo.Collection('events');
export default Events;

// Opt out of using allow-deny functionality in favor of methods
Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// Define the schema as a property of the collection
Events.schema = new SimpleSchema({
  "organizationID": {
    type: String,
    label: "organizationID",
  },
  "eventID": {
    type: Number,
    label: "eventID",
  },
  "eventName": {
    type: String,
    label: "eventName",
  },
  "eventTime": {
    type: Number,
    label: "eventTime",
  },
  "eventMemberIDs": {
    type: [ Number ],
    label: "eventMemberIDs",
    optional: true,
  },
  "eventCapacity": {
    type: Number,
    label: "eventCapacity",
    optional: true,
  },
  "eventAttendance": {
    type: Number,
    label: "eventAttendance",
    optional: true,
  },
  "eventPrice": {
    type: Number,
    label: "eventPrice",
    decimal: true,
    optional: true,
  },
});

// Attach the schema to the collection so that it is applied. This is actually a Collection2 method.
Events.attachSchema(Events.schema);
