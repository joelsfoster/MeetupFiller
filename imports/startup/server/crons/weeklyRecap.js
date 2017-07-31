import { weeklyRecap } from '../../../api/notifications/weeklyRecap';
import AccountSettings from '../../../api/accountSettings/accountSettings';
import NotificationLog from '../../../api/notificationLog/notificationLog';
import DiscountLog from '../../../api/discountLog/discountLog';
import moment from 'moment';


export const sendWeeklyRecap = () => {
  const unixDay = 86400000;
  const nowUnix = moment.utc().format("x");
  const lastWeekUnix = parseInt(nowUnix) - parseInt(unixDay * 7);

  // For each organization, grab all their discounts with a start time within the last (24 * 7) hours of the moment run.
  const organizations = AccountSettings.find().fetch();

  organizations.forEach( (organization) => {
    const emails = [];
    emails.push(organization["paypalPayoutID"]);
    emails.push(organization["emailFrom"]);
    const discounts = DiscountLog.find({"rsvpTime": {$gte: lastWeekUnix}, "organizationID": organization["organizationID"]}).fetch();

    // Then, if there are discounts to report, pass their _ids into an array...
    if (discounts.length > 0) {
      const discountIDs = discounts.map( (discount) => {
        return discount["_id"];
      });

      // ...and send it into the weeklyRecap function.
      weeklyRecap(emails, discountIDs);

    } else { // But, if there are no discounts to report, send a recap anyways with single empty string (to trigger a specific empty message).
      weeklyRecap(emails, [""]);
    }
  });
};
