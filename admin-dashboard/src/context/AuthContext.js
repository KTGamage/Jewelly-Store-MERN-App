import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jewelly-store-mern-app-production.up.railway.app';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for auth tokens
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    }

    // Response interceptor to handle auth errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          delete axios.defaults.headers.common['x-auth-token'];
          setCurrentUser(null);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    checkAuthStatus();

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['x-auth-token'] = token;
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
      
      if (response.data.role === 'admin') {
        setCurrentUser(response.data);
      } else {
        throw new Error('Not an admin user');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      delete axios.defaults.headers.common['x-auth-token'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;

      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Store token and set user
      localStorage.setItem('adminToken', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      setCurrentUser(user);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      if (error.response?.data?.errors?.[0]?.msg) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['x-auth-token'];
    setCurrentUser(null);
    window.location.href = '/login';
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}