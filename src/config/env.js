// Environment configuration for API client
export const ENV_CONFIG = {
  // API Mode Configuration
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true' || true, // Default to mock for development
  
  // API Endpoints
  MOCK_API_URL: import.meta.env.VITE_MOCK_API_URL || 'http://localhost:3001',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  
  // External API Keys
  IONET_API_KEY: import.meta.env.VITE_IONET_API_KEY,
  TAOSTATS_USERNAME: import.meta.env.VITE_TAOSTATS_USERNAME,
  TAOSTATS_PASSWORD: import.meta.env.VITE_TAOSTATS_PASSWORD,
  
  // Development Settings
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  DEV_MODE: import.meta.env.NODE_ENV === 'development',
  
  // Feature Flags
  ENABLE_DEBUG_LOGS: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true' || false,
  ENABLE_ERROR_SIMULATION: import.meta.env.VITE_ENABLE_ERROR_SIMULATION === 'true' || false,
};

// Validation function to check required environment variables
export const validateEnvironment = () => {
  const warnings = [];
  const errors = [];

  // Check if we're in production without real API keys
  if (!ENV_CONFIG.USE_MOCK_API && ENV_CONFIG.NODE_ENV === 'production') {
    if (!ENV_CONFIG.IONET_API_KEY) {
      errors.push('VITE_IONET_API_KEY is required in production mode');
    }
    if (!ENV_CONFIG.TAOSTATS_USERNAME || !ENV_CONFIG.TAOSTATS_PASSWORD) {
      warnings.push('TaoStats credentials not provided - some features may be limited');
    }
  }

  // Development warnings
  if (ENV_CONFIG.USE_MOCK_API && ENV_CONFIG.NODE_ENV === 'production') {
    warnings.push('Using mock APIs in production - this should be changed');
  }

  return { warnings, errors };
};

// Helper function to get current API mode description
export const getApiModeDescription = () => {
  const mode = ENV_CONFIG.USE_MOCK_API ? 'Mock' : 'Real';
  const description = ENV_CONFIG.USE_MOCK_API 
    ? 'Using local mock server for development'
    : 'Connected to live APIs';
  
  return { mode, description };
};

// Debug logging helper
export const debugLog = (message, data = null) => {
  if (ENV_CONFIG.ENABLE_DEBUG_LOGS || ENV_CONFIG.DEV_MODE) {
    console.log(`[SubnetScout] ${message}`, data || '');
  }
};

// Export environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    nodeEnv: ENV_CONFIG.NODE_ENV,
    apiMode: ENV_CONFIG.USE_MOCK_API ? 'mock' : 'real',
    mockApiUrl: ENV_CONFIG.MOCK_API_URL,
    backendUrl: ENV_CONFIG.BACKEND_URL,
    hasIoNetKey: !!ENV_CONFIG.IONET_API_KEY,
    hasTaoStatsCredentials: !!(ENV_CONFIG.TAOSTATS_USERNAME && ENV_CONFIG.TAOSTATS_PASSWORD),
    debugEnabled: ENV_CONFIG.ENABLE_DEBUG_LOGS,
    errorSimulationEnabled: ENV_CONFIG.ENABLE_ERROR_SIMULATION
  };
}; 