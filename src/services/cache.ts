import Redis from 'ioredis';
import { config } from '../config';

const CACHE_TTL = 30 * 24 * 60 * 60;

class CacheService {
  private client: Redis | null = null;
  private enabled = true;

  constructor() {
    try {
      this.client = new Redis(config.redis.url, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
        retryStrategy: (times) => {
          if (times > 2) return null;
          return Math.min(times * 200, 1000);
        },
      });

      this.client.on('error', (err) => {
        if (this.enabled) {
          console.warn('Redis unavailable - caching disabled:', err.message);
          this.enabled = false;
        }
      });

      this.client.connect().catch(() => {
        this.enabled = false;
      });
    } catch {
      this.enabled = false;
    }
  }

  isEnabled(): boolean {
    return this.enabled && this.client !== null;
  }

  getClient(): Redis | null {
    return this.client;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled()) return null;
    try {
      const data = await this.client!.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttl = CACHE_TTL): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      await this.client!.setex(key, ttl, JSON.stringify(value));
    } catch {
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      await this.client!.del(key);
    } catch {
    }
  }

  async flush(): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      await this.client!.flushall();
    } catch {
    }
  }
}

export const cacheService = new CacheService();
