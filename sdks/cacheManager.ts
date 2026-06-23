import { entityNames } from '../data/constants';
import type { EntityName, PluralEntityName } from '../types/common';
import type {
  CachedEntity,
  CacheRequest,
  LoggerType,
  TypedCacheEntries,
  TypedCacheEntry,
  TypedCacheLookupResult,
  TypedIndexes
} from '../types/runtime';

export interface CacheEntry extends TypedCacheEntry {}

export interface CacheLookupResult extends TypedCacheLookupResult {}

export interface CacheConfig {
  maxAge: number;
  maxEntries: {
    account: number;
    position: number;
    order: number;
    product: number;
    default: number;
  };
  enableIntelligentLookup: boolean;
  enableCacheStats: boolean;
  enableLRU: boolean;
  enableCompression: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  updates: number;
  syncs: number;
  hitRate: number;
  totalRequests: number;
  cacheSize: number;
  indexStats: {
    byId: number;
    byName: number;
    byAccount: number;
  };
}

export interface TdvCache {
  [key: string]: CachedEntity[];
}

export class CacheManager {
  /** Cache configuration */
  private cacheConfig: CacheConfig = {
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: {
      account: 100000, // Support 100k accounts
      position: 50000, // Support 50k positions
      order: 25000, // Support 25k orders
      product: 10000, // Support 10k products
      default: 10000 // Default for other entity types
    },
    enableIntelligentLookup: true,
    enableCacheStats: true,
    enableLRU: true, // Better eviction strategy
    enableCompression: false // Memory optimization (future)
  };

  /** Local cache storage */
  private localCache: TypedCacheEntries = {} as TypedCacheEntries;

  /** Indexed lookups for O(1) performance */
  private indexes: TypedIndexes = {
    byId: new Map(),
    byName: new Map(),
    byAccount: new Map()
  };

  /** Cache statistics */
  private cacheStats = {
    hits: 0,
    misses: 0,
    updates: 0,
    syncs: 0
  };

  /** Logger for cache operations */
  private logger?: LoggerType;

  constructor(config?: Partial<CacheConfig>, logger?: LoggerType) {
    if (config) {
      this.cacheConfig = { ...this.cacheConfig, ...config };
    }
    this.logger = logger;
  }

  /**
   * Initialize cache for specific entity types
   */
  initializeCache(entityTypes: EntityName[]) {
    entityTypes.forEach(entityType => {
      const pluralName = getPluralEntityName(entityType);
      this.localCache[pluralName] = [];
    });
  }

  /**
   * Create or update a cache entry with metadata
   */
  createOrUpdateCacheEntry(
    entity: CachedEntity,
    entityType: EntityName,
    source: 'sync' | 'realtime' | 'response',
    timestamp: number
  ) {
    if (!entity || !entity.id) return;

    const startTime = Date.now();
    const pluralName = getPluralEntityName(entityType);
    if (!this.localCache[pluralName]) {
      this.localCache[pluralName] = [];
    }

    const existingIndex = this.localCache[pluralName].findIndex(
      entry => entry.entity.id === entity.id
    );

    if (existingIndex >= 0) {
      // Update existing entry
      const existing = this.localCache[pluralName][existingIndex]!;
      const oldEntry = { ...existing };
      this.localCache[pluralName][existingIndex] = {
        ...existing,
        entity,
        lastUpdated: timestamp,
        source,
        accessCount: existing!.accessCount + 1
      };

      // Update indexes
      this.updateIndexes(oldEntry, entityType);

      const duration = Date.now() - startTime;
      // Log cache operation performance for update
      this.logger?.logCacheOperation('set', entityType, duration, {
        id: entity.id,
        source,
        operation: 'update',
        entityType
      });
    } else {
      // Create new entry
      const newEntry: TypedCacheEntry = {
        entity,
        entityType: entityType as EntityName,
        lastUpdated: timestamp,
        source,
        accessCount: source === 'sync' ? 0 : 1
      };

      this.localCache[pluralName].push(newEntry);

      // Add to indexes for O(1) lookups
      this.addToIndexes(newEntry, entityType);

      // Enforce maximum cache size
      const maxEntries = this.getMaxEntriesForType(entityType);
      if (this.localCache[pluralName].length > maxEntries) {
        // Remove oldest, least accessed entries
        this.localCache[pluralName].sort((a, b) => {
          if (a.accessCount !== b.accessCount) {
            return a.accessCount - b.accessCount;
          }
          return a.lastUpdated - b.lastUpdated;
        });

        // Remove evicted entries from indexes
        const evictedEntries = this.localCache[pluralName].slice(0, -maxEntries);
        evictedEntries.forEach(entry => {
          this.removeFromIndexes(entry, entityType);
        });

        this.localCache[pluralName] = this.localCache[pluralName].slice(-maxEntries);

        // Log cache operation performance for eviction
        const evictionDuration = Date.now() - startTime;
        this.logger?.logCacheOperation('evict', entityType, evictionDuration, {
          evictedCount: evictedEntries.length,
          maxEntries,
          entityType
        });
      }

      const duration = Date.now() - startTime;
      // Log cache operation performance for creation
      this.logger?.logCacheOperation('set', entityType, duration, {
        id: entity.id,
        source,
        operation: 'create',
        entityType
      });
    }
  }

