const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    console.log('=== GET CART REQUEST ===');
    console.log('User ID:', req.user._id);

    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images category stock material description');

    console.log('Cart found:', cart ? 'Yes' : 'No');

    if (!cart) {
      console.log('Creating new empty cart');
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
      await cart.populate('items.product', 'name price images category stock material description');
    }

    // Use virtuals from the model
    const totalItems = cart.totalItems;
    const totalPrice = cart.totalPrice;

    console.log('Returning cart with', cart.items.length, 'items');
    console.log('Total items:', totalItems);
    console.log('Total price:', totalPrice);

    res.json({
      _id: cart._id,
      user: cart.user,
      items: cart.items,
      totalItems,
      totalPrice,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    });
  } catch (err) {
    console.error('Get cart error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching cart' 
    });
  }
});

// Add item to cart - FIXED VERSION
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    console.log('=== ADD TO CART REQUEST ===');
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);
    console.log('User ID:', req.user._id);

    // Validate input
    if (!productId) {
      return res.status(400).json({ 
        success: false,
        message: 'Product ID is required' 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    if (product.stock < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'Product is out of stock' 
      });
    }

    const requestedQuantity = parseInt(quantity);
    if (isNaN(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid quantity' 
      });
    }

    // Check if adding exceeds stock
    if (requestedQuantity > product.stock) {
      return res.status(400).json({ 
        success: false,
        message: `Only ${product.stock} items available in stock` 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      console.log('Creating new cart for user');
      cart = new Cart({ 
        user: req.user._id, 
        items: [] 
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    console.log('Existing item index:', existingItemIndex);

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = cart.items[existingItemIndex].quantity + requestedQuantity;
      
      // Check stock availability for updated quantity
      if (newQuantity > product.stock) {
        return res.status(400).json({ 
          success: false,
          message: `Only ${product.stock} items available in stock. You already have ${cart.items[existingItemIndex].quantity} in cart.` 
        });
      }
      
      console.log('Updating existing item quantity from', cart.items[existingItemIndex].quantity, 'to', newQuantity);
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      console.log('Adding new item to cart');
      cart.items.push({ 
        product: productId, 
        quantity: requestedQuantity 
      });
    }
    
    console.log('Cart before save:', {
      user: cart.user,
      items: cart.items,
      itemsCount: cart.items.length
    });
    
    // Save the cart
    const savedCart = await cart.save();
    console.log('Cart saved successfully. Cart ID:', savedCart._id);
    
    // Populate the product details
    await savedCart.populate('items.product', 'name price images category stock material description');
    console.log('Cart populated successfully');

    // Use virtuals from the model
    const totalItems = savedCart.totalItems;
    const totalPrice = savedCart.totalPrice;

    console.log('Total items (virtual):', totalItems);
    console.log('Total price (virtual):', totalPrice);
    console.log('=== ADD TO CART SUCCESS ===');

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      cart: {
        _id: savedCart._id,
        user: savedCart.user,
        items: savedCart.items,
        totalItems,
        totalPrice,
        createdAt: savedCart.createdAt,
        updatedAt: savedCart.updatedAt
      }
    });

  } catch (err) {
    console.error('=== ADD TO CART ERROR ===');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID' 
      });
    }

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        success: false,
        message: `Validation error: ${errors.join(', ')}` 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while adding to cart: ' + err.message 
    });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    console.log('=== REMOVE FROM CART ===');
    console.log('Product ID:', productId);
    console.log('User ID:', req.user._id);

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }
    
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found in cart' 
      });
    }
    
    await cart.save();
    
    // Populate the cart before sending response
    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price images category stock material description');

    // Use virtuals from the model
    const totalItems = populatedCart.totalItems;
    const totalPrice = populatedCart.totalPrice;

    console.log('Item removed successfully');
    console.log('=== REMOVE FROM CART SUCCESS ===');

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: {
        _id: populatedCart._id,
        user: populatedCart.user,
        items: populatedCart.items,
        totalItems,
        totalPrice,
        createdAt: populatedCart.createdAt,
        updatedAt: populatedCart.updatedAt
      }
    });
  } catch (err) {
    console.error('Remove from cart error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error while removing from cart' 
    });
  }
});

// Update item quantity
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    console.log('=== UPDATE CART QUANTITY ===');
    console.log('Product ID:', productId);
    console.log('New quantity:', quantity);

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid quantity is required (minimum 1)' 
      });
    }
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }
    
    const item = cart.items.find(
      item => item.product.toString() === productId
    );
    
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found in cart' 
      });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (product && quantity > product.stock) {
      return res.status(400).json({ 
        success: false,
        message: `Only ${product.stock} items available in stock` 
      });
    }
    
    console.log('Updating quantity from', item.quantity, 'to', quantity);
    item.quantity = parseInt(quantity);
    
    await cart.save();
    
    // Populate the cart before sending response
    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price images category stock material description');

    // Use virtuals from the model
    const totalItems = populatedCart.totalItems;
    const totalPrice = populatedCart.totalPrice;

    console.log('Quantity updated successfully');
    console.log('=== UPDATE CART SUCCESS ===');

    res.json({
      success: true,
      message: 'Cart updated successfully',
      cart: {
        _id: populatedCart._id,
        user: populatedCart.user,
        items: populatedCart.items,
        totalItems,
        totalPrice,
        createdAt: populatedCart.createdAt,
        updatedAt: populatedCart.updatedAt
      }
    });
  } catch (err) {
    console.error('Update cart error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating cart' 
    });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    console.log('=== CLEAR CART ===');
    console.log('User ID:', req.user._id);

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }
    
    cart.items = [];
    await cart.save();
    
    console.log('Cart cleared successfully');
    console.log('=== CLEAR CART SUCCESS ===');

    res.json({ 
      success: true,
      message: 'Cart cleared successfully', 
      cart: {
        _id: cart._id,
        user: cart.user,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      }
    });
  } catch (err) {
    console.error('Clear cart error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error while clearing cart' 
    });
  }
});

module.exports = router;
