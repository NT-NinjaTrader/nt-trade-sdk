import type { Endpoint, RequestForUrl, ResponseForUrl } from '../api/endpoints';
import { ConfigError, NetworkError, SdkError, ServerError } from '../api/errors';
import type { EventType } from '../api/types';
import type { EntityName } from '../types/common';
import { DEFAULT_MAINTENANCE_CONFIG, shouldQueueDuringMaintenance } from '../types/maintenance';
import { sleep } from '../utils/sleep';
import type { EnhancedMessageQueue } from './enhancedMessageQueue';
import { Listener } from './listener';
import type { MdApiClient } from './mdApiClient';
import type { MultiplexSocket } from './multiplexSocket';
import type { Calculator, CalculatorConfig } from './openPLCalculator';
import { OpenPLCalculator } from './openPLCalculator';
import type { PartnerSdk } from './partnerSdk';
import type { RateLimiter } from './rateLimiter';
import type { RestApi } from './restApi';
import type { Socket } from './socket';

/**
 * API Client that provides a fully type-safe interface for all TradeAPI endpoints.
 *
 * This client automatically chooses between WebSocket and REST API based on
 * the PartnerSdk configuration (clientConfig.live/sim)
 *
 * @example
 * ```typescript
 * // Get account information with full type safety
 * const accounts: Account[] = await sdk.api.account.items({
 *   query: { ids: [123,234,345] }
 * });
 *
 * // Place an order with validated request types
 * const result: Order = await sdk.api.order.placeOrder({
 *   symbol: 'ESM7',
 *   qty: 1,
 *   action: 'Buy',
 *   orderType: 'Market'
 * });
 *
 * // Get user information with proper typing
 * const user: User = await sdk.api.user.me();
 * ```
 */
export class ApiClient {
  private preferredClient: 'socket' | 'rest';
  private socketClient: Socket | MultiplexSocket;
  private restClient: RestApi;
  private rateLimiter?: RateLimiter;
  private messageQueue?: EnhancedMessageQueue;
  private mdClient?: MdApiClient;
  private mode?: 'sim' | 'live';
  private sdk?: PartnerSdk; // Reference to parent PartnerSdk

  /** Default retry configuration */
  private retryConfig = {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 30000
  };

  /**
   * Patterns for read-only endpoints that are SAFE to retry.
   * Without server-side idempotency, we default to NOT retrying mutations.
   *
   * Safe patterns:
   * - /deps, /find, /item, /items, /ldeps, /list, /suggest (CRUD reads)
   * - /get*, /check*, /calculate*, /evaluate* (queries)
   * - /download* (file reads)
   * - md/* (market data - handled by socket separately)
   *
   * NEVER retry auth/* - 3 failures = 1 hour lockout (rolling)!
   */
  private readonly safeToRetryPatterns: RegExp[] = [
    // Standard read endpoints
    /\/(deps|find|item|items|ldeps|list|suggest)$/,
    // Query/calculation endpoints (don't mutate)
    /\/(get|check|calculate|evaluate|download)/i,
    // Market data subscriptions (socket handles separately)
    /^md\//,
    // Order dry-run is a simulation, not a real order
    /\/dryrun$/
  ];

