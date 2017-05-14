let module;

const handler = (data, promise) => {
  try {
    module = promise;
    console.log(data);
  } catch (exception) {
    module.reject(`[chargeSucceeded.handler] ${exception}`);
  }
};

export const chargeSucceeded = (data) => handler(data);

// change this to be paypal's webhook 
