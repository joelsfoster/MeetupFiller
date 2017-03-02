import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';


if (!Meteor.isProduction) {
  const users = [{
    email: 'joelsfoster@gmail.com',
    password: 'test1234',
    /*
    organization: 'PS2G',
    profile: {
      name: { first: 'Joel', last: 'Foster' },
      legacy_id: '58124462',
      legacy_history: [{
        id: '',
        name: '',
        date: '',
        date_epoch: '',
      }],
      game_history: [{
        id: '',
        name: '',
        date: '',
        date_epoch: '',
        location: '',
        location_gps: '',
      }],
      payment_info: {},
    },
    */
    roles: ['admin'],
  }];

  users.forEach(({ email, password, /* organization, profile,*/ roles }) => {
    const userExists = Meteor.users.findOne({ 'emails.address': email });

    if (!userExists) {
      const userId = Accounts.createUser({ email, password/*, organization, profile*/ });
      Roles.addUsersToRoles(userId, roles);
    }
  });
}
