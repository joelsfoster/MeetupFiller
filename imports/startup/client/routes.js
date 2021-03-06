import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/layouts/App.js';
import Documents from '../../ui/pages/Documents.js';
import NewDocument from '../../ui/pages/NewDocument.js';
import EditDocument from '../../ui/pages/EditDocument.js';
import ViewDocument from '../../ui/pages/ViewDocument.js';
import Index from '../../ui/pages/Index.js';
import Login from '../../ui/pages/Login.js';
import NotFound from '../../ui/pages/NotFound.js';
import RecoverPassword from '../../ui/pages/RecoverPassword.js';
import ResetPassword from '../../ui/pages/ResetPassword.js';
import Signup from '../../ui/pages/Signup.js';
import Admin from '../../ui/pages/Admin.js';
import RsvpPayment from '../../ui/pages/RsvpPayment.js';
import RsvpPaymentSuccess from '../../ui/pages/RsvpPaymentSuccess.js';
import RsvpPaymentCancelled from '../../ui/pages/RsvpPaymentCancelled.js';
import Snooze from '../../ui/pages/Snooze.js';


// Function to authenticate when loading private pages. Redirects to login page if "Meteor.userId" doesn't detect a user
const authenticate = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) { // Need to learn more about Meteor methods
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};


Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index } />
        <Route name="rsvp-payment" path="/rsvp-payment/:_id" component={ RsvpPayment } />
        <Route name="rsvp-payment-success" path="/rsvp-payment-success/:_id" component={ RsvpPaymentSuccess } />
        <Route name="rsvp-payment-cancelled" path="/rsvp-payment-cancelled/:_id" component={ RsvpPaymentCancelled } />
        <Route name="snooze" path="/snooze/:_id" component={ Snooze } />
        <Route name="documents" path="/documents" component={ Documents } onEnter={ authenticate } />
        <Route name="newDocument" path="/documents/new" component={ NewDocument } onEnter={ authenticate } />
        <Route name="editDocument" path="/documents/:_id/edit" component={ EditDocument } onEnter={ authenticate } />
        <Route name="viewDocument" path="/documents/:_id" component={ ViewDocument } onEnter={ authenticate } />
        <Route name="login" path="/login" component={ Login } />
        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        <Route name="admin" path="/admin" component={ Admin } onEnter={ authenticate } />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root')
  );
});

// Removed, to prevent public access of AdminTools:
// <Route name="signup" path="/signup" component={ Signup } />
