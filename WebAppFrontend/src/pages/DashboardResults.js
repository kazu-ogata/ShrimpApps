import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const STORAGE_KEY = 'shrimp_history_v1';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function fetchLatestResultFromBackend() {
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
    alert("You must be logged in to view results.");
    return null; // Return null if no ownerId
  }

  try {
    // const res = await fetch(`http://localhost:5000/api/results?ownerId=${ownerId}`);
    const res = await fetch(`${API_URL}/api/results?ownerId=${ownerId}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (!data || Object.keys(data).length === 0) return null;
    // Normalize
    return {
      id: data._id || data.id || String(Date.now()),
      totalPL: data.shrimpCount || data.count || 0,
      biomass: data.biomass || data.calculatedBiomassGrams || 0,
      feedRecommendation: data.feedMeasurement || data.recommendedFeedGrams || data.feed || 0,
      breakdown: data.breakdown || { protein: ((data.feed || data.feedMeasurement || 0) * 0.55).toFixed(2), filler: ((data.feed || data.feedMeasurement || 0) * 0.45).toFixed(2) },
      processedImageBase64: data.processedImage || data.processedImageBase64 || null,
      timestamp: data.dateTime || data.created_at || new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Failed to fetch latest result from backend, falling back to localStorage', err);
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return local[0] || null;
  }
}

async function fetchResultById(id) {
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
    alert("You must be logged in to view results.");
    return null; // Return null if no ownerId
  }

  try {
    // const res = await fetch(`http://localhost:5000/api/biomass-records?ownerId=${ownerId}`);
    const res = await fetch(`${API_URL}/api/biomass-records?ownerId=${ownerId}`);
    if (!res.ok) throw new Error('Network error');
    const all = await res.json();
    const match = (all || []).find(r => String(r._id || r.recordId) === String(id));
    if (!match) return null;
    return {
      id: match._id || match.recordId,
      totalPL: match.shrimpCount || 0,
      biomass: match.biomass || 0,
      feedRecommendation: match.feedMeasurement || match.feed || 0,
      breakdown: match.breakdown || { protein: ((match.feed || match.feedMeasurement || 0) * 0.55).toFixed(2), filler: ((match.feed || match.feedMeasurement || 0) * 0.45).toFixed(2) },
      processedImageBase64: match.processedImage || match.processedImageBase64 || null,
      timestamp: match.dateTime || match.created_at || new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Failed to fetch result by id, falling back to localStorage', err);
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return all.find(r => r.id === id) || null;
  }
}

function Pie({ a, b, size = 120 }) {
  const total = Number(a) + Number(b) || 1;
  const aDeg = (Number(a) / total) * 360;
  const circumference = 2 * Math.PI * (size / 2 - 8);
  const aLen = (aDeg / 360) * circumference;
  const bLen = circumference - aLen;
  const r = size / 2;
  const cx = r;
  const cy = r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="feed composition pie chart">
      <circle cx={cx} cy={cy} r={r - 8} fill="#fff" />
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r - 8} fill="transparent"
          stroke="#ff8a65" strokeWidth={16}
          strokeDasharray={`${aLen} ${bLen}`} strokeLinecap="butt" />
        <circle cx={cx} cy={cy} r={r - 8} fill="transparent"
          stroke="#0c6b63" strokeWidth={16}
          strokeDasharray={`${bLen} ${aLen}`} strokeDashoffset={-aLen} strokeLinecap="butt" />
      </g>
    </svg>
  );
}

export default function DashboardResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      let r = null;
      if (id) {
        r = await fetchResultById(id);
      } else {
        r = await fetchLatestResultFromBackend();
      }
      setResult(r);
    })();
  }, [location.search]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a2f1f] via-[#2d8a6b] to-[#3cb371] p-6">
        <div className="text-center text-white">
          <p className="mb-4 text-xl">No results available.</p>
          <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-shrimp-orange text-white rounded-lg hover:bg-orange-600 transition-colors">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const created = new Date(result.timestamp);
  const dateStr = created.toLocaleDateString();
  const timeStr = created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2f1f] via-[#2d8a6b] to-[#3cb371] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-white hover:text-shrimp-orange transition-colors mb-4"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Analysis Results</h2>
          <p className="text-white/80">{dateStr} • {timeStr}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-sm text-white/70 mb-2">Total PL Shrimp Count</div>
            <div className="text-4xl font-bold text-shrimp-orange">{result.totalPL.toLocaleString()}</div>
            <div className="text-white/60 text-sm">pieces</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-sm text-white/70 mb-2">Total Biomass</div>
            <div className="text-4xl font-bold text-shrimp-orange">{result.biomass}</div>
            <div className="text-white/60 text-sm">grams</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-6">Feed Recommendation</h3>
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
            <div className="flex-1">
              <div className="text-5xl font-bold text-shrimp-orange mb-3">{result.feedRecommendation}g</div>
              <div className="text-white/80 mb-6">Recommended daily feed based on current shrimp count</div>

              <div className="flex gap-6">
                <div className="flex items-center gap-3">
                  <span className="inline-block w-4 h-4 rounded-full bg-[#ff8a65]" />
                  <div>
                    <div className="text-white font-bold">Protein</div>
                    <div className="text-white font-bold">{result.breakdown.protein}g</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-block w-4 h-4 rounded-full bg-[#0c6b63]" />
                  <div>
                    <div className="text-white font-bold">Filler</div>
                    <div className="text-white font-bold">{result.breakdown.filler}g</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-40 mt-6 lg:mt-0">
              <Pie a={Number(result.breakdown.protein)} b={Number(result.breakdown.filler)} size={160} />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/dashboard/history")}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            View Full History →
          </button>
        </div>
      </div>
    </div>
  );
}
