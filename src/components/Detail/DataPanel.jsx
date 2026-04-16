import { useState } from 'react'
import ProgressBar from '../shared/ProgressBar'

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, marginTop: 18 }}>{children}</div>
}

const SOURCE_COLORS = { Internal: '#3B82F6', External: '#8B5CF6' }
const SCORE_COLORS = { green: '#10B981', yellow: '#F59E0B', red: '#EF4444' }
const SCORE_BG = { green: '#D1FAE5', yellow: '#FEF3C7', red: '#FEE2E2' }

function DataChip({ dp }) {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span style={{
        display: 'inline-block',
        fontFamily: 'monospace', fontSize: 11,
        background: '#F1F5F9', border: '1px solid #E2E8F0',
        borderRadius: 6, padding: '3px 8px', margin: '2px',
        color: '#334155', cursor: 'default'
      }}>
        {dp.field}
      </span>
      {showTooltip && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0,
          background: '#1E293B', color: '#F1F5F9', borderRadius: 8,
          padding: '8px 12px', fontSize: 11, minWidth: 220, maxWidth: 280,
          zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', lineHeight: 1.5,
          whiteSpace: 'normal', marginBottom: 4
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{dp.displayName}</div>
          <div style={{ color: '#94A3B8', marginBottom: 4 }}>{dp.description}</div>
          <div>Source: <span style={{ color: '#7DD3FC' }}>{dp.source?.display || dp.source?.name}</span></div>
          <div>Availability: <span style={{ color: dp.source?.availability === 'Available' ? '#34D399' : '#FCD34D' }}>{dp.source?.availability}</span></div>
          {dp.source?.gap && <div style={{ color: '#FCA5A5', marginTop: 4 }}>Gap: {dp.source.gap}</div>}
        </div>
      )}
    </div>
  )
}

export default function DataPanel({ risk }) {
  const { dataPoints = [], flywheel, qualityAssurance, logic, riskScore } = risk
  const [logicOpen, setLogicOpen] = useState(false)

  const confidence = qualityAssurance?.currentConfidence
  const confColor = confidence >= 0.90 ? '#10B981' : confidence >= 0.75 ? '#F59E0B' : '#EF4444'

  const sources = flywheel?.ingestion?.sources || []
  const primarySources = sources.filter(s => s.type === 'Internal' || !s.type)
  const fallbackSources = sources.filter(s => s.type && s.type !== 'Internal')

  const currentLogic = riskScore && logic?.[riskScore]

  return (
    <div style={{ padding: '0 0 20px 0' }}>
      <SectionLabel>Data Points</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {dataPoints.length > 0
          ? dataPoints.map(dp => <DataChip key={dp.field} dp={dp} />)
          : <span style={{ fontSize: 12, color: '#94A3B8' }}>No data points defined yet.</span>
        }
      </div>

      {primarySources.length > 0 && (
        <>
          <SectionLabel>Primary Sources</SectionLabel>
          {primarySources.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: SOURCE_COLORS[s.type] || '#64748B' }} />
              <span style={{ fontSize: 12, color: '#374151' }}>{s.name}</span>
            </div>
          ))}
        </>
      )}

      {fallbackSources.length > 0 && (
        <>
          <SectionLabel>Fallback Sources</SectionLabel>
          {fallbackSources.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, opacity: 0.7 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: SOURCE_COLORS[s.type] || '#64748B' }} />
              <span style={{ fontSize: 12, color: '#374151' }}>{s.name}</span>
            </div>
          ))}
        </>
      )}

      {confidence != null && (
        <>
          <SectionLabel>Accuracy</SectionLabel>
          <ProgressBar value={confidence} max={1} color={confColor} height={8} />
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{Math.round(confidence * 100)}% confidence</div>
        </>
      )}

      {riskScore && currentLogic && (
        <>
          <SectionLabel>Risk Score</SectionLabel>
          <div style={{
            background: SCORE_BG[riskScore], borderRadius: 8,
            padding: '10px 14px', border: `1px solid ${SCORE_COLORS[riskScore]}33`
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: SCORE_COLORS[riskScore] }}>{currentLogic.label}</div>
            <div style={{ fontSize: 11, color: '#374151', marginTop: 4 }}>{currentLogic.humanReadable}</div>
            {currentLogic.nextBestAction && (
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
                NBA: <strong style={{ color: '#FF6B2C' }}>{currentLogic.nextBestAction}</strong>
              </div>
            )}
          </div>
        </>
      )}

      {currentLogic?.pseudoFunction && (
        <>
          <div
            onClick={() => setLogicOpen(o => !o)}
            style={{ cursor: 'pointer', fontSize: 11, color: '#FF6B2C', marginTop: 12, userSelect: 'none' }}
          >
            {logicOpen ? '▼' : '▶'} Logic ({riskScore?.toUpperCase()})
          </div>
          {logicOpen && (
            <pre style={{
              background: '#1E293B', color: '#7DD3FC',
              borderRadius: 8, padding: '10px 14px',
              fontSize: 10, overflow: 'auto', marginTop: 6,
              fontFamily: 'monospace', lineHeight: 1.6
            }}>
              {currentLogic.pseudoFunction}
            </pre>
          )}
        </>
      )}

      {qualityAssurance?.openFlags?.length > 0 && (
        <>
          <SectionLabel>Open Flags</SectionLabel>
          {qualityAssurance.openFlags.map((flag, i) => (
            <div key={i} style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#B45309' }}>{flag.flag}</div>
              <div style={{ fontSize: 11, color: '#78350F', marginTop: 2 }}>{flag.detail}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
