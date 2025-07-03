import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient.js';

// Custom hook for API data management
export const useApi = () => {
  const [apiMode, setApiMode] = useState('mock');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleApiMode = () => {
    const newMode = apiMode === 'mock' ? 'real' : 'mock';
    setApiMode(newMode);
    apiClient.toggleMockMode();
  };

  const healthCheck = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.healthCheck();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getIoNetAgents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getIoNetAgents();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getTaoStatsData = async (netuid = 1, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getTaoStatsData(netuid, options);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateScore = async (subnetId, metrics, timeframe = '24h') => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.calculateScore(subnetId, metrics, timeframe);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTelegramMessage = async (message) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.sendTelegramMessage(message);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Generic GET method for API calls
  const get = async (endpoint) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get(endpoint);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    apiMode,
    isLoading,
    error,
    toggleApiMode,
    healthCheck,
    getIoNetAgents,
    getTaoStatsData,
    calculateScore,
    sendTelegramMessage,
    get,
    getCurrentMode: () => apiClient.getCurrentMode()
  };
};

// Hook for managing subnet agents data
export const useSubnetAgents = (page = 1, limit = 20) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (pageNum = page, limitNum = limit) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getAgentsList(pageNum, limitNum);
      setData(response);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch subnet agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, limit);
  }, [page, limit]);

  const refetch = (options = {}) => {
    const newPage = options.page || page;
    const newLimit = options.limit || limit;
    fetchData(newPage, newLimit);
  };

  return {
    data,
    loading,
    error,
    refetch
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