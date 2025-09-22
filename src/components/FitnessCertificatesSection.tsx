import React, { useState, useMemo, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, XCircle, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { motion } from 'framer-motion';
import { Trainset, FitnessCertificate } from '../types';
import FitnessCertificatePanel from './FitnessCertificatePanel';

interface FitnessCertificatesSectionProps {
  trainsets: Trainset[];
  selectedTrainsetId?: string | null;
}

const FitnessCertificatesSection: React.FC<FitnessCertificatesSectionProps> = ({ trainsets, selectedTrainsetId }) => {
  const [selectedTrainset, setSelectedTrainset] = useState<Trainset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'expiring_soon' | 'expired' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'train' | 'department' | 'expiry' | 'priority'>('train');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Auto-open modal when selectedTrainsetId is provided
  useEffect(() => {
    if (selectedTrainsetId) {
      const trainset = trainsets.find(t => t.id === selectedTrainsetId);
      if (trainset) {
        setSelectedTrainset(trainset);
      }
    }
  }, [selectedTrainsetId, trainsets]);

  // Get all certificates from all trainsets
  const allCertificates = useMemo(() => {
    return trainsets.flatMap(trainset => 
      trainset.fitnessCertificates.map(cert => ({
        ...cert,
        trainsetNumber: trainset.number,
        trainsetId: trainset.id
      }))
    );
  }, [trainsets]);

  // Filter and sort certificates
  const filteredCertificates = useMemo(() => {
    let filtered = allCertificates;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cert => 
        cert.trainsetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(cert => cert.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'train':
          comparison = a.trainsetNumber.localeCompare(b.trainsetNumber);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'expiry':
          comparison = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [allCertificates, searchTerm, filterStatus, sortBy, sortOrder]);

  // Group certificates by trainset
  const certificatesByTrain = useMemo(() => {
    const grouped: { [key: string]: FitnessCertificate[] } = {};
    trainsets.forEach(trainset => {
      grouped[trainset.number] = trainset.fitnessCertificates;
    });
    return grouped;
  }, [trainsets]);

  const getStatusCounts = () => {
    const counts = { valid: 0, expiring_soon: 0, expired: 0, suspended: 0 };
    allCertificates.forEach(cert => {
      counts[cert.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fitness Certificates</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage and monitor all train fitness certificates</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.valid}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Valid</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.expiring_soon}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.expired}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expired</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.suspended}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Suspended</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by train number, department, or certificate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="valid">Valid</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="train">Sort by Train</option>
              <option value="department">Sort by Department</option>
              <option value="expiry">Sort by Expiry</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Train Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.entries(certificatesByTrain).map(([trainNumber, certificates], index) => {
          const expiredCerts = certificates.filter(cert => cert.status === 'expired');
          const expiringSoonCerts = certificates.filter(cert => cert.status === 'expiring_soon');
          const suspendedCerts = certificates.filter(cert => cert.status === 'suspended');
          
          return (
            <motion.div
              key={trainNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedTrainset(trainsets.find(t => t.number === trainNumber) || null)}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Train {trainNumber}</h3>
                <div className="flex items-center space-x-1">
                  {expiredCerts.length > 0 || suspendedCerts.length > 0 ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : expiringSoonCerts.length > 0 ? (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {certificates.map((cert, certIndex) => (
                  <div key={cert.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {cert.department.replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        cert.status === 'valid' ? 'bg-green-500' :
                        cert.status === 'expiring_soon' ? 'bg-yellow-500' :
                        cert.status === 'expired' ? 'bg-red-500' :
                        'bg-orange-500'
                      }`}></div>
                      <span className={`text-xs font-medium ${
                        cert.status === 'valid' ? 'text-green-600 dark:text-green-400' :
                        cert.status === 'expiring_soon' ? 'text-yellow-600 dark:text-yellow-400' :
                        cert.status === 'expired' ? 'text-red-600 dark:text-red-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`}>
                        {cert.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed View Modal */}
      {selectedTrainset && (
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Train {selectedTrainset.number} - Fitness Certificates
                </h3>
                <button
                  onClick={() => setSelectedTrainset(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <FitnessCertificatePanel 
                certificates={selectedTrainset.fitnessCertificates} 
                trainsetNumber={selectedTrainset.number} 
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FitnessCertificatesSection;
