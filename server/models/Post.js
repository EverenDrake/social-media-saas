const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'gif']
    },
    url: String,
    filename: String,
    size: Number,
    mimetype: String
  }],
  platforms: [{
    platform: {
      type: String,
      enum: ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok'],
      required: true
    },
    socialAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SocialAccount',
      required: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'posted', 'failed', 'draft'],
      default: 'scheduled'
    },
    externalPostId: String,
    errorMessage: String,
    postedAt: Date
  }],
  scheduledAt: {
    type: Date,
    required: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'posting', 'posted', 'failed', 'cancelled'],
    default: 'draft'
  },
  tags: [String],
  analytics: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
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

PostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

PostSchema.index({ user: 1, scheduledAt: 1 });
PostSchema.index({ status: 1, scheduledAt: 1 });

module.exports = mongoose.model('Post', PostSchema);
