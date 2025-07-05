import cacheService from './cacheService.js';
import logger from './logger.js';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

class HealthMonitor {
  constructor() {
    this.checks = new Map();
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        rate_limited: 0
      },
      security: {
        blocked_requests: 0,
        suspicious_activities: 0,
        failed_authentications: 0
      },
      performance: {
        avg_response_time: 0,
        p95_response_time: 0,
        error_rate: 0
      },
      resources: {
        memory_usage: 0,
        cpu_usage: 0,
        disk_usage: 0
      }
    };
    this.startTime = Date.now();
    this.responseTimes = [];
    this.maxResponseTimes = 1000; // Keep last 1000 response times for percentile calculations
  }

  // Register a health check
  registerCheck(name, checkFunction, timeout = 5000) {
    this.checks.set(name, {
      name,
      checkFunction,
      timeout,
      lastCheck: null,
      status: 'unknown',
      error: null,
      responseTime: null
    });
  }

  // Run a single health check
  async runCheck(name) {
    const check = this.checks.get(name);
    if (!check) {
      throw new Error(`Health check '${name}' not found`);
    }

    const startTime = Date.now();
    
    try {
      // Run check with timeout
      const result = await Promise.race([
        check.checkFunction(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), check.timeout)
        )
      ]);

      const responseTime = Date.now() - startTime;
      
      // Update check status
      check.lastCheck = new Date().toISOString();
      check.status = result.status || 'up';
      check.error = null;
      check.responseTime = responseTime;
      check.details = result;

      // Log the health check
      logger.healthCheck(name, check.status, responseTime, result);

      return check;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Update check status
      check.lastCheck = new Date().toISOString();
      check.status = 'down';
      check.error = error.message;
      check.responseTime = responseTime;
      check.details = null;

      // Log the failed health check
      logger.healthCheck(name, 'down', responseTime, { error: error.message });

      return check;
    }
  }

  // Run all health checks
  async runAllChecks() {
    try {
      const results = {};
      const startTime = Date.now();

      // Run all registered checks plus Kaito check
      const checkPromises = Array.from(this.checks.keys()).map(async (name) => {
        try {
          const result = await this.runCheck(name);
          results[name] = result;
        } catch (error) {
          results[name] = {
            name,
            status: 'error',
            error: error.message,
            last_check: new Date().toISOString()
          };
        }
      });

      // Add Kaito check
      checkPromises.push((async () => {
        try {
          const result = await this.checkKaitoYaps();
          results['kaito_yaps'] = result;
        } catch (error) {
          results['kaito_yaps'] = {
            name: 'kaito_yaps',
            status: 'error',
            error: error.message,
            last_check: new Date().toISOString()
          };
        }
      })());

      // Add Ethos check
      checkPromises.push((async () => {
        try {
          const result = await this.checkEthosNetwork();
          results['ethos_network'] = result;
        } catch (error) {
          results['ethos_network'] = {
            name: 'ethos_network',
            status: 'error',
            error: error.message,
            last_check: new Date().toISOString()
          };
        }
      })());

      await Promise.allSettled(checkPromises);

      const totalTime = Date.now() - startTime;
      const services = Object.values(results);

      // Calculate overall status
      const upServices = services.filter(s => s.status === 'up').length;
      const degradedServices = services.filter(s => s.status === 'degraded').length;
      const downServices = services.filter(s => s.status === 'down' || s.status === 'error').length;

      let overallStatus = 'healthy';
      if (downServices > 0) {
        overallStatus = 'unhealthy';
      } else if (degradedServices > 0) {
        overallStatus = 'degraded';
      }

      return {
        overall_status: overallStatus,
        services_up: upServices,
        services_degraded: degradedServices,
        services_down: downServices,
        total_services: services.length,
        services: services,
        total_check_time: `${totalTime}ms`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Health check system error', { error: error.message });
      return {
        overall_status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Record request metrics
  recordRequest(success = true, responseTime = 0, rateLimited = false) {
    this.metrics.requests.total++;
    
    if (success) {
      this.metrics.requests.successful++;
    } else {
      this.metrics.requests.failed++;
    }
    
    if (rateLimited) {
      this.metrics.requests.rate_limited++;
    }

    // Track response times for percentile calculation
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > this.maxResponseTimes) {
      this.responseTimes.shift();
    }

    // Update performance metrics
    this.updatePerformanceMetrics();
  }

  // Record security events
  recordSecurityEvent(type, details = {}) {
    switch (type) {
      case 'blocked_request':
        this.metrics.security.blocked_requests++;
        break;
      case 'suspicious_activity':
        this.metrics.security.suspicious_activities++;
        break;
      case 'failed_authentication':
        this.metrics.security.failed_authentications++;
        break;
    }

    logger.securityEvent(type, 'medium', details);
  }

  // Update performance metrics
  updatePerformanceMetrics() {
    if (this.responseTimes.length === 0) return;

    // Calculate average response time
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    this.metrics.performance.avg_response_time = Math.round(sum / this.responseTimes.length);

    // Calculate 95th percentile
    const sorted = [...this.responseTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    this.metrics.performance.p95_response_time = sorted[p95Index] || 0;

    // Calculate error rate
    const total = this.metrics.requests.total;
    if (total > 0) {
      this.metrics.performance.error_rate = 
        ((this.metrics.requests.failed / total) * 100).toFixed(2) + '%';
    }
  }

  // Get system information
  async getSystemInfo() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Update resource metrics
    this.metrics.resources.memory_usage = Math.round(memUsage.heapUsed / 1024 / 1024); // MB
    this.metrics.resources.cpu_usage = Math.round((cpuUsage.user + cpuUsage.system) / 1000); // ms

    try {
      // Get disk usage (if available)
      const stats = await fs.stat(process.cwd());
      this.metrics.resources.disk_usage = 'available'; // Basic check
    } catch (error) {
      this.metrics.resources.disk_usage = 'unavailable';
    }

    return {
      node_version: process.version,
      platform: process.platform,
      architecture: process.arch,
      memory: {
        heap_used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heap_total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`
      },
      cpu: {
        user: `${Math.round(cpuUsage.user / 1000)}ms`,
        system: `${Math.round(cpuUsage.system / 1000)}ms`
      },
      uptime: this.getUptime(),
      load_average: this.getLoadAverage()
    };
  }

  // Get uptime in human readable format
  getUptime() {
    const uptimeMs = Date.now() - this.startTime;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  // Get load average (simplified for Node.js)
  getLoadAverage() {
    try {
      // This is a simplified load average calculation
      const used = process.memoryUsage().heapUsed;
      const total = process.memoryUsage().heapTotal;
      const loadPercentage = ((used / total) * 100).toFixed(2);
      return `${loadPercentage}%`;
    } catch (error) {
      return 'unavailable';
    }
  }

  // Get current metrics
  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      uptime: this.getUptime()
    };
  }

  // Initialize default health checks
  initializeDefaultChecks() {
    // Cache service health check
    this.registerCheck('cache', async () => {
      return await cacheService.healthCheck();
    });

    // Database connectivity check (if PostgreSQL is configured)
    this.registerCheck('database', async () => {
      if (!process.env.DATABASE_URL) {
        return {
          status: 'disabled',
          message: 'Database not configured'
        };
      }
      
      // This would be implemented if PostgreSQL is added
      return {
        status: 'up',
        message: 'Database connectivity check not implemented'
      };
    });

    // External API health checks
    this.registerCheck('anthropic_api', async () => {
      if (!process.env.ANTHROPIC_API_KEY) {
        return {
          status: 'disabled',
          message: 'Anthropic API key not configured'
        };
      }

      // Simple connectivity test (could be enhanced)
      return {
        status: 'up',
        message: 'API key configured'
      };
    });

    this.registerCheck('ionet_api', async () => {
      if (!process.env.IONET_API_KEY) {
        return {
          status: 'disabled',
          message: 'IO.net API key not configured'
        };
      }

      return {
        status: 'up',
        message: 'API key configured'
      };
    });

    this.registerCheck('github_api', async () => {
      if (!process.env.GITHUB_TOKEN) {
        return {
          status: 'disabled',
          message: 'GitHub token not configured'
        };
      }

      return {
        status: 'up',
        message: 'GitHub token configured'
      };
    });

    // File system health check
    this.registerCheck('filesystem', async () => {
      try {
        const logsDir = path.join(process.cwd(), 'logs');
        await fs.access(logsDir, fs.constants.W_OK);
        
        return {
          status: 'up',
          message: 'File system writable'
        };
      } catch (error) {
        return {
          status: 'down',
          message: 'File system not writable',
          error: error.message
        };
      }
    });

    // Memory usage check
    this.registerCheck('memory', async () => {
      const memUsage = process.memoryUsage();
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
      const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
      const usagePercentage = (heapUsedMB / heapTotalMB) * 100;

      let status = 'up';
      if (usagePercentage > 90) {
        status = 'critical';
      } else if (usagePercentage > 75) {
        status = 'degraded';
      }

      return {
        status,
        heap_used: `${Math.round(heapUsedMB)}MB`,
        heap_total: `${Math.round(heapTotalMB)}MB`,
        usage_percentage: `${usagePercentage.toFixed(2)}%`
      };
    });

    logger.info('Health monitoring initialized with default checks');
  }

  // Generate health summary for monitoring dashboards
  generateSummary() {
    const summary = {
      status: 'unknown',
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
      services: {},
      alerts: [],
      performance: this.metrics.performance,
      security: this.metrics.security
    };

    // Summarize service statuses
    for (const [name, check] of this.checks) {
      summary.services[name] = {
        status: check.status,
        last_check: check.lastCheck,
        response_time: check.responseTime
      };
    }

    // Generate alerts based on metrics
    if (this.metrics.performance.error_rate && parseFloat(this.metrics.performance.error_rate) > 5) {
      summary.alerts.push({
        level: 'warning',
        message: `High error rate: ${this.metrics.performance.error_rate}`
      });
    }

    if (this.metrics.security.blocked_requests > 100) {
      summary.alerts.push({
        level: 'warning',
        message: `High number of blocked requests: ${this.metrics.security.blocked_requests}`
      });
    }

    // Determine overall status
    const serviceStatuses = Object.values(summary.services).map(s => s.status);
    const downServices = serviceStatuses.filter(s => s === 'down').length;
    const degradedServices = serviceStatuses.filter(s => s === 'degraded').length;

    if (downServices > 0) {
      summary.status = 'unhealthy';
    } else if (degradedServices > 0 || summary.alerts.length > 0) {
      summary.status = 'degraded';
    } else {
      summary.status = 'healthy';
    }

    return summary;
  }

  // Add Ethos Network service health check
  async checkEthosNetwork() {
    const start = Date.now();
    try {
      // Import dynamically to avoid circular dependencies
      const { default: ethosService } = await import('./ethosService.js');
      
      const healthStatus = ethosService.getHealthStatus();
      const usageStats = ethosService.getUsageStats();
      
      const responseTime = Date.now() - start;
      
      // Determine status based on token usage and service health
      let status = 'up';
      let details = {
        token_usage: usageStats.token_usage.totalUsers,
        token_limit: usageStats.limit,
        token_remaining: usageStats.remaining,
        privy_configured: healthStatus.privy_configured,
        cache_enabled: healthStatus.cache_enabled
      };
      
      // Mark as degraded if approaching token limit
      if (usageStats.remaining < 10) {
        status = 'degraded';
        details.warning = 'Approaching token usage limit';
      }
      
      // Mark as down if token limit exceeded
      if (usageStats.remaining <= 0) {
        status = 'down';
        details.error = 'Token usage limit exceeded';
      }
      
      // Mark as disabled if Privy not configured
      if (!healthStatus.privy_configured) {
        status = 'disabled';
        details.error = 'Privy authentication not configured';
      }
      
      logger.healthCheck('ethos_network', status, responseTime, details);
      
      return {
        name: 'ethos_network',
        status: status,
        response_time: `${responseTime}ms`,
        details: details,
        last_check: new Date().toISOString()
      };
      
    } catch (error) {
      const responseTime = Date.now() - start;
      logger.healthCheck('ethos_network', 'down', responseTime, { error: error.message });
      
      return {
        name: 'ethos_network',
        status: 'down',
        error: error.message,
        response_time: `${responseTime}ms`,
        last_check: new Date().toISOString()
      };
    }
  }

  // Add Kaito Yaps service health check
  async checkKaitoYaps() {
    const start = Date.now();
    try {
      // Import dynamically to avoid circular dependencies
      const { default: kaitoYapsService } = await import('./kaitoYapsService.js');
      
      const healthStatus = kaitoYapsService.getHealthStatus();
      const rateLimitStatus = kaitoYapsService.getRateLimitStatus();
      
      const responseTime = Date.now() - start;
      
      // Determine status based on rate limit and service health
      let status = 'up';
      let details = {
        rate_limit_calls: rateLimitStatus.calls,
        rate_limit_remaining: rateLimitStatus.remaining,
        rate_limit_reset_in: rateLimitStatus.resetIn,
        cache_status: healthStatus.cache_status
      };
      
      // Mark as degraded if approaching rate limit
      if (rateLimitStatus.remaining < 10) {
        status = 'degraded';
        details.warning = 'Approaching rate limit';
      }
      
      // Mark as down if rate limit exceeded
      if (!rateLimitStatus.canMakeRequest) {
        status = 'down';
        details.error = 'Rate limit exceeded';
      }
      
      logger.healthCheck('kaito_yaps', status, responseTime, details);
      
      return {
        name: 'kaito_yaps',
        status: status,
        response_time: `${responseTime}ms`,
        details: details,
        last_check: new Date().toISOString()
      };
      
    } catch (error) {
      const responseTime = Date.now() - start;
      logger.healthCheck('kaito_yaps', 'down', responseTime, { error: error.message });
      
      return {
        name: 'kaito_yaps',
        status: 'down',
        error: error.message,
        response_time: `${responseTime}ms`,
        last_check: new Date().toISOString()
      };
    }
  }
}

// Create and export health monitor instance
const healthMonitor = new HealthMonitor();

// Initialize default checks
healthMonitor.initializeDefaultChecks();

export default healthMonitor; 