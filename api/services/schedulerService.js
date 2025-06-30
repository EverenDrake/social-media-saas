const nodeCron = require('node-cron');
const moment = require('moment-timezone');
const { supabase } = require('../config/supabase');

const schedulerService = {
  init() {
    // Schedule tasks to run every minute
    nodeCron.schedule('*/1 * * * *', () => {
      this.checkScheduledPosts();
    });
  },

  async checkScheduledPosts() {
    try {
      const now = new Date().toISOString();
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .lte('scheduled_at', now)
        .eq('status', 'scheduled');

      if (error) throw error;
      if (!posts || posts.length === 0) return;

      for (const post of posts) {
        // Pretend to post to social media platforms
        await this.postToPlatforms(post);

        post.status = 'posted';
        post.platforms = post.platforms.map(p => ({
          ...p,
          status: 'posted',
          postedAt: now
        }));
        await supabase
          .from('posts')
          .update({ status: 'posted', platforms: post.platforms })
          .eq('id', post.id);
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
