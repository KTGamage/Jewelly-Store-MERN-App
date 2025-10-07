// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import axios from 'axios';

// const CartContext = createContext();

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_CART':
//       return { ...state, items: action.payload };
//     case 'ADD_ITEM':
//       const existingItem = state.items.find(item => item.product === action.payload.product);
//       if (existingItem) {
//         return {
//           ...state,
//           items: state.items.map(item =>
//             item.product === action.payload.product
//               ? { ...item, quantity: item.quantity + action.payload.quantity }
//               : item
//           )
//         };
//       } else {
//         return { ...state, items: [...state.items, action.payload] };
//       }
//     case 'REMOVE_ITEM':
//       return {
//         ...state,
//         items: state.items.filter(item => item.product !== action.payload)
//       };
//     case 'UPDATE_QUANTITY':
//       return {
//         ...state,
//         items: state.items.map(item =>
//           item.product === action.payload.productId
//             ? { ...item, quantity: action.payload.quantity }
//             : item
//         )
//       };
//     case 'CLEAR_CART':
//       return { ...state, items: [] };
//     default:
//       return state;
//   }
// };

// const initialState = {
//   items: []
// };

// export const CartProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, initialState);
//   const { user } = useAuth();

//   // Load cart from backend when user logs in
//   useEffect(() => {
//     if (user) {
//       fetchCart();
//     } else {
//       dispatch({ type: 'SET_CART', payload: [] });
//     }
//   }, [user]);

//   const fetchCart = async () => {
//     try {
//       const response = await axios.get('/api/cart', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       dispatch({ type: 'SET_CART', payload: response.data.items });
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//     }
//   };

//   const addToCart = async (product, quantity) => {
//     const item = {
//       product: product._id,
//       name: product.name,
//       price: product.price,
//       image: product.images[0]?.url,
//       quantity,
//       inStock: product.stock > 0
//     };

//     if (user) {
//       try {
//         await axios.post('/api/cart/add', { productId: product._id, quantity }, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         dispatch({ type: 'ADD_ITEM', payload: item });
//       } catch (error) {
//         console.error('Error adding to cart:', error);
//       }
//     } else {
//       dispatch({ type: 'ADD_ITEM', payload: item });
//     }
//   };

//   const removeFromCart = async (productId) => {
//     if (user) {
//       try {
//         await axios.delete(`/api/cart/remove/${productId}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//       } catch (error) {
//         console.error('Error removing from cart:', error);
//       }
//     }
//     dispatch({ type: 'REMOVE_ITEM', payload: productId });
//   };

//   const updateQuantity = async (productId, quantity) => {
//     if (quantity < 1) return;
    
//     if (user) {
//       try {
//         await axios.put(`/api/cart/update/${productId}`, { quantity }, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//       } catch (error) {
//         console.error('Error updating quantity:', error);
//       }
//     }
//     dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
//   };

//   const clearCart = () => {
//     dispatch({ type: 'CLEAR_CART' });
//   };

//   const getCartTotal = () => {
//     return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const getCartItemsCount = () => {
//     return state.items.reduce((total, item) => total + item.quantity, 0);
//   };

//   return (
//     <CartContext.Provider value={{
//       cart: state,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       getCartTotal,
//       getCartItemsCount
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };








// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import axios from 'axios';

// const CartContext = createContext();

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState({ items: [] });
//   const { user } = useAuth();

//   // Fetch cart from backend when user logs in
//   useEffect(() => {
//     if (user) {
//       fetchCart();
//     } else {
//       // For guest users, use local storage
//       const localCart = localStorage.getItem('guest_cart');
//       if (localCart) {
//         setCart(JSON.parse(localCart));
//       }
//     }
//   }, [user]);

//   const fetchCart = async () => {
//     try {
//       const response = await axios.get('/api/cart');
//       setCart(response.data);
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       // If no cart exists, create one
//       if (error.response?.status === 404) {
//         setCart({ items: [] });
//       }
//     }
//   };

//   const addToCart = async (product, quantity = 1) => {
//     try {
//       if (user) {
//         // Authenticated user - save to backend
//         const response = await axios.post('/api/cart/add', {
//           productId: product._id,
//           quantity
//         });
//         setCart(response.data);
//       } else {
//         // Guest user - save to local storage
//         const updatedCart = { ...cart };
//         const existingItem = updatedCart.items.find(
//           item => item.product === product._id
//         );

