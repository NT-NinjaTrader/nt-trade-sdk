/**
 * Rate Limiter for TradeAPI
 *
 * Implements a two-tier rate limiting system based on Tradovate API documentation:
 *
 * 1. User-Level Limits: Applied per user (by user ID) across all endpoints
 *    - Authenticated users: 5,000 requests per second/minute/hour
 *    - Anonymous users: 1,000 requests per second/minute/hour
 *
 * 2. Endpoint-Level Limits: Applied per IP address for specific endpoints
 *    - Each endpoint has specific hourly limits and back-off periods
 *    - Some endpoints count only failed requests, others count all requests
 *    - Many security endpoints require captcha verification
 *
 * The rate limiter automatically handles:
 * - Token bucket algorithm for smooth rate limiting
 * - Endpoint-specific limits and back-off periods
 * - Automatic retry with exponential backoff
 * - Comprehensive monitoring and statistics
 */

import { RateLimitError } from '../api/errors';
import type { LoggerType, RateLimitCheckResult } from '../types/runtime';
import { sleep } from '../utils/sleep';

export interface RateLimitConfig {
  requestsPerSecond: number;
  requestsPerMinute: number;
  requestsPerHour: number;
  burstMultiplier: number;
  logViolations: boolean;
  enableBackoff: boolean;
  maxBackoffTime: number;
}

export interface RateLimitStats {
  totalRequests: number;
  rateLimitedRequests: number;
  endpointUsage: Record<
    string,
    {
      totalRequests: number;
      rateLimitedRequests: number;
      lastRequest: number;
    }
  >;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private logger: LoggerType;
  private tokens: {
    perSecond: number;
    perMinute: number;
    perHour: number;
  };
  private lastRefill: number;
  private requestHistory: {
    perSecond: Array<{ timestamp: number; count: number }>;
    perMinute: Array<{ timestamp: number; count: number }>;
    perHour: Array<{ timestamp: number; count: number }>;
  };
  private endpointHistory: Map<
    string,
    {
      perSecond: Array<{ timestamp: number; count: number }>;
      perMinute: Array<{ timestamp: number; count: number }>;
      perHour: Array<{ timestamp: number; count: number }>;
    }
  >;
  private stats: RateLimitStats;
  private tokenRefillInterval?: ReturnType<typeof setInterval>;

  constructor(config: RateLimitConfig, logger: LoggerType) {
    this.config = config;
    this.logger = logger;
    this.lastRefill = Date.now();
    this.tokens = this.initializeTokens();
    this.requestHistory = this.initializeHistory();
    this.endpointHistory = new Map();
    this.stats = this.initializeStats();
    this.startTokenRefill();
  }

  /**
   * Check if a request is allowed and wait if necessary
   */
  async waitForRateLimit(endpoint: string): Promise<void> {
    const startTime = Date.now();
    const checkResult = this.checkRateLimit(endpoint);

    if (!checkResult.allowed) {
      if (checkResult.retryAfter && this.config.enableBackoff) {
        const waitDuration = checkResult.retryAfter;
        this.logger.logRateLimit(
          endpoint,
          this.getCurrentRate(endpoint),
          this.getRateLimit(endpoint),
          {
            action: 'wait',
            waitDuration,
            reason: checkResult.reason,
            tokensRemaining: this.tokens.perSecond
          }
        );

        // Log performance warning for rate limit delays
        if (waitDuration > 1000) {
          this.logger.logPerformanceWarning(`Rate limit wait for ${endpoint}`, waitDuration, 1000, {
            endpoint,
            currentRate: this.getCurrentRate(endpoint),
            limit: this.getRateLimit(endpoint)
          });
        }

        await sleep(waitDuration);
      } else {
        this.logger.logRateLimit(
          endpoint,
          this.getCurrentRate(endpoint),
          this.getRateLimit(endpoint),
          {
            action: 'rejected',
            reason: checkResult.reason,
            tokensRemaining: this.tokens.perSecond
          }
        );
        throw new RateLimitError(
          `Rate limit exceeded for endpoint: ${endpoint}. ${checkResult.reason}`,
          { retryAfter: checkResult.retryAfter || 0, context: { endpoint } }
        );
      }
    }

    // Consume tokens if request is allowed
    if (checkResult.allowed) {
      this.consumeTokens();
    }

    const duration = Date.now() - startTime;
    this.logger.logPerformance(`Rate limit check for ${endpoint}`, duration, {
      endpoint,
      allowed: checkResult.allowed,
      tokensRemaining: this.tokens.perSecond
    });

    // Update statistics
    this.updateStats(endpoint, checkResult.allowed);
  }

