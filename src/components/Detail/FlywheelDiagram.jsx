const STAGE_COLORS = { complete: '#10B981', in_progress: '#F59E0B', not_started: '#CBD5E1' }
const SCORE_COLORS = { green: '#10B981', yellow: '#F59E0B', red: '#EF4444' }

const SECTIONS = [
  { id: 'ingest',  label: 'Data Ingestion',      start: -60, end: 60,  labelYOffset: 15 },
  { id: 'consume', label: 'Connected Surfaces',  start: 60,  end: 180, labelYOffset: 12 },
  { id: 'reason',  label: 'Business Logic',      start: 180, end: 300, labelYOffset: 0  },
]

function getSectionStatus(risk, id) {
  const fw = risk.flywheel || {}
  if (id === 'ingest') {
    const s = [fw.ingestion?.status, fw.businessProfile?.status]
    if (s.every(x => x === 'complete')) return 'complete'
    if (s.some(x => x === 'in_progress' || x === 'complete')) return 'in_progress'
    return 'not_started'
  }
  if (id === 'reason') return fw.customerIntelligence?.status || 'not_started'
  if (id === 'consume') return fw.presentation?.status || 'not_started'
  return 'not_started'
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function donutArcPath(cx, cy, innerR, outerR, startAngle, endAngle, gap = 6) {
  const s = startAngle + gap, e = endAngle - gap
  const p1 = polarToCartesian(cx, cy, outerR, s)
  const p2 = polarToCartesian(cx, cy, outerR, e)
  const p3 = polarToCartesian(cx, cy, innerR, e)
  const p4 = polarToCartesian(cx, cy, innerR, s)
  return `M${p1.x},${p1.y} A${outerR},${outerR},0,0,1,${p2.x},${p2.y} L${p3.x},${p3.y} A${innerR},${innerR},0,0,0,${p4.x},${p4.y}Z`
}

export default function FlywheelDiagram({ risk, activeSection, onSectionClick }) {
  const cx = 150, cy = 135, innerR = 44, outerR = 96

  const scoreIcon = risk.riskScore === 'green' ? '✓' : risk.riskScore === 'yellow' ? '!' : risk.riskScore === 'red' ? '✕' : null
  const scoreColor = risk.riskScore ? SCORE_COLORS[risk.riskScore] : '#94A3B8'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="100%" viewBox="0 0 300 340" style={{ maxWidth: 240, display: 'block', margin: '0 auto', overflow: 'visible' }}>
        {SECTIONS.map(sec => {
          const status = getSectionStatus(risk, sec.id)
          const isActive = activeSection === sec.id
          const midAngle = (sec.start + sec.end) / 2
          const labelPos = polarToCartesian(cx, cy, outerR + 40, midAngle)
          return (
            <g key={sec.id} onClick={() => onSectionClick?.(sec.id)} style={{ cursor: 'pointer' }}>
              <path
                d={donutArcPath(cx, cy, innerR, outerR, sec.start, sec.end)}
                fill={STAGE_COLORS[status]}
                opacity={isActive ? 1 : status === 'not_started' ? 0.3 : 0.65}
                style={{ transition: 'opacity 0.15s' }}
              />
              <text
                x={labelPos.x} y={labelPos.y + (sec.labelYOffset || 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: 18,
                  fill: isActive ? '#0F172A' : '#475569',
                  fontWeight: isActive ? 700 : 600,
                  fontFamily: 'Figtree, system-ui, sans-serif',
                  pointerEvents: 'none'
                }}
              >
                {sec.label.includes(' ') ? sec.label.split(' ').reduce((lines, word) => {
                  const last = lines[lines.length - 1]
                  if (last && (last + ' ' + word).length <= 12) {
                    lines[lines.length - 1] = last + ' ' + word
                  } else {
                    lines.push(word)
                  }
                  return lines
                }, []).map((line, li, arr) => (
                  <tspan key={li} x={labelPos.x} dy={li === 0 ? -(arr.length - 1) * 11 : 22}>{line}</tspan>
                )) : sec.label}
              </text>
            </g>
          )
        })}

        <circle cx={cx} cy={cy} r={innerR} fill="#fff" stroke="#E2E8F0" strokeWidth={1.5} />
        {scoreIcon ? (
          <>
            <text x={cx} y={cy - 12} textAnchor="middle" style={{ fontSize: 24, fill: scoreColor, fontWeight: 700, fontFamily: 'Figtree, system-ui, sans-serif' }}>{scoreIcon}</text>
            <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontSize: 14, fill: scoreColor, fontWeight: 700, fontFamily: 'Figtree, system-ui, sans-serif' }}>
              {risk.riskScore}
            </text>
            {risk.confidence != null && (
              <text x={cx} y={cy + 22} textAnchor="middle" style={{ fontSize: 12, fill: '#475569', fontFamily: 'Figtree, system-ui, sans-serif' }}>
                {Math.round(risk.confidence * 100)}% conf.
              </text>
            )}
          </>
        ) : (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 14, fill: '#475569', fontWeight: 600, fontFamily: 'Figtree, system-ui, sans-serif' }}>
            {risk.status?.replace(/_/g, ' ')}
          </text>
        )}
      </svg>

      <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
        {[['#10B981', 'Complete'], ['#F59E0B', 'In Progress'], ['#CBD5E1', 'Not Started']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: 13, color: '#475569' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
