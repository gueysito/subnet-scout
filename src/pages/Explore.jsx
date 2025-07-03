import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BarChart3, 
  RefreshCw, 
  Filter, 
  GitCompare,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useSubnetAgents, useApi } from '../hooks/useApi.js';
import SubnetCard from '../components/SubnetCard.jsx';
import StatsDashboard from '../components/StatsDashboard.jsx';
import AdvancedFilters from '../components/AdvancedFilters.jsx';
import SubnetComparison from '../components/SubnetComparison.jsx';
import { containerStyles, cardStyles, textStyles, buttonStyles, animations } from '../utils/styleUtils';

export default function Explore() {
  const [selectedSubnet, setSelectedSubnet] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  
  const { data: agents, loading, error, refetch } = useSubnetAgents();
  const { data: subnets, loading: subnetsLoading, error: subnetsError } = useApi();

  // Mock data for demonstration when API fails
  const mockSubnets = [
    { subnet_id: 1, name: "Text Prompting", type: "inference", score: 94, performance: "excellent", status: "healthy" },
    { subnet_id: 21, name: "Storage", type: "storage", score: 91, performance: "excellent", status: "healthy" },
    { subnet_id: 5, name: "Open Kaito", type: "inference", score: 88, performance: "good", status: "healthy" },
    { subnet_id: 8, name: "Taoshi", type: "inference", score: 85, performance: "good", status: "healthy" },
    { subnet_id: 32, name: "It's AI", type: "inference", score: 82, performance: "good", status: "healthy" }
  ];

  // Use mock data if API fails
  const displaySubnets = agents?.agents || mockSubnets;
  const totalCount = agents?.total_count || mockSubnets.length;
  const currentPage = agents?.pagination?.page || 1;
  const totalPages = agents?.pagination?.total_pages || 1;
  const isLoading = loading || subnetsLoading;

  // Handle filtered agents from AdvancedFilters component
  const handleFilteredAgentsChange = useCallback((filtered) => {
    setFilteredAgents(filtered);
  }, []);

  // Handle compare mode toggle
  const handleCompareMode = useCallback((enabled) => {
    setIsCompareMode(enabled);
  }, []);

  const handleScoreClick = (subnetId) => {
    setSelectedSubnet(subnetId);
    console.log(`View details for subnet ${subnetId}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleToggleApiMode = () => {
    // Implementation of handleToggleApiMode
  };

  if (error) {
    return (
      <div className={containerStyles.section}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${cardStyles.glass} border-red-500/30 bg-red-500/10`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className={`text-xl ${textStyles.heading} text-red-300`}>
                Error Loading Subnet Data
              </h3>
              <p className={`${textStyles.body} text-red-200`}>{error}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className={`${buttonStyles.secondary} bg-red-600/80 hover:bg-red-500/80 border-red-400/30`}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={containerStyles.section}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
      >
        <div className="flex items-start space-x-4">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-glow flex-shrink-0">
            {isCompareMode ? (
              <GitCompare className="w-8 h-8 text-white" />
            ) : (
              <Search className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h2 className={`text-4xl ${textStyles.heading} mb-2`}>
              {isCompareMode ? 'Compare Subnets' : 'Explore Subnets'}
            </h2>
            <p className={`${textStyles.body} max-w-2xl`}>
              {isCompareMode 
                ? `Compare and analyze subnet performance side-by-side with advanced metrics`
                : `Monitor and analyze ${totalCount} active Bittensor subnets in real-time`
              }
            </p>
          </div>
        </div>
        
        {!isCompareMode && (
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(!showStats)}
              className={`${buttonStyles.ghost} flex items-center space-x-2`}
            >
              {showStats ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isLoading}
              className={`${buttonStyles.primary} flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <motion.div
                animate={{ rotate: isLoading ? 360 : 0 }}
                transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              <span>{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Stats Dashboard */}
      <AnimatePresence>
        {showStats && !isCompareMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <StatsDashboard 
              stats={subnets}
              loading={isLoading}
              onToggleApiMode={handleToggleApiMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters */}
      <AnimatePresence>
        {!isCompareMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8"
          >
            <AdvancedFilters
              agents={displaySubnets}
              onFilteredAgentsChange={handleFilteredAgentsChange}
              onCompareMode={handleCompareMode}
              isCompareMode={isCompareMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Mode */}
      <AnimatePresence>
        {isCompareMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <SubnetComparison
              agents={filteredAgents.length > 0 ? filteredAgents : displaySubnets}
              onClose={() => setIsCompareMode(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subnet Grid */}
      <AnimatePresence>
        {!isCompareMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {isLoading && displaySubnets.length === 0 ? (
              <div className={`${cardStyles.glass} text-center py-16`}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block mb-4"
                >
                  <Sparkles className="w-12 h-12 text-accent-400" />
                </motion.div>
                <div className={`text-xl ${textStyles.heading} mb-2`}>
                  Loading Subnet Intelligence
                </div>
                <div className={`${textStyles.body}`}>
                  Fetching real-time data from the Bittensor network...
                </div>
              </div>
            ) : (
              <>
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                >
                  {(filteredAgents.length > 0 ? filteredAgents : displaySubnets).map((agent, index) => (
                    <motion.div
                      key={agent.subnet_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      layout
                    >
                      <SubnetCard
                        agent={agent}
                        onScoreClick={handleScoreClick}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {filteredAgents.length === 0 && totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center space-x-6 mt-8"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => refetch({ page: currentPage - 1 })}
                      disabled={currentPage <= 1 || isLoading}
                      className={`${buttonStyles.ghost} flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </motion.button>
                    
                    <div className={`${textStyles.body} px-6 py-2 bg-white/5 rounded-xl border border-white/10`}>
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => refetch({ page: currentPage + 1 })}
                      disabled={currentPage >= totalPages || isLoading}
                      className={`${buttonStyles.ghost} flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Development Mode Notice */}
      <AnimatePresence>
        {/* apiMode === 'mock' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${cardStyles.glass} border-amber-500/30 bg-amber-500/10 mt-8`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className={`text-lg ${textStyles.heading} text-amber-300 mb-1`}>
                  Development Mode Active
                </h3>
                <p className={`${textStyles.body} text-amber-200 text-sm leading-relaxed`}>
                  You're viewing mock data for development. Switch to "Real" mode to connect to live APIs.
                  Current dataset: {displaySubnets.length} subnets loaded from mock server.
                </p>
              </div>
            </div>
          </motion.div>
        ) */}
      </AnimatePresence>
    </div>
  );
}