  /**
   * Lookup entities by ID for /item and /items endpoints
   */
  lookupById(
    url: string,
    request: CacheRequest,
    cacheEntries: TypedCacheEntry[],
    entityType: EntityName
  ): TypedCacheLookupResult {
    const { query, body } = request;
    const isItemsRequest = url.endsWith('/items');

    // Extract IDs from query or body
    let targetIds: number[] = [];

    if (query) {
      // Parse query string for ID parameters
      const params = new URLSearchParams(query);

      if (isItemsRequest) {
        // For /items, support multiple ID formats:
        // ?ids=1,2,3 or ?id=1&id=2&id=3
        const idsParam = params.get('ids');
        if (idsParam) {
          // Handle comma-separated IDs
          targetIds = idsParam
            .split(',')
            .map(id => parseInt(id.trim(), 10))
            .filter(id => !isNaN(id));
        } else {
          // Handle multiple id parameters
          const idParams = params.getAll('id');
          targetIds = idParams.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        }
      } else {
        // For /item, single ID
        const idParam = params.get('id');
        if (idParam) {
          const singleId = parseInt(idParam, 10);
          if (!isNaN(singleId)) {
            targetIds = [singleId];
          }
        }
      }
    }

    if (body && typeof body === 'object') {
      if (isItemsRequest) {
        // For /items, support multiple ID formats in body:
        // {ids: [1,2,3]} or {id: [1,2,3]} or {id: 1, id2: 2, id3: 3}
        if ('ids' in body && Array.isArray(body.ids)) {
          targetIds = [
            ...targetIds,
            ...body.ids.map(id => parseInt(String(id), 10)).filter(id => !isNaN(id))
          ];
        } else if ('id' in body && Array.isArray(body.id)) {
          targetIds = [
            ...targetIds,
            ...body.id.map(id => parseInt(String(id), 10)).filter(id => !isNaN(id))
          ];
        } else {
          // Look for multiple id fields (id, id2, id3, etc.)
          Object.keys(body).forEach(key => {
            if (key.startsWith('id') && (body as any)[key] !== undefined) {
              const id = parseInt(String((body as any)[key]), 10);
              if (!isNaN(id)) {
                targetIds.push(id);
              }
            }
          });
        }
      } else {
        // For /item, single ID
        if ('id' in body) {
          const bodyId = body.id;
          const singleId = typeof bodyId === 'number' ? bodyId : parseInt(String(bodyId), 10);
          if (!isNaN(singleId)) {
            targetIds = [singleId];
          }
        }
      }
    }

    if (targetIds.length === 0) {
      return { found: false, source: 'api' };
    }

    // Find entities with matching IDs
    const matchingEntries = cacheEntries.filter(
      entry => 'id' in entry.entity && targetIds.includes(entry.entity.id)
    );

    if (matchingEntries.length > 0) {
      // Update access counts
      matchingEntries.forEach(entry => {
        entry.accessCount++;
        entry.lastUpdated = Date.now();
      });

      const entities = matchingEntries.map(entry => entry.entity);

      if (isItemsRequest) {
        return {
          found: true,
          data: entities,
          source: 'cache',
          cacheHit: true,
          entityType
        };
      } else {
        // Return first match for /item endpoint
        return {
          found: true,
          data: entities[0],
          source: 'cache',
          cacheHit: true,
          entityType
        };
      }
    }

    return { found: false, source: 'api' };
  }

