import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Globe, 
  Shield,
  CreditCard,
  Download,
  Trash2,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function SettingsTab() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [copied, setCopied] = useState(false);
  const [apiKeyRegenerated, setApiKeyRegenerated] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      analysis: true,
      competitors: false
    },
    privacy: {
      dataRetention: '12months',
      analytics: true,
      thirdParty: false
    },
    api: {
      rateLimit: 1000,
      timeout: 30
    }
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'api', label: 'API Settings', icon: Globe },
    { id: 'data', label: 'Data Management', icon: Download }
  ];

  const copyApiKey = async () => {
    const apiKey = 'sk-1234567890abcdef1234567890abcdef';
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy API key');
    }
  };

  const regenerateApiKey = () => {
    setApiKeyRegenerated(true);
    setTimeout(() => setApiKeyRegenerated(false), 3000);
  };

  const saveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const saveNotifications = () => {
    // Save notification preferences
    console.log('Saving notification preferences:', settings.notifications);
  };

  const exportAllData = () => {
    // Create a comprehensive data export
    const exportData = {
      user_profile: user,
      settings: settings,
      export_date: new Date().toISOString(),
      data_summary: {
        total_analyses: 247,
        total_exports: 15,
        account_created: '2024-01-01'
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopify_insights_data_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Settings</h2>
        <p className="text-gray-600">
          Manage your account preferences, security settings, and data export options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      placeholder="Your company name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={saveProfile}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    {profileSaved ? <CheckCircle className="w-4 h-4" /> : null}
                    <span>{profileSaved ? 'Saved!' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Browser Notifications</p>
                      <p className="text-sm text-gray-600">Show desktop notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.browser}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, browser: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Analysis Complete</p>
                      <p className="text-sm text-gray-600">Notify when store analysis is finished</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.analysis}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, analysis: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <button 
                  onClick={saveNotifications}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {activeSection === 'api' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">API Key</p>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-800 text-green-400 px-3 py-2 rounded text-sm font-mono flex-1">
                      {apiKeyRegenerated ? 'sk-newkey7890abcdef1234567890abcdef' : 'sk-1234567890abcdef1234567890abcdef'}
                    </code>
                    <button 
                      onClick={copyApiKey}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm flex items-center space-x-2"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button 
                      onClick={regenerateApiKey}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm flex items-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                  {apiKeyRegenerated && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-800 text-sm">API key regenerated successfully!</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit (per hour)</label>
                    <input
                      type="number"
                      value={settings.api.rateLimit}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        api: { ...prev.api, rateLimit: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (seconds)</label>
                    <input
                      type="number"
                      value={settings.api.timeout}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        api: { ...prev.api, timeout: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">API Usage</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600 font-semibold">847</p>
                      <p className="text-blue-700">Requests Today</p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-semibold">23,456</p>
                      <p className="text-blue-700">This Month</p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-semibold">153 ms</p>
                      <p className="text-blue-700">Avg Response</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'billing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Billing & Subscription</h3>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Pro Plan</h4>
                      <p className="text-gray-600 text-sm">Advanced analytics and unlimited exports</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">$49</p>
                      <p className="text-gray-600 text-sm">per month</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>✓ Unlimited store analyses</p>
                    <p>✓ Competitor intelligence</p>
                    <p>✓ Advanced data exports</p>
                    <p>✓ API access</p>
                    <p>✓ Priority support</p>
                  </div>
                  
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Manage Subscription
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-gray-600 text-sm">Expires 12/25</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'data' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Export All Data</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Download a complete archive of all your stored data and analyses.
                    </p>
                    <button 
                      onClick={exportAllData}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Data</span>
                    </button>
                  </div>

                  <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <h4 className="font-medium text-yellow-900 mb-2">Data Retention</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Your analysis data is automatically deleted after 12 months for privacy compliance.
                    </p>
                    <select className="px-3 py-2 border border-yellow-300 rounded-lg text-sm">
                      <option value="6months">6 months</option>
                      <option value="12months" selected>12 months</option>
                      <option value="24months">24 months</option>
                    </select>
                  </div>

                  <div className="border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-600 mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button 
                      onClick={deleteAccount}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}