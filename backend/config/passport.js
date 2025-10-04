// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Validate configuration
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing Google OAuth environment variables');
}

console.log('Google OAuth Config:', {
  clientId: process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing',
  callback: process.env.GOOGLE_CALLBACK_URL
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  proxy: false // Set to true if behind proxy/load balancer
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth successful for:', profile.displayName);
    
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      return done(null, user);
    }

    user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      user.googleId = profile.id;
      await user.save();
      return done(null, user);
    }

    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      password: 'google-auth',
      isVerified: true
    });

    return done(null, user);
  } catch (err) {
    console.error('Google OAuth error:', err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});