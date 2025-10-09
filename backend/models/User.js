const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    trim: true
  },
  shippingAddress: {
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for formatted shipping address
userSchema.virtual('formattedShippingAddress').get(function() {
  if (!this.shippingAddress || !this.shippingAddress.address) {
    return 'No shipping address set';
  }
  
  const { address, city, postalCode, country } = this.shippingAddress;
  return `${address}, ${city}, ${postalCode}, ${country}`;
});

// Method to check if user has shipping address
userSchema.methods.hasShippingAddress = function() {
  return !!(this.shippingAddress && 
            this.shippingAddress.address && 
            this.shippingAddress.city && 
            this.shippingAddress.postalCode && 
            this.shippingAddress.country);
};

// Method to update shipping address
userSchema.methods.updateShippingAddress = function(addressData) {
  this.shippingAddress = {
    address: addressData.address || this.shippingAddress?.address,
    city: addressData.city || this.shippingAddress?.city,
    postalCode: addressData.postalCode || this.shippingAddress?.postalCode,
    country: addressData.country || this.shippingAddress?.country
  };
  return this.save();
};

// Static method to find by email (for Google OAuth)
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find or create Google user
userSchema.statics.findOrCreateGoogleUser = async function(profile) {
  let user = await this.findOne({ googleId: profile.id });
  
  if (user) return user;
  
  user = await this.findOne({ email: profile.emails[0].value });
  
  if (user) {
    user.googleId = profile.id;
    await user.save();
    return user;
  }
  
  // Create new user
  user = await this.create({
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    password: 'google-auth', // Placeholder
    isVerified: true
  });
  
  return user;
};

module.exports = mongoose.model('User', userSchema);




// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: function() {
//       return !this.googleId;
//     },
//     minlength: 6
//   },
//   googleId: {
//     type: String,
//     sparse: true
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user'
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   phone: {
//     type: String,
//     trim: true
//   },
//   shippingAddress: {
//     address: { type: String, trim: true },
//     city: { type: String, trim: true },
//     postalCode: { type: String, trim: true },
//     country: { type: String, trim: true }
//   }
// }, {
//   timestamps: true
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password') || !this.password) return next();
  
//   // Don't hash if it's already hashed (length > 20)
//   if (this.password.length > 20) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Compare password method
// userSchema.methods.matchPassword = async function(enteredPassword) {
//   if (!this.password) {
//     return false;
//   }
  
//   try {
//     return await bcrypt.compare(enteredPassword, this.password);
//   } catch (error) {
//     console.error('Password comparison error:', error);
//     return false;
//   }
// };
// // Virtual for formatted shipping address
// userSchema.virtual('formattedShippingAddress').get(function() {
//   if (!this.shippingAddress || !this.shippingAddress.address) {
//     return 'No shipping address set';
//   }
  
//   const { address, city, postalCode, country } = this.shippingAddress;
//   return `${address}, ${city}, ${postalCode}, ${country}`;
// });

// // Method to check if user has shipping address
// userSchema.methods.hasShippingAddress = function() {
//   return !!(this.shippingAddress && 
//             this.shippingAddress.address && 
//             this.shippingAddress.city && 
//             this.shippingAddress.postalCode && 
//             this.shippingAddress.country);
// };

// // Method to update shipping address
// userSchema.methods.updateShippingAddress = function(addressData) {
//   this.shippingAddress = {
//     address: addressData.address || this.shippingAddress?.address,
//     city: addressData.city || this.shippingAddress?.city,
//     postalCode: addressData.postalCode || this.shippingAddress?.postalCode,
//     country: addressData.country || this.shippingAddress?.country
//   };
//   return this.save();
// };

// // Static method to find by email
// userSchema.statics.findByEmail = function(email) {
//   return this.findOne({ email: email.toLowerCase() });
// };

// // Static method to find or create Google user
// userSchema.statics.findOrCreateGoogleUser = async function(profile) {
//   let user = await this.findOne({ googleId: profile.id });
  
//   if (user) return user;
  
//   user = await this.findOne({ email: profile.emails[0].value });
  
//   if (user) {
//     user.googleId = profile.id;
//     await user.save();
//     return user;
//   }
  
//   // Create new user
//   user = await this.create({
//     googleId: profile.id,
//     name: profile.displayName,
//     email: profile.emails[0].value,
//     password: 'google-auth',
//     isVerified: true
//   });
  
//   return user;
// };

// module.exports = mongoose.model('User', userSchema);