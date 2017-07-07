import React from 'react';
import { Meteor } from 'meteor/meteor';
import Loading from '../components/Loading.js';
import DiscountLog from '../../api/discountLog/discountLog.js';


export default class Snooze extends React.Component {
  componentWillMount() {
    const _id = this.props.params._id;
    const snoozeType = this.props.location.query.snoozeType;

    // Get the discount data for this URL
    Meteor.subscribe('getDiscountID', _id, () => {
      const discount = DiscountLog.findOne();
      const meetup_url = "https://www.meetup.com/";

      // If a user goes to an invalid URL, redirect to Meetup
      if (discount === undefined) {
        window.location.href = meetup_url;
      } else {
        const organizationID = discount["organizationID"];
        const userID = discount["userID"];

        const redirectToMeetup = () => {
          window.location.href = meetup_url + organizationID + "/events/";
        }

        // Use the discount data to identify what member to snooze, then redirect to Meetup after the snooze is set
        Meteor.call('snoozeMember', organizationID, userID, snoozeType, (error, response) => {
          if (error) {
            console.log("ERROR: snoozeMember failed! discountID=" + _id + " | " + snoozeType);
            console.warn(error.reason);
            Meteor.setTimeout(redirectToMeetup, 3000);
          } else {
            Meteor.setTimeout(redirectToMeetup, 3000);
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="Snooze">
        <Loading />
        <h2>
          <p>You've successfully snoozed discount emails!</p>
          <p>Redirecting to Meetup...</p>
        </h2>
      </div>
    );
  }
}
