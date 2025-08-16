import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OverviewTab } from './tabs/OverviewTab';
import { StoreAnalyzerTab } from './tabs/StoreAnalyzerTab';
import { CompetitorAnalysisTab } from './tabs/CompetitorAnalysisTab';
import { DataExportTab } from './tabs/DataExportTab';
import { SettingsTab } from './tabs/SettingsTab';

export type TabType = 'overview' | 'analyzer' | 'competitors' | 'export' | 'settings';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Listen for navigation events from other components
    const handleNavigateToAnalyzer = (event: CustomEvent) => {
      setActiveTab('analyzer');
      // You could also pass the URL to pre-fill the analyzer
    };

    window.addEventListener('navigate-to-analyzer', handleNavigateToAnalyzer as EventListener);
    
    return () => {
      window.removeEventListener('navigate-to-analyzer', handleNavigateToAnalyzer as EventListener);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'analyzer':
        return <StoreAnalyzerTab />;
      case 'competitors':
        return <CompetitorAnalysisTab />;
      case 'export':
        return <DataExportTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}