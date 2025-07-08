import pg from 'pg';
import logger from './logger.js';

const { Pool } = pg;

class DatabaseService {
  constructor() {
    this.pool = null;
    this.isConnected = false;
    this.connectionConfig = this.getConnectionConfig();
    this.retryCount = 0;
    this.maxRetries = 3;
    
    this.init();
  }

  getConnectionConfig() {
    // Use DATABASE_URL if provided (common in production environments)
    if (process.env.DATABASE_URL) {
      return {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      };
    }

    // Use individual environment variables as fallback
    return {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'subnet_scout',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      max: 20, // Maximum number of connections in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }

  async init() {
    if (!this.shouldConnect()) {
      logger.info('PostgreSQL: Database not configured, running without historical data storage');
      return;
    }

    try {
      this.pool = new Pool(this.connectionConfig);

      // Handle pool events
      this.pool.on('connect', (client) => {
        logger.debug('PostgreSQL: New client connected');
      });

      this.pool.on('error', (err, client) => {
        logger.error('PostgreSQL: Unexpected error on idle client', { error: err.message });
        this.isConnected = false;
      });

      // Test the connection
      await this.testConnection();
      
      // Initialize schema if connected
      if (this.isConnected) {
        await this.initializeSchema();
      }

    } catch (error) {
      logger.error('PostgreSQL: Failed to initialize database', { error: error.message });
      this.isConnected = false;
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        logger.info(`PostgreSQL: Retrying connection (${this.retryCount}/${this.maxRetries}) in 5 seconds`);
        setTimeout(() => this.init(), 5000);
      } else {
        logger.warn('PostgreSQL: Max retries reached, running without database');
      }
    }
  }

  shouldConnect() {
    return process.env.DATABASE_URL || 
           (process.env.DB_HOST && process.env.DB_NAME) ||
           process.env.ENABLE_DATABASE === 'true';
  }

  async testConnection() {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      
      this.isConnected = true;
      logger.info('PostgreSQL: Connected successfully', { 
        timestamp: result.rows[0].now 
      });
      
    } catch (error) {
      this.isConnected = false;
      throw error;
    }
  }

  async initializeSchema() {
    if (!this.isConnected) return;

    try {
      const client = await this.pool.connect();
      
      // Create tables for historical data
      await client.query(`
        CREATE TABLE IF NOT EXISTS subnet_metrics (
          id SERIAL PRIMARY KEY,
          subnet_id INTEGER NOT NULL,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          score INTEGER,
          emission_rate DECIMAL(10, 6),
          stake DECIMAL(20, 8),
          incentive DECIMAL(10, 6),
          activity_level VARCHAR(20),
          github_commits INTEGER,
          github_activity_score INTEGER,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_subnet_metrics_subnet_timestamp 
        ON subnet_metrics(subnet_id, timestamp DESC);
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS system_metrics (
          id SERIAL PRIMARY KEY,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          metric_type VARCHAR(50) NOT NULL,
          metric_name VARCHAR(100) NOT NULL,
          metric_value DECIMAL(12, 4),
          metric_unit VARCHAR(20),
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_system_metrics_type_timestamp 
        ON system_metrics(metric_type, timestamp DESC);
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS ai_analysis_cache (
          id SERIAL PRIMARY KEY,
          cache_key VARCHAR(255) UNIQUE NOT NULL,
          subnet_id INTEGER,
          analysis_type VARCHAR(50),
          analysis_data JSONB,
          expires_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_ai_cache_key_expires 
        ON ai_analysis_cache(cache_key, expires_at);
      `);

      client.release();
      logger.info('PostgreSQL: Schema initialized successfully');
      
    } catch (error) {
      logger.error('PostgreSQL: Failed to initialize schema', { error: error.message });
      throw error;
    }
  }

  // Store subnet metrics for historical tracking
  async storeSubnetMetric(subnetId, metrics) {
    if (!this.isConnected) return false;

    try {
      const client = await this.pool.connect();
      
      const query = `
        INSERT INTO subnet_metrics (
          subnet_id, score, emission_rate, stake, incentive, 
          activity_level, github_commits, github_activity_score, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
      `;

      const values = [
        subnetId,
        metrics.score || null,
        metrics.emission_rate || null,
        metrics.stake || null,
        metrics.incentive || null,
        metrics.activity_level || null,
        metrics.github_commits || null,
        metrics.github_activity_score || null,
        JSON.stringify(metrics.metadata || {})
      ];

      const result = await client.query(query, values);
      client.release();

      logger.debug('PostgreSQL: Stored subnet metric', { 
        subnet_id: subnetId, 
        record_id: result.rows[0].id 
      });
      
      return result.rows[0].id;
    } catch (error) {
      logger.error('PostgreSQL: Failed to store subnet metric', { 
        subnet_id: subnetId, 
        error: error.message 
      });
      return false;
    }
  }

  // Get historical data for a subnet
  async getSubnetHistory(subnetId, hours = 24) {
    if (!this.isConnected) return [];

    try {
      const client = await this.pool.connect();
      
      // Validate and sanitize hours parameter to prevent SQL injection
      const validatedHours = Math.max(1, Math.min(parseInt(hours) || 24, 8760)); // 1 hour to 1 year max
      
      const query = `
        SELECT * FROM subnet_metrics 
        WHERE subnet_id = $1 
        AND timestamp >= NOW() - INTERVAL $2
        ORDER BY timestamp DESC
        LIMIT 1000;
      `;

      const result = await client.query(query, [subnetId, `${validatedHours} hours`]);
      client.release();

      return result.rows;
    } catch (error) {
      logger.error('PostgreSQL: Failed to get subnet history', { 
        subnet_id: subnetId, 
        error: error.message 
      });
      return [];
    }
  }

