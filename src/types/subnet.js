// Subnet data structure interfaces for type safety and API integration

export const SubnetSchema = {
  id: 'number',
  name: 'string',
  category: 'string', // 'Training', 'Inference', 'Prompting', 'Other'
  marketCap: 'string',
  health: 'string', // percentage as string
  commits: 'number',
  yield: 'string', // percentage as string
  description: 'string',
  uptime: 'number', // percentage
  validators: 'number',
  holders: 'number',
  emissions: 'number',
  stake: 'number',
  githubActivity: 'object',
  ethosScore: 'number',
  kaitoScore: 'number',
  lastUpdated: 'string' // ISO date string
}

export const MarketDataSchema = {
  taoMarketCap: 'string',
  taoChange24h: 'string',
  taoChange7d: 'string',
  taoChange1m: 'string',
  subnetMarketCap: 'string',
  subnetChange24h: 'string',
  subnetChange7d: 'string',
  subnetChange1m: 'string',
  networkHealth: 'string',
  lastUpdated: 'string'
}

export const BriefDataSchema = {
  subnetOfMonth: {
    id: 'number',
    category: 'string',
    yield: 'string',
    health: 'string',
    description: 'string'
  },
  risingStar: {
    id: 'number',
    category: 'string',
    yield: 'string',
    health: 'string',
    description: 'string'
  }
}

// API endpoint constants
export const API_ENDPOINTS = {
  SUBNETS: '/api/agents',
  SUBNET_DETAIL: '/api/subnet/:id/data',
  MARKET_DATA: '/api/market/overview',
  BRIEF_DATA: '/api/insights/brief',
  SEARCH: '/api/search',
  HEALTH: '/health'
}

// Default values for development
export const DEFAULT_SUBNET = {
  id: 0,
  name: 'Unknown Subnet',
  category: 'Other',
  marketCap: '$0',
  health: '0%',
  commits: 0,
  yield: '0%',
  description: 'No description available',
  uptime: 0,
  validators: 0,
  holders: 0,
  emissions: 0,
  stake: 0,
  githubActivity: {},
  ethosScore: 0,
  kaitoScore: 0,
  lastUpdated: new Date().toISOString()
}