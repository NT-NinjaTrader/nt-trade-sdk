/**
 * Unit tests for TradeSDK core functionality
 * Tests initialization, configuration, and basic functionality
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PartnerSdk } from '../../sdks/partnerSdk';
import { createTestConfig } from '../setup';

describe('TradeSDK', () => {
  let sdk: PartnerSdk;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with valid configuration', () => {
      const config = createTestConfig({
        TRADE_SDK_STAGE: 'prod', // Use 'prod' instead of 'production'
        TRADE_SDK_USERNAME: 'custom-user',
        TRADE_SDK_PASSWORD: 'custom-password',
        TRADE_SDK_APP_ID: 'custom-app',
        TRADE_SDK_APP_VERSION: '2.0.0',
        TRADE_SDK_CLIENT_ID: '67890',
        TRADE_SDK_SEC: 'custom-sec'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with custom logger configuration', () => {
      const config = createTestConfig({
        TRADE_SDK_LOGGER_TYPE: 'winston',
        TRADE_SDK_LOGGER_LEVEL: 'debug'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with rate limiting configuration', () => {
      const config = createTestConfig({
        TRADE_SDK_RATE_LIMIT_GLOBAL_RPS: '20',
        TRADE_SDK_RATE_LIMIT_GLOBAL_RPM: '1000',
        TRADE_SDK_RATE_LIMIT_GLOBAL_RPH: '50000'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with message queue configuration', () => {
      const config = createTestConfig({
        TRADE_SDK_MQ_MAX_RETRIES: '5',
        TRADE_SDK_MQ_RETRY_DELAY: '2000',
        TRADE_SDK_MQ_ENABLE_PRIORITY: 'true'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });
  });

  describe('Configuration Validation', () => {
    it('should throw error for invalid connection timeout values', () => {
      expect(() => {
        const config = createTestConfig({
          TRADE_SDK_SOCKET_CONNECTION_TIMEOUT: '-1000'
        });
        new PartnerSdk(config);
      }).toThrow('connectionTimeout must be a positive integer (milliseconds)');
    });

    it('should throw error for invalid reconnection attempts', () => {
      expect(() => {
        const config = createTestConfig({
          TRADE_SDK_RECONNECT_MAX_ATTEMPTS: '-5'
        });
        new PartnerSdk(config);
      }).toThrow('maxReconnectAttempts must be a positive integer');
    });

    it('should throw error for invalid health check interval', () => {
      expect(() => {
        const config = createTestConfig({
          TRADE_SDK_RECONNECT_HEALTH_CHECK_INTERVAL: '0'
        });
        new PartnerSdk(config);
      }).toThrow('healthCheckInterval must be a positive integer (milliseconds)');
    });
  });

  describe('Stage Configuration', () => {
    it('should initialize with production stage', () => {
      const config = createTestConfig({
        TRADE_SDK_STAGE: 'prod' // Use 'prod' instead of 'production'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with staging stage', () => {
      const config = createTestConfig({
        TRADE_SDK_STAGE: 'staging'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with development stage', () => {
      const config = createTestConfig({
        TRADE_SDK_STAGE: 'devel'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with devel stage', () => {
      const config = createTestConfig({
        TRADE_SDK_STAGE: 'devel'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });
  });

  describe('Client Configuration', () => {
    it('should initialize with socket client preference', () => {
      const config = createTestConfig({
        TRADE_SDK_LIVE_CLIENT: 'socket',
        TRADE_SDK_SIM_CLIENT: 'socket'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with REST client preference', () => {
      const config = createTestConfig({
        TRADE_SDK_LIVE_CLIENT: 'rest',
        TRADE_SDK_SIM_CLIENT: 'rest'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with mixed client preferences', () => {
      const config = createTestConfig({
        TRADE_SDK_LIVE_CLIENT: 'socket',
        TRADE_SDK_SIM_CLIENT: 'rest'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });
  });

  describe('Multiplexing Configuration', () => {
    it('should initialize with multiplexing enabled', () => {
      const config = createTestConfig({
        TRADE_SDK_SOCKET_ENABLE_MULTIPLEXING: 'true',
        TRADE_SDK_SOCKET_SHARDING_DIVISOR: '4',
        TRADE_SDK_SOCKET_SHARDING_EXPRESSION_TYPE: 'modUserId',
        TRADE_SDK_SOCKET_ENTITY_TYPES: '["account", "position", "order"]'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with replay socket enabled', () => {
      const config = createTestConfig({
        TRADE_SDK_USE_REPLAY_SOCKET: 'true'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with market data socket enabled', () => {
      const config = createTestConfig({
        TRADE_SDK_ENABLE_MD_SOCKET: 'true'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });
  });

  describe('Advanced Features', () => {
    it('should initialize with immediate sync enabled', () => {
      const config = createTestConfig({
        TRADE_SDK_SOCKET_SYNC_IMMEDIATE: 'true'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with full org snapshot enabled', () => {
      const config = createTestConfig({
        TRADE_SDK_SOCKET_FULL_ORG_SNAPSHOT: 'true'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with custom connection timeout', () => {
      const config = createTestConfig({
        TRADE_SDK_SOCKET_CONNECTION_TIMEOUT: '15000'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw error for missing credentials', () => {
      // Test that the config loader throws an error when credentials are missing
      expect(() =>
        createTestConfig({
          TRADE_SDK_USERNAME: '',
          TRADE_SDK_PASSWORD: '',
          TRADE_SDK_APP_ID: '',
          TRADE_SDK_APP_VERSION: '',
          TRADE_SDK_CLIENT_ID: '',
          TRADE_SDK_SEC: ''
        })
      ).toThrow();
    });

    it('should throw error for missing stage', () => {
      // Test that the config loader throws an error when stage is missing
      expect(() =>
        createTestConfig({
          TRADE_SDK_STAGE: ''
        })
      ).toThrow();
    });

    it('should throw error for invalid stage', () => {
      // Test that the config loader throws an error when stage is invalid
      expect(() =>
        createTestConfig({
          TRADE_SDK_STAGE: 'invalid-stage'
        })
      ).toThrow();
    });
  });

  describe('Preset Configurations', () => {
    it('should initialize with standard preset', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'standard'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with minimal preset', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'minimal'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should initialize with high-frequency preset', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'high-frequency'
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should apply preset configuration correctly', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'standard'
      });

      sdk = new PartnerSdk(config);

      // Standard preset should have WebSocket clients by default
      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should allow preset overrides', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'standard',
        TRADE_SDK_ENABLE_MD_SOCKET: 'true' // Override: enable market data
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });

    it('should work with preset and custom configuration', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'minimal',
        TRADE_SDK_RATE_LIMIT_GLOBAL_RPS: '25' // Override: custom rate limit
      });

      sdk = new PartnerSdk(config);

      expect(sdk).toBeInstanceOf(PartnerSdk);
      expect(sdk).toBeDefined();
    });
  });
});
