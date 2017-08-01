import DiscountLog from '../../../api/discountLog/discountLog';
import AccountSettings from '../../../api/accountSettings/accountSettings';


export const payoutOrganizations = () => {

  // For each organization...
  const organizations = AccountSettings.find({}).fetch();

  organizations.forEach( (organization) => {
    const organizationID = organization["organizationID"];
    const paypalPayoutID = organization["paypalPayoutID"];

    // ...find all discounts where rsvpTime is present, but payoutTime is null (meaning the discount was not paid out)...
    const discountsToPayout = DiscountLog.find({"organizationID": organizationID, "rsvpTime": {$ne: null}, "payoutTime": null }).fetch();

    // ...and put their IDs in an array...
    const discountIDs = discountsToPayout.map( (discount) => {
      return discount["_id"];
    });

    // ...and call the Meteor method "paypalPayout" to send them out to their paypalPayoutID
    Meteor.call("paypalPayout", paypalPayoutID, discountIDs, (error, response) => {
      if (error) {
        console.log(error);
      }
    });
  });
}
