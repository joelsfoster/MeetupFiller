import { Email } from 'meteor/email';

export const seedConfirmation = (recipient) => {
  let environment = "undefined";
  if (!Meteor.isProduction) {
    environment = "staging";
  } else {
    environment = "production";
  }

  Email.send({
    to: recipient,
    from: "PickupBaller <donotreply@pickupballer.com>",
    replyTo: "Joel Foster <joelsfoster@gmail.com>",
    subject: "Database seeding successful",
    html: "<p>Hi there,</p><p>The database has successfully been seeded on " + environment + ".</p><p>Regards,<br>PickupBaller</p>",
  });
};
