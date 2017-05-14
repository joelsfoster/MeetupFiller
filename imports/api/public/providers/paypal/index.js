import { Meteor } from 'meteor/meteor';
import { chargeSucceeded } from './charge-succeeded.js';

const scenarios = {
  'charge.succeeded': chargeSucceeded,
};

const handler = ({ body }) => {
  try {
    const { type, data } = body;
    const scenario = scenarios[type];
    if (scenario) scenario(data.object);
  } catch (exception) {
    throw new Meteor.Error('500', `[paypalHandler.handler] ${exception}`);
  }
};

export const paypalHandler = (options) => handler(options);
