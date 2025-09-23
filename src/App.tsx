import React, { useState } from 'react';
import Layout from './components/Layout';
import FleetDashboard from './components/FleetDashboard';
import SchedulingEngine from './components/SchedulingEngine';
import Analytics from './components/Analytics';
import FitnessCertificatesSection from './components/FitnessCertificatesSection';
import LoginSignupPage from './components/LoginSignupPage';
import { mockTrainsets } from './data/mockData';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTrainsetId, setSelectedTrainsetId] = useState<string | null>(null);
  const { t } = useLanguage();
  const { user, loading, isAuthenticated } = useAuth();

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return <LoginSignupPage />;
      case 'dashboard':
        return (
          <FleetDashboard 
            trainsets={mockTrainsets} 
            onNavigateToFitness={(trainsetId) => {
              setSelectedTrainsetId(trainsetId);
              setCurrentView('fitness');
            }}
          />
        );
      case 'scheduling':
        return <SchedulingEngine trainsets={mockTrainsets} />;
      case 'analytics':
        return <Analytics />;
      case 'fitness':
        return <FitnessCertificatesSection trainsets={mockTrainsets} selectedTrainsetId={selectedTrainsetId} />;
      case 'maintenance':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('maintenance.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('maintenance.comingSoon')}</p>
          </div>
        );
      case 'staff':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('staff.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('staff.comingSoon')}</p>
          </div>
        );
      default:
        return <FleetDashboard trainsets={mockTrainsets} />;
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentView('dashboard');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated, otherwise show main app
  if (!isAuthenticated) {
    return <LoginSignupPage />;
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
}

export default App;