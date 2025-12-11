// File: /api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          // Use the price from your Vercel environment variable
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/result.html`,
      cancel_url: `${req.headers.origin}/payment.html`,
    });

    // Always return JSON so the frontend can safely do response.json()
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    // JSON on error too
    return res.status(500).json({ error: err.message });
  }
}
