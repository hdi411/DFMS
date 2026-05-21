import { useState } from 'react'
import Auth from './components/Auth'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import LiveMap from './components/LiveMap'
import DroneFleet from './components/DroneFleet'
import Dispatch from './components/Dispatch'
import Weather from './components/Weather'
import Telemetry from './components/Telemetry'
import Alerts from './components/Alerts'
import SystemLogs from './components/SystemLogs'
import AccessControl from './components/AccessControl'
import MyWork from './components/MyWork'
import OverrideModal from './components/OverrideModal'
import Maintenance from './components/Maintenance'
import TeamStatus from './components/TeamStatus'
import MaintenanceQueue from './components/MaintenanceQueue'

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('dashboard')
  const [showOverride, setShowOverride] = useState(false)
  const [alertCount, setAlertCount] = useState(3)
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleLogin(role) {
    setUser(role === 'manager'
      ? { name: 'J. Smith', initials: 'JS', role: 'manager', label: 'Manager' }
      : { name: 'T. Nguyen', initials: 'TN', role: 'technician', label: 'Technician' }
    )
    setPage(role === 'manager' ? 'dashboard' : 'mywork')
  }

  function handleLogout() {
    setUser(null)
    setPage('dashboard')
  }

  if (!user) return <Auth onLogin={handleLogin} />

  const pageProps = {
    user,
    onNavigate: setPage,
    onOverride: () => setShowOverride(true),
    showToast,
  }

  const pages = {
    dashboard:  <Dashboard {...pageProps} alertCount={alertCount} />,
    map:        <LiveMap {...pageProps} />,
    drones:     <DroneFleet {...pageProps} showToast={showToast} />,
    dispatch:   <Dispatch {...pageProps} />,
    weather:    <Weather {...pageProps} />,
    telemetry:  <Telemetry {...pageProps} />,
    alerts:     <Alerts {...pageProps} alertCount={alertCount} setAlertCount={setAlertCount} />,
    logs:       <SystemLogs {...pageProps} />,
    access:     <AccessControl {...pageProps} />,
    mywork:     <MyWork {...pageProps} />,
    maintenance: <Maintenance {...pageProps} showToast={showToast} />,
    teamstatus:        <TeamStatus {...pageProps} />,
    maintenancequeue:  <MaintenanceQueue {...pageProps} showToast={showToast} />,
  }

  return (
    <div className="app-shell">
      <Layout
        user={user}
        page={page}
        onNavigate={setPage}
        onLogout={handleLogout}
        onOverride={() => setShowOverride(true)}
        alertCount={alertCount}
      >
        {pages[page] || <Dashboard {...pageProps} alertCount={alertCount} />}
      </Layout>

      {showOverride && (
        <OverrideModal
          user={user}
          onClose={() => setShowOverride(false)}
          onConfirm={() => {
            setShowOverride(false)
            showToast('✅ Override confirmed and logged — audit entry created')
          }}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}