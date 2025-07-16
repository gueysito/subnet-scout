import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import ExplorerPage from './pages/ExplorerPage'
import AboutPage from './pages/AboutPage'
import BriefPage from './pages/BriefPage'
import NetworkHealthPage from './pages/NetworkHealthPage'

function App() {
  return (
    <Router>
      <div className="relative">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/brief" element={<BriefPage />} />
          <Route path="/network-health" element={<NetworkHealthPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App