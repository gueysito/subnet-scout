import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for optimal class name handling
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Premium glass morphism styles
 */
export const glassStyles = {
  light: 'bg-glass-light backdrop-blur-lg border border-white/10',
  medium: 'bg-glass-medium backdrop-blur-xl border border-white/20',
  heavy: 'bg-glass-heavy backdrop-blur-2xl border border-white/30',
  dark: 'bg-glass-dark backdrop-blur-lg border border-white/5',
};

/**
 * Premium button styles
 */
export const buttonStyles = {
  primary: cn(
    'px-6 py-3 rounded-xl font-medium text-white',
    'bg-gradient-to-r from-blue-600 to-purple-600',
    'hover:from-blue-700 hover:to-purple-700',
    'transform hover:scale-105 active:scale-95',
    'transition-all duration-300 ease-out',
    'shadow-premium hover:shadow-premium-lg',
    'border border-white/10 hover:border-white/20'
  ),
  secondary: cn(
    'px-6 py-3 rounded-xl font-medium text-white',
    'bg-gradient-to-r from-primary-700 to-primary-800',
    'hover:from-primary-600 hover:to-primary-700',
    'transform hover:scale-105 active:scale-95',
    'transition-all duration-300 ease-out',
    'shadow-glass hover:shadow-glass-lg',
    'border border-white/10 hover:border-white/20'
  ),
  ghost: cn(
    'px-6 py-3 rounded-xl font-medium text-white/80 hover:text-white',
    'bg-white/5 hover:bg-white/10',
    'transform hover:scale-105 active:scale-95',
    'transition-all duration-300 ease-out',
    'border border-white/10 hover:border-white/20'
  ),
  accent: cn(
    'px-6 py-3 rounded-xl font-medium text-black',
    'bg-gradient-to-r from-accent-400 to-accent-500',
    'hover:from-accent-300 hover:to-accent-400',
    'transform hover:scale-105 active:scale-95',
    'transition-all duration-300 ease-out',
    'shadow-glow-gold hover:shadow-glow-gold',
    'border border-accent-300/20'
  )
};

/**
 * Premium card styles
 */
export const cardStyles = {
  default: cn(
    'rounded-2xl p-6',
    'bg-gradient-to-br from-primary-800/50 to-primary-900/30',
    'backdrop-blur-xl border border-white/10',
    'shadow-premium hover:shadow-premium-lg',
    'transition-all duration-400 ease-out',
    'hover:transform hover:scale-[1.02]'
  ),
  glass: cn(
    'rounded-2xl p-6',
    'bg-glass-light backdrop-blur-xl',
    'border border-white/10',
    'shadow-glass hover:shadow-glass-lg',
    'transition-all duration-400 ease-out',
    'hover:transform hover:scale-[1.02]',
    'hover:bg-glass-medium'
  ),
  featured: cn(
    'rounded-2xl p-8',
    'bg-gradient-to-br from-accent-500/20 to-purple-600/20',
    'backdrop-blur-2xl border border-accent-300/20',
    'shadow-premium-lg hover:shadow-glow-gold',
    'transition-all duration-400 ease-out',
    'hover:transform hover:scale-[1.02]',
    'relative overflow-hidden'
  )
};

/**
 * Premium text styles
 */
export const textStyles = {
  heading: 'font-display font-bold text-white',
  subheading: 'font-sans font-semibold text-white/90',
  body: 'font-sans text-white/80',
  caption: 'font-sans text-sm text-white/60',
  accent: 'font-display font-bold bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent',
};

/**
 * Premium input styles
 */
export const inputStyles = cn(
  'w-full px-4 py-3 rounded-xl',
  'bg-white/5 border border-white/10',
  'text-white placeholder-white/40',
  'focus:bg-white/10 focus:border-white/30',
  'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
  'transition-all duration-300 ease-out'
);

/**
 * Premium navigation styles
 */
export const navStyles = {
  active: cn(
    'px-6 py-3 rounded-xl font-medium text-white',
    'bg-gradient-to-r from-blue-600/80 to-purple-600/80',
    'backdrop-blur-lg border border-white/20',
    'shadow-premium transform scale-105',
    'transition-all duration-300 ease-out'
  ),
  inactive: cn(
    'px-6 py-3 rounded-xl font-medium text-white/70',
    'hover:text-white hover:bg-white/10',
    'border border-transparent hover:border-white/10',
    'transform hover:scale-105 active:scale-95',
    'transition-all duration-300 ease-out'
  )
};

/**
 * Premium status indicators
 */
export const statusStyles = {
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

/**
 * Animation helpers
 */
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  float: 'animate-float',
  glowPulse: 'animate-glow-pulse',
  shimmer: 'animate-shimmer',
};

/**
 * Premium container styles
 */
export const containerStyles = {
  page: cn(
    'min-h-screen',
    'bg-gradient-to-br from-primary-950 via-primary-900 to-opal-900',
    'relative overflow-hidden'
  ),
  section: cn(
    'relative z-10 px-6 py-12',
    'max-w-7xl mx-auto'
  ),
  grid: cn(
    'grid gap-6',
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  )
};

/**
 * Premium background patterns
 */
export const backgroundPatterns = {
  dots: 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]',
  grid: 'bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]',
  mesh: 'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_50%)]',
}; 