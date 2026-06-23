import EventEmitter from 'eventemitter3';
import type { Endpoint, RequestForUrl } from '../api/endpoints';
import type { MaintenanceConfig, MaintenanceWindow } from '../types/maintenance';
import { DEFAULT_MAINTENANCE_CONFIG, getMaintenanceInfoForEndpoint } from '../types/maintenance';
import type { WinstonLogger } from './winstonLogger';

/**
 * Enhanced message queue entry with network and maintenance awareness
 */
export interface EnhancedQueuedMessage<T extends Endpoint['url'] = Endpoint['url']> {
  id: string;
  url: T;
  request: RequestForUrl<T>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'trading' | 'account' | 'market-data' | 'user-management';
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  lastRetryAttempt: number | null;
  networkFailure: boolean;
  maintenanceQueued: boolean;
  maintenanceWindow?: MaintenanceWindow;
  expiresAt: number;
  metadata?: Record<string, any>;
}

/**
 * Network health status
 */
export interface NetworkHealth {
  isHealthy: boolean;
  lastCheck: number;
  consecutiveFailures: number;
  lastFailureTime: number | null;
  estimatedRecoveryTime: number | null;
}

/**
 * Enhanced message queue configuration
 */
export interface EnhancedMessageQueueConfig {
  maxSize: number;
  enableRetries: boolean;
  maxRetries: number;
  retryDelay: number;
  enableMaintenanceQueuing: boolean;
  queueTimeout: number;
  enableDeduplication: boolean;
  deduplicationWindow: number;
  maintenanceConfig?: MaintenanceConfig;
  enableNetworkDetection?: boolean;
}

/**
 * Enhanced Message Queue with automatic network outage and maintenance window handling
 */
export class EnhancedMessageQueue<
  T extends Endpoint['url'] = Endpoint['url']
