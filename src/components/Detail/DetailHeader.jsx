import { STATUSES } from '../../constants/statuses'
import { PRIORITIES } from '../../constants/priorities'

export default function DetailHeader({ risk, editing, onBack, onEdit, onSave, onCancel, onStatusChange }) {
  const status = STATUSES[risk.status] || STATUSES.backlog
  const priority = PRIORITIES[risk.priority] || PRIORITIES.P2

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 32px', flexWrap: 'wrap'
    }}>
      <button
        onClick={onBack}
        style={{ fontSize: 13, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 4 }}
      >
        &larr; Flywheel
      </button>
      <span style={{ color: '#E2E8F0' }}>|</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{risk.name}</span>
      <span style={{
        fontSize: 10, fontWeight: 700,
        color: priority.color, background: priority.bg,
        borderRadius: 4, padding: '2px 6px'
      }}>
        {risk.priority}
      </span>

      <select
        value={risk.status}
        onChange={e => onStatusChange(e.target.value)}
        style={{
          fontSize: 12, fontWeight: 600,
          color: status.color, background: status.bg,
          border: `1px solid ${status.color}44`,
          borderRadius: 8, padding: '4px 10px', cursor: 'pointer', outline: 'none'
        }}
      >
        {Object.entries(STATUSES).map(([k, s]) => (
          <option key={k} value={k}>{s.label}</option>
        ))}
      </select>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        {editing ? (
          <>
            <button onClick={onSave} style={{ fontSize: 12, fontWeight: 700, color: '#fff', background: '#FF6B2C', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' }}>Save</button>
            <button onClick={onCancel} style={{ fontSize: 12, color: '#64748B', background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' }}>Cancel</button>
          </>
        ) : (
          <button onClick={onEdit} style={{ fontSize: 12, fontWeight: 700, color: '#FF6B2C', background: '#FFF0E8', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' }}>Edit</button>
        )}
      </div>
    </div>
  )
}
