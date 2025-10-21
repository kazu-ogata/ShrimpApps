import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    loginInput: '', // Can be either email or username
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null); // 'success', 'error', or null
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();

  // Fake database - Initialize with test users
  useEffect(() => {
    const initializeFakeDB = () => {
      const existingUsers = localStorage.getItem('shrimpSenseUsers');
      if (!existingUsers) {
        const fakeUsers = [
          { id: 1, username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
          { id: 2, username: 'user', password: 'user123', name: 'Regular User', role: 'user' },
          { id: 3, username: 'shrimp', password: 'sense123', name: 'Shrimp Farmer', role: 'user' }
        ];
        localStorage.setItem('shrimpSenseUsers', JSON.stringify(fakeUsers));
      }
    };
    initializeFakeDB();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginStatus(null);

    // Show loading with "Welcome Back!" text first
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Try backend login first
      const payload = { loginInput: formData.loginInput, password: formData.password };
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.result || {};
        setLoginStatus('success');
        setIsLoading(false);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setTimeout(() => {
          if (onLogin) onLogin(user);
          navigate('/');
        }, 1200);
        return;
      }

      // If backend returns non-ok, fall back to local fake DB check
      console.warn('Backend login failed, falling back to local DB');
      const users = JSON.parse(localStorage.getItem('shrimpSenseUsers') || '[]');
      const user = users.find(u =>
        (u.username?.toLowerCase() === formData.loginInput.toLowerCase() ||
         u.email?.toLowerCase() === formData.loginInput.toLowerCase()) &&
        u.password === formData.password
      );

      if (user) {
        setLoginStatus('success');
        setIsLoading(false);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setTimeout(() => {
          if (onLogin) onLogin(user);
          navigate('/');
        }, 1200);
      } else {
        setLoginStatus('error');
        setIsLoading(false);
        setTimeout(() => setLoginStatus(null), 3000);
      }
    } catch (error) {
      console.error('Login error:', error);
      // On network error, fall back to local storage
      const users = JSON.parse(localStorage.getItem('shrimpSenseUsers') || '[]');
      const user = users.find(u =>
        (u.username?.toLowerCase() === formData.loginInput.toLowerCase() ||
         u.email?.toLowerCase() === formData.loginInput.toLowerCase()) &&
        u.password === formData.password
      );
      if (user) {
        setLoginStatus('success');
        setIsLoading(false);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setTimeout(() => {
          if (onLogin) onLogin(user);
          navigate('/');
        }, 1200);
      } else {
        setLoginStatus('error');
        setIsLoading(false);
        setTimeout(() => setLoginStatus(null), 3000);
      }
    }
  };

  const handleGoogleSignIn = () => {
    // Placeholder for Google Sign-In integration
    alert('Google Sign-In integration coming soon!');
  };

  // Show loading modal
  if (isLoading || loginStatus) {
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
                <LoadingSpinner size="large" message="Signing you in..." />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
                  <p className="text-gray-600">Please wait while we verify your credentials...</p>
                </div>
              </div>
            )}

            {loginStatus === 'success' && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Success Login</h2>
                  <p className="text-gray-600">Redirecting you to the dashboard...</p>
                </div>
              </div>
            )}

            {loginStatus === 'error' && (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-800">Login Failed</h2>
                  <p className="text-gray-600">Invalid username or password. Please try again.</p>
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
      {/* Background decorative circles - Like front page */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
      <div className="absolute bottom-32 right-40 w-24 h-24 bg-white bg-opacity-15 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>

      {/* Centered Login Form */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Shrimp Sense - Inside Form */}
        <div className="text-center mb-6">
          <h1 className="text-3xl lg:text-4xl font-shrimp font-bold leading-tight text-gray-800 mb-4">
            Shrimp Sense
          </h1>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-600 text-sm mb-6">Please enter your details to log in</p>
          <h2 className="text-2xl font-semibold text-gray-800">WELCOME BACK</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              name="loginInput"
              placeholder="Email or Username"
              value={formData.loginInput}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('loginInput')}
              onBlur={() => setFocusedField('')}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                focusedField === 'loginInput'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              required
            />
          </div>

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
                  : 'border-gray-300 hover:border-gray-400'
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
              />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Remember for 30 days</span>
            </label>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
              onClick={() => console.log('Forgot password clicked')}
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Sign In
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

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
              onClick={() => navigate('/signup')}
            >
              Create one here
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
