import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as any,
});

export async function createVirtualCard(
  userId: string,
  amount: number,
  currency: string = 'usd'
): Promise<{ cardLast4: string; cardId: string } | null> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Stripe not configured, returning stub card');
    return {
      cardLast4: '4242',
      cardId: `stub_${Date.now()}`,
    };
  }

  try {
    const card = await stripe.issuing.cards.create({
      cardholder: userId,
      currency,
      type: 'virtual',
      spending_controls: {
        spending_limits: [
          {
            amount: Math.round(amount * 100),
            interval: 'daily',
          },
        ],
      },
    });

    return {
      cardLast4: '4242',
      cardId: card.id,
    };
  } catch (error) {
    console.error('Failed to create virtual card:', error);
    return null;
  }
}

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  paymentMethodId?: string
): Promise<{ clientSecret: string } | null> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { clientSecret: 'stub_secret' };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method: paymentMethodId,
      capture_method: 'manual',
    });

    return { clientSecret: paymentIntent.client_secret || '' };
  } catch (error) {
    console.error('Failed to create payment intent:', error);
    return null;
  }
}

export { stripe };