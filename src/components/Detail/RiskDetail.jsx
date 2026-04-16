import { useState } from 'react'
import DetailHeader from './DetailHeader'
import DefinitionPanel from './DefinitionPanel'
import FlywheelDiagram from './FlywheelDiagram'
import SectionTabs from './SectionTabs'

export default function RiskDetail({ risk, updateRisk, onBack }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [activeSection, setActiveSection] = useState('ingest')

  function handleEdit() {
    setDraft(JSON.parse(JSON.stringify(risk)))
    setEditing(true)
  }

  function handleSave() {
    updateRisk(draft)
    setEditing(false)
    setDraft(null)
  }

  function handleCancel() {
    setEditing(false)
    setDraft(null)
  }

  function handleStatusChange(newStatus) {
    updateRisk({ ...risk, status: newStatus })
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Sticky glassy header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#1E293B',
        borderBottom: '1px solid #334155',
      }}>
        <DetailHeader
          risk={risk}
          editing={editing}
          onBack={onBack}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Two-column layout — scrolls as one page */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        maxWidth: 1400,
        margin: '0 auto',
        width: '100%',
        alignItems: 'start',
      }}>
        {/* Left column */}
        <div style={{ borderRight: '1px solid #E2E8F0', minHeight: 'calc(100vh - 58px)' }}>
          <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #E2E8F0' }}>
            <FlywheelDiagram
              risk={risk}
              activeSection={activeSection}
              onSectionClick={setActiveSection}
            />
          </div>
          <div style={{ padding: '4px 20px' }}>
            <DefinitionPanel
              risk={risk}
              onSave={updateRisk}
            />
          </div>
        </div>

        {/* Right column */}
        <div>
          <SectionTabs
            risk={risk}
            updateRisk={updateRisk}
            activeSection={activeSection}
            onSectionClick={setActiveSection}
          />
        </div>
      </div>
    </div>
  )
}
