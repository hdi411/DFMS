import { useState } from 'react'
import { telemetry } from '../data/drones'

const DRONE_TABS = ['DRN-01', 'DRN-02', 'DRN-04', 'DRN-06']

export default function Telemetry() {
  const [selected, setSelected] = useState('DRN-01')
  const d = telemetry[selected]

  function batColor(pct) {
    if (pct > 60) return 'var(--acc)'
    if (pct > 35) return 'var(--warn)'
    return 'var(--danger)'
  }

  function missionPillClass(status) {
    if (status === 'In Progress') return 'pill-inflight'
    if (status === 'Ready')       return 'pill-ready'
    return 'pill-critical'
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📈 Live Telemetry</div>
          <div className="page-subtitle">
            <span className="live-dot" /> Real-time drone sensor data · refreshes every 2s
          </div>
        </div>
      </div>

      {/* DRONE TABS */}
      <div className="tabs">
        {DRONE_TABS.map(id => (
          <div
            key={id}
            className={`tab ${selected === id ? 'active' : ''}`}
            onClick={() => setSelected(id)}
          >
            {id}{id === 'DRN-04' ? ' ⚠' : ''}
          </div>
        ))}
      </div>

      {/* TELEMETRY GRID */}
      <div className="telem-grid">
        <div className="telem-item">
          <div className="telem-label">🔋 Battery Level</div>
          <div className="telem-value" style={{ color: batColor(d.battery) }}>
            {d.battery}%
          </div>
          <div className="bat-bar" style={{ width: '100%', height: 8, marginTop: 6 }}>
            <div className="bat-fill" style={{ width: d.battery + '%', background: batColor(d.battery) }} />
          </div>
        </div>
        <div className="telem-item">
          <div className="telem-label">📏 Altitude</div>
          <div className="telem-value">{d.altitude > 0 ? `${d.altitude} m` : '—'}</div>
        </div>
        <div className="telem-item">
          <div className="telem-label">💨 Airspeed</div>
          <div className="telem-value">{d.speed > 0 ? `${d.speed} km/h` : '—'}</div>
        </div>
        <div className="telem-item">
          <div className="telem-label">🌡️ Internal Temp</div>
          <div className="telem-value">{d.temp ? `${d.temp}°C` : '—'}</div>
        </div>
        <div className="telem-item">
          <div className="telem-label">📍 GPS Position</div>
          <div className="telem-value" style={{ fontSize: 12 }}>{d.gps}</div>
        </div>
        <div className="telem-item">
          <div className="telem-label">📶 Signal Strength</div>
          <div className="telem-value" style={{ color: d.signal === 'Lost' ? 'var(--danger)' : 'var(--acc)' }}>
            {d.signal}
          </div>
        </div>
        <div className="telem-item">
          <div className="telem-label">⏱️ Flight Time</div>
          <div className="telem-value">{d.flightTime}</div>
        </div>
        <div className="telem-item">
          <div className="telem-label">📷 Camera Status</div>
          <div className="telem-value" style={{
            fontSize: 12,
            color: d.camera === 'Unknown' ? 'var(--danger)' : d.camera === 'Standby' ? 'var(--warn)' : 'var(--acc)'
          }}>
            {d.camera}
          </div>
        </div>
      </div>

      {/* MISSION PROGRESS */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📌 Mission Progress — {d.missionId}</div>
          <span className={`pill ${missionPillClass(d.missionStatus)}`}>{d.missionStatus}</span>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: d.missionProg + '%' }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6 }}>
          {d.missionDetail}
        </div>
      </div>
    </div>
  )
}