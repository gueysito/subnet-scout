// test-ionet-integration.js - Test IO.net integration with Enhanced ScoreAgent
import dotenv from "dotenv";
import EnhancedScoreAgent from "./src/scoring/EnhancedScoreAgent.js";
import IONetClient from "./src/scoring/IONetClient.js";

// Load environment variables
dotenv.config();

console.log('🧪 Starting IO.net Integration Tests...\n');

// Mock subnet data for testing
const mockSubnetData = {
  subnet_id: 1,
  metrics: {
    emission_rate: 0.5,
    total_stake: 1000000,
    validator_count: 150,
    activity_score: 85,
    price_history: ["0.85", "0.90", "0.88", "0.92"]
  },
  timeframe: '24h'
};

const mockHistoricalData = {
  "7d": {
    average_score: 82,
    yield_trend: "increasing",
    activity_trend: "stable",
    validator_growth: 12
  },
  "30d": {
    average_score: 78,
    yield_trend: "increasing",
    activity_trend: "increasing", 
    validator_growth: 25
  }
};

const mockNetworkContext = {
  total_validators: 15000,
  market_conditions: "bullish",
  events: "Recent Bittensor upgrade improved network efficiency"
};

async function testIONetClient() {
  console.log('📡 Testing IO.net Client...');
  
  const apiKey = process.env.IONET_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  IONET_API_KEY not found in environment');
    console.log('   Set your IO.net API key to test real integration');
    console.log('   Skipping IO.net client tests...\n');
    return false;
  }
  
  try {
    const ionetClient = new IONetClient(apiKey);
    
    // Test 1: Model Health Check
    console.log('🔍 Testing model health check...');
    const health = await ionetClient.checkModelHealth();
    console.log('✅ Model health check passed');
    console.log(`   Available models:`, Object.keys(health).map(task => `${task}: ${health[task].available ? '✅' : '❌'}`));
    
    // Test 2: Basic inference request (if models are available)
    const sentimentModel = ionetClient.getModelForTask('sentiment');
    console.log(`\n🤖 Testing basic inference with ${sentimentModel}...`);
    
    const testResponse = await ionetClient.makeInferenceRequest(sentimentModel, [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello! This is a test of the IO.net integration.' }
    ], { maxTokens: 50 });
    
    console.log('✅ Basic inference test passed');
    console.log(`   Response: ${testResponse.content.substring(0, 100)}...`);
    console.log(`   Tokens used: ${testResponse.usage?.total_tokens || 'N/A'}`);
    
    return true;
    
  } catch (error) {
    console.log('❌ IO.net client test failed:', error.message);
    return false;
  }
}

