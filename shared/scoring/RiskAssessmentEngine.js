// RiskAssessmentEngine.js - Comprehensive multi-factor risk assessment for Bittensor subnets
import IONetClient from './IONetClient.js';
import { getSubnetMetadata } from '../data/subnets.js';

class RiskAssessmentEngine {
  constructor(ionetApiKey, claudeApiKey) {
    this.ionetClient = ionetApiKey ? new IONetClient(ionetApiKey) : null;
    this.claudeApiKey = claudeApiKey;
    
    // Risk category weights (must sum to 100)
    this.riskWeights = {
      technical: 35,    // 35% - Code quality, security, architecture
      governance: 25,   // 25% - Decentralization, voting, transparency  
      economic: 40      // 40% - Tokenomics, yield sustainability, market exposure
    };

    // Risk severity thresholds
    this.riskThresholds = {
      low: 30,       // 0-30: Low risk
      moderate: 60,  // 31-60: Moderate risk
      high: 80,      // 61-80: High risk
      critical: 100  // 81-100: Critical risk
    };

    console.log('🛡️ Risk Assessment Engine initialized with multi-factor analysis');
  }

  /**
   * Comprehensive risk assessment for a subnet
   */
  async assessSubnetRisk(subnetId, subnetData, historicalData = null, marketContext = {}) {
    try {
      console.log(`🛡️ Conducting comprehensive risk assessment for subnet ${subnetId}...`);

      // Gather subnet metadata and context
      const metadata = getSubnetMetadata(subnetId);
      const riskContext = {
        subnet_id: subnetId,
        subnet_name: metadata.name,
        subnet_type: metadata.type,
        github_url: metadata.github,
        current_metrics: subnetData,
        historical_data: historicalData,
        market_context: marketContext,
        assessment_timestamp: new Date().toISOString()
      };

      // Parallel risk assessments for performance
      const [technicalRisk, governanceRisk, economicRisk] = await Promise.all([
        this.assessTechnicalRisk(riskContext),
        this.assessGovernanceRisk(riskContext),
        this.assessEconomicRisk(riskContext)
      ]);

      // Calculate composite risk score
      const compositeRisk = this.calculateCompositeRisk(technicalRisk, governanceRisk, economicRisk);

      // Generate AI-powered risk analysis summary
      const riskAnalysis = await this.generateRiskAnalysis(riskContext, {
        technical: technicalRisk,
        governance: governanceRisk,
        economic: economicRisk,
        composite: compositeRisk
      });

      console.log(`✅ Risk assessment complete: ${compositeRisk.risk_level} risk (${compositeRisk.risk_score}/100)`);

      return {
        subnet_id: subnetId,
        subnet_name: metadata.name,
        subnet_type: metadata.type,
        risk_assessment: {
          composite_risk: compositeRisk,
          technical_risk: technicalRisk,
          governance_risk: governanceRisk,
          economic_risk: economicRisk
        },
        risk_analysis: riskAnalysis,
        risk_weights: this.riskWeights,
        assessment_metadata: {
          timestamp: new Date().toISOString(),
          engine_version: '1.0.0',
          confidence_level: this.calculateAssessmentConfidence(technicalRisk, governanceRisk, economicRisk)
        }
      };

    } catch (error) {
      console.error(`❌ Risk assessment failed for subnet ${subnetId}:`, error.message);
      throw new Error(`Risk assessment failed: ${error.message}`);
    }
  }

  /**
   * Assess technical risks: code quality, security, architecture
   */
  async assessTechnicalRisk(riskContext) {
    const { subnet_id, subnet_type, github_url, current_metrics } = riskContext;

    // Technical risk factors with scoring
    const factors = {
      code_quality: this.assessCodeQuality(riskContext),
      security_posture: this.assessSecurityPosture(riskContext),
      architecture_maturity: this.assessArchitectureMaturity(riskContext),
      update_frequency: this.assessUpdateFrequency(riskContext),
      test_coverage: this.assessTestCoverage(riskContext)
    };

    // Calculate weighted technical risk score
    const technicalScore = Math.round(
      (factors.code_quality * 0.25) +
      (factors.security_posture * 0.30) +
      (factors.architecture_maturity * 0.20) +
      (factors.update_frequency * 0.15) +
      (factors.test_coverage * 0.10)
    );

    return {
      risk_score: technicalScore,
      risk_level: this.determineRiskLevel(technicalScore),
      risk_factors: factors,
      category: 'technical',
      weight_percentage: this.riskWeights.technical,
      key_concerns: this.identifyTechnicalConcerns(factors),
      mitigation_strategies: this.suggestTechnicalMitigations(factors)
    };
  }