  /**
   * Endpoints that should NEVER be retried, even if they match safe patterns.
   * Auth failures trigger account lockout after 3 attempts (1 hour, rolling).
   */
  private readonly neverRetryPatterns: RegExp[] = [/^auth\//];

  constructor(
    socketClient: Socket | MultiplexSocket,
    restClient: RestApi,
    preferredClient: 'socket' | 'rest' = 'socket',
    rateLimiter?: RateLimiter,
    messageQueue?: EnhancedMessageQueue,
    mdClient?: MdApiClient,
    mode?: 'sim' | 'live',
    sdk?: PartnerSdk
  ) {
    this.socketClient = socketClient;
    this.restClient = restClient;
    this.preferredClient = preferredClient;
    this.rateLimiter = rateLimiter;
    this.messageQueue = messageQueue;
    this.mdClient = mdClient;
    this.mode = mode;
    this.sdk = sdk;
  }

  /**
   * Check if an endpoint is safe to retry.
   * Only read-only operations are safe; mutations are NOT retried by default.
   * Auth endpoints are NEVER retried (lockout risk).
   */
  private isSafeToRetry(endpoint: string): boolean {
    // Auth endpoints: NEVER retry (3 failures = 1 hour lockout)
    if (this.neverRetryPatterns.some(pattern => pattern.test(endpoint))) {
      return false;
    }
    return this.safeToRetryPatterns.some(pattern => pattern.test(endpoint));
  }

  /**
   * Execute an async operation with automatic retry for retryable errors.
   * Invokes SDK error handlers when retries are exhausted.
   */
  private async withRetry<T>(operation: () => Promise<T>, context: string): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Only retry if error is retryable
        if (error instanceof SdkError && error.retryable && attempt < this.retryConfig.maxRetries) {
          // Use error's suggested delay or calculate exponential backoff
          const delay = Math.min(
            error.retryAfter ?? this.retryConfig.baseDelayMs * Math.pow(2, attempt - 1),
            this.retryConfig.maxDelayMs
          );

          // Log retry attempt (if sdk has logger)
          if (this.sdk && (this.sdk as any).logger) {
            (this.sdk as any).logger.logNormal(
              `Retrying ${context} (attempt ${attempt + 1}/${this.retryConfig.maxRetries}) after ${delay}ms`
            );
          }

          await sleep(delay);
          continue;
        }

        // Not retryable or max retries reached - invoke error handlers and throw
        if (error instanceof SdkError && this.sdk) {
          this.sdk.handleError(error);
        }
        throw error;
      }
    }

    // Should never reach here, but TypeScript needs it
    throw lastError ?? new Error(`${context} failed after ${this.retryConfig.maxRetries} attempts`);
  }

  /**
   * Updates the access token after renewal
   */
  updateAccessToken(newAccessToken: string): void {
    // Update both socket and REST clients with the new token
    this.socketClient.updateAccessToken(newAccessToken);
    this.restClient.updateAccessToken(newAccessToken);
  }

  /**
   * Executes an endpoint request using the appropriate client.
   * Automatically retries retryable errors (network, rate limits, server errors).
   */
  private async executeEndpoint<T extends Endpoint['url']>(
    endpoint: T,
    request: RequestForUrl<T> | undefined
  ): Promise<ResponseForUrl<T>> {
    // Check if we should use message queuing (network outage or maintenance)
    if (this.messageQueue) {
      const shouldQueueForMaintenance = shouldQueueDuringMaintenance(
        endpoint,
        DEFAULT_MAINTENANCE_CONFIG
      );
      const shouldQueueForNetwork =
        this.messageQueue && !this.messageQueue['networkHealth'].isHealthy;

      if (shouldQueueForMaintenance || shouldQueueForNetwork) {
        const messageId = this.messageQueue.enqueueMessage(
          endpoint,
          request || { body: {} },
          'medium',
          'system'
        );

        throw new ServerError(
          `Request queued due to ${shouldQueueForMaintenance ? 'maintenance' : 'network issues'}. Message ID: ${messageId}`,
          {
            context: {
              operation: 'executeEndpoint',
              endpoint,
              messageId,
              reason: shouldQueueForMaintenance ? 'maintenance' : 'network_issues'
            }
          }
        );
      }
    }

    // Apply rate limiting if configured
    if (this.rateLimiter) {
      await this.rateLimiter.waitForRateLimit(endpoint);
    }

    // Define the actual request execution
    const executeRequest = async (): Promise<ResponseForUrl<T>> => {
      const client = this.selectClient();

      if (client === 'socket') {
        return (this.socketClient as Socket).send(endpoint, request);
      }

      // REST API - determine GET or POST
      const isGetRequest = this.isGetRequest(endpoint, request);
      return isGetRequest
        ? this.restClient.get(endpoint, request)
        : this.restClient.post(endpoint, request);
    };

    // Only retry safe endpoints (reads, idempotent operations)
    // Mutations like placeOrder are NOT retried to prevent duplicates
    if (this.isSafeToRetry(endpoint)) {
      return this.withRetry(executeRequest, endpoint);
    }

    // Unsafe endpoints: execute once, invoke error handler on failure
    try {
      return (await executeRequest()) as ResponseForUrl<T>;
    } catch (error) {
      if (error instanceof SdkError && this.sdk) {
        this.sdk.handleError(error);
      }
      throw error;
    }
  }

  /**
   * Intelligently selects the best client for a given endpoint
   */
  private selectClient(): 'socket' | 'rest' {
    // Check if we have a preferred client configured
    if (this.preferredClient === 'rest') {
      return 'rest';
    }

    // Check if we have a preferred client configured
    if (this.preferredClient === 'socket') {
      return 'socket';
    }

    // Default to socket for real-time operations
    return 'socket';
  }

  /**
   * Determines if a request should be made as GET or POST for REST API
   */
  private isGetRequest<T extends Endpoint['url']>(
    endpoint: T,
    request: RequestForUrl<T> | undefined
  ): boolean {
    // GET endpoints typically have minimal or no request data
    // POST endpoints typically have substantial request data
    if (!request || Object.keys(request).length === 0) {
      return true;
    }

    // GET endpoints follow these patterns:
    // - /list - list operations
    // - /item - single item retrieval
    // - /items - multiple items retrieval
    // - /find - search operations
    // - /suggest - suggestion operations
    // - /deps - dependency operations
    // - /ldeps - list dependency operations
    const getEndpointPatterns = [
      /\/list$/,
      /\/item$/,
      /\/items$/,
      /\/find$/,
      /\/suggest$/,
      /\/deps$/,
      /\/ldeps$/
    ];

    return getEndpointPatterns.some(pattern => pattern.test(endpoint));
  }

  /**
   * Listen to entity type events when using socket client
   *
   * This method is only available when the preferred client is 'socket'.
   * It wraps the underlying socket's subscribe method for entity-based event listening.
   *
   * @param {EntityName} entityType - the entity type to listen to (e.g., 'account', 'position')
   * @param {Function} callback - callback function to handle entity events
   * @returns {Listener} an unlisten function that can be called to stop listening
   * @throws {ConfigError} when the preferred client is not 'socket'
   *
   * @example
   * ```typescript
   * // Listen to account events
   * const unlisten = await sdk.live.listen('account', (message) => {
   *   console.log('Account event:', message);
   * });
   *
   * // Later, to stop listening:
   * unlisten();
   * ```
   */
  listen(entityType: EntityName, callback: (message: EventType) => void): Listener {
    if (this.preferredClient !== 'socket') {
      throw new ConfigError(
        `Listen method is only available when using socket client. Current client type: ${this.preferredClient}`,
        {
          context: {
            operation: 'listen',
            entityType,
            preferredClient: this.preferredClient
          }
        }
      );
    }

    // Handle different socket types
    if ('subscribe' in this.socketClient && typeof this.socketClient.subscribe === 'function') {
      const unsub = this.socketClient.subscribe(entityType, callback);
      const result = new Listener(() => unsub());

      // Both Socket and MultiplexSocket now return unsubscribe functions
      if (result instanceof Listener) {
        return result;
      }

      throw new NetworkError('Socket client subscribe method did not return an unlisten function', {
        context: {
          operation: 'listen',
          entityType,
          socketClientType: this.socketClient.constructor.name
        }
      });
    }

    throw new NetworkError('Socket client does not support listening', {
      context: {
        operation: 'listen',
        entityType,
        socketClientType: this.socketClient.constructor.name
      }
    });
  }

  /**
   * Creates an open P&L calculator for monitoring real-time profit/loss.
   *
   * This calculator automatically subscribes to position updates and market data quotes,
   * calculating P&L in real-time as positions and prices change.
   *
   * @param {CalculatorConfig} config - Calculator configuration (optional filters for products/accounts)
   * @returns {Promise<Calculator>} A calculator instance with listen() and destroy() methods
   * @throws {ConfigError} when market data client is not available or mode is not set
   *
   * @example
   * ```typescript
   * // Create a P&L calculator for all positions
   * const calculator = await sdk.live.createOpenPLCalculator({});
   *
   * // Listen to P&L updates
   * calculator.listen((plEvent) => {
   *   console.log('Total P&L:', plEvent.totalPL);
   * });
   *
   * // Filter by specific products
   * const filteredCalc = await sdk.live.createOpenPLCalculator({
   *   products: ['ES', 'NQ'],
   *   accounts: [123456]
   * });
   *
   * // Clean up when done
   * calculator.destroy();
   * ```
   */
  async createOpenPLCalculator(config: CalculatorConfig): Promise<Calculator> {
    if (!this.mdClient) {
      throw new ConfigError(
        'Market data client is required for P&L calculator. Enable market data socket in SDK configuration.',
        {
          context: {
            operation: 'createOpenPLCalculator',
            mode: this.mode
          }
        }
      );
    }

    if (!this.mode) {
      throw new ConfigError(
        'ApiClient mode must be set to use P&L calculator. This is usually set automatically by PartnerSdk.',
        {
          context: {
            operation: 'createOpenPLCalculator'
          }
        }
      );
    }

    if (!this.sdk) {
      throw new ConfigError(
        'SDK reference must be set to use P&L calculator. Make sure you are calling this method from a connected PartnerSdk instance (e.g., sdk.live.createOpenPLCalculator()).',
        {
          context: {
            operation: 'createOpenPLCalculator',
            mode: this.mode
          }
        }
      );
    }

    return OpenPLCalculator(this.sdk, this.mode, config);
  }

  /**
   * Account information and management operations.
   *
   * **Common Methods:** `list`, `item`, `items`, `find`, `suggest`, `deps`, `ldeps`
   *
   * **Special Methods:**
   * - `resetDemoAccountState` - Reset demo account(s) to initial state with specified trade date *(admin only)*
   *
   * @example
   * ```typescript
   * // List all accounts
   * const accounts = await sdk.live.account.list();
   *
   * // Get specific account
   * const account = await sdk.live.account.item({ query: { id: 123 } });
   *
   * // Reset demo accounts to specific trade date (admin only)
   * await sdk.sim.account.resetDemoAccountState({
   *   body: {
   *     accountIds: [123, 456],
   *     resetTradeDate: { year: 2024, month: 1, day: 15 }
   *   }
   * });
   * ```
   */
  get account() {
    return {
      /**
       * Get account dependencies
       */
      deps: (request: RequestForUrl<'account/deps'>) =>
        this.executeEndpoint('account/deps', request),

      /**
       * Find a specific account
       */
      find: (request: RequestForUrl<'account/find'>) =>
        this.executeEndpoint('account/find', request),

      /**
       * Get a specific account by ID
       */
      item: (request: RequestForUrl<'account/item'>) =>
        this.executeEndpoint('account/item', request),

      /**
       * Get multiple accounts
       */
      items: (request: RequestForUrl<'account/items'>) =>
        this.executeEndpoint('account/items', request),

      /**
       * Get account list dependencies
       */
      ldeps: (request: RequestForUrl<'account/ldeps'>) =>
        this.executeEndpoint('account/ldeps', request),

      /**
       * Get account list
       */
      list: (request?: RequestForUrl<'account/list'>) =>
        this.executeEndpoint('account/list', request || { body: {} }),

      /**
       * Get account suggestions
       */
      suggest: (request: RequestForUrl<'account/suggest'>) =>
        this.executeEndpoint('account/suggest', request),

      /**
       * Reset one or more demo accounts to their state at market open on a specific trade date.
       *
       * This operation resets simulation accounts to their state at the beginning of a specified
       * trading day, effectively "rewinding" the account to that point in time. This is useful
       * for strategy testing, performance evaluation, and educational purposes.
       *
       * **What Gets Reset:**
       * - **Account state** - Restored to market open of specified date
       * - **Positions** - Reset to what they were at that date
       * - **Orders** - Only orders that existed at that date remain
       * - **Balance** - Restored to balance at that date
       * - **P&L** - Reset to realized P&L at that date
       *
       * **Important Requirements:**
       * - **Demo accounts only** - Cannot be used with live trading accounts
       * - **Both parameters required** - Must provide accountIds array and resetTradeDate
       * - **Valid trade date** - Date must be a valid trading day
       * - **Cannot be future date** - Reset date cannot be in the future
       * - **Account must exist** - Account must have existed on the reset date
       *
       * **Use Cases:**
       * - **Strategy testing** - Test algorithms from specific market conditions
       * - **Performance analysis** - Replay trading from a historical date
       * - **Education** - Demonstrate trading scenarios from past dates
       * - **Bug reproduction** - Recreate issues from specific dates
       * - **Backtesting validation** - Compare live simulation with backtest results
       *
       * @param {RequestForUrl<'account/resetdemoaccountstate'>} request - Request with array of account IDs and reset trade date
       * @returns {Promise<ResponseForUrl<'account/resetdemoaccountstate'>>} Promise resolving to SimpleResponse with operation status
       * @throws {ConfigError} When account is not a demo/simulation account
       * @throws {ValidationError} When reset date is invalid or in the future
       * @throws {AuthorizationError} When user lacks permission to reset accounts
       *
       * @example
       * ```typescript
       * // Reset single demo account to a specific date
       * const resetResult = await sdk.sim.account.resetDemoAccountState({
       *   body: {
       *     accountIds: [12345],
       *     resetTradeDate: {
       *       year: 2024,
       *       month: 11,
       *       day: 1
       *     }
       *   }
       * });
       *
       * console.log('Reset status:', resetResult.s); // 'OK' on success
       * ```
       *
       * @example
       * ```typescript
       * // Reset multiple demo accounts to the same date
       * const resetResult = await sdk.sim.account.resetDemoAccountState({
       *   body: {
       *     accountIds: [12345, 67890, 11111],
       *     resetTradeDate: {
       *       year: 2024,
       *       month: 10,
       *       day: 15
       *     }
       *   }
       * });
       *
       * if (resetResult.s === 'OK') {
       *   console.log('All accounts reset successfully');
       * } else {
       *   console.error('Reset failed:', resetResult.d);
       * }
       * ```
       *
       * @example
       * ```typescript
       * // Helper function to create TradeDate from JavaScript Date
       * function dateToTradeDate(date: Date) {
       *   return {
       *     year: date.getFullYear(),
       *     month: date.getMonth() + 1, // JS months are 0-indexed
       *     day: date.getDate()
       *   };
       * }
       *
       * // Reset to beginning of current month
       * const firstOfMonth = new Date();
       * firstOfMonth.setDate(1);
       *
       * await sdk.sim.account.resetDemoAccountState({
       *   body: {
       *     accountIds: [12345],
       *     resetTradeDate: dateToTradeDate(firstOfMonth)
       *   }
       * });
       * ```
       *
       * @example
       * ```typescript
       * // Pre-reset validation and error handling
       * async function safeResetDemoAccount(accountId: number, resetDate: Date) {
       *   // Verify account exists and is demo
       *   const account = await sdk.sim.account.item({
       *     query: { id: accountId }
       *   });
       *
       *   if (!account.name.includes('Demo') && !account.name.includes('Sim')) {
       *     throw new Error('Account does not appear to be a demo account');
       *   }
       *
       *   // Ensure reset date is not in future
       *   if (resetDate > new Date()) {
       *     throw new Error('Cannot reset to future date');
       *   }
       *
       *   // Perform reset
       *   try {
       *     const result = await sdk.sim.account.resetDemoAccountState({
       *       body: {
       *         accountIds: [accountId],
       *         resetTradeDate: {
       *           year: resetDate.getFullYear(),
       *           month: resetDate.getMonth() + 1,
       *           day: resetDate.getDate()
       *         }
       *       }
       *     });
       *
       *     return result;
       *   } catch (error) {
       *     console.error('Reset failed:', error);
       *     throw error;
       *   }
       * }
       * ```
       *
       * **Best Practices:**
       * - Always validate account type before reset (demo/simulation only)
       * - Ensure reset date is a valid trading day (not weekend/holiday)
       * - Verify date is not in the future
       * - Close active positions/orders if you want a clean slate (API resets to historical state)
       * - Use batch operations to reset multiple accounts efficiently
       * - Handle errors appropriately - reset may fail if date is invalid
       *
       * @see {@link TradeDate} for date format specification
       */
      resetDemoAccountState: (request: RequestForUrl<'account/resetdemoaccountstate'>) =>
        this.executeEndpoint('account/resetdemoaccountstate', request)
    };
  }

  /**
   * Place, modify, and manage trading orders.
   *
   * **Common Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   *
   * **Order Operations:** `placeOrder`, `modifyOrder`, `cancelOrder`
   *
   * **Advanced Order Types:** `placeOCO`, `placeOSO`
   *
   * **Position Management:** `liquidatePosition`, `liquidatePositions`
   *
   * **Validation:** `dryRun`
   *
   * @example
   * ```typescript
   * // Place a market order
   * const order = await sdk.live.order.placeOrder({
   *   body: {
   *     symbol: 'ESM7',
   *     orderQty: 1,
   *     action: 'Buy',
   *     orderType: 'Market'
   *   }
   * });
   *
   * // Modify order price
   * await sdk.live.order.modifyOrder({
   *   body: {
   *     orderId: 123,
   *     orderQty: 1,
   *     orderType: 'Limit',
   *     price: 4500.5
   *   }
   * });
   *
   * // Liquidate single position
   * await sdk.live.order.liquidatePosition({
   *   body: { accountId: 123, contractId: 456, admin: false }
   * });
   *
   * // Liquidate multiple positions
   * await sdk.live.order.liquidatePositions({
   *   body: { positions: [789, 790], admin: false }
   * });
   * ```
   */
  get order() {
    return {
      /**
       * Get order dependencies required for order operations.
       *
       * Retrieves metadata needed for order placement including available
       * symbols, order types, time-in-force options, and trading permissions.
       *
       * @param {RequestForUrl<'order/deps'>} request - request parameters for order dependencies
       * @returns {Promise<any>} promise resolving to order dependency information
       *
       * @example
       * ```typescript
       * const deps = await sdk.live.order.deps({
       *   body: { symbol: 'ESM7' }
       * });
       * console.log('Available order types:', deps.orderTypes);
       * console.log('Trading hours:', deps.tradingHours);
       * ```
       */
      deps: (request: RequestForUrl<'order/deps'>) => this.executeEndpoint('order/deps', request),

      /**
       * Get a specific order by its unique identifier.
       *
       * Retrieves detailed order information including current status,
       * fills, remaining quantity, and execution details.
       *
       * @param {RequestForUrl<'order/item'>} request - request containing the order ID
       * @returns {Promise<any>} promise resolving to the requested order details
       *
       * @example
       * ```typescript
       * const order = await sdk.live.order.item({
       *   query: { id: 12345 }
       * });
       *
       * console.log('Order status:', order.status);
       *   console.log('Filled quantity:', order.filledQty);
       *   console.log('Remaining quantity:', order.remainingQty);
       *   ```
       */
      item: (request: RequestForUrl<'order/item'>) => this.executeEndpoint('order/item', request),

      /**
       * Get multiple orders by their identifiers.
       *
       * Efficiently retrieves multiple orders in a single request.
       * Useful for bulk order monitoring and reporting.
       *
       * @param {RequestForUrl<'order/items'>} request - request containing array of order IDs
       * @returns {Promise<any>} promise resolving to array of order details
       *
       * @example
       * ```typescript
       * // Get multiple orders efficiently
       * const orders = await sdk.live.order.items({
       *   body: { orderIds: [12345, 12346, 12347] }
       * });
       *
       * // Process orders in bulk
       * orders.forEach(order => {
       *   console.log(`Order ${order.orderId}: ${order.status}`);
       * });
       * ```
       */
      items: (request: RequestForUrl<'order/items'>) =>
        this.executeEndpoint('order/items', request),

      /**
       * Get order list dependencies for pagination and filtering.
       *
       * Retrieves metadata needed for order list operations including
       * available filters, sort options, and status values.
       *
       * @param request - Request parameters for list dependencies
       * @returns Promise resolving to list dependency information
       *
       * @example
       * ```typescript
       * const listDeps = await sdk.live.order.ldeps({
       *   body: { accountId: 123 }
       * });
       * console.log('Available status filters:', listDeps.statuses);
       * ```
       */
      ldeps: (request: RequestForUrl<'order/ldeps'>) =>
        this.executeEndpoint('order/ldeps', request),

      /**
       * Get a paginated list of orders.
       *
       * Retrieves orders with support for filtering by status, symbol,
       * account, date range, and other criteria. Essential for order
       * management interfaces and reporting.
       *
       * @param request - Optional request parameters for filtering and pagination
       * @returns Promise resolving to array of orders
       *
       * @example
       * ```typescript
       * // Get all orders for current account
       * const allOrders = await sdk.live.order.list();
       *
       * // Get pending orders only
       * const pendingOrders = await sdk.live.order.list({
       *   body: {
       *     status: 'Working',
       *     limit: 100
       *   }
       * });
       *
       * // Get orders for specific symbol
       * const symbolOrders = await sdk.live.order.list({
       *   body: {
       *     symbol: 'ESM7',
       *     startDate: '2024-01-01',
       *     endDate: '2024-01-31'
       *   }
       * });
       * ```
       */
      list: (request?: RequestForUrl<'order/list'>) =>
        this.executeEndpoint('order/list', request || { body: {} }),

      /**
       * Place a new order.
       *
       * Creates and submits a new order to the exchange. Supports all
       * order types including market, limit, stop, and conditional orders.
       * Returns order details with confirmation and tracking information.
       *
       * @param request - Order parameters including symbol, quantity, action, and type
       * @returns Promise resolving to the created order with confirmation details
       *
       * @example
       * ```typescript
       * // Place a market order
       * const marketOrder = await sdk.live.order.placeOrder({
       *   body: {
       *     symbol: 'ESM7',
       *     qty: 1,
       *     action: 'Buy',
       *     orderType: 'Market'
       *   }
       * });
       *
       * // Place a limit order
       * const limitOrder = await sdk.live.order.placeOrder({
       *   body: {
       *     symbol: 'ESM7',
       *     qty: 1,
       *     action: 'Sell',
       *     orderType: 'Limit',
       *     price: 4500.50
       *   }
       * });
       *
       * // Place a stop order
       * const stopOrder = await sdk.live.order.placeOrder({
       *   body: {
       *     symbol: 'ESM7',
       *     qty: 1,
       *     action: 'Sell',
       *     orderType: 'Stop',
       *     stopPrice: 4400.00
       *   }
       * });
       *
       * console.log('Order placed successfully:', marketOrder.orderId);
       * ```
       */
      placeOrder: (request: RequestForUrl<'order/placeorder'>) =>
        this.executeEndpoint('order/placeorder', request),

      /**
       * Modify an existing order.
       *
       * Updates order parameters such as price, quantity, or stop price.
       * Only working orders can be modified. Returns updated order details.
       *
       * @param request - Order modification parameters
       * @returns Promise resolving to the modified order details
       *
       * @example
       * ```typescript
       * // Modify order price
       * const modifiedOrder = await sdk.live.order.modifyOrder({
       *   body: {
       *     orderId: 12345,
       *     price: 4501.00
       *   }
       * });
       *
       * // Modify order quantity
       * const quantityModified = await sdk.live.order.modifyOrder({
       *   body: {
       *     orderId: 12345,
       *     qty: 2
       *   }
       * });
       *
       * console.log('Order modified:', modifiedOrder.orderId);
       * ```
       */
      modifyOrder: (request: RequestForUrl<'order/modifyorder'>) =>
        this.executeEndpoint('order/modifyorder', request),

      /**
       * Cancel an existing order.
       *
       * Cancels a working order and removes it from the exchange.
       * Returns cancellation confirmation with final order status.
       *
       * @param request - Request containing the order ID to cancel
       * @returns Promise resolving to cancellation confirmation
       *
       * @example
       * ```typescript
       * // Cancel a specific order
       * const cancelResult = await sdk.live.order.cancelOrder({
       *   body: { orderId: 12345 }
       * });
       *
       * if (cancelResult.success) {
       *   console.log('Order cancelled successfully');
       * }
       *
       * // Cancel multiple orders
       * const ordersToCancel = [12345, 12346, 12347];
       * for (const orderId of ordersToCancel) {
       *   await sdk.live.order.cancelOrder({
       *     body: { orderId }
       *   });
       * }
       * ```
       */
      cancelOrder: (request: RequestForUrl<'order/cancelorder'>) =>
        this.executeEndpoint('order/cancelorder', request),

      /**
       * Liquidate a specific position.
       *
       * Creates a market order to close a specific position immediately.
       * Useful for risk management and position unwinding.
       *
       * @param request - Liquidation parameters including symbol and account
       * @returns Promise resolving to liquidation order details
       *
       * @example
       * ```typescript
       * // Liquidate a specific position
       * const liquidationOrder = await sdk.live.order.liquidatePosition({
       *   body: {
       *     symbol: 'ESM7',
       *     accountId: 123
       *   }
       * });
       *
       * console.log('Position liquidation initiated:', liquidationOrder.orderId);
       * ```
       */
      liquidatePosition: (request: RequestForUrl<'order/liquidateposition'>) =>
        this.executeEndpoint('order/liquidateposition', request),

      /**
       * Liquidate all positions for an account.
       *
       * Creates market orders to close all open positions immediately.
       * Critical for emergency risk management and account closure.
       *
       * @param request - Account liquidation parameters
       * @returns Promise resolving to liquidation confirmation
       *
       * @example
       * ```typescript
       * // Liquidate all positions for an account
       * const liquidationResult = await sdk.live.order.liquidatePositions({
       *   body: { accountId: 123 }
       * });
       *
       * if (liquidationResult.success) {
       *   console.log('All positions liquidated successfully');
       *   console.log('Orders created:', liquidationResult.orderIds);
       * }
       * ```
       */
      liquidatePositions: (request: RequestForUrl<'order/liquidatepositions'>) =>
        this.executeEndpoint('order/liquidatepositions', request),

      /**
       * Dry run an order without execution.
       *
       * Validates order parameters and returns expected execution results
       * without actually placing the order. Useful for testing and validation.
       *
       * @param request - Order parameters to validate
       * @returns Promise resolving to dry run results
       *
       * @example
       * ```typescript
       * // Test order parameters before placement
       * const dryRunResult = await sdk.live.order.dryRun({
       *   body: {
       *     symbol: 'ESM7',
       *     qty: 1,
       *     action: 'Buy',
       *     orderType: 'Limit',
       *     price: 4500.00
       *   }
       * });
       *
       * console.log('Order validation:', dryRunResult.isValid);
       * console.log('Expected commission:', dryRunResult.commission);
       * console.log('Margin requirement:', dryRunResult.marginRequirement);
       * ```
       */
      dryRun: (request: RequestForUrl<'order/dryrun'>) =>
        this.executeEndpoint('order/dryrun', request),

      /**
       * Place an OCO (One-Cancels-Other) order.
       *
       * Creates two linked orders where execution of one automatically
       * cancels the other. Common for profit-taking and stop-loss strategies.
       *
       * @param request - OCO order parameters including both order legs
       * @returns Promise resolving to OCO order details
       *
       * @example
       * ```typescript
       * // Place OCO order with profit target and stop loss
       * const ocoOrder = await sdk.live.order.placeOCO({
       *   body: {
       *     symbol: 'ESM7',
       *     qty: 1,
       *     action: 'Buy',
       *     profitOrder: {
       *       orderType: 'Limit',
       *       price: 4600.00
       *     },
       *     stopOrder: {
       *       orderType: 'Stop',
       *       stopPrice: 4400.00
       *     }
       *   }
       * });
       *
       * console.log('OCO order placed:', ocoOrder.ocoId);
       * ```
       */
      placeOCO: (request: RequestForUrl<'order/placeoco'>) =>
        this.executeEndpoint('order/placeoco', request),

      /**
       * Place an OSO (One-Sends-Other) order.
       *
       * Creates a primary order that, when filled, automatically triggers
       * a secondary order. Useful for scaling strategies and position management.
       *
       * @param request - OSO order parameters including primary and secondary orders
       * @returns Promise resolving to OSO order details
       *
       * @example
       * ```typescript
       * // Place OSO order for scaling
       * const osoOrder = await sdk.live.order.placeOSO({
       *   body: {
       *     symbol: 'ESM7',
       *     qty: 1,
       *     action: 'Buy',
       *     orderType: 'Limit',
       *     price: 4500.00,
       *     secondaryOrder: {
       *       qty: 1,
       *       action: 'Sell',
       *       orderType: 'Limit',
       *       price: 4600.00
       *     }
       *   }
       * });
       *
       * console.log('OSO order placed:', osoOrder.osoId);
       * ```
       */
      placeOSO: (request: RequestForUrl<'order/placeoso'>) =>
        this.executeEndpoint('order/placeoso', request)
    };
  }

  /**
   * Manage complex order strategies like bracket orders and multi-leg positions.
   *
   * **Common Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   *
   * **Strategy Operations:**
   * - `startOrderStrategy` - Start a new order strategy (bracket, scaling, etc.)
   * - `modifyOrderStrategy` - Modify active strategy
   * - `interruptOrderStrategy` - Stop a running strategy
   *
   * @example
   * ```typescript
   * // Start an order strategy
   * const strategy = await sdk.live.orderStrategy.startOrderStrategy({
   *   body: {
   *     accountId: 123,
   *     symbol: 'ESM7',
   *     orderStrategyTypeId: 1,  // e.g., 1 = Bracket
   *     action: 'Buy',
   *     params: JSON.stringify({
   *       qty: 2,
   *       stopLoss: 4480,
   *       takeProfit: 4550
   *     })
   *   }
   * });
   *
   * // Interrupt (stop) a running strategy
   * await sdk.live.orderStrategy.interruptOrderStrategy({
   *   body: { orderStrategyId: strategy.id }
   * });
   * ```
   */
  get orderStrategy() {
    return {
      /**
       * Get order strategy dependencies
       */
      deps: (request: RequestForUrl<'orderStrategy/deps'>) =>
        this.executeEndpoint('orderStrategy/deps', request),

      /**
       * Get a specific order strategy by ID
       */
      item: (request: RequestForUrl<'orderStrategy/item'>) =>
        this.executeEndpoint('orderStrategy/item', request),

      /**
       * Get multiple order strategies
       */
      items: (request: RequestForUrl<'orderStrategy/items'>) =>
        this.executeEndpoint('orderStrategy/items', request),

      /**
       * Get order strategy list dependencies
       */
      ldeps: (request: RequestForUrl<'orderStrategy/ldeps'>) =>
        this.executeEndpoint('orderStrategy/ldeps', request),

      /**
       * Get order strategy list
       */
      list: (request?: RequestForUrl<'orderStrategy/list'>) =>
        this.executeEndpoint('orderStrategy/list', request || { body: {} }),

      /**
       * Start an order strategy.
       *
       * Initiates a predefined order strategy that can execute multiple orders
       * based on configured rules and conditions. Order strategies are complex
       * trading algorithms that can include multiple order legs, conditional
       * execution, and risk management parameters.
       *
       * **Strategy Types:**
       * - **Scaling Strategies** - Gradually build positions with multiple orders
       * - **Bracket Orders** - Entry with profit target and stop loss
       * - **Trailing Stops** - Dynamic stop loss that follows price movement
       * - **Time-based Strategies** - Execute orders at specific times
       * - **Conditional Strategies** - Execute based on market conditions
       *
       * **Key Features:**
       * - Multiple order legs with coordinated execution
       * - Risk management and position sizing
       * - Conditional order triggers
       * - Real-time strategy monitoring
       * - Automatic order management
       *
       * @param request - Order strategy configuration and parameters
       * @returns Promise resolving to strategy execution details with strategy ID
       * @throws {ConfigError} When strategy parameters are invalid
       * @throws {TradingError} When strategy execution fails
       *
       * @example
       * ```typescript
       * // Start a scaling strategy
       * const scalingStrategy = await sdk.live.orderStrategy.startOrderStrategy({
       *   body: {
       *     strategyType: 'Scaling',
       *     symbol: 'ESM7',
       *     totalQuantity: 10,
       *     entryOrders: [
       *       { price: 4500, qty: 2 },
       *       { price: 4490, qty: 3 },
       *       { price: 4480, qty: 5 }
       *     ],
       *     exitStrategy: {
       *       profitTarget: 4600,
       *       stopLoss: 4400
       *     }
       *   }
       * });
       *
       * console.log('Strategy started:', scalingStrategy.strategyId);
       *
       * // Start a bracket order strategy
       * const bracketStrategy = await sdk.live.orderStrategy.startOrderStrategy({
       *   body: {
       *     strategyType: 'Bracket',
       *     symbol: 'ESM7',
       *     entryOrder: {
       *       orderType: 'Limit',
       *       price: 4500,
       *       qty: 5,
       *       action: 'Buy'
       *     },
       *     profitOrder: {
       *       orderType: 'Limit',
       *       price: 4600,
       *       qty: 5,
       *       action: 'Sell'
       *     },
       *     stopOrder: {
       *       orderType: 'Stop',
       *       stopPrice: 4400,
       *       qty: 5,
       *       action: 'Sell'
       *     }
       *   }
       * });
       *
       * // Start a time-based strategy
       * const timeStrategy = await sdk.live.orderStrategy.startOrderStrategy({
       *   body: {
       *     strategyType: 'TimeBased',
       *     symbol: 'ESM7',
       *     executionSchedule: [
       *       { time: '09:30:00', action: 'Buy', qty: 2, price: 'Market' },
       *       { time: '15:45:00', action: 'Sell', qty: 2, price: 'Market' }
       *     ],
       *     timezone: 'America/New_York'
       *   }
       * });
       * ```
       *
       * **Strategy Monitoring:**
       * ```typescript
       * // Monitor strategy execution
       * const strategy = await sdk.live.orderStrategy.item({
       *   query: { id: scalingStrategy.strategyId }
       * });
       *
       * console.log('Strategy status:', strategy.status);
       * console.log('Orders executed:', strategy.executedOrders.length);
       * console.log('Remaining orders:', strategy.remainingOrders.length);
       * ```
       */
      startOrderStrategy: (request: RequestForUrl<'orderStrategy/startorderstrategy'>) =>
        this.executeEndpoint('orderStrategy/startorderstrategy', request),

      /**
       * Modify an active order strategy.
       *
       * Updates the parameters of a running order strategy. This allows you to
       * adjust strategy behavior in real-time without stopping and restarting
       * the entire strategy. Only certain parameters can be modified while
       * a strategy is active.
       *
       * **Modifiable Parameters:**
       * - **Price levels** - Adjust entry/exit prices
       * - **Quantities** - Modify order sizes
       * - **Risk parameters** - Update stop loss and profit targets
       * - **Timing** - Adjust execution schedules
       * - **Conditions** - Modify trigger conditions
       *
       * **Non-Modifiable Parameters:**
       * - Strategy type (requires restart)
       * - Symbol (requires restart)
       * - Basic strategy structure
       *
       * **Use Cases:**
       * - Adjust profit targets based on market conditions
       * - Modify position sizes for risk management
       * - Update stop loss levels for protection
       * - Change execution timing
       * - Adjust conditional triggers
       *
       * @param request - Strategy modification parameters
       * @returns Promise resolving to updated strategy details
       * @throws {ConfigError} When modification parameters are invalid
       * @throws {TradingError} When strategy modification fails
       * @throws {StrategyError} When strategy is not in modifiable state
       *
       * @example
       * ```typescript
       * // Modify profit target and stop loss
       * const modifiedStrategy = await sdk.live.orderStrategy.modifyOrderStrategy({
       *   body: {
       *     strategyId: scalingStrategy.strategyId,
       *     exitStrategy: {
       *       profitTarget: 4650,  // Increased from 4600
       *       stopLoss: 4420       // Tightened from 4400
       *     }
       *   }
       * });
       *
       * // Modify order quantities
       * const quantityModified = await sdk.live.orderStrategy.modifyOrderStrategy({
       *   body: {
       *     strategyId: scalingStrategy.strategyId,
       *     entryOrders: [
       *       { price: 4500, qty: 3 },  // Increased from 2
       *       { price: 4490, qty: 4 },  // Increased from 3
       *       { price: 4480, qty: 6 }   // Increased from 5
       *     ]
       *   }
       * });
       *
       * // Modify execution timing
       * const timingModified = await sdk.live.orderStrategy.modifyOrderStrategy({
       *   body: {
       *     strategyId: timeStrategy.strategyId,
       *     executionSchedule: [
       *       { time: '09:45:00', action: 'Buy', qty: 2, price: 'Market' },
       *       { time: '15:30:00', action: 'Sell', qty: 2, price: 'Market' }
       *     ]
       *   }
       * });
       *
       * console.log('Strategy modified successfully');
       * ```
       *
       * **Modification Best Practices:**
       * ```typescript
       * // Check strategy status before modification
       * const strategy = await sdk.live.orderStrategy.item({
       *   query: { id: strategyId }
       * });
       *
       * if (strategy.status === 'Active' && strategy.canModify) {
       *   // Proceed with modification
       *   await sdk.live.orderStrategy.modifyOrderStrategy({
       *     body: { strategyId, // modification params
       *       // ... other modification parameters
       *     }
       *   });
       * } else {
       *   console.log('Strategy cannot be modified in current state');
       * }
       * ```
       */
      modifyOrderStrategy: (request: RequestForUrl<'orderStrategy/modifyorderstrategy'>) =>
        this.executeEndpoint('orderStrategy/modifyorderstrategy', request),

      /**
       * Interrupt an active order strategy.
       *
       * Pauses the execution of an order strategy, allowing you to temporarily
       * stop order generation while maintaining the strategy configuration.
       * Interrupted strategies can be resumed later without losing their setup.
       *
       * **Interruption Behavior:**
       * - **Active orders** remain in the market
       * - **Pending orders** are cancelled
       * - **Strategy configuration** is preserved
       * - **Position tracking** continues
       * - **Resume capability** is maintained
       *
       * **Use Cases:**
       * - **Market volatility** - Pause during uncertain conditions
       * - **Risk management** - Stop new orders temporarily
       * - **Manual intervention** - Take control of positions
       * - **Strategy review** - Analyze performance before continuing
       * - **Emergency stops** - Quick halt to strategy execution
       *
       * **Interruption vs Cancellation:**
       * - **Interrupt** - Pauses strategy, can resume later
       * - **Cancel** - Stops strategy permanently, requires restart
       *
       * @param request - Strategy interruption parameters
       * @returns Promise resolving to interruption confirmation
       * @throws {ConfigError} When strategy ID is invalid
       * @throws {TradingError} When interruption fails
       * @throws {StrategyError} When strategy is not in interruptible state
       *
       * @example
       * ```typescript
       * // Interrupt strategy during market volatility
       * const interruptionResult = await sdk.live.orderStrategy.interruptOrderStrategy({
       *   body: {
       *     strategyId: scalingStrategy.strategyId,
       *     reason: 'Market volatility - high VIX',
       *     preservePositions: true
       *   }
       * });
       *
       * if (interruptionResult.success) {
       *   console.log('Strategy interrupted successfully');
       *   console.log('Active orders remain in market');
       *   console.log('Strategy can be resumed later');
       * }
       *
       * // Interrupt with position management
       * const managedInterruption = await sdk.live.orderStrategy.interruptOrderStrategy({
       *   body: {
       *     strategyId: scalingStrategy.strategyId,
       *     reason: 'Manual intervention required',
       *     preservePositions: true,
       *     cancelPendingOrders: true
       *   }
       * });
       *
       * // Interrupt multiple strategies
       * const strategyIds = [strategy1.strategyId, strategy2.strategyId];
       * for (const strategyId of strategyIds) {
       *   await sdk.live.orderStrategy.interruptOrderStrategy({
       *     body: { strategyId, reason: 'Market close approaching' }
       *   });
       * }
       * ```
       *
       * **Strategy State After Interruption:**
       * ```typescript
       * // Check strategy status after interruption
       * const interruptedStrategy = await sdk.live.orderStrategy.item({
       *   query: { id: scalingStrategy.strategyId }
       * });
       *
       * console.log('Strategy status:', interruptedStrategy.status); // 'Interrupted'
       * console.log('Can resume:', interruptedStrategy.canResume);   // true
       * console.log('Active orders:', interruptedStrategy.activeOrders.length);
       * console.log('Preserved positions:', interruptedStrategy.preservedPositions);
       * ```
       *
       * **Resuming Interrupted Strategies:**
       * ```typescript
       * // Resume interrupted strategy
       * if (interruptedStrategy.canResume) {
       *   const resumedStrategy = await sdk.live.orderStrategy.startOrderStrategy({
       *     body: {
       *       resumeFrom: interruptedStrategy.strategyId,
       *       resumeOptions: {
       *         skipCompletedOrders: true,
       *         adjustForMarketChanges: true
       *       }
       *     }
       *   });
       *
       *   console.log('Strategy resumed:', resumedStrategy.strategyId);
       * }
       * ```
       */
      /**
       * Interrupt an active order strategy.
       *
       * Pauses the execution of an order strategy, allowing you to temporarily
       * stop order generation while maintaining the strategy configuration.
       * Interrupted strategies can be resumed later without losing their setup.
       *
       * **Interruption Behavior:**
       * - **Active orders** remain in the market
       * - **Pending orders** are cancelled
       * - **Strategy configuration** is preserved
       * - **Position tracking** continues
       * - **Resume capability** is maintained
       *
       * **Use Cases:**
       * - **Market volatility** - Pause during uncertain conditions
       * - **Risk management** - Stop new orders temporarily
       * - **Manual intervention** - Take control of positions
       * - **Strategy review** - Analyze performance before continuing
       * - **Emergency stops** - Quick halt to strategy execution
       *
       * **Interruption vs Cancellation:**
       * - **Interrupt** - Pauses strategy, can resume later
       * - **Cancel** - Stops strategy permanently, requires restart
       *
       * @param request - Strategy interruption parameters
       * @returns Promise resolving to interruption confirmation
       * @throws {ConfigError} When strategy ID is invalid
       * @throws {TradingError} When interruption fails
       * @throws {StrategyError} When strategy is not in interruptible state
       *
       * @example
       * ```typescript
       * // Interrupt strategy during market volatility
       * const interruptionResult = await sdk.live.orderStrategy.interruptOrderStrategy({
       *   body: {
       *     strategyId: scalingStrategy.strategyId,
       *     reason: 'Market volatility - high VIX',
       *     preservePositions: true
       *   }
       * });
       *
       * if (interruptionResult.success) {
       *   console.log('Strategy interrupted successfully');
       *   console.log('Active orders remain in market');
       *   console.log('Strategy can be resumed later');
       * }
       *
       * // Interrupt with position management
       * const managedInterruption = await sdk.live.orderStrategy.interruptOrderStrategy({
       *   body: {
       *     strategyId: scalingStrategy.strategyId,
       *     reason: 'Manual intervention required',
       *     preservePositions: true,
       *     cancelPendingOrders: true
       *   }
       * });
       *
       * // Interrupt multiple strategies
       * const strategyIds = [strategy1.strategyId, strategy2.strategyId];
       * for (const strategyId of strategyIds) {
       *   await sdk.live.orderStrategy.interruptOrderStrategy({
       *     body: { strategyId, reason: 'Market close approaching' }
       *   });
       * }
       * ```
       *
       * **Strategy State After Interruption:**
       * ```typescript
       * // Check strategy status after interruption
       * const interruptedStrategy = await sdk.live.orderStrategy.item({
       *   query: { id: scalingStrategy.strategyId }
       * });
       *
       * console.log('Strategy status:', interruptedStrategy.status); // 'Interrupted'
       * console.log('Can resume:', interruptedStrategy.canResume);   // true
       * console.log('Active orders:', interruptedStrategy.activeOrders.length);
       * console.log('Preserved positions:', interruptedStrategy.preservedPositions);
       * ```
       *
       * **Resuming Interrupted Strategies:**
       * ```typescript
       * // Resume interrupted strategy
       * if (interruptedStrategy.canResume) {
       *   const resumedStrategy = await sdk.live.orderStrategy.startOrderStrategy({
       *     body: {
       *       resumeFrom: interruptedStrategy.strategyId,
       *       resumeOptions: {
       *         skipCompletedOrders: true,
       *         adjustForMarketChanges: true
       *       }
       *     }
       *   });
       *
       *   console.log('Strategy resumed:', resumedStrategy.strategyId);
       * }
       * ```
       */
      interruptOrderStrategy: (request: RequestForUrl<'orderStrategy/interruptorderstrategy'>) =>
        this.executeEndpoint('orderStrategy/interruptorderstrategy', request)
    };
  }

  /**
   * View and manage open positions.
   *
   * **Common Methods:** `list`, `item`, `items`, `find`, `deps`, `ldeps`
   *
   * @example
   * ```typescript
   * // List all positions
   * const positions = await sdk.live.position.list();
   *
   * // Get specific position
   * const position = await sdk.live.position.item({ query: { id: 123 } });
   * ```
   */
  get position() {
    return {
      /**
       * Get position dependencies
       */
      deps: (request: RequestForUrl<'position/deps'>) =>
        this.executeEndpoint('position/deps', request),

      /**
       * Find a specific position
       */
      find: (request: RequestForUrl<'position/find'>) =>
        this.executeEndpoint('position/find', request),

      /**
       * Get a specific position by ID
       */
      item: (request: RequestForUrl<'position/item'>) =>
        this.executeEndpoint('position/item', request),

      /**
       * Get multiple positions
       */
      items: (request: RequestForUrl<'position/items'>) =>
        this.executeEndpoint('position/items', request),

      /**
       * Get position list dependencies
       */
      ldeps: (request: RequestForUrl<'position/ldeps'>) =>
        this.executeEndpoint('position/ldeps', request),

      /**
       * Get position list
       */
      list: (request?: RequestForUrl<'position/list'>) =>
        this.executeEndpoint('position/list', request || { body: {} })
    };
  }

  /**
   * Manage user accounts and permissions.
   *
   * **Common Methods:** `list`, `item`, `items`, `find`, `suggest`, `me`
   *
   * **Subscription Management:** `addMarketDataSubscription`, `addTradovateSubscription`, `cancelTradovateSubscription`
   *
   * **Trading Permissions:** `createTradingPermission`, `revokeTradingPermission`, `revokeTradingPermissions`, `getAccountTradingPermissions`, `accountPermissions`
   *
   * **Special Operations:**
   * - `cancelEverything` - Cancel subscriptions, permissions, plugins for user(s)
   * - `createNewTrial` - Create new trial account *(admin only)*
   * - `createEvaluationUsers` - Create multiple evaluation users *(admin only)*
   * - `createEvaluationAccounts` - Create evaluation accounts *(Prop Firm use)*
   *
   * **Note for Prop Firms:** For Prop Firm operations, much of the permission management is handled through
   * `createEvaluationAccounts`. When you need to manually grant permissions, prefer using `createTradingPermission`.
   *
   * @example
   * ```typescript
   * // Get current user
   * const currentUser = await sdk.live.user.me();
   *
   * // Create trading permission (preferred for Prop Firms)
   * await sdk.live.user.createTradingPermission({
   *   body: { userId: 123, accountId: 456 }
   * });
   *
   * // Cancel everything for user(s)
   * await sdk.live.user.cancelEverything({
   *   body: {
   *     userIds: [123, 456],
   *     tradovateSubscriptions: true,
   *     tradingPermissions: true,
   *     userPlugins: true,
   *     marketDataSubscriptions: true
   *   }
   * });
   *
   * ```
   */
  get user() {
    return {
      /**
       * Find a specific user
       */
      find: (request: RequestForUrl<'user/find'>) => this.executeEndpoint('user/find', request),

      /**
       * Get a specific user by ID
       */
      item: (request: RequestForUrl<'user/item'>) => this.executeEndpoint('user/item', request),

      /**
       * Get multiple users
       */
      items: (request: RequestForUrl<'user/items'>) => this.executeEndpoint('user/items', request),

      /**
       * Get user list
       */
      list: (request?: RequestForUrl<'user/list'>) =>
        this.executeEndpoint('user/list', request || { body: {} }),

      /**
       * Get user suggestions
       */
      suggest: (request: RequestForUrl<'user/suggest'>) =>
        this.executeEndpoint('user/suggest', request),

      /**
       * Modify user credentials
       */
      modifyCredentials: (request: RequestForUrl<'user/modifycredentials'>) =>
        this.executeEndpoint('user/modifycredentials', request),

      /**
       * Modify user email address
       */
      modifyEmailAddress: (request: RequestForUrl<'user/modifyemailaddress'>) =>
        this.executeEndpoint('user/modifyemailaddress', request),

      /**
       * Modify user password
       */
      modifyPassword: (request: RequestForUrl<'user/modifypassword'>) =>
        this.executeEndpoint('user/modifypassword', request),

      /**
       * Open a new demo trading account.
       *
       * Creates a new demo/simulation trading account for testing strategies,
       * learning trading concepts, and validating algorithms without financial risk.
       * Demo accounts provide real-time market data and full trading functionality
       * in a risk-free environment.
       *
       * **Account Features:**
       * - **Full trading access** - All order types and instruments
       * - **Real-time market data** - Live quotes, charts, and DOM
       * - **Risk-free environment** - No real money at stake
       * - **Performance tracking** - P&L, trade history, and analytics
       * - **Strategy testing** - Test complex algorithms and automation
       * - **Educational tools** - Learning resources and tutorials
       *
       * **Account Types Available:**
       * - **Standard Demo** - Basic trading with standard features
       * - **Professional Demo** - Advanced features and higher limits
       * - **Institutional Demo** - Enterprise-level capabilities
       * - **Educational Demo** - Specialized for learning institutions
       *
       * **Initial Configuration:**
       * - **Starting balance** - Configurable initial funding
       * - **Trading permissions** - Based on account type
       * - **Risk parameters** - Default risk management settings
       * - **Market access** - Available symbols and products
       * - **Trading hours** - Market session access
       *
       * @param request - Demo account creation parameters
       * @returns Promise resolving to new demo account details
       * @throws {ConfigError} When account parameters are invalid
       * @throws {PermissionError} When user lacks demo account creation rights
       * @throws {LimitError} When demo account limit is reached
       *
       * @example
       * ```typescript
       * // Open basic demo account
       * const demoAccount = await sdk.sim.user.openDemoAccount({
       *   body: {
       *     accountType: 'Standard',
       *     initialBalance: 10000,
       *     accountName: 'Strategy Testing Account'
       *   }
       * });
       *
       * console.log('Demo account created:', demoAccount.accountId);
       * console.log('Account name:', demoAccount.accountName);
       * console.log('Initial balance:', demoAccount.balance);
       * ```
       *
       * @example
       * ```typescript
       * // Open professional demo account with advanced features
       * const proDemoAccount = await sdk.sim.user.openDemoAccount({
       *   body: {
       *     accountType: 'Professional',
       *     initialBalance: 50000,
       *     accountName: 'Algorithm Testing Pro',
       *     features: {
       *       advancedOrderTypes: true,
       *       riskManagement: true,
       *       apiAccess: true,
       *       realTimeData: true
       *     },
       *     tradingPermissions: ['Futures', 'Options', 'Forex']
       *   }
       * });
       *
       * // Verify account setup
       * const accountDetails = await sdk.sim.account.item({
       *   query: { id: proDemoAccount.accountId }
       * });
       *
       * console.log('Account status:', accountDetails.status);
       * console.log('Available symbols:', accountDetails.availableSymbols.length);
       * ```
       *
       * @example
       * ```typescript
       * // Open multiple demo accounts for different purposes
       * const accountConfigs = [
       *   {
       *     accountType: 'Standard',
       *     initialBalance: 10000,
       *     accountName: 'Day Trading Practice'
       *   },
       *   {
       *     accountType: 'Standard',
       *     initialBalance: 25000,
       *     accountName: 'Swing Trading Practice'
       *   },
       *   {
       *     accountType: 'Professional',
       *     initialBalance: 100000,
       *     accountName: 'Portfolio Management Practice'
       *   }
       * ];
       *
       * const demoAccounts = [];
       * for (const config of accountConfigs) {
       *   const account = await sdk.sim.user.openDemoAccount({
       *     body: config
       *   });
       *   demoAccounts.push(account);
       * }
       *
       * console.log(`Created ${demoAccounts.length} demo accounts`);
       * ```
       *
       * **Account Management:**
       * ```typescript
       * // List all demo accounts
       * const allDemoAccounts = await sdk.sim.account.list({
       *   body: { accountType: 'Demo' }
       * });
       *
       * // Monitor demo account performance
       * const performance = await sdk.sim.account.item({
       *   query: { id: demoAccount.accountId }
       * });
       *
       * console.log('Total P&L:', performance.totalPnL);
       * console.log('Win rate:', performance.winRate);
       * console.log('Total trades:', performance.totalTrades);
       * ```
       *
       * **Best Practices:**
       * - Use descriptive account names for organization
       * - Choose appropriate account type for your needs
       * - Set realistic initial balances for testing
       * - Document account purpose and testing goals
       * - Regularly review and clean up unused accounts
       * - Use different accounts for different strategies
       */
      openDemoAccount: (request: RequestForUrl<'user/opendemoaccount'>) =>
        this.executeEndpoint('user/opendemoaccount', request),

      /**
       * Create evaluation accounts for Prop Firm testing/trials.
       * Creates demo accounts with specific risk parameters and permissions.
       * Useful for creating funded accounts for evaluation programs.
       */
      createEvaluationAccounts: (request: RequestForUrl<'user/createevaluationaccounts'>) =>
        this.executeEndpoint('user/createevaluationaccounts', request),

      /**
       * Create evaluation users for Prop Firm programs in bulk.
       * Creates users with predefined subscriptions and entitlements.
       * Returns array of created user IDs or error details for each user.
       */
      createEvaluationUsers: (request: RequestForUrl<'user/createevaluationusers'>) =>
        this.executeEndpoint('user/createevaluationusers', request),

      /**
       * Switch user from non-professional to professional market data status.
       * Changes subscription rates to professional pricing.
       * Requires acknowledgment of professional trader status.
       */
      switchToProfessional: (request: RequestForUrl<'user/switchtoprofessional'>) =>
        this.executeEndpoint('user/switchtoprofessional', request),

      /**
       * Sign up organization member
       */
      signupOrganizationMember: (request: RequestForUrl<'user/signuporganizationmember'>) =>
        this.executeEndpoint('user/signuporganizationmember', request),

      /**
       * Request trading permission
       */
      requestTradingPermission: (request: RequestForUrl<'user/requesttradingpermission'>) =>
        this.executeEndpoint('user/requesttradingpermission', request),

      /**
       * Revoke trading permission
       */
      revokeTradingPermission: (request: RequestForUrl<'user/revoketradingpermission'>) =>
        this.executeEndpoint('user/revoketradingpermission', request),

      /**
       * Revoke trading permissions
       */
      revokeTradingPermissions: (request: RequestForUrl<'user/revoketradingpermissions'>) =>
        this.executeEndpoint('user/revoketradingpermissions', request),

      /**
       * Get account trading permissions
       */
      getAccountTradingPermissions: (request: RequestForUrl<'user/getaccounttradingpermissions'>) =>
        this.executeEndpoint('user/getaccounttradingpermissions', request),

      /**
       * Get account trading permissions (alias for getAccountTradingPermissions)
       */
      accountPermissions: (request: RequestForUrl<'user/getaccounttradingpermissions'>) =>
        this.executeEndpoint('user/getaccounttradingpermissions', request),

      /**
       * Add market data subscription
       */
      addMarketDataSubscription: (request: RequestForUrl<'user/addmarketdatasubscription'>) =>
        this.executeEndpoint('user/addmarketdatasubscription', request),

      /**
       * Add Tradovate subscription
       */
      addTradovateSubscription: (request: RequestForUrl<'user/addtradovatesubscription'>) =>
        this.executeEndpoint('user/addtradovatesubscription', request),

      /**
       * Cancel all subscriptions, permissions, and plugins for user(s) *(admin only)*.
       * Used for account closure or mass cleanup operations.
       * Cannot be undone - use with caution.
       */
      cancelEverything: (request: RequestForUrl<'user/canceleverything'>) =>
        this.executeEndpoint('user/canceleverything', request),

      /**
       * Cancel Tradovate subscription
       */
      cancelTradovateSubscription: (request: RequestForUrl<'user/canceltradovatesubscription'>) =>
        this.executeEndpoint('user/canceltradovatesubscription', request),

      /**
       * Create trading permission
       */
      createTradingPermission: (request: RequestForUrl<'user/createtradingpermission'>) =>
        this.executeEndpoint('user/createtradingpermission', request),

      /**
       * Get user sync request
       */
      deps: (request: RequestForUrl<'user/syncrequest'>) =>
        this.executeEndpoint('user/syncrequest', request),

      /**
       * Create a new trial account for a user *(admin only)*.
       * Grants temporary platform access with demo account.
       * Trial duration and features determined by organization settings.
       */
      createNewTrial: (request: RequestForUrl<'user/createnewtrial'>) =>
        this.executeEndpoint('user/createnewtrial', request)
    };
  }

  /**
   * Manage user plugin entitlements and permissions.
   *
   * **Common Methods:** `list`, `item`, `items`, `create`, `update`, `deps`, `ldeps`
   *
   * **Entitlement Management:**
   * - `addEntitlementSubscription` - Add entitlement subscription
   * - `cancelPluginAutorenewal` - Cancel auto-renewal
   * - `changePluginPermission` - Change plugin permissions
   * - `getEntitlementEligibilityInfo` - Check eligibility
   *
   * @example
   * ```typescript
   * // Add entitlement subscription
   * await sdk.live.userPlugin.addEntitlementSubscription({
   *   body: {
   *     entitlementId: 456,
   *     userId: 123,          // optional
   *     accountId: 789,       // optional
   *     creditCardId: 101,    // optional
   *     nonProSigned: true    // optional
   *   }
   * });
   *
   * // Change plugin permissions
   * await sdk.live.userPlugin.changePluginPermission({
   *   body: {
   *     pluginName: 'MyPlugin',
   *     approval: true,
   *     userId: 123           // optional
   *   }
   * });
   * ```
   */
  get userPlugin() {
    return {
      /**
       * Subscribe a user or account to an entitlement (market data, platform features).
       * Supports payment via credit card or account funding.
       * Use `nonProSigned: true` for non-professional market data rates.
       */
      addEntitlementSubscription: (
        request: RequestForUrl<'userPlugin/addentitlementsubscription'>
      ) => this.executeEndpoint('userPlugin/addentitlementsubscription', request),

      /**
       * Cancel automatic renewal for a plugin subscription.
       * Subscription remains active until current period ends.
       * User retains access until expiration date.
       */
      cancelPluginAutorenewal: (request: RequestForUrl<'userPlugin/cancelpluginautorenewal'>) =>
        this.executeEndpoint('userPlugin/cancelpluginautorenewal', request),

      /**
       * Modify plugin permissions for a user.
       * Can enable/disable specific plugin features or access levels.
       * Changes take effect immediately.
       */
      changePluginPermission: (request: RequestForUrl<'userPlugin/changepluginpermission'>) =>
        this.executeEndpoint('userPlugin/changepluginpermission', request),

      /**
       * Check if user/account is eligible for specific entitlement.
       * Returns eligibility status, requirements, and pricing info.
       * Use before attempting to add entitlement subscription.
       */
      getEntitlementEligibilityInfo: (
        request: RequestForUrl<'userPlugin/getentitlementeligibilityinfo'>
      ) => this.executeEndpoint('userPlugin/getentitlementeligibilityinfo', request),

      /**
       * Create a new user plugin
       */
      create: (request: RequestForUrl<'userPlugin/create'>) =>
        this.executeEndpoint('userPlugin/create', request),

      /**
       * Get user plugin dependents
       */
      deps: (request: RequestForUrl<'userPlugin/deps'>) =>
        this.executeEndpoint('userPlugin/deps', request),

      /**
       * Get a specific user plugin by ID
       */
      item: (request: RequestForUrl<'userPlugin/item'>) =>
        this.executeEndpoint('userPlugin/item', request),

      /**
       * Get multiple user plugins by IDs
       */
      items: (request: RequestForUrl<'userPlugin/items'>) =>
        this.executeEndpoint('userPlugin/items', request),

      /**
       * Get user plugin list dependents
       */
      ldeps: (request: RequestForUrl<'userPlugin/ldeps'>) =>
        this.executeEndpoint('userPlugin/ldeps', request),

      /**
       * Get user plugin list
       */
      list: (request?: RequestForUrl<'userPlugin/list'>) =>
        this.executeEndpoint('userPlugin/list', request || { body: {} }),

      /**
       * Update an existing user plugin
       */
      update: (request: RequestForUrl<'userPlugin/update'>) =>
        this.executeEndpoint('userPlugin/update', request)
    };
  }

  /**
   * Authentication and token management.
   *
   * **Methods:** `me`, `oauthToken`, `renewAccessToken`
   *
   * @example
   * ```typescript
   * // Get current authenticated user
   * const currentUser = await sdk.live.auth.me();
   * ```
   */
  get auth() {
    return {
      /**
       * Get current user info
       */
      me: (request: RequestForUrl<'auth/me'> = { body: {} }) =>
        this.executeEndpoint('auth/me', request),

      /**
       * Get OAuth token
       */
      oauthToken: (request: RequestForUrl<'auth/oauthtoken'>) =>
        this.executeEndpoint('auth/oauthtoken', request),

      /**
       * Renew access token
       */
      renewAccessToken: (request: RequestForUrl<'auth/renewaccesstoken'>) =>
        this.executeEndpoint('auth/renewaccesstoken', request)
    };
  }

  /**
   * Access futures and options contract information.
   *
   * **Common Methods:** `item`, `items`, `find`, `suggest`, `deps`, `ldeps`
   *
   * **Special Operations:**
   * - `getEventProducts` - Get event-based contracts
   * - `getProductFeeParams` - Get fee parameters for product(s)
   * - `rollContract` - Roll expiring contract to new contract
   * - `rollContracts` - Roll multiple contracts
   *
   * @example
   * ```typescript
   * // Find ES contracts
   * const contracts = await sdk.live.contract.find({ body: { name: 'ES' } });
   *
   * // Roll contract forward
   * await sdk.live.contract.rollContract({
   *   body: { name: 'ESM4', forward: true }
   * });
   *
   * // Get fee parameters for products
   * const fees = await sdk.live.contract.getProductFeeParams({
   *   body: { productIds: [789, 790] }
   * });
   * ```
   */
  get contract() {
    return {
      /**
       * Get contract dependencies
       */
      deps: (request: RequestForUrl<'contract/deps'>) =>
        this.executeEndpoint('contract/deps', request),

      /**
       * Find a specific contract
       */
      find: (request: RequestForUrl<'contract/find'>) =>
        this.executeEndpoint('contract/find', request),

      /**
       * Get a specific contract by ID
       */
      item: (request: RequestForUrl<'contract/item'>) =>
        this.executeEndpoint('contract/item', request),

      /**
       * Get multiple contracts
       */
      items: (request: RequestForUrl<'contract/items'>) =>
        this.executeEndpoint('contract/items', request),

      /**
       * Get contract list dependencies
       */
      ldeps: (request: RequestForUrl<'contract/ldeps'>) =>
        this.executeEndpoint('contract/ldeps', request),

      /**
       * Get contract suggestions
       */
      suggest: (request: RequestForUrl<'contract/suggest'>) =>
        this.executeEndpoint('contract/suggest', request),

      /**
       * Get event-based products (binary options, spreads).
       * Returns futures and event contract details with strikes and maturities.
       * Used for event-driven trading strategies.
       */
      getEventProducts: (request: RequestForUrl<'contract/geteventproducts'>) =>
        this.executeEndpoint('contract/geteventproducts', request),

      /**
       * Get full options chain for an underlying contract.
       * Returns all strikes and expirations for calls and puts.
       * Includes Greeks, bid/ask, and open interest data.
       */
      getOptionsChain: (request: RequestForUrl<'contract/getoptionschain'>) =>
        this.executeEndpoint('contract/getoptionschain', request),

      /**
       * Get fee parameters for one or more products.
       * Returns clearing fees, exchange fees, commission, and margin requirements.
       * Useful for calculating total trade costs before execution.
       */
      getProductFeeParams: (request: RequestForUrl<'contract/getproductfeeparams'>) =>
        this.executeEndpoint('contract/getproductfeeparams', request),

      /**
       * Roll a contract to next maturity (forward) or previous (backward).
       * Automatically finds the next available contract based on name.
       * Use `ifExpired: true` to only roll if current contract has expired.
       */
      rollContract: (request: RequestForUrl<'contract/rollcontract'>) =>
        this.executeEndpoint('contract/rollcontract', request),

      /**
       * Roll multiple contracts in a single operation.
       * Each contract can have its own `forward` and `ifExpired` settings.
       * Returns array of rolled contract details.
       */
      rollContracts: (request: RequestForUrl<'contract/rollcontracts'>) =>
        this.executeEndpoint('contract/rollcontracts', request)
    };
  }

  /**
   * Access contract maturity information.
   * Contract maturities link contracts to their underlying products and expiration details.
   *
   * **Methods:** `item`, `items`, `deps`, `ldeps`
   *
   * @example
   * ```typescript
   * // Get contract maturity by ID
   * const maturity = await sdk.live.contractMaturity.item({
   *   query: { id: 123 }
   * });
   *
   * console.log('Product ID:', maturity.productId);
   * console.log('Expiration:', maturity.expirationDate);
   * ```
   */
  get contractMaturity() {
    return {
      /**
       * Get contract maturity dependencies
       */
      deps: (request: RequestForUrl<'contractMaturity/deps'>) =>
        this.executeEndpoint('contractMaturity/deps', request),

      /**
       * Get a specific contract maturity by ID
       */
      item: (request: RequestForUrl<'contractMaturity/item'>) =>
        this.executeEndpoint('contractMaturity/item', request),

      /**
       * Get multiple contract maturities
       */
      items: (request: RequestForUrl<'contractMaturity/items'>) =>
        this.executeEndpoint('contractMaturity/items', request),

      /**
       * Get contract maturity list dependencies
       */
      ldeps: (request: RequestForUrl<'contractMaturity/ldeps'>) =>
        this.executeEndpoint('contractMaturity/ldeps', request)
    };
  }

  /**
   * Access product information and specifications.
   *
   * **Methods:** `list`, `item`, `items`, `find`, `suggest`, `deps`, `ldeps`
   */
  get product() {
    return {
      /**
       * Get product dependencies
       */
      deps: (request: RequestForUrl<'product/deps'>) =>
        this.executeEndpoint('product/deps', request),

      /**
       * Find a specific product
       */
      find: (request: RequestForUrl<'product/find'>) =>
        this.executeEndpoint('product/find', request),

      /**
       * Get a specific product by ID
       */
      item: (request: RequestForUrl<'product/item'>) =>
        this.executeEndpoint('product/item', request),

      /**
       * Get multiple products
       */
      items: (request: RequestForUrl<'product/items'>) =>
        this.executeEndpoint('product/items', request),

      /**
       * Get product list dependencies
       */
      ldeps: (request: RequestForUrl<'product/ldeps'>) =>
        this.executeEndpoint('product/ldeps', request),

      /**
       * Get product list
       */
      list: (request?: RequestForUrl<'product/list'>) =>
        this.executeEndpoint('product/list', request || { body: {} }),

      /**
       * Get product suggestions
       */
      suggest: (request: RequestForUrl<'product/suggest'>) =>
        this.executeEndpoint('product/suggest', request)
    };
  }

  /**
   * Market data and product search.
   *
   * **Methods:** `products`, `getProduct`, `search`, `product`
   */
  get markets() {
    return {
      /**
       * Get product information
       */
      getProduct: (request: RequestForUrl<'markets/getproduct'>) =>
        this.executeEndpoint('markets/getproduct', request),

      /**
       * Get products
       */
      products: (request: RequestForUrl<'markets/products'> = { body: {} }) =>
        this.executeEndpoint('markets/products', request),

      /**
       * Search markets
       */
      search: (request: RequestForUrl<'markets/search'>) =>
        this.executeEndpoint('markets/search', request),

      /**
       * Get product
       */
      product: (request: RequestForUrl<'markets/getproduct'>) =>
        this.executeEndpoint('markets/getproduct', request)
    };
  }

  /**
   * Access exchange information.
   *
   * **Methods:** `list`, `item`, `items`, `find`, `suggest`
   */
  get exchange() {
    return {
      /**
       * Find a specific exchange
       */
      find: (request: RequestForUrl<'exchange/find'>) =>
        this.executeEndpoint('exchange/find', request),

      /**
       * Get a specific exchange by ID
       */
      item: (request: RequestForUrl<'exchange/item'>) =>
        this.executeEndpoint('exchange/item', request),

      /**
       * Get multiple exchanges
       */
      items: (request: RequestForUrl<'exchange/items'>) =>
        this.executeEndpoint('exchange/items', request),

      /**
       * Get exchange list
       */
      list: (request?: RequestForUrl<'exchange/list'>) =>
        this.executeEndpoint('exchange/list', request || { body: {} }),

      /**
       * Get exchange suggestions
       */
      suggest: (request: RequestForUrl<'exchange/suggest'>) =>
        this.executeEndpoint('exchange/suggest', request)
    };
  }

  /**
   * Access currency information.
   *
   * **Methods:** `list`, `item`, `items`, `find`, `suggest`
   */
  get currency() {
    return {
      /**
       * Find a specific currency
       */
      find: (request: RequestForUrl<'currency/find'>) =>
        this.executeEndpoint('currency/find', request),

      /**
       * Get a specific currency by ID
       */
      item: (request: RequestForUrl<'currency/item'>) =>
        this.executeEndpoint('currency/item', request),

      /**
       * Get multiple currencies
       */
      items: (request: RequestForUrl<'currency/items'>) =>
        this.executeEndpoint('currency/items', request),

      /**
       * Get currency list
       */
      list: (request?: RequestForUrl<'currency/list'>) =>
        this.executeEndpoint('currency/list', request || { body: {} }),

      /**
       * Get currency suggestions
       */
      suggest: (request: RequestForUrl<'currency/suggest'>) =>
        this.executeEndpoint('currency/suggest', request)
    };
  }

  /**
   * Access country information.
   *
   * **Methods:** `list`, `item`, `items`, `find`, `suggest`
   */
  get country() {
    return {
      /**
       * Find a specific country
       */
      find: (request: RequestForUrl<'country/find'>) =>
        this.executeEndpoint('country/find', request),

      /**
       * Get a specific country by ID
       */
      item: (request: RequestForUrl<'country/item'>) =>
        this.executeEndpoint('country/item', request),

      /**
       * Get multiple countries
       */
      items: (request: RequestForUrl<'country/items'>) =>
        this.executeEndpoint('country/items', request),

      /**
       * Get country list
       */
      list: (request?: RequestForUrl<'country/list'>) =>
        this.executeEndpoint('country/list', request || { body: {} }),

      /**
       * Get country suggestions
       */
      suggest: (request: RequestForUrl<'country/suggest'>) =>
        this.executeEndpoint('country/suggest', request),

      /**
       * Check if country is banned
       */
      isBanned: (request: RequestForUrl<'countries/countryisbanned'>) =>
        this.executeEndpoint('countries/countryisbanned', request)
    };
  }

  /**
   * Create and manage trading alerts. *(admin only)*
   *
   * **Methods:** `create`, `delete`, `dismiss`, `modify`, `reset`, `markReadSignal`, `deps`, `item`, `items`, `ldeps`
   */
  get alert() {
    return {
      /**
       * Get alert dependencies
       */
      deps: (request: RequestForUrl<'alert/deps'>) => this.executeEndpoint('alert/deps', request),

      /**
       * Get a specific alert by ID
       */
      item: (request: RequestForUrl<'alert/item'>) => this.executeEndpoint('alert/item', request),

      /**
       * Get multiple alerts
       */
      items: (request: RequestForUrl<'alert/items'>) =>
        this.executeEndpoint('alert/items', request),

      /**
       * Get alert list dependencies
       */
      ldeps: (request: RequestForUrl<'alert/ldeps'>) =>
        this.executeEndpoint('alert/ldeps', request),

      /**
       * Create alert
       */
      create: (request: RequestForUrl<'alert/createalert'>) =>
        this.executeEndpoint('alert/createalert', request),

      /**
       * Delete alert
       */
      delete: (request: RequestForUrl<'alert/deletealert'>) =>
        this.executeEndpoint('alert/deletealert', request),

      /**
       * Dismiss alert
       */
      dismiss: (request: RequestForUrl<'alert/dismissalert'>) =>
        this.executeEndpoint('alert/dismissalert', request),

      /**
       * Mark read alert signal
       */
      markReadSignal: (request: RequestForUrl<'alert/markreadalertsignal'>) =>
        this.executeEndpoint('alert/markreadalertsignal', request),

      /**
       * Modify alert
       */
      modify: (request: RequestForUrl<'alert/modifyalert'>) =>
        this.executeEndpoint('alert/modifyalert', request),

      /**
       * Reset alert
       */
      reset: (request: RequestForUrl<'alert/resetalert'>) =>
        this.executeEndpoint('alert/resetalert', request)
    };
  }

  /**
   * Manage alert signals. *(admin only)*
   *
   * **Methods:** `deps`, `item`, `items`, `ldeps`
   */
  get alertSignal() {
    return {
      /**
       * Get alert signal dependencies
       */
      deps: (request: RequestForUrl<'alertSignal/deps'>) =>
        this.executeEndpoint('alertSignal/deps', request),

      /**
       * Get a specific alert signal by ID
       */
      item: (request: RequestForUrl<'alertSignal/item'>) =>
        this.executeEndpoint('alertSignal/item', request),

      /**
       * Get multiple alert signals
       */
      items: (request: RequestForUrl<'alertSignal/items'>) =>
        this.executeEndpoint('alertSignal/items', request),

      /**
       * Get alert signal list dependencies
       */
      ldeps: (request: RequestForUrl<'alertSignal/ldeps'>) =>
        this.executeEndpoint('alertSignal/ldeps', request)
    };
  }

  /**
   * Access account cash balance information.
   *
   * **Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   *
   * **Special Operations:**
   * - `getCashBalanceSnapshot` - Get balance snapshot for account
   * - `changeDemoBalance` - Adjust demo account cash balance *(demo only)*
   *
   * @example
   * ```typescript
   * // List all cash balances
   * const balances = await sdk.live.cashBalance.list();
   *
   * // Get balance snapshot for account
   * const snapshot = await sdk.live.cashBalance.getCashBalanceSnapshot({
   *   body: { accountId: 123 }
   * });
   *
   * // Change demo balance (demo accounts only)
   * await sdk.sim.cashBalance.changeDemoBalance({
   *   body: { accountId: 123, cashChange: 5000 }
   * });
   * ```
   */
  get cashBalance() {
    return {
      /**
       * Get cash balance dependencies
       */
      deps: (request: RequestForUrl<'cashBalance/deps'>) =>
        this.executeEndpoint('cashBalance/deps', request),

      /**
       * Get a specific cash balance by ID
       */
      item: (request: RequestForUrl<'cashBalance/item'>) =>
        this.executeEndpoint('cashBalance/item', request),

      /**
       * Get multiple cash balances
       */
      items: (request: RequestForUrl<'cashBalance/items'>) =>
        this.executeEndpoint('cashBalance/items', request),

      /**
       * Get cash balance list dependencies
       */
      ldeps: (request: RequestForUrl<'cashBalance/ldeps'>) =>
        this.executeEndpoint('cashBalance/ldeps', request),

      /**
       * Get cash balance list
       */
      list: (request?: RequestForUrl<'cashBalance/list'>) =>
        this.executeEndpoint('cashBalance/list', request || { body: {} }),

      /**
       * Get detailed cash balance snapshot for a specific account.
       * Returns current cash position, margin requirements, and P&L values.
       * More detailed than standard cashBalance.item() call.
       */
      getSnapshot: (request: RequestForUrl<'cashBalance/getcashbalancesnapshot'>) =>
        this.executeEndpoint('cashBalance/getcashbalancesnapshot', request),

      /**
       * Change demo account balance for testing purposes.
       * Adds or subtracts cash from demo account.
       * ⚠️ Demo accounts only - will fail on live accounts.
       */
      changeDemoBalance: (request: RequestForUrl<'cashBalance/changeDemoBalance'>) =>
        this.executeEndpoint('cashBalance/changeDemoBalance', request)
    };
  }

  /**
   * Access trade fill history and execution data.
   *
   * **Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   */
  get fill() {
    return {
      /**
       * Get fill dependencies
       */
      deps: (request: RequestForUrl<'fill/deps'>) => this.executeEndpoint('fill/deps', request),

      /**
       * Get a specific fill by ID
       */
      item: (request: RequestForUrl<'fill/item'>) => this.executeEndpoint('fill/item', request),

      /**
       * Get multiple fills
       */
      items: (request: RequestForUrl<'fill/items'>) => this.executeEndpoint('fill/items', request),

      /**
       * Get fill list dependencies
       */
      ldeps: (request: RequestForUrl<'fill/ldeps'>) => this.executeEndpoint('fill/ldeps', request),

      /**
       * Get fill list
       */
      list: (request?: RequestForUrl<'fill/list'>) =>
        this.executeEndpoint('fill/list', request || { body: {} })
    };
  }

  /**
   * Access execution reports.
   *
   * **Methods:** `list`, `item`, `items`, `find`, `deps`, `ldeps`
   */
  get executionReport() {
    return {
      /**
       * Get execution report dependencies
       */
      deps: (request: RequestForUrl<'executionReport/deps'>) =>
        this.executeEndpoint('executionReport/deps', request),

      /**
       * Find a specific execution report
       */
      find: (request: RequestForUrl<'executionReport/find'>) =>
        this.executeEndpoint('executionReport/find', request),

      /**
       * Get a specific execution report by ID
       */
      item: (request: RequestForUrl<'executionReport/item'>) =>
        this.executeEndpoint('executionReport/item', request),

      /**
       * Get multiple execution reports
       */
      items: (request: RequestForUrl<'executionReport/items'>) =>
        this.executeEndpoint('executionReport/items', request),

      /**
       * Get execution report list dependencies
       */
      ldeps: (request: RequestForUrl<'executionReport/ldeps'>) =>
        this.executeEndpoint('executionReport/ldeps', request),

      /**
       * Get execution report list
       */
      list: (request?: RequestForUrl<'executionReport/list'>) =>
        this.executeEndpoint('executionReport/list', request || { body: {} })
    };
  }

  /**
   * Access entitlement information for market data subscriptions.
   *
   * Entitlements represent subscription plans and access rights for market data.
   * Available for org-admin-sdk and system-admin access levels.
   *
   * **Methods:** `list`, `item`, `items`
   *
   * **Note:** To find an entitlement by name, use `list()` and filter the results.
   *
   * @example
   * ```typescript
   * // List all available entitlements
   * const entitlements = await sdk.live.entitlement.list();
   *
   * // Find a specific entitlement by name (filter after listing)
   * const allEntitlements = await sdk.live.entitlement.list();
   * const simulationPlan = allEntitlements.find(e => e.name === 'simulationPlan');
   *
   * // Get entitlement by ID
   * const entitlement = await sdk.live.entitlement.item({
   *   query: { id: 123 }
   * });
   * ```
   */
  get entitlement() {
    return {
      /**
       * Get a specific entitlement by ID
       */
      item: (request: RequestForUrl<'entitlement/item'>) =>
        this.executeEndpoint('entitlement/item', request),

      /**
       * Get multiple entitlements by IDs
       */
      items: (request: RequestForUrl<'entitlement/items'>) =>
        this.executeEndpoint('entitlement/items', request),

      /**
       * Get all entitlements
       */
      list: (request?: RequestForUrl<'entitlement/list'>) =>
        this.executeEndpoint('entitlement/list', request || { body: {} })
    };
  }

  /**
   * Trading permission management for monitoring and querying permissions.
   *
   * **Common Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   *
   * **Note:** All `.create()` methods are admin-only. For Prop Firm operations, use `user.createTradingPermission()`
   * or `user.createEvaluationAccounts()` to grant permissions.
   *
   * **Access Level Required:** `system-admin`, `organization-admin`, or `utility-application`
   *
   * @example
   * ```typescript
   * // List all trading permissions
   * const permissions = await sdk.live.tradingPermission.list();
   *
   * // Get specific permission
   * const permission = await sdk.live.tradingPermission.item({
   *   query: { id: 123 }
   * });
   * ```
   */
  get tradingPermission() {
    return {
      /**
       * Get trading permission dependencies
       */
      deps: (request: RequestForUrl<'tradingPermission/deps'>) =>
        this.executeEndpoint('tradingPermission/deps', request),

      /**
       * Get a specific trading permission by ID
       */
      item: (request: RequestForUrl<'tradingPermission/item'>) =>
        this.executeEndpoint('tradingPermission/item', request),

      /**
       * Get multiple trading permissions
       */
      items: (request: RequestForUrl<'tradingPermission/items'>) =>
        this.executeEndpoint('tradingPermission/items', request),

      /**
       * Get trading permission list dependencies
       */
      ldeps: (request: RequestForUrl<'tradingPermission/ldeps'>) =>
        this.executeEndpoint('tradingPermission/ldeps', request),

      /**
       * Get trading permission list
       */
      list: (request?: RequestForUrl<'tradingPermission/list'>) =>
        this.executeEndpoint('tradingPermission/list', request || { body: {} }),

      /**
       * Get account trading permissions
       */
      getAccountPermissions: (request: RequestForUrl<'user/getaccounttradingpermissions'>) =>
        this.executeEndpoint('user/getaccounttradingpermissions', request),

      /**
       * Accept trading permission
       */
      accept: (request: RequestForUrl<'user/accepttradingpermission'>) =>
        this.executeEndpoint('user/accepttradingpermission', request),

      /**
       * Request trading permission
       */
      request: (request: RequestForUrl<'user/requesttradingpermission'>) =>
        this.executeEndpoint('user/requesttradingpermission', request),

      /**
       * Revoke trading permission
       */
      revokeTradingPermission: (request: RequestForUrl<'user/revoketradingpermission'>) =>
        this.executeEndpoint('user/revoketradingpermission', request),

      /**
       * Revoke multiple trading permissions
       */
      revokeTradingPermissions: (request: RequestForUrl<'user/revoketradingpermissions'>) =>
        this.executeEndpoint('user/revoketradingpermissions', request)
    };
  }

  /**
   * Market Data Subscription-related API endpoints with full type safety
   */
  get marketDataSubscription() {
    return {
      /**
       * Get market data subscription dependencies
       */
      deps: (request: RequestForUrl<'marketDataSubscription/deps'>) =>
        this.executeEndpoint('marketDataSubscription/deps', request),

      /**
       * Get a specific market data subscription by ID
       */
      item: (request: RequestForUrl<'marketDataSubscription/item'>) =>
        this.executeEndpoint('marketDataSubscription/item', request),

      /**
       * Get multiple market data subscriptions
       */
      items: (request: RequestForUrl<'marketDataSubscription/items'>) =>
        this.executeEndpoint('marketDataSubscription/items', request),

      /**
       * Get market data subscription list dependencies
       */
      ldeps: (request: RequestForUrl<'marketDataSubscription/ldeps'>) =>
        this.executeEndpoint('marketDataSubscription/ldeps', request),

      /**
       * Get market data subscription list
       */
      list: (request?: RequestForUrl<'marketDataSubscription/list'>) =>
        this.executeEndpoint('marketDataSubscription/list', request || { body: {} }),

      /**
       * Create market data subscription
       * ⚠️ Usable by NT Admins only
       */
      create: (request: RequestForUrl<'marketDataSubscription/create'>) =>
        this.executeEndpoint('marketDataSubscription/create', request),

      /**
       * Update market data subscription
       * ⚠️ Usable by NT Admins only
       */
      update: (request: RequestForUrl<'marketDataSubscription/update'>) =>
        this.executeEndpoint('marketDataSubscription/update', request),

      /**
       * Add market data subscription (alias for create)
       */
      add: (request: RequestForUrl<'user/addmarketdatasubscription'>) =>
        this.executeEndpoint('user/addmarketdatasubscription', request)
    };
  }

  /**
   * Manage account funding and transfers. *(admin only)*
   *
   * **Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   *
   * **Special Operations:**
   * - `walletTransfer` - Transfer funds between accounts
   * - `checkStripeFundingEligibility` - Check Stripe funding eligibility
   *
   * @example
   * ```typescript
   * // List all fund transactions
   * const transactions = await sdk.live.fundTransaction.list();
   *
   * // Transfer funds between accounts
   * await sdk.live.fundTransaction.walletTransfer({
   *   body: {
   *     accountId: 123,
   *     fundAmount: 1000,
   *     fundCurrencyId: 1,
   *     fundDescription: 'Account funding',
   *     senderId: 456        // optional
   *   }
   * });
   *
   * // Check Stripe funding eligibility
   * const eligibility = await sdk.live.fundTransaction.checkStripeFundingEligibility({
   *   body: { userId: 123 }
   * });
   * ```
   */
  get fundTransaction() {
    return {
      /**
       * Get fund transaction dependencies
       */
      deps: (request: RequestForUrl<'fundTransaction/deps'>) =>
        this.executeEndpoint('fundTransaction/deps', request),

      /**
       * Get a specific fund transaction by ID
       */
      item: (request: RequestForUrl<'fundTransaction/item'>) =>
        this.executeEndpoint('fundTransaction/item', request),

      /**
       * Get multiple fund transactions
       */
      items: (request: RequestForUrl<'fundTransaction/items'>) =>
        this.executeEndpoint('fundTransaction/items', request),

      /**
       * Get fund transaction list dependencies
       */
      ldeps: (request: RequestForUrl<'fundTransaction/ldeps'>) =>
        this.executeEndpoint('fundTransaction/ldeps', request),

      /**
       * Get fund transaction list
       */
      list: (request?: RequestForUrl<'fundTransaction/list'>) =>
        this.executeEndpoint('fundTransaction/list', request || { body: {} }),

      /**
       * Transfer funds between accounts within the same organization.
       * Supports full balance transfer or specific amount.
       * Requires appropriate permissions on both accounts.
       */
      walletTransfer: (request: RequestForUrl<'fundTransaction/wallettransfer'>) =>
        this.executeEndpoint('fundTransaction/wallettransfer', request),

      /**
       * Verify if user is eligible to fund account via Stripe.
       * Returns eligibility status, supported currencies, and limits.
       * Check before initiating Stripe funding flow.
       */
      checkStripeFundingEligibility: (
        request: RequestForUrl<'fundTransaction/checkstripefundingeligibility'>
      ) => this.executeEndpoint('fundTransaction/checkstripefundingeligibility', request)
    };
  }

  /**
   * Market replay and simulation controls.
   *
   * **Methods:** `changeSpeed`, `checkSession`, `initializeClock`
   */
  get replay() {
    return {
      /**
       * Change replay speed
       */
      changeSpeed: (request: RequestForUrl<'replay/changespeed'>) =>
        this.executeEndpoint('replay/changespeed', request),

      /**
       * Check replay session
       */
      checkSession: (request: RequestForUrl<'replay/checkreplaysession'>) =>
        this.executeEndpoint('replay/checkreplaysession', request),

      /**
       * Initialize replay clock
       */
      initializeClock: (request: RequestForUrl<'replay/initializeclock'>) =>
        this.executeEndpoint('replay/initializeclock', request)
    };
  }

  /**
   * Support and utility operations.
   *
   * **Methods:** `getTimestamp`
   */
  get support() {
    return {
      /**
       * Get timestamp
       */
      getTimestamp: (request: RequestForUrl<'support/gettimestamp'>) =>
        this.executeEndpoint('support/gettimestamp', request)
    };
  }

  /**
   * Manage user contact information.
   *
   * **Common Methods:** `item`, `items`, `deps`, `ldeps`
   *
   * **Special Methods:**
   * - `updateContactInfo` - Update complete contact information (address, phone, etc.)
   *
   * @example
   * ```typescript
   * // Get contact info for a user
   * const contactInfo = await sdk.live.contactInfo.item({ query: { id: 123 } });
   *
   * // Update complete contact information
   * await sdk.live.contactInfo.updateContactInfo({
   *   body: {
   *     userId: 123,
   *     firstName: 'John',
   *     lastName: 'Doe',
   *     streetAddress1: '123 Main St',
   *     city: 'New York',
   *     state: 'NY',
   *     postCode: '10001',
   *     country: 'USA',
   *     phone: '+1-555-123-4567'
   *   }
   * });
   * ```
   */
  get contactInfo() {
    return {
      /**
       * Get contact info dependencies
       */
      deps: (request: RequestForUrl<'contactInfo/deps'>) =>
        this.executeEndpoint('contactInfo/deps', request),

      /**
       * Get a specific contact info by ID
       */
      item: (request: RequestForUrl<'contactInfo/item'>) =>
        this.executeEndpoint('contactInfo/item', request),

      /**
       * Get multiple contact info items
       */
      items: (request: RequestForUrl<'contactInfo/items'>) =>
        this.executeEndpoint('contactInfo/items', request),

      /**
       * Get contact info list dependencies
       */
      ldeps: (request: RequestForUrl<'contactInfo/ldeps'>) =>
        this.executeEndpoint('contactInfo/ldeps', request),

      /**
       * Update contact information
       */
      updateContactInfo: (request: RequestForUrl<'contactInfo/updatecontactinfo'>) =>
        this.executeEndpoint('contactInfo/updatecontactinfo', request)
    };
  }

  /**
   * Manage platform subscriptions. *(admin only)*
   *
   * **Methods:** `create`, `update`
   */
  get tradovateSubscription() {
    return {
      /**
       * Create tradovate subscription
       * ⚠️ Usable by NT Admins only
       */
      create: (request: RequestForUrl<'tradovateSubscription/create'>) =>
        this.executeEndpoint('tradovateSubscription/create', request),

      /**
       * Update tradovate subscription
       * ⚠️ Usable by NT Admins only
       */
      update: (request: RequestForUrl<'tradovateSubscription/update'>) =>
        this.executeEndpoint('tradovateSubscription/update', request)
    };
  }

  /**
   * Tradovate Subscription Plan API endpoints with full type safety.
   *
   * **Common Operations:**
   * - List all available subscription plans
   * - Get specific plan details
   * - Search for plans by name
   *
   * @returns {Object} subscription plan API endpoints
   *
   * @example
   * ```typescript
   * // List all available subscription plans
   * const plans = await sdk.live.tradovateSubscriptionPlan.list();
   *
   * plans.forEach(plan => {
   *   console.log('Plan:', plan.name);
   *   console.log('Price:', plan.price);
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Get specific plan details
   * const plan = await sdk.live.tradovateSubscriptionPlan.item({
   *   query: { id: 123 }
   * });
   *
   * console.log('Plan name:', plan.name);
   * console.log('Price:', plan.price);
   * ```
   */
  get tradovateSubscriptionPlan() {
    return {
      /**
       * Find a specific subscription plan
       */
      find: (request: RequestForUrl<'tradovateSubscriptionPlan/find'>) =>
        this.executeEndpoint('tradovateSubscriptionPlan/find', request),

      /**
       * Get a specific subscription plan by ID
       */
      item: (request: RequestForUrl<'tradovateSubscriptionPlan/item'>) =>
        this.executeEndpoint('tradovateSubscriptionPlan/item', request),

      /**
       * Get multiple subscription plans
       */
      items: (request: RequestForUrl<'tradovateSubscriptionPlan/items'>) =>
        this.executeEndpoint('tradovateSubscriptionPlan/items', request),

      /**
       * Get subscription plan list
       */
      list: (request?: RequestForUrl<'tradovateSubscriptionPlan/list'>) =>
        this.executeEndpoint('tradovateSubscriptionPlan/list', request || { body: {} }),

      /**
       * Get subscription plan suggestions
       */
      suggest: (request: RequestForUrl<'tradovateSubscriptionPlan/suggest'>) =>
        this.executeEndpoint('tradovateSubscriptionPlan/suggest', request)
    };
  }

  /**
   * Risk category configuration for account scaling.
   *
   * **Common Methods:** `list`, `item`, `items`, `find`, `suggest`
   *
   * Risk categories define trading parameters and limits for groups of accounts.
   * Used for scaling programs where accounts progress through tiers.
   *
   * @example
   * ```typescript
   * // List all risk categories
   * const categories = await sdk.sim.riskCategory.list({});
   *
   * // Get a specific risk category
   * const category = await sdk.sim.riskCategory.item({ query: { id: 1 } });
   * ```
   */
  get riskCategory() {
    return {
      find: (request: RequestForUrl<'riskCategory/find'>) =>
        this.executeEndpoint('riskCategory/find', request),

      item: (request: RequestForUrl<'riskCategory/item'>) =>
        this.executeEndpoint('riskCategory/item', request),

      items: (request: RequestForUrl<'riskCategory/items'>) =>
        this.executeEndpoint('riskCategory/items', request),

      list: (request?: RequestForUrl<'riskCategory/list'>) =>
        this.executeEndpoint('riskCategory/list', request || { body: {} }),

      suggest: (request: RequestForUrl<'riskCategory/suggest'>) =>
        this.executeEndpoint('riskCategory/suggest', request)
    };
  }

  /**
   * Monitor and manage account risk parameters. *(admin operations)*
   *
   * **Common Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   *
   * **Risk Management:**
   * - `updateMaxNetLiq` - Update max net liquidation value
   * - `setAdminAutoLiqAction` - Set auto-liquidation action
   * - `resetAutoLiqStatus` - Reset auto-liquidation status
   * - `setAccountNotes` - Add risk notes
   * - `setDemoHalt` - Halt demo risk categories
   * - `switchRiskCategory` - Change risk category
   *
   * @example
   * ```typescript
   * // Update max net liquidation value
   * await sdk.live.accountRiskStatus.updateMaxNetLiq({
   *   body: { accountId: 123, maxNetLiq: 50000 }
   * });
   *
   * // Set admin auto-liquidation action
   * await sdk.live.accountRiskStatus.setAdminAutoLiqAction({
   *   body: {
   *     accountId: 123,
   *     adminAction: 'LiquidateImmediately',
   *     adminActionReasonCode: 'RestrictedRiskRestriction'
   *   }
   * });
   * ```
   */
  get accountRiskStatus() {
    return {
      /**
       * Get account risk status dependencies
       */
      deps: (request: RequestForUrl<'accountRiskStatus/deps'>) =>
        this.executeEndpoint('accountRiskStatus/deps', request),

      /**
       * Get a specific account risk status by ID
       */
      item: (request: RequestForUrl<'accountRiskStatus/item'>) =>
        this.executeEndpoint('accountRiskStatus/item', request),

      /**
       * Get multiple account risk statuses
       */
      items: (request: RequestForUrl<'accountRiskStatus/items'>) =>
        this.executeEndpoint('accountRiskStatus/items', request),

      /**
       * Get account risk status list dependencies
       */
      ldeps: (request: RequestForUrl<'accountRiskStatus/ldeps'>) =>
        this.executeEndpoint('accountRiskStatus/ldeps', request),

      /**
       * Get account risk status list
       */
      list: (request?: RequestForUrl<'accountRiskStatus/list'>) =>
        this.executeEndpoint('accountRiskStatus/list', request || { body: {} }),

      /**
       * Set maximum net liquidation value for an account *(admin only)*.
       * Used to enforce account size limits for risk management.
       * Account will be restricted if net liq exceeds this value.
       */
      updateMaxNetLiq: (request: RequestForUrl<'accountRiskStatus/updatemaxnetliq'>) =>
        this.executeEndpoint('accountRiskStatus/updatemaxnetliq', request),

      /**
       * Manually trigger admin action for auto-liquidation *(admin only)*.
       * Used to liquidate positions, restrict trading, or close accounts.
       * Requires `adminAction` type and `adminActionReasonCode` from spec.
       */
      setAdminAutoLiqAction: (request: RequestForUrl<'accountRiskStatus/setadminautoliqaction'>) =>
        this.executeEndpoint('accountRiskStatus/setadminautoliqaction', request),

      /**
       * Reset auto-liquidation status for an account *(admin only)*.
       * Clears triggered liquidation flags and restores normal trading.
       * Use after resolving risk violations.
       */
      resetAutoLiqStatus: (request: RequestForUrl<'accountRiskStatus/resetautoliqstatus'>) =>
        this.executeEndpoint('accountRiskStatus/resetautoliqstatus', request),

      /**
       * Add risk management notes to an account *(admin only)*.
       * Documents risk events, violations, or special conditions.
       * Notes visible to admins for auditing and tracking.
       */
      setAccountNotes: (request: RequestForUrl<'accountRiskStatus/setaccountnotes'>) =>
        this.executeEndpoint('accountRiskStatus/setaccountnotes', request),

      /**
       * Halt trading on demo accounts by risk category *(admin only)*.
       * Freezes all accounts in category to prevent new orders.
       * Used for system maintenance or emergency stops.
       */
      setDemoHalt: (request: RequestForUrl<'accountRiskStatus/setdemohalt'>) =>
        this.executeEndpoint('accountRiskStatus/setdemohalt', request),

      /**
       * Move account to different risk category *(admin only)*.
       * Changes risk parameters, margins, and position limits.
       * Use when account qualifies for different risk tier.
       */
      switchRiskCategory: (request: RequestForUrl<'accountRiskStatus/switchriskcategory'>) =>
        this.executeEndpoint('accountRiskStatus/switchriskcategory', request)
    };
  }

  /**
   * Manage user account auto-liquidation settings.
   *
   * **Methods:** `create`, `update`, `updateUserAutoLiq`
   *
   * **Note:** Unlike most entities, `create()` is available to non-admin users for this endpoint.
   */
  get userAccountAutoLiq() {
    return {
      /**
       * Create user account auto liquidation
       */
      create: (request: RequestForUrl<'userAccountAutoLiq/create'>) =>
        this.executeEndpoint('userAccountAutoLiq/create', request),

      /**
       * Update user account auto liquidation
       */
      update: (request: RequestForUrl<'userAccountAutoLiq/update'>) =>
        this.executeEndpoint('userAccountAutoLiq/update', request),

      /**
       * Update user auto liquidation
       */
      updateUserAutoLiq: (request: RequestForUrl<'userAccountAutoLiq/updateuserautoliq'>) =>
        this.executeEndpoint('userAccountAutoLiq/updateuserautoliq', request)
    };
  }

  /**
   * Manage user account position limits.
   *
   * **Methods:** `create`, `update`, `deleteUserAccountPositionLimit`, `deleteUserAccountRiskParameter`
   *
   * **Note:** Unlike most entities, `create()` is available to non-admin users for this endpoint.
   */
  get userAccountPositionLimit() {
    return {
      /**
       * Create user account position limit
       */
      create: (request: RequestForUrl<'userAccountPositionLimit/create'>) =>
        this.executeEndpoint('userAccountPositionLimit/create', request),

      /**
       * Update user account position limit
       */
      update: (request: RequestForUrl<'userAccountPositionLimit/update'>) =>
        this.executeEndpoint('userAccountPositionLimit/update', request),

      /**
       * Delete user account position limit
       */
      deleteUserAccountPositionLimit: (
        request: RequestForUrl<'userAccountPositionLimit/deleteuseraccountpositionlimit'>
      ) => this.executeEndpoint('userAccountPositionLimit/deleteuseraccountpositionlimit', request),

      /**
       * Delete user account risk parameter
       */
      deleteUserAccountRiskParameter: (
        request: RequestForUrl<'userAccountPositionLimit/deleteuseraccountriskparameter'>
      ) => this.executeEndpoint('userAccountPositionLimit/deleteuseraccountriskparameter', request)
    };
  }

  /**
   * Manage user account risk parameters.
   *
   * **Methods:** `create`, `update`
   *
   * **Note:** Unlike most entities, `create()` is available to non-admin users for this endpoint.
   */
  get userAccountRiskParameter() {
    return {
      /**
       * Create user account risk parameter
       */
      create: (request: RequestForUrl<'userAccountRiskParameter/create'>) =>
        this.executeEndpoint('userAccountRiskParameter/create', request),

      /**
       * Update user account risk parameter
       */
      update: (request: RequestForUrl<'userAccountRiskParameter/update'>) =>
        this.executeEndpoint('userAccountRiskParameter/update', request)
    };
  }

  /**
   * Risk time period configuration for time-based risk rules.
   *
   * **Common Methods:** `list`, `item`, `items`, `find`, `suggest`
   */
  get riskTimePeriod() {
    return {
      find: (request: RequestForUrl<'riskTimePeriod/find'>) =>
        this.executeEndpoint('riskTimePeriod/find', request),

      item: (request: RequestForUrl<'riskTimePeriod/item'>) =>
        this.executeEndpoint('riskTimePeriod/item', request),

      items: (request: RequestForUrl<'riskTimePeriod/items'>) =>
        this.executeEndpoint('riskTimePeriod/items', request),

      list: (request?: RequestForUrl<'riskTimePeriod/list'>) =>
        this.executeEndpoint('riskTimePeriod/list', request || { body: {} }),

      suggest: (request: RequestForUrl<'riskTimePeriod/suggest'>) =>
        this.executeEndpoint('riskTimePeriod/suggest', request)
    };
  }

  /**
   * Auto-liquidation transaction history.
   *
   * **Common Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   */
  get autoLiqTransaction() {
    return {
      deps: (request: RequestForUrl<'autoLiqTransaction/deps'>) =>
        this.executeEndpoint('autoLiqTransaction/deps', request),

      item: (request: RequestForUrl<'autoLiqTransaction/item'>) =>
        this.executeEndpoint('autoLiqTransaction/item', request),

      items: (request: RequestForUrl<'autoLiqTransaction/items'>) =>
        this.executeEndpoint('autoLiqTransaction/items', request),

      ldeps: (request: RequestForUrl<'autoLiqTransaction/ldeps'>) =>
        this.executeEndpoint('autoLiqTransaction/ldeps', request),

      list: (request?: RequestForUrl<'autoLiqTransaction/list'>) =>
        this.executeEndpoint('autoLiqTransaction/list', request || { body: {} })
    };
  }

  /**
   * Permissioned account auto-liquidation settings.
   *
   * **Common Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   */
  get permissionedAccountAutoLiq() {
    return {
      deps: (request: RequestForUrl<'permissionedAccountAutoLiq/deps'>) =>
        this.executeEndpoint('permissionedAccountAutoLiq/deps', request),

      item: (request: RequestForUrl<'permissionedAccountAutoLiq/item'>) =>
        this.executeEndpoint('permissionedAccountAutoLiq/item', request),

      items: (request: RequestForUrl<'permissionedAccountAutoLiq/items'>) =>
        this.executeEndpoint('permissionedAccountAutoLiq/items', request),

      ldeps: (request: RequestForUrl<'permissionedAccountAutoLiq/ldeps'>) =>
        this.executeEndpoint('permissionedAccountAutoLiq/ldeps', request),

      list: (request?: RequestForUrl<'permissionedAccountAutoLiq/list'>) =>
        this.executeEndpoint('permissionedAccountAutoLiq/list', request || { body: {} })
    };
  }

  /**
   * Command execution reports and history.
   *
   * **Common Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   */
  get commandReport() {
    return {
      deps: (request: RequestForUrl<'commandReport/deps'>) =>
        this.executeEndpoint('commandReport/deps', request),

      item: (request: RequestForUrl<'commandReport/item'>) =>
        this.executeEndpoint('commandReport/item', request),

      items: (request: RequestForUrl<'commandReport/items'>) =>
        this.executeEndpoint('commandReport/items', request),

      ldeps: (request: RequestForUrl<'commandReport/ldeps'>) =>
        this.executeEndpoint('commandReport/ldeps', request),

      list: (request?: RequestForUrl<'commandReport/list'>) =>
        this.executeEndpoint('commandReport/list', request || { body: {} })
    };
  }

  /**
   * Position change history and audit log.
   *
   * **Common Methods:** `item`, `items`, `deps`, `ldeps`
   */
  get positionLog() {
    return {
      deps: (request: RequestForUrl<'positionLog/deps'>) =>
        this.executeEndpoint('positionLog/deps', request),

      item: (request: RequestForUrl<'positionLog/item'>) =>
        this.executeEndpoint('positionLog/item', request),

      items: (request: RequestForUrl<'positionLog/items'>) =>
        this.executeEndpoint('positionLog/items', request),

      ldeps: (request: RequestForUrl<'positionLog/ldeps'>) =>
        this.executeEndpoint('positionLog/ldeps', request)
    };
  }

  /**
   * Cash balance change history and audit log.
   *
   * **Common Methods:** `item`, `items`, `deps`, `ldeps`
   */
  get cashBalanceLog() {
    return {
      deps: (request: RequestForUrl<'cashBalanceLog/deps'>) =>
        this.executeEndpoint('cashBalanceLog/deps', request),

      item: (request: RequestForUrl<'cashBalanceLog/item'>) =>
        this.executeEndpoint('cashBalanceLog/item', request),

      items: (request: RequestForUrl<'cashBalanceLog/items'>) =>
        this.executeEndpoint('cashBalanceLog/items', request),

      ldeps: (request: RequestForUrl<'cashBalanceLog/ldeps'>) =>
        this.executeEndpoint('cashBalanceLog/ldeps', request)
    };
  }

  /**
   * Margin snapshots for accounts.
   *
   * **Common Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   */
  get marginSnapshot() {
    return {
      deps: (request: RequestForUrl<'marginSnapshot/deps'>) =>
        this.executeEndpoint('marginSnapshot/deps', request),

      item: (request: RequestForUrl<'marginSnapshot/item'>) =>
        this.executeEndpoint('marginSnapshot/item', request),

      items: (request: RequestForUrl<'marginSnapshot/items'>) =>
        this.executeEndpoint('marginSnapshot/items', request),

      ldeps: (request: RequestForUrl<'marginSnapshot/ldeps'>) =>
        this.executeEndpoint('marginSnapshot/ldeps', request),

      list: (request?: RequestForUrl<'marginSnapshot/list'>) =>
        this.executeEndpoint('marginSnapshot/list', request || { body: {} })
    };
  }

  /**
   * Contract-specific margin requirements.
   *
   * **Common Methods:** `item`, `items`, `deps`, `ldeps`
   */
  get contractMargin() {
    return {
      deps: (request: RequestForUrl<'contractMargin/deps'>) =>
        this.executeEndpoint('contractMargin/deps', request),

      item: (request: RequestForUrl<'contractMargin/item'>) =>
        this.executeEndpoint('contractMargin/item', request),

      items: (request: RequestForUrl<'contractMargin/items'>) =>
        this.executeEndpoint('contractMargin/items', request),

      ldeps: (request: RequestForUrl<'contractMargin/ldeps'>) =>
        this.executeEndpoint('contractMargin/ldeps', request)
    };
  }

  /**
   * Product-level margin requirements.
   *
   * **Common Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   */
  get productMargin() {
    return {
      deps: (request: RequestForUrl<'productMargin/deps'>) =>
        this.executeEndpoint('productMargin/deps', request),

      item: (request: RequestForUrl<'productMargin/item'>) =>
        this.executeEndpoint('productMargin/item', request),

      items: (request: RequestForUrl<'productMargin/items'>) =>
        this.executeEndpoint('productMargin/items', request),

      ldeps: (request: RequestForUrl<'productMargin/ldeps'>) =>
        this.executeEndpoint('productMargin/ldeps', request),

      list: (request?: RequestForUrl<'productMargin/list'>) =>
        this.executeEndpoint('productMargin/list', request || { body: {} })
    };
  }

  /**
   * Product trading session schedules.
   *
   * **Common Methods:** `item`, `items`, `deps`, `ldeps`
   */
  get productSession() {
    return {
      deps: (request: RequestForUrl<'productSession/deps'>) =>
        this.executeEndpoint('productSession/deps', request),

      item: (request: RequestForUrl<'productSession/item'>) =>
        this.executeEndpoint('productSession/item', request),

      items: (request: RequestForUrl<'productSession/items'>) =>
        this.executeEndpoint('productSession/items', request),

      ldeps: (request: RequestForUrl<'productSession/ldeps'>) =>
        this.executeEndpoint('productSession/ldeps', request)
    };
  }

  /**
   * Market data subscription plan definitions.
   *
   * **Common Methods:** `list`, `item`, `items`, `find`, `suggest`
   */
  get marketDataSubscriptionPlan() {
    return {
      find: (request: RequestForUrl<'marketDataSubscriptionPlan/find'>) =>
        this.executeEndpoint('marketDataSubscriptionPlan/find', request),

      item: (request: RequestForUrl<'marketDataSubscriptionPlan/item'>) =>
        this.executeEndpoint('marketDataSubscriptionPlan/item', request),

      items: (request: RequestForUrl<'marketDataSubscriptionPlan/items'>) =>
        this.executeEndpoint('marketDataSubscriptionPlan/items', request),

      list: (request?: RequestForUrl<'marketDataSubscriptionPlan/list'>) =>
        this.executeEndpoint('marketDataSubscriptionPlan/list', request || { body: {} }),

      suggest: (request: RequestForUrl<'marketDataSubscriptionPlan/suggest'>) =>
        this.executeEndpoint('marketDataSubscriptionPlan/suggest', request)
    };
  }

  /**
   * Fill pairs for spread and paired trades.
   *
   * **Common Methods:** `list`, `item`, `items`, `deps`, `ldeps`
   */
  get fillPair() {
    return {
      deps: (request: RequestForUrl<'fillPair/deps'>) =>
        this.executeEndpoint('fillPair/deps', request),

      item: (request: RequestForUrl<'fillPair/item'>) =>
        this.executeEndpoint('fillPair/item', request),

      items: (request: RequestForUrl<'fillPair/items'>) =>
        this.executeEndpoint('fillPair/items', request),

      ldeps: (request: RequestForUrl<'fillPair/ldeps'>) =>
        this.executeEndpoint('fillPair/ldeps', request),

      list: (request?: RequestForUrl<'fillPair/list'>) =>
        this.executeEndpoint('fillPair/list', request || { body: {} })
    };
  }
}
