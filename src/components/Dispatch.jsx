export default function Dispatch({ onOverride, showToast }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📡 Dispatch Center</div>
          <div className="page-subtitle">Drone availability matching · weather validation · multi-drone coordination</div>
        </div>
        <button className="btn btn-danger" onClick={onOverride}>
          ⚠️ Emergency Manual Override
        </button>
      </div>

      <div className="two-col">
        {/* QUEUE */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⏳ Pending Dispatch Queue</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
                Farm Beta — T-23 to T-27 inspection
              </div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>
                Priority: High · Est. 2h 15m · Requested by: L. Chen
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="pill pill-maintenance">⚠ Weather Hold</span>
                <button className="btn btn-warn btn-sm" onClick={onOverride}>
                  🔓 Override Hold
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
                Farm Alpha — T-1 to T-6 routine check
              </div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>
                Priority: Medium · Est. 3h · Requested by: J. Smith
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="pill pill-ready">✓ Weather Clear</span>
                <button className="btn btn-primary btn-sm"
                  onClick={() => showToast('DRN-06 dispatched to Farm Alpha T-1 mission')}>
                  🚁 Dispatch DRN-06
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AVAILABILITY MATCH */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔍 Availability Match — DRN-06</div>
          </div>
          <div className="telem-grid">
            <div className="telem-item">
              <div className="telem-label">Assigned drone</div>
              <div className="telem-value">DRN-06</div>
            </div>
            <div className="telem-item">
              <div className="telem-label">Battery level</div>
              <div className="telem-value" style={{ color: 'var(--acc)' }}>95%</div>
            </div>
            <div className="telem-item">
              <div className="telem-label">Certification</div>
              <div className="telem-value" style={{ color: 'var(--acc)', fontSize: 12 }}>✓ Valid</div>
            </div>
            <div className="telem-item">
              <div className="telem-label">Pre-flight check</div>
              <div className="telem-value" style={{ color: 'var(--acc)', fontSize: 12 }}>✓ Passed</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)', padding: '6px 0', borderTop: '1px solid var(--border)' }}>
            Technician: T. Nguyen · Cert #TN-2024-88 · Validated 14:18 UTC
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <button className="btn btn-primary" style={{ flex: 1 }}
              onClick={() => showToast('✅ DRN-06 confirmed and dispatched to Farm Alpha')}>
              ✓ Confirm & Dispatch
            </button>
            <button className="btn" style={{ flex: 1 }}
              onClick={() => showToast('Mission rescheduled to next available slot')}>
              Reschedule
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE MISSIONS */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🔄 Multi-Drone Coordination — Active Missions</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mission ID</th>
              <th>Farm</th>
              <th>Drone(s)</th>
              <th>Progress</th>
              <th>ETA</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>MSN-0041</strong></td>
              <td>Farm Alpha</td>
              <td>DRN-01, DRN-02</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="bat-bar" style={{ width: 80 }}>
                    <div className="bat-fill" style={{ width: '67%', background: 'var(--acc)' }} />
                  </div>
                  67%
                </div>
              </td>
              <td>~45 min</td>
              <td><span className="pill pill-inflight">In Progress</span></td>
              <td><button className="btn btn-sm" onClick={() => showToast('MSN-0041 details opened')}>Details</button></td>
            </tr>
            <tr>
              <td><strong>MSN-0040</strong></td>
              <td>Farm Beta</td>
              <td>DRN-04</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="bat-bar" style={{ width: 80 }}>
                    <div className="bat-fill" style={{ width: '23%', background: 'var(--danger)' }} />
                  </div>
                  23%
                </div>
              </td>
              <td>Halted</td>
              <td><span className="pill pill-critical">⚠ Conn. Loss</span></td>
              <td><button className="btn btn-danger btn-sm" onClick={onOverride}>Override</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}