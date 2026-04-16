import { STATUSES } from '../../constants/statuses'
import { PRIORITIES } from '../../constants/priorities'

export default function DetailHeader({ risk, onBack, onStatusChange }) {
  const status = STATUSES[risk.status] || STATUSES.backlog
  const priority = PRIORITIES[risk.priority] || PRIORITIES.P2

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 32px', flexWrap: 'wrap'
    }}>
      <button
        onClick={onBack}
        title="Home"
        style={{ color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 6, transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#0F172A'}
        onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7A1 1 0 003 11h1v6a1 1 0 001 1h4v-4h2v4h4a1 1 0 001-1v-6h1a1 1 0 00.707-1.707l-7-7z" />
        </svg>
      </button>
      <span style={{ color: '#E2E8F0' }}>|</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{risk.name}</span>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
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
      </div>

    </div>
  )
}
