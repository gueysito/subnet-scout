// ScoreAgent.js - Core scoring logic for subnet evaluation
import { Anthropic } from "@anthropic-ai/sdk";

class ScoreAgent {
  constructor(claudeApiKey) {
    this.claude = new Anthropic({
      apiKey: claudeApiKey
    });
    
    // Scoring weights (must sum to 100)
    this.weights = {
      yield: 40,      // 40% - Most important for investors
      activity: 30,   // 30% - Network health indicator  
      credibility: 30 // 30% - Validator reliability
    };
    
    // Score ranges for normalization
    this.ranges = {
      yield: { min: 0, max: 50, target: 25 }, // Adjusted for realistic yield ratios
      activity: { min: 0, max: 100, target: 80 },
      credibility: { min: 0, max: 100, target: 90 },
      validatorCount: { min: 10, max: 500, target: 200 }
    };
  }

  /**
   * Calculate comprehensive subnet score
   * @param {Object} metrics - Raw subnet metrics
   * @param {string} timeframe - Analysis timeframe ('24h', '7d', '30d')
   * @returns {Object} Complete scoring result
   */
  async calculateScore(subnetId, metrics, timeframe = '24h') {
    try {
      // Validate input metrics
      this.validateMetrics(metrics);
      
      // Calculate individual component scores
      const yieldScore = this.calculateYieldScore(metrics);
      const activityScore = this.calculateActivityScore(metrics);
      const credibilityScore = this.calculateCredibilityScore(metrics);
      
      // Calculate weighted overall score
      const overallScore = Math.round(
        (yieldScore * this.weights.yield + 
         activityScore * this.weights.activity + 
         credibilityScore * this.weights.credibility) / 100
      );
      
      // Calculate additional metrics
      const additionalMetrics = this.calculateAdditionalMetrics(metrics);
      
      // Generate AI-powered summary
      const aiSummary = await this.generateAISummary(subnetId, {
        overall: overallScore,
        yield: yieldScore,
        activity: activityScore,
        credibility: credibilityScore,
        metrics: additionalMetrics
      });
      
      // Determine risk level
      const riskLevel = this.determineRiskLevel(overallScore, metrics);
      
      return {
        subnet_id: subnetId,
        overall_score: overallScore,
        breakdown: {
          yield_score: yieldScore,
          activity_score: activityScore,
          credibility_score: credibilityScore
        },
        weights: this.weights,
        metrics: {
          current_yield: additionalMetrics.currentYield,
          yield_change_24h: additionalMetrics.yieldChange24h,
          activity_level: this.getActivityLevel(activityScore),
          risk_level: riskLevel,
          validator_efficiency: additionalMetrics.validatorEfficiency,
          network_participation: additionalMetrics.networkParticipation
        },
        ai_summary: aiSummary,
        timestamp: new Date().toISOString(),
        timeframe,
        calculation_details: {
          yield_calculation: this.getYieldCalculationDetails(metrics),
          activity_calculation: this.getActivityCalculationDetails(metrics),
          credibility_calculation: this.getCredibilityCalculationDetails(metrics)
        }
      };
      
    } catch (error) {
      console.error('Score calculation error:', error);
      throw new Error(`Failed to calculate score for subnet ${subnetId}: ${error.message}`);
    }
  }

  /**
   * Validate required metrics are present and valid
   */
  validateMetrics(metrics) {
    const required = ['emission_rate', 'total_stake', 'validator_count', 'activity_score'];
    const missing = required.filter(field => !(field in metrics) || metrics[field] == null);
    
    if (missing.length > 0) {
      throw new Error(`Missing required metrics: ${missing.join(', ')}`);
    }
    
    // Validate numeric values
    const numeric = ['emission_rate', 'total_stake', 'validator_count', 'activity_score'];
    for (const field of numeric) {
      if (typeof metrics[field] !== 'number' || metrics[field] < 0) {
        throw new Error(`Invalid ${field}: must be a positive number`);
      }
    }
  }

