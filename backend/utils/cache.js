/**
 * Simple in-memory cache with TTL
 */
class Cache {
  constructor(ttlMinutes = 360) {
    this.cache = new Map();
    this.ttlMs = ttlMinutes * 60 * 1000;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
    this.cleanup(); // Clean expired entries periodically
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    this.cleanup();
    return this.cache.size;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  getAll() {
    this.cleanup();
    const result = {};
    for (const [key, entry] of this.cache.entries()) {
      result[key] = entry.value;
    }
    return result;
  }
}

module.exports = Cache;

