import { metricsService } from '../services/metrics.service.js';

/**
 * Lightweight, process-local in-memory Cache utility with TTL and prefix invalidation.
 * Suitable for static taxonomy dictionaries, demand trend snapshots, and stable configurations.
 */
class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  /**
   * Sets a cache entry.
   * @param {string} key
   * @param {*} value
   * @param {number} [ttlSeconds=300] - Default 5 minutes
   */
  set(key, value, ttlSeconds = 300) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Retrieves a cache entry if not expired.
   * @param {string} key
   * @returns {*|null}
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      metricsService.recordCacheMiss();
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      metricsService.recordCacheMiss();
      return null;
    }

    metricsService.recordCacheHit();
    return entry.value;
  }

  /**
   * Deletes a specific cache key.
   * @param {string} key
   */
  del(key) {
    this.store.delete(key);
  }

  /**
   * Invalidates all keys matching a prefix.
   * @param {string} prefix
   */
  invalidatePrefix(prefix) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clears the entire cache store.
   */
  clear() {
    this.store.clear();
  }

  /**
   * Returns current cache storage count.
   */
  size() {
    return this.store.size;
  }
}

export const cache = new MemoryCache();
export default cache;
