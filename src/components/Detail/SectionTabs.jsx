import { useState } from 'react'

// ─── shared helpers ──────────────────────────────────────────────────────────

const FONT = 'Figtree, system-ui, sans-serif'

function SectionLabel({ children, style }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: '#94A3B8',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      marginBottom: 8, marginTop: 20, ...style
    }}>
      {children}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    identified:     { label: 'Identified',     bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' },
    in_progress:    { label: 'In Progress',    bg: '#FEF3C7', color: '#B45309', dot: '#F59E0B' },
    live:           { label: 'Live',           bg: '#D1FAE5', color: '#047857', dot: '#10B981' },
    drafted:        { label: 'Drafted',        bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' },
    legal_reviewed: { label: 'Legal Reviewed', bg: '#EDE9FE', color: '#6D28D9', dot: '#7C3AED' },
    in_dev:         { label: 'In Dev',         bg: '#DBEAFE', color: '#1D4ED8', dot: '#3B82F6' },
    not_started:    { label: 'Not Started',    bg: '#F1F5F9', color: '#94A3B8', dot: '#CBD5E1' },
  }
  const cfg = map[status] || map.not_started
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.color,
      borderRadius: 20, padding: '3px 9px', fontSize: 11, fontWeight: 600, fontFamily: FONT,
      whiteSpace: 'nowrap'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {cfg.label}
    </span>
  )
}

function SourceTypeBadge({ type }) {
  const isInternal = type === 'Internal'
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, borderRadius: 4, padding: '2px 6px',
      background: isInternal ? '#DBEAFE' : '#EDE9FE',
      color: isInternal ? '#1D4ED8' : '#6D28D9',
      fontFamily: FONT, whiteSpace: 'nowrap'
    }}>
      {type || 'Internal'}
    </span>
  )
}

function deriveDataPointStatus(risk) {
  const s = risk.status
  if (s === 'live') return 'live'
  if (s === 'validation' || s === 'in_dev') return 'in_progress'
  return 'identified'
}

function deriveLogicStatus(risk) {
  const s = risk.status
  if (s === 'live') return 'live'
  if (s === 'validation') return 'in_dev'
  if (s === 'in_dev') return 'in_dev'
  if (s === 'in_definition') return 'drafted'
  return 'drafted'
}

// ─── Data Tab ────────────────────────────────────────────────────────────────

const DATA_POINT_STATUSES = ['identified', 'in_progress', 'live']

