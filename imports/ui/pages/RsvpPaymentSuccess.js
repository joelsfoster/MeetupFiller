import React from 'react';
import { Meteor } from 'meteor/meteor';
import Loading from '../components/Loading.js';
import DiscountLog from '../../api/discountLog/discountLog.js';


export default class RsvpPaymentSuccess extends React.Component {
  componentWillMount() {
    const _id = this.props.params._id;
    const paymentID = this.props.location.query.paymentId;
    const payerID = this.props.location.query.PayerID;

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

        // If any sub-process fails, redirect the user to Meetup with a failure message
        const failureRedirect = () => {

          // Then redirect the user appropriately
          if (organizationID && eventID) {
            window.location.href = meetup_url + organizationID + "/events/" + eventID + "/?success=ticket_aborted";
          } else if (organizationID) {
            window.location.href = meetup_url + organizationID + "/events/?success=ticket_aborted";
          } else {
            window.location.href = meetup_url + "?success=ticket_aborted";
          }
        }

        // When this page is loaded, check if member is RSVP'd and log rsvpTime if yes.
        Meteor.call('finalizeMemberMeetupRsvp', organizationID, eventID, userID, (error, response) => {
          if (error) {
            console.log("Error at finalizeMemberMeetupRsvp");
            console.warn(error.reason);
            failureRedirect();
          } else {

            // Then, execute the payment that the member approved.
            Meteor.call('executePaypalPayment', _id, payerID, paymentID, (error, response) => {
              if (error) {
                console.log("Error at executePaypalPayment");
                console.warn(error.reason);
                failureRedirect();
              } else {

                // Then, POST payment confirmation on Meetup.
                Meteor.call('postMeetupRsvpPayment', organizationID, eventID, userID, (error, response) => {
                  if (error) {
                    console.log("Error at postMeetupRsvpPayment");
                    console.warn(error.reason);
                    failureRedirect();
                  } else {

                    // Send confirmation email and...
                    Meteor.call('paymentConfirmation', _id, (error, response) => {
                      if (error) {
                        console.log("Error at paymentConfirmation");
                        console.warn(error.reason);
                      }
                    });

                    // ...redirect user to Meetup confirmation page
                    window.location.href = "https://www.meetup.com/" + organizationID + "/events/" + eventID + "?utm_source=lastMinuteDiscounts&utm_medium=email&utm_campaign=" + _id + "?success=ticket_paid";
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
      <div className="RsvpPaymentSuccess">
        <Loading />
        <h2>
          <p>RSVP complete!</p>
          <p>Taking you to Meetup...</p>
        </h2>
      </div>
    );
  }
}
