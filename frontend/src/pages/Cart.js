// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// function Cart() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   // Mock cart data - replace with actual cart state management
//   const cartItems = [
//     {
//       id: '1',
//       name: 'Diamond Engagement Ring',
//       price: 2999.99,
//       quantity: 1,
//       image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150',
//       category: 'Rings'
//     },
//     {
//       id: '2',
//       name: 'Gold Pearl Necklace',
//       price: 1599.50,
//       quantity: 2,
//       image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150',
//       category: 'Necklaces'
//     }
//   ];

//   const getTotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const getSubtotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const shipping = getSubtotal() > 100 ? 0 : 15;
//   const tax = getSubtotal() * 0.08; // 8% tax
//   const total = getSubtotal() + shipping + tax;

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🛒</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
//           <p className="text-gray-600 mb-6">You need to be signed in to view your cart.</p>
//           <div className="space-x-4">
//             <button 
//               onClick={() => navigate('/login')}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
//             >
//               Sign In
//             </button>
//             <button 
//               onClick={() => navigate('/register')}
//               className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
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
//       <div className="min-h-screen bg-gray-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="text-6xl mb-4">🛒</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
//           <p className="text-gray-600 mb-6">Start shopping to add items to your cart.</p>
//           <Link 
//             to="/products"
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm">
//               {cartItems.map(item => (
//                 <div key={item.id} className="flex items-center border-b border-gray-200 p-4 last:border-b-0">
//                   <img 
//                     src={item.image} 
//                     alt={item.name}
//                     className="w-20 h-20 object-cover rounded-lg"
//                   />
                  
//                   <div className="flex-1 ml-4">
//                     <h3 className="font-semibold text-gray-900">{item.name}</h3>
//                     <p className="text-gray-600 text-sm">{item.category}</p>
//                     <p className="text-blue-600 font-semibold">${item.price}</p>
//                   </div>
                  
//                   <div className="flex items-center space-x-2">
//                     <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
//                       -
//                     </button>
//                     <span className="w-8 text-center">{item.quantity}</span>
//                     <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
//                       +
//                     </button>
//                   </div>
                  
//                   <div className="ml-4 text-right">
//                     <p className="font-semibold text-gray-900">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </p>
//                     <button className="text-red-600 text-sm hover:text-red-800 mt-1">
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
//               <div className="space-y-3 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span>Subtotal</span>
//                   <span>${getSubtotal().toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Shipping</span>
//                   <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Tax</span>
//                   <span>${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="border-t border-gray-200 pt-3">
//                   <div className="flex justify-between font-semibold">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold mb-4">
//                 Proceed to Checkout
//               </button>
              
//               <Link 
//                 to="/products"
//                 className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold text-center block"
//               >
//                 Continue Shopping
//               </Link>

//               {getSubtotal() < 100 && (
//                 <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <p className="text-sm text-yellow-800">
//                     Add ${(100 - getSubtotal()).toFixed(2)} more for free shipping!
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Cart;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Diamond Engagement Ring',
      price: 2999.99,
      originalPrice: 3499.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150',
      category: 'Rings',
      inStock: true
    },
    {
      id: '2',
      name: 'Gold Pearl Necklace',
      price: 1599.50,
      originalPrice: 1899.50,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150',
      category: 'Necklaces',
      inStock: true
    },
    {
      id: '3',
      name: 'Silver Diamond Earrings',
      price: 899.99,
      originalPrice: 1099.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150',
      category: 'Earrings',
      inStock: false
    }
  ]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

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

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
    return subtotalAfterDiscount * 0.08; // 8% tax
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount() + getShipping() + getTax();
  };

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      const savings = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0;
      return total + savings;
    }, 0) + getDiscount();
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shopping <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">Cart</span>
          </h1>
          <p className="text-gray-600 text-lg">Review your selected luxury pieces</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <h3 className="text-xl font-bold">Your Items ({cartItems.length})</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-300">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl shadow-md"
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-red-600 font-bold text-xs">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 truncate">{item.name}</h3>
                            <p className="text-purple-600 text-sm font-medium">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all duration-200"
                          >
                            <span className="text-xl">🗑️</span>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-purple-600">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-gray-100 rounded-xl">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-10 h-10 rounded-l-xl border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                              >
                                −
                              </button>
                              <span className="w-12 h-10 bg-white border-t border-b border-gray-300 flex items-center justify-center font-semibold">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-10 h-10 rounded-r-xl border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            
                            <div className="text-right min-w-[80px]">
                              <p className="font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                
                {getTotalSavings() > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <p className="text-yellow-800 font-semibold text-center">
                      🎉 You're saving ${getTotalSavings().toFixed(2)}!
                    </p>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                      ${getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold text-lg mb-4">
                  Proceed to Checkout
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