/**
 * Agent Profile Validation Test Suite
 * Comprehensive tests for the agent profile validation system
 */

const fs = require('fs');
const path = require('path');
const AgentProfileValidator = require('./docs/agent-profile-validator');

class ValidationTestSuite {
  constructor() {
    this.validator = new AgentProfileValidator();
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
  }

  /**
   * Run all validation tests
   */
  async runAllTests() {
    console.log('🚀 Starting Agent Profile Validation Test Suite...\n');
    
    // Test 1: Schema Loading
    this.testSchemaLoading();
    
    // Test 2: Valid Profile Validation
    this.testValidProfiles();
    
    // Test 3: Invalid Profile Detection
    this.testInvalidProfiles();
    
    // Test 4: YAML Template Validation
    this.testYamlTemplates();
    
    // Test 5: Section-Specific Validation
    this.testSectionValidation();
    
    // Test 6: Edge Cases
    this.testEdgeCases();
    
    // Test 7: Performance Tests
    this.testPerformance();
    
    // Generate final report
    this.generateTestReport();
  }

  /**
   * Test schema loading functionality
   */
  testSchemaLoading() {
    this.runTest('Schema Loading', () => {
      const validator = new AgentProfileValidator();
      return validator.schema && validator.schema.type === 'object';
    });
  }

  /**
   * Test validation of valid profiles
   */
  testValidProfiles() {
    const validProfile = {
      schema_version: "1.0.0",
      identity: {
        subnet_id: 1,
        name: "Test Subnet",
        type: "inference",
        description: "Test subnet for validation",
        tags: ["test", "inference"]
      },
      metrics: {
        emission_rate: 1000.5,
        total_stake: 50000.75,
        validator_count: 100,
        activity_score: 85.2,
        network_participation: 78.5
      },
      performance: {
        overall_score: 87,
        breakdown: {
          yield_score: 89,
          activity_score: 85,
          credibility_score: 92
        },
        risk_assessment: {
          level: "low",
          factors: ["stable_validators", "consistent_yield"],
          confidence: 0.94
        },
        current_yield: 12.4,
        yield_change_24h: 0.8,
        validator_efficiency: 85.6
      },
      operational: {
        status: "healthy",
        last_updated: "2025-01-26T10:30:00Z"
      },
      metadata: {
        profile_version: "1.0.0",
        created_at: "2025-01-26T10:00:00Z",
        updated_at: "2025-01-26T10:30:00Z"
      }
    };

    this.runTest('Valid Profile Validation', () => {
      const result = this.validator.validateProfile(validProfile, 'test');
      return result.valid === true && result.errors.length === 0;
    });

    // Test with optional fields
    const profileWithOptionals = {
      ...validProfile,
      ai_analysis: {
        summary: "Test subnet performing well",
        strengths: ["High performance", "Stable operations"],
        concerns: ["Minor volatility"],
        recommendation: "strong_buy",
        confidence_score: 94,
        analysis_timestamp: "2025-01-26T10:30:00Z"
      }
    };

    this.runTest('Valid Profile with Optional Fields', () => {
      const result = this.validator.validateProfile(profileWithOptionals, 'test-optional');
      return result.valid === true;
    });
  }

