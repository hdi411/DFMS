import { useState } from 'react'
import { sprints, epicNames, epicColors } from '../data/sprints'

export default function SprintBoard({ showToast }) {
  const [activeTab, setActiveTab] = useState('s1')

  const tabs = [
    { id: 's1',      label: 'Sprint 1 · 29 pts' },
    { id: 's2',      label: 'Sprint 2 · 30 pts' },
    { id: 's3',      label: 'Sprint 3 · 30 pts' },
    { id: 'backlog', label: 'Backlog · 20 pts' },
  ]

  const current = sprints[activeTab]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📌 Sprint Board</div>
          <div className="page-subtitle">Active sprints · backlog · story points tracking</div>
        </div>
        {activeTab === 's1' && (
          <button
            className="btn btn-primary"
            onClick={() => showToast('Sprint 1 started — team notified')}
          >
            ▶ Start Sprint
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="tabs">
        {tabs.map(t => (
          <div
            key={t.id}
            className={`tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* SPRINT ITEMS */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            {current.label} — {current.items.length} items · {current.points} story points
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
            {current.items.reduce((a, b) => a + b.pts, 0)} pts total
          </div>
        </div>

        {current.items.map(item => (
          <div className="sprint-item" key={item.id}>
            <div className="sprint-id">{item.id}</div>
            <div className="sprint-name">{item.name}</div>
            <span
              className="epic-tag"
              style={{
                background: epicColors[item.epic].bg,
                color: epicColors[item.epic].color,
              }}
            >
              {epicNames[item.epic]}
            </span>
            <span className="pill pill-todo" style={{ fontSize: 9, marginLeft: 4 }}>
              TO DO
            </span>
            <div className="sprint-pts">{item.pts}</div>
          </div>
        ))}
      </div>
    </div>
  )
}