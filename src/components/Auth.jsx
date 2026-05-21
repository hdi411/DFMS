import { useState } from 'react'

export default function Auth({ onLogin }) {
  const [role, setRole] = useState('manager')

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🚁</div>
          <div>
            <div className="auth-brand">WindTech DFMS</div>
            <div className="auth-brand-sub">Drone Fleet Management System</div>
          </div>
        </div>

        <div className="role-tabs">
          <div
            className={`role-tab ${role === 'manager' ? 'active' : ''}`}
            onClick={() => setRole('manager')}
          >
            ⚙️ Operations Manager
          </div>
          <div
            className={`role-tab ${role === 'technician' ? 'active' : ''}`}
            onClick={() => setRole('technician')}
          >
            🔧 Technician
          </div>
        </div>

        <div className="form-field">
          <label>Email address</label>
          <input
            type="email"
            value={role === 'manager' ? 'j.smith@windtech.com' : 't.nguyen@windtech.com'}
            readOnly
          />
        </div>

        <div className="form-field">
          <label>Password</label>
          <input type="password" value="••••••••" readOnly />
        </div>

        <div className="mfa-badge">🔐 MFA Active — Authenticator App</div>

        <br />

        <button className="btn-login" onClick={() => onLogin(role)}>
          Sign in to DFMS
        </button>

        <div className="auth-footer">
          WindTech SSO · Role-Based Access Control · AES-256 Encrypted
        </div>
      </div>
    </div>
  )
}