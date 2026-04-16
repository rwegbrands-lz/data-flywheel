export default function ProgressBar({ value, max = 1, color, height = 6, style }) {
  const pct = Math.min(Math.max(value / max, 0), 1) * 100
  return (
    <div style={{ background: '#E2E8F0', borderRadius: 999, height, overflow: 'hidden', ...style }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.3s' }} />
    </div>
  )
}
