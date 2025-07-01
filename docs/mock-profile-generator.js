/**
 * Mock Agent Profile Database Generator
 * Creates realistic agent profiles for all 118 Bittensor subnets
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class MockProfileGenerator {
  constructor() {
    // Subnet metadata based on known Bittensor subnets
    this.subnetMetadata = {
      1: { name: "Text Prompting", type: "inference", category: "text" },
      2: { name: "Machine Translation", type: "inference", category: "text" },
      3: { name: "Scraping", type: "data", category: "scraping" },
      4: { name: "Multi Modality", type: "inference", category: "multimodal" },
      5: { name: "OpenKaito", type: "inference", category: "search" },
      6: { name: "Masa", type: "data", category: "social" },
      7: { name: "Cortex.t", type: "inference", category: "text" },
      8: { name: "Taoshi", type: "inference", category: "prediction" },
      9: { name: "Pretraining", type: "training", category: "pretraining" },
      10: { name: "Omega", type: "inference", category: "chat" },
      11: { name: "Hivemind", type: "compute", category: "distributed" },
      12: { name: "Compute", type: "compute", category: "compute" },
      13: { name: "Dataflow", type: "data", category: "streaming" },
      14: { name: "Llm Defender", type: "inference", category: "security" },
      15: { name: "Blockchain Insights", type: "data", category: "analytics" },
      16: { name: "Audio", type: "inference", category: "audio" },
      17: { name: "Three Gen", type: "inference", category: "3d" },
      18: { name: "Corcel", type: "inference", category: "text" },
      19: { name: "Vision", type: "inference", category: "vision" },
      20: { name: "BitAgent", type: "inference", category: "agents" },
      21: { name: "Storage", type: "storage", category: "storage" },
      22: { name: "Smart Scrape", type: "data", category: "scraping" },
      23: { name: "Reward", type: "inference", category: "reward" },
      24: { name: "Omron", type: "inference", category: "health" },
      25: { name: "Tensor", type: "inference", category: "tensor" },
      26: { name: "Inference", type: "inference", category: "general" },
      27: { name: "Compute Horde", type: "compute", category: "compute" }
    };

    // Performance tiers for realistic distribution
    this.performanceTiers = {
      elite: { scoreRange: [85, 100], probability: 0.10 },
      high: { scoreRange: [70, 84], probability: 0.25 },
      medium: { scoreRange: [50, 69], probability: 0.40 },
      low: { scoreRange: [30, 49], probability: 0.20 },
      poor: { scoreRange: [0, 29], probability: 0.05 }
    };

    // Realistic parameter ranges
    this.parameterRanges = {
      emission_rate: { min: 100, max: 2000 },
      total_stake: { min: 10000, max: 200000 },
      validator_count: { min: 10, max: 512 },
      activity_score: { min: 0, max: 100 },
      network_participation: { min: 5, max: 95 }
    };
  }

  /**
   * Generate complete mock profile database
   */
  generateDatabase() {
    const profiles = [];
    
    for (let subnetId = 1; subnetId <= 118; subnetId++) {
      const profile = this.generateProfile(subnetId);
      profiles.push(profile);
    }
    
    return profiles;
  }

  /**
   * Generate single agent profile
   */
  generateProfile(subnetId) {
    const tier = this.selectPerformanceTier();
    const metadata = this.getSubnetMetadata(subnetId);
    const timestamp = this.generateTimestamp();
    
    const metrics = this.generateMetrics(tier);
    const performance = this.generatePerformance(tier, metrics);
    const operational = this.generateOperational(performance.overall_score);
    
    return {
      schema_version: "1.0.0",
      identity: {
        subnet_id: subnetId,
        name: metadata.name,
        type: metadata.type,
        description: this.generateDescription(metadata),
        tags: this.generateTags(metadata),
        website: this.generateWebsite(metadata, 0.3),
        github: this.generateGithub(metadata, 0.4)
      },
      metrics: metrics,
      performance: performance,
      ai_analysis: this.generateAiAnalysis(performance, metadata, timestamp),
      operational: operational,
      metadata: {
        profile_version: "1.0.0",
        created_at: this.generateCreatedAt(),
        updated_at: timestamp,
        data_quality: this.generateDataQuality(tier),
        calculation_details: this.generateCalculationDetails(timestamp)
      }
    };
  }

  /**
   * Select performance tier based on probability distribution
   */
  selectPerformanceTier() {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [tier, config] of Object.entries(this.performanceTiers)) {
      cumulative += config.probability;
      if (rand <= cumulative) {
        return { name: tier, ...config };
      }
    }
    
    return { name: 'medium', ...this.performanceTiers.medium };
  }

  /**
   * Get subnet metadata with fallback
   */
  getSubnetMetadata(subnetId) {
    if (this.subnetMetadata[subnetId]) {
      return this.subnetMetadata[subnetId];
    }
    
    // Generate metadata for unknown subnets
    const types = ['inference', 'training', 'data', 'storage', 'compute'];
    const categories = ['ai', 'blockchain', 'compute', 'data', 'experimental'];
    
    return {
      name: `Subnet ${subnetId}`,
      type: types[Math.floor(Math.random() * types.length)],
      category: categories[Math.floor(Math.random() * categories.length)]
    };
  }

  /**
   * Generate realistic metrics based on performance tier
   */
  generateMetrics(tier) {
    const baseMultiplier = (tier.scoreRange[0] + tier.scoreRange[1]) / 200; // 0.0 to 1.0
    
    return {
      emission_rate: this.randomInRange(
        this.parameterRanges.emission_rate.min * baseMultiplier,
        this.parameterRanges.emission_rate.max * baseMultiplier
      ),
      total_stake: this.randomInRange(
        this.parameterRanges.total_stake.min * baseMultiplier,
        this.parameterRanges.total_stake.max * baseMultiplier
      ),
      validator_count: Math.floor(this.randomInRange(
        this.parameterRanges.validator_count.min * baseMultiplier,
        this.parameterRanges.validator_count.max * baseMultiplier
      )),
      activity_score: this.randomInRange(
        Math.max(0, tier.scoreRange[0] - 15),
        Math.min(100, tier.scoreRange[1] + 15)
      ),
      price_history: this.generatePriceHistory(),
      block_number: this.generateBlockNumber(),
      network_participation: this.randomInRange(
        this.parameterRanges.network_participation.min * baseMultiplier,
        this.parameterRanges.network_participation.max * baseMultiplier
      )
    };
  }

  /**
   * Generate performance scores
   */
  generatePerformance(tier, metrics) {
    const overallScore = Math.floor(this.randomInRange(tier.scoreRange[0], tier.scoreRange[1]));
    
    // Generate breakdown scores that average to overall score
    const variance = 10;
    const yieldScore = Math.max(0, Math.min(100, overallScore + this.randomInRange(-variance, variance)));
    const activityScore = Math.max(0, Math.min(100, overallScore + this.randomInRange(-variance, variance)));
    const credibilityScore = Math.max(0, Math.min(100, overallScore + this.randomInRange(-variance, variance)));
    
    return {
      overall_score: overallScore,
      breakdown: {
        yield_score: Math.round(yieldScore),
        activity_score: Math.round(activityScore),
        credibility_score: Math.round(credibilityScore)
      },
      weights: {
        yield: 40,
        activity: 30,
        credibility: 30
      },
      risk_assessment: {
        level: this.determineRiskLevel(overallScore),
        factors: this.generateRiskFactors(overallScore, metrics),
        confidence: this.randomInRange(0.6, 0.95)
      },
      current_yield: this.calculateCurrentYield(metrics),
      yield_change_24h: this.randomInRange(-5, 5),
      validator_efficiency: this.randomInRange(20, 90)
    };
  }

  /**
   * Generate AI analysis based on performance
   */
  generateAiAnalysis(performance, metadata, timestamp) {
    const templates = this.getAiTemplates();
    const template = templates[this.getRecommendation(performance.overall_score)];
    
    return {
      summary: this.populateTemplate(template.summary, { metadata, performance }),
      strengths: this.selectRandomItems(template.strengths, 2, 4),
      concerns: this.selectRandomItems(template.concerns, 1, 3),
      recommendation: this.getRecommendation(performance.overall_score),
      confidence_score: Math.floor(this.randomInRange(60, 95)),
      analysis_timestamp: timestamp
    };
  }

  /**
   * Generate operational status
   */
  generateOperational(overallScore) {
    const status = this.determineOperationalStatus(overallScore);
    const timestamp = this.generateTimestamp();
    
    return {
      status: status,
      last_updated: timestamp,
      monitoring: {
        alerts: this.generateAlerts(status, overallScore),
        uptime_percentage: this.randomInRange(85, 99.9),
        response_time_avg: Math.floor(this.randomInRange(100, 500))
      },
      data_sources: [
        {
          name: "taostats",
          last_sync: timestamp,
          status: "active"
        },
        {
          name: "claude",
          last_sync: timestamp,
          status: Math.random() > 0.1 ? "active" : "stale"
        },
        {
          name: "bittensor",
          last_sync: timestamp,
          status: Math.random() > 0.05 ? "active" : "stale"
        }
      ]
    };
  }

  /**
   * Generate data quality metrics
   */
  generateDataQuality(tier) {
    const baseQuality = (tier.scoreRange[0] + tier.scoreRange[1]) / 200;
    
    return {
      completeness: Math.floor(this.randomInRange(60 + baseQuality * 30, 100)),
      freshness: Math.floor(this.randomInRange(0, 30)),
      source_reliability: Math.floor(this.randomInRange(70 + baseQuality * 20, 100))
    };
  }

  /**
   * Generate calculation details
   */
  generateCalculationDetails(timestamp) {
    return {
      yield_calculation: {
        method: "annual_percentage_yield",
        parameters: {
          blocks_per_day: 7200,
          emission_normalization: true
        },
        timestamp: timestamp
      },
      activity_calculation: {
        method: "weighted_participation",
        parameters: {
          validator_weight: 0.4,
          network_weight: 0.6
        },
        timestamp: timestamp
      },
      credibility_calculation: {
        method: "multi_factor_analysis",
        parameters: {
          stake_distribution: true,
          validator_stability: true,
          emission_consistency: true
        },
        timestamp: timestamp
      }
    };
  }

  /**
   * Generate subnet description
   */
  generateDescription(metadata) {
    const descriptions = {
      inference: `Advanced ${metadata.category} inference subnet providing high-quality AI model services`,
      training: `Distributed training subnet focused on ${metadata.category} model development`,
      data: `Data processing subnet specializing in ${metadata.category} data collection and analysis`,
      storage: `Decentralized storage subnet for ${metadata.category} data management`,
      compute: `High-performance compute subnet for ${metadata.category} workloads`
    };
    
    return descriptions[metadata.type] || `Innovative subnet focused on ${metadata.category} applications`;
  }

  /**
   * Generate tags based on metadata
   */
  generateTags(metadata) {
    const baseTags = ['bittensor', 'subnet', metadata.type];
    const categoryTags = {
      text: ['nlp', 'language', 'text-generation'],
      vision: ['computer-vision', 'image-processing', 'visual-ai'],
      audio: ['speech', 'audio-processing', 'tts'],
      data: ['data-mining', 'analytics', 'big-data'],
      compute: ['distributed-computing', 'high-performance', 'parallel'],
      storage: ['decentralized-storage', 'file-system', 'data-storage']
    };
    
    const additionalTags = categoryTags[metadata.category] || ['ai', 'machine-learning'];
    return [...baseTags, ...this.selectRandomItems(additionalTags, 1, 3)];
  }

  /**
   * Generate website URL with probability
   */
  generateWebsite(metadata, probability) {
    if (Math.random() > probability) return null;
    
    const domain = metadata.name.toLowerCase().replace(/\s+/g, '');
    return `https://${domain}.subnet.io`;
  }

  /**
   * Generate GitHub URL with probability
   */
  generateGithub(metadata, probability) {
    if (Math.random() > probability) return null;
    
    const repo = metadata.name.toLowerCase().replace(/\s+/g, '-');
    return `https://github.com/bittensor-${repo}/subnet`;
  }

  /**
   * Generate price history
   */
  generatePriceHistory() {
    const basePrice = this.randomInRange(0.001, 0.05);
    const history = [];
    let currentPrice = basePrice;
    
    for (let i = 0; i < 30; i++) {
      const change = this.randomInRange(-0.05, 0.05);
      currentPrice = Math.max(0.001, currentPrice * (1 + change));
      history.push(parseFloat(currentPrice.toFixed(6)));
    }
    
    return history.slice(-5); // Return last 5 data points
  }

  /**
   * Generate current block number
   */
  generateBlockNumber() {
    return Math.floor(this.randomInRange(5800000, 5900000));
  }

  /**
   * Calculate current yield
   */
  calculateCurrentYield(metrics) {
    const dailyEmission = metrics.emission_rate * 7200;
    const dailyYieldRatio = metrics.total_stake > 0 ? (dailyEmission / metrics.total_stake) : 0;
    const annualYield = dailyYieldRatio * 365 * 100;
    return parseFloat(annualYield.toFixed(2));
  }

  /**
   * Determine risk level based on score
   */
  determineRiskLevel(score) {
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    if (score >= 30) return 'high';
    return 'critical';
  }

  /**
   * Generate risk factors
   */
  generateRiskFactors(score, metrics) {
    const factors = [];
    
    if (score < 30) factors.push('critically_low_performance');
    if (score < 50) factors.push('below_average_performance');
    if (metrics.validator_count < 50) factors.push('low_validator_count');
    if (metrics.activity_score < 30) factors.push('low_activity');
    if (metrics.network_participation < 20) factors.push('poor_network_participation');
    
    // Add positive factors for high-performing subnets
    if (score >= 80) factors.push('stable_validators', 'consistent_yield');
    if (metrics.validator_count > 200) factors.push('strong_decentralization');
    if (metrics.activity_score > 80) factors.push('high_activity');
    
    return factors.length > 0 ? factors : ['moderate_risk'];
  }

  /**
   * Determine operational status
   */
  determineOperationalStatus(score) {
    if (score >= 80) return 'healthy';
    if (score >= 60) return 'warning';
    if (score >= 30) return 'critical';
    if (score >= 10) return 'offline';
    return 'maintenance';
  }

  /**
   * Generate alerts based on status
   */
  generateAlerts(status, score) {
    const alerts = [];
    const timestamp = this.generateTimestamp();
    
    if (status === 'critical') {
      alerts.push({
        type: 'performance',
        severity: 'critical',
        message: 'Performance metrics below acceptable thresholds',
        timestamp: timestamp
      });
    }
    
    if (status === 'warning') {
      alerts.push({
        type: 'performance',
        severity: 'warning',
        message: 'Performance degradation detected',
        timestamp: timestamp
      });
    }
    
    if (score < 50 && Math.random() > 0.7) {
      alerts.push({
        type: 'financial',
        severity: 'warning',
        message: 'Yield below network average',
        timestamp: timestamp
      });
    }
    
    return alerts;
  }

  /**
   * Get recommendation based on score
   */
  getRecommendation(score) {
    if (score >= 85) return 'strong_buy';
    if (score >= 70) return 'buy';
    if (score >= 50) return 'hold';
    if (score >= 30) return 'caution';
    return 'avoid';
  }

  /**
   * Get AI analysis templates
   */
  getAiTemplates() {
    return {
      strong_buy: {
        summary: "Excellent performance with consistent yields and strong validator participation. Demonstrates exceptional stability and growth potential.",
        strengths: [
          "Outstanding validator network",
          "Consistent high yields",
          "Strong community support",
          "Excellent technical foundation",
          "Stable performance metrics",
          "High network participation",
          "Reliable operations"
        ],
        concerns: [
          "Minor price volatility",
          "Market competition",
          "Potential scaling challenges"
        ]
      },
      buy: {
        summary: "Strong performance indicators with good validator participation and reliable yield generation. Shows positive momentum.",
        strengths: [
          "Solid validator base",
          "Good yield generation",
          "Stable operations",
          "Active development",
          "Growing community",
          "Reliable performance"
        ],
        concerns: [
          "Moderate yield volatility",
          "Competition from larger subnets",
          "Validator count could be higher"
        ]
      },
      hold: {
        summary: "Moderate performance with room for improvement. While showing potential, requires monitoring for sustained growth.",
        strengths: [
          "Moderate validator participation",
          "Acceptable yield levels",
          "Stable core operations",
          "Development activity"
        ],
        concerns: [
          "Inconsistent performance",
          "Lower validator participation",
          "Yield below network average",
          "Limited growth momentum"
        ]
      },
      caution: {
        summary: "Below-average performance with concerning metrics. Requires significant improvement to become competitive.",
        strengths: [
          "Potential for improvement",
          "Active development team",
          "Innovative approach"
        ],
        concerns: [
          "Low validator participation",
          "Declining performance",
          "Poor yield generation",
          "Operational instability",
          "Limited community support"
        ]
      },
      avoid: {
        summary: "Poor performance with critical issues. Significant risks present that may affect long-term viability.",
        strengths: [
          "Experimental features",
          "Potential for recovery"
        ],
        concerns: [
          "Critically low performance",
          "Severe validator issues",
          "Operational failures",
          "Poor community support",
          "Declining yields",
          "High risk of failure"
        ]
      }
    };
  }

  /**
   * Populate template with data
   */
  populateTemplate(template, data) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  /**
   * Select random items from array
   */
  selectRandomItems(array, min, max) {
    const count = Math.floor(this.randomInRange(min, max));
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Generate timestamp
   */
  generateTimestamp() {
    const now = new Date();
    const offset = Math.floor(Math.random() * 60 * 60 * 1000); // Within last hour
    return new Date(now.getTime() - offset).toISOString();
  }

  /**
   * Generate created timestamp (within last 30 days)
   */
  generateCreatedAt() {
    const now = new Date();
    const offset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Within last 30 days
    return new Date(now.getTime() - offset).toISOString();
  }

  /**
   * Generate random number in range
   */
  randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Save profiles to files
   */
  async saveProfiles(profiles, outputDir = 'docs/mock-profiles') {
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save complete database as JSON
    const dbPath = path.join(outputDir, 'agent-profiles-database.json');
    fs.writeFileSync(dbPath, JSON.stringify(profiles, null, 2));

    // Save individual profiles as YAML
    const yamlDir = path.join(outputDir, 'individual');
    if (!fs.existsSync(yamlDir)) {
      fs.mkdirSync(yamlDir, { recursive: true });
    }

    for (const profile of profiles) {
      const filename = `subnet-${profile.identity.subnet_id}.yaml`;
      const filepath = path.join(yamlDir, filename);
      const yamlContent = yaml.dump(profile, { indent: 2 });
      fs.writeFileSync(filepath, yamlContent);
    }

    // Save summary statistics
    const stats = this.generateDatabaseStats(profiles);
    const statsPath = path.join(outputDir, 'database-stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

    console.log(`✅ Generated ${profiles.length} agent profiles`);
    console.log(`📁 Saved to: ${outputDir}`);
    console.log(`📊 Database stats: ${statsPath}`);
  }

  /**
   * Generate database statistics
   */
  generateDatabaseStats(profiles) {
    const stats = {
      total_profiles: profiles.length,
      performance_distribution: {},
      type_distribution: {},
      status_distribution: {},
      recommendation_distribution: {},
      average_metrics: {
        overall_score: 0,
        yield_score: 0,
        activity_score: 0,
        credibility_score: 0,
        validator_count: 0,
        current_yield: 0
      }
    };

    // Calculate distributions
    profiles.forEach(profile => {
      // Performance distribution
      const scoreRange = Math.floor(profile.performance.overall_score / 10) * 10;
      const scoreKey = `${scoreRange}-${scoreRange + 9}`;
      stats.performance_distribution[scoreKey] = (stats.performance_distribution[scoreKey] || 0) + 1;

      // Type distribution
      stats.type_distribution[profile.identity.type] = (stats.type_distribution[profile.identity.type] || 0) + 1;

      // Status distribution
      stats.status_distribution[profile.operational.status] = (stats.status_distribution[profile.operational.status] || 0) + 1;

      // Recommendation distribution
      if (profile.ai_analysis?.recommendation) {
        stats.recommendation_distribution[profile.ai_analysis.recommendation] = 
          (stats.recommendation_distribution[profile.ai_analysis.recommendation] || 0) + 1;
      }

      // Accumulate for averages
      stats.average_metrics.overall_score += profile.performance.overall_score;
      stats.average_metrics.yield_score += profile.performance.breakdown.yield_score;
      stats.average_metrics.activity_score += profile.performance.breakdown.activity_score;
      stats.average_metrics.credibility_score += profile.performance.breakdown.credibility_score;
      stats.average_metrics.validator_count += profile.metrics.validator_count;
      stats.average_metrics.current_yield += profile.performance.current_yield;
    });

    // Calculate averages
    Object.keys(stats.average_metrics).forEach(key => {
      stats.average_metrics[key] = Math.round(stats.average_metrics[key] / profiles.length * 100) / 100;
    });

    return stats;
  }
}

// Export and CLI usage
module.exports = MockProfileGenerator;

if (require.main === module) {
  const generator = new MockProfileGenerator();
  const profiles = generator.generateDatabase();
  generator.saveProfiles(profiles).catch(console.error);
} 