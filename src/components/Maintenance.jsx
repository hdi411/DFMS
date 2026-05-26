import { useState } from 'react'
import { useApp } from '../context/AppContext'

const INSPECTION_RESULTS = [
  {
    id: 'INS-001',
    turbine: 'T-7',
    farm: 'Farm Alpha',
    drone: 'DRN-01',
    timestamp: '14:10:02',
    image: 'blade-crack',
    aiFindings: [
      { type: 'Blade Surface Crack', location: 'Blade A · 60% span', severity: 'critical', confidence: 94, x: 38, y: 42 },
      { type: 'Leading Edge Erosion', location: 'Blade B · tip', severity: 'high', confidence: 89, x: 65, y: 28 },
      { type: 'Surface Coating Wear', location: 'Blade C · root', severity: 'medium', confidence: 76, x: 52, y: 68 },
    ],
    humanRequired: true,
    estimatedRepairTime: '4-6 hours',
    recommendation: 'Immediate shutdown recommended. Critical blade crack requires specialist repair team.',
  },
  {
    id: 'INS-002',
    turbine: 'T-9',
    farm: 'Farm Alpha',
    drone: 'DRN-01',
    timestamp: '13:48:15',
    image: 'corrosion',
    aiFindings: [
      { type: 'Tower Corrosion', location: 'Tower base · north face', severity: 'medium', confidence: 88, x: 45, y: 72 },
      { type: 'Bolt Loosening', location: 'Flange joint · section 2', severity: 'high', confidence: 82, x: 55, y: 55 },
    ],
    humanRequired: true,
    estimatedRepairTime: '2-3 hours',
    recommendation: 'Schedule maintenance within 2 weeks. Monitor bolt tension.',
  },
  {
    id: 'INS-003',
    turbine: 'T-12',
    farm: 'Farm Alpha',
    drone: 'DRN-02',
    timestamp: '14:02:45',
    image: 'clean',
    aiFindings: [
      { type: 'Minor Dirt Accumulation', location: 'Blade A · surface', severity: 'low', confidence: 91, x: 40, y: 50 },
    ],
    humanRequired: false,
    estimatedRepairTime: 'N/A',
    recommendation: 'No immediate action required. Schedule routine cleaning next cycle.',
  },
  {
    id: 'INS-004',
    turbine: 'T-11',
    farm: 'Farm Alpha',
    drone: 'DRN-01',
    timestamp: '13:55:30',
    image: 'gearbox',
    aiFindings: [
      { type: 'Gearbox Vibration Anomaly', location: 'Nacelle · gearbox', severity: 'critical', confidence: 97, x: 50, y: 45 },
      { type: 'Oil Leak Detected', location: 'Nacelle · base seal', severity: 'high', confidence: 85, x: 58, y: 62 },
      { type: 'Overheating Signature', location: 'Generator housing', severity: 'high', confidence: 79, x: 35, y: 38 },
    ],
    humanRequired: true,
    estimatedRepairTime: '8-12 hours',
    recommendation: 'URGENT: Immediate shutdown required. Gearbox failure risk detected.',
  },
]

const SEVERITY_COLOR = {
  critical: { bg: '#FCEBEB', color: '#791F1F', dot: '#E24B4A', label: '🔴 Critical' },
  high:     { bg: '#FFF0E0', color: '#7A3500', dot: '#E07A00', label: '🟠 High' },
  medium:   { bg: '#FFFBEE', color: '#633806', dot: '#BA7517', label: '🟡 Medium' },
  low:      { bg: '#F0F9F0', color: '#1A5C2A', dot: '#2E9E50', label: '🟢 Low' },
}

