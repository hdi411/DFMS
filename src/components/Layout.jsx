import { useApp } from '../context/AppContext'

export default function Layout({ user, page, onNavigate, onLogout, onOverride, children }) {
  const { alerts } = useApp()
  const isMgr = user.role === 'manager'
  const alertCount = alerts.length

  return (
    <>
      {/* TOPNAV */}
      <div className="topnav">
        <div className="nav-logo-icon">🚁</div>
        <div className="nav-brand">WindTech DFMS</div>
        <div className="nav-divider" />
        <span className="nav-sprint-badge">Sprint 1 active · 29 pts</span>
        <div className="nav-spacer" />
        <div className="nav-alert-btn" onClick={() => onNavigate('alerts')}>
          {alertCount > 0 && <div className="alert-dot" />}
          <span>{alertCount > 0 ? `${alertCount} active alerts` : 'No alerts'}</span>
        </div>
        <div className="nav-user-btn">
          <div className="avatar" style={{ background: isMgr ? 'var(--acc)' : 'var(--info)' }}>
            {user.initials}
          </div>
          <span>{user.name}</span>
          <span className={`role-badge ${isMgr ? 'rb-manager' : 'rb-tech'}`}>
            {user.label}
          </span>
        </div>
        <button className="btn-signout" onClick={onLogout}>Sign out</button>
      </div>

      {/* BODY */}
      <div className="main-body">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="nav-section">Overview</div>
          <NavItem icon="📊" label="Dashboard" id="dashboard" page={page} onNavigate={onNavigate} />
          <NavItem icon="🗺️" label="Live Map"  id="map"       page={page} onNavigate={onNavigate} />

          <div className="nav-section">Fleet</div>
          <NavItem icon="🚁" label="Drone Fleet"      id="drones"   page={page} onNavigate={onNavigate} />
          <NavItem icon="📡" label="Dispatch Center"  id="dispatch" page={page} onNavigate={onNavigate} badge={{ text: '2', cls: 'nb-warn' }} />
          <NavItem icon="🌤️" label="Weather & Safety" id="weather"  page={page} onNavigate={onNavigate} />

          <div className="nav-section">Monitoring</div>
          <NavItem icon="📈" label="Live Telemetry" id="telemetry" page={page} onNavigate={onNavigate} />
          <NavItem icon="🔔" label="Alerts"         id="alerts"    page={page} onNavigate={onNavigate}
            badge={alertCount > 0 ? { text: alertCount, cls: 'nb-danger' } : null} />
          <NavItem icon="📋" label="System Logs"    id="logs"      page={page} onNavigate={onNavigate} />

          {isMgr && <>
            <div className="nav-section">Operations</div>
            <NavItem icon="👥" label="Team Status"    id="teamstatus" page={page} onNavigate={onNavigate} />
            <NavItem icon="🔑" label="Access Control" id="access"     page={page} onNavigate={onNavigate} />
            <div className="nav-section">Maintenance</div>
            <NavItem icon="🔧" label="Maintenance"       id="maintenance"      page={page} onNavigate={onNavigate} />
            <NavItem icon="📋" label="Maintenance Queue" id="maintenancequeue" page={page} onNavigate={onNavigate} />
          </>}

          {!isMgr && <>
            <div className="nav-section">My Work</div>
            <NavItem icon="✅" label="My Tasks"          id="mywork"           page={page} onNavigate={onNavigate} />
            <NavItem icon="🔧" label="Maintenance"       id="maintenance"      page={page} onNavigate={onNavigate} />
            <NavItem icon="📋" label="Maintenance Queue" id="maintenancequeue" page={page} onNavigate={onNavigate} />
          </>}
        </div>

        {/* CONTENT */}
        <div className="content-area">
          {children}
        </div>
      </div>
    </>
  )
}

function NavItem({ icon, label, id, page, onNavigate, badge }) {
  return (
    <div
      className={`nav-item ${page === id ? 'active' : ''}`}
      onClick={() => onNavigate(id)}
    >
      <span>{icon}</span>
      {label}
      {badge && <span className={`nav-badge ${badge.cls}`}>{badge.text}</span>}
    </div>
  )
}