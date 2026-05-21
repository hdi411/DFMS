export const drones = [
  { id: 'DRN-01', model: 'WindHawk X4', location: 'Farm Alpha · T-7',  battery: 87, altitude: 340, speed: 28, lastInspection: '15 May 2026', status: 'inflight' },
  { id: 'DRN-02', model: 'WindHawk X4', location: 'Farm Alpha · T-12', battery: 62, altitude: 280, speed: 24, lastInspection: '15 May 2026', status: 'inflight' },
  { id: 'DRN-03', model: 'TechBird Pro', location: 'Base Station',      battery: 100, altitude: 0, speed: 0,  lastInspection: '14 May 2026', status: 'ready' },
  { id: 'DRN-04', model: 'WindHawk X4', location: 'Farm Beta · T-17',  battery: 41, altitude: 190, speed: 0,  lastInspection: '13 May 2026', status: 'critical' },
  { id: 'DRN-05', model: 'TechBird Pro', location: 'Hangar B',          battery: 20, altitude: 0,   speed: 0,  lastInspection: '10 May 2026', status: 'maintenance' },
  { id: 'DRN-06', model: 'WindHawk X5', location: 'Base Station',       battery: 95, altitude: 0,   speed: 0,  lastInspection: '12 May 2026', status: 'ready' },
  { id: 'DRN-07', model: 'WindHawk X5', location: 'Base Station',       battery: 78, altitude: 0,   speed: 0,  lastInspection: '11 May 2026', status: 'ready' },
  { id: 'DRN-08', model: 'TechBird Pro', location: 'Hangar A',          battery: 55, altitude: 0,   speed: 0,  lastInspection: '9 May 2026',  status: 'preflight' },
]

export const telemetry = {
  'DRN-01': { battery: 87, altitude: 340, speed: 28, temp: 42, gps: '52.31°N 4.91°E', signal: 'Strong', flightTime: '1h 23m', camera: '4K Active',  missionId: 'MSN-0041', missionStatus: 'In Progress', missionProg: 67, missionDetail: 'Inspected: T-7, T-9, T-11, T-12 (4 of 6) · ETA ~45 min' },
  'DRN-02': { battery: 62, altitude: 280, speed: 24, temp: 38, gps: '52.32°N 4.88°E', signal: 'Strong', flightTime: '0h 58m', camera: '4K Active',  missionId: 'MSN-0041', missionStatus: 'In Progress', missionProg: 45, missionDetail: 'Inspected: T-12 (1 of 2 assigned) · ETA ~30 min' },
  'DRN-04': { battery: 41, altitude: 190, speed: 0,  temp: null, gps: '52.28°N 5.02°E', signal: 'Lost', flightTime: '2h 01m', camera: 'Unknown',    missionId: 'MSN-0040', missionStatus: 'Conn. Loss',  missionProg: 23, missionDetail: 'Last known: T-17 · Signal lost 14:32 UTC · Auto-return initiated' },
  'DRN-06': { battery: 95, altitude: 0,   speed: 0,  temp: null, gps: '52.30°N 4.95°E', signal: 'Strong', flightTime: '—',    camera: 'Standby',    missionId: '—',        missionStatus: 'Ready',       missionProg: 0,  missionDetail: 'Pre-flight check in progress · T. Nguyen assigned' },
}