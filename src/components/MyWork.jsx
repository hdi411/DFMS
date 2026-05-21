import { useState } from 'react'

export default function MyWork() {
  const [checks, setChecks] = useState([
    { id: 1, label: 'Visual hull inspection',        done: true },
    { id: 2, label: 'Propeller integrity check',     done: true },
    { id: 3, label: 'Battery level ≥ 80% confirmed', done: true },
    { id: 4, label: 'GPS calibration & signal test', done: false },
    { id: 5, label: 'Camera systems test (4K)',       done: false },
    { id: 6, label: 'Collision avoidance sensors',   done: false },
  ])

  function toggle(id) {
    setChecks(checks.map(c => c.id === id ? { ...c, done: !c.done } : c))
  }

  const progress = Math.round((checks.filter(c => c.done).length / checks.length) * 100)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">✅ My Tasks</div>
          <div className="page-subtitle">
            Assigned to T. Nguyen · Sprint 1 · Cert #TN-2024-88
          </div>
        </div>
      </div>

      <div className="two-col">
        <div>
          {/* PRE-FLIGHT TASK */}
          <div className="task-card">
            <div className="task-header">
              <div className="task-title">Pre-flight Safety Check — DRN-06</div>
              <span className="pill pill-preflight">In Progress</span>
            </div>
            <div className="task-meta">
              IN-10 · Epic 3: Integration · 3 story points · Due: Today 16:00
            </div>
            <div className="checklist">
              {checks.map(c => (
                <label
                  key={c.id}
                  className={`checklist-item ${c.done ? 'done' : ''}`}
                  onClick={() => toggle(c.id)}
                >
                  <input
                    type="checkbox"
                    checked={c.done}
                    onChange={() => toggle(c.id)}
                  />
                  {c.label}
                </label>
              ))}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: progress + '%' }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
              {progress}% complete
            </div>
          </div>

          {/* CERT TASK */}
          <div className="task-card">
            <div className="task-header">
              <div className="task-title">Technician Certification Verification</div>
              <span className="pill pill-ready">Complete</span>
            </div>
            <div className="task-meta">
              IN-16 · Epic 3: Integration · 2 story points · Completed 13:45
            </div>
            <div className="checklist">
              {['License #TN-2024-88 verified', 'WindHawk X4/X5 type rating confirmed', 'EASA Part-UAS compliance checked'].map((l, i) => (
                <label key={i} className="checklist-item done">
                  <input type="checkbox" checked readOnly />
                  {l}
                </label>
              ))}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div>
          {/* ASSIGNED DRONES */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">🚁 My Assigned Drones</div>
            </div>
            <div className="info-row">
              <span className="info-label">DRN-06 · WindHawk X5</span>
              <span className="pill pill-preflight" style={{ fontSize: 10 }}>Pre-flight</span>
            </div>
            <div className="info-row">
              <span className="info-label">DRN-05 · TechBird Pro</span>
              <span className="pill pill-maintenance" style={{ fontSize: 10 }}>Maintenance</span>
            </div>
          </div>

          {/* FLIGHT LOG */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Recent Flight Log — DRN-06</div>
            </div>
            {[
              { date: '15 May 2026', detail: '2h 18m · Farm Alpha complete' },
              { date: '13 May 2026', detail: '1h 54m · T-5, T-6, T-8' },
              { date: '11 May 2026', detail: '3h 02m · Farm Beta T-1 to T-10' },
              { date: '9 May 2026',  detail: '2h 41m · Farm Alpha T-13 to T-18' },
            ].map((f, i) => (
              <div className="info-row" key={i}>
                <span className="info-label">{f.date}</span>
                <span className="info-value">{f.detail}</span>
              </div>
            ))}
          </div>

          {/* CERTIFICATION */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">🏆 Certification Status</div>
            </div>
            <div className="info-row">
              <span className="info-label">License number</span>
              <span className="info-value">#TN-2024-88</span>
            </div>
            <div className="info-row">
              <span className="info-label">Type rating</span>
              <span className="info-value">WindHawk X4 / X5</span>
            </div>
            <div className="info-row">
              <span className="info-label">Regulatory</span>
              <span className="info-value">EASA Part-UAS</span>
            </div>
            <div className="info-row">
              <span className="info-label">Expiry</span>
              <span className="info-value" style={{ color: 'var(--acc)' }}>Dec 2026 ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}