import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Award, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, Filter, Download, Search, Star } from 'lucide-react';

const EthosIdentity = () => {
  const [data, setData] = useState({
    totalValidators: 156,
    verifiedCount: 89,
    averageScore: 7.4,
    riskAlerts: 3,
    topValidators: [
      { name: 'Validator Alpha', score: 9.2, status: 'verified', subnet: 1 },
      { name: 'Mining Pro', score: 8.8, status: 'verified', subnet: 18 },
      { name: 'AI Compute', score: 8.5, status: 'pending', subnet: 21 }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            Ethos Identity & Reputation
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive identity verification and reputation analysis for Bittensor subnet validators
          </p>
        </motion.div>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Identity Overview - Large Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 lg:row-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Identity Overview</h3>
              <User className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{data.totalValidators}</div>
                  <div className="text-sm text-gray-600">Total Validators</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">{data.verifiedCount}</div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Top Rated Validators</h4>
                <div className="space-y-3">
                  {data.topValidators.map((validator, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {validator.status === 'verified' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{validator.name}</div>
                          <div className="text-sm text-gray-500">Subnet {validator.subnet}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{validator.score}</div>
                        <div className="text-sm text-gray-500">Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Average Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Star className="w-6 h-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{data.averageScore}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Score</h3>
            <p className="text-sm text-gray-600">Network reputation average</p>
          </motion.div>

          {/* Risk Alerts Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{data.riskAlerts}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Alerts</h3>
            <p className="text-sm text-gray-600">Active security warnings</p>
          </motion.div>

          {/* Verification Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Verification Status</h3>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">89</div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">43</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">24</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
          </motion.div>

          {/* Trust Score Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Shield className="w-8 h-8 mb-4" />
            <div className="text-2xl font-bold mb-2">94%</div>
            <div className="text-blue-100">Network trust score</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Award className="w-8 h-8 mb-4" />
            <div className="text-2xl font-bold mb-2">67</div>
            <div className="text-green-100">Reputation leaders</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EthosIdentity;