  /**
   * Lookup entities by name for /find and /finds endpoints
   */
  lookupByName(
    url: string,
    request: CacheRequest,
    cacheEntries: TypedCacheEntry[],
    entityType: EntityName
  ): TypedCacheLookupResult {
    const { query, body } = request;

    // Extract name from query or body
    let targetName: string | undefined;

    if (query) {
      // Parse query string for name parameter
      const params = new URLSearchParams(query);
      const nameParam = params.get('name');
      if (nameParam) {
        targetName = nameParam;
      }
    }

    if (body && typeof body === 'object' && 'name' in body) {
      targetName = String(body.name);
    }

    if (!targetName) {
      return { found: false, source: 'api' };
    }

    // Find entities with matching name
    const matchingEntries = cacheEntries.filter(
      entry =>
        'name' in entry.entity &&
        typeof entry.entity.name === 'string' &&
        entry.entity.name.includes(targetName!)
    );

    if (matchingEntries.length > 0) {
      // Update access counts
      matchingEntries.forEach(entry => {
        entry.accessCount++;
        entry.lastUpdated = Date.now();
      });

      const entities = matchingEntries.map(entry => entry.entity);

      if (url.endsWith('/finds')) {
        return {
          found: true,
          data: entities,
          source: 'cache',
          cacheHit: true,
          entityType
        };
      } else {
        // Return first match for /find endpoint
        return {
          found: true,
          data: entities[0],
          source: 'cache',
          cacheHit: true,
          entityType
        };
      }
    }

    return { found: false, source: 'api' };
  }

  /**
   * Lookup entities for /list endpoint
   */
  lookupList(
    url: string,
    request: CacheRequest,
    cacheEntries: TypedCacheEntry[],
    entityType: EntityName
  ): TypedCacheLookupResult {
    // For /list, return all cached entities of this type
    if (cacheEntries.length > 0) {
      // Update access counts for all entries
      cacheEntries.forEach(entry => {
        entry.accessCount++;
        entry.lastUpdated = Date.now();
      });

      const entities = cacheEntries.map(entry => entry.entity);

      return {
        found: true,
        data: entities,
        source: 'cache',
        cacheHit: true,
        entityType
      };
    }

    return { found: false, source: 'api' };
  }

  /**
   * Lookup dependencies for /deps and /ldeps endpoints
   */
  lookupDependencies(
    url: string,
    request: CacheRequest,
    cacheEntries: TypedCacheEntry[],
    entityType: EntityName
  ): TypedCacheLookupResult {
    const { query, body } = request;

    // Extract dependency information from query or body
    let dependencyInfo: Record<string, unknown> = {};

    if (query) {
      // Parse query string for dependency parameters
      const params = new URLSearchParams(query);
      dependencyInfo = Object.fromEntries(params);
    }

    if (body) {
      dependencyInfo = { ...dependencyInfo, ...body };
    }

    // For dependencies, we need to match against the expected dependency type
    // This is more complex and may require API calls in many cases

    // Try to use account index for account-based dependencies
    if (dependencyInfo.accountId || dependencyInfo.masterId) {
      const accountId = dependencyInfo.accountId || dependencyInfo.masterId;
      const accountEntries = this.indexes.byAccount.get(Number(accountId));

      if (accountEntries && accountEntries.length > 0) {
        // Filter by entity type if specified
        const typeFiltered = dependencyInfo.entityType
          ? accountEntries.filter(entry => entry.entityType === dependencyInfo.entityType)
          : accountEntries;

        if (typeFiltered.length > 0) {
          // Update access counts
          typeFiltered.forEach(entry => {
            entry.accessCount++;
            entry.lastUpdated = Date.now();
          });

          const entities = typeFiltered.map(entry => entry.entity);

          if (url.endsWith('/ldeps')) {
            return {
              found: true,
              data: entities,
              source: 'cache',
              cacheHit: true,
              entityType
            };
          } else {
            return {
              found: true,
              data: entities[0],
              source: 'cache',
              cacheHit: true,
              entityType
            };
          }
        }
      }
    }

    // Fall back to API call for complex dependencies
    return { found: false, source: 'api' };
  }

