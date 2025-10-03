
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-pink-600/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Glassmorphism card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            {/* Animated logo */}
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">💎</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-blue-100 text-lg">
              Sign in to your luxury account
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-6 py-4 rounded-xl text-sm backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-3">⚠️</span>
                  {error}
                </div>
              </div>
            )}
            
            <div className="space-y-5">
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-300 text-xl">📧</span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 backdrop-blur-sm"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-300 text-xl">🔐</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-12 pr-12 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 backdrop-blur-sm"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <span className="text-xl">{showPassword ? '🙈' : '👁️'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-white/30 rounded bg-white/20 backdrop-blur-sm"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-blue-100">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-300 hover:via-orange-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent mr-3"></div>
                  Signing you in...
                </div>
              ) : (
                <span className="flex items-center">
                  ✨ Sign In
                </span>
              )}
            </button>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-blue-100 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-3 text-2xl">🌟</span>
                  Continue with Google
                </button>
                
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-3 text-2xl">👤</span>
                  Continue with Facebook
                </button>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-blue-100">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-200 underline decoration-yellow-400/50 hover:decoration-yellow-300">
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Additional decorative elements */}
        <div className="text-center text-blue-200/60 text-sm">
          <p>Secure login protected by 256-bit SSL encryption</p>
          <div className="flex justify-center items-center mt-2 space-x-2">
            <span>🔒</span>
            <span>Your data is safe with us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;