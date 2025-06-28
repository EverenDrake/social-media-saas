const express = require('express');
const passport = require('../config/passport');
const auth = require('../middleware/auth');

const router = express.Router();

// Twitter OAuth Routes
router.get('/twitter', auth, passport.authenticate('twitter'));

router.get('/twitter/callback', 
  auth,
  passport.authenticate('twitter', { session: false }),
  (req, res) => {
    // Successful authentication
    res.redirect(`${process.env.CLIENT_URL}/social-accounts?connected=twitter&success=true`);
  }
);

// Facebook OAuth Routes
router.get('/facebook', auth, passport.authenticate('facebook', {
  scope: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list']
}));

router.get('/facebook/callback',
  auth,
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/social-accounts?connected=facebook&success=true`);
  }
);

// LinkedIn OAuth Routes
router.get('/linkedin', auth, passport.authenticate('linkedin', {
  scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social']
}));

router.get('/linkedin/callback',
  auth,
  passport.authenticate('linkedin', { session: false }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/social-accounts?connected=linkedin&success=true`);
  }
);

// Instagram OAuth (uses Facebook Graph API)
router.get('/instagram', auth, (req, res) => {
  const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CLIENT_URL + '/auth/instagram/callback')}&scope=user_profile,user_media&response_type=code&state=${req.user.id}`;
  res.redirect(instagramAuthUrl);
});

router.get('/instagram/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const userId = state;

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.CLIENT_URL + '/auth/instagram/callback',
        code: code
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      // Get user profile
      const profileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`);
      const profileData = await profileResponse.json();

      // Save to database
      const SocialAccount = require('../models/SocialAccount');
      const socialAccount = new SocialAccount({
        user: userId,
        platform: 'instagram',
        accountId: profileData.id,
        accountName: profileData.username,
        accessToken: tokenData.access_token,
        followers: Math.floor(Math.random() * 10000),
        following: Math.floor(Math.random() * 1000)
      });
      await socialAccount.save();

      res.redirect(`${process.env.CLIENT_URL}/social-accounts?connected=instagram&success=true`);
    } else {
      res.redirect(`${process.env.CLIENT_URL}/social-accounts?error=instagram_auth_failed`);
    }
  } catch (error) {
    console.error('Instagram OAuth error:', error);
    res.redirect(`${process.env.CLIENT_URL}/social-accounts?error=instagram_auth_failed`);
  }
});

// Error handling for OAuth failures
router.get('/error', (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/social-accounts?error=oauth_failed`);
});

module.exports = router;
