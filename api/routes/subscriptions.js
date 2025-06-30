const express = require('express');
const { supabase } = require('../config/supabase');
const auth = require('../middleware/auth');
const { subscriptions } = require('../services/subscriptionService');

const router = express.Router();

// Get subscription details
router.get('/', auth, async (req, res) => {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.userId)
      .single();

    if (error || !subscription) {
      // Return default free subscription if not found
      return res.json({
        plan: 'free',
        status: 'active',
        limits: {
          posts: 10,
          socialAccounts: 3,
          analytics: false,
          bulkUpload: false,
          teamMembers: 1
        },
        usage: {
          postsThisMonth: 0,
          socialAccountsConnected: 0
        }
      });
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
    
    if (!plan || !subscriptions[plan]) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    // Update limits based on plan
    const planLimits = subscriptions[plan].limits;
    
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: req.userId,
        plan,
        limits: planLimits,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json({ message: 'Subscription plan updated successfully', subscription });
  } catch (error) {
    console.error('Update subscription plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

