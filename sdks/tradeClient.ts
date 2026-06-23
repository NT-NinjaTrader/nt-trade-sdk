import EventEmitter from 'eventemitter3';
import type { Credentials, EntityName, TdvStage } from '../types/common';

import type { MaintenanceConfig } from '../types/maintenance';
import type { ApiClient } from './apiClient';
import { ConnectionManager } from './connectionManager';
import { EnhancedMessageQueue, type EnhancedMessageQueueConfig } from './enhancedMessageQueue';
import { HealthMonitor, type HealthCheckFunctions } from './healthMonitor';
import type { MdApiClient } from './mdApiClient';
import { applyPreset, type PresetType } from './presetConfigs';
import { RateLimiter, type RateLimitConfig } from './rateLimiter';
import type { WinstonLogger, WinstonLoggerConfig } from './winstonLogger';
import { createWinstonLogger, DEFAULT_WINSTON_CONFIGS } from './winstonLogger';

import { AuthError, RateLimitError, type SdkError } from '../api/errors';

/**
 * Error handler callback type
 */
export type ErrorHandler = (error: SdkError) => void;

/**
 * Simplified configuration interface for common use cases.
 * Most partners should use this interface with presets.
 */
export interface SimpleTradeClientConfig {
  stage: TdvStage;
  credentials: Credentials;

  // Preset configuration - applies a predefined configuration (recommended)
  preset?: PresetType;

  // Client configuration - which transport to use?
  liveClient?: 'socket' | 'rest';
  simClient?: 'socket' | 'rest';

  // Feature flags - enable/disable major features
  enableMdSocket?: boolean;
  enableMultiplexing?: boolean;

  // Connection settings - basic connection tuning
  connectionTimeout?: number;

  // Health monitoring - basic health check tuning
  healthCheckInterval?: number;

  // Reconnection settings - basic reconnection tuning
  maxReconnectAttempts?: number;
  reconnectDelay?: number;

  // Rate limiting - basic rate limiting
  rateLimiting?: {
    requestsPerSecond?: number;
    requestsPerMinute?: number;
    requestsPerHour?: number;
  };

  // Cache configuration - basic cache tuning
  cache?: {
    maxAge?: number;
    maxEntries?: {
      account?: number;
      position?: number;
      order?: number;
      fill?: number;
      accountRiskStatus?: number;
      fillPair?: number;
      cashBalance?: number;
      default?: number;
    };
  };

  // Error handlers - global callbacks for error handling
  /** Called for any SDK error (after retries exhausted) */
  onError?: ErrorHandler;
  /** Called specifically for auth errors (401, 403) - use for token refresh */
  onAuthError?: ErrorHandler;
  /** Called specifically for rate limit errors (429) */
  onRateLimitError?: ErrorHandler;
}

/**
 * Advanced configuration interface for power users.
 * Contains all configuration options including advanced features.
 */
export interface AdvancedTradeClientConfig extends SimpleTradeClientConfig {
  // Advanced feature flags
  // useReplaySocket removed - no partners using in production

  // Advanced connection settings
  shardingDivisor?: number;
  shardingType?: 'modUserId' | 'modAccountId';
  entityTypes?: EntityName[];

  // Advanced sync settings
  /** Whether to sync entities immediately after connection. Defaults to true. */
  syncImmediate?: boolean;
  fullOrgSnapshot?: boolean;

  // Advanced health monitoring
  healthCheckTimeout?: number;
  enableVerboseLogging?: boolean;

  // Advanced reconnection settings
  exponentialBackoff?: boolean;

  // Advanced rate limiting
  rateLimiting?: RateLimitConfig;

  // Advanced message queue
  messageQueue?: EnhancedMessageQueueConfig;

  // Advanced maintenance configuration
  maintenance?: MaintenanceConfig;

  // Advanced logger configuration
  logger?: WinstonLoggerConfig;

  // Advanced cache configuration
  cache?: {
    maxAge?: number;
    maxEntries?: {
      account?: number;
      position?: number;
      order?: number;
      fill?: number;
      accountRiskStatus?: number;
      fillPair?: number;
      cashBalance?: number;
      default?: number;
    };
  };
}

/**
 * Main configuration interface - supports both simple and advanced configurations
 */
export type TradeClientConfig = SimpleTradeClientConfig | AdvancedTradeClientConfig;

// Default configuration values - uses standard preset as base
export const DEFAULT_TRADE_CLIENT_CONFIG: Partial<TradeClientConfig> = {
  stage: 'staging',
  preset: 'standard' // Default to standard preset for new partners
};

