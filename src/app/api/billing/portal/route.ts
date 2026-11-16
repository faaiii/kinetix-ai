import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUserSession } from '@/lib/auth';
import { getAdminClient } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getUserSession(req);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_mock')) {
      return NextResponse.json({
        portalUrl: `${appUrl}/settings?portal_simulated=true`,
        simulated: true,
      });
    }

    // Look up Stripe customer id for the organization
    const admin = getAdminClient();
    const { data: org } = await admin
      .from('organizations')
      .select('stripe_customer_id')
      .eq('id', session.organizationId)
      .single();

    let customerId = org?.stripe_customer_id;

    if (!customerId) {
      // Find or create customer in Stripe
      const existing = await stripe.customers.list({
        email: session.email,
        limit: 1,
      });

      if (existing.data.length > 0) {
        customerId = existing.data[0].id;
      } else {
        const created = await stripe.customers.create({
          email: session.email,
          metadata: {
            userId: session.userId,
            organizationId: session.organizationId,
          },
        });
        customerId = created.id;
      }
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/settings`,
    });

    return NextResponse.json({ portalUrl: portalSession.url });
  } catch (error: any) {
    console.error('Stripe Portal Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create billing portal session' },
      { status: 400 }
    );
  }
}
