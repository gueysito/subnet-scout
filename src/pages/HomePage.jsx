import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dataService from '../services/dataService'
import SubnetReportCard from '../components/SubnetReportCard'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [marketData, setMarketData] = useState({
    taoMarketCap: '$1.23B',
    taoChange24h: '+3.4%',
    taoChange7d: '+8.1%',
    taoChange1m: '+12.9%',
    subnetMarketCap: '$345M',
    subnetChange24h: '-0.6%',
    subnetChange7d: '+2.2%',
    subnetChange1m: '+10.4%',
    networkHealth: '92%'
  })
  const [showReportCard, setShowReportCard] = useState(false)
  const [selectedSubnetId, setSelectedSubnetId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await dataService.getMarketData()
        setMarketData(data)
      } catch (err) {
        console.error('Error fetching market data:', err)
        // Keep fallback data if API fails
      }
    }

    fetchMarketData()
  }, [])

  // Detect if search query is a subnet ID or name
  const detectSubnetQuery = (query) => {
    const trimmed = query.trim().toLowerCase()
    
    // Check if it's a direct subnet number
    const subnetNumber = parseInt(trimmed.replace(/^subnet\s*/i, ''))
    if (!isNaN(subnetNumber) && subnetNumber >= 1 && subnetNumber <= 118) {
      return subnetNumber
    }
    
    // Check common subnet names
    const subnetNames = {
      'text prompting': 1,
      'prompting': 1,
      'text': 1,
      'machine translation': 2,
      'translation': 2,
      'scraping': 3,
      'multi modality': 4,
      'multimodal': 4,
      'image generation': 5,
      'image': 5,
      'finance bots': 6,
      'finance': 6,
      'financial': 6,
      'taoshi': 8,
      'filetao': 21,
      'storage': 21,
      'file': 21
    }
    
    return subnetNames[trimmed] || null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    // Check if this looks like a subnet query
    const subnetId = detectSubnetQuery(searchQuery)
    
    if (subnetId) {
      // Show report card for subnet
      setSelectedSubnetId(subnetId)
      setShowReportCard(true)
      setSearchQuery('') // Clear search after opening modal
    } else {
      // Navigate to explorer for general search
      navigate(`/explorer?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white min-h-screen font-sans">
      <header className="text-center py-20">
        <h1 className="text-6xl font-extrabold tracking-tight font-glitch">Subnet Scout</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto font-sans">
          Discover powerful subnets using decentralized intelligence. Powered by io.net, TaoStats, and more.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
            <h2 className="text-xl font-semibold">TAO Market Cap</h2>
            <p className="text-3xl font-bold mt-2">{marketData.taoMarketCap}</p>
            <div className="mt-2 text-sm text-green-400">{marketData.taoChange24h} (24h)</div>
            <div className="text-xs text-gray-400">{marketData.taoChange7d} (7d) | {marketData.taoChange1m} (1mo)</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
            <h2 className="text-xl font-semibold">Subnet Market Cap</h2>
            <p className="text-3xl font-bold mt-2">{marketData.subnetMarketCap}</p>
            <div className="mt-2 text-sm text-red-400">{marketData.subnetChange24h} (24h)</div>
            <div className="text-xs text-gray-400">{marketData.subnetChange7d} (7d) | {marketData.subnetChange1m} (1mo)</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
            <h2 className="text-xl font-semibold">Network Health</h2>
            <p className="text-3xl font-bold mt-2">{marketData.networkHealth}</p>
            <div className="mt-2 text-sm text-green-400">Stable</div>
            <div className="text-xs text-gray-400">Monitored across emissions, uptime, and activity</div>
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Explore a Subnet</h2>
          <p className="text-gray-400 text-sm mb-4">
            Enter a subnet number (1-118) or name to get a comprehensive report card, or search for other content.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
            <input 
              type="text" 
              placeholder="Try: '6', 'finance bots', 'taoshi', or 'subnet 21'..." 
              className="w-full md:w-auto flex-1 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
            >
              Scout
            </button>
          </form>
          <div className="mt-3 text-xs text-gray-500">
            🧾 Subnet queries show detailed report cards • 🔍 Other searches explore the network
          </div>
        </section>
      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; 2025 Subnet Scout. All rights reserved.
      </footer>

      {/* Subnet Report Card Modal */}
      <SubnetReportCard 
        subnetId={selectedSubnetId}
        isOpen={showReportCard}
        onClose={() => setShowReportCard(false)}
      />
    </div>
  )
}

export default HomePage