import { useState } from 'react'
import { STATUSES } from '../../constants/statuses'
import { PRIORITIES } from '../../constants/priorities'

export default function RiskRow({ risk, onClick }) {
  const status = STATUSES[risk.status] || STATUSES.backlog
  const priority = PRIORITIES[risk.priority] || PRIORITIES.P2
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: hovered ? '#F8FAFC' : '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: 8,
        padding: '10px 16px',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
    >
      {/* Priority */}
      <span style={{
        fontSize: 10, fontWeight: 700, color: priority.color,
        background: priority.bg, borderRadius: 4, padding: '2px 6px',
        flexShrink: 0,
      }}>
        {risk.priority}
      </span>

      {/* Name */}
      <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {risk.name}
      </span>

      {/* Exposure */}
      <span style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0, minWidth: 80 }}>
        {risk.exposure || '—'}
      </span>

      {/* Status chip */}
      <span style={{
        fontSize: 10, fontWeight: 600, color: '#fff',
        background: status.dot, borderRadius: 4, padding: '2px 8px',
        flexShrink: 0,
      }}>
        {status.label}
      </span>
    </div>
  )
}
