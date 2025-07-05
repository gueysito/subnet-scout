// historicalDataGenerator.js - Generate realistic historical data for forecasting
import { getSubnetMetadata } from '../data/subnets.js';

class HistoricalDataGenerator {
  constructor() {
    // Base performance patterns by subnet type
    this.typePatterns = {
      'inference': {
        volatility: 0.15,
        trendStrength: 0.3,
        seasonality: 0.1,
        baseYield: 12.5,
        baseActivity: 75
      },
      'training': {
        volatility: 0.25,
        trendStrength: 0.2,
        seasonality: 0.15,
        baseYield: 14.2,
        baseActivity: 65
      },
      'data': {
        volatility: 0.12,
        trendStrength: 0.4,
        seasonality: 0.08,
        baseYield: 11.8,
        baseActivity: 80
      },
      'storage': {
        volatility: 0.08,
        trendStrength: 0.5,
        seasonality: 0.05,
        baseYield: 10.5,
        baseActivity: 85
      },
      'compute': {
        volatility: 0.20,
        trendStrength: 0.25,
        seasonality: 0.12,
        baseYield: 13.1,
        baseActivity: 70
      }
    };

    // Market cycle patterns
    this.marketCycles = {
      'bull': { multiplier: 1.15, volatility: 0.9 },
      'bear': { multiplier: 0.85, volatility: 1.2 },
      'neutral': { multiplier: 1.0, volatility: 1.0 }
    };
  }

  /**
   * Generate 30-day historical time series for a subnet
   */
  generate30DayHistory(subnetId, currentMetrics = {}) {
    const metadata = getSubnetMetadata(subnetId);
    const pattern = this.typePatterns[metadata.type] || this.typePatterns['inference'];
    const marketCondition = this.determineMarketCondition();
    
    const timeSeries = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Current baseline metrics (or generate realistic ones)
    const currentScore = currentMetrics.overall_score || (70 + (subnetId % 20));
    const currentYield = currentMetrics.current_yield || pattern.baseYield + (subnetId % 5);
    const currentActivity = currentMetrics.activity_score || pattern.baseActivity + (subnetId % 15);

    // Generate day-by-day data
    for (let day = 0; day < 30; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + day);

      // Calculate progressive values leading to current state
      const progress = day / 29; // 0 to 1 over 30 days
      const baseScore = currentScore - (1 - progress) * 10; // Start 10 points lower
      const baseYield = currentYield - (1 - progress) * 2; // Start 2% lower
      const baseActivity = currentActivity - (1 - progress) * 8; // Start 8 points lower

      // Add realistic variations
      const dayData = this.generateDayMetrics(day, baseScore, baseYield, baseActivity, pattern, marketCondition);
      
      timeSeries.push({
        date: date.toISOString().split('T')[0],
        day_index: day,
        overall_score: Math.round(dayData.score),
        yield_percentage: parseFloat(dayData.yield.toFixed(2)),
        activity_score: Math.round(dayData.activity),
        validator_count: this.generateValidatorCount(subnetId, day),
        network_participation: parseFloat(dayData.participation.toFixed(1)),
        credibility_score: Math.round(dayData.credibility),
        daily_change: day > 0 ? parseFloat((dayData.score - timeSeries[day-1].overall_score).toFixed(1)) : 0
      });
    }

