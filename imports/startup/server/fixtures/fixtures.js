import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
// import LegacyData from '../../../api/legacyData/legacyData';
// import { seedConfirmation } from '../../../notifications/seedConfirmation';
// import * as jsonData from './LegacyData.json';

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

/*
// Seed legacy data
const seedLegacyData = () => {
  let jsonLength = _.size(jsonData); // This is from the lo-dash library
  console.log("Seeding " + jsonLength + " records...");
  for ( let i = 0; i < jsonLength; i++ ) {
    LegacyData.insert(jsonData[i]);
  }
};

let existingRecords = LegacyData.find();

if (!Meteor.isProduction) {
  if ( existingRecords.count() > 0 ) {
    console.log("Legacy Data already present, no seeding done. There are " + existingRecords.count() + " records in the staging DB.");
  } else {
    seedLegacyData();
    console.log("Seeding completed.");
    seedConfirmation("joelsfoster@gmail.com");
  };
};
*/
