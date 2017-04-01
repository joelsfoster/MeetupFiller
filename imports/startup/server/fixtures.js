import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { getEvents } from './crons/getEvents';
import { backfillData } from './crons/getMembers';
import Events from '../../api/events/events';
import Members from '../../api/members/members';

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
  // Events.remove({});
  // Members.remove({});
}
getEvents("playsoccer2give");
Meteor.setTimeout(backfillData, 5000);
