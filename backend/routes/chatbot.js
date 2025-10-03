const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Chatbot endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant for a jewellery store. Help customers with product recommendations, sizing, care instructions, and general jewellery questions. Be friendly and professional." 
        },
        { role: "user", content: message }
      ],
      max_tokens: 150
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

module.exports = router;