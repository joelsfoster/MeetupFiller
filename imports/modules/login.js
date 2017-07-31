/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';

let component;

const login = () => {
  const email = document.querySelector('[name="emailAddress"]').value;
  const password = document.querySelector('[name="password"]').value;

  Meteor.loginWithPassword(email, password, (error) => { // Need to learn more about basic Meteor login functionality
    if (error) {
      Bert.alert({
        title: "Whoops! Try again, friend.",
        message: error.reason + ".",
        type: 'warning',
      });
    } else {
      Bert.alert({
        title: "Welcome!",
        type: 'success',
      });

      const { location } = component.props; // What do the brackets indicate?
      if (location.state && location.state.nextPathname) {
        browserHistory.push(location.state.nextPathname);
      } else {
        browserHistory.push('/');
      }
    }
  });
};

const validate = () => {
  $(component.loginForm).validate({ // "loginForm" is the form (prop) that is used in Login.js
    rules: {
      emailAddress: {
        required: true,
        email: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      emailAddress: {
        required: "Whoops! Forgot to fill in the most important thing...",
        email: "That's definitely not a legit email address...",
      },
      password: {
        required: "Can't let you in without your password.",
      },
    },
    submitHandler() { login(); },
  });
};

// Used in the "componentDidMount" portion of Login.js
export default function handleLogin(options) { // "{ component: this }" is what gets passed here from Login.js
  component = options.component;
  validate();
}
