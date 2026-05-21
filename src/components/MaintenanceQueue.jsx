import { useState } from 'react'

const QUEUE = [
  {
    id: 'MQ-001',
    priority: 1,
    severity: 'critical',
    turbine: 'T-11',
    farm: 'Farm Alpha',
    issue: 'Gearbox Vibration Anomaly + Oil Leak',
    detectedBy: 'DRN-01 · AI Scan',
    detectedAt: '13:55 UTC',
    estimatedTime: '8-12 hours',
    assignedTo: null,
    requiredCert: 'Gearbox Specialist',
    parts: ['Gearbox seal kit', 'Oil filter', 'Vibration damper'],
    notes: 'URGENT — Immediate shutdown required. Gearbox failure risk detected at 97% confidence.',
  },
  {
    id: 'MQ-002',
    priority: 2,
    severity: 'critical',
    turbine: 'T-7',
    farm: 'Farm Alpha',
    issue: 'Blade Surface Crack — Blade A',
    detectedBy: 'DRN-01 · AI Scan',
    detectedAt: '14:10 UTC',
    estimatedTime: '4-6 hours',
    assignedTo: 'A. Bakker',
    requiredCert: 'WindHawk X4 Blade Repair',
    parts: ['Composite patch kit', 'Epoxy resin', 'Surface sealant'],
    notes: 'Critical crack at 60% span. Specialist repair team required. Turbine shutdown initiated.',
  },
  {
    id: 'MQ-003',
    priority: 3,
    severity: 'high',
    turbine: 'T-9',
    farm: 'Farm Alpha',
    issue: 'Bolt Loosening — Flange Joint Section 2',
    detectedBy: 'DRN-01 · AI Scan',
    detectedAt: '13:48 UTC',
    estimatedTime: '2-3 hours',
    assignedTo: null,
    requiredCert: 'WindHawk X4 / X5',
    parts: ['M36 bolts x8', 'Torque wrench', 'Thread locker'],
    notes: 'Schedule within 2 weeks. Monitor bolt tension. Tower corrosion also noted on north face.',
  },
  {
    id: 'MQ-004',
    priority: 4,
    severity: 'high',
    turbine: 'T-7',
    farm: 'Farm Alpha',
    issue: 'Leading Edge Erosion — Blade B Tip',
    detectedBy: 'DRN-01 · AI Scan',
    detectedAt: '14:10 UTC',
    estimatedTime: '3-4 hours',
    assignedTo: null,
    requiredCert: 'WindHawk X4 Blade Repair',
    parts: ['Leading edge tape', 'Erosion shield', 'Surface primer'],
    notes: 'Can be addressed during T-7 blade crack repair visit. Combine with MQ-002.',
  },
  {
    id: 'MQ-005',
    priority: 5,
    severity: 'high',
    turbine: 'T-11',
    farm: 'Farm Alpha',
    issue: 'Generator Overheating Signature',
    detectedBy: 'DRN-01 · AI Scan',
    detectedAt: '13:55 UTC',
    estimatedTime: '2-3 hours',
    assignedTo: null,
    requiredCert: 'Electrical Systems',
    parts: ['Cooling fan unit', 'Thermal paste', 'Temperature sensor'],
    notes: 'Address during MQ-001 gearbox repair visit. Generator cooling system inspection required.',
  },
  {
    id: 'MQ-006',
    priority: 6,
    severity: 'medium',
    turbine: 'T-9',
    farm: 'Farm Alpha',
    issue: 'Tower Corrosion — North Face Base',
    detectedBy: 'DRN-01 · AI Scan',
    detectedAt: '13:48 UTC',
    estimatedTime: '1-2 hours',
    assignedTo: null,
    requiredCert: 'WindHawk X4 / X5',
    parts: ['Anti-corrosion coating', 'Wire brush', 'Primer spray'],
    notes: 'Non-urgent. Schedule with next routine maintenance visit to T-9.',
  },
  {
    id: 'MQ-007',
    priority: 7,
    severity: 'medium',
    turbine: 'T-7',
    farm: 'Farm Alpha',
    issue: 'Surface Coating Wear — Blade C Root',
    detectedBy: 'DRN-01 · AI Scan',
    detectedAt: '14:10 UTC',
    estimatedTime: '1-2 hours',
    assignedTo: null,
    requiredCert: 'WindHawk X4 / X5',
    parts: ['UV-resistant coating', 'Applicator brush'],
    notes: 'Low urgency. Can be combined with T-7 blade repair visit.',
  },
  {
    id: 'MQ-008',
    priority: 8,
    severity: 'low',
    turbine: 'T-12',
    farm: 'Farm Alpha',
    issue: 'Minor Dirt Accumulation — Blade A Surface',
    detectedBy: 'DRN-02 · AI Scan',
    detectedAt: '14:02 UTC',
    estimatedTime: '0.5 hours',
    assignedTo: null,
    requiredCert: 'WindHawk X4 / X5',
    parts: ['Cleaning solution', 'Soft brush'],
    notes: 'Routine cleaning. Schedule next cycle. No structural concern.',
  },
]

