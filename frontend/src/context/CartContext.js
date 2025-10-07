import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.product === action.payload.product);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product === action.payload.product
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return { ...state, items: [...state.items, action.payload] };
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

const initialState = {
  items: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Load cart from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      dispatch({ type: 'SET_CART', payload: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch({ type: 'SET_CART', payload: response.data.items });
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (product, quantity) => {
    const item = {
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
      quantity,
      inStock: product.stock > 0
    };

    if (user) {
      try {
        await axios.post('/api/cart/add', { productId: product._id, quantity }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        dispatch({ type: 'ADD_ITEM', payload: item });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      dispatch({ type: 'ADD_ITEM', payload: item });
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        await axios.delete(`/api/cart/remove/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    if (user) {
      try {
        await axios.put(`/api/cart/update/${productId}`, { quantity }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart: state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};