import React, { createContext, useContext, useMemo, useState } from 'react';

type SupportedLanguage = 'en' | 'ml';

interface LanguageContextType {
  language: SupportedLanguage;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'app.title': 'KMRL Operations Center',
    'app.subtitle': 'AI-Driven Train Scheduling System',
    'nav.dashboard': 'Fleet Dashboard',
    'nav.scheduling': 'Scheduling Engine',
    'nav.analytics': 'Analytics',
    'nav.fitness': 'Fitness Certificates',
    'nav.maintenance': 'Maintenance Hub',
    'nav.staff': 'Staff Management',
    'nav.chatbot': 'Chatbot',
    'label.ist': 'IST',
    'tooltip.light': 'Switch to light mode',
    'tooltip.dark': 'Switch to dark mode',
    'dashboard.inService': 'In Service',
    'dashboard.onStandby': 'On Standby',
    'dashboard.maintenance': 'Maintenance',
    'dashboard.criticalIssues': 'Critical Issues',
    'dashboard.liveFleetStatus': 'Live Fleet Status',
    'dashboard.realtimeStatus': 'Real-time status of all 25 trainsets',
    'dashboard.location': 'Location',
    'dashboard.nextStop': 'Next Stop',
    'dashboard.mileage': 'Mileage',
    'dashboard.nextMaintenance': 'Next Maintenance',
    'dashboard.branding': 'Branding',
    'dashboard.issues': 'issue(s)',
    'dashboard.seatsAvailable': 'seats available',
    'dashboard.freeWifi': 'Free WiFi',
    'analytics.kpi': 'Key Performance Indicators',
    'analytics.aiPerformance': 'AI Scheduling Performance',
    'analytics.fleetUtilization': 'Fleet Utilization Trends',
    'analytics.costSavings': 'AI-Driven Cost Savings',
    'analytics.totalMonthlySavings': 'Total Monthly Savings',
    'scheduling.title': 'AI Optimization Engine',
    'scheduling.subtitle': 'Multi-objective scheduling with explainable AI',
    'scheduling.reset': 'Reset',
    'scheduling.optimizing': 'Optimizing...',
    'scheduling.run': 'Run Optimization',
    'scheduling.serviceRequirements': 'Service Requirements',
    'scheduling.aiConfidence': 'AI Confidence',
    'scheduling.constraints': 'Constraints',
    'scheduling.optimizationMetrics': 'Optimization Metrics',
    'scheduling.conflicts': 'Conflicts & Recommendations',
    'scheduling.recommendedSchedule': 'Recommended Schedule',
    'maintenance.title': 'Maintenance Hub',
    'maintenance.comingSoon': 'Comprehensive maintenance management interface coming soon...',
    'staff.title': 'Staff Management',
    'staff.comingSoon': 'Staff scheduling and resource allocation features coming soon...',
  },
  ml: {
    'app.title': 'കെഎംആർഎൽ ഓപ്പറേഷൻസ് സെന്റർ',
    'app.subtitle': 'എഐ അധിഷ്ഠിത ട്രെയിൻ ഷെഡ്യൂളിംഗ് സിസ്റ്റം',
    'nav.dashboard': 'ഫ്ലീറ്റ് ഡാഷ്ബോർഡ്',
    'nav.scheduling': 'ഷെഡ്യൂളിംഗ് എഞ്ചിൻ',
    'nav.analytics': 'വിശകലനം',
    'nav.fitness': 'ഫിറ്റ്നസ് സർട്ടിഫിക്കറ്റുകൾ',
    'nav.maintenance': 'മെൻറനൻസ് ഹബ്',
    'nav.staff': 'സ്റ്റാഫ് മാനേജ്‌മെന്റ്',
    'nav.chatbot': 'ചാറ്റ്ബോട്ട്',
    'label.ist': 'ഐ‌എസ്‌ടി',
    'tooltip.light': 'ലൈറ്റ് മോഡിലേക്ക് മാറ്റുക',
    'tooltip.dark': 'ഡാർക്ക് മോഡിലേക്ക് മാറ്റുക',
    'dashboard.inService': 'സേവനത്തിൽ',
    'dashboard.onStandby': 'സ്റ്റാൻഡ്‌ബൈ',
    'dashboard.maintenance': 'മെൻറനൻസ്',
    'dashboard.criticalIssues': 'ഗുരുതര പ്രശ്നങ്ങൾ',
    'dashboard.liveFleetStatus': 'ലൈവ് ഫ്ലീറ്റ് നില',
    'dashboard.realtimeStatus': 'എല്ലാ 25 ട്രെയിൻസെറ്റുകളുടെയും റിയൽ-ടൈം നില',
    'dashboard.location': 'സ്ഥാനം',
    'dashboard.nextStop': 'അടുത്ത സ്റ്റോപ്പ്',
    'dashboard.mileage': 'മൈലേജ്',
    'dashboard.nextMaintenance': 'അടുത്ത മെൻറനൻസ്',
    'dashboard.branding': 'ബ്രാൻഡിംഗ്',
    'dashboard.issues': 'പ്രശ്ന(ങ്ങൾ)',
    'dashboard.seatsAvailable': 'സീറ്റുകൾ ലഭ്യമാണ്',
    'dashboard.freeWifi': 'സൗജന്യ വൈഫൈ',
    'analytics.kpi': 'പ്രധാന പ്രകടന സൂചികകൾ',
    'analytics.aiPerformance': 'എഐ ഷെഡ്യൂളിംഗ് പ്രകടനം',
    'analytics.fleetUtilization': 'ഫ്ലീറ്റ് ഉപയോഗ പ്രവണതകൾ',
    'analytics.costSavings': 'എഐ അധിഷ്ഠിത ചെലവ് ലാഭം',
    'analytics.totalMonthlySavings': 'മാസാന്ത്യ മൊത്തം ലാഭം',
    'scheduling.title': 'എഐ ഒപ്റ്റിമൈസേഷൻ എഞ്ചിൻ',
    'scheduling.subtitle': 'വ്യാഖ്യാനിക്കാൻ പറ്റുന്ന എഐ ഉപയോഗിച്ച് മൾട്ടി-ഓബ്ജക്റ്റീവ് ഷെഡ്യൂളിംഗ്',
    'scheduling.reset': 'റീസെറ്റ്',
    'scheduling.optimizing': 'ഓപ്റ്റിമൈസ് ചെയ്യുന്നു...',
    'scheduling.run': 'ഓപ്റ്റിമൈസേഷൻ റൺ ചെയ്യുക',
    'scheduling.serviceRequirements': 'സർവീസ് ആവശ്യങ്ങൾ',
    'scheduling.aiConfidence': 'എഐ ആത്മവിശ്വാസം',
    'scheduling.constraints': 'നിയന്ത്രണങ്ങൾ',
    'scheduling.optimizationMetrics': 'ഓപ്റ്റിമൈസേഷൻ മെട്രിക്സ്',
    'scheduling.conflicts': 'സംഘർഷങ്ങളും നിർദ്ദേശങ്ങളും',
    'scheduling.recommendedSchedule': 'ശുപാർശ ചെയ്ത ഷെഡ്യൂൾ',
    'maintenance.title': 'മെൻറനൻസ് ഹബ്',
    'maintenance.comingSoon': 'വിശാലമായ മെൻറനൻസ് മാനേജ്‌മെന്റ് ഇന്റർഫേസ് ഉടനെ വരുന്നു...',
    'staff.title': 'സ്റ്റാഫ് മാനേജ്‌മെന്റ്',
    'staff.comingSoon': 'സ്റ്റാഫ് ഷെഡ്യൂളിംഗ്, റിസോഴ്സ് അലോക്കേഷൻ സവിശേഷതകൾ ഉടനെ വരുന്നു...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('language');
    return saved === 'ml' ? 'ml' : 'en';
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'ml' : 'en';
      localStorage.setItem('language', next);
      return next as SupportedLanguage;
    });
  };

  const t = useMemo(() => {
    const table = translations[language];
    return (key: string) => table[key] ?? key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};