  // Store system performance metrics
  async storeSystemMetric(metricType, metricName, value, unit = null, metadata = {}) {
    if (!this.isConnected) return false;

    try {
      const client = await this.pool.connect();
      
      const query = `
        INSERT INTO system_metrics (metric_type, metric_name, metric_value, metric_unit, metadata)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;

      const values = [
        metricType,
        metricName,
        value,
        unit,
        JSON.stringify(metadata)
      ];

      const result = await client.query(query, values);
      client.release();

      return result.rows[0].id;
    } catch (error) {
      logger.error('PostgreSQL: Failed to store system metric', { error: error.message });
      return false;
    }
  }

  // Get system metrics for monitoring
  async getSystemMetrics(metricType, hours = 1) {
    if (!this.isConnected) return [];

    try {
      const client = await this.pool.connect();
      
      // Validate and sanitize hours parameter to prevent SQL injection
      const validatedHours = Math.max(1, Math.min(parseInt(hours) || 1, 8760)); // 1 hour to 1 year max
      
      const query = `
        SELECT * FROM system_metrics 
        WHERE metric_type = $1 
        AND timestamp >= NOW() - INTERVAL $2
        ORDER BY timestamp DESC;
      `;

      const result = await client.query(query, [metricType, `${validatedHours} hours`]);
      client.release();

      return result.rows;
    } catch (error) {
      logger.error('PostgreSQL: Failed to get system metrics', { error: error.message });
      return [];
    }
  }

  // Cache AI analysis results
  async cacheAIAnalysis(cacheKey, subnetId, analysisType, data, ttlHours = 1) {
    if (!this.isConnected) return false;

    try {
      const client = await this.pool.connect();
      
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + ttlHours);

      const query = `
        INSERT INTO ai_analysis_cache (cache_key, subnet_id, analysis_type, analysis_data, expires_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (cache_key) 
        DO UPDATE SET 
          analysis_data = EXCLUDED.analysis_data,
          expires_at = EXCLUDED.expires_at,
          created_at = CURRENT_TIMESTAMP
        RETURNING id;
      `;

      const values = [
        cacheKey,
        subnetId,
        analysisType,
        JSON.stringify(data),
        expiresAt
      ];

      const result = await client.query(query, values);
      client.release();

      return result.rows[0].id;
    } catch (error) {
      logger.error('PostgreSQL: Failed to cache AI analysis', { error: error.message });
      return false;
    }
  }

  // Get cached AI analysis
  async getCachedAIAnalysis(cacheKey) {
    if (!this.isConnected) return null;

    try {
      const client = await this.pool.connect();
      
      const query = `
        SELECT analysis_data FROM ai_analysis_cache 
        WHERE cache_key = $1 
        AND expires_at > CURRENT_TIMESTAMP;
      `;

      const result = await client.query(query, [cacheKey]);
      client.release();

      if (result.rows.length > 0) {
        return result.rows[0].analysis_data;
      }
      return null;
    } catch (error) {
      logger.error('PostgreSQL: Failed to get cached AI analysis', { error: error.message });
      return null;
    }
  }

  // Clean up expired cache entries
  async cleanupExpiredCache() {
    if (!this.isConnected) return false;

    try {
      const client = await this.pool.connect();
      
      const result = await client.query(`
        DELETE FROM ai_analysis_cache 
        WHERE expires_at < CURRENT_TIMESTAMP;
      `);
      
      client.release();

      if (result.rowCount > 0) {
        logger.info(`PostgreSQL: Cleaned up ${result.rowCount} expired cache entries`);
      }
      
      return true;
    } catch (error) {
      logger.error('PostgreSQL: Failed to cleanup expired cache', { error: error.message });
      return false;
    }
  }

  // Health check
  async healthCheck() {
    if (!this.isConnected) {
      return {
        status: 'down',
        error: 'Database not connected'
      };
    }

    try {
      const client = await this.pool.connect();
      const start = Date.now();
      
      await client.query('SELECT 1');
      const responseTime = Date.now() - start;
      
      client.release();

      return {
        status: 'up',
        response_time: responseTime,
        pool_size: this.pool.totalCount,
        idle_connections: this.pool.idleCount,
        waiting_clients: this.pool.waitingCount
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  // Get database statistics
  async getStats() {
    if (!this.isConnected) {
      return {
        connected: false,
        message: 'Database not connected'
      };
    }

    try {
      const client = await this.pool.connect();
      
      // Get table statistics
      const subnetMetricsCount = await client.query('SELECT COUNT(*) FROM subnet_metrics');
      const systemMetricsCount = await client.query('SELECT COUNT(*) FROM system_metrics');
      const cacheCount = await client.query('SELECT COUNT(*) FROM ai_analysis_cache WHERE expires_at > CURRENT_TIMESTAMP');
      
      client.release();

      return {
        connected: true,
        pool: {
          total_connections: this.pool.totalCount,
          idle_connections: this.pool.idleCount,
          waiting_clients: this.pool.waitingCount
        },
        tables: {
          subnet_metrics: parseInt(subnetMetricsCount.rows[0].count),
          system_metrics: parseInt(systemMetricsCount.rows[0].count),
          active_cache_entries: parseInt(cacheCount.rows[0].count)
        }
      };
    } catch (error) {
      logger.error('PostgreSQL: Failed to get stats', { error: error.message });
      return {
        connected: false,
        error: error.message
      };
    }
  }

  // Graceful shutdown
  async close() {
    if (this.pool) {
      try {
        await this.pool.end();
        logger.info('PostgreSQL: Connection pool closed gracefully');
      } catch (error) {
        logger.error('PostgreSQL: Error closing connection pool', { error: error.message });
      }
    }
  }
}

// Create singleton instance
const database = new DatabaseService();

export default database; 