/**
 * Agent Profile Transformation Utilities
 * Convert between different data formats and the unified agent profile schema
 */

const yaml = require('js-yaml');

class AgentProfileTransformer {
  /**
   * Create a complete agent profile from raw data sources
   */
  static createProfile({ subnet_id, metrics, scoreData, additionalData, timestamp }) {
    return {
      schema_version: "1.0.0",
      identity: {
        subnet_id: subnet_id,
        name: additionalData.name || `Subnet ${subnet_id}`,
        type: additionalData.type || 'inference',
        description: additionalData.description || '',
        tags: additionalData.tags || [],
        website: additionalData.website || null,
        github: additionalData.github || null
      },
      metrics: {
        emission_rate: metrics.emission_rate,
        total_stake: metrics.total_stake,
        validator_count: metrics.validator_count,
        activity_score: metrics.activity_score,
        price_history: metrics.price_history || [],
        block_number: metrics.block_number || 0,
        network_participation: metrics.network_participation || 0
      },
      performance: {
        overall_score: scoreData.overall_score,
        breakdown: scoreData.breakdown,
        weights: scoreData.weights,
        risk_assessment: {
          level: scoreData.risk_level || 'medium',
          factors: scoreData.risk_factors || [],
          confidence: scoreData.risk_confidence || 0.5
        },
        current_yield: scoreData.metrics?.current_yield || 0,
        yield_change_24h: scoreData.metrics?.yield_change_24h || 0,
        validator_efficiency: scoreData.metrics?.validator_efficiency || 0
      },
      ai_analysis: scoreData.ai_summary ? {
        summary: scoreData.ai_summary,
        strengths: this.extractStrengths(scoreData.ai_summary),
        concerns: this.extractConcerns(scoreData.ai_summary),
        recommendation: this.determineRecommendation(scoreData.overall_score),
        confidence_score: scoreData.ai_confidence || 75,
        analysis_timestamp: timestamp
      } : undefined,
      operational: {
        status: this.determineOperationalStatus(scoreData.overall_score, metrics),
        last_updated: timestamp,
        monitoring: {
          alerts: this.generateAlerts(scoreData, metrics),
          uptime_percentage: 99.0, // Would come from monitoring system
          response_time_avg: 200 // Would come from monitoring system
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
            status: scoreData.ai_summary ? "active" : "unavailable"
          },
          {
            name: "bittensor",
            last_sync: timestamp,
            status: "active"
          }
        ]
      },
      metadata: {
        profile_version: "1.0.0",
        created_at: timestamp,
        updated_at: timestamp,
        data_quality: {
          completeness: this.calculateCompleteness({ metrics, scoreData, additionalData }),
          freshness: 0,
          source_reliability: 95
        },
        calculation_details: scoreData.calculation_details || {}
      }
    };
  }

  /**
   * Transform agent profile to SubnetCard UI format
   */
  static toSubnetCard(agentProfile) {
    return {
      subnet_id: agentProfile.identity.subnet_id,
      name: agentProfile.identity.name,
      type: agentProfile.identity.type,
      status: agentProfile.operational.status,
      overall_score: agentProfile.performance.overall_score,
      yield_score: agentProfile.performance.breakdown.yield_score,
      activity_score: agentProfile.performance.breakdown.activity_score,
      credibility_score: agentProfile.performance.breakdown.credibility_score,
      current_yield: agentProfile.performance.current_yield,
      validator_count: agentProfile.metrics.validator_count,
      risk_level: agentProfile.performance.risk_assessment.level,
      recommendation: agentProfile.ai_analysis?.recommendation,
      ai_summary: agentProfile.ai_analysis?.summary,
      last_updated: agentProfile.operational.last_updated
    };
  }

  /**
   * Transform agent profile to StatsDashboard format
   */
  static toStatsDashboard(agentProfile) {
    return {
      subnet_id: agentProfile.identity.subnet_id,
      name: agentProfile.identity.name,
      score: agentProfile.performance.overall_score,
      yield: agentProfile.performance.current_yield,
      activity: agentProfile.performance.breakdown.activity_score,
      credibility: agentProfile.performance.breakdown.credibility_score,
      validators: agentProfile.metrics.validator_count,
      stake: agentProfile.metrics.total_stake,
      emission: agentProfile.metrics.emission_rate,
      risk: agentProfile.performance.risk_assessment.level,
      status: agentProfile.operational.status,
      trend: agentProfile.performance.yield_change_24h > 0 ? 'up' : 
             agentProfile.performance.yield_change_24h < 0 ? 'down' : 'stable'
    };
  }

  /**
   * Transform legacy ScoreAgent output to agent profile format
   */
  static fromScoreAgent(scoreResult, subnetId) {
    const timestamp = new Date().toISOString();
    
    return {
      schema_version: "1.0.0",
      identity: {
        subnet_id: subnetId,
        name: `Subnet ${subnetId}`,
        type: 'inference'
      },
      metrics: {
        emission_rate: scoreResult.metrics?.emission_rate || 0,
        total_stake: scoreResult.metrics?.total_stake || 0,
        validator_count: scoreResult.metrics?.validator_count || 0,
        activity_score: scoreResult.metrics?.activity_score || 0,
        network_participation: scoreResult.metrics?.network_participation || 0
      },
      performance: {
        overall_score: scoreResult.overall_score,
        breakdown: scoreResult.breakdown,
        weights: scoreResult.weights,
        risk_assessment: {
          level: scoreResult.risk_level || 'medium',
          factors: [],
          confidence: 0.8
        },
        current_yield: scoreResult.metrics?.current_yield || 0,
        yield_change_24h: scoreResult.metrics?.yield_change_24h || 0,
        validator_efficiency: scoreResult.metrics?.validator_efficiency || 0
      },
      ai_analysis: scoreResult.ai_summary ? {
        summary: scoreResult.ai_summary,
        recommendation: this.determineRecommendation(scoreResult.overall_score),
        confidence_score: 80,
        analysis_timestamp: timestamp
      } : undefined,
      operational: {
        status: this.determineOperationalStatus(scoreResult.overall_score),
        last_updated: timestamp
      },
      metadata: {
        profile_version: "1.0.0",
        created_at: timestamp,
        updated_at: timestamp
      }
    };
  }

  /**
   * Transform TaoStats API response to agent profile metrics
   */
  static fromTaoStats(taoStatsResponse, subnetId) {
    return {
      subnet_id: subnetId,
      emission_rate: taoStatsResponse.emission_rate || 0,
      total_stake: taoStatsResponse.total_stake || 0,
      validator_count: taoStatsResponse.validator_count || 0,
      activity_score: taoStatsResponse.activity_score || 0,
      price_history: taoStatsResponse.price_history || [],
      block_number: taoStatsResponse.block_number || 0,
      network_participation: this.calculateNetworkParticipation(taoStatsResponse)
    };
  }

  /**
   * Transform IoNet API response to supplementary data
   */
  static fromIoNet(ioNetResponse, subnetId) {
    return {
      subnet_id: subnetId,
      additional_metrics: {
        compute_units: ioNetResponse.compute_units || 0,
        gpu_utilization: ioNetResponse.gpu_utilization || 0,
        bandwidth_usage: ioNetResponse.bandwidth_usage || 0
      },
      enhanced_description: ioNetResponse.description || null
    };
  }

  /**
   * Transform to YAML format
   */
  static toYAML(agentProfile) {
    return yaml.dump(agentProfile, {
      indent: 2,
      lineWidth: 120,
      quotingType: '"',
      forceQuotes: false
    });
  }

  /**
   * Transform from YAML format
   */
  static fromYAML(yamlString) {
    return yaml.load(yamlString);
  }

  /**
   * Extract strengths from AI summary
   */
  static extractStrengths(aiSummary) {
    // Simple extraction - in production, this would use NLP
    const strengthKeywords = ['excellent', 'strong', 'high', 'stable', 'consistent', 'reliable'];
    const sentences = aiSummary.split('.').filter(s => s.trim());
    
    return sentences
      .filter(sentence => strengthKeywords.some(keyword => sentence.toLowerCase().includes(keyword)))
      .map(sentence => sentence.trim())
      .slice(0, 3); // Limit to top 3
  }

  /**
   * Extract concerns from AI summary
   */
  static extractConcerns(aiSummary) {
    // Simple extraction - in production, this would use NLP
    const concernKeywords = ['low', 'declining', 'poor', 'volatile', 'unstable', 'concerning'];
    const sentences = aiSummary.split('.').filter(s => s.trim());
    
    return sentences
      .filter(sentence => concernKeywords.some(keyword => sentence.toLowerCase().includes(keyword)))
      .map(sentence => sentence.trim())
      .slice(0, 3); // Limit to top 3
  }

  /**
   * Determine recommendation based on score
   */
  static determineRecommendation(overallScore) {
    if (overallScore >= 85) return 'strong_buy';
    if (overallScore >= 70) return 'buy';
    if (overallScore >= 50) return 'hold';
    if (overallScore >= 30) return 'caution';
    return 'avoid';
  }

  /**
   * Determine operational status
   */
  static determineOperationalStatus(overallScore, metrics = {}) {
    if (overallScore >= 80 && metrics.validator_count > 100) return 'healthy';
    if (overallScore >= 60 && metrics.validator_count > 50) return 'warning';
    if (overallScore >= 30) return 'critical';
    return 'offline';
  }

  /**
   * Generate alerts based on performance data
   */
  static generateAlerts(scoreData, metrics) {
    const alerts = [];
    
    if (scoreData.overall_score < 30) {
      alerts.push({
        type: 'performance',
        severity: 'critical',
        message: 'Overall performance score critically low',
        timestamp: new Date().toISOString()
      });
    }
    
    if (metrics.validator_count < 50) {
      alerts.push({
        type: 'performance',
        severity: 'warning',
        message: 'Validator count below recommended threshold',
        timestamp: new Date().toISOString()
      });
    }
    
    if (scoreData.metrics?.yield_change_24h < -5) {
      alerts.push({
        type: 'financial',
        severity: 'warning',
        message: 'Significant yield decrease in 24h',
        timestamp: new Date().toISOString()
      });
    }
    
    return alerts;
  }

  /**
   * Calculate data completeness percentage
   */
  static calculateCompleteness({ metrics, scoreData, additionalData }) {
    let completeness = 0;
    const totalFields = 10;
    
    if (metrics?.emission_rate > 0) completeness++;
    if (metrics?.total_stake > 0) completeness++;
    if (metrics?.validator_count > 0) completeness++;
    if (metrics?.activity_score > 0) completeness++;
    if (scoreData?.overall_score > 0) completeness++;
    if (scoreData?.breakdown) completeness++;
    if (scoreData?.ai_summary) completeness++;
    if (additionalData?.name) completeness++;
    if (additionalData?.type) completeness++;
    if (additionalData?.description) completeness++;
    
    return Math.round((completeness / totalFields) * 100);
  }

  /**
   * Calculate network participation percentage
   */
  static calculateNetworkParticipation(stats) {
    const maxValidators = 500; // Typical maximum
    return Math.min(100, (stats.validator_count / maxValidators) * 100);
  }

  /**
   * Merge multiple agent profiles (useful for data aggregation)
   */
  static mergeProfiles(profiles) {
    if (!profiles || profiles.length === 0) return null;
    if (profiles.length === 1) return profiles[0];
    
    const baseProfile = profiles[0];
    const mergedProfile = JSON.parse(JSON.stringify(baseProfile));
    
    // Take latest timestamp
    const latestTimestamp = profiles
      .map(p => new Date(p.metadata.updated_at))
      .sort((a, b) => b - a)[0]
      .toISOString();
    
    mergedProfile.metadata.updated_at = latestTimestamp;
    
    // Average numerical metrics
    const numericFields = ['overall_score', 'yield_score', 'activity_score', 'credibility_score'];
    numericFields.forEach(field => {
      const values = profiles.map(p => this.getNestedValue(p, field)).filter(v => v != null);
      if (values.length > 0) {
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        this.setNestedValue(mergedProfile, field, Math.round(avg));
      }
    });
    
    return mergedProfile;
  }

  /**
   * Get nested object value by dot notation
   */
  static getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Set nested object value by dot notation
   */
  static setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  /**
   * Validate and normalize agent profile data
   */
  static normalizeProfile(profile) {
    const normalized = JSON.parse(JSON.stringify(profile));
    
    // Ensure required fields exist
    if (!normalized.schema_version) normalized.schema_version = "1.0.0";
    if (!normalized.metadata) normalized.metadata = {};
    if (!normalized.metadata.profile_version) normalized.metadata.profile_version = "1.0.0";
    
    // Normalize scores to 0-100 range
    if (normalized.performance) {
      normalized.performance.overall_score = Math.max(0, Math.min(100, normalized.performance.overall_score || 0));
      if (normalized.performance.breakdown) {
        ['yield_score', 'activity_score', 'credibility_score'].forEach(field => {
          if (normalized.performance.breakdown[field] != null) {
            normalized.performance.breakdown[field] = Math.max(0, Math.min(100, normalized.performance.breakdown[field]));
          }
        });
      }
    }
    
    // Ensure timestamps are ISO strings
    const timestampFields = ['created_at', 'updated_at'];
    timestampFields.forEach(field => {
      if (normalized.metadata[field] && !(normalized.metadata[field] instanceof Date)) {
        normalized.metadata[field] = new Date(normalized.metadata[field]).toISOString();
      }
    });
    
    return normalized;
  }
}

module.exports = AgentProfileTransformer; 