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

export default function Dashboard({ user, onNavigate, onOverride }) {
  const { drones, alerts, logs } = useApp()
  const isMgr = user.role === 'manager'

  const inFlight = drones.filter(d => d.status === 'inflight').length
  const active   = drones.filter(d => d.status !== 'maintenance').length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">
            {isMgr ? 'Operations Dashboard' : 'Technician Dashboard'}
          </div>
          <div className="page-subtitle">
            <span className="live-dot" /> Live data · WindTech Fleet Overview
          </div>
        </div>
        {isMgr && (
          <button className="btn btn-danger" onClick={onOverride}>
            ⚠️ Emergency Override
          </button>
        )}
      </div>

      {/* METRICS */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">🚁 Active Drones</div>
          <div className="metric-value good">{active}</div>
          <div className="metric-delta">of {drones.length} in fleet</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">✈️ In Flight</div>
          <div className="metric-value good">{inFlight}</div>
          <div className="metric-delta">across wind farms</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">🔔 Active Alerts</div>
          <div className={`metric-value ${alerts.length > 0 ? 'bad' : 'good'}`}>
            {alerts.length}
          </div>
          <div className="metric-delta">
            {alerts.length > 0 ? `${alerts.filter(a => a.type === 'critical').length} critical` : 'All clear'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">✅ Tasks Today</div>
          <div className="metric-value">7/12</div>
          <div className="metric-delta">58% complete</div>
        </div>
      </div>

      <div className="two-col">
        {/* FLEET */}
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Fleet Status</div>
              <button className="btn btn-sm" onClick={() => onNavigate('drones')}>
                View all →
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr><th>Drone ID</th><th>Location</th><th>Battery</th><th>Status</th></tr>
              </thead>
              <tbody>
                {drones.slice(0, 6).map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.id}</strong></td>
                    <td>{d.location}</td>
                    <td>{d.status !== 'maintenance' ? <BatteryBar pct={d.battery} /> : '—'}</td>
                    <td><StatusPill status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ALERTS + LOGS */}
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">🔔 Active Alerts</div>
              <button className="btn btn-sm" onClick={() => onNavigate('alerts')}>
                View all →
              </button>
            </div>
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)', fontSize: 12 }}>
                ✅ No active alerts
              </div>
            ) : (
              alerts.slice(0, 3).map(a => (
                <div key={a.id} className={`alert-card alert-${a.type}`}>
                  <div className="alert-title">
                    <span style={{ color: a.type === 'critical' ? '#A32D2D' : '#633806' }}>
                      {a.title}
                    </span>
                    {isMgr && a.type === 'critical' && (
                      <button className="btn btn-danger btn-sm" onClick={onOverride}>Override</button>
                    )}
                  </div>
                  <div className="alert-body" style={{ color: a.type === 'critical' ? '#791F1F' : '#412402' }}>
                    {a.body}
                  </div>
                  <div className="alert-time">{a.time}</div>
                </div>
              ))
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Recent Log</div>
              <button className="btn btn-sm" onClick={() => onNavigate('logs')}>Full log →</button>
            </div>
            {logs.slice(0, 5).map((log, i) => (
              <div className="log-entry" key={i}>
                <div className="log-time">{log.time}</div>
                <div className={`log-level ${log.level}`}>{log.level}</div>
                <div className="log-message">{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}