import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle, CheckCircle, Users, Zap } from 'lucide-react';

const NetworkHealthPage = () => {
  const [healthData, setHealthData] = useState(null);
  const [nakamotoData, setNakamotoData] = useState(null);
  const [emissionData, setEmissionData] = useState(null);
  const [churnData, setChurnData] = useState(null);
  const [stakeMobilityData, setStakeMobilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchAllHealthData();
    const interval = setInterval(fetchAllHealthData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchAllHealthData = async () => {
    try {
      setLoading(true);
      const [health, nakamoto, emission, churn, stakeMobility] = await Promise.all([
        fetch('/api/network/health-index').then(res => res.json()),
        fetch('/api/network/nakamoto-coefficient').then(res => res.json()),
        fetch('/api/network/emission-distribution').then(res => res.json()),
        fetch('/api/network/churn-rates').then(res => res.json()),
        fetch('/api/network/stake-mobility').then(res => res.json())
      ]);

      setHealthData(health.data);
      setNakamotoData(nakamoto.data);
      setEmissionData(emission.data);
      setChurnData(churn.data);
      setStakeMobilityData(stakeMobility.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch network health data:', err);
      setError('Failed to load network health data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (value, thresholds = { good: 80, fair: 60 }) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.fair) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toLocaleString() || '0';
  };

  const formatTAO = (amount) => {
    if (!amount) return '0 TAO';
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M TAO`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K TAO`;
    return `${amount.toLocaleString()} TAO`;
  };

  if (loading && !healthData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-xl">Loading Network Health Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="text-xl text-red-400">{error}</p>
          <button 
            onClick={fetchAllHealthData}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="text-center pt-20 pb-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Network Health Index
        </h1>
        <p className="text-xl text-gray-400 mb-6">
          Comprehensive overview of Bittensor network health and decentralization metrics
        </p>
        
        {/* Data Freshness Indicator */}
        <div className="inline-flex items-center bg-gray-900 border border-gray-700 rounded-lg px-6 py-3">
          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
          <span className="text-sm text-gray-400 mr-2">Data Last Updated:</span>
          <span className="text-green-400 font-semibold">
            {lastUpdated.toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'UTC',
              timeZoneName: 'short'
            })}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Overall Health Score */}
        {healthData && (
          <div className="text-center bg-gray-900 border border-gray-700 rounded-xl p-8 mb-8">
            <div className={`text-6xl font-bold mb-2 ${getHealthColor(healthData.overall_health)}`}>
              {healthData.overall_health}%
            </div>
            <div className="text-xl text-gray-300 mb-2">Overall Network Health</div>
            <div className="text-sm text-gray-500">
              {healthData.overall_health >= 90 ? 'Excellent network stability with strong decentralization' :
               healthData.overall_health >= 80 ? 'Good network health with room for improvement' :
               healthData.overall_health >= 70 ? 'Moderate network health, monitoring recommended' :
               'Network health concerns detected, investigation needed'}
            </div>
          </div>
        )}

        {/* Core Network Metrics */}
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">Core Network Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Active Validators */}
          {healthData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Active Validators</h3>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatNumber(healthData.active_validators)}
              </div>
              <div className="text-sm text-gray-400">
                Participating in consensus across all subnets
              </div>
            </div>
          )}

          {/* Active Miners */}
          {healthData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Active Miners</h3>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatNumber(healthData.active_miners)}
              </div>
              <div className="text-sm text-gray-400">
                Contributing compute across all subnets
              </div>
            </div>
          )}

          {/* Total TAO Staked */}
          {healthData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Total TAO Staked</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatTAO(healthData.total_stake)}
              </div>
              <div className="text-sm text-gray-400">
                Total security backing the network
              </div>
            </div>
          )}

          {/* Nakamoto Coefficient */}
          {nakamotoData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Nakamoto Coefficient</h3>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {nakamotoData.nakamoto_coefficient}
              </div>
              <div className="text-sm text-gray-400">
                Entities needed to control 51% of stake
              </div>
            </div>
          )}

          {/* Subnet Participation */}
          {healthData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Subnet Participation</h3>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {healthData.subnet_participation_ratio}%
              </div>
              <div className="text-sm text-gray-400">
                Active subnets ({healthData.active_subnets}/{healthData.total_subnets})
              </div>
            </div>
          )}

          {/* Stake Mobility */}
          {stakeMobilityData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Stake Mobility (7d)</h3>
                <Activity className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stakeMobilityData.stake_mobility_percentage}%
              </div>
              <div className="text-sm text-gray-400">
                Stake movement in last 7 days
              </div>
            </div>
          )}
        </div>

        {/* Advanced Decentralization Metrics */}
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">Advanced Decentralization Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Emission Concentration */}
          {emissionData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Emission Concentration</h3>
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {emissionData.top_10_concentration}%
              </div>
              <div className="text-sm text-gray-400">
                Emissions to top 10 entities ({emissionData.distribution_health})
              </div>
            </div>
          )}

          {/* Emission Inequality (Gini) */}
          {emissionData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Emission Inequality</h3>
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {emissionData.gini_coefficient}
              </div>
              <div className="text-sm text-gray-400">
                Gini coefficient (0=equal, 1=concentrated)
              </div>
            </div>
          )}

          {/* Validator/Miner Ratio */}
          {healthData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Validator/Miner Ratio</h3>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                1:{healthData.validator_miner_ratio}
              </div>
              <div className="text-sm text-gray-400">
                Current network participation balance
              </div>
            </div>
          )}

          {/* Daily Churn Rate */}
          {churnData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Daily Churn Rate</h3>
                <Activity className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {churnData.daily_churn_rate}%
              </div>
              <div className="text-sm text-gray-400">
                Rate of participant entry/exit ({churnData.network_stability})
              </div>
            </div>
          )}

          {/* Network Uptime */}
          {healthData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Network Uptime</h3>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {healthData.network_uptime}%
              </div>
              <div className="text-sm text-gray-400">
                Average uptime across all subnets
              </div>
            </div>
          )}

          {/* Decentralization Score */}
          {nakamotoData && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Decentralization Score</h3>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div className={`text-3xl font-bold mb-1 ${getHealthColor(nakamotoData.decentralization_score)}`}>
                {Math.round(nakamotoData.decentralization_score)}%
              </div>
              <div className="text-sm text-gray-400">
                Based on Nakamoto coefficient analysis
              </div>
            </div>
          )}
        </div>

        {/* Data Sources & Methodology */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-3">Data Sources & Methodology</h3>
          <div className="text-sm text-gray-400 space-y-2">
            <p>
              <span className="font-medium text-white">Data Sources:</span> TaoStats API, Distributed Monitoring System, On-chain Analytics
            </p>
            <p>
              <span className="font-medium text-white">Update Frequency:</span> Real-time monitoring with 5-minute refresh intervals
            </p>
            <p>
              <span className="font-medium text-white">Methodology:</span> Network health calculated using participation ratio (30%), 
              validator/miner balance (25%), average uptime (25%), and validator count (20%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkHealthPage;