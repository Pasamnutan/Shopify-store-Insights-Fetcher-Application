import React, { useState } from 'react';
import { Search, Loader, ExternalLink, Globe, Mail, Phone, Instagram, Facebook, AlertCircle } from 'lucide-react';
import { apiService, type StoreInsights } from '../../services/api';

export function StoreAnalyzerTab() {
  const [url, setUrl] = useState('');
  const [insights, setInsights] = useState<StoreInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeStore = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const result = await apiService.analyzeStore(url);
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze store');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyzeStore();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Analyzer</h2>
        <p className="text-gray-600 mb-6">
          Enter a Shopify store URL to extract comprehensive insights and data.
        </p>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://example.myshopify.com or https://store.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={analyzeStore}
            disabled={!url || loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Analyze Store</span>
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

      {insights && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
                <p className="text-gray-600 flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{insights.url}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Product Catalog */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Catalog</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-600 font-semibold text-2xl">
                    {insights.product_catalog.total_products}
                  </p>
                  <p className="text-gray-600 text-sm">Total Products</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-600 font-semibold text-2xl">
                    {insights.product_catalog.categories.length}
                  </p>
                  <p className="text-gray-600 text-sm">Categories</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-600 font-semibold text-2xl">
                    ${insights.product_catalog.price_range.min.toFixed(2)}-${insights.product_catalog.price_range.max.toFixed(2)}
                  </p>
                  <p className="text-gray-600 text-sm">Price Range</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.product_catalog.categories.map((category, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Products */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Hero Products</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.hero_products.slice(0, 6).map((product, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h5 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h5>
                      <p className="text-purple-600 font-bold">{product.price}</p>
                      {product.category && (
                        <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Store Policies</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.privacy_policy && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Privacy Policy</h5>
                    <p className="text-gray-600 text-sm line-clamp-3">{insights.privacy_policy}</p>
                  </div>
                )}
                {insights.return_policy && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Return Policy</h5>
                    <p className="text-gray-600 text-sm line-clamp-3">{insights.return_policy}</p>
                  </div>
                )}
                {insights.refund_policy && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Refund Policy</h5>
                    <p className="text-gray-600 text-sm line-clamp-3">{insights.refund_policy}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact & Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h4>
                <div className="space-y-3">
                  {insights.contact_details.emails.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${email}`} className="text-gray-700 hover:text-purple-600">
                        {email}
                      </a>
                    </div>
                  ))}
                  {insights.contact_details.phones.map((phone, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a href={`tel:${phone}`} className="text-gray-700 hover:text-purple-600">
                        {phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Handles</h4>
                <div className="space-y-3">
                  {insights.social_handles.instagram && (
                    <div className="flex items-center space-x-2">
                      <Instagram className="w-4 h-4 text-gray-500" />
                      <a 
                        href={insights.social_handles.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-purple-600"
                      >
                        {insights.social_handles.instagram}
                      </a>
                    </div>
                  )}
                  {insights.social_handles.facebook && (
                    <div className="flex items-center space-x-2">
                      <Facebook className="w-4 h-4 text-gray-500" />
                      <a 
                        href={insights.social_handles.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-purple-600"
                      >
                        {insights.social_handles.facebook}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Context */}
            {insights.brand_context && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Brand Context</h4>
                <p className="text-gray-700 leading-relaxed">{insights.brand_context}</p>
              </div>
            )}

            {/* Important Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Important Links</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {insights.important_links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h4>
              <div className="space-y-4">
                {insights.faqs.map((faq, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">{faq.question}</h5>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}