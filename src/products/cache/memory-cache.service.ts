import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry {
  data: any;
  timestamp: number;
}

@Injectable()
export class MemoryCacheService {
  private readonly logger = new Logger(MemoryCacheService.name);
  private cache = new Map<string, CacheEntry>();
  private readonly TTL = 60000; // 60 seconds cache TTL

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    const isExpired = Date.now() - entry.timestamp > this.TTL;
    
    if (isExpired) {
      this.logger.debug(`Cache expired for key: ${key}`);
      this.cache.delete(key);
      return null;
    }
    
    this.logger.debug(`Cache hit for key: ${key}`);
    return entry.data;
  }

  set(key: string, data: any): void {
    this.logger.debug(`Cache set for key: ${key}`);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.logger.debug('Cache cleared');
    this.cache.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}