//         if (existingItem) {
//           existingItem.quantity += quantity;
//         } else {
//           updatedCart.items.push({
//             product: product._id,
//             name: product.name,
//             price: product.price,
//             image: product.images?.[0]?.url,
//             quantity
//           });
//         }

//         setCart(updatedCart);
//         localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
//       }
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       throw error;
//     }
//   };

//   const removeFromCart = async (productId) => {
//     try {
//       if (user) {
//         const response = await axios.delete(`/api/cart/remove/${productId}`);
//         setCart(response.data);
//       } else {
//         const updatedCart = {
//           ...cart,
//           items: cart.items.filter(item => item.product !== productId)
//         };
//         setCart(updatedCart);
//         localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
//       }
//     } catch (error) {
//       console.error('Error removing from cart:', error);
//     }
//   };

//   const updateQuantity = async (productId, quantity) => {
//     if (quantity < 1) return;

//     try {
//       if (user) {
//         const response = await axios.put(`/api/cart/update/${productId}`, {
//           quantity
//         });
//         setCart(response.data);
//       } else {
//         const updatedCart = { ...cart };
//         const item = updatedCart.items.find(item => item.product === productId);
        
//         if (item) {
//           item.quantity = quantity;
//           setCart(updatedCart);
//           localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
//         }
//       }
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//     }
//   };

//   const clearCart = () => {
//     setCart({ items: [] });
//     if (!user) {
//       localStorage.removeItem('guest_cart');
//     }
//   };

//   const getCartItemsCount = () => {
//     return cart.items.reduce((total, item) => total + item.quantity, 0);
//   };

//   const getCartTotal = () => {
//     return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const syncGuestCart = async () => {
//     if (user && cart.items.length > 0) {
//       try {
//         for (const item of cart.items) {
//           await axios.post('/api/cart/add', {
//             productId: item.product,
//             quantity: item.quantity
//           });
//         }
//         // Refresh cart from server
//         await fetchCart();
//       } catch (error) {
//         console.error('Error syncing guest cart:', error);
//       }
//     }
//   };

//   const value = {
//     cart,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartItemsCount,
//     getCartTotal,
//     syncGuestCart
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };


