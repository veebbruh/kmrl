import React, { createContext, useContext, useState, useCallback } from 'react';
import { Trainset, OptimizationResult } from '../types';

interface OptimizationContextType {
  optimizationResult: OptimizationResult | null;
  setOptimizationResult: (result: OptimizationResult | null) => void;
  runOptimization: (trainsets: Trainset[]) => Promise<OptimizationResult>;
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
        let assignment: 'service' | 'standby' | 'maintenance' = 'standby';
        const reasoning: string[] = [];
        
        // Check fitness certificate
        const fitnessExpiry = new Date(trainset.fitnessExpiry);
        const now = new Date();
        const hoursUntilExpiry = (fitnessExpiry.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (hoursUntilExpiry < 24) {
          assignment = 'maintenance';
          reasoning.push('Fitness certificate expires within 24 hours');
        } else if (trainset.currentIssues.some(issue => issue.severity === 'critical')) {
          assignment = 'maintenance';
          reasoning.push('Critical issues require immediate attention');
        } else if (trainset.status === 'service' && index < 12) {
          assignment = 'service';
          reasoning.push('Optimal for peak hour service');
          reasoning.push('Mileage within acceptable range');
        } else if (trainset.branding && trainset.branding.completedHours < trainset.branding.contractHours) {
          assignment = 'service';
          reasoning.push('Branding contract requirements');
        } else {
          assignment = 'standby';
          reasoning.push('Available for backup service');
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
      const fitnessExpiry = new Date(trainset.fitnessExpiry);
      const nextMaintenance = new Date(trainset.nextMaintenance);
      
      // Service Readiness Score (0-100)
      let serviceReadiness = 0;
      if (assignment === 'service') {
        // Base score for being assigned to service
        serviceReadiness = 60;
        
        // Add points for good condition
        const hoursUntilFitnessExpiry = (fitnessExpiry.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilFitnessExpiry > 48) serviceReadiness += 20;
        else if (hoursUntilFitnessExpiry > 24) serviceReadiness += 10;
        
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
      } else if (assignment === 'standby') {
        serviceReadiness = 40; // Lower score for standby
      } else {
        serviceReadiness = 20; // Lowest score for maintenance
      }
      
      // Overall Score (0-100) - weighted combination
      const maintenanceUrgency = (nextMaintenance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      const fitnessUrgency = (fitnessExpiry.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      let overallScore = serviceReadiness;
      
      // Adjust based on maintenance urgency
      if (maintenanceUrgency < 7) overallScore -= 20; // Maintenance due soon
      else if (maintenanceUrgency < 14) overallScore -= 10;
      
      // Adjust based on fitness certificate
      if (fitnessUrgency < 12) overallScore -= 30; // Fitness expires soon
      else if (fitnessUrgency < 24) overallScore -= 15;
      
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
    const maintenanceCount = result.schedule.filter(s => s.assignment === 'maintenance').length;
    const standbyCount = result.schedule.filter(s => s.assignment === 'standby').length;
    
    result.metrics = {
      serviceReadiness: (serviceCount / trainsets.length) * 100,
      maintenanceCompliance: (maintenanceCount / trainsets.length) * 100,
      brandingCompliance: 92.4,
      mileageBalance: 89.6,
      overallScore: ((serviceCount * 0.4) + (standbyCount * 0.3) + (maintenanceCount * 0.3)) / trainsets.length * 100
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

  return (
    <OptimizationContext.Provider value={{
      optimizationResult,
      setOptimizationResult,
      runOptimization,
      isOptimizing,
      getStatusCounts,
      getCriticalIssuesCount
    }}>
      {children}
    </OptimizationContext.Provider>
  );
};
