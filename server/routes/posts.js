const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const SocialAccount = require('../models/SocialAccount');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/posts';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Get all posts for a user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, platform } = req.query;
    const query = { user: req.userId };

    if (status) query.status = status;
    if (platform) query['platforms.platform'] = platform;

    const posts = await Post.find(query)
      .populate('platforms.socialAccount', 'platform accountName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single post
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.userId })
      .populate('platforms.socialAccount', 'platform accountName profileImage');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new post
router.post('/', auth, upload.array('media', 5), async (req, res) => {
  try {
    const { content, platforms, scheduledAt, timezone, tags } = req.body;

    // Check subscription limits
    const subscription = await Subscription.findOne({ user: req.userId });
    if (subscription.hasReachedLimit('posts')) {
      return res.status(403).json({ 
        message: 'You have reached your monthly post limit. Please upgrade your plan.' 
      });
    }

    // Validate platforms and social accounts
    const platformsArray = JSON.parse(platforms);
    const socialAccounts = await SocialAccount.find({
      user: req.userId,
      _id: { $in: platformsArray.map(p => p.socialAccount) },
      isActive: true
    });

    if (socialAccounts.length !== platformsArray.length) {
      return res.status(400).json({ 
        message: 'One or more social accounts are not valid or inactive' 
      });
    }

    // Process uploaded media
    const media = req.files ? req.files.map(file => ({
      type: file.mimetype.startsWith('video') ? 'video' : 'image',
      url: `/uploads/posts/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype
    })) : [];

    // Create post
    const post = new Post({
      user: req.userId,
      content,
      media,
      platforms: platformsArray.map(p => ({
        platform: p.platform,
        socialAccount: p.socialAccount,
        status: 'scheduled'
      })),
      scheduledAt: new Date(scheduledAt),
      timezone: timezone || 'UTC',
      status: 'scheduled',
      tags: tags ? JSON.parse(tags) : []
    });

    await post.save();

    // Update subscription usage
    subscription.usage.postsThisMonth += 1;
    await subscription.save();

    const populatedPost = await Post.findById(post._id)
      .populate('platforms.socialAccount', 'platform accountName');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a post
router.put('/:id', auth, upload.array('media', 5), async (req, res) => {
  try {
    const { content, platforms, scheduledAt, timezone, tags } = req.body;

    const post = await Post.findOne({ _id: req.params.id, user: req.userId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post can be modified
    if (post.status === 'posted') {
      return res.status(400).json({ message: 'Cannot modify a posted post' });
    }

    // Update fields
    if (content !== undefined) post.content = content;
    if (scheduledAt) post.scheduledAt = new Date(scheduledAt);
    if (timezone) post.timezone = timezone;
    if (tags) post.tags = JSON.parse(tags);

    // Handle new media uploads
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map(file => ({
        type: file.mimetype.startsWith('video') ? 'video' : 'image',
        url: `/uploads/posts/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      }));
      post.media = [...post.media, ...newMedia];
    }

    // Update platforms if provided
    if (platforms) {
      const platformsArray = JSON.parse(platforms);
      const socialAccounts = await SocialAccount.find({
        user: req.userId,
        _id: { $in: platformsArray.map(p => p.socialAccount) },
        isActive: true
      });

      if (socialAccounts.length !== platformsArray.length) {
        return res.status(400).json({ 
          message: 'One or more social accounts are not valid or inactive' 
        });
      }

      post.platforms = platformsArray.map(p => ({
        platform: p.platform,
        socialAccount: p.socialAccount,
        status: 'scheduled'
      }));
    }

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('platforms.socialAccount', 'platform accountName');

    res.json(populatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.userId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete associated media files
    if (post.media && post.media.length > 0) {
      post.media.forEach(mediaItem => {
        const filePath = path.join(__dirname, '..', mediaItem.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a scheduled post
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.userId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.status !== 'scheduled') {
      return res.status(400).json({ message: 'Only scheduled posts can be cancelled' });
    }

    post.status = 'cancelled';
    await post.save();

    res.json({ message: 'Post cancelled successfully', post });
  } catch (error) {
    console.error('Cancel post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
