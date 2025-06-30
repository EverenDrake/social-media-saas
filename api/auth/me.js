const { supabase } = require('../config/supabase');
const jwt = require('jsonwebtoken');

const auth = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token provided');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  return decoded.userId;
};

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = auth(req);

    // Get user profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get subscription from Supabase
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    res.json({
      user: {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        createdAt: profile.created_at
      },
      subscription: subscription || {
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
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
