import React from "react";
import { motion } from "framer-motion";
import { Zap, DollarSign, Brain, BarChart3, Sparkles, Cpu, Shield, TrendingUp } from "lucide-react";
import DistributedMonitor from "../components/DistributedMonitor.jsx";
import { containerStyles, cardStyles, textStyles, buttonStyles, animations } from "../utils/styleUtils";

export default function Home() {

  const features = [
    {
      icon: Cpu,
      title: "Distributed Processing",
      subtitle: "109x Faster Performance", 
      description: "Uses Ray distributed computing to process all 118 Bittensor subnets simultaneously across multiple workers, achieving unprecedented speed.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: DollarSign,
      title: "Cost Efficiency",
      subtitle: "83% Cost Savings",
      description: "Leverages io.net's 327K+ GPU network for massive savings. What costs $900/month on AWS runs for just $150/month.",
      gradient: "from-emerald-500 to-green-500",
      delay: 0.1
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis", 
      subtitle: "Intelligent Insights",
      description: "Integrates multiple AI models for intelligent subnet analysis, risk assessment, and performance insights beyond simple metrics.",
      gradient: "from-purple-500 to-violet-500",
      delay: 0.2
    },
    {
      icon: TrendingUp,
      title: "Real-Time Intelligence",
      subtitle: "Live Performance Data",
      description: "Live performance metrics, top performer rankings, and competitive analysis updated in real-time with predictive forecasting.",
      gradient: "from-orange-500 to-amber-500",
      delay: 0.3
    }
  ];

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
                Next-Generation Blockchain Intelligence
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
              Monitor ALL 118 Bittensor subnets in parallel using Ray distributed computing
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

      {/* Distributed Monitor - Our Key Differentiator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-12"
      >
        <DistributedMonitor />
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mb-12"
      >
        <div className="text-center mb-12">
          <h2 className={`text-4xl ${textStyles.heading} mb-4`}>
            How It Works
          </h2>
          <p className={`text-xl ${textStyles.body} max-w-2xl mx-auto`}>
            Discover the advanced technology powering the next generation of blockchain intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + feature.delay }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`${cardStyles.glass} group cursor-pointer`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-premium flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`text-xl ${textStyles.heading}`}>
                        {feature.title}
                      </h3>
                      <span className={`text-sm ${textStyles.caption} px-2 py-1 bg-white/10 rounded-full`}>
                        {feature.subtitle}
                      </span>
                    </div>
                    <p className={`${textStyles.body} leading-relaxed`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}