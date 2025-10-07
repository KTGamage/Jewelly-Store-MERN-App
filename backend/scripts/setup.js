const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@jewellery.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      // Update existing admin to ensure correct role and password
      existingAdmin.role = 'admin';
      existingAdmin.name = 'Admin User';
      await existingAdmin.save();
      console.log('Admin user updated');
    } else {
      // Create admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@jewellery.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });

      await adminUser.save();
      console.log('Admin user created successfully!');
    }

    console.log('Email: admin@jewellery.com');
    console.log('Password: admin123');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser;