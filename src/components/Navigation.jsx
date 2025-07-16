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
    { path: '/network-health', label: 'Health' },
    { path: '/about', label: 'About' },
    { path: '/brief', label: 'Brief' }
  ]

  const telegramBotUrl = `https://t.me/${ENV_CONFIG.TELEGRAM_BOT_USERNAME}`

  return (
    <nav className="absolute top-6 right-6 z-10">
      <div className="flex space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-1 text-sm font-medium transition-colors rounded ${
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
          className="px-3 py-1 text-sm font-medium transition-colors rounded text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1"
          title="Chat with Subnet Scout Bot"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Bot</span>
        </a>
      </div>
    </nav>
  )
}

export default Navigation