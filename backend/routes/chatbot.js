const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
let genAI;
let geminiModel;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try different model names - Google frequently updates these
    const modelNames = [
      "gemini-1.5-flash",  // Newest model (recommended)
      "gemini-1.0-pro",    // Stable model
      "gemini-pro",        // Legacy name
      "models/gemini-pro"  // Full path
    ];
    
    let modelInitialized = false;
    for (const modelName of modelNames) {
      try {
        geminiModel = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        });
        console.log(`✅ Gemini AI initialized with model: ${modelName}`);
        modelInitialized = true;
        break;
      } catch (modelError) {
        console.log(`❌ Model ${modelName} failed:`, modelError.message);
        continue;
      }
    }
    
    if (!modelInitialized) {
      console.log('❌ All Gemini models failed to initialize');
      geminiModel = null;
    }
    
  } else {
    console.log('⚠️  Gemini API key not configured');
  }
} catch (error) {
  console.log('❌ Gemini initialization failed:', error.message);
}

// Enhanced jewelry-specific system prompt
const JEWELRY_SYSTEM_PROMPT = `You are an expert jewelry assistant for a premium jewelry store called "Luxury Jewelers". Your role is to provide helpful, accurate information about jewelry.

IMPORTANT GUIDELINES:
- Be friendly, professional, and knowledgeable
- Provide specific, useful information about jewelry
- Keep responses concise but helpful (2-4 paragraphs max)
- If you don't know specific inventory or exact prices, suggest contacting the store
- Focus on education and helping customers make informed decisions

AREAS OF EXPERTISE:
1. PRODUCT KNOWLEDGE:
   - Types: rings, necklaces, earrings, bracelets, watches
   - Materials: gold (10k, 14k, 18k, 24k), silver, platinum, titanium
   - Gemstones: diamonds, sapphires, rubies, emeralds, pearls
   - Styles: vintage, modern, classic, contemporary

2. SERVICES:
   - Ring sizing and measurements
   - Jewelry care, cleaning, and maintenance
   - Custom design and personalization
   - Repair and restoration services
   - Appraisals and certifications

3. GUIDANCE:
   - Gift recommendations for occasions
   - Style matching and fashion advice
   - Budget considerations and value
   - Quality assessment and hallmarks

Always be helpful and encourage customers to visit the store for personalized service.`;

