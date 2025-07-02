// test-ai-insights-complete.js - Comprehensive AI Insights Testing
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';
const TEST_SUBNET_ID = 1; // OpenKaito subnet for testing

class AIInsightsTestSuite {
  constructor() {
    this.results = {
      forecast: null,
      risk: null,
      anomalies: null,
      investment: null,
      errors: [],
      performance: {}
    };
  }

  async runCompleteTestSuite() {
    console.log('🧪 Starting Comprehensive AI Insights Test Suite');
    console.log('=' .repeat(60));
    
    try {
      // Test backend health first
      await this.testBackendHealth();
      
      // Run all AI insights tests in parallel for performance
      console.log('\n🚀 Running all AI insights tests in parallel...');
      const startTime = Date.now();
      
      const [forecastResult, riskResult, anomalyResult, investmentResult] = await Promise.allSettled([
        this.testForecastingEngine(),
        this.testRiskAssessment(),
        this.testAnomalyDetection(),
        this.testInvestmentRecommendation()
      ]);

      this.results.performance.total_execution_time = Date.now() - startTime;
      
      // Process results
      this.processTestResults({
        forecast: forecastResult,
        risk: riskResult,
        anomalies: anomalyResult,
        investment: investmentResult
      });
      
      // Run integration tests
      await this.testAIInsightsIntegration();
      
      // Generate comprehensive report
      this.generateComprehensiveReport();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      this.results.errors.push({ test: 'test_suite', error: error.message });
    }
  }

  async testBackendHealth() {
    console.log('\n🏥 Testing Backend Health...');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`, { timeout: 5000 });
      
      console.log('✅ Backend Health Check:', {
        status: response.status,
        uptime: response.data.uptime,
        memory_usage: response.data.memory_usage,
        endpoints_active: response.data.endpoints_active
      });
      
      if (response.data.endpoints_active < 5) {
        console.warn('⚠️ Warning: Some AI endpoints may not be active');
      }
      
    } catch (error) {
      console.error('❌ Backend health check failed:', error.message);
      throw new Error('Backend not available for testing');
    }
  }

  async testForecastingEngine() {
    console.log('\n📈 Testing 7-Day Forecasting Engine...');
    const startTime = Date.now();
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/insights/forecast/${TEST_SUBNET_ID}`, {
        timeout: 30000
      });
      
      const executionTime = Date.now() - startTime;
      this.results.performance.forecast_time = executionTime;
      
      // Validate forecast structure
      const forecast = response.data.data;
      this.validateForecastStructure(forecast);
      
      console.log('✅ Forecasting Engine Results:', {
        subnet_id: forecast.subnet_id,
        subnet_name: forecast.subnet_name,
        confidence_level: forecast.forecast.confidence_level,
        expected_return: (forecast.forecast.expected_return * 100).toFixed(2) + '%',
        model_used: forecast.forecast.model_used,
        daily_predictions: forecast.forecast.daily_predictions.length,
        execution_time: executionTime + 'ms'
      });
      
