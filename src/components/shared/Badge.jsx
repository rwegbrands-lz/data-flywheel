export default function Badge({ label, color, bg, style }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 9999,
      fontSize: 11,
      fontWeight: 700,
      color,
      background: bg,
      letterSpacing: '0.04em',
      ...style
    }}>
      {label}
    </span>
  )
}
