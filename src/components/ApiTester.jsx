import React, { useState } from 'react';
import { useApi } from '../hooks/useApi.js';

const ApiTester = () => {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);
  
  const { 
    apiMode, 
    toggleApiMode, 
    healthCheck, 
    getIoNetAgents, 
    getTaoStatsData,
    calculateScore,
    sendTelegramMessage 
  } = useApi();

  const addResult = (test, success, data, error = null) => {
    const result = {
      id: Date.now(),
      test,
      success,
      data: success ? data : null,
      error: error?.message || error,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const runTest = async (testName, testFunction) => {
    try {
      const result = await testFunction();
      addResult(testName, true, result);
    } catch (error) {
      addResult(testName, false, null, error);
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);

    const tests = [
      ['Health Check', () => healthCheck()],
      ['io.net Agents', () => getIoNetAgents()],
      ['TaoStats Data', () => getTaoStatsData(1, { limit: 3 })],
      ['Calculate Score', () => calculateScore(1, {
        emission_rate: 1250.5,
        total_stake: 125000.75,
        validator_count: 256,
        activity_score: 85.2,
        price_history: [0.025, 0.024, 0.026]
      })],
      ['Telegram Message', () => sendTelegramMessage('/score subnet 1')]
    ];

    for (const [name, testFn] of tests) {
      await runTest(name, testFn);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">API Tester</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Mode: {apiMode}</span>
          <button
            onClick={toggleApiMode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Switch
          </button>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={runAllTests}
          disabled={testing}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm"
        >
          {testing ? 'Testing...' : 'Run All Tests'}
        </button>
        <button
          onClick={() => runTest('Health Check', healthCheck)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
        >
          Test Health
        </button>
        <button
          onClick={clearResults}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
        >
          Clear
        </button>
      </div>

      {/* Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {testResults.length === 0 ? (
          <p className="text-gray-400 text-sm">No test results yet. Run some tests to see results.</p>
        ) : (
          testResults.map((result) => (
            <div
              key={result.id}
              className={`p-3 rounded text-sm border ${
                result.success 
                  ? 'bg-green-900 border-green-700 text-green-100' 
                  : 'bg-red-900 border-red-700 text-red-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">
                    {result.success ? '✅' : '❌'} {result.test}
                  </div>
                  {result.success ? (
                    <div className="text-xs mt-1 opacity-75">
                      {typeof result.data === 'object' 
                        ? `${Object.keys(result.data).length} fields returned`
                        : 'Success'
                      }
                    </div>
                  ) : (
                    <div className="text-xs mt-1">
                      Error: {result.error}
                    </div>
                  )}
                </div>
                <div className="text-xs opacity-75">
                  {result.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApiTester; 