    return {
      subnet_id: subnetId,
      time_series: timeSeries,
      pattern_analysis: {
        subnet_type: metadata.type,
        volatility_index: pattern.volatility,
        trend_strength: pattern.trendStrength,
        market_condition: marketCondition,
        data_quality: 'synthetic_realistic',
        generation_timestamp: new Date().toISOString()
      },
      statistical_summary: this.calculateStatistics(timeSeries)
    };
  }

  /**
   * Generate realistic daily metrics with variations
   */
  generateDayMetrics(dayIndex, baseScore, baseYield, baseActivity, pattern, marketCondition) {
    // Trend component (gradual improvement over time)
    const trend = pattern.trendStrength * (dayIndex / 30) * 5; // Up to 5 points improvement

    // Seasonal component (weekly patterns)
    const seasonal = pattern.seasonality * Math.sin((dayIndex * 2 * Math.PI) / 7) * 3;

    // Random volatility
    const volatility = pattern.volatility * marketCondition.volatility;
    const randomVariation = (Math.random() - 0.5) * volatility * 8;

    // Weekend effect (lower activity on weekends)
    const weekendFactor = (dayIndex % 7 >= 5) ? 0.85 : 1.0;

    // Calculate metrics
    const score = Math.max(20, Math.min(100, baseScore + trend + seasonal + randomVariation));
    const yieldValue = Math.max(5, Math.min(25, baseYield + (trend * 0.3) + randomVariation * 0.5));
    const activity = Math.max(30, Math.min(100, baseActivity + trend + seasonal + randomVariation)) * weekendFactor;
    const participation = Math.max(60, Math.min(95, 75 + trend + randomVariation * 0.8));
    const credibility = Math.max(50, Math.min(100, 80 + trend * 0.5 + randomVariation * 0.3));

    return { score, yield: yieldValue, activity, participation, credibility };
  }

  /**
   * Generate realistic validator count progression
   */
  generateValidatorCount(subnetId, dayIndex) {
    const baseCount = 150 + (subnetId % 50);
    const growthRate = 0.02; // 2% growth over 30 days
    const dailyVariation = (Math.random() - 0.5) * 10;
    
    return Math.max(50, Math.round(baseCount * (1 + growthRate * dayIndex / 30) + dailyVariation));
  }

  /**
   * Determine market condition based on recent patterns
   */
  determineMarketCondition() {
    const random = Math.random();
    if (random < 0.3) return 'bull';
    if (random < 0.6) return 'neutral';
    return 'bear';
  }

  /**
   * Calculate statistical summary of time series
   */
  calculateStatistics(timeSeries) {
    const scores = timeSeries.map(d => d.overall_score);
    const yields = timeSeries.map(d => d.yield_percentage);
    const activities = timeSeries.map(d => d.activity_score);

    return {
      score_stats: this.calculateBasicStats(scores),
      yield_stats: this.calculateBasicStats(yields),
      activity_stats: this.calculateBasicStats(activities),
      trend_analysis: {
        score_trend: this.calculateTrend(scores),
        yield_trend: this.calculateTrend(yields),
        activity_trend: this.calculateTrend(activities)
      }
    };
  }

  /**
   * Calculate basic statistics for an array
   */
  calculateBasicStats(data) {
    const sorted = data.slice().sort((a, b) => a - b);
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    
    return {
      min: Math.min(...data),
      max: Math.max(...data),
      mean: parseFloat(mean.toFixed(2)),
      median: sorted[Math.floor(sorted.length / 2)],
      std_dev: parseFloat(Math.sqrt(variance).toFixed(2)),
      volatility: parseFloat((Math.sqrt(variance) / mean).toFixed(3))
    };
  }

  /**
   * Calculate linear trend (positive = improving, negative = declining)
   */
  calculateTrend(data) {
    const n = data.length;
    const x = Array.from({length: n}, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * data[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return {
      slope: parseFloat(slope.toFixed(4)),
      intercept: parseFloat(intercept.toFixed(2)),
      direction: slope > 0.1 ? 'improving' : slope < -0.1 ? 'declining' : 'stable'
    };
  }

  /**
   * Generate market context data for forecasting
   */
  generateMarketContext(subnetId) {
    const metadata = getSubnetMetadata(subnetId);
    const marketCondition = this.determineMarketCondition();
    
    return {
      network_health: this.generateNetworkHealth(),
      validator_trend: this.generateValidatorTrend(),
      tao_trend: this.generateTaoTrend(marketCondition),
      competition: this.generateCompetitionLevel(metadata.type),
      market_sentiment: marketCondition,
      sector_performance: this.generateSectorPerformance(metadata.type)
    };
  }

  generateNetworkHealth() {
    const health = ['Excellent', 'Good', 'Normal', 'Concerning'];
    return health[Math.floor(Math.random() * health.length)];
  }

  generateValidatorTrend() {
    const trends = ['Growing', 'Stable', 'Declining'];
    return trends[Math.floor(Math.random() * trends.length)];
  }

  generateTaoTrend(marketCondition) {
    const trendMap = {
      'bull': ['Bullish', 'Strongly Bullish'],
      'bear': ['Bearish', 'Strongly Bearish'],
      'neutral': ['Neutral', 'Slightly Bullish', 'Slightly Bearish']
    };
    const trends = trendMap[marketCondition];
    return trends[Math.floor(Math.random() * trends.length)];
  }

  generateCompetitionLevel(subnetType) {
    const competitionMap = {
      'inference': 'High',
      'training': 'Medium',
      'data': 'Low',
      'storage': 'Medium',
      'compute': 'High'
    };
    return competitionMap[subnetType] || 'Medium';
  }

  generateSectorPerformance(subnetType) {
    const performance = ['Outperforming', 'Market Average', 'Underperforming'];
    return performance[Math.floor(Math.random() * performance.length)];
  }
}

export default HistoricalDataGenerator; 