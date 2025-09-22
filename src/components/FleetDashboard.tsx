import React, { useState } from 'react';
import { Train, AlertTriangle, CheckCircle, Clock, Wrench, Navigation, MapPin, Users, Wifi, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trainset } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useOptimization } from '../contexts/OptimizationContext';

interface FleetDashboardProps {
  trainsets: Trainset[];
}

export default function FleetDashboard({ trainsets }: FleetDashboardProps) {
  const [selectedTrainset, setSelectedTrainset] = useState<Trainset | null>(null);
  const { t } = useLanguage();
  const { optimizationResult, getStatusCounts, getCriticalIssuesCount } = useOptimization();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'service': return 'bg-green-500';
      case 'standby': return 'bg-blue-500';
      case 'maintenance': return 'bg-orange-500';
      case 'cleaning': return 'bg-purple-500';
      case 'inspection': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'service': return CheckCircle;
      case 'standby': return Clock;
      case 'maintenance': return Wrench;
      case 'cleaning': return Train;
      case 'inspection': return AlertTriangle;
      default: return Train;
    }
  };

  // Use optimization results if available, otherwise fall back to current status
  const statusCounts = optimizationResult ? getStatusCounts() : trainsets.reduce((acc, trainset) => {
    acc[trainset.status] = (acc[trainset.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const criticalIssues = optimizationResult ? getCriticalIssuesCount() : trainsets
    .flatMap(t => t.currentIssues.filter(i => i.severity === 'critical'))
    .length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.inService')}</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{statusCounts.service || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.onStandby')}</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{statusCounts.standby || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.maintenance')}</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{statusCounts.maintenance || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.criticalIssues')}</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{criticalIssues}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fleet Status Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.liveFleetStatus')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {optimizationResult ? 'AI-Optimized Schedule Applied' : t('dashboard.realtimeStatus')}
              </p>
            </div>
            {optimizationResult && (
              <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Optimized</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-center">
            {trainsets.map((trainset, index) => {
              // Use optimized status if available, otherwise use current status
              const optimizedStatus = optimizationResult?.schedule.find(s => s.trainsetId === trainset.id)?.assignment || trainset.status;
              const StatusIcon = getStatusIcon(optimizedStatus);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 + index * 0.03 }}
                  key={trainset.id} 
                  className={`card ${optimizedStatus} relative overflow-hidden cursor-pointer ${optimizationResult ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
                  onClick={() => setSelectedTrainset(trainset)}
                >
                  {optimizationResult && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                    </div>
                  )}
                  <div className="first-content">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-4 h-4 rounded-full bg-white bg-opacity-30"></div>
                      <span className="text-white font-bold text-lg">Train {trainset.number}</span>
                    </div>
                    <StatusIcon className="w-8 h-8 text-white mb-2" />
                    <span className="text-white text-sm capitalize font-semibold">{optimizedStatus}</span>
                    {optimizationResult && optimizedStatus !== trainset.status && (
                      <div className="mt-2 p-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20 shadow-lg">
                        <div className="flex items-center space-x-2 text-xs text-white">
                          <Clock className="w-3 h-3 opacity-80" />
                          <span className="font-medium opacity-90">Was: {trainset.status}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="second-content text-white text-left">
                    <div className="space-y-1 text-xs w-full">
                      <div className="mb-2">
                        <div className="font-bold text-xs opacity-90">{t('dashboard.location')}</div>
                        <div className="text-sm font-semibold">{trainset.location}</div>
                      </div>
                      {trainset.status === 'service' && trainset.nextLocation && (
                        <div className="mb-2">
                          <div className="font-bold text-xs opacity-90 flex items-center space-x-1">
                            <Navigation className="w-3 h-3" />
                            <span>{t('dashboard.nextStop')}</span>
                          </div>
                          <div className="text-sm font-semibold">{trainset.nextLocation}</div>
                          {trainset.estimatedArrival && (
                            <div className="text-xs opacity-80">ETA: {trainset.estimatedArrival}</div>
                          )}
                        </div>
                      )}
                      <div className="mb-2">
                        <div className="font-bold text-xs opacity-90">{t('dashboard.mileage')}</div>
                        <div className="text-sm font-semibold">{trainset.mileage.toLocaleString()} km</div>
                      </div>
                      <div className="mb-2">
                        <div className="font-bold text-xs opacity-90">{t('dashboard.nextMaintenance')}</div>
                        <div className="text-xs font-semibold">{new Date(trainset.nextMaintenance).toLocaleDateString()}</div>
                      </div>
                      {trainset.branding && (
                        <div className="mb-2">
                          <div className="font-bold text-xs opacity-90">{t('dashboard.branding')}</div>
                          <div className="text-xs font-semibold">{trainset.branding.advertiser}</div>
                        </div>
                      )}
                    </div>
                    {trainset.currentIssues.length > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-yellow-200 mt-2">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{trainset.currentIssues.length} {t('dashboard.issues')}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metro Information Modal */}
      <AnimatePresence>
        {selectedTrainset && selectedTrainset.metroLine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTrainset(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedTrainset.metroLine.lineName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Line {selectedTrainset.metroLine.lineNumber} • Train {selectedTrainset.number}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTrainset(null)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Route Information */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-900 dark:text-white">{selectedTrainset.metroLine.source}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-900 dark:text-white">{selectedTrainset.metroLine.destination}</span>
                  </div>
                </div>

                {/* Time Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Departure</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTrainset.metroLine.departureTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTrainset.metroLine.journeyDuration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Arrival</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTrainset.metroLine.arrivalTime}</p>
                  </div>
                </div>

                {/* Major Stops */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Major Stops
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainset.metroLine.majorStops.map((stop, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                      >
                        {stop}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Coach Types */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Available Coach Types
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainset.metroLine.coachTypes.map((coach, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium"
                      >
                        {coach}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Seat Availability */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Seat Availability
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedTrainset.metroLine.seatAvailability.general > 0 && (
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">General</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {selectedTrainset.metroLine.seatAvailability.general}
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedTrainset.metroLine.seatAvailability.women > 0 && (
                      <div className="bg-pink-100 dark:bg-pink-900 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Women</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {selectedTrainset.metroLine.seatAvailability.women}
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedTrainset.metroLine.seatAvailability.ac > 0 && (
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">AC</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {selectedTrainset.metroLine.seatAvailability.ac}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Total</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {selectedTrainset.metroLine.seatAvailability.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issues Section */}
                {selectedTrainset.currentIssues.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span>Current Issues</span>
                    </h4>
                    <div className="space-y-3">
                      {selectedTrainset.currentIssues.map((issue, index) => (
                        <motion.div
                          key={issue.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border-l-4 ${
                            issue.severity === 'critical' 
                              ? 'bg-red-50 dark:bg-red-900 border-red-500' 
                              : issue.severity === 'high'
                              ? 'bg-orange-50 dark:bg-orange-900 border-orange-500'
                              : issue.severity === 'medium'
                              ? 'bg-yellow-50 dark:bg-yellow-900 border-yellow-500'
                              : 'bg-blue-50 dark:bg-blue-900 border-blue-500'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  issue.severity === 'critical' 
                                    ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                                    : issue.severity === 'high'
                                    ? 'bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
                                    : issue.severity === 'medium'
                                    ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                                    : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                                }`}>
                                  {issue.severity.toUpperCase()}
                                </span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {issue.type.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {issue.description}
                              </p>
                              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                <p>Reported: {new Date(issue.reportedAt).toLocaleString('en-IN', { 
                                  timeZone: 'Asia/Kolkata',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</p>
                                <p>Expected Resolution: {new Date(issue.estimatedResolution).toLocaleString('en-IN', { 
                                  timeZone: 'Asia/Kolkata',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</p>
                                {issue.assignedTechnician && (
                                  <p>Assigned to: {issue.assignedTechnician}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optimization Details Section */}
                {optimizationResult && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Optimization Details</span>
                      </h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(optimizationResult.timestamp).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    {(() => {
                      const scheduleItem = optimizationResult.schedule.find(s => s.trainsetId === selectedTrainset.id);
                      if (!scheduleItem) return null;
                      
                      return (
                        <div className="space-y-3">
                          {/* Status Change */}
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedTrainset.status)}`}></div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                                  Was: {selectedTrainset.status}
                                </span>
                              </div>
                              <div className="text-gray-400">→</div>
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(scheduleItem.assignment)}`}></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                  {scheduleItem.assignment}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                              <span className="text-sm font-semibold">{Math.round(scheduleItem.confidence * 100)}%</span>
                              <span className="text-xs">confidence</span>
                            </div>
                          </div>

                          {/* Reasoning */}
                          <div>
                            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Factors:</h5>
                            <div className="space-y-1">
                              {scheduleItem.reasoning.map((reason, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start space-x-2 text-xs text-gray-600 dark:text-gray-300"
                                >
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span>{reason}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Overall Metrics */}
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                {scheduleItem.overallScore ? Math.round(scheduleItem.overallScore) : Math.round(optimizationResult.metrics.overallScore)}%
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Overall Score</div>
                              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Based on fitness, maintenance, issues
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {scheduleItem.serviceReadiness ? Math.round(scheduleItem.serviceReadiness) : Math.round(optimizationResult.metrics.serviceReadiness)}%
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Service Readiness</div>
                              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Train's operational readiness
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Additional Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedTrainset.metroLine.seatAvailability.total} {t('dashboard.seatsAvailable')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.freeWifi')}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Platform: {selectedTrainset.metroLine.platform}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}