  /**
   * Test detection of invalid profiles
   */
  testInvalidProfiles() {
    // Missing required fields
    const missingRequiredFields = {
      schema_version: "1.0.0",
      identity: {
        subnet_id: 1,
        name: "Test"
        // Missing 'type' field
      },
      metrics: {
        emission_rate: 1000,
        total_stake: 50000
        // Missing validator_count and activity_score
      }
    };

    this.runTest('Missing Required Fields Detection', () => {
      const result = this.validator.validateProfile(missingRequiredFields, 'test-missing');
      return result.valid === false && result.errors.length > 0;
    });

    // Invalid data types
    const invalidDataTypes = {
      schema_version: "1.0.0",
      identity: {
        subnet_id: "not_a_number", // Should be integer
        name: "Test",
        type: "inference"
      },
      metrics: {
        emission_rate: "invalid", // Should be number
        total_stake: 50000,
        validator_count: 100,
        activity_score: 85
      },
      performance: {
        overall_score: 150, // Should be <= 100
        breakdown: {
          yield_score: 89,
          activity_score: 85,
          credibility_score: 92
        },
        risk_assessment: {
          level: "invalid_level", // Should be enum value
          factors: []
        }
      },
      operational: {
        status: "healthy",
        last_updated: "2025-01-26T10:30:00Z"
      },
      metadata: {
        profile_version: "1.0.0",
        created_at: "2025-01-26T10:00:00Z"
      }
    };

    this.runTest('Invalid Data Types Detection', () => {
      const result = this.validator.validateProfile(invalidDataTypes, 'test-invalid-types');
      return result.valid === false && result.errors.length > 0;
    });

    // Out of range values
    const outOfRangeValues = {
      schema_version: "1.0.0",
      identity: {
        subnet_id: 150, // Should be <= 118
        name: "Test",
        type: "inference"
      },
      metrics: {
        emission_rate: 1000,
        total_stake: 50000,
        validator_count: 100,
        activity_score: 150 // Should be <= 100
      },
      performance: {
        overall_score: 87,
        breakdown: {
          yield_score: 89,
          activity_score: 85,
          credibility_score: 92
        },
        risk_assessment: {
          level: "low",
          factors: [],
          confidence: 1.5 // Should be <= 1
        }
      },
      operational: {
        status: "healthy",
        last_updated: "2025-01-26T10:30:00Z"
      },
      metadata: {
        profile_version: "1.0.0",
        created_at: "2025-01-26T10:00:00Z"
      }
    };

    this.runTest('Out of Range Values Detection', () => {
      const result = this.validator.validateProfile(outOfRangeValues, 'test-out-of-range');
      return result.valid === false && result.errors.length > 0;
    });
  }

  /**
   * Test validation of YAML templates
   */
  testYamlTemplates() {
    const templatesDir = path.join(__dirname, 'docs', 'agent-profiles');
    
    // Check if templates directory exists
    if (!fs.existsSync(templatesDir)) {
      this.runTest('YAML Templates Directory Exists', () => false);
      return;
    }

    this.runTest('YAML Templates Directory Exists', () => true);

    // Test each template file
    const templateFiles = [
      'high-performer.yaml',
      'moderate-performer.yaml',
      'low-performer.yaml',
      'new-subnet.yaml'
    ];

    templateFiles.forEach(filename => {
      const filepath = path.join(templatesDir, filename);
      if (fs.existsSync(filepath)) {
        this.runTest(`YAML Template: ${filename}`, () => {
          const result = this.validator.validateYamlFile(filepath);
          return result.valid;
        });
      } else {
        this.runTest(`YAML Template: ${filename}`, () => false);
      }
    });
  }

  /**
   * Test section-specific validation
   */
  testSectionValidation() {
    const testProfile = {
      identity: {
        subnet_id: 1,
        name: "Test Subnet",
        type: "inference"
      },
      metrics: {
        emission_rate: 1000,
        total_stake: 50000,
        validator_count: 100,
        activity_score: 85
      },
      performance: {
        overall_score: 87,
        breakdown: {
          yield_score: 89,
          activity_score: 85,
          credibility_score: 92
        },
        risk_assessment: {
          level: "low",
          factors: []
        }
      },
      ai_analysis: {
        summary: "Test analysis",
        recommendation: "buy",
        confidence_score: 85
      },
      operational: {
        status: "healthy",
        last_updated: "2025-01-26T10:30:00Z"
      },
      metadata: {
        profile_version: "1.0.0",
        created_at: "2025-01-26T10:00:00Z"
      }
    };

    // Test each section
    const sections = this.validator.validateSections(testProfile);
    
    Object.keys(sections).forEach(sectionName => {
      this.runTest(`Section Validation: ${sectionName}`, () => {
        return sections[sectionName].valid;
      });
    });
  }

