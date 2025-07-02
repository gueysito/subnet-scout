import React, { useState, useCallback } from 'react';
import { useSubnetAgents, useApi } from '../hooks/useApi.js';
import SubnetCard from '../components/SubnetCard.jsx';
import StatsDashboard from '../components/StatsDashboard.jsx';
import AdvancedFilters from '../components/AdvancedFilters.jsx';
import SubnetComparison from '../components/SubnetComparison.jsx';

export default function Explore() {
  const [selectedSubnet, setSelectedSubnet] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  
  const { 
    agents, 
    pagination, 
    stats, 
    loading, 
    error, 
    changePage, 
    refreshAgents,
    apiMode 
  } = useSubnetAgents();
  
  const { toggleApiMode } = useApi();

  // Handle filtered agents from AdvancedFilters component
  const handleFilteredAgentsChange = useCallback((filtered) => {
    setFilteredAgents(filtered);
  }, []);

  // Handle compare mode toggle
  const handleCompareMode = useCallback((enabled) => {
    setIsCompareMode(enabled);
  }, []);

  const handleScoreClick = (subnetId) => {
    setSelectedSubnet(subnetId);
    // You could open a modal or navigate to a detail page here
    console.log(`View details for subnet ${subnetId}`);
  };

  const handleRefresh = () => {
    refreshAgents();
  };

  const handleToggleApiMode = () => {
    toggleApiMode();
    // Data will refresh automatically due to useEffect dependency on apiMode
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <h3 className="text-red-300 font-medium">Error Loading Subnet Data</h3>
          <p className="text-red-200 mt-2">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-3 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isCompareMode ? 'Compare Subnets' : 'Explore Subnets'}
          </h2>
          <p className="text-gray-400">
            {isCompareMode 
              ? `Compare and analyze subnet performance side-by-side`
              : `Monitor and analyze ${pagination.total_count} active Bittensor subnets in real-time`
            }
          </p>
        </div>
        {!isCompareMode && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        )}
      </div>

      {/* Stats Dashboard */}
      {showStats && !isCompareMode && (
        <StatsDashboard 
          stats={stats}
          loading={loading}
          apiMode={apiMode}
          onToggleApiMode={handleToggleApiMode}
        />
      )}

      {/* Advanced Filters */}
      {!isCompareMode && (
        <AdvancedFilters
          agents={agents}
          onFilteredAgentsChange={handleFilteredAgentsChange}
          onCompareMode={handleCompareMode}
          isCompareMode={isCompareMode}
        />
      )}

      {/* Comparison Mode */}
      {isCompareMode && (
        <SubnetComparison
          agents={filteredAgents.length > 0 ? filteredAgents : agents}
          onClose={() => setIsCompareMode(false)}
        />
      )}

      {/* Subnet Grid */}
      {!isCompareMode && (
        <>
          {loading && agents.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-400">Loading subnet data...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(filteredAgents.length > 0 ? filteredAgents : agents).map((agent) => (
                  <SubnetCard
                    key={agent.subnet_id}
                    agent={agent}
                    onScoreClick={handleScoreClick}
                  />
                ))}
              </div>

              {/* Pagination - Show when using original agent list */}
              {filteredAgents.length === 0 && pagination.total_pages > 1 && (
                <div className="flex justify-center items-center space-x-4 py-6">
                  <button
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page <= 1 || loading}
                    className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <button
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={pagination.page >= pagination.total_pages || loading}
                    className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Debug Info (only in mock mode) */}
      {apiMode === 'mock' && (
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
          <h3 className="text-yellow-300 font-medium mb-2">🧪 Development Mode</h3>
          <p className="text-yellow-200 text-sm">
            You're viewing mock data. Switch to "Real" mode to connect to live APIs.
            Current data: {agents.length} subnets loaded from mock server.
          </p>
        </div>
      )}
    </div>
  );
}