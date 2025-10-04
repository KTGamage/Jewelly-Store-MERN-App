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
  const { register, googleSignIn } = useAuth();
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

  // const handleGoogleSignUp = async () => {
  //   setError('');
  //   setLoading(true);
    
  //   try {
  //     const result = await googleSignIn();
  //     if (result.success) {
  //       navigate('/');
  //     } else {
  //       setError(result.error || 'Google sign up failed');
  //     }
  //   } catch (error) {
  //     setError('An error occurred during Google sign up');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGoogleSignUp = () => {
  setError('');
  googleSignIn(); // This redirects, no need for async/await
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
      </div>

      <div className="max-w-5xl w-full relative z-10 mt-14">
        {/* Glassmorphism card - Horizontal rectangle */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden lg:flex lg:max-h-[450px]">
          {/* Left side - Branding */}
          <div className="lg:w-2/5 bg-gradient-to-br from-purple-800/30 to-pink-900/30 p-5 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-600/10 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10 text-center w-full">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Luxury Jewelry
              </h1>
              <h2 className="text-xl font-semibold text-purple-100 mb-3">
                Join Our Family
              </h2>
              <p className="text-purple-100">
                Create your luxury jewelry account
              </p>
              
              {/* Features list */}
              <div className="mt-6 space-y-2 hidden lg:block">
                <div className="flex items-center justify-center text-purple-100 text-sm">
                  <span className="mr-2">🔒</span>
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center justify-center text-purple-100 text-sm">
                  <span className="mr-2">⚡</span>
                  <span>Fast Setup</span>
                </div>
                <div className="flex items-center justify-center text-purple-100 text-sm">
                  <span className="mr-2">🎁</span>
                  <span>Welcome Bonus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Register Form */}
          <div className="lg:w-3/5 p-5 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center lg:hidden mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Join Our Family
                </h3>
                <p className="text-purple-100">
                  Create your luxury jewelry account
                </p>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">⚠️</span>
                      {error}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-300">👤</span>
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="block w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-300 backdrop-blur-sm text-sm"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

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
                        className="block w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-300 backdrop-blur-sm text-sm"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-300">🔐</span>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="block w-full pl-10 pr-10 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-300 backdrop-blur-sm text-sm"
                        placeholder="Create Password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        <span className="text-sm">{showPassword ? '🙈' : '👁️'}</span>
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

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-300">🔒</span>
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="block w-full pl-10 pr-10 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-300 backdrop-blur-sm text-sm"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        <span className="text-sm">{showConfirmPassword ? '🙈' : '👁️'}</span>
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
                  <label htmlFor="terms" className="ml-2 block text-sm text-purple-100 leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-pink-400 hover:text-pink-300 underline decoration-pink-400/50">
                      Terms
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
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-gray-900 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 hover:from-pink-300 hover:via-purple-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <span className="flex items-center">
                      🎉 Create Account
                    </span>
                  )}
                </button>

                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-purple-100 font-medium">Or sign up with</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleGoogleSignUp}
                      className="w-full flex justify-center items-center px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
                      Sign up with Google
                    </button>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <p className="text-purple-100 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-pink-400 hover:text-pink-300 transition-colors duration-200 underline decoration-pink-400/50 hover:decoration-pink-300">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Security footer */}
        <div className="text-center text-purple-200/60 text-xs mt-4">
          <div className="flex justify-center items-center space-x-2">
            <span>🔒</span>
            <span>Secure 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;