/**
 * Creates a simple configuration with sensible defaults.
 *
 * Helper function that simplifies SDK configuration by providing preset-based
 * setup with minimal required parameters. Automatically configures client types,
 * multiplexing, and market data based on the selected mode.
 *
 * **Modes:**
 * - `'minimal'` - Basic WebSocket clients, essential features only
 * - `'standard'` - Recommended for most users (default)
 * - `'advanced'` - Optimized for high-frequency trading
 *
 * @param {Object} options - configuration options
 * @returns {SimpleTradeClientConfig} complete SDK configuration ready to use
 *
 * @example
 * ```typescript
 * // Basic usage with defaults
 * const config = createSimpleConfig({
 *   stage: 'staging',
 *   credentials: {
 *     name: 'your-username',
 *     password: 'your-password',
 *     appId: 'your-app-id',
 *     appVersion: '1.0.0',
 *     cid: 'your-cid',
 *     sec: 'your-sec'
 *   }
 * });
 *
 * const sdk = new TradeClient(config);
 * ```
 *
 * @example
 * ```typescript
 * // With market data enabled
 * const config = createSimpleConfig({
 *   stage: 'prod',
 *   credentials: { ... },
 *   enableMarketData: true,
 *   mode: 'standard'
 * });
 * ```
 */
export function createSimpleConfig(options: {
  stage: TdvStage;
  credentials: Credentials;
  enableMarketData?: boolean;
  mode?: 'standard' | 'minimal' | 'advanced';
  clientType?: 'websocket' | 'rest';
}): SimpleTradeClientConfig {
  const {
    stage,
    credentials,
    enableMarketData = false,
    mode = 'standard',
    clientType = 'websocket'
  } = options;

  // Determine preset based on mode
  let preset: PresetType;
  switch (mode) {
    case 'minimal':
      preset = 'minimal';
      break;
    case 'advanced':
      preset = 'high-frequency';
      break;
    default:
      preset = 'standard';
  }

  // Determine client configuration based on clientType
  let liveClient: 'socket' | 'rest';
  let simClient: 'socket' | 'rest';

  switch (clientType) {
    case 'rest':
      liveClient = 'rest';
      simClient = 'rest';
      break;
    default: // 'websocket'
      liveClient = 'socket';
      simClient = 'socket';
  }

  return {
    stage,
    credentials,
    preset,
    liveClient,
    simClient,
    enableMdSocket: enableMarketData,
    enableMultiplexing: clientType === 'websocket'
  };
}

/**
 * Event interface for TradeClient - provides clean event handling without exposing internal EventEmitter methods.
 *
 * Exposes only the essential event listening methods (`on`, `once`, `off`) while hiding
 * internal implementation details. The SDK implements this interface to provide a clean,
 * focused API for event handling.
 */
export interface TradeClientEvents {
  /** Listen for SDK events. Returns SDK instance for chaining. */
  on(event: 'connection', listener: (event: ConnectionEvent) => void): TradeClient;
  on(event: 'health', listener: (event: HealthEvent) => void): TradeClient;
  on(event: 'rateLimit', listener: (event: RateLimitEvent) => void): TradeClient;
  on(event: 'cache', listener: (event: CacheEvent) => void): TradeClient;
  on(event: 'queue', listener: (event: QueueEvent) => void): TradeClient;

  /** Listen for SDK events (one-time only). Returns SDK instance for chaining. */
  once(event: 'connection', listener: (event: ConnectionEvent) => void): TradeClient;
  once(event: 'health', listener: (event: HealthEvent) => void): TradeClient;
  once(event: 'rateLimit', listener: (event: RateLimitEvent) => void): TradeClient;
  once(event: 'cache', listener: (event: CacheEvent) => void): TradeClient;
  once(event: 'queue', listener: (event: QueueEvent) => void): TradeClient;

  /** Remove event listener. Returns SDK instance for chaining. */
  off(event: 'connection', listener: (event: ConnectionEvent) => void): TradeClient;
  off(event: 'health', listener: (event: HealthEvent) => void): TradeClient;
  off(event: 'rateLimit', listener: (event: RateLimitEvent) => void): TradeClient;
  off(event: 'cache', listener: (event: CacheEvent) => void): TradeClient;
  off(event: 'queue', listener: (event: QueueEvent) => void): TradeClient;
}

/** Connection state change event */
export interface ConnectionEvent {
  type: 'connecting' | 'connected' | 'disconnected' | 'connection_failed';
  timestamp: number;
  stage: TdvStage;
  error?: string; // Only present for 'connection_failed' events
}

/** Health status change event */
export interface HealthEvent {
  type: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  components: Record<string, boolean>;
  message?: string;
}

/** Rate limiting event */
export interface RateLimitEvent {
  type: 'limit_exceeded' | 'limit_reset';
  timestamp: number;
  endpoint?: string;
  retryAfter?: number; // milliseconds to wait before retry
}

/** Cache performance event */
export interface CacheEvent {
  type: 'hit' | 'miss' | 'update';
  timestamp: number;
  entityType: string;
  hitRate: number; // 0.0 to 1.0
}

