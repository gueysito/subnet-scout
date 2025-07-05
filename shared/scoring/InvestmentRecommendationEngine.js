// InvestmentRecommendationEngine.js - AI-Powered Investment Recommendations for Bittensor Subnets
import IONetClient from './IONetClient.js';
import { getSubnetMetadata } from '../data/subnets.js';

class InvestmentRecommendationEngine {
  constructor(ionetApiKey) {
    this.ionetClient = ionetApiKey ? new IONetClient(ionetApiKey) : null;
    
    // Investment strategy parameters
    this.strategyConfig = {
      // Recommendation confidence thresholds
      confidence_thresholds: {
        high: 80,     // 80%+ for strong recommendations
        moderate: 65, // 65-79% for moderate recommendations  
        low: 50       // 50-64% for weak recommendations
      },
      
      // Investment factors and weights
      decision_factors: {
        forecasted_performance: 0.30,  // 30% - Expected future performance
        risk_assessment: 0.25,         // 25% - Risk levels and mitigation
        market_sentiment: 0.20,        // 20% - Market conditions and trends
        technical_fundamentals: 0.15,  // 15% - Code quality, security, governance
        competitive_position: 0.10     // 10% - Position vs other subnets
      },
      
      // Recommendation categories
      recommendation_types: {
        'STRONG_BUY': { score_min: 80, confidence_min: 80 },
        'BUY': { score_min: 65, confidence_min: 70 },
        'HOLD': { score_min: 40, confidence_min: 60 },
        'SELL': { score_min: 25, confidence_min: 70 },
        'STRONG_SELL': { score_min: 0, confidence_min: 80 }
      }
    };

    console.log('💰 Investment Recommendation Engine initialized with AI-powered analysis');
  }

  /**
   * Generate comprehensive investment recommendation for a subnet
   */
  async generateRecommendation(subnetId, forecastData, riskAssessment, anomalyDetection, marketContext = {}) {
    try {
      console.log(`💰 Generating investment recommendation for subnet ${subnetId}...`);

      const metadata = getSubnetMetadata(subnetId);
      const analysisContext = {
        subnet_id: subnetId,
        subnet_name: metadata.name,
        subnet_type: metadata.type,
        github_url: metadata.github,
        forecast_data: forecastData,
        risk_assessment: riskAssessment,
        anomaly_detection: anomalyDetection,
        market_context: marketContext,
        timestamp: new Date().toISOString()
      };

      // Analyze investment factors in parallel
      const [
        performanceScore,
        riskScore,
        marketScore,
        fundamentalsScore,
        competitiveScore
      ] = await Promise.all([
        this.analyzePerformanceForecast(analysisContext),
        this.analyzeRiskProfile(analysisContext),
        this.analyzeMarketConditions(analysisContext),
        this.analyzeFundamentals(analysisContext),
        this.analyzeCompetitivePosition(analysisContext)
      ]);

      // Calculate composite investment score
      const investmentScore = this.calculateInvestmentScore({
        performance: performanceScore,
        risk: riskScore,
        market: marketScore,
        fundamentals: fundamentalsScore,
        competitive: competitiveScore
      });

      // Generate recommendation with confidence level
      const recommendation = this.generateRecommendationType(investmentScore);
      
      // Calculate overall confidence
      const confidence = this.calculateRecommendationConfidence(analysisContext, investmentScore);

      // Generate AI-powered investment analysis
      const aiAnalysis = await this.generateInvestmentAnalysis(analysisContext, {
        investment_score: investmentScore,
        recommendation: recommendation,
        confidence: confidence,
        factor_scores: {
          performance: performanceScore,
          risk: riskScore,
          market: marketScore,
          fundamentals: fundamentalsScore,
          competitive: competitiveScore
        }
      });

      // Generate risk-adjusted recommendations for different strategies
      const strategyRecommendations = this.generateStrategyRecommendations(investmentScore, confidence, riskAssessment);

      const result = {
        subnet_id: subnetId,
        subnet_name: metadata.name,
        subnet_type: metadata.type,
        investment_recommendation: {
          recommendation: recommendation.type,
          confidence_level: confidence,
          investment_score: investmentScore.composite_score,
          recommendation_strength: recommendation.strength,
          price_target: this.calculatePriceTarget(analysisContext, investmentScore),
          time_horizon: this.determineTimeHorizon(investmentScore, riskAssessment)
        },
        analysis_breakdown: {
          factor_scores: {
            forecasted_performance: performanceScore,
            risk_assessment: riskScore,
            market_sentiment: marketScore,
            technical_fundamentals: fundamentalsScore,
            competitive_position: competitiveScore
          },
          weighted_contributions: investmentScore.weighted_scores,
          composite_score: investmentScore.composite_score
        },
        strategy_recommendations: strategyRecommendations,
        investment_thesis: aiAnalysis,
        risk_warnings: this.generateRiskWarnings(riskAssessment, anomalyDetection),
        market_timing: this.analyzeMarketTiming(analysisContext),
        recommendation_metadata: {
          timestamp: new Date().toISOString(),
          engine_version: '1.0.0',
          analysis_confidence: confidence,
          factors_analyzed: Object.keys(this.strategyConfig.decision_factors).length
        }
      };

      console.log(`✅ Investment recommendation complete: ${recommendation.type} (${confidence}% confidence)`);
      return result;

    } catch (error) {
      console.error(`❌ Investment recommendation failed for subnet ${subnetId}:`, error.message);
      throw new Error(`Investment recommendation failed: ${error.message}`);
    }
  }

