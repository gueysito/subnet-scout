/**
 * TypeScript Type Definitions for Subnet Scout
 * Provides type safety across the entire application
 */

// ============================================
// CORE SUBNET TYPES
// ============================================

export interface SubnetAgent {
  id: number;
  subnet_id: number;
  name?: string;
  description?: string;
  type?: string;
  github_url?: string;
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  yield?: number;
  activity?: number;
  credibility?: number;
  emission_rate?: number;
  total_stake?: number;
  validator_count?: number;
  yield_change_24h?: number;
  last_updated: string;
  validator_key?: string;
}

export interface SubnetMetrics {
  overall_score?: number;
  current_yield?: number;
  credibility_score?: number;
  activity_score?: number;
  emission_rate?: number;
  total_stake?: number;
  validator_count?: number;
  yield_change_24h?: number;
  activity_level?: string;
  status?: string;
  name?: string;
  description?: string;
}

export interface SubnetMetadata {
  name: string;
  description: string;
  type: string;
  github?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string[];
    timestamp: string;
  };
  timestamp?: string;
  cached?: boolean;
  response_time?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_count: number;
  };
}

export interface HealthResponse {
  overall_status: 'healthy' | 'warning' | 'critical';
  checks: Record<string, {
    status: 'up' | 'down' | 'degraded';
    response_time?: number;
    error?: string;
  }>;
  api_version: string;
  environment: string;
  timestamp: string;
}

// ============================================
// AI ANALYSIS TYPES
// ============================================

export interface AIAnalysisResult {
  analysis_type: 'forecast' | 'risk_assessment' | 'anomaly_detection' | 'investment_recommendation';
  confidence_level: number;
  model_used: string;
  generation_timestamp: string;
  subnet_id: number;
}

export interface ForecastResult extends AIAnalysisResult {
  analysis_type: 'forecast';
  forecast_horizon: string;
  predictions: {
    day_1: ForecastDay;
    day_7: ForecastDay;
    expected_return: number;
    risk_level: 'low' | 'medium' | 'high';
  };
  key_insights: string[];
  model_reasoning?: string;
}

export interface ForecastDay {
  date: string;
  predicted_yield: number;
  confidence: number;
  factors: string[];
}

export interface RiskAssessment extends AIAnalysisResult {
  analysis_type: 'risk_assessment';
  composite_risk: {
    risk_score: number;
    risk_level: 'low' | 'medium' | 'high';
  };
  technical_risk: {
    score: number;
    key_concerns: string[];
  };
  economic_risk: {
    score: number;
    key_concerns: string[];
  };
}

export interface AnomalyDetection extends AIAnalysisResult {
  analysis_type: 'anomaly_detection';
  detection_summary: {
    total_anomalies: number;
    anomaly_score: number;
    severity_distribution: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  alerts: AnomalyAlert[];
}

export interface AnomalyAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  description: string;
  metric_affected: string;
  detection_timestamp: string;
  confidence: number;
}

export interface InvestmentRecommendation extends AIAnalysisResult {
  analysis_type: 'investment_recommendation';
  investment_recommendation: {
    recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
    confidence_level: number;
    target_allocation?: number;
    time_horizon: string;
  };
  supporting_factors: string[];
  risk_factors: string[];
  expected_outcomes: {
    best_case: number;
    expected: number;
    worst_case: number;
  };
}

// ============================================
// EXTERNAL SERVICE TYPES
// ============================================

export interface GitHubStats {
  repository_url: string;
  commits_last_30_days: number;
  activity_score: number;
  contributor_count?: number;
  stargazers_count?: number;
  language?: string;
  last_commit_date?: string;
}

export interface MindshareData {
  username: string;
  attention_score: number;
  influence_score: number;
  engagement_score: number;
  sentiment_score: number;
  total_mentions: number;
  last_updated: string;
}

export interface ReputationScore {
  score: number;
  level: 'novice' | 'contributor' | 'expert' | 'leader' | 'legend';
  breakdown: {
    attention: number;
    influence: number;
    engagement: number;
    sentiment: number;
  };
}

export interface EthosProfile {
  userkey: string;
  score: number;
  reviews_count: number;
  positive_reviews: number;
  negative_reviews: number;
  trust_level: string;
  verification_status: boolean;
}

// ============================================
// UI COMPONENT PROPS
// ============================================

export interface SubnetCardProps {
  agent: SubnetAgent;
  onScoreClick?: (subnetId: number) => void;
}

export interface MindshareCardProps {
  username: string;
  compact?: boolean;
  showDetails?: boolean;
  className?: string;
}

export interface ReputationBadgeProps {
  username: string;
  size?: 'small' | 'medium' | 'large';
  showScore?: boolean;
  className?: string;
}

export interface DistributedMonitorProps {
  subnetCount?: number;
  workers?: number;
  mockMode?: boolean;
  onResultsUpdate?: (results: DistributedMonitorResults) => void;
}

// ============================================
// DISTRIBUTED MONITORING TYPES
// ============================================

export interface DistributedMonitorResults {
  successful: number;
  failed: number;
  totalSubnets: number;
  processingTime: number;
  throughput: number;
  results: SubnetMonitorResult[];
  competitive_advantage: {
    processing_time: number;
    traditional_time: number;
    speed_improvement: string;
    cost_savings: string;
    throughput: number;
  };
}

export interface SubnetMonitorResult {
  subnet_id: number;
  status: 'success' | 'failed';
  metrics?: SubnetMetrics;
  error?: string;
  processing_time: number;
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationResult<T = any> {
  isValid: boolean;
  errors: string[];
  sanitized: T;
}

export interface SecurityConfig {
  rate_limits: {
    general: number;
    compute_intensive: number;
  };
  cors_origins: string[];
  content_security_policy: Record<string, string[]>;
}

// ============================================
// CACHE AND PERFORMANCE TYPES
// ============================================

export interface CacheStats {
  hits: number;
  misses: number;
  hit_rate: number;
  memory_usage: number;
  operations_count: number;
}

export interface PerformanceMetrics {
  response_times: number[];
  average_response_time: number;
  p95_response_time: number;
  error_rate: number;
  requests_per_minute: number;
}

// ============================================
// ENVIRONMENT AND CONFIG TYPES
// ============================================

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  VITE_USE_MOCK_API: boolean;
  VITE_BACKEND_URL: string;
  API_RATE_LIMIT: number;
  COMPUTE_RATE_LIMIT: number;
}

export interface ServiceConfig {
  anthropic: {
    api_key: string;
    model: string;
    max_tokens: number;
  };
  ionet: {
    api_key: string;
    models: Record<string, string>;
    daily_quota: number;
  };
  github: {
    token: string;
    rate_limit: number;
  };
  telegram: {
    bot_token: string;
  };
}

// ============================================
// UTILITY TYPES
// ============================================

export type StatusType = 'healthy' | 'warning' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high';
export type RecommendationType = 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
export type AISeverity = 'critical' | 'high' | 'medium' | 'low';

export interface RequestMetadata {
  request_id: string;
  execution_time_ms: number;
  timestamp: string;
  api_version: string;
}

// ============================================
// EVENT TYPES
// ============================================

export interface SecurityEvent {
  type: 'rate_limit_exceeded' | 'suspicious_request' | 'authentication_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

export interface PerformanceEvent {
  type: 'slow_query' | 'high_memory_usage' | 'cache_miss';
  metric_value: number;
  threshold: number;
  timestamp: string;
  details?: Record<string, any>;
}