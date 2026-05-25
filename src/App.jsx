import { useState } from 'react'
import { AppProvider } from './context/AppContext'
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
import TeamStatus from './components/TeamStatus'
import AccessControl from './components/AccessControl'
import MyWork from './components/MyWork'
import Maintenance from './components/Maintenance'
import MaintenanceQueue from './components/MaintenanceQueue'
import OverrideModal from './components/OverrideModal'

export default function App() {
  const [user, setUser]               = useState(null)
  const [page, setPage]               = useState('dashboard')
  const [showOverride, setShowOverride] = useState(false)
  const [toast, setToast]             = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleLogin(role) {
    setUser(role === 'manager'
      ? { name: 'J. Smith',  initials: 'JS', role: 'manager',    label: 'Manager' }
      : { name: 'T. Nguyen', initials: 'TN', role: 'technician', label: 'Technician' }
    )
    setPage(role === 'manager' ? 'dashboard' : 'mywork')
  }

  function handleLogout() {
    setUser(null)
    setPage('dashboard')
  }

  if (!user) return (
    <AppProvider>
      <Auth onLogin={handleLogin} />
    </AppProvider>
  )

  const pageProps = { user, onNavigate: setPage, onOverride: () => setShowOverride(true), showToast }

  const pages = {
    dashboard:        <Dashboard        {...pageProps} />,
    map:              <LiveMap          {...pageProps} />,
    drones:           <DroneFleet       {...pageProps} />,
    dispatch:         <Dispatch         {...pageProps} />,
    weather:          <Weather          {...pageProps} />,
    telemetry:        <Telemetry        {...pageProps} />,
    alerts:           <Alerts           {...pageProps} />,
    logs:             <SystemLogs       {...pageProps} />,
    teamstatus:       <TeamStatus       {...pageProps} />,
    access:           <AccessControl    {...pageProps} />,
    mywork:           <MyWork           {...pageProps} />,
    maintenance:      <Maintenance      {...pageProps} />,
    maintenancequeue: <MaintenanceQueue {...pageProps} />,
  }

  return (
    <AppProvider>
      <div className="app-shell">
        <Layout
          user={user}
          page={page}
          onNavigate={setPage}
          onLogout={handleLogout}
          onOverride={() => setShowOverride(true)}
        >
          {pages[page] || <Dashboard {...pageProps} />}
        </Layout>

        {showOverride && (
          <OverrideModal
            user={user}
            onClose={() => setShowOverride(false)}
            onConfirm={() => {
              setShowOverride(false)
              showToast('✅ Override confirmed and logged')
            }}
          />
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </AppProvider>
  )
}