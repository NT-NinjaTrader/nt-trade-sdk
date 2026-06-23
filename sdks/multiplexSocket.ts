import type { Endpoint, RequestForUrl, ResponseForUrl } from '../api/endpoints';
import { NetworkError } from '../api/errors';
import type { EventType } from '../api/types';
import { entityNames } from '../data/constants';
import type {
  EntityName,
  Maybe,
  MessageEventHandler,
  PluralEntityName,
  SocketConfig,
  TdvCache,
  TDVSocketUrl
} from '../types/common';
import type { LoggerType, TypedCacheEntry } from '../types/runtime';
import { CacheManager } from './cacheManager';
import { Socket } from './socket';

export class MultiplexSocket {
  url: TDVSocketUrl;
  sockets: Array<Socket>;
  lastUtilizedSocket: number = 0;
  logger: Maybe<LoggerType>;
  private config: SocketConfig;
  private cacheManager: CacheManager;

  /**
   * Getter for ready state - returns true if at least one socket is ready
   * This provides compatibility with the existing health check logic
   */
  get ready(): boolean {
    try {
      return this.sockets.length > 0 && this.sockets.some(socket => socket.ready);
    } catch {
      return false;
    }
  }

  constructor(config: SocketConfig) {
    this.url = config.url;
    this.logger = config.logger;
    this.config = config;

    // Use shared cache manager if provided, otherwise create a new one
    if (config.sharedCacheManager) {
      this.cacheManager = config.sharedCacheManager;
    } else {
      this.cacheManager = new CacheManager(undefined, config.logger);
    }

    if (!config.shardingExpression) {
      throw new NetworkError('ShardingExpression is required for the MultiplexSocket type.', {});
    }
    if (config.shardingExpression.divisor === 0) {
      throw new NetworkError('ShardingExpression.divisor cannot be zero.', {
        context: {
          shardingExpression: config.shardingExpression,
          reason: 'divisor_zero'
        }
      });
    }
    this.sockets = [];
    for (let i = 0; i < config.shardingExpression.divisor; i++) {
      this.sockets.push(
        new Socket({
          url: this.url,
          logger: config.logger,
          accessToken: config.accessToken,
          userId: config.userId,
          entityTypes: config.entityTypes || entityNames,
          syncImmediate: config.syncImmediate,
          fullOrgSnapshot: config.fullOrgSnapshot,
          shardingExpression: {
            ...config.shardingExpression,
            remainder: i
          },
          sharedCacheManager: config.sharedCacheManager
        })
      );
    }
  }

  async connect(): Promise<void> {
    const promises = this.sockets.map(socket => socket.connect());
    await Promise.all(promises).catch(
      error => this.logger && this.logger.logError(`Socket Connection Error - ${error}`)
    );
  }

  async send<T extends Endpoint['url']>(
    url: T,
    request: RequestForUrl<T> | undefined = undefined
  ): Promise<ResponseForUrl<T>> {
    if (this.sockets.length === 0) {
      throw new NetworkError('This MultiplexSocket was instantiated with no socket instances.', {
        context: {
          reason: 'no_sockets'
        }
      });
    }

    // Round-robin logic to select the next socket
    this.lastUtilizedSocket = (this.lastUtilizedSocket + 1) % this.sockets.length;

    const socket = this.sockets[this.lastUtilizedSocket];
    return (await socket!.send(url, request)) as ResponseForUrl<T>;
  }

  subscribe(entityType: EntityName, callback: (message: EventType) => void): () => void {
    const unsubs = this.sockets.map(socket => socket.subscribe(entityType, callback));
    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }

  /**
   * Updates the access token after renewal
   */
  updateAccessToken(newAccessToken: string): void {
    this.config.accessToken = newAccessToken;

    // Update all underlying sockets with the new token
    this.sockets.forEach(socket => socket.updateAccessToken(newAccessToken));

    if (this.logger) {
      this.logger.logDebug('MultiplexSocket access token updated', {
        type: 'multiplex_socket_token_updated',
        newTokenLength: newAccessToken.length,
        socketCount: this.sockets.length
      });
    }
  }

  on(handler: MessageEventHandler) {
    this.sockets.forEach(socket => socket.on(handler));
  }

  off(handler: MessageEventHandler) {
    this.sockets.forEach(socket => socket.off(handler));
  }

  getCache() {
    return this.sockets
      .map(socket => socket.getCache())
      .reduce((a, b) => {
        Object.keys(b).forEach(k => {
          const key = k as PluralEntityName;
          if (b[key]) {
            if (a[key]) {
              // Merge arrays - both arrays exist, so we can safely merge
              (a[key] as any) = [...(a[key] as any), ...(b[key] as any)];
            } else {
              // First array for this key, just assign
              (a[key] as any) = b[key];
            }
          }
        });
        return a;
      }, {} as TdvCache);
  }

  /**
   * Get cache statistics from all sockets
   */
  getCacheStats() {
    const allStats = this.sockets.map(socket => socket.getCacheStats()).filter(Boolean);
    if (allStats.length === 0) return null;

    // Aggregate stats from all sockets
    return allStats.reduce((total, stats) => {
      if (!total) return stats;
      return {
        hits: total.hits + stats!.hits,
        misses: total.misses + stats!.misses,
        updates: total.updates + stats!.updates,
        syncs: total.syncs + stats!.syncs,
        hitRate:
          (total.hits + stats!.hits) / (total.hits + stats!.hits + total.misses + stats!.misses),
        totalRequests: total.totalRequests + stats!.totalRequests,
        cacheSize: total.cacheSize + stats!.cacheSize,
        indexStats: {
          byId: total.indexStats.byId + stats!.indexStats.byId,
          byName: total.indexStats.byName + stats!.indexStats.byName,
          byAccount: total.indexStats.byAccount + stats!.indexStats.byAccount
        }
      };
    });
  }

