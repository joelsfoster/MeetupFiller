import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check } from 'meteor/check';


Meteor.methods({
  signupConfirmationEmail(name, emailAddress, url) {
    check(name, String);
    check(emailAddress, String);
    check(url, String);

    const email = (name, emailAddress, url) => {
      Email.send({
        to: emailAddress,
        from: "The MeetupFiller Team <donotreply@meetupfiller.com>",
        bcc: "joelsfoster@gmail.com",
        subject: "Thanks for signing up!",
        html: "<p>Hello " + name + ",</p><p>Congratulations! You've taken a big step towards growing your community (" + url + "). Since we're still a startup, our founder, Joel, will reach out to personally set you up with your account! Keep an eye out for his email within the next day or two (he'll reach out to " + emailAddress + "). We're so excited to have you on board!</p><p>All the best,<br />The MeetupFiller Team</p>",
      });
    }

    if (!Meteor.isProduction) {
      if (emailAddress === "joelsfoster@gmail.com") {
        email(name, emailAddress, url);
      } else {
        console.log("WARNING! signupConfirmationEmail recipient is not authorized to recieve emails outside Production: " + emailAddress);
      }
    } else {
      email(name, emailAddress, url);
    }
  }
});
