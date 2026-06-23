import EventEmitter from 'eventemitter3';
import { ConfigError, NetworkError, ServerError } from '../api/errors';
import type { ConnectionEvent } from '../types/events';
import type { ConnectionHealth, ConnectionState } from './connectionManager';
import type { WinstonLogger } from './winstonLogger';

export interface HealthStatus {
  overall: boolean;
  rest: ConnectionHealth;
  liveSocket: ConnectionHealth;
  simSocket: ConnectionHealth;
  token: {
    isHealthy: boolean;
    expiresAt: number; // timestamp
    expiresIn: number; // milliseconds
  };
  lastUpdated: number;
}

export interface HealthMonitorConfig {
  healthCheckInterval?: number;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  exponentialBackoff?: boolean;
  healthCheckTimeout?: number;
  logVerbosity?: 'minimal' | 'normal' | 'verbose' | 'debug';
}

export interface ReconnectStats {
  totalAttempts: number;
  successfulReconnects: number;
  failedReconnects: number;
  lastReconnectAttempt: number | null;
  lastSuccessfulReconnect: number | null;
  averageReconnectTime: number;
}

/**
 * Interface for health check functions that are injected into HealthMonitor
 */
export interface HealthCheckFunctions {
  checkRestHealth: () => Promise<ConnectionHealth>;
  checkLiveSocketHealth: () => Promise<ConnectionHealth>;
  checkSimSocketHealth: () => Promise<ConnectionHealth>;
  checkTokenHealth: () => Promise<{
    isHealthy: boolean;
    expiresAt: number;
    expiresIn: number;
  }>;
  triggerReconnect: () => Promise<void>;
  getConnectionState: () => ConnectionState;
  // Token renewal function
  renewToken: () => Promise<{
    accessToken: string;
    expirationTime: string;
  }>;
}

/**
 * Manages health monitoring and reconnection for the TradeSDK
 *
 * This class handles:
 * - Health checks for REST API and WebSocket connections
 * - Token expiration monitoring
 * - Automatic reconnection with exponential backoff
 * - Health status reporting
 */
export class HealthMonitor extends EventEmitter {
  private config: HealthMonitorConfig;
  private logger: WinstonLogger;
  private healthCheckInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectAttempts: number = 0;
  private isReconnecting: boolean = false;
  private reconnectStartTime: number | null = null;
  private reconnectStats: ReconnectStats = {
    totalAttempts: 0,
    successfulReconnects: 0,
    failedReconnects: 0,
    lastReconnectAttempt: null,
    lastSuccessfulReconnect: null,
    averageReconnectTime: 0
  };
  private cachedHealthStatus: HealthStatus | null = null;

  // Health check functions (injected by TradeSDK)
  private checkRestHealth?: () => Promise<ConnectionHealth>;
  private checkLiveSocketHealth?: () => Promise<ConnectionHealth>;
  private checkSimSocketHealth?: () => Promise<ConnectionHealth>;
  private checkTokenHealth?: () => Promise<{
    isHealthy: boolean;
    expiresAt: number;
    expiresIn: number;
  }>;
  private triggerReconnect?: () => Promise<void>;
  private getConnectionState?: () => ConnectionState;
  // Token renewal function
  private renewToken?: () => Promise<{
    accessToken: string;
    expirationTime: string;
  }>;

  constructor(config: HealthMonitorConfig, logger: WinstonLogger) {
    super(); // Call EventEmitter constructor
    this.config = config;
    this.logger = logger;
  }

  /**
   * Sets the health check functions (dependency injection)
   */
  setHealthCheckFunctions(functions: HealthCheckFunctions): void {
    this.checkRestHealth = functions.checkRestHealth;
    this.checkLiveSocketHealth = functions.checkLiveSocketHealth;
    this.checkSimSocketHealth = functions.checkSimSocketHealth;
    this.checkTokenHealth = functions.checkTokenHealth;
    this.triggerReconnect = functions.triggerReconnect;
    this.getConnectionState = functions.getConnectionState;
    this.renewToken = functions.renewToken;

    // Only require essential functions (REST and Token)
    if (!this.checkRestHealth || !this.checkTokenHealth) {
      throw new ConfigError('Failed to set essential health check functions (REST and Token)', {
        context: {
          operation: 'setHealthCheckFunctions',
          hasRestHealth: !!this.checkRestHealth,
          hasTokenHealth: !!this.checkTokenHealth
        }
      });
    }
  }

