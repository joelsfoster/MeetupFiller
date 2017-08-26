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
      const meetup_url = "https://www.meetup.com/";

      // If a user goes to an invalid URL, redirect to Meetup
      if (discount === undefined) {
        window.location.href = meetup_url + "?success=ticket_aborted";
      } else {
        const organizationID = discount["organizationID"];
        const eventID = discount["eventID"];
        const userID = discount["userID"];
        const rsvpStatus = "yes";

        // If any sub-process fails, redirect the user to Meetup with a failure message
        const failureRedirect = () => {
          if (organizationID && eventID) {
            window.location.href = meetup_url + organizationID + "/events/" + eventID + "/?success=ticket_aborted";
          } else if (organizationID) {
            window.location.href = meetup_url + organizationID + "/events/?success=ticket_aborted";
          } else {
            window.location.href = meetup_url + "?success=ticket_aborted";
          }
        }

        // Use the discount data to generate a PayPal portal
        Meteor.call('generatePaypalPortal', _id, (error, url) => {
          if (error) {
            console.log("Error at generatePaypalPortal");
            console.log(error.reason);
            failureRedirect();
          } else {

            // Upon generating the PayPal portal, POST the "yes" RSVP. Will fail if member already finalizing RSVP for this event
            Meteor.call('postMeetupRsvp', organizationID, eventID, userID, rsvpStatus, (error, response) => {
              if (error) {
                console.log("Error at postMeetupRsvp at RsvpPayment");
                console.log(error.reason);
                failureRedirect();
              } else {

                // Run the function that un-RSVPs you in 20 minutes unless a timestamped DiscountLog["rsvpTime"] is found
                Meteor.call('timedRemoveMeetupRsvp', organizationID, eventID, userID, (error, response) => {
                  if (error) {
                    console.log("Error at timedRemoveMeetupRsvp");
                    console.log(error.reason);
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
          <div className="container">
            <div className="row">
              <div className="col-lg-12 my-auto">
                <Loading />
                <h3>Meetup discount applied!</h3>
                <h3>You have 20 minutes to complete your payment.</h3>
                <h3>Redirecting to PayPal...</h3>
              </div>
            </div>
          </div>
      </div>
    );
  }
}
