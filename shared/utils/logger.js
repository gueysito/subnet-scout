import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` | ${JSON.stringify(meta)}`;
    }
    
    return log;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'subnet-scout' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let log = `${timestamp} [${level}]: ${message}`;
          
          if (Object.keys(meta).length > 0) {
            log += ` | ${JSON.stringify(meta, null, 2)}`;
          }
          
          return log;
        })
      )
    }),

    // File transport - Combined logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
      tailable: true
    }),

    // File transport - Error logs only
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3,
      tailable: true
    }),

    // File transport - API logs for monitoring
    new winston.transports.File({
      filename: path.join(logsDir, 'api.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 7,
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  ]
});

// Custom logging methods for specific use cases
class Logger {
  constructor(winstonLogger) {
    this.winston = winstonLogger;
    this.requestCounter = 0;
    this.errorCounter = 0;
  }

  // Standard logging methods
  debug(message, meta = {}) {
    this.winston.debug(message, meta);
  }

  info(message, meta = {}) {
    this.winston.info(message, meta);
  }

  warn(message, meta = {}) {
    this.winston.warn(message, meta);
  }

  error(message, meta = {}) {
    this.errorCounter++;
    this.winston.error(message, meta);
  }

  // API-specific logging methods
  apiRequest(req, res, responseTime, statusCode) {
    this.requestCounter++;
    
    const logData = {
      type: 'api_request',
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent'),
      status_code: statusCode,
      response_time: `${responseTime}ms`,
      request_id: req.id || this.requestCounter,
      timestamp: new Date().toISOString()
    };

    // Log query parameters (sanitized)
    if (req.query && Object.keys(req.query).length > 0) {
      logData.query_params = req.query;
    }

    // Log request body size (not content for security)
    if (req.body) {
      logData.body_size = JSON.stringify(req.body).length;
    }

    // Log based on status code
    if (statusCode >= 500) {
      this.error('API Request Failed', logData);
    } else if (statusCode >= 400) {
      this.warn('API Request Warning', logData);
    } else {
      this.info('API Request Success', logData);
    }
  }

  // Cache operation logging
  cacheOperation(operation, key, hit = null, responseTime = null) {
    const logData = {
      type: 'cache_operation',
      operation: operation, // 'get', 'set', 'del', 'clear'
      key: key,
      timestamp: new Date().toISOString()
    };

    if (hit !== null) {
      logData.cache_hit = hit;
    }

    if (responseTime !== null) {
      logData.response_time = `${responseTime}ms`;
    }

    this.debug('Cache Operation', logData);
  }

  // AI operation logging
  aiOperation(operation, model, subnetId, responseTime, success = true, error = null) {
    const logData = {
      type: 'ai_operation',
      operation: operation, // 'score', 'forecast', 'risk_assessment', etc.
      model: model, // 'claude', 'deepseek', 'llama', etc.
      subnet_id: subnetId,
      response_time: `${responseTime}ms`,
      success: success,
      timestamp: new Date().toISOString()
    };

    if (error) {
      logData.error = error;
    }

    if (success) {
      this.info('AI Operation Success', logData);
    } else {
      this.error('AI Operation Failed', logData);
    }
  }

  // Distributed processing logging
  distributedOperation(operation, workerCount, subnetCount, totalTime, success = true) {
    const logData = {
      type: 'distributed_operation',
      operation: operation,
      worker_count: workerCount,
      subnet_count: subnetCount,
      total_time: `${totalTime}ms`,
      throughput: `${(subnetCount / (totalTime / 1000)).toFixed(2)} subnets/sec`,
      success: success,
      timestamp: new Date().toISOString()
    };

    if (success) {
      this.info('Distributed Operation Success', logData);
    } else {
      this.error('Distributed Operation Failed', logData);
    }
  }

  // Security event logging
  securityEvent(event, level, details = {}) {
    const logData = {
      type: 'security_event',
      event: event, // 'rate_limit_exceeded', 'invalid_api_key', 'suspicious_request', etc.
      level: level, // 'low', 'medium', 'high', 'critical'
      ...details,
      timestamp: new Date().toISOString()
    };

    if (level === 'critical' || level === 'high') {
      this.error(`Security Event: ${event}`, logData);
    } else if (level === 'medium') {
      this.warn(`Security Event: ${event}`, logData);
    } else {
      this.info(`Security Event: ${event}`, logData);
    }
  }

  // Performance monitoring
  performanceMetric(metric, value, unit = 'ms', context = {}) {
    const logData = {
      type: 'performance_metric',
      metric: metric,
      value: value,
      unit: unit,
      ...context,
      timestamp: new Date().toISOString()
    };

    this.info(`Performance: ${metric}`, logData);
  }

  // System health logging
  healthCheck(service, status, responseTime = null, details = {}) {
    const logData = {
      type: 'health_check',
      service: service,
      status: status, // 'up', 'down', 'degraded'
      ...details,
      timestamp: new Date().toISOString()
    };

    if (responseTime !== null) {
      logData.response_time = `${responseTime}ms`;
    }

    if (status === 'up') {
      this.debug(`Health Check: ${service}`, logData);
    } else if (status === 'degraded') {
      this.warn(`Health Check: ${service}`, logData);
    } else {
      this.error(`Health Check: ${service}`, logData);
    }
  }

  // Get logging statistics
  getStats() {
    return {
      total_requests: this.requestCounter,
      total_errors: this.errorCounter,
      error_rate: this.requestCounter > 0 ? ((this.errorCounter / this.requestCounter) * 100).toFixed(2) + '%' : '0%',
      uptime: process.uptime(),
      memory_usage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }

  // Create Morgan middleware for Express
  getMorganMiddleware() {
    const self = this;
    return (req, res, next) => {
      const start = Date.now();
      
      // Generate request ID
      req.id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Override res.end to capture response time and status
      const originalEnd = res.end;
      res.end = function(chunk, encoding) {
        const responseTime = Date.now() - start;
        
        // Log the API request using the correct instance
        self.apiRequest(req, res, responseTime, res.statusCode);
        
        // Call original end method
        originalEnd.call(res, chunk, encoding);
      };
      
      next();
    };
  }
}

// Create and export logger instance
const appLogger = new Logger(logger);

export default appLogger; 