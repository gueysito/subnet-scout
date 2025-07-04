import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, ShieldAlert, AlertTriangle, DollarSign, Search, Filter } from 'lucide-react';
import PredictiveAnalyticsDashboard from '../components/PredictiveAnalyticsDashboard';
import { containerStyles, cardStyles, textStyles, buttonStyles } from '../utils/styleUtils';

const AIInsights = () => {
  const [selectedSubnetId, setSelectedSubnetId] = useState(1);

  const subnetOptions = [
    { id: 1, name: 'Text Prompting', type: 'AI/ML', description: 'Advanced text generation and NLP models' },
    { id: 8, name: 'Taoshi', type: 'Finance', description: 'Financial intelligence and prediction models' },
    { id: 21, name: 'FileTAO', type: 'Storage', description: 'Decentralized file storage network' },
    { id: 18, name: 'Cortext', type: 'AI/ML', description: 'Language model training and optimization' },
    { id: 27, name: 'Compute Horde', type: 'Compute', description: 'Distributed AI computing resources' },
    { id: 9, name: 'Pretraining', type: 'AI/ML', description: 'Foundation model pretraining subnet' },
    { id: 12, name: 'Data Universe', type: 'Data', description: 'Data marketplace and validation' }
  ];

  return (
    <div className={containerStyles.section}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Brain className="w-10 h-10 text-purple-400" />
          <h1 className={`text-4xl ${textStyles.heading}`}>
            AI Insights Dashboard
          </h1>
        </div>
        <p className={`text-xl ${textStyles.body} mb-6 max-w-4xl mx-auto`}>
          Advanced AI-powered analysis with 7-day forecasting, risk assessment, anomaly detection, and investment insights
        </p>
        
        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { icon: TrendingUp, label: '7-Day Forecasting', color: 'text-emerald-400' },
            { icon: ShieldAlert, label: 'Risk Assessment', color: 'text-amber-400' },
            { icon: AlertTriangle, label: 'Anomaly Detection', color: 'text-red-400' },
            { icon: DollarSign, label: 'Investment Insights', color: 'text-blue-400' }
          ].map((feature, index) => (
            <div key={index} className={`${cardStyles.glass} flex items-center px-4 py-2`}>
              <feature.icon className={`w-5 h-5 mr-2 ${feature.color}`} />
              <span className={`text-sm font-medium ${textStyles.body}`}>{feature.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subnet Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`${cardStyles.glass} mb-8`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className={`text-2xl ${textStyles.heading} mb-2`}>Select Subnet for Analysis</h2>
            <p className={`${textStyles.body} opacity-80`}>Choose a subnet to view comprehensive AI insights and predictions</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subnetOptions.map((subnet) => (
              <motion.button
                key={subnet.id}
                onClick={() => setSelectedSubnetId(subnet.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedSubnetId === subnet.id
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                    : 'border-white/20 bg-white/5 hover:border-purple-400 hover:bg-purple-400/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`font-semibold ${textStyles.body} mb-1`}>
                  #{subnet.id} {subnet.name}
                </div>
                <div className={`text-xs ${textStyles.caption} mb-1`}>
                  {subnet.type}
                </div>
                <div className={`text-xs ${textStyles.caption} opacity-60`}>
                  {subnet.description}
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
        transition={{ duration: 0.6, delay: 0.2 }}
        key={selectedSubnetId}
      >
        <PredictiveAnalyticsDashboard subnetId={selectedSubnetId} />
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`${cardStyles.glass} mt-8`}
      >
        <div className="text-center">
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>🚀 Powered by io.net AI Models</h3>
          <p className={`${textStyles.body} mb-6 opacity-80`}>
            This dashboard uses multiple AI models running on io.net's distributed computing network
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`${cardStyles.metric} bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30`}>
              <div className={`font-bold ${textStyles.accent} mb-1`}>DeepSeek-R1</div>
              <div className={`text-sm ${textStyles.caption}`}>7-day forecasting & trend analysis</div>
            </div>
            <div className={`${cardStyles.metric} bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30`}>
              <div className={`font-bold ${textStyles.accent} mb-1`}>Llama-3.3-70B</div>
              <div className={`text-sm ${textStyles.caption}`}>Risk assessment & sentiment analysis</div>
            </div>
            <div className={`${cardStyles.metric} bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30`}>
              <div className={`font-bold ${textStyles.accent} mb-1`}>Claude Sonnet</div>
              <div className={`text-sm ${textStyles.caption}`}>Anomaly detection & insights</div>
            </div>
            <div className={`${cardStyles.metric} bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30`}>
              <div className={`font-bold ${textStyles.accent} mb-1`}>Statistical Models</div>
              <div className={`text-sm ${textStyles.caption}`}>Investment recommendations</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIInsights; 