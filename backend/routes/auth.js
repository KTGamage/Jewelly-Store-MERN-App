// const express = require('express');
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const router = express.Router();
// const User = require('../models/User');
// const { check, validationResult } = require('express-validator');

// // Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// // Register
// router.post('/register', [
//   check('name', 'Name is required').not().isEmpty().trim().escape(),
//   check('email', 'Please include a valid email').isEmail().normalizeEmail(),
//   check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
//     }

//     user = new User({
//       name,
//       email,
//       password
//     });

//     await user.save();

//     const token = generateToken(user._id);

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Login
// router.post('/login', [
//   check('email', 'Please include a valid email').isEmail().normalizeEmail(),
//   check('password', 'Password is required').exists()
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
//     }

//     // Check if user registered with Google
//     if (user.googleId && !user.password) {
//       return res.status(400).json({ 
//         errors: [{ 
//           msg: 'This email is associated with a Google account. Please sign in with Google.' 
//         }] 
//       });
//     }

//     const isMatch = await user.matchPassword(password);

//     if (!isMatch) {
//       return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
//     }

//     const token = generateToken(user._id);

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Google OAuth
// router.get('/google', passport.authenticate('google', { 
//   scope: ['profile', 'email'],
//   prompt: 'select_account' 
// }));

// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login', session: false }),
//   (req, res) => {
//     const token = generateToken(req.user._id);
//     // Redirect to frontend with token
//     res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
//   }
// );

// // Get current user
// router.get('/me', async (req, res) => {
//   try {
//     const token = req.header('x-auth-token');
    
//     if (!token) {
//       return res.status(401).json({ msg: 'No token, authorization denied' });
//     }
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }
    
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     if (err.name === 'JsonWebTokenError') {
//       return res.status(401).json({ msg: 'Invalid token' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register
router.post('/register', [
  check('name', 'Name is required').not().isEmpty().trim().escape(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    user = new User({
      name,
      email,
      password
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Check if user has a password (Google users might not have one)
    if (!user.password) {
      return res.status(400).json({ 
        errors: [{ 
          msg: 'This account uses social login. Please sign in with Google.' 
        }] 
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;