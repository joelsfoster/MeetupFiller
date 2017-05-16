import React from 'react';
import { Meteor } from 'meteor/meteor';
import Loading from '../components/Loading.js';
import DiscountLog from '../../api/discountLog/discountLog.js';


export default class RsvpPayment extends React.Component {
  componentWillMount() {
    const _id = this.props.params._id;

    // Get the discount data for this URL
    Meteor.subscribe('getDiscountID', _id, () => {
      const discount = DiscountLog.findOne();

      // If a user goes to an invalid URL, redirect to Meetup
      if (discount === undefined) {
        window.location.href = "https://www.meetup.com/?success=ticket_aborted";
      } else {
        const organizationID = discount["organizationID"];
        const eventID = discount["eventID"];
        const userID = discount["userID"];
        const rsvpStatus = "yes";

        // If any sub-process fails, redirect the user to Meetup with a failure message
        const failureRedirect = () => {
          if (organizationID && eventID) {
            window.location.href = "https://www.meetup.com/" + organizationID + "/events/" + eventID + "/?success=ticket_aborted";
          } else if (organizationID) {
            window.location.href = "https://www.meetup.com/" + organizationID + "/events/?success=ticket_aborted";
          } else {
            window.location.href = "https://www.meetup.com/?success=ticket_aborted";
          }
        }

        // Use the discount data to generate a PayPal portal
        Meteor.call('generatePaypalPortal', _id, (error, url) => {
          if (error) {
            console.warn(error.reason);
            failureRedirect();
          } else {

            // Upon generating the PayPal portal, POST the "yes" RSVP
            Meteor.call('postMeetupRsvp', organizationID, eventID, userID, rsvpStatus, (error, response) => {
              if (error) {
                console.warn(error.reason);
                failureRedirect();
              } else {

                // Run the function that un-RSVPs you in 20 minutes unless a timestamped DiscountLog["rsvpTime"] is found
                Meteor.call('timedRemoveMeetupRsvp', organizationID, eventID, userID, (error, response) => {
                  if (error) {
                    console.warn(error.reason);
                    failureRedirect();
                  } else {

                    // Redirect user to the PayPal portal
                    window.location.href = url;
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="RsvpPayment">
        <Loading />
        <h2>
          <p>Meetup discount applied!</p>
          <p>You have 20 minutes to complete your payment.</p>
          <p>Redirecting to PayPal...</p>
        </h2>
      </div>
    );
  }
}
