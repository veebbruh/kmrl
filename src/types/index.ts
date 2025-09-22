export interface Trainset {
  id: string;
  number: string;
  status: 'service' | 'standby' | 'maintenance' | 'cleaning' | 'inspection';
  location: string;
  nextLocation?: string;
  estimatedArrival?: string;
  mileage: number;
  lastMaintenance: string;
  nextMaintenance: string;
  fitnessExpiry: string;
  branding?: {
    advertiser: string;
    contractHours: number;
    completedHours: number;
  };
  currentIssues: Issue[];
  scheduledFor?: string;
  metroLine?: {
    lineName: string;
    lineNumber: string;
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    journeyDuration: string;
    majorStops: string[];
    coachTypes: string[];
    seatAvailability: {
      general: number;
      women: number;
      ac: number;
      total: number;
    };
    platform: string;
  };
}

export interface Issue {
  id: string;
  type: 'rolling_stock' | 'signaling' | 'telecom' | 'mechanical' | 'electrical';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  reportedAt: string;
  estimatedResolution: string;
  assignedTechnician?: string;
}

export interface MaintenanceSlot {
  id: string;
  bayNumber: number;
  startTime: string;
  endTime: string;
  type: 'inspection' | 'cleaning' | 'repair' | 'deep_maintenance';
  assignedTrainset?: string;
  technicians: string[];
}

export interface SchedulingConstraint {
  id: string;
  type: 'fitness_certificate' | 'job_card' | 'branding' | 'mileage' | 'maintenance';
  trainsetId: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  deadline?: string;
}

export interface OptimizationResult {
  schedule: {
    trainsetId: string;
    assignment: 'service' | 'standby' | 'maintenance';
    reasoning: string[];
    confidence: number;
    serviceReadiness?: number;
    overallScore?: number;
  }[];
  metrics: {
    serviceReadiness: number;
    maintenanceCompliance: number;
    brandingCompliance: number;
    mileageBalance: number;
    overallScore: number;
  };
  conflicts: {
    trainsetId: string;
    issue: string;
    severity: 'critical' | 'warning';
    resolution: string;
  }[];
  timestamp: string;
}