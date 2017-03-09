import { Email } from 'meteor/email';

// For testing, uncomment this:
//process.env.MAIL_URL = [GET THIS FROM settings-production.json];

export const sendTestEmail = (recipient) => {
  Email.send({
    to: recipient,
    from: "Play Soccer 2 Give <donotreply@PS2G.com>",
    replyTo: "Joel Foster <joelsfoster@gmail.com>",
    subject: "Thanks for playing with us!",
    html: "<p>Hi there,</p><p>Thanks for playing with us! We really enjoyed having you and hope you had a great time.</p><p>We'd love to see you again! Why not RSVP for next week? Visit www.meetup.com/PlaySoccer2Give/events to see what spots are still available.</p>For good,<br />PS2G<br /><br /><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'><br /><br />",
  });
};

// For testing, uncomment this:
// sendTestEmail("joelsfoster@gmail.com");

export const seedConfirmation = (recipient) => {
  if (!Meteor.isProduction) {
    let environment = "staging";
  } else {
    let environment = "production";
  }

  Email.send({
    to: recipient,
    from: "PickupBaller <donotreply@pickupballer.com>",
    replyTo: "Joel Foster <joelsfoster@gmail.com>",
    subject: "Database seeding successful",
    html: "<p>Hi there,</p><p>The database has successfully been seeded on " + environment + ".</p><p>Regards,</ br>PickupBaller</p>",
  });
};