  /**
   * Analyze forecasted performance factors
   */
  async analyzePerformanceForecast(context) {
    const { forecast_data } = context;
    
    if (!forecast_data?.forecast) {
      return { score: 50, confidence: 30, factors: ['No forecast data available'] };
    }

    const forecast = forecast_data.forecast;
    const factors = [];
    let score = 50; // Neutral base

    // Analyze yield trend
    const yields = forecast.daily_predictions.map(d => d.predicted_yield);
    const yieldTrend = this.calculateTrend(yields);
    if (yieldTrend > 0.05) { // 5% positive trend
      score += 15;
      factors.push('Positive yield trend');
    } else if (yieldTrend < -0.05) {
      score -= 15;
      factors.push('Negative yield trend');
    }

    // Analyze activity score trend
    const activities = forecast.daily_predictions.map(d => d.predicted_activity);
    const activityTrend = this.calculateTrend(activities);
    if (activityTrend > 0.03) {
      score += 10;
      factors.push('Increasing activity');
    } else if (activityTrend < -0.03) {
      score -= 10;
      factors.push('Declining activity');
    }

    // Analyze confidence in forecast
    const avgConfidence = forecast.daily_predictions.reduce((sum, d) => sum + d.confidence, 0) / forecast.daily_predictions.length;
    if (avgConfidence > 75) {
      score += 8;
      factors.push('High forecast confidence');
    } else if (avgConfidence < 60) {
      score -= 8;
      factors.push('Low forecast confidence');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      confidence: Math.min(95, avgConfidence),
      factors,
      metrics: {
        yield_trend: yieldTrend,
        activity_trend: activityTrend,
        forecast_confidence: avgConfidence
      }
    };
  }

  /**
   * Analyze risk profile factors
   */
  async analyzeRiskProfile(context) {
    const { risk_assessment } = context;
    
    if (!risk_assessment?.risk_assessment) {
      return { score: 50, confidence: 40, factors: ['No risk assessment available'] };
    }

    const riskData = risk_assessment.risk_assessment;
    const factors = [];
    let score = 50;

    // Composite risk score (lower risk = higher investment score)
    const compositeRisk = riskData.composite_risk.risk_score;
    if (compositeRisk <= 30) {
      score += 20;
      factors.push('Low overall risk');
    } else if (compositeRisk <= 50) {
      score += 10;
      factors.push('Moderate risk');
    } else if (compositeRisk >= 70) {
      score -= 20;
      factors.push('High risk profile');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      confidence: risk_assessment.assessment_metadata?.confidence_level || 75,
      factors,
      metrics: {
        composite_risk: compositeRisk
      }
    };
  }

