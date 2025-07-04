import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for optimal class name handling
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * PROFESSIONAL LAYOUT SYSTEM - PROPERLY CENTERED AND RESPONSIVE
 */
export const containerStyles = {
  // Main page container - FIXED CENTERING
  page: cn(
    'min-h-screen w-full',
    'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900',
    'text-white relative overflow-hidden'
  ),
  
  // Section containers - PROPERLY CENTERED
  section: cn(
    'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
  ),
  
  // Content containers - RESPONSIVE AND CENTERED
  content: cn(
    'w-full max-w-6xl mx-auto space-y-8'
  ),
  
  // Grid layouts - RESPONSIVE
  grid: cn(
    'grid gap-6 w-full'
  ),
  grid2: cn(
    'grid grid-cols-1 lg:grid-cols-2 gap-6 w-full'
  ),
  grid3: cn(
    'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full'
  ),
  grid4: cn(
    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full'
  ),
  
  // Flex layouts - PROPERLY ALIGNED
  flexCenter: 'flex items-center justify-center w-full',
  flexBetween: 'flex items-center justify-between w-full',
  flexCol: 'flex flex-col w-full',
  flexWrap: 'flex flex-wrap gap-4 justify-center'
};

/**
 * PROFESSIONAL CARD SYSTEM - GLASS MORPHISM WITH PROPER SHADOWS
 */
export const cardStyles = {
  // Main glass card - PREMIUM LOOK
  glass: cn(
    'backdrop-blur-xl bg-white/10 border border-white/20',
    'rounded-2xl shadow-2xl hover:shadow-3xl',
    'p-6 transition-all duration-300',
    'hover:bg-white/15 hover:border-white/30',
    'hover:scale-[1.02] transform-gpu'
  ),
  
  // Featured cards - HERO SECTIONS
  featured: cn(
    'backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5',
    'border border-white/30 rounded-3xl shadow-2xl',
    'p-8 transition-all duration-300',
    'hover:shadow-cyan-500/25'
  ),
  
  // Interactive cards - CLICKABLE ELEMENTS
  interactive: cn(
    'backdrop-blur-xl bg-white/10 border border-white/20',
    'rounded-2xl shadow-xl hover:shadow-2xl',
    'p-6 cursor-pointer transition-all duration-300',
    'hover:bg-white/15 hover:border-white/30',
    'hover:scale-105 transform-gpu'
  ),
  
  // Metric cards - DATA DISPLAY
  metric: cn(
    'backdrop-blur-md bg-white/8 border border-white/20',
    'rounded-xl p-6 text-center',
    'hover:bg-white/12 transition-all duration-300',
    'shadow-lg hover:shadow-xl'
  ),
  
  // Status cards with color coding
  success: 'backdrop-blur-md bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4',
  warning: 'backdrop-blur-md bg-amber-500/20 border border-amber-400/30 rounded-xl p-4',
  error: 'backdrop-blur-md bg-red-500/20 border border-red-400/30 rounded-xl p-4',
  info: 'backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-xl p-4'
};

/**
 * PROFESSIONAL TYPOGRAPHY - CLEAR HIERARCHY
 */
export const textStyles = {
  // Hero text - MASSIVE IMPACT
  hero: cn(
    'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl',
    'font-black tracking-tight leading-tight',
    'bg-gradient-to-r from-white via-blue-100 to-cyan-200',
    'bg-clip-text text-transparent'
  ),
  
  // Main headings - CLEAR AND BOLD
  heading: cn(
    'text-2xl sm:text-3xl lg:text-4xl',
    'font-bold tracking-tight text-white'
  ),
  
  // Subheadings - SECONDARY HIERARCHY
  subheading: cn(
    'text-lg sm:text-xl lg:text-2xl',
    'font-semibold text-gray-200'
  ),
  
  // Body text - READABLE AND ACCESSIBLE
  body: cn(
    'text-base sm:text-lg',
    'text-gray-200 leading-relaxed'
  ),
  
  // Caption text - SMALL DETAILS
  caption: 'text-sm text-gray-400',
  small: 'text-xs text-gray-500',
  
  // Accent colors - BRAND COLORS
  accent: 'text-cyan-400 font-semibold',
  success: 'text-emerald-400 font-semibold',
  warning: 'text-amber-400 font-semibold',
  error: 'text-red-400 font-semibold'
};

/**
 * PROFESSIONAL BUTTON SYSTEM - CONSISTENT INTERACTIONS
 */
