import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const BASE_POSITIONS = {
  'DRN-01': { cx: 110, cy: 80,  fill: '#1D9E75' },
  'DRN-02': { cx: 150, cy: 95,  fill: '#1D9E75' },
  'DRN-03': { cx: 290, cy: 155, fill: '#888780' },
  'DRN-04': { cx: 510, cy: 90,  fill: '#E24B4A' },
  'DRN-05': { cx: 310, cy: 155, fill: '#888780' },
  'DRN-06': { cx: 330, cy: 155, fill: '#888780' },
  'DRN-07': { cx: 350, cy: 155, fill: '#888780' },
  'DRN-08': { cx: 370, cy: 155, fill: '#888780' },
}

const FARM_ALPHA_BOUNDS = { minX: 55, maxX: 180, minY: 55, maxY: 150 }
const FARM_BETA_BOUNDS  = { minX: 455, maxX: 580, minY: 55, maxY: 140 }

function getBounds(drone) {
  if (drone.status !== 'inflight' && drone.status !== 'critical') return null
  if (drone.location?.includes('Beta')) return FARM_BETA_BOUNDS
  return FARM_ALPHA_BOUNDS
}

function randomDrift(val, min, max) {
  const next = val + (Math.random() - 0.5) * 12
  return Math.min(Math.max(next, min), max)
}

function droneColor(status) {
  if (status === 'inflight')  return '#1D9E75'
  if (status === 'critical')  return '#E24B4A'
  if (status === 'ready')     return '#888780'
  return '#888780'
}

