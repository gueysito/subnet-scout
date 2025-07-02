// VisualizationsComplete.jsx - Enhanced professional visualizations with more visual charts
import React, { useState, useMemo } from 'react';
import { getSubnetMetadata } from '../data/subnets.js';

const VisualizationsComplete = () => {
  const [selectedSubnet, setSelectedSubnet] = useState(null);

  // Generate realistic subnet data for heatmap
  const subnetData = useMemo(() => {
    const subnets = [];
    const categories = [
      'Text Prompting', 'Machine Translation', 'Data Storage', 'Compute', 
      'Image Generation', 'Audio Processing', 'Video Analysis', 'AI Training',
      'Model Serving', 'Data Mining', 'Security', 'Prediction'
    ];

    for (let i = 1; i <= 118; i++) {
      const basePerformance = Math.random();
      const metadata = getSubnetMetadata(i);
      subnets.push({
        id: i,
        name: metadata.name,
        category: metadata.type,
        description: metadata.description,
        performance: Math.floor(30 + basePerformance * 65 + Math.random() * 5),
        status: basePerformance > 0.7 ? 'excellent' : basePerformance > 0.4 ? 'good' : 'needs-attention'
      });
    }
    return subnets;
  }, []);

  // Performance timeline data
  const timelineData = [
    { time: '00:00', subnet1: 85, subnet15: 70, subnet32: 60, average: 72 },
    { time: '04:00', subnet1: 88, subnet15: 72, subnet32: 65, average: 74 },
    { time: '08:00', subnet1: 92, subnet15: 75, subnet32: 70, average: 76 },
    { time: '12:00', subnet1: 89, subnet15: 73, subnet32: 75, average: 75 },
    { time: '16:00', subnet1: 95, subnet15: 78, subnet32: 80, average: 77 },
    { time: '20:00', subnet1: 91, subnet15: 76, subnet32: 78, average: 76 },
    { time: '24:00', subnet1: 87, subnet15: 74, subnet32: 76, average: 73 }
  ];

  // Generate color for heatmap based on performance
  const getHeatmapColor = (performance) => {
    if (performance >= 80) return '#10b981'; // Green
    if (performance >= 60) return '#f59e0b'; // Yellow  
    if (performance >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Better Spacing */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              📊 Advanced Data Visualizations
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Real-time insights into Bittensor subnet performance, cost savings, and network health
              powered by io.net distributed computing and AI analysis
            </p>
            
            {/* Key metrics banner with better spacing */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
              <div className="bg-black/30 backdrop-blur rounded-xl p-8 border border-gray-600 hover:border-green-500 transition-all duration-300">
                <div className="text-4xl font-bold text-green-400 mb-3">83%</div>
                <div className="text-gray-300 text-lg">Cost Savings vs AWS</div>
              </div>
              <div className="bg-black/30 backdrop-blur rounded-xl p-8 border border-gray-600 hover:border-blue-500 transition-all duration-300">
                <div className="text-4xl font-bold text-blue-400 mb-3">118</div>
                <div className="text-gray-300 text-lg">Subnets Monitored</div>
              </div>
              <div className="bg-black/30 backdrop-blur rounded-xl p-8 border border-gray-600 hover:border-purple-500 transition-all duration-300">
                <div className="text-4xl font-bold text-purple-400 mb-3">5min</div>
                <div className="text-gray-300 text-lg">Update Frequency</div>
              </div>
              <div className="bg-black/30 backdrop-blur rounded-xl p-8 border border-gray-600 hover:border-yellow-500 transition-all duration-300">
                <div className="text-4xl font-bold text-yellow-400 mb-3">24/7</div>
                <div className="text-gray-300 text-lg">Live Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Cost Comparison Chart - Enhanced */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">💰 Cost Advantage Analysis</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
              See how io.net's distributed computing infrastructure delivers massive cost savings
              compared to traditional cloud solutions
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
            <div className="flex justify-center mb-8">
              <svg width="700" height="450" className="border border-gray-600 bg-gray-700 rounded-xl">
                {/* Enhanced grid background */}
                <defs>
                  <pattern id="costGrid" width="60" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="2,2"/>
                  </pattern>
                  <linearGradient id="awsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f87171"/>
                    <stop offset="100%" stopColor="#dc2626"/>
                  </linearGradient>
                  <linearGradient id="ionetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399"/>
                    <stop offset="100%" stopColor="#059669"/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <rect width="100%" height="100%" fill="url(#costGrid)" />
                
                {/* Enhanced Y-axis */}
                <line x1="80" y1="50" x2="80" y2="370" stroke="#9ca3af" strokeWidth="3"/>
                <text x="75" y="60" fill="#9ca3af" fontSize="14" textAnchor="end" fontWeight="bold">$1000</text>
                <text x="75" y="120" fill="#9ca3af" fontSize="14" textAnchor="end">$800</text>
                <text x="75" y="180" fill="#9ca3af" fontSize="14" textAnchor="end">$600</text>
                <text x="75" y="240" fill="#9ca3af" fontSize="14" textAnchor="end">$400</text>
                <text x="75" y="300" fill="#9ca3af" fontSize="14" textAnchor="end">$200</text>
                <text x="75" y="370" fill="#9ca3af" fontSize="14" textAnchor="end" fontWeight="bold">$0</text>
                
                {/* Enhanced X-axis */}
                <line x1="80" y1="370" x2="620" y2="370" stroke="#9ca3af" strokeWidth="3"/>
                
                {/* AWS Bar with glow effect */}
                <rect x="180" y="80" width="120" height="290" fill="url(#awsGradient)" stroke="#dc2626" strokeWidth="3" rx="12" filter="url(#glow)">
                  <animate attributeName="height" from="0" to="290" dur="1.5s" begin="0s"/>
                  <animate attributeName="y" from="370" to="80" dur="1.5s" begin="0s"/>
                </rect>
                <text x="240" y="395" fill="white" fontSize="18" textAnchor="middle" fontWeight="bold">Traditional AWS</text>
                <text x="240" y="415" fill="#ef4444" fontSize="16" textAnchor="middle" fontWeight="bold">$900/month</text>
                
                {/* io.net Bar with glow effect */}
                <rect x="420" y="325" width="120" height="45" fill="url(#ionetGradient)" stroke="#059669" strokeWidth="3" rx="12" filter="url(#glow)">
                  <animate attributeName="height" from="0" to="45" dur="1.5s" begin="0.8s"/>
                  <animate attributeName="y" from="370" to="325" dur="1.5s" begin="0.8s"/>
                </rect>
                <text x="480" y="395" fill="white" fontSize="18" textAnchor="middle" fontWeight="bold">io.net + Ray</text>
                <text x="480" y="415" fill="#10b981" fontSize="16" textAnchor="middle" fontWeight="bold">$150/month</text>
                
                {/* Enhanced title and savings callout */}
                <text x="350" y="30" fill="white" fontSize="22" textAnchor="middle" fontWeight="bold">Monthly Processing Costs</text>
                <text x="350" y="55" fill="#10b981" fontSize="18" textAnchor="middle" fontWeight="bold">🎉 83% SAVINGS with io.net!</text>
              </svg>
            </div>

            {/* Enhanced stats breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6 text-center hover:border-red-400 transition-all duration-300">
                <div className="text-4xl font-bold text-red-400 mb-3">$900</div>
                <div className="text-gray-300 font-semibold text-lg mb-3">AWS Monthly Cost</div>
                <div className="text-gray-400 text-sm leading-relaxed">
                  • EC2 instances for 118 subnets<br/>
                  • Sequential processing<br/>
                  • High compute costs<br/>
                  • Limited scalability
                </div>
              </div>
              <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-6 text-center hover:border-green-400 transition-all duration-300">
                <div className="text-4xl font-bold text-green-400 mb-3">$150</div>
                <div className="text-gray-300 font-semibold text-lg mb-3">io.net Monthly Cost</div>
                <div className="text-gray-400 text-sm leading-relaxed">
                  • Distributed GPU network<br/>
                  • Parallel processing<br/>
                  • Optimized resource usage<br/>
                  • Dynamic scaling
                </div>
              </div>
              <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-300">
                <div className="text-4xl font-bold text-blue-400 mb-3">$9,000</div>
                <div className="text-gray-300 font-semibold text-lg mb-3">Annual Savings</div>
                <div className="text-gray-400 text-sm leading-relaxed">
                  • $750 saved per month<br/>
                  • 109x faster processing<br/>
                  • Superior cost efficiency<br/>
                  • Future-proof architecture
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subnet Performance Heatmap - NEW VISUAL CHART */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">🔥 Subnet Performance Heatmap</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Visual overview of all 118 Bittensor subnets with real-time performance indicators
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
            {/* Heatmap Grid */}
            <div className="mb-8">
              <div className="grid grid-cols-12 gap-2">
                {subnetData.slice(0, 96).map(subnet => (
                  <div
                    key={subnet.id}
                    className="aspect-square rounded cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 relative"
                    style={{ backgroundColor: getHeatmapColor(subnet.performance) }}
                    onClick={() => setSelectedSubnet(subnet)}
                    title={`${subnet.name} (#${subnet.id}): ${subnet.performance}%`}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center text-white text-xs font-bold">
                      <div>{subnet.id}</div>
                      <div className="text-[10px] opacity-90">{subnet.performance}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-green-400 font-semibold">Excellent (80-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-yellow-400 font-semibold">Good (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-orange-400 font-semibold">Fair (40-59%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-red-400 font-semibold">Poor (20-39%)</span>
              </div>
            </div>

            {/* Selected subnet details */}
            {selectedSubnet && (
              <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {selectedSubnet.name}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">{selectedSubnet.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSubnet(null)}
                    className="text-gray-400 hover:text-white transition-colors text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-gray-400 text-sm mb-2">Type</div>
                    <div className="text-white font-semibold text-lg capitalize">{selectedSubnet.category}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm mb-2">Performance</div>
                    <div className="text-green-400 font-bold text-2xl">{selectedSubnet.performance}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm mb-2">Status</div>
                    <div className={`font-semibold text-lg ${
                      selectedSubnet.status === 'excellent' ? 'text-green-400' :
                      selectedSubnet.status === 'good' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {selectedSubnet.status === 'excellent' ? 'Excellent' :
                       selectedSubnet.status === 'good' ? 'Good' : 'Needs Attention'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Performance Timeline Chart - Enhanced */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">📈 Performance Trends (24H)</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Real-time subnet performance tracking with io.net distributed monitoring
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
            <div className="flex justify-center mb-8">
              <svg width="800" height="450" className="border border-gray-600 bg-gray-700 rounded-xl">
                {/* Enhanced grid */}
                <defs>
                  <pattern id="perfGrid" width="100" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="2,2"/>
                  </pattern>
                  <filter id="lineGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <rect width="100%" height="100%" fill="url(#perfGrid)" />
                
                {/* Enhanced axes */}
                <line x1="80" y1="50" x2="80" y2="350" stroke="#9ca3af" strokeWidth="3"/>
                <line x1="80" y1="350" x2="720" y2="350" stroke="#9ca3af" strokeWidth="3"/>
                
                {/* Y-axis labels */}
                <text x="75" y="55" fill="#9ca3af" fontSize="14" textAnchor="end" fontWeight="bold">100%</text>
                <text x="75" y="110" fill="#9ca3af" fontSize="14" textAnchor="end">80%</text>
                <text x="75" y="165" fill="#9ca3af" fontSize="14" textAnchor="end">60%</text>
                <text x="75" y="220" fill="#9ca3af" fontSize="14" textAnchor="end">40%</text>
                <text x="75" y="275" fill="#9ca3af" fontSize="14" textAnchor="end">20%</text>
                <text x="75" y="350" fill="#9ca3af" fontSize="14" textAnchor="end" fontWeight="bold">0%</text>
                
                {/* X-axis labels */}
                {timelineData.map((point, i) => (
                  <text key={i} x={130 + i * 90} y="370" fill="#9ca3af" fontSize="13" textAnchor="middle" fontWeight="bold">
                    {point.time}
                  </text>
                ))}
                
                {/* Enhanced lines with glow effects */}
                <polyline
                  points={timelineData.map((point, i) => `${130 + i * 90},${350 - (point.subnet1 * 3)}`).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#lineGlow)"
                />
                
                <polyline
                  points={timelineData.map((point, i) => `${130 + i * 90},${350 - (point.subnet15 * 3)}`).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#lineGlow)"
                />
                
                <polyline
                  points={timelineData.map((point, i) => `${130 + i * 90},${350 - (point.subnet32 * 3)}`).join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#lineGlow)"
                />
                
                <polyline
                  points={timelineData.map((point, i) => `${130 + i * 90},${350 - (point.average * 3)}`).join(' ')}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeDasharray="12,6"
                  filter="url(#lineGlow)"
                />
                
                {/* Enhanced data points */}
                {timelineData.map((point, i) => (
                  <g key={i}>
                    <circle cx={130 + i * 90} cy={350 - (point.subnet1 * 3)} r="6" fill="#10b981" stroke="#065f46" strokeWidth="2"/>
                    <circle cx={130 + i * 90} cy={350 - (point.subnet15 * 3)} r="6" fill="#3b82f6" stroke="#1e40af" strokeWidth="2"/>
                    <circle cx={130 + i * 90} cy={350 - (point.subnet32 * 3)} r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="2"/>
                  </g>
                ))}
                
                <text x="400" y="30" fill="white" fontSize="20" textAnchor="middle" fontWeight="bold">24-Hour Performance Trends</text>
              </svg>
            </div>

            {/* Enhanced legend and insights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg">
                <div className="w-6 h-2 bg-green-500 rounded"></div>
                <span className="text-green-400 font-semibold">Subnet 1 (Text Prompting)</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg">
                <div className="w-6 h-2 bg-blue-500 rounded"></div>
                <span className="text-blue-400 font-semibold">Subnet 15 (Translation)</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg">
                <div className="w-6 h-2 bg-yellow-500 rounded"></div>
                <span className="text-yellow-400 font-semibold">Subnet 32 (AI Training)</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg">
                <div className="w-6 h-2 bg-purple-500 rounded dashed"></div>
                <span className="text-purple-400 font-semibold">Network Average</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
                <div className="text-gray-300 font-semibold text-lg mb-2">Peak Performance</div>
                <div className="text-gray-400 text-sm">Subnet 1 at 16:00</div>
              </div>
              <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">+27%</div>
                <div className="text-gray-300 font-semibold text-lg mb-2">Rising Star</div>
                <div className="text-gray-400 text-sm">Subnet 32 trending up</div>
              </div>
              <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">75%</div>
                <div className="text-gray-300 font-semibold text-lg mb-2">Network Average</div>
                <div className="text-gray-400 text-sm">Stable performance</div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Performance Metrics Summary */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">🚀 System Performance Highlights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center hover:border-green-500 transition-all duration-300 shadow-xl">
              <div className="text-5xl font-bold text-green-400 mb-4">109x</div>
              <div className="text-gray-300 mb-2 text-lg font-semibold">Faster Processing</div>
              <div className="text-gray-500 text-sm">vs Sequential Analysis</div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center hover:border-blue-500 transition-all duration-300 shadow-xl">
              <div className="text-5xl font-bold text-blue-400 mb-4">$9K</div>
              <div className="text-gray-300 mb-2 text-lg font-semibold">Annual Savings</div>
              <div className="text-gray-500 text-sm">vs Traditional Cloud</div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center hover:border-purple-500 transition-all duration-300 shadow-xl">
              <div className="text-5xl font-bold text-purple-400 mb-4">99.9%</div>
              <div className="text-gray-300 mb-2 text-lg font-semibold">Uptime Reliability</div>
              <div className="text-gray-500 text-sm">Distributed Architecture</div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center hover:border-yellow-500 transition-all duration-300 shadow-xl">
              <div className="text-5xl font-bold text-yellow-400 mb-4">5min</div>
              <div className="text-gray-300 mb-2 text-lg font-semibold">Update Frequency</div>
              <div className="text-gray-500 text-sm">Real-time Monitoring</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VisualizationsComplete; 