  /**
   * Start health monitoring
   */
  startMonitoring(): void {
    const startTime = Date.now();

    if (this.healthCheckInterval) {
      this.logger.logDebug('Health monitoring already started', {
        type: 'health_monitor_startup',
        status: 'already_running'
      });
      return;
    }

    // Don't start monitoring if no interval is configured
    if (!this.config.healthCheckInterval) {
      this.logger.logDebug('Health monitoring not started - no interval configured', {
        type: 'health_monitor_startup',
        status: 'no_interval_covered'
      });
      return;
    }

    // Perform an initial health check immediately to populate the cache
    this.performHealthCheck().catch((error: Error) => {
      this.logger.logError('Initial health check failed', error, {
        type: 'initial_health_check_failure'
      });
    });

    this.healthCheckInterval = setInterval(async () => {
      const checkStartTime = Date.now();
      try {
        await this.performHealthCheck();
        const checkDuration = Date.now() - checkStartTime;

        // Log performance metrics for health checks (only if verbose logging is enabled)
        if (this.config.logVerbosity === 'verbose' || this.config.logVerbosity === 'debug') {
          this.logger.logPerformance(`Health check cycle`, checkDuration, {
            type: 'health_check_cycle',
            interval: this.config.healthCheckInterval || 30000
          });
        }

        // Log performance warnings for slow health checks (only if verbose logging is enabled)
        if (this.config.logVerbosity === 'verbose' || this.config.logVerbosity === 'debug') {
          if (checkDuration > (this.config.healthCheckTimeout || 5000)) {
            this.logger.logPerformanceWarning(
              `Health check cycle`,
              checkDuration,
              this.config.healthCheckTimeout || 5000,
              {
                type: 'health_check_slow',
                threshold: this.config.healthCheckTimeout || 5000
              }
            );
          }
        }
      } catch (error) {
        const checkDuration = Date.now() - checkStartTime;
        this.logger.logError(`Health check cycle failed`, error as Error, {
          type: 'health_check_failure',
          duration: checkDuration
        });
      }
    }, this.config.healthCheckInterval);

    const duration = Date.now() - startTime;
    this.logger.logDebug('Health monitoring started', {
      type: 'health_monitor_startup',
      duration,
      interval: this.config.healthCheckInterval,
      maxReconnectAttempts: this.config.maxReconnectAttempts || 5
    });
  }

  /**
   * Start health monitoring (alias for startMonitoring for backward compatibility)
   */
  startHealthMonitoring(): void {
    this.startMonitoring();
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring(): void {
    const startTime = Date.now();

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;

      const duration = Date.now() - startTime;
      this.logger.logNormal('Health monitoring stopped', {
        type: 'health_monitor_shutdown',
        duration,
        totalReconnectAttempts: this.reconnectStats.totalAttempts,
        successfulReconnects: this.reconnectStats.successfulReconnects
      });
    }
  }

  /**
   * Stop health monitoring (alias for stopMonitoring for backward compatibility)
   */
  stopHealthMonitoring(): void {
    this.stopMonitoring();
  }

