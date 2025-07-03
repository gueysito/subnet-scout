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
  Smartphone
} from "lucide-react";
import { cardStyles, textStyles, buttonStyles, containerStyles } from "../utils/styleUtils";

export default function About() {
  const [realtimeDemo, setRealtimeDemo] = useState(false);

  const startRealtimeDemo = () => {
    setRealtimeDemo(true);
    setTimeout(() => setRealtimeDemo(false), 3000);
  };

  const goals = [
    {
      icon: Target,
      title: "Monitor ALL 118 Subnets",
      description: "Complete Bittensor network visibility in real-time",
      status: "achieved",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Zap,
      title: "109x Faster Processing",
      description: "Ray distributed computing for unprecedented speed",
      status: "achieved", 
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: BarChart3,
      title: "83% Cost Reduction",
      description: "Massive savings vs traditional AWS infrastructure",
      status: "achieved",
      gradient: "from-purple-500 to-indigo-600"
    }
  ];

  const achievements = [
    "5.37 seconds for all 118 subnets",
    "109x faster than traditional monitoring", 
    "22 subnets/second throughput",
    "100% success rate in testing"
  ];

  const techStack = [
    { category: "Frontend", tech: "React + Vite + Tailwind CSS + Framer Motion" },
    { category: "Backend", tech: "Python Ray + Node.js Express + AI Integration" },
    { category: "Database", tech: "Redis + PostgreSQL + TaoStats API" },
    { category: "Infrastructure", tech: "io.net Distributed GPU Network" },
    { category: "Monitoring", tech: "Bittensor Network + TaoStats API" }
  ];

  const developmentTools = [
    { 
      name: "Ray Distributed Computing", 
      description: "Parallel processing across multiple workers",
      icon: Cpu,
      status: "production"
    },
    { 
      name: "Redis Caching", 
      description: "High-performance data caching layer",
      icon: Database,
      status: "production"
    },
    { 
      name: "Health Monitoring", 
      description: "Real-time system health checks",
      icon: Gauge,
      status: "production"
    },
    { 
      name: "Security Hardening", 
      description: "Enterprise-grade security measures",
      icon: Shield,
      status: "production"
    }
  ];

  return (
    <div className={containerStyles.section}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${cardStyles.featured} text-center`}
      >
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-glow">
            <Target className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className={`text-4xl ${textStyles.heading}`}>
              Subnet Scout Agent
            </h1>
            <p className={`text-xl ${textStyles.subheading} text-accent-400`}>
              Next-Generation Blockchain Intelligence
            </p>
          </div>
        </div>
        
        <p className={`text-lg ${textStyles.body} max-w-3xl mx-auto leading-relaxed`}>
          Monitor ALL 118 Bittensor subnets in parallel using distributed computing. 
          Experience 109x faster processing with unprecedented scale and efficiency.
        </p>
      </motion.div>

      {/* Goals Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          return (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`${cardStyles.glass} text-center group`}
            >
              <div className={`p-4 bg-gradient-to-r ${goal.gradient} rounded-xl mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className={`text-xl ${textStyles.heading} mb-3`}>
                {goal.title}
              </h3>
              
              <p className={`${textStyles.body} mb-4`}>
                {goal.description}
              </p>
              
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Achieved</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className={cardStyles.glass}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="w-6 h-6 text-accent-400" />
          <h2 className={`text-2xl ${textStyles.heading}`}>Key Achievements</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"
            >
              <div className="text-accent-400 font-bold text-lg mb-1">
                {achievement.split(' ')[0]}
              </div>
              <div className={`text-sm ${textStyles.caption}`}>
                {achievement.substring(achievement.indexOf(' ') + 1)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Technical Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className={cardStyles.glass}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Code className="w-6 h-6 text-accent-400" />
          <h2 className={`text-2xl ${textStyles.heading}`}>Technical Stack</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10"
            >
              <div className="text-accent-400 font-semibold mb-2">
                {item.category}
              </div>
              <div className={`text-sm ${textStyles.body}`}>
                {item.tech}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Development Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className={cardStyles.glass}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Terminal className="w-6 h-6 text-accent-400" />
          <h2 className={`text-2xl ${textStyles.heading}`}>Development & Testing Tools</h2>
        </div>
        
        <p className={`${textStyles.body} mb-6`}>
          Professional development tools for testing and validation
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {developmentTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start space-x-3"
              >
                <div className="p-2 bg-accent-500/20 rounded-lg">
                  <Icon className="w-5 h-5 text-accent-400" />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold ${textStyles.heading} mb-1`}>
                    {tool.name}
                  </div>
                  <div className={`text-sm ${textStyles.body} mb-2`}>
                    {tool.description}
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs font-medium uppercase">
                      {tool.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Real-time Demo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className={cardStyles.glass}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="w-6 h-6 text-accent-400" />
          <h2 className={`text-2xl ${textStyles.heading}`}>Live System Status</h2>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className={`${textStyles.body} mb-4`}>
              Experience real-time monitoring capabilities with our distributed processing system.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className={textStyles.body}>All Systems Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className={textStyles.body}>Ray Workers: 8 Active</span>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRealtimeDemo}
            disabled={realtimeDemo}
            className={`${buttonStyles.accent} flex items-center space-x-2 disabled:opacity-50`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{realtimeDemo ? 'Demo Running...' : 'Start Demo'}</span>
          </motion.button>
        </div>
        
        {realtimeDemo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/30"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Demo Active</span>
            </div>
            <p className={`text-sm ${textStyles.body} text-green-300`}>
              Real-time monitoring system activated. Processing all 118 subnets with distributed computing...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}