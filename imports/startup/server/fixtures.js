import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { getEvents } from './crons/getEvents';
import { backfillData } from './crons/getMembers';
import Events from '../../api/events/events';
import Members from '../../api/members/members';
import NotificationLog from '../../api/notificationLog/notificationLog';
import AccountSettings from '../../api/accountSettings/accountSettings';
import DiscountLog from '../../api/discountLog/discountLog';


// Seed admin user
const users = [{
  email: 'joelsfoster@gmail.com',
  password: 'admin1234',
  profile: {
    name: { first: 'Joel', last: 'Foster' },
  },
  roles: ['admin'],
}];

users.forEach(({ email, password, profile, roles }) => {
  const userExists = Meteor.users.findOne({ 'emails.address': email });

  if (!userExists) {
    const userId = Accounts.createUser({ email, password, profile });
    Roles.addUsersToRoles(userId, roles);
  }
});


// Seed AccountSettings if not already present
if (!AccountSettings.findOne({"organizationID": "playsoccer2give"})) {
  AccountSettings.insert({
    "organizationID": "playsoccer2give",
    "organizationName": "Play Soccer 2 Give",
  }, (error, response) => {
    if (error) {
      console.log(error)
    } else {
      console.log("Play Soccer 2 Give was seeded to the db");
    }
  });
}


// Seed baseline discount settings and paypalPayoutID
if (AccountSettings.findOne( {"organizationID": "playsoccer2give", "flatDiscountsNormal": undefined})) {
  console.log("Seeding baseline discount settings and paypalPayoutID for playsoccer2give...");

  AccountSettings.update( {"organizationID": "playsoccer2give"}, { $set: {"paypalPayoutID": "danny@playsoccer2give.com"} }, (error, response) => {
    if (error) { console.log(error) } else { console.log(AccountSettings.findOne({"organizationID": "playsoccer2give"})) }
  });

  let flatDiscountsNormalArray = [
      { "originalPrice": 18, "discountAmount": 2 },
      { "originalPrice": 15, "discountAmount": 2 },
      { "originalPrice": 12, "discountAmount": 2 },
      { "originalPrice": 10, "discountAmount": 1 },
      { "originalPrice": 8, "discountAmount": 1 },
      { "originalPrice": 7, "discountAmount": 1 },
      { "originalPrice": 6, "discountAmount": 1 },
      { "originalPrice": 5, "discountAmount": 1 },
  ]

  let flatDiscountsBigArray = [
      { "originalPrice": 18, "discountAmount": 6 },
      { "originalPrice": 15, "discountAmount": 5 },
      { "originalPrice": 12, "discountAmount": 4 },
      { "originalPrice": 10, "discountAmount": 3 },
      { "originalPrice": 8, "discountAmount": 2 },
      { "originalPrice": 7, "discountAmount": 2 },
      { "originalPrice": 6, "discountAmount": 1 },
      { "originalPrice": 5, "discountAmount": 1 },
  ]

  flatDiscountsNormalArray.forEach( (object) => {
    let discount = { "flatDiscountsNormal": object, }

    AccountSettings.update( {"organizationID": "playsoccer2give"}, { $addToSet: discount }, (error, response) => {
      if (error) { console.log(error) }
    });
  });

  flatDiscountsBigArray.forEach( (object) => {
    let discount = { "flatDiscountsBig": object, }

    AccountSettings.update( {"organizationID": "playsoccer2give"}, { $addToSet: discount }, (error, response) => {
      if (error) { console.log(error) }
    });
  });
}


// Clear data then re-seed upon staging and localdev startup
if (!Meteor.isProduction) {

  const clearData = () => {
    Events.remove({});
    Members.remove({});
    NotificationLog.remove({});
    DiscountLog.remove({});
  }

  const seedData = () => {
    getEvents("playsoccer2give");
    Meteor.setTimeout(backfillData, 5000);
  }

  const reset = () => {
    clearData();
    Meteor.setTimeout(seedData, 3000);
  }

  // reset();
}

/*
// Seed a test discount for Joel Foster
const record = {
  "organizationID": "playsoccer2give",
  "eventID": 240774722,
  "eventName": "Monday 8pm Tron Ball - Night Soccer @ LIC (7v7 game) for PS2G",
  "userID": 58124462,
  "originalPrice": 6.00,
  "discountAmount": 1.00,
}

if (!DiscountLog.findOne({record})) {
  DiscountLog.insert(record, (error, response) => { });
}
*/
// console.log(DiscountLog.find({}).fetch());