  /**
   * Clear cache on all sockets
   */
  clearCache(entityType?: EntityName) {
    this.sockets.forEach(socket => socket.clearCache(entityType));
  }

  /**
   * Get cache entries from all sockets for a specific entity type
   */
  getCacheEntries(entityType: EntityName): TypedCacheEntry[] {
    return this.cacheManager.getCacheEntries(entityType);
  }

  /**
   * Get cache configuration from the first socket
   */
  get cacheConfig() {
    return this.sockets[0]?.cacheConfig;
  }

  /**
   * Get cache statistics (alias for getCacheStats)
   */
  get cacheStats() {
    return this.getCacheStats();
  }

  /**
   * Update cache configuration on all sockets
   */
  updateCacheConfig(config: Partial<Record<string, unknown>>) {
    this.sockets.forEach(socket => socket.updateCacheConfig(config));
  }

  /**
   * Set cache statistics on all sockets (for testing purposes)
   */
  setCacheStats(stats: Partial<{ hits: number; misses: number; updates: number; syncs: number }>) {
    this.sockets.forEach(socket => socket.setCacheStats(stats));
  }

  /**
   * Cache response method (for testing purposes) - delegates to first socket
   */
  cacheResponse(url: string, response: any) {
    this.sockets[0]?.cacheResponse(url, response);
  }

  /**
   * Create or update cache entry method (for testing purposes) - delegates to appropriate socket
   */
  createOrUpdateCacheEntry(
    entity: any,
    entityType: EntityName,
    source: 'sync' | 'realtime' | 'response',
    timestamp: number
  ) {
    // For multiplex, we could route to appropriate socket based on sharding logic
    // For now, just use the first socket
    this.sockets[0]?.createOrUpdateCacheEntry(entity, entityType, source, timestamp);
  }

  /**
   * Individual lookup methods (for testing purposes) - delegates to first socket
   */
  lookupById(url: string, request: any, cacheEntries: any[], entityType: EntityName): any {
    return this.sockets[0]?.lookupById(url, request, cacheEntries, entityType);
  }

  lookupByName(url: string, request: any, cacheEntries: any[], entityType: EntityName): any {
    return this.sockets[0]?.lookupByName(url, request, cacheEntries, entityType);
  }

  lookupList(url: string, request: any, cacheEntries: any[], entityType: EntityName): any {
    return this.sockets[0]?.lookupList(url, request, cacheEntries, entityType);
  }

  lookupDependencies(url: string, request: any, cacheEntries: any[], entityType: EntityName): any {
    return this.sockets[0]?.lookupDependencies(url, request, cacheEntries, entityType);
  }

  async startSync() {
    const promises = this.sockets.map(socket => socket.startSync());
    await Promise.all(promises).catch(
      error => this.logger && this.logger.logError(`Socket Sync Error - ${error}`)
    );
  }

  /**
   * Check the health of the multiplex socket by checking all sharded connections
   * @returns Promise<boolean> - true if at least one socket is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      // Check if we have any sockets
      if (this.sockets.length === 0) {
        return false;
      }

      // Check if at least one socket is ready
      const healthySockets = this.sockets.filter(socket => socket.ready);
      return healthySockets.length > 0;
    } catch (error) {
      this.logger && this.logger.logError(`MultiplexSocket health check error: ${error}`);
      return false;
    }
  }

  /**
   * Get detailed health information for the multiplex socket
   * @returns Promise<{isHealthy: boolean, healthyCount: number, totalCount: number, details: Array<{index: number, ready: boolean}>}>
   */
  async getHealthDetails(): Promise<{
    isHealthy: boolean;
    healthyCount: number;
    totalCount: number;
    details: Array<{ index: number; ready: boolean }>;
  }> {
    try {
      if (this.sockets.length === 0) {
        return {
          isHealthy: false,
          healthyCount: 0,
          totalCount: 0,
          details: []
        };
      }

      const details = this.sockets.map((socket, index) => ({
        index,
        ready: socket.ready
      }));

      const healthyCount = details.filter(d => d.ready).length;
      const isHealthy = healthyCount > 0;

      return {
        isHealthy,
        healthyCount,
        totalCount: this.sockets.length,
        details
      };
    } catch (error) {
      this.logger && this.logger.logError(`MultiplexSocket detailed health check error: ${error}`);
      return {
        isHealthy: false,
        healthyCount: 0,
        totalCount: this.sockets.length,
        details: []
      };
    }
  }

  /**
   * Get the number of healthy sockets
   * @returns number - count of healthy sockets
   */
  getHealthySocketCount(): number {
    try {
      return this.sockets.filter(socket => socket.ready).length;
    } catch {
      return 0;
    }
  }

  /**
   * Get the total number of sockets
   * @returns number - total socket count
   */
  getTotalSocketCount(): number {
    return this.sockets.length;
  }

  /**
   * Disconnects from the WebSocket service
   */
  async disconnect(): Promise<void> {
    if (this.sockets.length > 0) {
      const promises = this.sockets.map(socket => socket.disconnect());
      await Promise.all(promises).catch(
        error => this.logger && this.logger.logError(`Socket Disconnection Error - ${error}`)
      );
      this.sockets = []; // Clear sockets after disconnection
      this.logger?.log('MultiplexSocket disconnected');
    }
  }
}
