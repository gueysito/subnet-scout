import cacheService from './cacheService.js';
import logger from './logger.js';

class KaitoYapsService {
  constructor() {
    this.baseUrl = 'https://api.kaito.ai/api/v1';
    this.rateLimit = {
      maxCalls: 100,
      windowMs: 5 * 60 * 1000, // 5 minutes
      calls: 0,
      windowStart: Date.now()
    };
    
    console.log('🎯 Kaito Yaps Service initialized with rate limiting');
  }

  // Rate limiting management
  checkRateLimit() {
    const now = Date.now();
    
    // Reset window if expired
    if (now - this.rateLimit.windowStart > this.rateLimit.windowMs) {
      this.rateLimit.calls = 0;
      this.rateLimit.windowStart = now;
    }
    
    // Check if we're at the limit
    if (this.rateLimit.calls >= this.rateLimit.maxCalls) {
      const resetTime = this.rateLimit.windowStart + this.rateLimit.windowMs;
      const waitTime = resetTime - now;
      
      logger.warn('Kaito Yaps rate limit reached', {
        calls: this.rateLimit.calls,
        maxCalls: this.rateLimit.maxCalls,
        resetIn: `${Math.ceil(waitTime / 1000)}s`
      });
      
      return false;
    }
    
    return true;
  }

  // Increment rate limit counter
  incrementRateLimit() {
    this.rateLimit.calls++;
  }