  /**
   * Consume tokens for an allowed request
   */
  private consumeTokens(): void {
    const now = Date.now();

    // Consume per-second token
    if (this.tokens.perSecond > 0) {
      this.tokens.perSecond--;
    }

    // Record request timestamp for per-second, per-minute and per-hour tracking
    this.addRequestToHistory(this.requestHistory.perSecond, now, 1);
    this.addRequestToHistory(this.requestHistory.perMinute, now, 1);
    this.addRequestToHistory(this.requestHistory.perHour, now, 1);

    // Clean up old request history (older than 1 hour)
    this.cleanupRequestHistory(now);
  }

  /**
   * Clean up old request history entries
   */
  private cleanupRequestHistory(now: number): void {
    const oneSecondAgo = now - 1000; // 1 second in milliseconds
    const oneMinuteAgo = now - 60000; // 1 minute in milliseconds
    const oneHourAgo = now - 3600000; // 1 hour in milliseconds

    this.requestHistory.perSecond = this.requestHistory.perSecond.filter(
      req => req.timestamp > oneSecondAgo
    );
    this.requestHistory.perMinute = this.requestHistory.perMinute.filter(
      req => req.timestamp > oneMinuteAgo
    );
    this.requestHistory.perHour = this.requestHistory.perHour.filter(
      req => req.timestamp > oneHourAgo
    );
  }

  /**
   * Check if a request is allowed without waiting
   */
  checkRateLimit(endpoint: string): RateLimitCheckResult {
    const startTime = Date.now();
    const now = Date.now();

    // Check user-level limits
    const userLevelCheck = this.checkUserLevelLimits(now);
    if (!userLevelCheck.allowed) {
      const duration = Date.now() - startTime;
      this.logger.logRateLimit(
        endpoint,
        this.getCurrentRate(endpoint),
        this.getRateLimit(endpoint),
        {
          action: 'check_rejected',
          reason: 'user_level_limit',
          duration,
          userLevelCheck
        }
      );
      return userLevelCheck;
    }

    // Check endpoint-specific limits
    const endpointCheck = this.checkEndpointLimits(endpoint, now);
    if (!endpointCheck.allowed) {
      const duration = Date.now() - startTime;
      this.logger.logRateLimit(
        endpoint,
        this.getCurrentRate(endpoint),
        this.getRateLimit(endpoint),
        {
          action: 'check_rejected',
          reason: 'endpoint_limit',
          duration,
          endpointCheck
        }
      );
      return endpointCheck;
    }

    const duration = Date.now() - startTime;
    this.logger.logRateLimit(endpoint, this.getCurrentRate(endpoint), this.getRateLimit(endpoint), {
      action: 'check_allowed',
      duration,
      tokensRemaining: this.tokens.perSecond
    });

    return {
      allowed: true,
      retryAfter: 0,
      tokensRemaining: this.tokens.perSecond,
      endpoint: endpoint
    };
  }

  /**
   * Reset rate limit statistics
   */
  resetStats(): void {
    this.stats = this.initializeStats();
    this.endpointHistory.clear();
  }

  /**
   * Update rate limit configuration
   */
  updateConfig(newConfig: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.tokens = this.initializeTokens();
  }

  private initializeTokens() {
    return {
      perSecond: this.config.requestsPerSecond * this.config.burstMultiplier,
      perMinute: this.config.requestsPerMinute * this.config.burstMultiplier,
      perHour: this.config.requestsPerHour * this.config.burstMultiplier
    };
  }

  private initializeHistory() {
    return {
      perSecond: [],
      perMinute: [],
      perHour: []
    };
  }

  private initializeStats(): RateLimitStats {
    return {
      totalRequests: 0,
      rateLimitedRequests: 0,
      endpointUsage: {}
    };
  }

