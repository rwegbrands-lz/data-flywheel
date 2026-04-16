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

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: '#94A3B8',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  flexShrink: 0,
}

export default function FilterBar({ filterCategory, filterStatus, filterPriority, setFilterCategory, setFilterStatus, setFilterPriority, shown, total, viewMode, setViewMode, sortBy, setSortBy }) {
  const selStyle = {
    fontSize: 14,
    color: '#F1F5F9',
    border: '1px solid #475569',
    borderRadius: 8,
    padding: '6px 10px',
    background: '#334155',
    cursor: 'pointer',
    outline: 'none',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 32px', flexWrap: 'wrap' }}>
      <span style={labelStyle}>Filters:</span>
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

      <div style={{ width: 1, height: 24, background: '#475569', margin: '0 4px', flexShrink: 0 }} />

      <span style={labelStyle}>Sort by:</span>
      <select style={selStyle} value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="progress_desc">Progress Desc</option>
        <option value="progress_asc">Progress Asc</option>
        <option value="status_desc">Overall Status Desc</option>
        <option value="status_asc">Overall Status Asc</option>
        <option value="count_desc">Total Risk Count Desc</option>
        <option value="count_asc">Total Risk Count Asc</option>
      </select>

      <span style={{ marginLeft: 'auto', fontSize: 14, color: '#94A3B8' }}>
        Showing <strong style={{ color: '#F1F5F9' }}>{shown}</strong> of <strong style={{ color: '#F1F5F9' }}>{total}</strong> risks
      </span>
      <button
        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to card view'}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, borderRadius: 8,
          border: '1px solid #475569', background: '#334155',
          color: '#94A3B8', cursor: 'pointer', flexShrink: 0,
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        {viewMode === 'grid' ? <ListIcon /> : <GridIcon />}
      </button>
    </div>
  )
}
