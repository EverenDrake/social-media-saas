const express = require('express');
const SocialAccount = require('../models/SocialAccount');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all connected social accounts
router.get('/', auth, async (req, res) => {
  try {
    const socialAccounts = await SocialAccount.find({ user: req.userId })
      .select('-accessToken -refreshToken')
      .sort({ connectedAt: -1 });

    res.json(socialAccounts);
  } catch (error) {
    console.error('Get social accounts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Connect a new social account (mock implementation)
router.post('/connect', auth, async (req, res) => {
  try {
    const { platform, accountName, accountId } = req.body;

    // Check subscription limits
    const subscription = await Subscription.findOne({ user: req.userId });
    if (subscription.hasReachedLimit('socialAccounts')) {
      return res.status(403).json({ 
        message: 'You have reached your social account limit. Please upgrade your plan.' 
      });
    }

    // Check if account is already connected
    const existingAccount = await SocialAccount.findOne({
      user: req.userId,
      platform,
      accountId
    });

    if (existingAccount) {
      return res.status(400).json({ 
        message: 'This social account is already connected' 
      });
    }

    // Create new social account connection
    // In a real implementation, you would:
    // 1. Redirect to OAuth flow
    // 2. Exchange authorization code for access token
    // 3. Store encrypted tokens
    const socialAccount = new SocialAccount({
      user: req.userId,
      platform,
      accountId,
      accountName,
      accessToken: 'mock-access-token', // In production, this would be encrypted
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${accountName}`,
      followers: Math.floor(Math.random() * 10000),
      following: Math.floor(Math.random() * 1000)
    });

    await socialAccount.save();

    // Update subscription usage
    subscription.usage.socialAccountsConnected += 1;
    await subscription.save();

    // Return account without sensitive data
    const safeAccount = await SocialAccount.findById(socialAccount._id)
      .select('-accessToken -refreshToken');

    res.status(201).json({
      message: 'Social account connected successfully',
      account: safeAccount
    });
  } catch (error) {
    console.error('Connect social account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Disconnect a social account
router.delete('/:id', auth, async (req, res) => {
  try {
    const socialAccount = await SocialAccount.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!socialAccount) {
      return res.status(404).json({ message: 'Social account not found' });
    }

    await SocialAccount.findByIdAndDelete(req.params.id);

    // Update subscription usage
    const subscription = await Subscription.findOne({ user: req.userId });
    if (subscription.usage.socialAccountsConnected > 0) {
      subscription.usage.socialAccountsConnected -= 1;
      await subscription.save();
    }

    res.json({ message: 'Social account disconnected successfully' });
  } catch (error) {
    console.error('Disconnect social account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update social account settings
router.patch('/:id', auth, async (req, res) => {
  try {
    const { isActive } = req.body;

    const socialAccount = await SocialAccount.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!socialAccount) {
      return res.status(404).json({ message: 'Social account not found' });
    }

    if (isActive !== undefined) {
      socialAccount.isActive = isActive;
    }

    await socialAccount.save();

    const safeAccount = await SocialAccount.findById(socialAccount._id)
      .select('-accessToken -refreshToken');

    res.json({
      message: 'Social account updated successfully',
      account: safeAccount
    });
  } catch (error) {
    console.error('Update social account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh social account data (mock implementation)
router.post('/:id/refresh', auth, async (req, res) => {
  try {
    const socialAccount = await SocialAccount.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!socialAccount) {
      return res.status(404).json({ message: 'Social account not found' });
    }

    // In a real implementation, you would:
    // 1. Refresh access token if needed
    // 2. Fetch updated profile data from the platform
    // 3. Update follower counts, etc.

    // Mock update
    socialAccount.followers = Math.floor(Math.random() * 10000);
    socialAccount.following = Math.floor(Math.random() * 1000);
    socialAccount.lastSyncAt = new Date();

    await socialAccount.save();

    const safeAccount = await SocialAccount.findById(socialAccount._id)
      .select('-accessToken -refreshToken');

    res.json({
      message: 'Social account data refreshed successfully',
      account: safeAccount
    });
  } catch (error) {
    console.error('Refresh social account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
