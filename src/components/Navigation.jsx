import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/explorer', label: 'Explorer' },
    { path: '/about', label: 'About' },
    { path: '/brief', label: 'Brief' }
  ]

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
      </div>
    </nav>
  )
}

export default Navigation