// Fallback responses for when Gemini is unavailable
const FALLBACK_RESPONSES = {
  greeting: "Hello! I'm your expert jewelry assistant at Luxury Jewelers. I can help you with:\n\n✨ **Product Information** - Materials, gemstones, styles\n📏 **Sizing & Measurements** - Ring sizing, length guidance\n💎 **Jewelry Care** - Cleaning, maintenance, storage\n🎁 **Gift Recommendations** - Perfect pieces for every occasion\n🔧 **Services** - Custom design, repairs, appraisals\n\nWhat would you like to know about today?",
  materials: "**Premium Materials We Offer:**\n\n🥇 **Gold Varieties:**\n• 10k Gold (41.7% gold) - Most affordable & durable\n• 14k Gold (58.3% gold) - Perfect balance of quality & value\n• 18k Gold (75% gold) - Rich color, premium feel\n• 24k Gold (99.9% gold) - Pure gold, luxurious but softer\n\n⚪ **Other Excellence:**\n• Sterling Silver (92.5% pure) - Classic & affordable\n• Platinum (95% pure) - Durable, hypoallergenic\n• Titanium - Modern, lightweight, strong\n\nWhich material are you considering?",
  sizing: "**Professional Ring Sizing Guide:**\n\n📏 **Accurate Methods:**\n• Visit our store for professional measurement (free)\n• Use our online ring sizer tool\n• Measure a well-fitting ring you already own\n\n💡 **Expert Tips:**\n• Measure at day's end when fingers are warmest\n• Consider knuckle size for comfort\n• Wide bands often need slightly larger size\n• Climate and temperature affect sizing\n\nNeed help with a specific measurement?",
  care: "**Jewelry Care Excellence:**\n\n✨ **Daily Protection:**\n• Store pieces separately in soft pouches\n• Put jewelry on after cosmetics and perfumes\n• Remove during swimming, cleaning, or sports\n\n🧼 **Cleaning Protocol:**\n• Mild soap + warm water + soft brush\n• Professional cleaning every 6 months (free with purchase)\n• Ultrasonic cleaning for suitable pieces\n\n⚠️ **Special Attention:**\n• Pearls: Avoid chemicals, re-string annually\n• Opals: Protect from extreme dryness\n• Silver: Anti-tarnish strips in storage\n\nSpecific care questions?",
  gifts: "**Perfect Jewelry Gifts:**\n\n💍 **Anniversaries:**\n• Diamond eternity bands (1st, 5th, 10th+)\n• Matching couple's rings\n• Personalized pendants with dates\n\n🎂 **Birthdays:**\n• Birthstone jewelry (personal & meaningful)\n• Charm bracelets with special symbols\n• Initial necklaces or monogram pieces\n\n🎓 **Milestones:**\n• Graduation: Achievement watches or class jewelry\n• Promotion: Luxury pens or cufflinks\n• Retirement: Legacy pieces or family heirlooms\n\nWhat celebration are you shopping for?",
  custom: "**Custom Design Experience:**\n\n1. **Complimentary Consultation** - Discuss your vision\n2. **Creative Sketching** - Initial design concepts\n3. **3D Digital Model** - See your piece before creation\n4. **Refinement Process** - Adjust until perfect\n5. **Artisan Creation** - Handcrafted by master jewelers\n6. **Final Presentation** - Perfect finished piece\n\n⏱️ Timeline: 2-6 weeks depending on complexity\n💰 Starting from $500\n\nHave a design idea in mind?",
  pricing: "**Investment Ranges:**\n\n• Sterling Silver: $75 - $400\n• Gold Jewelry: $250 - $8,000+\n• Diamond Pieces: $600 - $25,000+\n• Custom Creations: $500 - $20,000+\n• Luxury Watches: $1,000 - $15,000+\n\n*Visit our store or website for exact pricing and current collections. We offer financing options!*",
  default: "Thank you for your excellent question! For specific product availability, exact pricing, or to see our current collections, I recommend:\n\n🏬 **Visit Our Store:**\nExperience personalized service from our jewelry experts\n\n📞 **Direct Contact:** (555) 123-LUXURY\nSpeak with our knowledgeable consultants\n\n🌐 **Online Catalog:**\nBrowse our complete collection on luxuryjewelers.com\n\nIs there anything else about jewelry I can help you understand today?"
};

// Smart response system
const getSmartResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (/(hello|hi|hey|greetings|good morning|good afternoon)/.test(lowerMessage)) {
    return FALLBACK_RESPONSES.greeting;
  } else if (/(gold|silver|platinum|titanium|metal|material|karat|kt|white gold|yellow gold|rose gold)/.test(lowerMessage)) {
    return FALLBACK_RESPONSES.materials;
  } else if (/(size|sizing|fit|measure|ring size|too big|too small|resize)/.test(lowerMessage)) {
    return FALLBACK_RESPONSES.sizing;
  } else if (/(care|clean|maintain|store|polish|tarnish|damage|repair)/.test(lowerMessage)) {
    return FALLBACK_RESPONSES.care;
  } else if (/(gift|present|anniversary|birthday|wedding|graduation|christmas|valentine|mother'?s day|father'?s day)/.test(lowerMessage)) {
    return FALLBACK_RESPONSES.gifts;
  } else if (/(custom|design|create|unique|personalize|special order|bespoke)/.test(lowerMessage)) {
    return FALLBACK_RESPONSES.custom;
  } else if (/(price|cost|expensive|how much|budget|affordable|investment)/.test(lowerMessage)) {
    return FALLBACK_RESPONSES.pricing;
  } else {
    return FALLBACK_RESPONSES.default;
  }
};

