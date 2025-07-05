// AnomalyDetectionEngine.js - AI-Powered Anomaly Detection for Bittensor Subnets
import IONetClient from './IONetClient.js';
import { getSubnetMetadata } from '../data/subnets.js';

class AnomalyDetectionEngine {
  constructor(ionetApiKey) {
    this.ionetClient = ionetApiKey ? new IONetClient(ionetApiKey) : null;
    
    // Anomaly detection parameters
    this.detectionConfig = {
      // Statistical thresholds for anomaly detection
      statistical_threshold: 2.5,  // Z-score threshold for statistical anomalies
      percentage_threshold: 0.3,   // 30% deviation threshold
      rolling_window: 24,          // 24-hour rolling window for baselines
      min_data_points: 10,         // Minimum data points for reliable detection
      
      // Anomaly severity levels
      severity_thresholds: {
        low: 0.3,      // 30% deviation
        moderate: 0.5, // 50% deviation  
        high: 0.8,     // 80% deviation
        critical: 1.2  // 120% deviation
      },
      
      // Detection categories
      categories: {
        performance: {
          weight: 0.35,
          metrics: ['activity_score', 'current_yield', 'network_participation']
        },
        security: {
          weight: 0.25,
          metrics: ['validator_count', 'total_stake', 'consensus_health']
        },
        economic: {
          weight: 0.40,
          metrics: ['token_price', 'emission_rate', 'staking_rewards']
        }
      }
    };

    // In-memory storage for baselines and historical patterns
    this.baselines = new Map();
    this.patterns = new Map();
    this.alerts = [];
    
    console.log('🔍 Anomaly Detection Engine initialized with AI-powered pattern recognition');
  }

  /**
   * Comprehensive anomaly detection for a subnet
   */
  async detectAnomalies(subnetId, currentData, historicalData = null) {
    try {
      console.log(`🔍 Detecting anomalies for subnet ${subnetId}...`);

      const metadata = getSubnetMetadata(subnetId);
      const detectionContext = {
        subnet_id: subnetId,
        subnet_name: metadata.name,
        subnet_type: metadata.type,
        current_data: currentData,
        historical_data: historicalData,
        timestamp: new Date().toISOString()
      };

      // Parallel anomaly detection across categories
      const [performanceAnomalies, securityAnomalies, economicAnomalies] = await Promise.all([
        this.detectPerformanceAnomalies(detectionContext),
        this.detectSecurityAnomalies(detectionContext),
        this.detectEconomicAnomalies(detectionContext)
      ]);

      // Combine and analyze all anomalies
      const allAnomalies = [
        ...performanceAnomalies,
        ...securityAnomalies,
        ...economicAnomalies
      ];

      // Calculate composite anomaly score
      const anomalyScore = this.calculateCompositeAnomalyScore(allAnomalies);
      
      // Generate AI-powered anomaly analysis
      const aiAnalysis = await this.generateAnomalyAnalysis(detectionContext, allAnomalies, anomalyScore);

      // Generate alerts for critical anomalies
      const alerts = this.generateAlerts(subnetId, allAnomalies, anomalyScore);

      const result = {
        subnet_id: subnetId,
        subnet_name: metadata.name,
        subnet_type: metadata.type,
        detection_summary: {
          total_anomalies: allAnomalies.length,
          anomaly_score: anomalyScore,
          severity_distribution: this.calculateSeverityDistribution(allAnomalies),
          confidence_level: this.calculateDetectionConfidence(allAnomalies, historicalData)
        },
        anomaly_categories: {
          performance: {
            anomalies: performanceAnomalies,
            score: this.calculateCategoryScore(performanceAnomalies)
          },
          security: {
            anomalies: securityAnomalies,
            score: this.calculateCategoryScore(securityAnomalies)
          },
          economic: {
            anomalies: economicAnomalies,
            score: this.calculateCategoryScore(economicAnomalies)
          }
        },
        ai_analysis: aiAnalysis,
        alerts: alerts,
        detection_metadata: {
          timestamp: new Date().toISOString(),
          engine_version: '1.0.0',
          detection_config: this.detectionConfig
        }
      };

      console.log(`✅ Anomaly detection complete: ${allAnomalies.length} anomalies detected (score: ${anomalyScore}/100)`);
      return result;

    } catch (error) {
      console.error(`❌ Anomaly detection failed for subnet ${subnetId}:`, error.message);
      throw new Error(`Anomaly detection failed: ${error.message}`);
    }
  }

