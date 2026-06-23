/**
 * Preset Configuration System
 *
 * Provides pre-configured settings for common partner use cases,
 * guiding partners toward best practices while keeping configuration simple.
 */

import type { AdvancedTradeClientConfig } from './tradeClient';

/**
 * Available preset configurations
 */
export type PresetType = 'standard' | 'minimal' | 'high-frequency' | 'development';

/**
 * Runtime constant containing all preset values
 * Useful for JavaScript consumers who can't access TypeScript types
 */
export const PRESET_TYPES = ['standard', 'minimal', 'high-frequency', 'development'] as const;

/**
 * Preset configuration definitions
 */
export const PRESET_CONFIGS: Record<PresetType, Partial<AdvancedTradeClientConfig>> = {
  /**
   * Standard Partner Preset
   *
   * Optimized for most partners with:
   * - WebSocket clients for real-time experience
   * - Comprehensive entity updates (account, position, order, fill, risk, cash)
   * - Intelligent caching and rate limiting
   * - Maintenance handling and message queuing
   * - Market data enabled for comprehensive trading experience
   */
  standard: {
    // Client configuration - favor WebSocket for real-time experience
    liveClient: 'socket',
    simClient: 'socket',

    // Feature flags - enable market data for comprehensive trading
    enableMdSocket: true,
    // useReplaySocket removed - no partners using in production
    enableMultiplexing: true,

    // Connection settings
    connectionTimeout: 10000,

    // Sharding configuration - optimized for most partners
    shardingDivisor: 4,
    shardingType: 'modUserId',
    entityTypes: [
      'user',
      'account',
      'position',
      'order',
      'fill',
      'accountRiskStatus',
      'fillPair',
      'cashBalance'
    ],

    // Sync settings
    syncImmediate: true,
    fullOrgSnapshot: false,

    // Health monitoring
    healthCheckInterval: 30000,
    healthCheckTimeout: 5000,
    enableVerboseLogging: false,

    // Reconnection settings
    maxReconnectAttempts: 5,
    reconnectDelay: 5000,
    exponentialBackoff: true,

    // Rate limiting - conservative but effective
    rateLimiting: {
      requestsPerSecond: 10,
      requestsPerMinute: 500,
      requestsPerHour: 10000,
      burstMultiplier: 2,
      enableBackoff: true,
      maxBackoffTime: 30000,
      logViolations: true
    },

    // Message queue - enable maintenance handling
    messageQueue: {
      maxSize: 1000,
      enableRetries: true,
      maxRetries: 3,
      retryDelay: 1000,
      enableMaintenanceQueuing: true,
      queueTimeout: 300000,
      enableDeduplication: true,
      deduplicationWindow: 60000
    },

    // Cache configuration - intelligent caching enabled
    cache: {
      maxAge: 5 * 60 * 1000, // 5 minutes
      maxEntries: {
        account: 10000,
        position: 5000,
        order: 2500,
        fill: 10000,
        accountRiskStatus: 1000,
        fillPair: 5000,
        cashBalance: 1000,
        default: 1000
      }
      // Cache options removed - using sensible defaults
    }
  },

  /**
   * Minimal Preset
   *
   * For partners who want the simplest possible configuration:
   * - Basic WebSocket clients
   * - Essential entity updates (account, position, order, fill, cash)
   * - Minimal features enabled
   * - No advanced features
   */
  minimal: {
    // Client configuration
    liveClient: 'socket',
    simClient: 'socket',

    // Feature flags - minimal features
    enableMdSocket: false,
    // useReplaySocket removed - no partners using in production
    enableMultiplexing: false,

    // Connection settings
    connectionTimeout: 10000,

    // Sharding configuration - disabled for simplicity
    shardingDivisor: undefined,
    shardingType: undefined,
    entityTypes: ['account', 'position', 'order', 'fill', 'cashBalance'],

    // Sync settings
    syncImmediate: true,
    fullOrgSnapshot: false,

    // Health monitoring - basic
    healthCheckInterval: 60000,
    healthCheckTimeout: 5000,
    enableVerboseLogging: false,

    // Reconnection settings - basic
    maxReconnectAttempts: 3,
    reconnectDelay: 5000,
    exponentialBackoff: true,

    // Rate limiting - basic
    rateLimiting: {
      requestsPerSecond: 5,
      requestsPerMinute: 200,
      requestsPerHour: 5000,
      burstMultiplier: 1.5,
      enableBackoff: true,
      maxBackoffTime: 15000,
      logViolations: false
    },

    // Message queue - minimal
    messageQueue: {
      maxSize: 100,
      enableRetries: true,
      maxRetries: 2,
      retryDelay: 2000,
      enableMaintenanceQueuing: false,
      queueTimeout: 300000,
      enableDeduplication: false,
      deduplicationWindow: 60000
    },

    // Cache configuration - basic
    cache: {
      maxAge: 2 * 60 * 1000, // 2 minutes
      maxEntries: {
        account: 1000,
        position: 500,
        order: 250,
        fill: 1000,
        cashBalance: 100,
        default: 100
      }
      // Cache options removed - using sensible defaults
    }
  },

  /**
   * High-Frequency Preset
   *
   * For advanced partners with high-frequency trading needs:
   * - Optimized for performance
   * - Comprehensive entity updates (all real-time data)
   * - Advanced features enabled
   * - Higher rate limits
   * - Market data enabled for comprehensive trading
   */
  'high-frequency': {
    // Client configuration
    liveClient: 'socket',
    simClient: 'socket',

    // Feature flags - all features enabled
    enableMdSocket: true, // Market data enabled for comprehensive trading
    // useReplaySocket removed - no partners using in production
    enableMultiplexing: true,

    // Connection settings - optimized
    connectionTimeout: 5000,

    // Sharding configuration - optimized for high frequency
    shardingDivisor: 8,
    shardingType: 'modUserId',
    entityTypes: [
      'user',
      'account',
      'position',
      'order',
      'fill',
      'accountRiskStatus',
      'fillPair',
      'cashBalance'
    ],

    // Sync settings
    syncImmediate: true,
    fullOrgSnapshot: true,

    // Health monitoring - frequent checks
    healthCheckInterval: 15000,
    healthCheckTimeout: 3000,
    enableVerboseLogging: false,

    // Reconnection settings - aggressive
    maxReconnectAttempts: 10,
    reconnectDelay: 1000,
    exponentialBackoff: true,

    // Rate limiting - high limits
    rateLimiting: {
      requestsPerSecond: 50,
      requestsPerMinute: 2000,
      requestsPerHour: 50000,
      burstMultiplier: 3,
      enableBackoff: true,
      maxBackoffTime: 60000,
      logViolations: true
    },

    // Message queue - high capacity
    messageQueue: {
      maxSize: 5000,
      enableRetries: true,
      maxRetries: 5,
      retryDelay: 500,
      enableMaintenanceQueuing: true,
      queueTimeout: 600000,
      enableDeduplication: true,
      deduplicationWindow: 30000
    },

    // Cache configuration - optimized
    cache: {
      maxAge: 1 * 60 * 1000, // 1 minute for freshness
      maxEntries: {
        account: 50000,
        position: 25000,
        order: 10000,
        fill: 50000,
        accountRiskStatus: 5000,
        fillPair: 25000,
        cashBalance: 5000,
        default: 5000
      }
      // Cache options removed - using sensible defaults
    }
  },

  /**
   * Development Preset
   *
   * Optimized for development and testing with:
   * - REST clients for easier debugging
   * - Verbose logging and health monitoring
   * - Market data enabled for comprehensive testing
   * - Relaxed rate limits for development
   * - Extended timeouts for debugging
   */
  development: {
    // Client configuration - REST for easier debugging
    liveClient: 'rest',
    simClient: 'rest',

    // Feature flags - enable market data for testing
    enableMdSocket: true,
    // useReplaySocket removed - no partners using in production
    enableMultiplexing: false, // Disable for simpler debugging

    // Connection settings - extended timeouts for debugging
    connectionTimeout: 30000,

    // Sharding configuration - minimal for development
    shardingDivisor: 1,
    shardingType: 'modUserId',
    entityTypes: [
      'account',
      'position',
      'order',
      'fill',
      'accountRiskStatus',
      'fillPair',
      'cashBalance'
    ],

    // Sync settings
    syncImmediate: true,
    fullOrgSnapshot: false,

    // Health monitoring - frequent checks with verbose logging
    healthCheckInterval: 15000,
    healthCheckTimeout: 10000,
    enableVerboseLogging: true,

    // Reconnection settings - aggressive for development
    maxReconnectAttempts: 10,
    reconnectDelay: 2000,
    exponentialBackoff: true,

    // Rate limiting - relaxed for development
    rateLimiting: {
      requestsPerSecond: 5,
      requestsPerMinute: 200,
      requestsPerHour: 5000,
      burstMultiplier: 1,
      enableBackoff: false, // Disable backoff for easier debugging
      maxBackoffTime: 5000,
      logViolations: true
    },

    // Message queue - minimal for development
    messageQueue: {
      maxSize: 100,
      enableRetries: true,
      maxRetries: 2,
      retryDelay: 2000,
      enableMaintenanceQueuing: true,
      queueTimeout: 600000,
      enableDeduplication: false, // Disable for easier debugging
      deduplicationWindow: 30000
    },

    // Cache configuration - minimal for development
    cache: {
      maxAge: 2 * 60 * 1000, // 2 minutes for development
      maxEntries: {
        account: 100,
        position: 50,
        order: 100,
        fill: 200,
        accountRiskStatus: 50,
        fillPair: 100,
        cashBalance: 50,
        default: 50
      }
      // Cache options removed - using sensible defaults
    }
  }
};

