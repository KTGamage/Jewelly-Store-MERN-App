const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      sort, 
      featured,
      search,
      page = 1, 
      limit = 12 
    } = req.query;
    
    let query = {};
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    let productsQuery = Product.find(query);
    
    // Sorting
    switch(sort) {
      case 'price_asc':
        productsQuery = productsQuery.sort({ price: 1 });
        break;
      case 'price_desc':
        productsQuery = productsQuery.sort({ price: -1 });
        break;
      case 'name_asc':
        productsQuery = productsQuery.sort({ name: 1 });
        break;
      case 'name_desc':
        productsQuery = productsQuery.sort({ name: -1 });
        break;
      case 'rating':
        productsQuery = productsQuery.sort({ rating: -1 });
        break;
      default:
        productsQuery = productsQuery.sort({ createdAt: -1 });
    }
    
    const products = await productsQuery.skip(skip).limit(limitNum).exec();
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalProducts: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category counts - simpler version
router.get('/category-counts', async (req, res) => {
  try {
    const ringsCount = await Product.countDocuments({ category: 'rings' });
    const necklacesCount = await Product.countDocuments({ category: 'necklaces' });
    const earringsCount = await Product.countDocuments({ category: 'earrings' });
    const braceletsCount = await Product.countDocuments({ category: 'bracelets' });
    const otherCount = await Product.countDocuments({ category: 'other' });

    res.json({
      rings: ringsCount,
      necklaces: necklacesCount,
      earrings: earringsCount,
      bracelets: braceletsCount,
      other: otherCount
    });
  } catch (error) {
    console.error('Error fetching category counts:', error);
    res.status(500).json({ error: 'Failed to fetch category counts' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (protected - admin only)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (protected - admin only)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (protected - admin only)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;