import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line, Radar, Doughnut } from 'react-chartjs-2';
import { Shield, User, Award, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, Filter, Download, Search, Star } from 'lucide-react';
import { containerStyles, cardStyles, textStyles, buttonStyles, authkitStyles } from '../utils/styleUtils';

const EthosIdentity = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [data, setData] = useState({
    validators: [],
    identityMetrics: {},
    riskAnalysis: {},
    verificationStats: {},
    timeSeriesData: {}
  });

  // Generate comprehensive Ethos identity data
  useEffect(() => {
    const generateEthosData = () => {
      const validators = [
        { id: 1, name: 'Text Prompting', category: 'NLP', subnet: 1, verified: true },
        { id: 18, name: 'Cortext', category: 'AI/ML', subnet: 18, verified: true },
        { id: 21, name: 'FileTAO', category: 'Storage', subnet: 21, verified: false },
        { id: 9, name: 'Pretraining', category: 'AI/ML', subnet: 9, verified: true },
        { id: 7, name: 'Connectome', category: 'Infrastructure', subnet: 7, verified: true },
        { id: 11, name: 'Text-to-Speech', category: 'Audio', subnet: 11, verified: false },
        { id: 13, name: 'Data Universe', category: 'Data', subnet: 13, verified: true },
        { id: 15, name: 'Blockchain Insights', category: 'Analytics', subnet: 15, verified: true },
        { id: 19, name: 'Vision AI', category: 'Computer Vision', subnet: 19, verified: false },
        { id: 23, name: 'DeFi Oracle', category: 'DeFi', subnet: 23, verified: true },
        { id: 27, name: 'Compute Network', category: 'Infrastructure', subnet: 27, verified: true },
        { id: 31, name: 'Social Graph', category: 'Social', subnet: 31, verified: false },
        { id: 33, name: 'Gaming AI', category: 'Gaming', subnet: 33, verified: true },
        { id: 37, name: 'Medical AI', category: 'Healthcare', subnet: 37, verified: true },
        { id: 41, name: 'Supply Chain', category: 'Logistics', subnet: 41, verified: false }
      ];

      const enrichedValidators = validators.map(validator => {
        const baseScore = Math.floor(Math.random() * 40) + 60; // 60-100 score
        const riskLevel = baseScore > 85 ? 'low' : baseScore > 70 ? 'medium' : 'high';
        
        return {
          ...validator,
          identity: {
            score: baseScore,
            riskLevel,
            reputation: Math.floor(Math.random() * 30) + 70,
            trustScore: Math.floor(Math.random() * 25) + 75,
            credibility: Math.floor(Math.random() * 20) + 80,
            transparency: Math.floor(Math.random() * 30) + 60,
            compliance: Math.floor(Math.random() * 15) + 85,
            verificationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            lastCheck: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            uptime: Math.floor(Math.random() * 5) + 95,
            violations: Math.floor(Math.random() * 3),
            endorsements: Math.floor(Math.random() * 50) + 10,
            communityRating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
            kycStatus: Math.random() > 0.3,
            amlCompliance: Math.random() > 0.2,
            operationalHistory: Math.floor(Math.random() * 730) + 30, // days
            penaltyPoints: Math.floor(Math.random() * 10),
            socialVerification: Math.random() > 0.4
          },
          performance: {
            reliability: Math.floor(Math.random() * 20) + 80,
            responseTime: Math.floor(Math.random() * 500) + 50, // ms
            accuracy: Math.floor(Math.random() * 15) + 85,
            availability: Math.floor(Math.random() * 8) + 92
          },
          attestations: generateAttestations(),
          riskFactors: generateRiskFactors(),
          verificationBadges: generateVerificationBadges()
        };
      });

      const identityMetrics = {
        totalValidators: enrichedValidators.length,
        verifiedValidators: enrichedValidators.filter(v => v.verified).length,
        averageScore: enrichedValidators.reduce((sum, v) => sum + v.identity.score, 0) / enrichedValidators.length,
        highRiskCount: enrichedValidators.filter(v => v.identity.riskLevel === 'high').length,
        kycCompliant: enrichedValidators.filter(v => v.identity.kycStatus).length,
        penalizedValidators: enrichedValidators.filter(v => v.identity.violations > 0).length
      };

      const riskAnalysis = {
        low: enrichedValidators.filter(v => v.identity.riskLevel === 'low').length,
        medium: enrichedValidators.filter(v => v.identity.riskLevel === 'medium').length,
        high: enrichedValidators.filter(v => v.identity.riskLevel === 'high').length
      };

      const verificationStats = {
        kyc: enrichedValidators.filter(v => v.identity.kycStatus).length,
        aml: enrichedValidators.filter(v => v.identity.amlCompliance).length,
        social: enrichedValidators.filter(v => v.identity.socialVerification).length,
        operational: enrichedValidators.filter(v => v.identity.operationalHistory > 180).length
      };

      setData({
        validators: enrichedValidators,
        identityMetrics,
        riskAnalysis,
        verificationStats,
        timeSeriesData: generateTimeSeriesData()
      });
    };

    generateEthosData();
  }, []);

  const generateAttestations = () => {
    const types = ['KYC Verification', 'Code Audit', 'Security Review', 'Operational Audit', 'Financial Review'];
    return types.slice(0, Math.floor(Math.random() * 4) + 1).map(type => ({
      type,
      issuer: `Authority_${Math.floor(Math.random() * 100)}`,
      date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      status: Math.random() > 0.2 ? 'valid' : 'expired',
      score: Math.floor(Math.random() * 30) + 70
    }));
  };

  const generateRiskFactors = () => {
    const factors = [
      { factor: 'Operational History', severity: 'low', description: 'Short operational period' },
      { factor: 'Penalty Points', severity: 'medium', description: 'Recent minor violations' },
      { factor: 'KYC Status', severity: 'high', description: 'Missing identity verification' },
      { factor: 'Performance Issues', severity: 'medium', description: 'Inconsistent response times' }
    ];
    return factors.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const generateVerificationBadges = () => {
    const badges = ['Verified', 'Trusted', 'Gold Standard', 'KYC Compliant', 'Audited', 'Transparent'];
    return badges.slice(0, Math.floor(Math.random() * 4) + 2);
  };

  const generateTimeSeriesData = () => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return {
      labels: days,
      datasets: [
        {
          label: 'Average Trust Score',
          data: days.map(() => Math.floor(Math.random() * 20) + 75),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'New Verifications',
          data: days.map(() => Math.floor(Math.random() * 5) + 1),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const filteredValidators = data.validators
    .filter(validator => {
      const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'verified' && validator.verified) ||
                          (filterStatus === 'unverified' && !validator.verified) ||
                          (filterStatus === 'high-risk' && validator.identity.riskLevel === 'high');
      
      const matchesCategory = selectedCategory === 'all' || validator.category === selectedCategory;
      
      const matchesSearch = searchTerm === '' || 
                          validator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          validator.id.toString().includes(searchTerm);
      
      return matchesStatus && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score': return b.identity.score - a.identity.score;
        case 'reputation': return b.identity.reputation - a.identity.reputation;
        case 'trust': return b.identity.trustScore - a.identity.trustScore;
        case 'risk': 
          const riskOrder = { low: 3, medium: 2, high: 1 };
          return riskOrder[b.identity.riskLevel] - riskOrder[a.identity.riskLevel];
        default: return 0;
      }
    });

  const topValidatorsData = {
    labels: filteredValidators.slice(0, 10).map(v => v.name),
    datasets: [
      {
        label: 'Identity Score',
        data: filteredValidators.slice(0, 10).map(v => v.identity.score),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  const riskDistribution = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [data.riskAnalysis.low, data.riskAnalysis.medium, data.riskAnalysis.high],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    ]
  };

  const verificationBreakdown = {
    labels: ['KYC', 'AML', 'Social', 'Operational'],
    datasets: [
      {
        data: [
          data.verificationStats.kyc,
          data.verificationStats.aml,
          data.verificationStats.social,
          data.verificationStats.operational
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    ]
  };

  const identityRadarData = {
    labels: ['Trust Score', 'Reputation', 'Credibility', 'Transparency', 'Compliance', 'Reliability'],
    datasets: [
      {
        label: 'Top Validator',
        data: [95, 92, 98, 89, 96, 94],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Average',
        data: [78, 75, 82, 70, 85, 80],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      r: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    }
  };

  return (
    <div className={containerStyles.section}>
      {/* VISUAL TEST */}
      <div className="mb-4 p-4 bg-orange-500 text-white rounded-lg">
        <h2 className="text-xl font-bold">🛡️ Ethos Identity Page - New UI Active</h2>
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className={`text-4xl font-bold ${authkitStyles.textPrimary} mb-4 flex items-center`}>
          <Shield className="w-8 h-8 mr-3" />
          Ethos Identity & Reputation
        </h1>
        <p className={`text-xl ${authkitStyles.textSecondary} mb-6`}>
          Comprehensive identity verification and reputation analysis for Bittensor subnet validators
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`${cardStyles.glass} p-6 mb-6`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search validators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-3 py-2 bg-white/10 border border-white/20 rounded-lg ${textStyles.body} focus:outline-none focus:border-accent-500`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <label className={`text-sm ${textStyles.caption}`}>Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-3 py-2 bg-white/10 border border-white/20 rounded-lg ${textStyles.body} focus:outline-none focus:border-accent-500`}
              >
                <option value="all" className="bg-gray-800">All</option>
                <option value="verified" className="bg-gray-800">Verified</option>
                <option value="unverified" className="bg-gray-800">Unverified</option>
                <option value="high-risk" className="bg-gray-800">High Risk</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className={`text-sm ${textStyles.caption}`}>Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 bg-white/10 border border-white/20 rounded-lg ${textStyles.body} focus:outline-none focus:border-accent-500`}
              >
                <option value="score" className="bg-gray-800">Identity Score</option>
                <option value="reputation" className="bg-gray-800">Reputation</option>
                <option value="trust" className="bg-gray-800">Trust Score</option>
                <option value="risk" className="bg-gray-800">Risk Level</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-4 py-2 ${buttonStyles.secondary} rounded-lg`}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className={`${cardStyles.glass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textStyles.caption} mb-1`}>Total Validators</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.identityMetrics.totalValidators}
              </p>
            </div>
            <User className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className={`${cardStyles.glass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textStyles.caption} mb-1`}>Verified</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.identityMetrics.verifiedValidators}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className={`${cardStyles.glass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textStyles.caption} mb-1`}>Avg Score</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.identityMetrics.averageScore?.toFixed(1)}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className={`${cardStyles.glass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textStyles.caption} mb-1`}>High Risk</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.identityMetrics.highRiskCount}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Validators */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Top Validators by Identity Score
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={topValidatorsData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Risk Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={riskDistribution} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} />
          </div>
        </motion.div>

        {/* Identity Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Identity Metrics Timeline
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={data.timeSeriesData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Identity Radar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Identity Profile Analysis
          </h3>
          <div style={{ height: '300px' }}>
            <Radar data={identityRadarData} options={radarOptions} />
          </div>
        </motion.div>
      </div>

      {/* Verification Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className={`${cardStyles.glass} p-6 mb-8`}
      >
        <h3 className={`text-xl ${textStyles.heading} mb-4`}>
          Verification Status Breakdown
        </h3>
        <div style={{ height: '300px' }}>
          <Doughnut data={verificationBreakdown} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} />
        </div>
      </motion.div>

      {/* Validator Details Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className={`${cardStyles.glass} p-6`}
      >
        <h3 className={`text-xl ${textStyles.heading} mb-4`}>
          Validator Identity Details
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Validator</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Score</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Risk Level</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Trust</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Verification</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Compliance</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Rating</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredValidators.slice(0, 15).map((validator) => (
                <tr key={validator.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{validator.name}</span>
                      <span className={`text-xs ${textStyles.caption}`}>#{validator.subnet}</span>
                      {validator.verified && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${validator.identity.score > 85 ? 'text-green-400' : validator.identity.score > 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {validator.identity.score}
                      </span>
                      <div className={`w-16 h-2 bg-gray-700 rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full ${validator.identity.score > 85 ? 'bg-green-400' : validator.identity.score > 70 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${validator.identity.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      validator.identity.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                      validator.identity.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {validator.identity.riskLevel}
                    </span>
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    {validator.identity.trustScore}%
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <div className="flex items-center space-x-1">
                      {validator.identity.kycStatus && <CheckCircle className="w-3 h-3 text-green-400" />}
                      {validator.identity.amlCompliance && <Shield className="w-3 h-3 text-blue-400" />}
                      {validator.identity.socialVerification && <User className="w-3 h-3 text-purple-400" />}
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    {validator.identity.compliance}%
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{validator.identity.communityRating}</span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${validator.identity.uptime > 95 ? 'bg-green-500' : validator.identity.uptime > 90 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`}></div>
                      <span className="text-sm">{validator.identity.uptime}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default EthosIdentity;