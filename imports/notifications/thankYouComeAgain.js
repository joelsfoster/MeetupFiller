import { Email } from 'meteor/email';

export const thankYouComeAgain = (recipient) => {
  Email.send({
    to: recipient,
    from: "Play Soccer 2 Give <donotreply@PS2G.com>",
    replyTo: "Joel Foster <joelsfoster@gmail.com>",
    subject: "Thanks for playing with us yesterday!",
    html: "<p>Hi there,</p><p>If you loved the high-quality soccer, great community, and knowing that your money is helping needy kids, why not come back?</p><p>We want to see you again! RSVP for next week right now so that you don't lose out on your favorite time slot--visit www.meetup.com/PlaySoccer2Give/events to see what's still available. See you on the field!</p>For good,<br />PS2G<br /><br /><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'><br /><br />",
  });
};
