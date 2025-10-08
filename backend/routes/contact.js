const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer transporter - FIXED: createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'All fields are required: name, email, message' 
      });
    }

    // Email content for the business owner
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Message from ${name} - Luxury Jewelry`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 15px;">Customer Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 15px;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This message was sent from the contact form on Luxury Jewelry website.
            </p>
          </div>
        </div>
      `,
    };

    // Send email to business
    await transporter.sendMail(mailOptions);

    // Optional: Send auto-reply to the user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Contacting Luxury Jewelry',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed; text-align: center;">Thank You for Contacting Us!</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for reaching out to Luxury Jewelry. We have received your message and will get back to you within 24-48 hours.</p>
            <p>Here's a copy of your message for your records:</p>
            <div style="background: #ffffff; padding: 15px; border-left: 4px solid #7c3aed; margin: 15px 0;">
              <p style="white-space: pre-wrap; font-style: italic;">${message}</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #6b7280;">
            <p>Best regards,<br>The Luxury Jewelry Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(userMailOptions);

    console.log('Contact form submitted and emails sent:', { name, email });
    
    res.status(200).json({ 
      message: 'Message sent successfully! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    
    // More specific error messages
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        message: 'Email configuration error. Please check your email settings.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

// Test email route (optional)
router.post('/test', async (req, res) => {
  try {
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Luxury Jewelry',
      text: 'This is a test email from your Luxury Jewelry backend.',
    };

    await transporter.sendMail(testMailOptions);
    res.status(200).json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: 'Failed to send test email' });
  }
});

module.exports = router;