> extends EventEmitter {
  private config: EnhancedMessageQueueConfig;
  private logger: WinstonLogger;
  private queue: EnhancedQueuedMessage<T>[] = [];
  private isProcessing: boolean = false;
  private processor?: (message: EnhancedQueuedMessage<T>) => Promise<any>;
  private networkHealth: NetworkHealth = {
    isHealthy: true,
    lastCheck: Date.now(),
    consecutiveFailures: 0,
    lastFailureTime: null,
    estimatedRecoveryTime: null
  };
  private networkHealthInterval?: ReturnType<typeof setInterval>;
  private deduplicationMap: Map<string, { messageId: string; timestamp: number }> = new Map();

  constructor(config: Partial<EnhancedMessageQueueConfig>, logger: WinstonLogger) {
    super();

    // Apply defaults and sensible fallbacks for removed options
    this.config = {
      ...DEFAULT_ENHANCED_QUEUE_CONFIG,
      ...config
    };
    this.logger = logger;

    // Start network health monitoring if enabled
    if (this.config.enableNetworkDetection !== false) {
      this.startNetworkHealthMonitoring();
    }
  }

  /**
   * Add a message to the queue with automatic network and maintenance detection
   */
  enqueueMessage(
    url: T,
    request: RequestForUrl<T>,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    category: 'system' | 'trading' | 'account' | 'market-data' | 'user-management' = 'system'
  ): string {
    const startTime = Date.now();

    // Check if we should queue due to maintenance
    const maintenanceConfig = this.config.maintenanceConfig || DEFAULT_MAINTENANCE_CONFIG;
    const maintenanceInfo = getMaintenanceInfoForEndpoint(url, maintenanceConfig);
    const shouldQueueForMaintenance = Boolean(
      maintenanceInfo && this.config.enableMaintenanceQueuing
    );

    // Check if we should queue due to network issues
    const shouldQueueForNetwork = !this.networkHealth.isHealthy;

    // Determine if message should be queued
    const shouldQueue = shouldQueueForMaintenance || shouldQueueForNetwork;

    // If we shouldn't queue this message, return empty string immediately
    if (!shouldQueue) {
      const duration = Date.now() - startTime;
      this.logger.logVerbose(`Message for ${url} not queued - no maintenance or network issues`);

      // Log queue operation performance
      this.logger.logQueueOperation('enqueue', this.queue.length, duration, {
        url,
        priority,
        reason: 'not_queued',
        dataSize: JSON.stringify(request).length
      });

      return '';
    }

    if (this.queue.length >= this.config.maxSize) {
      const duration = Date.now() - startTime;
      this.logger.warn(`Queue full, cannot enqueue message for ${url}`);

      // Log queue operation performance
      this.logger.logQueueOperation('enqueue', this.queue.length, duration, {
        url,
        priority,
        reason: 'queue_full',
        dataSize: JSON.stringify(request).length
      });

      return '';
    }

    // Check for duplicate messages if deduplication is enabled
    if (this.config.enableDeduplication) {
      const duplicateKey = this.generateDuplicateKey(url, request);
      const existing = this.deduplicationMap.get(duplicateKey);

      if (existing && Date.now() - existing.timestamp < this.config.deduplicationWindow) {
        const duration = Date.now() - startTime;
        this.logger.logVerbose(`Duplicate message detected for ${url}, skipping`);

        // Log queue operation performance
        this.logger.logQueueOperation('enqueue', this.queue.length, duration, {
          url,
          priority,
          reason: 'duplicate',
          dataSize: JSON.stringify(request).length
        });

        return existing.messageId;
      }
    }

    const messageId = this.generateMessageId();
    const now = Date.now();

    const message: EnhancedQueuedMessage<T> = {
      id: messageId,
      url,
      request,
      priority,
      category,
      timestamp: now,
      retryCount: 0,
      maxRetries: this.config.maxRetries,
      lastRetryAttempt: null,
      networkFailure: shouldQueueForNetwork,
      maintenanceQueued: shouldQueueForMaintenance,
      maintenanceWindow: maintenanceInfo || undefined,
      expiresAt: now + this.config.queueTimeout,
      metadata: {
        reason: shouldQueueForMaintenance
          ? 'maintenance'
          : shouldQueueForNetwork
            ? 'network'
            : 'manual',
        maintenanceWindow: maintenanceInfo?.id,
        networkHealth: this.networkHealth.isHealthy ? 'healthy' : 'unhealthy'
      }
    };

    // Always enable priority
    this.insertWithPriority(message);

    // Update deduplication map
    if (this.config.enableDeduplication) {
      const duplicateKey = this.generateDuplicateKey(url, request);
      this.deduplicationMap.set(duplicateKey, { messageId, timestamp: now });
    }

    const duration = Date.now() - startTime;
    this.logger.logNormal(
      `Message enqueued for ${url} with priority ${priority} (queue size: ${this.queue.length})`
    );

    // Log queue operation performance
    this.logger.logQueueOperation('enqueue', this.queue.length, duration, {
      url,
      priority,
      reason: 'success',
      dataSize: JSON.stringify(request).length
    });

    // Emit queue event
    this.emit('message_queued', {
      messageId,
      url,
      priority,
      reason: message.metadata?.reason,
      timestamp: now
    });

    return messageId;
  }

  /**
   * Process all messages in the queue
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing || !this.processor) {
      return;
    }

    const startTime = Date.now();
    this.isProcessing = true;
    this.logger.logVerbose(`Starting queue processing with ${this.queue.length} messages`);

    try {
      let processedCount = 0;
      let failedCount = 0;
      let expiredCount = 0;
      let requeuedCount = 0;

      while (this.queue.length > 0) {
        const message = this.queue.shift()!;
        const messageStartTime = Date.now();

        // Check if message has expired
        if (Date.now() > message.expiresAt) {
          const duration = Date.now() - messageStartTime;
          expiredCount++;

          this.logger.logVerbose(`Message ${message.id} for ${message.url} has expired, removing`);

          // Clear deduplication entry for expired messages
          this.clearDeduplicationEntry(message);

          // Log queue operation performance
          this.logger.logQueueOperation('dequeue', this.queue.length, duration, {
            url: message.url,
            reason: 'expired',
            messageId: message.id
          });

          this.emit('message_expired', {
            messageId: message.id,
            url: message.url
          });
          continue;
        }

        // Check if we should process this message now
        if (this.shouldProcessMessage(message)) {
          try {
            await this.processor(message);
            const duration = Date.now() - messageStartTime;
            processedCount++;

            this.logger.logNormal(
              `Successfully processed message ${message.id} for ${message.url}`
            );

            // Clear deduplication entry for successfully processed messages
            this.clearDeduplicationEntry(message);

            // Log queue operation performance
            this.logger.logQueueOperation('process', this.queue.length, duration, {
              url: message.url,
              reason: 'success',
              messageId: message.id,
              retryCount: message.retryCount
            });

            this.emit('message_processed', {
              messageId: message.id,
              url: message.url
            });
          } catch (error) {
            const duration = Date.now() - messageStartTime;
            failedCount++;

            // Log queue operation performance for failed messages
            this.logger.logQueueOperation('process', this.queue.length, duration, {
              url: message.url,
              reason: 'failed',
              messageId: message.id,
              retryCount: message.retryCount,
              error: error instanceof Error ? error.message : String(error)
            });

            this.handleProcessingError(message, error);
          }
        } else {
          // Re-queue message if conditions aren't right
          const duration = Date.now() - messageStartTime;
          requeuedCount++;

          // Log queue operation performance for requeued messages
          this.logger.logQueueOperation('dequeue', this.queue.length, duration, {
            url: message.url,
            reason: 'requeued',
            messageId: message.id
          });

          this.requeueMessage(message);
        }
      }

      // Log batch operation performance
      const totalDuration = Date.now() - startTime;
      const totalMessages = processedCount + failedCount + expiredCount + requeuedCount;
      const avgDuration = totalMessages > 0 ? totalDuration / totalMessages : 0;

      if (totalMessages > 0) {
        this.logger.logBatchOperation(
          'queue_processing',
          totalMessages,
          totalDuration,
          avgDuration,
          {
            processedCount,
            failedCount,
            expiredCount,
            requeuedCount,
            queueSize: this.queue.length
          }
        );
      }
    } finally {
      this.isProcessing = false;
      this.logger.logVerbose('Queue processing completed');
    }
  }

  /**
   * Check if a message should be processed now
   */
  private shouldProcessMessage(message: EnhancedQueuedMessage<T>): boolean {
    // Check if message was queued for maintenance and maintenance is still active
    if (message.maintenanceQueued && message.maintenanceWindow) {
      // Handle both function and boolean forms of isActive (for backward compatibility and testing)
      const isActive =
        typeof message.maintenanceWindow.isActive === 'function'
          ? message.maintenanceWindow.isActive()
          : message.maintenanceWindow.isActive;

      if (isActive) {
        this.logger.logVerbose(`Message ${message.id} still in maintenance window, skipping`);
        return false;
      }
    }

    // Check if message was queued for network issues and network is still down
    if (message.networkFailure && !this.networkHealth.isHealthy) {
      this.logger.logVerbose(`Message ${message.id} network still down, skipping`);
      return false;
    }

    // Check retry limits
    if (message.retryCount >= message.maxRetries) {
      this.logger.logNormal(`Message ${message.id} exceeded retry limit, removing`);

      // Clear deduplication entry for messages that exceeded retry limits
      this.clearDeduplicationEntry(message);

      this.emit('message_failed', {
        messageId: message.id,
        url: message.url,
        reason: 'max_retries_exceeded'
      });
      return false;
    }

    return true;
  }

  /**
   * Handle processing errors with retry logic
   */
  private handleProcessingError(message: EnhancedQueuedMessage<T>, error: unknown): void {
    message.retryCount++;
    message.lastRetryAttempt = Date.now();

    this.logger.logError(`Error processing message ${message.id} for ${message.url}: ${error}`);

    if (message.retryCount < message.maxRetries) {
      // Calculate retry delay with exponential backoff
      const delay = this.config.retryDelay * Math.pow(2, message.retryCount - 1);

      setTimeout(() => {
        this.requeueMessage(message);
      }, delay);

      this.logger.logNormal(
        `Scheduling retry ${message.retryCount}/${message.maxRetries} for message ${message.id} in ${delay}ms`
      );
    } else {
      this.logger.logMinimal(`Message ${message.id} failed after ${message.maxRetries} retries`);

      // Clear deduplication entry for messages that failed after max retries
      this.clearDeduplicationEntry(message);

      this.emit('message_failed', {
        messageId: message.id,
        url: message.url,
        reason: 'processing_failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Re-queue a message for later processing
   */
  private requeueMessage(message: EnhancedQueuedMessage<T>): void {
    // Always enable priority
    this.insertWithPriority(message);
  }

  /**
   * Start network health monitoring
   */
  private startNetworkHealthMonitoring(): void {
    this.networkHealthInterval = setInterval(() => {
      this.checkNetworkHealth();
    }, 30000); // 30 seconds - sensible default
  }

  /**
   * Check network health by attempting a simple operation
   */
  private async checkNetworkHealth(): Promise<void> {
    try {
      // Simple network health check - could be enhanced with actual API calls
      const isHealthy = await this.performNetworkHealthCheck();

      if (isHealthy !== this.networkHealth.isHealthy) {
        this.networkHealth.isHealthy = isHealthy;
        this.networkHealth.lastCheck = Date.now();

        if (isHealthy) {
          this.networkHealth.consecutiveFailures = 0;
          this.networkHealth.lastFailureTime = null;
          this.networkHealth.estimatedRecoveryTime = null;
          this.logger.logNormal('Network health restored');
          this.emit('network_restored');

          // Process queued messages when network comes back
          if (this.queue.length > 0) {
            this.logger.logNormal(
              `Network restored, processing ${this.queue.length} queued messages`
            );
            this.processQueue();
          }
        } else {
          this.networkHealth.consecutiveFailures++;
          this.networkHealth.lastFailureTime = Date.now();
          this.logger.logNormal(
            `Network health degraded, consecutive failures: ${this.networkHealth.consecutiveFailures}`
          );
          this.emit('network_degraded', {
            consecutiveFailures: this.networkHealth.consecutiveFailures
          });
        }
      }
    } catch (error) {
      this.logger.logError(`Network health check failed: ${error}`);
    }
  }

  /**
   * Perform actual network health check
   */
  private async performNetworkHealthCheck(): Promise<boolean> {
    try {
      // Simple ping to a reliable endpoint
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Set the message processor
   */
  setProcessor(processor: (message: EnhancedQueuedMessage<T>) => Promise<any>): void {
    this.processor = processor;
  }

  /**
   * Clear the queue
   */
  clearQueue(): void {
    const messageCount = this.queue.length;
    this.queue = [];
    this.deduplicationMap.clear();
    this.logger.logVerbose(`Cleared ${messageCount} messages from queue`);
    this.emit('queue_cleared', { messageCount });
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate duplicate detection key
   */
  private generateDuplicateKey(url: string, request: RequestForUrl<T>): string {
    // Sort object properties to ensure consistent keys regardless of property order
    const sortedRequest = this.sortObjectProperties(request);
    return `${url}_${JSON.stringify(sortedRequest)}`;
  }

  /**
   * Recursively sort object properties to ensure consistent JSON serialization
   */
  private sortObjectProperties(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectProperties(item));
    }

    const sortedObj: any = {};
    const sortedKeys = Object.keys(obj).sort();

    for (const key of sortedKeys) {
      sortedObj[key] = this.sortObjectProperties(obj[key]);
    }

    return sortedObj;
  }

  /**
   * Insert message with priority
   */
  private insertWithPriority(message: EnhancedQueuedMessage<T>): void {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const messagePriority = priorityOrder[message.priority];

    let insertIndex = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const queueItem = this.queue[i];
      if (queueItem) {
        const currentPriority = priorityOrder[queueItem.priority];
        if (messagePriority < currentPriority) {
          insertIndex = i;
          break;
        }
        insertIndex = i + 1;
      }
    }

    this.queue.splice(insertIndex, 0, message);
  }

  /**
   * Clear deduplication entry for a specific message
   */
  private clearDeduplicationEntry(message: EnhancedQueuedMessage<T>): void {
    if (!this.config.enableDeduplication) {
      return;
    }

    const duplicateKey = this.generateDuplicateKey(message.url, message.request);
    this.deduplicationMap.delete(duplicateKey);
    this.logger.logVerbose(`Cleared deduplication entry for message ${message.id}`);
  }

  /**
   * Manually clear deduplication entries for a specific endpoint and request
   * Useful for clearing deduplication when you know a message has been processed externally
   */
  public clearDeduplicationForRequest(url: string, request: any): boolean {
    if (!this.config.enableDeduplication) {
      return false;
    }

    const duplicateKey = this.generateDuplicateKey(url, request);
    const wasDeleted = this.deduplicationMap.delete(duplicateKey);

    if (wasDeleted) {
      this.logger.logVerbose(`Manually cleared deduplication entry for ${url}`);
    }

    return wasDeleted;
  }

  /**
   * Clear all deduplication entries
   * Useful for resetting the deduplication state
   */
  public clearAllDeduplicationEntries(): void {
    if (!this.config.enableDeduplication) {
      return;
    }

    const entryCount = this.deduplicationMap.size;
    this.deduplicationMap.clear();
    this.logger.logNormal(`Cleared all ${entryCount} deduplication entries`);
  }

  /**
   * Get deduplication statistics
   */
  public getDeduplicationStats(): {
    totalEntries: number;
    entries: Array<{ key: string; messageId: string; timestamp: number }>;
  } {
    const entries = Array.from(this.deduplicationMap.entries()).map(([key, value]) => ({
      key,
      messageId: value.messageId,
      timestamp: value.timestamp
    }));

    return {
      totalEntries: this.deduplicationMap.size,
      entries
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.networkHealthInterval) {
      clearInterval(this.networkHealthInterval);
    }
    this.clearQueue();
  }
}

/**
 * Default enhanced message queue configuration
 */
export const DEFAULT_ENHANCED_QUEUE_CONFIG: EnhancedMessageQueueConfig = {
  maxSize: 1000,
  enableRetries: true,
  maxRetries: 3,
  retryDelay: 5000,
  enableMaintenanceQueuing: true,
  queueTimeout: 24 * 60 * 60 * 1000, // 24 hours
  enableDeduplication: true,
  deduplicationWindow: 5 * 60 * 1000, // 5 minutes
  enableNetworkDetection: true
};
