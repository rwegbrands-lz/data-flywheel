import { useState } from 'react'
import StatsBar from './StatsBar'
import FilterBar from './FilterBar'
import CategorySection from './CategorySection'
import { CATEGORIES } from '../../constants/categories'

export default function Dashboard({ risks, onSelectRisk }) {
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const filtered = risks.filter(r => {
    if (filterCategory !== 'all' && r.category !== filterCategory) return false
    if (filterStatus !== 'all' && r.status !== filterStatus) return false
    if (filterPriority !== 'all' && r.priority !== filterPriority) return false
    return true
  })

  const categoryOrder = CATEGORIES.map(c => c.id)
  const grouped = {}
  filtered.forEach(r => {
    if (!grouped[r.category]) grouped[r.category] = []
    grouped[r.category].push(r)
  })

  const sortedCats = categoryOrder.filter(id => grouped[id]?.length > 0)

  return (
    <div>
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
      }}>
        <StatsBar risks={risks} />
        <FilterBar
        filterCategory={filterCategory} filterStatus={filterStatus} filterPriority={filterPriority}
        setFilterCategory={setFilterCategory} setFilterStatus={setFilterStatus} setFilterPriority={setFilterPriority}
        shown={filtered.length} total={risks.length}
        viewMode={viewMode} setViewMode={setViewMode}
        />
      </div>
      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
        {sortedCats.length === 0
          ? <div style={{ textAlign: 'center', color: '#94A3B8', padding: 60 }}>No risks match the current filters.</div>
          : sortedCats.map(catId => (
              <CategorySection key={catId} categoryId={catId} risks={grouped[catId]} onSelectRisk={onSelectRisk} viewMode={viewMode} />
            ))
        }
      </div>
    </div>
  )
}
