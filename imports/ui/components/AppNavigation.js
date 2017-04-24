import React from 'react';
import { Navbar } from 'react-bootstrap'; // Need to get more familiar with this (and .Header, .Brand, .Toggle, and .Collapse)
import { Link } from 'react-router';
import PublicNavigation from './PublicNavigation.js';
import AuthenticatedNavigation from './AuthenticatedNavigation.js';
import { composeWithTracker } from 'react-komposer'; // Added after combining the container file with this one
import { Meteor } from 'meteor/meteor'; // Added after combining the container file with this one

// This function dictates what type of navigation component is displayed. It uses "hasUser" (see below)...
const renderNavigation = hasUser => (hasUser ? <AuthenticatedNavigation /> : <PublicNavigation />);

// AppNavigation is rendered because App.js is rendered in routes.js
const AppNavigation = ({ hasUser }) => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">MeetupFiller</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      { renderNavigation(hasUser) }
    </Navbar.Collapse>
  </Navbar>
);

// ...AppNavigation expects "hasUser", an object that the container (react-komposer) feeds it (see below)...
AppNavigation.propTypes = {
  hasUser: React.PropTypes.object,
};

// ...Need more info on this. I assume on load, it pipes in Meteor.user(), which I also need to learn more about.
const composer = (props, onData) => onData(null, { hasUser: Meteor.user() });

// Why is this exported? What does it do? Need to learn more about this!
export default composeWithTracker(composer, {}, {}, { pure: false })(AppNavigation);
