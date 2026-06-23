import EventEmitter from 'eventemitter3';
import { AuthError, ConfigError, NetworkError, SdkError, ValidationError } from '../api/errors';
import type { AccessTokenResponse } from '../api/types';
import { URLS } from '../data/constants';
import type { Credentials, EntityName, TdvStage } from '../types/common';
import authenticate from '../utils/authenticate';
import { sleep } from '../utils/sleep';
import { ApiClient } from './apiClient';
import { CacheManager } from './cacheManager';
import type { EnhancedMessageQueue } from './enhancedMessageQueue';
import { MdApiClient } from './mdApiClient';
import { MultiplexSocket } from './multiplexSocket';
import type { RateLimiter } from './rateLimiter';
import { RestApi } from './restApi';
import { Socket } from './socket';
import type { WinstonLogger } from './winstonLogger';

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2
};

export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'failed';

export interface ConnectionHealth {
  isHealthy: boolean;
  lastCheck: number;
  responseTime: number;
  error?: string;
}

export interface ConnectionConfig {
  stage: TdvStage;
  credentials: Credentials;
  liveClient?: 'socket' | 'rest';
  simClient?: 'socket' | 'rest';
  enableMdSocket?: boolean;
  enableMultiplexing?: boolean;
  connectionTimeout?: number;
  shardingDivisor?: number;
  shardingType?: 'modUserId' | 'modAccountId';
  entityTypes?: EntityName[];
  /** Whether to sync entities immediately after connection. Defaults to true. */
  syncImmediate?: boolean;
  fullOrgSnapshot?: boolean;
  cacheConfig?: {
    maxAge?: number;
    maxEntries?: {
      account?: number;
      position?: number;
      order?: number;
      product?: number;
      default?: number;
    };
    enableIntelligentLookup?: boolean;
    enableCacheStats?: boolean;
    enableLRU?: boolean;
    enableCompression?: boolean;
  };
}

/**
 * Manages all connection-related operations for the TradeSDK
 *
 * This class handles:
 * - Authentication
 * - REST API client initialization
 * - WebSocket client initialization
 * - Connection state management
 * - Client type selection (socket vs REST)
 */
export class ConnectionManager extends EventEmitter {
  private config: ConnectionConfig;
  private logger: WinstonLogger;
  private connectionState: ConnectionState = 'disconnected';
  private lastToken: string | null = null;
  private expirationTime: number | null = null;
  private lastCredentials: Credentials | null = null;
  private sdk?: any; // Reference to parent TradeClient

  // Shared cache manager for all clients
  private sharedCacheManager: CacheManager;

  // Client instances
  private pLiveSocket: Socket | MultiplexSocket | null = null;
  private pLiveRest: RestApi | null = null;
  private pSimSocket: Socket | MultiplexSocket | null = null;
  private pSimRest: RestApi | null = null;
  private pMdSocket: Socket | null = null;

  // API clients
  private pApiClient: ApiClient | null = null;
  private pSimApiClient: ApiClient | null = null;
  private pMdApiClient: MdApiClient | null = null;

  // Rate limiting and message queuing
  private rateLimiter?: RateLimiter;
  private messageQueue?: EnhancedMessageQueue;

  constructor(
    config: ConnectionConfig,
    logger: WinstonLogger,
    rateLimiter?: RateLimiter,
    messageQueue?: EnhancedMessageQueue,
    sdk?: any
  ) {
    super();
    this.config = config;
    this.logger = logger;
    this.lastCredentials = config.credentials;
    this.rateLimiter = rateLimiter;
    this.messageQueue = messageQueue;
    this.sdk = sdk;

    // Initialize shared cache manager
    const cacheConfig = config.cacheConfig
      ? {
          maxAge: config.cacheConfig.maxAge || 5 * 60 * 1000,
          maxEntries: {
            account: config.cacheConfig.maxEntries?.account || 10000,
            position: config.cacheConfig.maxEntries?.position || 5000,
            order: config.cacheConfig.maxEntries?.order || 2500,
            product: config.cacheConfig.maxEntries?.product || 1000,
            default: config.cacheConfig.maxEntries?.default || 1000
          },
          enableIntelligentLookup: config.cacheConfig.enableIntelligentLookup ?? true,
          enableCacheStats: config.cacheConfig.enableCacheStats ?? true,
          enableLRU: config.cacheConfig.enableLRU ?? true,
          enableCompression: config.cacheConfig.enableCompression ?? false
        }
      : undefined;

    this.sharedCacheManager = new CacheManager(cacheConfig, logger);

    // Initialize cache for configured entity types
    if (config.entityTypes && config.entityTypes.length > 0) {
      this.sharedCacheManager.initializeCache(config.entityTypes);
    }
  }

