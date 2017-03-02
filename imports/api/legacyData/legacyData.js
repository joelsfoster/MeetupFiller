import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';

const LegacyData = new Mongo.Collection('LegacyData');
export default LegacyData;

LegacyData.schema = new SimpleSchema({
  eventName: {
    type: String,
    label: 'The name of the event.',
  },
  eventTime: {
    type: Number,
    label: 'Time of the event since the UNIX epoch, in UTC time.',
  },
  eventDate: {
    type: String,
    label: 'Date of the event.',
  },
  legacyUserID: {
    type: Number,
    label: "The user's legacy ID.",
  },
  legacyUserName: {
    type: String,
    label: "The user's legacy username.",
  },
  legacyRequestedEmail: {
    type: String,
    label: "The user's legacy email, when it was asked of them.",
  },
  eventID: {
    type: Number,
    label: "The event's legacy ID.",
  },
  legacyPaymentEmail: {
    type: String,
    label: "The user's legacy email, when they submitted payment.",
  }
});

// How does this work??
LegacyData.attachSchema(LegacyData.schema);


// What is this???
Factory.define('document', LegacyData, {
  title: () => 'Factory Title',
  body: () => 'Factory Body',
});
