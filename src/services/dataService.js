import apiClient from '../../shared/utils/apiClient.js'

class DataService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Cache management
  getCachedData(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    return null
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  // Market data for HomePage
  async getMarketData() {
    const cacheKey = 'market_data'
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const systemMetrics = await apiClient.getSystemMetrics()
      
      // Transform backend data to match frontend expectations
      const marketData = {
        taoMarketCap: systemMetrics.tao?.market_cap || '$1.23B',
        taoChange24h: systemMetrics.tao?.change_24h || '+3.4%',
        taoChange7d: systemMetrics.tao?.change_7d || '+8.1%',
        taoChange1m: systemMetrics.tao?.change_1m || '+12.9%',
        subnetMarketCap: systemMetrics.subnet?.total_market_cap || '$345M',
        subnetChange24h: systemMetrics.subnet?.change_24h || '-0.6%',
        subnetChange7d: systemMetrics.subnet?.change_7d || '+2.2%',
        subnetChange1m: systemMetrics.subnet?.change_1m || '+10.4%',
        networkHealth: systemMetrics.network?.health_percentage || '92%',
        lastUpdated: new Date().toISOString()
      }

      this.setCachedData(cacheKey, marketData)
      return marketData
    } catch (error) {
      console.warn('Failed to fetch market data:', error)
      // Return fallback data
      return {
        taoMarketCap: '$1.23B',
        taoChange24h: '+3.4%',
        taoChange7d: '+8.1%',
        taoChange1m: '+12.9%',
        subnetMarketCap: '$345M',
        subnetChange24h: '-0.6%',
        subnetChange7d: '+2.2%',
        subnetChange1m: '+10.4%',
        networkHealth: '92%',
        lastUpdated: new Date().toISOString()
      }
    }
  }

  // Subnet list for ExplorerPage
  async getSubnetList(page = 1, limit = 20) {
    const cacheKey = `subnet_list_${page}_${limit}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const agentsData = await apiClient.getAgentsList(page, limit)
      
      // Transform agents data to subnet format
      const subnets = agentsData.agents?.map(agent => ({
        id: agent.subnet_id || agent.id,
        name: agent.name || `Subnet ${agent.subnet_id || agent.id}`,
        category: agent.category || agent.subnet_type || 'Other',
        marketCap: agent.market_cap || '$0',
        health: agent.health_percentage ? `${agent.health_percentage}%` : '0%',
        commits: agent.github_commits || 0,
        yield: agent.yield_percentage ? `${agent.yield_percentage}%` : '0%',
        uptime: agent.uptime_percentage || 0,
        validators: agent.validator_count || 0,
        emissions: agent.emissions || 0,
        lastUpdated: agent.last_updated || new Date().toISOString()
      })) || []

      const result = {
        subnets,
        pagination: agentsData.pagination || {
          page,
          limit,
          total: subnets.length,
          totalPages: Math.ceil(subnets.length / limit)
        }
      }

      this.setCachedData(cacheKey, result)
      return result
    } catch (error) {
      console.warn('Failed to fetch subnet list:', error)
      // Return fallback data
      return {
        subnets: [
          { id: 1, name: 'Subnet 1', category: 'Training', marketCap: '$2.3M', health: '89%', commits: 150 },
          { id: 2, name: 'Subnet 2', category: 'Inference', marketCap: '$1.8M', health: '93%', commits: 172 },
          { id: 3, name: 'Subnet 3', category: 'Other', marketCap: '$950K', health: '76%', commits: 48 }
        ],
        pagination: { page: 1, limit: 20, total: 3, totalPages: 1 }
      }
    }
  }

  // Top movers and losers for ExplorerPage
  async getTopMovers() {
    const cacheKey = 'top_movers'
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const distributedData = await apiClient.getDistributedMonitorData()
      
      // Extract top movers and losers from distributed monitoring data
      const allSubnets = distributedData.results || []
      
      // Sort by performance change to get movers and losers
      const sortedByChange = allSubnets
        .filter(subnet => subnet.performance_change !== undefined)
        .sort((a, b) => b.performance_change - a.performance_change)

      const topMovers = sortedByChange.slice(0, 3).map(subnet => ({
        id: subnet.subnet_id,
        change: `+${subnet.performance_change.toFixed(1)}%`
      }))

      const topLosers = sortedByChange.slice(-3).reverse().map(subnet => ({
        id: subnet.subnet_id,
        change: `${subnet.performance_change.toFixed(1)}%`
      }))

      const result = { topMovers, topLosers }
      this.setCachedData(cacheKey, result)
      return result
    } catch (error) {
      console.warn('Failed to fetch top movers:', error)
      // Return fallback data
      return {
        topMovers: [
          { id: 14, change: '+15.2%' },
          { id: 63, change: '+12.1%' },
          { id: 101, change: '+10.3%' }
        ],
        topLosers: [
          { id: 7, change: '-9.4%' },
          { id: 88, change: '-7.7%' },
          { id: 56, change: '-6.2%' }
        ]
      }
    }
  }

  // AI insights for BriefPage
  async getAIInsights() {
    const cacheKey = 'ai_insights'
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      // Get comprehensive analysis for top performing subnets
      const distributedData = await apiClient.getDistributedMonitorData()
      const allSubnets = distributedData.results || []
      
      // Find top performers for subnet of the month and rising star
      const topPerformers = allSubnets
        .filter(subnet => subnet.overall_score > 0)
        .sort((a, b) => b.overall_score - a.overall_score)
        .slice(0, 5)

      let subnetOfMonth = null
      let risingStar = null

      // Get detailed analysis for top 2 performers
      if (topPerformers.length >= 2) {
        try {
          const [monthlyAnalysis, risingAnalysis] = await Promise.all([
            apiClient.getComprehensiveAnalysis(topPerformers[0].subnet_id),
            apiClient.getComprehensiveAnalysis(topPerformers[1].subnet_id)
          ])

          subnetOfMonth = {
            id: topPerformers[0].subnet_id,
            category: topPerformers[0].category || 'Training',
            yield: `${(topPerformers[0].yield || 13.5).toFixed(1)}%`,
            health: 'Excellent',
            description: monthlyAnalysis.summary || 'Selected for its consistent uptime, high participation rate, and strong developer backing.'
          }

          risingStar = {
            id: topPerformers[1].subnet_id,
            category: topPerformers[1].category || 'Prompting',
            yield: `${(topPerformers[1].yield || 9.8).toFixed(1)}%`,
            health: 'Good',
            description: risingAnalysis.summary || 'Gaining traction with strong performance metrics and active development.'
          }
        } catch (analysisError) {
          console.warn('Failed to get detailed analysis:', analysisError)
        }
      }

      // Fallback to default data if analysis fails
      if (!subnetOfMonth || !risingStar) {
        subnetOfMonth = subnetOfMonth || {
          id: 47,
          category: 'Training',
          yield: '13.5%',
          health: 'Excellent',
          description: 'Selected for its consistent uptime, high participation rate, and strong developer backing.'
        }

        risingStar = risingStar || {
          id: 22,
          category: 'Prompting',
          yield: '9.8%',
          health: 'Good',
          description: 'Up 27% this week and gaining traction with a strong Ethos score and active contributors on GitHub.'
        }
      }

      const result = { subnetOfMonth, risingStar }
      this.setCachedData(cacheKey, result)
      return result
    } catch (error) {
      console.warn('Failed to fetch AI insights:', error)
      // Return fallback data
      return {
        subnetOfMonth: {
          id: 47,
          category: 'Training',
          yield: '13.5%',
          health: 'Excellent',
          description: 'Selected for its consistent uptime, high participation rate, and strong developer backing.'
        },
        risingStar: {
          id: 22,
          category: 'Prompting',
          yield: '9.8%',
          health: 'Good',
          description: 'Up 27% this week and gaining traction with a strong Ethos score and active contributors on GitHub.'
        }
      }
    }
  }

  // Individual subnet data
  async getSubnetDetails(subnetId) {
    const cacheKey = `subnet_${subnetId}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const subnetData = await apiClient.getSubnetData(subnetId)
      this.setCachedData(cacheKey, subnetData)
      return subnetData
    } catch (error) {
      console.warn(`Failed to fetch subnet ${subnetId} details:`, error)
      throw error
    }
  }

  // Search functionality
  async searchSubnets(query) {
    try {
      // For now, filter from the subnet list
      // TODO: Implement dedicated search endpoint
      const { subnets } = await this.getSubnetList(1, 100)
      
      const lowercaseQuery = query.toLowerCase()
      const filteredSubnets = subnets.filter(subnet => 
        subnet.name.toLowerCase().includes(lowercaseQuery) ||
        subnet.id.toString() === query ||
        subnet.category.toLowerCase().includes(lowercaseQuery)
      )

      return { subnets: filteredSubnets }
    } catch (error) {
      console.warn('Failed to search subnets:', error)
      return { subnets: [] }
    }
  }

  // Process TAO question using io.net agents
  async processTaoQuestion(question) {
    try {
      const response = await apiClient.post('/api/tao/question', {
        question: question.trim(),
        timestamp: Date.now()
      })
      
      return response
    } catch (error) {
      console.warn('Failed to process TAO question:', error)
      throw error
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }
}

// Create singleton instance
const dataService = new DataService()

export default dataService