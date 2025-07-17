import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import ExplorerPage from './pages/ExplorerPage'
import AboutPage from './pages/AboutPage'
import BriefPage from './pages/BriefPage'
import NetworkHealthPage from './pages/NetworkHealthPage'
import MiningTrendsPage from './pages/MiningTrendsPage'
import ValidatorRadarPage from './pages/ValidatorRadarPage'

function App() {
  return (
    <Router>
      <div className="relative">
        <Navigation />
        <div className="pt-16 md:pt-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/brief" element={<BriefPage />} />
            <Route path="/network-health" element={<NetworkHealthPage />} />
            <Route path="/mining-trends" element={<MiningTrendsPage />} />
            <Route path="/validator-radar" element={<ValidatorRadarPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App