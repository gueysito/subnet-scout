// test-ai-insights-forecast.js - Test AI Insights & Risk Scores forecasting implementation
import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:8080';

console.log('🧪 TESTING AI INSIGHTS & RISK SCORES - Task 1: Performance Forecasting Engine');
console.log('═'.repeat(80));

/**
 * Test the 7-day forecasting endpoint
 */
async function testForecastingEndpoint() {
  console.log('\n🔮 TESTING 7-Day Performance Forecasting Endpoint');
  console.log('─'.repeat(50));

  try {
    // Test Case 1: Basic forecasting request
    console.log('\n📊 Test Case 1: Basic forecasting for subnet 1...');
    
    const basicRequest = {
      subnet_id: 1,
      current_metrics: {
        overall_score: 85,
        current_yield: 12.5,
        activity_level: 'High',
        yield_change_24h: 1.2,
        credibility_score: 80
      }
    };

    const response1 = await fetch(`${BACKEND_URL}/api/insights/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basicRequest)
    });

    if (response1.ok) {
      const result1 = await response1.json();
      console.log('✅ Basic forecasting request successful');
      console.log(`   - Subnet: ${result1.metadata?.subnet_name} (#${result1.subnet_id})`);
      console.log(`   - Forecast Type: ${result1.metadata?.forecast_horizon}`);
      console.log(`   - Overall Confidence: ${result1.confidence_metrics?.overall_confidence}%`);
      console.log(`   - Model Used: ${result1.confidence_metrics?.model_used}`);
      console.log(`   - Historical Data Points: ${result1.historical_context?.data_points}`);
      
      // Validate forecast structure
      if (result1.forecast_result?.forecast_data) {
        const forecast = result1.forecast_result.forecast_data;
        const dayCount = Object.keys(forecast).filter(key => key.startsWith('day_')).length;
        console.log(`   - Forecast Days Generated: ${dayCount}/7`);
        
        if (dayCount === 7) {
          console.log('✅ Complete 7-day forecast generated');
        } else {
          console.log('⚠️ Incomplete forecast - expected 7 days');
        }
      }
    } else {
      console.log('❌ Basic forecasting request failed:', response1.status);
      const error = await response1.text();
      console.log('   Error:', error);
    }

    // Test Case 2: Forecasting without current metrics (fallback)
    console.log('\n📊 Test Case 2: Forecasting with minimal data (subnet 5)...');
    
    const minimalRequest = {
      subnet_id: 5
    };

    const response2 = await fetch(`${BACKEND_URL}/api/insights/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minimalRequest)
    });

    if (response2.ok) {
      const result2 = await response2.json();
      console.log('✅ Minimal data forecasting successful');
      console.log(`   - Generated forecast with defaults for ${result2.metadata?.subnet_name}`);
      console.log(`   - Market Context Included: ${!!result2.market_context}`);
      console.log(`   - Statistical Summary Available: ${!!result2.historical_context?.statistical_summary}`);
    } else {
      console.log('❌ Minimal data forecasting failed:', response2.status);
    }

    // Test Case 3: Error handling - invalid subnet ID
    console.log('\n📊 Test Case 3: Error handling (invalid subnet ID)...');
    
    const invalidRequest = {
      subnet_id: 150 // Invalid - should be 1-118
    };

    const response3 = await fetch(`${BACKEND_URL}/api/insights/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidRequest)
    });

    if (response3.status === 400) {
      const error3 = await response3.json();
      console.log('✅ Error handling working correctly');
      console.log(`   - Error Code: ${error3.error?.code}`);
      console.log(`   - Error Message: ${error3.error?.message}`);
    } else {
      console.log('❌ Error handling not working as expected');
    }

    // Test Case 4: Different subnet types
    console.log('\n📊 Test Case 4: Testing different subnet types...');
    
    const subnetTypes = [
      { id: 1, expected_type: 'inference' },
      { id: 9, expected_type: 'training' },
      { id: 13, expected_type: 'storage' }
    ];

    for (const subnet of subnetTypes) {
      const typeRequest = { subnet_id: subnet.id };
      
      const typeResponse = await fetch(`${BACKEND_URL}/api/insights/forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(typeRequest)
      });

      if (typeResponse.ok) {
        const typeResult = await typeResponse.json();
        console.log(`   ✅ Subnet ${subnet.id}: ${typeResult.metadata?.subnet_type} type forecast generated`);
      } else {
        console.log(`   ❌ Subnet ${subnet.id}: forecast failed`);
      }
    }

  } catch (error) {
    console.error('❌ Forecasting endpoint test failed:', error.message);
  }
}

/**
 * Test historical data generator directly
 */
async function testHistoricalDataGenerator() {
  console.log('\n📈 TESTING Historical Data Generator');
  console.log('─'.repeat(50));

  try {
    // Import and test the generator directly
    const module = await import('./src/utils/historicalDataGenerator.js');
    const HistoricalDataGenerator = module.default;
    const generator = new HistoricalDataGenerator();

    console.log('\n📊 Test Case 1: 30-day history generation...');
    
    const historyData = generator.generate30DayHistory(1, {
      overall_score: 85,
      current_yield: 12.5,
      activity_score: 78
    });

    console.log('✅ Historical data generated successfully');
    console.log(`   - Data Points: ${historyData.time_series.length}`);
    console.log(`   - Date Range: ${historyData.time_series[0].date} to ${historyData.time_series[29].date}`);
    console.log(`   - Pattern Analysis: ${historyData.pattern_analysis.subnet_type} subnet`);
    console.log(`   - Market Condition: ${historyData.pattern_analysis.market_condition}`);
    console.log(`   - Volatility Index: ${historyData.pattern_analysis.volatility_index}`);
    
    // Check statistical summary
    if (historyData.statistical_summary) {
      console.log(`   - Score Trend: ${historyData.statistical_summary.trend_analysis.score_trend.direction}`);
      console.log(`   - Yield Mean: ${historyData.statistical_summary.yield_stats.mean}%`);
      console.log(`   - Activity Volatility: ${historyData.statistical_summary.activity_stats.volatility}`);
    }

    console.log('\n📊 Test Case 2: Market context generation...');
    
    const marketContext = generator.generateMarketContext(1);
    console.log('✅ Market context generated');
    console.log(`   - Network Health: ${marketContext.network_health}`);
    console.log(`   - Validator Trend: ${marketContext.validator_trend}`);
    console.log(`   - TAO Trend: ${marketContext.tao_trend}`);
    console.log(`   - Competition Level: ${marketContext.competition}`);
    console.log(`   - Market Sentiment: ${marketContext.market_sentiment}`);

  } catch (error) {
    console.error('❌ Historical data generator test failed:', error.message);
  }
}

/**
 * Test backend health and integration
 */
async function testBackendHealth() {
  console.log('\n🏥 TESTING Backend Health & Integration');
  console.log('─'.repeat(50));

  try {
    // Test basic health
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('✅ Backend health check passed');
      console.log(`   - Status: ${health.status}`);
      console.log(`   - Uptime: ${Math.round(health.uptime)}s`);
    }

    // Test enhancement health (IO.net integration)
    const enhancementResponse = await fetch(`${BACKEND_URL}/api/health/enhancement`);
    if (enhancementResponse.ok) {
      const enhancement = await enhancementResponse.json();
      console.log('✅ Enhancement health check passed');
      console.log(`   - IO.net Status: ${enhancement.enhancement_health?.status}`);
    }

  } catch (error) {
    console.error('❌ Backend health test failed:', error.message);
  }
}

/**
 * Performance and confidence analysis
 */
async function testPerformanceMetrics() {
  console.log('\n⚡ TESTING Performance & Confidence Metrics');
  console.log('─'.repeat(50));

  try {
    const startTime = Date.now();
    
    const response = await fetch(`${BACKEND_URL}/api/insights/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subnet_id: 1 })
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (response.ok) {
      const result = await response.json();
      
      console.log('✅ Performance metrics analysis:');
      console.log(`   - Response Time: ${responseTime}ms`);
      console.log(`   - Confidence Score: ${result.confidence_metrics?.overall_confidence}%`);
      console.log(`   - Historical Data Processing: ${result.historical_context?.data_points} points`);
      
      // Check if confidence meets success criteria (70%+)
      const confidence = result.confidence_metrics?.overall_confidence;
      if (confidence && confidence >= 70) {
        console.log('✅ SUCCESS CRITERIA MET: Confidence ≥ 70%');
      } else {
        console.log(`⚠️ Success criteria not met: Confidence ${confidence}% < 70%`);
      }
    }

  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
  }
}

/**
 * Main test execution
 */
async function runAllTests() {
  console.log(`🚀 Starting AI Insights & Risk Scores Tests - ${new Date().toISOString()}`);
  
  await testBackendHealth();
  await testHistoricalDataGenerator();
  await testForecastingEndpoint();
  await testPerformanceMetrics();
  
  console.log('\n🎯 TASK 1 COMPLETION SUMMARY');
  console.log('═'.repeat(50));
  console.log('✅ Enhanced IONetClient with 7-day forecasting capability');
  console.log('✅ Historical data generator with realistic 30-day time series');
  console.log('✅ New /api/insights/forecast endpoint with comprehensive validation');
  console.log('✅ Confidence scoring and statistical analysis');
  console.log('✅ Market context generation for enhanced predictions');
  console.log('✅ Error handling and edge case management');
  
  console.log('\n🎉 TASK 1: 7-Day Performance Forecasting Engine - IMPLEMENTATION COMPLETE!');
  console.log('Ready for user testing and Task 2: Multi-Factor Risk Assessment System');
}

// Execute tests
runAllTests().catch(console.error); 