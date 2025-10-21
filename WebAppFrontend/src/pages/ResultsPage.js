import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResults, setAnalysisResults] = useState(null);

  const resultId = searchParams.get('id');

  useEffect(() => {
    // Simulate loading the processed image and analysis
    const loadResults = async () => {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get the stored result from localStorage
      const storedResults = JSON.parse(localStorage.getItem('shrimp_history_v1') || '[]');
      const currentResult = storedResults.find(result => result.id === resultId);

      if (currentResult) {
        // If processedImageBase64 is available, convert to data URL
        if (currentResult.processedImageBase64) {
          setProcessedImage(`data:image/jpeg;base64,${currentResult.processedImageBase64}`);
        } else {
          setProcessedImage('/shrimp-logo.gif');
        }
        setAnalysisResults(currentResult);
      }

      setIsLoading(false);
    };

    if (resultId) {
      loadResults();
    }
  }, [resultId]);

  const handleViewAnalysis = () => {
    navigate('/dashboard/history');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a2f1f] via-[#2d8a6b] to-[#3cb371] flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl border border-white/20 max-w-md w-full mx-4">
          <div className="w-24 h-24 bg-shrimp-orange rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
            <Icon icon="mdi:brain" width="40" height="40" className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Processing Image...</h2>
          <p className="text-white/90 text-lg font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Our AI model is analyzing your shrimp image</p>
        </div>
      </div>
    );
  }

  if (!analysisResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a2f1f] via-[#2d8a6b] to-[#3cb371] flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl border border-white/20 max-w-md w-full mx-4">
          <Icon icon="mdi:alert-circle" width="48" height="48" className="text-white mx-auto mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">No Results Found</h2>
          <p className="text-white/90 mb-6 text-lg font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Unable to find analysis results for this image.</p>
          <button
            onClick={handleBackToDashboard}
            className="bg-shrimp-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f624d] via-[#2d8a6b] to-[#3bb58f]">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">SHRIMP SENSE</h1>
          <button
            onClick={handleBackToDashboard}
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <Icon icon="mdi:arrow-left" width="20" height="20" />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-6 pb-12 max-w-7xl mx-auto">
        {/* Image Container */}
        <div className="flex-1 max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              {processedImage ? (
                <img
                  src={processedImage}
                  alt="Processed shrimp analysis"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <Icon icon="mdi:image-outline" width="64" height="64" className="mx-auto mb-4" />
                  <p className="text-lg font-medium">This container will display the processed image</p>
                  <p className="text-sm text-gray-400">(It automatically scales on the size of the output picture)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Button */}
        <div className="flex flex-col items-center justify-center lg:w-80">
          <button
            onClick={handleViewAnalysis}
            className="bg-white text-gray-800 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
          >
            VIEW ANALYSIS RESULTS
          </button>
          <p className="text-white/80 text-sm mt-4 text-center">
            Click to view detailed analysis results
          </p>
        </div>
      </div>

      {/* Results Summary */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Analysis Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2 text-shadow-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{analysisResults.totalPL}</p>
              <p className="text-sm text-white/90 font-medium">Total PL</p>
              <p className="text-xs text-white/70">pieces</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2 text-shadow-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{analysisResults.biomass}g</p>
              <p className="text-sm text-white/90 font-medium">Biomass</p>
              <p className="text-xs text-white/70">total weight</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2 text-shadow-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{analysisResults.feedRecommendation}g</p>
              <p className="text-sm text-white/90 font-medium">Feed Amount</p>
              <p className="text-xs text-white/70">daily recommendation</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2 text-shadow-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{analysisResults.breakdown.protein}g</p>
              <p className="text-sm text-white/90 font-medium">Protein</p>
              <p className="text-xs text-white/60">from breakdown</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