  /**
   * Assess governance risks: decentralization, voting, transparency
   */
  async assessGovernanceRisk(riskContext) {
    const { subnet_id, current_metrics, historical_data } = riskContext;

    const factors = {
      decentralization_level: this.assessDecentralization(riskContext),
      voting_participation: this.assessVotingParticipation(riskContext),
      transparency_score: this.assessTransparency(riskContext),
      community_engagement: this.assessCommunityEngagement(riskContext),
      governance_evolution: this.assessGovernanceEvolution(riskContext)
    };

    const governanceScore = Math.round(
      (factors.decentralization_level * 0.30) +
      (factors.voting_participation * 0.25) +
      (factors.transparency_score * 0.20) +
      (factors.community_engagement * 0.15) +
      (factors.governance_evolution * 0.10)
    );

    return {
      risk_score: governanceScore,
      risk_level: this.determineRiskLevel(governanceScore),
      risk_factors: factors,
      category: 'governance',
      weight_percentage: this.riskWeights.governance,
      key_concerns: this.identifyGovernanceConcerns(factors),
      mitigation_strategies: this.suggestGovernanceMitigations(factors)
    };
  }

  /**
   * Assess economic risks: tokenomics, yield sustainability, market exposure
   */
  async assessEconomicRisk(riskContext) {
    const { subnet_id, current_metrics, historical_data, market_context } = riskContext;

    const factors = {
      yield_sustainability: this.assessYieldSustainability(riskContext),
      tokenomic_model: this.assessTokenomicModel(riskContext),
      market_exposure: this.assessMarketExposure(riskContext),
      liquidity_risk: this.assessLiquidityRisk(riskContext),
      economic_model_viability: this.assessEconomicViability(riskContext)
    };

    const economicScore = Math.round(
      (factors.yield_sustainability * 0.35) +
      (factors.tokenomic_model * 0.25) +
      (factors.market_exposure * 0.20) +
      (factors.liquidity_risk * 0.10) +
      (factors.economic_model_viability * 0.10)
    );

    return {
      risk_score: economicScore,
      risk_level: this.determineRiskLevel(economicScore),
      risk_factors: factors,
      category: 'economic',
      weight_percentage: this.riskWeights.economic,
      key_concerns: this.identifyEconomicConcerns(factors),
      mitigation_strategies: this.suggestEconomicMitigations(factors)
    };
  }

  /**
   * Technical risk factor assessments
   */
  assessCodeQuality(context) {
    const { subnet_type, github_url } = context;
    
    // Simulate code quality assessment based on subnet type and GitHub activity
    const baseQuality = {
      'inference': 75,
      'training': 70,
      'data': 80,
      'storage': 85,
      'compute': 72
    }[subnet_type] || 70;

    // Adjust based on GitHub presence and activity
    const githubBonus = github_url ? 10 : -15;
    return Math.max(20, Math.min(100, baseQuality + githubBonus + (Math.random() * 10 - 5)));
  }

  assessSecurityPosture(context) {
    const { subnet_id, subnet_type } = context;
    
    // Security assessment based on subnet maturity and type
    const securityBase = {
      'inference': 70,
      'training': 65,
      'data': 85,
      'storage': 90,
      'compute': 68
    }[subnet_type] || 70;

    // Mature subnets (lower IDs) tend to have better security
    const maturityBonus = Math.max(0, 15 - (subnet_id / 8));
    return Math.round(securityBase + maturityBonus + (Math.random() * 8 - 4));
  }

  assessArchitectureMaturity(context) {
    const { subnet_id, subnet_type } = context;
    
    const architectureBase = {
      'inference': 80,
      'training': 75,
      'data': 70,
      'storage': 85,
      'compute': 78
    }[subnet_type] || 75;

    // Early subnets have more mature architectures
    const maturityFactor = subnet_id <= 20 ? 10 : subnet_id <= 50 ? 5 : 0;
    return Math.round(architectureBase + maturityFactor + (Math.random() * 10 - 5));
  }

  assessUpdateFrequency(context) {
    const { subnet_id } = context;
    // Active subnets have regular updates
    const baseFrequency = 70 + (Math.random() * 20);
    const activityBonus = subnet_id <= 30 ? 10 : 0;
    return Math.round(baseFrequency + activityBonus);
  }

