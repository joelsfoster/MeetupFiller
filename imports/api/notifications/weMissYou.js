import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

export const weMissYou = (recipient, userID) => {

  const email = (recipient, userID) => {
    Email.send({
      to: recipient,
      from: "Play Soccer 2 Give <caleb@ps2g.org>",
      replyTo: "Caleb Olson <caleb@ps2g.org>",
      subject: "We haven't seen you in a while...",
      html: "<p>Hi there,</p><p>We haven't seen you on the field in a long time, and we want to play with you again! Sign up for your next game <a href='https://www.meetup.com/PlaySoccer2Give/events/?utm_source=weMissYou&utm_medium=email&utm_campaign=" + userID + "'>on our calendar page</a>.</p><p><i>If there's a specific reason why you've decided to not come back, please let us know by replying to this email--we'd love to know what we could do to make the experience more enjoyable for you.</i></p>For good,<br />PS2G<br /><i><a href='https://www.playsoccer2give.com'>Local Games for Global Change</a></i><br /><br /><p><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'></p>",
    });
  }

  if (!Meteor.isProduction) {
    if (recipient === "joelsfoster@gmail.com") {
      email(recipient, userID);
    } else {
      console.log("WARNING! weMissYou recipient is not authorized to recieve emails outside Production: " + recipient);
    }
  } else {
    email(recipient, userID);
  }
};
