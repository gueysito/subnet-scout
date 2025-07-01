import apiClient from './src/utils/apiClient.js';

console.log('🧪 Testing API Contracts...\n');

async function testApiContracts() {
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  const runTest = async (name, testFn) => {
    try {
      console.log(`🔍 Testing: ${name}`);
      await testFn();
      console.log(`✅ PASSED: ${name}\n`);
      results.passed++;
      results.tests.push({ name, status: 'PASSED' });
    } catch (error) {
      console.error(`❌ FAILED: ${name} - ${error.message}\n`);
      results.failed++;
      results.tests.push({ name, status: 'FAILED', error: error.message });
    }
  };

  // Force mock mode for testing
  apiClient.useMock = true;
  console.log(`🔧 Using ${apiClient.getCurrentMode()} mode for testing\n`);

  // Test 1: Health Check
  await runTest('Health Check', async () => {
    const health = await apiClient.healthCheck();
    if (!health.status || health.status !== 'healthy') {
      throw new Error('Health check failed');
    }
  });

  // Test 2: io.net Agents API
  await runTest('io.net Agents API', async () => {
    const agents = await apiClient.getIoNetAgents();
    if (!agents.agents || !Array.isArray(agents.agents)) {
      throw new Error('Invalid agents response structure');
    }
    if (!agents.total_count || !agents.available_count) {
      throw new Error('Missing count fields');
    }
    if (agents.agents.length === 0) {
      throw new Error('No agents returned');
    }
    
    // Validate agent structure
    const agent = agents.agents[0];
    const requiredFields = ['id', 'status', 'gpu_type', 'location', 'price_per_hour'];
    for (const field of requiredFields) {
      if (!(field in agent)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  });

  // Test 3: TaoStats API
  await runTest('TaoStats API', async () => {
    const data = await apiClient.getTaoStatsData(1, { limit: 5 });
    if (!Array.isArray(data)) {
      throw new Error('TaoStats should return an array');
    }
    if (data.length === 0) {
      throw new Error('No TaoStats data returned');
    }
    
    // Validate data structure
    const item = data[0];
    const requiredFields = ['netuid', 'block_number', 'timestamp', 'price'];
    for (const field of requiredFields) {
      if (!(field in item)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  });

  // Test 4: Scoring API
  await runTest('Scoring API', async () => {
    const mockMetrics = {
      emission_rate: 1250.5,
      total_stake: 125000.75,
      validator_count: 256,
      activity_score: 85.2,
      price_history: [0.025, 0.024, 0.026]
    };
    
    const score = await apiClient.calculateScore(1, mockMetrics);
    if (!score.subnet_id || !score.overall_score) {
      throw new Error('Invalid score response structure');
    }
    if (!score.breakdown || !score.metrics) {
      throw new Error('Missing score breakdown or metrics');
    }
    
    // Validate score ranges
    if (score.overall_score < 0 || score.overall_score > 100) {
      throw new Error('Score should be between 0-100');
    }
  });

  // Test 5: Agents List API
  await runTest('Agents List API', async () => {
    const agentsList = await apiClient.getAgentsList(1, 10);
    if (!agentsList.agents || !Array.isArray(agentsList.agents)) {
      throw new Error('Invalid agents list response structure');
    }
    if (!agentsList.total_count || !agentsList.healthy_count) {
      throw new Error('Missing count fields');
    }
    
    // Validate agent structure
    if (agentsList.agents.length > 0) {
      const agent = agentsList.agents[0];
      const requiredFields = ['subnet_id', 'name', 'status', 'score'];
      for (const field of requiredFields) {
        if (!(field in agent)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
    }
  });

  // Test 6: Telegram Webhook
  await runTest('Telegram Webhook', async () => {
    const response = await apiClient.sendTelegramMessage('/score subnet 1');
    if (!response.method || response.method !== 'sendMessage') {
      throw new Error('Invalid Telegram response structure');
    }
    if (!response.chat_id || !response.text) {
      throw new Error('Missing required Telegram fields');
    }
  });

  // Test 7: Error Handling
  await runTest('Error Handling', async () => {
    try {
      // Test invalid subnet ID
      await apiClient.calculateScore(null, {});
      throw new Error('Should have thrown an error for invalid input');
    } catch (error) {
      if (!error.message.includes('Missing required fields')) {
        throw new Error('Unexpected error message: ' + error.message);
      }
    }
  });

  // Test 8: API Mode Switching
  await runTest('API Mode Switching', async () => {
    const initialMode = apiClient.getCurrentMode();
    apiClient.toggleMockMode();
    const newMode = apiClient.getCurrentMode();
    
    if (initialMode === newMode) {
      throw new Error('Mode switching failed');
    }
    
    // Switch back
    apiClient.toggleMockMode();
    if (apiClient.getCurrentMode() !== initialMode) {
      throw new Error('Mode switching inconsistent');
    }
  });

  // Summary
  console.log('📊 Test Results Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%\n`);

  if (results.failed > 0) {
    console.log('Failed Tests:');
    results.tests
      .filter(test => test.status === 'FAILED')
      .forEach(test => console.log(`  - ${test.name}: ${test.error}`));
  }

  return results.failed === 0;
}

// Run tests
testApiContracts()
  .then(success => {
    if (success) {
      console.log('🎉 All API contracts are working correctly!');
      process.exit(0);
    } else {
      console.log('💥 Some tests failed. Please check the errors above.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  }); 