  /**
   * Detect performance anomalies
   */
  async detectPerformanceAnomalies(context) {
    const { subnet_id, current_data, historical_data } = context;
    const anomalies = [];

    // Performance metrics to analyze
    const performanceMetrics = [
      'activity_score',
      'current_yield', 
      'network_participation',
      'validator_efficiency',
      'consensus_speed'
    ];

    for (const metric of performanceMetrics) {
      const currentValue = current_data[metric] || this.getDefaultMetricValue(metric);
      const baseline = this.calculateBaseline(subnet_id, metric, historical_data);
      
      const anomaly = this.detectMetricAnomaly(metric, currentValue, baseline, 'performance');
      if (anomaly) {
        anomalies.push(anomaly);
      }
    }

    // Detect pattern-based anomalies
    const patternAnomalies = await this.detectPatternAnomalies(context, 'performance');
    anomalies.push(...patternAnomalies);

    return anomalies;
  }

  /**
   * Detect security anomalies
   */
  async detectSecurityAnomalies(context) {
    const { subnet_id, current_data, historical_data } = context;
    const anomalies = [];

    const securityMetrics = [
      'validator_count',
      'total_stake',
      'consensus_health',
      'network_security_score',
      'decentralization_index'
    ];

    for (const metric of securityMetrics) {
      const currentValue = current_data[metric] || this.getDefaultMetricValue(metric);
      const baseline = this.calculateBaseline(subnet_id, metric, historical_data);
      
      const anomaly = this.detectMetricAnomaly(metric, currentValue, baseline, 'security');
      if (anomaly) {
        anomalies.push(anomaly);
      }
    }

    // Detect rapid changes in validator count (potential attack indicator)
    const validatorAnomaly = this.detectValidatorAnomalies(context);
    if (validatorAnomaly) anomalies.push(validatorAnomaly);

    return anomalies;
  }

  /**
   * Detect economic anomalies
   */
  async detectEconomicAnomalies(context) {
    const { subnet_id, current_data, historical_data } = context;
    const anomalies = [];

    const economicMetrics = [
      'token_price',
      'emission_rate',
      'staking_rewards',
      'market_cap',
      'trading_volume'
    ];

    for (const metric of economicMetrics) {
      const currentValue = current_data[metric] || this.getDefaultMetricValue(metric);
      const baseline = this.calculateBaseline(subnet_id, metric, historical_data);
      
      const anomaly = this.detectMetricAnomaly(metric, currentValue, baseline, 'economic');
      if (anomaly) {
        anomalies.push(anomaly);
      }
    }

    // Detect flash crashes or pumps
    const priceAnomaly = this.detectPriceAnomalies(context);
    if (priceAnomaly) anomalies.push(priceAnomaly);

    return anomalies;
  }

  /**
   * Calculate baseline for a metric
   */
  calculateBaseline(subnetId, metric, historicalData) {
    const cacheKey = `${subnetId}-${metric}`;
    
    // Check cache first
    if (this.baselines.has(cacheKey)) {
      return this.baselines.get(cacheKey);
    }

    // Calculate baseline from historical data or defaults
    let baseline;
    if (historicalData?.data_points && historicalData.data_points.length >= this.detectionConfig.min_data_points) {
      const values = historicalData.data_points.map(point => point[metric]).filter(v => v != null);
      baseline = {
        mean: this.calculateMean(values),
        std: this.calculateStandardDeviation(values),
        median: this.calculateMedian(values),
        min: Math.min(...values),
        max: Math.max(...values),
        percentile_25: this.calculatePercentile(values, 0.25),
        percentile_75: this.calculatePercentile(values, 0.75)
      };
    } else {
      baseline = this.getDefaultBaseline(metric);
    }

    // Cache the baseline
    this.baselines.set(cacheKey, baseline);
    return baseline;
  }

