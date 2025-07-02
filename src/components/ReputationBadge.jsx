import React, { useState, useEffect } from 'react';

const ReputationBadge = ({ 
  username, 
  size = 'small', 
  showTooltip = true,
  showScore = false,
  className = '' 
}) => {
  const [badgeData, setBadgeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTooltipContent, setShowTooltipContent] = useState(false);

  useEffect(() => {
    if (username) {
      fetchBadgeData();
    }
  }, [username]);

  const fetchBadgeData = async () => {
    if (!username) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/mindshare/${encodeURIComponent(username)}`);
      const result = await response.json();
      
      if (result.success) {
        setBadgeData({
          badge: result.data.badge,
          reputation: result.data.reputation,
          yaps: {
            all: result.data.yaps_all,
            l7d: result.data.yaps_l7d,
            l30d: result.data.yaps_l30d
          }
        });
      }
    } catch (err) {
      // Silently fail for badges - just don't show anything
      console.warn('Failed to fetch reputation data for', username);
    } finally {
      setLoading(false);
    }
  };

  const formatYapsValue = (value) => {
    if (value === 0) return '0';
    if (value < 1000) return value.toFixed(0);
    if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
    return `${(value / 1000000).toFixed(1)}M`;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'tiny':
        return 'text-xs px-1 py-0.5';
      case 'small':
        return 'text-sm px-2 py-1';
      case 'medium':
        return 'text-base px-3 py-1.5';
      case 'large':
        return 'text-lg px-4 py-2';
      default:
        return 'text-sm px-2 py-1';
    }
  };

  if (loading) {
    return (
      <div className={`inline-flex items-center ${getSizeClasses()} bg-gray-100 rounded-full animate-pulse ${className}`}>
        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  if (!badgeData) {
    return null; // Don't show anything if no data
  }

  const { badge, reputation, yaps } = badgeData;

  const BadgeContent = () => (
    <div 
      className={`inline-flex items-center space-x-1 ${getSizeClasses()} rounded-full border transition-all duration-200 hover:shadow-md ${className}`}
      style={{ 
        backgroundColor: `${badge.color}10`,
        borderColor: `${badge.color}40`,
        color: badge.color 
      }}
      onMouseEnter={() => showTooltip && setShowTooltipContent(true)}
      onMouseLeave={() => setShowTooltipContent(false)}
    >
      <span className="leading-none">{badge.emoji}</span>
      {showScore && (
        <span className="font-medium">{reputation.score}</span>
      )}
      {size !== 'tiny' && (
        <span className="font-medium capitalize text-xs">
          {badge.level}
        </span>
      )}
    </div>
  );

  if (!showTooltip) {
    return <BadgeContent />;
  }

  return (
    <div className="relative inline-block">
      <BadgeContent />
      
      {/* Tooltip */}
      {showTooltipContent && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
          <div className="font-medium">@{username}</div>
          <div className="text-gray-300 capitalize">{badge.level} • {reputation.score}/100</div>
          <div className="border-t border-gray-700 pt-1 mt-1">
            <div>All-time: {formatYapsValue(yaps.all)} Yaps</div>
            <div>7-day: {formatYapsValue(yaps.l7d)} Yaps</div>
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// Batch reputation badges for lists
export const BatchReputationBadges = ({ 
  usernames, 
  size = 'small',
  maxDisplay = 5,
  showOverflow = true 
}) => {
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usernames && usernames.length > 0) {
      fetchBatchData();
    }
  }, [usernames]);

  const fetchBatchData = async () => {
    if (!usernames || usernames.length === 0) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/mindshare/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernames: usernames.slice(0, 50) }), // API limit
      });
      
      const result = await response.json();
      
      if (result.success) {
        setBatchData(result.data);
      }
    } catch (err) {
      console.warn('Failed to fetch batch reputation data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: Math.min(maxDisplay, usernames?.length || 0) }).map((_, i) => (
          <div key={i} className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    );
  }

  const displayData = batchData.slice(0, maxDisplay);
  const overflowCount = Math.max(0, (usernames?.length || 0) - maxDisplay);

  return (
    <div className="flex items-center space-x-1">
      {displayData.map((data, index) => (
        <ReputationBadge
          key={data.username || index}
          username={data.username}
          size={size}
          showTooltip={true}
          showScore={false}
        />
      ))}
      
      {showOverflow && overflowCount > 0 && (
        <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
          +{overflowCount}
        </div>
      )}
    </div>
  );
};

// Reputation summary for groups
export const ReputationSummary = ({ usernames, title = "Team Reputation" }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usernames && usernames.length > 0) {
      fetchSummaryData();
    }
  }, [usernames]);

  const fetchSummaryData = async () => {
    if (!usernames || usernames.length === 0) return;
    
    setLoading(true);
    
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
        const validData = result.data.filter(d => d.reputation.score > 0);
        const avgScore = validData.length > 0 
          ? validData.reduce((sum, d) => sum + d.reputation.score, 0) / validData.length 
          : 0;
        
        const levelCounts = validData.reduce((acc, d) => {
          acc[d.badge.level] = (acc[d.badge.level] || 0) + 1;
          return acc;
        }, {});

        setSummaryData({
          averageScore: Math.round(avgScore),
          totalUsers: validData.length,
          levelDistribution: levelCounts,
          topUser: validData.sort((a, b) => b.reputation.score - a.reputation.score)[0]
        });
      }
    } catch (err) {
      console.warn('Failed to fetch reputation summary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!summaryData) return null;

  return (
    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
      <div className="text-sm font-medium text-gray-900 mb-2">{title}</div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {summaryData.averageScore}
            </div>
            <div className="text-xs text-gray-500">Avg Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {summaryData.totalUsers}
            </div>
            <div className="text-xs text-gray-500">Contributors</div>
          </div>
        </div>

        {summaryData.topUser && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Top:</span>
            <ReputationBadge
              username={summaryData.topUser.username}
              size="small"
              showScore={true}
              showTooltip={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReputationBadge; 