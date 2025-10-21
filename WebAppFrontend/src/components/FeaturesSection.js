import React, { useState, useEffect, useRef } from 'react';

const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState(new Set());
  const featureRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleFeatures(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: 1,
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Documentation",
      description: "Comprehensive guides and documentation to help you get started quickly and efficiently.",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Real-time Monitoring",
      description: "Live tracking and analysis of your shrimp farm with instant alerts and updates.",
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Analytics",
      description: "Detailed insights and reporting to optimize your aquaculture operations.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Powerful Features for
            <span className="text-shrimp-orange block">Smart Aquaculture</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the advanced capabilities that make Shrimp Sense the leading solution for modern shrimp farming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => (featureRefs.current[index] = el)}
              data-index={index}
              className={`text-center group relative transition-all duration-700 transform ${
                visibleFeatures.has(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              {/* Feature Card */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-shrimp-orange/30">
                {/* Icon Container */}
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-shrimp-orange transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-shrimp-orange/0 to-shrimp-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Floating Animation Dots */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-shrimp-orange rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-shrimp-orange to-orange-600 text-white px-8 py-4 rounded-xl hover:from-shrimp-orange hover:to-orange-700 transition-all duration-300 font-semibold text-lg hover:scale-105 shadow-lg hover:shadow-xl transform">
            Explore All Features
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
