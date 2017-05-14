import { paypalHandler } from './providers/paypal';

let module;

const providers = {
  paypal: paypalHandler,
};

const handler = ({ provider, request }, promise) => {
  try {
    module = promise;
    const targetProvider = providers[provider];
    if (targetProvider) targetProvider({ body: request.body });
    module.resolve('Webhook received!');
  } catch (exception) {
    module.reject(`[handleWebhook.handler] ${exception}`);
  }
};

export const handleWebhook = (options) =>
new Promise((resolve, reject) =>
handler(options, { resolve, reject }));