function DataTab({ risk }) {
  const dataPoints = risk.dataPoints || []
  const defaultStatus = deriveDataPointStatus(risk)

  if (dataPoints.length === 0) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
        No data points defined yet.
      </div>
    )
  }

  return (
    <div>
      <SectionLabel style={{ marginTop: 0 }}>Required Data Points</SectionLabel>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FONT }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Data Point', 'Source', 'Type', 'Availability', 'Status'].map(h => (
                <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataPoints.map((dp, i) => {
              const status = dp.status || defaultStatus
              const isLast = i === dataPoints.length - 1
              return (
                <tr key={dp.field} style={{ borderBottom: isLast ? 'none' : '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 11, background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 5, padding: '2px 7px', display: 'inline-block', color: '#334155', marginBottom: 3 }}>
                      {dp.field}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#374151', fontWeight: 600 }}>{dp.displayName}</div>
                    {dp.description && (
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, lineHeight: 1.45 }}>{dp.description}</div>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top', color: '#475569', fontSize: 12 }}>
                    {dp.source?.name || '—'}
                    {dp.source?.gap && (
                      <div style={{ fontSize: 10, color: '#EF4444', marginTop: 3 }}>Gap: {dp.source.gap}</div>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                    <SourceTypeBadge type={dp.source?.type} />
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: dp.source?.availability === 'Available' ? '#047857' : dp.source?.availability === 'Partial' ? '#B45309' : '#64748B'
                    }}>
                      {dp.source?.availability || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                    <StatusBadge status={status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Logic Tab ───────────────────────────────────────────────────────────────

const LOGIC_STATUS_STEPS = [
  { id: 'drafted',        label: 'Drafted' },
  { id: 'legal_reviewed', label: 'Legal Reviewed' },
  { id: 'in_dev',         label: 'In Dev' },
  { id: 'live',           label: 'Live' },
]

const SCORE_COLORS = { green: '#10B981', yellow: '#F59E0B', red: '#EF4444' }
const SCORE_BG = { green: '#D1FAE5', yellow: '#FEF3C7', red: '#FEE2E2' }
const SCORE_BORDER = { green: '#6EE7B7', yellow: '#FDE68A', red: '#FCA5A5' }

function LogicStatusStepper({ currentStatus }) {
  const currentIdx = LOGIC_STATUS_STEPS.findIndex(s => s.id === currentStatus)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 4 }}>
      {LOGIC_STATUS_STEPS.map((step, i) => {
        const isDone = i <= currentIdx
        const isCurrent = i === currentIdx
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: isDone ? '#1E3A5F' : '#E2E8F0',
                color: isDone ? '#fff' : '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, fontFamily: FONT,
                border: isCurrent ? '2px solid #FF6B2C' : '2px solid transparent',
                boxSizing: 'border-box'
              }}>
                {isDone ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 9.5, color: isDone ? '#374151' : '#94A3B8', marginTop: 4, fontWeight: isCurrent ? 700 : 500, textAlign: 'center', lineHeight: 1.2 }}>
                {step.label}
              </div>
            </div>
            {i < LOGIC_STATUS_STEPS.length - 1 && (
              <div style={{ height: 2, flex: 1, background: i < currentIdx ? '#1E3A5F' : '#E2E8F0', marginBottom: 18, flexShrink: 1, minWidth: 8 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function LogicRuleCard({ level, rule }) {
  const [open, setOpen] = useState(false)
  if (!rule) return null
  const color = SCORE_COLORS[level]
  const bg = SCORE_BG[level]
  const border = SCORE_BORDER[level]
  return (
    <div style={{ borderRadius: 9, border: `1px solid ${border}`, background: bg, marginBottom: 8 }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
          <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: FONT }}>
            {level.toUpperCase()} — {rule.label}
          </span>
        </div>
        <span style={{ fontSize: 10, color: '#94A3B8' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 14px 12px 14px' }}>
          <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.55, marginBottom: 8 }}>{rule.humanReadable}</div>
          {rule.nextBestAction && (
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>
              Next best action: <strong style={{ color: '#FF6B2C' }}>{rule.nextBestAction}</strong>
            </div>
          )}
          {rule.pseudoFunction && (
            <pre style={{
              background: '#1E293B', color: '#7DD3FC', borderRadius: 7,
              padding: '9px 12px', fontSize: 10, overflow: 'auto',
              fontFamily: 'monospace', lineHeight: 1.6, margin: 0
            }}>
              {rule.pseudoFunction}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

function LogicTab({ risk }) {
  const logicStatus = risk.logic?.status || deriveLogicStatus(risk)
  const { logic, exposure, severity, likelihood } = risk

  return (
    <div>
      <SectionLabel style={{ marginTop: 0 }}>Logic Status</SectionLabel>
      <LogicStatusStepper currentStatus={logicStatus} />

      <SectionLabel>Impact Range</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#F8FAFC', borderRadius: 8, padding: '10px 14px', border: '1px solid #E2E8F0' }}>
        <div>
          <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Exposure</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#DC2626' }}>{exposure || '—'}</div>
        </div>
        <div style={{ width: 1, height: 36, background: '#E2E8F0' }} />
        <div>
          <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Severity</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{severity ?? '—'}<span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>/5</span></div>
        </div>
        <div style={{ width: 1, height: 36, background: '#E2E8F0' }} />
        <div>
          <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Likelihood</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{likelihood ?? '—'}<span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>/5</span></div>
        </div>
      </div>

      <SectionLabel>Green / Yellow / Red Logic</SectionLabel>
      {['red', 'yellow', 'green'].map(level => (
        <LogicRuleCard key={level} level={level} rule={logic?.[level]} />
      ))}
      {!logic && (
        <div style={{ fontSize: 12, color: '#94A3B8', padding: '8px 0' }}>No logic defined yet.</div>
      )}

      <SectionLabel>Change Management</SectionLabel>
      <div style={{
        background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 9,
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12
      }}>
        <div style={{ fontSize: 20 }}>🔒</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', fontFamily: FONT }}>Change management — coming soon</div>
          <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 3, fontFamily: FONT }}>
            Once live, any updates to logic will require a versioned change record with review sign-off.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Consume Tab ─────────────────────────────────────────────────────────────

const SURFACE_META = {
  MyLZ:       { label: 'MyLZ',       icon: '🏠', description: 'Customer-facing risk dashboard and detail view' },
  Salesforce: { label: 'Salesforce', icon: '☁️', description: 'Agent-facing risk signals in CRM opportunity and account views' },
  LCM:        { label: 'LCM',        icon: '⚙️', description: 'Lifecycle management automation triggers and workflows' },
}

const DEFAULT_SURFACES = [
  { surface: 'MyLZ',       note: '', status: 'identified' },
  { surface: 'Salesforce', note: '', status: 'identified' },
  { surface: 'LCM',        note: '', status: 'identified' },
]

function ConsumeTab({ risk }) {
  const surfaces = risk.consume?.surfaces || DEFAULT_SURFACES

  return (
    <div>
      <SectionLabel style={{ marginTop: 0 }}>Surfaces</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {surfaces.map((s, i) => {
          const meta = SURFACE_META[s.surface] || { label: s.surface, icon: '📄', description: '' }
          return (
            <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 16px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 22, lineHeight: 1 }}>{meta.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', fontFamily: FONT }}>{meta.label}</div>
                    <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2, fontFamily: FONT }}>{meta.description}</div>
                  </div>
                </div>
                <StatusBadge status={s.status || 'identified'} />
              </div>
              {s.note && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#475569', background: '#F8FAFC', borderRadius: 6, padding: '8px 10px', borderLeft: '3px solid #CBD5E1', fontFamily: FONT, lineHeight: 1.5 }}>
                  {s.note}
                </div>
              )}
              {!s.note && (
                <div style={{ marginTop: 8, fontSize: 11, color: '#CBD5E1', fontStyle: 'italic', fontFamily: FONT }}>
                  No notes added yet.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Usage Tab ───────────────────────────────────────────────────────────────

function UsageTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0 40px', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 16 }}>📊</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', fontFamily: FONT }}>Customer usage indicators coming soon</div>
      <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 8, maxWidth: 340, lineHeight: 1.65, fontFamily: FONT }}>
        This section will surface how customers engage with risk signals — views, actions taken, and downstream outcomes.
      </div>
    </div>
  )
}

// ─── History Tab ─────────────────────────────────────────────────────────────

const ROLE_COLORS = { Legal: '#7C3AED', Product: '#FF6B2C', Engineering: '#047857' }
const ROLE_BG     = { Legal: '#EDE9FE', Product: '#FFF0E9', Engineering: '#D1FAE5' }

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2)
}

function HistoryTab({ risk, updateRisk }) {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('Rob Wegbrands')
  const [role, setRole] = useState('Product')

  const notes = [...(risk.notes || [])].reverse()

  function postNote() {
    if (!text.trim()) return
    const newNote = {
      author,
      role,
      date: new Date().toISOString().slice(0, 10),
      text: text.trim(),
    }
    updateRisk({ ...risk, notes: [...(risk.notes || []), newNote] })
    setText('')
  }

  return (
    <div>
      {/* Add note form */}
      <SectionLabel style={{ marginTop: 0 }}>Add Note</SectionLabel>
      <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '14px', border: '1px solid #E2E8F0', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name"
            style={{ fontSize: 12, border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 9px', flex: 1, outline: 'none', fontFamily: FONT }}
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{ fontSize: 12, border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 9px', background: '#fff', outline: 'none', fontFamily: FONT }}
          >
            <option>Legal</option>
            <option>Product</option>
            <option>Engineering</option>
          </select>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add context, decisions, or open questions for your team..."
          rows={3}
          style={{ width: '100%', fontSize: 12, border: '1px solid #E2E8F0', borderRadius: 6, padding: '7px 9px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: FONT, lineHeight: 1.55 }}
        />
        <button
          onClick={postNote}
          disabled={!text.trim()}
          style={{
            marginTop: 8, fontSize: 12, fontWeight: 700,
            color: '#fff', background: text.trim() ? '#FF6B2C' : '#CBD5E1',
            border: 'none', borderRadius: 7, padding: '7px 18px',
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s', fontFamily: FONT,
          }}
        >
          Post Note
        </button>
      </div>

      {/* Notes feed */}
      <SectionLabel>Notes</SectionLabel>
      {notes.length === 0 && (
        <div style={{ fontSize: 12, color: '#94A3B8', padding: '8px 0' }}>No notes yet.</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notes.map((note, i) => (
          <div key={i} style={{ display: 'flex', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: ROLE_COLORS[note.role] || '#64748B',
              color: '#fff', fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT,
            }}>
              {getInitials(note.author)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', fontFamily: FONT }}>{note.author}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  color: ROLE_COLORS[note.role] || '#64748B',
                  background: ROLE_BG[note.role] || '#F1F5F9',
                  borderRadius: 4, padding: '1px 6px', fontFamily: FONT,
                }}>{note.role}</span>
                <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: FONT }}>{note.date}</span>
              </div>
              <div style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.55, fontFamily: FONT }}>{note.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Change log placeholder */}
      <SectionLabel style={{ marginTop: 28 }}>Change Log</SectionLabel>
      <div style={{
        background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 9,
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ fontSize: 20 }}>📋</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', fontFamily: FONT }}>Automated change tracking — coming soon</div>
          <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 3, fontFamily: FONT }}>
            Field edits, status transitions, and logic updates will appear here automatically.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main SectionTabs ─────────────────────────────────────────────────────────

const TABS = [
  { id: 'ingest',  label: 'Ingest' },
  { id: 'reason',  label: 'Reason' },
  { id: 'consume', label: 'Consume' },
  { id: 'usage',   label: 'Usage' },
  { id: 'history', label: 'History' },
]

export default function SectionTabs({ risk, updateRisk, activeSection, onSectionClick }) {
  const [localTab, setLocalTab] = useState('ingest')
  const activeTab = activeSection || localTab

  function handleTabClick(id) {
    setLocalTab(id)
    onSectionClick?.(id)
  }

  return (
    <div>
      {/* Sticky tab bar */}
      <div style={{
        position: 'sticky',
        top: 57,
        zIndex: 50,
        display: 'flex',
        borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
        padding: '0 28px',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                padding: '14px 20px 12px',
                fontSize: 14, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0F172A' : '#94A3B8',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: isActive ? '2px solid #FF6B2C' : '2px solid transparent',
                marginBottom: -1,
                fontFamily: FONT,
                transition: 'color 0.15s'
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div style={{ padding: '20px 28px 60px 28px' }}>
        {activeTab === 'ingest'  && <DataTab risk={risk} />}
        {activeTab === 'reason'  && <LogicTab risk={risk} />}
        {activeTab === 'consume' && <ConsumeTab risk={risk} />}
        {activeTab === 'usage'   && <UsageTab />}
        {activeTab === 'history' && <HistoryTab risk={risk} updateRisk={updateRisk} />}
      </div>
    </div>
  )
}