/** Message queue event */
export interface QueueEvent {
  type: 'queued' | 'processed' | 'expired';
  timestamp: number;
  queueSize: number;
  reason?: string;
}

/**
 * Main SDK class for connecting to and interacting with the TradeAPI service.
 *
 * Provides a unified interface for REST/WebSocket APIs with built-in features:
 * - Automatic authentication and token management
 * - WebSocket connections with real-time updates
 * - Health monitoring and automatic reconnection
 * - Rate limiting and message queueing
 * - Intelligent caching for improved performance
 *
 * ## Quick Start
 *
 * Use a preset configuration for the easiest setup:
 *
 * @example
 * ```typescript
 * const sdk = new TradeClient({
 *   stage: 'staging',
 *   credentials: {
 *     name: 'your-username',
 *     password: 'your-password',
 *     appId: 'your-app-id',
 *     appVersion: '1.0.0',
 *     cid: 'your-cid',
 *     sec: 'your-sec'
 *   },
 *   preset: 'standard' // recommended for most users
 * });
 *
 * await sdk.connect();
 *
 * // Access live
 * const liveAccounts = await sdk.live.account.list();
 *
 * // Or simulation
 * const simAccounts = await sdk.sim.account.list();
 * ```
 *
 * ## Available Presets
 *
 * - **`standard`** - Recommended for most partners (WebSocket + market data support)
 * - **`minimal`** - Basic features for simple integrations
 * - **`high-frequency`** - Optimized for high-frequency trading with aggressive caching
 *
 * ***Note***: Requires [Tradovate API credentials](https://community.tradovate.com/t/how-do-i-access-the-api/2380).
 */
export class TradeClient implements TradeClientEvents {
  /** The current stage/environment (staging, production) */
  private stage: TdvStage;
  /** Internal logger instance */
  private logger: WinstonLogger;

  // Configuration
  private config: TradeClientConfig;

  // Core components
  private connectionManager: ConnectionManager;
  private healthMonitor: HealthMonitor;

  // Rate limiting
  private rateLimiter?: RateLimiter;

  // Message queueing
  private messageQueue?: EnhancedMessageQueue;

  // Internal event emitter (composition instead of inheritance)
  private eventEmitter: EventEmitter;

  // Error handlers
  private errorHandlers: {
    onError?: ErrorHandler;
    onAuthError?: ErrorHandler;
    onRateLimitError?: ErrorHandler;
  } = {};