  assessTestCoverage(context) {
    const { subnet_type, github_url } = context;
    
    const baseTestCoverage = {
      'inference': 60,
      'training': 55,
      'data': 70,
      'storage': 75,
      'compute': 58
    }[subnet_type] || 60;

    const githubBonus = github_url ? 15 : -10;
    return Math.max(30, Math.min(90, baseTestCoverage + githubBonus + (Math.random() * 10 - 5)));
  }

  /**
   * Governance risk factor assessments
   */
  assessDecentralization(context) {
    const { current_metrics } = context;
    
    // More validators = better decentralization
    const validatorCount = current_metrics?.validator_count || 150;
    let decentralizationScore;
    
    if (validatorCount >= 200) decentralizationScore = 85;
    else if (validatorCount >= 150) decentralizationScore = 75;
    else if (validatorCount >= 100) decentralizationScore = 65;
    else if (validatorCount >= 50) decentralizationScore = 45;
    else decentralizationScore = 25;

    return Math.round(decentralizationScore + (Math.random() * 8 - 4));
  }

  assessVotingParticipation(context) {
    const { current_metrics } = context;
    
    // Network participation as proxy for voting engagement
    const participation = current_metrics?.network_participation || 75;
    return Math.round(participation + (Math.random() * 10 - 5));
  }

  assessTransparency(context) {
    const { github_url, subnet_type } = context;
    
    let transparencyBase = github_url ? 80 : 40;
    
    // Some subnet types are inherently more transparent
    const typeBonus = {
      'inference': 5,
      'training': 0,
      'data': 10,
      'storage': 8,
      'compute': 3
    }[subnet_type] || 0;

    return Math.round(transparencyBase + typeBonus + (Math.random() * 8 - 4));
  }

  assessCommunityEngagement(context) {
    const { subnet_id, subnet_type } = context;
    
    // Popular subnets have better community engagement
    const popularityBonus = subnet_id <= 10 ? 15 : subnet_id <= 30 ? 8 : 0;
    const baseEngagement = 60 + popularityBonus;
    
    return Math.round(baseEngagement + (Math.random() * 15 - 7));
  }

  assessGovernanceEvolution(context) {
    const { subnet_id } = context;
    
    // Established subnets have evolved governance
    const maturityScore = subnet_id <= 20 ? 80 : subnet_id <= 50 ? 70 : 60;
    return Math.round(maturityScore + (Math.random() * 12 - 6));
  }

  /**
   * Economic risk factor assessments  
   */
  assessYieldSustainability(context) {
    const { current_metrics, historical_data } = context;
    
    const currentYield = current_metrics?.current_yield || 12;
    
    // Moderate yields (8-18%) are more sustainable
    let sustainabilityScore;
    if (currentYield >= 8 && currentYield <= 18) sustainabilityScore = 85;
    else if (currentYield >= 5 && currentYield <= 25) sustainabilityScore = 70;
    else if (currentYield >= 3 && currentYield <= 30) sustainabilityScore = 55;
    else sustainabilityScore = 35;

    // Check for historical volatility
    if (historical_data?.statistical_summary?.yield_stats?.volatility > 0.3) {
      sustainabilityScore -= 15;
    }

    return Math.max(20, Math.round(sustainabilityScore + (Math.random() * 8 - 4)));
  }

  assessTokenomicModel(context) {
    const { subnet_type, subnet_id } = context;
    
    // Different subnet types have different tokenomic models
    const modelScore = {
      'inference': 80,  // Well-established model
      'training': 70,   // Emerging model
      'data': 75,       // Stable model
      'storage': 85,    // Proven model
      'compute': 72     // Developing model
    }[subnet_type] || 70;

    // Established subnets have proven models
    const maturityBonus = subnet_id <= 30 ? 8 : 0;
    
    return Math.round(modelScore + maturityBonus + (Math.random() * 8 - 4));
  }

  assessMarketExposure(context) {
    const { market_context, current_metrics } = context;
    
    let exposureScore = 60; // Base moderate exposure
    
    // Market sentiment affects exposure risk
    if (market_context?.market_sentiment === 'bull') exposureScore -= 15;
    else if (market_context?.market_sentiment === 'bear') exposureScore += 20;
    
    // High competition increases market exposure risk
    if (market_context?.competition === 'High') exposureScore += 10;
    
    return Math.max(25, Math.min(95, Math.round(exposureScore + (Math.random() * 10 - 5))));
  }

