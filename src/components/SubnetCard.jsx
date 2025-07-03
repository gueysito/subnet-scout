import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Shield, 
  Github, 
  ExternalLink, 
  Zap, 
  Star,
  Brain,
  AlertTriangle,
  Users,
  GitBranch,
  Eye,
  Award,
  Sparkles,
  TrendingDown,
  Clock
} from 'lucide-react';
import { cardStyles, textStyles, buttonStyles, statusStyles } from '../utils/styleUtils';
import { useIntersectionObserver, useMemoizedApi, arePropsEqual } from '../utils/performance';
import MindshareCard from './MindshareCard';
import ReputationBadge from './ReputationBadge';

const SubnetCard = ({ agent, onScoreClick }) => {
  const [githubStats, setGithubStats] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingExtended, setLoadingExtended] = useState(false);
  const [showExtended, setShowExtended] = useState(false);
  
  // Intersection observer for lazy loading
  const [cardRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Memoized configurations to prevent unnecessary recalculations
  const statusConfig = useMemo(() => {
    const configs = {
      healthy: { 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500/20', 
        border: 'border-emerald-500/30',
        icon: Shield,
        pulse: 'shadow-emerald-500/30'
      },
      warning: { 
        color: 'text-amber-400', 
        bg: 'bg-amber-500/20', 
        border: 'border-amber-500/30',
        icon: Zap,
        pulse: 'shadow-amber-500/30'
      },
      critical: { 
        color: 'text-red-400', 
        bg: 'bg-red-500/20', 
        border: 'border-red-500/30',
        icon: Activity,
        pulse: 'shadow-red-500/30'
      },
      default: { 
        color: 'text-slate-400', 
        bg: 'bg-slate-500/20', 
        border: 'border-slate-500/30',
        icon: Activity,
        pulse: 'shadow-slate-500/30'
      }
    };
    return configs[agent.status] || configs.default;
  }, [agent.status]);

  const scoreConfig = useMemo(() => {
    if (agent.score >= 80) return { 
      color: 'text-emerald-400', 
      gradient: 'from-emerald-400 to-emerald-500',
      bg: 'bg-emerald-500/10'
    };
    if (agent.score >= 60) return { 
      color: 'text-amber-400', 
      gradient: 'from-amber-400 to-amber-500',
      bg: 'bg-amber-500/10'
    };
    return { 
      color: 'text-red-400', 
      gradient: 'from-red-400 to-red-500',
      bg: 'bg-red-500/10'
    };
  }, [agent.score]);

  const StatusIcon = statusConfig.icon;

  const metrics = useMemo(() => [
    {
      label: 'Yield',
      value: `${agent.yield?.toFixed(1) || 0}%`,
      icon: TrendingUp,
      color: 'text-blue-400',
      gradient: 'from-blue-400 to-blue-500'
    },
    {
      label: 'Activity',
      value: agent.activity || 0,
      icon: Activity,
      color: 'text-purple-400',
      gradient: 'from-purple-400 to-purple-500'
    },
    {
      label: 'Credibility',
      value: agent.credibility || 0,
      icon: Star,
      color: 'text-orange-400',
      gradient: 'from-orange-400 to-orange-500'
    }
  ], [agent.yield, agent.activity, agent.credibility]);

  // Memoized date formatting
  const formattedDate = useMemo(() => {
    try {
      return new Date(agent.last_updated).toLocaleString();
    } catch {
      return 'Unknown';
    }
  }, [agent.last_updated]);

  // Optimized fetch function with memoization
  const fetchExtendedData = useCallback(async () => {
    if (!isVisible || loadingExtended) return;
    
    setLoadingExtended(true);
    try {
      // Parallel fetch for better performance
      const [githubResponse, aiResponse] = await Promise.allSettled([
        fetch(`http://localhost:8080/api/github-stats/${agent.subnet_id}`),
        fetch(`http://localhost:8080/api/insights/risk/${agent.subnet_id}`)
      ]);

      if (githubResponse.status === 'fulfilled' && githubResponse.value.ok) {
        const githubData = await githubResponse.value.json();
        setGithubStats(githubData.github_stats);
      }

      if (aiResponse.status === 'fulfilled' && aiResponse.value.ok) {
        const aiData = await aiResponse.value.json();
        setAiInsights(aiData.data);
      }
    } catch (error) {
      console.error('Failed to fetch extended data:', error);
    } finally {
      setLoadingExtended(false);
    }
  }, [agent.subnet_id, isVisible, loadingExtended]);

  // Optimized event handlers
  const handleScoreClick = useCallback(() => {
    onScoreClick?.(agent.subnet_id);
  }, [onScoreClick, agent.subnet_id]);

  const handleToggleExtended = useCallback(() => {
    setShowExtended(prev => {
      const newValue = !prev;
      if (newValue && !githubStats && !aiInsights && !loadingExtended) {
        fetchExtendedData();
      }
      return newValue;
    });
  }, [githubStats, aiInsights, loadingExtended, fetchExtendedData]);

  // Load extended data when card becomes visible and extended view is requested
  useEffect(() => {
    if (showExtended && isVisible && !githubStats && !aiInsights && !loadingExtended) {
      fetchExtendedData();
    }
  }, [showExtended, isVisible, githubStats, aiInsights, loadingExtended, fetchExtendedData]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      transition={{ duration: 0.4 }}
      className={`${cardStyles.glass} group cursor-pointer relative overflow-hidden`}
      role="article"
      aria-labelledby={`subnet-${agent.subnet_id}-title`}
      aria-describedby={`subnet-${agent.subnet_id}-description`}
    >
      {/* Floating orbs background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent-500/20 to-transparent rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
      </div>

      {/* Header with name and status */}
      <header className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 
            id={`subnet-${agent.subnet_id}-title`}
            className={`text-lg ${textStyles.heading} truncate group-hover:text-accent-300 transition-colors duration-300`}
          >
            {agent.name || `Subnet ${agent.subnet_id}`}
          </h3>
          <p 
            id={`subnet-${agent.subnet_id}-description`}
            className={`text-sm ${textStyles.caption} truncate mt-1`}
          >
            {agent.description || agent.type || 'Bittensor Subnet'}
          </p>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`${statusConfig.bg} ${statusConfig.border} border rounded-xl p-2 ${statusConfig.pulse} animate-pulse-slow`}
          role="status"
          aria-label={`Subnet status: ${agent.status || 'unknown'}`}
        >
          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} aria-hidden="true" />
        </motion.div>
      </header>

      {/* Score display with enhanced visual */}
      <div className="mb-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className={`${scoreConfig.bg} rounded-2xl p-6 border border-white/10 backdrop-blur-sm relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
          <div className="relative z-10 text-center">
            <div className={`text-4xl font-bold bg-gradient-to-r ${scoreConfig.gradient} bg-clip-text text-transparent mb-2`}>
              {agent.score}
            </div>
            <div className={`text-sm ${textStyles.caption} uppercase tracking-wide`}>
              Overall Score
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced metrics grid */}
      <section className="grid grid-cols-3 gap-3 mb-6" aria-label="Subnet performance metrics">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="text-center p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm group/metric"
              role="figure"
              aria-label={`${metric.label}: ${metric.value}`}
            >
              <Icon className={`w-5 h-5 ${metric.color} mx-auto mb-2 group-hover/metric:scale-110 transition-transform duration-300`} aria-hidden="true" />
              <div className={`text-lg font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent mb-1`}>
                {metric.value}
              </div>
              <div className={`text-xs ${textStyles.caption} uppercase tracking-wide`}>
                {metric.label}
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Reputation and GitHub indicators */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Kaito Yaps Reputation */}
          <ReputationBadge 
            username={agent.validator_key || agent.name?.toLowerCase()} 
            size="small" 
            showScore={true}
            className="transition-all duration-300 hover:scale-105"
          />
          
          {/* GitHub activity indicator */}
          {githubStats && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-1 px-2 py-1 bg-white/5 rounded-lg border border-white/10"
            >
              <GitBranch className="w-3 h-3 text-green-400" />
              <span className="text-xs font-medium text-green-400">
                {githubStats.commits_last_30_days}
              </span>
              <span className="text-xs text-gray-500">commits</span>
            </motion.div>
          )}
        </div>

        {/* AI insights indicator */}
        {aiInsights && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg border ${
              aiInsights.risk_level === 'low' ? 'bg-green-500/10 border-green-500/30' :
              aiInsights.risk_level === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
              'bg-red-500/10 border-red-500/30'
            }`}
          >
            <Brain className={`w-3 h-3 ${
              aiInsights.risk_level === 'low' ? 'text-green-400' :
              aiInsights.risk_level === 'medium' ? 'text-amber-400' :
              'text-red-400'
            }`} />
            <span className={`text-xs font-medium ${
              aiInsights.risk_level === 'low' ? 'text-green-400' :
              aiInsights.risk_level === 'medium' ? 'text-amber-400' :
              'text-red-400'
            }`}>
              {aiInsights.risk_level?.toUpperCase()}
            </span>
          </motion.div>
        )}
      </div>

      {/* Extended information panel */}
      <AnimatePresence>
        {showExtended && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 overflow-hidden"
          >
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
              {/* GitHub Stats */}
              {githubStats && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-blue-400" />
                    <span className={`text-sm font-medium ${textStyles.heading}`}>
                      Development Activity
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between">
                      <span className={textStyles.caption}>30-day commits:</span>
                      <span className="text-blue-400 font-medium">{githubStats.commits_last_30_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textStyles.caption}>Activity Score:</span>
                      <span className="text-purple-400 font-medium">{githubStats.activity_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textStyles.caption}>Contributors:</span>
                      <span className="text-green-400 font-medium">{githubStats.contributor_count || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textStyles.caption}>Stars:</span>
                      <span className="text-yellow-400 font-medium">{githubStats.stargazers_count || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mindshare Card */}
              <MindshareCard 
                username={agent.validator_key || agent.name?.toLowerCase()} 
                compact={true}
                showDetails={false}
              />

              {/* AI Risk Assessment */}
              {aiInsights && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className={`text-sm font-medium ${textStyles.heading}`}>
                      AI Risk Assessment
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between">
                      <span className={textStyles.caption}>Technical:</span>
                      <span className={`font-medium ${aiInsights.technical_risk < 30 ? 'text-green-400' : aiInsights.technical_risk < 60 ? 'text-amber-400' : 'text-red-400'}`}>
                        {aiInsights.technical_risk}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textStyles.caption}>Economic:</span>
                      <span className={`font-medium ${aiInsights.economic_risk < 30 ? 'text-green-400' : aiInsights.economic_risk < 60 ? 'text-amber-400' : 'text-red-400'}`}>
                        {aiInsights.economic_risk}/100
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {loadingExtended && (
                <div className="flex items-center justify-center space-x-2 py-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-4 h-4 text-accent-400" />
                  </motion.div>
                  <span className={`text-sm ${textStyles.caption}`}>Loading insights...</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex space-x-3 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScoreClick}
          aria-label={`Analyze subnet ${agent.name || agent.subnet_id}`}
          className={`${buttonStyles.primary} flex-1 text-sm flex items-center justify-center space-x-2 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
        >
          <TrendingUp className="w-4 h-4" aria-hidden="true" />
          <span>Analyze</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleExtended}
          aria-label={showExtended ? 'Hide additional subnet information' : 'Show additional subnet information'}
          aria-expanded={showExtended}
          className={`${buttonStyles.secondary} text-sm flex items-center justify-center space-x-2 focus:ring-2 focus:ring-gray-500 focus:outline-none`}
        >
          <Eye className="w-4 h-4" aria-hidden="true" />
          <span>{showExtended ? 'Less' : 'More'}</span>
        </motion.button>
        
        {agent.github_url ? (
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={agent.github_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${agent.name || 'subnet'} repository on GitHub (opens in new tab)`}
            className={`${buttonStyles.ghost} px-4 py-3 flex items-center justify-center focus:ring-2 focus:ring-gray-500 focus:outline-none`}
          >
            <Github className="w-4 h-4" aria-hidden="true" />
          </motion.a>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
            aria-label="No external link available for this subnet"
            className={`${buttonStyles.ghost} px-4 py-3 flex items-center justify-center opacity-50 cursor-not-allowed focus:ring-2 focus:ring-gray-500 focus:outline-none`}
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </motion.button>
        )}
      </div>

      {/* Footer with enhanced information */}
      <div className="relative pt-4">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="flex items-center justify-between">
          <p className={`text-xs ${textStyles.caption} flex items-center space-x-1`}>
            <Clock className="w-3 h-3" aria-hidden="true" />
            <span>Updated {formattedDate}</span>
          </p>
          <div className="flex items-center space-x-2">
            {agent.emission_rate && (
              <span className={`text-xs ${textStyles.caption} px-2 py-1 bg-blue-500/10 rounded-full border border-blue-500/20`}>
                {agent.emission_rate.toFixed(2)} TAO
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </motion.article>
  );
};

// Memoize the component to prevent unnecessary re-renders
const MemoizedSubnetCard = React.memo(SubnetCard, (prevProps, nextProps) => {
  // Custom comparison function for optimal performance
  return (
    prevProps.agent.subnet_id === nextProps.agent.subnet_id &&
    prevProps.agent.score === nextProps.agent.score &&
    prevProps.agent.status === nextProps.agent.status &&
    prevProps.agent.yield === nextProps.agent.yield &&
    prevProps.agent.activity === nextProps.agent.activity &&
    prevProps.agent.credibility === nextProps.agent.credibility &&
    prevProps.agent.last_updated === nextProps.agent.last_updated &&
    prevProps.onScoreClick === nextProps.onScoreClick
  );
});

MemoizedSubnetCard.displayName = 'SubnetCard';

export default MemoizedSubnetCard; 