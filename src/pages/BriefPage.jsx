import React, { useState } from 'react'
import { MessageCircle, Twitter } from 'lucide-react'
import apiClient from '../../shared/utils/apiClient'
import Logo from '../components/Logo'
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
    <div className="bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white font-sans min-h-screen">
      {/* Logo in top-left */}
      <div className="absolute top-6 left-6 z-10">
        <Logo size="medium" />
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-normal text-blue-400 mt-16 mb-6">
            Intelligence Briefs
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get exclusive bi-monthly intelligence reports powered by decentralized AI. 
            We analyze all 118+ Bittensor subnets to identify emerging opportunities, 
            track major movements, and spotlight the most bullish developments in the ecosystem.
          </p>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-700">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-blue-400 mb-3">Decentralized Intelligence</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our AI agents process real-time data from TaoStats, GitHub activity, social sentiment, 
              and validator metrics to identify trends before they become obvious.
            </p>
          </div>
          
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-700">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-green-400 mb-3">Alpha Opportunities</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Early identification of subnet momentum shifts, development breakthroughs, 
              and validator migration patterns that signal significant upside potential.
            </p>
          </div>
          
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-700">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-purple-400 mb-3">Professional Analysis</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Curated insights for serious TAO investors. No noise, no speculation - 
              just actionable intelligence backed by comprehensive data analysis.
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
              Be among the first to receive our exclusive bi-monthly briefings. 
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