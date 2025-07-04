import React from "react";
import { motion } from "framer-motion";
import { Zap, DollarSign, Brain, BarChart3, Sparkles, Cpu, Shield, TrendingUp } from "lucide-react";
import SubnetChatInterface from "../components/SubnetChatInterface.jsx";
import { containerStyles, cardStyles, textStyles, buttonStyles, animations } from "../utils/styleUtils";

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
        className={`${cardStyles.featured} mb-12 text-center relative`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-purple-500/5 to-blue-500/5 rounded-2xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)] rounded-2xl"></div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-3xl flex items-center justify-center shadow-glow-gold">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className={`text-6xl ${textStyles.heading} bg-gradient-to-r from-white via-accent-200 to-accent-300 bg-clip-text text-transparent`}>
                Subnet Scout
              </h1>
            </div>
            <div className="inline-block px-4 py-2 bg-accent-500/20 rounded-full border border-accent-300/30 mb-6">
              <span className={`text-sm ${textStyles.caption} text-accent-300 font-medium tracking-wide uppercase`}>
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
            <p className={`text-2xl ${textStyles.subheading} mb-4 max-w-4xl mx-auto leading-relaxed`}>
              Ask me anything about Bittensor subnets - I have real-time data on all 118 networks
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-lg">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className={`${textStyles.body} font-semibold`}>109x faster processing</span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span className={`${textStyles.body} font-semibold`}>83% cost reduction</span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className={`${textStyles.body} font-semibold`}>AI-powered insights</span>
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
                  className={`${cardStyles.glass} text-center p-4`}
                >
                  <Icon className="w-6 h-6 text-accent-400 mx-auto mb-2" />
                  <div className={`text-2xl font-bold ${textStyles.accent} mb-1`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs ${textStyles.caption} uppercase tracking-wide`}>
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
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