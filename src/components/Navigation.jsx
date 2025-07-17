import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { ENV_CONFIG } from '../config/env.js'

const Navigation = () => {
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 md:absolute md:top-6 md:right-6 md:left-auto md:bg-transparent md:backdrop-blur-none md:border-none">
      <div className="flex flex-wrap justify-center gap-2 p-4 md:justify-end md:gap-4 md:p-0">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-2 py-1 text-xs md:px-3 md:py-1 md:text-sm font-medium transition-colors rounded ${
              location.pathname === item.path
                ? 'bg-white/20 text-white border border-white/30'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <a
          href={telegramBotUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 text-xs md:px-3 md:py-1 md:text-sm font-medium transition-colors rounded text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1"
          title="Chat with Subnet Scout Bot"
        >
          <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Bot</span>
        </a>
      </div>
    </nav>
  )
}

export default Navigation