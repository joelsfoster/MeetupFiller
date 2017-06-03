import { Meteor } from 'meteor/meteor';
import { paymentSaleCompleted } from './paymentSaleCompleted.js';

const scenarios = {
  'PAYMENT.SALE.COMPLETED': paymentSaleCompleted,
};

const handler = ({ body }) => {
  try {
    const type = body.event_type;
    const data = body.resource;
    const scenario = scenarios[type];
    if (scenario) scenario(data);
  } catch (exception) {
    throw new Meteor.Error('500', `[paypalHandler.handler] ${exception}`);
  }
};

export const paypalHandler = (options) => {
  handler(options);
}
