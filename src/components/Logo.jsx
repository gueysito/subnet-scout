import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({ className = '', size = 'large' }) => {
  const sizeClasses = {
    large: 'text-6xl',
    medium: 'text-4xl',
    small: 'text-2xl'
  }
  
  const robotSizes = {
    large: 'w-16 h-16', // ~3% bigger than text-6xl
    medium: 'w-12 h-12', // ~3% bigger than text-4xl  
    small: 'w-8 h-8'     // ~3% bigger than text-2xl
  }

  return (
    <Link to="/" className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}>
      <div 
        className={`${robotSizes[size]} bg-contain bg-no-repeat bg-center pixelated`}
        style={{ 
          backgroundImage: 'url(/robot-logo.png)',
          imageRendering: 'pixelated',
          filter: 'brightness(1.2) contrast(1.1)',
          mixBlendMode: 'screen'
        }}
        aria-label="Subnet Scout Robot"
      />
      <h1 className={`${sizeClasses[size]} font-extrabold tracking-tight font-glitch`}>
        Subnet Scout
      </h1>
    </Link>
  )
}

export default Logo