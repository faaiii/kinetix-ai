import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getAdminClient } from '@/lib/db';

// Set of processed event IDs to guarantee idempotency across Stripe retries
const processedEventIds = new Set<string>();

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('Stripe webhook received without signature or secret configured.');
    return NextResponse.json({ received: true, simulated: true });
  }

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Idempotency check
  if (processedEventIds.has(event.id)) {
    console.log(`Stripe event ${event.id} already processed. Skipping duplicate.`);
    return NextResponse.json({ received: true, duplicate: true });
  }
  processedEventIds.add(event.id);

  const admin = getAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orgId = session.metadata?.organizationId;
        const planTier = session.metadata?.planTier || 'pro';
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (orgId) {
          await admin
            .from('organizations')
            .update({
              plan_tier: planTier,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', orgId);
          console.log(`Organization ${orgId} upgraded to ${planTier}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const status = subscription.status;

        const planTier = status === 'active' ? 'pro' : 'free';
        await admin
          .from('organizations')
          .update({
            plan_tier: planTier,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // One-click downgrade to free tier upon cancellation
        await admin
          .from('organizations')
          .update({
            plan_tier: 'free',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
        console.log(`Subscription deleted. Customer ${customerId} reset to free tier.`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.warn(`Payment failed for invoice ${invoice.id}, customer: ${invoice.customer}`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error handling Stripe webhook:', err);
    return NextResponse.json(
      { error: 'Webhook processing error' },
      { status: 500 }
    );
  }
}
