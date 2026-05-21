import { useState } from 'react'

const INITIAL_ALERTS = [
  {
    id: 1,
    type: 'critical',
    title: '🔴 CRITICAL — DRN-04 Connectivity Loss',
    body: 'Drone DRN-04 lost telemetry signal 4 minutes ago at Farm Beta T-17 · last known altitude 190m · battery 41% · auto-return protocol initiated',
    time: '14:32:07 UTC · Assigned to: J. Smith (Operations Manager)',
  },
  {
    id: 2,
    type: 'warn',
    title: '🟡 WARNING — DRN-04 Low Battery (41%)',
    body: 'Battery at 41% — return-to-base threshold is 35%. Recommend immediate recall or override for recovery mission.',
    time: '14:29:14 UTC',
  },
  {
    id: 3,
    type: 'warn',
    title: '🟡 WARNING — Wind Speed Farm Beta (38 km/h)',
    body: 'Wind speed 38 km/h approaching operational limit of 45 km/h. New dispatches to Farm Beta suspended until conditions improve.',
    time: '14:21:52 UTC · WFS auto-generated',
  },
]

export default function Alerts({ onOverride, setAlertCount }) {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)

  function ackAlert(id) {
    const updated = alerts.filter(a => a.id !== id)
    setAlerts(updated)
    setAlertCount(updated.length)
  }

  function ackAll() {
    setAlerts([])
    setAlertCount(0)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🔔 Alerts &amp; Incidents</div>
          <div className="page-subtitle">Mission failure alerts · connectivity loss · battery thresholds</div>
        </div>
        {alerts.length > 0 && (
          <button className="btn" onClick={ackAll}>✓ Acknowledge All</button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>All alerts acknowledged</div>
          <div style={{ fontSize: 12 }}>No unresolved incidents at this time.</div>
        </div>
      ) : (
        alerts.map(a => (
          <div key={a.id} className={`alert-card alert-${a.type}`}>
            <div className="alert-title">
              <span style={{ color: a.type === 'critical' ? '#A32D2D' : '#633806' }}>
                {a.title}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {a.type === 'critical' && (
                  <button className="btn btn-danger btn-sm" onClick={onOverride}>
                    Override
                  </button>
                )}
                <button className="btn btn-sm" onClick={() => ackAlert(a.id)}>
                  Acknowledge
                </button>
              </div>
            </div>
            <div className="alert-body" style={{ color: a.type === 'critical' ? '#791F1F' : '#412402' }}>
              {a.body}
            </div>
            <div className="alert-time">{a.time}</div>
          </div>
        ))
      )}
    </div>
  )
}