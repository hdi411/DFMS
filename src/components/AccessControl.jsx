export default function AccessControl({ showToast }) {
  const roles = [
    { role: 'Operations Manager', override: '✓ Full', dispatch: '✓ Full',    reports: '✓ Full',    admin: '✓ Full',      overrideColor: 'var(--acc)', dispatchColor: 'var(--acc)', reportsColor: 'var(--acc)', adminColor: 'var(--acc)' },
    { role: 'Technician',         override: '✗ None', dispatch: 'Limited',   reports: 'View only', admin: '✗ None',      overrideColor: 'var(--danger)', dispatchColor: 'var(--warn)', reportsColor: 'var(--warn)', adminColor: 'var(--danger)' },
    { role: 'Safety Officer',     override: 'Emergency', dispatch: '✗ None', reports: '✓ Full',    admin: '✗ None',      overrideColor: 'var(--warn)', dispatchColor: 'var(--danger)', reportsColor: 'var(--acc)', adminColor: 'var(--danger)' },
    { role: 'IT Analyst',         override: '✗ None', dispatch: '✗ None',   reports: '✓ Full',    admin: 'System only', overrideColor: 'var(--danger)', dispatchColor: 'var(--danger)', reportsColor: 'var(--acc)', adminColor: 'var(--warn)' },
    { role: 'Env. Analyst',       override: '✗ None', dispatch: '✗ None',   reports: 'View only', admin: '✗ None',      overrideColor: 'var(--danger)', dispatchColor: 'var(--danger)', reportsColor: 'var(--warn)', adminColor: 'var(--danger)' },
  ]

  const users = [
    { name: 'J. Smith',   role: 'Manager',       badge: 'rb-manager', mfa: true,  online: true },
    { name: 'T. Nguyen',  role: 'Technician',    badge: 'rb-tech',    mfa: true,  online: true },
    { name: 'A. Bakker',  role: 'Technician',    badge: 'rb-tech',    mfa: true,  online: true },
    { name: 'L. Chen',    role: 'Safety Officer', badge: null,        mfa: true,  online: false },
    { name: 'M. de Vries',role: 'IT Analyst',     badge: null,        mfa: false, online: false },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🔑 Access Control</div>
          <div className="page-subtitle">
            Role-based permissions · user management · MFA enforcement (IN-27)
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => showToast('Add user form opened')}
        >
          + Add User
        </button>
      </div>

      <div className="two-col">
        {/* PERMISSIONS MATRIX */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Role Permissions Matrix</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Override</th>
                <th>Dispatch</th>
                <th>Reports</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.role}>
                  <td><strong>{r.role}</strong></td>
                  <td style={{ color: r.overrideColor }}>{r.override}</td>
                  <td style={{ color: r.dispatchColor }}>{r.dispatch}</td>
                  <td style={{ color: r.reportsColor }}>{r.reports}</td>
                  <td style={{ color: r.adminColor }}>{r.admin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ACTIVE USERS */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Active Users</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>MFA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.name}>
                  <td><strong>{u.name}</strong></td>
                  <td>
                    {u.badge
                      ? <span className={`role-badge ${u.badge}`}>{u.role}</span>
                      : <span style={{ fontSize: 11 }}>{u.role}</span>
                    }
                  </td>
                  <td style={{ color: u.mfa ? 'var(--acc)' : 'var(--warn)' }}>
                    {u.mfa ? '✓ Active' : '⚠ Pending'}
                  </td>
                  <td>
                    <span className={`pill ${u.online ? 'pill-ready' : 'pill-offline'}`}>
                      {u.online ? '● Online' : 'Offline'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}