// EnhancedScoreAgent.js - ScoreAgent with IO.net inference integration
import ScoreAgent from './ScoreAgent.js';
import IONetClient from './IONetClient.js';

class EnhancedScoreAgent extends ScoreAgent {
  constructor(claudeApiKey, ionetApiKey) {
    super(claudeApiKey);
    
    this.ionetClient = ionetApiKey ? new IONetClient(ionetApiKey) : null;
    this.enhancedFeatures = {
      marketSentiment: !!this.ionetClient,
      trendPrediction: !!this.ionetClient,
      riskRefinement: !!this.ionetClient,
      comparativeAnalysis: !!this.ionetClient
    };
    
    console.log(`🚀 Enhanced ScoreAgent initialized - IO.net features: ${this.ionetClient ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Calculate enhanced subnet score with IO.net analysis
   * @param {string|number} subnetId - Subnet identifier
   * @param {Object} metrics - Raw subnet metrics
   * @param {string} timeframe - Analysis timeframe
   * @param {Object} options - Enhancement options
   * @returns {Object} Enhanced scoring result with IO.net insights
   */
  async calculateEnhancedScore(subnetId, metrics, timeframe = '24h', options = {}) {
    try {
      // Start with base score calculation
      const baseScore = await this.calculateScore(subnetId, metrics, timeframe);
      
      if (!this.ionetClient) {
        console.log('📊 Returning base score - IO.net integration disabled');
        return baseScore;
      }

      console.log(`🤖 Enhancing score analysis with IO.net for subnet ${subnetId}`);
      
      // Enhanced analysis options
      const {
        includeMarketSentiment = true,
        includeTrendPrediction = true,
        includeRiskRefinement = true,
        historicalData = null,
        networkContext = {}
      } = options;

      // Parallel execution of enhanced analysis
      const enhancementPromises = [];
      
      if (includeMarketSentiment) {
        enhancementPromises.push(
          this.getEnhancedMarketSentiment(baseScore, historicalData)
            .catch(error => {
              console.warn('Market sentiment analysis failed:', error.message);
              return null;
            })
        );
      }
      
      if (includeTrendPrediction && historicalData) {
        enhancementPromises.push(
          this.getPerformanceTrends(baseScore, historicalData)
            .catch(error => {
              console.warn('Trend prediction failed:', error.message);
              return null;
            })
        );
      }
      
      if (includeRiskRefinement) {
        enhancementPromises.push(
          this.getRefinedRiskAssessment(baseScore, networkContext)
            .catch(error => {
              console.warn('Risk refinement failed:', error.message);
              return null;
            })
        );
      }

      // Wait for all enhancements to complete
      const [sentimentResult, trendsResult, riskResult] = await Promise.all(enhancementPromises);

      // Combine base score with enhanced analysis
      const enhancedScore = {
        ...baseScore,
        enhanced_analysis: {
          market_sentiment: sentimentResult,
          performance_trends: trendsResult,
          refined_risk_assessment: riskResult,
          enhancement_timestamp: new Date().toISOString(),
          ionet_models_used: this.getModelsUsed([sentimentResult, trendsResult, riskResult])
        },
        enhancement_status: {
          market_sentiment: !!sentimentResult,
          trend_prediction: !!trendsResult,
          risk_refinement: !!riskResult,
          enhancement_level: this.calculateEnhancementLevel(sentimentResult, trendsResult, riskResult)
        }
      };

      console.log(`✅ Enhanced analysis complete for subnet ${subnetId} - Level: ${enhancedScore.enhancement_status.enhancement_level}`);
      return enhancedScore;
      
    } catch (error) {
      console.error(`❌ Enhanced score calculation failed for subnet ${subnetId}:`, error.message);
      
      // Fallback to base score on error
      const baseScore = await this.calculateScore(subnetId, metrics, timeframe);
      return {
        ...baseScore,
        enhancement_error: error.message,
        enhancement_status: { error: true, fallback_to_base: true }
      };
    }
  }

  /**
   * Get enhanced market sentiment analysis using IO.net
   */
  async getEnhancedMarketSentiment(baseScoreData, historicalData = null) {
    if (!this.ionetClient) {
      throw new Error('IO.net client not available for sentiment analysis');
    }

    try {
      const sentimentResponse = await this.ionetClient.analyzeMarketSentiment(baseScoreData, historicalData);
      
      return {
        sentiment_analysis: sentimentResponse.content,
        confidence_level: this.extractConfidenceFromResponse(sentimentResponse.content),
        model_used: sentimentResponse.model,
        token_usage: sentimentResponse.usage,
        analysis_type: 'market_sentiment',
        reasoning: sentimentResponse.reasoning
      };
      
    } catch (error) {
      console.error('Market sentiment analysis failed:', error.message);
      throw error;
    }
  }

  /**
   * Get performance trend predictions using IO.net
   */
  async getPerformanceTrends(baseScoreData, historicalMetrics) {
    if (!this.ionetClient) {
      throw new Error('IO.net client not available for trend prediction');
    }

    try {
      const trendsResponse = await this.ionetClient.predictPerformanceTrends(baseScoreData, historicalMetrics);
      
      return {
        trend_prediction: trendsResponse.content,
        prediction_confidence: this.extractConfidenceFromResponse(trendsResponse.content),
        model_used: trendsResponse.model,
        token_usage: trendsResponse.usage,
        analysis_type: 'performance_trends',
        reasoning: trendsResponse.reasoning,
        prediction_timeframes: ['7d', '30d'] // Based on our prompt
      };
      
    } catch (error) {
      console.error('Performance trend prediction failed:', error.message);
      throw error;
    }
  }

  /**
   * Get refined risk assessment using IO.net
   */
  async getRefinedRiskAssessment(baseScoreData, networkContext = {}) {
    if (!this.ionetClient) {
      throw new Error('IO.net client not available for risk assessment');
    }

    try {
      const riskResponse = await this.ionetClient.refineRiskAssessment(baseScoreData, networkContext);
      
      return {
        risk_analysis: riskResponse.content,
        risk_score: this.extractRiskScoreFromResponse(riskResponse.content),
        model_used: riskResponse.model,
        token_usage: riskResponse.usage,
        analysis_type: 'refined_risk_assessment',
        risk_categories: ['technical', 'economic', 'operational', 'strategic']
      };
      
    } catch (error) {
      console.error('Risk assessment refinement failed:', error.message);
      throw error;
    }
  }

  /**
   * Compare multiple subnets using IO.net
   */
  async compareSubnetsEnhanced(targetSubnetData, comparisonSubnets, options = {}) {
    if (!this.ionetClient) {
      throw new Error('IO.net client not available for subnet comparison');
    }

    const { metrics = ['yield', 'activity', 'credibility'], includeRiskAnalysis = true } = options;

    try {
      const comparisonResponse = await this.ionetClient.compareSubnets(
        targetSubnetData, 
        comparisonSubnets, 
        metrics
      );
      
      return {
        comparison_analysis: comparisonResponse.content,
        ranking: this.extractRankingFromResponse(comparisonResponse.content),
        model_used: comparisonResponse.model,
        token_usage: comparisonResponse.usage,
        analysis_type: 'comparative_analysis',
        comparison_metrics: metrics,
        reasoning: comparisonResponse.reasoning,
        subnets_analyzed: comparisonSubnets.length + 1
      };
      
    } catch (error) {
      console.error('Enhanced subnet comparison failed:', error.message);
      throw error;
    }
  }

  /**
   * Batch enhanced scoring for multiple subnets
   */
  async calculateBatchEnhancedScores(subnetMetrics, options = {}) {
    const { 
      timeframe = '24h',
      enhancementOptions = {},
      maxConcurrent = 3 // Limit concurrent requests to respect rate limits
    } = options;

    const results = [];
    const errors = [];
    
    // Process in batches to avoid overwhelming the API
    const subnetEntries = Object.entries(subnetMetrics);
    
    for (let i = 0; i < subnetEntries.length; i += maxConcurrent) {
      const batch = subnetEntries.slice(i, i + maxConcurrent);
      
      const batchPromises = batch.map(async ([subnetId, metrics]) => {
        try {
          const enhancedScore = await this.calculateEnhancedScore(
            parseInt(subnetId), 
            metrics, 
            timeframe, 
            enhancementOptions
          );
          return { success: true, subnetId, result: enhancedScore };
        } catch (error) {
          return { success: false, subnetId, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach(result => {
        if (result.success) {
          results.push(result.result);
        } else {
          errors.push({ subnet_id: result.subnetId, error: result.error });
        }
      });

      // Brief pause between batches to respect rate limits
      if (i + maxConcurrent < subnetEntries.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`📊 Batch enhanced scoring complete: ${results.length} successes, ${errors.length} errors`);
    return { results, errors };
  }

  /**
   * Check IO.net health and model availability
   */
  async checkEnhancementHealth() {
    if (!this.ionetClient) {
      return {
        status: 'disabled',
        message: 'IO.net integration not configured',
        features: this.enhancedFeatures
      };
    }

    try {
      const modelHealth = await this.ionetClient.checkModelHealth();
      
      return {
        status: 'active',
        model_availability: modelHealth,
        features: this.enhancedFeatures,
        last_check: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        features: this.enhancedFeatures,
        last_check: new Date().toISOString()
      };
    }
  }

  // Utility methods for parsing IO.net responses

  extractConfidenceFromResponse(responseText) {
    // Look for confidence indicators in the response
    const confidenceRegex = /confidence:?\s*(\d+)%|(\d+)%\s*confidence/i;
    const match = responseText.match(confidenceRegex);
    return match ? parseInt(match[1] || match[2]) : null;
  }

  extractRiskScoreFromResponse(responseText) {
    // Look for risk rating (1-10) in the response
    const riskRegex = /risk\s*rating:?\s*(\d+)\/10|rating:?\s*(\d+)/i;
    const match = responseText.match(riskRegex);
    return match ? parseInt(match[1] || match[2]) : null;
  }

  extractRankingFromResponse(responseText) {
    // Extract subnet rankings from comparison response
    const rankingRegex = /ranking:?\s*(.+?)(?:\n\n|\n2\.|$)/is;
    const match = responseText.match(rankingRegex);
    return match ? match[1].trim() : null;
  }

  getModelsUsed(results) {
    return results
      .filter(result => result && result.model_used)
      .map(result => result.model_used)
      .filter((model, index, array) => array.indexOf(model) === index); // Remove duplicates
  }

  calculateEnhancementLevel(sentimentResult, trendsResult, riskResult) {
    let level = 0;
    if (sentimentResult) level++;
    if (trendsResult) level++;
    if (riskResult) level++;
    
    const levels = ['none', 'basic', 'standard', 'comprehensive'];
    return levels[level] || 'none';
  }

  /**
   * Get comprehensive analysis combining all enhancement features
   */
  async getComprehensiveAnalysis(subnetId, metrics, options = {}) {
    const {
      timeframe = '24h',
      includeComparison = false,
      comparisonSubnets = [],
      historicalData = null,
      networkContext = {}
    } = options;

    try {
      // Get enhanced score
      const enhancedScore = await this.calculateEnhancedScore(subnetId, metrics, timeframe, {
        includeMarketSentiment: true,
        includeTrendPrediction: !!historicalData,
        includeRiskRefinement: true,
        historicalData,
        networkContext
      });

      let comparisonAnalysis = null;
      if (includeComparison && comparisonSubnets.length > 0) {
        comparisonAnalysis = await this.compareSubnetsEnhanced(
          enhancedScore, 
          comparisonSubnets
        );
      }

      return {
        ...enhancedScore,
        comprehensive_analysis: {
          analysis_scope: 'comprehensive',
          includes_comparison: !!comparisonAnalysis,
          comparison_analysis: comparisonAnalysis,
          analysis_completeness: this.calculateAnalysisCompleteness(enhancedScore, comparisonAnalysis)
        }
      };

    } catch (error) {
      console.error(`Comprehensive analysis failed for subnet ${subnetId}:`, error.message);
      throw error;
    }
  }

  calculateAnalysisCompleteness(enhancedScore, comparisonAnalysis) {
    let completeness = 0;
    const maxScore = 5;

    if (enhancedScore.enhanced_analysis?.market_sentiment) completeness++;
    if (enhancedScore.enhanced_analysis?.performance_trends) completeness++;
    if (enhancedScore.enhanced_analysis?.refined_risk_assessment) completeness++;
    if (comparisonAnalysis) completeness++;
    if (enhancedScore.ai_summary) completeness++;

    return Math.round((completeness / maxScore) * 100);
  }
}

export default EnhancedScoreAgent; 