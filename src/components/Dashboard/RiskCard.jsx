import { useState } from 'react'
import { STATUSES } from '../../constants/statuses'
import { PRIORITIES } from '../../constants/priorities'

const SCORE_COLORS = { green: '#10B981', yellow: '#F59E0B', red: '#EF4444' }

const STAGE_ORDER = ['ingestion', 'businessProfile', 'customerIntelligence', 'presentation']
const STAGE_COLORS = { complete: '#10B981', in_progress: '#F59E0B', not_started: '#CBD5E1' }

function FlywheelDots({ flywheel }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {STAGE_ORDER.map(s => (
        <div key={s} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: STAGE_COLORS[flywheel?.[s]?.status || 'not_started']
        }} />
      ))}
    </div>
  )
}

function DRIBadge({ initial, color }) {
  return (
    <div style={{
      width: 22, height: 22, borderRadius: '50%',
      background: color, color: '#fff',
      fontSize: 9, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {initial}
    </div>
  )
}

function getInitials(name) {
  if (!name || name === 'TBD') return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2)
}

export default function RiskCard({ risk, onClick }) {
  const status = STATUSES[risk.status] || STATUSES.backlog
  const priority = PRIORITIES[risk.priority] || PRIORITIES.P2
  const [hovered, setHovered] = useState(false)

  const scoreColor = risk.riskScore ? SCORE_COLORS[risk.riskScore] : status.dot

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        padding: '16px 16px',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, transform 0.15s',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: priority.color,
          background: priority.bg, borderRadius: 4, padding: '2px 6px'
        }}>
          {risk.priority}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, color: '#fff',
          background: status.dot, borderRadius: 4, padding: '2px 6px'
        }}>
          {status.label}
        </span>
      </div>

      {/* Name */}
      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 6, lineHeight: 1.3 }}>
        {risk.name}
      </div>

      {/* Exposure */}
      <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 14 }}>
        {risk.exposure || '—'}
      </div>

      {/* DRIs */}
      <div style={{ display: 'flex', gap: 4 }}>
        <DRIBadge initial={getInitials(risk.dris?.legal?.name)} color="#94A3B8" />
        <DRIBadge initial={getInitials(risk.dris?.product?.name)} color="#94A3B8" />
        <DRIBadge initial={getInitials(risk.dris?.engineering?.name)} color="#94A3B8" />
      </div>
    </div>
  )
}
