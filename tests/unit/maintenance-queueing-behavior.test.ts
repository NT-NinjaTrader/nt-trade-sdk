/**
 * Simplified tests for maintenance window queueing behavior
 */

import { describe, expect, it } from 'vitest';
import { EnhancedMessageQueue } from '../../sdks/enhancedMessageQueue';
import { WinstonLogger } from '../../sdks/winstonLogger';
import type { MaintenanceWindow } from '../../types/maintenance';

describe('Maintenance Window Queueing Behavior', () => {
  // Create test maintenance windows
  const createActiveMaintenanceWindow = (): MaintenanceWindow[] => [
    {
      id: 'test_maintenance',
      name: 'Test Maintenance Window',
      description: 'Always active for testing',
      priority: 'medium',
      affectedEndpoints: [
        '/user/signuporganizationmember',
        '/user/createevaluationusers',
        '/user/opendemoaccount',
        '/user/createevaluationaccounts'
      ],
      queueBehavior: 'queue_specific',
      isActive: () => true
    }
  ];

  describe('Maintenance Window Coverage', () => {
    it('should queue requests for covered endpoints during maintenance', () => {
      const logger = new WinstonLogger({
        stage: 'staging',
        enableFile: false,
        level: 'error'
      });

      const messageQueue = new EnhancedMessageQueue(
        {
          maxSize: 1000,
          enableRetries: true,
          maxRetries: 3,
          retryDelay: 1000,
          enableNetworkDetection: false,
          maintenanceConfig: {
            enableMaintenanceDetection: true,
            enableAutomaticQueuing: true,
            maintenanceWindows: createActiveMaintenanceWindow(),
            timezone: 'CT',
            queueTimeout: 300000,
            retryAttempts: 3
          },
          enableMaintenanceQueuing: true,
          queueTimeout: 300000,
          enableDeduplication: true,
          deduplicationWindow: 60000
        },
        logger
      );

      const coveredEndpoints = [
        '/user/signuporganizationmember',
        '/user/createevaluationusers',
        '/user/opendemoaccount',
        '/user/createevaluationaccounts'
      ];

      // Test with maintenance window active
      coveredEndpoints.forEach(endpoint => {
        const messageId = messageQueue.enqueueMessage(
          endpoint as any,
          { body: { test: 'data' } },
          'medium',
          'system'
        );

        expect(messageId).toBeTruthy();
        expect(messageId).not.toBe('');
      });

      // Cleanup
      messageQueue.destroy();
    });

    it('should NOT queue requests for uncovered endpoints during maintenance', () => {
      const logger = new WinstonLogger({
        stage: 'staging',
        enableFile: false,
        level: 'error'
      });

      const messageQueue = new EnhancedMessageQueue(
        {
          maxSize: 1000,
          enableRetries: true,
          maxRetries: 3,
          retryDelay: 1000,
          enableNetworkDetection: false,
          maintenanceConfig: {
            enableMaintenanceDetection: true,
            enableAutomaticQueuing: true,
            maintenanceWindows: createActiveMaintenanceWindow(),
            timezone: 'CT',
            queueTimeout: 300000,
            retryAttempts: 3
          },
          enableMaintenanceQueuing: true,
          queueTimeout: 300000,
          enableDeduplication: true,
          deduplicationWindow: 60000
        },
        logger
      );

      const uncoveredEndpoints = [
        '/order/placeorder',
        '/order/modifyorder',
        '/order/cancelorder',
        '/account/list',
        '/position/list'
      ];

      // These endpoints are not in the affectedEndpoints list
      uncoveredEndpoints.forEach(endpoint => {
        const messageId = messageQueue.enqueueMessage(
          endpoint as any,
          { body: { test: 'data' } },
          'medium',
          'system'
        );

        // Should return empty string (not queued)
        expect(messageId).toBe('');
      });

      // Cleanup
      messageQueue.destroy();
    });
  });
});
