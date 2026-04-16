import { useState } from 'react'

// ─── shared helpers ──────────────────────────────────────────────────────────

const FONT = 'Figtree, system-ui, sans-serif'

function SectionLabel({ children, style }) {
  return (
    <div style={{
      fontSize: 13, fontWeight: 700, color: '#475569',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      marginBottom: 8, marginTop: 20, ...style
    }}>
      {children}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    identified:     { label: 'Identified',     bg: '#F1F5F9', color: '#475569', dot: '#64748B', border: '#CBD5E1' },
    in_progress:    { label: 'In Progress',    bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B', border: '#FDE68A' },
    live:           { label: 'Live',           bg: '#D1FAE5', color: '#065F46', dot: '#10B981', border: '#6EE7B7' },
    drafted:        { label: 'Drafted',        bg: '#F1F5F9', color: '#475569', dot: '#64748B', border: '#CBD5E1' },
    legal_reviewed: { label: 'Legal Reviewed', bg: '#EDE9FE', color: '#5B21B6', dot: '#7C3AED', border: '#C4B5FD' },
    in_dev:         { label: 'In Dev',         bg: '#DBEAFE', color: '#1E40AF', dot: '#3B82F6', border: '#93C5FD' },
    not_started:    { label: 'Not Started',    bg: '#F1F5F9', color: '#475569', dot: '#94A3B8', border: '#CBD5E1' },
  }
  const cfg = map[status] || map.not_started
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: '3px 9px', fontSize: 13, fontWeight: 600, fontFamily: FONT,
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
      fontSize: 13, fontWeight: 600, borderRadius: 4, padding: '2px 6px',
      background: isInternal ? '#DBEAFE' : '#EDE9FE',
      color: isInternal ? '#1E40AF' : '#5B21B6',
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

// ─── Data Ingestion Tab ─────────────────────────────────────────────────────

const DATA_POINT_STATUSES = ['identified', 'in_progress', 'live']

function DataTab({ risk }) {
  const dataPoints = risk.dataPoints || []
  const defaultStatus = deriveDataPointStatus(risk)

  if (dataPoints.length === 0) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center', color: '#475569', fontSize: 15 }}>
        No data points defined yet.
      </div>
    )
  }

  return (
    <div>
      <SectionLabel style={{ marginTop: 8 }}>Required Data Points</SectionLabel>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, fontFamily: FONT }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Data Point', 'Source', 'Type', 'Availability', 'Status'].map(h => (
                <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
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
                    <div style={{ fontFamily: 'monospace', fontSize: 13, background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 5, padding: '2px 7px', display: 'inline-block', color: '#334155', marginBottom: 3 }}>
                      {dp.field}
                    </div>
                    <div style={{ fontSize: 13.5, color: '#374151', fontWeight: 600 }}>{dp.displayName}</div>
                    {dp.description && (
                      <div style={{ fontSize: 13, color: '#475569', marginTop: 2, lineHeight: 1.45 }}>{dp.description}</div>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top', color: '#475569', fontSize: 14 }}>
                    {dp.source?.name || '—'}
                    {dp.source?.gap && (
                      <div style={{ fontSize: 13, color: '#EF4444', marginTop: 3 }}>Gap: {dp.source.gap}</div>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                    <SourceTypeBadge type={dp.source?.type} />
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                    <span style={{
                      fontSize: 13, fontWeight: 600,
                      color: dp.source?.availability === 'Available' ? '#065F46' : dp.source?.availability === 'Partial' ? '#92400E' : '#475569'
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

// ─── Business Logic Tab ─────────────────────────────────────────────────────

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
                color: isDone ? '#fff' : '#64748B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, fontFamily: FONT,
                border: isCurrent ? '2px solid #FF6B2C' : '2px solid transparent',
                boxSizing: 'border-box'
              }}>
                {isDone ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 13, color: isDone ? '#374151' : '#475569', marginTop: 4, fontWeight: isCurrent ? 700 : 500, textAlign: 'center', lineHeight: 1.2 }}>
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
          <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: FONT }}>
            {level.toUpperCase()} — {rule.label}
          </span>
        </div>
        <span style={{ fontSize: 13, color: '#475569' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 14px 12px 14px' }}>
          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.55, marginBottom: 8 }}>{rule.humanReadable}</div>
          {rule.nextBestAction && (
            <div style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>
              Next best action: <strong style={{ color: '#FF6B2C' }}>{rule.nextBestAction}</strong>
            </div>
          )}
          {rule.pseudoFunction && (
            <pre style={{
              background: '#1E293B', color: '#7DD3FC', borderRadius: 7,
              padding: '9px 12px', fontSize: 13, overflow: 'auto',
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
      <SectionLabel style={{ marginTop: 8 }}>Logic Status</SectionLabel>
      <LogicStatusStepper currentStatus={logicStatus} />

      <SectionLabel>Impact Range</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#F8FAFC', borderRadius: 8, padding: '10px 14px', border: '1px solid #E2E8F0' }}>
        <div>
          <div style={{ fontSize: 13, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Exposure</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#DC2626' }}>{exposure || '—'}</div>
        </div>
        <div style={{ width: 1, height: 36, background: '#E2E8F0' }} />
        <div>
          <div style={{ fontSize: 13, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Severity</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>{severity ?? '—'}<span style={{ fontSize: 13, color: '#475569', fontWeight: 400 }}>/5</span></div>
        </div>
        <div style={{ width: 1, height: 36, background: '#E2E8F0' }} />
        <div>
          <div style={{ fontSize: 13, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Likelihood</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>{likelihood ?? '—'}<span style={{ fontSize: 13, color: '#475569', fontWeight: 400 }}>/5</span></div>
        </div>
      </div>

      <SectionLabel>Green / Yellow / Red Logic</SectionLabel>
      {['red', 'yellow', 'green'].map(level => (
        <LogicRuleCard key={level} level={level} rule={logic?.[level]} />
      ))}
      {!logic && (
        <div style={{ fontSize: 14, color: '#475569', padding: '8px 0' }}>No logic defined yet.</div>
      )}

      <SectionLabel>Change Management</SectionLabel>
      <div style={{
        background: '#F8FAFC', border: '1px dashed #94A3B8', borderRadius: 9,
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12
      }}>
        <div style={{ fontSize: 20 }}>🔒</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', fontFamily: FONT }}>Change management — coming soon</div>
          <div style={{ fontSize: 13.5, color: '#475569', marginTop: 3, fontFamily: FONT }}>
            Once live, any updates to logic will require a versioned change record with review sign-off.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Connected Surfaces Tab ─────────────────────────────────────────────────

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
      <SectionLabel style={{ marginTop: 8 }}>Surfaces</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {surfaces.map((s, i) => {
          const meta = SURFACE_META[s.surface] || { label: s.surface, icon: '📄', description: '' }
          return (
            <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 16px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 22, lineHeight: 1 }}>{meta.icon}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', fontFamily: FONT }}>{meta.label}</div>
                    <div style={{ fontSize: 13.5, color: '#475569', marginTop: 2, fontFamily: FONT }}>{meta.description}</div>
                  </div>
                </div>
                <StatusBadge status={s.status || 'identified'} />
              </div>
              {s.note && (
                <div style={{ marginTop: 10, fontSize: 14, color: '#475569', background: '#F8FAFC', borderRadius: 6, padding: '8px 10px', borderLeft: '3px solid #94A3B8', fontFamily: FONT, lineHeight: 1.5 }}>
                  {s.note}
                </div>
              )}
              {!s.note && (
                <div style={{ marginTop: 8, fontSize: 13, color: '#64748B', fontStyle: 'italic', fontFamily: FONT }}>
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
      <SectionLabel style={{ marginTop: 8 }}>Add Note</SectionLabel>
      <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '14px', border: '1px solid #E2E8F0', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name"
            style={{ fontSize: 14, border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 9px', flex: 1, outline: 'none', fontFamily: FONT }}
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{ fontSize: 14, border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 9px', background: '#fff', outline: 'none', fontFamily: FONT }}
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
          style={{ width: '100%', fontSize: 14, border: '1px solid #E2E8F0', borderRadius: 6, padding: '7px 9px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: FONT, lineHeight: 1.55 }}
        />
        <button
          onClick={postNote}
          disabled={!text.trim()}
          style={{
            marginTop: 8, fontSize: 14, fontWeight: 700,
            color: '#fff', background: text.trim() ? '#FF6B2C' : '#94A3B8',
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
        <div style={{ fontSize: 14, color: '#475569', padding: '8px 0' }}>No notes yet.</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notes.map((note, i) => (
          <div key={i} style={{ display: 'flex', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: ROLE_COLORS[note.role] || '#475569',
              color: '#fff', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT,
            }}>
              {getInitials(note.author)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontFamily: FONT }}>{note.author}</span>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: ROLE_COLORS[note.role] || '#475569',
                  background: ROLE_BG[note.role] || '#F1F5F9',
                  borderRadius: 4, padding: '1px 6px', fontFamily: FONT,
                }}>{note.role}</span>
                <span style={{ fontSize: 13, color: '#475569', fontFamily: FONT }}>{note.date}</span>
              </div>
              <div style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.55, fontFamily: FONT }}>{note.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Change log placeholder */}
      <SectionLabel style={{ marginTop: 28 }}>Change Log</SectionLabel>
      <div style={{
        background: '#F8FAFC', border: '1px dashed #94A3B8', borderRadius: 9,
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ fontSize: 20 }}>📋</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', fontFamily: FONT }}>Automated change tracking — coming soon</div>
          <div style={{ fontSize: 13.5, color: '#475569', marginTop: 3, fontFamily: FONT }}>
            Field edits, status transitions, and logic updates will appear here automatically.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Risk Landscape Tab ─────────────────────────────────────────────────────

const SEVERITY_STYLE = {
  red:    { label: 'Urgent',    bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' },
  yellow: { label: 'Important', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  green:  { label: 'FYI',       bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' },
}

const LANDSCAPE_ARTICLES = {
  bc: [
    {
      severity: 'red',
      headline: 'FinCEN BOI reporting deadline reinstated — all existing entities must file by Jan 13, 2025',
      source: 'FinCEN · Beneficial Ownership Information',
      sourceUrl: 'https://www.fincen.gov/boi',
      date: '2024-12-24',
      summary: 'After a back-and-forth court battle, the Corporate Transparency Act\'s BOI reporting requirement is back in effect. Existing companies formed before Jan 1, 2024 must file by the extended deadline. Non-compliance penalties include $591/day civil fines and criminal penalties up to $10,000.',
    },
    {
      severity: 'yellow',
      headline: 'States accelerate annual report digitization — paper filings being phased out in TX, FL, CA',
      source: 'National Association of Secretaries of State',
      sourceUrl: 'https://www.nass.org',
      date: '2026-03-18',
      summary: 'Multiple states are moving to online-only annual report filing. Texas requires Webfile-only PIR submissions as of June 2026. Businesses relying on paper filings should transition to electronic filing systems.',
    },
  ],
  bso: [
    {
      severity: 'yellow',
      headline: 'IRS increases scrutiny of single-member LLC elections — ensure EIN and entity type alignment',
      source: 'IRS · Small Business/Self-Employed Division',
      sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed',
      date: '2026-02-10',
      summary: 'The IRS is flagging discrepancies between state formation documents and federal tax elections. Single-member LLCs electing S-Corp treatment face higher audit rates when EIN filings don\'t match state records.',
    },
    {
      severity: 'green',
      headline: 'Uniform LLC Act updates adopted in 3 additional states for 2026',
      source: 'Uniform Law Commission',
      sourceUrl: 'https://www.uniformlaws.org',
      date: '2026-01-15',
      summary: 'Colorado, Nevada, and Virginia have adopted the Revised Uniform LLC Act, standardizing operating agreement enforceability and member liability protections across more jurisdictions.',
    },
  ],
  bat: [
    {
      severity: 'red',
      headline: 'IRS finalizes 1099-K reporting threshold at $2,500 for tax year 2026',
      source: 'IRS · Form 1099-K',
      sourceUrl: 'https://www.irs.gov/businesses/understanding-your-form-1099-k',
      date: '2026-04-03',
      summary: 'After multiple delays, the IRS set the 1099-K reporting threshold at $2,500 for TY2026. Businesses using payment platforms (Stripe, PayPal, Venmo Business) will receive 1099-Ks once payments exceed this amount. Threshold drops to $600 in TY2027.',
    },
    {
      severity: 'yellow',
      headline: 'Texas franchise tax no-tax-due threshold raised to $2.47M for 2026 reports',
      source: 'TX Comptroller · Franchise Tax',
      sourceUrl: 'https://comptroller.texas.gov/taxes/franchise/no-tax-due.php',
      date: '2026-04-07',
      summary: 'The biennial indexing raised the no-tax-due revenue threshold from $1.23M to $2.47M. Entities under the threshold still file a PIR but owe no franchise tax, reducing compliance burden for small businesses.',
    },
    {
      severity: 'yellow',
      headline: 'FASB issues updated guidance on crypto asset fair value reporting for small businesses',
      source: 'Financial Accounting Standards Board',
      sourceUrl: 'https://www.fasb.org',
      date: '2026-03-12',
      summary: 'New ASU 2025-03 requires fair value measurement of crypto assets on the balance sheet. Small businesses holding Bitcoin, Ethereum, or stablecoins must update their accounting practices for fiscal years beginning after December 15, 2025.',
    },
  ],
  fcc: [
    {
      severity: 'yellow',
      headline: 'SBA updates micro-loan program with streamlined digital applications starting Q3 2026',
      source: 'U.S. Small Business Administration',
      sourceUrl: 'https://www.sba.gov/funding-programs/loans',
      date: '2026-03-28',
      summary: 'The SBA is modernizing its micro-loan program (up to $50,000) with a fully digital application process. New eligibility criteria may expand access for LLCs less than 2 years old.',
    },
    {
      severity: 'green',
      headline: 'Federal Reserve signals potential rate cuts — impact on small business credit lines',
      source: 'Federal Reserve Board',
      sourceUrl: 'https://www.federalreserve.gov',
      date: '2026-04-10',
      summary: 'Fed officials indicated potential 25-50bps rate cuts in H2 2026, which could lower variable-rate credit line costs for small businesses by an estimated 0.5-1.0% annually.',
    },
  ],
  hr: [
    {
      severity: 'red',
      headline: 'DOL overtime salary threshold rises to $58,656 on July 1 — review exempt staff now',
      source: 'Federal Register · 29 CFR Part 541',
      sourceUrl: 'https://www.federalregister.gov/documents/2026/04/26/2026-09198/defining-and-delimiting-the-exemptions',
      date: '2026-04-15',
      summary: 'The FLSA overtime salary threshold takes effect July 1, 2026. Employers must raise salaries of currently-exempt staff above $58,656 or reclassify them as non-exempt and begin tracking hours. Non-compliance exposes employers to back-pay claims and liquidated damages.',
    },
    {
      severity: 'red',
      headline: 'California minimum wage rises to $17.25/hr on July 1 — update payroll and posters',
      source: 'CA DIR · Minimum Wage FAQ',
      sourceUrl: 'https://www.dir.ca.gov/dlse/FAQ_MinimumWage.htm',
      date: '2026-04-12',
      summary: 'Per SB 3 indexing, CA statewide minimum wage increases to $17.25/hr on July 1, 2026. Local minimums in San Francisco, Los Angeles, and San Diego are higher. Required workplace posters must be updated.',
    },
    {
      severity: 'yellow',
      headline: 'FTC non-compete rule enforcement update — review employment contracts',
      source: 'Federal Trade Commission',
      sourceUrl: 'https://www.ftc.gov/legal-library/browse/rules/noncompete-rule',
      date: '2026-04-14',
      summary: 'Following the 5th Circuit remand, FTC issued updated enforcement guidance. Non-compete agreements for senior executives (>$151,164 total comp) remain enforceable; all others are unenforceable nationwide as of September 4, 2026.',
    },
  ],
  ip: [
    {
      severity: 'yellow',
      headline: 'USPTO trademark modernization rule tightens response deadlines to 3 months',
      source: 'USPTO · Trademark Modernization Act',
      sourceUrl: 'https://www.uspto.gov/trademarks',
      date: '2026-02-20',
      summary: 'The Trademark Modernization Act now allows USPTO to set response periods as short as 3 months (previously 6). Businesses must respond more quickly to office actions or risk abandonment of trademark applications.',
    },
    {
      severity: 'green',
      headline: 'AI-generated content copyright guidance updated — Copyright Office clarifies registration rules',
      source: 'U.S. Copyright Office',
      sourceUrl: 'https://www.copyright.gov',
      date: '2026-03-05',
      summary: 'The Copyright Office finalized guidance that AI-generated content is not copyrightable, but works with sufficient human authorship may be. Businesses using AI for branding, marketing, or content should evaluate IP protection strategies.',
    },
  ],
  ct: [
    {
      severity: 'yellow',
      headline: 'Uniform Commercial Code Article 12 adopted for digital assets — impacts on smart contracts',
      source: 'Uniform Law Commission',
      sourceUrl: 'https://www.uniformlaws.org',
      date: '2026-01-30',
      summary: 'Multiple states have adopted UCC Article 12 governing controllable electronic records. This provides a legal framework for digital assets and smart contracts in commercial transactions.',
    },
    {
      severity: 'green',
      headline: 'ABA model rules update adds digital signature acceptance standards for business contracts',
      source: 'American Bar Association',
      sourceUrl: 'https://www.americanbar.org',
      date: '2026-03-22',
      summary: 'Updated model rules provide clearer standards for electronic and digital signature acceptance in commercial contracts, reducing ambiguity around enforceability of digitally-signed agreements.',
    },
  ],
  ms: [
    {
      severity: 'yellow',
      headline: 'Economic nexus thresholds lowered in 5 states — remote sellers face new obligations',
      source: 'Multistate Tax Commission',
      sourceUrl: 'https://www.mtc.gov',
      date: '2026-03-01',
      summary: 'Alabama, Iowa, Louisiana, Missouri, and Nebraska have lowered economic nexus thresholds for sales tax collection. Businesses with out-of-state online sales should review whether they now meet collection requirements in these states.',
    },
    {
      severity: 'green',
      headline: 'Streamlined Sales Tax Project adds two new member states for 2026',
      source: 'Streamlined Sales Tax Governing Board',
      sourceUrl: 'https://www.streamlinedsalestax.org',
      date: '2026-02-14',
      summary: 'Montana and New Hampshire have joined the SSTP as associate members, signaling potential future sales tax adoption. Multi-state businesses should monitor for legislative developments in these historically tax-free states.',
    },
  ],
  ins: [
    {
      severity: 'yellow',
      headline: 'NAIC model law update increases cyber liability insurance requirements for small businesses',
      source: 'National Association of Insurance Commissioners',
      sourceUrl: 'https://www.naic.org',
      date: '2026-03-15',
      summary: 'Updated model legislation recommends minimum cyber liability coverage for businesses handling customer PII. States adopting the model law may require proof of cyber insurance for certain business licenses.',
    },
    {
      severity: 'green',
      headline: 'Workers\' comp premium rates declining in most states for 2026 policy year',
      source: 'National Council on Compensation Insurance',
      sourceUrl: 'https://www.ncci.com',
      date: '2026-01-08',
      summary: 'NCCI\'s latest analysis shows workers\' compensation premium rates continuing a multi-year decline in 38 states. Small businesses may benefit from lower premiums at renewal, particularly in office, retail, and professional services sectors.',
    },
  ],
}

function LandscapeTab({ risk }) {
  const articles = LANDSCAPE_ARTICLES[risk.category] || []

  if (articles.length === 0) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center', color: '#475569', fontSize: 15 }}>
        No regulatory landscape articles available for this risk area yet.
      </div>
    )
  }

  return (
    <div>
      <SectionLabel style={{ marginTop: 8 }}>Regulatory & Legal Landscape</SectionLabel>
      <div style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 1.55, fontFamily: FONT }}>
        Emerging regulatory changes, legal developments, and compliance updates that may impact this risk evaluation.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {articles.map((article, i) => {
          const sev = SEVERITY_STYLE[article.severity] || SEVERITY_STYLE.green
          return (
            <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 16px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, borderRadius: 4, padding: '2px 8px',
                  background: sev.bg, color: sev.color, border: `1px solid ${sev.border}`,
                  flexShrink: 0, fontFamily: FONT, whiteSpace: 'nowrap', marginTop: 2,
                }}>
                  {sev.label}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.4, fontFamily: FONT }}>
                    {article.headline}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: '#475569', fontFamily: FONT }}>{article.source}</span>
                    <span style={{ fontSize: 13, color: '#94A3B8' }}>•</span>
                    <span style={{ fontSize: 13, color: '#475569', fontFamily: FONT }}>{article.date}</span>
                  </div>
                </div>
              </div>
              <div style={{
                marginTop: 10, fontSize: 14.5, color: '#475569', lineHeight: 1.6,
                fontFamily: FONT, borderLeft: '3px solid #E2E8F0', paddingLeft: 12,
              }}>
                {article.summary}
              </div>
              <div style={{ marginTop: 10 }}>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 13, fontWeight: 600, color: '#FF6B2C',
                    textDecoration: 'none', fontFamily: FONT,
                  }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}
                >
                  View source →
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main SectionTabs ─────────────────────────────────────────────────────────

const TABS = [
  { id: 'ingest',    label: 'Data Ingestion' },
  { id: 'reason',    label: 'Business Logic' },
  { id: 'consume',   label: 'Connected Surfaces' },
  { id: 'history',   label: 'History' },
  { id: 'landscape', label: 'Risk Landscape' },
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
                fontSize: 15, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0F172A' : '#64748B',
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
      <div style={{ padding: '0 28px 60px 28px' }}>
        {activeTab === 'ingest'  && <DataTab risk={risk} />}
        {activeTab === 'reason'  && <LogicTab risk={risk} />}
        {activeTab === 'consume' && <ConsumeTab risk={risk} />}
        {activeTab === 'history' && <HistoryTab risk={risk} updateRisk={updateRisk} />}
        {activeTab === 'landscape' && <LandscapeTab risk={risk} />}
      </div>
    </div>
  )
}
