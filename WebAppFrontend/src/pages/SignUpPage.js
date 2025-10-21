import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SignUpPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [signupStatus, setSignupStatus] = useState(null); // 'success', 'google-success', or null
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Initialize fake database
  useEffect(() => {
    const initializeFakeDB = () => {
      const existingUsers = localStorage.getItem('shrimpSenseUsers');
      if (!existingUsers) {
        const fakeUsers = [
          { id: 1, username: 'admin', password: 'admin123', email: 'admin@shrimpsense.com', name: 'Admin User', role: 'admin' },
          { id: 2, username: 'user', password: 'user123', email: 'user@shrimpsense.com', name: 'Regular User', role: 'user' },
          { id: 3, username: 'shrimp', password: 'sense123', email: 'shrimp@shrimpsense.com', name: 'Shrimp Farmer', role: 'user' },
          { id: 4, username: 'farmer1', password: 'farm123', email: 'farmer1@shrimpsense.com', name: 'Shrimp Farmer 1', role: 'user' },
          { id: 5, username: 'testuser', password: 'test123', email: 'test@shrimpsense.com', name: 'Test User', role: 'user' }
        ];
        localStorage.setItem('shrimpSenseUsers', JSON.stringify(fakeUsers));
      }
    };
    initializeFakeDB();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSignupStatus(null);

    // Show loading first with "Creating Account" text
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Try backend signup
      const payload = { username: formData.username, email: formData.email, password: formData.password };
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const created = data.result || { username: formData.username, email: formData.email };
        setSignupStatus('success');
        setIsLoading(false);
        setTimeout(() => {
          if (onLogin) onLogin(created);
          navigate('/');
        }, 1200);
        return;
      }

      // If backend failed, fall back to localStorage fake DB implementation
      console.warn('Backend signup failed, falling back to local DB');
      const users = JSON.parse(localStorage.getItem('shrimpSenseUsers') || '[]');

      // Check if username or email already exists (case-insensitive)
      const existingUser = users.find(u =>
        u.username?.toLowerCase() === formData.username.toLowerCase() ||
        u.email?.toLowerCase() === formData.email.toLowerCase()
      );

      if (existingUser) {
        // User already exists - show error
        setSignupStatus('error');
        setIsLoading(false);
        setTimeout(() => setSignupStatus(null), 3000);
        return;
      }

      // Create new user locally
      const newUser = {
        id: users.length + 1,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        name: formData.username,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('shrimpSenseUsers', JSON.stringify(users));
      setSignupStatus('success');
      setIsLoading(false);
      setTimeout(() => {
        if (onLogin) onLogin(newUser);
        navigate('/');
      }, 1200);

    } catch (error) {
      console.error('Signup error:', error);
      setSignupStatus('error');
      setIsLoading(false);
      setTimeout(() => setSignupStatus(null), 3000);
    }
  };

  const handleGoogleSignUp = () => {
    // Placeholder for Google Sign-Up integration
    alert('Google Sign-Up integration coming soon!');
  };

  // Password strength checker
  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 25;
      if (/[A-Z]/.test(formData.password)) strength += 25;
      if (/[a-z]/.test(formData.password)) strength += 25;
      if (/[0-9]/.test(formData.password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  // Show loading modal
  if (isLoading || signupStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2784DA] via-[#4a9eff] to-[#758711] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-40 w-24 h-24 bg-white bg-opacity-15 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 left-1/2 w-20 h-20 bg-white bg-opacity-5 rounded-full animate-bounce"></div>
        </div>

        {/* Logo */}
        <div className="absolute left-8 top-8 z-10">
          <div className="flex items-center space-x-3">
            <img
              src="/shrimp-logo.gif"
              alt="ShrimpSense Logo"
              className="w-10 h-10 rounded-full"
            />
            <h1 className="text-3xl lg:text-4xl font-shrimp font-bold text-white">
              Shrimp Sense
            </h1>
          </div>
        </div>

        {/* Modal Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center mx-4 animate-fadeIn">
            {isLoading && (
              <div className="space-y-4">
                <LoadingSpinner size="large" message="Creating your account..." />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-800">Creating Account</h2>
                  <p className="text-gray-600">Please wait while we set up your profile...</p>
                </div>
              </div>
            )}

            {signupStatus === 'success' && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Success Sign Up</h2>
                  <p className="text-gray-600">Account created successfully! Redirecting to dashboard...</p>
                </div>
              </div>
            )}

            {signupStatus === 'error' && (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-800">Registration Failed</h2>
                  <p className="text-gray-600">Username or email already exists. Please choose different ones.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2784DA] to-[#758711] relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
      <div className="absolute bottom-32 right-40 w-24 h-24 bg-white bg-opacity-15 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>

      {/* Centered Sign Up Form */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-shrimp font-bold leading-tight text-gray-800 mb-2">
              Shrimp Sense
            </h1>
            <p className="text-gray-600 text-sm mb-6">Ready to start? Create your account!</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
              }`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  focusedField === 'email'
                    ? 'border-blue-500 bg-blue-50'
                    : errors.email ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

            {/* Username Field */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                focusedField === 'username' ? 'text-blue-500' : 'text-gray-400'
              }`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField('')}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  focusedField === 'username'
                    ? 'border-blue-500 bg-blue-50'
                    : errors.username ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
                required
              />
            </div>
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}

            {/* Password Field */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
              }`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  focusedField === 'password'
                    ? 'border-blue-500 bg-blue-50'
                    : errors.password ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-2 w-1/4 rounded-full transition-colors duration-300 ${
                        passwordStrength >= level * 25
                          ? passwordStrength <= 25 ? 'bg-red-400' :
                            passwordStrength <= 50 ? 'bg-yellow-400' :
                            passwordStrength <= 75 ? 'bg-blue-400' : 'bg-green-400'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  Password strength: {
                    passwordStrength <= 25 ? 'Weak' :
                    passwordStrength <= 50 ? 'Fair' :
                    passwordStrength <= 75 ? 'Good' : 'Strong'
                  }
                </p>
              </div>
            )}

            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            {/* Confirm Password Field */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                focusedField === 'confirmPassword' ? 'text-blue-500' : 'text-gray-400'
              }`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField('')}
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  focusedField === 'confirmPassword'
                    ? 'border-blue-500 bg-blue-50'
                    : errors.confirmPassword ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Sign In Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
                onClick={() => navigate('/login')}
              >
                Sign in here
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
