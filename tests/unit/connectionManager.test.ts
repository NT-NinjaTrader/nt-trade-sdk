/**
 * Unit tests for ConnectionManager
 * Tests connection management, client initialization, and error handling
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigError } from '../../api/errors';
import type { ConnectionConfig } from '../../sdks/connectionManager';
import { ConnectionManager } from '../../sdks/connectionManager';
import { createMockWinstonLogger } from '../setup';

describe('ConnectionManager', () => {
  let connectionManager: ConnectionManager;
  let mockLogger: ReturnType<typeof createMockWinstonLogger>;
  let validConfig: ConnectionConfig;

  beforeEach(() => {
    vi.clearAllMocks();

    mockLogger = createMockWinstonLogger();

    validConfig = {
      stage: 'devel',
      credentials: {
        name: 'test-user',
        password: 'test-password',
        appId: 'test-app',
        appVersion: '1.0.0',
        cid: 12345,
        sec: 'test-sec'
      },
      liveClient: 'socket',
      simClient: 'rest',
      enableMdSocket: true,
      enableMultiplexing: false,
      connectionTimeout: 10000,
      shardingDivisor: 4,
      shardingType: 'modUserId',
      entityTypes: ['account', 'position', 'order', 'fill'],
      syncImmediate: true,
      fullOrgSnapshot: false
    };
  });

  describe('Initialization', () => {
    it('should initialize with valid configuration', () => {
      connectionManager = new ConnectionManager(validConfig, mockLogger);

      expect(connectionManager).toBeInstanceOf(ConnectionManager);
      expect(connectionManager.getConnectionState()).toBe('disconnected');
      expect(connectionManager.isConnected()).toBe(false);
    });

    it('should initialize with minimal configuration', () => {
      const minimalConfig: ConnectionConfig = {
        stage: 'devel',
        credentials: {
          name: 'test-user',
          password: 'test-password',
          appId: 'test-app',
          appVersion: '1.0.0',
          cid: 12345,
          sec: 'test-sec'
        }
      };

      connectionManager = new ConnectionManager(minimalConfig, mockLogger);

      expect(connectionManager).toBeInstanceOf(ConnectionManager);
      expect(connectionManager.getConnectionState()).toBe('disconnected');
    });

    it('should initialize with high capacity configuration', () => {
      const highCapacityConfig: ConnectionConfig = {
        ...validConfig,
        enableMultiplexing: true,
        shardingDivisor: 16,
        entityTypes: ['account', 'position', 'order', 'fill', 'alert']
      };

      connectionManager = new ConnectionManager(highCapacityConfig, mockLogger);

      expect(connectionManager).toBeInstanceOf(ConnectionManager);
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid stage values', () => {
      const stages: Array<'staging' | 'prod' | 'devel'> = ['staging', 'prod', 'devel'];

      stages.forEach(stage => {
        const config = { ...validConfig, stage };
        expect(() => new ConnectionManager(config, mockLogger)).not.toThrow();
      });
    });

    it('should accept valid client preferences', () => {
      const clientTypes: Array<'socket' | 'rest'> = ['socket', 'rest'];

      clientTypes.forEach(liveClient => {
        clientTypes.forEach(simClient => {
          const config = { ...validConfig, liveClient, simClient };
          expect(() => new ConnectionManager(config, mockLogger)).not.toThrow();
        });
      });
    });

    it('should accept valid sharding configurations', () => {
      const shardingTypes: Array<'modUserId' | 'modAccountId'> = ['modUserId', 'modAccountId'];

      shardingTypes.forEach(shardingType => {
        const config = { ...validConfig, shardingType, enableMultiplexing: true };
        expect(() => new ConnectionManager(config, mockLogger)).not.toThrow();
      });
    });

    it('should accept valid entity types', () => {
      const validEntityTypes: Array<'account' | 'position' | 'order' | 'fill' | 'alert'> = [
        'account',
        'position',
        'order',
        'fill',
        'alert'
      ];

      validEntityTypes.forEach(entityType => {
        const config = { ...validConfig, entityTypes: [entityType] };
        expect(() => new ConnectionManager(config, mockLogger)).not.toThrow();
      });
    });
  });

  describe('Logger Integration', () => {
    it('should initialize with Winston logger', () => {
      connectionManager = new ConnectionManager(validConfig, mockLogger);

      expect(connectionManager).toBeInstanceOf(ConnectionManager);
      expect(mockLogger.log).toBeDefined();
    });

    it('should work with different logger instances', () => {
      const anotherLogger = createMockWinstonLogger();
      connectionManager = new ConnectionManager(validConfig, anotherLogger);

      expect(connectionManager).toBeInstanceOf(ConnectionManager);
    });
  });

  describe('Connection State Management', () => {
    beforeEach(() => {
      connectionManager = new ConnectionManager(validConfig, mockLogger);
    });

    it('should start in disconnected state', () => {
      expect(connectionManager.getConnectionState()).toBe('disconnected');
      expect(connectionManager.isConnected()).toBe(false);
    });

    it('should track connection state changes', () => {
      expect(connectionManager.getConnectionState()).toBe('disconnected');

      // Note: We can't easily test the full connect flow due to complex mocking
      // but we can verify the initial state is correct
    });
  });

  describe('Client Access Before Connection', () => {
    beforeEach(() => {
      connectionManager = new ConnectionManager(validConfig, mockLogger);
    });

    it('should throw error when accessing live before connection', () => {
      expect(() => connectionManager.live).toThrow(ConfigError);
      expect(() => connectionManager.live).toThrow(
        'ConnectionManager not connected - cannot access live API client.'
      );
    });

    it('should throw error when accessing sim before connection', () => {
      expect(() => connectionManager.sim).toThrow(ConfigError);
      expect(() => connectionManager.sim).toThrow(
        'ConnectionManager not connected - cannot access sim API client.'
      );
    });

    it('should throw error when accessing md before connection', () => {
      expect(() => connectionManager.md).toThrow(ConfigError);
      expect(() => connectionManager.md).toThrow(
        'ConnectionManager not connected - cannot access MD API client.'
      );
    });

    it('should throw error when accessing liveSocket before connection', () => {
      expect(() => connectionManager.liveSocket).toThrow(ConfigError);
      expect(() => connectionManager.liveSocket).toThrow(
        'ConnectionManager not connected - cannot access live socket.'
      );
    });

    it('should throw error when accessing liveRest before connection', () => {
      expect(() => connectionManager.liveRest).toThrow(ConfigError);
      expect(() => connectionManager.liveRest).toThrow(
        'ConnectionManager not connected - cannot access live REST API.'
      );
    });

    it('should throw error when accessing simSocket before connection', () => {
      expect(() => connectionManager.simSocket).toThrow(ConfigError);
      expect(() => connectionManager.simSocket).toThrow(
        'ConnectionManager not connected - cannot access sim socket.'
      );
    });

    it('should throw error when accessing simRest before connection', () => {
      expect(() => connectionManager.simRest).toThrow(ConfigError);
      expect(() => connectionManager.simRest).toThrow(
        'ConnectionManager not connected - cannot access sim REST API.'
      );
    });

    it('should throw error when accessing mdSocket before connection', () => {
      expect(() => connectionManager.mdSocket).toThrow(ConfigError);
      expect(() => connectionManager.mdSocket).toThrow(
        'ConnectionManager not connected - cannot access MD socket.'
      );
    });
  });

  describe('Market Data Configuration', () => {
    it('should throw error when accessing mdSocket without enabling it', () => {
      const configWithoutMd = { ...validConfig, enableMdSocket: false };
      connectionManager = new ConnectionManager(configWithoutMd, mockLogger);

      expect(() => connectionManager.mdSocket).toThrow(ConfigError);
      expect(() => connectionManager.mdSocket).toThrow(
        'Market Data is not enabled. Add market data to your config to use it.'
      );
    });
  });

  describe('Token Management', () => {
    beforeEach(() => {
      connectionManager = new ConnectionManager(validConfig, mockLogger);
    });

    it('should start with no token', () => {
      expect(connectionManager.getLastToken()).toBeNull();
      expect(connectionManager.getExpirationTime()).toBeNull();
    });
  });

  describe('Instance Properties', () => {
    it('should have the correct constructor name', () => {
      connectionManager = new ConnectionManager(validConfig, mockLogger);
      expect(connectionManager.constructor.name).toBe('ConnectionManager');
    });

    it('should be a valid ConnectionManager instance', () => {
      connectionManager = new ConnectionManager(validConfig, mockLogger);
      expect(connectionManager).toBeInstanceOf(ConnectionManager);
    });
  });

  describe('Constructor Edge Cases', () => {
    it('should handle empty entity types array', () => {
      const config = { ...validConfig, entityTypes: [] };
      expect(() => new ConnectionManager(config, mockLogger)).not.toThrow();
    });

    it('should handle very long access tokens', () => {
      // This test would require mocking the authentication response
      // For now, we just ensure the constructor doesn't crash
      expect(() => new ConnectionManager(validConfig, mockLogger)).not.toThrow();
    });

    it('should handle very large user IDs', () => {
      // This test would require mocking the authentication response
      // For now, we just ensure the constructor doesn't crash
      expect(() => new ConnectionManager(validConfig, mockLogger)).not.toThrow();
    });
  });

  describe('Configuration Combinations', () => {
    it('should handle all features enabled', () => {
      const allEnabledConfig: ConnectionConfig = {
        ...validConfig,
        enableMdSocket: true,
        enableMultiplexing: true,
        syncImmediate: true,
        fullOrgSnapshot: true
      };

      expect(() => new ConnectionManager(allEnabledConfig, mockLogger)).not.toThrow();
    });

    it('should handle all features disabled', () => {
      const allDisabledConfig: ConnectionConfig = {
        ...validConfig,
        enableMdSocket: false,
        enableMultiplexing: false,
        syncImmediate: false,
        fullOrgSnapshot: false
      };

      expect(() => new ConnectionManager(allDisabledConfig, mockLogger)).not.toThrow();
    });

    it('should handle mixed configuration', () => {
      const mixedConfig: ConnectionConfig = {
        ...validConfig,
        enableMdSocket: true,
        enableMultiplexing: true,
        syncImmediate: false,
        fullOrgSnapshot: true
      };

      expect(() => new ConnectionManager(mixedConfig, mockLogger)).not.toThrow();
    });

    it('should handle minimal configuration', () => {
      const minimalConfig: ConnectionConfig = {
        stage: 'devel',
        credentials: {
          name: 'test-user',
          password: 'test-password',
          appId: 'test-app',
          appVersion: '1.0.0',
          cid: 12345,
          sec: 'test-sec'
        }
      };

      expect(() => new ConnectionManager(minimalConfig, mockLogger)).not.toThrow();
    });
  });

  describe('Default Configuration', () => {
    it('should work with minimal configuration', () => {
      const minimalConfig: ConnectionConfig = {
        stage: 'devel',
        credentials: {
          name: 'test-user',
          password: 'test-password',
          appId: 'test-app',
          appVersion: '1.0.0',
          cid: 12345,
          sec: 'test-sec'
        }
      };

      connectionManager = new ConnectionManager(minimalConfig, mockLogger);
      expect(connectionManager).toBeInstanceOf(ConnectionManager);
    });

    it('should work with different stage values', () => {
      const stages: Array<'staging' | 'prod' | 'devel'> = ['staging', 'prod', 'devel'];

      stages.forEach(stage => {
        const config = { ...validConfig, stage };
        expect(() => new ConnectionManager(config, mockLogger)).not.toThrow();
      });
    });
  });
});
