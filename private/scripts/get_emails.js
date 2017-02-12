const HTTP = require ('sync-request');
const jsonexport = require ('jsonexport');
const fs = require('fs');
/*
import { HTTP } from 'meteor/http';
import jsonexport from 'jsonexport';
import fs from 'fs';
// Look here: https://themeteorchef.com/tutorials/using-the-http-package
*/

// Get event data of past games and store in JSON
const COUNT_OF_GAMES_TO_SCRAPE = 20; // 50 was too much and didn't work, it got throttled
const GET_PAST_GAME_IDS = 'https://api.meetup.com/playsoccer2give/events?&sign=true&photo-host=public&page=' + COUNT_OF_GAMES_TO_SCRAPE + '&desc=true&status=past&omit=name,created,duration,fee,id,rsvp_limit,status,time,updated,utc_offset,waitlist_count,yes_rsvp_count,venue,group,description,how_to_find_us,visibility&key=282a2c7858483325b5b6c5510422e5b';
let event_data = HTTP('GET', GET_PAST_GAME_IDS);
let event_json = JSON.parse(event_data.getBody('utf-8'));
console.log("First API call successful!");

// Extract URLs into an array
let event_urls = [];
event_json.forEach( (object) => {
  event_urls.push(object["link"]);
});

// Extract event IDs from those URLs
let event_ids = [];
event_urls.forEach( (url) => {
  event_ids.push(url.slice(46, 55));
});

// Use those event IDs to produce an array of all GET requests to call
let all_get_requests = [];
event_ids.forEach( (event_id) => {
  let url = 'https://api.meetup.com/playsoccer2give/events/' + event_id + '/rsvps?&sign=true&photo-host=public&fields=answers&omit=event,answers.question_id,answers.question,answers.updated,member.bio,member.photo,group,venue,member.event_context&key=282a2c7858483325b5b6c5510422e5b';
  all_get_requests.push(url);
});

// Call each GET request and push the data into one big array
let all_members = [];
all_get_requests.forEach( (request) => {
  let member_data = HTTP('GET', request);
  let member_json = JSON.parse(member_data.getBody('utf-8'));
  member_json.forEach( (member) => {
    all_members.push(member);
  });
});
console.log("Second round of API calls successful!");

// Export all the member data for all the events into csv format
jsonexport(all_members, (err, csv) => {
  if(err) return console.log(err);
  // Export the data into a csv file
  fs.writeFile('MemberData.csv', csv, (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });
});
