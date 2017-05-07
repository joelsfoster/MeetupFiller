import './accounts/email-templates';
import './browser-policy';
import './fixtures';
import './api';
import './environment-variables';
import './crons/index';

/*
discountSettings database holds the discount settings for each event for each account
the cron sends a link to the discount and logs the email was sent
the link goes to my page, which runs scripts to check availability and redirect to payment portal
...

*/
