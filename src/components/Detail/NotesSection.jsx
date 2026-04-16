import { useState } from 'react'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2)
}

const ROLE_COLORS = { Legal: '#7C3AED', Product: '#FF6B2C', Engineering: '#047857' }

export default function NotesSection({ risk, updateRisk }) {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('Rob Wegbrands')
  const [role, setRole] = useState('Product')

  const notes = risk.notes || []

  function postNote() {
    if (!text.trim()) return
    const newNote = {
      author,
      role,
      date: new Date().toISOString().slice(0, 10),
      text: text.trim()
    }
    updateRisk({ ...risk, notes: [...notes, newNote] })
    setText('')
  }

  return (
    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 20, marginTop: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
        Notes &amp; Collaboration
      </div>

      {notes.length === 0 && (
        <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>No notes yet. Add context for your team.</div>
      )}

      {notes.map((note, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: ROLE_COLORS[note.role] || '#64748B',
            color: '#fff', fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {getInitials(note.author)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{note.author}</span>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: ROLE_COLORS[note.role] || '#64748B',
                background: '#F8FAFC', borderRadius: 4, padding: '1px 5px'
              }}>{note.role}</span>
              <span style={{ fontSize: 10, color: '#94A3B8' }}>{note.date}</span>
            </div>
            <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{note.text}</div>
          </div>
        </div>
      ))}

      {/* Add note form */}
      <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '12px 14px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name"
            style={{ fontSize: 12, border: '1px solid #E2E8F0', borderRadius: 6, padding: '5px 8px', flex: 1, outline: 'none' }}
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{ fontSize: 12, border: '1px solid #E2E8F0', borderRadius: 6, padding: '5px 8px', background: '#fff', outline: 'none' }}
          >
            <option>Legal</option>
            <option>Product</option>
            <option>Engineering</option>
          </select>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add context for your team..."
          rows={3}
          style={{ width: '100%', fontSize: 12, border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 8px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
        <button
          onClick={postNote}
          disabled={!text.trim()}
          style={{
            marginTop: 6, fontSize: 12, fontWeight: 700,
            color: '#fff', background: text.trim() ? '#FF6B2C' : '#CBD5E1',
            border: 'none', borderRadius: 8, padding: '7px 18px',
            cursor: text.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.15s'
          }}
        >
          Post Note
        </button>
      </div>
    </div>
  )
}
