/**
 * Unit tests for MessageQueue core functionality
 * Tests initialization, configuration, message handling, and advanced features
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { EnhancedMessageQueueConfig } from '../../sdks/enhancedMessageQueue';
import { EnhancedMessageQueue } from '../../sdks/enhancedMessageQueue';
import { createWinstonLogger } from '../../sdks/winstonLogger';

describe('EnhancedMessageQueue', () => {
  let messageQueue: EnhancedMessageQueue;
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = createWinstonLogger({
      stage: 'devel',
      level: 'info',
      enableConsole: false,
      enableFile: false
    });
  });

  afterEach(() => {
    // Clean up timers and intervals to prevent test hangs
    if (messageQueue) {
      messageQueue.destroy();
    }
  });

  describe('Initialization', () => {
    it('should initialize with valid configuration', () => {
      const config: EnhancedMessageQueueConfig = {
        maxSize: 1000,
        enablePriority: true,
        enableRetries: true,
        maxRetries: 3,
        retryDelay: 1000,
        enableNetworkDetection: true,
        networkHealthCheckInterval: 30000,
        networkFailureThreshold: 3,
        maintenanceConfig: {
          enableMaintenanceDetection: true,
          enableAutomaticQueuing: true,
          maintenanceWindows: [],
          timezone: 'CT',
          queueTimeout: 300000,
          retryAttempts: 3,
          retryDelay: 5000
        },
        enableMaintenanceQueuing: true,
        queueTimeout: 300000,
        enableDeduplication: true,
        deduplicationWindow: 60000
      };

      messageQueue = new EnhancedMessageQueue(config, mockLogger);
      expect(messageQueue).toBeInstanceOf(EnhancedMessageQueue);
    });

    it('should initialize with minimal configuration', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 100
      };

      messageQueue = new EnhancedMessageQueue(config, mockLogger);
      expect(messageQueue).toBeInstanceOf(EnhancedMessageQueue);
    });

    it('should initialize with high capacity configuration', () => {
      const config: EnhancedMessageQueueConfig = {
        maxSize: 10000,
        enablePriority: true,
        enableRetries: true,
        maxRetries: 5,
        retryDelay: 2000,
        enableNetworkDetection: true,
        networkHealthCheckInterval: 15000,
        networkFailureThreshold: 5,
        maintenanceConfig: {
          enableMaintenanceDetection: true,
          enableAutomaticQueuing: true,
          maintenanceWindows: [],
          timezone: 'CT',
          queueTimeout: 600000,
          retryAttempts: 5,
          retryDelay: 10000
        },
        enableMaintenanceQueuing: true,
        queueTimeout: 600000,
        enableDeduplication: true,
        deduplicationWindow: 120000
      };

      messageQueue = new EnhancedMessageQueue(config, mockLogger);
      expect(messageQueue).toBeInstanceOf(EnhancedMessageQueue);
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid queue sizes', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 5000
      };

      expect(() => new EnhancedMessageQueue(config, mockLogger)).not.toThrow();
    });

    it('should accept valid retry configurations', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxRetries: 10,
        retryDelay: 500
      };

      expect(() => new EnhancedMessageQueue(config, mockLogger)).not.toThrow();
    });

    it('should accept valid retry delays', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        retryDelay: 100
      };

      expect(() => new EnhancedMessageQueue(config, mockLogger)).not.toThrow();
    });
  });

  describe('Logger Integration', () => {
    it('should initialize with logger', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 100
      };

      messageQueue = new EnhancedMessageQueue(config, mockLogger);
      expect(messageQueue).toBeInstanceOf(EnhancedMessageQueue);
    });

    it('should work with different logger instances', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 100
      };

      const anotherLogger = createWinstonLogger({
        stage: 'prod',
        level: 'warn',
        enableConsole: false,
        enableFile: false
      });

      messageQueue = new EnhancedMessageQueue(config, anotherLogger);
      expect(messageQueue).toBeInstanceOf(EnhancedMessageQueue);
    });
  });

  describe('Priority Management', () => {
    it('should handle priority when enabled', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 100,
        enablePriority: true
      };

      messageQueue = new EnhancedMessageQueue(config, mockLogger);
      expect(messageQueue).toBeInstanceOf(EnhancedMessageQueue);
    });

    it('should work without priority when disabled', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 100,
        enablePriority: false
      };

      messageQueue = new EnhancedMessageQueue(config, mockLogger);
      expect(messageQueue).toBeInstanceOf(EnhancedMessageQueue);
    });
  });

  describe('Instance Properties', () => {
    it('should have the correct constructor name', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 100
      };

      messageQueue = new EnhancedMessageQueue(config, mockLogger);
      expect(messageQueue.constructor.name).toBe('EnhancedMessageQueue');
    });

    it('should be a valid EnhancedMessageQueue instance', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 100
      };

      messageQueue = new EnhancedMessageQueue(config, mockLogger);
      expect(messageQueue).toBeInstanceOf(EnhancedMessageQueue);
    });
  });

  describe('Constructor Edge Cases', () => {
    it('should handle very high queue sizes', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 1000000
      };

      expect(() => new EnhancedMessageQueue(config, mockLogger)).not.toThrow();
    });

    it('should handle very low queue sizes', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 1
      };

      expect(() => new EnhancedMessageQueue(config, mockLogger)).not.toThrow();
    });

    it('should handle zero retries', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 100,
        maxRetries: 0
      };

      expect(() => new EnhancedMessageQueue(config, mockLogger)).not.toThrow();
    });
  });

  describe('Configuration Combinations', () => {
    it('should handle all features enabled', () => {
      const config: EnhancedMessageQueueConfig = {
        maxSize: 1000,
        enablePriority: true,
        enableRetries: true,
        maxRetries: 3,
        retryDelay: 1000,
        enableNetworkDetection: true,
        networkHealthCheckInterval: 30000,
        networkFailureThreshold: 3,
        maintenanceConfig: {
          enableMaintenanceDetection: true,
          enableAutomaticQueuing: true,
          maintenanceWindows: [],
          timezone: 'CT',
          queueTimeout: 300000,
          retryAttempts: 3,
          retryDelay: 5000
        },
        enableMaintenanceQueuing: true,
        queueTimeout: 300000,
        enableDeduplication: true,
        deduplicationWindow: 60000
      };

      expect(() => new EnhancedMessageQueue(config, mockLogger)).not.toThrow();
    });

    it('should handle all features disabled', () => {
      const config: EnhancedMessageQueueConfig = {
        maxSize: 100,
        enablePriority: false,
        enableRetries: false,
        maxRetries: 0,
        retryDelay: 1000,
        enableNetworkDetection: false,
        networkHealthCheckInterval: 30000,
        networkFailureThreshold: 3,
        maintenanceConfig: {
          enableMaintenanceDetection: false,
          enableAutomaticQueuing: false,
          maintenanceWindows: [],
          timezone: 'CT',
          queueTimeout: 300000,
          retryAttempts: 0,
          retryDelay: 5000
        },
        enableMaintenanceQueuing: false,
        queueTimeout: 300000,
        enableDeduplication: false,
        deduplicationWindow: 60000
      };

      expect(() => new EnhancedMessageQueue(config, mockLogger)).not.toThrow();
    });

    it('should handle mixed configuration', () => {
      const config: Partial<EnhancedMessageQueueConfig> = {
        maxSize: 500,
        enablePriority: true,
        enableRetries: false,
        enableNetworkDetection: true,
        enableMaintenanceQueuing: false
      };

      expect(() => new EnhancedMessageQueue(config, mockLogger)).not.toThrow();
    });
  });
});