  /**
   * Creates a new TradeClient instance.
   *
   * **Configuration Options:**
   * - Use `preset` for quick setup (recommended for most users)
   * - Or configure individual options for fine-grained control
   * - Supports both `SimpleTradeClientConfig` and `AdvancedTradeClientConfig`
   *
   * **Key Configuration Parameters:**
   * - `stage`: Environment to connect to ('staging' | 'prod')
   * - `credentials`: Your Tradovate API credentials
   * - `preset`: Quick configuration preset ('standard' | 'minimal' | 'high-frequency' | 'development')
   * - `liveClient`: Client type for live trading ('socket' | 'rest')
   * - `simClient`: Client type for simulation ('socket' | 'rest')
   * - `enableMdSocket`: Enable market data WebSocket (requires CME approval)
   * - `rateLimiting`: Rate limit configuration to prevent API throttling
   *
   * @param {TradeClientConfig} config - SDK configuration object
   *
   * @example
   * ```typescript
   * // Preset configuration (recommended)
   * const sdk = new TradeClient({
   *   stage: 'staging',
   *   credentials: {
   *     name: 'your-username',
   *     password: 'your-password',
   *     appId: 'your-app-id',
   *     appVersion: '1.0.0',
   *     cid: 'your-cid',
   *     sec: 'your-sec'
   *   },
   *   preset: 'standard'
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Custom configuration for specific needs
   * const sdk = new TradeClient({
   *   stage: 'prod',
   *   credentials: { ... },
   *   enableMdSocket: true,      // Enable market data
   *   enableMultiplexing: true,  // Use multiplexed connections
   *   rateLimiting: {
   *     requestsPerSecond: 10,
   *     requestsPerMinute: 500
   *   },
   *   healthCheckInterval: 30000 // Check health every 30 seconds
   * });
   * ```
   */
  constructor(config: TradeClientConfig) {
    // Initialize internal event emitter (composition pattern)
    this.eventEmitter = new EventEmitter();

    // Apply preset configuration if specified
    let configWithPreset = config;
    if (config.preset) {
      configWithPreset = applyPreset(
        config as AdvancedTradeClientConfig,
        config.preset
      ) as AdvancedTradeClientConfig;
    }

    // Merge with defaults - validation already happened in configLoader
    const finalConfig = {
      ...DEFAULT_TRADE_CLIENT_CONFIG,
      ...configWithPreset
    } as AdvancedTradeClientConfig;

    this.config = finalConfig;
    this.stage = finalConfig.stage;

    // Initialize logger
    if (finalConfig.logger) {
      this.logger = createWinstonLogger(finalConfig.logger);
    } else {
      // Map TdvStage to Winston config keys
      const stageMapping: Record<TdvStage, keyof typeof DEFAULT_WINSTON_CONFIGS> = {
        devel: 'development',
        staging: 'staging',
        prod: 'production'
      };
      const winstonStage = stageMapping[finalConfig.stage];
      const winstonConfig = {
        stage: finalConfig.stage,
        ...DEFAULT_WINSTON_CONFIGS[winstonStage]
      };

      this.logger = createWinstonLogger(winstonConfig);
    }

    // Initialize core components
    this.connectionManager = new ConnectionManager(
      {
        stage: finalConfig.stage,
        credentials: finalConfig.credentials,
        liveClient: finalConfig.liveClient,
        simClient: finalConfig.simClient,
        enableMdSocket: finalConfig.enableMdSocket,
        enableMultiplexing: finalConfig.enableMultiplexing,
        connectionTimeout: finalConfig.connectionTimeout,
        shardingDivisor: finalConfig.shardingDivisor,
        shardingType: finalConfig.shardingType,
        entityTypes: finalConfig.entityTypes,
        syncImmediate: finalConfig.syncImmediate,
        fullOrgSnapshot: finalConfig.fullOrgSnapshot,
        cacheConfig: finalConfig.cache
      },
      this.logger,
      this.rateLimiter,
      this.messageQueue,
      this
    );

    this.healthMonitor = new HealthMonitor(
      {
        healthCheckInterval: finalConfig.healthCheckInterval,
        maxReconnectAttempts: finalConfig.maxReconnectAttempts,
        reconnectDelay: finalConfig.reconnectDelay,
        exponentialBackoff: finalConfig.exponentialBackoff,
        healthCheckTimeout: finalConfig.healthCheckTimeout
      },
      this.logger
    );

    // Initialize rate limiter if configured
    if (finalConfig.rateLimiting) {
      this.rateLimiter = new RateLimiter(
        {
          requestsPerSecond: finalConfig.rateLimiting.requestsPerSecond || 10,
          requestsPerMinute: finalConfig.rateLimiting.requestsPerMinute || 500,
          requestsPerHour: finalConfig.rateLimiting.requestsPerHour || 10000,
          burstMultiplier: finalConfig.rateLimiting.burstMultiplier || 2,
          enableBackoff: finalConfig.rateLimiting.enableBackoff ?? true,
          maxBackoffTime: finalConfig.rateLimiting.maxBackoffTime || 30000,
          logViolations: finalConfig.rateLimiting.logViolations ?? true
        },
        this.logger
      );
    }

    // Initialize message queue if configured
    if (finalConfig.messageQueue) {
      this.messageQueue = new EnhancedMessageQueue(
        {
          maxSize: finalConfig.messageQueue.maxSize || 1000,
          enableRetries: finalConfig.messageQueue.enableRetries ?? true,
          maxRetries: finalConfig.messageQueue.maxRetries || 3,
          retryDelay: finalConfig.messageQueue.retryDelay || 1000,
          enableMaintenanceQueuing: finalConfig.messageQueue.enableMaintenanceQueuing ?? true,
          queueTimeout: finalConfig.messageQueue.queueTimeout || 300000,
          enableDeduplication: finalConfig.messageQueue.enableDeduplication ?? true,
          deduplicationWindow: finalConfig.messageQueue.deduplicationWindow || 60000
        },
        this.logger
      );
    }

    // Set up health monitor with dependency injection
    const healthCheckFunctions: HealthCheckFunctions = {
      checkRestHealth: () => this.connectionManager.checkRestHealth(),
      checkLiveSocketHealth: () => this.connectionManager.checkLiveSocketHealth(),
      checkSimSocketHealth: () => this.connectionManager.checkSimSocketHealth(),
      checkTokenHealth: () => this.connectionManager.checkTokenHealth(),
      triggerReconnect: () => this.connectionManager.triggerReconnect(),
      getConnectionState: () => this.connectionManager.getConnectionState(),
      // Token renewal function
      renewToken: async () => {
        // Use the live API client to call the renewaccesstoken endpoint
        const response = await this.connectionManager.live.auth.renewAccessToken({});
        if (!response.accessToken || !response.expirationTime) {
          throw new AuthError('Invalid response from token renewal endpoint', {
            context: {
              hasAccessToken: !!response.accessToken,
              hasExpiration: !!response.expirationTime
            }
          });
        }

        // Update the connection manager's token state with the new token
        this.connectionManager.updateTokenState(response.accessToken, response.expirationTime);

        return {
          accessToken: response.accessToken,
          expirationTime: response.expirationTime
        };
      }
    };

    this.healthMonitor.setHealthCheckFunctions(healthCheckFunctions);

    // Initialize error handlers from config
    this.errorHandlers = {
      onError: finalConfig.onError,
      onAuthError: finalConfig.onAuthError,
      onRateLimitError: finalConfig.onRateLimitError
    };

    // Note: API client will be initialized after connection when sockets are available
  }

