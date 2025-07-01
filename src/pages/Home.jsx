import React from "react";
import DistributedMonitor from "../components/DistributedMonitor.jsx";

export default function Home() {

  return (
    <div className="center-everything" style={{maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px'}}>
      {/* Hero Section - Distributed Monitor Showcase */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 rounded-lg p-8 border border-blue-500/30">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 Subnet Scout Agent
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Monitor ALL 118 Bittensor subnets in parallel using Ray distributed computing
          </p>
          <p className="text-lg text-blue-400 font-semibold">
            ⚡ 109x faster than traditional monitoring • 💰 83% cheaper than AWS
          </p>
        </div>
      </div>

      {/* Distributed Monitor - Our Key Differentiator */}
      <DistributedMonitor />

      {/* Additional Info Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">💡 How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-400">🔄 Distributed Processing</h3>
            <p className="text-gray-300">
              Uses Ray distributed computing to process all 118 Bittensor subnets simultaneously across multiple workers, 
              achieving 109x faster performance than traditional sequential monitoring.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-green-400">💰 Cost Efficiency</h3>
            <p className="text-gray-300">
              Leverages io.net's 327K+ GPU network for 83% cost savings vs AWS. 
              What costs $900/month on traditional cloud runs for just $150/month on our system.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-purple-400">🤖 AI-Powered Analysis</h3>
            <p className="text-gray-300">
              Integrates Claude AI for intelligent subnet analysis, risk assessment, and performance insights 
              beyond simple metrics.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-orange-400">📊 Real-Time Insights</h3>
            <p className="text-gray-300">
              Live performance metrics, top performer rankings, and competitive analysis 
              updated in real-time as monitoring completes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}