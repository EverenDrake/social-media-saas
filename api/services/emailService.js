const sgMail = require('@sendgrid/mail');

// Only set API key if it exists and is not a placeholder
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid API key configured');
} else {
  console.log('⚠️ SendGrid API key not configured or invalid format');
}

class EmailService {
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@socialsync.com';
  }

  async sendWelcomeEmail(user) {
    // Check if SendGrid is properly configured
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.includes('your-')) {
      console.log(`Welcome email would be sent to ${user.email} (SendGrid not configured)`);
      return;
    }

    const msg = {
      to: user.email,
      from: this.fromEmail,
      subject: 'Welcome to SocialSync!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5;">Welcome to SocialSync!</h1>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2>Hi ${user.username},</h2>
            <p>Thank you for joining SocialSync! We're excited to help you automate your social media posting across multiple platforms.</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3>🚀 What you can do with SocialSync:</h3>
            <ul>
              <li>Schedule posts across Twitter, Facebook, Instagram, LinkedIn, and TikTok</li>
              <li>Manage multiple social media accounts from one dashboard</li>
              <li>Track your social media performance with analytics</li>
              <li>Collaborate with your team members</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/dashboard" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Get Started
            </a>
          </div>
          
          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center; color: #6B7280; font-size: 14px;">
            <p>Need help? Contact us at support@socialsync.com</p>
            <p>© 2024 SocialSync. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendPostScheduledNotification(user, post) {
    const msg = {
      to: user.email,
      from: this.fromEmail,
      subject: 'Post Scheduled Successfully',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #4F46E5;">Post Scheduled Successfully</h1>
          
          <div style="background: #F0FDF4; border: 1px solid #22C55E; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>✅ Your post has been scheduled!</strong></p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
            <h3>Post Details:</h3>
            <p><strong>Content:</strong> ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
            <p><strong>Scheduled for:</strong> ${new Date(post.scheduledAt).toLocaleString()}</p>
            <p><strong>Platforms:</strong> ${post.platforms.map(p => p.platform).join(', ')}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/posts" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View All Posts
            </a>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Post scheduled notification sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending post scheduled email:', error);
    }
  }

  async sendPostFailedNotification(user, post, error) {
    const msg = {
      to: user.email,
      from: this.fromEmail,
      subject: 'Post Failed to Publish',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #DC2626;">Post Failed to Publish</h1>
          
          <div style="background: #FEF2F2; border: 1px solid #DC2626; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>❌ Your scheduled post failed to publish</strong></p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
            <h3>Post Details:</h3>
            <p><strong>Content:</strong> ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
            <p><strong>Was scheduled for:</strong> ${new Date(post.scheduledAt).toLocaleString()}</p>
            <p><strong>Error:</strong> ${error}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/posts" 
               style="background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Check Your Posts
            </a>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Post failed notification sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending post failed email:', error);
    }
  }

  async sendSubscriptionChangedNotification(user, subscription, oldPlan) {
    const msg = {
      to: user.email,
      from: this.fromEmail,
      subject: 'Subscription Plan Updated',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #4F46E5;">Subscription Plan Updated</h1>
          
          <div style="background: #F0FDF4; border: 1px solid #22C55E; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>✅ Your subscription has been updated!</strong></p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
            <h3>Changes:</h3>
            <p><strong>Previous Plan:</strong> ${oldPlan}</p>
            <p><strong>New Plan:</strong> ${subscription.plan}</p>
            <p><strong>Status:</strong> ${subscription.status}</p>
            
            <h4>Your new limits:</h4>
            <ul>
              <li>Posts per month: ${subscription.limits.posts === -1 ? 'Unlimited' : subscription.limits.posts}</li>
              <li>Social accounts: ${subscription.limits.socialAccounts === -1 ? 'Unlimited' : subscription.limits.socialAccounts}</li>
              <li>Analytics: ${subscription.limits.analytics ? 'Included' : 'Not included'}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/settings" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Settings
            </a>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Subscription changed notification sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending subscription changed email:', error);
    }
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const msg = {
      to: user.email,
      from: this.fromEmail,
      subject: 'Reset Your Password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #4F46E5;">Reset Your Password</h1>
          
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Hi ${user.username},</p>
            <p>You requested to reset your password for your SocialSync account. Click the button below to create a new password:</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <div style="background: #FEF2F2; border: 1px solid #DC2626; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>⚠️ Security Notice:</strong></p>
            <p>This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.</p>
          </div>
          
          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center; color: #6B7280; font-size: 14px;">
            <p>If the button doesn't work, copy and paste this link:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }
}

module.exports = new EmailService();
