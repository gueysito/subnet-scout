import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap,
  Activity,
  DollarSign,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { cardStyles, textStyles, buttonStyles, inputStyles } from '../utils/styleUtils';

const ScoreAgentDemo = () => {
  const [subnetId, setSubnetId] = useState(1);
  const [scoreResult, setScoreResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const { apiMode, toggleApiMode } = useApi();

  // Sample metrics for testing
  const sampleMetrics = {
    emission_rate: 1250.5,
    total_stake: 125000.75,
    validator_count: 256,
    activity_score: 85.2,
    price_history: [0.025, 0.024, 0.026, 0.027, 0.025]
  };

  const calculateScore = async () => {
    setLoading(true);
    setError(null);
    setScoreResult(null);

    try {
      const response = await fetch('http://localhost:8080/api/score/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subnet_id: subnetId,
          metrics: sampleMetrics,
          timeframe: '24h'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      setScoreResult(result);
      console.log('Score calculation result:', result);
    } catch (err) {
      setError(err.message);
      console.error('Score calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value) => {
    return typeof value === 'number' ? `${value.toFixed(1)}%` : 'N/A';
  };

  const formatNumber = (value) => {
    return typeof value === 'number' ? value.toLocaleString() : 'N/A';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBadgeStyle = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'high': return 'bg-red-500/20 border-red-500/30 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cardStyles.glass}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-glow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-xl ${textStyles.heading}`}>AI Score Agent Demo</h3>
            <p className={`text-sm ${textStyles.body}`}>Advanced subnet analysis with AI insights</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className={`text-sm ${textStyles.body}`}>Backend:</span>
            <span className="text-sm font-medium text-blue-400">Real API</span>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className={`${cardStyles.default} bg-white/5 mb-6`}>
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-shrink-0">
            <label className={`block text-sm ${textStyles.body} mb-2`}>Subnet ID</label>
            <div className="relative">
              <input
                type="number"
                value={subnetId}
                onChange={(e) => setSubnetId(parseInt(e.target.value))}
                min="1"
                max="118"
                className={`${inputStyles.default} w-24 text-center`}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Target className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <label className={`block text-sm ${textStyles.body} mb-2`}>Sample Metrics</label>
            <div className={`${cardStyles.default} bg-gray-800/50 p-3`}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <Zap className="w-3 h-3 text-blue-400" />
                  <span className="text-gray-400">Emission:</span>
                  <span className="text-blue-400 font-medium">{formatNumber(sampleMetrics.emission_rate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400">Stake:</span>
                  <span className="text-green-400 font-medium">{formatNumber(sampleMetrics.total_stake)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3 text-purple-400" />
                  <span className="text-gray-400">Validators:</span>
                  <span className="text-purple-400 font-medium">{sampleMetrics.validator_count}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-3 h-3 text-amber-400" />
                  <span className="text-gray-400">Activity:</span>
                  <span className="text-amber-400 font-medium">{sampleMetrics.activity_score}</span>
                </div>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={calculateScore}
            disabled={loading}
            className={`${buttonStyles.accent} flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <motion.div
              animate={{ rotate: loading ? 360 : 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
            >
              <Calculator className="w-4 h-4" />
            </motion.div>
            <span>{loading ? 'Analyzing...' : 'Calculate Score'}</span>
          </motion.button>
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`${cardStyles.glass} border-red-500/30 bg-red-500/10 mb-6`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className={`text-lg ${textStyles.heading} text-red-300 mb-1`}>
                  Calculation Error
                </h4>
                <p className={`${textStyles.body} text-red-200 text-sm`}>{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Display */}
      <AnimatePresence>
        {scoreResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <div className={`${cardStyles.featured} relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-gradient-to-r ${getScoreGradient(scoreResult.overall_score)} rounded-xl shadow-glow`}>
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`text-lg ${textStyles.heading}`}>Overall Score</h4>
                    <p className={`text-sm ${textStyles.body}`}>AI-powered comprehensive analysis</p>
                  </div>
                </div>
                <div className={`text-5xl font-bold ${getScoreColor(scoreResult.overall_score)}`}>
                  {scoreResult.overall_score}
                  <span className="text-2xl text-gray-500">/100</span>
                </div>
              </div>
              
              {/* Score Breakdown */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(scoreResult.breakdown.yield_score)} mb-1`}>
                    {scoreResult.breakdown.yield_score}
                  </div>
                  <div className={`text-xs ${textStyles.body} mb-1`}>
                    Yield Performance
                  </div>
                  <div className="text-xs text-gray-500">
                    Weight: {scoreResult.weights?.yield || 40}%
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(scoreResult.breakdown.activity_score)} mb-1`}>
                    {scoreResult.breakdown.activity_score}
                  </div>
                  <div className={`text-xs ${textStyles.body} mb-1`}>
                    Network Activity
                  </div>
                  <div className="text-xs text-gray-500">
                    Weight: {scoreResult.weights?.activity || 30}%
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(scoreResult.breakdown.credibility_score)} mb-1`}>
                    {scoreResult.breakdown.credibility_score}
                  </div>
                  <div className={`text-xs ${textStyles.body} mb-1`}>
                    Credibility
                  </div>
                  <div className="text-xs text-gray-500">
                    Weight: {scoreResult.weights?.credibility || 30}%
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className={cardStyles.glass}>
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <h4 className={`text-lg ${textStyles.heading}`}>Key Performance Metrics</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`${cardStyles.default} bg-blue-500/10 border-blue-500/30 text-center p-4`}>
                  <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className={`text-xs ${textStyles.body} mb-1`}>Current Yield</div>
                  <div className="text-xl font-bold text-blue-400">
                    {formatPercentage(scoreResult.metrics.current_yield)}
                  </div>
                </div>
                <div className={`${cardStyles.default} ${scoreResult.metrics.yield_change_24h >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} text-center p-4`}>
                  <Activity className={`w-6 h-6 ${scoreResult.metrics.yield_change_24h >= 0 ? 'text-green-400' : 'text-red-400'} mx-auto mb-2`} />
                  <div className={`text-xs ${textStyles.body} mb-1`}>24h Change</div>
                  <div className={`text-xl font-bold ${scoreResult.metrics.yield_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {scoreResult.metrics.yield_change_24h >= 0 ? '+' : ''}{formatPercentage(scoreResult.metrics.yield_change_24h)}
                  </div>
                </div>
                <div className={`${cardStyles.default} bg-purple-500/10 border-purple-500/30 text-center p-4`}>
                  <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className={`text-xs ${textStyles.body} mb-1`}>Activity Level</div>
                  <div className="text-xl font-bold text-purple-400 capitalize">
                    {scoreResult.metrics.activity_level}
                  </div>
                </div>
                <div className={`${cardStyles.default} text-center p-4`}>
                  <AlertTriangle className={`w-6 h-6 ${getRiskColor(scoreResult.metrics.risk_level)} mx-auto mb-2`} />
                  <div className={`text-xs ${textStyles.body} mb-1`}>Risk Level</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getRiskBadgeStyle(scoreResult.metrics.risk_level)}`}>
                    {scoreResult.metrics.risk_level?.toUpperCase() || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className={cardStyles.featured}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h4 className={`text-lg ${textStyles.heading}`}>AI Intelligence Summary</h4>
              </div>
              <div className={`${cardStyles.default} bg-indigo-500/5 border-indigo-500/20`}>
                <p className={`${textStyles.body} leading-relaxed`}>
                  {scoreResult.ai_summary}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScoreAgentDemo; 