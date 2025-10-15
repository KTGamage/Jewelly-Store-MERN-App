import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Social Media Icons (You can replace these with actual image URLs)
const SocialIcons = {
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.22 14.815 3.73 13.664 3.73 12.367s.49-2.448 1.396-3.323c.875-.808 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.808-2.026 1.297-3.323 1.297z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
};

// Category images 
const categoryImages = {
  rings: "/images/categories/rings.png",
  necklaces: "/images/categories/necklaces.png",
  earrings: "/images/categories/earrings.jpg",
  bracelets: "/images/categories/bracelets.png"
};

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [featuredCategories, setFeaturedCategories] = useState([
    {
      name: "Rings",
      image: categoryImages.rings,
      count: "120+ Items",
      gradient: "from-pink-400 to-rose-600",
      value: "rings",
    },
    {
      name: "Necklaces",
      image: categoryImages.necklaces,
      count: "85+ Items",
      gradient: "from-purple-400 to-indigo-600",
      value: "necklaces",
    },
    {
      name: "Earrings",
      image: categoryImages.earrings,
      count: "65+ Items",
      gradient: "from-blue-400 to-cyan-600",
      value: "earrings",
    },
    {
      name: "Bracelets",
      image: categoryImages.bracelets,
      count: "45+ Items",
      gradient: "from-emerald-400 to-teal-600",
      value: "bracelets",
    },
  ]);

  const API_BASE = process.env.REACT_APP_API || "/api";

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/products/category-counts`);
        setFeaturedCategories(prev => prev.map(cat => ({
          ...cat,
          count: `${response.data[cat.value] || 0}+ Items`
        })));
      } catch (error) {
        console.error("Error fetching category counts:", error);
        toast.error("Failed to load category counts");
      }
    };

    fetchCategoryCounts();
  }, [API_BASE]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/products?limit=8&featured=true`);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE}/contact`, contactForm);
      setContactForm({ name: "", email: "", message: "" });
      toast.success(response.data.message || "Thank you for your message! We'll get back to you soon.");
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubscribing(true);
    try {
      const response = await axios.post(`${API_BASE}/newsletter/subscribe`, {
        email: newsletterEmail,
      });
      setNewsletterEmail("");
      toast.success(response.data.message || "Thank you for subscribing to our newsletter!");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text text-lg font-semibold tracking-wide">
              ✨ LUXURY COLLECTION ✨
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Exquisite{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
              Jewellery
            </span>
            <br />
            Collection
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Discover timeless pieces crafted with perfection, where elegance
            meets artistry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-4 rounded-full font-bold hover:shadow-2xl transition duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              🛍️ Shop Now
            </Link>
            <button className="inline-block bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-full font-semibold hover:bg-white/20 transition duration-300 border border-white/20">
              📖 View Catalog
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories - Updated Design */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-5 px-2 py-2 bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text">
              Shop by Category
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCategories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.value}`}
                className="group relative bg-white rounded-3xl shadow-2xl p-6 text-center hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 overflow-hidden border border-gray-100"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  {/* Image Container */}
                  <div className="relative mb-6">
                    <div className="w-35 h-35 mx-auto rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-4 shadow-inner overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center text-3xl hidden">
                        {category.name === "Rings" && "💍"}
                        {category.name === "Necklaces" && "📿"}
                        {category.name === "Earrings" && "👂"}
                        {category.name === "Bracelets" && "📿"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 font-medium bg-gray-50 px-3 py-1 rounded-full inline-block group-hover:bg-gray-100 transition-colors">
                    {category.count}
                  </p>
                  
                  {/* Explore Button */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600 text-lg">
                Handpicked luxury pieces just for you
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition duration-300 transform hover:scale-105"
            >
              View All Collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.images?.[0]?.url || "/api/placeholder/300/300"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Save $
                          {(product.originalPrice - product.price).toFixed(0)}
                        </span>
                      </div>
                    )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-purple-600 font-semibold mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-purple-600">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/product/${product._id}`}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition duration-200 transform hover:scale-105 flex items-center justify-center"
                  >
                    ✨ View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No featured products available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Why Choose Us
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience luxury shopping with unmatched service and quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Free Shipping
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Complimentary shipping on all orders over $100 worldwide
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Secure Payment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                256-bit SSL encryption ensures your payment is 100% secure
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-400 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Quality Guarantee
              </h3>
              <p className="text-gray-600 leading-relaxed">
                30-day money back guarantee with lifetime warranty
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contact Info */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get In{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
                  Touch
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Have questions about our jewelry collection? We'd love to hear
                from you. Send us a message and we'll respond as soon as
                possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Visit Our Store</h4>
                    <p className="text-gray-300">
                      123 Jewelry Lane, Diamond District, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Call Us</h4>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-xl">✉️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Email Us</h4>
                    <p className="text-gray-300">hello@luxuryjewelry.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send Message ✨"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
                LuxuryJewelry
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Creating timeless pieces that celebrate life's most precious
                moments. Our expert craftsmen combine traditional techniques
                with modern design to bring you jewelry that tells your unique
                story.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  className="bg-blue-600 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center transition duration-300 transform hover:scale-110"
                >
                  {SocialIcons.facebook}
                </a>
                <a
                  href="https://instagram.com"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-10 h-10 rounded-full flex items-center justify-center transition duration-300 transform hover:scale-110"
                >
                  {SocialIcons.instagram}
                </a>
                <a
                  href="https://twitter.com"
                  className="bg-sky-500 hover:bg-sky-600 w-10 h-10 rounded-full flex items-center justify-center transition duration-300 transform hover:scale-110"
                >
                  {SocialIcons.twitter}
                </a>
                <a
                  href="https://youtube.com"
                  className="bg-red-600 hover:bg-red-700 w-10 h-10 rounded-full flex items-center justify-center transition duration-300 transform hover:scale-110"
                >
                  {SocialIcons.youtube}
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/products"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=rings"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Rings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=necklaces"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Necklaces
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=earrings"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Earrings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=bracelets"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Bracelets
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-bold text-lg mb-6">Customer Service</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    to="/returns"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Returns
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sizing"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link
                    to="/care"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Jewelry Care
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="border-t border-gray-800 pt-12 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h4 className="font-bold text-xl mb-2">Stay Updated</h4>
                <p className="text-gray-400">
                  Subscribe to get special offers and exclusive updates
                </p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-3 rounded-l-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-r-xl font-semibold hover:shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2024 Luxury Jewelry. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/cookies"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
