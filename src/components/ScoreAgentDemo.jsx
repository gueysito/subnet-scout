import React, { useState } from 'react';
import { useApi } from '../hooks/useApi.js';

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
      const response = await fetch('http://localhost:8080/api/score', {
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

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">ScoreAgent Demo</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Backend Mode:</span>
          <span className="text-white font-medium">Real API</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Subnet ID</label>
            <input
              type="number"
              value={subnetId}
              onChange={(e) => setSubnetId(parseInt(e.target.value))}
              min="1"
              max="118"
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-20 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Sample Metrics</label>
            <div className="bg-gray-700 rounded px-3 py-2 text-sm text-gray-300">
              Emission: {formatNumber(sampleMetrics.emission_rate)} | 
              Stake: {formatNumber(sampleMetrics.total_stake)} | 
              Validators: {sampleMetrics.validator_count} | 
              Activity: {sampleMetrics.activity_score}
            </div>
          </div>
        </div>

        <button
          onClick={calculateScore}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded font-medium transition-colors"
        >
          {loading ? 'Calculating Score...' : 'Calculate Score'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-900 border border-red-700 rounded p-4">
          <h4 className="text-red-300 font-medium mb-2">Calculation Error</h4>
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {scoreResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-medium">Overall Score</h4>
              <div className={`text-3xl font-bold ${getScoreColor(scoreResult.overall_score)}`}>
                {scoreResult.overall_score}/100
              </div>
            </div>
            
            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-xl font-bold ${getScoreColor(scoreResult.breakdown.yield_score)}`}>
                  {scoreResult.breakdown.yield_score}
                </div>
                <div className="text-xs text-gray-400">Yield ({scoreResult.weights?.yield || 40}%)</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-bold ${getScoreColor(scoreResult.breakdown.activity_score)}`}>
                  {scoreResult.breakdown.activity_score}
                </div>
                <div className="text-xs text-gray-400">Activity ({scoreResult.weights?.activity || 30}%)</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-bold ${getScoreColor(scoreResult.breakdown.credibility_score)}`}>
                  {scoreResult.breakdown.credibility_score}
                </div>
                <div className="text-xs text-gray-400">Credibility ({scoreResult.weights?.credibility || 30}%)</div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Key Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Current Yield</div>
                <div className="text-blue-400 font-medium">{formatPercentage(scoreResult.metrics.current_yield)}</div>
              </div>
              <div>
                <div className="text-gray-400">24h Change</div>
                <div className={`font-medium ${scoreResult.metrics.yield_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {scoreResult.metrics.yield_change_24h >= 0 ? '+' : ''}{formatPercentage(scoreResult.metrics.yield_change_24h)}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Activity Level</div>
                <div className="text-purple-400 font-medium capitalize">{scoreResult.metrics.activity_level}</div>
              </div>
              <div>
                <div className="text-gray-400">Risk Level</div>
                <div className={`font-medium capitalize ${getRiskColor(scoreResult.metrics.risk_level)}`}>
                  {scoreResult.metrics.risk_level}
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">AI Analysis</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{scoreResult.ai_summary}</p>
          </div>

          {/* Detailed Information Toggle */}
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              {showDetails ? 'Hide' : 'Show'} Calculation Details
            </button>

            {showDetails && scoreResult.calculation_details && (
              <div className="mt-4 bg-gray-700 rounded-lg p-4">
                <h5 className="text-white font-medium mb-3">Calculation Details</h5>
                
                {/* Yield Calculation */}
                {scoreResult.calculation_details.yield_calculation && (
                  <div className="mb-4">
                    <h6 className="text-gray-300 font-medium text-sm mb-2">Yield Calculation</h6>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Daily Emission: {formatNumber(scoreResult.calculation_details.yield_calculation.daily_emission)}</div>
                      <div>Annual Emission: {formatNumber(scoreResult.calculation_details.yield_calculation.annual_emission)}</div>
                      <div>Yield Percentage: {formatPercentage(scoreResult.calculation_details.yield_calculation.yield_percentage)}</div>
                    </div>
                  </div>
                )}

                {/* Activity Calculation */}
                {scoreResult.calculation_details.activity_calculation && (
                  <div className="mb-4">
                    <h6 className="text-gray-300 font-medium text-sm mb-2">Activity Calculation</h6>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Base Activity: {scoreResult.calculation_details.activity_calculation.base_activity}</div>
                      <div>Validator Count: {scoreResult.calculation_details.activity_calculation.validator_participation}</div>
                      <div>Normalized Participation: {formatPercentage(scoreResult.calculation_details.activity_calculation.normalized_participation)}</div>
                    </div>
                  </div>
                )}

                {/* Credibility Calculation */}
                {scoreResult.calculation_details.credibility_calculation && (
                  <div>
                    <h6 className="text-gray-300 font-medium text-sm mb-2">Credibility Calculation</h6>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Validator Count: {scoreResult.calculation_details.credibility_calculation.validator_count}</div>
                      <div>Avg Stake/Validator: {formatNumber(scoreResult.calculation_details.credibility_calculation.average_stake_per_validator)}</div>
                      <div>Emission Consistency: {scoreResult.calculation_details.credibility_calculation.emission_consistency}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="text-xs text-gray-500 border-t border-gray-600 pt-4">
            <div>Calculated: {new Date(scoreResult.timestamp).toLocaleString()}</div>
            <div>Timeframe: {scoreResult.timeframe}</div>
            <div>Subnet ID: {scoreResult.subnet_id}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreAgentDemo; 