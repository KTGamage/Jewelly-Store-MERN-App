const express = require('express');
const router = express.Router();

// In a real application, you'd use a database
// For now, we'll use an array (in production, use MongoDB/PostgreSQL)
let subscribers = [];

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if already subscribed
    if (subscribers.includes(email.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        message: 'This email is already subscribed to our newsletter' 
      });
    }

    // Add to subscribers list
    subscribers.push(email.toLowerCase());

    // In production, you would:
    // 1. Save to database
    // 2. Send welcome email
    // 3. Add to email marketing service

    console.log('New newsletter subscriber:', email);

    res.json({ 
      success: true,
      message: 'Thank you for subscribing to our newsletter! You will receive exclusive offers and updates.' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to subscribe. Please try again.' 
    });
  }
});

// Get subscriber count (optional, for admin)
router.get('/subscribers/count', (req, res) => {
  res.json({
    success: true,
    count: subscribers.length
  });
});

module.exports = router;