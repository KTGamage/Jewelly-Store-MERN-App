import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength++;
      if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength++;
      if (value.match(/[0-9]/)) strength++;
      if (value.match(/[^a-zA-Z0-9]/)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    try {
      setError('');
      setLoading(true);
      await register(formData);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-indigo-600/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Glassmorphism card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            {/* Animated logo */}
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Join Our Family
            </h2>
            <p className="text-purple-100 text-lg">
              Create your luxury jewelry account
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
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-300 text-xl">👤</span>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-300 backdrop-blur-sm"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

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
                    className="block w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-300 backdrop-blur-sm"
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
                    required
                    className="block w-full pl-12 pr-12 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-300 backdrop-blur-sm"
                    placeholder="Create a strong password"
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
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-white/20 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-purple-200">{getPasswordStrengthText()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-300 text-xl">🔒</span>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="block w-full pl-12 pr-12 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-300 backdrop-blur-sm"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <span className="text-xl">{showConfirmPassword ? '🙈' : '👁️'}</span>
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-300 flex items-center">
                    <span className="mr-1">❌</span>
                    Passwords don't match
                  </p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="mt-1 text-sm text-green-300 flex items-center">
                    <span className="mr-1">✅</span>
                    Passwords match
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-pink-400 focus:ring-pink-400 border-white/30 rounded bg-white/20 backdrop-blur-sm mt-1"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-purple-100 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-pink-400 hover:text-pink-300 underline decoration-pink-400/50">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-pink-400 hover:text-pink-300 underline decoration-pink-400/50">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-gray-900 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 hover:from-pink-300 hover:via-purple-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent mr-3"></div>
                  Creating your account...
                </div>
              ) : (
                <span className="flex items-center">
                  🎉 Create Account
                </span>
              )}
            </button>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-purple-100 font-medium">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-3 text-2xl">🌟</span>
                  Sign up with Google
                </button>
                
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-3 text-2xl">👤</span>
                  Sign up with Facebook
                </button>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-purple-100">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-pink-400 hover:text-pink-300 transition-colors duration-200 underline decoration-pink-400/50 hover:decoration-pink-300">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Additional info */}
        <div className="text-center text-purple-200/60 text-sm">
          <p>Join over 50,000+ jewelry enthusiasts worldwide</p>
          <div className="flex justify-center items-center mt-2 space-x-4">
            <span className="flex items-center"><span className="mr-1">🔒</span> Secure</span>
            <span className="flex items-center"><span className="mr-1">⚡</span> Fast Setup</span>
            <span className="flex items-center"><span className="mr-1">🎁</span> Welcome Bonus</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;