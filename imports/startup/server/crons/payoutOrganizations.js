import DiscountLog from '../../../api/discountLog/discountLog';


export const payoutOrganizations = () => {

  // Find all discounts where rsvpTime is present, but payoutTime is null (meaning the discount was not paid out)
  const discountsToPayout = DiscountLog.find({"rsvpTime": {$ne: null}, "payoutTime": null }).fetch();

  // For each of these discounts...
  discountsToPayout.forEach( (discount) => {
    const _id = discount["_id"];

    // Call the Meteor method "paypalPayout".
    Meteor.call("paypalPayout", _id, (error, response) => {
      if (error) {
        console.log(error);
      }
    });
  });
}
