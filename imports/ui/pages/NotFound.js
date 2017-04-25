import React from 'react';
import { Alert } from 'react-bootstrap';

// Used to link to "{ window.location.pathname }". Where did that come from?
const NotFound = () => (
  <div className="NotFound">
    <Alert bsStyle="danger">
      <h1><strong>[404] - Oh snap! This page doesn't exist!</strong></h1>
      <h3>Here's a funny gif of failure. Click <a href="/">here</a> to go back to the homepage.</h3>
    </Alert>
    <br />
    <img src="images/404-fail.gif" alt="404-fail" />
  </div>
);

export default NotFound;
