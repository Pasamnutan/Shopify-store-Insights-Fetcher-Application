import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  BarChart3
} from 'lucide-react';

export function OverviewTab() {
  const [quickAnalyzeUrl, setQuickAnalyzeUrl] = useState('');

  const stats = [
    {
      title: 'Total Stores Analyzed',
      value: '2,847',
      change: '+12.3%',
      changeType: 'increase' as const,
      icon: Globe
    },
    {
      title: 'Products Cataloged',
      value: '156,834',
      change: '+8.7%',
      changeType: 'increase' as const,
      icon: ShoppingBag
    },
    {
      title: 'Competitor Reports',
      value: '4,293',
      change: '+15.2%',
      changeType: 'increase' as const,
      icon: Users
    },
    {
      title: 'API Requests',
      value: '89,432',
      change: '-2.1%',
      changeType: 'decrease' as const,
      icon: TrendingUp
    }
  ];

  const recentAnalyses = [
    {
      store: 'memy.co.in',
      products: 247,
      competitors: 12,
      lastAnalyzed: '2 hours ago',
      status: 'completed'
    },
    {
      store: 'hairoriginals.com',
      products: 189,
      competitors: 8,
      lastAnalyzed: '5 hours ago',
      status: 'completed'
    },
    {
      store: 'colourpop.com',
      products: 1834,
      competitors: 24,
      lastAnalyzed: '1 day ago',
      status: 'completed'
    },
    {
      store: 'gymshark.com',
      products: 567,
      competitors: 18,
      lastAnalyzed: '2 days ago',
      status: 'processing'
    }
  ];

  const handleQuickAnalyze = () => {
    if (quickAnalyzeUrl) {
      // Trigger navigation to analyzer tab with pre-filled URL
      window.dispatchEvent(new CustomEvent('navigate-to-analyzer', { 
        detail: { url: quickAnalyzeUrl } 
      }));
    }
  };

  const handleViewDocumentation = () => {
    window.open('https://docs.shopifyinsights.com', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to ShopifyInsights Pro</h1>
        <p className="text-purple-100 text-lg mb-6">
          Get comprehensive insights from Shopify stores with advanced AI-powered analysis
        </p>
        
        {/* Quick Analyze */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Quick Store Analysis</h3>
          <div className="flex gap-3">
            <input
              type="url"
              value={quickAnalyzeUrl}
              onChange={(e) => setQuickAnalyzeUrl(e.target.value)}
              placeholder="Enter store URL for quick analysis..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button 
              onClick={handleQuickAnalyze}
              disabled={!quickAnalyzeUrl}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Analyze</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleQuickAnalyze}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analyze New Store</span>
          </button>
          <button 
            onClick={handleViewDocumentation}
            className="border border-purple-300 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            View Documentation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-purple-600" />
              </div>
              <div className={`flex items-center space-x-1 ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? 
                  <ArrowUpRight size={16} /> : 
                  <ArrowDownRight size={16} />
                }
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Analyses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recent Store Analyses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Competitors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Analyzed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentAnalyses.map((analysis, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{analysis.store}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {analysis.products.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {analysis.competitors}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {analysis.lastAnalyzed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      analysis.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {analysis.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-analyzer', { 
                        detail: { url: `https://${analysis.store}` } 
                      }))}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Re-analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}