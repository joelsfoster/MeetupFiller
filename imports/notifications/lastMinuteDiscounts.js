import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

export const lastMinuteDiscounts = (recipient, eventName, discountID) => {

  const email = (recipient, eventName, discountID) => {
    Email.send({
      to: recipient,
      from: "Play Soccer 2 Give <caleb@ps2g.org>",
      replyTo: "Caleb Olson <caleb@ps2g.org>",
      subject: "[Last minute discount] " + eventName,
      html: "<p>We have last-minute openings available, and we're offering a special discount!</p><p><a href='https://www.meetupfiller.com/rsvp-payment/" + discountID + "'>" + eventName + "</a></p><p><i>Please note that this discount can only be processed through this link, and we cannot nor will not honor the discount if you book directly through Meetup.</i></p>Hope to see you there!<br />PS2G<br /><i><a href='https://www.playsoccer2give.com'>Local Games for Global Change</a></i><br /><br /><p><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'></p>",
    });
  }

  if (recipient === "joelsfoster@gmail.com") {
    email(recipient, eventName, discountID);
  }
};