// Function to test Gemini with a specific model
const testGeminiModel = async (modelName) => {
  try {
    const testGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const testModel = testGenAI.getGenerativeModel({ model: modelName });
    
    const result = await testModel.generateContent("Hello! Respond with 'OK' if working.");
    const response = await result.response;
    
    return {
      success: true,
      model: modelName,
      response: response.text()
    };
  } catch (error) {
    return {
      success: false,
      model: modelName,
      error: error.message
    };
  }
};

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Try Gemini AI if available
    if (geminiModel) {
      try {
        const prompt = `${JEWELRY_SYSTEM_PROMPT}\n\nCustomer Question: ${message}\n\nPlease provide a helpful, professional response:`;
        
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();

        return res.json({ 
          reply: reply,
          source: 'gemini'
        });
      } catch (geminiError) {
        console.log('Gemini API call failed, using fallback:', geminiError.message);
        // Fall through to fallback response
      }
    }

    // Use fallback response
    const fallbackReply = getSmartResponse(message);
    res.json({ 
      reply: fallbackReply,
      source: 'fallback'
    });

  } catch (err) {
    console.error('Chatbot Error:', err.message);
    const fallbackReply = getSmartResponse(req.body?.message || '');
    res.json({ 
      reply: fallbackReply,
      source: 'fallback-error'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const geminiStatus = geminiModel ? 'active' : 'inactive';
  
  res.json({ 
    status: hasGeminiKey && geminiModel ? 'healthy' : 'fallback_mode',
    hasGeminiKey: hasGeminiKey,
    geminiModel: geminiModel ? 'initialized' : 'not_initialized',
    timestamp: new Date().toISOString(),
    message: geminiModel ? 'Gemini API is configured' : 'Using smart fallback responses',
    provider: 'google-gemini'
  });
});

// Enhanced test endpoint that tries multiple models
router.get('/test-gemini', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini not configured',
        details: 'Check GEMINI_API_KEY in environment variables'
      });
    }

    const modelsToTest = [
      "gemini-1.5-flash",
      "gemini-1.0-pro", 
      "gemini-pro",
      "models/gemini-pro"
    ];

    const results = [];
    
    for (const modelName of modelsToTest) {
      console.log(`Testing model: ${modelName}`);
      const result = await testGeminiModel(modelName);
      results.push(result);
      
      if (result.success) {
        // Stop at first successful model
        return res.json({ 
          status: 'success',
          message: 'Gemini API is working',
          working_model: modelName,
          response: result.response,
          all_tests: results
        });
      }
    }

    // If no models worked
    res.status(500).json({ 
      status: 'error',
      error: 'All Gemini models failed',
      details: 'Check your API key and available models',
      all_tests: results
    });

  } catch (err) {
    console.error('Gemini Test Error:', err);
    res.status(500).json({ 
      status: 'error',
      error: err.message,
      details: 'Check your Gemini API key and internet connection'
    });
  }
});

// Simple test with current model
router.get('/test-current', async (req, res) => {
  try {
    if (!geminiModel) {
      return res.status(500).json({ 
        error: 'Gemini model not initialized',
        details: 'No working Gemini model found'
      });
    }

    const result = await geminiModel.generateContent("Hello! Please respond with 'Gemini is working!' if you can read this.");
    const response = await result.response;
    
    res.json({ 
      status: 'success',
      message: 'Gemini API is working with current model',
      response: response.text()
    });

  } catch (err) {
    console.error('Current Model Test Error:', err);
    res.status(500).json({ 
      status: 'error',
      error: err.message,
      details: 'Current Gemini model is not working'
    });
  }
});

// List available models (if API supports it)
router.get('/models', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured'
      });
    }

    // This is a simple way to test what models might work
    const availableModels = [
      { name: "gemini-1.5-flash", description: "Latest Flash model" },
      { name: "gemini-1.0-pro", description: "Stable Pro model" },
      { name: "gemini-pro", description: "Legacy Pro model" }
    ];

    res.json({
      available_models: availableModels,
      current_model: geminiModel ? 'initialized' : 'none',
      suggestion: "Try gemini-1.5-flash first as it's the newest model"
    });

  } catch (err) {
    res.status(500).json({ 
      error: err.message
    });
  }
});