  /**
   * Check if a request can be cached
   */
  isCacheableRequest(url: string): boolean {
    const cacheableEndpoints = ['/item', '/items', '/deps', '/ldeps', '/list', '/find', '/finds'];
    return cacheableEndpoints.some(endpoint => url.includes(endpoint));
  }

  /**
   * Cache API response data for future use
   */
  cacheResponse(url: string, response: any) {
    if (!this.isCacheableRequest(url)) return;

    const entityType = url.split('/')[0] as EntityName;

    // Validate that this is a valid entity type before proceeding
    if (!entityNames.includes(entityType as any)) {
      return; // Skip caching for invalid entity types
    }

    const now = Date.now();

    if (Array.isArray(response)) {
      // Handle array responses
      response.forEach(entity => {
        this.createOrUpdateCacheEntry(entity, entityType, 'response', now);
      });
    } else if (response && typeof response === 'object') {
      // Handle single entity responses
      this.createOrUpdateCacheEntry(response, entityType, 'response', now);
    }

    this.cacheStats.updates++;
  }

  /**
   * Get maximum entries for a specific entity type
   */
  private getMaxEntriesForType(entityType: EntityName): number {
    const config = this.cacheConfig.maxEntries;

    // Check for specific entity type limits
    if (entityType === 'account' && typeof config === 'object' && 'account' in config) {
      return config.account;
    }
    if (entityType === 'position' && typeof config === 'object' && 'position' in config) {
      return config.position;
    }
    if (entityType === 'order' && typeof config === 'object' && 'order' in config) {
      return config.order;
    }
    if (entityType === 'product' && typeof config === 'object' && 'product' in config) {
      return config.product;
    }

    // Return default limit
    if (typeof config === 'object' && 'default' in config) {
      return config.default;
    }

    // Fallback to old behavior if config is still a number
    if (typeof config === 'number') {
      return config;
    }

    return 10000; // Safe default
  }

  /**
   * Add entry to indexes for O(1) lookups
   */
  private addToIndexes(entry: TypedCacheEntry, entityType: EntityName) {
    // Index by ID for /item endpoints
    const idKey = `${entityType}:${entry.entity.id}`;
    this.indexes.byId.set(idKey, entry);

    // Index by name for /find endpoints
    if ('name' in entry.entity && typeof entry.entity.name === 'string') {
      const nameKey = `${entityType}:${entry.entity.name}`;
      const existingByName = this.indexes.byName.get(nameKey) || [];
      existingByName.push(entry);
      this.indexes.byName.set(nameKey, existingByName);
    }

    // Index by account for dependencies
    if ('accountId' in entry.entity && typeof entry.entity.accountId === 'number') {
      const accountKey = entry.entity.accountId;
      const existingByAccount = this.indexes.byAccount.get(accountKey) || [];
      existingByAccount.push(entry);
      this.indexes.byAccount.set(accountKey, existingByAccount);
    }
  }

  /**
   * Remove entry from indexes
   */
  private removeFromIndexes(entry: TypedCacheEntry, entityType: EntityName) {
    // Remove from ID index
    const idKey = `${entityType}:${entry.entity.id}`;
    this.indexes.byId.delete(idKey);

    // Remove from name index
    if ('name' in entry.entity && typeof entry.entity.name === 'string') {
      const nameKey = `${entityType}:${entry.entity.name}`;
      const existingByName = this.indexes.byName.get(nameKey) || [];
      const filteredByName = existingByName.filter(
        e => 'id' in e.entity && e.entity.id !== entry.entity.id
      );
      if (filteredByName.length > 0) {
        this.indexes.byName.set(nameKey, filteredByName);
      } else {
        this.indexes.byName.delete(nameKey);
      }
    }

    // Remove from account index
    if ('accountId' in entry.entity && typeof entry.entity.accountId === 'number') {
      const accountKey = entry.entity.accountId;
      const existingByAccount = this.indexes.byAccount.get(accountKey) || [];
      const filteredByAccount = existingByAccount.filter(
        e => 'id' in e.entity && e.entity.id !== entry.entity.id
      );
      if (filteredByAccount.length > 0) {
        this.indexes.byAccount.set(accountKey, filteredByAccount);
      } else {
        this.indexes.byAccount.set(accountKey, filteredByAccount);
      }
    }
  }

