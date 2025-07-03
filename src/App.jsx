import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Info, Brain, Activity } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Explore from './pages/Explore';
import VisualizationsComplete from './pages/VisualizationsComplete';
import AIInsights from './pages/AIInsights';
import HealthDashboard from './pages/HealthDashboard';
import { containerStyles, navStyles, textStyles, backgroundPatterns, animations } from './utils/styleUtils';

const App = () => {
  const location = useLocation();

  const navigationItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Sparkles,
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      path: '/explore', 
      label: 'Explore', 
      icon: Zap,
      gradient: 'from-emerald-500 to-teal-600'
    },
    { 
      path: '/visualizations', 
      label: 'Analytics', 
      icon: TrendingUp,
      gradient: 'from-violet-500 to-purple-600'
    },
    { 
      path: '/ai-insights', 
      label: 'AI Insights', 
      icon: Brain,
      gradient: 'from-indigo-500 to-purple-600'
    },
    { 
      path: '/health', 
      label: 'Health', 
      icon: Activity,
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      path: '/about', 
      label: 'About', 
      icon: Info,
      gradient: 'from-slate-500 to-gray-600'
    }
  ];

  return (
    <div className={`${containerStyles.page} ${backgroundPatterns.grid}`}>
      {/* Premium Navigation Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-50 border-b border-white/10 bg-gradient-to-r from-primary-900/80 via-primary-800/60 to-opal-900/80 backdrop-blur-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Premium Logo/Brand */}
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow-gold">
                  <motion.span 
                    className="text-2xl filter drop-shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🚀
                  </motion.span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-400 to-accent-600 rounded-2xl blur opacity-20 animate-glow-pulse"></div>
              </div>
              <div>
                <h1 className={`text-3xl ${textStyles.heading} bg-gradient-to-r from-white via-white to-accent-200 bg-clip-text text-transparent`}>
                  Subnet Scout
                </h1>
                <p className={`text-xs ${textStyles.caption} font-medium tracking-wide uppercase`}>
                  Powered by io.net Intelligence
                </p>
              </div>
            </motion.div>
            
            {/* Premium Navigation Links */}
            <nav className="flex items-center space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Link 
                      to={item.path}
                      className={isActive ? navStyles.active : navStyles.inactive}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 rounded-xl`}
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Subtle animated border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent"></div>
      </motion.header>

      {/* Main Content Area with Premium Animations */}
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full"
          >
                      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/visualizations" element={<VisualizationsComplete />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/health" element={<HealthDashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-accent-500/10 to-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* Subtle mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_50%)] opacity-50"></div>
      </div>
    </div>
  );
};

export default App;