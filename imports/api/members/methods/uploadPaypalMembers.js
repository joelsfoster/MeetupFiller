import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Members from '../members';
import moment from 'moment';


Meteor.methods({
  uploadPaypalMembers(object) {
    check(object, Object);

    const data = object.data;
    data.forEach( (member) => {

      const organizationID = member["organizationID"];
      const userID = parseInt(member["userID"]);
      const paymentEmail = member["paymentEmail"];

      // If this member is found to exist, add their paymentEmail
      if (Members.findOne( {"organizationID": organizationID, "userID": userID} )) {
        Members.update( {"organizationID": organizationID, "userID": userID}, { $set: { "paymentEmail": paymentEmail } }, (error, response) => {
          if (error) {
            console.log(error);
            console.log("ERROR: Failed to add paymentEmail for " + organizationID + "/" + userID);
          }
        });

      } else { // If this member doesn't exist, shoot out a warning
        console.log("ALERT: " + organizationID + "/" + userID + " doesn't currently exist in the database, and was not added.")
      }
    });
  }
});
