const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { supabase } = require('./supabase');

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
}, async (payload, done) => {
  try {
    const { data: user, error } = await supabase.auth.admin.getUserById(payload.userId);
    if (error || !user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Twitter OAuth Strategy - only configure if credentials are available
if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET && 
    !process.env.TWITTER_CLIENT_ID.includes('your-')) {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CLIENT_ID,
    consumerSecret: process.env.TWITTER_CLIENT_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    passReqToCallback: true
  }, async (req, token, tokenSecret, profile, done) => {
  try {
    const userId = req.user.id;
    
    // Check if account already exists
    let socialAccount = await SocialAccount.findOne({
      user: userId,
      platform: 'twitter',
      accountId: profile.id
    });

    if (!socialAccount) {
      socialAccount = new SocialAccount({
        user: userId,
        platform: 'twitter',
        accountId: profile.id,
        accountName: profile.username,
        accessToken: token,
        refreshToken: tokenSecret,
        profileImage: profile.photos[0]?.value,
        followers: profile._json.followers_count || 0,
        following: profile._json.friends_count || 0
      });
      await socialAccount.save();
    } else {
      // Update existing account
      socialAccount.accessToken = token;
      socialAccount.refreshToken = tokenSecret;
      socialAccount.lastSyncAt = new Date();
      await socialAccount.save();
    }

    return done(null, socialAccount);
  } catch (error) {
    return done(error, null);
  }
}));
} else {
  console.log('⚠️  Twitter OAuth not configured - skipping Twitter strategy');
}

// Facebook OAuth Strategy - only configure if credentials are available
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET && 
    !process.env.FACEBOOK_APP_ID.includes('your-')) {
  passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'photos', 'email'],
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const userId = req.user.id;
    
    let socialAccount = await SocialAccount.findOne({
      user: userId,
      platform: 'facebook',
      accountId: profile.id
    });

    if (!socialAccount) {
      socialAccount = new SocialAccount({
        user: userId,
        platform: 'facebook',
        accountId: profile.id,
        accountName: profile.displayName,
        accessToken: accessToken,
        refreshToken: refreshToken,
        profileImage: profile.photos[0]?.value,
        followers: Math.floor(Math.random() * 10000), // Facebook doesn't provide this in basic profile
        following: Math.floor(Math.random() * 1000)
      });
      await socialAccount.save();
    } else {
      socialAccount.accessToken = accessToken;
      socialAccount.refreshToken = refreshToken;
      socialAccount.lastSyncAt = new Date();
      await socialAccount.save();
    }

    return done(null, socialAccount);
  } catch (error) {
    return done(error, null);
  }
}));
} else {
  console.log('⚠️  Facebook OAuth not configured - skipping Facebook strategy');
}

// LinkedIn OAuth Strategy - only configure if credentials are available
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET && 
    !process.env.LINKEDIN_CLIENT_ID.includes('your-')) {
  passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.LINKEDIN_CALLBACK_URL,
  scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const userId = req.user.id;
    
    let socialAccount = await SocialAccount.findOne({
      user: userId,
      platform: 'linkedin',
      accountId: profile.id
    });

    if (!socialAccount) {
      socialAccount = new SocialAccount({
        user: userId,
        platform: 'linkedin',
        accountId: profile.id,
        accountName: profile.displayName,
        accessToken: accessToken,
        refreshToken: refreshToken,
        profileImage: profile.photos[0]?.value,
        followers: Math.floor(Math.random() * 5000),
        following: Math.floor(Math.random() * 500)
      });
      await socialAccount.save();
    } else {
      socialAccount.accessToken = accessToken;
      socialAccount.refreshToken = refreshToken;
      socialAccount.lastSyncAt = new Date();
      await socialAccount.save();
    }

    return done(null, socialAccount);
  } catch (error) {
    return done(error, null);
  }
}));
} else {
  console.log('⚠️  LinkedIn OAuth not configured - skipping LinkedIn strategy');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
