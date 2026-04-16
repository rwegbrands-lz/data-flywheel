import { useState, useRef } from 'react'
import RiskCard from './RiskCard'
import RiskRow from './RiskRow'
import { CATEGORY_MAP } from '../../constants/categories'
import { STATUSES } from '../../constants/statuses'

export default function CategorySection({ categoryId, risks, onSelectRisk, viewMode, initiallyExpanded, expandKey }) {
  const cat = CATEGORY_MAP[categoryId] || { name: categoryId, color: '#64748B', light: '#F8FAFC' }
  const [expanded, setExpanded] = useState(initiallyExpanded)
  const lastExpandKey = useRef(expandKey)

  if (expandKey !== lastExpandKey.current) {
    lastExpandKey.current = expandKey
    if (!expanded) setExpanded(true)
  }

  const liveCount = risks.filter(r => r.status === 'live').length
  const pct = risks.length > 0 ? Math.round((liveCount / risks.length) * 100) : 0

  // Find the majority status
  const statusCounts = {}
  risks.forEach(r => {
    const s = r.status || 'backlog'
    statusCounts[s] = (statusCounts[s] || 0) + 1
  })
  const majorityStatus = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'backlog'
  const badge = STATUSES[majorityStatus] || STATUSES.backlog

  return (
    <div style={{ marginBottom: 28 }}>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: expanded ? 12 : 0,
          cursor: 'pointer', userSelect: 'none',
          background: '#F8FAFC', border: '1px solid #E2E8F0',
          borderRadius: 10, padding: '10px 16px',
        }}
      >
        <span style={{
          fontSize: 13, color: '#475569', transition: 'transform 0.15s',
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          display: 'inline-block', lineHeight: 1,
        }}>
          ▶
        </span>
        <div style={{ width: 4, height: 20, borderRadius: 2, background: '#1E293B' }} />
        <span style={{ fontSize: 17, fontWeight: 800, color: '#1E293B', letterSpacing: '0.01em' }}>
          {cat.name} ({risks.length})
        </span>
        <span style={{ fontSize: 14, color: '#475569', marginLeft: 4 }}>Overall Status:</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: badge.bg, color: badge.color,
          border: `1px solid ${badge.border || badge.dot}`,
          borderRadius: 20, padding: '3px 9px', fontSize: 13, fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: badge.dot, display: 'inline-block' }} />
          {badge.label}
        </span>
        <span style={{ fontSize: 14, color: '#475569' }}>
          Progress: {pct}% ({liveCount} of {risks.length} risk{risks.length !== 1 ? 's' : ''} live)
        </span>
      </div>
      {expanded && (
        viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 12
          }}>
            {risks.map(r => (
              <RiskCard key={r.id} risk={r} onClick={() => onSelectRisk(r.id)} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {risks.map(r => (
              <RiskRow key={r.id} risk={r} onClick={() => onSelectRisk(r.id)} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