  /**
   * Gets the current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Gets the shared cache manager instance
   */
  getSharedCacheManager(): CacheManager {
    return this.sharedCacheManager;
  }

  /**
   * Gets whether the connection is currently active
   */
  isConnected(): boolean {
    return this.connectionState === 'connected';
  }

  /**
   * Gets the last received access token
   */
  getLastToken(): string | null {
    return this.lastToken;
  }

  /**
   * Gets the token expiration time
   */
  getExpirationTime(): number | null {
    return this.expirationTime;
  }

  /**
   * Updates the token state after renewal
   */
  updateTokenState(accessToken: string, expirationTime: string): void {
    this.lastToken = accessToken;
    this.expirationTime = new Date(expirationTime).getTime();

    // Update REST API clients with new token
    if (this.pLiveRest) {
      this.pLiveRest.updateAccessToken(accessToken);
    }
    if (this.pSimRest) {
      this.pSimRest.updateAccessToken(accessToken);
    }

    // Update WebSocket clients with new token
    if (this.pLiveSocket) {
      this.pLiveSocket.updateAccessToken(accessToken);
    }
    if (this.pSimSocket) {
      this.pSimSocket.updateAccessToken(accessToken);
    }

    // Update API clients with new token
    if (this.pApiClient) {
      this.pApiClient.updateAccessToken(accessToken);
    }
    if (this.pSimApiClient) {
      this.pSimApiClient.updateAccessToken(accessToken);
    }

    this.logger.logDebug('Token state updated after renewal', {
      type: 'token_state_updated',
      newTokenLength: accessToken.length,
      newExpirationTime: expirationTime,
      newExpirationTimestamp: this.expirationTime
    });
  }

  /**
   * Gets the live trading API client
   */
  get live(): ApiClient {
    if (!this.isConnected() || !this.pApiClient) {
      throw new ConfigError('ConnectionManager not connected - cannot access live API client.');
    }
    return this.pApiClient;
  }

  /**
   * Gets the simulation trading API client
   */
  get sim(): ApiClient {
    if (!this.isConnected() || !this.pSimApiClient) {
      throw new ConfigError('ConnectionManager not connected - cannot access sim API client.');
    }
    return this.pSimApiClient;
  }

  /**
   * Gets the market data API client
   */
  get md(): MdApiClient {
    if (!this.isConnected() || !this.pMdApiClient) {
      throw new ConfigError('ConnectionManager not connected - cannot access MD API client.');
    }
    return this.pMdApiClient;
  }

  /**
   * Gets the live trading socket client
   */
  get liveSocket(): Socket | MultiplexSocket {
    if (!this.isConnected() || !this.pLiveSocket) {
      throw new ConfigError('ConnectionManager not connected - cannot access live socket.');
    }
    return this.pLiveSocket;
  }

  /**
   * Gets the live trading REST API client
   */
  get liveRest(): RestApi {
    if (!this.isConnected() || !this.pLiveRest) {
      throw new ConfigError('ConnectionManager not connected - cannot access live REST API.');
    }
    return this.pLiveRest;
  }

  /**
   * Gets the simulation trading socket client
   */
  get simSocket(): Socket | MultiplexSocket {
    if (!this.isConnected() || !this.pSimSocket) {
      throw new ConfigError('ConnectionManager not connected - cannot access sim socket.');
    }
    return this.pSimSocket;
  }

  /**
   * Gets the simulation trading REST API client
   */
  get simRest(): RestApi {
    if (!this.isConnected() || !this.pSimRest) {
      throw new ConfigError('ConnectionManager not connected - cannot access sim REST API.');
    }
    return this.pSimRest;
  }

  /**
   * Gets the market data socket client
   */
  get mdSocket(): Socket {
    if (!this.config.enableMdSocket) {
      throw new ConfigError(
        'Market Data is not enabled. Add market data to your config to use it.'
      );
    }
    if (!this.isConnected() || !this.pMdSocket) {
      throw new ConfigError('ConnectionManager not connected - cannot access MD socket.');
    }
    return this.pMdSocket;
  }

