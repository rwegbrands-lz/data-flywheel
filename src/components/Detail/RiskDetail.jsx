import { useState } from 'react'
import DetailHeader from './DetailHeader'
import DefinitionPanel from './DefinitionPanel'
import FlywheelDiagram from './FlywheelDiagram'
import SectionTabs from './SectionTabs'

export default function RiskDetail({ risk, updateRisk, onBack }) {
  const [activeSection, setActiveSection] = useState('ingest')

  function handleStatusChange(newStatus) {
    updateRisk({ ...risk, status: newStatus })
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
      }}>
        <DetailHeader
          risk={risk}
          onBack={onBack}
          onStatusChange={handleStatusChange}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        maxWidth: 1400,
        margin: '0 auto',
        width: '100%',
        alignItems: 'start',
      }}>
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
