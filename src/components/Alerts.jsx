import { useApp } from '../context/AppContext'

export default function Alerts({ onOverride }) {
  const { alerts, acknowledgeAlert, acknowledgeAllAlerts } = useApp()

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🔔 Alerts &amp; Incidents</div>
          <div className="page-subtitle">
            Mission failure alerts · connectivity loss · battery thresholds
          </div>
        </div>
        {alerts.length > 0 && (
          <button className="btn" onClick={acknowledgeAllAlerts}>
            ✓ Acknowledge All
          </button>
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
                <button className="btn btn-sm" onClick={() => acknowledgeAlert(a.id)}>
                  Acknowledge
                </button>
              </div>
            </div>
            <div className="alert-body"
              style={{ color: a.type === 'critical' ? '#791F1F' : '#412402' }}>
              {a.body}
            </div>
            <div className="alert-time">{a.time}</div>
          </div>
        ))
      )}
    </div>
  )
}