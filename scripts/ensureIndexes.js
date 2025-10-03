const mongoose = require('mongoose');
require('./load-env'); // Load environment variables first

const ensureIndexes = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Import models
    const User = require('../backend/models/User');
    const Product = require('../backend/models/Product');
    const Order = require('../backend/models/Order');
    
    console.log('Ensuring indexes...');
    
    // Ensure indexes for each model
    await User.ensureIndexes();
    console.log('User indexes ensured');
    
    await Product.ensureIndexes();
    console.log('Product indexes ensured');
    
    await Order.ensureIndexes();
    console.log('Order indexes ensured');
    
    console.log('All indexes ensured successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error ensuring indexes:', error);
    process.exit(1);
  }
};

ensureIndexes();