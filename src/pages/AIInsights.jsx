import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, ShieldAlert, ExclamationTriangle, DollarSign } from 'lucide-react';
import PredictiveAnalyticsDashboard from '../components/PredictiveAnalyticsDashboard';

const AIInsights = () => {
  const [selectedSubnetId, setSelectedSubnetId] = useState(1);

  const subnetOptions = [
    { id: 1, name: 'Text Prompting', type: 'Inference' },
    { id: 8, name: 'Taoshi', type: 'Prediction' },
    { id: 21, name: 'FileTAO', type: 'Storage' },
    { id: 27, name: 'Compute Horde', type: 'Compute' },
    { id: 32, name: 'It\'s AI', type: 'Inference' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-indigo-100 bg-indigo-800/30 backdrop-blur-sm rounded-full"
            >
              <Brain className="w-4 h-4 mr-2" />
              Powered by io.net AI Models
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
            >
              🤖 AI Insights Dashboard
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-xl leading-8 text-indigo-100 max-w-3xl mx-auto"
            >
              Advanced AI-powered analysis with 7-day forecasting, risk assessment, anomaly detection, and investment insights
            </motion.p>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              {[
                { icon: TrendingUp, label: '7-Day Forecasting', color: 'text-green-400' },
                { icon: ShieldAlert, label: 'Risk Assessment', color: 'text-yellow-400' },
                { icon: ExclamationTriangle, label: 'Anomaly Detection', color: 'text-red-400' },
                { icon: DollarSign, label: 'Investment Insights', color: 'text-blue-400' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <feature.icon className={`w-5 h-5 mr-2 ${feature.color}`} />
                  <span className="text-sm font-medium text-white">{feature.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Subnet Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Select Subnet for Analysis</h2>
              <p className="text-gray-600">Choose a subnet to view comprehensive AI insights and predictions</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {subnetOptions.map((subnet) => (
                <motion.button
                  key={subnet.id}
                  onClick={() => setSelectedSubnetId(subnet.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedSubnetId === subnet.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-sm">
                    <div className="font-semibold">#{subnet.id} {subnet.name}</div>
                    <div className="text-xs opacity-80">{subnet.type}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          key={selectedSubnetId} // Re-animate when subnet changes
        >
          <PredictiveAnalyticsDashboard subnetId={selectedSubnetId} />
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Advanced AI Analysis</h3>
            <p className="text-gray-700 mb-4">
              This dashboard uses multiple AI models running on io.net's distributed computing network to provide:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <strong className="text-indigo-600">DeepSeek-R1</strong>
                <div className="text-gray-600">7-day forecasting & trend analysis</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <strong className="text-purple-600">Llama-3.3-70B</strong>
                <div className="text-gray-600">Risk assessment & sentiment analysis</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <strong className="text-green-600">Claude Sonnet</strong>
                <div className="text-gray-600">Anomaly detection & insights</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <strong className="text-orange-600">Statistical Models</strong>
                <div className="text-gray-600">Investment recommendations</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIInsights; 