import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27.acacia' as any,
  typescript: true,
});

export const STRIPE_PLANS = {
  pro: {
    name: 'Kinetix Pro',
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_mock_pro_monthly',
    amount: 2000, // $20.00 in cents
    currency: 'usd',
  },
  team: {
    name: 'Kinetix Team',
    priceId: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID || 'price_mock_team_monthly',
    amount: 3000, // $30.00 per seat in cents
    currency: 'usd',
  },
};
