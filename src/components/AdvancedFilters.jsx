import React, { useState, useEffect, useMemo } from 'react';
import { getAllSubnetMetadata } from '../data/subnets.js';

const AdvancedFilters = ({ 
  agents, 
  onFilteredAgentsChange, 
  onCompareMode,
  isCompareMode = false 
}) => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scoreRange, setScoreRange] = useState({ min: 0, max: 100 });
  const [yieldRange, setYieldRange] = useState({ min: 0, max: 100 });
  const [activityFilter, setActivityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Advanced states
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filterPresets, setFilterPresets] = useState(() => {
    const saved = localStorage.getItem('subnet-filter-presets');
    return saved ? JSON.parse(saved) : [];
  });
  const [presetName, setPresetName] = useState('');

  // Get unique values for filter options
  const subnetMetadata = getAllSubnetMetadata();
  const availableTypes = useMemo(() => {
    const types = new Set(['all']);
    agents.forEach(agent => {
      if (agent.type) types.add(agent.type);
    });
    Object.values(subnetMetadata).forEach(subnet => {
      if (subnet.type) types.add(subnet.type);
    });
    return Array.from(types);
  }, [agents, subnetMetadata]);

  // Fuzzy search function
  const fuzzyMatch = (text, searchTerm) => {
    if (!searchTerm) return true;
    if (!text) return false;
    
    const textLower = text.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Exact match
    if (textLower.includes(searchLower)) return true;
    
    // Fuzzy match - check if all characters of search exist in order
    let searchIndex = 0;
    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
      if (textLower[i] === searchLower[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === searchLower.length;
  };

  // Main filtering logic
  const filteredAgents = useMemo(() => {
    let filtered = agents.filter(agent => {
      // Search filter
      if (searchTerm) {
        const searchableText = [
          agent.name,
          agent.description,
          agent.type,
          `subnet ${agent.subnet_id}`,
          agent.subnet_id.toString()
        ].join(' ');
        
        if (!fuzzyMatch(searchableText, searchTerm)) return false;
      }

      // Type filter
      if (typeFilter !== 'all' && agent.type !== typeFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && agent.status !== statusFilter) return false;

      // Score range filter
      if (agent.score < scoreRange.min || agent.score > scoreRange.max) return false;

      // Yield range filter
      if (agent.yield < yieldRange.min || agent.yield > yieldRange.max) return false;

      // Activity filter
      if (activityFilter !== 'all') {
        const activity = agent.activity || 0;
        switch (activityFilter) {
          case 'high':
            if (activity < 75) return false;
            break;
          case 'medium':
            if (activity < 50 || activity >= 75) return false;
            break;
          case 'low':
            if (activity >= 50) return false;
            break;
        }
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'score':
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
        case 'yield':
          aValue = a.yield || 0;
          bValue = b.yield || 0;
          break;
        case 'activity':
          aValue = a.activity || 0;
          bValue = b.activity || 0;
          break;
        case 'updated':
          aValue = new Date(a.last_updated || 0);
          bValue = new Date(b.last_updated || 0);
          break;
        case 'name':
          aValue = a.name || `Subnet ${a.subnet_id}`;
          bValue = b.name || `Subnet ${b.subnet_id}`;
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        default:
          aValue = a.subnet_id;
          bValue = b.subnet_id;
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [agents, searchTerm, typeFilter, statusFilter, scoreRange, yieldRange, activityFilter, sortBy, sortOrder]);

  // Update parent component when filtered results change
  useEffect(() => {
    onFilteredAgentsChange(filteredAgents);
  }, [filteredAgents, onFilteredAgentsChange]);

  // Preset management
  const savePreset = () => {
    if (!presetName.trim()) return;
    
    const preset = {
      id: Date.now(),
      name: presetName.trim(),
      filters: {
        searchTerm,
        typeFilter,
        statusFilter,
        scoreRange,
        yieldRange,
        activityFilter,
        sortBy,
        sortOrder
      }
    };
    
    const newPresets = [...filterPresets, preset];
    setFilterPresets(newPresets);
    localStorage.setItem('subnet-filter-presets', JSON.stringify(newPresets));
    setPresetName('');
  };

  const loadPreset = (preset) => {
    const { filters } = preset;
    setSearchTerm(filters.searchTerm || '');
    setTypeFilter(filters.typeFilter || 'all');
    setStatusFilter(filters.statusFilter || 'all');
    setScoreRange(filters.scoreRange || { min: 0, max: 100 });
    setYieldRange(filters.yieldRange || { min: 0, max: 100 });
    setActivityFilter(filters.activityFilter || 'all');
    setSortBy(filters.sortBy || 'score');
    setSortOrder(filters.sortOrder || 'desc');
  };

  const deletePreset = (presetId) => {
    const newPresets = filterPresets.filter(p => p.id !== presetId);
    setFilterPresets(newPresets);
    localStorage.setItem('subnet-filter-presets', JSON.stringify(newPresets));
  };

  // Export functionality
  const exportData = (format) => {
    const dataToExport = filteredAgents.map(agent => ({
      subnet_id: agent.subnet_id,
      name: agent.name,
      description: agent.description,
      type: agent.type,
      status: agent.status,
      score: agent.score,
      yield: agent.yield,
      activity: agent.activity,
      credibility: agent.credibility,
      last_updated: agent.last_updated,
      github_url: agent.github_url
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).map(val => 
          typeof val === 'string' && val.includes(',') ? `"${val}"` : val
        ).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subnet-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else if (format === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subnet-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setScoreRange({ min: 0, max: 100 });
    setYieldRange({ min: 0, max: 100 });
    setActivityFilter('all');
    setSortBy('score');
    setSortOrder('desc');
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      {/* Main Filter Bar */}
      <div className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search subnets (fuzzy search: name, description, type)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Quick Filters */}
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            {availableTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>

          <select 
            value={`${sortBy}-${sortOrder}`} 
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setSortBy(sort);
              setSortOrder(order);
            }}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="score-desc">Score (High to Low)</option>
            <option value="score-asc">Score (Low to High)</option>
            <option value="yield-desc">Yield (High to Low)</option>
            <option value="yield-asc">Yield (Low to High)</option>
            <option value="activity-desc">Activity (High to Low)</option>
            <option value="activity-asc">Activity (Low to High)</option>
            <option value="updated-desc">Recently Updated</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>

          {/* Action Buttons */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
          >
            {showAdvanced ? 'Hide Advanced' : 'Advanced'}
          </button>

          <button
            onClick={() => onCompareMode(!isCompareMode)}
            className={`px-4 py-2 rounded transition-colors ${
              isCompareMode 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {isCompareMode ? 'Exit Compare' : 'Compare'}
          </button>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-400">
          Showing {filteredAgents.length} of {agents.length} subnets
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-700 p-4 bg-gray-750">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Score Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Score Range: {scoreRange.min} - {scoreRange.max}
              </label>
              <div className="flex space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreRange.min}
                  onChange={(e) => setScoreRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreRange.max}
                  onChange={(e) => setScoreRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Yield Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Yield Range: {yieldRange.min}% - {yieldRange.max}%
              </label>
              <div className="flex space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={yieldRange.min}
                  onChange={(e) => setYieldRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={yieldRange.max}
                  onChange={(e) => setYieldRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Activity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Activity Level</label>
              <select 
                value={activityFilter} 
                onChange={(e) => setActivityFilter(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Activity Levels</option>
                <option value="high">High Activity (75+)</option>
                <option value="medium">Medium Activity (50-74)</option>
                <option value="low">Low Activity (0-49)</option>
              </select>
            </div>
          </div>

          {/* Filter Presets */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h4 className="text-sm font-medium text-gray-300">Filter Presets:</h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Preset name..."
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={savePreset}
                  disabled={!presetName.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filterPresets.map(preset => (
                <div key={preset.id} className="flex items-center bg-gray-700 rounded">
                  <button
                    onClick={() => loadPreset(preset)}
                    className="px-3 py-1 text-sm text-white hover:bg-gray-600 rounded-l transition-colors"
                  >
                    {preset.name}
                  </button>
                  <button
                    onClick={() => deletePreset(preset.id)}
                    className="px-2 py-1 text-sm text-red-400 hover:bg-red-600 hover:text-white rounded-r transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Export & Clear */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
            <div className="flex space-x-2">
              <button
                onClick={() => exportData('csv')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportData('json')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Export JSON
              </button>
            </div>
            <button
              onClick={clearAllFilters}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters; 