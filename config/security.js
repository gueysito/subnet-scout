/**
 * 🔒 PRODUCTION SECURITY CONFIGURATION
 * Centralized security settings for production deployment
 */

import logger from '../shared/utils/logger.js';

/**
 * Security configuration based on environment
 */
export const securityConfig = {
  // Environment detection
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',
  isDevelopment: process.env.NODE_ENV === 'development',

  // HTTPS Configuration
  https: {
    enabled: process.env.FORCE_HTTPS === 'true',
    port: process.env.HTTPS_PORT || 443,
    keyPath: process.env.SSL_KEY_PATH,
    certPath: process.env.SSL_CERT_PATH,
    caPath: process.env.SSL_CA_PATH,
    redirectHTTP: process.env.HTTPS_REDIRECT !== 'false'
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || 'change-this-in-production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  },

  // CSRF Configuration
  csrf: {
    secret: process.env.CSRF_SECRET || 'change-this-csrf-secret',
    enabled: process.env.CSRF_ENABLED !== 'false'
  },

  // Rate Limiting
  rateLimit: {
    general: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60 * 1000, // 1 minute
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
      skipSuccessfulRequests: false
    },
    computeIntensive: {
      windowMs: parseInt(process.env.COMPUTE_RATE_LIMIT_WINDOW) || 5 * 60 * 1000, // 5 minutes
      max: parseInt(process.env.COMPUTE_RATE_LIMIT_MAX) || 20,
      skipSuccessfulRequests: false
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 failed attempts
      skipSuccessfulRequests: true
    }
  },

  // CORS Configuration
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-XSRF-Token'
    ]
  },

  // Security Headers (Helmet Configuration)
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Consider removing unsafe-inline in production
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "https://api.anthropic.com",
          "https://api.io.net",
          ...(process.env.ADDITIONAL_CSP_CONNECT_SRC?.split(',') || [])
        ],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin"
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  },

  // Authentication Configuration
  auth: {
    tokenExpiration: parseInt(process.env.TOKEN_EXPIRATION) || 24 * 60 * 60, // 24 hours
    refreshTokenExpiration: parseInt(process.env.REFRESH_TOKEN_EXPIRATION) || 7 * 24 * 60 * 60, // 7 days
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION) || 15 * 60 // 15 minutes
  },

  // API Security
  api: {
    bodyLimit: process.env.API_BODY_LIMIT || '1mb',
    validApiKeys: process.env.VALID_API_KEYS?.split(',') || [],
    requireApiKey: process.env.REQUIRE_API_KEY === 'true'
  },

  // Database Security
  database: {
    ssl: process.env.NODE_ENV === 'production',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 20,
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000,
    queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 30000
  },

  // Logging and Monitoring
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    securityEvents: process.env.LOG_SECURITY_EVENTS !== 'false',
    sensitiveDataMasking: process.env.NODE_ENV === 'production'
  },

  // File Upload Security (if applicable)
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES?.split(',') || [],
    virusScan: process.env.VIRUS_SCAN_ENABLED === 'true'
  }
};

/**
 * Validate security configuration
 */
export const validateSecurityConfig = () => {
  const errors = [];
  const warnings = [];

  // Check required production settings
  if (securityConfig.isProduction) {
    if (securityConfig.session.secret === 'change-this-in-production') {
      errors.push('SESSION_SECRET must be set in production');
    }

    if (securityConfig.csrf.secret === 'change-this-csrf-secret') {
      errors.push('CSRF_SECRET must be set in production');
    }

    if (!securityConfig.https.enabled) {
      warnings.push('HTTPS is not enabled in production');
    }

    if (!securityConfig.https.keyPath || !securityConfig.https.certPath) {
      warnings.push('SSL certificates not configured');
    }

    if (securityConfig.cors.origin.includes('http://localhost')) {
      warnings.push('Localhost origins should not be allowed in production');
    }
  }

  // Log validation results
  if (errors.length > 0) {
    logger.error('Security configuration errors', { errors });
    throw new Error(`Security configuration errors: ${errors.join(', ')}`);
  }

  if (warnings.length > 0) {
    logger.warn('Security configuration warnings', { warnings });
  }

  logger.info('Security configuration validated', {
    environment: process.env.NODE_ENV,
    httpsEnabled: securityConfig.https.enabled,
    csrfEnabled: securityConfig.csrf.enabled
  });
};

/**
 * Get environment-specific security overrides
 */
export const getEnvironmentSecurityConfig = () => {
  const baseConfig = { ...securityConfig };

  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        ...baseConfig,
        logging: {
          ...baseConfig.logging,
          level: 'warn', // Reduce log verbosity in production
          sensitiveDataMasking: true
        },
        headers: {
          ...baseConfig.headers,
          contentSecurityPolicy: {
            ...baseConfig.headers.contentSecurityPolicy,
            directives: {
              ...baseConfig.headers.contentSecurityPolicy.directives,
              styleSrc: ["'self'"], // Remove unsafe-inline in production
            }
          }
        }
      };

    case 'staging':
      return {
        ...baseConfig,
        logging: {
          ...baseConfig.logging,
          level: 'info'
        }
      };

    case 'development':
      return {
        ...baseConfig,
        logging: {
          ...baseConfig.logging,
          level: 'debug',
          sensitiveDataMasking: false
        },
        rateLimit: {
          ...baseConfig.rateLimit,
          general: {
            ...baseConfig.rateLimit.general,
            max: 1000 // Higher limits for development
          }
        }
      };

    default:
      return baseConfig;
  }
};

export default {
  securityConfig,
  validateSecurityConfig,
  getEnvironmentSecurityConfig
};