import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import LegacyData from '../../../api/legacyData/legacyData';
import * as jsonData from './LegacyData.json';

const users = [{
  email: 'joelsfoster@gmail.com',
  password: 'admin1234',
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
    const userId = Accounts.createUser({ email, password /*, organization, profile */ });
    Roles.addUsersToRoles(userId, roles);
  }
});

// <--------------------------------------------------->
// Seed legacy data fixture

const seedLegacyData = () => {
  let jsonLength = _.size(jsonData);
  console.log("Seeding " + jsonLength + " records...");
  for ( let i = 0; i < jsonLength; i++ ) {
    LegacyData.insert(jsonData[i]);
  }
};

let existingRecords = LegacyData.find();

if ( existingRecords.count() > 0) {
  console.log("Legacy Data already present, no seeding done.");
} else {
  seedLegacyData();
  console.log("Seeding completed.");
};
