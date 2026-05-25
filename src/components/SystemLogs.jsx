import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function SystemLogs({ showToast }) {
  const { logs } = useApp()
  const [filter, setFilter] = useState('ALL')

  const filtered = filter === 'ALL'
    ? logs
    : logs.filter(l => l.level === filter)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📋 System Logs</div>
          <div className="page-subtitle">
            <span className="live-dot" /> Audit trail · flight logs · compliance export (IN-17)
          </div>
        </div>
        <div className="btn-row">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r)',
              background: 'var(--bg2)',
              color: 'var(--text)',
              fontSize: 11,
            }}
          >
            <option value="ALL">All levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="OK">OK</option>
          </select>
          <button
            className="btn"
            onClick={() => showToast('Flight log exported as CSV — IN-17 compliance format')}
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Audit &amp; Flight Log</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
            <span className="live-dot" /> Live · {filtered.length} entries
          </div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--text3)', fontSize: 12 }}>
            No log entries for this level
          </div>
        ) : (
          filtered.map((log, i) => (
            <div className="log-entry" key={i}>
              <div className="log-time">{log.time}</div>
              <div className={`log-level ${log.level}`}>{log.level}</div>
              <div className="log-message">{log.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}