import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import Members from '../../members/members';
import moment from 'moment';


Meteor.methods({
  snoozeMember(organizationID, userID, snoozeType) {
    check(organizationID, String);
    check(userID, Number);
    check(snoozeType, String);

    const member = Members.findOne({"organizationID": organizationID, "userID": userID});
    const unixDay = 86400000;
    const nowUnix = moment.utc().format("x");
    const weekUnix = parseInt(nowUnix) + (parseInt(unixDay) * 7);
    const monthUnix = parseInt(nowUnix) + (parseInt(unixDay) * 30);
    const foreverUnix = 9000000000000; // 03/14/2255 @ 4:00pm UTC

    // Define snooze time periods that are passed as URL params
    if(snoozeType == "1week") {
      Members.update( {"organizationID": organizationID, "userID": userID}, { $set: { "snoozeUntil": weekUnix } }, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log("userID:" + userID + "/" + organizationID + " snoozed discounts for a week");
        }
      });

    } else if (snoozeType == "1month") {
      Members.update( {"organizationID": organizationID, "userID": userID}, { $set: { "snoozeUntil": monthUnix } }, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log("userID:" + userID + "/" + organizationID + " snoozed discounts for a month");
        }
      });

    } else if (snoozeType == "forever") {
      Members.update( {"organizationID": organizationID, "userID": userID}, { $set: { "snoozeUntil": foreverUnix } }, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log("userID:" + userID + "/" + organizationID + " snoozed discounts forever");
        }
      });

    } else {
      throw console.log("ERROR: User attempted to snooze for an unspecified time period");
    }
  }
});