  // Get mindshare data for a username
  async getMindshareData(username) {
    try {
      if (!username || typeof username !== 'string') {
        throw new Error('Username is required and must be a string');
      }

      const cacheKey = `kaito:yaps:${username}`;
      
      // Check cache first (1 hour TTL)
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        logger.cacheOperation('get', cacheKey, true);
        return JSON.parse(cached);
      }

      // Check rate limit
      if (!this.checkRateLimit()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      const start = Date.now();
      
      // Make API request
      const response = await fetch(`${this.baseUrl}/yaps?username=${encodeURIComponent(username)}`);
      const responseTime = Date.now() - start;
      
      this.incrementRateLimit();
      
      if (!response.ok) {
        throw new Error(`Kaito API error: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();
      if (!responseText.trim()) {
        throw new Error('Empty response from Kaito API');
      }

      const data = JSON.parse(responseText);
      
      // Process and normalize the response
      const mindshareData = this.normalizeYapsData(data, username);
      
      // Cache the result (1 hour TTL)
      await cacheService.set(cacheKey, JSON.stringify(mindshareData), 3600);
      logger.cacheOperation('set', cacheKey, false, responseTime);
      
      logger.info('Kaito Yaps data retrieved successfully', {
        username,
        yaps_all: mindshareData.yaps_all,
        yaps_l7d: mindshareData.yaps_l7d,
        yaps_l30d: mindshareData.yaps_l30d,
        response_time: `${responseTime}ms`,
        cached: false
      });

      return mindshareData;

    } catch (error) {
      logger.error('Kaito Yaps API error', {
        username,
        error: error.message,
        stack: error.stack
      });
      
      // Return default data on error to prevent UI breaks
      return this.getDefaultMindshareData(username);
    }
  }

  // Normalize Yaps API response data
  normalizeYapsData(rawData, username) {
    // Handle various response formats
    const data = rawData.data || rawData;
    
          const timestamp = new Date().toISOString();
      return {
        username: username,
        yaps_all: this.parseYapsValue(data.yaps_all) || 0,
        yaps_l7d: this.parseYapsValue(data.yaps_l7d) || 0,
        yaps_l30d: this.parseYapsValue(data.yaps_l30d) || 0,
        rank: data.rank || null,
        percentile: data.percentile || null,
        last_updated: timestamp,
        source: 'kaito_yaps'
      };
  }

  // Parse Yaps values (handle string/number formats)
  parseYapsValue(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  // Get default mindshare data for error cases
  getDefaultMindshareData(username) {
    const timestamp = new Date().toISOString();
    return {
      username: username,
      yaps_all: 0,
      yaps_l7d: 0,
      yaps_l30d: 0,
      rank: null,
      percentile: null,
      last_updated: timestamp,
      source: 'fallback'
    };
  }

  // Batch get mindshare data for multiple usernames
  async getBatchMindshareData(usernames) {
    try {
      if (!Array.isArray(usernames)) {
        throw new Error('Usernames must be an array');
      }

      const results = [];
      const errors = [];

      // Process usernames with rate limiting
      for (const username of usernames) {
        try {
          const data = await this.getMindshareData(username);
          results.push(data);
          
          // Small delay to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          errors.push({ username, error: error.message });
        }
      }

      logger.info('Kaito Yaps batch processing completed', {
        total: usernames.length,
        successful: results.length,
        errors: errors.length
      });

      return {
        success: true,
        data: results,
        errors: errors,
        total: usernames.length,
        successful: results.length
      };

    } catch (error) {
      logger.error('Kaito Yaps batch processing error', {
        error: error.message,
        usernames: usernames?.length || 0
      });
      
      return {
        success: false,
        error: error.message,
        data: [],
        errors: [],
        total: 0,
        successful: 0
      };
    }
  }

  // Calculate reputation score based on mindshare data
  calculateReputationScore(mindshareData) {
    const { yaps_all, yaps_l7d, yaps_l30d } = mindshareData;
    
    // Weight recent activity more heavily
    const recentWeight = 0.5;
    const mediumWeight = 0.3;
    const totalWeight = 0.2;
    
    // Normalize values (log scale to handle large numbers)
    const normalizedRecent = Math.log10(yaps_l7d + 1);
    const normalizedMedium = Math.log10(yaps_l30d + 1);
    const normalizedTotal = Math.log10(yaps_all + 1);
    
    // Calculate weighted score (0-100 scale)
    const rawScore = (
      normalizedRecent * recentWeight +
      normalizedMedium * mediumWeight +
      normalizedTotal * totalWeight
    );
    
    // Scale to 0-100 range
    const score = Math.min(100, Math.max(0, rawScore * 10));
    
    return {
      score: Math.round(score),
      breakdown: {
        recent_activity: Math.round(normalizedRecent * 10),
        medium_activity: Math.round(normalizedMedium * 10),
        total_activity: Math.round(normalizedTotal * 10)
      },
      weights: {
        recent: recentWeight,
        medium: mediumWeight,
        total: totalWeight
      }
    };
  }

  // Get reputation badge based on score
  getReputationBadge(score) {
    if (score >= 90) return { level: 'legendary', emoji: '🏆', color: '#FFD700' };
    if (score >= 80) return { level: 'expert', emoji: '🎖️', color: '#C0C0C0' };
    if (score >= 70) return { level: 'advanced', emoji: '🥉', color: '#CD7F32' };
    if (score >= 60) return { level: 'intermediate', emoji: '📈', color: '#4F46E5' };
    if (score >= 40) return { level: 'active', emoji: '⚡', color: '#10B981' };
    if (score >= 20) return { level: 'emerging', emoji: '🌱', color: '#F59E0B' };
    return { level: 'new', emoji: '👋', color: '#6B7280' };
  }

  // Get rate limit status
  getRateLimitStatus() {
    const now = Date.now();
    const timeLeft = this.rateLimit.windowStart + this.rateLimit.windowMs - now;
    
    return {
      calls: this.rateLimit.calls,
      maxCalls: this.rateLimit.maxCalls,
      remaining: this.rateLimit.maxCalls - this.rateLimit.calls,
      resetIn: Math.max(0, Math.ceil(timeLeft / 1000)),
      canMakeRequest: this.checkRateLimit()
    };
  }

  // Get service health status
  getHealthStatus() {
    const rateLimitStatus = this.getRateLimitStatus();
    
    return {
      service: 'kaito_yaps',
      status: 'operational',
      rate_limit: rateLimitStatus,
      cache_status: cacheService ? 'connected' : 'disconnected',
      last_check: new Date().toISOString()
    };
  }
}

// Create and export service instance
const kaitoYapsService = new KaitoYapsService();

export default kaitoYapsService; 