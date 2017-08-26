import Members from '../../../api/members/members';
import DiscountLog from '../../../api/discountLog/discountLog';
import AccountSettings from '../../../api/accountSettings/accountSettings';
import NotificationLog from '../../../api/notificationLog/notificationLog';
import { lastMinuteDiscounts } from '../../../api/notifications/lastMinuteDiscounts';
import moment from 'moment';


export const sendLastMinuteDiscounts = () => {
  const accountOrganizationIDs = AccountSettings.find({}, {fields: {"_id": 0, "organizationID": 1} }).fetch();

  // For each organization,...
  accountOrganizationIDs.forEach( (accountOrganizationID) => {

    const organizationID = accountOrganizationID["organizationID"];
    const unixDay = 86400000;
    const nowUnix = parseInt(moment.utc().format("x"));
    const yesterdayUnix = parseInt(nowUnix) - parseInt(unixDay);
    console.log("Sending discounts for members in organizationID:" + organizationID +"...");

    // ...find all members in that organization who have an email address and are not snoozed/unsubscribed.
    const members = Members.find({
      "organizationID": organizationID,
      "snoozeUntil": { $not: { $gte: parseInt(nowUnix) } }, // $not also returns undefined values
      $or: [ { "askedEmail": { $ne: "" || undefined } }, { "paymentEmail": { $ne: "" || undefined } } ]
    }).fetch(); // Refactor to first find recent new discounts and what members they belong to, to prevent going through the whole userbase

    // Then, for each member, find all their discounts in the DiscountLog that were created in the last 24 hours.
    members.forEach( (member) => {
      const userID = member["userID"];
      const userName = member["userName"];
      const askedEmail = (member["askedEmail"] && member["askedEmail"] !== "") ? member["askedEmail"] : undefined;
      const paymentEmail = (member["paymentEmail"] && member["paymentEmail"] !== "") ? member["paymentEmail"] : undefined;
      const emailAddress = askedEmail ? askedEmail : paymentEmail;
      const discountsToSend = DiscountLog.find({ "createdAt": {$gte: yesterdayUnix}, "organizationID": organizationID, "userID": userID }).fetch();

      // If a member has at least one discount to recieve from this organization...
      if (discountsToSend.length > 0) {

        // ...and the emailAddress is valid...
        if (emailAddress && emailAddress !== "") {

          const eventIDs = discountsToSend.map( (discount) => {
             return discount["eventID"];
          });

          // ...log it in NotificationLog and send out the discounts, all bundled into a single email.
          NotificationLog.insert( {
            "notificationName": "lastMinuteDiscounts",
            "notificationTime": parseInt(moment.utc().format("x")),
            "organizationID": organizationID,
            "eventID": eventIDs,
            "userID": userID,
            "userName": userName,
            "emailAddress": emailAddress
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {

              const discountIDs = eventIDs.map( (eventID) => {
                return DiscountLog.findOne({"organizationID": organizationID, "eventID": eventID, "userID": userID})["_id"];
              });

              lastMinuteDiscounts(emailAddress, discountIDs);
            }
          });
        }
      }
    });
  });
}
