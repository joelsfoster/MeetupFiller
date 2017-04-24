import { Accounts } from 'meteor/accounts-base';

const name = 'MeetupFiller';
const email = '<donotreply@meetupfiller.com>';
const from = `${name} ${email}`;
const emailTemplates = Accounts.emailTemplates;

emailTemplates.siteName = name;
emailTemplates.from = from;

emailTemplates.resetPassword = {
  subject() {
    return `[${name}] Reset Your Password`;
  },
  text(user, url) {
    const userEmail = user.emails[0].address;
    const urlWithoutHash = url.replace('#/', '');

    return `Whoops! Don't worry, we all forget our passwords from time to time :).
    A password reset has been requested for ${userEmail}. To reset your password, please visit the following link:
    \n\n${urlWithoutHash}\n\n If you did not request this reset, please ignore this email.
    If you have a sneaking suspicion that something is amiss, please contact Joel at <joelsfoster@gmail.com> (yes, the CEO answers support requests).`;
  },
};
