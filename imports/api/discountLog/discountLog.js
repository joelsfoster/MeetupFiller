import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'; // This is a subset of the Collection2 package
import moment from 'moment';

// Create a new collection and export it from this file for methods to use
const DiscountLog = new Mongo.Collection('discountLog');
export default DiscountLog;

// Opt out of using allow-deny functionality in favor of methods
DiscountLog.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

DiscountLog.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// Define the schema
DiscountLog.schema = new SimpleSchema({
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
    optional: true // Will need to backfill all old null values before I can make this field required
  },
  "userID": {
    type: Number,
    label: "userID",
  },
  "originalPrice": {
    type: Number,
    decimal: true,
    label: "originalPrice",
  },
  "discountAmount": {
    type: Number,
    decimal: true,
    label: "discountAmount",
  },
  "rsvpTime": {
    type: Number,
    label: "rsvpTime",
    optional: true // Will be null until the booking happens, then we log the UNIX time so we can verify it was booked
  },
  "payoutTime": {
    type: Number,
    label: "payoutTime",
    optional: true // Will be null until the payout happens, then we log the UNIX time so we can verify it was paid out
  },
  "createdAt": {
    type: Number,
    label: "createdAt",
    autoValue: function() {
        return parseInt(moment.utc().format("x"))
    }
  }
});

// Attach the schema to the collection so that it is applied. This is actually a Collection2 method.
DiscountLog.attachSchema(DiscountLog.schema);
