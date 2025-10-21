import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const STORAGE_KEY = "shrimp_history_v1";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function saveResultToStorage(result) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  all.unshift(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export default function Dashboard_upload() {
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const [dashboardStyle, setDashboardStyle] = useState('modern');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Load saved dashboard style preference
    const savedStyle = localStorage.getItem('shrimpSense_dashboard_style') || 'modern';
    setDashboardStyle(savedStyle);
  }, []);

  const onPick = () => fileRef.current?.click();

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Simulate logout process
    setTimeout(() => {
      localStorage.removeItem('shrimpSense_user');
      localStorage.removeItem('shrimpSense_dashboard_style');
      window.location.href = '/';
    }, 2000);
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (jpg, png, webp).");
      e.target.value = "";
      return;
    }

    // Upload image to backend for processing
    const uploadAndNavigate = async () => {
      try {
        const formData = new FormData();
        formData.append('image', file);

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
          alert("You must be logged in to upload images.");
          return; // Stop the upload process
        }

        formData.append('ownerId', ownerId);

        //const res = await fetch('http://localhost:5000/api/uploadimage', {
        const res = await fetch(`${API_URL}/api/uploadimage`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          // Try to read server error message for better feedback
          let errMsg = `Server returned ${res.status}`;
          try {
            const errJson = await res.json();
            if (errJson && errJson.message) errMsg = errJson.message + (errJson.error ? (': ' + errJson.error) : '');
          } catch (e) {
            // ignore
          }
          throw new Error(errMsg);
        }

        const data = await res.json();
        // data.record contains saved record info, data.processedImage is base64
        const id = data.record?.id || Date.now().toString();
        const result = {
          id,
          fileName: file.name,
          timestamp: new Date().toISOString(),
          totalPL: data.count || 0,
          biomass: data.biomass || 0,
          feedRecommendation: data.feed || 0,
          processedImageBase64: data.processedImage || null,
          breakdown: {
            protein: ((data.feed || 0) * 0.55).toFixed(2),
            filler: ((data.feed || 0) * 0.45).toFixed(2),
          }
        };

        saveResultToStorage(result);
        // Pass the saved record id to results page
        navigate(`/results-page?id=${result.id}`);
        return;
      } catch (err) {
        console.error('Upload failed: ', err);
        alert("Image upload failed: " + (err.message || err));
      }
    };

    uploadAndNavigate();
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
                  onClick={() => navigate('/results')}
                  className="flex items-center space-x-2 hover:text-shrimp-orange transition-colors"
                >
                  <span>📊</span>
                  <span>Results</span>
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
        {/* Header Section */}
        <div className="mb-12">
          <div className="relative inline-block mb-6">
            <img
              src="/shrimp-logo.gif"
              alt="ShrimpSense logo"
              className={`mx-auto w-36 h-36 rounded-full shadow-2xl border-4 ${
                dashboardStyle === 'simplistic'
                  ? 'border-gray-200 animate-pulse'
                  : 'border-white/20 animate-bounce'
              }`}
            />
            {dashboardStyle === 'modern' && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-shrimp-orange rounded-full animate-ping"></div>
            )}
          </div>

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
              Ready to Start?
            </span>
          </h1>

          <p className={`text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed ${
            dashboardStyle === 'simplistic' ? 'text-gray-600' : 'text-white/90'
          }`}>
            Upload an image of shrimp fry to get
            <span className={`font-semibold ${
              dashboardStyle === 'modern' ? 'text-shrimp-orange' : 'text-[#2d8a6b]'
            }`}>
              {" "}intelligent analysis
            </span> and
            <span className="font-semibold text-gray-800"> expert recommendations</span>
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-16">
          <button
            onClick={onPick}
            className={`group relative inline-flex items-center gap-4 font-bold text-xl px-12 py-6 rounded-full shadow-2xl transition-all duration-500 transform overflow-hidden ${
              dashboardStyle === 'simplistic'
                ? 'bg-shrimp-orange hover:bg-orange-600 text-white hover:scale-105'
                : 'bg-shrimp-orange hover:bg-orange-600 text-white hover:scale-110 hover:shadow-shrimp-orange/50'
            }`}
            aria-label="Upload shrimp image for analysis"
          >
            {dashboardStyle === 'modern' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            )}
            <Icon icon="mdi:camera" width="32" height="32" className="relative z-10" />
            <span className="relative z-10 text-xl">Upload Shrimp Image</span>
          </button>

          <p className={`mt-4 text-sm ${
            dashboardStyle === 'simplistic' ? 'text-gray-500' : 'text-white/70'
          }`}>
            Supports JPG, PNG, WebP formats
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />

        {/* Show cards only in Modern mode, navigation handles this in Simplistic mode */}
        {dashboardStyle === 'modern' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className={getCardClasses()}
                 onClick={() => navigate('/results')}>
              <div className={`text-4xl mb-4 ${dashboardStyle === 'modern' ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                📊
              </div>
              <h3 className={`font-bold text-xl mb-3 ${dashboardStyle === 'modern' ? 'group-hover:text-shrimp-orange' : 'group-hover:text-blue-600'} transition-colors duration-300`}>
                View Results
              </h3>
              <p className={getSubTextClasses() + " text-base leading-relaxed"}>Check your latest shrimp analysis results</p>
            </div>
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
