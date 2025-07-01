/**
 * Mock Agent Profile Database Generator
 * Creates realistic agent profiles for all 118 Bittensor subnets
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class MockProfileGenerator {
  constructor() {
    // Known subnet metadata
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

    // Performance distribution (realistic)
    this.performanceTiers = {
      elite: { scoreRange: [85, 100], probability: 0.10 },
      high: { scoreRange: [70, 84], probability: 0.25 },
      medium: { scoreRange: [50, 69], probability: 0.40 },
      low: { scoreRange: [30, 49], probability: 0.20 },
      poor: { scoreRange: [0, 29], probability: 0.05 }
    };
  }

  /**
   * Generate complete database
   */
  generateDatabase() {
    const profiles = [];
    for (let subnetId = 1; subnetId <= 118; subnetId++) {
      profiles.push(this.generateProfile(subnetId));
    }
    return profiles;
  }

  /**
   * Generate single profile
   */
  generateProfile(subnetId) {
    const tier = this.selectTier();
    const metadata = this.getMetadata(subnetId);
    const timestamp = new Date().toISOString();
    
    return {
      schema_version: "1.0.0",
      identity: {
        subnet_id: subnetId,
        name: metadata.name,
        type: metadata.type,
        description: this.generateDescription(metadata),
        tags: this.generateTags(metadata),
        website: Math.random() > 0.7 ? null : `https://${metadata.name.toLowerCase().replace(/\s+/g, '')}.subnet.io`,
        github: Math.random() > 0.6 ? null : `https://github.com/bittensor-${metadata.name.toLowerCase().replace(/\s+/g, '-')}/subnet`
      },
      metrics: this.generateMetrics(tier),
      performance: this.generatePerformance(tier),
      ai_analysis: this.generateAiAnalysis(tier, metadata, timestamp),
      operational: this.generateOperational(tier.scoreRange[0]),
      metadata: {
        profile_version: "1.0.0",
        created_at: timestamp,
        updated_at: timestamp,
        data_quality: {
          completeness: Math.floor(this.random(70, 100)),
          freshness: Math.floor(this.random(0, 30)),
          source_reliability: Math.floor(this.random(80, 100))
        }
      }
    };
  }

  selectTier() {
    const rand = Math.random();
    let cumulative = 0;
    for (const [name, config] of Object.entries(this.performanceTiers)) {
      cumulative += config.probability;
      if (rand <= cumulative) return { name, ...config };
    }
    return { name: 'medium', ...this.performanceTiers.medium };
  }

  getMetadata(subnetId) {
    return this.subnetMetadata[subnetId] || {
      name: `Subnet ${subnetId}`,
      type: ['inference', 'training', 'data', 'compute', 'storage'][Math.floor(Math.random() * 5)],
      category: 'experimental'
    };
  }

  generateDescription(metadata) {
    const templates = {
      inference: `Advanced ${metadata.category} inference subnet providing AI model services`,
      training: `Distributed training subnet for ${metadata.category} model development`,
      data: `Data processing subnet specializing in ${metadata.category} analytics`,
      compute: `High-performance compute subnet for ${metadata.category} workloads`,
      storage: `Decentralized storage subnet for ${metadata.category} data`
    };
    return templates[metadata.type] || `Innovative ${metadata.category} subnet`;
  }

  generateTags(metadata) {
    const base = ['bittensor', 'subnet', metadata.type];
    const extra = {
      text: ['nlp', 'language'],
      vision: ['computer-vision', 'image'],
      audio: ['speech', 'tts'],
      data: ['analytics', 'mining'],
      compute: ['distributed', 'parallel']
    };
    return [...base, ...(extra[metadata.category] || ['ai'])];
  }

  generateMetrics(tier) {
    const multiplier = (tier.scoreRange[0] + tier.scoreRange[1]) / 200;
    return {
      emission_rate: this.random(100 * multiplier, 2000 * multiplier),
      total_stake: this.random(10000 * multiplier, 200000 * multiplier),
      validator_count: Math.floor(this.random(10 * multiplier, 512 * multiplier)),
      activity_score: this.random(Math.max(0, tier.scoreRange[0] - 15), Math.min(100, tier.scoreRange[1] + 15)),
      price_history: Array(5).fill().map(() => this.random(0.001, 0.05)),
      block_number: Math.floor(this.random(5800000, 5900000)),
      network_participation: this.random(5 * multiplier, 95 * multiplier)
    };
  }

  generatePerformance(tier) {
    const overall = Math.floor(this.random(tier.scoreRange[0], tier.scoreRange[1]));
    const variance = 10;
    return {
      overall_score: overall,
      breakdown: {
        yield_score: Math.max(0, Math.min(100, Math.round(overall + this.random(-variance, variance)))),
        activity_score: Math.max(0, Math.min(100, Math.round(overall + this.random(-variance, variance)))),
        credibility_score: Math.max(0, Math.min(100, Math.round(overall + this.random(-variance, variance))))
      },
      weights: { yield: 40, activity: 30, credibility: 30 },
      risk_assessment: {
        level: overall >= 80 ? 'low' : overall >= 60 ? 'medium' : overall >= 30 ? 'high' : 'critical',
        factors: overall < 50 ? ['low_performance', 'validator_concerns'] : ['stable_operation'],
        confidence: this.random(0.6, 0.95)
      },
      current_yield: this.random(2, 20),
      yield_change_24h: this.random(-5, 5),
      validator_efficiency: this.random(20, 90)
    };
  }

  generateAiAnalysis(tier, metadata, timestamp) {
    const templates = {
      elite: {
        summary: `Exceptional performance with outstanding ${metadata.category} capabilities and strong validator network.`,
        recommendation: 'strong_buy'
      },
      high: {
        summary: `Strong performance in ${metadata.category} with reliable operations and good growth potential.`,
        recommendation: 'buy'
      },
      medium: {
        summary: `Moderate performance with potential for improvement in ${metadata.category} operations.`,
        recommendation: 'hold'
      },
      low: {
        summary: `Below-average performance requiring attention to ${metadata.category} efficiency.`,
        recommendation: 'caution'
      },
      poor: {
        summary: `Poor performance with significant ${metadata.category} operational challenges.`,
        recommendation: 'avoid'
      }
    };

    return {
      summary: templates[tier.name].summary,
      strengths: tier.name === 'elite' ? ['Outstanding performance', 'Strong validators'] : ['Potential for growth'],
      concerns: tier.name === 'poor' ? ['Poor performance', 'Low validators'] : ['Market volatility'],
      recommendation: templates[tier.name].recommendation,
      confidence_score: Math.floor(this.random(60, 95)),
      analysis_timestamp: timestamp
    };
  }

  generateOperational(score) {
    const status = score >= 80 ? 'healthy' : score >= 60 ? 'warning' : score >= 30 ? 'critical' : 'offline';
    const timestamp = new Date().toISOString();
    
    return {
      status: status,
      last_updated: timestamp,
      monitoring: {
        alerts: status === 'critical' ? [{
          type: 'performance',
          severity: 'critical',
          message: 'Performance below threshold',
          timestamp: timestamp
        }] : [],
        uptime_percentage: this.random(85, 99.9),
        response_time_avg: Math.floor(this.random(100, 500))
      },
      data_sources: [
        { name: "taostats", last_sync: timestamp, status: "active" },
        { name: "claude", last_sync: timestamp, status: "active" },
        { name: "bittensor", last_sync: timestamp, status: "active" }
      ]
    };
  }

  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  async saveDatabase() {
    const profiles = this.generateDatabase();
    const outputDir = path.join(__dirname, 'database');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save complete database
    fs.writeFileSync(
      path.join(outputDir, 'agent-profiles.json'),
      JSON.stringify(profiles, null, 2)
    );

    // Save sample profiles as YAML
    const samples = profiles.filter(p => [1, 15, 47, 94].includes(p.identity.subnet_id));
    samples.forEach(profile => {
      const filename = `subnet-${profile.identity.subnet_id}-sample.yaml`;
      fs.writeFileSync(
        path.join(outputDir, filename),
        yaml.dump(profile, { indent: 2 })
      );
    });

    console.log(`✅ Generated ${profiles.length} profiles`);
    console.log(`📁 Saved to: ${outputDir}`);
    
    return profiles;
  }
}

module.exports = MockProfileGenerator;

if (require.main === module) {
  const generator = new MockProfileGenerator();
  generator.saveDatabase().catch(console.error);
} 