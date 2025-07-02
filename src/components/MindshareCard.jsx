import React, { useState, useEffect } from 'react';

const MindshareCard = ({ username, compact = false, showDetails = true }) => {
  const [mindshareData, setMindshareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      fetchMindshareData();
    }
  }, [username]);

  const fetchMindshareData = async () => {
    if (!username) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/mindshare/${encodeURIComponent(username)}`);
      const result = await response.json();
      
      if (result.success) {
        setMindshareData(result.data);
      } else {
        setError(result.error || 'Failed to fetch mindshare data');
      }
    } catch (err) {
      setError('Network error fetching mindshare data');
    } finally {
      setLoading(false);
    }
  };

  const formatYapsValue = (value) => {
    if (value === 0) return '0';
    if (value < 1000) return value.toFixed(1);
    if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
    return `${(value / 1000000).toFixed(1)}M`;
  };

  const getTrendIndicator = (recent, medium) => {
    if (recent > medium * 0.8) return { symbol: '↗️', text: 'Rising', color: 'text-green-500' };
    if (recent < medium * 0.4) return { symbol: '↘️', text: 'Declining', color: 'text-red-500' };
    return { symbol: '➡️', text: 'Stable', color: 'text-blue-500' };
  };

  if (!username) {
    return null;
  }

  if (loading) {
    return (
      <div className={`${compact ? 'p-2' : 'p-4'} bg-gray-50 rounded-lg border animate-pulse`}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
        {!compact && (
          <div className="mt-2 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${compact ? 'p-2' : 'p-4'} bg-red-50 rounded-lg border border-red-200`}>
        <div className="flex items-center space-x-2 text-red-600">
          <span className="text-sm">⚠️</span>
          <span className="text-xs">Mindshare data unavailable</span>
        </div>
      </div>
    );
  }

  if (!mindshareData) {
    return (
      <div className={`${compact ? 'p-2' : 'p-4'} bg-gray-50 rounded-lg border`}>
        <div className="flex items-center space-x-2 text-gray-500">
          <span className="text-sm">👋</span>
          <span className="text-xs">No mindshare data</span>
        </div>
      </div>
    );
  }

  const { badge, reputation } = mindshareData;
  const trend = getTrendIndicator(mindshareData.yaps_l7d, mindshareData.yaps_l30d);

  if (compact) {
    return (
      <div className="inline-flex items-center space-x-2 px-2 py-1 bg-white rounded-lg border shadow-sm">
        <span 
          className="text-sm"
          style={{ color: badge.color }}
          title={`${badge.level} (${reputation.score}/100)`}
        >
          {badge.emoji}
        </span>
        <span className="text-xs font-medium text-gray-700">
          {formatYapsValue(mindshareData.yaps_all)}
        </span>
        <span className="text-xs text-gray-500" title={trend.text}>
          {trend.symbol}
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span 
            className="text-lg"
            style={{ color: badge.color }}
            title={`${badge.level} reputation`}
          >
            {badge.emoji}
          </span>
          <div>
            <div className="text-sm font-medium text-gray-900">@{username}</div>
            <div className="text-xs text-gray-500 capitalize">{badge.level}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {reputation.score}/100
          </div>
          <div className="text-xs text-gray-500">Reputation</div>
        </div>
      </div>

      {/* Mindshare Metrics */}
      {showDetails && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm font-semibold text-gray-900">
                {formatYapsValue(mindshareData.yaps_l7d)}
              </div>
              <div className="text-xs text-gray-500">7-day</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm font-semibold text-gray-900">
                {formatYapsValue(mindshareData.yaps_l30d)}
              </div>
              <div className="text-xs text-gray-500">30-day</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm font-semibold text-gray-900">
                {formatYapsValue(mindshareData.yaps_all)}
              </div>
              <div className="text-xs text-gray-500">All-time</div>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{trend.symbol}</span>
              <span className={`text-xs font-medium ${trend.color}`}>
                {trend.text}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {mindshareData.source === 'kaito_yaps' ? 'Live data' : 'Cached'}
            </div>
          </div>

          {/* Reputation Breakdown (if detailed view) */}
          {reputation.breakdown && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-600 mb-1">Reputation Breakdown:</div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-center">
                  <div className="font-medium">{reputation.breakdown.recent_activity}</div>
                  <div className="text-gray-500">Recent</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{reputation.breakdown.medium_activity}</div>
                  <div className="text-gray-500">Medium</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{reputation.breakdown.total_activity}</div>
                  <div className="text-gray-500">Total</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Batch Mindshare component for multiple users
export const BatchMindshareDisplay = ({ usernames, onDataLoad }) => {
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usernames && usernames.length > 0) {
      fetchBatchMindshareData();
    }
  }, [usernames]);

  const fetchBatchMindshareData = async () => {
    if (!usernames || usernames.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/mindshare/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernames }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setBatchData(result.data);
        if (onDataLoad) {
          onDataLoad(result.data);
        }
      } else {
        setError(result.error || 'Failed to fetch batch mindshare data');
      }
    } catch (err) {
      setError('Network error fetching batch mindshare data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-sm">Loading mindshare data for {usernames?.length || 0} users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center space-x-2 text-red-600">
          <span>⚠️</span>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {batchData.map((data, index) => (
        <MindshareCard 
          key={data.username || index}
          username={data.username}
          compact={true}
          showDetails={false}
        />
      ))}
    </div>
  );
};

export default MindshareCard; 