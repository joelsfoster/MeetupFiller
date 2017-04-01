import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

export const weMissYou = (recipient) => {

  const email = (recipient) => {
    Email.send({
      to: recipient,
      from: "Play Soccer 2 Give <caleb@ps2g.org>",
      replyTo: "Caleb Olson <caleb@ps2g.org>",
      subject: "You haven't played soccer with us in a while...",
      html: "<p>Hello,</p><p>We haven't seen you on the field in a long time, and we're starting to miss you. We want to play with you again! Sign up for your next game <a href='https://www.meetup.com/PlaySoccer2Give/events/?utm_source=weMissYou&utm_medium=email'>on our calendar page</a>.</p><p><i>If there's a specific reason why you've decided to not come back, please let us know by replying to this email--we'd love to know what we could do to make the experience more enjoyable for you.</i></p>For good,<br />PS2G<br /><br /><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'><br /><br />",
    });
  }

  if (!Meteor.isProduction) {
    if (recipient === "joelsfoster@gmail.com") {
      email(recipient);
    } else {
      console.log("WARNING! weMissYou recipient is not authorized to recieve emails outside Production: " + recipient);
    }
  } else {
    email(recipient);
  }
};