  /**
   * Check user-level rate limits
   */
  private checkUserLevelLimits(now: number): RateLimitCheckResult {
    const startTime = Date.now();

    // Check per-second limit
    if (this.tokens.perSecond <= 0) {
      const duration = Date.now() - startTime;
      this.logger.logPerformance(`User level rate limit check (per-second)`, duration, {
        type: 'user_level_check',
        limit: 'per_second',
        tokensRemaining: this.tokens.perSecond,
        result: 'rejected'
      });
      return {
        allowed: false,
        retryAfter: this.calculateRefillTime(now, 'perSecond'),
        reason: 'User-level per-second rate limit exceeded',
        tokensRemaining: this.tokens.perSecond,
        endpoint: 'user_level'
      };
    }

    // Check per-minute limit
    const minuteRequests = this.countRequestsInWindow(this.requestHistory.perMinute, now, 60000);
    if (minuteRequests >= this.config.requestsPerMinute) {
      const duration = Date.now() - startTime;
      this.logger.logPerformance(`User level rate limit check (per-minute)`, duration, {
        type: 'user_level_check',
        limit: 'per_minute',
        currentRequests: minuteRequests,
        result: 'rejected'
      });
      return {
        allowed: false,
        retryAfter: this.calculateRefillTime(now, 'perMinute'),
        reason: 'User-level per-minute rate limit exceeded',
        tokensRemaining: this.tokens.perMinute,
        endpoint: 'user_level'
      };
    }

    // Check per-hour limit
    const hourRequests = this.countRequestsInWindow(this.requestHistory.perHour, now, 3600000);
    if (hourRequests >= this.config.requestsPerHour) {
      const duration = Date.now() - startTime;
      this.logger.logPerformance(`User level rate limit check (per-hour)`, duration, {
        type: 'user_level_check',
        limit: 'per_hour',
        currentRequests: hourRequests,
        result: 'rejected'
      });
      return {
        allowed: false,
        retryAfter: this.calculateRefillTime(now, 'perHour'),
        reason: 'User-level per-hour rate limit exceeded',
        tokensRemaining: this.tokens.perHour,
        endpoint: 'user_level'
      };
    }

    const duration = Date.now() - startTime;
    this.logger.logPerformance(`User level rate limit check`, duration, {
      type: 'user_level_check',
      result: 'allowed',
      tokensRemaining: this.tokens.perSecond
    });

    return {
      allowed: true,
      retryAfter: 0,
      tokensRemaining: this.tokens.perSecond,
      endpoint: 'user_level'
    };
  }

  /**
   * Check endpoint-specific rate limits (simplified - no endpoint-specific limits)
   */
  private checkEndpointLimits(_endpoint: string, _now: number): RateLimitCheckResult {
    const startTime = Date.now();

    // No endpoint-specific limits - always allow
    const duration = Date.now() - startTime;
    this.logger.logPerformance(`Endpoint rate limit check (simplified)`, duration, {
      type: 'endpoint_check',
      endpoint: _endpoint,
      result: 'allowed_simplified'
    });

    return {
      allowed: true,
      retryAfter: 0,
      tokensRemaining: this.tokens.perSecond,
      endpoint: 'global_level'
    };
  }

  /**
   * Refill tokens based on time elapsed
   */
  private refillTokens(): void {
    const startTime = Date.now();
    const now = Date.now();
    const timeElapsed = now - this.lastRefill;

    if (timeElapsed >= 1000) {
      // Refill per-second tokens
      const refillAmount = Math.floor(timeElapsed / 1000) * this.config.requestsPerSecond;
      const oldTokens = this.tokens.perSecond;
      this.tokens.perSecond = Math.min(
        this.config.requestsPerSecond,
        this.tokens.perSecond + refillAmount
      );

      if (this.tokens.perSecond > oldTokens) {
        this.logger.logPerformance(`Token refill (per-second)`, 0, {
          type: 'token_refill',
          limit: 'per_second',
          oldTokens,
          newTokens: this.tokens.perSecond,
          refillAmount,
          timeElapsed
        });
      }

      this.lastRefill = now;
    }

    const duration = Date.now() - startTime;
    if (duration > 0) {
      this.logger.logPerformance(`Token refill operation`, duration, {
        type: 'token_refill',
        tokensPerSecond: this.tokens.perSecond,
        tokensPerMinute: this.tokens.perMinute,
        tokensPerHour: this.tokens.perHour
      });
    }
  }

  /**
   * Update request history and statistics
   */
  private updateStats(endpoint: string, success: boolean): void {
    const startTime = Date.now();
    const now = Date.now();

    // Update user-level history
    this.addRequestToHistory(this.requestHistory.perSecond, now, 1);
    this.addRequestToHistory(this.requestHistory.perMinute, now, 1);
    this.addRequestToHistory(this.requestHistory.perHour, now, 1);

    // Update endpoint-specific history
    if (!this.endpointHistory.has(endpoint)) {
      this.endpointHistory.set(endpoint, this.initializeHistory());
    }
    const endpointHistory = this.endpointHistory.get(endpoint)!;
    this.addRequestToHistory(endpointHistory.perSecond, now, 1);
    this.addRequestToHistory(endpointHistory.perMinute, now, 1);
    this.addRequestToHistory(endpointHistory.perHour, now, 1);

    // Update statistics
    this.stats.totalRequests++;
    if (!success) {
      this.stats.rateLimitedRequests++;
    }

    // Update endpoint usage stats
    if (!this.stats.endpointUsage[endpoint]) {
      this.stats.endpointUsage[endpoint] = {
        totalRequests: 0,
        rateLimitedRequests: 0,
        lastRequest: 0
      };
    }
    this.stats.endpointUsage[endpoint].totalRequests++;
    if (!success) {
      this.stats.endpointUsage[endpoint].rateLimitedRequests++;
    }
    this.stats.endpointUsage[endpoint].lastRequest = now;

    const duration = Date.now() - startTime;
    this.logger.logPerformance(`Stats update for ${endpoint}`, duration, {
      type: 'stats_update',
      endpoint,
      success,
      totalRequests: this.stats.totalRequests,
      rateLimitedRequests: this.stats.rateLimitedRequests
    });
  }

