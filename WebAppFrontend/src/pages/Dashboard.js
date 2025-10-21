import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const STORAGE_KEY = "shrimp_history_v1";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// This function is no longer directly used for image upload, but keeping it
// in case it's used for other data storage or future features.
function saveResultToStorage(result) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  all.unshift(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

async function fetchHistoryFromBackend() {
  const storedUser = localStorage.getItem('shrimpSense_user');
  let ownerId = null;
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      ownerId = user.id;
    } catch (e) {
      console.error("Failed to parse shrimpSense_user from localStorage", e);
    }
  }

  if (!ownerId) {
    alert("You must be logged in to view history.");
    return []; // Return empty array if no ownerId
  }

  try {
    //const res = await fetch(`http://localhost:5000/api/biomass-records?ownerId=${ownerId}`);
    const res = await fetch(`${API_URL}/api/biomass-records?ownerId=${ownerId}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    // Normalize backend fields to the frontend shape
    const normalized = (data || []).map(r => ({
      id: r._id || r.recordId || String(Date.now()),
      fileName: r.fileName || 'upload',
      timestamp: r.dateTime || r.created_at || new Date().toISOString(),
      totalPL: r.shrimpCount || r.totalPL || 0,
      biomass: r.biomass || 0,
      feedRecommendation: r.feedMeasurement || r.feed || 0,
      breakdown: r.breakdown || { protein: ((r.feed || r.feedMeasurement || 0) * 0.55).toFixed(2), filler: ((r.feed || r.feedMeasurement || 0) * 0.45).toFixed(2) },
      processedImageBase64: r.processedImage || r.processedImageBase64 || null,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (err) {
    console.warn('Failed to fetch history from backend, falling back to localStorage', err);
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return local;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardStyle, setDashboardStyle] = useState('modern');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [latestResult, setLatestResult] = useState(null);

  useEffect(() => {
    // Load saved dashboard style preference
    const savedStyle = localStorage.getItem('shrimpSense_dashboard_style') || 'modern';
    setDashboardStyle(savedStyle);


    (async () => {
      const all = await fetchHistoryFromBackend();
      all.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
      if (all.length > 0) {
        setLatestResult(all[0]); // Get the most recent result after sorting
      } else {
        setLatestResult(null);
      }
    })();

    const handleStorageChange = async () => {
      const all = await fetchHistoryFromBackend();
      all.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
      if (all.length > 0) {
        setLatestResult(all[0]);
      } else {
        setLatestResult(null);
      }
    };

    window.addEventListener('localStorageUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('localStorageUpdated', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Simulate logout process
    setTimeout(() => {
      localStorage.removeItem('shrimpSense_user');
      localStorage.removeItem('shrimpSense_dashboard_style');
      window.location.href = '/';
    }, 2000);
  };

  // Different styling based on selected style
  const getContainerClasses = () => {
    if (dashboardStyle === 'simplistic') {
      return "min-h-screen w-full bg-white text-gray-900 overflow-hidden";
    }
    return "min-h-screen w-full bg-gradient-to-br from-[#0a2f1f] via-[#2d8a6b] to-[#3cb371] text-white overflow-hidden";
  };

  const getCardClasses = () => {
    if (dashboardStyle === 'simplistic') {
      return "bg-gray-50 rounded-xl p-8 border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group";
    }
    return "bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group";
  };

  const getTextClasses = () => {
    if (dashboardStyle === 'simplistic') {
      return "text-gray-800";
    }
    return "text-white";
  };

  const getSubTextClasses = () => {
    if (dashboardStyle === 'simplistic') {
      return "text-gray-600";
    }
    return "text-white/80";
  };

  // Show logout modal if logging out
  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a2f1f] via-[#2d8a6b] to-[#3cb371] flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl border border-white/20">
          <div className="w-20 h-20 bg-shrimp-orange rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Signing Out...</h2>
          <p className="text-white/80">Taking you back to the homepage</p>
        </div>
      </div>
    );
  }

  return (
    <div className={getContainerClasses()}>
      {/* Navigation Bar for Simplistic Mode */}
      {dashboardStyle === 'simplistic' && (
        <nav className="bg-gradient-to-b from-[#0a2f1f] to-[#2d8a6b] backdrop-blur-sm text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h2 className="text-2xl font-bold">SHRIMPSENSE</h2>
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 hover:text-shrimp-orange transition-colors"
                >
                  <span>🏠</span>
                  <span>Home</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard/history')}
                  className="flex items-center space-x-2 hover:text-shrimp-orange transition-colors"
                >
                  <span>📈</span>
                  <span>History</span>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/settings')}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <span className="text-lg">⚙️</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-shrimp-orange text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Top Navigation Bar for Modern Mode */}
      {dashboardStyle === 'modern' && (
        <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h2 className="text-2xl font-bold text-white">SHRIMPSENSE</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/settings')}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <span className="text-lg text-white">⚙️</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-shrimp-orange text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}

      <main
        className={`mx-auto px-6 text-center ${dashboardStyle === 'simplistic' ? 'max-w-6xl py-12' : 'max-w-5xl py-20'}`}
        aria-labelledby="dashboard-heading"
      >
        {/* Latest Process Results Section */}
        <div className="mb-12">
          <h1
            id="dashboard-heading"
            className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-wide ${
              dashboardStyle === 'simplistic' ? 'text-gray-800' : 'text-white'
            }`}
          >
            <span className={`block ${dashboardStyle === 'modern' ? 'animate-fadeIn' : ''}`}>
              🦐 ShrimpSense
            </span>
            <span className={`block ${
              dashboardStyle === 'modern' ? 'text-shrimp-orange animate-pulse' : 'text-green-600'
            }`}>
              Latest Process Results
            </span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {latestResult ? (
              <>
                <div className={getCardClasses()}>
                  <div className={`text-4xl mb-4 ${dashboardStyle === 'modern' ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                    📅
                  </div>
                  <h3 className={`font-bold text-xl mb-2 ${dashboardStyle === 'modern' ? 'group-hover:text-shrimp-orange' : 'group-hover:text-blue-600'} transition-colors duration-300`}>
                    Last Processed
                  </h3>
                  <p className={getSubTextClasses() + " text-xl font-semibold"}>{new Date(latestResult.timestamp).toLocaleString()}</p>
                </div>
                <div className={getCardClasses()}>
                  <div className={`text-4xl mb-4 ${dashboardStyle === 'modern' ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                    🔢
                  </div>
                  <h3 className={`font-bold text-xl mb-2 ${dashboardStyle === 'modern' ? 'group-hover:text-shrimp-orange' : 'group-hover:text-blue-600'} transition-colors duration-300`}>
                    Total PL Count
                  </h3>
                  <p className={getSubTextClasses() + " text-2xl font-semibold"}>{latestResult.totalPL}</p>
                </div>
                <div className={getCardClasses()}>
                  <div className={`text-4xl mb-4 ${dashboardStyle === 'modern' ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                    ⚖️
                  </div>
                  <h3 className={`font-bold text-xl mb-2 ${dashboardStyle === 'modern' ? 'group-hover:text-shrimp-orange' : 'group-hover:text-blue-600'} transition-colors duration-300`}>
                    Biomass
                  </h3>
                  <p className={getSubTextClasses() + " text-2xl font-semibold"}>{latestResult.biomass} kg</p>
                </div>
                <div className={getCardClasses()}>
                  <div className={`text-4xl mb-4 ${dashboardStyle === 'modern' ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                    🍚
                  </div>
                  <h3 className={`font-bold text-xl mb-2 ${dashboardStyle === 'modern' ? 'group-hover:text-shrimp-orange' : 'group-hover:text-blue-600'} transition-colors duration-300`}>
                    Feed Recommendation
                  </h3>
                  <p className={getSubTextClasses() + " text-2xl font-semibold"}>{latestResult.feedRecommendation} g</p>
                </div>
                <div className={getCardClasses()}>
                  <div className={`text-4xl mb-4 ${dashboardStyle === 'modern' ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                    🥩
                  </div>
                  <h3 className={`font-bold text-xl mb-2 ${dashboardStyle === 'modern' ? 'group-hover:text-shrimp-orange' : 'group-hover:text-blue-600'} transition-colors duration-300`}>
                    Protein
                  </h3>
                  <p className={getSubTextClasses() + " text-2xl font-semibold"}>{latestResult.breakdown.protein} g</p>
                </div>
              </>
            ) : (
              <div className="col-span-full bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 h-auto flex items-center justify-center">
                <p className="text-white/80 text-xl">No recent data available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Show cards only in Modern mode, navigation handles this in Simplistic mode */}
        {dashboardStyle === 'modern' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className={getCardClasses()}
                 onClick={() => navigate('/dashboard/history')}>
              <div className={`text-4xl mb-4 ${dashboardStyle === 'modern' ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                📈
              </div>
              <h3 className={`font-bold text-xl mb-3 ${dashboardStyle === 'modern' ? 'group-hover:text-shrimp-orange' : 'group-hover:text-blue-600'} transition-colors duration-300`}>
                Analysis History
              </h3>
              <p className={getSubTextClasses() + " text-base leading-relaxed"}>Browse all your previous analyses</p>
            </div>
            <div className={getCardClasses()}
                 onClick={() => navigate('/dashboard/settings')}>
              <div className={`text-4xl mb-4 ${dashboardStyle === 'modern' ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                ⚙️
              </div>
              <h3 className={`font-bold text-xl mb-3 ${dashboardStyle === 'modern' ? 'group-hover:text-shrimp-orange' : 'group-hover:text-blue-600'} transition-colors duration-300`}>
                Settings
              </h3>
              <p className={getSubTextClasses() + " text-base leading-relaxed"}>Configure your dashboard preferences</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
