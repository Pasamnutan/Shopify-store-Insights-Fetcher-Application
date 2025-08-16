import React, { useState } from 'react';
import { Users, TrendingUp, DollarSign, Star, ExternalLink, Loader, AlertCircle } from 'lucide-react';
import { apiService, type Competitor } from '../../services/api';

export function CompetitorAnalysisTab() {
  const [targetStore, setTargetStore] = useState('');
  const [loading, setLoading] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalFound, setTotalFound] = useState(0);

  const analyzeCompetitors = async () => {
    if (!targetStore) return;
    
    setLoading(true);
    setError(null);
    setCompetitors([]);
    
    try {
      const result = await apiService.analyzeCompetitors(targetStore);
      setCompetitors(result.competitors);
      setTotalFound(result.total_found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze competitors');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyzeCompetitors();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Competitor Analysis</h2>
        <p className="text-gray-600 mb-6">
          Discover and analyze competitors for any Shopify store to understand market positioning and opportunities.
        </p>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="url"
              value={targetStore}
              onChange={(e) => setTargetStore(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter target store URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={analyzeCompetitors}
            disabled={!targetStore || loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Finding...</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span>Find Competitors</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Analysis Failed</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Finding Competitors</h3>
          <p className="text-gray-600">
            Analyzing the market to find similar stores and competitors...
          </p>
        </div>
      )}

      {competitors.length > 0 && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalFound}</p>
                  <p className="text-gray-600 text-sm">Competitors Found</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(competitors.reduce((acc, comp) => acc + comp.products, 0) / competitors.length)}
                  </p>
                  <p className="text-gray-600 text-sm">Avg Products</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${Math.round(competitors.reduce((acc, comp) => acc + comp.avg_price, 0) / competitors.length)}
                  </p>
                  <p className="text-gray-600 text-sm">Avg Price</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {(competitors.reduce((acc, comp) => acc + comp.rating, 0) / competitors.length).toFixed(1)}
                  </p>
                  <p className="text-gray-600 text-sm">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Competitor Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitors.map((competitor, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{competitor.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ExternalLink className="w-4 h-4" />
                      <a 
                        href={`https://${competitor.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-purple-600"
                      >
                        {competitor.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{competitor.rating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{competitor.products}</p>
                    <p className="text-xs text-gray-600">Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">${competitor.avg_price}</p>
                    <p className="text-xs text-gray-600">Avg Price</p>
                  </div>
                  <div className="text-center">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                      {competitor.category}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-2">Strengths</h4>
                    <div className="flex flex-wrap gap-1">
                      {competitor.strengths.map((strength, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-2">Areas for Improvement</h4>
                    <div className="flex flex-wrap gap-1">
                      {competitor.weaknesses.map((weakness, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}