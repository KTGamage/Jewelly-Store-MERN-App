const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// In-memory storage (replace with database in production)
let subscribers = [];

console.log('✅ Newsletter route file loaded');

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('Received newsletter subscription request:', email);

    // Validate input
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

    // Check if already subscribed (optional - in memory check)
    const existingSubscriber = subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
    if (existingSubscriber) {
      return res.status(400).json({ 
        success: false,
        message: 'This email is already subscribed to our newsletter' 
      });
    }

    // Create transporter (FIXED: createTransport not createTransporter)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email 1: Notification to admin about new subscription
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `📧 New Newsletter Subscription - ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B5CF6; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px;">
            🎉 New Newsletter Subscription
          </h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Subscription Details:</h3>
            <p><strong>📧 Email:</strong> ${email}</p>
            <p><strong>📅 Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>🌐 Source:</strong> Website Newsletter Form</p>
          </div>
          <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #3B82F6;">
            <p style="margin: 0; color: #1E40AF;">
              <strong>💡 Total Subscribers:</strong> ${subscribers.length + 1}
            </p>
          </div>
          <p style="color: #666; margin-top: 20px;">
            This subscriber has been added to your newsletter list.
          </p>
        </div>
      `
    };

    // Email 2: Welcome/confirmation email to the subscriber
    const subscriberMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✨ Welcome to Luxury Jewelry Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #8B5CF6; text-align: center; margin-bottom: 20px;">
              💎 Welcome to Luxury Jewelry!
            </h2>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 10px;">✨</div>
              <h3 style="color: #333; margin-bottom: 10px;">Thank You for Subscribing!</h3>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #333; margin-bottom: 15px;">
                Dear Subscriber,
              </p>
              <p style="color: #666; line-height: 1.6;">
                Welcome to the Luxury Jewelry family! We're thrilled to have you on board. 
                As a newsletter subscriber, you'll be the first to know about:
              </p>
              <ul style="color: #666; line-height: 1.6;">
                <li>🎁 Exclusive offers and promotions</li>
                <li>🆕 New collection launches</li>
                <li>💎 Jewelry care tips and trends</li>
                <li>🌟 Special events and early access</li>
              </ul>
            </div>

            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="color: #2d5016; margin: 0; text-align: center;">
                <strong>Your next luxury piece is waiting for you!</strong>
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/products" 
                 style="background: linear-gradient(135deg, #8B5CF6, #6366F1); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                🛍️ Explore Our Collection
              </a>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; font-size: 14px; text-align: center;">
                If you did not subscribe to our newsletter, please ignore this email or 
                <a href="mailto:${process.env.CONTACT_EMAIL}" style="color: #8B5CF6;">contact us</a>.
              </p>
            </div>

            <footer style="margin-top: 30px; text-align: center; color: #9ca3af; font-size: 12px;">
              <p>Luxury Jewelry · 123 Jewelry Lane · Diamond District, NY 10001</p>
              <p>© 2024 Luxury Jewelry. All rights reserved.</p>
            </footer>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(subscriberMailOptions);

    // Add to in-memory storage for counting (optional)
    subscribers.push({
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString()
    });

    console.log('Newsletter subscription successful for:', email);
    console.log('Total subscribers:', subscribers.length);

    res.json({ 
      success: true,
      message: 'Thank you for subscribing! Check your email for a welcome message.',
      count: subscribers.length
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // More specific error messages
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        success: false,
        message: 'Email service configuration error. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to subscribe. Please try again.' 
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Newsletter route is working!',
    subscriberCount: subscribers.length
  });
});

// Get subscriber count
router.get('/subscribers/count', (req, res) => {
  res.json({
    success: true,
    count: subscribers.length,
    subscribers: subscribers
  });
});

module.exports = router;