  /**
   * Analyze market conditions and sentiment
   */
  async analyzeMarketConditions(context) {
    const { market_context, anomaly_detection } = context;
    
    const factors = [];
    let score = 50;

    // Market sentiment analysis
    if (market_context?.market_sentiment === 'bull') {
      score += 15;
      factors.push('Bullish market conditions');
    } else if (market_context?.market_sentiment === 'bear') {
      score -= 15;
      factors.push('Bearish market conditions');
    }

    // Anomaly impact on market confidence
    if (anomaly_detection?.detection_summary) {
      const anomalyScore = anomaly_detection.detection_summary.anomaly_score;
      if (anomalyScore >= 70) {
        score -= 15;
        factors.push('High anomaly activity affects market confidence');
      } else if (anomalyScore <= 20) {
        score += 8;
        factors.push('Stable performance patterns');
      }
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      confidence: 70,
      factors,
      metrics: {
        market_sentiment: market_context?.market_sentiment,
        anomaly_impact: anomaly_detection?.detection_summary?.anomaly_score || 0
      }
    };
  }

  /**
   * Analyze technical fundamentals
   */
  async analyzeFundamentals(context) {
    const { subnet_type, github_url } = context;
    
    const factors = [];
    let score = 50;

    // Subnet type fundamentals
    const typeScores = {
      'inference': 75,  
      'training': 70,   
      'data': 80,       
      'storage': 85,    
      'compute': 72     
    };
    
    const typeScore = typeScores[subnet_type] || 65;
    score = (score + typeScore) / 2;
    
    if (typeScore >= 80) factors.push('Strong subnet category');
    else if (typeScore <= 65) factors.push('Challenging subnet category');

    // Code quality indicators
    if (github_url) {
      score += 10;
      factors.push('Open source transparency');
    } else {
      score -= 8;
      factors.push('Limited code transparency');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      confidence: 80,
      factors,
      metrics: {
        subnet_type_score: typeScore,
        has_github: !!github_url
      }
    };
  }

  /**
   * Analyze competitive position
   */
  async analyzeCompetitivePosition(context) {
    const { subnet_id, subnet_type, forecast_data } = context;
    
    const factors = [];
    let score = 50;

    // Market position based on subnet ID
    if (subnet_id <= 10) {
      score += 20;
      factors.push('Early mover advantage');
    } else if (subnet_id <= 30) {
      score += 10;
      factors.push('Established market position');
    } else if (subnet_id >= 80) {
      score -= 8;
      factors.push('Late market entry');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      confidence: 75,
      factors,
      metrics: {
        market_position_rank: subnet_id
      }
    };
  }

  /**
   * Calculate composite investment score
   */
  calculateInvestmentScore(factorScores) {
    const weights = this.strategyConfig.decision_factors;
    
    const weightedScores = {
      performance: factorScores.performance.score * weights.forecasted_performance,
      risk: factorScores.risk.score * weights.risk_assessment,
      market: factorScores.market.score * weights.market_sentiment,
      fundamentals: factorScores.fundamentals.score * weights.technical_fundamentals,
      competitive: factorScores.competitive.score * weights.competitive_position
    };

    const compositeScore = Math.round(
      Object.values(weightedScores).reduce((sum, score) => sum + score, 0)
    );

    return {
      composite_score: compositeScore,
      weighted_scores: weightedScores
    };
  }

  /**
   * Generate recommendation type based on investment score
   */
  generateRecommendationType(investmentScore) {
    const score = investmentScore.composite_score;
    const types = this.strategyConfig.recommendation_types;

    if (score >= types.STRONG_BUY.score_min) {
      return { type: 'STRONG_BUY', strength: 'Very High', numeric: 5 };
    } else if (score >= types.BUY.score_min) {
      return { type: 'BUY', strength: 'High', numeric: 4 };
    } else if (score >= types.HOLD.score_min) {
      return { type: 'HOLD', strength: 'Moderate', numeric: 3 };
    } else if (score >= types.SELL.score_min) {
      return { type: 'SELL', strength: 'High', numeric: 2 };
    } else {
      return { type: 'STRONG_SELL', strength: 'Very High', numeric: 1 };
    }
  }

