import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { getEvents } from './crons/getEvents';
import { backfillData } from './crons/getMembers';
import Events from '../../api/events/events';
import Members from '../../api/members/members';
import NotificationLog from '../../api/notificationLog/notificationLog';

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

// Seed on startup
if (!Meteor.isProduction) {

  const clearData = () => {
    Events.remove({});
    Members.remove({});
    NotificationLog.remove({});
  }

  const seedData = () => {
    getEvents("playsoccer2give");
    Meteor.setTimeout(backfillData, 3000);
  }

  const reset = () => {
    clearData();
    Meteor.setTimeout(seedData, 3000);
  }

  // reset();
}