  /**
   * Test edge cases and boundary conditions
   */
  testEdgeCases() {
    // Empty profile
    this.runTest('Empty Profile Rejection', () => {
      const result = this.validator.validateProfile({}, 'empty');
      return result.valid === false;
    });

    // Null profile
    this.runTest('Null Profile Rejection', () => {
      const result = this.validator.validateProfile(null, 'null');
      return result.valid === false;
    });

    // Profile with extra fields (should be allowed)
    const profileWithExtraFields = {
      schema_version: "1.0.0",
      identity: {
        subnet_id: 1,
        name: "Test",
        type: "inference",
        extra_field: "should be allowed"
      },
      metrics: {
        emission_rate: 1000,
        total_stake: 50000,
        validator_count: 100,
        activity_score: 85
      },
      performance: {
        overall_score: 87,
        breakdown: {
          yield_score: 89,
          activity_score: 85,
          credibility_score: 92
        },
        risk_assessment: {
          level: "low",
          factors: []
        }
      },
      operational: {
        status: "healthy",
        last_updated: "2025-01-26T10:30:00Z"
      },
      metadata: {
        profile_version: "1.0.0",
        created_at: "2025-01-26T10:00:00Z"
      },
      custom_section: {
        custom_field: "custom_value"
      }
    };

    this.runTest('Extra Fields Acceptance', () => {
      const result = this.validator.validateProfile(profileWithExtraFields, 'extra-fields');
      return result.valid === true;
    });

    // Boundary values
    const boundaryValues = {
      schema_version: "1.0.0",
      identity: {
        subnet_id: 118, // Maximum allowed
        name: "A", // Minimum length
        type: "inference"
      },
      metrics: {
        emission_rate: 0, // Minimum allowed
        total_stake: 0, // Minimum allowed
        validator_count: 0, // Minimum allowed
        activity_score: 100 // Maximum allowed
      },
      performance: {
        overall_score: 100, // Maximum allowed
        breakdown: {
          yield_score: 0, // Minimum allowed
          activity_score: 100, // Maximum allowed
          credibility_score: 50
        },
        risk_assessment: {
          level: "critical", // Valid enum value
          factors: [],
          confidence: 1.0 // Maximum allowed
        }
      },
      operational: {
        status: "maintenance", // Valid enum value
        last_updated: "2025-01-26T10:30:00Z"
      },
      metadata: {
        profile_version: "1.0.0",
        created_at: "2025-01-26T10:00:00Z"
      }
    };

    this.runTest('Boundary Values Acceptance', () => {
      const result = this.validator.validateProfile(boundaryValues, 'boundary');
      return result.valid === true;
    });
  }

  /**
   * Test validation performance
   */
  testPerformance() {
    const testProfile = {
      schema_version: "1.0.0",
      identity: {
        subnet_id: 1,
        name: "Performance Test",
        type: "inference"
      },
      metrics: {
        emission_rate: 1000,
        total_stake: 50000,
        validator_count: 100,
        activity_score: 85
      },
      performance: {
        overall_score: 87,
        breakdown: {
          yield_score: 89,
          activity_score: 85,
          credibility_score: 92
        },
        risk_assessment: {
          level: "low",
          factors: []
        }
      },
      operational: {
        status: "healthy",
        last_updated: "2025-01-26T10:30:00Z"
      },
      metadata: {
        profile_version: "1.0.0",
        created_at: "2025-01-26T10:00:00Z"
      }
    };

    // Test validation speed
    const iterations = 1000;
    const startTime = Date.now();
    
    for (let i = 0; i < iterations; i++) {
      this.validator.validateProfile(testProfile, `perf-test-${i}`);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    const avgTime = duration / iterations;

    this.runTest('Performance: Validation Speed', () => {
      console.log(`    Validated ${iterations} profiles in ${duration}ms (avg: ${avgTime.toFixed(2)}ms per profile)`);
      return avgTime < 10; // Should be under 10ms per profile
    });
  }

  /**
   * Run a single test
   */
  runTest(testName, testFn) {
    this.totalTests++;
    
    try {
      const result = testFn();
      if (result) {
        this.passedTests++;
        console.log(`✅ ${testName}`);
        this.testResults.push({ name: testName, passed: true });
      } else {
        console.log(`❌ ${testName}`);
        this.testResults.push({ name: testName, passed: false });
      }
    } catch (error) {
      console.log(`❌ ${testName} - Error: ${error.message}`);
      this.testResults.push({ name: testName, passed: false, error: error.message });
    }
  }

  /**
   * Generate final test report
   */
  generateTestReport() {
    const successRate = ((this.passedTests / this.totalTests) * 100).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 AGENT PROFILE VALIDATION TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.totalTests}`);
    console.log(`Passed: ${this.passedTests}`);
    console.log(`Failed: ${this.totalTests - this.passedTests}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log('='.repeat(60));
    
    if (this.passedTests === this.totalTests) {
      console.log('🎉 All tests passed! Agent Profile validation system is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the validation system.');
      
      const failedTests = this.testResults.filter(t => !t.passed);
      console.log('\nFailed Tests:');
      failedTests.forEach(test => {
        console.log(`  • ${test.name}${test.error ? ` - ${test.error}` : ''}`);
      });
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new ValidationTestSuite();
  testSuite.runAllTests().catch(console.error);
}

module.exports = ValidationTestSuite; 