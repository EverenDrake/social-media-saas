const express = require('express');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');
const { subscriptions } = require('../services/subscriptionService');

const router = express.Router();

// Get subscription details
router.get('/', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.userId });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subscription plan
router.patch('/plan', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    const subscription = await Subscription.findOne({ user: req.userId });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Update the subscription plan
    if (plan && subscriptions[plan]) {
      subscription.plan = plan; // Update the plan
      subscription.updateLimits(); // Update limits based on new plan
      await subscription.save();
      res.json({ message: 'Subscription plan updated successfully', subscription });
    } else {
      res.status(400).json({ message: 'Invalid subscription plan' });
    }
  } catch (error) {
    console.error('Update subscription plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

