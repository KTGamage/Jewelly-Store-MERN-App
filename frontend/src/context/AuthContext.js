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
//       const response = await axios.post('/api/auth/login', { email, password });
//       setCurrentUser(response.data.user);
//       localStorage.setItem('token', response.data.token);
//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await axios.post('/api/auth/register', userData);
//       setCurrentUser(response.data.user);
//       localStorage.setItem('token', response.data.token);
//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   };

//   const logout = () => {
//     setCurrentUser(null);
//     localStorage.removeItem('token');
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Verify token and get user data
//       axios.get('/api/auth/me', {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then(response => {
//         setCurrentUser(response.data.user);
//       })
//       .catch(() => {
//         localStorage.removeItem('token');
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
//     register,
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
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       setUser(JSON.parse(userData));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     try {
//       // Mock login - replace with actual API call
//       if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
//         const userData = {
//           id: 1,
//           name: 'Demo User',
//           email: credentials.email
//         };
//         setUser(userData);
//         localStorage.setItem('user', JSON.stringify(userData));
//         return { success: true, user: userData };
//       } else {
//         return { success: false, error: 'Invalid credentials' };
//       }
//     } catch (error) {
//       return { success: false, error: 'Login failed' };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       // Mock registration - replace with actual API call
//       const newUser = {
//         id: Date.now(),
//         name: userData.name,
//         email: userData.email
//       };
//       setUser(newUser);
//       localStorage.setItem('user', JSON.stringify(newUser));
//       return { success: true, user: newUser };
//     } catch (error) {
//       throw new Error('Registration failed');
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user
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
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Set up axios defaults
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.defaults.headers.common['x-auth-token'] = token;
//     }
//   }, []);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const response = await axios.get('/api/auth/me');
//           setUser(response.data);
//         } catch (error) {
//           localStorage.removeItem('token');
//           delete axios.defaults.headers.common['x-auth-token'];
//         }
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const response = await axios.post('/api/auth/login', credentials);
//       const { token, user } = response.data;
      
//       localStorage.setItem('token', token);
//       axios.defaults.headers.common['x-auth-token'] = token;
//       setUser(user);
      
//       return { success: true, user };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.response?.data?.errors?.[0]?.msg || 'Login failed' 
//       };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await axios.post('/api/auth/register', userData);
//       const { token, user } = response.data;
      
//       localStorage.setItem('token', token);
//       axios.defaults.headers.common['x-auth-token'] = token;
//       setUser(user);
      
//       return { success: true, user };
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.errors?.[0]?.msg || 'Registration failed'
//       );
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['x-auth-token'];
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
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
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.errors?.[0]?.msg || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      throw new Error(
        error.response?.data?.errors?.[0]?.msg || 'Registration failed'
      );
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}