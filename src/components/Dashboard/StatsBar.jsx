import { STATUSES } from '../../constants/statuses'

export default function StatsBar({ risks }) {
  const counts = Object.entries(STATUSES).map(([key, s]) => ({
    ...s,
    key,
    count: risks.filter(r => r.status === key).length
  }))

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF6B2C' }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Data Flywheel Framework</div>
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        {counts.map(s => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot }} />
            <span style={{ fontSize: 12, color: '#64748B' }}>{s.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