  /**
   * Handle an SDK error by invoking appropriate error handlers.
   * Called internally when errors occur after retries are exhausted.
   * @internal
   */
  handleError(error: SdkError): void {
    // Call specific handlers first
    if (error instanceof AuthError && this.errorHandlers.onAuthError) {
      this.errorHandlers.onAuthError(error);
    } else if (error instanceof RateLimitError && this.errorHandlers.onRateLimitError) {
      this.errorHandlers.onRateLimitError(error);
    }

    // Always call general error handler if set
    if (this.errorHandlers.onError) {
      this.errorHandlers.onError(error);
    }
  }

  /**
   * Live trading API client for production trading operations.
   *
   * **⚠️ WARNING: This connects to LIVE trading accounts. Real money is at risk if using Trading operations!**
   *
   * Provides access to:
   * - Account management and balance information
   * - Order placement, modification, and cancellation
   * - Position monitoring and management
   * - Real-time entity updates via WebSocket listeners
   *
   * @example
   * ```typescript
   * // Get account information
   * const accounts = await sdk.live.account.list();
   * console.log('Available balance:', accounts[0].cashBalance);
   *
   * // Place a live order (be careful!)
   * const order = await sdk.live.order.placeOrder({
   *   body: {
   *     accountId: 123456,
   *     symbol: 'ESM7',
   *     qty: 1,
   *     action: 'Buy',
   *     orderType: 'Limit',
   *     price: 4500.00
   *   }
   * });
   * console.log('Order ID:', order.orderId);
   *
   * // Listen to real-time position updates
   * const listener = sdk.live.listen('position', (event) => {
   *   console.log('Position update:', event);
   * });
   *
   * // Don't forget to cleanup
   * listener.unlisten();
   * ```
   *
   * @throws {ConfigurationError} when SDK is not connected or live client unavailable
   */
  get live() {
    return this.connectionManager.live;
  }

  /**
   * Simulation trading API client for testing strategies safely.
   *
   * Provides the same API as `live`, but connects to simulated accounts with virtual money.
   * All operations work identically to live trading, making it easy to test and transition.
   *
   * @example
   * ```typescript
   * // Get simulation accounts (avoid .list() if you are a Prop Firm developer)
   * const accounts = await sdk.sim.account.items({
   *   query: { ids: [1234, 2345, 3456] }
   * });
   * console.log('Demo accounts:', accounts.length);
   *
   * // Place a simulated order
   * const order = await sdk.sim.order.placeOrder({
   *   body: {
   *     accountId: 123456,
   *     symbol: 'ESM7',
   *     qty: 1,
   *     action: 'Buy',
   *     orderType: 'Market'
   *   }
   * });
   * console.log('Sim order placed:', order.orderId);
   *
   * // Listen to simulated position updates
   * const listener = sdk.sim.listen('position', (event) => {
   *   console.log('Sim position update:', event);
   * });
   *
   * listener.unlisten(); // cleanup when done
   * ```
   *
   * @throws {ConfigurationError} when SDK is not connected or sim client unavailable
   */
  get sim(): ApiClient {
    return this.connectionManager.sim;
  }

  /**
   * Market Data API client for real-time market information.
   *
   * Only available when `enableMdSocket: true` is set in configuration.
   *
   * **⚠️ IMPORTANT**: Requires CME approval as a market data sub-vendor. Attempting to access without approval will result in `"This symbol is not available"` error messages.
   *
   * **Provides access to:**
   * - Real-time quotes (bid/ask/last prices)
   * - Depth of Market (DOM) - order book data
   * - Chart data with various timeframes
   * - Volume histograms
   *
   * @example
   * ```typescript
   * if (sdk.md) {
   *   // Subscribe to real-time quotes
   *   await sdk.md.quote.subscribe({ symbol: 'ESM7' });
   *
   *   // Subscribe to depth of market
   *   await sdk.md.dom.subscribe({ symbol: 'ESM7' });
   *
   *   // Listen to quote updates
   *   sdk.md.listen('quote', (event) => {
   *     const quote = event.quotes[0];
   *     console.log(`${quote.contractId}: Bid ${quote.entries.Bid?.price} / Ask ${quote.entries.Offer?.price}`);
   *   });
   *
   *   // Listen to DOM updates
   *   sdk.md.listen('dom', (event) => {
   *     const dom = event.doms[0];
   *     console.log('Bids:', dom.bids.slice(0, 5));
   *     console.log('Offers:', dom.offers.slice(0, 5));
   *   });
   * } else {
   *   console.log('Market data not enabled - set enableMdSocket: true in config');
   * }
   * ```
   *
   * @returns {MdApiClient | undefined} market data client or undefined if not enabled
   * @throws {ConfigurationError} when attempting to use market data without CME approval
   */
  get md(): MdApiClient | undefined {
    return this.connectionManager.md;
  }

