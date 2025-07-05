import React, { useState, useEffect } from 'react'
import apiClient from '../utils/apiClient'

const AboutPage = () => {
  const [systemHealth, setSystemHealth] = useState(null)

  useEffect(() => {
    const fetchSystemHealth = async () => {
      try {
        const health = await apiClient.healthCheck()
        setSystemHealth(health)
      } catch (error) {
        console.warn('Could not fetch system health:', error)
        setSystemHealth({ status: 'unknown' })
      }
    }

    fetchSystemHealth()
  }, [])

  return (
    <div className="bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white font-sans min-h-screen px-6 py-12">
      <main className="max-w-4xl mx-auto space-y-8">
        <header className="text-center mb-10">
          <h1 className="text-6xl font-extrabold tracking-tight font-glitch">Subnet Scout</h1>
          <p className="text-zinc-300 mt-4 max-w-2xl mx-auto">
            <strong>Subnet Scout</strong> is a decentralized analytics platform built to surface high-signal intelligence from the Bittensor network. Our goal is to simplify complex subnet data into actionable insights using cutting-edge AI and on-chain tools — all while running on decentralized infrastructure.
          </p>
          {systemHealth && (
            <div className="mt-4 flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                systemHealth.status === 'healthy' || systemHealth.status === 'ok' 
                  ? 'bg-green-500' 
                  : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-gray-400">
                System Status: {systemHealth.status === 'healthy' || systemHealth.status === 'ok' ? 'Online' : 'Monitoring'}
              </span>
            </div>
          )}
        </header>

        <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-xl">
          <h2 className="text-xl font-semibold mb-3">🧠 Powered by</h2>
          <ul className="list-disc list-inside text-zinc-300 space-y-2">
            <li><strong>TaoStats API</strong>: Real-time/historical subnet data (emissions, yield, validators, holders, health, etc.)</li>
            <li><strong>io.net Agents</strong>: AI-generated commentary and intelligent subnet rankings</li>
            <li><strong>Ethos, Kaido, GitHub</strong>: Pulling high-signal off-chain data and developer activity</li>
            <li><strong>Telegram Bot</strong>: Retrieve subnet report cards instantly on demand</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-center">📊 Why It Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">⚡ 83% Cost Savings</h3>
              <p className="text-sm text-zinc-400">Compared to traditional cloud (AWS/GCP), our io.net agent infra saves users up to 83% while improving elasticity and scalability.</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">📡 Unmatched Coverage</h3>
              <p className="text-sm text-zinc-400">We bring in exclusive data from teams like Ethos and Kaido — and are constantly expanding with new sources we deem worthy.</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">🛠️ Built for Builders</h3>
              <p className="text-sm text-zinc-400">Open source, extensible, and developer-friendly. Fork it, remix it, or contribute your own subnet rules.</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-3">🔍 Technical Stack</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-1">
              <li><strong>Frontend:</strong> React + Tailwind CSS</li>
              <li><strong>Backend:</strong> Express.js</li>
              <li><strong>Data Sources:</strong> TaoStats, GitHub, Ethos, Kaido</li>
              <li><strong>Agents:</strong> io.net with OpenAI-compatible LLMs</li>
              <li><strong>Hosting:</strong> Decentralized infrastructure (via io.net)</li>
            </ul>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-3">🚧 Future Additions</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-1">
              <li>Community-powered subnet reviews</li>
              <li>Git-based contributor reputation tracking</li>
              <li>Visual analytics dashboards (emissions, stake flows, etc.)</li>
            </ul>
          </section>
        </div>

        <section className="bg-zinc-900 p-6 rounded-xl border border-red-600/50 shadow-xl">
          <h2 className="text-xl font-semibold mb-3 text-red-400">Disclaimer</h2>
          <p className="text-sm text-zinc-300">Subnet Scout is an experimental analytics platform. All information is for educational and informational purposes only and should not be construed as financial advice. Always do your own research. AI-generated content may be incomplete, incorrect, or out of date.</p>
        </section>
      </main>
    </div>
  )
}

export default AboutPage