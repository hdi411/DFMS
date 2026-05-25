import { useApp } from '../context/AppContext'

function BatteryBar({ pct }) {
  const color = pct > 60 ? 'var(--acc)' : pct > 35 ? 'var(--warn)' : 'var(--danger)'
  return (
    <div className="bat-wrap">
      <div className="bat-bar">
        <div className="bat-fill" style={{ width: pct + '%', background: color }} />
      </div>
      {pct}%
    </div>
  )
}

function StatusPill({ status }) {
  const map = {
    inflight:    { cls: 'pill-inflight',    label: '✈ In Flight' },
    ready:       { cls: 'pill-ready',       label: '● Ready' },
    maintenance: { cls: 'pill-maintenance', label: '🔧 Maintenance' },
    critical:    { cls: 'pill-critical',    label: '⚠ Conn. Loss' },
    preflight:   { cls: 'pill-preflight',   label: '🔍 Pre-flight' },
  }
  const s = map[status] || map.ready
  return <span className={`pill ${s.cls}`}>{s.label}</span>
}

export default function DroneFleet({ onOverride, showToast }) {
  const { drones, dispatchDrone, recallDrone } = useApp()

  function handleAction(drone) {
    if (drone.status === 'inflight') {
      recallDrone(drone.id)
      showToast(`${drone.id} recall command sent — returning to base`)
    }
    if (drone.status === 'ready') {
      dispatchDrone(drone.id, 'Farm Alpha · T-1')
      showToast(`${drone.id} dispatched to Farm Alpha`)
    }
    if (drone.status === 'critical')    onOverride()
    if (drone.status === 'maintenance') showToast(`${drone.id} maintenance log opened`)
    if (drone.status === 'preflight')   showToast(`${drone.id} pre-flight checklist opened`)
  }

  function actionLabel(status) {
    if (status === 'inflight')    return 'Recall'
    if (status === 'ready')       return 'Dispatch'
    if (status === 'critical')    return 'Override'
    if (status === 'maintenance') return 'View Log'
    if (status === 'preflight')   return 'View Check'
    return 'View'
  }

  function actionClass(status) {
    if (status === 'ready')    return 'btn btn-primary btn-sm'
    if (status === 'critical') return 'btn btn-danger btn-sm'
    return 'btn btn-sm'
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🚁 Drone Fleet</div>
          <div className="page-subtitle">
            {drones.length} drones registered · availability, health &amp; certification
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => showToast('Add drone form opened')}>
          + Add Drone
        </button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Drone ID</th>
              <th>Model</th>
              <th>Location</th>
              <th>Battery</th>
              <th>Altitude</th>
              <th>Speed</th>
              <th>Last Inspection</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drones.map(d => (
              <tr key={d.id}>
                <td><strong>{d.id}</strong></td>
                <td>{d.model}</td>
                <td>{d.location}</td>
                <td>
                  {d.status !== 'maintenance'
                    ? <BatteryBar pct={d.battery} />
                    : '—'}
                </td>
                <td>{d.altitude > 0 ? d.altitude + 'm' : '—'}</td>
                <td>{d.speed > 0 ? d.speed + ' km/h' : '—'}</td>
                <td>{d.lastInspection}</td>
                <td><StatusPill status={d.status} /></td>
                <td>
                  <button
                    className={actionClass(d.status)}
                    onClick={() => handleAction(d)}
                  >
                    {actionLabel(d.status)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
