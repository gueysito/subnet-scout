import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Shield, Github, ExternalLink, Zap, Star } from 'lucide-react';
import { cardStyles, textStyles, buttonStyles, statusStyles } from '../utils/styleUtils';

const SubnetCard = ({ agent, onScoreClick }) => {
  const getStatusConfig = (status) => {
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
    return configs[status] || configs.default;
  };

  const getScoreConfig = (score) => {
    if (score >= 80) return { 
      color: 'text-emerald-400', 
      gradient: 'from-emerald-400 to-emerald-500',
      bg: 'bg-emerald-500/10'
    };
    if (score >= 60) return { 
      color: 'text-amber-400', 
      gradient: 'from-amber-400 to-amber-500',
      bg: 'bg-amber-500/10'
    };
    return { 
      color: 'text-red-400', 
      gradient: 'from-red-400 to-red-500',
      bg: 'bg-red-500/10'
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const statusConfig = getStatusConfig(agent.status);
  const scoreConfig = getScoreConfig(agent.score);
  const StatusIcon = statusConfig.icon;

  const metrics = [
    {
      label: 'Yield',
      value: `${agent.yield?.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-blue-400',
      gradient: 'from-blue-400 to-blue-500'
    },
    {
      label: 'Activity',
      value: agent.activity,
      icon: Activity,
      color: 'text-purple-400',
      gradient: 'from-purple-400 to-purple-500'
    },
    {
      label: 'Credibility',
      value: agent.credibility,
      icon: Star,
      color: 'text-orange-400',
      gradient: 'from-orange-400 to-orange-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      transition={{ duration: 0.4 }}
      className={`${cardStyles.glass} group cursor-pointer relative overflow-hidden`}
    >
      {/* Premium header with gradient background */}
      <div className="relative mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`text-xl ${textStyles.heading} group-hover:text-accent-300 transition-colors duration-300`}>
                {agent.name || `Subnet ${agent.subnet_id}`}
              </h3>
              {agent.type && (
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 text-xs font-medium rounded-full backdrop-blur-sm"
                >
                  {agent.type}
                </motion.span>
              )}
            </div>
            <p className={`${textStyles.body} text-sm leading-relaxed`}>
              {agent.description || `Advanced subnet ${agent.subnet_id} monitoring`}
            </p>
          </div>
          
          {/* Status indicator with animation */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${statusConfig.bg} ${statusConfig.border} border backdrop-blur-sm`}
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${statusConfig.color.replace('text-', 'bg-')} shadow-lg ${statusConfig.pulse}`}
            />
            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            <span className={`text-xs font-medium ${statusConfig.color} capitalize`}>
              {agent.status}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Premium score display */}
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

      {/* Premium metrics grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
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
            >
              <Icon className={`w-5 h-5 ${metric.color} mx-auto mb-2 group-hover/metric:scale-110 transition-transform duration-300`} />
              <div className={`text-lg font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent mb-1`}>
                {metric.value}
              </div>
              <div className={`text-xs ${textStyles.caption} uppercase tracking-wide`}>
                {metric.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Premium action buttons */}
      <div className="flex space-x-3 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onScoreClick && onScoreClick(agent.subnet_id)}
          className={`${buttonStyles.primary} flex-1 text-sm flex items-center justify-center space-x-2`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>View Details</span>
        </motion.button>
        
        {agent.github_url ? (
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={agent.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonStyles.ghost} px-4 py-3 flex items-center justify-center`}
          >
            <Github className="w-4 h-4" />
          </motion.a>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${buttonStyles.ghost} px-4 py-3 flex items-center justify-center`}
          >
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Premium footer with gradient border */}
      <div className="relative pt-4">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="flex items-center justify-between">
          <p className={`text-xs ${textStyles.caption} flex items-center space-x-1`}>
            <Activity className="w-3 h-3" />
            <span>Last updated</span>
          </p>
          <p className={`text-xs ${textStyles.caption} font-medium`}>
            {formatDate(agent.last_updated)}
          </p>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-accent-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
    </motion.div>
  );
};

export default SubnetCard; 