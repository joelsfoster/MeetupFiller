# MeetupFiller

*The scaffolding for this app came from [Base](http://themeteorchef.com/base), by The Meteor Chef.*

MeetupFiller is a SaaS app that helps struggling pay-per-event Meetups keep their attendance numbers up. MeetupFiller will collect the email addresses and attendance histories of your members. When a member has gone a certain length of time without attending one of your Meetups, the app will automatically send them an email with a link to an upcoming event. The user can click this link to pay a discounted price.

### How it works

MeetupFiller requires:
- You must be an admin of your group and you must give the app your API key
- Your group is a "legacy" Meetup group that still has PayPal integration
- You must give the app your PayPal address (but not access to it). This is so funds can be sent to you.
- Each of your events must have a "Question" field that is shown to users when they RSVP. This question should ask "What is your email address?"

If a user has provided their email address and hasn't been to a Meetup in a while, they will be put on a "send" list. All users on this "send" list will be sent discounted RSVP links to an upcoming event. Clicking this link will send them straight to PayPal, where they pay a discounted fee. The funds go straight to MeetupFiller's PayPal account. At the end of the week, MeetupFiller tallies up all funds received and sends your PayPal account a lump sum payment of that amount minus MeetupFiller's SaaS fee (this is to keep PayPal per-transfer fees low).

### For developers

This was the very first app I ever wrote. Back then, I didn't know how to use anything other than Meteor.js (there's a massive amount of useless boilerplate still in here), nor did I know how to use Git properly. So, prepare yourself to read some poorly-organized (although well-commented) code. I didn't use promises or async/await so there's a lot of callback hell. I violated DRY a lot. I made a lot of poor structuring decisions. I've become a MUCH better developer since then and pride myself in writing clean, well-organized, well-commented, well-structured, efficient, secure code.

**Most app logic can be found in imports/startup/server/crons/**
