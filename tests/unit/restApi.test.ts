/**
 * Unit tests for RestApi core functionality
 * Tests initialization, configuration, and basic functionality
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RestApi } from '../../sdks/restApi';
import type { EntityName } from '../../types/common';
import { createMockWinstonLogger } from '../setup';

describe('RestApi', () => {
  let restApi: RestApi;
  let mockLogger: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogger = createMockWinstonLogger();
  });

  describe('Initialization', () => {
    it('should initialize with valid configuration', () => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345,
        entityTypes: ['account', 'position', 'order'],
        logger: mockLogger
      });

      expect(restApi).toBeInstanceOf(RestApi);
      expect(restApi).toBeDefined();
    });

    it('should initialize with minimal configuration', () => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345
      });

      expect(restApi).toBeInstanceOf(RestApi);
      expect(restApi).toBeDefined();
    });

    it('should initialize with all optional parameters', () => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345,
        entityTypes: ['account', 'position', 'order', 'fill', 'alert'],
        logger: mockLogger
      });

      expect(restApi).toBeInstanceOf(RestApi);
      expect(restApi).toBeDefined();
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid TDVLiveUrl values', () => {
      const validUrls = [
        'https://demo.tradovateapi.com/v1',
        'https://live.tradovateapi.com/v1',
        'https://demo-d.tradovateapi.com/v1',
        'https://live-d.tradovateapi.com/v1'
      ];

      validUrls.forEach(url => {
        expect(
          () =>
            new RestApi({
              baseUrl: url as any,
              accessToken: 'test-token',
              userId: 12345,
              logger: mockLogger
            })
        ).not.toThrow();
      });
    });

    it('should accept valid entity types', () => {
      const validEntityTypes: EntityName[][] = [
        ['account'],
        ['position', 'order'],
        ['account', 'position', 'order', 'fill'],
        ['user', 'product', 'contract']
      ];

      validEntityTypes.forEach(entityTypes => {
        expect(
          () =>
            new RestApi({
              baseUrl: 'https://demo.tradovateapi.com/v1',
              accessToken: 'test-token',
              userId: 12345,
              entityTypes,
              logger: mockLogger
            })
        ).not.toThrow();
      });
    });

    it('should accept valid user IDs', () => {
      const validUserIds = [1, 12345, 999999];

      validUserIds.forEach(userId => {
        expect(
          () =>
            new RestApi({
              baseUrl: 'https://demo.tradovateapi.com/v1',
              accessToken: 'test-token',
              userId,
              logger: mockLogger
            })
        ).not.toThrow();
      });
    });
  });

  describe('Logger Integration', () => {
    it('should initialize with Winston logger', () => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345,
        logger: mockLogger
      });

      expect(restApi).toBeDefined();
      expect(mockLogger).toBeDefined();
    });

    it('should create default Winston logger when not specified', () => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345
      });

      expect(restApi).toBeDefined();
    });
  });

  describe('Entity Types Configuration', () => {
    it('should initialize with single entity type', () => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345,
        entityTypes: ['account'],
        logger: mockLogger
      });

      expect(restApi).toBeDefined();
    });

    it('should initialize with multiple entity types', () => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345,
        entityTypes: ['account', 'position', 'order', 'fill'] as EntityName[],
        logger: mockLogger
      });

      expect(restApi).toBeDefined();
    });

    it('should initialize without entity types', () => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345,
        logger: mockLogger
      });

      expect(restApi).toBeDefined();
    });
  });

  describe('Instance Properties', () => {
    beforeEach(() => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345,
        logger: mockLogger
      });
    });

    it('should have the correct constructor name', () => {
      expect(restApi.constructor.name).toBe('RestApi');
    });

    it('should be a valid RestApi instance', () => {
      expect(restApi).toBeDefined();
      expect(typeof restApi).toBe('object');
    });
  });

  describe('Constructor Edge Cases', () => {
    it('should handle empty entity types array', () => {
      expect(
        () =>
          new RestApi({
            baseUrl: 'https://demo.tradovateapi.com/v1',
            accessToken: 'test-token',
            userId: 12345,
            entityTypes: [],
            logger: mockLogger
          })
      ).not.toThrow();
    });

    it('should handle very long access tokens', () => {
      const longToken = 'a'.repeat(1000);
      expect(
        () =>
          new RestApi({
            baseUrl: 'https://demo.tradovateapi.com/v1',
            accessToken: longToken,
            userId: 12345,
            logger: mockLogger
          })
      ).not.toThrow();
    });

    it('should handle very large user IDs', () => {
      expect(
        () =>
          new RestApi({
            baseUrl: 'https://demo.tradovateapi.com/v1',
            accessToken: 'test-token',
            userId: Number.MAX_SAFE_INTEGER,
            logger: mockLogger
          })
      ).not.toThrow();
    });

    it('should handle very long base URLs', () => {
      const longUrl = 'https://' + 'a'.repeat(1000) + '.com/v1';
      expect(
        () =>
          new RestApi({
            baseUrl: longUrl,
            accessToken: 'test-token',
            userId: 12345,
            logger: mockLogger
          })
      ).not.toThrow();
    });
  });

  describe('Default Logger Creation', () => {
    it('should create default logger with production stage', () => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345
      });

      expect(restApi).toBeDefined();
      // The default logger is created internally, we just verify the instance is created
    });

    it('should work with minimal configuration', () => {
      restApi = new RestApi({
        baseUrl: 'https://demo.tradovateapi.com/v1',
        accessToken: 'test-token',
        userId: 12345
      });

      expect(restApi).toBeDefined();
    });
  });
});
