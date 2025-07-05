/**
 * 🪪 ETHOS NETWORK SERVICE
 * Enterprise-grade identity and reputation service integration
 * 
 * Features:
 * - Privy authentication with JWT token management
 * - Token usage tracking (150 user limit compliance)
 * - Profile, score, and reputation data retrieval
 * - Redis caching with smart TTL management
 * - Comprehensive error handling and logging
 * - Rate limiting and API optimization
 */

import cacheService from './cacheService.js';
import logger from './logger.js';

class EthosService {
  constructor() {
    this.baseURL = process.env.ETHOS_API_BASE_URL || 'https://api.ethos.network';
    this.clientHeader = 'SubnetScout/1.0';
    
    // Initialize Privy client for token verification if credentials are available
    this.privyConfigured = !!(process.env.REACT_APP_PRIVY_APP_ID && process.env.PRIVY_APP_SECRET);
    
    if (this.privyConfigured) {
      try {
        // Dynamic import for Privy client to handle missing dependency gracefully
        this.initPrivyClient();
      } catch (error) {
        console.warn('Privy client initialization failed, running without token verification:', error.message);
        this.privyConfigured = false;
      }
    }
    
    // Token usage tracking (150 user limit)
    this.tokenUsage = {
      totalUsers: 0,
      dailyUsers: new Set(),
      lastReset: new Date().toDateString()
    };
    
    // API endpoints mapping
    this.endpoints = {
      user: '/api/v2/users',
      score: '/api/v2/score',
      reviews: '/api/v2/reviews', 
      activities: '/api/v2/activities',
      profiles: '/api/v1/profiles', // v1 for backward compatibility
      attestations: '/api/v1/attestations'
    };
    
    // Cache TTL configurations (in seconds)
    this.cacheTTL = {
      profile: 3600,      // 1 hour
      score: 1800,        // 30 minutes  
      reviews: 7200,      // 2 hours
      activities: 900     // 15 minutes
    };
    
    console.log('🪪 Ethos Network Service initialized with token usage tracking');
  }

  async initPrivyClient() {
    try {
      const { PrivyClient } = await import('@privy-io/server-auth');
      this.privyClient = new PrivyClient({
        appId: process.env.REACT_APP_PRIVY_APP_ID,
        appSecret: process.env.PRIVY_APP_SECRET
      });
      logger.info('✅ Privy client initialized successfully for Ethos authentication');
    } catch (error) {
      logger.error('❌ Failed to initialize Privy client:', error);
      this.privyConfigured = false;
      throw error;
    }
  }

