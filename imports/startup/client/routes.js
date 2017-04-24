import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/layouts/App.js'; // Layout = main app that pages sit on top of
import Documents from '../../ui/pages/Documents.js'; // Pages = individual web pages
import NewDocument from '../../ui/pages/NewDocument.js';
import EditDocument from '../../ui/containers/EditDocument.js'; // Containers = data layer wrapped around React components
import ViewDocument from '../../ui/containers/ViewDocument.js';
import Index from '../../ui/pages/Index.js';
import Login from '../../ui/pages/Login.js';
import NotFound from '../../ui/pages/NotFound.js';
import RecoverPassword from '../../ui/pages/RecoverPassword.js';
import ResetPassword from '../../ui/pages/ResetPassword.js';
import Signup from '../../ui/pages/Signup.js';

// Function to authenticate when loading private pages. Redirects to login page if "Meteor.userId" doesn't detect a user
const authenticate = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) { 
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

// When Meteor starts up, it renders the following self-explanatory things.
Meteor.startup(() => {
  render(
    /* How does browserHistory work? */
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index } />
        <Route name="documents" path="/documents" component={ Documents } onEnter={ authenticate } />
        <Route name="newDocument" path="/documents/new" component={ NewDocument } onEnter={ authenticate } />
        <Route name="editDocument" path="/documents/:_id/edit" component={ EditDocument } onEnter={ authenticate } />
        <Route name="viewDocument" path="/documents/:_id" component={ ViewDocument } onEnter={ authenticate } />
        <Route name="login" path="/login" component={ Login } />
        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        <Route name="signup" path="/signup" component={ Signup } />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root')
  );
});
