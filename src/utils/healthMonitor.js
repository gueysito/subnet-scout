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
    const results = {};
    const startTime = Date.now();

    // Run all checks in parallel
    const checkPromises = Array.from(this.checks.keys()).map(async (name) => {
      try {
        const result = await this.runCheck(name);
        results[name] = result;
      } catch (error) {
        results[name] = {
          name,
          status: 'error',
          error: error.message,
          lastCheck: new Date().toISOString()
        };
      }
    });

    await Promise.all(checkPromises);

    const totalTime = Date.now() - startTime;

    // Calculate overall health
    const statuses = Object.values(results).map(r => r.status);
    const downCount = statuses.filter(s => s === 'down').length;
    const degradedCount = statuses.filter(s => s === 'degraded').length;
    
    let overallStatus;
    if (downCount > 0) {
      overallStatus = 'unhealthy';
    } else if (degradedCount > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    return {
      overall_status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
      total_check_time: `${totalTime}ms`,
      checks: results,
      metrics: this.getMetrics(),
      system_info: await this.getSystemInfo()
    };
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
}

// Create and export health monitor instance
const healthMonitor = new HealthMonitor();

// Initialize default checks
healthMonitor.initializeDefaultChecks();

export default healthMonitor; 