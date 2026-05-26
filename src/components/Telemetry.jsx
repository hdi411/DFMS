import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Telemetry() {
  const { drones } = useApp()
  const [selectedId, setSelectedId] = useState('DRN-01')

  const visibleDrones = drones.filter(d =>
    d.status === 'inflight' || d.status === 'critical' || d.status === 'ready'
  )

  const d = drones.find(d => d.id === selectedId) || drones[0]

  function batColor(pct) {
    if (pct > 60) return 'var(--acc)'
    if (pct > 35) return 'var(--warn)'
    return 'var(--danger)'
  }

  function missionPillClass(status) {
    if (status === 'inflight')  return 'pill-inflight'
    if (status === 'ready')     return 'pill-ready'
    return 'pill-critical'
  }

  function missionLabel(status) {
    if (status === 'inflight')  return 'In Progress'
    if (status === 'ready')     return 'Ready'
    if (status === 'critical')  return 'Connection Lost'
    return status
  }

  function missionDetail(drone) {
    if (drone.status === 'inflight')  return `Active mission · ${drone.location} · altitude ${drone.altitude}m`
    if (drone.status === 'critical')  return `Signal lost · last known: ${drone.location} · auto-return initiated`
    if (drone.status === 'ready')     return `At base · awaiting dispatch · ${drone.location}`
    return '—'
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📈 Live Telemetry</div>
          <div className="page-subtitle">
            <span className="live-dot" /> Real-time drone sensor data · {visibleDrones.length} drones active
          </div>
        </div>
      </div>

      {/* DRONE TABS */}
      <div className="tabs">
        {visibleDrones.map(drone => (
          <div
            key={drone.id}
            className={`tab ${selectedId === drone.id ? 'active' : ''}`}
            onClick={() => setSelectedId(drone.id)}
          >
            {drone.id}
            {drone.status === 'critical' && ' ⚠'}
          </div>
        ))}
      </div>

      {d && (
        <>
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
              <div className="telem-value">
                {d.status === 'inflight' ? '42°C' : d.status === 'critical' ? '—' : '—'}
              </div>
            </div>
            <div className="telem-item">
              <div className="telem-label">📍 GPS Position</div>
              <div className="telem-value" style={{ fontSize: 12 }}>
                {d.status === 'inflight' ? '52.31°N 4.91°E' : d.status === 'critical' ? '52.28°N 5.02°E' : '52.30°N 4.95°E'}
              </div>
            </div>
            <div className="telem-item">
              <div className="telem-label">📶 Signal</div>
              <div className="telem-value" style={{ color: d.status === 'critical' ? 'var(--danger)' : 'var(--acc)' }}>
                {d.status === 'critical' ? 'Lost' : 'Strong'}
              </div>
            </div>
            <div className="telem-item">
              <div className="telem-label">⏱️ Flight Time</div>
              <div className="telem-value">
                {d.status === 'inflight' ? '1h 23m' : d.status === 'critical' ? '2h 01m' : '—'}
              </div>
            </div>
            <div className="telem-item">
              <div className="telem-label">📷 Camera</div>
              <div className="telem-value" style={{
                fontSize: 12,
                color: d.status === 'critical' ? 'var(--danger)' : d.status === 'inflight' ? 'var(--acc)' : 'var(--text3)'
              }}>
                {d.status === 'inflight' ? '4K Active' : d.status === 'critical' ? 'Unknown' : 'Standby'}
              </div>
            </div>
          </div>

          {/* MISSION STATUS */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📌 Mission Status — {d.id}</div>
              <span className={`pill ${missionPillClass(d.status)}`}>
                {missionLabel(d.status)}
              </span>
            </div>
            {d.status === 'inflight' && (
              <div className="progress-bar" style={{ height: 10, marginBottom: 6 }}>
                <div className="progress-fill" style={{ width: '67%' }} />
              </div>
            )}
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>
              {missionDetail(d)}
            </div>
          </div>

          {/* LOW BATTERY WARNING */}
          {d.battery <= 35 && (
            <div style={{
              background: '#FCEBEB', border: '1px solid #F7C1C1',
              borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#791F1F'
            }}>
              🔴 <strong>Critical battery level</strong> — {d.id} battery at {d.battery}%.
              Return-to-base threshold reached. Immediate recall recommended.
            </div>
          )}
        </>
      )}
    </div>
  )
}