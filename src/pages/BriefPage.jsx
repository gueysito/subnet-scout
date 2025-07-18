import React, { useState } from 'react'
import { MessageCircle, Twitter, Brain, Shield, TrendingUp, Cpu, Users } from 'lucide-react'
import apiClient from '../../shared/utils/apiClient'
import { ENV_CONFIG } from '../config/env.js'

const BriefPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // 'success', 'error', or null
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || isSubmitting) return

    setIsSubmitting(true)
    setStatus(null)
    setMessage('')

    try {
      const response = await apiClient.post('/api/newsletter/subscribe', {
        email: email.trim(),
        source: 'brief_page'
      })

      setStatus('success')
      setMessage(response.message || 'Successfully subscribed!')
      setEmail('') // Clear the form
      
    } catch (error) {
      setStatus('error')
      if (error.response?.data?.error?.code === 'ALREADY_SUBSCRIBED') {
        setMessage('You\'re already subscribed to our intelligence briefs!')
      } else if (error.response?.data?.error?.code === 'INVALID_EMAIL_FORMAT') {
        setMessage('Please enter a valid email address.')
      } else {
        setMessage('Something went wrong. Please try again later.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="text-white font-sans min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-400 mb-4">
            Quarterly Intelligence Briefs
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-2">
            5 AI Agents. 118 Subnets. 1 Quarterly Report.
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Get exclusive quarterly intelligence powered by our specialized AI research team. 
            We analyze all 118 Bittensor subnets to uncover patterns invisible to human analysis 
            and deliver professional insights you won't find anywhere else.
          </p>
        </div>
      </div>

      {/* AI Agents Showcase */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Meet Your AI Research Team
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five specialized agents working 24/7 to analyze patterns, trends, and opportunities 
            across the entire Bittensor ecosystem that human analysts simply cannot detect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Momentum - Growth Analyst */}
          <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <div className="text-green-400 mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Momentum</h3>
            <p className="text-sm text-gray-500 font-medium mb-3 uppercase tracking-wide">Growth Analyst</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tracks explosive subnet adoption and identifies breakthrough growth patterns that signal massive opportunity.
            </p>
          </div>

          {/* Dr. Protocol - Tech Evaluator */}
          <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <div className="text-blue-400 mb-4">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">Dr. Protocol</h3>
            <p className="text-sm text-gray-500 font-medium mb-3 uppercase tracking-wide">Tech Evaluator</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Examines code quality, innovation metrics, and technical infrastructure to identify technological breakthroughs.
            </p>
          </div>

          {/* Ops - Performance Analyst */}
          <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <div className="text-purple-400 mb-4">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Ops</h3>
            <p className="text-sm text-gray-500 font-medium mb-3 uppercase tracking-wide">Performance Analyst</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Monitors network efficiency, validator optimization, and system reliability to spot performance leaders.
            </p>
          </div>

          {/* Pulse - Community Sentiment */}
          <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <div className="text-orange-400 mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-orange-400 mb-2">Pulse</h3>
            <p className="text-sm text-gray-500 font-medium mb-3 uppercase tracking-wide">Community Sentiment</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Reads social signals, developer engagement, and community momentum shifts across all platforms.
            </p>
          </div>

          {/* Guardian - Risk Assessor */}
          <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <div className="text-red-400 mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Guardian</h3>
            <p className="text-sm text-gray-500 font-medium mb-3 uppercase tracking-wide">Risk Assessor</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Identifies threats, vulnerabilities, and governance risks with mitigation strategies to protect investments.
            </p>
          </div>

          {/* Team Summary Card */}
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-6 rounded-xl border border-purple-500/30">
            <div className="text-purple-400 mb-4">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Collective Intelligence</h3>
            <p className="text-sm text-gray-500 font-medium mb-3 uppercase tracking-wide">AI Orchestration</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Our agents work together, cross-referencing findings to deliver the most comprehensive Bittensor intelligence available.
            </p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 rounded-2xl border border-zinc-700 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Join the Intelligence Network
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Be among the first to receive our exclusive quarterly intelligence briefings. 
              Each report delivers deep subnet analysis, emerging trend identification, 
              and strategic insights you won't find anywhere else.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200"
              >
                {isSubmitting ? 'Subscribing...' : 'Get Briefings'}
              </button>
            </div>
            
            {/* Status Messages */}
            {status && (
              <div className={`mt-4 p-4 rounded-lg ${
                status === 'success' 
                  ? 'bg-green-900/50 border border-green-700 text-green-300' 
                  : 'bg-red-900/50 border border-red-700 text-red-300'
              }`}>
                {status === 'success' && <span className="mr-2">✅</span>}
                {status === 'error' && <span className="mr-2">❌</span>}
                {message}
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              No spam, ever. Unsubscribe at any time. Your email is secure.
            </p>
          </form>
        </div>

        {/* What You'll Get */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">What You'll Receive</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-white">Subnet Movement Analysis</h4>
                <p className="text-gray-400 text-sm">Track major stake migrations, validator changes, and emission shifts across all networks.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-600 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-white">Bullish Subnet Spotlights</h4>
                <p className="text-gray-400 text-sm">Deep dives into high-potential subnets showing strong development and community growth.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-purple-600 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-white">Risk Assessment Updates</h4>
                <p className="text-gray-400 text-sm">AI-powered evaluation of subnet health, validator reliability, and potential red flags.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-orange-600 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-white">Strategic Recommendations</h4>
                <p className="text-gray-400 text-sm">Actionable insights for validators, delegators, and TAO holders based on current market dynamics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-8 border-t border-zinc-800">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <a
              href={`https://t.me/${ENV_CONFIG.TELEGRAM_BOT_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors border border-blue-700 rounded-lg hover:bg-blue-900/20"
              title="Chat with Subnet Scout Bot"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Get instant reports via Telegram</span>
            </a>
            <a
              href="https://x.com/subnetscout"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors border border-blue-700 rounded-lg hover:bg-blue-900/20"
              title="Follow us on X (Twitter)"
            >
              <Twitter className="w-5 h-5" />
              <span>Follow us on X</span>
            </a>
          </div>
          <div>
            <p>&copy; 2025 Subnet Scout Intelligence Briefs. All rights reserved.</p>
            <p className="mt-2">Powered by decentralized AI • Built on io.net</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BriefPage