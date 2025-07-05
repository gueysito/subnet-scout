import React, { useState, useEffect } from 'react'
import dataService from '../services/dataService'

const BriefPage = () => {
  const [briefData, setBriefData] = useState({
    subnetOfMonth: {
      id: 47,
      category: 'Training',
      yield: '13.5%',
      health: 'Excellent',
      description: 'Selected for its consistent uptime, high participation rate, and strong developer backing. Recent commits show improved EVM compatibility and faster inference batching.'
    },
    risingStar: {
      id: 22,
      category: 'Prompting',
      yield: '9.8%',
      health: 'Good',
      description: 'Up 27% this week and gaining traction with a strong Ethos score and active contributors on GitHub. Watchlist worthy.'
    }
  })

  useEffect(() => {
    const fetchAIInsights = async () => {
      try {
        const insights = await dataService.getAIInsights()
        setBriefData(insights)
      } catch (err) {
        console.error('Error fetching AI insights:', err)
        // Keep fallback data if API fails
      }
    }

    fetchAIInsights()
  }, [])

  return (
    <div className="bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white font-sans min-h-screen px-6 py-12">
      <header className="text-center mb-10">
        <h1 className="text-6xl font-extrabold tracking-tight font-glitch">Subnet Scout</h1>
        <p className="text-gray-400 mt-2">AI-curated picks for top subnets based on current network conditions</p>
      </header>
      
      <main className="max-w-4xl mx-auto space-y-8">
        <article className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-xl">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">
            🏆 Subnet of the Month: Subnet {briefData.subnetOfMonth.id}
          </h2>
          <p className="text-sm text-zinc-300 mb-2">
            Category: {briefData.subnetOfMonth.category} • Yield: {briefData.subnetOfMonth.yield} • Health: {briefData.subnetOfMonth.health}
          </p>
          <p className="text-zinc-400 text-sm">
            {briefData.subnetOfMonth.description}
          </p>
        </article>
        
        <article className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-xl">
          <h2 className="text-lg font-semibold text-green-400 mb-2">
            🔍 Rising Star: Subnet {briefData.risingStar.id}
          </h2>
          <p className="text-sm text-zinc-300 mb-2">
            Category: {briefData.risingStar.category} • Yield: {briefData.risingStar.yield} • Health: {briefData.risingStar.health}
          </p>
          <p className="text-zinc-400 text-sm">
            {briefData.risingStar.description}
          </p>
        </article>
      </main>
    </div>
  )
}

export default BriefPage