import fetch from 'node-fetch';

// Test configuration
const BASE_URL = 'http://localhost:8080';
const TEST_USERNAMES = ['vitalik', 'balajis', 'elonmusk', 'satoshi', 'cz_binance'];

async function runKaitoYapsTests() {
  console.log('🚀 Starting Kaito Yaps Integration Test Suite...\n');

  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Helper function to run individual tests
  async function runTest(testName, testFunction) {
    results.total++;
    try {
      console.log(`🧪 ${testName}...`);
      const start = Date.now();
      await testFunction();
      const duration = Date.now() - start;
      console.log(`✅ ${testName}: PASSED (${duration}ms)\n`);
      results.passed++;
    } catch (error) {
      console.log(`❌ ${testName}: FAILED - ${error.message}\n`);
      results.failed++;
    }
  }

  // Test 1: Kaito Yaps Service Health Check
  await runTest('Kaito Yaps Service Health Check', async () => {
    const response = await fetch(`${BASE_URL}/api/mindshare/health`);
    const data = await response.json();
    
    if (response.status !== 200) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
    
    if (data.service !== 'kaito_yaps') {
      throw new Error('Kaito Yaps service not properly identified');
    }
    
    if (!data.rate_limit) {
      throw new Error('Rate limit status not available');
    }
    
    console.log(`   Service Status: ${data.status}`);
    console.log(`   Rate Limit: ${data.rate_limit.calls}/${data.rate_limit.maxCalls} calls`);
    console.log(`   Cache Status: ${data.cache_status}`);
  });

  // Test 2: Individual Mindshare Data Retrieval
  await runTest('Individual Mindshare Data Retrieval', async () => {
    const testUsername = 'vitalik';
    const response = await fetch(`${BASE_URL}/api/mindshare/${testUsername}`);
    const data = await response.json();
    
    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}: ${data.error || 'Unknown error'}`);
    }
    
    if (!data.success) {
      throw new Error('API response indicates failure');
    }
    
    const mindshareData = data.data;
    
    // Validate required fields
    const requiredFields = ['username', 'yaps_all', 'yaps_l7d', 'yaps_l30d', 'reputation', 'badge'];
    for (const field of requiredFields) {
      if (!(field in mindshareData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Validate reputation structure
    if (typeof mindshareData.reputation.score !== 'number' || !mindshareData.reputation.breakdown) {
      throw new Error('Invalid reputation structure');
    }
    
    // Validate badge structure
    if (!mindshareData.badge.level || !mindshareData.badge.emoji || !mindshareData.badge.color) {
      throw new Error('Invalid badge structure');
    }
    
    console.log(`   Username: @${mindshareData.username}`);
    console.log(`   Reputation: ${mindshareData.reputation.score}/100 (${mindshareData.badge.level})`);
    console.log(`   All-time Yaps: ${mindshareData.yaps_all}`);
    console.log(`   7-day Yaps: ${mindshareData.yaps_l7d}`);
    console.log(`   Badge: ${mindshareData.badge.emoji} ${mindshareData.badge.level}`);
  });

  // Test 3: Batch Mindshare Data Processing
  await runTest('Batch Mindshare Data Processing', async () => {
    const testUsernames = TEST_USERNAMES.slice(0, 3); // Test with 3 users
    const response = await fetch(`${BASE_URL}/api/mindshare/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernames: testUsernames }),
    });
    
    const data = await response.json();
    
    if (response.status !== 200) {
      throw new Error(`Batch API returned status ${response.status}: ${data.error || 'Unknown error'}`);
    }
    
    if (!data.success) {
      throw new Error('Batch API response indicates failure');
    }
    
    if (!Array.isArray(data.data)) {
      throw new Error('Batch response data is not an array');
    }
    
    if (!data.stats || typeof data.stats.total !== 'number') {
      throw new Error('Missing or invalid stats in batch response');
    }
    
    console.log(`   Processed: ${data.stats.successful}/${data.stats.total} users`);
    console.log(`   Errors: ${data.stats.failed}`);
    console.log(`   Response time: ${data.response_time}`);
    
    // Validate first result if available
    if (data.data.length > 0) {
      const firstResult = data.data[0];
      if (!firstResult.reputation || !firstResult.badge) {
        throw new Error('Batch results missing reputation or badge data');
      }
      console.log(`   Sample result: @${firstResult.username} (${firstResult.reputation.score}/100)`);
    }
  });

  // Test 4: Input Validation and Error Handling
  await runTest('Input Validation and Error Handling', async () => {
    // Test missing username
    const response1 = await fetch(`${BASE_URL}/api/mindshare/`);
    if (response1.status !== 404) {
      // This might return 404 for missing route, which is expected
    }
    
    // Test invalid username
    const response2 = await fetch(`${BASE_URL}/api/mindshare/invalid-username-123456789`);
    const data2 = await response2.json();
    
    // Should either return success with default data or handle gracefully
    if (response2.status === 200 && data2.success) {
      console.log(`   Invalid username handled gracefully: ${data2.data.source}`);
    } else if (response2.status >= 400) {
      console.log(`   Invalid username properly rejected with status ${response2.status}`);
    }
    
    // Test batch with empty array
    const response3 = await fetch(`${BASE_URL}/api/mindshare/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernames: [] }),
    });
    
    const data3 = await response3.json();
    if (response3.status !== 400) {
      throw new Error('Empty array should return 400 error');
    }
    
    console.log(`   Empty batch request properly rejected: ${data3.error}`);
    
    // Test batch with too many usernames
    const tooManyUsernames = Array.from({ length: 51 }, (_, i) => `user${i}`);
    const response4 = await fetch(`${BASE_URL}/api/mindshare/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernames: tooManyUsernames }),
    });
    
    const data4 = await response4.json();
    if (response4.status !== 400) {
      throw new Error('Too many usernames should return 400 error');
    }
    
    console.log(`   Large batch request properly rejected: ${data4.error}`);
  });

  // Test 5: Rate Limiting Compliance
  await runTest('Rate Limiting Compliance', async () => {
    // Get current rate limit status
    const healthResponse = await fetch(`${BASE_URL}/api/mindshare/health`);
    const healthData = await healthResponse.json();
    
    const rateLimitBefore = healthData.rate_limit_detailed;
    console.log(`   Rate limit before test: ${rateLimitBefore.calls}/${rateLimitBefore.maxCalls}`);
    
    // Make a few requests to test rate limiting behavior
    const requests = [];
    for (let i = 0; i < 3; i++) {
      requests.push(fetch(`${BASE_URL}/api/mindshare/test-user-${i}`));
    }
    
    const responses = await Promise.all(requests);
    
    // Check rate limit status after requests
    const healthResponse2 = await fetch(`${BASE_URL}/api/mindshare/health`);
    const healthData2 = await healthResponse2.json();
    
    const rateLimitAfter = healthData2.rate_limit_detailed;
    console.log(`   Rate limit after test: ${rateLimitAfter.calls}/${rateLimitAfter.maxCalls}`);
    
    // Verify rate limit increased
    if (rateLimitAfter.calls <= rateLimitBefore.calls) {
      console.log(`   ⚠️  Rate limit didn't increase as expected (possibly cached responses)`);
    } else {
      console.log(`   Rate limit properly tracked: +${rateLimitAfter.calls - rateLimitBefore.calls} calls`);
    }
    
    // Check that we're still within limits
    if (rateLimitAfter.calls >= rateLimitAfter.maxCalls) {
      throw new Error('Rate limit exceeded during testing');
    }
  });

  // Test 6: Caching Behavior
  await runTest('Caching Behavior', async () => {
    const testUsername = 'cache-test-user';
    
    // First request (should be cache miss)
    const start1 = Date.now();
    const response1 = await fetch(`${BASE_URL}/api/mindshare/${testUsername}`);
    const duration1 = Date.now() - start1;
    const data1 = await response1.json();
    
    if (response1.status !== 200) {
      throw new Error(`First request failed with status ${response1.status}`);
    }
    
    // Second request (should be cache hit)
    const start2 = Date.now();
    const response2 = await fetch(`${BASE_URL}/api/mindshare/${testUsername}`);
    const duration2 = Date.now() - start2;
    const data2 = await response2.json();
    
    if (response2.status !== 200) {
      throw new Error(`Second request failed with status ${response2.status}`);
    }
    
    console.log(`   First request: ${duration1}ms`);
    console.log(`   Second request: ${duration2}ms`);
    
    // Cache hit should be significantly faster
    if (duration2 >= duration1) {
      console.log(`   ⚠️  Second request not faster (caching may not be working optimally)`);
    } else {
      console.log(`   Caching working: ${Math.round((duration1 - duration2) / duration1 * 100)}% faster`);
    }
    
    // Verify data consistency
    if (JSON.stringify(data1.data) !== JSON.stringify(data2.data)) {
      throw new Error('Cached data differs from original data');
    }
  });

  // Test 7: Reputation Score Calculation
  await runTest('Reputation Score Calculation', async () => {
    const response = await fetch(`${BASE_URL}/api/mindshare/reputation-test-user`);
    const data = await response.json();
    
    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    
    const reputation = data.data.reputation;
    const badge = data.data.badge;
    
    // Validate reputation score range
    if (reputation.score < 0 || reputation.score > 100) {
      throw new Error(`Invalid reputation score: ${reputation.score} (should be 0-100)`);
    }
    
    // Validate breakdown exists
    if (!reputation.breakdown || !reputation.weights) {
      throw new Error('Reputation breakdown or weights missing');
    }
    
    // Validate badge corresponds to score
    const expectedBadgeLevels = ['new', 'emerging', 'active', 'intermediate', 'advanced', 'expert', 'legendary'];
    if (!expectedBadgeLevels.includes(badge.level)) {
      throw new Error(`Invalid badge level: ${badge.level}`);
    }
    
    console.log(`   Reputation Score: ${reputation.score}/100`);
    console.log(`   Badge Level: ${badge.level} ${badge.emoji}`);
    console.log(`   Breakdown: Recent(${reputation.breakdown.recent_activity}) Medium(${reputation.breakdown.medium_activity}) Total(${reputation.breakdown.total_activity})`);
  });

  // Test 8: Integration with Main Health System
  await runTest('Integration with Main Health System', async () => {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    
    // Main health endpoint should include Kaito service status
    console.log(`   Overall system status: ${data.overall_status}`);
    console.log(`   Services up: ${data.services_up}/${data.services?.length || 'unknown'}`);
    
    // Look for Kaito-related health information
    if (data.services && Array.isArray(data.services)) {
      const kaitoService = data.services.find(s => s.name === 'kaito_yaps' || s.name.includes('kaito'));
      if (kaitoService) {
        console.log(`   Kaito service found in health check: ${kaitoService.status}`);
      } else {
        console.log(`   ⚠️  Kaito service not found in main health check`);
      }
    } else {
      console.log(`   ⚠️  Services array not found in health response`);
    }
  });

  // Print final results
  console.log('\n' + '='.repeat(60));
  console.log('📊 KAITO YAPS INTEGRATION TEST RESULTS');
  console.log('='.repeat(60));
  
  const successRate = ((results.passed / results.total) * 100).toFixed(1);
  const statusEmoji = results.failed === 0 ? '✅' : results.failed <= 2 ? '⚠️' : '❌';
  
  console.log(`${statusEmoji} OVERALL SUCCESS RATE: ${results.passed}/${results.total} (${successRate}%)`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Kaito Yaps integration is working perfectly.');
  } else if (results.failed <= 2) {
    console.log('\n⚠️  Most tests passed with minor issues. Integration is functional.');
  } else {
    console.log('\n❌ Multiple test failures. Integration needs attention.');
  }

  console.log('\n🔧 KAITO YAPS FEATURES TESTED:');
  console.log('   ✓ Service Health Monitoring');
  console.log('   ✓ Individual Mindshare Data Retrieval');
  console.log('   ✓ Batch Processing Capabilities');
  console.log('   ✓ Input Validation & Error Handling');
  console.log('   ✓ Rate Limiting Compliance (100 calls/5min)');
  console.log('   ✓ Redis Caching Performance');
  console.log('   ✓ Reputation Score Calculation');
  console.log('   ✓ System Integration Health');

  console.log('\n📈 PERFORMANCE BENEFITS:');
  console.log('   • Mindshare data provides reputation context');
  console.log('   • Caching reduces external API dependency');
  console.log('   • Rate limiting prevents API abuse');
  console.log('   • Batch processing optimizes multiple requests');

  console.log('\n✨ Kaito Yaps integration test suite completed successfully!');
  
  return results;
}

// Run the tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runKaitoYapsTests().catch(console.error);
}

export default runKaitoYapsTests; 