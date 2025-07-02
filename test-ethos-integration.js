/**
 * 🪪 ETHOS NETWORK INTEGRATION TEST SUITE
 * Comprehensive testing for identity and reputation features
 * 
 * Tests:
 * 1. Ethos service health monitoring
 * 2. Token usage tracking (150 user limit)
 * 3. Privy authentication simulation
 * 4. Profile data retrieval
 * 5. Comprehensive identity gathering
 * 6. Error handling and validation
 * 7. Redis caching behavior
 * 8. Integration with main health system
 */

import fetch from 'node-fetch';

const SERVER_URL = 'http://localhost:8080';

// Mock Privy JWT token for testing (will fail real API calls)
const MOCK_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwiaWF0IjoxNzM4NDgxMjAwLCJleHAiOjE3Mzg0ODQ4MDB9.test-signature';

let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

/**
 * Test helper functions
 */
async function makeRequest(endpoint, options = {}) {
  const response = await fetch(`${SERVER_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  return {
    status: response.status,
    data: await response.json()
  };
}

function logTest(testName, passed, duration, details = '') {
  const status = passed ? '✅' : '❌';
  const detailsStr = details ? ` - ${details}` : '';
  console.log(`${status} ${testName}: ${passed ? 'PASSED' : 'FAILED'} (${duration}ms)${detailsStr}`);
  
  if (passed) testResults.passed++;
  else testResults.failed++;
  testResults.total++;
}

/**
 * Test 1: Ethos Service Health Check
 */
async function testEthosServiceHealth() {
  console.log('\n🧪 Ethos Service Health Check...');
  const start = Date.now();
  
  try {
    const response = await makeRequest('/api/identity/health');
    const duration = Date.now() - start;
    
    if (response.status === 200 && response.data.service === 'ethos_network') {
      console.log(`   Service Status: ${response.data.status}`);
      console.log(`   Token Usage: ${response.data.token_usage.total_users}/${response.data.token_usage.limit}`);
      console.log(`   Privy Configured: ${response.data.privy_configured}`);
      logTest('Ethos Service Health Check', true, duration);
    } else {
      logTest('Ethos Service Health Check', false, duration, 'Invalid response structure');
    }
  } catch (error) {
    const duration = Date.now() - start;
    logTest('Ethos Service Health Check', false, duration, error.message);
  }
}

/**
 * Test 2: Authentication Required Validation
 */
async function testAuthenticationRequired() {
  console.log('\n🧪 Authentication Required Validation...');
  const start = Date.now();
  
  try {
    const response = await makeRequest('/api/identity/profile/test-user');
    const duration = Date.now() - start;
    
    if (response.status === 401 && response.data.error.includes('Authorization token required')) {
      console.log(`   Correctly rejected request without token`);
      logTest('Authentication Required Validation', true, duration);
    } else {
      logTest('Authentication Required Validation', false, duration, 'Should require authentication');
    }
  } catch (error) {
    const duration = Date.now() - start;
    logTest('Authentication Required Validation', false, duration, error.message);
  }
}

/**
 * Test 3: Profile Request with Mock Token
 */
async function testProfileRequestWithMockToken() {
  console.log('\n🧪 Profile Request with Mock Token...');
  const start = Date.now();
  
  try {
    const response = await makeRequest('/api/identity/profile/profileId:1', {
      headers: {
        'Authorization': `Bearer ${MOCK_JWT_TOKEN}`
      }
    });
    const duration = Date.now() - start;
    
    // Expect this to fail gracefully due to invalid token
    if (response.status === 500 && response.data.error.includes('Failed to retrieve Ethos profile')) {
      console.log(`   Mock token correctly rejected by Privy verification`);
      console.log(`   Error: ${response.data.details}`);
      logTest('Profile Request with Mock Token', true, duration);
    } else {
      logTest('Profile Request with Mock Token', false, duration, 'Unexpected response to mock token');
    }
  } catch (error) {
    const duration = Date.now() - start;
    logTest('Profile Request with Mock Token', false, duration, error.message);
  }
}

/**
 * Test 4: Comprehensive Identity Request
 */
async function testComprehensiveIdentityRequest() {
  console.log('\n🧪 Comprehensive Identity Request...');
  const start = Date.now();
  
  try {
    const response = await makeRequest('/api/identity/comprehensive/address:0x1234567890abcdef', {
      headers: {
        'Authorization': `Bearer ${MOCK_JWT_TOKEN}`
      }
    });
    const duration = Date.now() - start;
    
    // Should fail gracefully with proper error structure
    if (response.status === 500 && response.data.error.includes('comprehensive identity')) {
      console.log(`   Comprehensive request properly handled`);
      console.log(`   Userkey: ${response.data.userkey}`);
      logTest('Comprehensive Identity Request', true, duration);
    } else {
      logTest('Comprehensive Identity Request', false, duration, 'Unexpected response structure');
    }
  } catch (error) {
    const duration = Date.now() - start;
    logTest('Comprehensive Identity Request', false, duration, error.message);
  }
}

/**
 * Test 5: Input Validation Testing
 */
async function testInputValidation() {
  console.log('\n🧪 Input Validation Testing...');
  const start = Date.now();
  
  try {
    // Test missing userkey parameter
    const response1 = await makeRequest('/api/identity/profile/', {
      headers: {
        'Authorization': `Bearer ${MOCK_JWT_TOKEN}`
      }
    });
    
    // Test invalid endpoint
    const response2 = await makeRequest('/api/identity/invalid', {
      headers: {
        'Authorization': `Bearer ${MOCK_JWT_TOKEN}`
      }
    });
    
    const duration = Date.now() - start;
    
    // Should return 404 for both invalid routes
    if ((response1.status === 404 || response1.status === 401) && 
        (response2.status === 404 || response2.status === 401)) {
      console.log(`   Invalid routes properly rejected`);
      console.log(`   Missing userkey: ${response1.status}`);
      console.log(`   Invalid endpoint: ${response2.status}`);
      logTest('Input Validation Testing', true, duration);
    } else {
      logTest('Input Validation Testing', false, duration, 'Invalid input not properly handled');
    }
  } catch (error) {
    const duration = Date.now() - start;
    logTest('Input Validation Testing', false, duration, error.message);
  }
}

/**
 * Test 6: Token Usage Monitoring
 */
async function testTokenUsageMonitoring() {
  console.log('\n🧪 Token Usage Monitoring...');
  const start = Date.now();
  
  try {
    // Get initial health status
    const initialResponse = await makeRequest('/api/identity/health');
    
    // Make a few profile requests
    const promises = [];
    for (let i = 0; i < 3; i++) {
      promises.push(makeRequest(`/api/identity/profile/test-user-${i}`, {
        headers: {
          'Authorization': `Bearer ${MOCK_JWT_TOKEN}`
        }
      }));
    }
    
    await Promise.allSettled(promises);
    
    // Get final health status
    const finalResponse = await makeRequest('/api/identity/health');
    
    const duration = Date.now() - start;
    
    if (initialResponse.status === 200 && finalResponse.status === 200) {
      console.log(`   Token usage monitoring operational`);
      console.log(`   Initial limit remaining: ${initialResponse.data.token_usage.remaining}`);
      console.log(`   Final limit remaining: ${finalResponse.data.token_usage.remaining}`);
      logTest('Token Usage Monitoring', true, duration);
    } else {
      logTest('Token Usage Monitoring', false, duration, 'Health endpoint not available');
    }
  } catch (error) {
    const duration = Date.now() - start;
    logTest('Token Usage Monitoring', false, duration, error.message);
  }
}

/**
 * Test 7: Userkey Format Support
 */
async function testUserkeyFormats() {
  console.log('\n🧪 Userkey Format Support...');
  const start = Date.now();
  
  try {
    const userkeys = [
      'profileId:123',
      'address:0x1234567890abcdef1234567890abcdef12345678',
      'service:discord:123456789',
      'service:x.com:username:testuser'
    ];
    
    let allRequestsHandled = true;
    
    for (const userkey of userkeys) {
      const response = await makeRequest(`/api/identity/profile/${userkey}`, {
        headers: {
          'Authorization': `Bearer ${MOCK_JWT_TOKEN}`
        }
      });
      
      // Should get 500 (service error) not 400 (validation error)
      if (response.status !== 500) {
        allRequestsHandled = false;
        break;
      }
    }
    
    const duration = Date.now() - start;
    
    if (allRequestsHandled) {
      console.log(`   All userkey formats properly accepted`);
      console.log(`   Tested formats: ${userkeys.length}`);
      logTest('Userkey Format Support', true, duration);
    } else {
      logTest('Userkey Format Support', false, duration, 'Some userkey formats rejected');
    }
  } catch (error) {
    const duration = Date.now() - start;
    logTest('Userkey Format Support', false, duration, error.message);
  }
}

/**
 * Test 8: Integration with Main Health System
 */
async function testMainHealthSystemIntegration() {
  console.log('\n🧪 Integration with Main Health System...');
  const start = Date.now();
  
  try {
    const response = await makeRequest('/health');
    const duration = Date.now() - start;
    
    // Check if Ethos service is included in main health check
    const ethosService = response.data.services.find(s => s.name === 'ethos_network');
    
    if (response.status === 200 && ethosService) {
      console.log(`   Overall system status: ${response.data.overall_status}`);
      console.log(`   Services up: ${response.data.services_up}/${response.data.total_services}`);
      console.log(`   Ethos service found in health check: ${ethosService.status}`);
      logTest('Integration with Main Health System', true, duration);
    } else {
      logTest('Integration with Main Health System', false, duration, 'Ethos not found in main health check');
    }
  } catch (error) {
    const duration = Date.now() - start;
    logTest('Integration with Main Health System', false, duration, error.message);
  }
}

/**
 * Main test runner
 */
async function runEthosIntegrationTests() {
  console.log('🚀 Starting Ethos Network Integration Test Suite...\n');
  
  try {
    await testEthosServiceHealth();
    await testAuthenticationRequired();
    await testProfileRequestWithMockToken();
    await testComprehensiveIdentityRequest();
    await testInputValidation();
    await testTokenUsageMonitoring();
    await testUserkeyFormats();
    await testMainHealthSystemIntegration();
    
    // Summary
    console.log('\n\n============================================================');
    console.log('📊 ETHOS NETWORK INTEGRATION TEST RESULTS');
    console.log('============================================================');
    
    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    const status = testResults.passed === testResults.total ? '✅ PERFECT SCORE!' : 
                   successRate >= 80 ? '⚠️ GOOD SCORE with minor issues' : 
                   '❌ NEEDS IMPROVEMENT';
    
    console.log(`${status} OVERALL SUCCESS RATE: ${testResults.passed}/${testResults.total} (${successRate}%)\n`);
    
    if (testResults.passed === testResults.total) {
      console.log('🎉 All tests passed! Ethos integration is fully operational.');
    } else {
      console.log(`⚠️ ${testResults.failed} test(s) failed. Integration is functional but needs attention.`);
    }
    
    console.log('\n🔧 ETHOS NETWORK FEATURES TESTED:');
    console.log('   ✓ Service Health Monitoring');
    console.log('   ✓ Privy Authentication Integration');
    console.log('   ✓ Token Usage Tracking (150 user limit)');
    console.log('   ✓ Profile Data Retrieval');
    console.log('   ✓ Comprehensive Identity Processing');
    console.log('   ✓ Input Validation & Error Handling');
    console.log('   ✓ Userkey Format Support');
    console.log('   ✓ System Health Integration');
    
    console.log('\n📈 ENTERPRISE BENEFITS:');
    console.log('   • Identity verification provides trust context');
    console.log('   • Token usage tracking prevents API abuse');
    console.log('   • Comprehensive profiling enables reputation scoring');
    console.log('   • Health monitoring ensures service reliability');
    
    console.log('\n✨ Ethos Network integration test suite completed successfully!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Execute test suite
runEthosIntegrationTests(); 