// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jewelly-store-mern-app-production.up.railway.app';

// const AuthContext = createContext();

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Set up axios interceptor for auth tokens
//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       axios.defaults.headers.common['x-auth-token'] = token;
//     }

//     // Response interceptor to handle auth errors
//     const interceptor = axios.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response?.status === 401) {
//           localStorage.removeItem('adminToken');
//           delete axios.defaults.headers.common['x-auth-token'];
//           setCurrentUser(null);
//           window.location.href = '/login';
//         }
//         return Promise.reject(error);
//       }
//     );

//     checkAuthStatus();

//     return () => {
//       axios.interceptors.response.eject(interceptor);
//     };
//   }, []);

//   const checkAuthStatus = async () => {
//     const token = localStorage.getItem('adminToken');
    
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       axios.defaults.headers.common['x-auth-token'] = token;
//       const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
      
//       if (response.data.role === 'admin') {
//         setCurrentUser(response.data);
//       } else {
//         throw new Error('Not an admin user');
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       localStorage.removeItem('adminToken');
//       delete axios.defaults.headers.common['x-auth-token'];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
//         email,
//         password
//       });

//       const { token, user } = response.data;

//       if (user.role !== 'admin') {
//         throw new Error('Access denied. Admin privileges required.');
//       }

//       // Store token and set user
//       localStorage.setItem('adminToken', token);
//       axios.defaults.headers.common['x-auth-token'] = token;
//       setCurrentUser(user);

//       return { success: true };
//     } catch (error) {
//       console.error('Login error:', error);
      
//       let errorMessage = 'Login failed';
//       if (error.response?.data?.errors?.[0]?.msg) {
//         errorMessage = error.response.data.errors[0].msg;
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       throw new Error(errorMessage);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('adminToken');
//     delete axios.defaults.headers.common['x-auth-token'];
//     setCurrentUser(null);
//     window.location.href = '/login';
//   };

//   const value = {
//     currentUser,
//     login,
//     logout,
//     isAuthenticated: !!currentUser,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }










// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Use consistent environment variable name
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jewelly-store-mern-app-production.up.railway.app';

// const AuthContext = createContext();

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Create axios instance with base URL
//   const api = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
//   });

//   // Set up axios interceptor for auth tokens
//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');
    
//     // Response interceptor to handle auth errors
//     const interceptor = api.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response?.status === 401) {
//           localStorage.removeItem('adminToken');
//           setCurrentUser(null);
//           window.location.href = '/login';
//         }
//         return Promise.reject(error);
//       }
//     );

//     checkAuthStatus();

//     return () => {
//       api.interceptors.response.eject(interceptor);
//     };
//   }, []);

//   const checkAuthStatus = async () => {
//     const token = localStorage.getItem('adminToken');
    
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await api.get('/api/auth/me', {
//         headers: {
//           'x-auth-token': token
//         }
//       });
      
//       if (response.data.role === 'admin') {
//         setCurrentUser(response.data);
//       } else {
//         throw new Error('Not an admin user');
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       localStorage.removeItem('adminToken');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await api.post('/api/auth/login', {
//         email,
//         password
//       });

//       const { token, user } = response.data;

//       if (user.role !== 'admin') {
//         throw new Error('Access denied. Admin privileges required.');
//       }

//       // Store token and set user
//       localStorage.setItem('adminToken', token);
//       setCurrentUser(user);

//       return { success: true };
//     } catch (error) {
//       console.error('Login error:', error);
      
//       let errorMessage = 'Login failed';
      
//       // Handle different error response formats
//       if (error.response?.data?.errors?.[0]?.msg) {
//         errorMessage = error.response.data.errors[0].msg;
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       } else if (error.response?.status === 404) {
//         errorMessage = 'API endpoint not found. Please check server configuration.';
//       }
      
//       throw new Error(errorMessage);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('adminToken');
//     setCurrentUser(null);
//     window.location.href = '/login';
//   };

//   // Function to get API instance with auth headers
//   const getApi = () => {
//     const token = localStorage.getItem('adminToken');
//     return {
//       get: (url, config = {}) => api.get(url, {
//         ...config,
//         headers: {
//           ...config.headers,
//           'x-auth-token': token
//         }
//       }),
//       post: (url, data, config = {}) => api.post(url, data, {
//         ...config,
//         headers: {
//           ...config.headers,
//           'x-auth-token': token
//         }
//       }),
//       put: (url, data, config = {}) => api.put(url, data, {
//         ...config,
//         headers: {
//           ...config.headers,
//           'x-auth-token': token
//         }
//       }),
//       delete: (url, config = {}) => api.delete(url, {
//         ...config,
//         headers: {
//           ...config.headers,
//           'x-auth-token': token
//         }
//       })
//     };
//   };


//   const value = {
//     currentUser,
//     login,
//     logout,
//     isAuthenticated: !!currentUser,
//     loading,
//     getApi
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }




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

  // Configure axios defaults for all requests
  useEffect(() => {
    // Set base URL for all axios requests
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.timeout = 10000;

    // Set up request interceptor to add auth token to all requests
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
          config.headers['x-auth-token'] = token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Set up response interceptor to handle auth errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          setCurrentUser(null);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    checkAuthStatus();

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/auth/me');
      
      if (response.data.role === 'admin') {
        setCurrentUser(response.data);
      } else {
        throw new Error('Not an admin user');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Store token and set user
      localStorage.setItem('adminToken', token);
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
      } else if (error.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check if the backend server is running.';
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
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