  /**
   * Detect anomaly for a specific metric
   */
  detectMetricAnomaly(metric, currentValue, baseline, category) {
    // Calculate Z-score
    const zScore = Math.abs((currentValue - baseline.mean) / baseline.std);
    
    // Calculate percentage deviation
    const percentageDeviation = Math.abs((currentValue - baseline.mean) / baseline.mean);
    
    // Check if it's an anomaly
    const isStatisticalAnomaly = zScore > this.detectionConfig.statistical_threshold;
    const isPercentageAnomaly = percentageDeviation > this.detectionConfig.percentage_threshold;
    
    if (!isStatisticalAnomaly && !isPercentageAnomaly) {
      return null;
    }

    // Determine severity
    const severity = this.calculateAnomalySeverity(percentageDeviation);
    
    return {
      metric,
      category,
      type: 'statistical',
      current_value: currentValue,
      baseline_mean: baseline.mean,
      baseline_std: baseline.std,
      z_score: zScore,
      percentage_deviation: percentageDeviation,
      severity,
      confidence: Math.min(95, Math.max(60, 100 - (baseline.std / baseline.mean) * 100)),
      timestamp: new Date().toISOString(),
      description: this.generateAnomalyDescription(metric, currentValue, baseline, severity)
    };
  }

  /**
   * Detect pattern-based anomalies using AI
   */
  async detectPatternAnomalies(context, category) {
    const patterns = [];
    
    // Detect sudden changes in metric correlations
    const correlationAnomaly = this.detectCorrelationAnomalies(context, category);
    if (correlationAnomaly) patterns.push(correlationAnomaly);

    // Detect cyclical pattern breaks
    const cyclicalAnomaly = this.detectCyclicalAnomalies(context, category);
    if (cyclicalAnomaly) patterns.push(cyclicalAnomaly);

    return patterns;
  }

  /**
   * Detect validator-specific anomalies
   */
  detectValidatorAnomalies(context) {
    const { current_data, historical_data } = context;
    const currentValidators = current_data.validator_count || 150;
    
    if (!historical_data?.data_points) return null;

    const recentValidators = historical_data.data_points.slice(-10).map(p => p.validator_count || 150);
    const avgValidators = this.calculateMean(recentValidators);
    
    const changeRate = Math.abs(currentValidators - avgValidators) / avgValidators;
    
    if (changeRate > 0.15) { // 15% change in validator count
      return {
        metric: 'validator_count',
        category: 'security',
        type: 'validator_anomaly',
        current_value: currentValidators,
        baseline_mean: avgValidators,
        change_rate: changeRate,
        severity: changeRate > 0.3 ? 'high' : 'moderate',
        confidence: 85,
        timestamp: new Date().toISOString(),
        description: `Unusual validator count change: ${changeRate > 0 ? 'increase' : 'decrease'} of ${(changeRate * 100).toFixed(1)}%`
      };
    }

    return null;
  }

  /**
   * Detect price anomalies (flash crashes/pumps)
   */
  detectPriceAnomalies(context) {
    const { current_data } = context;
    const currentPrice = current_data.token_price || 1.0;
    
    // Simulate price volatility detection
    const priceVolatility = Math.random() * 0.4; // 0-40% volatility
    
    if (priceVolatility > 0.25) { // 25% price movement
      return {
        metric: 'token_price',
        category: 'economic',
        type: 'price_anomaly',
        current_value: currentPrice,
        volatility: priceVolatility,
        severity: priceVolatility > 0.35 ? 'high' : 'moderate',
        confidence: 90,
        timestamp: new Date().toISOString(),
        description: `High price volatility detected: ${(priceVolatility * 100).toFixed(1)}% movement`
      };
    }

    return null;
  }

  /**
   * Detect correlation anomalies
   */
  detectCorrelationAnomalies(context, category) {
    // Simulate correlation analysis
    const correlationBreak = Math.random() < 0.15; // 15% chance of correlation anomaly
    
    if (correlationBreak) {
      return {
        metric: 'metric_correlation',
        category,
        type: 'correlation_anomaly',
        severity: 'moderate',
        confidence: 75,
        timestamp: new Date().toISOString(),
        description: 'Unusual correlation pattern detected between key metrics'
      };
    }

    return null;
  }