export default function LiveMap({ showToast }) {
  const { drones } = useApp()
  const [positions, setPositions] = useState(() => {
    const p = {}
    drones.forEach(d => {
      p[d.id] = { ...BASE_POSITIONS[d.id] }
    })
    return p
  })
  const [tooltip, setTooltip] = useState(null)

  // animate flying drones every 2s
  useEffect(() => {
    const interval = setInterval(() => {
  setPositions(prev => {
    const next = { ...prev }
    drones.forEach(d => {
      if (!next[d.id]) return
      const b = getBounds(d)

      if ((d.status === 'inflight' || d.status === 'critical') && b) {
        const cur = next[d.id]
        const targetX = (b.minX + b.maxX) / 2
        const targetY = (b.minY + b.maxY) / 2

        // if far from target zone, move toward it gradually
        const distX = targetX - cur.cx
        const distY = targetY - cur.cy
        const dist = Math.sqrt(distX * distX + distY * distY)

        if (dist > 20) {
          // still flying toward target zone
          next[d.id] = {
            ...cur,
            cx: cur.cx + distX * 0.25,
            cy: cur.cy + distY * 0.25,
          }
        } else {
          // arrived — start drifting normally
          next[d.id] = {
            ...cur,
            cx: randomDrift(cur.cx, b.minX, b.maxX),
            cy: randomDrift(cur.cy, b.minY, b.maxY),
          }
        }
      }

      if (d.status === 'ready') {
        const base = BASE_POSITIONS[d.id]
        if (base) {
          const cur = next[d.id]
          next[d.id] = {
            ...cur,
            cx: cur.cx + (base.cx - cur.cx) * 0.3,
            cy: cur.cy + (base.cy - cur.cy) * 0.3,
          }
        }
      }
    })
    return next
  })
}, 2000)
    return () => clearInterval(interval)
  }, [drones])

  const inFlight = drones.filter(d => d.status === 'inflight' || d.status === 'critical')
  const atBase   = drones.filter(d => d.status === 'ready' || d.status === 'preflight' || d.status === 'maintenance')

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🗺️ Live Drone Map</div>
          <div className="page-subtitle">
            <span className="live-dot" /> Real-time positions · {inFlight.length} in flight · updates every 2s
          </div>
        </div>
        <button className="btn" onClick={() => showToast('Map refreshed — positions updated')}>
          🔄 Refresh
        </button>
      </div>

      <div className="card" style={{ padding: 10 }}>
        <div style={{
          position: 'relative', height: 280,
          background: 'linear-gradient(160deg,#D8EDDE,#C5E3CC)',
          borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)'
        }}>
          <svg viewBox="0 0 640 280" style={{ width: '100%', height: '100%' }}>
            <defs>
              <style>{`
                @keyframes pulse-ring { 0%,100%{r:13;opacity:.7} 50%{r:19;opacity:.1} }
                @keyframes blink-red  { 0%,100%{opacity:1} 50%{opacity:.3} }
                .drone-pulse { animation: pulse-ring 2s ease-in-out infinite; }
                .drone-blink { animation: blink-red 1s ease-in-out infinite; }
              `}</style>
            </defs>

            {/* terrain */}
            <rect width="640" height="280" fill="#D8EDDE" />
            <rect x="0" y="190" width="640" height="90" fill="#C5E3CC" />
            <line x1="0" y1="140" x2="640" y2="140" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" strokeDasharray="10 6" />
            <line x1="210" y1="0" x2="210" y2="280" stroke="rgba(255,255,255,.3)" strokeWidth="1" strokeDasharray="8 5" />
            <line x1="440" y1="0" x2="440" y2="280" stroke="rgba(255,255,255,.3)" strokeWidth="1" strokeDasharray="8 5" />

            {/* farm labels */}
            <rect x="20"  y="15" width="165" height="26" rx="6" fill="rgba(255,255,255,.75)" />
            <text x="102" y="32" textAnchor="middle" fontSize="10" fill="#0F6E56" fontWeight="600" fontFamily="inherit">Farm Alpha (18 turbines)</text>
            <rect x="455" y="15" width="165" height="26" rx="6" fill="rgba(255,255,255,.75)" />
            <text x="537" y="32" textAnchor="middle" fontSize="10" fill="#185FA5" fontWeight="600" fontFamily="inherit">Farm Beta (24 turbines)</text>
            <rect x="255" y="118" width="130" height="22" rx="5" fill="rgba(255,255,255,.85)" />
            <text x="320" y="133" textAnchor="middle" fontSize="10" fill="#5F5E5A" fontWeight="600" fontFamily="inherit">🏠 Base Station</text>

            {/* turbines */}
            {[[55,75],[95,60],[140,72],[65,110],[110,100],[155,95],[75,145],[125,135]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="#9FE1CB" stroke="#0F6E56" strokeWidth="0.5" />
            ))}
            {[[475,68],[515,55],[560,72],[488,102],[530,90],[575,88],[500,135],[545,125]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="#B5D4F4" stroke="#185FA5" strokeWidth="0.5" />
            ))}

            {/* flight trails */}
            {inFlight.map(d => {
  const pos = positions[d.id]
  if (!pos) return null
  return (
    <line key={d.id + '-trail'}
      x1={320} y1={155} x2={pos.cx} y2={pos.cy}
      stroke={droneColor(d.status)}
      strokeWidth="1" strokeDasharray="4 4" opacity=".3"
      style={{ transition: 'x2 2s ease, y2 2s ease' }}
    />
  )
})}

            {/* drones */}
            {drones.map(d => {
  const pos = positions[d.id]
  if (!pos) return null
  const color = droneColor(d.status)
  const isFlying = d.status === 'inflight' || d.status === 'critical'
  const transition = isFlying ? 'transform 2s ease' : 'transform 0.5s ease'

  return (
    <g
      key={d.id}
      style={{ cursor: 'pointer', transform: `translate(${pos.cx}px, ${pos.cy}px)`, transition }}
      onClick={() => setTooltip(tooltip?.id === d.id ? null : { ...d, ...pos })}
    >
      {d.status === 'critical' && (
        <circle r="13" fill="#E24B4A" fillOpacity=".25" className="drone-blink" />
      )}
      {d.status === 'inflight' && (
        <circle r="13" fill="#1D9E75" fillOpacity=".2" className="drone-pulse" />
      )}
      <circle r="9" fill={color} stroke="#fff" strokeWidth="2" />
      <text
        textAnchor="middle" dy="4"
        fontSize="8" fill="#fff" fontWeight="700" fontFamily="inherit"
      >
        {d.id.replace('DRN-', '')}
      </text>
    </g>
  )
})}
          </svg>

          {/* tooltip */}
          {tooltip && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 11px', fontSize: 11,
              boxShadow: '0 4px 12px rgba(0,0,0,.1)', minWidth: 150
            }}>
              <div style={{ fontWeight: 600, marginBottom: 5 }}>{tooltip.id}</div>
              <div style={{ color: 'var(--text2)', marginBottom: 2 }}>📍 {tooltip.location}</div>
              <div style={{ color: droneColor(tooltip.status), marginBottom: 2 }}>
                ● {tooltip.status === 'inflight' ? 'In Flight' : tooltip.status === 'critical' ? '⚠ Conn. Loss' : 'At Base'}
              </div>
              <div style={{ color: 'var(--text2)', marginBottom: 2 }}>🔋 {tooltip.battery}%</div>
              <div style={{ color: 'var(--text2)', marginBottom: 2 }}>📏 {tooltip.altitude > 0 ? tooltip.altitude + 'm' : '—'}</div>
              <div style={{ color: 'var(--text2)' }}>💨 {tooltip.speed > 0 ? tooltip.speed + ' km/h' : '—'}</div>
              <button className="btn btn-sm" style={{ marginTop: 6, width: '100%' }}
                onClick={() => setTooltip(null)}>Close</button>
            </div>
          )}

          {/* legend */}
          <div style={{
            position: 'absolute', bottom: 8, left: 8,
            background: 'rgba(255,255,255,.9)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '5px 10px', display: 'flex', gap: 10, fontSize: 10
          }}>
            {[['#1D9E75','In flight'],['#888780','At base'],['#E24B4A','Alert']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text2)' }}>
                <svg width="10" height="10"><circle cx="5" cy="5" r="4" fill={c} /></svg>{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FARM STATUS */}
      <div className="two-col">
        <div className="card">
          <div className="card-header"><div className="card-title">Farm Alpha</div>
            <span className={`pill ${inFlight.some(d => d.location?.includes('Alpha')) ? 'pill-inflight' : 'pill-ready'}`}>
              {inFlight.some(d => d.location?.includes('Alpha')) ? 'Active' : 'No drones'}
            </span>
          </div>
          {inFlight.filter(d => d.location?.includes('Alpha')).map(d => (
            <div className="info-row" key={d.id}>
              <span className="info-label">{d.id}</span>
              <span className="info-value">{d.location} · 🔋{d.battery}%</span>
            </div>
          ))}
          <div className="info-row"><span className="info-label">Wind speed</span><span className="info-value" style={{ color: 'var(--acc)' }}>22 km/h ✓</span></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Farm Beta</div>
            <span className={`pill ${inFlight.some(d => d.location?.includes('Beta')) ? 'pill-critical' : 'pill-ready'}`}>
              {inFlight.some(d => d.location?.includes('Beta')) ? 'Alert' : 'No drones'}
            </span>
          </div>
          {inFlight.filter(d => d.location?.includes('Beta')).map(d => (
            <div className="info-row" key={d.id}>
              <span className="info-label">{d.id}</span>
              <span className="info-value">{d.location} · 🔋{d.battery}%</span>
            </div>
          ))}
          <div className="info-row"><span className="info-label">Wind speed</span><span className="info-value" style={{ color: 'var(--warn)' }}>38 km/h ⚠</span></div>
        </div>
      </div>
    </div>
  )
}