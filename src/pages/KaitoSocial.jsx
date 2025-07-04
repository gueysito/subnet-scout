import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut, Bubble } from 'react-chartjs-2';
import { MessageCircle, Heart, Share, TrendingUp, Users, Eye, Hash, Calendar, Filter, Download, AlertTriangle, ThumbsUp } from 'lucide-react';
import { containerStyles, cardStyles, textStyles, buttonStyles } from '../utils/styleUtils';

const KaitoSocial = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('mentions');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [data, setData] = useState({
    subnets: [],
    trendingTopics: [],
    influencers: [],
    sentimentAnalysis: {},
    socialMetrics: {},
    timeSeriesData: {}
  });

  // Generate comprehensive social media data
  useEffect(() => {
    const generateSocialData = () => {
      const subnets = [
        { id: 1, name: 'Text Prompting', category: 'NLP', verified: true },
        { id: 18, name: 'Cortext', category: 'AI/ML', verified: true },
        { id: 21, name: 'FileTAO', category: 'Storage', verified: false },
        { id: 9, name: 'Pretraining', category: 'AI/ML', verified: true },
        { id: 7, name: 'Connectome', category: 'Infrastructure', verified: true },
        { id: 11, name: 'Text-to-Speech', category: 'Audio', verified: false },
        { id: 13, name: 'Data Universe', category: 'Data', verified: false },
        { id: 15, name: 'Blockchain Insights', category: 'Analytics', verified: true },
        { id: 19, name: 'Vision AI', category: 'Computer Vision', verified: false },
        { id: 23, name: 'DeFi Oracle', category: 'DeFi', verified: true },
        { id: 27, name: 'Compute Network', category: 'Infrastructure', verified: true },
        { id: 31, name: 'Social Graph', category: 'Social', verified: false },
        { id: 33, name: 'Gaming AI', category: 'Gaming', verified: false },
        { id: 37, name: 'Medical AI', category: 'Healthcare', verified: true },
        { id: 41, name: 'Supply Chain', category: 'Logistics', verified: false }
      ];

      const enrichedSubnets = subnets.map(subnet => {
        const baseMentions = Math.floor(Math.random() * 500) + 50;
        const baseEngagement = Math.floor(Math.random() * 1000) + 100;
        const baseSentiment = (Math.random() * 2 - 1); // -1 to 1
        
        return {
          ...subnet,
          socialStats: {
            mentions: baseMentions,
            likes: Math.floor(baseEngagement * (0.7 + Math.random() * 0.6)),
            shares: Math.floor(baseEngagement * (0.2 + Math.random() * 0.3)),
            comments: Math.floor(baseEngagement * (0.1 + Math.random() * 0.2)),
            reach: Math.floor(baseEngagement * (5 + Math.random() * 10)),
            sentiment: baseSentiment,
            sentimentScore: Math.floor((baseSentiment + 1) * 50), // 0-100
            engagement: baseEngagement,
            influencerMentions: Math.floor(Math.random() * 20) + 1,
            hashtagUsage: Math.floor(Math.random() * 30) + 5,
            trendingScore: Math.floor(Math.random() * 100),
            communitySize: Math.floor(Math.random() * 5000) + 500,
            weeklyGrowth: (Math.random() * 20 - 10) // -10% to +10%
          },
          recentPosts: generateRecentPosts(subnet.name),
          topHashtags: generateTopHashtags(),
          platformBreakdown: {
            twitter: Math.floor(Math.random() * 40) + 30,
            discord: Math.floor(Math.random() * 30) + 20,
            telegram: Math.floor(Math.random() * 20) + 10,
            reddit: Math.floor(Math.random() * 15) + 5
          }
        };
      });

      const trendingTopics = [
        { topic: '#BittensorAI', mentions: 1250, sentiment: 0.7, growth: 15.2 },
        { topic: '#TAO', mentions: 980, sentiment: 0.5, growth: 8.7 },
        { topic: '#DecentralizedAI', mentions: 756, sentiment: 0.8, growth: 22.1 },
        { topic: '#Subnet1', mentions: 654, sentiment: 0.6, growth: 12.3 },
        { topic: '#AICompute', mentions: 543, sentiment: 0.4, growth: -2.1 },
        { topic: '#NeuralMining', mentions: 432, sentiment: 0.9, growth: 18.5 },
        { topic: '#OpenAI', mentions: 321, sentiment: 0.3, growth: -5.2 },
        { topic: '#MachineLearning', mentions: 298, sentiment: 0.7, growth: 6.8 }
      ];

      const influencers = [
        { name: 'AI_Researcher_Jane', followers: 45000, mentions: 23, influence: 92, verified: true },
        { name: 'CryptoAnalyst_Bob', followers: 38000, mentions: 19, influence: 87, verified: true },
        { name: 'TechInnovator_Alice', followers: 52000, mentions: 31, influence: 95, verified: true },
        { name: 'BlockchainExpert_Dave', followers: 29000, mentions: 15, influence: 78, verified: false },
        { name: 'AIEnthusiast_Eve', followers: 34000, mentions: 21, influence: 82, verified: true },
        { name: 'MLPioneer_Frank', followers: 41000, mentions: 27, influence: 89, verified: true },
        { name: 'TechReporter_Grace', followers: 67000, mentions: 35, influence: 98, verified: true }
      ];

      const socialMetrics = {
        totalMentions: enrichedSubnets.reduce((sum, s) => sum + s.socialStats.mentions, 0),
        totalEngagement: enrichedSubnets.reduce((sum, s) => sum + s.socialStats.engagement, 0),
        avgSentiment: enrichedSubnets.reduce((sum, s) => sum + s.socialStats.sentimentScore, 0) / enrichedSubnets.length,
        totalReach: enrichedSubnets.reduce((sum, s) => sum + s.socialStats.reach, 0),
        activeCommunities: enrichedSubnets.filter(s => s.socialStats.mentions > 100).length,
        trendingSubnets: enrichedSubnets.filter(s => s.socialStats.weeklyGrowth > 5).length
      };

      const sentimentAnalysis = {
        positive: enrichedSubnets.filter(s => s.socialStats.sentiment > 0.2).length,
        neutral: enrichedSubnets.filter(s => s.socialStats.sentiment >= -0.2 && s.socialStats.sentiment <= 0.2).length,
        negative: enrichedSubnets.filter(s => s.socialStats.sentiment < -0.2).length
      };

      setData({
        subnets: enrichedSubnets,
        trendingTopics,
        influencers,
        sentimentAnalysis,
        socialMetrics,
        timeSeriesData: generateTimeSeriesData()
      });
    };

    generateSocialData();
  }, []);

  const generateRecentPosts = (subnetName) => {
    const postTemplates = [
      `Just deployed new features on ${subnetName}! The community response has been incredible 🚀`,
      `${subnetName} is showing amazing performance metrics this week. Time to dive deeper! 📊`,
      `Love the innovation happening with ${subnetName}. The future of AI is here! 🤖`,
      `${subnetName} community is growing fast! Welcome to all new members 👋`,
      `Breaking: ${subnetName} just hit a major milestone. This is huge for the ecosystem! 🎉`
    ];

    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      content: postTemplates[Math.floor(Math.random() * postTemplates.length)],
      platform: ['Twitter', 'Discord', 'Telegram', 'Reddit'][Math.floor(Math.random() * 4)],
      author: `User${Math.floor(Math.random() * 1000)}`,
      likes: Math.floor(Math.random() * 50) + 5,
      shares: Math.floor(Math.random() * 20) + 1,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      sentiment: Math.random() * 2 - 1
    }));
  };

  const generateTopHashtags = () => {
    const hashtags = ['#AI', '#Blockchain', '#Innovation', '#Tech', '#Crypto', '#Future', '#Community', '#Development'];
    return hashtags.slice(0, 5).map(tag => ({
      tag,
      count: Math.floor(Math.random() * 100) + 20
    }));
  };

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
          label: 'Daily Mentions',
          data: days.map(() => Math.floor(Math.random() * 200) + 50),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Engagement Score',
          data: days.map(() => Math.floor(Math.random() * 100) + 20),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const filteredSubnets = data.subnets.filter(subnet => {
    if (sentimentFilter === 'positive') return subnet.socialStats.sentiment > 0.2;
    if (sentimentFilter === 'negative') return subnet.socialStats.sentiment < -0.2;
    if (sentimentFilter === 'neutral') return subnet.socialStats.sentiment >= -0.2 && subnet.socialStats.sentiment <= 0.2;
    return true;
  });

  const topSubnetsData = {
    labels: filteredSubnets.slice(0, 10).map(s => s.name),
    datasets: [
      {
        label: selectedMetric === 'mentions' ? 'Mentions' : selectedMetric === 'engagement' ? 'Engagement' : 'Sentiment Score',
        data: filteredSubnets.slice(0, 10).map(s => 
          selectedMetric === 'mentions' ? s.socialStats.mentions :
          selectedMetric === 'engagement' ? s.socialStats.engagement :
          s.socialStats.sentimentScore
        ),
        backgroundColor: selectedMetric === 'mentions' ? 'rgba(59, 130, 246, 0.8)' :
                         selectedMetric === 'engagement' ? 'rgba(16, 185, 129, 0.8)' :
                         'rgba(245, 158, 11, 0.8)',
        borderColor: selectedMetric === 'mentions' ? 'rgb(59, 130, 246)' :
                     selectedMetric === 'engagement' ? 'rgb(16, 185, 129)' :
                     'rgb(245, 158, 11)',
        borderWidth: 1
      }
    ]
  };

  const sentimentDistribution = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [data.sentimentAnalysis.positive, data.sentimentAnalysis.neutral, data.sentimentAnalysis.negative],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(107, 114, 128, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    ]
  };

  const platformBreakdown = {
    labels: ['Twitter', 'Discord', 'Telegram', 'Reddit'],
    datasets: [
      {
        data: [45, 25, 20, 10], // Average percentages
        backgroundColor: [
          'rgba(29, 161, 242, 0.8)',
          'rgba(114, 137, 218, 0.8)',
          'rgba(0, 136, 204, 0.8)',
          'rgba(255, 69, 0, 0.8)'
        ],
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    ]
  };

  const engagementBubbleData = {
    datasets: [
      {
        label: 'Subnet Social Performance',
        data: filteredSubnets.map(subnet => ({
          x: subnet.socialStats.mentions,
          y: subnet.socialStats.sentimentScore,
          r: Math.sqrt(subnet.socialStats.engagement) / 5
        })),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgba(139, 92, 246, 1)',
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

  const bubbleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const subnet = filteredSubnets[context.dataIndex];
            return `${subnet.name}: ${context.parsed.x} mentions, ${context.parsed.y}% sentiment`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mentions',
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Sentiment Score',
          color: 'white'
        },
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className={`text-4xl ${textStyles.heading} mb-4 flex items-center`}>
          <MessageCircle className="w-8 h-8 mr-3" />
          Kaito Social Intelligence
        </h1>
        <p className={`text-xl ${textStyles.body} mb-6`}>
          Real-time social media analytics and sentiment analysis for Bittensor subnets
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
              <label className={`text-sm ${textStyles.caption}`}>Metric:</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className={`px-3 py-2 bg-white/10 border border-white/20 rounded-lg ${textStyles.body} focus:outline-none focus:border-accent-500`}
              >
                <option value="mentions" className="bg-gray-800">Mentions</option>
                <option value="engagement" className="bg-gray-800">Engagement</option>
                <option value="sentiment" className="bg-gray-800">Sentiment</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className={`text-sm ${textStyles.caption}`}>Sentiment:</label>
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className={`px-3 py-2 bg-white/10 border border-white/20 rounded-lg ${textStyles.body} focus:outline-none focus:border-accent-500`}
              >
                <option value="all" className="bg-gray-800">All</option>
                <option value="positive" className="bg-gray-800">Positive</option>
                <option value="neutral" className="bg-gray-800">Neutral</option>
                <option value="negative" className="bg-gray-800">Negative</option>
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
                <option value="1d" className="bg-gray-800">Last 24 hours</option>
                <option value="7d" className="bg-gray-800">Last 7 days</option>
                <option value="30d" className="bg-gray-800">Last 30 days</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-4 py-2 ${buttonStyles.secondary} rounded-lg`}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
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
              <p className={`text-sm ${textStyles.caption} mb-1`}>Total Mentions</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.socialMetrics.totalMentions?.toLocaleString()}
              </p>
            </div>
            <Hash className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className={`${cardStyles.glass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textStyles.caption} mb-1`}>Total Engagement</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.socialMetrics.totalEngagement?.toLocaleString()}
              </p>
            </div>
            <Heart className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className={`${cardStyles.glass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textStyles.caption} mb-1`}>Avg Sentiment</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {data.socialMetrics.avgSentiment?.toFixed(1)}%
              </p>
            </div>
            <ThumbsUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className={`${cardStyles.glass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textStyles.caption} mb-1`}>Total Reach</p>
              <p className={`text-2xl font-bold ${textStyles.accent}`}>
                {(data.socialMetrics.totalReach / 1000)?.toFixed(1)}K
              </p>
            </div>
            <Eye className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Subnets */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Top Subnets by {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={topSubnetsData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Sentiment Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Sentiment Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={sentimentDistribution} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} />
          </div>
        </motion.div>

        {/* Social Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Social Activity Timeline
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={data.timeSeriesData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Platform Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={platformBreakdown} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} />
          </div>
        </motion.div>
      </div>

      {/* Engagement vs Sentiment Bubble Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className={`${cardStyles.glass} p-6 mb-8`}
      >
        <h3 className={`text-xl ${textStyles.heading} mb-4`}>
          Mentions vs Sentiment Analysis
        </h3>
        <div style={{ height: '400px' }}>
          <Bubble data={engagementBubbleData} options={bubbleOptions} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Topics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Trending Topics
          </h3>
          <div className="space-y-4">
            {data.trendingTopics.slice(0, 8).map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${textStyles.body}`}>{topic.topic}</span>
                    <div className={`w-2 h-2 rounded-full ${topic.sentiment > 0.5 ? 'bg-green-500' : topic.sentiment > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`text-sm ${textStyles.caption}`}>
                      {topic.mentions} mentions
                    </span>
                    <span className={`text-sm ${topic.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {topic.growth > 0 ? '+' : ''}{topic.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <TrendingUp className={`w-4 h-4 ${topic.growth > 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Influencers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className={`${cardStyles.glass} p-6`}
        >
          <h3 className={`text-xl ${textStyles.heading} mb-4`}>
            Top Influencers
          </h3>
          <div className="space-y-4">
            {data.influencers.slice(0, 7).map((influencer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{influencer.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${textStyles.body}`}>@{influencer.name}</span>
                      {influencer.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm ${textStyles.caption}`}>
                        {influencer.followers.toLocaleString()} followers
                      </span>
                      <span className={`text-sm ${textStyles.caption}`}>
                        {influencer.mentions} mentions
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${textStyles.accent}`}>
                    {influencer.influence}%
                  </div>
                  <div className={`text-xs ${textStyles.caption}`}>
                    Influence
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KaitoSocial;