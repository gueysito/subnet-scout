import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Zap, 
  BarChart3, 
  Globe, 
  Code, 
  Database,
  Cloud,
  Cpu,
  Gauge,
  Shield,
  CheckCircle,
  GitBranch,
  Terminal,
  Smartphone,
  DollarSign,
  Brain,
  TrendingUp,
  Users,
  Github,
  Twitter,
  CheckCircle2,
  Sparkles,
  Activity,
  Network,
  Clock,
  Award
} from "lucide-react";
import { cardStyles, textStyles, buttonStyles, containerStyles } from "../utils/styleUtils";

export default function About() {
  const [realtimeDemo, setRealtimeDemo] = useState(false);

  const startRealtimeDemo = () => {
    setRealtimeDemo(true);
    setTimeout(() => setRealtimeDemo(false), 3000);
  };

  const benefits = [
    {
      icon: Cpu,
      title: "109x Faster Processing",
      description: "Ray distributed computing processes all 118 subnets simultaneously across multiple workers",
      stat: "5.37s",
      statLabel: "Full analysis time",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: DollarSign,
      title: "83% Cost Savings",
      description: "io.net's 327K+ GPU network reduces costs from $900/month on AWS to just $150/month",
      stat: "$750",
      statLabel: "Monthly savings",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Multiple AI models provide deep insights: DeepSeek-R1, Llama-3.3-70B, Claude Sonnet",
      stat: "4 Models",
      statLabel: "AI engines",
      gradient: "from-purple-500 to-violet-500"
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Advanced risk analysis with composite scoring, volatility tracking, and anomaly detection",
      stat: "97%",
      statLabel: "Accuracy rate",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const integrations = [
    {
      name: "Kaito Yaps",
      description: "Mindshare metrics and attention tracking for all subnet participants",
      status: "Active",
      features: ["Yaps scoring", "7-day trends", "Attention metrics", "Reputation tracking"],
      icon: Activity,
      color: "text-green-500"
    },
    {
      name: "Ethos Identity",
      description: "Wallet-to-identity mapping with DAO participation and contributor roles",
      status: "Integration Ready",
      features: ["Identity profiles", "DAO badges", "Social linking", "Contributor scores"],
      icon: Users,
      color: "text-blue-500"
    },
    {
      name: "GitHub Analytics",
      description: "Developer activity tracking and repository contribution analysis",
      status: "Active",
      features: ["Commit tracking", "PR analysis", "Dev scoring", "Project health"],
      icon: Github,
      color: "text-purple-500"
    },
    {
      name: "TaoStats API",
      description: "Real-time subnet data with historical analysis and performance metrics",
      status: "Active",
      features: ["Live data", "Historical trends", "Performance tracking", "Validator metrics"],
      icon: BarChart3,
      color: "text-orange-500"
    }
  ];

  const technologies = [
    { name: "Ray Distributed Computing", description: "Parallel processing across multiple workers" },
    { name: "io.net GPU Network", description: "327K+ GPU nodes for cost-effective computing" },
    { name: "React + Vite", description: "Modern frontend with hot module replacement" },
    { name: "TailwindCSS + Framer Motion", description: "Beautiful animations and responsive design" },
    { name: "Recharts", description: "Interactive data visualizations and charts" },
    { name: "Multiple AI Models", description: "DeepSeek-R1, Llama-3.3-70B, Claude Sonnet" },
    { name: "Redis Caching", description: "High-performance data caching and rate limiting" },
    { name: "Express.js Backend", description: "Robust API layer with comprehensive endpoints" }
  ];

  const metrics = [
    { label: "Subnets Monitored", value: "118", icon: Network },
    { label: "Performance Boost", value: "109x", icon: Zap },
    { label: "Cost Reduction", value: "83%", icon: DollarSign },
    { label: "Analysis Speed", value: "5.37s", icon: Clock },
    { label: "AI Models", value: "4", icon: Brain },
    { label: "Accuracy Rate", value: "97%", icon: Target }
  ];

  return (
    <div className={containerStyles.section}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`${cardStyles.featured} mb-12 text-center`}
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-3xl flex items-center justify-center shadow-glow-gold">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className={`text-5xl ${textStyles.heading} mb-4 bg-gradient-to-r from-white via-accent-200 to-accent-300 bg-clip-text text-transparent`}>
          The Future of Subnet Intelligence
        </h1>
        
        <p className={`text-xl ${textStyles.body} mb-8 max-w-4xl mx-auto leading-relaxed`}>
          Subnet Scout revolutionizes Bittensor subnet monitoring with distributed computing, 
          AI-powered insights, and real-time intelligence. Built on io.net's massive GPU network 
          for unprecedented performance and cost efficiency.
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${cardStyles.glass} text-center p-4`}
              >
                <Icon className="w-6 h-6 text-accent-400 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${textStyles.accent} mb-1`}>
                  {metric.value}
                </div>
                <div className={`text-xs ${textStyles.caption} uppercase tracking-wide`}>
                  {metric.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Key Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-12"
      >
        <div className="text-center mb-12">
          <h2 className={`text-4xl ${textStyles.heading} mb-4`}>
            Revolutionary Advantages
          </h2>
          <p className={`text-xl ${textStyles.body} max-w-2xl mx-auto`}>
            Discover how Subnet Scout transforms blockchain intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className={`${cardStyles.glass} group cursor-pointer`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${benefit.gradient} shadow-premium flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl ${textStyles.heading} mb-2`}>
                      {benefit.title}
                    </h3>
                    <p className={`${textStyles.body} mb-4 leading-relaxed`}>
                      {benefit.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className={`text-3xl font-bold ${textStyles.accent}`}>
                        {benefit.stat}
                      </div>
                      <div className={`text-sm ${textStyles.caption} uppercase tracking-wide`}>
                        {benefit.statLabel}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-12"
      >
        <div className="text-center mb-12">
          <h2 className={`text-4xl ${textStyles.heading} mb-4`}>
            🚀 Integrated Ecosystem
          </h2>
          <p className={`text-xl ${textStyles.body} max-w-2xl mx-auto`}>
            Comprehensive data sources for complete subnet intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className={`${cardStyles.glass} hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-8 h-8 ${integration.color}`} />
                    <div>
                      <h3 className={`text-xl ${textStyles.heading}`}>
                        {integration.name}
                      </h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        integration.status === 'Active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {integration.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className={`${textStyles.body} mb-4`}>
                  {integration.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {integration.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className={`text-sm ${textStyles.body}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Technology Stack */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mb-12"
      >
        <div className="text-center mb-12">
          <h2 className={`text-4xl ${textStyles.heading} mb-4`}>
            ⚡ Cutting-Edge Technology
          </h2>
          <p className={`text-xl ${textStyles.body} max-w-2xl mx-auto`}>
            Built with modern, scalable technologies for maximum performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
              className={`${cardStyles.glass} text-center p-4 hover:scale-105 transition-transform duration-300`}
            >
              <h4 className={`text-sm font-semibold ${textStyles.heading} mb-2`}>
                {tech.name}
              </h4>
              <p className={`text-xs ${textStyles.body} opacity-80`}>
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className={`${cardStyles.featured} text-center`}
      >
        <h2 className={`text-3xl ${textStyles.heading} mb-4`}>
          Ready to Revolutionize Your Subnet Intelligence?
        </h2>
        <p className={`text-lg ${textStyles.body} mb-8 max-w-2xl mx-auto`}>
          Join the future of Bittensor subnet monitoring with AI-powered insights, 
          distributed computing, and real-time intelligence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="/explore"
            className={buttonStyles.primary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Explore Subnets
          </motion.a>
          <motion.a
            href="/ai-insights"
            className={buttonStyles.secondary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🤖 View AI Insights
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}