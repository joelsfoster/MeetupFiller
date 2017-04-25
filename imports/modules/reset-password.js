/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';


let component;
let token;

const handleReset = () => {
  const password = document.querySelector('[name="newPassword"]').value;
  Accounts.resetPassword(token, password, (error) => {
    if (error) {
      Bert.alert({
        title: "Hold on there!",
        message: error.reason + ".",
        type: 'danger',
      });
    } else {
      browserHistory.push('/');
      Bert.alert({
        title: "Success!",
        message: "Your password has been reset",
        type: 'success',
      });
    }
  });
};

const validate = () => {
  $(component.resetPasswordForm).validate({
    rules: {
      newPassword: {
        required: true,
        minlength: 8,
      },
      repeatNewPassword: {
        required: true,
        minlength: 8,
        equalTo: '[name="newPassword"]',
      },
    },
    messages: {
      newPassword: {
        required: "This is what you came here for, what are you waiting for?",
        minlength: "Please use at least 8 characters. It's much safer, believe us.",
      },
      repeatNewPassword: {
        required: "Now make sure you got it right...",
        equalTo: "Hold on, fast fingers! Your passwords don't match.",
      },
    },
    submitHandler() { handleReset(); },
  });
};

export default function handleResetPassword(options) { // Expects "{ component: this, token: this.props.params.token }" from ResetPassword.js
  component = options.component;
  token = options.token;
  validate();
}
