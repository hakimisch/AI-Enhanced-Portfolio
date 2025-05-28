// pages/api/paypal/create-order.js
import paypalClient from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '100.00', // Replace with the actual amount
        },
      }],
    });

    try {
      const order = await paypalClient().execute(request);
      res.status(200).json({ id: order.result.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}