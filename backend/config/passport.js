// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');

// // Check if Google OAuth is configured
// const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && 
//                           process.env.GOOGLE_CLIENT_SECRET && 
//                           // process.env.GOOGLE_CALLBACK_URL;
//                           process.env.CLIENT_URL;

// console.log('Google OAuth Configuration:', {
//   configured: isGoogleConfigured,
//   clientId: process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing',
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
//   callback: process.env.GOOGLE_CALLBACK_URL || '✗ Missing'
// });

// if (isGoogleConfigured) {
//   passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     // callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     callbackURL: `${process.env.CLIENT_URL}/api/auth/google/callback`,
//     proxy: false
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       console.log('Google OAuth profile received:', profile.displayName);
      
//       // Find or create user
//       let user = await User.findOne({ googleId: profile.id });

//       if (user) {
//         return done(null, user);
//       }

//       // Check if user exists with this email
//       user = await User.findOne({ email: profile.emails[0].value });

//       if (user) {
//         // Link Google account to existing user
//         user.googleId = profile.id;
//         await user.save();
//         return done(null, user);
//       }

//       // Create new user
//       user = await User.create({
//         googleId: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         password: 'google-auth', // Placeholder password
//         isVerified: true
//       });

//       return done(null, user);
//     } catch (err) {
//       console.error('Google OAuth error:', err);
//       return done(err, null);
//     }
//   }));
// } else {
//   console.log('Google OAuth is not configured. Skipping Google Strategy setup.');
// }

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });





















const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

console.log('🔐 ========== PASSPORT CONFIG START ==========');
console.log('🔐 Checking Google OAuth environment variables:');

// Check each variable individually
const hasClientId = !!process.env.GOOGLE_CLIENT_ID;
const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
const hasClientUrl = !!process.env.CLIENT_URL;

console.log('🔐 GOOGLE_CLIENT_ID:', hasClientId ? '✓ SET' : '✗ MISSING');
console.log('🔐 GOOGLE_CLIENT_SECRET:', hasClientSecret ? '✓ SET' : '✗ MISSING');
console.log('🔐 CLIENT_URL:', hasClientUrl ? process.env.CLIENT_URL : '✗ MISSING');

const isGoogleConfigured = hasClientId && hasClientSecret && hasClientUrl;

console.log('🔐 Google OAuth fully configured:', isGoogleConfigured);

if (isGoogleConfigured) {
  console.log('✅ Configuring Google Strategy...');
  
  try {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_URL}/api/auth/google/callback`,
      proxy: false
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔐 Google OAuth profile received:', profile.displayName);
        
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

        console.log('✅ New user created via Google OAuth');
        return done(null, user);
      } catch (err) {
        console.error('❌ Google OAuth error:', err);
        return done(err, null);
      }
    }));
    
    console.log('✅ Google Strategy configured successfully!');
  } catch (error) {
    console.error('❌ Error configuring Google Strategy:', error);
  }
} else {
  console.log('⚠️ Google OAuth is not configured. Skipping Google Strategy setup.');
}

console.log('🔐 ========== PASSPORT CONFIG END ==========');

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


