import { useState, useEffect } from 'react'

const INITIAL_DRONES = [
  { id: 'DRN-01', cx: 110, cy: 80,  fill: '#1D9E75', status: 'In Flight',    battery: '87%', alt: '340m', speed: '28 km/h', location: 'Farm Alpha · T-7' },
  { id: 'DRN-02', cx: 150, cy: 95,  fill: '#1D9E75', status: 'In Flight',    battery: '62%', alt: '280m', speed: '24 km/h', location: 'Farm Alpha · T-12' },
  { id: 'DRN-03', cx: 290, cy: 155, fill: '#888780', status: 'Ready',        battery: '100%', alt: '—',  speed: '—',       location: 'Base Station' },
  { id: 'DRN-04', cx: 510, cy: 90,  fill: '#E24B4A', status: '⚠ Conn. Loss', battery: '41%', alt: '190m', speed: '—',      location: 'Farm Beta · T-17' },
  { id: 'DRN-06', cx: 335, cy: 155, fill: '#888780', status: 'Ready',        battery: '95%', alt: '—',  speed: '—',       location: 'Base Station' },
]

// 飞行中的无人机在这个范围内随机漂移
const BOUNDS = {
  'DRN-01': { minX: 60,  maxX: 175, minY: 55,  maxY: 150 },
  'DRN-02': { minX: 80,  maxX: 185, minY: 60,  maxY: 155 },
  'DRN-04': { minX: 460, maxX: 580, minY: 55,  maxY: 140 },
}

function randomDrift(val, min, max, step = 6) {
  const next = val + (Math.random() - 0.5) * step * 2
  return Math.min(Math.max(next, min), max)
}

export default function LiveMap({ showToast }) {
  const [drones, setDrones] = useState(INITIAL_DRONES)
  const [tooltip, setTooltip] = useState(null)
  const [tick, setTick] = useState(0)

  // 每2秒移动一次飞行中的无人机
  useEffect(() => {
    const interval = setInterval(() => {
      setDrones(prev => prev.map(d => {
        const b = BOUNDS[d.id]
        if (!b) return d
        return {
          ...d,
          cx: randomDrift(d.cx, b.minX, b.maxX),
          cy: randomDrift(d.cy, b.minY, b.maxY),
        }
      }))
      setTick(t => t + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🗺️ Live Drone Map</div>
          <div className="page-subtitle">
            <span className="live-dot" /> Real-time drone positions · updates every 2s
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>
            Last update: {new Date().toLocaleTimeString()}
          </span>
          <button className="btn" onClick={() => showToast('Map refreshed — positions updated')}>
            🔄 Refresh
          </button>
        </div>
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
                @keyframes pulse-ring {
                  0%,100% { r: 13; opacity: .7; }
                  50%      { r: 19; opacity: .1; }
                }
                @keyframes blink-red {
                  0%,100% { opacity: 1; }
                  50%      { opacity: .3; }
                }
                .drone-pulse { animation: pulse-ring 2s ease-in-out infinite; }
                .drone-blink { animation: blink-red 1s ease-in-out infinite; }
              `}</style>
            </defs>

            {/* terrain */}
            <rect width="640" height="280" fill="#D8EDDE" />
            <rect x="0" y="190" width="640" height="90" fill="#C5E3CC" />

            {/* grid lines */}
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

            {/* turbines farm alpha */}
            {[[55,75],[95,60],[140,72],[65,110],[110,100],[155,95],[75,145],[125,135]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="#9FE1CB" stroke="#0F6E56" strokeWidth="0.5" />
            ))}

            {/* turbines farm beta */}
            {[[475,68],[515,55],[560,72],[488,102],[530,90],[575,88],[500,135],[545,125]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="#B5D4F4" stroke="#185FA5" strokeWidth="0.5" />
            ))}

            {/* flight path trails — follow current drone positions */}
            {drones.filter(d => BOUNDS[d.id]).map(d => (
              <line
                key={d.id + '-trail'}
                x1={320} y1={155}
                x2={d.cx} y2={d.cy}
                stroke={d.fill}
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity=".35"
              />
            ))}

            {/* drones */}
            {drones.map(d => (
              <g
                key={d.id}
                style={{ cursor: 'pointer', transition: 'all 1.8s ease' }}
                onClick={() => setTooltip(tooltip?.id === d.id ? null : d)}
              >
                {/* pulse ring for flying drones */}
                {d.id === 'DRN-04' ? (
                  <circle cx={d.cx} cy={d.cy} r="13" fill="#E24B4A" fillOpacity=".25" className="drone-blink" />
                ) : BOUNDS[d.id] ? (
                  <circle cx={d.cx} cy={d.cy} r="13" fill={d.fill} fillOpacity=".2" className="drone-pulse" />
                ) : null}

                {/* drone body */}
                <circle
                  cx={d.cx} cy={d.cy} r="9"
                  fill={d.fill} stroke="#fff" strokeWidth="2"
                  style={{ transition: 'cx 1.8s ease, cy 1.8s ease' }}
                />
                <text
                  x={d.cx} y={d.cy + 4}
                  textAnchor="middle" fontSize="8"
                  fill="#fff" fontWeight="700" fontFamily="inherit"
                  style={{ transition: 'x 1.8s ease, y 1.8s ease' }}
                >
                  {d.id.replace('DRN-', '')}
                </text>
              </g>
            ))}
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
              <div style={{ color: tooltip.fill, marginBottom: 2 }}>● {tooltip.status}</div>
              <div style={{ color: 'var(--text2)', marginBottom: 2 }}>🔋 {tooltip.battery}</div>
              <div style={{ color: 'var(--text2)', marginBottom: 2 }}>📏 {tooltip.alt}</div>
              <div style={{ color: 'var(--text2)' }}>💨 {tooltip.speed}</div>
              <button className="btn btn-sm" style={{ marginTop: 6, width: '100%' }} onClick={() => setTooltip(null)}>Close</button>
            </div>
          )}

          {/* legend */}
          <div style={{
            position: 'absolute', bottom: 8, left: 8,
            background: 'rgba(255,255,255,.9)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '5px 10px', display: 'flex', gap: 10, fontSize: 10
          }}>
            {[['#1D9E75','In flight'],['#888780','Ready'],['#E24B4A','Alert']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text2)' }}>
                <svg width="10" height="10"><circle cx="5" cy="5" r="4" fill={c} /></svg>{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header"><div className="card-title">Farm Alpha</div><span className="pill pill-ready">Ops Normal</span></div>
          <div className="info-row"><span className="info-label">Active drones</span><span className="info-value">DRN-01, DRN-02</span></div>
          <div className="info-row"><span className="info-label">Wind speed</span><span className="info-value" style={{color:'var(--acc)'}}>22 km/h ✓</span></div>
          <div className="info-row"><span className="info-label">Coverage today</span><span className="info-value">67%</span></div>
          <div className="info-row"><span className="info-label">ETA complete</span><span className="info-value">~45 min</span></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Farm Beta</div><span className="pill pill-critical">⚠ Alert</span></div>
          <div className="info-row"><span className="info-label">Active drones</span><span className="info-value">DRN-04 (conn. loss)</span></div>
          <div className="info-row"><span className="info-label">Wind speed</span><span className="info-value" style={{color:'var(--warn)'}}>38 km/h ⚠</span></div>
          <div className="info-row"><span className="info-label">Coverage today</span><span className="info-value">23%</span></div>
          <div className="info-row"><span className="info-label">Mission status</span><span className="info-value" style={{color:'var(--danger)'}}>Halted</span></div>
        </div>
      </div>
    </div>
  )
}