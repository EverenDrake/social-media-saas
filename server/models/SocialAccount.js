const mongoose = require('mongoose');

const SocialAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok']
  },
  accountId: {
    type: String,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  tokenExpiresAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String
  },
  followers: {
    type: Number,
    default: 0
  },
  following: {
    type: Number,
    default: 0
  },
  connectedAt: {
    type: Date,
    default: Date.now
  },
  lastSyncAt: {
    type: Date,
    default: Date.now
  }
});

SocialAccountSchema.index({ user: 1, platform: 1, accountId: 1 }, { unique: true });

module.exports = mongoose.model('SocialAccount', SocialAccountSchema);
