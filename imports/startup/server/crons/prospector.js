import { Meteor } from 'meteor/meteor';
import { getEvents } from './getEvents';
import { getMembers } from './getMembers';
import Members from '../../../api/members/members';
import Events from '../../../api/events/events';
import moment from 'moment';


const scrapeOrganization = (organizationID, meetupAPIKey) => {
  if (!Meteor.isProduction) {
    getEvents(organizationID, meetupAPIKey);

    const runGetMembers = () => {
      getMembers(organizationID, meetupAPIKey);
    }

    Meteor.setTimeout(runGetMembers, 5000);
  }
};

// scrapeOrganization("grandfc", "2422295b57301f1113486a2a6a4094");


const runAnalysis = (organizationID) => {
  if (!Meteor.isProduction) {
    // General scrape data
    const events = Events.find({"organizationID": organizationID}).fetch();
    const scrapedSinceTime = Events.find({"organizationID": organizationID}, {sort: {"eventTime": 1}, limit: 1}).fetch()[0]["eventTime"];
    const scrapedSince = moment(scrapedSinceTime).format("MM/DD/YYYY");
    const members = Members.find({"organizationID": organizationID}).fetch();

    console.log("eventCount:", events.length);
    console.log("scrapedSince:", scrapedSince);
    console.log("membersCount:", members.length);

    // Attendance data
    const attendanceCounts = [];

    members.forEach( (member) => {
      const userID = member["userID"];
      const attendedEvents = Events.find({"organizationID": organizationID, "eventMemberIDs": { $in: [ userID ] }}).fetch();
      attendanceCounts.push(attendedEvents.length);

      if (attendanceCounts.length === members.length) {
        const attendanceFrequency = attendanceCounts.reduce( (accumulator, attendanceCount) => {
          if ( attendanceCount in accumulator ) accumulator[attendanceCount] ++;
          else accumulator[attendanceCount] = 1;
          return accumulator; // This .reduce() function returns a key-value pair for each attendanceCount's frequency
        }, {} );

        console.log("attendanceFrequency:", attendanceFrequency);
      }
    });

    // Financial data
    const missedRevenues = [];
    const emptySpots = [];
    let fullGames = 0;
    let eventCounter = 0;

    events.forEach( (event) => {
      eventCounter += 1;

      const eventCapacity = event["eventCapacity"];
      const eventAttendance = event["eventAttendance"];
      const eventEmptySpots = (eventCapacity - eventAttendance) >= 0 ? (eventCapacity - eventAttendance) : 0;
      if (eventEmptySpots === 0) { fullGames += 1 };
      emptySpots.push(eventEmptySpots);

      const eventPrice = event["eventPrice"];
      const missedRevenue = (eventPrice * eventEmptySpots).toFixed(2);
      missedRevenues.push(missedRevenue);

      if (eventCounter === events.length) {
        const discountedRevenues = missedRevenues.map( (revenue) => {
          const discountedPrice = parseFloat(revenue * .75).toFixed(2); // Return each price discounted by 25%
          return discountedPrice;
        });

        const totalEmptySpots = emptySpots.reduce( (accumulator, value) => accumulator + value, 0);
        const potentialRevenue = discountedRevenues.reduce( (accumulator, value) => parseFloat(accumulator) + parseFloat(value), 0);
        console.log("fullGames:", fullGames);
        console.log("totalEmptySpots:", totalEmptySpots);
        console.log("potentialRevenue: $" + potentialRevenue.toFixed(2));
      }
    });
  }
}

// runAnalysis("grandfc");