  /**
   * Establishes connection to the TradeAPI service.
   *
   * **Connection Process:**
   * 1. Authenticates with provided credentials
   * 2. Establishes WebSocket connections (if configured)
   * 3. Sets up REST API clients
   * 4. Initializes health monitoring
   * 5. Starts market data connections (if enabled)
   *
   * **Important Notes:**
   * - Must be called before using any API methods
   * - Connection time typically 2-10 seconds depending on network
   * - Automatically handles token management and renewal
   * - Emits 'connection' events throughout the process
   * - Health monitoring starts automatically after successful connection
   *
   * @returns {Promise<void>} resolves when fully connected and ready
   * @throws {ConfigurationError} invalid credentials or configuration
   * @throws {ConnectionError} network connection failed or timeout
   * @throws {AuthenticationError} authentication failed
   *
   * @example
   * ```typescript
   * // Basic connection
   * try {
   *   await sdk.connect();
   *   console.log('Connected successfully');
   *
   *   // SDK is ready to use
   *   const accounts = await sdk.sim.account.list();
   * } catch (error) {
   *   console.error('Connection failed:', error.message);
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Connection with event monitoring
   * sdk.on('connection', (event) => {
   *   if (event.type === 'connected') {
   *     console.log('✅ Connected and ready');
   *   } else if (event.type === 'connection_failed') {
   *     console.error('❌ Connection failed:', event.error);
   *   }
   * });
   *
   * await sdk.connect();
   * ```
   */
  async connect(): Promise<void> {
    const startTime = Date.now();

    try {
      this.logger.logNormal('TradeSDK connecting to TradeAPI', {
        type: 'tradesdk_connect_start',
        stage: this.config.stage,
        liveClient: this.config.liveClient,
        simClient: this.config.simClient,
        enableMdSocket: this.config.enableMdSocket
      });

      // Initialize connection manager
      const connectionManagerStartTime = Date.now();
      await this.connectionManager.connect();
      const connectionManagerDuration = Date.now() - connectionManagerStartTime;

      this.logger.logPerformance(`Connection manager connection`, connectionManagerDuration, {
        type: 'connection_manager_connect',
        stage: this.config.stage
      });

      // Start health monitoring if configured
      if (this.config.healthCheckInterval) {
        const healthMonitorStartTime = Date.now();
        this.healthMonitor.startMonitoring();
        const healthMonitorDuration = Date.now() - healthMonitorStartTime;

        this.logger.logPerformance(`Health monitor startup`, healthMonitorDuration, {
          type: 'health_monitor_startup',
          stage: this.config.stage,
          interval: this.config.healthCheckInterval
        });
      }

      const totalDuration = Date.now() - startTime;

      this.logger.logNormal('TradeSDK connected successfully', {
        type: 'tradesdk_connect_success',
        duration: totalDuration,
        stage: this.config.stage,
        liveClient: this.config.liveClient,
        simClient: this.config.simClient
      });

      this.logger.logPerformance(`Complete TradeSDK connection`, totalDuration, {
        type: 'complete_tradesdk_connection',
        stage: this.config.stage,
        connectionManagerDuration,
        healthMonitorDuration: this.config.healthCheckInterval
          ? Date.now() - (startTime + connectionManagerDuration)
          : 0
      });

      // Log memory usage after connection
      const memoryUsage = process.memoryUsage();
      this.logger.logMemoryUsage(`TradeSDK connection memory usage`, memoryUsage, {
        type: 'tradesdk_connection_memory',
        stage: this.config.stage
      });

      // Emit connection event
      this.emit('connection', {
        type: 'connected',
        timestamp: Date.now(),
        stage: this.config.stage
      });
    } catch (error) {
      const totalDuration = Date.now() - startTime;

      this.logger.logError(`TradeSDK connection failed`, error as Error, {
        type: 'tradesdk_connect_failure',
        duration: totalDuration,
        stage: this.config.stage
      });

      // Emit connection failed event
      this.emit('connection', {
        type: 'connection_failed',
        timestamp: Date.now(),
        stage: this.config.stage,
        error: error instanceof Error ? error.message : String(error)
      });

      throw error;
    }
  }

