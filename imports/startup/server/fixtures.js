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

// Seed additional settings for PS2G
if (AccountSettings.findOne( {"organizationID": "playsoccer2give", "memberBeenAwayDays": undefined})) {
  console.log("Seeding additional AccountSettings for playsoccer2give...");

  AccountSettings.update( {"organizationID": "playsoccer2give"}, { $set: {
    "memberBeenAwayDays": 19,
    "attendanceDiscountCeiling": .70,
    "attendanceBigDiscountCeiling": .50,
  } }, (error, response) => {
    if (error) { console.log(error) } else { console.log(response) }
  });
}

// Seed email message settings for PS2G
if (AccountSettings.findOne( {"organizationID": "playsoccer2give", "emailFrom": undefined})) {
  console.log("Seeding email message settings for playsoccer2give...");

  AccountSettings.update( {"organizationID": "playsoccer2give"}, { $set: {
    "emailFrom": "caleb@ps2g.org",
    "emailFromName": "Caleb Olson",
    "emailSignature": "<br />PS2G<br /><i><a href='https://www.playsoccer2give.com'>Local Games for Global Change</a></i><br /><br /><p><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'></p>",
    "thankYouComeAgainMessage": "<p>Hi there,</p><p>If you loved the high-quality soccer, great community, and knowing that your money is going to charity, why not come back?</p><p>We want to see you again! <a href='https://www.meetup.com/PlaySoccer2Give/events/?utm_source=thankYouComeAgain&utm_medium=email'>RSVP for next week</a> right now so that you don't lose out on your favorite time slot--visit <a href='https://www.meetup.com/PlaySoccer2Give/events/?utm_source=thankYouComeAgain&utm_medium=email'>our calendar page</a> to see what's still available. See you on the field!</p>",
  } }, (error, response) => {
    if (error) { console.log(error) } else { console.log(AccountSettings.findOne({"organizationID": "playsoccer2give"})) }
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
    getEvents();
    Meteor.setTimeout(backfillData, 5000);
  }

  const reset = () => {
    clearData();
    Meteor.setTimeout(seedData, 3000);
  }

  // reset();
}
