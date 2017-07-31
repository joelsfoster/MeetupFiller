import React from 'react';
import { Alert } from 'react-bootstrap';

// Used to link to "{ window.location.pathname }". Where did that come from?
const NotFound = () => (
  <div className="NotFound">
    <Alert bsStyle="danger">
      <h1><strong>[404] - Don't panic! The link must be broken, contact the Meetup organizer for more details.</strong></h1>
      <h3>Click <a href="https://www.meetup.com">here</a> to go back to Meetup.</h3>
    </Alert>
    <br />
    <img src="images/404-fail.gif" alt="404-fail" />
  </div>
);

export default NotFound;
