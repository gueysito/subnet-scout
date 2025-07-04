import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { GitBranch, Star, GitCommit, Users, Activity, TrendingUp, Download, Filter, Calendar, Code, AlertCircle } from 'lucide-react';
import { containerStyles, cardStyles, textStyles, buttonStyles, authkitStyles } from '../utils/styleUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const GitHubInsights = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedSubnets, setSelectedSubnets] = useState([]);
  const [sortBy, setSortBy] = useState('commits');
  const [showInactive, setShowInactive] = useState(false);
  const [data, setData] = useState({
    subnets: [],
    timeSeriesData: [],
    languageStats: [],
    contributorStats: [],
    activityMetrics: {}
  });

  // Generate comprehensive GitHub data
  useEffect(() => {
    const generateGitHubData = () => {
      const subnets = [
        { id: 1, name: 'Text Prompting', repo: 'opentensor/text-prompting', language: 'Python', category: 'NLP' },
        { id: 18, name: 'Cortext', repo: 'cortext-io/subnet', language: 'TypeScript', category: 'AI/ML' },
        { id: 21, name: 'FileTAO', repo: 'filetao/subnet', language: 'Python', category: 'Storage' },
        { id: 9, name: 'Pretraining', repo: 'opentensor/pretraining', language: 'Python', category: 'AI/ML' },
        { id: 7, name: 'Connectome', repo: 'opentensor/connectome', language: 'Python', category: 'Infrastructure' },
        { id: 11, name: 'Text-to-Speech', repo: 'tts-subnet/core', language: 'Python', category: 'Audio' },
        { id: 13, name: 'Data Universe', repo: 'data-universe/subnet', language: 'JavaScript', category: 'Data' },
        { id: 15, name: 'Blockchain Insights', repo: 'blockchain-insights/subnet', language: 'Rust', category: 'Analytics' },
        { id: 19, name: 'Vision AI', repo: 'vision-ai/subnet', language: 'Python', category: 'Computer Vision' },
        { id: 23, name: 'DeFi Oracle', repo: 'defi-oracle/subnet', language: 'Solidity', category: 'DeFi' },
        { id: 27, name: 'Compute Network', repo: 'compute-network/subnet', language: 'Go', category: 'Infrastructure' },
        { id: 31, name: 'Social Graph', repo: 'social-graph/subnet', language: 'TypeScript', category: 'Social' },
        { id: 33, name: 'Gaming AI', repo: 'gaming-ai/subnet', language: 'C++', category: 'Gaming' },
        { id: 37, name: 'Medical AI', repo: 'medical-ai/subnet', language: 'Python', category: 'Healthcare' },
        { id: 41, name: 'Supply Chain', repo: 'supply-chain/subnet', language: 'Java', category: 'Logistics' },
        { id: 43, name: 'Climate Data', repo: 'climate-data/subnet', language: 'R', category: 'Environment' },
        { id: 47, name: 'Financial Models', repo: 'financial-models/subnet', language: 'Python', category: 'Finance' },
        { id: 51, name: 'IoT Network', repo: 'iot-network/subnet', language: 'C', category: 'IoT' },
        { id: 53, name: 'Education AI', repo: 'education-ai/subnet', language: 'Python', category: 'Education' },
        { id: 59, name: 'Security Scanner', repo: 'security-scanner/subnet', language: 'Rust', category: 'Security' }
      ];

      const enrichedSubnets = subnets.map(subnet => {
        const baseCommits = Math.floor(Math.random() * 200) + 50;
        const baseStars = Math.floor(Math.random() * 1000) + 10;
        const baseContributors = Math.floor(Math.random() * 50) + 5;
        const baseIssues = Math.floor(Math.random() * 100) + 1;
        const basePRs = Math.floor(Math.random() * 80) + 5;
        const lastCommitDays = Math.floor(Math.random() * 30) + 1;
        
        return {
          ...subnet,
          stats: {
            commits: baseCommits,
            stars: baseStars,
            contributors: baseContributors,
            issues: baseIssues,
            pullRequests: basePRs,
            lastCommitDays,
            codeChurn: Math.floor(Math.random() * 10000) + 1000,
            testCoverage: Math.floor(Math.random() * 40) + 60,
            dependencies: Math.floor(Math.random() * 200) + 50,
            vulnerabilities: Math.floor(Math.random() * 5),
            activity: Math.max(0, 100 - lastCommitDays * 3 + Math.random() * 20)
          },
          trends: {
            commits: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
              count: Math.floor(Math.random() * 10) + 1
            })),
            stars: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
              count: baseStars + Math.floor(Math.random() * 50) - 25
            }))
          }
        };
      });

      // Language statistics
      const languageStats = enrichedSubnets.reduce((acc, subnet) => {
        acc[subnet.language] = (acc[subnet.language] || 0) + 1;
        return acc;
      }, {});

      // Activity metrics
      const activityMetrics = {
        totalCommits: enrichedSubnets.reduce((sum, s) => sum + s.stats.commits, 0),
        totalStars: enrichedSubnets.reduce((sum, s) => sum + s.stats.stars, 0),
        totalContributors: enrichedSubnets.reduce((sum, s) => sum + s.stats.contributors, 0),
        avgActivity: enrichedSubnets.reduce((sum, s) => sum + s.stats.activity, 0) / enrichedSubnets.length,
        activeSubnets: enrichedSubnets.filter(s => s.stats.lastCommitDays <= 7).length,
        avgTestCoverage: enrichedSubnets.reduce((sum, s) => sum + s.stats.testCoverage, 0) / enrichedSubnets.length
      };

      setData({
        subnets: enrichedSubnets,
        languageStats,
        activityMetrics,
        timeSeriesData: generateTimeSeriesData(),
        contributorStats: generateContributorStats()
      });
    };

    generateGitHubData();
  }, []);

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
          label: 'Daily Commits',
          data: days.map(() => Math.floor(Math.random() * 50) + 10),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Pull Requests',
          data: days.map(() => Math.floor(Math.random() * 15) + 2),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const generateContributorStats = () => {
    const contributors = [
      'Alice Chen', 'Bob Smith', 'Charlie Davis', 'Diana Wilson', 'Eve Johnson',
      'Frank Miller', 'Grace Lee', 'Henry Brown', 'Ivy Taylor', 'Jack Wilson'
    ];

    return contributors.map(name => ({
      name,
      commits: Math.floor(Math.random() * 100) + 20,
      additions: Math.floor(Math.random() * 5000) + 1000,
      deletions: Math.floor(Math.random() * 2000) + 500,
      repositories: Math.floor(Math.random() * 5) + 1
    }));
  };

  const filteredSubnets = data.subnets
    .filter(subnet => showInactive || subnet.stats.lastCommitDays <= 7)
    .filter(subnet => selectedSubnets.length === 0 || selectedSubnets.includes(subnet.id))
    .sort((a, b) => {
      switch (sortBy) {
        case 'commits': return b.stats.commits - a.stats.commits;
        case 'stars': return b.stats.stars - a.stats.stars;
        case 'activity': return b.stats.activity - a.stats.activity;
        case 'contributors': return b.stats.contributors - a.stats.contributors;
        default: return 0;
      }
    });

  const topSubnetsData = {
    labels: filteredSubnets.slice(0, 10).map(s => s.name),
    datasets: [
      {
        label: 'Commits',
        data: filteredSubnets.slice(0, 10).map(s => s.stats.commits),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  const languageDistribution = {
    labels: Object.keys(data.languageStats),
    datasets: [
      {
        data: Object.values(data.languageStats),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ],
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    ]
  };

  const contributorData = {
    labels: data.contributorStats.map(c => c.name),
    datasets: [
      {
        label: 'Commits',
        data: data.contributorStats.map(c => c.commits),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1
      }
    ]
  };

  const activityRadarData = {
    labels: ['Commits', 'Stars', 'Contributors', 'PRs', 'Issues', 'Coverage'],
    datasets: [
      {
        label: 'Top Subnet',
        data: [90, 85, 78, 92, 67, 88],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Average',
        data: [60, 55, 45, 50, 40, 65],
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
      <div className="mb-4 p-4 bg-purple-500 text-white rounded-lg">
        <h2 className="text-xl font-bold">🔗 GitHub Insights Page - New UI Active</h2>
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className={`text-4xl font-bold ${authkitStyles.textPrimary} mb-4 flex items-center`}>
          <GitBranch className="w-8 h-8 mr-3" />
          GitHub Development Insights
        </h1>
        <p className={`text-xl ${authkitStyles.textSecondary} mb-6`}>
          Comprehensive analysis of development activity across all Bittensor subnet repositories
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
              <Filter className="w-4 h-4" />
              <label className={`text-sm ${textStyles.caption}`}>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 bg-white/10 border border-white/20 rounded-lg ${textStyles.body} focus:outline-none focus:border-accent-500`}
              >
                <option value="commits" className="bg-gray-800">Commits</option>
                <option value="stars" className="bg-gray-800">Stars</option>
                <option value="activity" className="bg-gray-800">Activity</option>
                <option value="contributors" className="bg-gray-800">Contributors</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <label className={`text-sm ${textStyles.caption}`}>Period:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-3 py-2 bg-white/10 border border-white/20 rounded-lg ${textStyles.body} focus:outline-none focus:border-accent-500`}
              >
                <option value="7d" className="bg-gray-800">Last 7 days</option>
                <option value="30d" className="bg-gray-800">Last 30 days</option>
                <option value="90d" className="bg-gray-800">Last 90 days</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded"
              />
              <span className={`text-sm ${textStyles.caption}`}>Show inactive</span>
            </label>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 ${buttonStyles.secondary} rounded-lg`}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>
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
              <p className={`text-sm ${textStyles.caption} mb-1`}>Total Commits</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.activityMetrics.totalCommits?.toLocaleString()}
              </p>
            </div>
            <GitCommit className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className={`${cardStyles.glass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textStyles.caption} mb-1`}>Total Stars</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.activityMetrics.totalStars?.toLocaleString()}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className={`${cardStyles.glass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textStyles.caption} mb-1`}>Active Subnets</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.activityMetrics.activeSubnets}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className={`${cardStyles.glass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textStyles.caption} mb-1`}>Avg Test Coverage</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.activityMetrics.avgTestCoverage?.toFixed(1)}%
              </p>
            </div>
            <Code className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Subnets by Commits */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Top Subnets by Commits
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={topSubnetsData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Language Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Language Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={languageDistribution} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} />
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Development Activity Timeline
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={data.timeSeriesData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Performance Radar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Development Health Radar
          </h3>
          <div style={{ height: '300px' }}>
            <Radar data={activityRadarData} options={radarOptions} />
          </div>
        </motion.div>
      </div>

      {/* Subnet Details Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className={`${cardStyles.glass} p-6`}
      >
        <h3 className={`text-xl ${textStyles.heading} mb-4`}>
          Subnet Repository Details
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Subnet</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Repository</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Language</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Commits</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Stars</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Contributors</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Last Commit</th>
                <th className={`text-left py-3 px-4 ${textStyles.caption}`}>Health</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubnets.slice(0, 15).map((subnet) => (
                <tr key={subnet.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{subnet.name}</span>
                      <span className={`text-xs ${textStyles.caption}`}>#{subnet.id}</span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body} font-mono text-sm`}>
                    {subnet.repo}
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <span className={`px-2 py-1 text-xs rounded-full bg-${subnet.language === 'Python' ? 'blue' : subnet.language === 'JavaScript' ? 'yellow' : 'green'}-500/20`}>
                      {subnet.language}
                    </span>
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    {subnet.stats.commits.toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{subnet.stats.stars.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>{subnet.stats.contributors}</span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <span className={`text-sm ${subnet.stats.lastCommitDays <= 1 ? 'text-green-400' : subnet.stats.lastCommitDays <= 7 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {subnet.stats.lastCommitDays}d ago
                    </span>
                  </td>
                  <td className={`py-3 px-4 ${textStyles.body}`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${subnet.stats.activity > 70 ? 'bg-green-500' : subnet.stats.activity > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm">{subnet.stats.activity.toFixed(0)}%</span>
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

export default GitHubInsights;