module.exports = router;






















// const express = require('express');
// const router = express.Router();
// const { OpenAI } = require('openai');

// // Enhanced jewelry-specific system prompt
// const JEWELRY_SYSTEM_PROMPT = `You are an expert jewelry assistant for a premium jewelry store. Your role is to provide helpful information about:

// PRODUCT KNOWLEDGE:
// - Types of jewelry (rings, necklaces, earrings, bracelets)
// - Materials (gold, silver, platinum, diamonds, gemstones)
// - Styles and trends

// SERVICES:
// - Ring sizing and measurements
// - Jewelry care and cleaning
// - Custom design process
// - Repair and maintenance

// GENERAL ADVICE:
// - Gift recommendations for different occasions
// - Style matching and coordination
// - Budget considerations

// Be friendly, professional, and focus on providing helpful information. If you don't know specific inventory or prices, suggest contacting the store directly.`;

// // In-memory storage for conversations (use Redis in production)
// const conversationHistory = new Map();

// // Initialize OpenAI only if API key is available
// let openai;
// if (process.env.OPENAI_API_KEY) {
//   openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });
// } else {
//   console.warn('OPENAI_API_KEY not found in environment variables');
// }

// router.post('/', async (req, res) => {
//   // Check if OpenAI is configured
//   if (!openai) {
//     return res.status(500).json({ 
//       error: 'Chat service is not configured. Please contact support.' 
//     });
//   }

//   try {
//     const { message, conversationId = 'default' } = req.body;

//     if (!message || message.trim().length === 0) {
//       return res.status(400).json({ error: 'Message is required' });
//     }

//     // Get or initialize conversation history
//     if (!conversationHistory.has(conversationId)) {
//       conversationHistory.set(conversationId, [
//         { role: "system", content: JEWELRY_SYSTEM_PROMPT }
//       ]);
//     }

//     const history = conversationHistory.get(conversationId);
    
//     // Add user message to history
//     history.push({ role: "user", content: message.trim() });

//     // Limit history to last 10 messages to manage token usage
//     if (history.length > 12) {
//       const systemMessage = history[0];
//       const recentMessages = history.slice(-11);
//       conversationHistory.set(conversationId, [systemMessage, ...recentMessages]);
//     }

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: conversationHistory.get(conversationId),
//       max_tokens: 250,
//       temperature: 0.7,
//     });

//     const botReply = response.choices[0].message.content;
    
//     // Add bot response to history
//     conversationHistory.get(conversationId).push({ 
//       role: "assistant", 
//       content: botReply 
//     });

//     res.json({ 
//       reply: botReply,
//       conversationId: conversationId
//     });

//   } catch (err) {
//     console.error('Chatbot API Error:', err);
    
//     if (err.code === 'insufficient_quota') {
//       return res.status(503).json({ 
//         error: 'Service temporarily unavailable. Please try again later.' 
//       });
//     } else if (err.code === 'invalid_api_key') {
//       return res.status(500).json({ 
//         error: 'Configuration error. Please contact support.' 
//       });
//     } else if (err.response) {
//       return res.status(500).json({ 
//         error: 'AI service error. Please try again.' 
//       });
//     } else {
//       return res.status(500).json({ 
//         error: 'Failed to get response from AI assistant. Please try again.' 
//       });
//     }
//   }
// });

// // Health check endpoint
// router.get('/health', (req, res) => {
//   const hasApiKey = !!process.env.OPENAI_API_KEY;
//   res.json({ 
//     status: hasApiKey ? 'healthy' : 'missing_api_key',
//     hasApiKey: hasApiKey,
//     timestamp: new Date().toISOString()
//   });
// });

// module.exports = router;




