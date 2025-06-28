const express = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const SocialAccount = require('../models/SocialAccount');
const moment = require('moment');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { timeRange = '30d' } = req.query;
    
    // Calculate date range
    let startDate;
    switch (timeRange) {
      case '7d':
        startDate = moment().subtract(7, 'days').toDate();
        break;
      case '30d':
        startDate = moment().subtract(30, 'days').toDate();
        break;
      case '90d':
        startDate = moment().subtract(90, 'days').toDate();
        break;
      default:
        startDate = moment().subtract(30, 'days').toDate();
    }

    // Get posts in date range
    const posts = await Post.find({
      user: userId,
      createdAt: { $gte: startDate }
    }).populate('platforms.socialAccount');

    // Calculate analytics
    const totalPosts = posts.length;
    const postedPosts = posts.filter(post => post.status === 'posted');
    const scheduledPosts = posts.filter(post => post.status === 'scheduled');
    const failedPosts = posts.filter(post => post.status === 'failed');

    // Calculate total engagement
    const totalEngagement = posts.reduce((sum, post) => {
      return sum + (post.analytics.likes || 0) + 
                   (post.analytics.shares || 0) + 
                   (post.analytics.comments || 0);
    }, 0);

    const totalReach = posts.reduce((sum, post) => {
      return sum + (post.analytics.views || 0);
    }, 0);

    const totalClicks = posts.reduce((sum, post) => {
      return sum + (post.analytics.clicks || 0);
    }, 0);

    // Platform breakdown
    const platformStats = {};
    posts.forEach(post => {
      post.platforms.forEach(platform => {
        if (!platformStats[platform.platform]) {
          platformStats[platform.platform] = {
            platform: platform.platform,
            posts: 0,
            engagement: 0,
            reach: 0
          };
        }
        platformStats[platform.platform].posts += 1;
        platformStats[platform.platform].engagement += 
          (post.analytics.likes || 0) + (post.analytics.shares || 0) + (post.analytics.comments || 0);
        platformStats[platform.platform].reach += (post.analytics.views || 0);
      });
    });

    // Daily stats for chart
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      const dayPosts = posts.filter(post => 
        moment(post.createdAt).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
      );
      
      dailyStats.push({
        date: date.format('MMM DD'),
        posts: dayPosts.length,
        engagement: dayPosts.reduce((sum, post) => 
          sum + (post.analytics.likes || 0) + (post.analytics.shares || 0) + (post.analytics.comments || 0), 0
        )
      });
    }

    const analytics = {
      totalPosts,
      postedPosts: postedPosts.length,
      scheduledPosts: scheduledPosts.length,
      failedPosts: failedPosts.length,
      totalReach,
      totalEngagement,
      totalClicks,
      engagementRate: totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(2) : 0,
      platformBreakdown: Object.values(platformStats),
      dailyStats,
      timeRange
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed post analytics
router.get('/posts', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { platform, timeRange = '30d' } = req.query;
    
    let startDate;
    switch (timeRange) {
      case '7d':
        startDate = moment().subtract(7, 'days').toDate();
        break;
      case '30d':
        startDate = moment().subtract(30, 'days').toDate();
        break;
      case '90d':
        startDate = moment().subtract(90, 'days').toDate();
        break;
      default:
        startDate = moment().subtract(30, 'days').toDate();
    }

    let query = {
      user: userId,
      createdAt: { $gte: startDate },
      status: 'posted'
    };

    if (platform) {
      query['platforms.platform'] = platform;
    }

    const posts = await Post.find(query)
      .populate('platforms.socialAccount', 'platform accountName')
      .sort({ createdAt: -1 })
      .limit(50);

    const analytics = posts.map(post => ({
      id: post._id,
      content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
      platforms: post.platforms.map(p => p.platform),
      publishedAt: post.platforms[0]?.postedAt,
      analytics: post.analytics,
      engagementRate: post.analytics.views > 0 ? 
        (((post.analytics.likes + post.analytics.shares + post.analytics.comments) / post.analytics.views) * 100).toFixed(2) : 0
    }));

    res.json(analytics);
  } catch (error) {
    console.error('Get post analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post analytics (webhook endpoint for social platforms)
router.post('/update/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { views, likes, shares, comments, clicks } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update analytics
    if (views !== undefined) post.analytics.views = views;
    if (likes !== undefined) post.analytics.likes = likes;
    if (shares !== undefined) post.analytics.shares = shares;
    if (comments !== undefined) post.analytics.comments = comments;
    if (clicks !== undefined) post.analytics.clicks = clicks;

    await post.save();

    res.json({ message: 'Analytics updated successfully' });
  } catch (error) {
    console.error('Update analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
