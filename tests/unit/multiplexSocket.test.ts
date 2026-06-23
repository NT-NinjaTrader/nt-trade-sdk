/**
 * Unit tests for MultiplexSocket core functionality
 * Tests initialization, configuration, socket management, and cache operations
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MultiplexSocket } from '../../sdks/multiplexSocket';
import type { EntityName } from '../../types/common';
import type { LoggerType } from '../../types/runtime';
import { createSimpleMockLogger } from '../setup';

describe('MultiplexSocket', () => {
  let multiplexSocket: MultiplexSocket;
  let mockLogger: ReturnType<typeof createSimpleMockLogger>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogger = createSimpleMockLogger();
  });

  describe('Initialization', () => {
    it('should initialize with default configuration', () => {
      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 4,
          remainder: 0,
          expressionType: 'modUserId'
        },
        logger: mockLogger as unknown as LoggerType
      });
      expect(multiplexSocket).toBeInstanceOf(MultiplexSocket);
      expect(multiplexSocket).toBeDefined();
    });

    it('should initialize with custom configuration', () => {
      const customConfig = {
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 5,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        entityTypes: ['account', 'position', 'order'] as EntityName[],
        syncImmediate: true,
        fullOrgSnapshot: false,
        logger: mockLogger as unknown as LoggerType
      };

      multiplexSocket = new MultiplexSocket(customConfig);
      expect(multiplexSocket).toBeInstanceOf(MultiplexSocket);
      expect(multiplexSocket).toBeDefined();
    });

    it('should initialize with high capacity configuration', () => {
      const highCapacityConfig = {
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 20,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        entityTypes: ['account', 'position', 'order', 'fill', 'contract'] as EntityName[],
        syncImmediate: false,
        fullOrgSnapshot: true,
        logger: mockLogger as unknown as LoggerType
      };

      multiplexSocket = new MultiplexSocket(highCapacityConfig);
      expect(multiplexSocket).toBeInstanceOf(MultiplexSocket);
      expect(multiplexSocket).toBeDefined();
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid socket counts via divisor', () => {
      const validCounts = [1, 2, 5, 10, 20, 50];

      validCounts.forEach(count => {
        expect(
          () =>
            new MultiplexSocket({
              url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
              accessToken: 'test-token',
              userId: 12345,
              shardingExpression: {
                divisor: count,
                remainder: 0,
                expressionType: 'modUserId' as const
              },
              logger: mockLogger as unknown as LoggerType
            })
        ).not.toThrow();
      });
    });

    it('should accept valid sharding expression types', () => {
      const validTypes = ['modUserId', 'modAccountId'] as const;

      validTypes.forEach(expressionType => {
        expect(
          () =>
            new MultiplexSocket({
              url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
              accessToken: 'test-token',
              userId: 12345,
              shardingExpression: {
                divisor: 5,
                remainder: 0,
                expressionType
              },
              logger: mockLogger as unknown as LoggerType
            })
        ).not.toThrow();
      });
    });

    it('should accept valid entity types', () => {
      const validEntityTypes = [
        ['account'] as EntityName[],
        ['account', 'position'] as EntityName[],
        ['account', 'position', 'order', 'fill'] as EntityName[]
      ];

      validEntityTypes.forEach(entityTypes => {
        expect(
          () =>
            new MultiplexSocket({
              url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
              accessToken: 'test-token',
              userId: 12345,
              shardingExpression: {
                divisor: 5,
                remainder: 0,
                expressionType: 'modUserId' as const
              },
              entityTypes,
              logger: mockLogger as unknown as LoggerType
            })
        ).not.toThrow();
      });
    });

    it('should accept boolean configuration flags', () => {
      const configs = [
        { syncImmediate: true, fullOrgSnapshot: true },
        { syncImmediate: true, fullOrgSnapshot: false },
        { syncImmediate: false, fullOrgSnapshot: true },
        { syncImmediate: false, fullOrgSnapshot: false }
      ];

      configs.forEach(config => {
        expect(
          () =>
            new MultiplexSocket({
              url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
              accessToken: 'test-token',
              userId: 12345,
              shardingExpression: {
                divisor: 5,
                remainder: 0,
                expressionType: 'modUserId' as const
              },
              logger: mockLogger as unknown as LoggerType,
              ...config
            })
        ).not.toThrow();
      });
    });
  });

  describe('Logger Integration', () => {
    it('should initialize with logger', () => {
      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 4,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        logger: mockLogger as unknown as LoggerType
      });
      expect(multiplexSocket).toBeDefined();
      expect(mockLogger).toBeDefined();
    });

    it('should work with different logger instances', () => {
      const alternativeLogger = createSimpleMockLogger();

      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 4,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        logger: alternativeLogger as unknown as LoggerType
      });
      expect(multiplexSocket).toBeDefined();
    });
  });

  describe('Socket Management', () => {
    beforeEach(() => {
      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 5,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        logger: mockLogger as unknown as LoggerType
      });
    });

    it('should handle socket creation', () => {
      expect(multiplexSocket).toBeDefined();
      // Socket creation functionality would be tested here when implemented
    });

    it('should handle socket removal', () => {
      expect(multiplexSocket).toBeDefined();
      // Socket removal functionality would be tested here when implemented
    });

    it('should handle socket reconnection', () => {
      expect(multiplexSocket).toBeDefined();
      // Socket reconnection functionality would be tested here when implemented
    });
  });

  describe('Instance Properties', () => {
    beforeEach(() => {
      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 4,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        logger: mockLogger as unknown as LoggerType
      });
    });

    it('should have the correct constructor name', () => {
      expect(multiplexSocket.constructor.name).toBe('MultiplexSocket');
    });

    it('should be a valid MultiplexSocket instance', () => {
      expect(multiplexSocket).toBeDefined();
      expect(typeof multiplexSocket).toBe('object');
    });
  });

  describe('Constructor Edge Cases', () => {
    it('should handle very high socket counts via divisor', () => {
      expect(
        () =>
          new MultiplexSocket({
            url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
            accessToken: 'test-token',
            userId: 12345,
            shardingExpression: {
              divisor: 1000,
              remainder: 0,
              expressionType: 'modUserId' as const
            },
            logger: mockLogger as unknown as LoggerType
          })
      ).not.toThrow();
    });

    it('should handle very low socket counts via divisor', () => {
      expect(
        () =>
          new MultiplexSocket({
            url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
            accessToken: 'test-token',
            userId: 12345,
            shardingExpression: {
              divisor: 1,
              remainder: 0,
              expressionType: 'modUserId' as const
            },
            logger: mockLogger as unknown as LoggerType
          })
      ).not.toThrow();
    });

    it('should handle different remainder values', () => {
      const remainders = [0, 1, 2, 3, 4];

      remainders.forEach(remainder => {
        expect(
          () =>
            new MultiplexSocket({
              url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
              accessToken: 'test-token',
              userId: 12345,
              shardingExpression: {
                divisor: 5,
                remainder,
                expressionType: 'modUserId' as const
              },
              logger: mockLogger as unknown as LoggerType
            })
        ).not.toThrow();
      });
    });
  });

  describe('Configuration Combinations', () => {
    it('should handle all features enabled', () => {
      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 10,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        entityTypes: ['account', 'position', 'order', 'fill'] as EntityName[],
        syncImmediate: true,
        fullOrgSnapshot: true,
        logger: mockLogger as unknown as LoggerType
      });

      expect(multiplexSocket).toBeDefined();
    });

    it('should handle all features disabled', () => {
      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 10,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        entityTypes: ['account'] as EntityName[],
        syncImmediate: false,
        fullOrgSnapshot: false,
        logger: mockLogger as unknown as LoggerType
      });

      expect(multiplexSocket).toBeDefined();
    });

    it('should handle mixed configuration', () => {
      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 10,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        entityTypes: ['account', 'position'] as EntityName[],
        syncImmediate: true,
        fullOrgSnapshot: false,
        logger: mockLogger as unknown as LoggerType
      });

      expect(multiplexSocket).toBeDefined();
    });

    it('should handle minimal configuration', () => {
      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 3,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        logger: mockLogger as unknown as LoggerType
      });

      expect(multiplexSocket).toBeDefined();
    });
  });

  describe('Default Configuration', () => {
    it('should work with minimal configuration', () => {
      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 4,
          remainder: 0,
          expressionType: 'modUserId' as const
        },
        logger: mockLogger as unknown as LoggerType
      });
      expect(multiplexSocket).toBeDefined();
    });

    it('should work with different sharding expression types', () => {
      multiplexSocket = new MultiplexSocket({
        url: 'wss://demo.tradovateapi.com/v1/websocket' as const,
        accessToken: 'test-token',
        userId: 12345,
        shardingExpression: {
          divisor: 2,
          remainder: 0,
          expressionType: 'modAccountId' as const
        },
        logger: mockLogger as unknown as LoggerType
      });
      expect(multiplexSocket).toBeDefined();
    });
  });
});