const SEVERITY_COLOR = {
  critical: { bg: '#FCEBEB', color: '#791F1F', dot: '#E24B4A', label: 'Critical' },
  high:     { bg: '#FFF0E0', color: '#7A3500', dot: '#E07A00', label: 'High'     },
  medium:   { bg: '#FFFBEE', color: '#633806', dot: '#BA7517', label: 'Medium'   },
  low:      { bg: '#F0F9F0', color: '#1A5C2A', dot: '#2E9E50', label: 'Low'      },
}

export default function MaintenanceQueue({ showToast, user}) {
  const isMgr = user?.role === 'manager'
  const [expanded, setExpanded] = useState('MQ-001')
  const [assigned, setAssigned] = useState(
    Object.fromEntries(QUEUE.filter(q => q.assignedTo).map(q => [q.id, q.assignedTo]))
  )

  function assign(id) {
  const name = isMgr ? 'T. Nguyen' : 'T. Nguyen'
  setAssigned(prev => ({ ...prev, [id]: name }))
  showToast(isMgr
    ? `✅ T. Nguyen assigned to ${QUEUE.find(q => q.id === id)?.turbine}`
    : `✅ You have been assigned to ${QUEUE.find(q => q.id === id)?.turbine}`
  )
}

  function complete(id) {
    showToast(`🎉 ${id} marked complete — log submitted`)
  }

  const critical = QUEUE.filter(q => q.severity === 'critical').length
  const high     = QUEUE.filter(q => q.severity === 'high').length
  const medium   = QUEUE.filter(q => q.severity === 'medium').length
  const low      = QUEUE.filter(q => q.severity === 'low').length

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
          <div key={i} style={{ background: m.bg, border: `1px solid ${m.color}40`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: m.color, fontWeight: 500, marginBottom: 5 }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 10, color: m.color, opacity: .7, marginTop: 2 }}>issues</div>
          </div>
        ))}
      </div>

      {/* QUEUE LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {QUEUE.map(q => {
          const sc        = SEVERITY_COLOR[q.severity]
          const isOpen    = expanded === q.id
          const isAssigned = assigned[q.id]

          return (
            <div
              key={q.id}
              style={{
                background: 'var(--bg2)',
                border: `1px solid ${isOpen ? sc.dot : 'var(--border)'}`,
                borderRadius: 12,
                overflow: 'hidden',
                transition: '.2s',
              }}
            >
              {/* HEADER ROW — always visible */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer' }}
                onClick={() => setExpanded(isOpen ? null : q.id)}
              >
                {/* priority number */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: sc.bg, border: `1px solid ${sc.dot}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: sc.color, flexShrink: 0
                }}>
                  {q.priority}
                </div>

                {/* severity dot */}
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />

                {/* main info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>{q.turbine} — {q.issue}</span>
                    <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 20, background: sc.bg, color: sc.color, fontWeight: 600 }}>
                      {sc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                    {q.farm} · {q.detectedBy} · {q.detectedAt} · Est. {q.estimatedTime}
                  </div>
                </div>

                {/* assigned badge */}
                <div style={{ flexShrink: 0 }}>
                  {isAssigned
                    ? <span className="pill pill-ready" style={{ fontSize: 10 }}>👷 {isAssigned}</span>
                    : <span className="pill pill-offline" style={{ fontSize: 10 }}>Unassigned</span>
                  }
                </div>

                {/* chevron */}
                <div style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0 }}>
                  {isOpen ? '▲' : '▼'}
                </div>
              </div>

              {/* EXPANDED DETAIL */}
              {isOpen && (
                <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${sc.dot}30` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>

                    {/* LEFT */}
                    <div>
                      {/* notes */}
                      <div style={{
                        background: sc.bg, border: `1px solid ${sc.dot}60`,
                        borderRadius: 8, padding: '8px 10px', marginBottom: 10, fontSize: 11,
                        color: sc.color, lineHeight: 1.5
                      }}>
                        ⚠️ {q.notes}
                      </div>

                      {/* details */}
                      <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div className="info-row">
                          <span className="info-label">Required cert</span>
                          <span className="info-value">{q.requiredCert}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Est. repair time</span>
                          <span className="info-value">{q.estimatedTime}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Detected by</span>
                          <span className="info-value">{q.detectedBy}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Detected at</span>
                          <span className="info-value">{q.detectedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div>
                      {/* parts */}
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                          🔩 Required Parts
                        </div>
                        {q.parts.map((p, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)', padding: '3px 0' }}>
                            <span style={{ color: 'var(--acc)' }}>◦</span> {p}
                          </div>
                        ))}
                      </div>

                      {/* actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {!isAssigned ? (
                          <button className="btn btn-primary" onClick={() => assign(q.id)}>
                           {isMgr ? '👷 Assign Technician' : '👷 Assign to Me'}
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => complete(q.id)}
                            disabled={isMgr}
                          >
                            {isMgr ? `✅ Assigned to ${isAssigned}` : '✅ Mark Complete'}
                          </button>
                        )}
                        <button className="btn" onClick={() => showToast(`${q.id} report exported`)}>
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