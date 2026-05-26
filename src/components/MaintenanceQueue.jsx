import { useApp } from '../context/AppContext'
import { useState } from 'react'

const SEVERITY_COLOR = {
  critical: { bg: '#FCEBEB', color: '#791F1F', dot: '#E24B4A', label: 'Critical' },
  high:     { bg: '#FFF0E0', color: '#7A3500', dot: '#E07A00', label: 'High'     },
  medium:   { bg: '#FFFBEE', color: '#633806', dot: '#BA7517', label: 'Medium'   },
  low:      { bg: '#F0F9F0', color: '#1A5C2A', dot: '#2E9E50', label: 'Low'      },
}

export default function MaintenanceQueue({ showToast, user }) {
  const { queue, assignQueue, completeQueue } = useApp()
  const [expanded, setExpanded] = useState('MQ-001')
  const isMgr = user?.role === 'manager'
  const STATIC_TASKS = {
  'T. Nguyen': 1,
  'A. Bakker': 1,
}

const techWorkload = (name) =>
  (STATIC_TASKS[name] || 0) + queue.filter(q => q.assignedTo === name && !q.completed).length
  const critical = queue.filter(q => q.severity === 'critical').length
  const high     = queue.filter(q => q.severity === 'high').length
  const medium   = queue.filter(q => q.severity === 'medium').length
  const low      = queue.filter(q => q.severity === 'low').length

  function handleAssign(id, name) {
  assignQueue(id, name)
  showToast(`✅ ${name} assigned to ${queue.find(q => q.id === id)?.turbine}`)
}

  function handleComplete(id) {
    completeQueue(id)
    showToast(`🎉 ${id} marked complete — log submitted`)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📋 Maintenance Queue</div>
          <div className="page-subtitle">
            Priority-ordered repair tasks · assigned by AI severity ranking
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: '🔴 Critical', value: critical, color: '#E24B4A', bg: '#FCEBEB' },
          { label: '🟠 High',     value: high,     color: '#E07A00', bg: '#FFF0E0' },
          { label: '🟡 Medium',   value: medium,   color: '#BA7517', bg: '#FFFBEE' },
          { label: '🟢 Low',      value: low,      color: '#2E9E50', bg: '#F0F9F0' },
        ].map((m, i) => (
          <div key={i} style={{
            background: m.bg, border: `1px solid ${m.color}40`,
            borderRadius: 12, padding: 14
          }}>
            <div style={{ fontSize: 11, color: m.color, fontWeight: 500, marginBottom: 5 }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 10, color: m.color, opacity: .7, marginTop: 2 }}>issues</div>
          </div>
        ))}
      </div>

      {/* QUEUE LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {queue.map(q => {
          const sc         = SEVERITY_COLOR[q.severity]
          const isOpen     = expanded === q.id
          const isAssigned = q.assignedTo
          const isDone     = q.completed

          return (
            <div key={q.id} style={{
              background: isDone ? 'var(--bg3)' : 'var(--bg2)',
              border: `1px solid ${isOpen ? sc.dot : 'var(--border)'}`,
              borderRadius: 12, overflow: 'hidden', transition: '.2s',
              opacity: isDone ? .6 : 1,
            }}>
              {/* HEADER */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer' }}
                onClick={() => setExpanded(isOpen ? null : q.id)}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: sc.bg, border: `1px solid ${sc.dot}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: sc.color, flexShrink: 0
                }}>
                  {q.priority}
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>
                      {isDone && '✅ '}{q.turbine} — {q.issue}
                    </span>
                    <span style={{
                      fontSize: 9, padding: '1px 7px', borderRadius: 20,
                      background: sc.bg, color: sc.color, fontWeight: 600
                    }}>
                      {sc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                    {q.farm} · {q.estimatedTime}
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {isDone
                    ? <span className="pill pill-ready" style={{ fontSize: 10 }}>✅ Complete</span>
                    : isAssigned
                      ? <span className="pill pill-ready" style={{ fontSize: 10 }}>👷 {isAssigned}</span>
                      : <span className="pill pill-offline" style={{ fontSize: 10 }}>Unassigned</span>
                  }
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0 }}>
                  {isOpen ? '▲' : '▼'}
                </div>
              </div>

              {/* EXPANDED */}
              {isOpen && (
                <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${sc.dot}30` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                    <div>
                      <div style={{
                        background: sc.bg, border: `1px solid ${sc.dot}60`,
                        borderRadius: 8, padding: '8px 10px', marginBottom: 10,
                        fontSize: 11, color: sc.color, lineHeight: 1.5
                      }}>
                        ⚠️ {q.notes}
                      </div>
                      <div className="info-row">
                        <span className="info-label">Required cert</span>
                        <span className="info-value">{q.requiredCert}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Est. repair time</span>
                        <span className="info-value">{q.estimatedTime}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Assigned to</span>
                        <span className="info-value">{isAssigned || 'Unassigned'}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                        🔩 Required Parts
                      </div>
                      {q.parts.map((p, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          fontSize: 11, color: 'var(--text2)', padding: '3px 0'
                        }}>
                          <span style={{ color: 'var(--acc)' }}>◦</span> {p}
                        </div>
                      ))}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                        {!isDone && (
                          <>
                            {!isAssigned ? (
  isMgr ? (
    <select
      defaultValue=""
      onChange={e => {
        if (e.target.value) handleAssign(q.id, e.target.value)
      }}
      style={{
  width: '100%', padding: '8px 10px',
  border: '1px solid var(--acc)', borderRadius: 8,
  background: '#E1F5EE', color: '#085041',
  fontSize: 11, cursor: 'pointer', fontWeight: 500
}}
    >
      <option value="" disabled>👷 Assign Technician...</option>
      <option value="T. Nguyen">T. Nguyen — {techWorkload('T. Nguyen')} tasks active</option>
      <option value="A. Bakker">A. Bakker — {techWorkload('A. Bakker')} tasks active</option>
    </select>
  ) : (
    <button className="btn btn-primary" onClick={() => handleAssign(q.id, user.name)}>
      👷 Assign to Me
    </button>
  )
                            ) : (
                              !isMgr && (
                                <button className="btn btn-primary" onClick={() => handleComplete(q.id)}>
                                  ✅ Mark Complete
                                </button>
                              )
                            )}
                          </>
                        )}
                        <button className="btn" onClick={() => showToast(`${q.id} work order exported`)}>
                          📄 Export Work Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}