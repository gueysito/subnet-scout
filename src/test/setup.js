/**
 * Vitest Setup File
 * Configures testing environment and global test utilities
 */

import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Global test setup
beforeAll(() => {
  // Mock environment variables for testing
  Object.defineProperty(import.meta, 'env', {
    value: {
      VITE_USE_MOCK_API: 'true',
      VITE_BACKEND_URL: 'http://localhost:8080',
      NODE_ENV: 'test'
    },
    writable: true
  });

  // Mock console methods to reduce noise in tests
  global.console = {
    ...console,
    // Uncomment to silence logs during tests
    // log: vi.fn(),
    // warn: vi.fn(),
    // error: vi.fn(),
  };
});

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Global cleanup
afterAll(() => {
  // Any global cleanup needed
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock fetch for API calls
global.fetch = async (url, options) => {
  // Default mock response
  return {
    ok: true,
    status: 200,
    json: async () => ({
      success: true,
      data: { mock: true, url, options }
    }),
    text: async () => JSON.stringify({ success: true, mock: true })
  };
};

// Custom matchers
expect.extend({
  toBeAccessible(received) {
    // Basic accessibility checks
    const hasAriaLabel = received.hasAttribute('aria-label');
    const hasRole = received.hasAttribute('role');
    const hasAltText = received.tagName === 'IMG' ? received.hasAttribute('alt') : true;
    
    const pass = hasAriaLabel || hasRole || hasAltText;
    
    if (pass) {
      return {
        message: () => `Expected ${received.tagName} to not be accessible`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received.tagName} to be accessible (missing aria-label, role, or alt text)`,
        pass: false,
      };
    }
  },
});