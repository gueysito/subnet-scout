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
 * AUTHKIT-INSPIRED DESIGN SYSTEM
 */
export const authkitDesign = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    },
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87'
    },
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.15)',
      strong: 'rgba(255, 255, 255, 0.2)'
    }
  },
  
  gradients: {
    primary: 'from-blue-600 via-purple-600 to-indigo-600',
    secondary: 'from-slate-800 via-slate-700 to-slate-800',
    accent: 'from-cyan-400 via-blue-500 to-purple-600',
    subtle: 'from-white/5 via-white/10 to-white/5',
    glow: 'from-blue-500/20 via-purple-500/20 to-indigo-500/20'
  },
  
  shadows: {
    glow: 'shadow-2xl shadow-blue-500/10',
    card: 'shadow-xl shadow-black/20',
    button: 'shadow-lg shadow-blue-500/20',
    input: 'shadow-inner shadow-black/10'
  },
  
  blur: {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl'
  }
};

/**
 * DRAMATIC REDESIGN - CLEAN MODERN LIGHT THEME
 */
export const authkitStyles = {
  // Clean modern cards
  glassCard: cn(
    'bg-white border border-gray-200',
    'rounded-lg shadow-sm',
    'hover:shadow-md hover:border-gray-300',
    'transition-all duration-200'
  ),
  
  glassCardElevated: cn(
    'bg-white border border-gray-200',
    'rounded-lg shadow-lg',
    'hover:shadow-xl hover:border-gray-300',
    'transition-all duration-200'
  ),
  
  // Bold modern buttons
  primaryButton: cn(
    'bg-blue-600 hover:bg-blue-700',
    'text-white px-6 py-3 rounded-lg font-semibold',
    'shadow-sm hover:shadow-md',
    'transition-all duration-200 transform',
    'hover:scale-[1.02] active:scale-[0.98]'
  ),
  
  secondaryButton: cn(
    'bg-gray-100 hover:bg-gray-200',
    'border border-gray-300 hover:border-gray-400',
    'text-gray-700 px-6 py-3 rounded-lg font-semibold',
    'transition-all duration-200 transform',
    'hover:scale-[1.02] active:scale-[0.98]'
  ),
  
  ghostButton: cn(
    'bg-transparent hover:bg-gray-50',
    'border border-gray-300 hover:border-gray-400',
    'text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium',
    'transition-all duration-200'
  ),
  
  // Clean inputs
  modernInput: cn(
    'w-full bg-white border border-gray-300 rounded-lg px-4 py-3',
    'text-gray-900 placeholder-gray-500',
    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    'transition-all duration-200 outline-none'
  ),
  
  modernSelect: cn(
    'w-full bg-white border border-gray-300 rounded-lg px-4 py-3',
    'text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    'transition-all duration-200 outline-none'
  ),
  
  // Clean navigation
  navLink: cn(
    'px-4 py-2 rounded-lg transition-all duration-200',
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    'font-medium'
  ),
  
  navLinkActive: cn(
    'px-4 py-2 rounded-lg',
    'bg-blue-100 text-blue-700 border border-blue-200',
    'font-semibold'
  ),
  
  // Clean backgrounds
  primaryBg: 'bg-gray-50 min-h-screen',
  cardBg: 'bg-white border border-gray-200',
  headerBg: 'bg-white border-b border-gray-200 shadow-sm',
  
  // Clean text styles
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-700',
  textMuted: 'text-gray-500',
  textAccent: 'text-blue-600',
  
  // Modern labels
  floatingLabel: cn(
    'absolute left-4 top-3 text-gray-500 transition-all duration-200',
    'pointer-events-none transform-origin-left'
  ),
  
  floatingLabelActive: cn(
    'transform -translate-y-6 scale-75 text-blue-600'
  )
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