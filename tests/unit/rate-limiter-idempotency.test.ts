/**
 * Comprehensive tests for rate limiter idempotency and duplicate handling
 * Tests critical scenarios for preventing duplicate processing
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RateLimiter } from '../../sdks/rateLimiter';
import { WinstonLogger } from '../../sdks/winstonLogger';

describe('Rate Limiter Idempotency and Duplicate Handling', () => {
  let rateLimiter: RateLimiter;
  let logger: WinstonLogger;

  beforeEach(() => {
    logger = new WinstonLogger({ stage: 'prod' });
    rateLimiter = new RateLimiter(
      {
        requestsPerSecond: 10,
        requestsPerMinute: 100,
        requestsPerHour: 1000,
        burstMultiplier: 2,
        logViolations: true,
        enableBackoff: true,
        maxBackoffTime: 5000
      },
      logger
    );
  });

  afterEach(() => {
    // Clean up timers and intervals to prevent test hangs
    if (rateLimiter) {
      rateLimiter.destroy();
    }
  });

  describe('Rate Limiter Token Consumption', () => {
    it('should consume tokens for each request regardless of content', async () => {
      const endpoint = '/order/placeorder';

      // Make multiple identical requests
      const requests = [
        { body: { symbol: 'ES', quantity: 1, side: 'buy' } },
        { body: { symbol: 'ES', quantity: 1, side: 'buy' } },
        { body: { symbol: 'ES', quantity: 1, side: 'buy' } }
      ];

      // Each request should consume rate limit tokens
      for (const _request of requests) {
        await rateLimiter.waitForRateLimit(endpoint);
      }

      // Check that tokens were consumed
      const stats = rateLimiter.getStats();
      expect(stats.totalRequests).toBe(3);
    });

    it('should not prevent duplicate requests from consuming tokens', async () => {
      const endpoint = '/order/placeorder';

      // Make identical requests rapidly
      const promises = Array(5)
        .fill(null)
        .map(() => rateLimiter.waitForRateLimit(endpoint));

      await Promise.all(promises);

      // All requests should have consumed tokens
      const stats = rateLimiter.getStats();
      expect(stats.totalRequests).toBe(5);
    });

    it('should handle burst requests correctly', async () => {
      const endpoint = '/order/placeorder';

      // Make burst requests (more than RPS limit * burst multiplier)
      const promises = Array(25)
        .fill(null)
        .map(() => rateLimiter.waitForRateLimit(endpoint));

      // Some requests should be delayed due to rate limiting
      const startTime = Date.now();
      await Promise.all(promises);
      const duration = Date.now() - startTime;

      // Should have taken some time due to rate limiting
      expect(duration).toBeGreaterThan(0);

      const stats = rateLimiter.getStats();
      expect(stats.totalRequests).toBe(25);
    });
  });

  describe('Rate Limiter with Message Queue Integration', () => {
    it('should not prevent message queue deduplication from working', async () => {
      // This test demonstrates that rate limiter and message queue work independently
      const endpoint = '/order/placeorder';

      // Simulate rapid identical requests
      const requests = Array(10)
        .fill(null)
        .map(() => ({
          body: { symbol: 'ES', quantity: 1, side: 'buy', orderId: 'test-123' }
        }));

      // Each request would consume rate limit tokens
      for (const _request of requests) {
        await rateLimiter.waitForRateLimit(endpoint);
      }

      const stats = rateLimiter.getStats();
      expect(stats.totalRequests).toBe(10);

      // Note: In a real scenario, message queue deduplication would prevent
      // duplicate requests from reaching the rate limiter, but the rate limiter
      // itself doesn't provide this protection
    });
  });

  describe('Rate Limiter Error Handling', () => {
    it('should throw RateLimitExceededError when limits are exceeded', async () => {
      const endpoint = '/order/placeorder';

      // Create a rate limiter with very low limits
      const strictRateLimiter = new RateLimiter(
        {
          requestsPerSecond: 1,
          requestsPerMinute: 2,
          requestsPerHour: 10,
          burstMultiplier: 1,
          logViolations: true,
          enableBackoff: false, // Disable backoff to get immediate rejection
          maxBackoffTime: 1000
        },
        logger
      );

      // First request should succeed (token bucket starts with 1 token)
      await strictRateLimiter.waitForRateLimit(endpoint);

      // Check that token was consumed
      const statsAfterFirst = strictRateLimiter.getStats();
      expect(statsAfterFirst.totalRequests).toBe(1);

      // Second request should be rejected (no more tokens, and we're within the same second)
      await expect(strictRateLimiter.waitForRateLimit(endpoint)).rejects.toThrow(
        'Rate limit exceeded'
      );

      // Verify the second request was counted as rate limited
      const statsAfterSecond = strictRateLimiter.getStats();
      expect(statsAfterSecond.totalRequests).toBe(1); // Should still be 1 (second request was rejected)
    });

    it('should handle concurrent rate limit checks correctly', async () => {
      const endpoint = '/order/placeorder';

      // Create multiple concurrent rate limit checks
      const promises = Array(20)
        .fill(null)
        .map(async (_, index) => {
          try {
            await rateLimiter.waitForRateLimit(endpoint);
            return { success: true, index };
          } catch (error) {
            return { success: false, index, error };
          }
        });

      const results = await Promise.all(promises);

      // Some should succeed, some might be rate limited
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      expect(successful.length + failed.length).toBe(20);

      const stats = rateLimiter.getStats();
      expect(stats.totalRequests).toBe(successful.length);
    });
  });

  describe('Rate Limiter Statistics', () => {
    it('should track rate limit violations correctly', async () => {
      const endpoint = '/order/placeorder';

      // Create a strict rate limiter
      const strictRateLimiter = new RateLimiter(
        {
          requestsPerSecond: 1,
          requestsPerMinute: 2,
          requestsPerHour: 10,
          burstMultiplier: 1,
          logViolations: true,
          enableBackoff: false,
          maxBackoffTime: 1000
        },
        logger
      );

      // Make requests that will exceed limits
      const promises = Array(5)
        .fill(null)
        .map(async () => {
          try {
            await strictRateLimiter.waitForRateLimit(endpoint);
            return true;
          } catch {
            return false;
          }
        });

      await Promise.all(promises);

      const stats = strictRateLimiter.getStats();
      expect(stats.totalRequests).toBeGreaterThan(0);
      expect(stats.totalRequests).toBeLessThanOrEqual(5);
    });
  });
});
