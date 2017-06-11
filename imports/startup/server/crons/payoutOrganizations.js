import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../environment-variables';
import DiscountLog from '../../../api/discountLog/discountLog';

export const payoutOrganizations = () => {
  const discountsToPayout = DiscountLog.find({"rsvpTime": {$ne: undefined}, "payoutTime": undefined }).fetch();

  discountsToPayout.forEach( (discount) => {
    const _id = discount["_id"];

    Meteor.call("paypalPayout", _id, (error, response) => {
      if (error) {
        console.log(error);
      }
    });
  });
}
