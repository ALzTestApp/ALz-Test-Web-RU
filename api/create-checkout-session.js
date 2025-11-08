// File: /api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1SQf3lBYg24sYSSeW9aDGMje',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/result.html`,
        cancel_url: `${req.headers.origin}/payment.html`,
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
