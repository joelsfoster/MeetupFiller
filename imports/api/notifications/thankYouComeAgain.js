import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

export const thankYouComeAgain = (recipient, userID) => {

  const email = (recipient, userID) => {
    Email.send({
      to: recipient,
      from: "Play Soccer 2 Give <caleb@ps2g.org>",
      replyTo: "Caleb Olson <caleb@ps2g.org>",
      subject: "Thanks for playing with us!",
      html: "<p>Hi there,</p><p>If you loved the high-quality soccer, great community, and knowing that your money is going to charity, why not come back?</p><p>We want to see you again! <a href='https://www.meetup.com/PlaySoccer2Give/events/?utm_source=thankYouComeAgain&utm_medium=email&utm_campaign=" + userID + "'>RSVP for next week</a> right now so that you don't lose out on your favorite time slot--visit <a href='https://www.meetup.com/PlaySoccer2Give/events/?utm_source=thankYouComeAgain&utm_medium=email&utm_campaign=" + userID + "'>our calendar page</a> to see what's still available. See you on the field!</p>For good,<br />PS2G<br /><i><a href='https://www.playsoccer2give.com'>Local Games for Global Change</a></i><br /><br /><p><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'></p>",
    });
  }

  if (!Meteor.isProduction) {
    if (recipient === "joelsfoster@gmail.com") {
      email(recipient, userID);
    } else {
      console.log("WARNING! thankYouComeAgain recipient is not authorized to recieve emails outside Production: " + recipient);
    }
  } else {
    email(recipient, userID);
  }
};
