import RiskCard from './RiskCard'
import RiskRow from './RiskRow'
import { CATEGORY_MAP } from '../../constants/categories'

export default function CategorySection({ categoryId, risks, onSelectRisk, viewMode }) {
  const cat = CATEGORY_MAP[categoryId] || { name: categoryId, color: '#64748B', light: '#F8FAFC' }
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 12
      }}>
        <div style={{ width: 4, height: 20, borderRadius: 2, background: '#1E293B' }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: '#1E293B', letterSpacing: '0.01em' }}>
          {cat.name}
        </span>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>({risks.length})</span>
      </div>
      {viewMode === 'grid' ? (
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
      )}
    </div>
  )
}
