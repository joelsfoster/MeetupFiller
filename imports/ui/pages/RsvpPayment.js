import React from 'react';
import { Meteor } from 'meteor/meteor';
import Loading from '../components/Loading.js';
import DiscountLog from '../../api/discountLog/discountLog.js';
// import moment from 'moment'; moment.utc().format("x"),


export default class RsvpPayment extends React.Component {
  componentWillMount() {
    const _id = this.props.params._id;

    // Get the discount data for this URL
    Meteor.subscribe('getDiscountID', _id, () => {
      const discount = DiscountLog.findOne();
      const organizationID = discount["organizationID"];
      const eventID = discount["eventID"];
      const userID = discount["userID"];
      const rsvpStatus = "yes";

      // Use the discount data to generate a PayPal portal
      Meteor.call('generatePaypalPortal', _id, (error, url) => {
        if (error) {
          // If it fails for some reason, redirect the user to Meetup with a failure message
          console.warn(error.reason);
          window.location.href = "https://www.meetup.com/" + organizationID + "/events/" + eventID + "/" + "?success=ticket_aborted";
        } else {
          // Upon generating the PayPal portal, POST the "yes" RSVP
          Meteor.call('postMeetupRsvp', organizationID, eventID, userID, rsvpStatus, (error, response) => {
            if (error) {
              // If it fails for some reason, redirect the user to Meetup with a failure message
              console.warn(error.reason);
              window.location.href = "https://www.meetup.com/" + organizationID + "/events/" + eventID + "/" + "?success=ticket_aborted";
            } else {
              // Redirect user to the PayPal portal
              window.location.href = url;

              // (2)
              // (when paypal webhook is success, log a time stamp)

              // (1)
              // run function that, when run, waits 20 minutes to run another function that checks if the _id has a timestamp
              // if _id does not have a timestamp, POST to remove the RSVP

              // (3)
              // If paypal webhook is success but there is no timestamp (meaning it wasnt booked), email joel to handle manual refund
            }
          });
        }
      });
    });
  }

  render() {
    return (
      <div className="RsvpPayment">
        <Loading />
        <h2>
          <p>Meetup discount applied!</p>
          <p>We're holding your spot for 20 minutes, you have until then to complete your payment.</p>
          <p>Redirecting to PayPal...</p>
        </h2>
      </div>
    );
  }
}