  /**
   * Verify Privy token and extract user information
   */
  async verifyPrivyToken(token) {
    if (!this.privyConfigured) {
      throw new Error('Privy authentication not configured');
    }
    
    try {
      const claims = await this.privyClient.verifyAuthToken(token);
      return {
        valid: true,
        userId: claims.userId,
        walletAddress: claims.wallet?.address,
        claims
      };
    } catch (error) {
      logger.error('Privy token verification failed', { 
        error: error.message,
        service: 'ethos'
      });
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Track token usage to stay within 150 user limit
   */
  trackTokenUsage(userId) {
    const today = new Date().toDateString();
    
    // Reset daily tracking if new day
    if (this.tokenUsage.lastReset !== today) {
      this.tokenUsage.dailyUsers.clear();
      this.tokenUsage.lastReset = today;
    }
    
    // Track unique users
    if (!this.tokenUsage.dailyUsers.has(userId)) {
      this.tokenUsage.dailyUsers.add(userId);
      this.tokenUsage.totalUsers++;
    }
    
    // Log usage stats
    logger.info('Ethos token usage tracked', {
      service: 'ethos',
      daily_users: this.tokenUsage.dailyUsers.size,
      total_users: this.tokenUsage.totalUsers,
      limit_remaining: 150 - this.tokenUsage.totalUsers
    });
  }

  /**
   * Check if we can make API calls without exceeding limits
   */
  canMakeRequest() {
    if (this.tokenUsage.totalUsers >= 145) { // Buffer of 5 users
      logger.warn('Ethos API usage approaching limit', {
        service: 'ethos',
        total_users: this.tokenUsage.totalUsers,
        limit: 150
      });
      return false;
    }
    return true;
  }

  /**
   * Make authenticated API request to Ethos
   */
  async makeRequest(endpoint, token, options = {}) {
    if (!this.canMakeRequest()) {
      throw new Error('Ethos API usage limit reached (150 users)');
    }

    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Ethos-Client': this.clientHeader,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      logger.info('Ethos API request initiated', {
        service: 'ethos',
        endpoint,
        method: requestOptions.method
      });

      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Ethos API error: ${response.status} ${response.statusText} - ${errorData}`);
      }

      const data = await response.json();
      
      logger.info('Ethos API request successful', {
        service: 'ethos',
        endpoint,
        response_size: JSON.stringify(data).length
      });

      return data;
    } catch (error) {
      logger.error('Ethos API request failed', {
        service: 'ethos',
        endpoint,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get demo identity data for bots (no authentication required)
   * This provides realistic demo data for Telegram bot and similar use cases
   */
  async getBotIdentity(userkey) {
    const cacheKey = `ethos:bot:${userkey}`;
    
    try {
      // Check cache first
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Generate realistic demo data for bot usage
      const demoData = this.generateDemoIdentity(userkey);
      
      // Cache for 30 minutes
      await cacheService.set(cacheKey, demoData, 1800);
      
      logger.info('Ethos bot identity generated', {
        service: 'ethos',
        userkey,
        source: 'demo'
      });

      return demoData;
    } catch (error) {
      logger.error('Ethos bot identity generation failed', {
        service: 'ethos',
        userkey,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Generate realistic demo identity data
   */
  generateDemoIdentity(userkey) {
    // Extract type of userkey for realistic data
    const isWallet = userkey.startsWith('0x');
    const isDiscord = userkey.startsWith('@') || userkey.includes('discord');
    const isTwitter = userkey.includes('twitter') || userkey.startsWith('@');
    
    // Base reputation score (randomized but consistent per userkey)
    const hash = this.simpleHash(userkey);
    const baseScore = 30 + (hash % 70); // 30-99 range
    
    return {
      success: true,
      data: {
        userkey,
        profile: {
          name: isWallet ? `User ${userkey.substring(0, 8)}...` : 
                isDiscord ? `Discord User` : 
                isTwitter ? `Twitter User` : 
                `Profile ${userkey}`,
          description: `Demo profile for ${userkey}`,
          avatar_url: null
        },
        reputation: {
          score: baseScore,
          breakdown: {
            credibility: Math.max(20, baseScore - 10 + (hash % 20)),
            activity: Math.max(10, baseScore - 5 + (hash % 15)),
            reviews: Math.max(5, baseScore - 15 + (hash % 25))
          }
        },
        reviews: {
          summary: {
            total_reviews: Math.floor(hash % 50),
            average_rating: 3.5 + ((hash % 25) / 10), // 3.5-6.0 range
            recent_reviews: Math.floor(hash % 10)
          }
        },
        verification: {
          status: baseScore > 70 ? 'verified' : 'pending'
        },
        connections: isWallet ? {
          ethereum: userkey
        } : isDiscord ? {
          discord: userkey
        } : {
          twitter: userkey
        },
        trust_metrics: {
          transparency: Math.max(1, Math.floor(baseScore / 10)),
          consistency: Math.max(1, Math.floor((baseScore + 10) / 15)),
          engagement: Math.max(1, Math.floor((baseScore + 5) / 12))
        },
        source: 'mock_demo',
        last_updated: new Date().toISOString()
      }
    };
  }

  /**
   * Simple hash function for consistent random data
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get user profile data by userkey (requires authentication)
   * Supports: profileId:10, address:0x..., service:discord:123, etc.
   */
  async getUserProfile(userkey, token) {
    const cacheKey = `ethos:profile:${userkey}`;
    
    try {
      // Check cache first
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        logger.info('Ethos profile cache hit', { 
          service: 'ethos', 
          userkey,
          cached: true 
        });
        return cached;
      }

      // Verify token and track usage
      const tokenVerification = await this.verifyPrivyToken(token);
      if (!tokenVerification.valid) {
        throw new Error(`Invalid token: ${tokenVerification.error}`);
      }
      
      this.trackTokenUsage(tokenVerification.userId);

      // Make API request
      const profileData = await this.makeRequest(
        `${this.endpoints.user}/${userkey}`,
        token
      );

      // Cache the result
      await cacheService.set(cacheKey, profileData, this.cacheTTL.profile);

      logger.info('Ethos profile retrieved successfully', {
        service: 'ethos',
        userkey,
        cached: false,
        profile_id: profileData?.id
      });

      return profileData;
    } catch (error) {
      logger.error('Ethos profile retrieval failed', {
        service: 'ethos',
        userkey,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get user reputation score
   */
  async getUserScore(userkey, token) {
    const cacheKey = `ethos:score:${userkey}`;
    
    try {
      // Check cache first
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Verify token and track usage
      const tokenVerification = await this.verifyPrivyToken(token);
      if (!tokenVerification.valid) {
        throw new Error(`Invalid token: ${tokenVerification.error}`);
      }
      
      this.trackTokenUsage(tokenVerification.userId);

      // Make API request
      const scoreData = await this.makeRequest(
        `${this.endpoints.score}/${userkey}`,
        token
      );

      // Cache the result
      await cacheService.set(cacheKey, scoreData, this.cacheTTL.score);

      logger.info('Ethos score retrieved successfully', {
        service: 'ethos',
        userkey,
        score: scoreData?.score
      });

      return scoreData;
    } catch (error) {
      logger.error('Ethos score retrieval failed', {
        service: 'ethos',
        userkey,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get user reviews and attestations
   */
  async getUserReviews(userkey, token, limit = 10) {
    const cacheKey = `ethos:reviews:${userkey}:${limit}`;
    
    try {
      // Check cache first
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Verify token and track usage
      const tokenVerification = await this.verifyPrivyToken(token);
      if (!tokenVerification.valid) {
        throw new Error(`Invalid token: ${tokenVerification.error}`);
      }
      
      this.trackTokenUsage(tokenVerification.userId);

      // Make API request
      const reviewsData = await this.makeRequest(
        `${this.endpoints.reviews}?subject=${userkey}&limit=${limit}`,
        token
      );

      // Cache the result
      await cacheService.set(cacheKey, reviewsData, this.cacheTTL.reviews);

      logger.info('Ethos reviews retrieved successfully', {
        service: 'ethos',
        userkey,
        review_count: reviewsData?.length || 0
      });

      return reviewsData;
    } catch (error) {
      logger.error('Ethos reviews retrieval failed', {
        service: 'ethos',
        userkey,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get user activity feed
   */
  async getUserActivities(userkey, token, limit = 10) {
    const cacheKey = `ethos:activities:${userkey}:${limit}`;
    
    try {
      // Check cache first
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Verify token and track usage
      const tokenVerification = await this.verifyPrivyToken(token);
      if (!tokenVerification.valid) {
        throw new Error(`Invalid token: ${tokenVerification.error}`);
      }
      
      this.trackTokenUsage(tokenVerification.userId);

      // Make API request
      const activitiesData = await this.makeRequest(
        `${this.endpoints.activities}?user=${userkey}&limit=${limit}`,
        token
      );

      // Cache the result
      await cacheService.set(cacheKey, activitiesData, this.cacheTTL.activities);

      logger.info('Ethos activities retrieved successfully', {
        service: 'ethos',
        userkey,
        activity_count: activitiesData?.length || 0
      });

      return activitiesData;
    } catch (error) {
      logger.error('Ethos activities retrieval failed', {
        service: 'ethos',
        userkey,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get comprehensive user identity data
   */
  async getComprehensiveIdentity(userkey, token) {
    try {
      logger.info('Ethos comprehensive identity request', {
        service: 'ethos',
        userkey
      });

      const [profile, score, reviews] = await Promise.allSettled([
        this.getUserProfile(userkey, token),
        this.getUserScore(userkey, token),
        this.getUserReviews(userkey, token, 5)
      ]);

      const result = {
        userkey,
        profile: profile.status === 'fulfilled' ? profile.value : null,
        score: score.status === 'fulfilled' ? score.value : null,
        reviews: reviews.status === 'fulfilled' ? reviews.value : null,
        timestamp: new Date().toISOString()
      };

      // Calculate summary metrics
      if (result.score) {
        result.reputation_summary = {
          score: result.score.score || 0,
          level: this.getReputationLevel(result.score.score || 0),
          review_count: result.reviews?.length || 0,
          trust_connections: result.profile?.connections || 0
        };
      }

      logger.info('Ethos comprehensive identity retrieved', {
        service: 'ethos',
        userkey,
        has_profile: !!result.profile,
        has_score: !!result.score,
        review_count: result.reviews?.length || 0
      });

      return result;
    } catch (error) {
      logger.error('Ethos comprehensive identity failed', {
        service: 'ethos',
        userkey,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get reputation level based on score
   */
  getReputationLevel(score) {
    if (score >= 900) return { level: 'legendary', emoji: '👑', description: 'Legendary reputation' };
    if (score >= 800) return { level: 'expert', emoji: '🌟', description: 'Expert reputation' };
    if (score >= 700) return { level: 'advanced', emoji: '🚀', description: 'Advanced reputation' };
    if (score >= 600) return { level: 'intermediate', emoji: '📈', description: 'Intermediate reputation' };
    if (score >= 400) return { level: 'active', emoji: '⚡', description: 'Active reputation' };
    if (score >= 200) return { level: 'emerging', emoji: '🌱', description: 'Emerging reputation' };
    return { level: 'new', emoji: '👋', description: 'New to network' };
  }

  /**
   * Get service health status
   */
  getHealthStatus() {
    return {
      service: 'ethos_network',
      status: 'operational',
      api_base_url: this.baseURL,
      token_usage: {
        total_users: this.tokenUsage.totalUsers,
        daily_users: this.tokenUsage.dailyUsers.size,
        limit: 150,
        remaining: 150 - this.tokenUsage.totalUsers
      },
      cache_enabled: true,
      privy_configured: !!(process.env.REACT_APP_PRIVY_APP_ID && process.env.PRIVY_APP_SECRET)
    };
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    return {
      service: 'ethos_network',
      token_usage: this.tokenUsage,
      limit: 150,
      remaining: 150 - this.tokenUsage.totalUsers,
      daily_reset: this.tokenUsage.lastReset,
      cache_ttl: this.cacheTTL
    };
  }
}

// Create and export service instance
const ethosService = new EthosService();

export default ethosService; 