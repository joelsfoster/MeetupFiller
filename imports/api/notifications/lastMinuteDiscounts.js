import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import DiscountLog from '../discountLog/discountLog';
import AccountSettings from '../accountSettings/accountSettings';
import moment from 'moment';


export const lastMinuteDiscounts = (emailAddress, discountIDs) => {

  // Grab each discountID's (_id) details and create an htmlBlock for each one
  const htmlBlocks = discountIDs.map( (_id) => {
    const discount = DiscountLog.findOne({"_id": _id});
    const originalPrice = discount["originalPrice"].toFixed(2);
    const discountAmount = discount["discountAmount"].toFixed(2);
    const discountedPrice = (originalPrice - discountAmount).toFixed(2);
    const organizationID = discount["organizationID"];
    const eventName = discount["eventName"];
    const eventID = discount["eventID"];
    const htmlBlock = "<p>Meetup Page & Event Details: <a href='https://www.meetup.com/" + organizationID + "/events/" + eventID + "/?utm_source=lastMinuteDiscountsDetails&utm_medium=email&utm_campaign=" + _id + "'>" + eventName + "</a><br/ >Original Price: $" + originalPrice + "<br />Discounted Price: $" + discountedPrice + "<br /><a href='https://www.meetupfiller.com/rsvp-payment/" + _id + "'><b>Click here to RSVP using this discount!</b></a></p>";

    return htmlBlock;
  });

  // Function to send the email
  const email = (emailAddress) => {

    const sampleDiscountID = discountIDs[0]; // Used by the Snooze function because we only want to publish Discount _ids in URLs, never Member _ids
    const sampleEventTime = DiscountLog.findOne({"_id": sampleDiscountID})["eventTime"];
    const sampleEventDate = sampleEventTime ? moment(sampleEventTime).format("MMM D") : undefined;
    const emailSubjectDate = sampleEventDate ? "Meetups on " + sampleEventDate : "Upcoming Meetups - " + moment().add(2, "days").format("MMM D");
    const discountBlocks = htmlBlocks.join("");

    const organizationID = DiscountLog.findOne({"_id": sampleDiscountID})["organizationID"];
    const accountSettings = AccountSettings.findOne({"organizationID": organizationID});
    const organizationName = accountSettings["organizationName"]; // "Play Soccer 2 Give"
    const emailFrom = accountSettings["emailFrom"]; // "caleb@ps2g.org"
    const emailFromName = accountSettings["emailFromName"]; // "Caleb Olson"
    const emailSignature = accountSettings["emailSignature"]; // "<br />PS2G<br /><i><a href='https://www.playsoccer2give.com'>Local Games for Global Change</a></i><br /><br /><p><img src='a248.e.akamai.net/secure.meetupstatic.com/photos/event/5/e/d/0/highres_258204272.jpeg' height='100'></p>"

    Email.send({
      to: emailAddress,
      from: organizationName + " " + "<" + emailFrom + ">", // "Play Soccer 2 Give <caleb@ps2g.org>"
      replyTo: emailFromName + " " + "<" + emailFrom + ">", // "Caleb Olson <caleb@ps2g.org>"
      subject: "[Last minute discounts] " + emailSubjectDate,
      html: "<p>Hello,</p><p>We have last-minute openings available on upcoming Meetups, and we're offering special discounts to get these events filled up!</p>" + discountBlocks + "<p><i>Please note that discounts can only be processed through links in these emails, and we cannot nor will not honor discounts if you book directly through Meetup. By paying through this portal, you agree to our Refund Policy, as found on Meetup. After clicking a discount link, you will have 20 minutes to complete payment.</i></p>Hope to see you there!" + emailSignature + "<p><i>Tired of receiving discount emails? <a href='https://www.meetupfiller.com/snooze/" + sampleDiscountID + "?snoozeType=1week'>Snooze for 1 week</a> | <a href='https://www.meetupfiller.com/snooze/" + sampleDiscountID + "?snoozeType=1month'>Snooze for 1 month</a> | <a href='https://www.meetupfiller.com/snooze/" + sampleDiscountID + "?snoozeType=forever'>Snooze forever (unsubscribe)</a></i></p>",
    });
  }

  // Safety precaution for testing
  if (!Meteor.isProduction) {
    if (emailAddress === "joelsfoster@gmail.com") {
      email(emailAddress);
    } else {
      console.log("WARNING! lastMinuteDiscounts recipient is not authorized to recieve emails outside Production: " + emailAddress);
    }
  } else {
    email(emailAddress);
  }
};




/*
// Seed a test discount for Joel Foster
const record = {
  "organizationID": "playsoccer2give",
  "eventID": 242338778,
  "eventName": "Sunday Indoor Soccer @ W86th (2 hours 4v4) for Roundstar Foundation",
  "userID": 58124462,
  "originalPrice": 7.00,
  "discountAmount": 6.00,
}

DiscountLog.insert(record, (error, response) => {
  lastMinuteDiscounts("joelsfoster@gmail.com", [response]);
  console.log(response);
});
*/
