import React, { useState } from 'react';
import Layout from './components/Layout';
import FleetDashboard from './components/FleetDashboard';
import SchedulingEngine from './components/SchedulingEngine';
import Analytics from './components/Analytics';
import Chatbot from './components/Chatbot';
import { mockTrainsets } from './data/mockData';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <FleetDashboard trainsets={mockTrainsets} />;
      case 'scheduling':
        return <SchedulingEngine trainsets={mockTrainsets} />;
      case 'analytics':
        return <Analytics />;
      case 'chatbot':
        return <Chatbot />;
      case 'maintenance':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Maintenance Hub</h2>
            <p className="text-gray-600 dark:text-gray-300">Comprehensive maintenance management interface coming soon...</p>
          </div>
        );
      case 'staff':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Staff Management</h2>
            <p className="text-gray-600 dark:text-gray-300">Staff scheduling and resource allocation features coming soon...</p>
          </div>
        );
      default:
        return <FleetDashboard trainsets={mockTrainsets} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderContent()}
    </Layout>
  );
}

export default App;