  /**
   * Calculate overall recommendation confidence
   */
  calculateRecommendationConfidence(context, investmentScore) {
    let confidence = 75; // Base confidence

    // Increase confidence for extreme scores
    const score = investmentScore.composite_score;
    if (score >= 80 || score <= 20) {
      confidence += 10;
    } else if (score >= 60 || score <= 40) {
      confidence += 5;
    }

    // Adjust based on data quality
    if (context.forecast_data?.forecast) {
      confidence += 8;
    } else {
      confidence -= 12;
    }

    return Math.max(50, Math.min(95, Math.round(confidence)));
  }

  /**
   * Generate strategy-specific recommendations
   */
  generateStrategyRecommendations(investmentScore, confidence, riskAssessment) {
    const strategies = {};
    const score = investmentScore.composite_score;
    const riskLevel = riskAssessment?.risk_assessment?.composite_risk?.risk_score || 50;

    // Conservative strategy
    if (riskLevel <= 40 && score >= 60) {
      strategies.conservative = { 
        recommendation: score >= 75 ? 'BUY' : 'HOLD',
        allocation: score >= 75 ? '15-25%' : '10-15%',
        rationale: 'Low risk with solid fundamentals'
      };
    } else {
      strategies.conservative = {
        recommendation: 'AVOID',
        allocation: '0%',
        rationale: 'Risk level too high for conservative strategy'
      };
    }

    // Balanced strategy  
    if (score >= 70) {
      strategies.balanced = {
        recommendation: 'BUY',
        allocation: '20-30%',
        rationale: 'Good risk-reward balance'
      };
    } else if (score >= 45) {
      strategies.balanced = {
        recommendation: 'HOLD',
        allocation: '10-20%',
        rationale: 'Moderate opportunity with manageable risk'
      };
    } else {
      strategies.balanced = {
        recommendation: 'REDUCE',
        allocation: '5-10%',
        rationale: 'Below-average prospects'
      };
    }

    // Aggressive strategy
    if (score >= 65) {
      strategies.aggressive = {
        recommendation: score >= 80 ? 'STRONG_BUY' : 'BUY',
        allocation: score >= 80 ? '25-40%' : '15-25%',
        rationale: 'High growth potential despite elevated risk'
      };
    } else {
      strategies.aggressive = {
        recommendation: 'SPECULATIVE_HOLD',
        allocation: '5-15%',
        rationale: 'Speculative opportunity with high volatility'
      };
    }

    return strategies;
  }

  /**
   * Calculate price target based on analysis
   */
  calculatePriceTarget(context, investmentScore) {
    const score = investmentScore.composite_score;
    const currentPrice = context.forecast_data?.current_metrics?.token_price || 1.0;
    
    // Price target based on investment score
    let targetMultiplier;
    if (score >= 80) targetMultiplier = 1.3; // 30% upside
    else if (score >= 65) targetMultiplier = 1.15; // 15% upside
    else if (score >= 55) targetMultiplier = 1.05; // 5% upside
    else if (score >= 45) targetMultiplier = 0.95; // 5% downside
    else targetMultiplier = 0.85; // 15% downside

    return {
      target_price: +(currentPrice * targetMultiplier).toFixed(4),
      current_price: currentPrice,
      implied_return: +((targetMultiplier - 1) * 100).toFixed(1),
      time_horizon: '6-12 months'
    };
  }

  /**
   * Determine investment time horizon
   */
  determineTimeHorizon(investmentScore, riskAssessment) {
    const score = investmentScore.composite_score;
    const riskLevel = riskAssessment?.risk_assessment?.composite_risk?.risk_score || 50;

    if (score >= 75 && riskLevel <= 40) {
      return { period: 'Long-term', duration: '12-24 months', rationale: 'Strong fundamentals support extended holding' };
    } else if (score >= 60 && riskLevel <= 60) {
      return { period: 'Medium-term', duration: '6-12 months', rationale: 'Solid opportunity with moderate timeline' };
    } else {
      return { period: 'Short-term', duration: '3-6 months', rationale: 'Limited visibility requires shorter horizon' };
    }
  }

