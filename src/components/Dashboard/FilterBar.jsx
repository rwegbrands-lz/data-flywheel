import { CATEGORIES } from '../../constants/categories'
import { STATUSES } from '../../constants/statuses'

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <rect x="1" y="2" width="14" height="2" rx="1" fill="currentColor" />
      <rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor" />
      <rect x="1" y="12" width="14" height="2" rx="1" fill="currentColor" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
    </svg>
  )
}

export default function FilterBar({ filterCategory, filterStatus, filterPriority, setFilterCategory, setFilterStatus, setFilterPriority, shown, total, viewMode, setViewMode }) {
  const selStyle = {
    fontSize: 13,
    color: '#374151',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    padding: '6px 10px',
    background: '#fff',
    cursor: 'pointer',
    outline: 'none',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 32px' }}>
      <select style={selStyle} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
        <option value="all">All Categories</option>
        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select style={selStyle} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
        <option value="all">All Statuses</option>
        {Object.entries(STATUSES).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
      </select>
      <select style={selStyle} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
        <option value="all">All Priorities</option>
        <option value="P0">P0</option>
        <option value="P1">P1</option>
        <option value="P2">P2</option>
      </select>
      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94A3B8' }}>
        Showing <strong style={{ color: '#374151' }}>{shown}</strong> of <strong style={{ color: '#374151' }}>{total}</strong> risks
      </span>
      <button
        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to card view'}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, borderRadius: 8,
          border: '1px solid #E2E8F0', background: '#fff',
          color: '#64748B', cursor: 'pointer', flexShrink: 0,
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        {viewMode === 'grid' ? <ListIcon /> : <GridIcon />}
      </button>
    </div>
  )
}
