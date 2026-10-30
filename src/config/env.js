// Environment configuration for API client
// Support both browser (import.meta.env) and Node.js (process.env) environments
const getEnvVar = (name) => {
  // Static public references keep Vite from embedding the entire env object.
  const publicEnv = {
    VITE_MOCK_API_URL: import.meta.env?.VITE_MOCK_API_URL,
    VITE_BACKEND_URL: import.meta.env?.VITE_BACKEND_URL,
    VITE_ENABLE_DEBUG_LOGS: import.meta.env?.VITE_ENABLE_DEBUG_LOGS,
    VITE_ENABLE_ERROR_SIMULATION: import.meta.env?.VITE_ENABLE_ERROR_SIMULATION,
    VITE_TELEGRAM_BOT_USERNAME: import.meta.env?.VITE_TELEGRAM_BOT_USERNAME,
    VITE_DOMAIN_URL: import.meta.env?.VITE_DOMAIN_URL,
    NODE_ENV: import.meta.env?.MODE,
  };
  if (publicEnv[name] !== undefined) return publicEnv[name];
  // eslint-disable-next-line no-undef
  if (typeof process !== 'undefined' && process.env) {
    // eslint-disable-next-line no-undef
    return process.env[name];
  }
  return undefined;
};

export const ENV_CONFIG = {
  // API Mode Configuration
  USE_MOCK_API: false, // ALWAYS use real APIs - no more mock server issues!
  
  // API Endpoints
  MOCK_API_URL: getEnvVar('VITE_MOCK_API_URL') || 'http://localhost:3001',
  BACKEND_URL: getEnvVar('VITE_BACKEND_URL') || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? `${window.location.protocol}//${window.location.host}` : 'http://localhost:8080'),
  
  // Development Settings
  NODE_ENV: getEnvVar('NODE_ENV') || 'development',
  DEV_MODE: getEnvVar('NODE_ENV') === 'development',
  
  // Feature Flags
  ENABLE_DEBUG_LOGS: getEnvVar('VITE_ENABLE_DEBUG_LOGS') === 'true' || false,
  ENABLE_ERROR_SIMULATION: getEnvVar('VITE_ENABLE_ERROR_SIMULATION') === 'true' || false,
  
  // Social/Bot Integration
  TELEGRAM_BOT_USERNAME: getEnvVar('VITE_TELEGRAM_BOT_USERNAME') || 'subnet_scout_bot',
  
  // Domain Configuration
  DOMAIN_URL: getEnvVar('VITE_DOMAIN_URL') || 'https://subnetscout.com',
};

// Validation function to check required environment variables
export const validateEnvironment = () => {
  const warnings = [];
  const errors = [];

  // Provider credentials belong only to the server, never to Vite configuration.

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
    debugEnabled: ENV_CONFIG.ENABLE_DEBUG_LOGS,
    errorSimulationEnabled: ENV_CONFIG.ENABLE_ERROR_SIMULATION
  };
};
