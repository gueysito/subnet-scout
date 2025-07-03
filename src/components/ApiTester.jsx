import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  TestTube, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  RefreshCw,
  Settings,
  Database,
  MessageSquare,
  BarChart3,
  Clock
} from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { cardStyles, textStyles, buttonStyles } from '../utils/styleUtils';

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
      // Small delay between tests for visual effect
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getTestIcon = (testName) => {
    switch (testName.toLowerCase()) {
      case 'health check':
        return Activity;
      case 'io.net agents':
        return Database;
      case 'taostats data':
        return BarChart3;
      case 'calculate score':
        return TestTube;
      case 'telegram message':
        return MessageSquare;
      default:
        return Zap;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cardStyles.glass}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-glow">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-xl ${textStyles.heading}`}>API Testing Suite</h3>
            <p className={`text-sm ${textStyles.body}`}>Validate all system integrations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className={`text-sm ${textStyles.body}`}>Mode:</span>
            <span className={`text-sm font-medium ${apiMode === 'real' ? 'text-green-400' : 'text-amber-400'}`}>
              {apiMode.toUpperCase()}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleApiMode}
            className={`${buttonStyles.ghost} text-sm px-3 py-1`}
          >
            Switch Mode
          </motion.button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runAllTests}
          disabled={testing}
          className={`${buttonStyles.accent} flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <motion.div
            animate={{ rotate: testing ? 360 : 0 }}
            transition={{ duration: 1, repeat: testing ? Infinity : 0, ease: 'linear' }}
          >
            <Zap className="w-4 h-4" />
          </motion.div>
          <span>{testing ? 'Running Tests...' : 'Run All Tests'}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => runTest('Health Check', healthCheck)}
          className={`${buttonStyles.secondary} flex items-center space-x-2`}
        >
          <Activity className="w-4 h-4" />
          <span>Quick Health Check</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearResults}
          className={`${buttonStyles.ghost} flex items-center space-x-2`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Results</span>
        </motion.button>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className={`text-lg ${textStyles.heading}`}>Test Results</h4>
          {testResults.length > 0 && (
            <span className={`text-sm ${textStyles.body}`}>
              Latest {testResults.length} results
            </span>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto space-y-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {testResults.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${cardStyles.default} bg-white/5 text-center py-8`}
              >
                <TestTube className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className={`${textStyles.body}`}>
                  No test results yet. Run some tests to see results here.
                </p>
              </motion.div>
            ) : (
              testResults.map((result, index) => {
                const TestIcon = getTestIcon(result.test);
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`${cardStyles.default} ${
                      result.success 
                        ? 'border-green-500/30 bg-green-500/5' 
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          result.success 
                            ? 'bg-green-500/20' 
                            : 'bg-red-500/20'
                        }`}>
                          {result.success ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <TestIcon className="w-4 h-4 text-gray-400" />
                            <span className={`font-medium ${textStyles.heading} text-sm`}>
                              {result.test}
                            </span>
                          </div>
                          
                          {result.success ? (
                            <div className={`text-xs ${textStyles.body} text-green-300`}>
                              {typeof result.data === 'object' 
                                ? `✓ Success - ${Object.keys(result.data).length} fields returned`
                                : '✓ Operation completed successfully'
                              }
                            </div>
                          ) : (
                            <div className={`text-xs ${textStyles.body} text-red-300 break-words`}>
                              ✗ Error: {result.error}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{result.timestamp}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiTester; 