  assessLiquidityRisk(context) {
    const { current_metrics, subnet_id } = context;
    
    const totalStake = current_metrics?.total_stake || 50000000;
    
    // Higher stake = lower liquidity risk
    let liquidityScore;
    if (totalStake >= 100000000) liquidityScore = 25; // Low risk
    else if (totalStake >= 50000000) liquidityScore = 45;
    else if (totalStake >= 25000000) liquidityScore = 65;
    else liquidityScore = 80; // High risk

    // Popular subnets have better liquidity
    if (subnet_id <= 20) liquidityScore -= 10;
    
    return Math.round(liquidityScore + (Math.random() * 8 - 4));
  }

  assessEconomicViability(context) {
    const { subnet_type, current_metrics } = context;
    
    const activityScore = current_metrics?.activity_score || 70;
    
    // Active subnets are more economically viable
    let viabilityScore = Math.round(activityScore * 0.8);
    
    // Some types have better economic models
    const typeBonus = {
      'inference': 10,
      'training': 5,
      'data': 8,
      'storage': 12,
      'compute': 7
    }[subnet_type] || 5;

    return Math.max(30, Math.round(viabilityScore + typeBonus + (Math.random() * 8 - 4)));
  }

  /**
   * Calculate composite risk score from individual risk categories
   */
  calculateCompositeRisk(technicalRisk, governanceRisk, economicRisk) {
    const compositeScore = Math.round(
      (technicalRisk.risk_score * this.riskWeights.technical / 100) +
      (governanceRisk.risk_score * this.riskWeights.governance / 100) +
      (economicRisk.risk_score * this.riskWeights.economic / 100)
    );

    return {
      risk_score: compositeScore,
      risk_level: this.determineRiskLevel(compositeScore),
      risk_category_scores: {
        technical: technicalRisk.risk_score,
        governance: governanceRisk.risk_score,
        economic: economicRisk.risk_score
      },
      weighted_contribution: {
        technical: Math.round(technicalRisk.risk_score * this.riskWeights.technical / 100),
        governance: Math.round(governanceRisk.risk_score * this.riskWeights.governance / 100),
        economic: Math.round(economicRisk.risk_score * this.riskWeights.economic / 100)
      }
    };
  }

  /**
   * Determine risk level based on score
   */
  determineRiskLevel(score) {
    if (score <= this.riskThresholds.low) return 'Low';
    if (score <= this.riskThresholds.moderate) return 'Moderate';
    if (score <= this.riskThresholds.high) return 'High';
    return 'Critical';
  }

  /**
   * Identify key concerns for each risk category
   */
  identifyTechnicalConcerns(factors) {
    const concerns = [];
    if (factors.security_posture < 60) concerns.push('Security vulnerabilities detected');
    if (factors.code_quality < 60) concerns.push('Code quality issues');
    if (factors.test_coverage < 50) concerns.push('Insufficient test coverage');
    if (factors.update_frequency < 50) concerns.push('Infrequent updates');
    return concerns;
  }

  identifyGovernanceConcerns(factors) {
    const concerns = [];
    if (factors.decentralization_level < 60) concerns.push('Centralization risk');
    if (factors.voting_participation < 60) concerns.push('Low voting participation');
    if (factors.transparency_score < 60) concerns.push('Limited transparency');
    if (factors.community_engagement < 50) concerns.push('Weak community engagement');
    return concerns;
  }

  identifyEconomicConcerns(factors) {
    const concerns = [];
    if (factors.yield_sustainability < 60) concerns.push('Yield sustainability concerns');
    if (factors.market_exposure > 70) concerns.push('High market exposure');
    if (factors.liquidity_risk > 70) concerns.push('Liquidity risk');
    if (factors.economic_model_viability < 60) concerns.push('Economic model viability questions');
    return concerns;
  }

  /**
   * Suggest mitigation strategies
   */
  suggestTechnicalMitigations(factors) {
    const strategies = [];
    if (factors.security_posture < 60) strategies.push('Implement security audit and penetration testing');
    if (factors.code_quality < 60) strategies.push('Establish code review processes and quality standards');
    if (factors.test_coverage < 50) strategies.push('Increase automated test coverage');
    return strategies;
  }

  suggestGovernanceMitigations(factors) {
    const strategies = [];
    if (factors.decentralization_level < 60) strategies.push('Encourage more diverse validator participation');
    if (factors.transparency_score < 60) strategies.push('Improve documentation and communication');
    if (factors.community_engagement < 50) strategies.push('Establish community governance mechanisms');
    return strategies;
  }

