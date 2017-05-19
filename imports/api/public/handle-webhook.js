import { paypalHandler } from './providers/paypal/index.js';

let action;

const providers = {
  paypal: paypalHandler,
};

const handler = ({ provider, request }, promise) => {
  try {
    action = promise;
    const targetProvider = providers[provider];
    if (targetProvider) targetProvider({ body: request.body });
    action.resolve('Webhook received!');
  } catch (exception) {
    action.reject(`[handleWebhook.handler] ${exception}`);
  }
};

export const handleWebhook = (options) =>
new Promise((resolve, reject) =>
handler(options, { resolve, reject }));
