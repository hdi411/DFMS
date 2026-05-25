import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function useApp() {
  return useContext(AppContext)
}

const INITIAL_DRONES = [
  { id: 'DRN-01', model: 'WindHawk X4',  location: 'Farm Alpha · T-7',  battery: 87, altitude: 340, speed: 28, lastInspection: '15 May 2026', status: 'inflight' },
  { id: 'DRN-02', model: 'WindHawk X4',  location: 'Farm Alpha · T-12', battery: 62, altitude: 280, speed: 24, lastInspection: '15 May 2026', status: 'inflight' },
  { id: 'DRN-03', model: 'TechBird Pro', location: 'Base Station',       battery: 100, altitude: 0, speed: 0,  lastInspection: '14 May 2026', status: 'ready' },
  { id: 'DRN-04', model: 'WindHawk X4',  location: 'Farm Beta · T-17',  battery: 41, altitude: 190, speed: 0,  lastInspection: '13 May 2026', status: 'critical' },
  { id: 'DRN-05', model: 'TechBird Pro', location: 'Hangar B',           battery: 20, altitude: 0,  speed: 0,  lastInspection: '10 May 2026', status: 'maintenance' },
  { id: 'DRN-06', model: 'WindHawk X5',  location: 'Base Station',       battery: 95, altitude: 0,  speed: 0,  lastInspection: '12 May 2026', status: 'ready' },
  { id: 'DRN-07', model: 'WindHawk X5',  location: 'Base Station',       battery: 78, altitude: 0,  speed: 0,  lastInspection: '11 May 2026', status: 'ready' },
  { id: 'DRN-08', model: 'TechBird Pro', location: 'Hangar A',           battery: 55, altitude: 0,  speed: 0,  lastInspection: '9 May 2026',  status: 'preflight' },
]

const INITIAL_ALERTS = [
  { id: 1, type: 'critical', title: '🔴 CRITICAL — DRN-04 Connectivity Loss', body: 'Drone DRN-04 lost telemetry signal 4 minutes ago at Farm Beta T-17 · last known altitude 190m · battery 41% · auto-return protocol initiated', time: '14:32:07 UTC' },
  { id: 2, type: 'warn',     title: '🟡 WARNING — DRN-04 Low Battery (41%)',  body: 'Battery at 41% — return-to-base threshold is 35%. Recommend immediate recall or override for recovery mission.', time: '14:29:14 UTC' },
  { id: 3, type: 'warn',     title: '🟡 WARNING — Wind Speed Farm Beta (38 km/h)', body: 'Wind speed 38 km/h approaching operational limit of 45 km/h. New dispatches to Farm Beta suspended.', time: '14:21:52 UTC' },
]

const INITIAL_LOGS = [
  { time: '14:32:07', level: 'ERROR', message: 'DRN-04 telemetry signal lost · Farm Beta T-17 · alt 190m' },
  { time: '14:29:14', level: 'WARN',  message: 'DRN-04 battery warning 41% · return-to-base threshold 35%' },
  { time: '14:21:52', level: 'WARN',  message: 'Wind speed alert Farm Beta · 38 km/h · ops limit 45 km/h' },
  { time: '14:18:33', level: 'INFO',  message: 'DRN-06 pre-flight check initiated · technician: T. Nguyen' },
  { time: '14:10:02', level: 'OK',    message: 'DRN-01 checkpoint T-11 complete · MSN-0041 67% progress' },
  { time: '14:02:45', level: 'INFO',  message: 'DRN-02 dispatched · Farm Alpha T-12 · cert verified' },
  { time: '13:55:18', level: 'OK',    message: 'Weather check passed Farm Alpha · 22 km/h · clear for dispatch' },
  { time: '13:48:01', level: 'OK',    message: 'DRN-03 battery fully charged · 100% · ready for dispatch' },
  { time: '13:41:29', level: 'INFO',  message: 'J. Smith authenticated · Operations Manager · MFA verified' },
  { time: '13:35:10', level: 'OK',    message: 'MSN-0041 initiated · DRN-01, DRN-02 dispatched · Farm Alpha' },
]