  /**
   * Gracefully disconnects from the TradeAPI service.
   *
   * **Disconnection Process:**
   * 1. Stops health monitoring
   * 2. Closes all WebSocket connections
   * 3. Terminates REST API sessions
   * 4. Cleans up market data subscriptions
   * 5. Releases system resources
   *
   * **Important Notes:**
   * - Always call before terminating your application
   * - Disconnection typically completes in 1-3 seconds
   * - Pending API calls may be interrupted
   * - All active subscriptions are automatically cleaned up
   * - The SDK cannot be used after disconnection (must reconnect)
   *
   * @returns {Promise<void>} resolves when fully disconnected
   *
   * @example
   * ```typescript
   * // Basic disconnection
   * await sdk.disconnect();
   * console.log('Disconnected successfully');
   * ```
   *
   * @example
   * ```typescript
   * // Proper cleanup in application shutdown
   * const cleanup = async () => {
   *   try {
   *     await sdk.disconnect();
   *     console.log('✅ SDK disconnected');
   *   } catch (error) {
   *     console.error('❌ Disconnection error:', error);
   *   } finally {
   *     process.exit(0);
   *   }
   * };
   *
   * process.on('SIGINT', cleanup);
   * process.on('SIGTERM', cleanup);
   * ```
   */
  async disconnect(): Promise<void> {
    const startTime = Date.now();

    try {
      this.logger.logNormal('TradeSDK disconnecting from TradeAPI', {
        type: 'tradesdk_disconnect_start',
        stage: this.config.stage
      });

      // Stop health monitoring
      if (this.config.healthCheckInterval) {
        const healthMonitorStopTime = Date.now();
        this.healthMonitor.stopMonitoring();
        const healthMonitorDuration = Date.now() - healthMonitorStopTime;

        this.logger.logPerformance(`Health monitor shutdown`, healthMonitorDuration, {
          type: 'health_monitor_shutdown',
          stage: this.config.stage
        });
      }

      // Disconnect connection manager
      const connectionManagerStopTime = Date.now();
      await this.connectionManager.disconnect();
      const connectionManagerDuration = Date.now() - connectionManagerStopTime;

      this.logger.logPerformance(`Connection manager disconnection`, connectionManagerDuration, {
        type: 'connection_manager_disconnect',
        stage: this.config.stage
      });

      const totalDuration = Date.now() - startTime;

      this.logger.logNormal('TradeSDK disconnected successfully', {
        type: 'tradesdk_disconnect_success',
        duration: totalDuration,
        stage: this.config.stage
      });

      this.logger.logPerformance(`Complete TradeSDK disconnection`, totalDuration, {
        type: 'complete_tradesdk_disconnection',
        stage: this.config.stage,
        healthMonitorDuration: this.config.healthCheckInterval
          ? Date.now() - (startTime + connectionManagerDuration)
          : 0,
        connectionManagerDuration
      });

      // Log memory usage after disconnection
      const memoryUsage = process.memoryUsage();
      this.logger.logMemoryUsage(`TradeSDK disconnection memory usage`, memoryUsage, {
        type: 'tradesdk_disconnection_memory',
        stage: this.config.stage
      });

      // Emit disconnection event
      this.emit('connection', {
        type: 'disconnected',
        timestamp: Date.now(),
        stage: this.config.stage
      });
    } catch (error) {
      const totalDuration = Date.now() - startTime;

      this.logger.logError(`TradeSDK disconnection failed`, error as Error, {
        type: 'tradesdk_disconnect_failure',
        duration: totalDuration,
        stage: this.config.stage
      });

      throw error;
    }
  }

