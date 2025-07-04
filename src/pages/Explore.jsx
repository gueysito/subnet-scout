import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, DollarSign, Activity, Users, GitBranch, Shield, Star, AlertCircle } from 'lucide-react';
import { containerStyles, cardStyles, textStyles, buttonStyles, inputStyles } from '../utils/styleUtils';

const Explore = () => {
  const [subnets, setSubnets] = useState([]);
  const [filteredSubnets, setFilteredSubnets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rank');
  const [loading, setLoading] = useState(true);

  // Mock subnet data - REAL DATA STRUCTURE
  useEffect(() => {
    const mockSubnets = [
      {
        id: 1,
        name: "Text Prompting",
        description: "Incentivizes the production of high-quality text prompts for large language models",
        netuid: 1,
        rank: 1,
        price: 127.42,
        change24h: 12.5,
        activity: 94,
        validators: 256,
        delegated_stake: "2.4M",
        emissions: "12.5%",
        github_commits: 156,
        social_score: 8.7,
        risk_level: "Low",
        status: "Active",
        category: "AI/ML"
      },
      {
        id: 8,
        name: "Taoshi",
        description: "Financial intelligence and prediction subnet for trading strategies",
        netuid: 8,
        rank: 2,
        price: 89.32,
        change24h: 8.2,
        activity: 87,
        validators: 128,
        delegated_stake: "1.8M",
        emissions: "8.2%",
        github_commits: 98,
        social_score: 7.4,
        risk_level: "Medium",
        status: "Active",
        category: "Finance"
      },
      {
        id: 21,
        name: "FileTAO",
        description: "Decentralized file storage and retrieval network on Bittensor",
        netuid: 21,
        rank: 3,
        price: 76.88,
        change24h: -2.1,
        activity: 82,
        validators: 64,
        delegated_stake: "1.2M",
        emissions: "4.1%",
        github_commits: 127,
        social_score: 6.9,
        risk_level: "Low",
        status: "Active",
        category: "Storage"
      },
      {
        id: 18,
        name: "Cortext",
        description: "Advanced language model training and optimization subnet",
        netuid: 18,
        rank: 4,
        price: 65.44,
        change24h: 15.8,
        activity: 91,
        validators: 192,
        delegated_stake: "1.6M",
        emissions: "6.8%",
        github_commits: 143,
        social_score: 8.1,
        risk_level: "Low",
        status: "Active",
        category: "AI/ML"
      },
      {
        id: 27,
        name: "Compute Horde",
        description: "Distributed computing resources for AI model training",
        netuid: 27,
        rank: 5,
        price: 54.12,
        change24h: 22.4,
        activity: 88,
        validators: 96,
        delegated_stake: "980K",
        emissions: "3.8%",
        github_commits: 89,
        social_score: 7.8,
        risk_level: "Medium",
        status: "Active",
        category: "Compute"
      },
      {
        id: 12,
        name: "Data Universe",
        description: "Decentralized data marketplace and validation network",
        netuid: 12,
        rank: 6,
        price: 42.67,
        change24h: -5.3,
        activity: 76,
        validators: 48,
        delegated_stake: "720K",
        emissions: "2.9%",
        github_commits: 67,
        social_score: 6.2,
        risk_level: "High",
        status: "Active",
        category: "Data"
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setSubnets(mockSubnets);
      setFilteredSubnets(mockSubnets);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = subnets;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(subnet => 
        subnet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subnet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subnet.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(subnet => subnet.category.toLowerCase() === selectedFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          return a.rank - b.rank;
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.change24h - a.change24h;
        case 'activity':
          return b.activity - a.activity;
        default:
          return a.rank - b.rank;
      }
    });

    setFilteredSubnets(filtered);
  }, [subnets, searchTerm, selectedFilter, sortBy]);

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-emerald-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className={containerStyles.page}>
        <div className={containerStyles.section}>
          <div className={containerStyles.flexCenter}>
            <div className={cardStyles.glass}>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
              <p className={`${textStyles.body} mt-4 text-center`}>Loading subnet data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerStyles.page}>
      <div className={containerStyles.section}>
        <div className={containerStyles.content}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className={textStyles.hero}>
              Explore Subnets
            </h1>
            <p className={`${textStyles.subheading} mt-4 max-w-3xl mx-auto`}>
              Discover and analyze all active Bittensor subnets with real-time performance metrics
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${cardStyles.glass} mb-8`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search subnets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={inputStyles.search}
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className={inputStyles.select}
              >
                <option value="all">All Categories</option>
                <option value="ai/ml">AI/ML</option>
                <option value="finance">Finance</option>
                <option value="storage">Storage</option>
                <option value="compute">Compute</option>
                <option value="data">Data</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={inputStyles.select}
              >
                <option value="rank">Sort by Rank</option>
                <option value="price">Sort by Price</option>
                <option value="change">Sort by Change</option>
                <option value="activity">Sort by Activity</option>
              </select>

              {/* Results Count */}
              <div className={`${containerStyles.flexCenter} ${textStyles.body}`}>
                {filteredSubnets.length} subnet{filteredSubnets.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </motion.div>

          {/* Subnet Grid */}
          <div className={containerStyles.grid3}>
            {filteredSubnets.map((subnet, index) => (
              <motion.div
                key={subnet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cardStyles.interactive}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-sm font-bold px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400`}>
                        #{subnet.rank}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-lg bg-white/10 ${textStyles.caption}`}>
                        {subnet.category}
                      </span>
                    </div>
                    <h3 className={`${textStyles.heading} text-xl mb-1`}>
                      Subnet {subnet.id}: {subnet.name}
                    </h3>
                    <p className={`${textStyles.caption} text-sm`}>
                      {subnet.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${textStyles.body}`}>
                      ${subnet.price.toFixed(2)}
                    </div>
                    <div className={`text-sm ${getChangeColor(subnet.change24h)}`}>
                      {subnet.change24h >= 0 ? '+' : ''}{subnet.change24h.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className={cardStyles.metric}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-purple-400" />
                      <span className={`text-xs ${textStyles.caption}`}>Activity</span>
                    </div>
                    <div className={`text-lg font-bold ${textStyles.accent}`}>
                      {subnet.activity}%
                    </div>
                  </div>

                  <div className={cardStyles.metric}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className={`text-xs ${textStyles.caption}`}>Validators</span>
                    </div>
                    <div className={`text-lg font-bold ${textStyles.accent}`}>
                      {subnet.validators}
                    </div>
                  </div>

                  <div className={cardStyles.metric}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className={`text-xs ${textStyles.caption}`}>Stake</span>
                    </div>
                    <div className={`text-lg font-bold ${textStyles.accent}`}>
                      {subnet.delegated_stake}
                    </div>
                  </div>

                  <div className={cardStyles.metric}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <span className={`text-xs ${textStyles.caption}`}>Emissions</span>
                    </div>
                    <div className={`text-lg font-bold ${textStyles.accent}`}>
                      {subnet.emissions}
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <GitBranch className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${textStyles.caption}`}>
                        {subnet.github_commits} commits
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className={`text-sm ${textStyles.caption}`}>
                        {subnet.social_score}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${textStyles.caption}`}>Risk:</span>
                    <span className={`text-sm font-semibold ${getRiskColor(subnet.risk_level)}`}>
                      {subnet.risk_level}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4">
                  <button className={`${buttonStyles.primary} w-full`}>
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredSubnets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${cardStyles.glass} text-center py-12`}
            >
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={`${textStyles.heading} mb-2`}>No subnets found</h3>
              <p className={textStyles.body}>
                Try adjusting your search terms or filters
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;