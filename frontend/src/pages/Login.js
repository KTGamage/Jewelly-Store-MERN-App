import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
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

  const handleGoogleLogin = () => {
  setError('');
  googleSignIn(); // This redirects, no need for async/await
};

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10 mt-10">
        {/* Glassmorphism card - Fixed height */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden lg:flex lg:min-h-[400px] lg:max-h-[400px]">
          {/* Left side - Branding */}
          <div className="lg:w-2/5 bg-gradient-to-br from-purple-800/30 to-blue-900/30 p-8 flex flex-col justify-center items-center relative overflow-hidden ">
            <div className="absolute inset-0">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10 text-center w-full lg:items-center">
              <div className="mx-auto h-20 w-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💎</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                LuxuryJewelry
              </h1>
              <h2 className="text-xl font-semibold text-blue-100 mb-3">
                Welcome Back
              </h2>
              <p className="text-blue-100">
                Sign in to your luxury account
              </p>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="lg:w-3/5 p-8 flex flex-col justify-center">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">⚠️</span>
                    {error}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-300">📧</span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 backdrop-blur-sm"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-300">🔐</span>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="block w-full pl-10 pr-10 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 backdrop-blur-sm"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      <span>{showPassword ? '🙈' : '👁️'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-white/30 rounded bg-white/20 backdrop-blur-sm"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-blue-100 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-gray-900 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-300 hover:via-orange-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <span className="flex items-center">
                    ✨ Sign In
                  </span>
                )}
              </button>
              
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-blue-100 font-medium">Or continue with</span>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex justify-center items-center px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-blue-100 text-sm">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-200 underline decoration-yellow-400/50 hover:decoration-yellow-300">
                    Create one now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Security footer */}
        <div className="text-center text-blue-200/60 text-sm mt-4">
          <div className="flex justify-center items-center space-x-2">
            <span>🔒</span>
            <span>Secure login protected by 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;