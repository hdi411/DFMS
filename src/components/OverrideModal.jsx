import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function OverrideModal({ user, onClose, onConfirm }) {
  const { confirmOverride } = useApp()
  const [drone, setDrone]   = useState('DRN-04 — Farm Beta T-17 (connectivity loss recovery)')
  const [reason, setReason] = useState('Connectivity loss — drone recovery required')
  const [note, setNote]     = useState('')

  function handleConfirm() {
    if (!note.trim()) {
      alert('Please provide an authorisation note for the audit log.')
      return
    }
    confirmOverride(drone, reason, note, user.name)
    onConfirm()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">⚠️ Emergency Manual Dispatch Override</div>
        <div className="modal-sub">
          Manager-only · Full audit logging · Action cannot be undone
        </div>
        <div className="modal-warn">
          🔒 A full audit entry will be created with timestamp, authorising
          user ({user.name}), and justification.
        </div>
        <div className="modal-field">
          <label>Drone to dispatch / recover</label>
          <select value={drone} onChange={e => setDrone(e.target.value)}>
            <option>DRN-04 — Farm Beta T-17 (connectivity loss recovery)</option>
            <option>DRN-06 — Farm Alpha T-1 run (weather hold override)</option>
            <option>DRN-03 — Emergency replacement dispatch</option>
          </select>
        </div>
        <div className="modal-field">
          <label>Override reason</label>
          <select value={reason} onChange={e => setReason(e.target.value)}>
            <option>Connectivity loss — drone recovery required</option>
            <option>Weather hold — safety manually assessed, clear to proceed</option>
            <option>Ground crew conflict prevention</option>
            <option>Urgent turbine fault — immediate inspection required</option>
          </select>
        </div>
        <div className="modal-field">
          <label>Authorisation note (required)</label>
          <textarea
            rows={3}
            placeholder="Describe the justification for this override action..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            🚨 Confirm Override
          </button>
        </div>
      </div>
    </div>
  )
}