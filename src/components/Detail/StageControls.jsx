const STAGE_COLORS_MAP = { complete: '#10B981', in_progress: '#F59E0B', not_started: '#CBD5E1' }

const STAGES = [
  { id: 'ingestion',            label: 'Ingestion' },
  { id: 'businessProfile',      label: 'Business Profile' },
  { id: 'customerIntelligence', label: 'Customer Intelligence' },
  { id: 'presentation',         label: 'Presentation' },
]

export default function StageControls({ flywheel, onUpdateStage }) {
  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 340 }}>
      {STAGES.map(stage => {
        const stageStatus = flywheel?.[stage.id]?.status || 'not_started'
        return (
          <div key={stage.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: STAGE_COLORS_MAP[stageStatus] }} />
              <span style={{ fontSize: 12, color: '#374151' }}>{stage.label}</span>
            </div>
            <select
              value={stageStatus}
              onChange={e => onUpdateStage(stage.id, e.target.value)}
              style={{
                fontSize: 11, color: '#374151', border: '1px solid #E2E8F0',
                borderRadius: 6, padding: '3px 8px', background: '#fff', cursor: 'pointer'
              }}
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="complete">Complete</option>
            </select>
          </div>
        )
      })}
    </div>
  )
}
