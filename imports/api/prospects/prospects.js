/*
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'; // This is a subset of the Collection2 package

// Create a new collection and export it from this file for methods to use
const Prospects = new Mongo.Collection('prospects');
export default Prospects;

// Opt out of using allow-deny functionality in favor of methods
Prospects.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Prospects.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// Put all discount configuration settings here as well
Prospects.schema = new SimpleSchema({
  "organizationID": {
    type: String,
    label: "organizationID",
  },
  "organizationName": {
    type: String,
    label: "organizationName",
  },
  "organizationState": {
    type: String,
    label: "organizationState",
  },
  "organizationCity": {
    type: String,
    label: "organizationCity",
  },
  "organizationVisibility": {
    type: String,
    label: "organizationVisibility",
  },
  "qualified": {
    type: Boolean,
    label: "qualified",
    optional: true,
  },
  "categoryID": {
    type: Number,
    label: "categoryID",
  },
});

// Attach the schema to the collection so that it is applied. This is actually a Collection2 method.
Prospects.attachSchema(Prospects.schema);
*/
