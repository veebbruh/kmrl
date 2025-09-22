import React, { useState, useEffect } from 'react';
import { Train, Settings, BarChart3, Calendar, Users, Bell, Sun, Moon, MapPin, Shield } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useLanguage } from '../contexts/LanguageContext';
import FloatingChatbot from './FloatingChatbot';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { language, toggleLanguage, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Train },
    { id: 'scheduling', label: t('nav.scheduling'), icon: Calendar },
    { id: 'analytics', label: t('nav.analytics'), icon: BarChart3 },
    { id: 'fitness', label: t('nav.fitness'), icon: Shield },
    { id: 'maintenance', label: t('nav.maintenance'), icon: Settings },
    { id: 'staff', label: t('nav.staff'), icon: Users },
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentDate(now);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time in IST
  const formatISTTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Format date in IST
  const formatISTDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logo.jpeg" 
                  alt="KMRL Logo" 
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('app.title')}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('app.subtitle')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatISTDate(currentDate)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                  {formatISTTime(currentTime)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {t('label.ist')}
                </p>
              </div>
              <button 
                onClick={toggleLanguage}
                className="px-2 py-1 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={language === 'en' ? 'Switch to Malayalam' : 'Switch to English'}
              >
                {language === 'en' ? 'മലയാളം' : 'English'}
              </button>
              <button 
                onClick={toggleDarkMode}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={isDarkMode ? t('tooltip.light') : t('tooltip.dark')}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onViewChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                        currentView === item.id
                          ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Floating Chatbot Button */}
      <FloatingChatbot />
    </div>
  );
}