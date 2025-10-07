// const express = require('express');
// const router = express.Router();
// const { auth } = require('../middleware/auth');
// const Order = require('../models/Order');

// // Get user's orders
// router.get('/my-orders', auth, async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .populate('items.product', 'name images')
//       .sort({ createdAt: -1 });
    
//     res.json(orders);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Get order by ID
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('items.product', 'name images price');
    
//     if (!order) {
//       return res.status(404).json({ msg: 'Order not found' });
//     }
    
//     // Check if the order belongs to the user or if user is admin
//     if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(401).json({ msg: 'Not authorized' });
//     }
    
//     res.json(order);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Order not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// // Create new order
// router.post('/', auth, async (req, res) => {
//   try {
//     const {
//       items,
//       totalAmount,
//       shippingAddress,
//       paymentMethod,
//       transactionId
//     } = req.body;
    
//     const order = new Order({
//       user: req.user._id,
//       items,
//       totalAmount,
//       shippingAddress,
//       paymentMethod,
//       transactionId
//     });
    
//     const savedOrder = await order.save();
//     const populatedOrder = await Order.findById(savedOrder._id)
//       .populate('items.product', 'name images');
    
//     res.status(201).json(populatedOrder);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Update order status (admin only)
// router.put('/:id/status', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ msg: 'Access denied. Admin required.' });
//     }
    
//     const { orderStatus } = req.body;
    
//     const order = await Order.findById(req.params.id);
    
//     if (!order) {
//       return res.status(404).json({ msg: 'Order not found' });
//     }
    
//     order.orderStatus = orderStatus;
//     await order.save();
    
//     res.json(order);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Order not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// // Get all orders (admin only)
// router.get('/', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ msg: 'Access denied. Admin required.' });
//     }
    
//     const orders = await Order.find()
//       .populate('user', 'name email')
//       .populate('items.product', 'name images')
//       .sort({ createdAt: -1 });
    
//     res.json(orders);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;









const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price category')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (err) {
    console.error('Get user orders error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching orders' 
    });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price category');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    // Check if the order belongs to the user or if user is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (err) {
    console.error('Get order error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod = 'free_order',
      transactionId
    } = req.body;

    console.log('=== CREATE ORDER REQUEST ===');
    console.log('User:', req.user._id);
    console.log('Items count:', items?.length);
    console.log('Total amount:', totalAmount);

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Order must contain at least one item' 
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid total amount' 
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({ 
        success: false,
        message: 'Shipping address is required' 
      });
    }

    // Validate shipping address structure
    const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({ 
          success: false,
          message: `Shipping address ${field} is required` 
        });
      }
    }

    // Verify products exist and have sufficient stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ 
          success: false,
          message: `Product not found: ${item.product}` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'free_order' ? 'completed' : 'pending',
      orderStatus: 'pending',
      transactionId: transactionId || `free_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    const savedOrder = await order.save();
    
    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('items.product', 'name images price category');

    console.log('Order created successfully:', savedOrder._id);
    console.log('=== CREATE ORDER SUCCESS ===');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (err) {
    console.error('Create order error:', err.message);
    console.error('Error stack:', err.stack);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        success: false,
        message: `Validation error: ${errors.join(', ')}` 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating order: ' + err.message 
    });
  }
});

// Update order status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin required.' 
      });
    }
    
    const { orderStatus } = req.body;
    
    if (!orderStatus) {
      return res.status(400).json({ 
        success: false,
        message: 'Order status is required' 
      });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid order status' 
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    order.orderStatus = orderStatus;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'name images');
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: populatedOrder
    });
  } catch (err) {
    console.error('Update order status error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating order status' 
    });
  }
});

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin required.' 
      });
    }
    
    const { page = 1, limit = 10, status } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error('Get all orders error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching orders' 
    });
  }
});

module.exports = router;