import { useState, useEffect, useRef } from 'react'

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, marginTop: 16 }}>
      {children}
    </div>
  )
}

function EditableField({ text, multiline, onSave, displayStyle, emptyLabel = 'Click to edit' }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)
  const [hovering, setHovering] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { if (!editing) setDraft(text) }, [text, editing])
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  function commit() {
    setEditing(false)
    if (draft !== text) onSave(draft)
  }

  function handleKeyDown(e) {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { setEditing(false); setDraft(text) }
  }

  if (editing) {
    const base = {
      ...displayStyle,
      width: '100%',
      boxSizing: 'border-box',
      border: '1.5px solid #3B82F6',
      borderRadius: 6,
      padding: '6px 8px',
      outline: 'none',
      fontFamily: 'Figtree, system-ui, sans-serif',
      background: '#F0F9FF',
      lineHeight: 1.65,
    }
    return multiline
      ? <textarea ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={handleKeyDown} rows={4} style={{ ...base, resize: 'vertical' }} />
      : <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={handleKeyDown} style={base} />
  }

  return (
    <div
      onClick={() => setEditing(true)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        cursor: 'text',
        borderRadius: 6,
        padding: '4px 6px',
        margin: '-4px -6px',
        background: hovering ? '#EFF6FF' : 'transparent',
        border: `1px solid ${hovering ? '#BFDBFE' : 'transparent'}`,
        transition: 'background 0.12s, border-color 0.12s',
        position: 'relative',
      }}
    >
      <span style={displayStyle}>
        {text || <span style={{ color: '#CBD5E1', fontStyle: 'italic' }}>{emptyLabel}</span>}
      </span>
      {hovering && (
        <span style={{ position: 'absolute', top: 4, right: 5, fontSize: 9, color: '#3B82F6', opacity: 0.65, pointerEvents: 'none' }}>
          ✏
        </span>
      )}
    </div>
  )
}

function ScaleBar({ value, max = 5, color, onClickSegment }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = hoveredIdx !== null ? i <= hoveredIdx : i < value
        return (
          <div
            key={i}
            onClick={() => onClickSegment?.(i + 1)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              width: 22, height: 7, borderRadius: 3,
              background: filled ? color : '#E2E8F0',
              cursor: 'pointer',
              transition: 'background 0.1s',
            }}
          />
        )
      })}
    </div>
  )
}

function getInitials(name) {
  if (!name || name === 'TBD') return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2)
}

export default function DefinitionPanel({ risk, onSave }) {
  const scenario = risk.scenarios?.[0] || {}

  function saveTopLevel(field, value) {
    onSave({ ...risk, [field]: value })
  }

  function saveDescription(value) {
    if (!risk.scenarios?.length) {
      onSave({ ...risk, summary: value })
      return
    }
    const scenarios = risk.scenarios.map((sc, i) =>
      i === 0 ? { ...sc, description: { ...sc.description, risk: value } } : sc
    )
    onSave({ ...risk, scenarios })
  }

  function saveImpact(value) {
    if (!risk.scenarios?.length) return
    const scenarios = risk.scenarios.map((sc, i) =>
      i === 0 ? { ...sc, description: { ...sc.description, impact: value } } : sc
    )
    onSave({ ...risk, scenarios })
  }

  const description = scenario.description?.risk || risk.summary || ''
  const impact = scenario.description?.impact || ''

  return (
    <div style={{ paddingBottom: 20 }}>
      <SectionLabel>Description</SectionLabel>
      <EditableField
        text={description}
        multiline
        onSave={saveDescription}
        displayStyle={{ fontSize: 13.5, color: '#374151', lineHeight: 1.65, display: 'block' }}
      />

      <SectionLabel>Impact</SectionLabel>
      <EditableField
        text={impact}
        multiline
        onSave={saveImpact}
        emptyLabel="Click to add impact"
        displayStyle={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, display: 'block' }}
      />

      <SectionLabel>Exposure</SectionLabel>
      <EditableField
        text={risk.exposure || ''}
        onSave={v => saveTopLevel('exposure', v)}
        emptyLabel="e.g. $5k–$50k+"
        displayStyle={{ fontSize: 15, fontWeight: 700, color: '#DC2626', display: 'block' }}
      />

      <SectionLabel>Severity</SectionLabel>
      <ScaleBar
        value={risk.severity || 0}
        color="#EF4444"
        onClickSegment={v => saveTopLevel('severity', v)}
      />
      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3 }}>{risk.severity ?? 0}/5</div>

      <SectionLabel>Likelihood</SectionLabel>
      <ScaleBar
        value={risk.likelihood || 0}
        color="#F59E0B"
        onClickSegment={v => saveTopLevel('likelihood', v)}
      />
      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3 }}>{risk.likelihood ?? 0}/5</div>

      <SectionLabel>Collaborators</SectionLabel>
      {[
        { role: 'Legal', dri: risk.dris?.legal, color: '#7C3AED' },
        { role: 'Product', dri: risk.dris?.product, color: '#FF6B2C' },
        { role: 'Engineering', dri: risk.dris?.engineering, color: '#047857' },
      ].map(({ role, dri, color }) => (
        <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%', background: color,
            color: '#fff', fontSize: 9.5, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            {getInitials(dri?.name)}
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{role}</div>
            <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{dri?.name || 'TBD'}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
