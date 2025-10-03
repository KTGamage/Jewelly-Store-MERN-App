// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('/api/admin/login', { email, password });
//       setCurrentUser(response.data.user);
//       localStorage.setItem('adminToken', response.data.token);
//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   };

//   const logout = () => {
//     setCurrentUser(null);
//     localStorage.removeItem('adminToken');
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       // Verify token and get admin user data
//       axios.get('/api/admin/me', {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then(response => {
//         setCurrentUser(response.data.user);
//       })
//       .catch(() => {
//         localStorage.removeItem('adminToken');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const value = {
//     currentUser,
//     login,
//     logout
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Predefined admin credentials
//   const ADMIN_CREDENTIALS = {
//     email: 'admin@jewellery.com',
//     password: 'admin123'
//   };

//   const login = async (email, password) => {
//     try {
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
//         const user = {
//           id: 1,
//           name: 'Admin User',
//           email: email,
//           role: 'admin'
//         };
        
//         setCurrentUser(user);
//         localStorage.setItem('adminToken', 'mock-jwt-token');
//         localStorage.setItem('adminUser', JSON.stringify(user));
//         return { success: true, user };
//       } else {
//         throw new Error('Invalid email or password');
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = () => {
//     setCurrentUser(null);
//     localStorage.removeItem('adminToken');
//     localStorage.removeItem('adminUser');
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');
//     const userData = localStorage.getItem('adminUser');
    
//     if (token && userData) {
//       try {
//         setCurrentUser(JSON.parse(userData));
//       } catch (error) {
//         localStorage.removeItem('adminToken');
//         localStorage.removeItem('adminUser');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const value = {
//     currentUser,
//     login,
//     logout,
//     isAuthenticated: !!currentUser
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       axios.defaults.headers.common['x-auth-token'] = token;
//       // Verify token and get user info
//       checkAuth();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const checkAuth = async () => {
//     try {
//       const response = await axios.get('/api/auth/me');
//       if (response.data.role === 'admin') {
//         setCurrentUser(response.data);
//       } else {
//         throw new Error('Not an admin user');
//       }
//     } catch (error) {
//       localStorage.removeItem('adminToken');
//       delete axios.defaults.headers.common['x-auth-token'];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('/api/auth/login', { email, password });
//       const { token, user } = response.data;
      
//       if (user.role !== 'admin') {
//         throw new Error('Access denied. Admin privileges required.');
//       }
      
//       localStorage.setItem('adminToken', token);
//       axios.defaults.headers.common['x-auth-token'] = token;
//       setCurrentUser(user);
      
//       return { success: true, user };
//     } catch (error) {
//       throw new Error(error.response?.data?.errors?.[0]?.msg || 'Login failed');
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('adminToken');
//     delete axios.defaults.headers.common['x-auth-token'];
//     setCurrentUser(null);
//   };

//   const value = {
//     currentUser,
//     login,
//     logout,
//     isAuthenticated: !!currentUser
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.role === 'admin') {
        setCurrentUser(response.data);
      } else {
        throw new Error('Not an admin user');
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      localStorage.removeItem('adminToken');
      delete axios.defaults.headers.common['x-auth-token'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      localStorage.setItem('adminToken', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      setCurrentUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Admin login error:', error);
      throw new Error(error.response?.data?.errors?.[0]?.msg || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['x-auth-token'];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}