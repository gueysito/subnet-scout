import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Masthead from './components/Masthead'
import HomePage from './pages/HomePage'
import ExplorerPage from './pages/ExplorerPage'
import AboutPage from './pages/AboutPage'
import BriefPage from './pages/BriefPage'
import ScoutBriefAdmin from './pages/ScoutBriefAdmin'
import NetworkHealthPage from './pages/NetworkHealthPage'
import MiningTrendsPage from './pages/MiningTrendsPage'
import ValidatorRadarPage from './pages/ValidatorRadarPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800">
        <Masthead />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/brief" element={<BriefPage />} />
            <Route path="/brief/admin" element={<ScoutBriefAdmin />} />
            <Route path="/network-health" element={<NetworkHealthPage />} />
            <Route path="/mining-trends" element={<MiningTrendsPage />} />
            <Route path="/validator-radar" element={<ValidatorRadarPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App