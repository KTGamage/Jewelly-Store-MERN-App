// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "/api/auth/google/callback"
// },
// async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ googleId: profile.id });

//     if (user) {
//       return done(null, user);
//     }

//     user = await User.findOne({ email: profile.emails[0].value });

//     if (user) {
//       // Link Google account to existing user
//       user.googleId = profile.id;
//       await user.save();
//       return done(null, user);
//     }

//     // Create new user
//     user = await User.create({
//       googleId: profile.id,
//       name: profile.displayName,
//       email: profile.emails[0].value,
//       password: Math.random().toString(36).slice(-8) // Random password
//     });

//     done(null, user);
//   } catch (err) {
//     console.error(err);
//     done(err, null);
//   }
// }));

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

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
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
      password: Math.random().toString(36).slice(-8)
    });

    done(null, user);
  } catch (err) {
    console.error(err);
    done(err, null);
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