export const buttonStyles = {
  // Primary buttons - MAIN ACTIONS
  primary: cn(
    'bg-gradient-to-r from-blue-600 to-cyan-600',
    'hover:from-blue-700 hover:to-cyan-700',
    'text-white font-semibold px-6 py-3 rounded-xl',
    'shadow-lg hover:shadow-xl transition-all duration-300',
    'transform hover:scale-105 active:scale-95',
    'focus:outline-none focus:ring-2 focus:ring-cyan-400'
  ),
  
  // Secondary buttons - SECONDARY ACTIONS
  secondary: cn(
    'bg-white/10 hover:bg-white/20',
    'border border-white/30 hover:border-white/40',
    'text-white font-semibold px-6 py-3 rounded-xl',
    'backdrop-blur-sm transition-all duration-300',
    'transform hover:scale-105 active:scale-95',
    'focus:outline-none focus:ring-2 focus:ring-white/50'
  ),
  
  // Outline buttons - SUBTLE ACTIONS
  outline: cn(
    'border-2 border-cyan-400 text-cyan-400',
    'hover:bg-cyan-400 hover:text-slate-900',
    'font-semibold px-6 py-3 rounded-xl',
    'transition-all duration-300',
    'transform hover:scale-105 active:scale-95'
  ),
  
  // Icon buttons - MINIMAL ACTIONS
  icon: cn(
    'w-12 h-12 rounded-full bg-white/10 hover:bg-white/20',
    'border border-white/20 hover:border-white/30',
    'flex items-center justify-center',
    'transition-all duration-300 backdrop-blur-sm',
    'transform hover:scale-110 active:scale-95'
  ),
  
  // Small buttons - COMPACT ACTIONS
  small: cn(
    'bg-gradient-to-r from-blue-600 to-cyan-600',
    'hover:from-blue-700 hover:to-cyan-700',
    'text-white font-medium px-4 py-2 rounded-lg text-sm',
    'transition-all duration-300',
    'transform hover:scale-105 active:scale-95'
  )
};

/**
 * PROFESSIONAL NAVIGATION - CLEAR STATES
 */
export const navStyles = {
  active: cn(
    'relative px-4 py-2 rounded-xl',
    'bg-white/20 text-white border border-white/30',
    'font-semibold backdrop-blur-sm shadow-lg'
  ),
  inactive: cn(
    'relative px-4 py-2 rounded-xl',
    'text-gray-300 hover:text-white hover:bg-white/10',
    'transition-all duration-300 font-medium'
  )
};

/**
 * PROFESSIONAL FORM INPUTS - ACCESSIBLE AND RESPONSIVE
 */
export const inputStyles = {
  input: cn(
    'w-full px-4 py-3 bg-white/10 border border-white/20',
    'rounded-xl text-white placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-cyan-400',
    'focus:border-transparent backdrop-blur-sm',
    'transition-all duration-300'
  ),
  
  select: cn(
    'w-full px-4 py-3 bg-white/10 border border-white/20',
    'rounded-xl text-white',
    'focus:outline-none focus:ring-2 focus:ring-cyan-400',
    'focus:border-transparent backdrop-blur-sm',
    'transition-all duration-300'
  ),
  
  search: cn(
    'w-full px-4 py-3 pl-12 bg-white/10 border border-white/20',
    'rounded-xl text-white placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-cyan-400',
    'focus:border-transparent backdrop-blur-sm',
    'transition-all duration-300'
  )
};

/**
 * PROFESSIONAL BACKGROUND PATTERNS
 */
export const backgroundPatterns = {
  grid: 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]',
  dots: 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]',
  mesh: 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
};

/**
 * PROFESSIONAL ANIMATIONS - SMOOTH AND POLISHED
 */
export const animations = {
  fadeIn: 'animate-in fade-in duration-500',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-500',
  slideDown: 'animate-in slide-in-from-top-4 duration-500',
  scaleIn: 'animate-in zoom-in-95 duration-300',
  
  hover: 'hover:scale-105 transition-transform duration-300',
  glow: 'hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500',
  
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce'
};

/**
 * RESPONSIVE BREAKPOINTS
 */
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

/**
 * COLOR PALETTE - PROFESSIONAL BRAND COLORS
 */
export const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6', 
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  accent: {
    400: '#22d3ee',
    500: '#06b6d4', 
    600: '#0891b2'
  },
  success: {
    400: '#4ade80',
    500: '#22c55e'
  },
  warning: {
    400: '#facc15',
    500: '#eab308'
  },
  error: {
    400: '#f87171', 
    500: '#ef4444'
  }
};