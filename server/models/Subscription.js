const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'past_due'],
    default: 'active'
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  stripePriceId: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  trialEndsAt: Date,
  cancelledAt: Date,
  limits: {
    posts: {
      type: Number,
      default: 10 // Free plan limit
    },
    socialAccounts: {
      type: Number,
      default: 3 // Free plan limit
    },
    analytics: {
      type: Boolean,
      default: false // Free plan doesn't include analytics
    },
    bulkUpload: {
      type: Boolean,
      default: false
    },
    teamMembers: {
      type: Number,
      default: 1
    }
  },
  usage: {
    postsThisMonth: {
      type: Number,
      default: 0
    },
    socialAccountsConnected: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to check if user has reached their limits
SubscriptionSchema.methods.hasReachedLimit = function(type) {
  switch(type) {
    case 'posts':
      return this.usage.postsThisMonth >= this.limits.posts;
    case 'socialAccounts':
      return this.usage.socialAccountsConnected >= this.limits.socialAccounts;
    default:
      return false;
  }
};

// Method to update plan limits based on plan type
SubscriptionSchema.methods.updateLimits = function() {
  const planLimits = {
    free: {
      posts: 10,
      socialAccounts: 3,
      analytics: false,
      bulkUpload: false,
      teamMembers: 1
    },
    basic: {
      posts: 100,
      socialAccounts: 10,
      analytics: true,
      bulkUpload: false,
      teamMembers: 3
    },
    pro: {
      posts: 500,
      socialAccounts: 25,
      analytics: true,
      bulkUpload: true,
      teamMembers: 10
    },
    enterprise: {
      posts: -1, // Unlimited
      socialAccounts: -1, // Unlimited
      analytics: true,
      bulkUpload: true,
      teamMembers: -1 // Unlimited
    }
  };

  this.limits = planLimits[this.plan] || planLimits.free;
};

module.exports = mongoose.model('Subscription', SubscriptionSchema);
