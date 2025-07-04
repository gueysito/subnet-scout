import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Star, GitCommit, Users, Activity, TrendingUp, Download, Filter, Calendar, Code, AlertCircle } from 'lucide-react';
import { authkitStyles } from '../utils/styleUtils';

const GitHubInsights = () => {
  const [data, setData] = useState({
    totalRepositories: 24,
    totalCommits: 1247,
    activeContributors: 89,
    totalStars: 3421,
    topRepositories: [
      { name: 'subnet-1-prompting', commits: 156, stars: 342, contributors: 12 },
      { name: 'subnet-18-cortex', commits: 134, stars: 298, contributors: 8 },
      { name: 'subnet-21-storage', commits: 89, stars: 167, contributors: 5 }
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
            <GitBranch className="w-8 h-8 mr-3 text-blue-600" />
            GitHub Development Insights
          </h1>
          <p className="text-xl text-gray-600">
            Real-time development activity across all Bittensor subnet repositories
          </p>
        </motion.div>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Large Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 lg:row-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Development Overview</h3>
              <Code className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{data.totalRepositories}</div>
                  <div className="text-sm text-gray-600">Active Repos</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">{data.totalCommits}</div>
                  <div className="text-sm text-gray-600">Total Commits</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Top Repositories</h4>
                <div className="space-y-3">
                  {data.topRepositories.map((repo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{repo.name}</div>
                        <div className="text-sm text-gray-500">{repo.contributors} contributors</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{repo.commits} commits</div>
                        <div className="text-sm text-gray-500">{repo.stars} stars</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contributors Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{data.activeContributors}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Contributors</h3>
            <p className="text-sm text-gray-600">Developers contributing this month</p>
          </motion.div>

          {/* Stars Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Star className="w-6 h-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{data.totalStars}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Stars</h3>
            <p className="text-sm text-gray-600">Across all repositories</p>
          </motion.div>

          {/* Activity Timeline Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <GitCommit className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Latest commit to subnet-1-prompting</div>
                  <div className="text-sm text-gray-500">2 hours ago • feat: improve response quality</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">New star on subnet-18-cortex</div>
                  <div className="text-sm text-gray-500">4 hours ago • Community growth</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">New contributor joined subnet-21-storage</div>
                  <div className="text-sm text-gray-500">6 hours ago • Welcome @developer123</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <TrendingUp className="w-8 h-8 mb-4" />
            <div className="text-2xl font-bold mb-2">+24%</div>
            <div className="text-blue-100">Commit activity vs last month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <GitBranch className="w-8 h-8 mb-4" />
            <div className="text-2xl font-bold mb-2">156</div>
            <div className="text-green-100">Active branches across all repos</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GitHubInsights;