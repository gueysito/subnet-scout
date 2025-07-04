import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Share, TrendingUp, Users, Eye, Hash, Calendar, Filter, Download, AlertTriangle, ThumbsUp } from 'lucide-react';

const KaitoSocial = () => {
  const [data, setData] = useState({
    totalMentions: 2847,
    sentimentScore: 78,
    trendingHashtags: ['#Bittensor', '#AI', '#Subnet', '#Mining'],
    topInfluencers: [
      { name: '@CryptoAnalyst', followers: 12000, mentions: 45 },
      { name: '@AIExpert', followers: 8500, mentions: 32 },
      { name: '@BlockchainDev', followers: 15000, mentions: 28 }
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
            <MessageCircle className="w-8 h-8 mr-3 text-pink-600" />
            Kaito Social Intelligence
          </h1>
          <p className="text-xl text-gray-600">
            Real-time social media analytics and sentiment analysis for Bittensor subnets
          </p>
        </motion.div>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Social Overview - Large Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 lg:row-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Social Overview</h3>
              <TrendingUp className="w-8 h-8 text-pink-600" />
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-pink-50 rounded-xl">
                  <div className="text-3xl font-bold text-pink-600">{data.totalMentions}</div>
                  <div className="text-sm text-gray-600">Total Mentions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">{data.sentimentScore}%</div>
                  <div className="text-sm text-gray-600">Positive Sentiment</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Top Influencers</h4>
                <div className="space-y-3">
                  {data.topInfluencers.map((influencer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{influencer.name}</div>
                        <div className="text-sm text-gray-500">{influencer.followers.toLocaleString()} followers</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{influencer.mentions} mentions</div>
                        <div className="text-sm text-gray-500">This week</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mentions Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">24.7K</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Views Today</h3>
            <p className="text-sm text-gray-600">Social media impressions</p>
          </motion.div>

          {/* Engagement Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-6 h-6 text-red-600" />
              <span className="text-2xl font-bold text-red-600">1.2K</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Engagement</h3>
            <p className="text-sm text-gray-600">Likes & shares today</p>
          </motion.div>

          {/* Trending Topics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Trending Topics</h3>
              <Hash className="w-6 h-6 text-purple-600" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {data.trendingHashtags.map((hashtag, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Hash className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">{hashtag}</div>
                    <div className="text-sm text-gray-500">{Math.floor(Math.random() * 1000) + 100} mentions</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sentiment Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ThumbsUp className="w-8 h-8 mb-4" />
            <div className="text-2xl font-bold mb-2">78%</div>
            <div className="text-green-100">Positive sentiment this week</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Share className="w-8 h-8 mb-4" />
            <div className="text-2xl font-bold mb-2">456</div>
            <div className="text-purple-100">Shares in last 24h</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KaitoSocial;