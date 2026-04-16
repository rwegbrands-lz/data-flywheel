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
      borderBottom: '1px solid #334155',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF6B2C' }} />
        <div style={{ fontSize: 17, fontWeight: 700, color: '#F1F5F9' }}>Data Flywheel Framework</div>
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        {counts.map(s => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot }} />
            <span style={{ fontSize: 14, color: '#94A3B8' }}>{s.label}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9' }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
