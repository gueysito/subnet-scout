import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient.js';

// Custom hook for API data management
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiMode, setApiMode] = useState(apiClient.getCurrentMode());

  // Generic API call wrapper
  const apiCall = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Toggle between mock and real APIs
  const toggleApiMode = useCallback(() => {
    apiClient.toggleMockMode();
    setApiMode(apiClient.getCurrentMode());
  }, []);

  // Specific API methods
  const getAgentsList = useCallback((page = 1, limit = 20) => {
    return apiCall(apiClient.getAgentsList.bind(apiClient), page, limit);
  }, [apiCall]);

  const getIoNetAgents = useCallback(() => {
    return apiCall(apiClient.getIoNetAgents.bind(apiClient));
  }, [apiCall]);

  const getTaoStatsData = useCallback((netuid = 1, options = {}) => {
    return apiCall(apiClient.getTaoStatsData.bind(apiClient), netuid, options);
  }, [apiCall]);

  const calculateScore = useCallback((subnetId, metrics, timeframe = '24h') => {
    return apiCall(apiClient.calculateScore.bind(apiClient), subnetId, metrics, timeframe);
  }, [apiCall]);

  const sendTelegramMessage = useCallback((message) => {
    return apiCall(apiClient.sendTelegramMessage.bind(apiClient), message);
  }, [apiCall]);

  const healthCheck = useCallback(() => {
    return apiCall(apiClient.healthCheck.bind(apiClient));
  }, [apiCall]);

  return {
    // State
    loading,
    error,
    apiMode,
    
    // Actions
    toggleApiMode,
    clearError: () => setError(null),
    
    // API Methods
    getAgentsList,
    getIoNetAgents,
    getTaoStatsData,
    calculateScore,
    sendTelegramMessage,
    healthCheck,
    
    // Generic API call
    apiCall
  };
};

// Hook for managing subnet agents data
export const useSubnetAgents = (autoFetch = true) => {
  const [agents, setAgents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total_pages: 1,
    total_count: 0
  });
  const [stats, setStats] = useState({
    healthy_count: 0,
    average_score: 0
  });
  
  const { loading, error, getAgentsList, apiMode } = useApi();

  const fetchAgents = useCallback(async (page = 1, limit = 20) => {
    try {
      const data = await getAgentsList(page, limit);
      setAgents(data.agents || []);
      setPagination(data.pagination || { page, limit, total_pages: 1, total_count: 0 });
      setStats({
        healthy_count: data.healthy_count || 0,
        average_score: data.average_score || 0
      });
      return data;
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      setAgents([]);
    }
  }, [getAgentsList]);

  const refreshAgents = useCallback(() => {
    return fetchAgents(pagination.page, pagination.limit);
  }, [fetchAgents, pagination.page, pagination.limit]);

  const changePage = useCallback((newPage) => {
    return fetchAgents(newPage, pagination.limit);
  }, [fetchAgents, pagination.limit]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchAgents();
    }
  }, [autoFetch, fetchAgents, apiMode]); // Re-fetch when API mode changes

  return {
    agents,
    pagination,
    stats,
    loading,
    error,
    fetchAgents,
    refreshAgents,
    changePage,
    apiMode
  };
};

// Hook for managing individual subnet scoring
export const useSubnetScore = (subnetId) => {
  const [score, setScore] = useState(null);
  const { loading, error, calculateScore, getTaoStatsData } = useApi();

  const fetchScore = useCallback(async (timeframe = '24h') => {
    if (!subnetId) return;

    try {
      // First get the subnet data
      const subnetData = await getTaoStatsData(subnetId, { limit: 1 });
      
      if (subnetData && subnetData.length > 0) {
        const data = subnetData[0];
        const metrics = {
          emission_rate: data.emission_rate,
          total_stake: data.total_stake,
          validator_count: data.validator_count,
          activity_score: data.activity_score,
          price_history: [data.price]
        };

        const scoreData = await calculateScore(subnetId, metrics, timeframe);
        setScore(scoreData);
        return scoreData;
      }
    } catch (err) {
      console.error('Failed to fetch subnet score:', err);
      setScore(null);
    }
  }, [subnetId, calculateScore, getTaoStatsData]);

  useEffect(() => {
    if (subnetId) {
      fetchScore();
    }
  }, [subnetId, fetchScore]);

  return {
    score,
    loading,
    error,
    fetchScore,
    refetch: () => fetchScore()
  };
};

// Hook for API health monitoring
export const useApiHealth = () => {
  const [health, setHealth] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
  const { loading, error, healthCheck, apiMode } = useApi();

  const checkHealth = useCallback(async () => {
    try {
      const healthData = await healthCheck();
      setHealth(healthData);
      setLastCheck(new Date());
      return healthData;
    } catch (err) {
      console.error('Health check failed:', err);
      setHealth(null);
    }
  }, [healthCheck]);

  useEffect(() => {
    checkHealth();
    // Set up periodic health checks every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth, apiMode]);

  return {
    health,
    lastCheck,
    loading,
    error,
    checkHealth,
    isHealthy: health?.status === 'healthy'
  };
}; 