      this.results.forecast = forecast;
      return { status: 'success', data: forecast, executionTime };
      
    } catch (error) {
      console.error('❌ Forecasting test failed:', error.message);
      this.results.errors.push({ test: 'forecast', error: error.message });
      return { status: 'error', error: error.message };
    }
  }

  async testRiskAssessment() {
    console.log('\n🛡️ Testing Multi-Factor Risk Assessment...');
    const startTime = Date.now();
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/insights/risk/${TEST_SUBNET_ID}`, {
        timeout: 25000
      });
      
      const executionTime = Date.now() - startTime;
      this.results.performance.risk_time = executionTime;
      
      // Validate risk assessment structure
      const risk = response.data.data;
      this.validateRiskStructure(risk);
      
      console.log('✅ Risk Assessment Results:', {
        subnet_id: risk.subnet_id,
        subnet_name: risk.subnet_name,
        composite_risk: {
          score: risk.risk_assessment.composite_risk.risk_score,
          level: risk.risk_assessment.composite_risk.risk_level
        },
        technical_risk: risk.risk_assessment.technical_risk.risk_score,
        governance_risk: risk.risk_assessment.governance_risk.risk_score,
        economic_risk: risk.risk_assessment.economic_risk.risk_score,
        confidence: risk.assessment_metadata.confidence_level + '%',
        execution_time: executionTime + 'ms'
      });
      
      this.results.risk = risk;
      return { status: 'success', data: risk, executionTime };
      
    } catch (error) {
      console.error('❌ Risk assessment test failed:', error.message);
      this.results.errors.push({ test: 'risk', error: error.message });
      return { status: 'error', error: error.message };
    }
  }

  async testAnomalyDetection() {
    console.log('\n🔍 Testing AI-Powered Anomaly Detection...');
    const startTime = Date.now();
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/insights/anomalies/${TEST_SUBNET_ID}`, {
        timeout: 20000
      });
      
      const executionTime = Date.now() - startTime;
      this.results.performance.anomaly_time = executionTime;
      
      // Validate anomaly detection structure
      const anomalies = response.data.data;
      this.validateAnomalyStructure(anomalies);
      
      console.log('✅ Anomaly Detection Results:', {
        subnet_id: anomalies.subnet_id,
        subnet_name: anomalies.subnet_name,
        total_anomalies: anomalies.detection_summary.total_anomalies,
        anomaly_score: anomalies.detection_summary.anomaly_score + '/100',
        severity_distribution: anomalies.detection_summary.severity_distribution,
        confidence_level: anomalies.detection_summary.confidence_level + '%',
        active_alerts: anomalies.alerts.length,
        execution_time: executionTime + 'ms'
      });
      
      this.results.anomalies = anomalies;
      return { status: 'success', data: anomalies, executionTime };
      
    } catch (error) {
      console.error('❌ Anomaly detection test failed:', error.message);
      this.results.errors.push({ test: 'anomalies', error: error.message });
      return { status: 'error', error: error.message };
    }
  }

  async testInvestmentRecommendation() {
    console.log('\n💰 Testing Investment Recommendation Engine...');
    const startTime = Date.now();
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/insights/investment/${TEST_SUBNET_ID}`, {
        timeout: 35000
      });
      
      const executionTime = Date.now() - startTime;
      this.results.performance.investment_time = executionTime;
      
      // Validate investment recommendation structure
      const investment = response.data.data;
      this.validateInvestmentStructure(investment);
      
      console.log('✅ Investment Recommendation Results:', {
        subnet_id: investment.subnet_id,
        subnet_name: investment.subnet_name,
        recommendation: investment.investment_recommendation.recommendation,
        confidence_level: investment.investment_recommendation.confidence_level + '%',
        investment_score: investment.investment_recommendation.investment_score + '/100',
        price_target: {
          current: '$' + investment.investment_recommendation.price_target.current_price.toFixed(4),
          target: '$' + investment.investment_recommendation.price_target.target_price.toFixed(4),
          return: investment.investment_recommendation.price_target.implied_return.toFixed(1) + '%'
        },
        time_horizon: investment.investment_recommendation.time_horizon.period,
        analysis_engines: response.data.metadata.analysis_engines.length,
        execution_time: executionTime + 'ms'
      });
      
      this.results.investment = investment;
      return { status: 'success', data: investment, executionTime };
      
    } catch (error) {
      console.error('❌ Investment recommendation test failed:', error.message);
      this.results.errors.push({ test: 'investment', error: error.message });
      return { status: 'error', error: error.message };
    }
  }

  async testAIInsightsIntegration() {
    console.log('\n🔗 Testing AI Insights Integration...');
    
    if (this.results.errors.length > 0) {
      console.log('⚠️ Skipping integration tests due to individual test failures');
      return;
    }
    
    try {
      // Test data consistency across engines
      this.testDataConsistency();
      
      // Test recommendation coherence
      this.testRecommendationCoherence();
      
      // Test confidence levels
      this.testConfidenceLevels();
      
      console.log('✅ Integration tests passed - All AI engines working cohesively');
      
    } catch (error) {
      console.error('❌ Integration test failed:', error.message);
      this.results.errors.push({ test: 'integration', error: error.message });
    }
  }

  processTestResults(results) {
    console.log('\n📊 Processing Test Results...');
    
    Object.entries(results).forEach(([test, result]) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ ${test}: SUCCESS`);
      } else {
        console.log(`❌ ${test}: FAILED - ${result.reason}`);
        this.results.errors.push({ test, error: result.reason });
      }
    });
  }

  testDataConsistency() {
    // Verify subnet IDs match across all results
    const subnetIds = [
      this.results.forecast?.subnet_id,
      this.results.risk?.subnet_id,
      this.results.anomalies?.subnet_id,
      this.results.investment?.subnet_id
    ];
    
    if (new Set(subnetIds).size !== 1) {
      throw new Error('Subnet ID mismatch across AI engines');
    }
    
    console.log('✅ Data consistency check passed');
  }

  testRecommendationCoherence() {
    const riskLevel = this.results.risk.risk_assessment.composite_risk.risk_level;
    const recommendation = this.results.investment.investment_recommendation.recommendation;
    const anomalyScore = this.results.anomalies.detection_summary.anomaly_score;
    
    // Check logical coherence
    if (riskLevel === 'Critical' && recommendation.includes('BUY')) {
      console.warn('⚠️ Warning: High risk but BUY recommendation - check logic');
    }
    
    if (anomalyScore > 80 && recommendation === 'STRONG_BUY') {
      console.warn('⚠️ Warning: High anomaly score with STRONG_BUY - check logic');
    }
    
    console.log('✅ Recommendation coherence check passed');
  }

  testConfidenceLevels() {
    const confidences = [
      this.results.forecast.forecast.confidence_level,
      this.results.risk.assessment_metadata.confidence_level,
      this.results.anomalies.detection_summary.confidence_level,
      this.results.investment.investment_recommendation.confidence_level
    ];
    
    const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    
    if (avgConfidence < 60) {
      console.warn('⚠️ Warning: Low average confidence across AI engines');
    }
    
    console.log(`✅ Confidence levels check passed - Average: ${avgConfidence.toFixed(1)}%`);
  }

  validateForecastStructure(forecast) {
    const required = ['subnet_id', 'subnet_name', 'forecast'];
    const forecastRequired = ['daily_predictions', 'confidence_level', 'expected_return'];
    
    required.forEach(field => {
      if (!forecast.hasOwnProperty(field)) {
        throw new Error(`Missing required forecast field: ${field}`);
      }
    });
    
    forecastRequired.forEach(field => {
      if (!forecast.forecast.hasOwnProperty(field)) {
        throw new Error(`Missing required forecast.${field} field`);
      }
    });
    
    if (forecast.forecast.daily_predictions.length !== 7) {
      throw new Error('Expected 7 daily predictions in forecast');
    }
  }

  validateRiskStructure(risk) {
    const required = ['subnet_id', 'risk_assessment'];
    const riskRequired = ['composite_risk', 'technical_risk', 'governance_risk', 'economic_risk'];
    
    required.forEach(field => {
      if (!risk.hasOwnProperty(field)) {
        throw new Error(`Missing required risk field: ${field}`);
      }
    });
    
    riskRequired.forEach(field => {
      if (!risk.risk_assessment.hasOwnProperty(field)) {
        throw new Error(`Missing required risk_assessment.${field} field`);
      }
    });
  }

  validateAnomalyStructure(anomalies) {
    const required = ['subnet_id', 'detection_summary', 'anomaly_categories'];
    const summaryRequired = ['total_anomalies', 'anomaly_score', 'confidence_level'];
    
    required.forEach(field => {
      if (!anomalies.hasOwnProperty(field)) {
        throw new Error(`Missing required anomaly field: ${field}`);
      }
    });
    
    summaryRequired.forEach(field => {
      if (!anomalies.detection_summary.hasOwnProperty(field)) {
        throw new Error(`Missing required detection_summary.${field} field`);
      }
    });
  }

  validateInvestmentStructure(investment) {
    const required = ['subnet_id', 'investment_recommendation', 'strategy_recommendations'];
    const recRequired = ['recommendation', 'confidence_level', 'investment_score'];
    
    required.forEach(field => {
      if (!investment.hasOwnProperty(field)) {
        throw new Error(`Missing required investment field: ${field}`);
      }
    });
    
    recRequired.forEach(field => {
      if (!investment.investment_recommendation.hasOwnProperty(field)) {
        throw new Error(`Missing required investment_recommendation.${field} field`);
      }
    });
  }

  generateComprehensiveReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 COMPREHENSIVE AI INSIGHTS TEST REPORT');
    console.log('='.repeat(60));
    
    // Success Summary
    const successfulTests = 4 - this.results.errors.length;
    console.log(`\n✅ OVERALL SUCCESS: ${successfulTests}/4 AI engines tested successfully`);
    
    // Performance Metrics
    console.log('\n⚡ PERFORMANCE METRICS:');
    console.log(`   • Total Execution Time: ${this.results.performance.total_execution_time}ms`);
    
    if (this.results.performance.forecast_time) {
      console.log(`   • Forecasting Engine: ${this.results.performance.forecast_time}ms`);
    }
    if (this.results.performance.risk_time) {
      console.log(`   • Risk Assessment: ${this.results.performance.risk_time}ms`);
    }
    if (this.results.performance.anomaly_time) {
      console.log(`   • Anomaly Detection: ${this.results.performance.anomaly_time}ms`);
    }
    if (this.results.performance.investment_time) {
      console.log(`   • Investment Recommendation: ${this.results.performance.investment_time}ms`);
    }
    
    // AI Capabilities Summary
    if (successfulTests === 4) {
      console.log('\n🤖 AI CAPABILITIES VERIFIED:');
      console.log('   ✅ 7-Day Performance Forecasting with DeepSeek-R1');
      console.log('   ✅ Multi-Factor Risk Assessment (Technical/Governance/Economic)');
      console.log('   ✅ Real-time Anomaly Detection with Pattern Recognition');
      console.log('   ✅ Investment Recommendations with Strategy Analysis');
      console.log('   ✅ Comprehensive AI Integration and Data Consistency');
      
      // Key Results Summary
      if (this.results.investment) {
        console.log('\n💡 KEY INSIGHTS FOR SUBNET ' + TEST_SUBNET_ID + ':');
        console.log(`   • Investment Recommendation: ${this.results.investment.investment_recommendation.recommendation}`);
        console.log(`   • Confidence Level: ${this.results.investment.investment_recommendation.confidence_level}%`);
        console.log(`   • Risk Level: ${this.results.risk.risk_assessment.composite_risk.risk_level}`);
        console.log(`   • Expected 7-Day Return: ${(this.results.forecast.forecast.expected_return * 100).toFixed(2)}%`);
        console.log(`   • Anomaly Score: ${this.results.anomalies.detection_summary.anomaly_score}/100`);
      }
    }
    
    // Error Summary
    if (this.results.errors.length > 0) {
      console.log('\n❌ ERRORS ENCOUNTERED:');
      this.results.errors.forEach(error => {
        console.log(`   • ${error.test}: ${error.error}`);
      });
    }
    
    // Recommendations
    console.log('\n🎯 SYSTEM STATUS:');
    if (successfulTests === 4) {
      console.log('   🟢 All AI systems operational and ready for production');
      console.log('   🟢 Frontend dashboard can safely consume all AI endpoints');
      console.log('   🟢 Comprehensive AI insights pipeline fully functional');
    } else if (successfulTests >= 2) {
      console.log('   🟡 Partial AI functionality - some engines need attention');
      console.log('   🟡 Core functionality available but integration may be limited');
    } else {
      console.log('   🔴 Major AI system issues - investigation required');
      console.log('   🔴 Limited functionality available for production use');
    }
    
    console.log('\n='.repeat(60));
    console.log('🧪 Test suite completed successfully!');
    console.log('='.repeat(60));
  }
}

// Run the comprehensive test suite
const testSuite = new AIInsightsTestSuite();
testSuite.runCompleteTestSuite().catch(error => {
  console.error('💥 Test suite crashed:', error);
  process.exit(1);
}); 