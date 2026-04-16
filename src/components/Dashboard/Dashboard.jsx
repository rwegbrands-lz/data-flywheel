import { useState } from 'react'
import StatsBar from './StatsBar'
import FilterBar from './FilterBar'
import CategorySection from './CategorySection'
import { CATEGORIES } from '../../constants/categories'
import { STATUSES } from '../../constants/statuses'

const STATUS_ORDER = Object.keys(STATUSES)

function getCategoryMajorityStatusIndex(risks) {
  const counts = {}
  risks.forEach(r => {
    const s = r.status || 'backlog'
    counts[s] = (counts[s] || 0) + 1
  })
  const majority = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'backlog'
  return STATUS_ORDER.indexOf(majority)
}

export default function Dashboard({ risks, onSelectRisk }) {
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('progress_desc')
  const [expandKey, setExpandKey] = useState(0)

  const expandAll = () => setExpandKey(k => k + 1)

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

  let sortedCats = categoryOrder.filter(id => grouped[id]?.length > 0)

  if (sortBy === 'progress_desc') {
    sortedCats.sort((a, b) => {
      const pctA = grouped[a].filter(r => r.status === 'live').length / grouped[a].length
      const pctB = grouped[b].filter(r => r.status === 'live').length / grouped[b].length
      return pctB - pctA
    })
  } else if (sortBy === 'progress_asc') {
    sortedCats.sort((a, b) => {
      const pctA = grouped[a].filter(r => r.status === 'live').length / grouped[a].length
      const pctB = grouped[b].filter(r => r.status === 'live').length / grouped[b].length
      return pctA - pctB
    })
  } else if (sortBy === 'status_desc') {
    sortedCats.sort((a, b) => getCategoryMajorityStatusIndex(grouped[b]) - getCategoryMajorityStatusIndex(grouped[a]))
  } else if (sortBy === 'status_asc') {
    sortedCats.sort((a, b) => getCategoryMajorityStatusIndex(grouped[a]) - getCategoryMajorityStatusIndex(grouped[b]))
  } else if (sortBy === 'count_desc') {
    sortedCats.sort((a, b) => grouped[b].length - grouped[a].length)
  } else if (sortBy === 'count_asc') {
    sortedCats.sort((a, b) => grouped[a].length - grouped[b].length)
  }

  return (
    <div>
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#1E293B',
        borderBottom: '1px solid #334155',
      }}>
        <StatsBar risks={risks} />
        <FilterBar
          filterCategory={filterCategory} filterStatus={filterStatus} filterPriority={filterPriority}
          setFilterCategory={v => { setFilterCategory(v); expandAll() }}
          setFilterStatus={v => { setFilterStatus(v); expandAll() }}
          setFilterPriority={v => { setFilterPriority(v); expandAll() }}
          shown={filtered.length} total={risks.length}
          viewMode={viewMode} setViewMode={setViewMode}
          sortBy={sortBy} setSortBy={v => { setSortBy(v); expandAll() }}
        />
      </div>
      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
        {sortedCats.length === 0
          ? <div style={{ textAlign: 'center', color: '#475569', padding: 60, fontSize: 15 }}>No risks match the current filters.</div>
          : sortedCats.map((catId, idx) => (
              <CategorySection key={catId} categoryId={catId} risks={grouped[catId]} onSelectRisk={onSelectRisk} viewMode={viewMode} initiallyExpanded={idx === 0} expandKey={expandKey} />
            ))
        }
      </div>
    </div>
  )
}
