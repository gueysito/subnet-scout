import React from "react";
import { motion } from "framer-motion";
import { Zap, DollarSign, Brain, BarChart3, Sparkles, Cpu, Shield, TrendingUp, Users, Activity, Eye } from "lucide-react";
import SubnetChatInterface from "../components/SubnetChatInterface.jsx";

export default function Home() {
  const stats = [
    { value: "118", label: "Subnets Monitored", icon: Shield, color: "blue" },
    { value: "109x", label: "Performance Boost", icon: Zap, color: "yellow" },
    { value: "83%", label: "Cost Reduction", icon: DollarSign, color: "green" },
    { value: "5.37s", label: "Full Analysis Time", icon: BarChart3, color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Bento Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-12"
        >
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Main Hero Card - Takes up 2x2 space */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 lg:row-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-gray-900">
                    Subnet Scout
                  </h1>
                  <p className="text-sm text-blue-600 font-semibold tracking-wide uppercase">
                    AI-Powered Subnet Intelligence
                  </p>
                </div>
              </div>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Ask me anything about Bittensor subnets - I have real-time data on all 118 networks
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900 font-semibold">109x faster processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900 font-semibold">83% cost reduction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900 font-semibold">AI-powered insights</span>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: 'text-blue-600 bg-blue-50',
                yellow: 'text-yellow-600 bg-yellow-50', 
                green: 'text-green-600 bg-green-50',
                purple: 'text-purple-600 bg-purple-50'
              };
              
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${colorClasses[stat.color].split(' ')[0]}`} />
                  </div>
                  <div className={`text-2xl font-bold ${colorClasses[stat.color].split(' ')[0]} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}

            {/* Additional Feature Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Real-time Monitoring</h3>
                <Activity className="w-8 h-8" />
              </div>
              <p className="text-blue-100 mb-4">
                Live tracking of all 118 Bittensor subnets with instant performance metrics and alerts.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Live Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">118 Subnets</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <Eye className="w-8 h-8 text-indigo-600 mb-4" />
              <div className="text-2xl font-bold text-indigo-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                Network Monitoring
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <Cpu className="w-8 h-8 text-red-600 mb-4" />
              <div className="text-2xl font-bold text-red-600 mb-1">99.9%</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                Uptime
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Chat Interface - Clean Integration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ask the AI Assistant
            </h2>
            <p className="text-gray-600">
              Get instant insights about any Bittensor subnet with our AI-powered assistant
            </p>
          </div>
          <SubnetChatInterface />
        </motion.div>
      </div>
    </div>
  );
}