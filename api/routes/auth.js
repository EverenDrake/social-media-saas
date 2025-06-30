const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { supabase, supabaseAuth } = require('../config/supabase');
const auth = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Validation middleware for registration
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Register
router.post('/register', registerValidation, async (req, res) => {
  try {
    console.log('🚀 Registration attempt started');
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;
    console.log('📝 Registration data:', { username, email, passwordLength: password?.length });

    // Create user in Supabase Auth using admin API
    console.log('🔧 Creating user in Supabase Auth...');
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    const user = data?.user;
    console.log('✅ Supabase auth result:', { user: user?.id, error: error?.message });

    if (error) {
      console.error('❌ Supabase auth error:', error);
      return res.status(400).json({ 
        message: error.message
      });
    }

    // Create user profile (using service role bypasses RLS)
    const { data: profileData, error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      username
    });

    if (profileError && !profileError.message.includes('duplicate key')) {
      console.warn('Profile creation warning:', profileError.message);
      // Don't fail registration if profile creation fails - trigger might have handled it
    }

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail({ username, email });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        username,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate user with Supabase Auth
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password
    });
    
    const user = data?.user;

    if (error) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: profile?.username || 'User',
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    // Get user profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (profileError) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get subscription from Supabase
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.userId)
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token
router.post('/refresh', auth, async (req, res) => {
  try {
    const token = jwt.sign(
      { userId: req.userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
