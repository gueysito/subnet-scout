/**
 * 🛡️ CSRF PROTECTION MIDDLEWARE
 * Protect against Cross-Site Request Forgery attacks
 */

import csrf from 'csrf';
import logger from '../utils/logger.js';

class CSRFService {
  constructor() {
    this.tokens = csrf();
    this.secret = process.env.CSRF_SECRET || 'your-default-secret-change-in-production';
  }

  /**
   * Generate CSRF token
   */
  generateToken(req) {
    if (!req.session.csrfSecret) {
      req.session.csrfSecret = this.tokens.secretSync();
    }
    return this.tokens.create(req.session.csrfSecret);
  }

  /**
   * Verify CSRF token
   */
  verifyToken(req, token) {
    if (!req.session.csrfSecret) {
      return false;
    }
    return this.tokens.verify(req.session.csrfSecret, token);
  }
}

const csrfService = new CSRFService();

/**
 * CSRF protection middleware
 */
export const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for API endpoints with API key authentication
  if (req.apiKeyAuth) {
    return next();
  }

  // Skip CSRF for health checks and ping
  if (req.path === '/health' || req.path === '/ping') {
    return next();
  }

  try {
    // Get token from header or body
    const token = req.headers['x-csrf-token'] || 
                 req.headers['x-xsrf-token'] || 
                 req.body._csrf;

    if (!token) {
      logger.warn('CSRF protection: No token provided', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
        method: req.method
      });
      
      return res.status(403).json({
        error: 'CSRF token missing',
        code: 'CSRF_TOKEN_MISSING'
      });
    }

    // Verify token
    const isValid = csrfService.verifyToken(req, token);
    
    if (!isValid) {
      logger.warn('CSRF protection: Invalid token', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
        method: req.method
      });
      
      return res.status(403).json({
        error: 'Invalid CSRF token',
        code: 'CSRF_TOKEN_INVALID'
      });
    }

    next();
  } catch (error) {
    logger.error('CSRF protection error', {
      error: error.message,
      endpoint: req.originalUrl,
      ip: req.ip
    });
    
    return res.status(500).json({
      error: 'CSRF protection service error',
      code: 'CSRF_SERVICE_ERROR'
    });
  }
};

/**
 * Endpoint to get CSRF token
 */
export const getCSRFToken = (req, res) => {
  try {
    const token = csrfService.generateToken(req);
    res.json({
      csrfToken: token,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to generate CSRF token', {
      error: error.message,
      ip: req.ip
    });
    
    res.status(500).json({
      error: 'Failed to generate CSRF token',
      code: 'CSRF_TOKEN_GENERATION_ERROR'
    });
  }
};

export default {
  csrfProtection,
  getCSRFToken,
  csrfService
};