import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import AccountSettings from '../accountSettings/accountSettings';


export const thankYouComeAgain = (emailAddress, organizationID) => {

  const accountSettings = AccountSettings.findOne({"organizationID": organizationID});
  const organizationName = accountSettings["organizationName"]; // "Play Soccer 2 Give"
  const emailFrom = accountSettings["emailFrom"]; // "caleb@ps2g.org"
  const emailFromName = accountSettings["emailFromName"]; // "Caleb Olson"
  const emailSignature = accountSettings["emailSignature"]; // "<br />PS2G<br /><i><a href='https://www.playsoccer2give.com'>Local Games for Global Change</a></i><br /><br /><p><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'></p>"
  const thankYouComeAgainMessage = accountSettings["thankYouComeAgainMessage"]; // "<p>Hi there,</p><p>If you loved the high-quality soccer, great community, and knowing that your money is going to charity, why not come back?</p><p>We want to see you again! <a href='https://www.meetup.com/PlaySoccer2Give/events/?utm_source=thankYouComeAgain&utm_medium=email'>RSVP for next week</a> right now so that you don't lose out on your favorite time slot--visit <a href='https://www.meetup.com/PlaySoccer2Give/events/?utm_source=thankYouComeAgain&utm_medium=email'>our calendar page</a> to see what's still available. See you on the field!</p>"

  const email = (emailAddress, organizationID) => {
    Email.send({
      to: emailAddress,
      from: organizationName + " " + "<" + emailFrom + ">", // "Play Soccer 2 Give <caleb@ps2g.org>"
      replyTo: emailFromName + " " + "<" + emailFrom + ">", // "Caleb Olson <caleb@ps2g.org>"
      subject: "Thanks for joining us!",
      html: thankYouComeAgainMessage + emailSignature,
    });
  }

  if (!Meteor.isProduction) {
    if (emailAddress === "joelsfoster@gmail.com") {
      email(emailAddress, organizationID);
    } else {
      console.log("WARNING! thankYouComeAgain recipient is not authorized to recieve emails outside Production: " + emailAddress);
    }
  } else {
    email(emailAddress, organizationID);
  }
};
