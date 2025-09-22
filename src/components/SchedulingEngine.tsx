import React, { useState } from 'react';
import { Brain, Play, RotateCcw, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Trainset } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useOptimization } from '../contexts/OptimizationContext';

interface SchedulingEngineProps {
  trainsets: Trainset[];
}

export default function SchedulingEngine({ trainsets }: SchedulingEngineProps) {
  const { t } = useLanguage();
  const { optimizationResult, runOptimization, isOptimizing } = useOptimization();

  const handleRunOptimization = async () => {
    await runOptimization(trainsets);
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('scheduling.title')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('scheduling.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
              <RotateCcw className="w-4 h-4" />
              <span>{t('scheduling.reset')}</span>
            </button>
            <button 
              onClick={handleRunOptimization}
              disabled={isOptimizing}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isOptimizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('scheduling.optimizing')}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{t('scheduling.run')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optimization Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{t('scheduling.serviceRequirements')}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">12 trainsets for peak hours</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{t('scheduling.aiConfidence')}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Learning from 2,847 decisions</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{t('scheduling.constraints')}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">6 active optimization rules</p>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {optimizationResult && (
        <>
          {/* Metrics Dashboard */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('scheduling.optimizationMetrics')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(optimizationResult.metrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Conflicts and Alerts */}
          {optimizationResult.conflicts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('scheduling.conflicts')}</h3>
              <div className="space-y-3">
                {optimizationResult.conflicts.map((conflict, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    conflict.severity === 'critical' 
                      ? 'bg-red-50 dark:bg-red-900 border-red-500' 
                      : 'bg-yellow-50 dark:bg-yellow-900 border-yellow-500'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${
                        conflict.severity === 'critical' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Train {trainsets.find(t => t.id === conflict.trainsetId)?.number}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{conflict.issue}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">{conflict.resolution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Schedule Results */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('scheduling.recommendedSchedule')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Trainset</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Assignment</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Confidence</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Key Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {optimizationResult.schedule.map((item, index) => {
                    const trainset = trainsets.find(t => t.id === item.trainsetId);
                    return (
                      <motion.tr key={item.trainsetId} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.05 + index * 0.04 }} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Train {trainset?.number}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.assignment === 'service' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            item.assignment === 'standby' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                            'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                          }`}>
                            {item.assignment.charAt(0).toUpperCase() + item.assignment.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                                style={{ width: `${item.confidence * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {(item.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {item.reasoning[0]}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}