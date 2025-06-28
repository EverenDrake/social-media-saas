const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

const router = express.Router();

// Create Stripe Checkout Session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { priceId, planType } = req.body;
    const user = await User.findById(req.userId);

    // Create or retrieve customer
    let customer;
    const subscription = await Subscription.findOne({ user: req.userId });
    
    if (subscription?.stripeCustomerId) {
      customer = await stripe.customers.retrieve(subscription.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: req.userId
        }
      });
    }

    // Define price IDs for different plans
    const prices = {
      basic: 'price_basic_monthly', // Replace with actual Stripe price IDs
      pro: 'price_pro_monthly',
      enterprise: 'price_enterprise_monthly'
    };

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: prices[planType] || priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/settings?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.CLIENT_URL}/settings?canceled=true`,
      metadata: {
        userId: req.userId,
        planType: planType
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
});

// Stripe Webhook Handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Handle successful checkout
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const planType = session.metadata.planType;

  // Get subscription details from Stripe
  const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);

  // Update user subscription in database
  let subscription = await Subscription.findOne({ user: userId });
  if (!subscription) {
    subscription = new Subscription({ user: userId });
  }

  subscription.plan = planType;
  subscription.status = 'active';
  subscription.stripeCustomerId = session.customer;
  subscription.stripeSubscriptionId = session.subscription;
  subscription.stripePriceId = stripeSubscription.items.data[0].price.id;
  subscription.startDate = new Date(stripeSubscription.current_period_start * 1000);
  subscription.endDate = new Date(stripeSubscription.current_period_end * 1000);
  
  subscription.updateLimits();
  await subscription.save();

  console.log(`Subscription created for user ${userId} with plan ${planType}`);
}

// Handle successful payment
async function handleInvoicePaymentSucceeded(invoice) {
  const subscriptionId = invoice.subscription;
  
  // Update subscription status
  const subscription = await Subscription.findOne({ stripeSubscriptionId: subscriptionId });
  if (subscription) {
    subscription.status = 'active';
    
    // Reset monthly usage on new billing period
    const now = new Date();
    const lastReset = new Date(subscription.usage.lastResetDate);
    if (now.getMonth() !== lastReset.getMonth()) {
      subscription.usage.postsThisMonth = 0;
      subscription.usage.lastResetDate = now;
    }
    
    await subscription.save();
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(stripeSubscription) {
  const subscription = await Subscription.findOne({ 
    stripeSubscriptionId: stripeSubscription.id 
  });
  
  if (subscription) {
    subscription.status = stripeSubscription.status;
    subscription.endDate = new Date(stripeSubscription.current_period_end * 1000);
    await subscription.save();
  }
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(stripeSubscription) {
  const subscription = await Subscription.findOne({ 
    stripeSubscriptionId: stripeSubscription.id 
  });
  
  if (subscription) {
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.plan = 'free';
    subscription.updateLimits();
    await subscription.save();
  }
}

// Cancel subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.userId });
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    // Cancel at period end to let user use remaining time
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    res.json({ message: 'Subscription will be cancelled at the end of the billing period' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Error cancelling subscription' });
  }
});

// Get billing portal
router.post('/create-portal-session', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.userId });
    
    if (!subscription?.stripeCustomerId) {
      return res.status(404).json({ message: 'No customer found' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/settings`,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Create portal session error:', error);
    res.status(500).json({ message: 'Error creating portal session' });
  }
});

module.exports = router;
