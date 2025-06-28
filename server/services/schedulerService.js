const nodeCron = require('node-cron');
const moment = require('moment-timezone');
const Post = require('../models/Post');

const schedulerService = {
  init() {
    // Schedule tasks to run every minute
    nodeCron.schedule('*/1 * * * *', () => {
      this.checkScheduledPosts();
    });
  },

  async checkScheduledPosts() {
    try {
      const now = new Date();
      const posts = await Post.find({
        scheduledAt: { $lte: now },
        status: 'scheduled'
      });

      if (posts.length === 0) return;

      for (const post of posts) {
        // Pretend to post to social media platforms
        await this.postToPlatforms(post);

        post.status = 'posted';
        post.platforms.forEach(p => {
          p.status = 'posted';
          p.postedAt = now;
        });
        await post.save();
      }
    } catch (error) {
      console.error('Error checking scheduled posts:', error);
    }
  },

  async postToPlatforms(post) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Posted '${post.content}' to platforms at ${new Date().toISOString()}`);
        resolve();
      }, 1000); // Simulating network delay
    });
  }
};

module.exports = schedulerService;