  /**
   * Perform a comprehensive health check
   */
  async performHealthCheck(): Promise<HealthStatus> {
    // Check if essential health check functions are set
    if (!this.checkRestHealth || !this.checkTokenHealth) {
      throw new ConfigError('Essential health check functions not set (REST and Token)', {
        context: {
          operation: 'performHealthCheck',
          hasRestHealth: !!this.checkRestHealth,
          hasTokenHealth: !!this.checkTokenHealth
        }
      });
    }

    const startTime = Date.now();
    const healthStatus: HealthStatus = {
      overall: true,
      rest: { isHealthy: false, lastCheck: 0, responseTime: 0 },
      liveSocket: { isHealthy: false, lastCheck: 0, responseTime: 0 },
      simSocket: { isHealthy: false, lastCheck: 0, responseTime: 0 },
      token: { isHealthy: false, expiresAt: 0, expiresIn: 0 },
      lastUpdated: Date.now()
    };

    try {
      // Check REST API health (required)
      const restStartTime = Date.now();
      healthStatus.rest = await this.checkRestHealth();
      const restDuration = Date.now() - restStartTime;

      // Check live socket health (optional)
      let liveSocketStartTime: number | null = null;
      let liveSocketDuration = 0;
      if (this.checkLiveSocketHealth) {
        try {
          liveSocketStartTime = Date.now();
          healthStatus.liveSocket = await this.checkLiveSocketHealth();
          liveSocketDuration = Date.now() - liveSocketStartTime;

          if (this.config.logVerbosity === 'verbose' || this.config.logVerbosity === 'debug') {
            if (liveSocketDuration > (this.config.healthCheckTimeout || 5000)) {
              this.logger.logPerformanceWarning(
                `Live socket health check`,
                liveSocketDuration,
                this.config.healthCheckTimeout || 5000,
                {
                  type: 'live_socket_health_check_slow',
                  threshold: this.config.healthCheckTimeout || 5000
                }
              );
            }
          }
        } catch (error) {
          // Live socket health check failed, but don't fail the overall health check
          healthStatus.liveSocket = {
            isHealthy: false,
            lastCheck: Date.now(),
            responseTime: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }

      // Check sim socket health (optional)
      let simSocketStartTime: number | null = null;
      let simSocketDuration = 0;
      if (this.checkSimSocketHealth) {
        try {
          simSocketStartTime = Date.now();
          healthStatus.simSocket = await this.checkSimSocketHealth();
          simSocketDuration = Date.now() - simSocketStartTime;

          if (this.config.logVerbosity === 'verbose' || this.config.logVerbosity === 'debug') {
            if (simSocketDuration > (this.config.healthCheckTimeout || 5000)) {
              this.logger.logPerformanceWarning(
                `Sim socket health check`,
                simSocketDuration,
                this.config.healthCheckTimeout || 5000,
                {
                  type: 'sim_socket_health_check_slow',
                  threshold: this.config.healthCheckTimeout || 5000
                }
              );
            }
          }
        } catch (error) {
          // Sim socket health check failed, but don't fail the overall health check
          healthStatus.simSocket = {
            isHealthy: false,
            lastCheck: Date.now(),
            responseTime: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }

      // Check token health (required)
      const tokenStartTime = Date.now();
      healthStatus.token = await this.checkTokenHealth();
      const tokenDuration = Date.now() - tokenStartTime;

      // Check if token needs renewal (renew 10 minutes before expiration)
      if (healthStatus.token.isHealthy && healthStatus.token.expiresIn > 0) {
        const renewalThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
        if (healthStatus.token.expiresIn < renewalThreshold) {
          this.logger.logNormal('Token renewal needed', {
            type: 'token_renewal_triggered',
            expiresIn: Math.round(healthStatus.token.expiresIn / 1000 / 60), // minutes
            renewalThreshold: Math.round(renewalThreshold / 1000 / 60), // minutes
            expiresAt: new Date(healthStatus.token.expiresAt).toISOString()
          });

          // Trigger token renewal asynchronously (don't block health check)
          this.triggerTokenRenewal().catch((error: Error) => {
            this.logger.logError('Token renewal failed during health check', error, {
              type: 'token_renewal_health_check_failure'
            });
          });
        }
      }

      if (this.config.logVerbosity === 'verbose' || this.config.logVerbosity === 'debug') {
        if (tokenDuration > (this.config.healthCheckTimeout || 5000)) {
          this.logger.logPerformanceWarning(
            `Token health check`,
            tokenDuration,
            this.config.healthCheckTimeout || 5000,
            {
              type: 'token_health_check_slow',
              threshold: this.config.healthCheckTimeout || 5000
            }
          );
        }
      }

      // Determine overall health based on required components only
      healthStatus.overall = healthStatus.rest.isHealthy && healthStatus.token.isHealthy;

      // Validate the overall calculation
      if (healthStatus.rest.isHealthy && healthStatus.token.isHealthy && !healthStatus.overall) {
        throw new ServerError(
          'Overall health calculation bug: required components are true but overall is false',
          { context: { type: 'health_check_validation' } }
        );
      }

      const totalDuration = Date.now() - startTime;

      // Consolidate all health check results into a single log entry
      const healthComponents = {
        rest: {
          isHealthy: healthStatus.rest.isHealthy,
          duration: restDuration,
          responseTime: healthStatus.rest.responseTime,
          error: healthStatus.rest.error
        },
        liveSocket: {
          isHealthy: healthStatus.liveSocket.isHealthy,
          duration: liveSocketStartTime ? Date.now() - liveSocketStartTime : 0,
          responseTime: healthStatus.liveSocket.responseTime,
          error: healthStatus.liveSocket.error
        },
        simSocket: {
          isHealthy: healthStatus.simSocket.isHealthy,
          duration: simSocketStartTime ? Date.now() - simSocketStartTime : 0,
          responseTime: healthStatus.simSocket.responseTime,
          error: healthStatus.simSocket.error
        },
        token: {
          isHealthy: healthStatus.token.isHealthy,
          duration: tokenDuration,
          expiresAt: healthStatus.token.expiresAt,
          expiresIn: healthStatus.token.expiresIn
        }
      };

      const performanceMetrics = {
        totalDuration,
        restDuration,
        liveSocketDuration: liveSocketStartTime ? Date.now() - liveSocketStartTime : 0,
        simSocketDuration: simSocketStartTime ? Date.now() - simSocketStartTime : 0,
        tokenDuration
      };

      // Single consolidated health check log
      this.logger.logHealthConsolidated(
        'Health check completed',
        healthStatus.overall,
        healthComponents,
        performanceMetrics
      );

      // Cache the health status for getHealthStatus() to return
      this.cachedHealthStatus = healthStatus;

      // Emit health status
      this.emit('health', healthStatus);

      // Log memory usage during health check (only if verbose logging is enabled)
      if (this.config.logVerbosity === 'verbose' || this.config.logVerbosity === 'debug') {
        const memoryUsage = process.memoryUsage();
        this.logger.logMemoryUsage(`Health check memory usage`, memoryUsage, {
          type: 'health_check_memory',
          overall: healthStatus.overall
        });
      }

      return healthStatus;
    } catch (error) {
      const totalDuration = Date.now() - startTime;

      this.logger.logError(`Health check failed`, error as Error, {
        type: 'health_check_failure',
        duration: totalDuration,
        partialStatus: healthStatus
      });

      healthStatus.overall = false;

      // Cache the failed health status
      this.cachedHealthStatus = healthStatus;

      return healthStatus;
    }
  }

  /**
   * Trigger reconnection with exponential backoff
   */
  async triggerReconnection(): Promise<void> {
    const startTime = Date.now();

    if (this.isReconnecting) {
      this.logger.logNormal('Reconnection already in progress', {
        type: 'reconnection_trigger',
        status: 'already_reconnecting',
        reconnectAttempts: this.reconnectAttempts
      });
      return;
    }

    this.isReconnecting = true;
    this.reconnectStartTime = Date.now();
    this.reconnectAttempts++;

    this.logger.logNormal('Starting reconnection process', {
      type: 'reconnection_start',
      attempt: this.reconnectAttempts,
      maxAttempts: this.config.maxReconnectAttempts || 5
    });

    try {
      if (this.triggerReconnect) {
        const reconnectStartTime = Date.now();
        await this.triggerReconnect();
        const reconnectDuration = Date.now() - reconnectStartTime;

        this.reconnectStats.successfulReconnects++;
        this.reconnectStats.lastSuccessfulReconnect = Date.now();

        // Update average reconnection time
        const totalReconnectTime =
          this.reconnectStats.averageReconnectTime *
            (this.reconnectStats.successfulReconnects - 1) +
          reconnectDuration;
        this.reconnectStats.averageReconnectTime =
          totalReconnectTime / this.reconnectStats.successfulReconnects;

        this.logger.logConnection(`Reconnection successful`, {
          duration: reconnectDuration,
          attempt: this.reconnectAttempts,
          totalAttempts: this.reconnectStats.totalAttempts,
          averageReconnectTime: this.reconnectStats.averageReconnectTime
        });

        // Log performance metrics for reconnection
        this.logger.logPerformance(`Reconnection successful`, reconnectDuration, {
          type: 'reconnection_success',
          attempt: this.reconnectAttempts,
          totalAttempts: this.reconnectStats.totalAttempts
        });

        // Reset reconnection attempts on success
        this.reconnectAttempts = 0;

        // Emit reconnection event
        this.emit('reconnect', {
          type: 'reconnecting',
          timestamp: Date.now(),
          attempt: this.reconnectAttempts
        } as ConnectionEvent);
      }
    } catch (error) {
      const reconnectDuration = Date.now() - (this.reconnectStartTime || startTime);
      this.reconnectStats.failedReconnects++;

      this.logger.logError(`Reconnection failed`, error as Error, {
        type: 'reconnection_failure',
        attempt: this.reconnectAttempts,
        duration: reconnectDuration,
        totalAttempts: this.reconnectStats.totalAttempts
      });

      // Log performance warning for failed reconnections
      if (reconnectDuration > 10000) {
        // 10 seconds
        this.logger.logPerformanceWarning(`Reconnection attempt`, reconnectDuration, 10000, {
          type: 'reconnection_slow',
          attempt: this.reconnectAttempts,
          threshold: 10000
        });
      }

      // Emit reconnection event
      this.emit('reconnect', {
        type: 'reconnect_failed',
        timestamp: Date.now(),
        attempt: this.reconnectAttempts,
        error: error instanceof Error ? error.message : String(error)
      } as ConnectionEvent);

      // Check if we should continue trying
      if (this.reconnectAttempts < (this.config.maxReconnectAttempts || 5)) {
        const delay = this.calculateReconnectDelay();

        this.logger.logNormal(`Scheduling next reconnection attempt`, {
          type: 'reconnection_schedule',
          nextAttempt: this.reconnectAttempts + 1,
          delay,
          maxAttempts: this.config.maxReconnectAttempts || 5
        });

        setTimeout(() => {
          this.isReconnecting = false;
          this.triggerReconnection();
        }, delay);
      } else {
        this.logger.logError(
          `Max reconnection attempts reached`,
          new NetworkError('Max reconnection attempts exceeded', {
            retryable: false,
            context: {
              type: 'reconnection_max_attempts',
              totalAttempts: this.reconnectAttempts,
              maxAttempts: this.config.maxReconnectAttempts || 5
            }
          }),
          {
            type: 'reconnection_max_attempts',
            totalAttempts: this.reconnectAttempts,
            maxAttempts: this.config.maxReconnectAttempts || 5
          }
        );

        this.isReconnecting = false;

        // Emit reconnection failure event
        this.emit('reconnect', {
          type: 'reconnect_failed',
          timestamp: Date.now(),
          attempt: this.reconnectAttempts,
          error: 'Max reconnection attempts exceeded'
        } as ConnectionEvent);
      }
    } finally {
      const totalDuration = Date.now() - startTime;
      this.logger.logPerformance(`Reconnection process`, totalDuration, {
        type: 'reconnection_process',
        attempt: this.reconnectAttempts,
        success: this.reconnectStats.successfulReconnects > 0,
        totalAttempts: this.reconnectStats.totalAttempts
      });
    }
  }

  /**
   * Calculate reconnection delay with exponential backoff
   */
  private calculateReconnectDelay(): number {
    const baseDelay = this.config.reconnectDelay || 5000;

    if (this.config.exponentialBackoff !== false) {
      const exponentialDelay = baseDelay * Math.pow(2, this.reconnectAttempts - 1);
      const maxDelay = 30000; // 30 seconds max
      return Math.min(exponentialDelay, maxDelay);
    }

    return baseDelay;
  }

  /**
   * Get current health status
   */
  getHealthStatus(): HealthStatus {
    const startTime = Date.now();

    // Return cached health status if available
    const healthStatus = this.cachedHealthStatus || {
      overall: false,
      rest: { isHealthy: false, lastCheck: 0, responseTime: 0 },
      liveSocket: { isHealthy: false, lastCheck: 0, responseTime: 0 },
      simSocket: { isHealthy: false, lastCheck: 0, responseTime: 0 },
      token: { isHealthy: false, expiresAt: 0, expiresIn: 0 },
      lastUpdated: Date.now()
    };

    const duration = Date.now() - startTime;
    this.logger.logPerformance(`Health status retrieval`, duration, {
      type: 'health_status_retrieval',
      overall: healthStatus.overall,
      lastUpdated: healthStatus.lastUpdated,
      isCached: !!this.cachedHealthStatus
    });

    return healthStatus;
  }

  /**
   * Check health (alias for performHealthCheck for backward compatibility)
   */
  async checkHealth(): Promise<HealthStatus> {
    return this.performHealthCheck();
  }

  /**
   * Get reconnection statistics
   */
  getReconnectStats(): ReconnectStats {
    const startTime = Date.now();

    const stats = { ...this.reconnectStats };

    const duration = Date.now() - startTime;
    this.logger.logPerformance(`Reconnect stats retrieval`, duration, {
      type: 'reconnect_stats_retrieval',
      totalAttempts: stats.totalAttempts,
      successfulReconnects: stats.successfulReconnects,
      failedReconnects: stats.failedReconnects
    });

    return stats;
  }

  /**
   * Reset reconnection statistics
   */
  resetReconnectStats(): void {
    const startTime = Date.now();

    this.reconnectStats = {
      totalAttempts: 0,
      successfulReconnects: 0,
      failedReconnects: 0,
      lastReconnectAttempt: null,
      lastSuccessfulReconnect: null,
      averageReconnectTime: 0
    };
    this.reconnectAttempts = 0;

    const duration = Date.now() - startTime;
    this.logger.logNormal('Reconnection statistics reset', {
      type: 'reconnect_stats_reset',
      duration
    });
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    const startTime = Date.now();

    this.stopMonitoring();

    // Clear any pending reconnection attempts
    this.isReconnecting = false;

    const duration = Date.now() - startTime;
    this.logger.logNormal('Health monitor destroyed', {
      type: 'health_monitor_destroy',
      duration,
      finalStats: {
        totalReconnectAttempts: this.reconnectStats.totalAttempts,
        successfulReconnects: this.reconnectStats.successfulReconnects,
        failedReconnects: this.reconnectStats.failedReconnects
      }
    });
  }

  /**
   * Trigger token renewal when token is close to expiration
   */
  private async triggerTokenRenewal(): Promise<void> {
    try {
      this.logger.logNormal('Starting token renewal process', {
        type: 'token_renewal_started'
      });

      if (!this.renewToken) {
        throw new ConfigError('Token renewal function not set');
      }

      // Call the actual token renewal function
      const result = await this.renewToken();

      this.logger.logNormal('Token renewal successful', {
        type: 'token_renewal_success',
        newTokenLength: result.accessToken.length,
        newExpirationTime: result.expirationTime
      });

      // Emit token renewal event
      this.emit('token_renewal', {
        type: 'token_renewal_success',
        timestamp: Date.now(),
        newToken: result.accessToken,
        newExpirationTime: result.expirationTime
      });
    } catch (error) {
      this.logger.logError('Token renewal failed', error as Error, {
        type: 'token_renewal_failure'
      });

      // Emit token renewal failure event
      this.emit('token_renewal', {
        type: 'token_renewal_failure',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : String(error)
      });

      throw error;
    }
  }
}
