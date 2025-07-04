import React from "react";
import { motion } from "framer-motion";
import { Zap, DollarSign, Brain, BarChart3, Sparkles, Cpu, Shield, TrendingUp } from "lucide-react";
import SubnetChatInterface from "../components/SubnetChatInterface.jsx";
import { containerStyles, cardStyles, textStyles, buttonStyles, animations, authkitStyles } from "../utils/styleUtils";

export default function Home() {

  const stats = [
    { value: "118", label: "Subnets Monitored", icon: Shield },
    { value: "109x", label: "Performance Boost", icon: Zap },
    { value: "83%", label: "Cost Reduction", icon: DollarSign },
    { value: "5.37s", label: "Full Analysis Time", icon: BarChart3 }
  ];

  return (
    <div className={containerStyles.section}>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`${authkitStyles.glassCardElevated} mb-12 text-center relative p-8`}
      >
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-6xl font-black ${authkitStyles.textPrimary}`}>
              Subnet Scout
            </h1>
          </div>
          <div className="inline-block px-4 py-2 bg-blue-100 rounded-full border border-blue-200 mb-6">
            <span className={`text-sm ${authkitStyles.textAccent} font-semibold tracking-wide uppercase`}>
              AI-Powered Subnet Intelligence
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <p className={`text-2xl ${authkitStyles.textSecondary} mb-4 max-w-4xl mx-auto leading-relaxed font-medium`}>
            Ask me anything about Bittensor subnets - I have real-time data on all 118 networks
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className={`${authkitStyles.textPrimary} font-semibold`}>109x faster processing</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className={`${authkitStyles.textPrimary} font-semibold`}>83% cost reduction</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className={`${authkitStyles.textPrimary} font-semibold`}>AI-powered insights</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`${authkitStyles.glassCard} text-center p-4`}
              >
                <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${authkitStyles.textAccent} mb-1`}>
                  {stat.value}
                </div>
                <div className={`text-xs ${authkitStyles.textMuted} uppercase tracking-wide`}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Chat Interface - Main Feature */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-12"
      >
        <SubnetChatInterface />
      </motion.div>
    </div>
  );
}