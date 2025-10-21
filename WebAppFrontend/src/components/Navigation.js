import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-b from-[#0b2d1f] to-[#0f3b2a] backdrop-blur-sm p-4 lg:p-6 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-shrimp-orange transition-colors duration-200">
            <img
              src="/shrimp-logo.gif"
              alt="ShrimpSense Logo"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-xl font-bold">ShrimpSense</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-shrimp-orange transition-colors duration-200 font-medium">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-shrimp-orange transition-colors duration-200 font-medium">
            About
          </Link>
          <Link to="/products" className="text-white hover:text-shrimp-orange transition-colors duration-200 font-medium">
            Products
          </Link>
          <Link to="/contact" className="text-white hover:text-shrimp-orange transition-colors duration-200 font-medium">
            Contact
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <button className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-200 hover:scale-110">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-200 hover:scale-110">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </button>
          <button
            onClick={handleLoginClick}
            className="bg-shrimp-orange text-white px-6 py-2.5 rounded-md hover:bg-orange-600 transition-all duration-200 font-medium hover:scale-105 shadow-lg hover:shadow-xl"
          >
            LOGIN
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden bg-white bg-opacity-20 p-2 rounded-md hover:bg-opacity-30 transition-all duration-200"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0b2d1f] border-t border-white border-opacity-20 animate-fadeIn">
          <div className="px-4 py-6 space-y-4">
            <Link
              to="/"
              className="block text-white hover:text-shrimp-orange transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-white hover:text-shrimp-orange transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/products"
              className="block text-white hover:text-shrimp-orange transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/contact"
              className="block text-white hover:text-shrimp-orange transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-white border-opacity-20">
              <button
                onClick={() => {
                  handleLoginClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-shrimp-orange text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors duration-200 font-medium"
              >
                LOGIN
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
