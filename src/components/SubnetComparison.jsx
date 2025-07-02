import React, { useState, useMemo } from 'react';
import { getSubnetMetadata } from '../data/subnets.js';

const SubnetComparison = ({ agents, onClose }) => {
  const [selectedSubnets, setSelectedSubnets] = useState([]);
  const [maxCompare] = useState(4); // Maximum subnets to compare at once

  // Add subnet to comparison
  const addToComparison = (agent) => {
    if (selectedSubnets.length < maxCompare) {
      setSelectedSubnets(prev => [...prev, agent]);
    }
  };

  // Remove subnet from comparison
  const removeFromComparison = (subnetId) => {
    setSelectedSubnets(prev => prev.filter(subnet => subnet.subnet_id !== subnetId));
  };

  // Clear all comparisons
  const clearComparison = () => {
    setSelectedSubnets([]);
  };

  // Get comparison winner for each metric
  const getWinner = (metric) => {
    if (selectedSubnets.length === 0) return null;
    
    return selectedSubnets.reduce((winner, current) => {
      const currentValue = current[metric] || 0;
      const winnerValue = winner[metric] || 0;
      return currentValue > winnerValue ? current : winner;
    });
  };

  // Calculate average metrics
  const averageMetrics = useMemo(() => {
    if (selectedSubnets.length === 0) return {};
    
    const totals = selectedSubnets.reduce((acc, subnet) => {
      acc.score += subnet.score || 0;
      acc.yield += subnet.yield || 0;
      acc.activity += subnet.activity || 0;
      acc.credibility += subnet.credibility || 0;
      return acc;
    }, { score: 0, yield: 0, activity: 0, credibility: 0 });

    return {
      score: (totals.score / selectedSubnets.length).toFixed(1),
      yield: (totals.yield / selectedSubnets.length).toFixed(1),
      activity: (totals.activity / selectedSubnets.length).toFixed(1),
      credibility: (totals.credibility / selectedSubnets.length).toFixed(1)
    };
  }, [selectedSubnets]);

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get metric color based on performance
  const getMetricColor = (value, isWinner = false) => {
    if (isWinner) return 'text-green-400 font-bold';
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-white">Subnet Comparison Mode</h3>
          <p className="text-gray-400 text-sm">
            Select up to {maxCompare} subnets to compare side-by-side
          </p>
        </div>
        <div className="flex space-x-2">
          {selectedSubnets.length > 0 && (
            <button
              onClick={clearComparison}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Exit Compare
          </button>
        </div>
      </div>

      {/* Selection Grid */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-md font-medium text-white mb-3">
          Available Subnets ({selectedSubnets.length}/{maxCompare} selected)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
          {agents.map(agent => {
            const isSelected = selectedSubnets.some(s => s.subnet_id === agent.subnet_id);
            const canAdd = !isSelected && selectedSubnets.length < maxCompare;
            
            return (
              <div
                key={agent.subnet_id}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-900 border-blue-600' 
                    : canAdd 
                      ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                      : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (isSelected) {
                    removeFromComparison(agent.subnet_id);
                  } else if (canAdd) {
                    addToComparison(agent);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-white truncate">
                      {agent.name || `Subnet ${agent.subnet_id}`}
                    </h5>
                    <p className="text-xs text-gray-400">
                      Score: {agent.score} | Yield: {agent.yield?.toFixed(1)}%
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                </div>
                <div className="text-xs text-gray-400">
                  {isSelected ? '✓ Selected' : canAdd ? 'Click to add' : 'Max reached'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedSubnets.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-4 bg-gray-750 border-b border-gray-700">
            <h4 className="text-md font-medium text-white">Detailed Comparison</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">Metric</th>
                  {selectedSubnets.map(subnet => (
                    <th key={subnet.subnet_id} className="text-center p-4 text-gray-300 font-medium min-w-32">
                      <div className="truncate">
                        {subnet.name || `Subnet ${subnet.subnet_id}`}
                      </div>
                      <div className="text-xs text-gray-400 font-normal">
                        ID: {subnet.subnet_id}
                      </div>
                    </th>
                  ))}
                  <th className="text-center p-4 text-gray-300 font-medium">Average</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-700">
                {/* Basic Info */}
                <tr className="bg-gray-750">
                  <td className="p-4 text-gray-300 font-medium">Type</td>
                  {selectedSubnets.map(subnet => (
                    <td key={subnet.subnet_id} className="text-center p-4 text-white">
                      <span className="inline-block px-2 py-1 bg-blue-600 text-xs rounded-full">
                        {subnet.type || 'N/A'}
                      </span>
                    </td>
                  ))}
                  <td className="text-center p-4 text-gray-400">-</td>
                </tr>

                <tr>
                  <td className="p-4 text-gray-300 font-medium">Status</td>
                  {selectedSubnets.map(subnet => (
                    <td key={subnet.subnet_id} className="text-center p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(subnet.status)}`}></div>
                        <span className="text-white capitalize text-sm">{subnet.status}</span>
                      </div>
                    </td>
                  ))}
                  <td className="text-center p-4 text-gray-400">-</td>
                </tr>

                {/* Performance Metrics */}
                <tr className="bg-gray-750">
                  <td className="p-4 text-gray-300 font-medium">Overall Score</td>
                  {selectedSubnets.map(subnet => {
                    const isWinner = getWinner('score')?.subnet_id === subnet.subnet_id;
                    return (
                      <td key={subnet.subnet_id} className="text-center p-4">
                        <span className={`text-xl font-bold ${getMetricColor(subnet.score, isWinner)}`}>
                          {subnet.score}
                        </span>
                        {isWinner && <span className="text-xs text-green-400 block">🏆 Best</span>}
                      </td>
                    );
                  })}
                  <td className="text-center p-4">
                    <span className="text-lg font-semibold text-gray-300">{averageMetrics.score}</span>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 text-gray-300 font-medium">Yield (%)</td>
                  {selectedSubnets.map(subnet => {
                    const isWinner = getWinner('yield')?.subnet_id === subnet.subnet_id;
                    return (
                      <td key={subnet.subnet_id} className="text-center p-4">
                        <span className={`text-xl font-bold ${getMetricColor(subnet.yield, isWinner)}`}>
                          {subnet.yield?.toFixed(1)}%
                        </span>
                        {isWinner && <span className="text-xs text-green-400 block">🏆 Best</span>}
                      </td>
                    );
                  })}
                  <td className="text-center p-4">
                    <span className="text-lg font-semibold text-gray-300">{averageMetrics.yield}%</span>
                  </td>
                </tr>

                <tr className="bg-gray-750">
                  <td className="p-4 text-gray-300 font-medium">Activity</td>
                  {selectedSubnets.map(subnet => {
                    const isWinner = getWinner('activity')?.subnet_id === subnet.subnet_id;
                    return (
                      <td key={subnet.subnet_id} className="text-center p-4">
                        <span className={`text-lg font-semibold ${getMetricColor(subnet.activity, isWinner)}`}>
                          {subnet.activity}
                        </span>
                        {isWinner && <span className="text-xs text-green-400 block">🏆 Best</span>}
                      </td>
                    );
                  })}
                  <td className="text-center p-4">
                    <span className="text-lg font-semibold text-gray-300">{averageMetrics.activity}</span>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 text-gray-300 font-medium">Credibility</td>
                  {selectedSubnets.map(subnet => {
                    const isWinner = getWinner('credibility')?.subnet_id === subnet.subnet_id;
                    return (
                      <td key={subnet.subnet_id} className="text-center p-4">
                        <span className={`text-lg font-semibold ${getMetricColor(subnet.credibility, isWinner)}`}>
                          {subnet.credibility}
                        </span>
                        {isWinner && <span className="text-xs text-green-400 block">🏆 Best</span>}
                      </td>
                    );
                  })}
                  <td className="text-center p-4">
                    <span className="text-lg font-semibold text-gray-300">{averageMetrics.credibility}</span>
                  </td>
                </tr>

                {/* Additional Info */}
                <tr className="bg-gray-750">
                  <td className="p-4 text-gray-300 font-medium">GitHub</td>
                  {selectedSubnets.map(subnet => (
                    <td key={subnet.subnet_id} className="text-center p-4">
                      {subnet.github_url ? (
                        <a
                          href={subnet.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          Repository
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">N/A</span>
                      )}
                    </td>
                  ))}
                  <td className="text-center p-4 text-gray-400">-</td>
                </tr>

                <tr>
                  <td className="p-4 text-gray-300 font-medium">Last Updated</td>
                  {selectedSubnets.map(subnet => (
                    <td key={subnet.subnet_id} className="text-center p-4 text-gray-400 text-sm">
                      {formatDate(subnet.last_updated)}
                    </td>
                  ))}
                  <td className="text-center p-4 text-gray-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-750 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {getWinner('score')?.name || `Subnet ${getWinner('score')?.subnet_id}`}
                </div>
                <div className="text-sm text-gray-400">Highest Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {getWinner('yield')?.name || `Subnet ${getWinner('yield')?.subnet_id}`}
                </div>
                <div className="text-sm text-gray-400">Best Yield</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {getWinner('activity')?.name || `Subnet ${getWinner('activity')?.subnet_id}`}
                </div>
                <div className="text-sm text-gray-400">Most Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {getWinner('credibility')?.name || `Subnet ${getWinner('credibility')?.subnet_id}`}
                </div>
                <div className="text-sm text-gray-400">Most Credible</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedSubnets.length === 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Subnets Selected</h3>
          <p className="text-gray-400 mb-4">
            Click on subnets above to add them to your comparison. You can compare up to {maxCompare} subnets at once.
          </p>
          <div className="text-sm text-gray-500">
            💡 Tip: Select subnets with similar types for meaningful comparisons
          </div>
        </div>
      )}
    </div>
  );
};

export default SubnetComparison; 