const INITIAL_QUEUE = [
  { id: 'MQ-001', priority: 1, severity: 'critical', turbine: 'T-11', farm: 'Farm Alpha', issue: 'Gearbox Vibration Anomaly + Oil Leak',       assignedTo: null,       estimatedTime: '8-12 hours', requiredCert: 'Gearbox Specialist',       parts: ['Gearbox seal kit', 'Oil filter', 'Vibration damper'],          notes: 'URGENT — Immediate shutdown required. Gearbox failure risk detected at 97% confidence.' },
  { id: 'MQ-002', priority: 2, severity: 'critical', turbine: 'T-7',  farm: 'Farm Alpha', issue: 'Blade Surface Crack — Blade A',              assignedTo: 'A. Bakker', estimatedTime: '4-6 hours',  requiredCert: 'WindHawk X4 Blade Repair', parts: ['Composite patch kit', 'Epoxy resin', 'Surface sealant'],        notes: 'Critical crack at 60% span. Specialist repair team required.' },
  { id: 'MQ-003', priority: 3, severity: 'high',     turbine: 'T-9',  farm: 'Farm Alpha', issue: 'Bolt Loosening — Flange Joint Section 2',    assignedTo: null,       estimatedTime: '2-3 hours',  requiredCert: 'WindHawk X4 / X5',         parts: ['M36 bolts x8', 'Torque wrench', 'Thread locker'],              notes: 'Schedule within 2 weeks. Monitor bolt tension.' },
  { id: 'MQ-004', priority: 4, severity: 'high',     turbine: 'T-7',  farm: 'Farm Alpha', issue: 'Leading Edge Erosion — Blade B Tip',         assignedTo: null,       estimatedTime: '3-4 hours',  requiredCert: 'WindHawk X4 Blade Repair', parts: ['Leading edge tape', 'Erosion shield', 'Surface primer'],        notes: 'Can be addressed during T-7 blade crack repair visit.' },
  { id: 'MQ-005', priority: 5, severity: 'high',     turbine: 'T-11', farm: 'Farm Alpha', issue: 'Generator Overheating Signature',             assignedTo: null,       estimatedTime: '2-3 hours',  requiredCert: 'Electrical Systems',       parts: ['Cooling fan unit', 'Thermal paste', 'Temperature sensor'],     notes: 'Address during MQ-001 gearbox repair visit.' },
  { id: 'MQ-006', priority: 6, severity: 'medium',   turbine: 'T-9',  farm: 'Farm Alpha', issue: 'Tower Corrosion — North Face Base',          assignedTo: null,       estimatedTime: '1-2 hours',  requiredCert: 'WindHawk X4 / X5',         parts: ['Anti-corrosion coating', 'Wire brush', 'Primer spray'],        notes: 'Non-urgent. Schedule with next routine maintenance visit.' },
  { id: 'MQ-007', priority: 7, severity: 'medium',   turbine: 'T-7',  farm: 'Farm Alpha', issue: 'Surface Coating Wear — Blade C Root',        assignedTo: null,       estimatedTime: '1-2 hours',  requiredCert: 'WindHawk X4 / X5',         parts: ['UV-resistant coating', 'Applicator brush'],                    notes: 'Low urgency. Can be combined with T-7 blade repair visit.' },
  { id: 'MQ-008', priority: 8, severity: 'low',      turbine: 'T-12', farm: 'Farm Alpha', issue: 'Minor Dirt Accumulation — Blade A Surface',  assignedTo: null,       estimatedTime: '0.5 hours',  requiredCert: 'WindHawk X4 / X5',         parts: ['Cleaning solution', 'Soft brush'],                             notes: 'Routine cleaning. Schedule next cycle.' },
]

function timestamp() {
  return new Date().toTimeString().slice(0, 8)
}

export function AppProvider({ children }) {
  const [drones, setDrones]   = useState(INITIAL_DRONES)
  const [alerts, setAlerts]   = useState(INITIAL_ALERTS)
  const [logs, setLogs]       = useState(INITIAL_LOGS)
  const [queue, setQueue]     = useState(INITIAL_QUEUE)

  // ── LOGS ──
  function addLog(level, message) {
    setLogs(prev => [{ time: timestamp(), level, message }, ...prev])
  }

  // ── DRONES ──
  function dispatchDrone(id, location) {
    setDrones(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'inflight', location, altitude: 280, speed: 24 } : d
    ))
    addLog('OK', `${id} dispatched · ${location} · cert verified`)
  }

  function recallDrone(id) {
    setDrones(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'ready', location: 'Base Station', altitude: 0, speed: 0 } : d
    ))
    addLog('INFO', `${id} recall command sent · returning to base`)
  }

  function updateDroneBattery() {
    setDrones(prev => prev.map(d => {
      if (d.status === 'inflight')  return { ...d, battery: Math.max(10, d.battery - 1) }
      if (d.status === 'ready')     return { ...d, battery: Math.min(100, d.battery + 2) }
      return d
    }))
  }

  // ── ALERTS ──
  function acknowledgeAlert(id) {
    setAlerts(prev => prev.filter(a => a.id !== id))
    addLog('OK', `Alert #${id} acknowledged`)
  }

  function acknowledgeAllAlerts() {
    setAlerts([])
    addLog('OK', 'All alerts acknowledged by operator')
  }

  function addAlert(type, title, body) {
    const id = Date.now()
    setAlerts(prev => [{ id, type, title, body, time: timestamp() + ' UTC' }, ...prev])
  }

  // ── MAINTENANCE QUEUE ──
  function assignQueue(id, techName) {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, assignedTo: techName } : q))
    const item = queue.find(q => q.id === id)
    addLog('INFO', `${id} assigned to ${techName} · ${item?.turbine} · ${item?.issue}`)
  }

  function completeQueue(id) {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q))
    const item = queue.find(q => q.id === id)
    addLog('OK', `${id} marked complete · ${item?.turbine} · ${item?.issue}`)
  }

  // ── OVERRIDE ──
  function confirmOverride(drone, reason, note, authoriser) {
    addLog('WARN', `OVERRIDE by ${authoriser} · ${drone} · ${reason} · "${note}"`)
    addAlert('warn', `🟡 OVERRIDE — ${drone}`, `Manual override by ${authoriser}: ${reason}`)
    dispatchDrone(drone.split(' ')[0], 'Farm Beta · T-17 (recovery)')
  }

  return (
    <AppContext.Provider value={{
      drones, alerts, logs, queue,
      dispatchDrone, recallDrone, updateDroneBattery,
      acknowledgeAlert, acknowledgeAllAlerts, addAlert,
      assignQueue, completeQueue,
      confirmOverride,
      addLog,
    }}>
      {children}
    </AppContext.Provider>
  )
}