/**
 * Applies a preset configuration to a TradeClientConfig
 *
 * @param {AdvancedTradeClientConfig} config - the base configuration
 * @param {PresetType} preset - the preset to apply
 * @returns {AdvancedTradeClientConfig} merged configuration with preset applied
 */
export function applyPreset(
  config: Partial<AdvancedTradeClientConfig>,
  preset: PresetType
): Partial<AdvancedTradeClientConfig> {
  const presetConfig = PRESET_CONFIGS[preset];

  // Deep merge the preset with the provided config
  // Preset values are overridden by explicit config values
  return {
    ...presetConfig,
    ...config,
    // Deep merge nested objects
    rateLimiting: config.rateLimiting
      ? {
          ...presetConfig.rateLimiting,
          ...config.rateLimiting
        }
      : presetConfig.rateLimiting,
    messageQueue: config.messageQueue
      ? {
          ...presetConfig.messageQueue,
          ...config.messageQueue
        }
      : presetConfig.messageQueue,
    cache: config.cache
      ? {
          ...presetConfig.cache,
          ...config.cache,
          // Deep merge max entries
          maxEntries: {
            ...presetConfig.cache?.maxEntries,
            ...config.cache?.maxEntries
          }
        }
      : presetConfig.cache
  };
}

/**
 * Gets a preset configuration by name
 *
 * @param {PresetType} preset - the preset name
 * @returns {Partial<AdvancedTradeClientConfig>} the preset configuration
 */
export function getPreset(preset: PresetType): Partial<AdvancedTradeClientConfig> {
  return PRESET_CONFIGS[preset];
}

/**
 * Lists all available presets with descriptions
 */
export function listPresets(): Array<{ name: PresetType; description: string }> {
  return [
    {
      name: 'standard',
      description:
        'Recommended for most partners. WebSocket clients, comprehensive entity updates, intelligent caching, market data enabled.'
    },
    {
      name: 'minimal',
      description: 'Simplest configuration. Basic WebSocket clients, essential entity updates only.'
    },
    {
      name: 'high-frequency',
      description:
        'For high-frequency trading. Optimized performance, comprehensive real-time updates, market data enabled.'
    },
    {
      name: 'development',
      description:
        'For development and testing. REST clients, verbose logging, relaxed rate limits, market data enabled.'
    }
  ];
}
