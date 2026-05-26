import { useApp } from '../context/AppContext'

export default function TeamStatus() {
  const { queue, preflightChecks } = useApp()
  const preflightDone = preflightChecks.every(c => c.done)

  const BASE_TEAM = [
    {
      name: 'J. Smith',
      role: 'Operations Manager',
      badge: 'rb-manager',
      avatar: 'JS',
      avatarBg: 'var(--acc)',
      status: 'online',
      currentTask: 'Monitoring DRN-04 connectivity loss recovery',
      location: 'Control Room — Base Station',
      since: '13:41',
      staticTasks: [
        { label: 'Review Farm Beta dispatch queue',    done: true },
        { label: 'Approve DRN-06 mission plan',        done: true },
        { label: 'Resolve DRN-04 connectivity alert',  done: false },
        { label: 'End-of-day fleet report',            done: false },
      ]
    },
    {
      name: 'T. Nguyen',
      role: 'Technician',
      badge: 'rb-tech',
      avatar: 'TN',
      avatarBg: 'var(--info)',
      status: 'online',
      currentTask: 'Pre-flight safety check on DRN-06',
      location: 'Hangar A — Base Station',
      since: '14:18',
      staticTasks: [
        { label: 'Cert verification #TN-2024-88', done: true },
        { label: 'DRN-06 pre-flight check',       done: preflightDone },
      ]
    },
    {
      name: 'A. Bakker',
      role: 'Technician',
      badge: 'rb-tech',
      avatar: 'AB',
      avatarBg: 'var(--info)',
      status: 'online',
      currentTask: 'On-site inspection at Farm Alpha T-9',
      location: 'Farm Alpha — Field',
      since: '13:55',
      staticTasks: [
        { label: 'Travel to Farm Alpha T-9',        done: true },
        { label: 'Visual corrosion inspection T-9', done: false },
      ]
    },
    {
      name: 'L. Chen',
      role: 'Safety Officer',
      badge: null,
      avatar: 'LC',
      avatarBg: '#7B5EA7',
      status: 'offline',
      currentTask: 'Off shift',
      location: '—',
      since: '—',
      staticTasks: [
        { label: 'Morning safety briefing',      done: true },
        { label: 'Farm Beta weather assessment', done: true },
      ]
    },
    {
      name: 'M. de Vries',
      role: 'IT Analyst',
      badge: null,
      avatar: 'MD',
      avatarBg: '#888780',
      status: 'offline',
      currentTask: 'Off shift',
      location: '—',
      since: '—',
      staticTasks: [
        { label: 'WFS API integration check',  done: true },
        { label: 'System backup verification', done: true },
      ]
    },
  ]

  const team = BASE_TEAM.map(member => {
    const queueTasks = queue
      .filter(q => q.assignedTo === member.name)
      .map(q => ({
        label: `${q.turbine} — ${q.issue}`,
        done: !!q.completed,
        severity: q.severity,
      }))
    return { ...member, tasks: [...member.staticTasks, ...queueTasks] }
  })

  const online   = team.filter(t => t.status === 'online')
  const offline  = team.filter(t => t.status === 'offline')
  const allTasks = team.flatMap(t => t.tasks)
  const doneTasks = allTasks.filter(t => t.done).length
  const pendTasks = allTasks.filter(t => !t.done).length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">👥 Team Status</div>
          <div className="page-subtitle">
            <span className="live-dot" /> Live · {online.length} on duty · {offline.length} off shift
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: '🟢 On Duty',      value: online.length,  color: 'var(--acc)' },
          { label: '⚫ Off Shift',     value: offline.length, color: 'var(--text3)' },
          { label: '✅ Tasks Done',    value: doneTasks,      color: 'var(--acc)' },
          { label: '⏳ Tasks Pending', value: pendTasks,      color: 'var(--warn)' },
        ].map((m, i) => (
          <div className="metric-card" key={i}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>On Duty</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {online.map(p => <PersonCard key={p.name} person={p} />)}
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Off Shift</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {offline.map(p => <PersonCard key={p.name} person={p} />)}
      </div>
    </div>
  )
}

const SEVERITY_DOT = {
  critical: '#E24B4A', high: '#E07A00', medium: '#BA7517', low: '#2E9E50',
}

function PersonCard({ person: p }) {
  const done     = p.tasks.filter(t => t.done).length
  const total    = p.tasks.length
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0
  const isOnline = p.status === 'online'
  const queueCount = p.tasks.filter(t => t.severity && !t.done).length

  return (
    <div className="card" style={{ opacity: isOnline ? 1 : .6 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: p.avatarBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 13, fontWeight: 600, position: 'relative'
          }}>
            {p.avatar}
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 10, height: 10, borderRadius: '50%',
              background: isOnline ? 'var(--acc)' : 'var(--text3)',
              border: '2px solid var(--bg2)'
            }} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
              {p.badge
                ? <span className={`role-badge ${p.badge}`}>{p.role}</span>
                : <span style={{ fontSize: 10, color: 'var(--text3)' }}>{p.role}</span>
              }
              {queueCount > 0 && (
                <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 20, background: '#FAEEDA', color: '#633806', fontWeight: 600 }}>
                  {queueCount} maintenance task{queueCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <span className={`pill ${isOnline ? 'pill-ready' : 'pill-offline'}`}>
              {isOnline ? '● Online' : 'Offline'}
            </span>
          </div>

          {isOnline && (
            <>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>
                🔄 <strong>Now:</strong> {p.currentTask}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>
                📍 {p.location} · since {p.since}
              </div>
            </>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8 }}>
            {p.tasks.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span style={{ color: t.done ? 'var(--acc)' : 'var(--border2)', fontSize: 13 }}>
                  {t.done ? '✓' : '○'}
                </span>
                {t.severity && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: SEVERITY_DOT[t.severity] || 'var(--text3)' }} />
                )}
                <span style={{ color: t.done ? 'var(--text3)' : 'var(--text)', textDecoration: t.done ? 'line-through' : 'none' }}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--bg3)', overflow: 'hidden' }}>
              <div style={{ width: pct + '%', height: '100%', background: pct === 100 ? 'var(--acc)' : 'var(--info)', borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 10, color: 'var(--text3)', flexShrink: 0 }}>{done}/{total} tasks</span>
          </div>
        </div>
      </div>
    </div>
  )
}