/**
 * Comprehensive Input Validation and Security Utilities
 * Prevents injection attacks, validates data types, and sanitizes inputs
 */

/**
 * Sanitizes string input to prevent XSS and injection attacks
 * @param {string} input - The input string to sanitize
 * @param {number} maxLength - Maximum allowed length (default: 1000)
 * @returns {string} Sanitized string
 */
export function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>\"'&]/g, '') // Remove HTML/XML characters
    .replace(/[^\w\s\-_.@#]/g, '') // Allow only safe characters
    .substring(0, maxLength)
    .trim();
}

/**
 * Validates and sanitizes subnet ID
 * @param {any} subnetId - The subnet ID to validate
 * @returns {{isValid: boolean, value: number|null, error: string|null}}
 */
export function validateSubnetId(subnetId) {
  const parsed = parseInt(subnetId);
  
  if (isNaN(parsed)) {
    return {
      isValid: false,
      value: null,
      error: 'Subnet ID must be a valid number'
    };
  }
  
  if (parsed < 1 || parsed > 118) {
    return {
      isValid: false,
      value: null,
      error: 'Subnet ID must be between 1 and 118'
    };
  }
  
  return {
    isValid: true,
    value: parsed,
    error: null
  };
}

/**
 * Detects potential prompt injection attempts
 * @param {string} input - Input to check for prompt injection
 * @returns {boolean} True if suspicious patterns detected
 */
export function detectPromptInjection(input) {
  if (typeof input !== 'string') {
    return false;
  }
  
  const suspiciousPatterns = [
    /ignore.*previous.*instructions/i,
    /system.*prompt/i,
    /you.*are.*now/i,
    /forget.*everything/i,
    /new.*instructions/i,
    /assistant.*you.*must/i,
    /override.*previous/i,
    /disregard.*above/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
}

/**
 * Validates API request body for common endpoints
 * @param {object} body - Request body to validate
 * @param {string} endpoint - Endpoint type for specific validation
 * @returns {{isValid: boolean, errors: string[], sanitized: object}}
 */
export function validateRequestBody(body, endpoint) {
  const errors = [];
  const sanitized = {};
  
  if (!body || typeof body !== 'object') {
    return {
      isValid: false,
      errors: ['Request body must be a valid object'],
      sanitized: {}
    };
  }
  
  switch (endpoint) {
    case 'score':
      return validateScoreRequest(body);
    case 'forecast':
      return validateForecastRequest(body);
    case 'claude':
      return validateClaudeRequest(body);
    default:
      return validateGenericRequest(body);
  }
}

/**
 * Validates scoring endpoint request
 * @param {object} body - Request body
 * @returns {{isValid: boolean, errors: string[], sanitized: object}}
 */
function validateScoreRequest(body) {
  const errors = [];
  const sanitized = {};
  
  // Validate subnet_id
  const subnetValidation = validateSubnetId(body.subnet_id);
  if (!subnetValidation.isValid) {
    errors.push(subnetValidation.error);
  } else {
    sanitized.subnet_id = subnetValidation.value;
  }
  
  // Validate metrics
  if (!body.metrics || typeof body.metrics !== 'object') {
    errors.push('Metrics must be a valid object');
  } else {
    sanitized.metrics = validateMetrics(body.metrics);
  }
  
  // Validate timeframe
  const validTimeframes = ['1h', '24h', '7d', '30d'];
  const timeframe = body.timeframe || '24h';
  if (!validTimeframes.includes(timeframe)) {
    errors.push('Timeframe must be one of: ' + validTimeframes.join(', '));
  } else {
    sanitized.timeframe = timeframe;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Validates forecast request
 * @param {object} body - Request body
 * @returns {{isValid: boolean, errors: string[], sanitized: object}}
 */
function validateForecastRequest(body) {
  const errors = [];
  const sanitized = {};
  
  // Validate subnet_id
  const subnetValidation = validateSubnetId(body.subnet_id);
  if (!subnetValidation.isValid) {
    errors.push(subnetValidation.error);
  } else {
    sanitized.subnet_id = subnetValidation.value;
  }
  
  // Validate current_metrics (optional)
  if (body.current_metrics) {
    if (typeof body.current_metrics !== 'object') {
      errors.push('Current metrics must be a valid object');
    } else {
      sanitized.current_metrics = validateMetrics(body.current_metrics);
    }
  }
  
  // Validate include_market_context (optional boolean)
  if (body.include_market_context !== undefined) {
    sanitized.include_market_context = Boolean(body.include_market_context);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Validates Claude AI request
 * @param {object} body - Request body
 * @returns {{isValid: boolean, errors: string[], sanitized: object}}
 */
function validateClaudeRequest(body) {
  const errors = [];
  const sanitized = {};
  
  if (!body.input || typeof body.input !== 'string') {
    errors.push('Input must be a non-empty string');
  } else {
    const input = body.input.trim();
    
    if (input.length === 0) {
      errors.push('Input cannot be empty');
    } else if (input.length > 4000) {
      errors.push('Input too long (max 4000 characters)');
    } else if (detectPromptInjection(input)) {
      errors.push('Input contains potentially harmful content');
    } else {
      sanitized.input = sanitizeString(input, 4000);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Validates generic request body
 * @param {object} body - Request body
 * @returns {{isValid: boolean, errors: string[], sanitized: object}}
 */
function validateGenericRequest(body) {
  const errors = [];
  const sanitized = {};
  
  // Basic validation - ensure no suspicious patterns in string values
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      if (detectPromptInjection(value)) {
        errors.push(`Suspicious content detected in field: ${key}`);
      } else {
        sanitized[key] = sanitizeString(value);
      }
    } else if (typeof value === 'number') {
      if (!isFinite(value)) {
        errors.push(`Invalid number in field: ${key}`);
      } else {
        sanitized[key] = value;
      }
    } else if (typeof value === 'boolean') {
      sanitized[key] = Boolean(value);
    } else if (value === null || value === undefined) {
      sanitized[key] = null;
    } else {
      // For objects and arrays, basic validation
      sanitized[key] = value;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Validates metrics object
 * @param {object} metrics - Metrics to validate
 * @returns {object} Sanitized metrics
 */
function validateMetrics(metrics) {
  const sanitized = {};
  
  // Define expected numeric fields with their ranges
  const numericFields = {
    overall_score: { min: 0, max: 100 },
    current_yield: { min: 0, max: 200 },
    credibility_score: { min: 0, max: 100 },
    activity_score: { min: 0, max: 100 },
    emission_rate: { min: 0, max: 100 },
    total_stake: { min: 0, max: Number.MAX_SAFE_INTEGER },
    validator_count: { min: 0, max: 10000 },
    yield_change_24h: { min: -100, max: 100 }
  };
  
  // Define expected string fields
  const stringFields = ['activity_level', 'status', 'name', 'description'];
  
  for (const [key, value] of Object.entries(metrics)) {
    if (numericFields[key]) {
      const range = numericFields[key];
      const num = parseFloat(value);
      if (!isNaN(num) && isFinite(num) && num >= range.min && num <= range.max) {
        sanitized[key] = num;
      }
    } else if (stringFields.includes(key)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value, 200);
      }
    }
  }
  
  return sanitized;
}

/**
 * Rate limiting helper
 * @param {string} key - Rate limit key
 * @param {number} limit - Request limit
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} True if request is allowed
 */
const rateLimitStore = new Map();

export function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const requests = rateLimitStore.get(key);
  
  // Remove old requests outside the window
  while (requests.length > 0 && requests[0] < windowStart) {
    requests.shift();
  }
  
  // Check if limit exceeded
  if (requests.length >= limit) {
    return false;
  }
  
  // Add current request
  requests.push(now);
  return true;
}

/**
 * Middleware factory for input validation
 * @param {string} endpoint - Endpoint type
 * @returns {Function} Express middleware
 */
export function createValidationMiddleware(endpoint) {
  return (req, res, next) => {
    const validation = validateRequestBody(req.body, endpoint);
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: validation.errors,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Replace request body with sanitized version
    req.body = validation.sanitized;
    next();
  };
}

/**
 * Security headers middleware
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {Function} next - Next middleware
 */
export function securityHeadersMiddleware(req, res, next) {
  // Additional security headers beyond Helmet
  res.setHeader('X-Request-ID', `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  
  next();
}

export default {
  sanitizeString,
  validateSubnetId,
  detectPromptInjection,
  validateRequestBody,
  checkRateLimit,
  createValidationMiddleware,
  securityHeadersMiddleware
};