import { Trainset, Issue } from '../types';

export const mockTrainsets: Trainset[] = Array.from({ length: 25 }, (_, index) => {
  const number = String(index + 1).padStart(3, '0');
  const statuses = ['service', 'standby', 'maintenance', 'cleaning', 'inspection'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const stations = [
    'Aluva', 'Pulinchodu', 'Companypady', 'Ambattukavu', 'Muttom', 'Kalamassery',
    'Cusat', 'Pathadipalam', 'Edapally', 'Changampuzha Park', 'Palarivattom',
    'JLN Stadium', 'Kaloor', 'Town Hall', 'MG Road', 'Maharajas', 'Ernakulam South',
    'Kadavanthra', 'Elamkulam', 'Vyttila', 'Thaikoodam', 'Petta', 'Vytilla Hub'
  ];

  // Blue Line metro information
  const blueLineInfo = {
    lineName: 'Blue Line',
    lineNumber: 'BL-01',
    source: 'Aluva',
    destination: 'Kochi Metro',
    departureTime: '06:00',
    arrivalTime: '07:15',
    journeyDuration: '1h 15m',
    majorStops: ['Aluva', 'Kalamassery', 'Edapally', 'Kaloor', 'MG Road', 'Kochi Metro'],
    coachTypes: ['General', 'Women', 'AC'],
    seatAvailability: {
      general: 45,
      women: 12,
      ac: 8,
      total: 65
    },
    platform: 'Platform 1'
  };
  
  const currentLocation = stations[Math.floor(Math.random() * stations.length)];
  const currentIndex = stations.indexOf(currentLocation);
  
  // For trains in service, determine next location and arrival time
  let nextLocation: string | undefined;
  let estimatedArrival: string | undefined;
  
  if (status === 'service') {
    // Randomly choose direction (up or down the line)
    const direction = Math.random() > 0.5 ? 1 : -1;
    const nextIndex = currentIndex + direction;
    
    if (nextIndex >= 0 && nextIndex < stations.length) {
      nextLocation = stations[nextIndex];
      // Estimate arrival time (2-4 minutes from now)
      const arrivalTime = new Date(Date.now() + (2 + Math.random() * 2) * 60000);
      estimatedArrival = arrivalTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  }
  
  const issueTypes = ['rolling_stock', 'signaling', 'telecom', 'mechanical', 'electrical'] as const;
  const severities = ['critical', 'high', 'medium', 'low'] as const;
  const technicians = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Nair', 'Vikram Singh'];
  
  const issueDescriptions = {
    rolling_stock: [
      'Brake system malfunction detected',
      'Door mechanism requires calibration',
      'Air conditioning unit not functioning',
      'Seat adjustment mechanism faulty',
      'Emergency brake system needs inspection'
    ],
    signaling: [
      'Communication system intermittent failure',
      'GPS tracking system offline',
      'Signal reception issues detected',
      'Emergency communication system test required',
      'Radio frequency interference detected'
    ],
    telecom: [
      'WiFi connectivity issues reported',
      'Passenger information display malfunction',
      'Intercom system not responding',
      'CCTV camera system offline',
      'Network connectivity problems'
    ],
    mechanical: [
      'Engine performance degradation',
      'Transmission system requires maintenance',
      'Hydraulic system pressure low',
      'Wheel alignment issues detected',
      'Suspension system needs adjustment'
    ],
    electrical: [
      'Power supply fluctuation detected',
      'Lighting system partial failure',
      'Battery backup system needs replacement',
      'Electrical panel requires inspection',
      'Voltage regulator malfunction'
    ]
  };

  const issues: Issue[] = Math.random() > 0.6 ? [
    {
      id: `issue-${index}`,
      type: issueTypes[Math.floor(Math.random() * issueTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: issueDescriptions[issueTypes[Math.floor(Math.random() * issueTypes.length)]][Math.floor(Math.random() * 5)],
      reportedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      estimatedResolution: new Date(Date.now() + Math.random() * 86400000).toISOString(),
      assignedTechnician: Math.random() > 0.3 ? technicians[Math.floor(Math.random() * technicians.length)] : undefined,
    }
  ] : [];

  return {
    id: `train-${index + 1}`,
    number,
    status: status as any,
    location: currentLocation,
    nextLocation,
    estimatedArrival,
    mileage: Math.floor(50000 + Math.random() * 200000),
    lastMaintenance: new Date(Date.now() - Math.random() * 2592000000).toISOString().split('T')[0],
    nextMaintenance: new Date(Date.now() + Math.random() * 2592000000).toISOString().split('T')[0],
    fitnessExpiry: new Date(Date.now() + Math.random() * 86400000 * 30).toISOString().split('T')[0],
    branding: Math.random() > 0.6 ? {
      advertiser: ['Coca-Cola', 'Samsung', 'Reliance', 'BSNL', 'Kerala Tourism'][Math.floor(Math.random() * 5)],
      contractHours: Math.floor(100 + Math.random() * 500),
      completedHours: Math.floor(Math.random() * 600),
    } : undefined,
    currentIssues: issues,
    metroLine: blueLineInfo,
  };
});