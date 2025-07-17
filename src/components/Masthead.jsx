import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { ENV_CONFIG } from '../config/env.js'

const Masthead = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/explorer', label: 'Explorer' },
    { path: '/mining-trends', label: 'Mining' },
    { path: '/validator-radar', label: 'Validators' },
    { path: '/network-health', label: 'Health' },
    { path: '/about', label: 'About' },
    { path: '/brief', label: 'Brief' }
  ]

  const telegramBotUrl = `https://t.me/${ENV_CONFIG.TELEGRAM_BOT_USERNAME}`

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-glitch text-white hover:opacity-80 transition-opacity"
            >
              Subnet Scout
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white border border-white/30 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1"
              title="Chat with Subnet Scout Bot"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Bot</span>
            </a>
          </nav>

          {/* Navigation - Mobile */}
          <div className="md:hidden">
            <details className="relative">
              <summary className="flex items-center justify-center w-10 h-10 rounded-md bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </summary>
              <nav className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-lg py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-white/20 text-white border-l-2 border-white/50'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-white/10 mt-2 pt-2">
                  <a
                    href={telegramBotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
                    title="Chat with Subnet Scout Bot"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Bot</span>
                  </a>
                </div>
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Masthead