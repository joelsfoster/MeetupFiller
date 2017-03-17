import Meteor from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { MEETUP_API_KEY } from '../environment-variables';
import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import moment from 'moment';
import Events from '../../../api/events/events';


let getTodaysEventLinks = (organizationID) => {
  const MAX_SCRAPES = 50; // Meetup's max is 200
  let this_moment = moment().format("YYYY-MM-DDTHH:mm:ss.0Z"); // Note that this is based off server time, which is EST. This is the format Meetup stubbornly requires. https://momentjs.com/docs/#/parsing/
  let url = 'https://api.meetup.com/' + organizationID + '/events?&sign=true&photo-host=public&page=' + MAX_SCRAPES + '&desc=true&scroll=since:' + this_moment + '&status=past&offset=0&omit=manual_attendance_count,created,duration,fee,id,rsvp_limit,status,updated,utc_offset,waitlist_count,yes_rsvp_count,venue,group,description,how_to_find_us,visibility&key=' + MEETUP_API_KEY;

  HTTP.call( 'GET', url, {}, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      let data = response.data;

      data.forEach( (object) => {
        let record = {
          "organizationID": organizationID,
          "eventID": parseInt(object["link"].slice(46, 55)), // Update this when we start scraping other websites!!
          "eventName": object["name"],
          "eventTime": parseInt(object["time"])
        };

        // Add the event to the database if it doesn't already exist
        if (!Events.findOne(record)) {
          Events.insert(record, (error, response) => {
            if (error) {
              console.log(error)
            } else {
              console.log("Event: " + organizationID + "/" + record["eventID"] + " has been added to the Events collection as _id:" + response);
            }
          });
        };
      });
    };
  });
};


SyncedCron.config({ log: true, utc: true });

SyncedCron.add({
  name: "getTodaysEventLinks",
  schedule(parser) {
    return parser.text('at 3:35 am'); // This is UTC time -> 11:35pm EST
  },
  job() {
    let organizations = [ "playsoccer2give" ]; // Change this to include all organizations to pull data from. Note that we have to account for eventID parsing and new API keys when this happens!!
    organizations.forEach( (organization) => {
      getTodaysEventLinks(organization);
    });
  },
});