// Fake turbine inspection image using SVG
function InspectionImage({ type, findings }) {
  const colors = { 'blade-crack': '#6B8FA3', corrosion: '#8B7355', clean: '#7FAF7F', gearbox: '#8A8A8A' }
  const bg = colors[type] || '#888'

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: 8, overflow: 'hidden', background: bg, border: '1px solid var(--border)' }}>
      <svg viewBox="0 0 100 63" style={{ width: '100%', height: '100%' }}>
        {/* sky/background */}
        <rect width="100" height="63" fill={bg} />
        <rect x="0" y="40" width="100" height="23" fill="rgba(0,0,0,.2)" />

        {/* turbine silhouette */}
        <rect x="48" y="15" width="4" height="35" fill="rgba(255,255,255,.6)" />
        {/* blades */}
        <line x1="50" y1="18" x2="25" y2="30" stroke="rgba(255,255,255,.7)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="18" x2="70" y2="5"  stroke="rgba(255,255,255,.7)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="18" x2="55" y2="42" stroke="rgba(255,255,255,.7)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="18" r="3" fill="rgba(255,255,255,.8)" />

        {/* scan overlay */}
        <rect x="0" y="0" width="100" height="63" fill="rgba(0,30,60,.15)" />

        {/* grid lines (drone camera effect) */}
        {[16,32,48].map(x => <line key={x} x1={x} y1="0" x2={x} y2="63" stroke="rgba(255,255,255,.08)" strokeWidth=".5" />)}
        {[16,32,48].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,.08)" strokeWidth=".5" />)}

        {/* corner brackets (drone HUD) */}
        <path d="M5,5 L5,12 M5,5 L12,5"   stroke="rgba(255,255,255,.5)" strokeWidth=".8" fill="none" />
        <path d="M95,5 L95,12 M95,5 L88,5" stroke="rgba(255,255,255,.5)" strokeWidth=".8" fill="none" />
        <path d="M5,58 L5,51 M5,58 L12,58" stroke="rgba(255,255,255,.5)" strokeWidth=".8" fill="none" />
        <path d="M95,58 L95,51 M95,58 L88,58" stroke="rgba(255,255,255,.5)" strokeWidth=".8" fill="none" />

        {/* AI damage markers */}
        {findings.map((f, i) => {
          const sc = SEVERITY_COLOR[f.severity]
          return (
            <g key={i}>
              <circle cx={f.x} cy={f.y} r="5" fill="none" stroke={sc.dot} strokeWidth="1.2" />
              <circle cx={f.x} cy={f.y} r="2" fill={sc.dot} />
              <line x1={f.x + 5} y1={f.y} x2={f.x + 10} y2={f.y} stroke={sc.dot} strokeWidth=".8" />
            </g>
          )
        })}

        {/* timestamp watermark */}
        <text x="3" y="61" fontSize="3.5" fill="rgba(255,255,255,.6)" fontFamily="monospace">
          {new Date().toISOString().slice(0, 10)} · DJI-DFMS · 4K
        </text>
      </svg>

      {/* AI SCAN badge */}
      <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(15,110,86,.85)', color: '#fff', fontSize: 9, padding: '2px 7px', borderRadius: 20, fontWeight: 600 }}>
        ✦ AI SCAN
      </div>
    </div>
  )
}

