import { drones } from '../data/drones'
import { systemLogs } from '../data/logs'

export default function Dashboard({ user, onNavigate, onOverride, alertCount }) {
  const isMgr = user.role === 'manager'

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
          <div className="btn-row">
            <button className="btn btn-danger" onClick={onOverride}>
              ⚠️ Emergency Override
            </button>
          </div>
        )}
      </div>

      {/* METRICS */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">🚁 Active Drones</div>
          <div className="metric-value good">6</div>
          <div className="metric-delta">of 8 in fleet</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">✈️ In Flight</div>
          <div className="metric-value good">3</div>
          <div className="metric-delta">across 2 wind farms</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">🔔 Active Alerts</div>
          <div className={`metric-value ${alertCount > 0 ? 'bad' : 'good'}`}>{alertCount}</div>
          <div className="metric-delta">{alertCount > 0 ? '1 critical' : 'All clear'}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">✅ Tasks Today</div>
          <div className="metric-value">7/12</div>
          <div className="metric-delta">58% complete</div>
        </div>
      </div>

      <div className="two-col">
        {/* FLEET STATUS */}
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Fleet Status</div>
              <button className="btn btn-sm" onClick={() => onNavigate('drones')}>View all →</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Drone ID</th>
                  <th>Location</th>
                  <th>Battery</th>
                  <th>Status</th>
                </tr>
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
              <button className="btn btn-sm" onClick={() => onNavigate('alerts')}>View all →</button>
            </div>
            {alertCount === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: 12 }}>
                ✅ No active alerts
              </div>
            ) : (
              <>
                <div className="alert-card alert-critical">
                  <div className="alert-title">
                    <span style={{ color: '#A32D2D' }}>🔴 CRITICAL — DRN-04 Connectivity Loss</span>
                    {isMgr && <button className="btn btn-danger btn-sm" onClick={onOverride}>Override</button>}
                  </div>
                  <div className="alert-body" style={{ color: '#791F1F' }}>
                    Lost telemetry signal 4 min ago · Farm Beta T-17 · battery 41%
                  </div>
                  <div className="alert-time">14:32:07 UTC</div>
                </div>
                <div className="alert-card alert-warn">
                  <div className="alert-title" style={{ color: '#633806' }}>
                    🟡 WARNING — Wind Speed Farm Beta (38 km/h)
                  </div>
                  <div className="alert-body" style={{ color: '#412402' }}>
                    Approaching operational limit of 45 km/h. New dispatches suspended.
                  </div>
                  <div className="alert-time">14:21:52 UTC</div>
                </div>
              </>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Recent Log</div>
              <button className="btn btn-sm" onClick={() => onNavigate('logs')}>Full log →</button>
            </div>
            {systemLogs.slice(0, 5).map((log, i) => (
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