  /**
   * Get current SDK statistics and health information.
   *
   * **Statistics Included:**
   * - `connected`: Whether SDK is connected to TradeAPI
   * - `healthy`: Overall health status (true if all systems operational)
   * - `cacheHitRate`: Cache efficiency (0.0 to 1.0, higher is better)
   * - `queueSize`: Number of messages currently queued
   * - `stage`: Current environment ('staging' | 'prod')
   * - `timestamp`: When statistics were collected
   *
   * **Use Cases:**
   * - Monitor connection status in real-time
   * - Track performance and cache efficiency
   * - Debug connection or health issues
   * - Display SDK status in your UI
   *
   * @returns {Object} SDK statistics and health information
   *
   * @example
   * ```typescript
   * // Get current stats
   * const stats = sdk.getStats();
   * console.log('Connected:', stats.connected);
   * console.log('Healthy:', stats.healthy);
   * console.log('Cache hit rate:', (stats.cacheHitRate * 100).toFixed(1) + '%');
   * console.log('Queue size:', stats.queueSize);
   * ```
   *
   * @example
   * ```typescript
   * // Monitor SDK health periodically
   * setInterval(() => {
   *   const stats = sdk.getStats();
   *
   *   if (!stats.healthy) {
   *     console.warn('⚠️ SDK health degraded');
   *   }
   *
   *   if (stats.queueSize > 100) {
   *     console.warn('⚠️ Message queue backing up:', stats.queueSize);
   *   }
   * }, 30000);
   * ```
   */
  getStats(): {
    connected: boolean;
    healthy: boolean;
    cacheHitRate: number;
    queueSize: number;
    stage: string;
    timestamp: number;
  } {
    const startTime = Date.now();

    try {
      // Get essential stats only
      const connectionState = this.connectionManager.getConnectionState();
      const healthStatus = this.healthMonitor.getHealthStatus();

      // Calculate cache hit rate
      let cacheHitRate = 0;
      try {
        const cacheStats = this.connectionManager.getSharedCacheManager().getCacheStats();
        if (cacheStats) {
          const totalRequests = cacheStats.hits + cacheStats.misses;
          cacheHitRate = totalRequests > 0 ? cacheStats.hits / totalRequests : 0;
        }
      } catch {
        cacheHitRate = 0;
      }

      // Get queue size
      let queueSize = 0;
      try {
        queueSize = this.messageQueue ? this.messageQueue['queue'].length : 0;
      } catch {
        queueSize = 0;
      }

      const stats = {
        connected: connectionState === 'connected',
        healthy: healthStatus.overall,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100, // Round to 2 decimal places
        queueSize,
        stage: this.config.stage,
        timestamp: Date.now()
      };

      const duration = Date.now() - startTime;
      this.logger.logPerformance(`TradeSDK essential stats retrieval`, duration, {
        type: 'tradesdk_stats_retrieval',
        stage: this.config.stage
      });

      return stats;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logError(`TradeSDK stats retrieval failed`, error as Error, {
        type: 'tradesdk_stats_failure',
        duration,
        stage: this.config.stage
      });

      return {
        connected: false,
        healthy: false,
        cacheHitRate: 0,
        queueSize: 0,
        stage: this.config.stage,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Event System - Monitor SDK state and performance.
   *
   * The SDK emits events throughout its lifecycle for monitoring and debugging.
   * Use `on()` for persistent listeners, `once()` for one-time handlers, and
   * `off()` to remove listeners when done.
   *
   * **Available Events:**
   *
   * - **`connection`**: Connection state changes
   *   - Types: `'connecting'`, `'connected'`, `'disconnected'`, `'connection_failed'`
   *   - Data: `{ type, timestamp, stage, error? }`
   *
   * - **`health`**: Health status changes
   *   - Types: `'healthy'`, `'degraded'`, `'unhealthy'`
   *   - Data: `{ type, timestamp, components, message? }`
   *
   * - **`rateLimit`**: Rate limiting events
   *   - Types: `'limit_exceeded'`, `'limit_reset'`
   *   - Data: `{ type, timestamp, endpoint?, retryAfter? }`
   *
   * - **`cache`**: Cache performance events
   *   - Types: `'hit'`, `'miss'`, `'update'`
   *   - Data: `{ type, timestamp, entityType, hitRate }`
   *
   * - **`queue`**: Message queue events
   *   - Types: `'queued'`, `'processed'`, `'expired'`
   *   - Data: `{ type, timestamp, queueSize, reason? }`
   *
   * @example
   * ```typescript
   * // Monitor connection lifecycle
   * sdk.on('connection', (event) => {
   *   switch (event.type) {
   *     case 'connecting':
   *       console.log('🔄 Connecting...');
   *       break;
   *     case 'connected':
   *       console.log('✅ Connected');
   *       break;
   *     case 'disconnected':
   *       console.log('🔌 Disconnected');
   *       break;
   *     case 'connection_failed':
   *       console.error('❌ Failed:', event.error);
   *       break;
   *   }
   * });
   *
   * // One-time connection handler
   * sdk.once('connection', (event) => {
   *   if (event.type === 'connected') {
   *     console.log('Ready to trade!');
   *   }
   * });
   *
   * // Monitor health issues
   * sdk.on('health', (event) => {
   *   if (event.type === 'unhealthy') {
   *     console.warn('⚠️ Health issue:', event.message);
   *   }
   * });
   *
   * // Track rate limiting
   * sdk.on('rateLimit', (event) => {
   *   if (event.type === 'limit_exceeded') {
   *     console.warn(`Rate limit hit for ${event.endpoint}`);
   *   }
   * });
   *
   * // Remove listeners when done
   * const handler = (event) => console.log(event);
   * sdk.on('health', handler);
   * sdk.off('health', handler); // cleanup
   * ```
   */

  // Public event methods (implementing TradeClientEvents interface)

  /** Listen for SDK events. Returns SDK instance for chaining. */
  on(event: string, listener: (...args: any[]) => void): TradeClient {
    this.eventEmitter.on(event, listener);
    return this;
  }

  /** Listen for SDK events (one-time). Returns SDK instance for chaining. */
  once(event: string, listener: (...args: any[]) => void): TradeClient {
    this.eventEmitter.once(event, listener);
    return this;
  }

  /** Remove event listener. Returns SDK instance for chaining. */
  off(event: string, listener: (...args: any[]) => void): TradeClient {
    this.eventEmitter.off(event, listener);
    return this;
  }

  /**
   * Internal method to emit events (not exposed in public API)
   * @private
   */
  private emit(event: string, ...args: any[]): boolean {
    return this.eventEmitter.emit(event, ...args);
  }
}
