// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';

// function Cart() {
//   const { user } = useAuth();
//   const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount, syncGuestCart } = useCart();
//   const navigate = useNavigate();
//   const [promoCode, setPromoCode] = useState('');
//   const [appliedPromo, setAppliedPromo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [updatingItems, setUpdatingItems] = useState({});

//   // Ensure we have cart items
//   const cartItems = cart?.items || [];

//   const applyPromoCode = () => {
//     if (promoCode.toUpperCase() === 'LUXURY10') {
//       setAppliedPromo({ code: 'LUXURY10', discount: 0.1, description: '10% off your order' });
//     } else if (promoCode.toUpperCase() === 'WELCOME20') {
//       setAppliedPromo({ code: 'WELCOME20', discount: 0.2, description: '20% off for new customers' });
//     } else {
//       alert('Invalid promo code');
//     }
//     setPromoCode('');
//   };

//   const handleQuantityChange = async (productId, newQuantity) => {
//     if (newQuantity < 1) return;
    
//     setUpdatingItems(prev => ({ ...prev, [productId]: true }));
//     try {
//       await updateQuantity(productId, newQuantity);
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       alert('Failed to update quantity');
//     } finally {
//       setUpdatingItems(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   const handleRemoveItem = async (productId) => {
//     if (window.confirm('Are you sure you want to remove this item from your cart?')) {
//       try {
//         await removeFromCart(productId);
//       } catch (error) {
//         console.error('Error removing item:', error);
//         alert('Failed to remove item from cart');
//       }
//     }
//   };

//   const handleClearCart = async () => {
//     if (window.confirm('Are you sure you want to clear your entire cart?')) {
//       try {
//         await clearCart();
//       } catch (error) {
//         console.error('Error clearing cart:', error);
//         alert('Failed to clear cart');
//       }
//     }
//   };

//   const getSubtotal = () => {
//     return cartItems.reduce((total, item) => {
//       // Handle both populated product and product details
//       const product = item.product || {};
//       const price = product.price || 0;
//       return total + (price * item.quantity);
//     }, 0);
//   };

//   const getDiscount = () => {
//     return appliedPromo ? getSubtotal() * appliedPromo.discount : 0;
//   };

//   const getShipping = () => {
//     const subtotal = getSubtotal();
//     if (subtotal === 0) return 0;
//     return subtotal > 100 ? 0 : 15;
//   };

//   const getTax = () => {
//     const subtotalAfterDiscount = getSubtotal() - getDiscount();
//     return subtotalAfterDiscount * 0.08;
//   };

//   const getTotal = () => {
//     return getSubtotal() - getDiscount() + getShipping() + getTax();
//   };

//   const handleCheckout = async () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Sync guest cart if needed
//       if (typeof syncGuestCart === 'function') {
//         await syncGuestCart();
//       }

//       // For now, just navigate to a checkout page or show success
//       alert('Checkout functionality would be implemented here!');
//       // navigate('/checkout');
//     } catch (error) {
//       console.error('Error during checkout:', error);
//       alert('Failed to process checkout. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center py-12 px-4">
//         <div className="text-center bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 max-w-md">
//           <div className="text-8xl mb-6">🛒</div>
//           <h2 className="text-3xl font-bold text-white mb-4">Sign In Required</h2>
//           <p className="text-blue-100 mb-8 leading-relaxed">
//             Please sign in to view your luxury jewelry cart and continue your shopping journey.
//           </p>
//           <div className="space-y-4">
//             <button 
//               onClick={() => navigate('/login')}
//               className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
//             >
//               Sign In
//             </button>
//             <button 
//               onClick={() => navigate('/register')}
//               className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
//             >
//               Create Account
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 mt-16">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-white/50">
//             <div className="text-8xl mb-8">🛒</div>
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
//             <p className="text-gray-600 mb-10 text-lg leading-relaxed">
//               Discover our exquisite collection of handcrafted jewelry pieces waiting to adorn you.
//             </p>
//             <Link 
//               to="/products"
//               className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
//             >
//               Start Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 mt-16">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Shopping <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">Cart</span>
//           </h1>
//           <p className="text-gray-600 text-lg">Review your selected luxury pieces</p>
//         </div>
        
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="xl:col-span-2 space-y-6">
//             <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
//               <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-xl font-bold">Your Items ({cartItems.length})</h3>
//                   <button
//                     onClick={handleClearCart}
//                     className="text-white/80 hover:text-white text-sm font-medium hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
//                   >
//                     Clear Cart
//                   </button>
//                 </div>
//               </div>
              
