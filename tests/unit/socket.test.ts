/**
 * Unit tests for Socket core functionality
 * Tests initialization, configuration, and basic functionality
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Socket } from '../../sdks/socket';
import type { EntityName } from '../../types/common';
import { createMockWinstonLogger } from '../setup';

describe('Socket', () => {
  let socket: Socket;
  let mockLogger: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogger = createMockWinstonLogger();
  });

  describe('Initialization', () => {
    it('should initialize with valid configuration', () => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        entityTypes: ['account', 'position', 'order'],
        syncImmediate: true,
        logger: mockLogger
      });

      expect(socket).toBeInstanceOf(Socket);
      expect(socket).toBeDefined();
    });

    it('should initialize with minimal configuration', () => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        logger: mockLogger
      });

      expect(socket).toBeInstanceOf(Socket);
      expect(socket).toBeDefined();
    });

    it('should initialize with all optional parameters', () => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        entityTypes: ['account', 'position', 'order', 'fill', 'alert'],
        syncImmediate: false,
        logger: mockLogger
      });

      expect(socket).toBeInstanceOf(Socket);
      expect(socket).toBeDefined();
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid TDVSocketUrl values', () => {
      const validUrls = [
        'wss://demo.tradovateapi.com/v1/websocket',
        'wss://live.tradovateapi.com/v1/websocket',
        'wss://demo-d.tradovateapi.com/v1/websocket',
        'wss://live-d.tradovateapi.com/v1/websocket'
      ];

      validUrls.forEach(url => {
        expect(
          () =>
            new Socket({
              url: url as any,
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
            new Socket({
              url: 'wss://demo.tradovateapi.com/v1/websocket',
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
            new Socket({
              url: 'wss://demo.tradovateapi.com/v1/websocket',
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
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        logger: mockLogger
      });

      expect(socket).toBeDefined();
      expect(mockLogger).toBeDefined();
    });

    it('should work without logger specified', () => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345
      });

      expect(socket).toBeDefined();
    });
  });

  describe('Entity Types Configuration', () => {
    it('should initialize with single entity type', () => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        entityTypes: ['account'],
        logger: mockLogger
      });

      expect(socket).toBeDefined();
    });

    it('should initialize with multiple entity types', () => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        entityTypes: ['account', 'position', 'order', 'fill'] as EntityName[],
        logger: mockLogger
      });

      expect(socket).toBeDefined();
    });

    it('should initialize without entity types', () => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        logger: mockLogger
      });

      expect(socket).toBeDefined();
    });
  });

  describe('Sync Configuration', () => {
    it('should initialize with immediate sync enabled', () => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        syncImmediate: true,
        logger: mockLogger
      });

      expect(socket).toBeDefined();
    });

    it('should initialize with immediate sync disabled', () => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        syncImmediate: false,
        logger: mockLogger
      });

      expect(socket).toBeDefined();
    });

    it('should use default sync behavior when not specified', () => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        logger: mockLogger
      });

      expect(socket).toBeDefined();
    });
  });

  describe('Instance Properties', () => {
    beforeEach(() => {
      socket = new Socket({
        url: 'wss://demo.tradovateapi.com/v1/websocket',
        accessToken: 'test-token',
        userId: 12345,
        logger: mockLogger
      });
    });

    it('should have the correct constructor name', () => {
      expect(socket.constructor.name).toBe('Socket');
    });

    it('should be a valid Socket instance', () => {
      expect(socket).toBeDefined();
      expect(typeof socket).toBe('object');
    });

    it('should have ready property', () => {
      expect(socket).toHaveProperty('ready');
    });
  });

  describe('Constructor Edge Cases', () => {
    it('should handle empty entity types array', () => {
      expect(
        () =>
          new Socket({
            url: 'wss://demo.tradovateapi.com/v1/websocket',
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
          new Socket({
            url: 'wss://demo.tradovateapi.com/v1/websocket',
            accessToken: longToken,
            userId: 12345,
            logger: mockLogger
          })
      ).not.toThrow();
    });

    it('should handle very large user IDs', () => {
      expect(
        () =>
          new Socket({
            url: 'wss://demo.tradovateapi.com/v1/websocket',
            accessToken: 'test-token',
            userId: Number.MAX_SAFE_INTEGER,
            logger: mockLogger
          })
      ).not.toThrow();
    });
  });
});
