// Environment configuration for API client
// Support both browser (import.meta.env) and Node.js (process.env) environments
const getEnvVar = (name) => {
  // Try import.meta.env first (browser/Vite), then process.env (Node.js)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[name];
  }
  // eslint-disable-next-line no-undef
  if (typeof process !== 'undefined' && process.env) {
    // eslint-disable-next-line no-undef
    return process.env[name];
  }
  return undefined;
};

export const ENV_CONFIG = {
  // API Mode Configuration
  USE_MOCK_API: getEnvVar('VITE_USE_MOCK_API') === 'true' || false, // Default to REAL data (no more shortcuts!)
  
  // API Endpoints
  MOCK_API_URL: getEnvVar('VITE_MOCK_API_URL') || 'http://localhost:3001',
  BACKEND_URL: getEnvVar('VITE_BACKEND_URL') || 'http://localhost:8080',
  
  // External API Keys
  IONET_API_KEY: getEnvVar('VITE_IONET_API_KEY') || getEnvVar('IONET_API_KEY'),
  TAOSTATS_USERNAME: getEnvVar('VITE_TAOSTATS_USERNAME') || getEnvVar('TAOSTATS_API_USERNAME'),
  TAOSTATS_PASSWORD: getEnvVar('VITE_TAOSTATS_PASSWORD') || getEnvVar('TAOSTATS_API_SECRET'),
  
  // Development Settings
  NODE_ENV: getEnvVar('NODE_ENV') || 'development',
  DEV_MODE: getEnvVar('NODE_ENV') === 'development',
  
  // Feature Flags
  ENABLE_DEBUG_LOGS: getEnvVar('VITE_ENABLE_DEBUG_LOGS') === 'true' || false,
  ENABLE_ERROR_SIMULATION: getEnvVar('VITE_ENABLE_ERROR_SIMULATION') === 'true' || false,
  
  // Social/Bot Integration
  TELEGRAM_BOT_USERNAME: getEnvVar('VITE_TELEGRAM_BOT_USERNAME') || 'subnet_scout_bot',
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