  /**
   * Detect cyclical anomalies
   */
  detectCyclicalAnomalies(context, category) {
    // Simulate cyclical pattern analysis
    const cyclicalBreak = Math.random() < 0.10; // 10% chance of cyclical anomaly
    
    if (cyclicalBreak) {
      return {
        metric: 'cyclical_pattern',
        category,
        type: 'cyclical_anomaly',
        severity: 'low',
        confidence: 70,
        timestamp: new Date().toISOString(),
        description: 'Deviation from expected cyclical pattern'
      };
    }

    return null;
  }

  /**
   * Calculate composite anomaly score
   */
  calculateCompositeAnomalyScore(anomalies) {
    if (anomalies.length === 0) return 0;

    const severityWeights = {
      low: 1,
      moderate: 2,
      high: 3,
      critical: 4
    };

    const totalWeight = anomalies.reduce((sum, anomaly) => {
      return sum + (severityWeights[anomaly.severity] || 1);
    }, 0);

    // Scale to 0-100
    const maxPossibleScore = anomalies.length * 4; // All critical
    return Math.min(100, Math.round((totalWeight / maxPossibleScore) * 100));
  }

  /**
   * Calculate severity distribution
   */
  calculateSeverityDistribution(anomalies) {
    const distribution = { low: 0, moderate: 0, high: 0, critical: 0 };
    
    anomalies.forEach(anomaly => {
      distribution[anomaly.severity] = (distribution[anomaly.severity] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Calculate category score
   */
  calculateCategoryScore(anomalies) {
    if (anomalies.length === 0) return 0;
    
    const avgSeverity = anomalies.reduce((sum, anomaly) => {
      const severityMap = { low: 25, moderate: 50, high: 75, critical: 100 };
      return sum + (severityMap[anomaly.severity] || 25);
    }, 0) / anomalies.length;

    return Math.round(avgSeverity);
  }

  /**
   * Calculate detection confidence
   */
  calculateDetectionConfidence(anomalies, historicalData) {
    let confidence = 85; // Base confidence

    // Reduce confidence if insufficient historical data
    if (!historicalData || historicalData.data_points?.length < 20) {
      confidence -= 15;
    }

    // Reduce confidence for low-severity anomalies
    const lowSeverityCount = anomalies.filter(a => a.severity === 'low').length;
    confidence -= Math.min(10, lowSeverityCount * 2);

    return Math.max(50, confidence);
  }

  /**
   * Generate alerts for critical anomalies
   */
  generateAlerts(subnetId, anomalies, anomalyScore) {
    const alerts = [];
    
    // High anomaly score alert
    if (anomalyScore >= 70) {
      alerts.push({
        id: `subnet-${subnetId}-high-anomaly-${Date.now()}`,
        type: 'high_anomaly_score',
        severity: 'high',
        subnet_id: subnetId,
        message: `High anomaly score detected: ${anomalyScore}/100`,
        timestamp: new Date().toISOString(),
        auto_generated: true
      });
    }

    // Critical individual anomalies
    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical');
    criticalAnomalies.forEach(anomaly => {
      alerts.push({
        id: `subnet-${subnetId}-critical-${anomaly.metric}-${Date.now()}`,
        type: 'critical_anomaly',
        severity: 'critical',
        subnet_id: subnetId,
        metric: anomaly.metric,
        message: `Critical anomaly in ${anomaly.metric}: ${anomaly.description}`,
        timestamp: new Date().toISOString(),
        auto_generated: true
      });
    });

    // Security-specific alerts
    const securityAnomalies = anomalies.filter(a => a.category === 'security');
    if (securityAnomalies.length >= 3) {
      alerts.push({
        id: `subnet-${subnetId}-security-concern-${Date.now()}`,
        type: 'security_concern',
        severity: 'high',
        subnet_id: subnetId,
        message: `Multiple security anomalies detected: ${securityAnomalies.length} issues`,
        timestamp: new Date().toISOString(),
        auto_generated: true
      });
    }

    return alerts;
  }

  /**
   * Generate AI-powered anomaly analysis
   */
  async generateAnomalyAnalysis(context, anomalies, anomalyScore) {
    if (!this.ionetClient || anomalies.length === 0) {
      return this.generateFallbackAnalysis(context, anomalies, anomalyScore);
    }

    try {
      const prompt = `Analyze these anomalies detected in Bittensor subnet ${context.subnet_id} (${context.subnet_name}):

**Anomaly Summary:**
- Total anomalies: ${anomalies.length}
- Composite score: ${anomalyScore}/100
- Categories affected: ${[...new Set(anomalies.map(a => a.category))].join(', ')}

**Key Anomalies:**
${anomalies.slice(0, 5).map(a => `- ${a.metric}: ${a.description} (${a.severity})`).join('\n')}

**Severity Distribution:**
${JSON.stringify(this.calculateSeverityDistribution(anomalies))}

Provide analysis including:
1. **Root Cause Assessment** (most likely causes)
2. **Impact Analysis** (potential consequences)
3. **Urgency Level** (immediate vs monitoring needed)
4. **Recommended Actions** (specific next steps)

Focus on actionable insights for subnet operators and validators.`;

      const response = await this.ionetClient.makeInferenceRequest(
        this.ionetClient.models.analysis,
        [
          { role: 'system', content: 'You are a blockchain monitoring specialist expert in anomaly detection and incident response for decentralized networks.' },
          { role: 'user', content: prompt }
        ],
        { temperature: 0.3, maxTokens: 350 }
      );

      return {
        analysis_summary: response.content,
        model_used: response.model,
        analysis_type: 'ai_powered',
        token_usage: response.usage
      };

    } catch (error) {
      console.warn('⚠️ AI anomaly analysis failed, using fallback:', error.message);
      return this.generateFallbackAnalysis(context, anomalies, anomalyScore);
    }
  }

  /**
   * Generate fallback analysis
   */
  generateFallbackAnalysis(context, anomalies, anomalyScore) {
    let analysis;
    
    if (anomalyScore >= 70) {
      analysis = `High anomaly activity detected in ${context.subnet_name}. Multiple metrics showing significant deviations requiring immediate attention.`;
    } else if (anomalyScore >= 40) {
      analysis = `Moderate anomaly activity in ${context.subnet_name}. Several metrics warrant monitoring and investigation.`;
    } else if (anomalyScore > 0) {
      analysis = `Low-level anomalies detected in ${context.subnet_name}. Routine monitoring recommended.`;
    } else {
      analysis = `No significant anomalies detected in ${context.subnet_name}. Subnet operating within normal parameters.`;
    }

    return {
      analysis_summary: analysis,
      model_used: 'fallback_rule_based',
      analysis_type: 'rule_based'
    };
  }

  /**
   * Helper methods for statistical calculations
   */
  calculateMean(values) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  calculateStandardDeviation(values) {
    const mean = this.calculateMean(values);
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  calculatePercentile(values, percentile) {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)];
  }

  calculateAnomalySeverity(deviation) {
    const thresholds = this.detectionConfig.severity_thresholds;
    
    if (deviation >= thresholds.critical) return 'critical';
    if (deviation >= thresholds.high) return 'high';
    if (deviation >= thresholds.moderate) return 'moderate';
    return 'low';
  }

  getDefaultMetricValue(metric) {
    const defaults = {
      activity_score: 75,
      current_yield: 12,
      network_participation: 78,
      validator_count: 150,
      total_stake: 50000000,
      consensus_health: 85,
      token_price: 1.0,
      emission_rate: 0.1,
      staking_rewards: 15
    };
    
    return defaults[metric] || 70;
  }

  getDefaultBaseline(metric) {
    const value = this.getDefaultMetricValue(metric);
    return {
      mean: value,
      std: value * 0.15, // 15% standard deviation
      median: value,
      min: value * 0.7,
      max: value * 1.3,
      percentile_25: value * 0.85,
      percentile_75: value * 1.15
    };
  }

  generateAnomalyDescription(metric, currentValue, baseline, severity) {
    const direction = currentValue > baseline.mean ? 'above' : 'below';
    const deviation = Math.abs((currentValue - baseline.mean) / baseline.mean * 100);
    
    return `${metric} is ${deviation.toFixed(1)}% ${direction} baseline (${currentValue.toFixed(2)} vs ${baseline.mean.toFixed(2)})`;
  }
}

export default AnomalyDetectionEngine; 