import React from 'react';
import { Meteor } from 'meteor/meteor';
import Loading from '../components/Loading.js';
import DiscountLog from '../../api/discountLog/discountLog.js';


export default class RsvpPaymentCancelled extends React.Component {
  componentWillMount() {
    const _id = this.props.params._id;

    // Get the discount data for this URL
    Meteor.subscribe('getDiscountID', _id, () => {
      const discount = DiscountLog.findOne();

      const root_url = Meteor.isProduction ? "https://www.meetup.com/" : "localhost:3000/";

      // If a user goes to an invalid URL, redirect to Meetup
      if (discount === undefined) {
        window.location.href = root_url + "?success=ticket_aborted";
      } else {
        const organizationID = discount["organizationID"];
        const eventID = discount["eventID"];
        const userID = discount["userID"];

        // Function to redirect user according to what data is available
        const failureRedirect = () => {
          if (organizationID && eventID) {
            window.location.href = root_url + organizationID + "/events/" + eventID + "/?success=ticket_aborted";
          } else if (organizationID) {
            window.location.href = root_url + organizationID + "/events/?success=ticket_aborted";
          } else {
            window.location.href = root_url + "?success=ticket_aborted";
          }
        }

        const rsvpStatus = "no";

        // Remove the user's RSVP...
        Meteor.call('postMeetupRsvp', organizationID, eventID, userID, rsvpStatus, (error, response) => {
          if (error) {
            console.warn(error.reason);
            window.location.href = root_url + "?success=ticket_aborted";
          } else {
            failureRedirect();
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="RsvpPaymentCancelled">
        <Loading />
        <h2>
          <p>RSVP process cancelled</p>
          <p>Returning you to Meetup...</p>
        </h2>
      </div>
    );
  }
}
