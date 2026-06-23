/**
 * Unit tests for CacheManager core functionality
 * Tests initialization, configuration, cache operations, and entity management
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CacheManager } from '../../sdks/cacheManager';
import type { EntityName } from '../../types/common';
import type { LoggerType } from '../../types/runtime';
import { createSimpleMockLogger } from '../setup';

describe('CacheManager', () => {
  let cacheManager: CacheManager;
  let mockLogger: ReturnType<typeof createSimpleMockLogger>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogger = createSimpleMockLogger();
  });

  describe('Initialization', () => {
    it('should initialize with default configuration', () => {
      cacheManager = new CacheManager(undefined, mockLogger as unknown as LoggerType);
      expect(cacheManager).toBeInstanceOf(CacheManager);
      expect(cacheManager).toBeDefined();
    });

    it('should initialize with custom configuration', () => {
      const customConfig = {
        maxAge: 300000,
        maxEntries: {
          account: 1000,
          position: 500,
          order: 250,
          product: 100,
          default: 100
        },
        enableCompression: true,
        enableIntelligentLookup: true,
        enableCacheStats: true,
        enableLRU: true
      };

      cacheManager = new CacheManager(customConfig, mockLogger as unknown as LoggerType);
      expect(cacheManager).toBeInstanceOf(CacheManager);
      expect(cacheManager).toBeDefined();
    });

    it('should initialize with high capacity configuration', () => {
      const highCapacityConfig = {
        maxAge: 600000,
        maxEntries: {
          account: 100000,
          position: 50000,
          order: 25000,
          product: 10000,
          default: 10000
        },
        enableCompression: true,
        enableIntelligentLookup: true,
        enableCacheStats: true,
        enableLRU: true
      };

      cacheManager = new CacheManager(highCapacityConfig, mockLogger as unknown as LoggerType);
      expect(cacheManager).toBeInstanceOf(CacheManager);
      expect(cacheManager).toBeDefined();
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid cache sizes', () => {
      const validSizes = [1, 10, 100, 1000, 10000, 100000];

      validSizes.forEach(size => {
        expect(
          () =>
            new CacheManager(
              {
                maxAge: 300000,
                maxEntries: {
                  account: size,
                  position: size,
                  order: size,
                  product: size,
                  default: size
                },
                enableCompression: true,
                enableIntelligentLookup: true,
                enableCacheStats: true,
                enableLRU: true
              },
              mockLogger as unknown as LoggerType
            )
        ).not.toThrow();
      });
    });

    it('should accept valid TTL values', () => {
      const validTTLs = [1000, 60000, 300000, 900000, 3600000];

      validTTLs.forEach(ttl => {
        expect(
          () =>
            new CacheManager(
              {
                maxAge: ttl,
                maxEntries: {
                  account: 1000,
                  position: 500,
                  order: 250,
                  product: 100,
                  default: 100
                },
                enableCompression: true,
                enableIntelligentLookup: true,
                enableCacheStats: true,
                enableLRU: true
              },
              mockLogger as unknown as LoggerType
            )
        ).not.toThrow();
      });
    });

    it('should accept boolean configuration flags', () => {
      const configs = [
        { enableCompression: true, enablePersistence: true },
        { enableCompression: true, enablePersistence: false },
        { enableCompression: false, enablePersistence: true },
        { enableCompression: false, enablePersistence: false }
      ];

      configs.forEach(config => {
        expect(
          () =>
            new CacheManager(
              {
                maxAge: 300000,
                maxEntries: {
                  account: 1000,
                  position: 500,
                  order: 250,
                  product: 100,
                  default: 100
                },
                ...config
              },
              mockLogger as unknown as LoggerType
            )
        ).not.toThrow();
      });
    });
  });

  describe('Logger Integration', () => {
    it('should initialize with logger', () => {
      cacheManager = new CacheManager(undefined, mockLogger as unknown as LoggerType);
      expect(cacheManager).toBeDefined();
      expect(mockLogger).toBeDefined();
    });

    it('should work with different logger instances', () => {
      const alternativeLogger = createSimpleMockLogger();

      cacheManager = new CacheManager(undefined, alternativeLogger as unknown as LoggerType);
      expect(cacheManager).toBeDefined();
    });
  });

  describe('Cache Initialization', () => {
    it('should initialize cache with entity types', () => {
      cacheManager = new CacheManager(undefined, mockLogger as unknown as LoggerType);

      const entityTypes: EntityName[] = ['account', 'position', 'order', 'fill'];
      expect(() => cacheManager.initializeCache(entityTypes)).not.toThrow();
    });

    it('should handle empty entity types array', () => {
      cacheManager = new CacheManager(undefined, mockLogger as unknown as LoggerType);

      expect(() => cacheManager.initializeCache([])).not.toThrow();
    });

    it('should handle single entity type', () => {
      cacheManager = new CacheManager(undefined, mockLogger as unknown as LoggerType);

      expect(() => cacheManager.initializeCache(['account'])).not.toThrow();
    });

    it('should handle many entity types', () => {
      cacheManager = new CacheManager(undefined, mockLogger as unknown as LoggerType);

      const manyEntityTypes: EntityName[] = [
        'account',
        'position',
        'order',
        'fill',
        'product',
        'exchange',
        'currency',
        'alert',
        'alertSignal'
      ];
      expect(() => cacheManager.initializeCache(manyEntityTypes)).not.toThrow();
    });
  });

  describe('Instance Properties', () => {
    beforeEach(() => {
      cacheManager = new CacheManager(undefined, mockLogger as unknown as LoggerType);
    });

    it('should have the correct constructor name', () => {
      expect(cacheManager.constructor.name).toBe('CacheManager');
    });

    it('should be a valid CacheManager instance', () => {
      expect(cacheManager).toBeDefined();
      expect(typeof cacheManager).toBe('object');
    });
  });

  describe('Constructor Edge Cases', () => {
    it('should handle very high cache sizes', () => {
      expect(
        () =>
          new CacheManager(
            {
              maxAge: 86400000, // 24 hours
              maxEntries: {
                account: 1000000,
                position: 500000,
                order: 250000,
                product: 100000,
                default: 100000
              },
              enableCompression: true,
              enableIntelligentLookup: true,
              enableCacheStats: true,
              enableLRU: true
            },
            mockLogger as unknown as LoggerType
          )
      ).not.toThrow();
    });

    it('should handle very low cache sizes', () => {
      expect(
        () =>
          new CacheManager(
            {
              maxAge: 100, // 100ms
              maxEntries: {
                account: 1,
                position: 1,
                order: 1,
                product: 1,
                default: 1
              },
              enableCompression: false,
              enableIntelligentLookup: false,
              enableCacheStats: false,
              enableLRU: false
            },
            mockLogger as unknown as LoggerType
          )
      ).not.toThrow();
    });

    it('should handle very high TTL values', () => {
      expect(
        () =>
          new CacheManager(
            {
              maxAge: 86400000, // 24 hours
              maxEntries: {
                account: 1000,
                position: 500,
                order: 250,
                product: 100,
                default: 100
              },
              enableCompression: true,
              enableIntelligentLookup: true,
              enableCacheStats: true,
              enableLRU: true
            },
            mockLogger as unknown as LoggerType
          )
      ).not.toThrow();
    });

    it('should handle very low TTL values', () => {
      expect(
        () =>
          new CacheManager(
            {
              maxAge: 100, // 100ms
              maxEntries: {
                account: 1,
                position: 1,
                order: 1,
                product: 1,
                default: 1
              },
              enableCompression: false,
              enableIntelligentLookup: false,
              enableCacheStats: false,
              enableLRU: false
            },
            mockLogger as unknown as LoggerType
          )
      ).not.toThrow();
    });
  });

  describe('Configuration Combinations', () => {
    it('should handle all features enabled', () => {
      cacheManager = new CacheManager(
        {
          maxAge: 600000,
          maxEntries: {
            account: 5000,
            position: 5000,
            order: 5000,
            product: 5000,
            default: 5000
          },
          enableCompression: true,
          enableIntelligentLookup: true,
          enableCacheStats: true,
          enableLRU: true
        },
        mockLogger as unknown as LoggerType
      );

      expect(cacheManager).toBeDefined();
    });

    it('should handle all features disabled', () => {
      cacheManager = new CacheManager(
        {
          maxAge: 600000,
          maxEntries: {
            account: 5000,
            position: 5000,
            order: 5000,
            product: 5000,
            default: 5000
          },
          enableCompression: false,
          enableIntelligentLookup: false,
          enableCacheStats: false,
          enableLRU: false
        },
        mockLogger as unknown as LoggerType
      );

      expect(cacheManager).toBeDefined();
    });

    it('should handle mixed configuration', () => {
      cacheManager = new CacheManager(
        {
          maxAge: 600000,
          maxEntries: {
            account: 5000,
            position: 5000,
            order: 5000,
            product: 5000,
            default: 5000
          },
          enableCompression: true,
          enableIntelligentLookup: false,
          enableCacheStats: true,
          enableLRU: false
        },
        mockLogger as unknown as LoggerType
      );

      expect(cacheManager).toBeDefined();
    });

    it('should handle minimal configuration', () => {
      cacheManager = new CacheManager(
        {
          maxAge: 300000,
          maxEntries: {
            account: 100,
            position: 100,
            order: 100,
            product: 100,
            default: 100
          }
        },
        mockLogger as unknown as LoggerType
      );

      expect(cacheManager).toBeDefined();
    });
  });

  describe('Default Configuration', () => {
    it('should work without configuration object', () => {
      cacheManager = new CacheManager(undefined, mockLogger as unknown as LoggerType);
      expect(cacheManager).toBeDefined();
    });

    it('should work with null configuration', () => {
      cacheManager = new CacheManager(null as any, mockLogger as unknown as LoggerType);
      expect(cacheManager).toBeDefined();
    });
  });

  describe('Cache Operations', () => {
    beforeEach(() => {
      cacheManager = new CacheManager(undefined, mockLogger as unknown as LoggerType);
      cacheManager.initializeCache(['account', 'position', 'order']);
    });

    describe('createOrUpdateCacheEntry', () => {
      it('should create new cache entry', () => {
        const entity = { id: 1, name: 'Test Account' };
        const timestamp = Date.now();

        expect(() =>
          cacheManager.createOrUpdateCacheEntry(entity, 'account', 'response', timestamp)
        ).not.toThrow();
      });

      it('should update existing cache entry', () => {
        const entity = { id: 1, name: 'Test Account' };
        const timestamp = Date.now();

        // Create first entry
        cacheManager.createOrUpdateCacheEntry(entity, 'account', 'response', timestamp);

        // Update with modified entity
        const updatedEntity = { id: 1, name: 'Updated Account' };
        expect(() =>
          cacheManager.createOrUpdateCacheEntry(
            updatedEntity,
            'account',
            'response',
            timestamp + 1000
          )
        ).not.toThrow();
      });
    });

    describe('lookupById', () => {
      beforeEach(() => {
        // Setup test data
        const entities = [
          { id: 1, name: 'Account 1' },
          { id: 2, name: 'Account 2' },
          { id: 3, name: 'Account 3' }
        ];

        entities.forEach((entity, index) => {
          cacheManager.createOrUpdateCacheEntry(entity, 'account', 'response', Date.now() + index);
        });
      });

      describe('/item endpoint (single ID)', () => {
        it('should find single entity by ID in query params', () => {
          const request = { query: '?id=1', body: {} };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById('/account/item', request, cacheEntries, 'account');

          expect(result.found).toBe(true);
          expect(result.source).toBe('cache');
          expect(result.cacheHit).toBe(true);
          expect(result.data).toEqual({ id: 1, name: 'Account 1' });
        });

        it('should find single entity by ID in body', () => {
          const request = { query: '', body: { id: 2 } };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById('/account/item', request, cacheEntries, 'account');

          expect(result.found).toBe(true);
          expect(result.source).toBe('cache');
          expect(result.cacheHit).toBe(true);
          expect(result.data).toEqual({ id: 2, name: 'Account 2' });
        });

        it('should return not found for non-existent ID', () => {
          const request = { query: '?id=999', body: {} };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById('/account/item', request, cacheEntries, 'account');

          expect(result.found).toBe(false);
          expect(result.source).toBe('api');
        });
      });

      describe('/items endpoint (multiple IDs)', () => {
        it('should find multiple entities by comma-separated IDs in query', () => {
          const request = { query: '?ids=1,2', body: {} };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById(
            '/account/items',
            request,
            cacheEntries,
            'account'
          );

          expect(result.found).toBe(true);
          expect(result.source).toBe('cache');
          expect(result.cacheHit).toBe(true);
          expect(Array.isArray(result.data)).toBe(true);
          expect(result.data).toHaveLength(2);
          expect(result.data).toEqual(
            expect.arrayContaining([
              { id: 1, name: 'Account 1' },
              { id: 2, name: 'Account 2' }
            ])
          );
        });

        it('should find multiple entities by multiple id parameters in query', () => {
          const request = { query: '?id=1&id=3', body: {} };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById(
            '/account/items',
            request,
            cacheEntries,
            'account'
          );

          expect(result.found).toBe(true);
          expect(result.source).toBe('cache');
          expect(result.cacheHit).toBe(true);
          expect(Array.isArray(result.data)).toBe(true);
          expect(result.data).toHaveLength(2);
          expect(result.data).toEqual(
            expect.arrayContaining([
              { id: 1, name: 'Account 1' },
              { id: 3, name: 'Account 3' }
            ])
          );
        });

        it('should find multiple entities by array of IDs in body', () => {
          const request = { query: '', body: { ids: [1, 3] } };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById(
            '/account/items',
            request,
            cacheEntries,
            'account'
          );

          expect(result.found).toBe(true);
          expect(result.source).toBe('cache');
          expect(result.cacheHit).toBe(true);
          expect(Array.isArray(result.data)).toBe(true);
          expect(result.data).toHaveLength(2);
          expect(result.data).toEqual(
            expect.arrayContaining([
              { id: 1, name: 'Account 1' },
              { id: 3, name: 'Account 3' }
            ])
          );
        });

        it('should find multiple entities by id array in body', () => {
          const request = { query: '', body: { id: [2, 3] } };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById(
            '/account/items',
            request,
            cacheEntries,
            'account'
          );

          expect(result.found).toBe(true);
          expect(result.source).toBe('cache');
          expect(result.cacheHit).toBe(true);
          expect(Array.isArray(result.data)).toBe(true);
          expect(result.data).toHaveLength(2);
          expect(result.data).toEqual(
            expect.arrayContaining([
              { id: 2, name: 'Account 2' },
              { id: 3, name: 'Account 3' }
            ])
          );
        });

        it('should find multiple entities by multiple id fields in body', () => {
          const request = { query: '', body: { id: 1, id2: 2, id3: 3 } };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById(
            '/account/items',
            request,
            cacheEntries,
            'account'
          );

          expect(result.found).toBe(true);
          expect(result.source).toBe('cache');
          expect(result.cacheHit).toBe(true);
          expect(Array.isArray(result.data)).toBe(true);
          expect(result.data).toHaveLength(3);
          expect(result.data).toEqual(
            expect.arrayContaining([
              { id: 1, name: 'Account 1' },
              { id: 2, name: 'Account 2' },
              { id: 3, name: 'Account 3' }
            ])
          );
        });

        it('should handle mixed query and body IDs', () => {
          const request = { query: '?ids=1,2', body: { id: 3 } };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById(
            '/account/items',
            request,
            cacheEntries,
            'account'
          );

          expect(result.found).toBe(true);
          expect(result.source).toBe('cache');
          expect(result.cacheHit).toBe(true);
          expect(Array.isArray(result.data)).toBe(true);
          expect(result.data).toHaveLength(3);
          expect(result.data).toEqual(
            expect.arrayContaining([
              { id: 1, name: 'Account 1' },
              { id: 2, name: 'Account 2' },
              { id: 3, name: 'Account 3' }
            ])
          );
        });

        it('should return not found for non-existent IDs', () => {
          const request = { query: '?ids=999,888', body: {} };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById(
            '/account/items',
            request,
            cacheEntries,
            'account'
          );

          expect(result.found).toBe(false);
          expect(result.source).toBe('api');
        });

        it('should handle partial matches', () => {
          const request = { query: '?ids=1,999,3', body: {} };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById(
            '/account/items',
            request,
            cacheEntries,
            'account'
          );

          expect(result.found).toBe(true);
          expect(result.source).toBe('cache');
          expect(result.cacheHit).toBe(true);
          expect(Array.isArray(result.data)).toBe(true);
          expect(result.data).toHaveLength(2);
          expect(result.data).toEqual(
            expect.arrayContaining([
              { id: 1, name: 'Account 1' },
              { id: 3, name: 'Account 3' }
            ])
          );
        });

        it('should handle invalid ID formats gracefully', () => {
          const request = { query: '?ids=1,invalid,3', body: {} };
          const cacheEntries = cacheManager.getCacheEntries('account');

          const result = cacheManager.lookupById(
            '/account/items',
            request,
            cacheEntries,
            'account'
          );

          expect(result.found).toBe(true);
          expect(result.source).toBe('cache');
          expect(result.cacheHit).toBe(true);
          expect(Array.isArray(result.data)).toBe(true);
          expect(result.data).toHaveLength(2);
          expect(result.data).toEqual(
            expect.arrayContaining([
              { id: 1, name: 'Account 1' },
              { id: 3, name: 'Account 3' }
            ])
          );
        });
      });

      it('should handle empty query and body', () => {
        const request = { query: '', body: {} };
        const cacheEntries = cacheManager.getCacheEntries('account');

        const result = cacheManager.lookupById('/account/item', request, cacheEntries, 'account');

        expect(result.found).toBe(false);
        expect(result.source).toBe('api');
      });
    });

    describe('cacheResponse', () => {
      it('should cache single entity response', () => {
        const entity = { id: 1, name: 'Test Account' };

        expect(() => cacheManager.cacheResponse('/account/item', entity)).not.toThrow();
      });

      it('should cache array response', () => {
        const entities = [
          { id: 1, name: 'Account 1' },
          { id: 2, name: 'Account 2' }
        ];

        expect(() => cacheManager.cacheResponse('/account/items', entities)).not.toThrow();
      });

      it('should skip non-cacheable requests', () => {
        const entity = { id: 1, name: 'Test Account' };

        expect(() => cacheManager.cacheResponse('/account/other', entity)).not.toThrow();
      });
    });
  });
});
