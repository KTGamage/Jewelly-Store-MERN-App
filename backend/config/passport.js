const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Check if Google OAuth is configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && 
                          process.env.GOOGLE_CLIENT_SECRET && 
                          process.env.GOOGLE_CALLBACK_URL;

console.log('Google OAuth Configuration:', {
  configured: isGoogleConfigured,
  clientId: process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
  callback: process.env.GOOGLE_CALLBACK_URL || '✗ Missing'
});

if (isGoogleConfigured) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: false
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth profile received:', profile.displayName);
      
      // Find or create user
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // Check if user exists with this email
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        password: 'google-auth', // Placeholder password
        isVerified: true
      });

      return done(null, user);
    } catch (err) {
      console.error('Google OAuth error:', err);
      return done(err, null);
    }
  }));
} else {
  console.log('Google OAuth is not configured. Skipping Google Strategy setup.');
}

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