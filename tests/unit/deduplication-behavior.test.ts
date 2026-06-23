/**
 * Comprehensive tests for deduplication behavior and edge cases
 * Tests critical scenarios for preventing duplicate processing
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EnhancedMessageQueue } from '../../sdks/enhancedMessageQueue';
import { WinstonLogger } from '../../sdks/winstonLogger';

describe('Deduplication Behavior and Edge Cases', () => {
  let messageQueue: EnhancedMessageQueue;
  let logger: WinstonLogger;

  beforeEach(() => {
    logger = new WinstonLogger({ stage: 'prod' });
    messageQueue = new EnhancedMessageQueue(
      {
        maxSize: 1000,
        enableRetries: true,
        maxRetries: 3,
        retryDelay: 1000,
        enableMaintenanceQueuing: true,
        queueTimeout: 300000,
        enableDeduplication: true,
        deduplicationWindow: 60000
      },
      logger
    );

    // Simulate network issues to force queueing
    (messageQueue as any).networkHealth.isHealthy = false;
  });

  afterEach(() => {
    // Clean up timers and intervals to prevent test hangs
    if (messageQueue) {
      messageQueue.destroy();
    }
  });

  describe('Deduplication Key Generation', () => {
    it('should generate consistent keys for identical requests', () => {
      const endpoint = '/order/placeorder';
      const request1 = { body: { symbol: 'ES', quantity: 1, side: 'buy' } };
      const request2 = { body: { symbol: 'ES', quantity: 1, side: 'buy' } };

      // Generate keys using private method (via any cast for testing)
      const key1 = (messageQueue as any).generateDuplicateKey(endpoint, request1);
      const key2 = (messageQueue as any).generateDuplicateKey(endpoint, request2);

      expect(key1).toBe(key2);
    });

    it('should generate different keys for different requests', () => {
      const endpoint = '/order/placeorder';
      const request1 = { body: { symbol: 'ES', quantity: 1, side: 'buy' } };
      const request2 = { body: { symbol: 'ES', quantity: 2, side: 'buy' } };

      const key1 = (messageQueue as any).generateDuplicateKey(endpoint, request1);
      const key2 = (messageQueue as any).generateDuplicateKey(endpoint, request2);

      expect(key1).not.toBe(key2);
    });

    it('should handle object property order differences', () => {
      const endpoint = '/order/placeorder';
      const request1 = { body: { symbol: 'ES', quantity: 1, side: 'buy' } };
      const request2 = { body: { side: 'buy', symbol: 'ES', quantity: 1 } };

      const key1 = (messageQueue as any).generateDuplicateKey(endpoint, request1);
      const key2 = (messageQueue as any).generateDuplicateKey(endpoint, request2);

      // JSON.stringify should handle this consistently in modern JS
      expect(key1).toBe(key2);
    });

    it('should handle different endpoints with same request data', () => {
      const endpoint1 = '/order/placeorder';
      const endpoint2 = '/order/modifyorder';
      const request = { body: { symbol: 'ES', quantity: 1, side: 'buy' } };

      const key1 = (messageQueue as any).generateDuplicateKey(endpoint1, request);
      const key2 = (messageQueue as any).generateDuplicateKey(endpoint2, request);

      expect(key1).not.toBe(key2);
    });
  });

  describe('Deduplication Window Behavior', () => {
    it('should prevent duplicate messages within deduplication window', () => {
      const endpoint = '/order/placeorder';
      const request = { body: { symbol: 'ES', quantity: 1, side: 'buy' } };

      // First message should be queued
      const messageId1 = messageQueue.enqueueMessage(endpoint as any, request, 'medium', 'system');
      expect(messageId1).toBeTruthy();
      expect(messageId1).not.toBe('');

      // Second identical message should be deduplicated
      const messageId2 = messageQueue.enqueueMessage(endpoint as any, request, 'medium', 'system');
      expect(messageId2).toBe(messageId1); // Should return same message ID
    });

    it('should allow duplicate messages after deduplication window expires', () => {
      const endpoint = '/order/placeorder';
      const request = { body: { symbol: 'ES', quantity: 1, side: 'buy' } };

      // First message
      const messageId1 = messageQueue.enqueueMessage(endpoint as any, request, 'medium', 'system');
      expect(messageId1).toBeTruthy();

      // Simulate time passing beyond deduplication window
      const originalNow = Date.now;
      const currentTime = Date.now();
      Date.now = vi.fn().mockReturnValue(currentTime + 70000); // 70 seconds later

      // Second message should be allowed
      const messageId2 = messageQueue.enqueueMessage(endpoint as any, request, 'medium', 'system');
      expect(messageId2).toBeTruthy();
      expect(messageId2).not.toBe(messageId1);

      Date.now = originalNow; // Restore
    });

    it('should handle deduplication with different priorities', () => {
      const endpoint = '/order/placeorder';
      const request = { body: { symbol: 'ES', quantity: 1, side: 'buy' } };

      // First message with medium priority
      const messageId1 = messageQueue.enqueueMessage(endpoint as any, request, 'medium', 'system');
      expect(messageId1).toBeTruthy();

      // Second identical message with high priority should still be deduplicated
      const messageId2 = messageQueue.enqueueMessage(endpoint as any, request, 'high', 'system');
      expect(messageId2).toBe(messageId1);
    });
  });

  // Note: Deduplication clearing strategies tests removed as they depend on
  // configuration options that were simplified in the new architecture

  describe('Deduplication Statistics', () => {
    it('should track deduplication statistics correctly', () => {
      const endpoint = '/order/placeorder';
      const request = { body: { symbol: 'ES', quantity: 1, side: 'buy' } };

      // Get initial stats
      const initialStats = messageQueue.getDeduplicationStats();
      expect(initialStats.totalEntries).toBe(0);

      // Queue first message
      const messageId1 = messageQueue.enqueueMessage(endpoint as any, request, 'medium', 'system');
      expect(messageId1).toBeTruthy();

      // Check stats after first message
      const statsAfterFirst = messageQueue.getDeduplicationStats();
      expect(statsAfterFirst.totalEntries).toBe(1);

      // Queue duplicate message
      const messageId2 = messageQueue.enqueueMessage(endpoint as any, request, 'medium', 'system');
      expect(messageId2).toBe(messageId1);

      // Stats should remain the same (duplicate not added)
      const statsAfterDuplicate = messageQueue.getDeduplicationStats();
      expect(statsAfterDuplicate.totalEntries).toBe(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty request bodies correctly', () => {
      const endpoint = '/order/placeorder';
      const request1 = { body: {} };
      const request2 = { body: {} };

      const messageId1 = messageQueue.enqueueMessage(endpoint as any, request1, 'medium', 'system');
      const messageId2 = messageQueue.enqueueMessage(endpoint as any, request2, 'medium', 'system');

      expect(messageId1).toBeTruthy();
      expect(messageId2).toBe(messageId1); // Should be deduplicated
    });

    it('should handle null and undefined values in requests', () => {
      const endpoint = '/order/placeorder';
      const request1 = { body: { symbol: 'ES', quantity: null, side: undefined } };
      const request2 = { body: { symbol: 'ES', quantity: null, side: undefined } };

      const messageId1 = messageQueue.enqueueMessage(endpoint as any, request1, 'medium', 'system');
      const messageId2 = messageQueue.enqueueMessage(endpoint as any, request2, 'medium', 'system');

      expect(messageId1).toBeTruthy();
      expect(messageId2).toBe(messageId1); // Should be deduplicated
    });

    it('should handle large request bodies', () => {
      const endpoint = '/order/placeorder';
      const largeData = Array(1000).fill({ symbol: 'ES', quantity: 1, side: 'buy' });
      const request = { body: { orders: largeData } };

      const messageId1 = messageQueue.enqueueMessage(endpoint as any, request, 'medium', 'system');
      const messageId2 = messageQueue.enqueueMessage(endpoint as any, request, 'medium', 'system');

      expect(messageId1).toBeTruthy();
      expect(messageId2).toBe(messageId1); // Should be deduplicated
    });
  });
});
