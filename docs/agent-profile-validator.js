/**
 * Agent Profile Validator
 * Comprehensive validation utility for agent profiles using JSON Schema
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

class AgentProfileValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(this.ajv);
    
    // Load the JSON schema
    this.schema = this.loadSchema();
    this.validate = this.ajv.compile(this.schema);
    
    // Validation statistics
    this.stats = {
      total: 0,
      valid: 0,
      invalid: 0,
      errors: []
    };
  }

  /**
   * Load the agent profile JSON schema
   */
  loadSchema() {
    try {
      const schemaPath = path.join(__dirname, 'agent-profile.schema.json');
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      return JSON.parse(schemaContent);
    } catch (error) {
      throw new Error(`Failed to load schema: ${error.message}`);
    }
  }

  /**
   * Validate a single agent profile
   * @param {Object} profile - Agent profile data
   * @param {string} source - Source identifier (for error reporting)
   * @returns {Object} Validation result
   */
  validateProfile(profile, source = 'unknown') {
    this.stats.total++;
    
    const isValid = this.validate(profile);
    
    if (isValid) {
      this.stats.valid++;
      return {
        valid: true,
        source,
        profile: profile.identity ? profile.identity.name : 'Unknown',
        errors: []
      };
    } else {
      this.stats.invalid++;
      const errors = this.formatErrors(this.validate.errors);
      this.stats.errors.push({ source, errors });
      
      return {
        valid: false,
        source,
        profile: profile.identity ? profile.identity.name : 'Unknown',
        errors
      };
    }
  }

  /**
   * Validate YAML profile file
   * @param {string} filePath - Path to YAML file
   * @returns {Object} Validation result
   */
  validateYamlFile(filePath) {
    try {
      const yamlContent = fs.readFileSync(filePath, 'utf8');
      const profile = yaml.load(yamlContent);
      return this.validateProfile(profile, filePath);
    } catch (error) {
      this.stats.total++;
      this.stats.invalid++;
      
      return {
        valid: false,
        source: filePath,
        profile: 'Parse Error',
        errors: [`YAML parsing error: ${error.message}`]
      };
    }
  }

  /**
   * Validate JSON profile file
   * @param {string} filePath - Path to JSON file
   * @returns {Object} Validation result
   */
  validateJsonFile(filePath) {
    try {
      const jsonContent = fs.readFileSync(filePath, 'utf8');
      const profile = JSON.parse(jsonContent);
      return this.validateProfile(profile, filePath);
    } catch (error) {
      this.stats.total++;
      this.stats.invalid++;
      
      return {
        valid: false,
        source: filePath,
        profile: 'Parse Error',
        errors: [`JSON parsing error: ${error.message}`]
      };
    }
  }

  /**
   * Validate all profile files in a directory
   * @param {string} dirPath - Directory path
   * @param {Array} extensions - File extensions to validate (default: ['.yaml', '.yml', '.json'])
   * @returns {Array} Array of validation results
   */
  validateDirectory(dirPath, extensions = ['.yaml', '.yml', '.json']) {
    const results = [];
    
    try {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const ext = path.extname(file).toLowerCase();
        
        if (extensions.includes(ext)) {
          if (ext === '.json') {
            results.push(this.validateJsonFile(filePath));
          } else if (ext === '.yaml' || ext === '.yml') {
            results.push(this.validateYamlFile(filePath));
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}: ${error.message}`);
    }
    
    return results;
  }

  /**
   * Format validation errors for human readability
   * @param {Array} errors - AJV validation errors
   * @returns {Array} Formatted error messages
   */
  formatErrors(errors) {
    return errors.map(error => {
      const path = error.instancePath || 'root';
      const message = error.message;
      const allowedValues = error.params?.allowedValues;
      
      let formatted = `${path}: ${message}`;
      
      if (allowedValues) {
        formatted += ` (allowed: ${allowedValues.join(', ')})`;
      }
      
      if (error.params?.missingProperty) {
        formatted += ` (missing: ${error.params.missingProperty})`;
      }
      
      return formatted;
    });
  }

  /**
   * Get validation statistics
   * @returns {Object} Validation statistics
   */
  getStats() {
    return {
      ...this.stats,
      successRate: this.stats.total > 0 ? (this.stats.valid / this.stats.total * 100).toFixed(2) : 0
    };
  }

  /**
   * Generate detailed validation report
   * @param {Array} results - Validation results
   * @returns {string} Formatted report
   */
  generateReport(results) {
    const stats = this.getStats();
    let report = `\n=== AGENT PROFILE VALIDATION REPORT ===\n`;
    report += `Total Profiles: ${stats.total}\n`;
    report += `Valid: ${stats.valid}\n`;
    report += `Invalid: ${stats.invalid}\n`;
    report += `Success Rate: ${stats.successRate}%\n\n`;
    
    // Valid profiles
    const validProfiles = results.filter(r => r.valid);
    if (validProfiles.length > 0) {
      report += `✅ VALID PROFILES (${validProfiles.length}):\n`;
      validProfiles.forEach(result => {
        report += `  • ${result.profile} (${path.basename(result.source)})\n`;
      });
      report += '\n';
    }
    
    // Invalid profiles
    const invalidProfiles = results.filter(r => !r.valid);
    if (invalidProfiles.length > 0) {
      report += `❌ INVALID PROFILES (${invalidProfiles.length}):\n`;
      invalidProfiles.forEach(result => {
        report += `  • ${result.profile} (${path.basename(result.source)}):\n`;
        result.errors.forEach(error => {
          report += `    - ${error}\n`;
        });
        report += '\n';
      });
    }
    
    return report;
  }

  /**
   * Validate specific schema sections
   * @param {Object} profile - Agent profile data
   * @returns {Object} Section-specific validation results
   */
  validateSections(profile) {
    const sections = {
      identity: this.validateIdentitySection(profile.identity),
      metrics: this.validateMetricsSection(profile.metrics),
      performance: this.validatePerformanceSection(profile.performance),
      ai_analysis: this.validateAiAnalysisSection(profile.ai_analysis),
      operational: this.validateOperationalSection(profile.operational),
      metadata: this.validateMetadataSection(profile.metadata)
    };
    
    return sections;
  }

  /**
   * Validate identity section
   */
  validateIdentitySection(identity) {
    const errors = [];
    
    if (!identity) {
      return { valid: false, errors: ['Identity section is required'] };
    }
    
    // Check required fields
    if (!identity.subnet_id || identity.subnet_id < 1 || identity.subnet_id > 118) {
      errors.push('subnet_id must be between 1 and 118');
    }
    
    if (!identity.name || identity.name.length === 0) {
      errors.push('name is required and cannot be empty');
    }
    
    if (!identity.type || !['inference', 'training', 'data', 'storage', 'compute', 'hybrid'].includes(identity.type)) {
      errors.push('type must be one of: inference, training, data, storage, compute, hybrid');
    }
    
    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate metrics section
   */
  validateMetricsSection(metrics) {
    const errors = [];
    
    if (!metrics) {
      return { valid: false, errors: ['Metrics section is required'] };
    }
    
    const required = ['emission_rate', 'total_stake', 'validator_count', 'activity_score'];
    for (const field of required) {
      if (typeof metrics[field] !== 'number' || metrics[field] < 0) {
        errors.push(`${field} must be a non-negative number`);
      }
    }
    
    if (metrics.activity_score > 100) {
      errors.push('activity_score cannot exceed 100');
    }
    
    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate performance section
   */
  validatePerformanceSection(performance) {
    const errors = [];
    
    if (!performance) {
      return { valid: false, errors: ['Performance section is required'] };
    }
    
    // Check overall score
    if (typeof performance.overall_score !== 'number' || performance.overall_score < 0 || performance.overall_score > 100) {
      errors.push('overall_score must be between 0 and 100');
    }
    
    // Check breakdown scores
    if (performance.breakdown) {
      ['yield_score', 'activity_score', 'credibility_score'].forEach(score => {
        if (typeof performance.breakdown[score] !== 'number' || performance.breakdown[score] < 0 || performance.breakdown[score] > 100) {
          errors.push(`breakdown.${score} must be between 0 and 100`);
        }
      });
    }
    
    // Check risk assessment
    if (!performance.risk_assessment || !['low', 'medium', 'high', 'critical'].includes(performance.risk_assessment.level)) {
      errors.push('risk_assessment.level must be one of: low, medium, high, critical');
    }
    
    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate AI analysis section
   */
  validateAiAnalysisSection(aiAnalysis) {
    const errors = [];
    
    if (!aiAnalysis) {
      return { valid: true, errors: [] }; // AI analysis is optional
    }
    
    if (aiAnalysis.recommendation && !['strong_buy', 'buy', 'hold', 'caution', 'avoid'].includes(aiAnalysis.recommendation)) {
      errors.push('recommendation must be one of: strong_buy, buy, hold, caution, avoid');
    }
    
    if (typeof aiAnalysis.confidence_score === 'number' && (aiAnalysis.confidence_score < 0 || aiAnalysis.confidence_score > 100)) {
      errors.push('confidence_score must be between 0 and 100');
    }
    
    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate operational section
   */
  validateOperationalSection(operational) {
    const errors = [];
    
    if (!operational) {
      return { valid: false, errors: ['Operational section is required'] };
    }
    
    if (!['healthy', 'warning', 'critical', 'offline', 'maintenance'].includes(operational.status)) {
      errors.push('status must be one of: healthy, warning, critical, offline, maintenance');
    }
    
    if (!operational.last_updated) {
      errors.push('last_updated is required');
    }
    
    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate metadata section
   */
  validateMetadataSection(metadata) {
    const errors = [];
    
    if (!metadata) {
      return { valid: false, errors: ['Metadata section is required'] };
    }
    
    if (!metadata.profile_version) {
      errors.push('profile_version is required');
    }
    
    if (!metadata.created_at) {
      errors.push('created_at is required');
    }
    
    return { valid: errors.length === 0, errors };
  }

  /**
   * Reset validation statistics
   */
  resetStats() {
    this.stats = {
      total: 0,
      valid: 0,
      invalid: 0,
      errors: []
    };
  }
}

// Export for use in other modules
module.exports = AgentProfileValidator;

// CLI usage example
if (require.main === module) {
  const validator = new AgentProfileValidator();
  
  // Validate the example YAML templates
  const templatesDir = path.join(__dirname, 'agent-profiles');
  const results = validator.validateDirectory(templatesDir);
  
  console.log(validator.generateReport(results));
  
  // Example of validating a single profile
  const exampleProfile = {
    schema_version: "1.0.0",
    identity: {
      subnet_id: 1,
      name: "Test Subnet",
      type: "inference"
    },
    metrics: {
      emission_rate: 1000,
      total_stake: 50000,
      validator_count: 100,
      activity_score: 75
    },
    performance: {
      overall_score: 80,
      breakdown: {
        yield_score: 85,
        activity_score: 75,
        credibility_score: 80
      },
      risk_assessment: {
        level: "low",
        factors: ["stable_operation"]
      }
    },
    operational: {
      status: "healthy",
      last_updated: new Date().toISOString()
    },
    metadata: {
      profile_version: "1.0.0",
      created_at: new Date().toISOString()
    }
  };
  
  const singleResult = validator.validateProfile(exampleProfile, 'example');
  console.log('\n=== SINGLE PROFILE VALIDATION ===');
  console.log(`Valid: ${singleResult.valid}`);
  if (!singleResult.valid) {
    console.log('Errors:', singleResult.errors);
  }
} 