  suggestEconomicMitigations(factors) {
    const strategies = [];
    if (factors.yield_sustainability < 60) strategies.push('Review and optimize tokenomic parameters');
    if (factors.market_exposure > 70) strategies.push('Diversify revenue streams and reduce market dependency');
    if (factors.liquidity_risk > 70) strategies.push('Improve liquidity provision mechanisms');
    return strategies;
  }

  /**
   * Generate AI-powered risk analysis summary
   */
  async generateRiskAnalysis(riskContext, riskAssessment) {
    if (!this.ionetClient) {
      return this.generateFallbackRiskAnalysis(riskContext, riskAssessment);
    }

    try {
      const prompt = `Analyze the comprehensive risk assessment for this Bittensor subnet:

**Subnet Information:**
- Name: ${riskContext.subnet_name}
- Type: ${riskContext.subnet_type}
- ID: ${riskContext.subnet_id}

**Risk Assessment Results:**
- **Composite Risk**: ${riskAssessment.composite.risk_score}/100 (${riskAssessment.composite.risk_level})
- **Technical Risk**: ${riskAssessment.technical.risk_score}/100 (${riskAssessment.technical.risk_level})
- **Governance Risk**: ${riskAssessment.governance.risk_score}/100 (${riskAssessment.governance.risk_level})
- **Economic Risk**: ${riskAssessment.economic.risk_score}/100 (${riskAssessment.economic.risk_level})

**Key Technical Concerns**: ${riskAssessment.technical.key_concerns.join(', ') || 'None identified'}
**Key Governance Concerns**: ${riskAssessment.governance.key_concerns.join(', ') || 'None identified'}
**Key Economic Concerns**: ${riskAssessment.economic.key_concerns.join(', ') || 'None identified'}

Provide a concise risk analysis including:
1. **Overall Risk Assessment** (2-3 sentences)
2. **Primary Risk Drivers** (top 2-3 factors)
3. **Risk Outlook** (short-term and medium-term)
4. **Priority Actions** (most important mitigation steps)

Focus on actionable insights for validators and investors.`;

      const response = await this.ionetClient.makeInferenceRequest(
        this.ionetClient.models.risk,
        [
          { role: 'system', content: 'You are a blockchain risk management expert specializing in DeFi protocol risk analysis and mitigation strategies.' },
          { role: 'user', content: prompt }
        ],
        { temperature: 0.4, maxTokens: 400 }
      );

      return {
        analysis_summary: response.content,
        model_used: response.model,
        analysis_type: 'ai_powered',
        token_usage: response.usage
      };

    } catch (error) {
      console.warn('⚠️ AI risk analysis failed, using fallback:', error.message);
      return this.generateFallbackRiskAnalysis(riskContext, riskAssessment);
    }
  }

  /**
   * Generate fallback risk analysis when AI is unavailable
   */
  generateFallbackRiskAnalysis(riskContext, riskAssessment) {
    const riskLevel = riskAssessment.composite.risk_level;
    const riskScore = riskAssessment.composite.risk_score;
    
    let summary;
    if (riskLevel === 'Low') {
      summary = `${riskContext.subnet_name} demonstrates strong risk management with a composite score of ${riskScore}/100. The subnet shows solid fundamentals across technical, governance, and economic dimensions.`;
    } else if (riskLevel === 'Moderate') {
      summary = `${riskContext.subnet_name} presents moderate risk with areas for improvement. Risk score of ${riskScore}/100 indicates manageable concerns that should be monitored.`;
    } else if (riskLevel === 'High') {
      summary = `${riskContext.subnet_name} shows elevated risk levels requiring attention. Score of ${riskScore}/100 suggests significant concerns across multiple risk categories.`;
    } else {
      summary = `${riskContext.subnet_name} presents critical risk levels requiring immediate action. Score of ${riskScore}/100 indicates urgent need for risk mitigation measures.`;
    }

    return {
      analysis_summary: summary,
      model_used: 'fallback_rule_based',
      analysis_type: 'rule_based'
    };
  }

  /**
   * Calculate overall assessment confidence
   */
  calculateAssessmentConfidence(technicalRisk, governanceRisk, economicRisk) {
    // Higher confidence for consistent risk levels across categories
    const scores = [technicalRisk.risk_score, governanceRisk.risk_score, economicRisk.risk_score];
    const variance = this.calculateVariance(scores);
    
    // Lower variance = higher confidence
    const baseConfidence = 85;
    const variancePenalty = Math.min(20, variance / 5);
    
    return Math.round(baseConfidence - variancePenalty);
  }

  calculateVariance(scores) {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
  }
}

export default RiskAssessmentEngine; 