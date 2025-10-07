const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update item quantity
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    const item = cart.items.find(item => item.product.toString() === req.params.productId);
    
    if (item) {
      item.quantity = quantity;
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;