//               <div className="divide-y divide-gray-200">
//                 {cartItems.map((item) => {
//                   // Handle both populated product object and product ID
//                   const product = item.product || {};
//                   const productId = product._id || item.product;
//                   const productName = product.name || 'Product';
//                   const productPrice = product.price || 0;
//                   const productImage = product.images?.[0]?.url || '/api/placeholder/200/200';
//                   const productCategory = product.category || '';

//                   return (
//                     <div key={productId} className="p-6 hover:bg-gray-50/50 transition-colors duration-300">
//                       <div className="flex items-center space-x-6">
//                         <div className="relative">
//                           <img 
//                             src={productImage} 
//                             alt={productName}
//                             className="w-24 h-24 object-cover rounded-xl shadow-md"
//                             onError={(e) => {
//                               e.target.src = '/api/placeholder/200/200';
//                             }}
//                           />
//                         </div>
                        
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-start mb-2">
//                             <div>
//                               <h3 className="font-bold text-lg text-gray-900 truncate">{productName}</h3>
//                               <p className="text-purple-600 text-sm font-medium">${productPrice}</p>
//                               {productCategory && (
//                                 <p className="text-gray-500 text-xs mt-1">{productCategory}</p>
//                               )}
//                             </div>
//                             <button
//                               onClick={() => handleRemoveItem(productId)}
//                               className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all duration-200"
//                               disabled={updatingItems[productId]}
//                             >
//                               <span className="text-xl">🗑️</span>
//                             </button>
//                           </div>
                          
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-2">
//                               <span className="text-xl font-bold text-purple-600">${productPrice}</span>
//                             </div>
                            
//                             <div className="flex items-center space-x-3">
//                               <div className="flex items-center bg-gray-100 rounded-xl">
//                                 <button 
//                                   onClick={() => handleQuantityChange(productId, item.quantity - 1)}
//                                   disabled={item.quantity <= 1 || updatingItems[productId]}
//                                   className="w-10 h-10 rounded-l-xl border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
//                                 >
//                                   −
//                                 </button>
//                                 <span className="w-12 h-10 bg-white border-t border-b border-gray-300 flex items-center justify-center font-semibold">
//                                   {updatingItems[productId] ? '...' : item.quantity}
//                                 </span>
//                                 <button 
//                                   onClick={() => handleQuantityChange(productId, item.quantity + 1)}
//                                   disabled={updatingItems[productId]}
//                                   className="w-10 h-10 rounded-r-xl border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
//                                 >
//                                   +
//                                 </button>
//                               </div>
                              
//                               <div className="text-right min-w-[80px]">
//                                 <p className="font-bold text-gray-900">
//                                   ${(productPrice * item.quantity).toFixed(2)}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Promo Code */}
//             <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
//               <h3 className="font-bold text-lg mb-4 flex items-center">
//                 <span className="mr-2">🎫</span>
//                 Promo Code
//               </h3>
//               <div className="flex space-x-3">
//                 <input
//                   type="text"
//                   placeholder="Enter promo code"
//                   value={promoCode}
//                   onChange={(e) => setPromoCode(e.target.value)}
//                   className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//                 <button
//                   onClick={applyPromoCode}
//                   className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
//                 >
//                   Apply
//                 </button>
//               </div>
//               {appliedPromo && (
//                 <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
//                   <p className="text-green-800 font-medium">
//                     ✅ {appliedPromo.code}: {appliedPromo.description}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="xl:col-span-1">
//             <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 sticky top-4">
//               <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
//                 <h3 className="text-xl font-bold">Order Summary</h3>
//               </div>
              
//               <div className="p-6 space-y-4">
//                 <div className="flex justify-between text-lg">
//                   <span>Subtotal:</span>
//                   <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
//                 </div>
                
