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
        gap: 0,
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
        fontSize: 13, fontWeight: 700, color: priority.color,
        background: priority.bg, borderRadius: 4, padding: '2px 6px',
        flexShrink: 0, marginRight: 14,
      }}>
        {risk.priority}
      </span>

      {/* Name — fills remaining space */}
      <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 14 }}>
        {risk.name}
      </span>

      {/* Cost Estimate — fixed width */}
      <div style={{ width: 120, flexShrink: 0, padding: '0 12px', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Cost Estimate</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{risk.exposure || '—'}</div>
      </div>

      {/* Severity — fixed width */}
      <div style={{ width: 90, flexShrink: 0, padding: '0 12px', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Severity</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{risk.severity ?? '—'}<span style={{ fontSize: 11, color: '#475569', fontWeight: 400 }}>/5</span></div>
      </div>

      {/* Likelihood — fixed width */}
      <div style={{ width: 100, flexShrink: 0, padding: '0 12px', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Likelihood</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{risk.likelihood ?? '—'}<span style={{ fontSize: 11, color: '#475569', fontWeight: 400 }}>/5</span></div>
      </div>

      {/* Status chip — fixed width */}
      <div style={{ width: 90, flexShrink: 0, textAlign: 'left' }}>
        <span style={{
          fontSize: 13, fontWeight: 600, color: '#fff',
          background: status.dot, borderRadius: 4, padding: '2px 8px',
        }}>
          {status.label}
        </span>
      </div>
    </div>
  )
}
