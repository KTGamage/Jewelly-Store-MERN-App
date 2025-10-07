const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const { check, validationResult } = require("express-validator");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Simple admin user creation without async issues
const ensureAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ email: 'admin@jewellery.com' });
    
    if (!adminUser) {
      console.log('Creating admin user...');
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@jewellery.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      await newAdmin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error in ensureAdminUser:', error.message);
  }
};

// Call this on server start (but don't wait for it)
ensureAdminUser();

// Register
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty().trim().escape(),
    check("email", "Please include a valid email").isEmail().normalizeEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server error during registration" });
    }
  }
);

// Login - SIMPLIFIED VERSION
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail().normalizeEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ 
          errors: [{ msg: "Invalid email or password" }] 
        });
      }

      // Check if this is a Google account without password
      if (user.googleId && (!user.password || user.password === 'google-auth')) {
        return res.status(400).json({
          errors: [{
            msg: "This account uses Google login. Please sign in with Google."
          }]
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(400).json({ 
          errors: [{ msg: "Invalid email or password" }] 
        });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Login error:", err.message);
      res.status(500).json({ 
        message: "Server error during login",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
);

// Google OAuth Routes - WITH PROPER ERROR HANDLING
router.get(
  "/google",
  (req, res, next) => {
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(503).json({ 
        message: "Google login is currently unavailable" 
      });
    }
    next();
  },
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    failureRedirect: false 
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_unavailable`);
    }
    next();
  },
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    session: false,
  }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);

      res.redirect(
        `${
          process.env.CLIENT_URL
        }/oauth-success?token=${token}&user=${encodeURIComponent(
          JSON.stringify({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
          })
        )}`
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
  }
);

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error("Auth me error:", err.message);
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;