//                 {getDiscount() > 0 && (
//                   <div className="flex justify-between text-lg text-green-600">
//                     <span>Discount:</span>
//                     <span className="font-semibold">-${getDiscount().toFixed(2)}</span>
//                   </div>
//                 )}
                
//                 <div className="flex justify-between text-lg">
//                   <span>Shipping:</span>
//                   <span className="font-semibold">
//                     {getShipping() === 0 ? (
//                       <span className="text-green-600">FREE</span>
//                     ) : (
//                       `$${getShipping().toFixed(2)}`
//                     )}
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between text-lg">
//                   <span>Tax:</span>
//                   <span className="font-semibold">${getTax().toFixed(2)}</span>
//                 </div>
                
//                 <div className="border-t border-gray-200 pt-4">
//                   <div className="flex justify-between text-2xl font-bold">
//                     <span>Total:</span>
//                     <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
//                       ${getTotal().toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <button 
//                   onClick={handleCheckout}
//                   disabled={loading}
//                   className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? 'Processing...' : 'Proceed to Checkout'}
//                 </button>
                
//                 <Link 
//                   to="/products"
//                   className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold text-center block"
//                 >
//                   Continue Shopping
//                 </Link>

//                 {getSubtotal() < 100 && getSubtotal() > 0 && (
//                   <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//                     <p className="text-blue-800 text-sm font-medium text-center">
//                       Add ${(100 - getSubtotal()).toFixed(2)} more for free shipping!
//                     </p>
//                   </div>
//                 )}

//                 {/* Security badges */}
//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <div className="grid grid-cols-2 gap-4 text-center">
//                     <div className="flex flex-col items-center">
//                       <span className="text-2xl mb-1">🔒</span>
//                       <span className="text-xs text-gray-600">Secure Payment</span>
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <span className="text-2xl mb-1">✅</span>
//                       <span className="text-xs text-gray-600">SSL Protected</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Cart;










