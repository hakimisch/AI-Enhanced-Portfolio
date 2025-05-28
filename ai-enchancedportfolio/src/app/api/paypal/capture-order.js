// pages/api/paypal/capture-order.js
import paypalClient from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
      const capture = await paypalClient().execute(request);
      res.status(200).json({ capture });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}