let action;

const handler = (data, promise) => {
  try {
    action = promise;
    console.log(data);
    console.log("WebhookID: " + data.id);
    console.log("Status: " + data.state);
    // If good data is returned, log a rsvpTime in the DiscountLog table
    // Use the return URL's _id
  } catch (exception) {
    action.reject(`[paymentSaleCompleted.handler] ${exception}`);
  }
};

export const paymentSaleCompleted = (data) => handler(data);


/*
Example data:

{
  id: '80021663DE681814L',
  create_time: '2014-10-23T17:22:56Z',
  update_time: '2014-10-23T17:23:04Z',
  amount: { total: '0.48', currency: 'USD' },
  payment_mode: 'ECHECK',
  state: 'completed',
  protection_eligibility: 'ELIGIBLE',
  protection_eligibility_type: 'ITEM_NOT_RECEIVED_ELIGIBLE,UNAUTHORIZED_PAYMENT_ELIGIBLE',
  clearing_time: '2014-10-30T07:00:00Z',
  parent_payment: 'PAY-1PA12106FU478450MKRETS4A',
  links:
  [ { href: 'https://api.paypal.com/v1/payments/sale/80021663DE681814L',
    rel: 'self',
    method: 'GET' },
    { href: 'https://api.paypal.com/v1/payments/sale/80021663DE681814L/refund',
    rel: 'refund',
    method: 'POST' },
    { href: 'https://api.paypal.com/v1/payments/payment/PAY-1PA12106FU478450MKRETS4A',
    rel: 'parent_payment',
    method: 'GET' } ]
}

*/
