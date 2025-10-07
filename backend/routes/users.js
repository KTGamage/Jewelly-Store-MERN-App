// const express = require('express');
// const router = express.Router();
// const { auth, admin } = require('../middleware/auth');
// const User = require('../models/User');

// // Get all users (admin only)
// router.get('/', auth, admin, async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Get user by ID
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }
    
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// // Update user
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const { name, email, phone, shippingAddress } = req.body;
    
//     const user = await User.findById(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }
    
//     // Check if user is updating their own profile or is admin
//     if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(401).json({ msg: 'Not authorized' });
//     }
    
//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (phone) user.phone = phone;
//     if (shippingAddress) user.shippingAddress = shippingAddress;
    
//     await user.save();
    
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// // Delete user (admin only)
// router.delete('/:id', auth, admin, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }
    
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ msg: 'User removed' });
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update user role (admin only)
router.put('/:id/role', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;