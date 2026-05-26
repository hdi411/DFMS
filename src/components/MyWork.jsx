import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function MyWork({ user }) {
  const { queue, completeQueue, preflightChecks, toggleCheck } = useApp()
const progress = Math.round((preflightChecks.filter(c => c.done).length / preflightChecks.length) * 100)

  // tasks assigned to this technician from the queue
  const myQueueTasks = queue.filter(q => q.assignedTo === user.name)

  const SEVERITY_COLOR = {
    critical: { bg: '#FCEBEB', color: '#791F1F', dot: '#E24B4A' },
    high:     { bg: '#FFF0E0', color: '#7A3500', dot: '#E07A00' },
    medium:   { bg: '#FFFBEE', color: '#633806', dot: '#BA7517' },
    low:      { bg: '#F0F9F0', color: '#1A5C2A', dot: '#2E9E50' },
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">✅ My Tasks</div>
          <div className="page-subtitle">
            Assigned to {user.name} · Sprint 1 · Cert #TN-2024-88
          </div>
        </div>
      </div>

      <div className="two-col">
        <div>
          {/* PRE-FLIGHT TASK */}
          <div className="task-card">
            <div className="task-header">
              <div className="task-title">Pre-flight Safety Check — DRN-06</div>
              <span className={`pill ${progress === 100 ? 'pill-ready' : 'pill-preflight'}`}>
  {progress === 100 ? 'Complete ✅' : 'In Progress'}
</span>
            </div>
            <div className="task-meta">
              IN-10 · Epic 3: Integration · 3 story points · Due: Today 16:00
            </div>
            <div className="checklist">
              {preflightChecks.map(c => (
  <label
    key={c.id}
    className={`checklist-item ${c.done ? 'done' : ''}`}
  >
    <input
      type="checkbox"
      checked={c.done}
      onChange={() => toggleCheck(c.id)}
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

          {/* ASSIGNED FROM MAINTENANCE QUEUE */}
          {myQueueTasks.length > 0 && (
            <>
              <div style={{
                fontSize: 11, fontWeight: 600, color: 'var(--text3)',
                textTransform: 'uppercase', letterSpacing: '.06em',
                margin: '16px 0 8px'
              }}>
                Assigned Maintenance Tasks
              </div>
              {myQueueTasks.map(q => {
                const sc = SEVERITY_COLOR[q.severity]
                return (
                  <div className="task-card" key={q.id}>
                    <div className="task-header">
                      <div className="task-title">{q.turbine} — {q.issue}</div>
                      <span style={{
                        fontSize: 10, padding: '2px 8px', borderRadius: 20,
                        background: sc.bg, color: sc.color, fontWeight: 600
                      }}>
                        {q.severity.charAt(0).toUpperCase() + q.severity.slice(1)}
                      </span>
                    </div>
                    <div className="task-meta">
                      {q.id} · {q.farm} · Est. {q.estimatedTime} · Cert: {q.requiredCert}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8, lineHeight: 1.5 }}>
                      {q.notes}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                      🔩 Required Parts
                    </div>
                    {q.parts.map((p, i) => (
                      <div key={i} style={{ fontSize: 11, color: 'var(--text2)', padding: '2px 0' }}>
                        <span style={{ color: 'var(--acc)' }}>◦</span> {p}
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                      {!q.completed ? (
                        <button
                          className="btn btn-primary"
                          style={{ flex: 1 }}
                          onClick={() => completeQueue(q.id, user.name)}
                        >
                          ✅ Mark Complete
                        </button>
                      ) : (
                        <span className="pill pill-ready" style={{ fontSize: 11 }}>
                          ✅ Completed
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {myQueueTasks.length === 0 && (
            <div style={{
              textAlign: 'center', padding: 20,
              color: 'var(--text3)', fontSize: 12,
              background: 'var(--bg2)', borderRadius: 12,
              border: '1px solid var(--border)'
            }}>
              No maintenance tasks assigned yet
            </div>
          )}
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