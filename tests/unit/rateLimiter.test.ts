/**
 * Unit tests for RateLimiter core functionality
 * Tests initialization, configuration, and basic functionality
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RateLimiter } from '../../sdks/rateLimiter';
import { createMockWinstonLogger } from '../setup';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;
  let mockLogger: ReturnType<typeof createMockWinstonLogger>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogger = createMockWinstonLogger();
  });

  afterEach(() => {
    // Clean up timers and intervals to prevent test hangs
    if (rateLimiter) {
      rateLimiter.destroy();
    }
  });

  describe('Initialization', () => {
    it('should initialize with valid configuration', () => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 10,
          requestsPerMinute: 500,
          requestsPerHour: 10000,
          burstMultiplier: 2,
          logViolations: true,
          enableBackoff: true,
          maxBackoffTime: 30000
        },
        mockLogger
      );

      expect(rateLimiter).toBeInstanceOf(RateLimiter);
      expect(rateLimiter).toBeDefined();
    });

    it('should initialize with minimal configuration', () => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 5,
          requestsPerMinute: 300,
          requestsPerHour: 5000,
          burstMultiplier: 1,
          logViolations: false,
          enableBackoff: false,
          maxBackoffTime: 10000
        },
        mockLogger
      );

      expect(rateLimiter).toBeInstanceOf(RateLimiter);
      expect(rateLimiter).toBeDefined();
    });

    it('should initialize with high rate limits', () => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 100,
          requestsPerMinute: 5000,
          requestsPerHour: 100000,
          burstMultiplier: 5,
          logViolations: true,
          enableBackoff: true,
          maxBackoffTime: 60000
        },
        mockLogger
      );

      expect(rateLimiter).toBeInstanceOf(RateLimiter);
      expect(rateLimiter).toBeDefined();
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid RPS values', () => {
      const validRPS = [1, 10, 100, 1000];

      validRPS.forEach(rps => {
        expect(
          () =>
            new RateLimiter(
              {
                requestsPerSecond: rps,
                requestsPerMinute: 500,
                requestsPerHour: 10000,
                burstMultiplier: 2,
                logViolations: true,
                enableBackoff: true,
                maxBackoffTime: 30000
              },
              mockLogger
            )
        ).not.toThrow();
      });
    });

    it('should accept valid RPM values', () => {
      const validRPM = [60, 500, 1000, 10000];

      validRPM.forEach(rpm => {
        expect(
          () =>
            new RateLimiter(
              {
                requestsPerSecond: 10,
                requestsPerMinute: rpm,
                requestsPerHour: 10000,
                burstMultiplier: 2,
                logViolations: true,
                enableBackoff: true,
                maxBackoffTime: 30000
              },
              mockLogger
            )
        ).not.toThrow();
      });
    });

    it('should accept valid RPH values', () => {
      const validRPH = [3600, 10000, 50000, 100000];

      validRPH.forEach(rph => {
        expect(
          () =>
            new RateLimiter(
              {
                requestsPerSecond: 10,
                requestsPerMinute: 500,
                requestsPerHour: rph,
                burstMultiplier: 2,
                logViolations: true,
                enableBackoff: true,
                maxBackoffTime: 30000
              },
              mockLogger
            )
        ).not.toThrow();
      });
    });

    it('should accept valid burst multiplier values', () => {
      const validBursts = [1, 2, 5, 10];

      validBursts.forEach(burst => {
        expect(
          () =>
            new RateLimiter(
              {
                requestsPerSecond: 10,
                requestsPerMinute: 500,
                requestsPerHour: 10000,
                burstMultiplier: burst,
                logViolations: true,
                enableBackoff: true,
                maxBackoffTime: 30000
              },
              mockLogger
            )
        ).not.toThrow();
      });
    });
  });

  describe('Logger Integration', () => {
    it('should initialize with Winston logger', () => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 10,
          requestsPerMinute: 500,
          requestsPerHour: 10000,
          burstMultiplier: 2,
          logViolations: true,
          enableBackoff: true,
          maxBackoffTime: 30000
        },
        mockLogger
      );

      expect(rateLimiter).toBeDefined();
      expect(mockLogger).toBeDefined();
    });

    it('should work with any logger type', () => {
      const minimalLogger = createMockWinstonLogger();
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 10,
          requestsPerMinute: 500,
          requestsPerHour: 10000,
          burstMultiplier: 2,
          logViolations: true,
          enableBackoff: true,
          maxBackoffTime: 30000
        },
        minimalLogger
      );

      expect(rateLimiter).toBeDefined();
    });
  });

  describe('Backoff Configuration', () => {
    it('should initialize with backoff enabled', () => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 10,
          requestsPerMinute: 500,
          requestsPerHour: 10000,
          burstMultiplier: 2,
          logViolations: true,
          enableBackoff: true,
          maxBackoffTime: 30000
        },
        mockLogger
      );

      expect(rateLimiter).toBeDefined();
    });

    it('should initialize with backoff disabled', () => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 10,
          requestsPerMinute: 500,
          requestsPerHour: 10000,
          burstMultiplier: 2,
          logViolations: true,
          enableBackoff: false,
          maxBackoffTime: 30000
        },
        mockLogger
      );

      expect(rateLimiter).toBeDefined();
    });

    it('should initialize with custom max backoff time', () => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 10,
          requestsPerMinute: 500,
          requestsPerHour: 10000,
          burstMultiplier: 2,
          logViolations: true,
          enableBackoff: true,
          maxBackoffTime: 60000
        },
        mockLogger
      );

      expect(rateLimiter).toBeDefined();
    });
  });

  describe('Instance Properties', () => {
    beforeEach(() => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 10,
          requestsPerMinute: 500,
          requestsPerHour: 10000,
          burstMultiplier: 2,
          logViolations: true,
          enableBackoff: true,
          maxBackoffTime: 30000
        },
        mockLogger
      );
    });

    it('should have the correct constructor name', () => {
      expect(rateLimiter.constructor.name).toBe('RateLimiter');
    });

    it('should be a valid RateLimiter instance', () => {
      expect(rateLimiter).toBeDefined();
      expect(typeof rateLimiter).toBe('object');
    });
  });

  describe('Constructor Edge Cases', () => {
    it('should handle very high rate limits', () => {
      expect(
        () =>
          new RateLimiter(
            {
              requestsPerSecond: 10000,
              requestsPerMinute: 1000000,
              requestsPerHour: 100000000,
              burstMultiplier: 10,
              logViolations: true,
              enableBackoff: true,
              maxBackoffTime: 30000
            },
            mockLogger
          )
      ).not.toThrow();
    });

    it('should handle very low rate limits', () => {
      expect(
        () =>
          new RateLimiter(
            {
              requestsPerSecond: 1,
              requestsPerMinute: 60,
              requestsPerHour: 3600,
              burstMultiplier: 1,
              logViolations: false,
              enableBackoff: false,
              maxBackoffTime: 1000
            },
            mockLogger
          )
      ).not.toThrow();
    });

    it('should handle very high burst multipliers', () => {
      expect(
        () =>
          new RateLimiter(
            {
              requestsPerSecond: 10,
              requestsPerMinute: 500,
              requestsPerHour: 10000,
              burstMultiplier: 100,
              logViolations: true,
              enableBackoff: true,
              maxBackoffTime: 30000
            },
            mockLogger
          )
      ).not.toThrow();
    });

    it('should handle burst multiplier of 1', () => {
      expect(
        () =>
          new RateLimiter(
            {
              requestsPerSecond: 10,
              requestsPerMinute: 500,
              requestsPerHour: 10000,
              burstMultiplier: 1,
              logViolations: true,
              enableBackoff: true,
              maxBackoffTime: 30000
            },
            mockLogger
          )
      ).not.toThrow();
    });
  });

  describe('Configuration Combinations', () => {
    it('should handle all features enabled', () => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 25,
          requestsPerMinute: 1500,
          requestsPerHour: 50000,
          burstMultiplier: 3,
          logViolations: true,
          enableBackoff: true,
          maxBackoffTime: 45000
        },
        mockLogger
      );

      expect(rateLimiter).toBeDefined();
    });

    it('should handle all features disabled', () => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 25,
          requestsPerMinute: 1500,
          requestsPerHour: 50000,
          burstMultiplier: 3,
          logViolations: false,
          enableBackoff: false,
          maxBackoffTime: 45000
        },
        mockLogger
      );

      expect(rateLimiter).toBeDefined();
    });

    it('should handle mixed configuration', () => {
      rateLimiter = new RateLimiter(
        {
          requestsPerSecond: 25,
          requestsPerMinute: 1500,
          requestsPerHour: 50000,
          burstMultiplier: 3,
          logViolations: true,
          enableBackoff: false,
          maxBackoffTime: 45000
        },
        mockLogger
      );

      expect(rateLimiter).toBeDefined();
    });
  });
});
