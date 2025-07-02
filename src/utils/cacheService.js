import Redis from 'redis';

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.cacheStats = {
      hits: 0,
      misses: 0,
      errors: 0,
      operations: 0
    };
    
    this.init();
  }

  async init() {
    try {
      // Create Redis client with fallback configuration
      this.client = Redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      });

      // Handle connection events
      this.client.on('connect', () => {
        console.log('🔄 Redis: Connecting...');
      });

      this.client.on('ready', () => {
        console.log('✅ Redis: Connected and ready');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        console.error('❌ Redis error:', err.message);
        this.isConnected = false;
        this.cacheStats.errors++;
      });

      this.client.on('end', () => {
        console.log('🔌 Redis: Connection closed');
        this.isConnected = false;
      });

      // Attempt to connect
      await this.client.connect();
      
    } catch (error) {
      console.error('❌ Redis initialization failed:', error.message);
      console.log('⚠️ Cache service running in fallback mode (no Redis)');
      this.isConnected = false;
    }
  }

  // Generate cache keys
  generateKey(type, identifier, ...params) {
    const baseKey = `subnet-scout:${type}:${identifier}`;
    if (params.length > 0) {
      return `${baseKey}:${params.join(':')}`;
    }
    return baseKey;
  }

  // Get cached data
  async get(key) {
    if (!this.isConnected) {
      this.cacheStats.misses++;
      return null;
    }

    try {
      this.cacheStats.operations++;
      const result = await this.client.get(key);
      
      if (result) {
        this.cacheStats.hits++;
        return JSON.parse(result);
      } else {
        this.cacheStats.misses++;
        return null;
      }
    } catch (error) {
      console.error('❌ Cache GET error:', error.message);
      this.cacheStats.errors++;
      return null;
    }
  }

  // Set cached data with TTL
  async set(key, data, ttlSeconds = 3600) {
    if (!this.isConnected) {
      return false;
    }

    try {
      this.cacheStats.operations++;
      const serialized = JSON.stringify(data);
      await this.client.setEx(key, ttlSeconds, serialized);
      return true;
    } catch (error) {
      console.error('❌ Cache SET error:', error.message);
      this.cacheStats.errors++;
      return false;
    }
  }

  // Delete cached data
  async del(key) {
    if (!this.isConnected) {
      return false;
    }

    try {
      this.cacheStats.operations++;
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('❌ Cache DEL error:', error.message);
      this.cacheStats.errors++;
      return false;
    }
  }

  // Clear all cached data with pattern
  async clear(pattern = 'subnet-scout:*') {
    if (!this.isConnected) {
      return false;
    }

    try {
      this.cacheStats.operations++;
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        console.log(`🗑️ Cleared ${keys.length} cache entries`);
      }
      return true;
    } catch (error) {
      console.error('❌ Cache CLEAR error:', error.message);
      this.cacheStats.errors++;
      return false;
    }
  }

  // Specific cache methods for common operations
  
  // Subnet data caching
  async getSubnetData(subnetId) {
    const key = this.generateKey('subnet', subnetId);
    return await this.get(key);
  }

  async setSubnetData(subnetId, data, ttl = 300) { // 5 minute TTL
    const key = this.generateKey('subnet', subnetId);
    return await this.set(key, data, ttl);
  }

  // GitHub stats caching
  async getGithubStats(subnetId) {
    const key = this.generateKey('github', subnetId);
    return await this.get(key);
  }

  async setGithubStats(subnetId, stats, ttl = 1800) { // 30 minute TTL
    const key = this.generateKey('github', subnetId);
    return await this.set(key, stats, ttl);
  }

  // AI analysis caching
  async getAIAnalysis(subnetId, analysisType) {
    const key = this.generateKey('ai', subnetId, analysisType);
    return await this.get(key);
  }

  async setAIAnalysis(subnetId, analysisType, analysis, ttl = 3600) { // 1 hour TTL
    const key = this.generateKey('ai', subnetId, analysisType);
    return await this.set(key, analysis, ttl);
  }

  // Distributed monitor results caching
  async getDistributedResults() {
    const key = this.generateKey('distributed', 'monitor');
    return await this.get(key);
  }

  async setDistributedResults(results, ttl = 120) { // 2 minute TTL
    const key = this.generateKey('distributed', 'monitor');
    return await this.set(key, results, ttl);
  }

  // Batch operation caching
  async getBatchResults(batchId) {
    const key = this.generateKey('batch', batchId);
    return await this.get(key);
  }

  async setBatchResults(batchId, results, ttl = 600) { // 10 minute TTL
    const key = this.generateKey('batch', batchId);
    return await this.set(key, results, ttl);
  }

  // Cache statistics
  getStats() {
    const total = this.cacheStats.hits + this.cacheStats.misses;
    const hitRate = total > 0 ? ((this.cacheStats.hits / total) * 100).toFixed(2) : 0;
    
    return {
      connected: this.isConnected,
      hits: this.cacheStats.hits,
      misses: this.cacheStats.misses,
      errors: this.cacheStats.errors,
      operations: this.cacheStats.operations,
      hit_rate: `${hitRate}%`,
      total_requests: total
    };
  }

  // Health check
  async healthCheck() {
    if (!this.isConnected) {
      return {
        status: 'down',
        error: 'Redis not connected'
      };
    }

    try {
      const testKey = 'subnet-scout:health:check';
      const testValue = { timestamp: Date.now() };
      
      await this.set(testKey, testValue, 60);
      const retrieved = await this.get(testKey);
      await this.del(testKey);
      
      const isWorking = retrieved && retrieved.timestamp === testValue.timestamp;
      
      return {
        status: isWorking ? 'up' : 'degraded',
        latency: Date.now() - testValue.timestamp,
        stats: this.getStats()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  // Graceful shutdown
  async close() {
    if (this.client && this.isConnected) {
      try {
        await this.client.quit();
        console.log('✅ Redis connection closed gracefully');
      } catch (error) {
        console.error('❌ Error closing Redis connection:', error.message);
      }
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

export default cacheService; 