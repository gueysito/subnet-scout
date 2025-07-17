import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Twitter } from 'lucide-react'
import dataService from '../services/dataService'
import SubnetReportCard from '../components/SubnetReportCard'
import Logo from '../components/Logo'
import { ENV_CONFIG } from '../config/env.js'

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
  const [taoResponse, setTaoResponse] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
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
    
    // Check for placeholder patterns like "subnet x" - these should NOT trigger subnet navigation
    // Instead, they should be processed as TAO questions
    const placeholderPatterns = /subnet\s*[x|xx|xxx|?]/i
    if (placeholderPatterns.test(trimmed)) {
      return null // Don't treat as valid subnet ID, let it go to TAO processing
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

  // Detect if query is a TAO-specific question
  const detectTaoQuestion = (query) => {
    const trimmed = query.trim().toLowerCase()
    
    // TAO question keywords
    const taoKeywords = [
      'tao', 'subnet', 'staking', 'emissions', 'validators', 'bittensor',
      'how much', 'latest', 'news', 'announcement', 'github', 'development',
      'health', 'performance', 'community', 'price', 'market'
    ]
    
    // Question indicators
    const questionIndicators = ['?', 'how', 'what', 'when', 'where', 'why', 'latest', 'recent']
    
    // Comparison and action keywords
    const comparisonKeywords = ['compare', 'vs', 'versus', 'difference', 'better', 'best']
    
    // Check if it contains subnet numbers (like "11 and 9" or "subnet 5 vs 8")
    const hasSubnetNumbers = /\b\d{1,3}\b/.test(trimmed)
    
    const hasQuestionIndicator = questionIndicators.some(indicator => 
      trimmed.includes(indicator)
    )
    
    const hasTaoKeyword = taoKeywords.some(keyword => 
      trimmed.includes(keyword)
    )
    
    const hasComparison = comparisonKeywords.some(keyword => 
      trimmed.includes(keyword)
    )
    
    // Return true if:
    // 1. Traditional TAO question (question indicator + TAO keyword)
    // 2. Comparison query with subnet numbers
    // 3. Query with subnet numbers and TAO context
    return (hasQuestionIndicator && hasTaoKeyword) || 
           (hasComparison && hasSubnetNumbers) ||
           (hasSubnetNumbers && (hasTaoKeyword || hasComparison))
  }

  // Process TAO question using io.net agents
  const processTaoQuestion = async (question) => {
    setIsProcessing(true)
    setTaoResponse(null)
    
    try {
      const response = await dataService.processTaoQuestion(question)
      setTaoResponse(response)
    } catch (error) {
      console.error('Error processing TAO question:', error)
      setTaoResponse({
        answer: "I'm having trouble processing that question right now. Please try asking about a specific subnet number for a report card instead.",
        agent: 'Error Handler',
        error: true
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    // Clear any previous responses
    setTaoResponse(null)
    
    // Check if this looks like a subnet query (first priority)
    const subnetId = detectSubnetQuery(searchQuery)
    
    if (subnetId) {
      // Show report card for subnet
      setSelectedSubnetId(subnetId)
      setShowReportCard(true)
      setSearchQuery('') // Clear search after opening modal
    } else if (detectTaoQuestion(searchQuery)) {
      // Process TAO-specific question with io.net agents
      await processTaoQuestion(searchQuery)
      setSearchQuery('') // Clear search after processing
    } else {
      // Navigate to explorer for general search
      navigate(`/explorer?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white min-h-screen font-sans">
      {/* Logo in top-left */}
      <div className="absolute top-6 left-6 z-10">
        <Logo size="medium" />
      </div>
      
      <header className="text-center py-20">
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
            Enter a subnet number (1-118) or name for a report card, or ask TAO-specific questions.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
            <input 
              type="text" 
              placeholder="Try: 'subnet 8', 'How much TAO does FileTAO have?', or 'Latest news about Taoshi'" 
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
            🧾 Subnet names/numbers show report cards • 🤖 TAO questions get AI-powered answers
          </div>
        </section>

        {/* TAO Question Processing/Response Modal - Center Screen */}
        {(isProcessing || taoResponse) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              {isProcessing && (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-6"></div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">Processing with io.net Intelligence...</h3>
                  <p className="text-gray-400">Analyzing your question using advanced AI models</p>
                </div>
              )}
              
              {taoResponse && !isProcessing && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">TAO Intelligence Response</h3>
                    <button 
                      onClick={() => setTaoResponse(null)}
                      className="text-gray-400 hover:text-white text-2xl font-light"
                    >
                      ✕ Close
                    </button>
                  </div>
                  
                  <div className={`p-6 rounded-xl border-l-4 ${
                    taoResponse.error 
                      ? 'bg-red-900/20 border-red-500' 
                      : 'bg-blue-900/20 border-blue-500'
                  }`}>
                    <div className="text-white leading-relaxed text-base">
                      {taoResponse.answer.split('\n').map((line, index) => (
                        <p key={index} className={index > 0 ? 'mt-4' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                    
                    {taoResponse.agent && !taoResponse.error && (
                      <div className="mt-4 pt-4 border-t border-gray-600 text-sm text-gray-400 flex items-center">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        Processed by {taoResponse.agent}
                        {taoResponse.model && (
                          <span className="ml-2 text-xs">• Model: {taoResponse.model}</span>
                        )}
                      </div>
                    )}
                    
                    {taoResponse.suggestions && taoResponse.suggestions.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <p className="text-sm text-gray-400 mb-3">Try these alternative questions:</p>
                        <div className="space-y-2">
                          {taoResponse.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSearchQuery(suggestion);
                                setTaoResponse(null);
                              }}
                              className="block w-full text-left text-sm text-blue-400 hover:text-blue-300 p-2 rounded bg-blue-900/10 hover:bg-blue-900/20 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {taoResponse.sources && taoResponse.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <p className="text-sm text-gray-400 mb-3">Sources:</p>
                        <div className="space-y-1">
                          {taoResponse.sources.map((source, index) => (
                            <a 
                              key={index}
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-400 hover:text-blue-300 block truncate"
                            >
                              • {source.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <a
              href={`https://t.me/${ENV_CONFIG.TELEGRAM_BOT_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 rounded-lg hover:bg-blue-50"
              title="Chat with Subnet Scout Bot"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with our Telegram Bot</span>
            </a>
            <a
              href="https://x.com/subnetscout"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 rounded-lg hover:bg-blue-50"
              title="Follow us on X (Twitter)"
            >
              <Twitter className="w-5 h-5" />
              <span>Follow us on X</span>
            </a>
          </div>
          <div>&copy; 2025 Subnet Scout. All rights reserved.</div>
        </div>
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