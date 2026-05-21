export const sprints = {
  s1: {
    label: 'Sprint 1',
    points: 29,
    items: [
      { id: 'IN-6',  name: 'Drone Availability Matching',              epic: 1, pts: 5 },
      { id: 'IN-7',  name: 'Rapid Response Dispatch',                  epic: 1, pts: 3 },
      { id: 'IN-8',  name: 'Live Drone Telemetry Dashboard',           epic: 2, pts: 8 },
      { id: 'IN-9',  name: 'Ground Crew and Drone Conflict Prevention', epic: 1, pts: 5 },
      { id: 'IN-10', name: 'Fast Pre-flight Safety Check',             epic: 3, pts: 3 },
      { id: 'IN-15', name: 'Weather-Based Dispatch Validation',        epic: 1, pts: 3 },
      { id: 'IN-16', name: 'Technician Certification Verification',    epic: 3, pts: 2 },
    ]
  },
  s2: {
    label: 'Sprint 2',
    points: 30,
    items: [
      { id: 'IN-13', name: 'Automated Inspection Reporting',    epic: 2, pts: 5 },
      { id: 'IN-20', name: 'Battery Health Monitoring',         epic: 2, pts: 2 },
      { id: 'IN-21', name: 'Mission Failure Alert System',      epic: 2, pts: 5 },
      { id: 'IN-22', name: 'Connectivity Loss Detection',       epic: 2, pts: 5 },
      { id: 'IN-23', name: 'Maintenance Task Queue Dashboard',  epic: 2, pts: 5 },
      { id: 'IN-24', name: 'Emergency Manual Dispatch Override', epic: 1, pts: 3 },
      { id: 'IN-27', name: 'Role-Based Access Control',         epic: 3, pts: 5 },
    ]
  },
  s3: {
    label: 'Sprint 3',
    points: 30,
    items: [
      { id: 'IN-11', name: 'Environmental Compliance Management', epic: 3, pts: 5 },
      { id: 'IN-12', name: 'Predictive Maintenance Alerts',       epic: 2, pts: 8 },
      { id: 'IN-14', name: 'Drone Recalling in Turbulent Weather', epic: 2, pts: 5 },
      { id: 'IN-17', name: 'Flight Log Compliance Export',        epic: 3, pts: 5 },
      { id: 'IN-18', name: 'Inventory Availability Verification', epic: 3, pts: 2 },
      { id: 'IN-19', name: 'Vendor API Failure Alert System',     epic: 3, pts: 5 },
    ]
  },
  backlog: {
    label: 'Backlog',
    points: 20,
    items: [
      { id: 'IN-25', name: 'Multi-Drone Scheduling Coordination', epic: 1, pts: 7 },
      { id: 'IN-26', name: 'Dispatch Queue Prioritization',       epic: 1, pts: 3 },
      { id: 'IN-28', name: 'Drone Operator Training Portal',      epic: 3, pts: 3 },
      { id: 'IN-29', name: 'Automated System Backup Recovery',    epic: 3, pts: 7 },
    ]
  }
}

export const epicNames = {
  1: 'EPIC 1: AUTOMATED DISPATCH',
  2: 'EPIC 2: REAL-TIME MONITORING',
  3: 'EPIC 3: INTEGRATION',
}

export const epicColors = {
  1: { bg: '#E1F5EE', color: '#085041' },
  2: { bg: '#E6F1FB', color: '#0C447C' },
  3: { bg: '#EAF3DE', color: '#3B6D11' },
}