  /**
   * Calculate yield score (0-100) based on emission rate and stake
   */
  calculateYieldScore(metrics) {
    const { emission_rate, total_stake } = metrics;
    
    // Calculate daily yield as percentage of total stake
    // Using more realistic Bittensor parameters: ~12 second blocks, emission per block
    const dailyBlocks = 7200; // Approximately 12 second blocks
    const dailyEmission = emission_rate * dailyBlocks;
    const dailyYieldRatio = total_stake > 0 ? (dailyEmission / total_stake) : 0;
    
    // Convert to annual percentage (more standard metric)
    const annualYieldPercentage = dailyYieldRatio * 365 * 100;
    
    // Normalize to 0-100 scale with realistic Bittensor yield expectations (5-25% APY)
    const minYield = 0;
    const maxYield = 30; // 30% APY is very high for Bittensor
    const targetYield = 15; // 15% APY is good
    
    if (annualYieldPercentage <= minYield) return 0;
    if (annualYieldPercentage >= maxYield) return 100;
    
    // Linear scoring with bonus for target range
    let score = (annualYieldPercentage / maxYield) * 100;
    
    // Bonus points for being in optimal range (10-20% APY)
    if (annualYieldPercentage >= 10 && annualYieldPercentage <= 20) {
      score = Math.min(100, score * 1.1); // 10% bonus
    }
    
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Calculate activity score based on network participation metrics
   */
  calculateActivityScore(metrics) {
    const { activity_score, validator_count } = metrics;
    
    // Base activity score (60% weight)
    const baseScore = Math.min(100, Math.max(0, activity_score));
    
    // Validator participation bonus (40% weight)
    const { min, max, target } = this.ranges.validatorCount;
    const validatorNormalized = Math.min(1, Math.max(0, (validator_count - min) / (target - min)));
    const validatorBonus = validatorNormalized * 100;
    
    // Weighted combination
    const combinedScore = (baseScore * 0.6) + (validatorBonus * 0.4);
    
    return Math.round(combinedScore);
  }

  /**
   * Calculate credibility score based on validator quality and network stability
   */
  calculateCredibilityScore(metrics) {
    const { validator_count, total_stake, emission_rate } = metrics;
    
    // Validator count score (higher is better, but with diminishing returns)
    const validatorScore = Math.min(100, (validator_count / this.ranges.validatorCount.target) * 100);
    
    // Stake distribution score (higher total stake = more credible)
    const avgStakePerValidator = total_stake / validator_count;
    const stakeScore = Math.min(100, Math.log10(avgStakePerValidator) * 20);
    
    // Network consistency score (stable emission rate is good)
    const emissionConsistency = emission_rate > 0 ? Math.min(100, emission_rate / 10) : 50;
    
    // Weighted combination
    const credibilityScore = (validatorScore * 0.4) + (stakeScore * 0.4) + (emissionConsistency * 0.2);
    
    return Math.round(Math.max(0, Math.min(100, credibilityScore)));
  }

  /**
   * Calculate additional metrics for detailed analysis
   */
  calculateAdditionalMetrics(metrics) {
    const { emission_rate, total_stake, validator_count, price_history = [] } = metrics;
    
    // Current yield calculation (as annual percentage)
    const dailyEmission = emission_rate * 7200;
    const dailyYieldRatio = total_stake > 0 ? (dailyEmission / total_stake) : 0;
    const currentYield = dailyYieldRatio * 365 * 100;
    
    // Yield change (if price history available)
    let yieldChange24h = 0;
    if (price_history.length >= 2) {
      const currentPrice = parseFloat(price_history[price_history.length - 1]);
      const previousPrice = parseFloat(price_history[0]);
      yieldChange24h = ((currentPrice - previousPrice) / previousPrice) * 100;
    }
    
    // Validator efficiency
    const validatorEfficiency = total_stake > 0 ? (emission_rate / total_stake) * 1000 : 0;
    
    // Network participation percentage
    const networkParticipation = Math.min(100, (validator_count / 500) * 100);
    
    return {
      currentYield: Math.round(currentYield * 100) / 100,
      yieldChange24h: Math.round(yieldChange24h * 100) / 100,
      validatorEfficiency: Math.round(validatorEfficiency * 100) / 100,
      networkParticipation: Math.round(networkParticipation)
    };
  }

  /**
   * Generate AI-powered summary using Claude
   */
  async generateAISummary(subnetId, scores) {
    try {
      const prompt = `Analyze this Bittensor subnet performance data and provide a concise 2-3 sentence summary:

Subnet ID: ${subnetId}
Overall Score: ${scores.overall}/100
Yield Score: ${scores.yield}/100  
Activity Score: ${scores.activity}/100
Credibility Score: ${scores.credibility}/100

Current Yield: ${scores.metrics.currentYield}%
Validator Efficiency: ${scores.metrics.validatorEfficiency}
Network Participation: ${scores.metrics.networkParticipation}%

Focus on:
1. Overall performance assessment
2. Key strengths or concerns
3. Investment/monitoring recommendation

Keep it professional and actionable for subnet validators and investors.`;

      const response = await this.claude.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }]
      });

      return response.content?.[0]?.text || `Subnet ${subnetId} shows ${scores.overall > 80 ? 'strong' : scores.overall > 60 ? 'moderate' : 'concerning'} performance with current metrics indicating ${scores.yield > 70 ? 'competitive' : 'below-average'} yields.`;
      
    } catch (error) {
      console.error('AI summary generation failed:', error);
      // Fallback to rule-based summary
      return this.generateFallbackSummary(subnetId, scores);
    }
  }

  /**
   * Generate fallback summary when AI is unavailable
   */
  generateFallbackSummary(subnetId, scores) {
    const performance = scores.overall > 80 ? 'excellent' : scores.overall > 60 ? 'good' : 'concerning';
    const trend = scores.yield > 70 ? 'strong yields' : 'moderate returns';
    const recommendation = scores.overall > 70 ? 'recommended for monitoring' : 'requires careful evaluation';
    
    return `Subnet ${subnetId} demonstrates ${performance} performance with ${trend}. Network shows ${scores.activity > 70 ? 'high' : 'moderate'} activity levels and is ${recommendation}.`;
  }

  /**
   * Determine risk level based on overall score and metrics
   */
  determineRiskLevel(overallScore, metrics) {
    if (overallScore >= 80 && metrics.validator_count >= 100) return 'low';
    if (overallScore >= 60 && metrics.validator_count >= 50) return 'medium';
    return 'high';
  }

  /**
   * Get activity level description
   */
  getActivityLevel(activityScore) {
    if (activityScore >= 80) return 'high';
    if (activityScore >= 60) return 'medium';
    return 'low';
  }

  /**
   * Get detailed calculation information for transparency
   */
  getYieldCalculationDetails(metrics) {
    const dailyEmission = metrics.emission_rate * 7200;
    const annualEmission = dailyEmission * 365;
    return {
      daily_emission: dailyEmission,
      annual_emission: annualEmission,
      yield_percentage: metrics.total_stake > 0 ? (annualEmission / metrics.total_stake) * 100 : 0
    };
  }

  getActivityCalculationDetails(metrics) {
    return {
      base_activity: metrics.activity_score,
      validator_participation: metrics.validator_count,
      normalized_participation: Math.min(100, (metrics.validator_count / this.ranges.validatorCount.target) * 100)
    };
  }

  getCredibilityCalculationDetails(metrics) {
    const avgStake = metrics.total_stake / metrics.validator_count;
    return {
      validator_count: metrics.validator_count,
      average_stake_per_validator: avgStake,
      emission_consistency: metrics.emission_rate
    };
  }

  /**
   * Batch score calculation for multiple subnets
   */
  async calculateBatchScores(subnetMetrics, timeframe = '24h') {
    const results = [];
    const errors = [];

    for (const [subnetId, metrics] of Object.entries(subnetMetrics)) {
      try {
        const score = await this.calculateScore(parseInt(subnetId), metrics, timeframe);
        results.push(score);
      } catch (error) {
        errors.push({ subnet_id: subnetId, error: error.message });
      }
    }

    return { results, errors };
  }
}

export default ScoreAgent; 