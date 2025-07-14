/**
 * 🔒 HTTPS CONFIGURATION
 * Production SSL/TLS setup and security
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import logger from '../utils/logger.js';

/**
 * HTTPS redirect middleware for production
 */
export const httpsRedirect = (req, res, next) => {
  // Skip redirect in development
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // Check if request is HTTPS
  const isHttps = req.secure || 
                 req.headers['x-forwarded-proto'] === 'https' ||
                 req.connection.encrypted;

  if (!isHttps) {
    const redirectUrl = `https://${req.headers.host}${req.url}`;
    logger.info('HTTP to HTTPS redirect', {
      originalUrl: req.url,
      redirectUrl,
      ip: req.ip
    });
    
    return res.redirect(301, redirectUrl);
  }

  next();
};

/**
 * Create HTTPS server with SSL certificates
 */
export const createHTTPSServer = (app) => {
  try {
    // Load SSL certificates
    const keyPath = process.env.SSL_KEY_PATH;
    const certPath = process.env.SSL_CERT_PATH;
    const caPath = process.env.SSL_CA_PATH; // Optional: Certificate Authority

    if (!keyPath || !certPath) {
      logger.warn('SSL certificates not configured, running HTTP only');
      return null;
    }

    // Verify certificate files exist
    if (!fs.existsSync(keyPath)) {
      throw new Error(`SSL key file not found: ${keyPath}`);
    }

    if (!fs.existsSync(certPath)) {
      throw new Error(`SSL certificate file not found: ${certPath}`);
    }

    // Load certificate files
    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
      // Add intermediate certificate if provided
      ...(caPath && fs.existsSync(caPath) && {
        ca: fs.readFileSync(caPath)
      })
    };

    // Create HTTPS server
    const httpsServer = https.createServer(httpsOptions, app);

    // Handle HTTPS server events
    httpsServer.on('error', (error) => {
      logger.error('HTTPS server error', { error: error.message });
    });

    httpsServer.on('listening', () => {
      const address = httpsServer.address();
      logger.info('HTTPS server started', {
        port: address.port,
        address: address.address
      });
    });

    return httpsServer;
  } catch (error) {
    logger.error('Failed to create HTTPS server', { error: error.message });
    return null;
  }
};

/**
 * Create HTTP server for development or HTTP redirect
 */
export const createHTTPServer = (app) => {
  const httpServer = http.createServer(app);

  httpServer.on('error', (error) => {
    logger.error('HTTP server error', { error: error.message });
  });

  httpServer.on('listening', () => {
    const address = httpServer.address();
    logger.info('HTTP server started', {
      port: address.port,
      address: address.address
    });
  });

  return httpServer;
};

/**
 * Start server with HTTPS in production, HTTP in development
 */
export const startServer = (app) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpPort = process.env.PORT || 8080;
  const httpsPort = process.env.HTTPS_PORT || 443;

  if (isProduction && process.env.FORCE_HTTPS === 'true') {
    // Production with HTTPS
    const httpsServer = createHTTPSServer(app);
    
    if (httpsServer) {
      // Start HTTPS server
      httpsServer.listen(httpsPort, () => {
        logger.info(`🔒 HTTPS server running on port ${httpsPort}`);
      });

      // Start HTTP server for redirects
      const httpApp = require('express')();
      httpApp.use(httpsRedirect);
      httpApp.use('*', (req, res) => {
        res.redirect(301, `https://${req.headers.host}${req.url}`);
      });

      const httpServer = createHTTPServer(httpApp);
      httpServer.listen(httpPort, () => {
        logger.info(`🔄 HTTP redirect server running on port ${httpPort}`);
      });

      return { httpsServer, httpServer };
    } else {
      logger.warn('HTTPS configuration failed, falling back to HTTP');
    }
  }

  // Development or fallback HTTP server
  const httpServer = createHTTPServer(app);
  httpServer.listen(httpPort, () => {
    logger.info(`🌐 HTTP server running on port ${httpPort}`);
  });

  return { httpServer };
};

/**
 * Graceful server shutdown
 */
export const gracefulShutdown = (servers) => {
  const shutdownPromises = [];

  Object.values(servers).forEach(server => {
    if (server) {
      const promise = new Promise((resolve) => {
        server.close(() => {
          logger.info('Server closed gracefully');
          resolve();
        });
      });
      shutdownPromises.push(promise);
    }
  });

  return Promise.all(shutdownPromises);
};

export default {
  httpsRedirect,
  createHTTPSServer,
  createHTTPServer,
  startServer,
  gracefulShutdown
};