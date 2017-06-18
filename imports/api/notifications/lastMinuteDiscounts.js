import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

export const lastMinuteDiscounts = (recipient, price, eventName, discountID) => {

  const email = (recipient, price, eventName, discountID) => {

    Email.send({
      to: recipient,
      from: "Play Soccer 2 Give <caleb@ps2g.org>",
      replyTo: "Caleb Olson <caleb@ps2g.org>",
      subject: "[Last minute discount] " + eventName,
      html: "<p>Hello,</p><p>We have last-minute openings available, and we're offering a special discount for members who haven't been by in a while (that's you)!</p><p><a href='https://www.meetupfiller.com/rsvp-payment/" + discountID + "'><b>$" + price + "</b> - " + eventName + "</a></p><p><i>Please note that this discount can only be processed through this link, and we cannot nor will not honor the discount if you book directly through Meetup. By paying through this portal, you agree to our Refund Policy, as found on Meetup. After clicking the link, you will have 20 minutes to complete payment.</i></p>Hope to see you there!<br />PS2G<br /><i><a href='https://www.playsoccer2give.com'>Local Games for Global Change</a></i><br /><br /><p><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'></p>",
    });
  }


  if (!Meteor.isProduction) {
    if (recipient === "joelsfoster@gmail.com") {
      email(recipient, price, eventName, discountID);
    } else {
      console.log("WARNING! lastMinuteDiscounts recipient is not authorized to recieve emails outside Production: " + recipient);
    }
  } else {
    email(recipient, price, eventName, discountID);
  }
};