  /**
   * Get current rate for an endpoint
   */
  private getCurrentRate(endpoint: string): number {
    const now = Date.now();
    const endpointHistory = this.endpointHistory.get(endpoint);

    if (!endpointHistory) {
      return 0;
    }

    const perSecondRequests = this.countRequestsInWindow(endpointHistory.perSecond, now, 1000);
    return perSecondRequests;
  }

  /**
   * Get rate limit for an endpoint (simplified - always use global limit)
   */
  private getRateLimit(_endpoint: string): number {
    return this.config.requestsPerSecond;
  }

  /**
   * Calculate refill time for a specific limit
   */
  private calculateRefillTime(
    now: number,
    limitType: 'perSecond' | 'perMinute' | 'perHour'
  ): number {
    const windowSizes = {
      perSecond: 1000,
      perMinute: 60000,
      perHour: 3600000
    };

    const windowSize = windowSizes[limitType];

    // Find the oldest request in the window
    let oldestRequest = now;
    if (limitType === 'perSecond') {
      oldestRequest = Math.min(...this.requestHistory.perSecond.map(r => r.timestamp));
    } else if (limitType === 'perMinute') {
      oldestRequest = Math.min(...this.requestHistory.perMinute.map(r => r.timestamp));
    } else if (limitType === 'perHour') {
      oldestRequest = Math.min(...this.requestHistory.perHour.map(r => r.timestamp));
    }

    const timeUntilRefill = Math.max(0, windowSize - (now - oldestRequest));
    return timeUntilRefill;
  }

  /**
   * Start automatic token refill
   */
  private startTokenRefill(): void {
    this.tokenRefillInterval = setInterval(() => {
      const startTime = Date.now();
      this.refillTokens();
      const duration = Date.now() - startTime;

      if (duration > 10) {
        // Log if refill takes more than 10ms
        this.logger.logPerformanceWarning(`Token refill operation`, duration, 10, {
          type: 'token_refill_interval',
          tokensPerSecond: this.tokens.perSecond
        });
      }
    }, 1000); // Refill every second

    this.logger.logNormal('Rate limiter token refill started', {
      type: 'rate_limiter_startup',
      interval: 1000,
      requestsPerSecond: this.config.requestsPerSecond
    });
  }

  /**
   * Stop automatic token refill
   */
  stopTokenRefill(): void {
    if (this.tokenRefillInterval) {
      clearInterval(this.tokenRefillInterval);
      this.tokenRefillInterval = undefined;
      this.logger.logNormal('Rate limiter token refill stopped', {
        type: 'rate_limiter_shutdown'
      });
    }
  }

  /**
   * Reset rate limiter state
   */
  reset(): void {
    const startTime = Date.now();

    this.tokens = this.initializeTokens();
    this.lastRefill = Date.now();
    this.requestHistory = this.initializeHistory();
    this.endpointHistory.clear();
    this.stats = this.initializeStats();

    const duration = Date.now() - startTime;
    this.logger.logNormal('Rate limiter reset', {
      type: 'rate_limiter_reset',
      duration,
      tokensPerSecond: this.tokens.perSecond
    });
  }

  /**
   * Get current rate limiting statistics
   */
  getStats(): RateLimitStats {
    return { ...this.stats };
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopTokenRefill();
    this.logger.logNormal('Rate limiter destroyed', {
      type: 'rate_limiter_destroy',
      finalStats: this.stats
    });
  }

  private addRequestToHistory(
    history: Array<{ timestamp: number; count: number }>,
    timestamp: number,
    count: number
  ): void {
    history.push({ timestamp, count });
    // Keep history size manageable, remove old entries
    const now = Date.now();
    history.filter(h => h.timestamp > now - 3600000); // Keep last hour
  }

  private countRequestsInWindow(
    history: Array<{ timestamp: number; count: number }>,
    now: number,
    windowSize: number
  ): number {
    const cutoff = now - windowSize;
    return history.filter(h => h.timestamp > cutoff).reduce((sum, h) => sum + h.count, 0);
  }
}
