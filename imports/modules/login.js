/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';

// This is fed component.props data from componentDidMount in Login.js
let component;

// Function to log a user in using data pulled from the login page UI, validate with a Meteor method, and redirect to the nextPathname
const login = () => {
  const email = document.querySelector('[name="emailAddress"]').value; // Fed from the FormControl component, onSubmit, handleSubmit
  const password = document.querySelector('[name="password"]').value; // Fed from the FormControl component, onSubmit, handleSubmit

  Meteor.loginWithPassword(email, password, (error) => { // Need to learn more about basic Meteor login functionality
    if (error) {
      Bert.alert(error.reason, 'warning'); // Not working currently. Manually update?
    } else {
      Bert.alert('Logged in!', 'success'); // Not working currently. Manually update?

      const { location } = component.props; // What do the brackets indicate?
      if (location.state && location.state.nextPathname) {
        browserHistory.push(location.state.nextPathname);
      } else {
        browserHistory.push('/');
      }
    }
  });
};

// Function that sends feedback messages to the UI when username/password is incorrect
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
        required: "Hint: 'Open Sesame' won't get you anywhere", 
      },
    },
    submitHandler() { login(); }, // On submitting the loginForm, run the login function above
  });
};

// Used in the "componentDidMount" portion of Login.js
export default function handleLogin(options) { // "{ component: this }" is what gets passed here from Login.js
  component = options.component;
  validate();
}