  /**
   * Update entry in indexes
   */
  private updateIndexes(oldEntry: TypedCacheEntry, entityType: EntityName) {
    // Remove old entry from indexes
    this.removeFromIndexes(oldEntry, entityType);

    // Add new entry to indexes (entry is already updated in localCache)
    const newEntry = this.localCache[getPluralEntityName(entityType)].find(
      e => 'id' in e.entity && 'id' in oldEntry.entity && e.entity.id === oldEntry.entity.id
    );
    if (newEntry) {
      this.addToIndexes(newEntry, entityType);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): CacheStats | null {
    if (!this.cacheConfig.enableCacheStats) return null;

    return {
      ...this.cacheStats,
      hitRate: this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses),
      totalRequests: this.cacheStats.hits + this.cacheStats.misses,
      cacheSize: Object.values(this.localCache).reduce(
        (total, entries) => total + entries.length,
        0
      ),
      // Index statistics for performance monitoring
      indexStats: {
        byId: this.indexes.byId.size,
        byName: this.indexes.byName.size,
        byAccount: this.indexes.byAccount.size
      }
    };
  }

  /**
   * Clear the cache for a specific entity type or all types
   */
  clearCache(entityType?: EntityName) {
    if (entityType) {
      const pluralName = getPluralEntityName(entityType);
      // Remove entries from indexes before clearing
      this.localCache[pluralName].forEach(entry => {
        this.removeFromIndexes(entry, entityType);
      });
      this.localCache[pluralName] = [];
      this.logger?.log(`Cache cleared for ${entityType}`);
    } else {
      // Clear all indexes
      this.indexes.byId.clear();
      this.indexes.byName.clear();
      this.indexes.byAccount.clear();
      this.localCache = {} as TypedCacheEntries;
      this.logger?.log('All caches cleared');
    }
  }

  /**
   * Get cache entries for a specific entity type
   */
  getCacheEntries(entityType: EntityName): TypedCacheEntry[] {
    if (!entityType) {
      return [];
    }

    const startTime = Date.now();
    const pluralName = getPluralEntityName(entityType);
    const entries = this.localCache[pluralName] || [];
    const duration = Date.now() - startTime;

    // Log cache operation performance
    this.logger?.logCacheOperation('hit', entityType, duration, {
      entryCount: entries.length,
      entityType
    });

    return entries;
  }

  /**
   * Get the raw cache data (backward compatibility)
   */
  getCache(): TdvCache {
    const rawCache: TdvCache = {};
    Object.entries(this.localCache).forEach(([pluralName, entries]) => {
      rawCache[pluralName as PluralEntityName] = entries.map(entry => entry.entity);
    });
    return rawCache;
  }

  /**
   * Update cache statistics
   */
  updateStats(hit: boolean) {
    if (hit) {
      this.cacheStats.hits++;
    } else {
      this.cacheStats.misses++;
    }
  }

  /**
   * Set cache statistics for testing purposes
   */
  setStats(stats: Partial<{ hits: number; misses: number; updates: number; syncs: number }>) {
    if (stats.hits !== undefined) this.cacheStats.hits = stats.hits;
    if (stats.misses !== undefined) this.cacheStats.misses = stats.misses;
    if (stats.updates !== undefined) this.cacheStats.updates = stats.updates;
    if (stats.syncs !== undefined) this.cacheStats.syncs = stats.syncs;
  }

  /**
   * Get cache configuration
   */
  getCacheConfig(): CacheConfig {
    return { ...this.cacheConfig };
  }

  /**
   * Update cache configuration
   */
  updateCacheConfig(config: Partial<CacheConfig>) {
    this.cacheConfig = { ...this.cacheConfig, ...config };
  }
}

import { ValidationError } from '../api/errors';

export function getPluralEntityName(entityName: EntityName): PluralEntityName {
  if (!entityName || typeof entityName !== 'string') {
    throw new ValidationError(`Invalid entity name: ${entityName}`, { context: { entityName } });
  }

  if (entityName.endsWith('y')) {
    return (entityName.slice(0, -1) + 'ies') as PluralEntityName;
  } else if (entityName.endsWith('s')) {
    return (entityName + 'es') as PluralEntityName;
  } else {
    return (entityName + 's') as PluralEntityName;
  }
}
