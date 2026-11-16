import { NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe, STRIPE_PLANS } from '@/lib/stripe';
import { getUserSession } from '@/lib/auth';

const checkoutSchema = z.object({
  planTier: z.enum(['pro', 'team']),
  seats: z.number().int().min(1).default(1),
});

export async function POST(req: Request) {
  try {
    const session = await getUserSession(req);
    const body = await req.json();
    const validated = checkoutSchema.parse(body);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const plan = STRIPE_PLANS[validated.planTier];

    // If stripe is in mock mode (no valid key), return simulated checkout URL
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_mock')) {
      return NextResponse.json({
        checkoutUrl: `${appUrl}/settings?checkout_success=true&tier=${validated.planTier}`,
        simulated: true,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: plan.currency,
            product_data: {
              name: plan.name,
              description: 'Kinetix Pro Subscription - Unconstrained AI Workspace',
            },
            unit_amount: plan.amount,
            recurring: { interval: 'month' },
          },
          quantity: validated.seats,
        },
      ],
      customer_email: session.email,
      metadata: {
        userId: session.userId,
        organizationId: session.organizationId,
        planTier: validated.planTier,
      },
      success_url: `${appUrl}/settings?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${appUrl}/settings?canceled=true`,
    });

    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 400 }
    );
  }
}
