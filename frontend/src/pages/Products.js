import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      if (searchQuery) params.append('search', searchQuery);
      params.append('page', pagination.currentPage);
      params.append('limit', '12');
      
      const res = await axios.get(`/api/products?${params}`);
      setProducts(res.data.products);
      setPagination({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalProducts: res.data.totalProducts
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
    setSearchQuery('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: '💎' },
    { value: 'rings', label: 'Rings', icon: '💍' },
    { value: 'necklaces', label: 'Necklaces', icon: '📿' },
    { value: 'earrings', label: 'Earrings', icon: '👂' },
    { value: 'bracelets', label: 'Bracelets', icon: '⌚' },
    { value: 'other', label: 'Other', icon: '✨' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 mt-10">
            Our <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">Exquisite</span> Collection
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Discover handcrafted luxury pieces that tell your story
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search for jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Filter Toggle for Mobile */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-gray-200 flex items-center justify-between hover:shadow-xl transition-all duration-300"
          >
            <span className="flex items-center text-gray-700 font-semibold">
              <span className="mr-2 text-xl">🔧</span>
              Filters & Sort
            </span>
            <span className={`transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>
              ⬇️
            </span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-gray-900 flex items-center">
                  <span className="mr-2">🎛️</span>
                  Filters
                </h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition duration-300 transform hover:scale-105"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-8">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Category</label>
                  <div className="space-y-3">
                    {categoryOptions.map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={option.value}
                          checked={filters.category === option.value}
                          onChange={handleFilterChange}
                          className="sr-only"
                        />
                        <div className={`flex items-center w-full p-3 rounded-xl border-2 transition-all duration-300 ${
                          filters.category === option.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}>
                          <span className="text-xl mr-3">{option.icon}</span>
                          <span className={`font-medium ${
                            filters.category === option.value ? 'text-purple-700' : 'text-gray-700'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    <span className="mr-2">💰</span>
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        name="minPrice"
                        type="number"
                        placeholder="Min $"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
                      />
                    </div>
                    <div>
                      <input
                        name="maxPrice"
                        type="number"
                        placeholder="Max $"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    <span className="mr-2">🔄</span>
                    Sort By
                  </label>
                  <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 bg-white"
                  >
                    <option value="newest">✨ Newest First</option>
                    <option value="price_asc">💲 Price: Low to High</option>
                    <option value="price_desc">💎 Price: High to Low</option>
                    <option value="name_asc">🔤 Name: A to Z</option>
                    <option value="name_desc">🔠 Name: Z to A</option>
                    <option value="rating">⭐ Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="mb-4 md:mb-0">
                    <p className="text-gray-600 text-lg">
                      <span className="font-bold text-purple-600">{pagination.totalProducts}</span> beautiful pieces found
                    </p>
                    {searchQuery && (
                      <p className="text-sm text-gray-500">
                        Results for "<span className="font-semibold">{searchQuery}</span>"
                      </p>
                    )}
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">View:</span>
                    <div className="flex bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                          viewMode === 'grid' 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        ⊞ Grid
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                          viewMode === 'list' 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        ☰ List
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Products Grid */}
                <div className={`grid gap-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} viewMode={viewMode} />
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex space-x-2">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            pagination.currentPage === page
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* No Results */}
                {products.length === 0 && (
                  <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl">
                    <div className="text-8xl mb-6">💎</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No jewelry found</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Try adjusting your search or filters to discover more beautiful pieces
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition duration-300 transform hover:scale-105"
                    >
                      View All Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;