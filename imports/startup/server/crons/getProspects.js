/*
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import Prospects from '../../../api/prospects/prospects';
import AccountSettings from '../../../api/accountSettings/accountSettings';
import { getEvents } from './getEvents';
import Events from '../../../api/events/events';
import moment from 'moment';


const getProspects = () => {

  if (!Meteor.isProduction) {

    // Loop through this many offset pages (200 results each)...
    let offsets = [0, 1, 2, 3, 4] // , 5, 6, 7, 8, 9]; // I don't care that this is ugly!!
    offsets.forEach( (offset) => { // Doing this because it's synchronous

      const organization = AccountSettings.find({"organizationID": "playsoccer2give"}).fetch();
      const meetupAPIKey = organization[0]["meetupAPIKey"];

      const delayedFunction = () => {
        const categoryID = 5; // https://secure.meetup.com/meetup_api/console/?path=/2/categories
        const url = 'https://api.meetup.com/find/groups?&sign=true&country=US&page=200&offset=' + offset + '&upcoming_events=true&category=' + categoryID + '&only=name,category,urlname,city,state,visibility,members&omit=organizer.bio,organizer.photo&key=' + meetupAPIKey;
        // https://api.meetup.com/find/groups?&sign=true&country=US&page=200&offset=0&upcoming_events=true&category=32&only=name,category,urlname,city,state,visibility,members&omit=organizer.bio,organizer.photo&key=

        // ...calling those 200 results per offset...
        HTTP.call( 'GET', url, {}, function( error, response ) {
          if ( error ) {
            console.log( error );
          } else {
            const data = response.data;

            // ...then log each prospect's group data.
            data.forEach( (object) => {

              const organizationID = object["urlname"];
              const organizationName = object["name"];
              const organizationState = object["state"];
              const organizationCity = object["city"];
              const organizationVisibility = object["visibility"];

              if (!Prospects.findOne({"organizationID": organizationID}) ) {
                Prospects.insert( {
                  "organizationID": organizationID,
                  "organizationName": organizationName,
                  "organizationState": organizationState,
                  "organizationCity": organizationCity,
                  "organizationVisibility": organizationVisibility,
                  "categoryID": categoryID,
                }, (error, response) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(organizationID, "prospected.");
                  }
                });
              }
            });
          }
        });
      } // End of delayedFunction

      // We put a timed delay here because Meetup throttles API calls if it gets too many too quickly
      const MILLISECONDS_BETWEEN_CALLS = 550; // Keeping it at a little more than 1 call a second
      Meteor.setTimeout(delayedFunction, MILLISECONDS_BETWEEN_CALLS * offset);
    });
  }
}

// getProspects();


const scrapeProspects = () => {
  if (!Meteor.isProduction) {

    const prospects = Prospects.find({"organizationVisibility": "public", "qualified": null}).fetch();
    const organization = AccountSettings.find({"organizationID": "playsoccer2give"}).fetch();
    const meetupAPIKey = organization[0]["meetupAPIKey"];
    let api_counter = 0;

    prospects.forEach( (prospect) => {
      const organizationID = prospect["organizationID"];
      api_counter ++;

      // We put a timed delay here because Meetup throttles API calls if it gets too many too quickly
      const MILLISECONDS_BETWEEN_CALLS = 550; // Keeping it at a little more than 1 call a second
      Meteor.setTimeout( () => { getEvents(organizationID, meetupAPIKey) }, MILLISECONDS_BETWEEN_CALLS * api_counter);
    });
  }
};

// scrapeProspects();


// Check three sample events per public prospect to see if they'd benefit from the app
const qualifyProspects = () => {
  if (!Meteor.isProduction) {

    const prospects = Prospects.find({"organizationVisibility": "public", "qualified": null}).fetch();

    prospects.forEach( (prospect) => {
      const unixDay = 86400000;
      const nowUnix = parseInt(moment.utc().format("x"));
      const weekAgoUnix = parseInt(nowUnix) - (parseInt(unixDay) * 7);
      const organizationID = prospect["organizationID"];
      const events = Events.find({"organizationID": organizationID}, {sort: { eventTime : -1 } }).fetch();
      const eventOne = events[0];
      const eventOneAttendance = eventOne ? eventOne["eventAttendance"] : 0;
      const eventOnePrice = eventOne ? eventOne["eventPrice"] : 0;
      const eventOneTime = eventOne ? eventOne["eventTime"] : 0;
      const eventOneWithinRange = eventOneTime > weekAgoUnix;
      const eventTwo = events[1];
      const eventTwoAttendance = eventTwo ? eventTwo["eventAttendance"] : 0;
      const eventTwoPrice = eventTwo ? eventTwo["eventPrice"] : 0;
      const eventTwoTime = eventTwo ? eventTwo["eventTime"] : 0;
      const eventTwoWithinRange = eventTwoTime > weekAgoUnix;
      const eventThree = events[2];
      const eventThreeAttendance = eventThree ? eventThree["eventAttendance"] : 0;
      const eventThreePrice = eventThree ? eventThree["eventPrice"] : 0;
      const eventThreeTime = eventThree ? eventThree["eventTime"] : 0;
      const eventThreeWithinRange = eventThreeTime > weekAgoUnix;
      const combinedAttendance = eventOneAttendance + eventTwoAttendance; // + eventThreeAttendance;
      const combinedPrice = eventOnePrice + eventTwoPrice; // + eventThreePrice;
      const eventsWithinRange = (eventOneWithinRange && eventTwoWithinRange); // && eventThreeWithinRange;


      // If the three sample events have had at least a couple attendees, and the average price is greater than $5, mark as qualified
      if ((combinedAttendance > 4 && combinedPrice > 10) && eventsWithinRange) {
        Prospects.update( {"organizationID": organizationID}, { $set: { "qualified": true} }, (error, response) => {
          if (error) {
            console.log(error);
          } else {
            console.log(organizationID + " is ripe for a reachout!");
          }
        });
      } else {
        Prospects.update( {"organizationID": organizationID}, { $set: { "qualified": false} }, (error, response) => {
          if (error) {
            console.log(error);
          }
        });
      }
    });
  }
}

// qualifyProspects();
*/
