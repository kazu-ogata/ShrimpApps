import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "shrimp_history_v1";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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

export default function DashboardHistory() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const all = await fetchHistoryFromBackend();
      all.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
      setItems(all);
    })();
  }, []);

  const toggleOpen = (id) => {
    setItems((prev) => prev.map(it => it.id === id ? { ...it, _open: !it._open } : it));
  };

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a2f1f] via-[#2d8a6b] to-[#3cb371] p-6">
        <div className="text-center text-white">
          <p className="mb-4 text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">No history yet. Upload an image to create your first analysis.</p>
          <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-shrimp-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-lg">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Analysis History</h2>
        </div>

        <div className="space-y-4">
          {items.map(item => {
            const created = new Date(item.timestamp);
            const dateStr = created.toLocaleDateString();
            const timeStr = created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={item.id} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                <button
                  onClick={() => toggleOpen(item.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  aria-expanded={!!item._open}
                >
                  <div>
                    <div className="text-white/90 text-sm font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{dateStr}</div>
                    <div className="text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{timeStr}</div>
                    <div className="text-shrimp-orange font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.totalPL.toLocaleString()} shrimp counted</div>
                  </div>
                  <div className="text-white/50 text-2xl">
                    {item._open ? "−" : "+"}
                  </div>
                </button>

                {item._open && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
                      {/* Analysis Metrics */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-white font-bold mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Total Count</div>
                            <div className="text-2xl font-bold text-shrimp-orange drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.totalPL.toLocaleString()}</div>
                            <div className="text-white font-bold mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">pieces</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-white font-bold mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Biomass</div>
                            <div className="text-2xl font-bold text-shrimp-orange drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.biomass}g</div>
                            <div className="text-white font-bold mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">total weight</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-white font-bold mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Feed Rec.</div>
                            <div className="text-2xl font-bold text-shrimp-orange drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.feedRecommendation}g</div>
                            <div className="text-white font-bold mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">daily recommendation</div>
                          </div>
                        </div>

                        {/* Feed Breakdown */}
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="text-white font-bold mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Feed Breakdown</h4>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-shrimp-orange rounded-full"></div>
                              <span className="text-white font-bold mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Protein: {item.breakdown.protein}g</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                              <span className="text-white font-bold mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Filler: {item.breakdown.filler}g</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate(`/results?id=${item.id}`)}
                        className="px-4 py-2 bg-shrimp-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-lg"
                      >
                        View Details
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            // const res = await fetch(`http://localhost:5000/api/biomass-records/${item.id}`, {
                            const res = await fetch(`${API_URL}/api/biomass-records/${item.id}`, {
                              method: 'DELETE',
                            });
                            if (!res.ok) throw new Error('Failed to delete record');

                            // Delete from local storage as well
                            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").filter(x=>x.id!==item.id);
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

                            setItems(prev => prev.filter(x => x.id !== item.id));
                            window.dispatchEvent(new Event('localStorageUpdated')); // Notify other components
                          } catch (error) {
                            console.error('Error deleting record:', error);
                            alert('Failed to delete record. Please try again.');
                          }
                        }}
                        className="px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors font-semibold shadow-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
