import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Info, Brain, Activity, Map, GitBranch, MessageCircle, Shield } from 'lucide-react';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import { ReactPlugin } from '@stagewise-plugins/react';
import Home from './pages/Home';
import About from './pages/About';
import Explore from './pages/Explore';
import VisualizationsComplete from './pages/VisualizationsComplete';
import AIInsights from './pages/AIInsights';
import HealthDashboard from './pages/HealthDashboard';
import SubnetHeatmap from './pages/SubnetHeatmap';
import GitHubInsights from './pages/GitHubInsights';
import KaitoSocial from './pages/KaitoSocial';
import EthosIdentity from './pages/EthosIdentity';
import { containerStyles, navStyles, textStyles, backgroundPatterns, authkitStyles } from './utils/styleUtils';

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
      path: '/heatmap', 
      label: 'Heatmap', 
      icon: Map,
      gradient: 'from-red-500 to-pink-600'
    },
    { 
      path: '/github', 
      label: 'GitHub', 
      icon: GitBranch,
      gradient: 'from-gray-500 to-slate-600'
    },
    { 
      path: '/social', 
      label: 'Social', 
      icon: MessageCircle,
      gradient: 'from-cyan-500 to-blue-600'
    },
    { 
      path: '/identity', 
      label: 'Identity', 
      icon: Shield,
      gradient: 'from-amber-500 to-orange-600'
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
    <div className={`${authkitStyles.primaryBg} ${authkitStyles.textPrimary} relative`}>
      <StagewiseToolbar 
        config={{
          plugins: [ReactPlugin]
        }}
      />
      {/* Clean Modern Navigation Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`relative z-50 ${authkitStyles.headerBg}`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Clean Modern Logo/Brand */}
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${authkitStyles.textPrimary}`}>
                  Subnet Scout
                </h1>
                <p className={`text-xs ${authkitStyles.textMuted} font-medium tracking-wide uppercase`}>
                  Powered by io.net Intelligence
                </p>
              </div>
            </motion.div>
            
            {/* AuthKit-inspired Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-2">
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
                      className={isActive ? authkitStyles.navLinkActive : authkitStyles.navLink}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                        <span className="sm:hidden text-xs">{item.label.substring(0, 3)}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-blue-100 rounded-lg"
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

        {/* Clean border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
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
              <Route path="/heatmap" element={<SubnetHeatmap />} />
              <Route path="/github" element={<GitHubInsights />} />
              <Route path="/social" element={<KaitoSocial />} />
              <Route path="/identity" element={<EthosIdentity />} />
              <Route path="/visualizations" element={<VisualizationsComplete />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/health" element={<HealthDashboard />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Clean background - no distracting effects */}
    </div>
  );
};

export default App;