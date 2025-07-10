import React, { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import apiClient from '../../shared/utils/apiClient'
import { ENV_CONFIG } from '../config/env.js'

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
            <li>
              <strong>
                <a
                  href={`https://t.me/${ENV_CONFIG.TELEGRAM_BOT_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Telegram Bot
                </a>
              </strong>: Retrieve subnet report cards instantly on demand
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-center">📊 Why It Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">⚡ 89x Faster Processing</h3>
              <p className="text-sm text-zinc-400">Distributed monitoring processes all 118 subnets in just 5.37 seconds (22 subnets/second) - 89x faster than traditional cloud infrastructure.</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">💰 83% Cost Savings</h3>
              <p className="text-sm text-zinc-400">Our io.net infrastructure costs $150/month vs $900/month for traditional cloud (AWS/GCP), delivering massive savings with better performance.</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">📡 Unmatched Coverage</h3>
              <p className="text-sm text-zinc-400">Exclusive data from Ethos and Kaito teams, plus real-time distributed processing across all 118+ Bittensor subnets.</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-3">🔍 Technical Stack</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-1">
              <li><strong>Frontend:</strong> React + Tailwind CSS</li>
              <li><strong>Backend:</strong> Express.js + Python Ray distributed processing</li>
              <li><strong>Data Sources:</strong> TaoStats, GitHub, Ethos, Kaito</li>
              <li><strong>AI Agents:</strong> io.net with multi-model LLM selection</li>
              <li><strong>Caching:</strong> Redis with intelligent TTL management</li>
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