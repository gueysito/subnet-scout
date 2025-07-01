import React from 'react';

const SubnetCard = ({ agent, onScoreClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Subnet {agent.subnet_id}
          </h3>
          <p className="text-gray-400 text-sm">{agent.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
          <span className="text-sm text-gray-400 capitalize">{agent.status}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getScoreColor(agent.score)}`}>
            {agent.score}
          </div>
          <div className="text-xs text-gray-400">Overall Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {agent.yield?.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">Yield</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">
            {agent.activity}
          </div>
          <div className="text-xs text-gray-400">Activity</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-orange-400">
            {agent.credibility}
          </div>
          <div className="text-xs text-gray-400">Credibility</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onScoreClick && onScoreClick(agent.subnet_id)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition-colors"
        >
          View Details
        </button>
        <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded text-sm transition-colors">
          Monitor
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          Last updated: {formatDate(agent.last_updated)}
        </p>
      </div>
    </div>
  );
};

export default SubnetCard; 