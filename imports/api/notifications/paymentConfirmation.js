import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import DiscountLog from '../discountLog/discountLog';
import Members from '../members/members';
import { check } from 'meteor/check';


Meteor.methods({
  paymentConfirmation(_id) {
    check(_id, String);

    // Function to send the email
    const sendPaymentConfirmation = (_id) => {

      const discount = DiscountLog.findOne({"_id": _id});

      if (discount) {
        const eventName = discount["eventName"];
        const organizationID = discount["organizationID"];
        const eventID = discount["eventID"];
        const recipient = Members.findOne({"organizationID": organizationID, "userID": discount["userID"]})["askedEmail"];
        const price = (discount["originalPrice"].toFixed(2) - discount["discountAmount"].toFixed(2));

        const email = (recipient) => {
          Email.send({
            to: recipient,
            from: "Play Soccer 2 Give <caleb@ps2g.org>",
            replyTo: "Caleb Olson <caleb@ps2g.org>",
            subject: "Success! You RSVPed using a discount!",
            html: "<p>Congrats!</p><p>You've successfully RSVPed to '" + eventName + "', at the special discounted rate of <b>$" + price + "</b>. To view your booking, click <a href='https://www.meetup.com/" + organizationID + "/events/" + eventID + "'>here</a> to go to the event page.</p><p><i>Note that your PayPal confirmation email and bank statement may say 'MeetupFiller'. This is the service we use to offer you discounts at no extra cost to you. By booking this discount, you agreed to our Refund Policy as found in Meetup.</i></p>For good,<br />PS2G<br /><i><a href='https://www.playsoccer2give.com'>Local Games for Global Change</a></i><br /><br /><p><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'></p>",
          });
        }

        if (!Meteor.isProduction) {
          if (recipient.toLowerCase() === "joelsfoster@gmail.com") {
            email(recipient);
          } else {
            console.log("WARNING! paymentConfirmation recipient is not authorized to recieve emails outside Production: " + recipient);
          }
        } else {
          email(recipient);
        }
      } else {
        throw console.log("ERROR: discountID does not exist (paymentConfirmation)");
      }
    };

    sendPaymentConfirmation(_id);
  }
});
