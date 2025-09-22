import React, { createContext, useContext, useState, useCallback } from 'react';
import { Trainset, OptimizationResult } from '../types';

interface OptimizationContextType {
  optimizationResult: OptimizationResult | null;
  setOptimizationResult: (result: OptimizationResult | null) => void;
  runOptimization: (trainsets: Trainset[]) => Promise<OptimizationResult>;
  resetOptimization: () => void;
  isOptimizing: boolean;
  getStatusCounts: () => Record<string, number>;
  getCriticalIssuesCount: () => number;
}

const OptimizationContext = createContext<OptimizationContextType | undefined>(undefined);

export const useOptimization = () => {
  const context = useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimization must be used within OptimizationProvider');
  }
  return context;
};

export const OptimizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const runOptimization = useCallback(async (trainsets: Trainset[]): Promise<OptimizationResult> => {
    setIsOptimizing(true);
    
    // Simulate AI optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create realistic optimization based on actual trainset data
    const result: OptimizationResult = {
      timestamp: new Date().toISOString(),
      schedule: trainsets.map((trainset, index) => {
        // Determine assignment based on trainset status and constraints
        let assignment: 'service' | 'standby' | 'maintenance' | 'cleaning' = 'standby';
        const reasoning: string[] = [];
        
        // Check fitness certificates
        const now = new Date();
        const expiredCerts = trainset.fitnessCertificates.filter(cert => cert.status === 'expired');
        const expiringSoonCerts = trainset.fitnessCertificates.filter(cert => cert.status === 'expiring_soon');
        const suspendedCerts = trainset.fitnessCertificates.filter(cert => cert.status === 'suspended');
        const validCerts = trainset.fitnessCertificates.filter(cert => cert.status === 'valid');
        
        if (expiredCerts.length > 0 || suspendedCerts.length > 0) {
          assignment = 'maintenance';
          if (expiredCerts.length > 0) {
            reasoning.push(`${expiredCerts.length} fitness certificate(s) expired`);
          }
          if (suspendedCerts.length > 0) {
            reasoning.push(`${suspendedCerts.length} fitness certificate(s) suspended`);
          }
        } else if (expiringSoonCerts.length > 0) {
          assignment = 'maintenance';
          reasoning.push(`${expiringSoonCerts.length} fitness certificate(s) expiring soon`);
        } else if (trainset.currentIssues.some(issue => issue.severity === 'critical')) {
          assignment = 'maintenance';
          reasoning.push('Critical issues require immediate attention');
        } else {
          // More balanced assignment logic
          const randomFactor = Math.random();
          const mileageFactor = trainset.mileage < 150000 ? 0.3 : 0.1; // Prefer lower mileage
          const issueFactor = trainset.currentIssues.length === 0 ? 0.4 : 0.1; // Prefer no issues
          const brandingFactor = trainset.branding && trainset.branding.completedHours < trainset.branding.contractHours ? 0.3 : 0;
          const fitnessFactor = validCerts.length === 3 ? 0.3 : 0.1; // Prefer all valid certificates
          
          const serviceScore = randomFactor + mileageFactor + issueFactor + brandingFactor + fitnessFactor;
          
          if (serviceScore > 0.7) {
            assignment = 'service';
            reasoning.push('Optimal for service based on multiple factors');
            if (trainset.mileage < 100000) reasoning.push('Low mileage - efficient operation');
            if (trainset.currentIssues.length === 0) reasoning.push('No current issues');
            if (validCerts.length === 3) reasoning.push('All fitness certificates valid');
            if (trainset.branding && trainset.branding.completedHours < trainset.branding.contractHours) {
              reasoning.push('Branding contract requirements');
            }
          } else if (serviceScore > 0.5) {
            assignment = 'cleaning';
            reasoning.push('Scheduled for deep cleaning and detailing');
            reasoning.push('Good condition - ready for service after cleaning');
            if (trainset.mileage > 100000) reasoning.push('Higher mileage - requires thorough cleaning');
            if (trainset.currentIssues.some(issue => issue.severity === 'low')) {
              reasoning.push('Minor issues will be addressed during cleaning');
            }
          } else if (serviceScore > 0.3) {
            assignment = 'standby';
            reasoning.push('Available for backup service');
            reasoning.push('Good condition but not optimal for primary service');
          } else {
            assignment = 'maintenance';
            reasoning.push('Scheduled for routine maintenance');
            reasoning.push('Optimizing fleet maintenance schedule');
          }
        }
        
        return {
          trainsetId: trainset.id,
          assignment,
          reasoning,
          confidence: 0.75 + Math.random() * 0.2 // 75-95% confidence
        };
      }),
      metrics: {
        serviceReadiness: 0,
        maintenanceCompliance: 0,
        brandingCompliance: 0,
        mileageBalance: 0,
        overallScore: 0
      },
      conflicts: []
    };

    // Calculate individual train-specific metrics
    const calculateTrainMetrics = (trainset: Trainset, assignment: string) => {
      const now = new Date();
      const nextMaintenance = new Date(trainset.nextMaintenance);
      
      // Check fitness certificate status
      const expiredCerts = trainset.fitnessCertificates.filter(cert => cert.status === 'expired');
      const expiringSoonCerts = trainset.fitnessCertificates.filter(cert => cert.status === 'expiring_soon');
      const suspendedCerts = trainset.fitnessCertificates.filter(cert => cert.status === 'suspended');
      const validCerts = trainset.fitnessCertificates.filter(cert => cert.status === 'valid');
      
      // Service Readiness Score (0-100)
      let serviceReadiness = 0;
      if (assignment === 'service') {
        // Base score for being assigned to service
        serviceReadiness = 60;
        
        // Fitness certificate scoring
        if (expiredCerts.length > 0 || suspendedCerts.length > 0) {
          serviceReadiness = 0; // Cannot be in service with expired/suspended certs
        } else if (expiringSoonCerts.length > 0) {
          serviceReadiness = 20; // Very low score for expiring certs
        } else if (validCerts.length === 3) {
          serviceReadiness += 25; // All certificates valid
        } else if (validCerts.length === 2) {
          serviceReadiness += 15; // Most certificates valid
        } else if (validCerts.length === 1) {
          serviceReadiness += 5; // Some certificates valid
        }
        
        // Add points for low mileage
        if (trainset.mileage < 50000) serviceReadiness += 15;
        else if (trainset.mileage < 100000) serviceReadiness += 10;
        
        // Add points for no critical issues
        const criticalIssues = trainset.currentIssues.filter(i => i.severity === 'critical').length;
        serviceReadiness += Math.max(0, 15 - (criticalIssues * 5));
        
        // Add points for branding compliance
        if (trainset.branding && trainset.branding.completedHours < trainset.branding.contractHours) {
          serviceReadiness += 5;
        }
      } else if (assignment === 'cleaning') {
        serviceReadiness = 50; // Good score for cleaning - ready for service after
        // Add points for fitness certificates
        if (validCerts.length === 3) serviceReadiness += 20;
        else if (validCerts.length === 2) serviceReadiness += 10;
        // Add points for low issues
        const totalIssues = trainset.currentIssues.length;
        serviceReadiness += Math.max(0, 10 - (totalIssues * 2));
      } else if (assignment === 'standby') {
        serviceReadiness = 40; // Lower score for standby
      } else {
        serviceReadiness = 20; // Lowest score for maintenance
      }
      
      // Overall Score (0-100) - weighted combination
      const maintenanceUrgency = (nextMaintenance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      
      let overallScore = serviceReadiness;
      
      // Adjust based on maintenance urgency
      if (maintenanceUrgency < 7) overallScore -= 20; // Maintenance due soon
      else if (maintenanceUrgency < 14) overallScore -= 10;
      
      // Adjust based on fitness certificates
      if (expiredCerts.length > 0 || suspendedCerts.length > 0) {
        overallScore -= 50; // Major penalty for expired/suspended certs
      } else if (expiringSoonCerts.length > 0) {
        overallScore -= 30; // Penalty for expiring certs
      } else if (validCerts.length < 3) {
        overallScore -= 15; // Penalty for incomplete certificates
      }
      
      // Adjust based on issues
      const totalIssues = trainset.currentIssues.length;
      overallScore -= totalIssues * 2;
      
      // Ensure scores are within bounds
      return {
        serviceReadiness: Math.max(0, Math.min(100, serviceReadiness)),
        overallScore: Math.max(0, Math.min(100, overallScore))
      };
    };
    
    // Calculate fleet-wide metrics
    const serviceCount = result.schedule.filter(s => s.assignment === 'service').length;
    const cleaningCount = result.schedule.filter(s => s.assignment === 'cleaning').length;
    const maintenanceCount = result.schedule.filter(s => s.assignment === 'maintenance').length;
    const standbyCount = result.schedule.filter(s => s.assignment === 'standby').length;
    
    result.metrics = {
      serviceReadiness: (serviceCount / trainsets.length) * 100,
      maintenanceCompliance: (maintenanceCount / trainsets.length) * 100,
      brandingCompliance: 92.4,
      mileageBalance: 89.6,
      overallScore: ((serviceCount * 0.4) + (cleaningCount * 0.3) + (standbyCount * 0.2) + (maintenanceCount * 0.1)) / trainsets.length * 100
    };
    
    // Add individual train metrics to each schedule item
    result.schedule = result.schedule.map(scheduleItem => {
      const trainset = trainsets.find(t => t.id === scheduleItem.trainsetId);
      if (trainset) {
        const trainMetrics = calculateTrainMetrics(trainset, scheduleItem.assignment);
        return {
          ...scheduleItem,
          serviceReadiness: trainMetrics.serviceReadiness,
          overallScore: trainMetrics.overallScore
        };
      }
      return scheduleItem;
    });

    // Identify conflicts
    result.conflicts = trainsets
      .filter(trainset => {
        const scheduleItem = result.schedule.find(s => s.trainsetId === trainset.id);
        const fitnessExpiry = new Date(trainset.fitnessExpiry);
        const now = new Date();
        const hoursUntilExpiry = (fitnessExpiry.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        return (scheduleItem?.assignment === 'service' && hoursUntilExpiry < 12) ||
               trainset.currentIssues.some(issue => issue.severity === 'critical');
      })
      .map(trainset => ({
        trainsetId: trainset.id,
        issue: trainset.currentIssues.some(issue => issue.severity === 'critical') 
          ? 'Critical maintenance issues detected'
          : 'Fitness certificate expires soon',
        severity: 'critical' as const,
        resolution: 'Schedule for immediate maintenance'
      }));

    setOptimizationResult(result);
    setIsOptimizing(false);
    return result;
  }, []);

  const getStatusCounts = useCallback(() => {
    if (!optimizationResult) return { service: 0, standby: 0, maintenance: 0 };
    
    return optimizationResult.schedule.reduce((acc, item) => {
      acc[item.assignment] = (acc[item.assignment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [optimizationResult]);

  const getCriticalIssuesCount = useCallback(() => {
    return optimizationResult?.conflicts.length || 0;
  }, [optimizationResult]);

  const resetOptimization = useCallback(() => {
    setOptimizationResult(null);
    setIsOptimizing(false);
  }, []);

  return (
    <OptimizationContext.Provider value={{
      optimizationResult,
      setOptimizationResult,
      runOptimization,
      resetOptimization,
      isOptimizing,
      getStatusCounts,
      getCriticalIssuesCount
    }}>
      {children}
    </OptimizationContext.Provider>
  );
};
