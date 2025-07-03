/**
 * Performance Optimization Utilities
 * React optimization patterns and performance helpers
 */

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';

/**
 * Debounced value hook - prevents excessive re-renders
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttled callback hook - limits function execution frequency
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Throttle delay in milliseconds
 * @returns {Function} Throttled function
 */
export function useThrottle(callback, delay) {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
}

/**
 * Memoized API call hook with caching
 * @param {Function} apiCall - API function to call
 * @param {any[]} dependencies - Dependencies for memoization
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Object} { data, loading, error, refetch }
 */
export function useMemoizedApi(apiCall, dependencies = [], ttl = 300000) { // 5 min default TTL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());
  const lastFetchRef = useRef(0);

  const cacheKey = useMemo(() => 
    JSON.stringify(dependencies), 
    dependencies
  );

  const fetchData = useCallback(async () => {
    const now = Date.now();
    const cached = cacheRef.current.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && (now - cached.timestamp) < ttl) {
      setData(cached.data);
      setError(null);
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      
      // Cache the result
      cacheRef.current.set(cacheKey, {
        data: result,
        timestamp: now
      });

      setData(result);
      lastFetchRef.current = now;
      return result;
    } catch (err) {
      setError(err);
      console.error('API call failed:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, cacheKey, ttl]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    // Clear cache entry and refetch
    cacheRef.current.delete(cacheKey);
    return fetchData();
  }, [cacheKey, fetchData]);

  return { data, loading, error, refetch };
}

/**
 * Intersection Observer hook for lazy loading
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isIntersecting]
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, isIntersecting];
}

/**
 * Performance monitoring hook
 * @param {string} componentName - Name of component to monitor
 * @returns {Object} Performance metrics
 */
export function usePerformanceMonitor(componentName) {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    averageRenderTime: 0,
    totalTime: 0
  });

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - mountTime.current;
    
    setMetrics(prev => ({
      renderCount: renderCount.current,
      totalTime: renderTime,
      averageRenderTime: renderTime / renderCount.current
    }));

    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 ${componentName} Performance:`, {
        renders: renderCount.current,
        totalTime: renderTime,
        avgRenderTime: renderTime / renderCount.current
      });
    }
  });

  return metrics;
}

/**
 * Optimized component comparison for React.memo
 * @param {Object} prevProps - Previous props
 * @param {Object} nextProps - Next props
 * @returns {boolean} True if props are equal (skip re-render)
 */
export function arePropsEqual(prevProps, nextProps) {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (let key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      // Special handling for functions
      if (typeof prevProps[key] === 'function' && typeof nextProps[key] === 'function') {
        if (prevProps[key].toString() !== nextProps[key].toString()) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  return true;
}

/**
 * Virtual scrolling hook for large lists
 * @param {Array} items - Array of items to virtualize
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of container
 * @returns {Object} Virtual scrolling state and handlers
 */
export function useVirtualScrolling(items, itemHeight, containerHeight) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  const visibleItems = useMemo(() => 
    items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    })),
    [items, startIndex, endIndex, itemHeight]
  );

  const handleScroll = useCallback((event) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    containerRef: setContainerRef,
    visibleItems,
    totalHeight,
    scrollTop,
    onScroll: handleScroll,
    startIndex,
    endIndex
  };
}

/**
 * Request deduplication hook
 * @param {Function} requestFn - Function that returns a Promise
 * @param {string} key - Unique key for the request
 * @returns {Function} Deduplicated request function
 */
export function useRequestDeduplication() {
  const pendingRequests = useRef(new Map());

  return useCallback((requestFn, key) => {
    if (pendingRequests.current.has(key)) {
      return pendingRequests.current.get(key);
    }

    const promise = requestFn()
      .finally(() => {
        pendingRequests.current.delete(key);
      });

    pendingRequests.current.set(key, promise);
    return promise;
  }, []);
}

/**
 * Batch state updates hook
 * @param {Object} initialState - Initial state
 * @returns {Array} [state, batchUpdate, commitUpdates]
 */
export function useBatchedUpdates(initialState) {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef({});
  const timeoutRef = useRef(null);

  const batchUpdate = useCallback((updates) => {
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Batch updates and apply after a short delay
    timeoutRef.current = setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        ...pendingUpdates.current
      }));
      pendingUpdates.current = {};
    }, 16); // Next frame
  }, []);

  const commitUpdates = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (Object.keys(pendingUpdates.current).length > 0) {
      setState(prevState => ({
        ...prevState,
        ...pendingUpdates.current
      }));
      pendingUpdates.current = {};
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, batchUpdate, commitUpdates];
}

/**
 * Memory usage monitoring hook
 * @param {string} componentName - Component name for logging
 * @returns {Object} Memory usage stats
 */
export function useMemoryMonitor(componentName) {
  const [memoryStats, setMemoryStats] = useState({
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  });

  useEffect(() => {
    const updateMemoryStats = () => {
      if (performance.memory) {
        const stats = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
        
        setMemoryStats(stats);

        // Warn about high memory usage
        const usagePercent = (stats.usedJSHeapSize / stats.jsHeapSizeLimit) * 100;
        if (usagePercent > 80) {
          console.warn(`⚠️ High memory usage in ${componentName}: ${usagePercent.toFixed(1)}%`);
        }
      }
    };

    updateMemoryStats();
    const interval = setInterval(updateMemoryStats, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [componentName]);

  return memoryStats;
}

export default {
  useDebounce,
  useThrottle,
  useMemoizedApi,
  useIntersectionObserver,
  usePerformanceMonitor,
  arePropsEqual,
  useVirtualScrolling,
  useRequestDeduplication,
  useBatchedUpdates,
  useMemoryMonitor
};