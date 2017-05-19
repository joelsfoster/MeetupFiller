let action;

const handler = (data, promise) => {
  try {
    action = promise;
    console.log("IT'S DATA TIME!!! Here we go...");
    console.log(data); // This is what I can change up
  } catch (exception) {
    action.reject(`[paymentSaleCompleted.handler] ${exception}`);
  }
};

export const paymentSaleCompleted = (data) => handler(data);
