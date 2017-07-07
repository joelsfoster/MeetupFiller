import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import DiscountLog from '../discountLog/discountLog';

export const lastMinuteDiscounts = (recipient, _id) => {

  const discount = DiscountLog.findOne({"_id": _id});
  const originalPrice = discount["originalPrice"].toFixed(2);
  const discountAmount = discount["discountAmount"].toFixed(2);
  const discountedPrice = (originalPrice - discountAmount).toFixed(2);
  const organizationID = discount["organizationID"];
  const eventName = discount["eventName"];
  const eventID = discount["eventID"];

  const email = (recipient, _id) => {

    Email.send({
      to: recipient,
      from: "Play Soccer 2 Give <caleb@ps2g.org>",
      replyTo: "Caleb Olson <caleb@ps2g.org>",
      subject: "[Last minute discount] " + eventName,
      html: "<p>Hello,</p><p>We have last-minute openings available, and we're offering a special discount for members who haven't been by in a while (that's you)!</p><p>Meetup Page & Event Details: <a href='https://www.meetup.com/" + organizationID + "/events/" + eventID + "/?utm_source=lastMinuteDiscountsDetails&utm_medium=email&utm_campaign=" + _id + "'>" + eventName + "</a><br/ >Original Price: $" + originalPrice + "<br />Discounted Price: $" + discountedPrice + "<br /><a href='https://www.meetupfiller.com/rsvp-payment/" + _id + "'><b>Click here to RSVP using this discount!</b></a></p><p><i>Please note that this discount can only be processed through this link, and we cannot nor will not honor the discount if you book directly through Meetup. By paying through this portal, you agree to our Refund Policy, as found on Meetup. After clicking the link, you will have 20 minutes to complete payment.</i></p>Hope to see you there!<br />PS2G<br /><i><a href='https://www.playsoccer2give.com'>Local Games for Global Change</a></i><br /><br /><p><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'></p><p><i>Tired of receiving discount emails? <a href='https://www.meetupfiller.com/snooze/" + _id + "?snoozeType=1week'>Snooze for 1 week</a> | <a href='https://www.meetupfiller.com/snooze/" + _id + "?snoozeType=1month'>Snooze for 1 month</a> | <a href='https://www.meetupfiller.com/snooze/" + _id + "?snoozeType=forever'>Snooze forever (unsubscribe)</a></i></p>",
    });
  }

  if (!Meteor.isProduction) {
    if (recipient === "joelsfoster@gmail.com") {
      email(recipient, _id);
    } else {
      console.log("WARNING! lastMinuteDiscounts recipient is not authorized to recieve emails outside Production: " + recipient);
    }
  } else {
    email(recipient, _id);
  }
};

/*
// Seed a test discount for Joel Foster
const record = {
  "organizationID": "playsoccer2give",
  "eventID": 241291765,
  "eventName": "Sunday Indoor Soccer @ W86th (2 hours 4v4) for Roundstar Foundation",
  "userID": 58124462,
  "originalPrice": 10.00,
  "discountAmount": 7.00,
}

if (!DiscountLog.findOne({record})) {
  DiscountLog.insert(record, (error, response) => {
    lastMinuteDiscounts("joelsfoster@gmail.com", response);
    console.log(response);
  });
}
*/
