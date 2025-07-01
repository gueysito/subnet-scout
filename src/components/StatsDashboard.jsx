import React from 'react';
import { useApiHealth } from '../hooks/useApi.js';

const StatsDashboard = ({ stats, loading, apiMode, onToggleApiMode }) => {
  const { health, isHealthy, lastCheck } = useApiHealth();

  const StatCard = ({ title, value, subtitle, color = 'text-blue-400', icon }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{loading ? '...' : value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* API Status Bar */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-white font-medium">
                API Status: {isHealthy ? 'Healthy' : 'Offline'}
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              Mode: <span className="capitalize font-medium text-white">{apiMode}</span>
            </div>
            {lastCheck && (
              <div className="text-gray-500 text-xs">
                Last check: {lastCheck.toLocaleTimeString()}
              </div>
            )}
          </div>
          <button
            onClick={onToggleApiMode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Switch to {apiMode === 'mock' ? 'Real' : 'Mock'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Subnets"
          value="118"
          subtitle="Active networks"
          color="text-blue-400"
          icon="🌐"
        />
        <StatCard
          title="Healthy Subnets"
          value={stats?.healthy_count || 0}
          subtitle={`${Math.round(((stats?.healthy_count || 0) / 118) * 100)}% uptime`}
          color="text-green-400"
          icon="✅"
        />
        <StatCard
          title="Average Score"
          value={stats?.average_score || 0}
          subtitle="Network performance"
          color="text-purple-400"
          icon="📊"
        />
        <StatCard
          title="Cost Savings"
          value="90%"
          subtitle="vs traditional cloud"
          color="text-orange-400"
          icon="💰"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="io.net Agents"
          value="327K+"
          subtitle="Available GPU nodes"
          color="text-cyan-400"
          icon="🖥️"
        />
        <StatCard
          title="Processing Speed"
          value="<60s"
          subtitle="Full network scan"
          color="text-yellow-400"
          icon="⚡"
        />
        <StatCard
          title="AI Models"
          value="25+"
          subtitle="Intelligence agents"
          color="text-pink-400"
          icon="🤖"
        />
      </div>

      {/* Health Details */}
      {health && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-medium mb-3">System Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Uptime:</span>
              <span className="text-white ml-2">{Math.floor(health.uptime || 0)}s</span>
            </div>
            <div>
              <span className="text-gray-400">Environment:</span>
              <span className="text-white ml-2 capitalize">{health.environment || 'development'}</span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 ml-2">{health.status}</span>
            </div>
            <div>
              <span className="text-gray-400">Timestamp:</span>
              <span className="text-white ml-2">{new Date(health.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDashboard; 