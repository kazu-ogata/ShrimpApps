import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardSettings() {
  const navigate = useNavigate();
  const [dashboardStyle, setDashboardStyle] = useState('modern'); // 'modern' or 'simplistic'

  useEffect(() => {
    // Load saved dashboard style preference
    const savedStyle = localStorage.getItem('shrimpSense_dashboard_style');
    if (savedStyle) {
      setDashboardStyle(savedStyle);
    }
  }, []);

  const handleStyleChange = (style) => {
    setDashboardStyle(style);
    localStorage.setItem('shrimpSense_dashboard_style', style);

    // Show confirmation
    alert(`Dashboard style changed to ${style === 'modern' ? 'Modern' : 'Simplistic'} look!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2f1f] via-[#2d8a6b] to-[#3cb371] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-white hover:text-shrimp-orange transition-colors mb-4"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold text-white">Dashboard Settings</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6">Dashboard Appearance</h3>

          <div className="space-y-6">
            {/* Current Style Display */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Current Style: {dashboardStyle === 'modern' ? 'Modern' : 'Simplistic'}</h4>

              {/* Style Preview */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="text-center">
                  <div className="w-20 h-20 bg-shrimp-orange rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🦐</span>
                  </div>
                  <h5 className="text-xl font-bold text-white mb-2">ShrimpSense</h5>
                  <p className="text-white/80 text-sm">Dashboard Preview</p>

                  {/* Show different styling based on selected style */}
                  {dashboardStyle === 'modern' ? (
                    <div className="mt-4 space-y-2">
                      <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <div className="text-shrimp-orange font-semibold">✨ Enhanced Features</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <div className="text-white/80">Smooth animations</div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="text-gray-700 font-semibold">📊 Simple Layout</div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="text-gray-600">Clean and minimal</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Style Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Modern Style Option */}
              <div
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  dashboardStyle === 'modern'
                    ? 'border-shrimp-orange bg-shrimp-orange/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => handleStyleChange('modern')}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-shrimp-orange rounded-full flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Modern Look</h4>
                    <p className="text-white/70 text-sm">Enhanced with animations</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Gradient backgrounds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Smooth animations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Glass-morphism effects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Interactive elements</span>
                  </div>
                </div>

                {dashboardStyle === 'modern' && (
                  <div className="mt-4 p-3 bg-shrimp-orange/30 rounded-lg">
                    <p className="text-white text-sm font-semibold">Currently Active</p>
                  </div>
                )}
              </div>

              {/* Simplistic Style Option */}
              <div
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  dashboardStyle === 'simplistic'
                    ? 'border-blue-400 bg-blue-400/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => handleStyleChange('simplistic')}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Simplistic Look</h4>
                    <p className="text-white/70 text-sm">Clean and minimal</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Clean backgrounds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Simple animations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Minimal design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Fast loading</span>
                  </div>
                </div>

                {dashboardStyle === 'simplistic' && (
                  <div className="mt-4 p-3 bg-blue-400/30 rounded-lg">
                    <p className="text-white text-sm font-semibold">Currently Active</p>
                  </div>
                )}
              </div>
            </div>

            {/* Style Information */}
            <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-3">About Dashboard Styles</h4>
              <div className="text-white/80 text-sm space-y-2">
                <p>
                  <strong>Modern Look:</strong> Features enhanced animations, gradient backgrounds, and glass-morphism effects for a premium experience.
                </p>
                <p>
                  <strong>Simplistic Look:</strong> Clean, minimal design with simple backgrounds and reduced animations for faster performance.
                </p>
                <p className="text-shrimp-orange font-semibold">
                  💡 Tip: You can switch between styles anytime. Your preference will be saved automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
