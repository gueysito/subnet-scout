/**
 * 🔐 AUTHENTICATION MIDDLEWARE
 * Secure API endpoints with JWT token verification
 */

import ethosService from '../utils/ethosService.js';
import logger from '../utils/logger.js';

/**
 * Authentication middleware for protected API endpoints
 * Verifies JWT tokens using Privy authentication
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      logger.warn('Authentication failed: No token provided', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl
      });
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'MISSING_TOKEN'
      });
    }

    // Verify token with Privy
    const verification = await ethosService.verifyPrivyToken(token);
    
    if (!verification.valid) {
      logger.warn('Authentication failed: Invalid token', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
        error: verification.error
      });
      return res.status(403).json({ 
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    // Track token usage
    ethosService.trackTokenUsage(verification.userId);

    // Add user information to request
    req.user = {
      id: verification.userId,
      walletAddress: verification.walletAddress,
      claims: verification.claims
    };

    logger.debug('Authentication successful', {
      userId: verification.userId,
      endpoint: req.originalUrl
    });

    next();
  } catch (error) {
    logger.error('Authentication middleware error', {
      error: error.message,
      endpoint: req.originalUrl,
      ip: req.ip
    });
    
    return res.status(500).json({ 
      error: 'Authentication service error',
      code: 'AUTH_SERVICE_ERROR'
    });
  }
};

/**
 * Optional authentication middleware
 * Attempts to authenticate but doesn't block if no token provided
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }

    const verification = await ethosService.verifyPrivyToken(token);
    
    if (verification.valid) {
      ethosService.trackTokenUsage(verification.userId);
      req.user = {
        id: verification.userId,
        walletAddress: verification.walletAddress,
        claims: verification.claims
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    logger.error('Optional authentication error', {
      error: error.message,
      endpoint: req.originalUrl
    });
    
    // Don't block request on optional auth error
    req.user = null;
    next();
  }
};

/**
 * Role-based authorization middleware
 * Checks if user has required role
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const userRoles = req.user.claims?.roles || [];
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      logger.warn('Authorization failed: Insufficient permissions', {
        userId: req.user.id,
        requiredRoles: roles,
        userRoles: userRoles,
        endpoint: req.originalUrl
      });
      
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

/**
 * Admin-only middleware
 * Requires admin role for access
 */
export const requireAdmin = requireRole(['admin']);

/**
 * API key authentication middleware
 * For external API access
 */
export const authenticateApiKey = (req, res, next) => {
  const apiKey = req.get('X-API-Key');
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    logger.warn('API key authentication failed', {
      ip: req.ip,
      endpoint: req.originalUrl,
      hasKey: !!apiKey
    });
    
    return res.status(401).json({ 
      error: 'Valid API key required',
      code: 'INVALID_API_KEY'
    });
  }

  req.apiKeyAuth = true;
  next();
};

export default {
  authenticateToken,
  optionalAuth,
  requireRole,
  requireAdmin,
  authenticateApiKey
};