async function testEnhancedScoreAgent() {
  console.log('\n🚀 Testing Enhanced ScoreAgent...');
  
  const claudeKey = process.env.VITE_ANTHROPIC_API_KEY;
  const ionetKey = process.env.IONET_API_KEY;
  
  if (!claudeKey) {
    console.log('❌ VITE_ANTHROPIC_API_KEY not found - cannot test Enhanced ScoreAgent');
    return false;
  }
  
  try {
    const enhancedAgent = new EnhancedScoreAgent(claudeKey, ionetKey);
    
    // Test 1: Enhancement Health Check
    console.log('🏥 Testing enhancement health check...');
    const healthStatus = await enhancedAgent.checkEnhancementHealth();
    console.log('✅ Enhancement health check completed');
    console.log(`   Status: ${healthStatus.status}`);
    console.log(`   Features enabled:`, Object.entries(enhancedAgent.enhancedFeatures)
      .map(([feature, enabled]) => `${feature}: ${enabled ? '✅' : '❌'}`)
      .join(', '));
    
    // Test 2: Basic Enhanced Score (without IO.net features if no key)
    console.log('\n📊 Testing basic enhanced score calculation...');
    const basicEnhancedScore = await enhancedAgent.calculateEnhancedScore(
      mockSubnetData.subnet_id,
      mockSubnetData.metrics,
      mockSubnetData.timeframe,
      { includeMarketSentiment: false, includeTrendPrediction: false, includeRiskRefinement: false }
    );
    
    console.log('✅ Basic enhanced score calculation passed');
    console.log(`   Overall Score: ${basicEnhancedScore.overall_score}/100`);
    console.log(`   Enhancement Level: ${basicEnhancedScore.enhancement_status?.enhancement_level || 'none'}`);
    
    // Test 3: Full Enhanced Score (if IO.net is available)
    if (ionetKey && healthStatus.status === 'active') {
      console.log('\n🤖 Testing full enhanced score with IO.net features...');
      
      const fullEnhancedScore = await enhancedAgent.calculateEnhancedScore(
        mockSubnetData.subnet_id,
        mockSubnetData.metrics,
        mockSubnetData.timeframe,
        {
          includeMarketSentiment: true,
          includeTrendPrediction: true,
          includeRiskRefinement: true,
          historicalData: mockHistoricalData,
          networkContext: mockNetworkContext
        }
      );
      
      console.log('✅ Full enhanced score with IO.net passed');
      console.log(`   Overall Score: ${fullEnhancedScore.overall_score}/100`);
      console.log(`   Enhancement Level: ${fullEnhancedScore.enhancement_status?.enhancement_level}`);
      console.log(`   Market Sentiment: ${fullEnhancedScore.enhanced_analysis?.market_sentiment ? '✅' : '❌'}`);
      console.log(`   Trend Prediction: ${fullEnhancedScore.enhanced_analysis?.performance_trends ? '✅' : '❌'}`);
      console.log(`   Risk Assessment: ${fullEnhancedScore.enhanced_analysis?.refined_risk_assessment ? '✅' : '❌'}`);
      
      if (fullEnhancedScore.enhanced_analysis?.market_sentiment) {
        console.log(`   Sentiment Analysis: ${fullEnhancedScore.enhanced_analysis.market_sentiment.sentiment_analysis.substring(0, 120)}...`);
      }
    } else {
      console.log('⚠️  IO.net key not available - skipping full enhanced features test');
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Enhanced ScoreAgent test failed:', error.message);
    console.log('   Stack:', error.stack?.split('\n').slice(0, 3).join('\n'));
    return false;
  }
}

async function testBatchEnhancedScoring() {
  console.log('\n📦 Testing Batch Enhanced Scoring...');
  
  const claudeKey = process.env.VITE_ANTHROPIC_API_KEY;
  const ionetKey = process.env.IONET_API_KEY;
  
  if (!claudeKey) {
    console.log('❌ VITE_ANTHROPIC_API_KEY not found - skipping batch test');
    return false;
  }
  
  try {
    const enhancedAgent = new EnhancedScoreAgent(claudeKey, ionetKey);
    
    // Create multiple subnet data for batch testing
    const batchSubnetData = {
      1: mockSubnetData.metrics,
      5: { ...mockSubnetData.metrics, validator_count: 85, activity_score: 72 },
      12: { ...mockSubnetData.metrics, validator_count: 220, activity_score: 91 }
    };
    
    console.log('📊 Testing batch enhanced scoring (3 subnets)...');
    
    const batchResult = await enhancedAgent.calculateBatchEnhancedScores(batchSubnetData, {
      timeframe: '24h',
      enhancementOptions: {
        includeMarketSentiment: !!ionetKey,
        includeTrendPrediction: false, // Skip to save tokens in test
        includeRiskRefinement: !!ionetKey
      },
      maxConcurrent: 2
    });
    
    console.log('✅ Batch enhanced scoring completed');
    console.log(`   Successful scores: ${batchResult.results.length}`);
    console.log(`   Errors: ${batchResult.errors.length}`);
    
    if (batchResult.results.length > 0) {
      const avgScore = batchResult.results.reduce((sum, result) => sum + result.overall_score, 0) / batchResult.results.length;
      console.log(`   Average score: ${Math.round(avgScore)}/100`);
      
      const enhancementLevels = batchResult.results.map(r => r.enhancement_status?.enhancement_level).filter(Boolean);
      if (enhancementLevels.length > 0) {
        console.log(`   Enhancement levels: ${enhancementLevels.join(', ')}`);
      }
    }
    
    if (batchResult.errors.length > 0) {
      console.log('   Errors:', batchResult.errors.map(e => `Subnet ${e.subnet_id}: ${e.error}`));
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Batch enhanced scoring test failed:', error.message);
    return false;
  }
}

async function testAPIEndpoints() {
  console.log('\n🌐 Testing Enhanced API Endpoints...');
  
  try {
    const baseUrl = 'http://localhost:8080';
    
    // Test 1: Enhancement Health Check
    console.log('🏥 Testing /api/health/enhancement endpoint...');
    
    const healthResponse = await fetch(`${baseUrl}/api/health/enhancement`);
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    console.log('✅ Enhancement health endpoint working');
    console.log(`   Status: ${healthData.enhancement_health?.status || 'unknown'}`);
    
    // Test 2: Enhanced Scoring Endpoint
    console.log('\n📊 Testing /api/score/enhanced endpoint...');
    
    const enhancedScoreResponse = await fetch(`${baseUrl}/api/score/enhanced`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subnet_id: mockSubnetData.subnet_id,
        metrics: mockSubnetData.metrics,
        timeframe: '24h',
        enhancement_options: {
          includeMarketSentiment: false, // Conservative test
          includeTrendPrediction: false,
          includeRiskRefinement: false
        }
      })
    });
    
    if (!enhancedScoreResponse.ok) {
      const errorData = await enhancedScoreResponse.json();
      throw new Error(`Enhanced scoring failed: ${errorData.error?.message || enhancedScoreResponse.status}`);
    }
    
    const enhancedScoreData = await enhancedScoreResponse.json();
    console.log('✅ Enhanced scoring endpoint working');
    console.log(`   Score: ${enhancedScoreData.overall_score}/100`);
    console.log(`   Enhancement level: ${enhancedScoreData.enhancement_status?.enhancement_level || 'none'}`);
    
    return true;
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  Backend server not running - start with "node pingAgent.js"');
      console.log('   Skipping API endpoint tests...');
      return false;
    }
    
    console.log('❌ API endpoint test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 IO.net Enhanced ScoreAgent Integration Test Suite');
  console.log('================================================\n');
  
  const testResults = {};
  
  // Run all tests
  testResults.ionetClient = await testIONetClient();
  testResults.enhancedScoreAgent = await testEnhancedScoreAgent();
  testResults.batchScoring = await testBatchEnhancedScoring();
  testResults.apiEndpoints = await testAPIEndpoints();
  
  // Summary
  console.log('\n🎯 Test Results Summary');
  console.log('========================');
  
  const passed = Object.values(testResults).filter(Boolean).length;
  const total = Object.keys(testResults).length;
  
  Object.entries(testResults).forEach(([test, passed]) => {
    console.log(`   ${test}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  });
  
  console.log(`\n📊 Overall: ${passed}/${total} tests passed (${Math.round(passed/total*100)}%)`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! IO.net integration is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the output above for details.');
  }
  
  console.log('\n💡 Tips:');
  console.log('   - Set IONET_API_KEY for full IO.net features');
  console.log('   - Start backend with "node pingAgent.js" for API tests');
  console.log('   - Check API quotas if getting rate limit errors');
  
  return passed === total;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test suite crashed:', error.message);
      process.exit(1);
    });
} 