import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ 
    items: [], 
    totalItems: 0, 
    totalPrice: 0 
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
      // Clear guest cart when user logs in
      localStorage.removeItem('guest_cart');
    } else {
      // For guest users, use local storage
      loadGuestCart();
    }
  }, [user]);

  const loadGuestCart = () => {
    try {
      const localCart = localStorage.getItem('guest_cart');
      if (localCart) {
        const parsedCart = JSON.parse(localCart);
        setCart({
          ...parsedCart,
          totalItems: getCartItemsCount(parsedCart.items),
          totalPrice: getCartTotal(parsedCart.items)
        });
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    }
  };

  const saveGuestCart = (cartData) => {
    try {
      localStorage.setItem('guest_cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/cart', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setCart({
        items: response.data.items || [],
        totalItems: response.data.totalItems || 0,
        totalPrice: response.data.totalPrice || 0
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.response?.data?.message || 'Failed to fetch cart');
      // Initialize empty cart on error
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);

      if (!product || !product._id) {
        throw new Error('Invalid product data');
      }

      const quantityNum = parseInt(quantity);
      if (isNaN(quantityNum) || quantityNum < 1) {
        throw new Error('Invalid quantity');
      }

      if (user) {
        // Authenticated user - save to backend
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/cart/add', {
          productId: product._id,
          quantity: quantityNum
        }, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          setCart({
            items: response.data.cart.items || [],
            totalItems: response.data.cart.totalItems || 0,
            totalPrice: response.data.cart.totalPrice || 0
          });
          return { 
            success: true, 
            message: response.data.message || 'Added to cart successfully!' 
          };
        } else {
          throw new Error(response.data.message || 'Failed to add to cart');
        }
      } else {
        // Guest user - save to local storage
        const updatedCart = { ...cart };
        const existingItemIndex = updatedCart.items.findIndex(
          item => item.product === product._id || item.productDetails?._id === product._id
        );

        if (existingItemIndex > -1) {
          // Update existing item
          updatedCart.items[existingItemIndex].quantity += quantityNum;
        } else {
          // Add new item
          updatedCart.items.push({
            product: product._id,
            productDetails: {
              _id: product._id,
              name: product.name,
              price: product.price,
              images: product.images || [],
              category: product.category,
              stock: product.stock,
              material: product.material,
              description: product.description
            },
            quantity: quantityNum
          });
        }

        // Update totals
        updatedCart.totalItems = getCartItemsCount(updatedCart.items);
        updatedCart.totalPrice = getCartTotal(updatedCart.items);

        setCart(updatedCart);
        saveGuestCart(updatedCart);
        
        return { 
          success: true, 
          message: 'Added to cart successfully!' 
        };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      const message = error.response?.data?.message || error.message || 'Failed to add to cart. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      setError(null);

      if (user) {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/api/cart/remove/${productId}`, {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });
        
        if (response.data.success) {
          setCart({
            items: response.data.cart.items || [],
            totalItems: response.data.cart.totalItems || 0,
            totalPrice: response.data.cart.totalPrice || 0
          });
          return { 
            success: true, 
            message: response.data.message || 'Item removed from cart' 
          };
        } else {
          throw new Error(response.data.message || 'Failed to remove from cart');
        }
      } else {
        const updatedCart = {
          ...cart,
          items: cart.items.filter(item => 
            item.product !== productId && item.productDetails?._id !== productId
          )
        };

        // Update totals
        updatedCart.totalItems = getCartItemsCount(updatedCart.items);
        updatedCart.totalPrice = getCartTotal(updatedCart.items);

        setCart(updatedCart);
        saveGuestCart(updatedCart);
        return { 
          success: true, 
          message: 'Item removed from cart' 
        };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      const message = error.response?.data?.message || error.message || 'Failed to remove from cart';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return { success: false, message: 'Quantity must be at least 1' };
    }

    try {
      setLoading(true);
      setError(null);

      if (user) {
        const token = localStorage.getItem('token');
        const response = await axios.put(`/api/cart/update/${productId}`, {
          quantity: parseInt(quantity)
        }, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          setCart({
            items: response.data.cart.items || [],
            totalItems: response.data.cart.totalItems || 0,
            totalPrice: response.data.cart.totalPrice || 0
          });
          return { 
            success: true, 
            message: response.data.message || 'Quantity updated successfully' 
          };
        } else {
          throw new Error(response.data.message || 'Failed to update quantity');
        }
      } else {
        const updatedCart = { ...cart };
        const itemIndex = updatedCart.items.findIndex(item => 
          item.product === productId || item.productDetails?._id === productId
        );
        
        if (itemIndex > -1) {
          updatedCart.items[itemIndex].quantity = parseInt(quantity);
          
          // Update totals
          updatedCart.totalItems = getCartItemsCount(updatedCart.items);
          updatedCart.totalPrice = getCartTotal(updatedCart.items);

          setCart(updatedCart);
          saveGuestCart(updatedCart);
          return { 
            success: true, 
            message: 'Quantity updated successfully' 
          };
        } else {
          return { success: false, message: 'Item not found in cart' };
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      const message = error.response?.data?.message || error.message || 'Failed to update quantity';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user) {
        const token = localStorage.getItem('token');
        await axios.delete('/api/cart/clear', {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });
      }
      
      const emptyCart = { items: [], totalItems: 0, totalPrice: 0 };
      setCart(emptyCart);
      
      if (!user) {
        localStorage.removeItem('guest_cart');
      }
      
      return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
      console.error('Error clearing cart:', error);
      const message = error.response?.data?.message || error.message || 'Failed to clear cart';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const syncGuestCart = async () => {
    if (user && cart.items.length > 0) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Add all guest cart items to user cart
        for (const item of cart.items) {
          const productId = item.product || item.productDetails?._id;
          if (productId) {
            await axios.post('/api/cart/add', {
              productId: productId,
              quantity: item.quantity
            }, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
          }
        }
        
        // Refresh cart from server
        await fetchCart();
        // Clear local storage
        localStorage.removeItem('guest_cart');
      } catch (error) {
        console.error('Error syncing guest cart:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper functions
  const getCartItemsCount = (items = cart.items) => {
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getCartTotal = (items = cart.items) => {
    return items.reduce((total, item) => {
      const price = item.productDetails?.price || item.price || 0;
      return total + (price * (item.quantity || 0));
    }, 0);
  };

  const isItemInCart = (productId) => {
    return cart.items.some(item => 
      item.product === productId || item.productDetails?._id === productId
    );
  };

  const getItemQuantity = (productId) => {
    const item = cart.items.find(item => 
      item.product === productId || item.productDetails?._id === productId
    );
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    getCartTotal,
    syncGuestCart,
    fetchCart,
    isItemInCart,
    getItemQuantity,
    clearError: () => setError(null)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};