  /**
   * Connects to the TradeAPI service
   */
  async connect(retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG): Promise<void> {
    const startTime = Date.now();

    this.connectionState = 'connecting';

    this.logger.logNormal('Starting connection to TradeAPI service', {
      type: 'connection_start',
      maxAttempts: retryConfig.maxAttempts,
      baseDelay: retryConfig.baseDelay
    });

    // Emit connecting event
    this.emit('connection', {
      type: 'connecting',
      timestamp: Date.now(),
      stage: this.config.stage
    });

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      const attemptStartTime = Date.now();

      try {
        this.logger.logDebug(`Connection attempt ${attempt}/${retryConfig.maxAttempts}`, {
          type: 'connection_attempt',
          attempt,
          maxAttempts: retryConfig.maxAttempts
        });

        // Attempt authentication
        const authStartTime = Date.now();
        const authData = await authenticate(this.lastCredentials!, this.config.stage);
        const authDuration = Date.now() - authStartTime;

        this.logger.logPerformance(`Authentication`, authDuration, {
          type: 'authentication_success',
          stage: this.config.stage,
          userId: authData.userId,
          attempt
        });

        // Log performance warnings for slow authentication
        if (authDuration > 10000) {
          // 10 seconds
          this.logger.logPerformanceWarning(`Authentication`, authDuration, 10000, {
            type: 'authentication_slow',
            stage: this.config.stage,
            userId: authData.userId,
            attempt,
            threshold: 10000
          });
        }

        // Initialize REST API clients
        const restInitStartTime = Date.now();
        await this.initializeRestClients(authData);
        const restInitDuration = Date.now() - restInitStartTime;

        this.logger.logPerformance(`REST client initialization`, restInitDuration, {
          type: 'rest_client_init',
          stage: this.config.stage,
          userId: authData.userId,
          attempt
        });

        // Initialize WebSocket clients
        const socketInitStartTime = Date.now();
        await this.initializeSocketClients(authData);
        const socketInitDuration = Date.now() - socketInitStartTime;

        this.logger.logPerformance(`WebSocket client initialization`, socketInitDuration, {
          type: 'socket_client_init',
          stage: this.config.stage,
          userId: authData.userId,
          attempt,
          enableMultiplexing: this.config.enableMultiplexing
        });

        // Initialize API clients
        const apiInitStartTime = Date.now();
        await this.initializeApiClients();
        const apiInitDuration = Date.now() - apiInitStartTime;

        this.logger.logPerformance(`API client initialization`, apiInitDuration, {
          type: 'api_client_init',
          stage: this.config.stage,
          userId: authData.userId,
          attempt
        });

        // Update connection state
        this.connectionState = 'connected';
        this.lastToken = authData.accessToken;
        this.expirationTime = new Date(authData.expirationTime).getTime();

        const attemptDuration = Date.now() - attemptStartTime;
        const totalDuration = Date.now() - startTime;

        this.logger.logNormal(`Successfully connected on attempt ${attempt}`, {
          type: 'connection_success',
          attempt,
          stage: this.config.stage,
          userId: authData.userId,
          attemptDuration,
          totalDuration,
          authDuration,
          restInitDuration,
          socketInitDuration,
          apiInitDuration
        });

        this.logger.logPerformance(`Complete connection process`, totalDuration, {
          type: 'complete_connection',
          stage: this.config.stage,
          userId: authData.userId,
          attempt,
          authDuration,
          restInitDuration,
          socketInitDuration,
          apiInitDuration
        });

        // Log memory usage after successful connection
        const memoryUsage = process.memoryUsage();
        this.logger.logMemoryUsage(`Connection established memory usage`, memoryUsage, {
          type: 'connection_memory',
          stage: this.config.stage,
          userId: authData.userId,
          connectionState: this.connectionState
        });

        // Emit connected event
        this.emit('connection', {
          type: 'connected',
          timestamp: Date.now(),
          stage: this.config.stage
        });

        return; // Success - exit the retry loop
      } catch (error) {
        const attemptDuration = Date.now() - attemptStartTime;
        lastError = error instanceof Error ? error : new Error(String(error));

        if (error instanceof SdkError && !error.shouldRetry()) {
          this.logger.logError(`Non-retryable error: ${error.name}`, error as Error, {
            type: error instanceof AuthError ? 'authentication_failure' : 'non_retryable_error',
            stage: this.config.stage,
            attempt,
            attemptDuration
          });
          this.connectionState = 'failed';

          this.emit('connection', {
            type: 'connection_failed',
            timestamp: Date.now(),
            stage: this.config.stage,
            error: lastError.message
          });

          throw error;
        }

        // Log the error for this attempt
        this.logger.logError(`Connection attempt ${attempt} failed`, error as Error, {
          type: 'connection_attempt_failure',
          stage: this.config.stage,
          attempt,
          attemptDuration,
          error: lastError.message
        });

        // If this is the last attempt, throw the error
        if (attempt === retryConfig.maxAttempts) {
          const totalDuration = Date.now() - startTime;

          this.logger.logError(
            `All ${retryConfig.maxAttempts} connection attempts failed`,
            error as Error,
            {
              type: 'connection_all_attempts_failed',
              stage: this.config.stage,
              maxAttempts: retryConfig.maxAttempts,
              totalDuration
            }
          );
          this.connectionState = 'failed';

          // Emit connection failed event
          this.emit('connection', {
            type: 'connection_failed',
            timestamp: Date.now(),
            stage: this.config.stage,
            error: lastError.message
          });

          throw new NetworkError(
            `Failed to connect after ${retryConfig.maxAttempts} attempts. Last error: ${lastError.message}`,
            { retryable: false, context: { attempts: attempt, lastError: lastError.message } }
          );
        }

        // Calculate delay for next attempt with exponential backoff
        const delay = Math.min(
          retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
          retryConfig.maxDelay
        );

        this.logger.logDebug(`Retrying in ${delay}ms...`, {
          type: 'connection_retry_delay',
          delay,
          attempt,
          stage: this.config.stage,
          nextAttempt: attempt + 1
        });
        await sleep(delay);
      }
    }
  }

  /**
   * Disconnects from the TradeAPI service
   */
  async disconnect(): Promise<void> {
    const startTime = Date.now();

    this.connectionState = 'disconnected';

    this.logger.logDebug('Starting disconnection from TradeAPI service', {
      type: 'disconnection_start',
      stage: this.config.stage
    });

    // Disconnect all sockets
    const disconnectPromises: Promise<void>[] = [];

    if (this.pLiveSocket) {
      const liveSocketDisconnectStart = Date.now();
      disconnectPromises.push(
        this.pLiveSocket.disconnect().then(() => {
          const duration = Date.now() - liveSocketDisconnectStart;
          this.logger.logPerformance(`Live socket disconnect`, duration, {
            type: 'live_socket_disconnect',
            stage: this.config.stage
          });
        })
      );
    }

    if (this.pSimSocket) {
      const simSocketDisconnectStart = Date.now();
      disconnectPromises.push(
        this.pSimSocket.disconnect().then(() => {
          const duration = Date.now() - simSocketDisconnectStart;
          this.logger.logPerformance(`Sim socket disconnect`, duration, {
            type: 'sim_socket_disconnect',
            stage: this.config.stage
          });
        })
      );
    }

    if (this.pMdSocket) {
      const mdSocketDisconnectStart = Date.now();
      disconnectPromises.push(
        this.pMdSocket.disconnect().then(() => {
          const duration = Date.now() - mdSocketDisconnectStart;
          this.logger.logPerformance(`Market data socket disconnect`, duration, {
            type: 'md_socket_disconnect',
            stage: this.config.stage
          });
        })
      );
    }

    // Wait for all disconnections to complete
    await Promise.all(disconnectPromises);

    // Clear API clients
    this.pApiClient = null;
    this.pSimApiClient = null;
    this.pMdApiClient = null;

    // Clear tokens
    this.lastToken = null;
    this.expirationTime = null;

    const totalDuration = Date.now() - startTime;

    this.logger.logDebug('Disconnected from TradeAPI service', {
      type: 'disconnection_success',
      stage: this.config.stage,
      duration: totalDuration
    });

    this.logger.logPerformance(`Complete disconnection process`, totalDuration, {
      type: 'complete_disconnection',
      stage: this.config.stage
    });

    // Log memory usage after disconnection
    const memoryUsage = process.memoryUsage();
    this.logger.logMemoryUsage(`Disconnection memory usage`, memoryUsage, {
      type: 'disconnection_memory',
      stage: this.config.stage,
      connectionState: this.connectionState
    });

    // Emit disconnected event
    this.emit('connection', {
      type: 'disconnected',
      timestamp: Date.now(),
      stage: this.config.stage
    });
  }

  /**
   * Initializes REST API clients
   */
  private async initializeRestClients(authData: AccessTokenResponse): Promise<void> {
    const startTime = Date.now();

    // Validate required properties
    if (!authData.accessToken) {
      throw new ValidationError('Access token is required', {
        context: { operation: 'initializeRestClients' }
      });
    }
    if (!authData.userId) {
      throw new ValidationError('User ID is required', {
        context: { operation: 'initializeRestClients' }
      });
    }

    this.logger.logDebug('Initializing REST API clients', {
      type: 'rest_client_init_start',
      stage: this.config.stage,
      userId: authData.userId
    });

    this.pLiveRest = new RestApi({
      baseUrl: URLS[this.config.stage].live,
      accessToken: authData.accessToken,
      userId: authData.userId,
      logger: this.logger,
      sharedCacheManager: this.sharedCacheManager
    });

    this.pSimRest = new RestApi({
      baseUrl: URLS[this.config.stage].sim,
      accessToken: authData.accessToken,
      userId: authData.userId,
      logger: this.logger,
      sharedCacheManager: this.sharedCacheManager
    });

    const duration = Date.now() - startTime;

    this.logger.logDebug('REST API clients initialized successfully', {
      type: 'rest_client_init_success',
      stage: this.config.stage,
      userId: authData.userId,
      duration
    });

    this.logger.logPerformance(`REST client initialization`, duration, {
      type: 'rest_client_init_complete',
      stage: this.config.stage,
      userId: authData.userId
    });
  }

  /**
   * Initializes WebSocket clients
   */
  private async initializeSocketClients(authData: AccessTokenResponse): Promise<void> {
    const startTime = Date.now();

    // Validate required properties (already validated in initializeRestClients, but double-check)
    if (!authData.accessToken || !authData.userId) {
      throw new ValidationError('Access token and user ID are required', {
        context: { operation: 'initializeSocketClients' }
      });
    }

    this.logger.logDebug('Initializing WebSocket clients', {
      type: 'socket_client_init_start',
      stage: this.config.stage,
      userId: authData.userId,
      enableMultiplexing: this.config.enableMultiplexing
    });

    const baseSocketOptions = {
      logger: this.logger,
      connectionTimeout: this.config.connectionTimeout,
      entityTypes: this.config.entityTypes,
      syncImmediate: this.config.syncImmediate ?? true,
      fullOrgSnapshot: this.config.fullOrgSnapshot
    };

    // Live socket always uses standard Socket
    this.pLiveSocket = new Socket({
      url: URLS[this.config.stage].liveWs,
      accessToken: authData.accessToken,
      userId: authData.userId,
      ...baseSocketOptions,
      sharedCacheManager: this.sharedCacheManager
    });

    // Simulation socket can use MultiplexSocket if enabled
    if (this.config.enableMultiplexing && this.config.shardingDivisor) {
      this.pSimSocket = new MultiplexSocket({
        url: URLS[this.config.stage].simWs,
        accessToken: authData.accessToken,
        userId: authData.userId,
        logger: this.logger,
        shardingExpression: {
          divisor: this.config.shardingDivisor,
          expressionType: this.config.shardingType || 'modUserId',
          remainder: 0 // Will be set by MultiplexSocket constructor
        },
        entityTypes: this.config.entityTypes,
        syncImmediate: this.config.syncImmediate ?? true,
        fullOrgSnapshot: this.config.fullOrgSnapshot,
        sharedCacheManager: this.sharedCacheManager
      });
    } else {
      this.pSimSocket = new Socket({
        url: URLS[this.config.stage].simWs,
        accessToken: authData.accessToken,
        userId: authData.userId,
        ...baseSocketOptions,
        sharedCacheManager: this.sharedCacheManager
      });
    }

    // Connect to sockets
    const socketConnectStart = Date.now();
    await this.pSimSocket.connect();
    await this.pLiveSocket.connect();
    const socketConnectDuration = Date.now() - socketConnectStart;

    this.logger.logPerformance(`Socket connections`, socketConnectDuration, {
      type: 'socket_connections',
      stage: this.config.stage,
      userId: authData.userId,
      enableMultiplexing: this.config.enableMultiplexing
    });

    // Initialize additional sockets based on configuration
    if (this.config.enableMdSocket) {
      const mdSocketStart = Date.now();
      // MD socket should not sync entity types - only for market data subscriptions
      this.pMdSocket = new Socket({
        url: URLS[this.config.stage].mdWs,
        accessToken: authData.accessToken,
        userId: authData.userId,
        logger: this.logger,
        connectionTimeout: this.config.connectionTimeout
      });
      await this.pMdSocket.connect();
      const mdSocketDuration = Date.now() - mdSocketStart;

      this.logger.logPerformance(`Market data socket initialization`, mdSocketDuration, {
        type: 'md_socket_init',
        stage: this.config.stage,
        userId: authData.userId
      });
    }

    const duration = Date.now() - startTime;

    this.logger.logDebug('WebSocket clients initialized successfully', {
      type: 'socket_client_init_success',
      stage: this.config.stage,
      userId: authData.userId,
      enableMultiplexing: this.config.enableMultiplexing,
      duration,
      socketConnectDuration
    });

    this.logger.logPerformance(`WebSocket client initialization`, duration, {
      type: 'socket_client_init_complete',
      stage: this.config.stage,
      userId: authData.userId,
      enableMultiplexing: this.config.enableMultiplexing
    });
  }

  /**
   * Initializes API clients
   */
  private async initializeApiClients(): Promise<void> {
    const startTime = Date.now();

    this.logger.logDebug('Initializing API clients', {
      type: 'api_client_init_start',
      stage: this.config.stage
    });

    const liveClientType = this.config.liveClient || 'socket';
    const simClientType = this.config.simClient || 'socket';

    // Initialize market data client first if enabled
    if (this.config.enableMdSocket) {
      this.pMdApiClient = new MdApiClient(this.pMdSocket!);
    }

    // Create ApiClient instances with both socket and REST clients
    // Pass mdClient so calculateOpenPL can access market data
    this.pApiClient = new ApiClient(
      this.pLiveSocket!,
      this.pLiveRest!,
      liveClientType,
      this.rateLimiter,
      this.messageQueue,
      this.pMdApiClient ?? undefined,
      'live',
      this.sdk
    );
    this.pSimApiClient = new ApiClient(
      this.pSimSocket!,
      this.pSimRest!,
      simClientType,
      this.rateLimiter,
      this.messageQueue,
      this.pMdApiClient ?? undefined,
      'sim',
      this.sdk
    );

    const duration = Date.now() - startTime;

    this.logger.logDebug('API clients initialized successfully', {
      type: 'api_client_init_success',
      stage: this.config.stage,
      liveClientType,
      simClientType,
      enableMdSocket: this.config.enableMdSocket,
      duration
    });

    this.logger.logPerformance(`API client initialization`, duration, {
      type: 'api_client_init_complete',
      stage: this.config.stage,
      liveClientType,
      simClientType
    });
  }

  /**
   * Type guard to check if a socket is ready
   */
  private isSocketReady(socket: Socket | MultiplexSocket | null): boolean {
    if (!socket) return false;
    return 'ready' in socket && socket.ready === true;
  }

  /**
   * Health check methods for HealthMonitor integration
   */

  /**
   * Checks the health of the REST API connection
   */
  async checkRestHealth(): Promise<ConnectionHealth> {
    if (!this.isConnected() || !this.pLiveRest) {
      return {
        isHealthy: false,
        lastCheck: Date.now(),
        responseTime: 0,
        error: 'Not connected'
      };
    }

    const startTime = Date.now();
    try {
      // Use a lightweight endpoint to check health
      const isHealthy = await this.pLiveRest.simpleHealthCheck();
      const responseTime = Date.now() - startTime;

      return {
        isHealthy,
        lastCheck: Date.now(),
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        isHealthy: false,
        lastCheck: Date.now(),
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Checks the health of the live trading socket client
   */
  async checkLiveSocketHealth(): Promise<ConnectionHealth> {
    if (!this.isConnected()) {
      return {
        isHealthy: false,
        lastCheck: Date.now(),
        responseTime: 0,
        error: 'Not connected'
      };
    }

    const clientType = this.config.liveClient || 'socket';
    const startTime = Date.now();

    try {
      if (clientType === 'rest') {
        if (!this.pLiveRest) {
          return {
            isHealthy: false,
            lastCheck: Date.now(),
            responseTime: 0,
            error: 'Live REST client not available'
          };
        }

        // Test REST API health with a lightweight endpoint
        await this.pLiveRest.get('auth/me');
        const responseTime = Date.now() - startTime;

        return {
          isHealthy: true,
          lastCheck: Date.now(),
          responseTime,
          error: undefined
        };
      } else {
        if (!this.pLiveSocket) {
          return {
            isHealthy: false,
            lastCheck: Date.now(),
            responseTime: 0,
            error: 'Live socket client not available'
          };
        }

        // Check socket health
        if (this.isSocketReady(this.pLiveSocket)) {
          const responseTime = Date.now() - startTime;
          return {
            isHealthy: true,
            lastCheck: Date.now(),
            responseTime,
            error: undefined
          };
        } else {
          return {
            isHealthy: false,
            lastCheck: Date.now(),
            responseTime: Date.now() - startTime,
            error: 'Socket not ready'
          };
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        isHealthy: false,
        lastCheck: Date.now(),
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Checks the health of the simulation trading socket client
   */
  async checkSimSocketHealth(): Promise<ConnectionHealth> {
    if (!this.isConnected()) {
      return {
        isHealthy: false,
        lastCheck: Date.now(),
        responseTime: 0,
        error: 'Not connected'
      };
    }

    const clientType = this.config.simClient || 'socket';
    const startTime = Date.now();

    try {
      if (clientType === 'rest') {
        if (!this.pSimRest) {
          return {
            isHealthy: false,
            lastCheck: Date.now(),
            responseTime: 0,
            error: 'Sim REST client not available'
          };
        }

        // Test REST API health with a lightweight endpoint
        await this.pSimRest.get('auth/me');
        const responseTime = Date.now() - startTime;

        return {
          isHealthy: true,
          lastCheck: Date.now(),
          responseTime,
          error: undefined
        };
      } else {
        if (!this.pSimSocket) {
          return {
            isHealthy: false,
            lastCheck: Date.now(),
            responseTime: 0,
            error: 'Sim socket client not available'
          };
        }

        // Check socket health
        if (this.isSocketReady(this.pSimSocket)) {
          const responseTime = Date.now() - startTime;
          return {
            isHealthy: true,
            lastCheck: Date.now(),
            responseTime,
            error: undefined
          };
        } else {
          return {
            isHealthy: false,
            lastCheck: Date.now(),
            responseTime: Date.now() - startTime,
            error: 'Socket not ready'
          };
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        isHealthy: false,
        lastCheck: Date.now(),
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Checks the health of the authentication token
   */
  async checkTokenHealth(): Promise<{
    isHealthy: boolean;
    expiresAt: number;
    expiresIn: number;
  }> {
    if (!this.expirationTime) {
      return {
        isHealthy: false,
        expiresAt: 0,
        expiresIn: 0
      };
    }

    const now = Date.now();
    const expiresIn = Math.max(0, this.expirationTime - now);

    return {
      isHealthy: now < this.expirationTime,
      expiresAt: this.expirationTime,
      expiresIn
    };
  }

  /**
   * Triggers reconnection to the TradeAPI service
   */
  async triggerReconnect(): Promise<void> {
    if (this.connectionState === 'reconnecting') {
      this.logger.logVerbose('Reconnection already in progress', {
        metadata: {
          stage: this.config.stage
        }
      });
      return;
    }

    if (!this.lastCredentials) {
      throw new ValidationError('Cannot reconnect - no credentials stored', {
        context: { operation: 'reconnect' }
      });
    }

    this.connectionState = 'reconnecting';

    // Emit reconnecting event
    this.emit('connection', {
      type: 'connecting',
      timestamp: Date.now(),
      stage: this.config.stage
    });

    try {
      // Disconnect first
      await this.disconnect();

      // Attempt reconnection
      await this.connect();

      this.logger.logDebug('Reconnection successful', {
        metadata: {
          stage: this.config.stage
        }
      });
    } catch (error) {
      this.connectionState = 'failed';
      this.logger.log(
        `Reconnection failed: ${error instanceof Error ? error.message : String(error)}`,
        {
          metadata: {
            stage: this.config.stage,
            error: error instanceof Error ? error.message : String(error)
          }
        }
      );

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
}
