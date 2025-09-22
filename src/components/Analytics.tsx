import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function Analytics() {
  const { t } = useLanguage();
  const kpiData = [
    { name: 'Fleet Availability', current: 96.8, target: 95.0, trend: 'up', change: '+2.1%' },
    { name: 'Punctuality Rate', current: 99.2, target: 99.5, trend: 'down', change: '-0.3%' },
    { name: 'Maintenance Compliance', current: 98.4, target: 95.0, trend: 'up', change: '+1.2%' },
    { name: 'Energy Efficiency', current: 92.7, target: 90.0, trend: 'up', change: '+3.4%' },
  ];

  const scheduleMetrics = [
    { period: 'Last 7 Days', optimizationTime: '2.3 min', accuracy: '94.2%', conflicts: 12 },
    { period: 'Last 30 Days', optimizationTime: '2.1 min', accuracy: '95.8%', conflicts: 38 },
    { period: 'Last Quarter', optimizationTime: '2.4 min', accuracy: '93.5%', conflicts: 127 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('analytics.kpi')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <motion.div key={kpi.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 + index * 0.06 }} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{kpi.name}</h3>
                <div className={`flex items-center space-x-1 text-xs ${
                  kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.current}%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/ {kpi.target}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${kpi.current >= kpi.target ? 'bg-green-500 dark:bg-green-400' : 'bg-orange-500 dark:bg-orange-400'}`}
                  style={{ width: `${Math.min(kpi.current, 100)}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scheduling Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('analytics.aiPerformance')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Period</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Avg. Processing Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Prediction Accuracy</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Conflicts Resolved</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Efficiency Gain</th>
              </tr>
            </thead>
            <tbody>
              {scheduleMetrics.map((metric, index) => (
                <motion.tr key={index} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.05 + index * 0.08 }} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{metric.period}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-900 dark:text-white">{metric.optimizationTime}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-green-500 dark:text-green-400" />
                      <span className="font-medium text-green-600 dark:text-green-400">{metric.accuracy}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{metric.conflicts}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 dark:text-green-400 font-medium">+{15 + index * 2}%</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Utilization Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('analytics.fleetUtilization')}</h3>
          <div className="space-y-4">
            {['Service Hours', 'Maintenance Time', 'Standby Duration'].map((metric, index) => {
              const values = [85, 12, 3][index];
              return (
                <div key={metric}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">{metric}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{values}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-green-500 dark:bg-green-400' : index === 1 ? 'bg-orange-500 dark:bg-orange-400' : 'bg-blue-500 dark:bg-blue-400'
                      }`}
                      style={{ width: `${values}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Cost Savings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('analytics.costSavings')}</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Optimization</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">₹2.4L</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Energy Efficiency</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₹1.8L</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule Optimization</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">₹3.2L</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white">{t('analytics.totalMonthlySavings')}</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">₹7.4L</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}