/* eslint-disable no-undef */

import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';


let component;

const handleRecovery = () => {
  Accounts.forgotPassword({
    email: document.querySelector('[name="emailAddress"]').value,
  }, (error) => {
    if (error) {
      Bert.alert({
        title: "Whoops! Try again, friend.",
        message: error.reason + ".",
        type: 'warning',
      });
    } else {
      Bert.alert({
        title: "Password reset link sent!",
        message: "Check your inbox for instructions.",
        type: 'success',
      });
    }
  });
};

const validate = () => {
  $(component.recoverPasswordForm).validate({
    rules: {
      emailAddress: {
        required: true,
        email: true,
      },
    },
    messages: {
      emailAddress: {
        required: "Whoops! Forgot to fill in the most important thing...",
        email: "That's definitely not a legit email address...",
      },
    },
    submitHandler() { handleRecovery(); },
  });
};

export default function handleRecoverPassword(options) { // Looking to receive "{ component: this }" from RecoverPassword.js
  component = options.component;
  validate();
}
