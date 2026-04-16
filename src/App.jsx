import { useState } from 'react'
import risksData from './data/risks.json'
import Dashboard from './components/Dashboard/Dashboard'
import RiskDetail from './components/Detail/RiskDetail'

export default function App() {
  const [risks, setRisks] = useState(risksData)
  const [selectedRiskId, setSelectedRiskId] = useState(null)

  const updateRisk = (updatedRisk) => {
    setRisks(prev => prev.map(r => r.id === updatedRisk.id ? updatedRisk : r))
  }

  const selectedRisk = risks.find(r => r.id === selectedRiskId) || null

  return (
    <div style={{ fontFamily: "'Figtree', system-ui, sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>
      {selectedRisk
        ? <RiskDetail risk={selectedRisk} updateRisk={updateRisk} onBack={() => setSelectedRiskId(null)} />
        : <Dashboard risks={risks} onSelectRisk={setSelectedRiskId} />
      }
    </div>
  )
}