import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function Cart() {
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount, syncGuestCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState({});
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Ensure we have cart items
  const cartItems = cart?.items || [];

  // Load user's default address if available
  useEffect(() => {
    if (user?.shippingAddress) {
      setShippingAddress(user.shippingAddress);
    }
  }, [user]);

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'LUXURY10') {
      setAppliedPromo({ code: 'LUXURY10', discount: 0.1, description: '10% off your order' });
    } else if (promoCode.toUpperCase() === 'WELCOME20') {
      setAppliedPromo({ code: 'WELCOME20', discount: 0.2, description: '20% off for new customers' });
    } else {
      alert('Invalid promo code');
    }
    setPromoCode('');
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      try {
        await removeFromCart(productId);
      } catch (error) {
        console.error('Error removing item:', error);
        alert('Failed to remove item from cart');
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Failed to clear cart');
      }
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = item.product || {};
      const price = product.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getDiscount = () => {
    return appliedPromo ? getSubtotal() * appliedPromo.discount : 0;
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 100 ? 0 : 15;
  };

  const getTax = () => {
    const subtotalAfterDiscount = getSubtotal() - getDiscount();
    return subtotalAfterDiscount * 0.08;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount() + getShipping() + getTax();
  };

  const validateAddress = () => {
    const required = ['street', 'city', 'state', 'zipCode', 'country'];
    for (const field of required) {
      if (!shippingAddress[field].trim()) {
        alert(`Please fill in the ${field} field`);
        return false;
      }
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!validateAddress()) {
      setShowAddressForm(true);
      return;
    }

    setLoading(true);
    try {
      // Sync guest cart if needed
      if (typeof syncGuestCart === 'function') {
        await syncGuestCart();
      }

      // Prepare order items
      const orderItems = cartItems.map(item => {
        const product = item.product || {};
        return {
          product: product._id || item.product,
          quantity: item.quantity,
          price: product.price || 0
        };
      });

      const orderData = {
        items: orderItems,
        totalAmount: getTotal(),
        shippingAddress: shippingAddress,
        paymentMethod: 'free_order',
        transactionId: `free_order_${Date.now()}`
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/orders', orderData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Clear cart after successful order
        await clearCart();
        
        // Navigate to order success page
        navigate('/order-success', { 
          state: { 
            orderId: response.data.order._id,
            order: response.data.order
          } 
        });
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }

    } catch (error) {
      console.error('Error during checkout:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to process order. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center py-12 px-4">
        <div className="text-center bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 max-w-md">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Please sign in to view your luxury jewelry cart and continue your shopping journey.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-white/50">
            <div className="text-8xl mb-8">🛒</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-10 text-lg leading-relaxed">
              Discover our exquisite collection of handcrafted jewelry pieces waiting to adorn you.
            </p>
            <Link 
              to="/products"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shopping <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">Cart</span>
          </h1>
          <p className="text-gray-600 text-lg">Review your selected luxury pieces</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items & Address Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Shipping Address Form */}
            {showAddressForm && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <span className="mr-2">📍</span>
                  Shipping Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="NY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="10001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="USA"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm & Checkout'}
                  </button>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Your Items ({cartItems.length})</h3>
                  <button
                    onClick={handleClearCart}
                    className="text-white/80 hover:text-white text-sm font-medium hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const product = item.product || {};
                  const productId = product._id || item.product;
                  const productName = product.name || 'Product';
                  const productPrice = product.price || 0;
                  const productImage = product.images?.[0]?.url || '/api/placeholder/200/200';
                  const productCategory = product.category || '';

                  return (
                    <div key={productId} className="p-6 hover:bg-gray-50/50 transition-colors duration-300">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <img 
                            src={productImage} 
                            alt={productName}
                            className="w-24 h-24 object-cover rounded-xl shadow-md"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/200/200';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 truncate">{productName}</h3>
                              <p className="text-purple-600 text-sm font-medium">${productPrice}</p>
                              {productCategory && (
                                <p className="text-gray-500 text-xs mt-1">{productCategory}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveItem(productId)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all duration-200"
                              disabled={updatingItems[productId]}
                            >
                              <span className="text-xl">🗑️</span>
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-purple-600">${productPrice}</span>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center bg-gray-100 rounded-xl">
                                <button 
                                  onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || updatingItems[productId]}
                                  className="w-10 h-10 rounded-l-xl border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                  −
                                </button>
                                <span className="w-12 h-10 bg-white border-t border-b border-gray-300 flex items-center justify-center font-semibold">
                                  {updatingItems[productId] ? '...' : item.quantity}
                                </span>
                                <button 
                                  onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                                  disabled={updatingItems[productId]}
                                  className="w-10 h-10 rounded-r-xl border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                  +
                                </button>
                              </div>
                              
                              <div className="text-right min-w-[80px]">
                                <p className="font-bold text-gray-900">
                                  ${(productPrice * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <span className="mr-2">🎫</span>
                Promo Code
              </h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={applyPromoCode}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-800 font-medium">
                    ✅ {appliedPromo.code}: {appliedPromo.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 sticky top-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
                <h3 className="text-xl font-bold">Order Summary</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                </div>
                
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-lg text-green-600">
                    <span>Discount:</span>
                    <span className="font-semibold">-${getDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg">
                  <span>Shipping:</span>
                  <span className="font-semibold">
                    {getShipping() === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${getShipping().toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-lg">
                  <span>Tax:</span>
                  <span className="font-semibold">${getTax().toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                      ${getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Shipping Address Preview */}
                {!showAddressForm && (
                  <div className="bg-gray-50 rounded-xl p-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <span className="mr-2">📍</span>
                      Shipping To:
                    </h4>
                    {shippingAddress.street ? (
                      <p className="text-sm text-gray-600">
                        {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}, {shippingAddress.country}
                      </p>
                    ) : (
                      <p className="text-sm text-yellow-600">
                        Please add shipping address
                      </p>
                    )}
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                    >
                      {shippingAddress.street ? 'Change Address' : 'Add Address'}
                    </button>
                  </div>
                )}

                <button 
                  onClick={handleCheckout}
                  disabled={loading || !shippingAddress.street}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
                
                <Link 
                  to="/products"
                  className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold text-center block"
                >
                  Continue Shopping
                </Link>

                {getSubtotal() < 100 && getSubtotal() > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-blue-800 text-sm font-medium text-center">
                      Add ${(100 - getSubtotal()).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Security badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-1">🔒</span>
                      <span className="text-xs text-gray-600">Secure Payment</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-1">✅</span>
                      <span className="text-xs text-gray-600">SSL Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;