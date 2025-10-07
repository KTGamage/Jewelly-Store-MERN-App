const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const testAdminLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@jewellery.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:', {
      email: admin.email,
      role: admin.role,
      passwordLength: admin.password?.length
    });

    // Test password match
    const isMatch = await admin.matchPassword('admin123');
    console.log('✅ Password match test:', isMatch);

    if (isMatch) {
      console.log('✅ Admin login should work!');
    } else {
      console.log('❌ Password does not match');
    }

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

testAdminLogin();