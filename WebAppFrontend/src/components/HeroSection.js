import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a2f1f] via-[#2d8a6b] to-[#3cb371] overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        {/* Large decorative circles */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-white/20 to-shrimp-orange/10 rounded-full animate-pulse shadow-2xl"></div>
        <div className="absolute bottom-32 right-40 w-24 h-24 bg-gradient-to-br from-shrimp-orange/15 to-white/10 rounded-full animate-bounce shadow-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-white/25 to-transparent rounded-full animate-pulse shadow-lg"></div>

        {/* Medium circles */}
        <div className="absolute top-40 left-1/2 w-20 h-20 bg-gradient-to-br from-shrimp-orange/10 to-white/5 rounded-full animate-bounce shadow-lg"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-gradient-to-br from-white/15 to-shrimp-orange/8 rounded-full animate-pulse shadow-xl"></div>
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-white/20 rounded-full animate-ping shadow-md"></div>

        {/* Small accent dots */}
        <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-shrimp-orange/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-white/25 rounded-full animate-bounce"></div>
        <div className="absolute top-2/3 left-2/3 w-10 h-10 bg-shrimp-orange/20 rounded-full animate-pulse"></div>

        {/* Geometric shapes */}
        <div className="absolute top-16 left-16 w-4 h-4 bg-shrimp-orange rotate-45 animate-spin"></div>
        <div className="absolute bottom-16 right-16 w-3 h-3 bg-white rotate-12 animate-pulse"></div>
        <div className="absolute top-1/2 right-8 w-2 h-8 bg-gradient-to-b from-transparent via-shrimp-orange/50 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen gap-8 lg:gap-16">
          {/* Left side - Text content */}
          <div className={`text-white space-y-6 lg:space-y-8 max-w-2xl transition-all duration-1000 transform ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}>
            <div className="space-y-6">
              <div className="relative">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-shrimp font-bold leading-tight animate-pulse">
                  <span className="block text-white transform hover:scale-105 transition-transform duration-500">SHRIMP</span>
                  <span className="block text-shrimp-orange transform hover:scale-105 transition-transform duration-500 animate-bounce">SENSE</span>
                </h1>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-shrimp-orange rounded-full animate-ping opacity-75"></div>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 text-white animate-fadeIn">
              WELCOME TO OUR SHRIMPY WEBSITE!
            </h2>

            <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-white text-justify opacity-90">
              Shrimp farming meets innovation with an intelligent monitoring system that combines computer vision, deep
              learning, and real-time data collection. Designed with a flow-based setup and mounted camera, it accurately
              counts and tracks shrimp biomass while optimizing feeding efficiency. The result is smarter aquaculture
              management-sustainable, precise, and future-ready.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <button className="group relative bg-shrimp-orange text-white px-10 py-5 rounded-xl hover:bg-orange-600 transition-all duration-500 font-bold text-xl hover:scale-110 shadow-2xl hover:shadow-shrimp-orange/50 transform overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative flex items-center gap-2">
                  🚀 Get Started
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </span>
              </button>
              <button className="group relative border-2 border-white text-white px-10 py-5 rounded-xl hover:bg-white hover:text-gray-800 transition-all duration-500 font-bold text-xl hover:scale-110 shadow-2xl transform">
                <span className="relative flex items-center gap-2">
                  📊 Learn More
                  <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </span>
              </button>
            </div>

            {/* Cute Feature indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-white/20">
              <div className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold text-shrimp-orange group-hover:scale-110 transition-transform duration-300">🐣</div>
                <div className="text-sm sm:text-base text-white/80">Counts Baby Shrimp</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold text-shrimp-orange group-hover:scale-110 transition-transform duration-300">👀</div>
                <div className="text-sm sm:text-base text-white/80">Watches Over Fry</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold text-shrimp-orange group-hover:scale-110 transition-transform duration-300">✨</div>
                <div className="text-sm sm:text-base text-white/80">Makes Farming Fun</div>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced shrimp animation */}
          <div className={`relative flex-shrink-0 transition-all duration-1000 delay-300 transform mr-16 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
            {/* Stage for positioning the two GIFs horizontally */}
            <div className="relative w-[320px] h-[200px] sm:w-[480px] sm:h-[280px] lg:w-[600px] lg:h-[320px]
           ml-[48px] sm:ml-[96px] lg:ml-[160px]">
              {/* Left shrimp - positioned farther left, facing right */}
              <img
                src="/shrimp.gif"
                alt="Animated Shrimp Left"
                className="absolute w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 object-contain
                           -left-3 top-[20%] -translate-y-[20%]
                           -rotate-[150deg] hover:scale-110 transition-transform duration-500 animate-bounce"
              />

              {/* Right shrimp - positioned farther right, facing left */}
              <img
                src="/shrimp.gif"
                alt="Animated Shrimp Right"
                className="absolute w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 object-contain
                           right-1 top-[10%] -translate-y-[20%]
                           -rotate-[-30deg] hover:scale-110 transition-transform duration-500 animate-bounce"
                style={{ animationDelay: '0.5s' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
