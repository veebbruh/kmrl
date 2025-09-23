import React from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle, Shield, Calendar, User, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { FitnessCertificate } from '../types';

interface FitnessCertificatePanelProps {
  certificates: FitnessCertificate[];
  trainsetNumber: string;
  compact?: boolean;
}

const FitnessCertificatePanel: React.FC<FitnessCertificatePanelProps> = ({ certificates, trainsetNumber, compact = false }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return CheckCircle;
      case 'expiring_soon': return Clock;
      case 'expired': return XCircle;
      case 'suspended': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600 dark:text-green-400';
      case 'expiring_soon': return 'text-yellow-600 dark:text-yellow-400';
      case 'expired': return 'text-red-600 dark:text-red-400';
      case 'suspended': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'high': return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'low': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'rolling_stock': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'signalling': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'telecom': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHoursUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry.getTime() - now.getTime();
    return Math.round(diffMs / (1000 * 60 * 60));
  };

  const getOverallStatus = () => {
    const hasExpired = certificates.some(cert => cert.status === 'expired');
    const hasExpiringSoon = certificates.some(cert => cert.status === 'expiring_soon');
    const hasSuspended = certificates.some(cert => cert.status === 'suspended');
    
    if (hasExpired || hasSuspended) return 'critical';
    if (hasExpiringSoon) return 'warning';
    return 'good';
  };

  const overallStatus = getOverallStatus();

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Fitness Status</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            overallStatus === 'critical' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
            overallStatus === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
            'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
          }`}>
            {overallStatus === 'critical' ? 'Critical' : overallStatus === 'warning' ? 'Warning' : 'All Valid'}
          </div>
        </div>

        {/* Compact Certificate Grid */}
        <div className="grid grid-cols-3 gap-3">
          {certificates.map((certificate, index) => {
            const StatusIcon = getStatusIcon(certificate.status);
            const hoursUntilExpiry = getHoursUntilExpiry(certificate.expiryDate);

            return (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  certificate.status === 'expired' || certificate.status === 'suspended' 
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900' 
                    : certificate.status === 'expiring_soon' 
                    ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900'
                    : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900'
                }`}
              >
                {/* Department Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {certificate.department.replace('_', ' ')}
                  </span>
                  <div className="relative">
                    <StatusIcon className={`w-4 h-4 ${getStatusColor(certificate.status)}`} />
                    {certificate.status === 'expiring_soon' && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                    {certificate.status === 'expired' && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="text-center mb-2">
                  <span className={`text-xs font-bold ${getStatusColor(certificate.status)}`}>
                    {certificate.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Hours Left (if applicable) */}
                {hoursUntilExpiry > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        hoursUntilExpiry < 12 ? 'bg-red-500 animate-pulse' :
                        hoursUntilExpiry < 24 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <span className={`text-xs font-bold ${
                        hoursUntilExpiry < 12 ? 'text-red-600 dark:text-red-400' :
                        hoursUntilExpiry < 24 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {Math.round(hoursUntilExpiry)}h
                      </span>
                    </div>
                  </div>
                )}

                {/* Priority Badge */}
                <div className="mt-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(certificate.priority)}`}>
                    {certificate.priority}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Total: {certificates.length}</span>
            <span>Valid: {certificates.filter(c => c.status === 'valid').length}</span>
            <span>Issues: {certificates.filter(c => c.status !== 'valid').length}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Fitness Certificates - Train {trainsetNumber}
          </h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          overallStatus === 'critical' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
          overallStatus === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
          'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
        }`}>
          {overallStatus === 'critical' ? 'Critical' : overallStatus === 'warning' ? 'Warning' : 'All Valid'}
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((certificate, index) => {
          const StatusIcon = getStatusIcon(certificate.status);
          const hoursUntilExpiry = getHoursUntilExpiry(certificate.expiryDate);
          
          return (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Certificate Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(certificate.status)}`} />
                    {certificate.status === 'expiring_soon' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                    {certificate.status === 'expired' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {certificate.department.replace('_', ' ')}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(certificate.priority)}`}>
                  {certificate.priority}
                </span>
              </div>

              {/* Certificate Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Certificate:</span>
                  <span className="font-mono text-xs text-gray-900 dark:text-white">
                    {certificate.certificateNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-medium ${getStatusColor(certificate.status)}`}>
                    {certificate.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Valid Until:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(certificate.expiryDate)}
                  </span>
                </div>

                {hoursUntilExpiry > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Hours Left:</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        hoursUntilExpiry < 12 ? 'bg-red-500 animate-pulse' :
                        hoursUntilExpiry < 24 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <span className={`font-bold ${
                        hoursUntilExpiry < 12 ? 'text-red-600 dark:text-red-400' :
                        hoursUntilExpiry < 24 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {hoursUntilExpiry}h
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Issued By:</span>
                  <span className="text-gray-900 dark:text-white">
                    {certificate.issuedBy}
                  </span>
                </div>
              </div>

              {/* Conditions */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1 mb-2">
                  <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Conditions:</span>
                </div>
                <div className="space-y-1">
                  {certificate.conditions.slice(0, 3).map((condition, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>{condition}</span>
                    </div>
                  ))}
                  {certificate.conditions.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      +{certificate.conditions.length - 3} more conditions
                    </div>
                  )}
                </div>
              </div>

              {/* Department Badge */}
              <div className="mt-3 flex justify-end">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(certificate.department)}`}>
                  {certificate.department.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Certificate Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {certificates.filter(cert => cert.status === 'valid').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Valid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {certificates.filter(cert => cert.status === 'expiring_soon').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Expiring Soon</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {certificates.filter(cert => cert.status === 'expired').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Expired</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {certificates.filter(cert => cert.status === 'suspended').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Suspended</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessCertificatePanel;
