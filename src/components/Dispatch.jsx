import { useApp } from '../context/AppContext'

export default function Dispatch({ onOverride, showToast }) {
  const { drones, dispatchDrone, recallDrone } = useApp()

  const readyDrones  = drones.filter(d => d.status === 'ready')
  const activeMissions = drones.filter(d => d.status === 'inflight' || d.status === 'critical')

  function handleDispatch(droneId, location) {
    dispatchDrone(droneId, location)
    showToast(`✅ ${droneId} dispatched to ${location}`)
  }

  function handleRecall(droneId) {
    recallDrone(droneId)
    showToast(`${droneId} recall command sent — returning to base`)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📡 Dispatch Center</div>
          <div className="page-subtitle">
            Drone availability matching · weather validation · multi-drone coordination
          </div>
        </div>
        <button className="btn btn-danger" onClick={onOverride}>
          ⚠️ Emergency Manual Override
        </button>
      </div>

      <div className="two-col">
        {/* AVAILABLE DRONES */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">✅ Available for Dispatch</div>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>
              {readyDrones.length} ready
            </span>
          </div>
          {readyDrones.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)', fontSize: 12 }}>
              No drones available right now
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {readyDrones.map(d => (
                <div key={d.id} style={{
                  background: 'var(--bg3)', borderRadius: 8,
                  padding: 10, border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>{d.id} · {d.model}</span>
                    <span style={{ fontSize: 11, color: 'var(--acc)' }}>🔋 {d.battery}%</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>
                    📍 {d.location} · Cert valid ✓
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleDispatch(d.id, 'Farm Alpha · T-1')}
                    >
                      → Farm Alpha
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleDispatch(d.id, 'Farm Beta · T-23')}
                    >
                      → Farm Beta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DISPATCH VALIDATION */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🛡️ Pre-Dispatch Validation</div>
          </div>
          <div className="telem-grid">
            <div className="telem-item">
              <div className="telem-label">Weather Farm Alpha</div>
              <div className="telem-value" style={{ color: 'var(--acc)', fontSize: 12 }}>✓ Clear</div>
            </div>
            <div className="telem-item">
              <div className="telem-label">Weather Farm Beta</div>
              <div className="telem-value" style={{ color: 'var(--warn)', fontSize: 12 }}>⚠ Hold</div>
            </div>
            <div className="telem-item">
              <div className="telem-label">Wind Alpha</div>
              <div className="telem-value" style={{ color: 'var(--acc)' }}>22 km/h</div>
            </div>
            <div className="telem-item">
              <div className="telem-label">Wind Beta</div>
              <div className="telem-value" style={{ color: 'var(--warn)' }}>38 km/h</div>
            </div>
          </div>
          <div style={{
            background: '#FFFBEE', border: '1px solid #FAC775',
            borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#633806', marginTop: 8
          }}>
            ⚠️ Farm Beta dispatch suspended — wind speed approaching limit (45 km/h)
          </div>
          <button
            className="btn btn-warn"
            style={{ width: '100%', marginTop: 10 }}
            onClick={onOverride}
          >
            🔓 Override Weather Hold
          </button>
        </div>
      </div>

      {/* ACTIVE MISSIONS */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🔄 Active Missions</div>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>
            {activeMissions.length} drones deployed
          </span>
        </div>
        {activeMissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)', fontSize: 12 }}>
            No active missions
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Drone</th>
                <th>Location</th>
                <th>Battery</th>
                <th>Altitude</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeMissions.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.id}</strong></td>
                  <td>{d.location}</td>
                  <td>
                    <div className="bat-wrap">
                      <div className="bat-bar">
                        <div className="bat-fill" style={{
                          width: d.battery + '%',
                          background: d.battery > 60 ? 'var(--acc)' : d.battery > 35 ? 'var(--warn)' : 'var(--danger)'
                        }} />
                      </div>
                      {d.battery}%
                    </div>
                  </td>
                  <td>{d.altitude > 0 ? d.altitude + 'm' : '—'}</td>
                  <td>
                    <span className={`pill ${d.status === 'critical' ? 'pill-critical' : 'pill-inflight'}`}>
                      {d.status === 'critical' ? '⚠ Conn. Loss' : '✈ In Flight'}
                    </span>
                  </td>
                  <td>
                    {d.status === 'critical'
                      ? <button className="btn btn-danger btn-sm" onClick={onOverride}>Override</button>
                      : <button className="btn btn-sm" onClick={() => handleRecall(d.id)}>Recall</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}