// All findings sorted by severity
function SeverityRanking({ results }) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 }
  const all = results.flatMap(r =>
    r.aiFindings.map(f => ({ ...f, turbine: r.turbine, farm: r.farm, inspectionId: r.id }))
  ).sort((a, b) => order[a.severity] - order[b.severity])

  return (
    <div className="card" style={{ position: 'sticky', top: 0 }}>
      <div className="card-header">
        <div className="card-title">⚠️ Issue Severity Ranking</div>
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{all.length} issues</span>
      </div>
      {all.map((f, i) => {
        const sc = SEVERITY_COLOR[f.severity]
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            padding: '7px 0', borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', width: 18, flexShrink: 0, paddingTop: 1 }}>
              #{i + 1}
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.dot, flexShrink: 0, marginTop: 3 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                {f.type}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text2)' }}>
                {f.turbine} · {f.location}
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 20, background: sc.bg, color: sc.color, fontWeight: 600 }}>
                  {sc.label}
                </span>
                <span style={{ fontSize: 9, color: 'var(--text3)' }}>
                  AI: {f.confidence}%
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Maintenance({ showToast }) {
  const { flagged, toggleFlag, drones } = useApp()
  const [selected, setSelected] = useState('INS-001')

  const activeDrones = drones
    .filter(d => d.status === 'inflight' || d.status === 'critical')
    .map(d => ({
      id: d.id,
      location: d.location,
      battery: d.battery,
      altitude: d.altitude,
      speed: d.speed,
      signal: d.status === 'critical' ? 'Lost' : 'Strong',
      duration: d.status === 'critical' ? '2h 01m' : '1h 23m',
    }))
  const current = INSPECTION_RESULTS.find(r => r.id === selected)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🔧 Maintenance & Inspection</div>
          <div className="page-subtitle">
            <span className="live-dot" /> AI-powered damage detection · real-time drone feed
          </div>
        </div>
      </div>

      {/* ACTIVE DRONES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        {activeDrones.map(d => (
          <div key={d.id} style={{
            background: 'var(--bg2)', border: `1px solid ${d.signal === 'Lost' ? '#F7C1C1' : 'var(--border)'}`,
            borderRadius: 12, padding: 12,
            background: d.signal === 'Lost' ? '#FFF0F0' : 'var(--bg2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 12 }}>{d.id}</span>
              <span className={`pill ${d.signal === 'Lost' ? 'pill-critical' : 'pill-inflight'}`}>
                {d.signal === 'Lost' ? '⚠ Conn. Loss' : '✈ In Flight'}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>📍 {d.location}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {[
                ['🔋', d.battery + '%', d.battery < 45 ? 'var(--danger)' : d.battery < 65 ? 'var(--warn)' : 'var(--acc)'],
                ['📏', d.altitude > 0 ? d.altitude + 'm' : '—', 'var(--text)'],
                ['💨', d.speed > 0 ? d.speed + ' km/h' : '—', 'var(--text)'],
                ['⏱️', d.duration, 'var(--text)'],
              ].map(([icon, val, color], i) => (
                <div key={i} style={{ fontSize: 10, color: 'var(--text2)' }}>
                  {icon} <span style={{ color, fontWeight: 500 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>
        {/* LEFT: inspection details */}
        <div>
          {/* inspection selector tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {INSPECTION_RESULTS.map(r => {
              const worst = r.aiFindings.reduce((a, b) => {
                const order = { critical: 0, high: 1, medium: 2, low: 3 }
                return order[a.severity] < order[b.severity] ? a : b
              })
              const sc = SEVERITY_COLOR[worst.severity]
              return (
                <button
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  style={{
                    padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                    border: `1px solid ${selected === r.id ? sc.dot : 'var(--border)'}`,
                    background: selected === r.id ? sc.bg : 'var(--bg2)',
                    color: selected === r.id ? sc.color : 'var(--text2)',
                    fontWeight: selected === r.id ? 600 : 400,
                  }}
                >
                  {r.turbine} · {r.farm.replace('Farm ', '')}
                </button>
              )
            })}
          </div>

          {current && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    🔍 {current.turbine} — {current.farm}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                    Inspected by {current.drone} · {current.timestamp} UTC · {current.id}
                  </div>
                </div>
                <span className={`pill ${current.humanRequired ? 'pill-critical' : 'pill-ready'}`}>
                  {current.humanRequired ? '👷 Human Required' : '✅ Auto-fixable'}
                </span>
              </div>

              {/* PHOTO + AI MARKERS */}
              <InspectionImage type={current.image} findings={current.aiFindings} />

              {/* MARKER LEGEND */}
              <div style={{ display: 'flex', gap: 6, margin: '8px 0', flexWrap: 'wrap' }}>
                {current.aiFindings.map((f, i) => {
                  const sc = SEVERITY_COLOR[f.severity]
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: sc.bg, border: `1px solid ${sc.dot}`,
                      borderRadius: 6, padding: '3px 8px', fontSize: 10
                    }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot }} />
                      <span style={{ color: sc.color, fontWeight: 500 }}>
                        #{i + 1} {f.type}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* AI FINDINGS TABLE */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                  🤖 AI Analysis Results
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Issue Type</th>
                      <th>Location</th>
                      <th>Severity</th>
                      <th>AI Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.aiFindings.map((f, i) => {
                      const sc = SEVERITY_COLOR[f.severity]
                      return (
                        <tr key={i}>
                          <td style={{ color: 'var(--text3)', fontFamily: 'monospace' }}>#{i + 1}</td>
                          <td><strong>{f.type}</strong></td>
                          <td style={{ color: 'var(--text2)' }}>{f.location}</td>
                          <td>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                              background: sc.bg, color: sc.color
                            }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                              {f.severity.charAt(0).toUpperCase() + f.severity.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 50, height: 5, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden' }}>
                                <div style={{ width: f.confidence + '%', height: '100%', background: f.confidence > 85 ? 'var(--acc)' : 'var(--warn)', borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 11, color: 'var(--text2)' }}>{f.confidence}%</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* RECOMMENDATION */}
              <div style={{
                background: current.humanRequired ? '#FFF8EC' : '#F0FBF4',
                border: `1px solid ${current.humanRequired ? '#FAC775' : '#9FE1CB'}`,
                borderRadius: 8, padding: '10px 12px', marginBottom: 12
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: current.humanRequired ? '#633806' : '#085041', marginBottom: 4 }}>
                  {current.humanRequired ? '⚠️ AI Recommendation' : '✅ AI Recommendation'}
                </div>
                <div style={{ fontSize: 11, color: current.humanRequired ? '#412402' : '#1A5C2A', lineHeight: 1.5 }}>
                  {current.recommendation}
                </div>
                {current.estimatedRepairTime !== 'N/A' && (
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
                    ⏱️ Estimated repair time: <strong>{current.estimatedRepairTime}</strong>
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" style={{ flex: 1 }} onClick={() => showToast(`Report for ${current.turbine} exported`)}>
                  📄 Export Report
                </button>
                <button
  className="btn"
  style={{ color: flagged[current.id] ? '#791F1F' : '', background: flagged[current.id] ? '#FCEBEB' : '', borderColor: flagged[current.id] ? '#E24B4A' : '' }}
  onClick={() => toggleFlag(current.id, current.turbine)}
>
  🚩 {flagged[current.id] ? 'Flagged' : 'Flag'}
</button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: severity ranking */}
        <SeverityRanking results={INSPECTION_RESULTS} />
      </div>
    </div>
  )
}