  /**
   * Generate risk warnings
   */
  generateRiskWarnings(riskAssessment, anomalyDetection) {
    const warnings = [];

    if (riskAssessment?.risk_assessment?.composite_risk?.risk_score >= 70) {
      warnings.push({
        type: 'HIGH_RISK',
        severity: 'high',
        message: 'High overall risk profile - consider position sizing carefully'
      });
    }

    if (anomalyDetection?.detection_summary?.anomaly_score >= 60) {
      warnings.push({
        type: 'ANOMALY_DETECTED',
        severity: 'moderate',
        message: 'Unusual activity patterns detected - monitor closely'
      });
    }

    return warnings;
  }

  /**
   * Analyze market timing factors
   */
  analyzeMarketTiming(context) {
    const { market_context } = context;
    
    let timing = 'NEUTRAL';
    let score = 0;
    const factors = [];

    if (market_context?.market_sentiment === 'bull') {
      score += 2;
      factors.push('Bullish market supports entry');
      timing = 'FAVORABLE';
    } else if (market_context?.market_sentiment === 'bear') {
      score -= 2;
      factors.push('Bearish market suggests caution');
      timing = 'UNFAVORABLE';
    }

    return {
      timing,
      score,
      factors,
      recommendation: score >= 1 ? 'Consider entry' : score <= -1 ? 'Wait for better entry' : 'Timing neutral'
    };
  }

  /**
   * Generate AI-powered investment analysis
   */
  async generateInvestmentAnalysis(context, analysisData) {
    if (!this.ionetClient) {
      return this.generateFallbackInvestmentAnalysis(context, analysisData);
    }

    try {
      const prompt = `Provide investment analysis for Bittensor subnet ${context.subnet_id} (${context.subnet_name}):

**Investment Summary:**
- Recommendation: ${analysisData.recommendation.type}
- Confidence: ${analysisData.confidence}%
- Investment Score: ${analysisData.investment_score.composite_score}/100

Provide concise analysis including:
1. **Investment Thesis** (why invest/not invest)
2. **Key Value Drivers** (what drives returns) 
3. **Primary Risks** (main concerns)
4. **Entry Strategy** (timing and approach)

Focus on actionable insights for crypto investors.`;

      const response = await this.ionetClient.makeInferenceRequest(
        this.ionetClient.models.analysis,
        [
          { role: 'system', content: 'You are a cryptocurrency investment analyst specializing in DeFi protocols and blockchain infrastructure investments.' },
          { role: 'user', content: prompt }
        ],
        { temperature: 0.3, maxTokens: 400 }
      );

      return {
        investment_thesis: response.content,
        model_used: response.model,
        analysis_type: 'ai_powered',
        token_usage: response.usage
      };

    } catch (error) {
      console.warn('⚠️ AI investment analysis failed, using fallback:', error.message);
      return this.generateFallbackInvestmentAnalysis(context, analysisData);
    }
  }

  /**
   * Generate fallback investment analysis
   */
  generateFallbackInvestmentAnalysis(context, analysisData) {
    const recommendation = analysisData.recommendation.type;
    const score = analysisData.investment_score.composite_score;
    
    let thesis;
    if (recommendation.includes('BUY')) {
      thesis = `${context.subnet_name} presents a compelling investment opportunity with strong fundamentals and favorable risk-reward profile. Score of ${score}/100 indicates solid upside potential.`;
    } else if (recommendation === 'HOLD') {
      thesis = `${context.subnet_name} shows mixed signals with moderate investment potential. Score of ${score}/100 suggests a balanced approach with careful monitoring.`;
    } else {
      thesis = `${context.subnet_name} faces significant challenges with limited investment appeal. Score of ${score}/100 indicates potential downside risks outweigh opportunities.`;
    }

    return {
      investment_thesis: thesis,
      model_used: 'fallback_rule_based',
      analysis_type: 'rule_based'
    };
  }

  /**
   * Helper methods
   */
  calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = n * (n + 1) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + val * (i + 1), 0);
    const sumXX = n * (n + 1) * (2 * n + 1) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope / (sumY / n); // Normalize by average value
  }
}

export default InvestmentRecommendationEngine; 