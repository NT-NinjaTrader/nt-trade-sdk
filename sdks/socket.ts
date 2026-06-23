import { WebSocket } from 'ws';
import type { Endpoint, RequestForUrl, ResponseForUrl } from '../api/endpoints';
import { RateLimitError, ValidationError } from '../api/errors';
import type { MarketDataEvent } from '../api/mdTypes';
import type { EventType } from '../api/types';
import { entityNames } from '../data/constants';
import type {
  EntityName,
  Maybe,
  MessageEventHandler,
  PluralEntityName,
  SocketConfig
} from '../types/common';
import type {
  CachedEntity,
  CacheRequest,
  LoggerType,
  PromiseResolve,
  TimeoutReject,
  TypedCacheEntry,
  TypedCacheLookupResult
} from '../types/runtime';
import { CacheManager } from './cacheManager';

export type PTicketBody = {
  ['p-ticket']?: string;
  ['p-time']?: number;
  ['p-captcha']?: string;
};

export type SocketEventName = 'props' | 'md' | 'clock' | 'shutdown';

export type MdSubscribeType =
  | 'md/subscribeQuote'
  | 'md/subscribeDOM'
  | 'md/subscribeHistogram'
  | 'md/getChart';

export type MdUnsubscribeType =
  | 'md/unsubscribeQuote'
  | 'md/unsubscribeDOM'
  | 'md/unsubscribeHistogram';

export type SocketMessage = {
  i?: number;
  s?: number;
  e?: SocketEventName;
  d?: PTicketBody | EventType | MarketDataEvent;
};

/**
 * WebSocket client for connecting to TradeAPI WebSocket endpoints.
 *
 * Handles real-time communication, message caching, rate limiting,
 * and event subscription for live trading data.
 *
 * @example
 * ```typescript
 * const socket = new Socket({
 *   url: 'wss://live.tradovate.com/v1/websocket',
 *   accessToken: 'your-access-token',
 *   userId: 12345,
 *   entityTypes: ['account', 'position', 'order'],
 *   logger: winstonLogger
 * });
 *
 * await socket.connect();
 * socket.on((messages) => {
 *   console.log('Received messages:', messages);
 * });
 * ```
 */
export class Socket {
  /** Internal WebSocket instance */
  private ws: WebSocket;
  /** Socket configuration */
  private config: SocketConfig;
  /** Message counter for request/response correlation */
  private counter: number = 0;
  /** Event subscribers */
  private subscribers: MessageEventHandler[] = [];
  /** Logger instance */
  private logger: Maybe<LoggerType>;

  /** Whether the socket is ready for communication */
  ready: boolean = false;

  /** Cache manager instance */
  private cacheManager: CacheManager;

  /**
   * Creates a new Socket instance with the specified configuration.
   *
   * @param config - Socket configuration including URL, access token, and entity types
   *
   * @example
   * ```typescript
   * const socket = new Socket({
   *   url: 'wss://live.tradovate.com/v1/websocket',
   *   accessToken: 'your-access-token',
   *   userId: 12345,
   *   entityTypes: ['account', 'position', 'order'],
   *   syncImmediate: true,
   *   logger: winstonLogger
   * });
   * ```
   */
  constructor(config: SocketConfig) {
    this.config = config;
    this.ws = new WebSocket(config.url);

    // Use shared cache manager if provided, otherwise create a new one
    if (config.sharedCacheManager) {
      this.cacheManager = config.sharedCacheManager;
    } else {
      // Fallback: create a new cache manager with defaults
      this.cacheManager = new CacheManager(undefined, config.logger);
    }

    if (config.entityTypes && config.entityTypes.length !== 0) {
      this.cacheManager.initializeCache(config.entityTypes);
    }

    this.logger = config.logger;
  }

  /**
   * Establishes a WebSocket connection to the TradeAPI service.
   *
   * This method creates a new WebSocket connection, authenticates using the access token,
   * and optionally starts synchronization if configured. The socket is marked as ready
   * once the connection is established and authenticated.
   *
   * @returns A promise that resolves when the connection is established and authenticated
   * @throws {@link Error} When WebSocket authorization fails
   *
   * @example
   * ```typescript
   * try {
   *   await socket.connect();
   *   console.log('Socket connected and ready');
   * } catch (error) {
   *   console.error('Connection failed:', error.message);
   * }
   * ```
   */
  async connect(): Promise<void> {
    const startTime = Date.now();

    this.logger?.logNormal('Starting WebSocket connection', {
      type: 'websocket_connect_start',
      url: this.config.url,
      userId: this.config.userId
    });

    return new Promise((res, rej) => {
      const ws = new WebSocket(this.config.url);
      this.ws = ws;

      const connectionStartTime = Date.now();

      this.ws.addEventListener('open', async () => {
        const connectionDuration = Date.now() - connectionStartTime;

        this.logger?.logConnection(`WebSocket connection opened`, {
          duration: connectionDuration,
          url: this.config.url,
          userId: this.config.userId
        });

        this.logger?.logPerformance(`WebSocket connection establishment`, connectionDuration, {
          type: 'websocket_connection_open',
          url: this.config.url,
          userId: this.config.userId
        });

        // For authorize endpoint, we need to send the raw access token, not a structured request
        const authStartTime = Date.now();
        const response = await this.send('authorize', this.config.accessToken);
        const authDuration = Date.now() - authStartTime;

        if (response.s === 200) {
          this.logger?.logConnection(`WebSocket authorization successful`, {
            duration: authDuration,
            url: this.config.url,
            userId: this.config.userId
          });

          this.logger?.logPerformance(`WebSocket authorization`, authDuration, {
            type: 'websocket_authorization',
            url: this.config.url,
            userId: this.config.userId
          });

          if (this.config.syncImmediate) {
            const syncStartTime = Date.now();
            await this.startSync();
            const syncDuration = Date.now() - syncStartTime;

            this.logger?.logPerformance(`Initial sync`, syncDuration, {
              type: 'websocket_initial_sync',
              url: this.config.url,
              userId: this.config.userId,
              entityTypes: this.config.entityTypes
            });
          }

          this.ready = true;

          const totalDuration = Date.now() - startTime;

          this.logger?.logNormal('WebSocket connection established and ready', {
            type: 'websocket_connect_success',
            url: this.config.url,
            userId: this.config.userId,
            totalDuration,
            connectionDuration,
            authDuration,
            syncDuration: this.config.syncImmediate
              ? Date.now() - (startTime + connectionDuration + authDuration)
              : 0
          });

          this.logger?.logPerformance(`Complete WebSocket connection process`, totalDuration, {
            type: 'websocket_connect_complete',
            url: this.config.url,
            userId: this.config.userId
          });

          res();
        } else {
          const totalDuration = Date.now() - startTime;

          this.logger?.logError(
            `WebSocket authorization failed`,
            new Error('Authorization failed'),
            {
              type: 'websocket_authorization_failure',
              url: this.config.url,
              userId: this.config.userId,
              responseStatus: response.s,
              totalDuration,
              authDuration
            }
          );

          rej('WebSocket authorization failed. Please check that you have a valid access token.');
        }
      });

      this.ws.addEventListener('message', e => {
        const messageStartTime = Date.now();

        checkHeartbeat(this.ws);
        const [, data] = decode(e.data.toString('utf-8'));
        if (data) {
          data.forEach(datum => {
            if (datum.e && datum.e === 'props' && datum.d) {
              const d = datum.d as EventType;
              this.createOrUpdate(d);
            }
          });
          this.subscribers.forEach(s => s(data));
        }

        const messageDuration = Date.now() - messageStartTime;

        this.logger?.logPerformance(`WebSocket message processing`, messageDuration, {
          type: 'websocket_message_processing',
          url: this.config.url,
          userId: this.config.userId,
          messageCount: data?.length || 0
        });

        // Log performance warnings for slow message processing
        if (messageDuration > 100) {
          // 100ms
          this.logger?.logPerformanceWarning(`WebSocket message processing`, messageDuration, 100, {
            type: 'websocket_message_processing_slow',
            url: this.config.url,
            userId: this.config.userId,
            threshold: 100,
            messageCount: data?.length || 0
          });
        }
      });

      this.ws.addEventListener('error', error => {
        const totalDuration = Date.now() - startTime;

        this.logger?.logError(`WebSocket connection error`, new Error('Connection error'), {
          type: 'websocket_connect_error',
          url: this.config.url,
          userId: this.config.userId,
          totalDuration,
          error: error
        });
      });

      this.ws.addEventListener('close', event => {
        const totalDuration = Date.now() - startTime;

        this.logger?.logNormal('WebSocket connection closed', {
          type: 'websocket_connect_closed',
          url: this.config.url,
          userId: this.config.userId,
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          totalDuration
        });

        this.logger?.logPerformance(`WebSocket connection lifetime`, totalDuration, {
          type: 'websocket_connection_lifetime',
          url: this.config.url,
          userId: this.config.userId,
          code: event.code,
          wasClean: event.wasClean
        });
      });
    });
  }

  /**
   * Starts synchronization of entity data from the TradeAPI service.
   *
   * This method requests initial data for configured entity types and populates
   * the local cache. It's called automatically during connection if syncImmediate
   * is enabled in the configuration.
   *
   * @returns A promise that resolves when synchronization is complete
   *
   * @example
   * ```typescript
   * // Manual sync (usually not needed as it's automatic)
   * await socket.startSync();
   * console.log('Sync completed');
   * ```
   */
  async startSync() {
    const startTime = Date.now();

    this.logger?.logNormal('Starting WebSocket synchronization', {
      type: 'websocket_sync_start',
      url: this.config.url,
      userId: this.config.userId,
      entityTypes: this.config.entityTypes
    });

    const init = await this.send('user/syncrequest', {
      body: {
        splitResponses: true,
        shardingExpression: this.config.shardingExpression,
        entityTypes: this.config.entityTypes
      }
    });

    if (init) {
      // Populate cache with sync data through CacheManager
      Object.keys(init).forEach(key => {
        const pluralName = key as PluralEntityName;
        const entitiesOrEntity = (init as any)[pluralName];
        const entityType = this.getEntityTypeFromPlural(pluralName);

        if (!entitiesOrEntity) {
          return; // Skip null/undefined values
        }

        // Handle both single entity objects and arrays
        const entities = Array.isArray(entitiesOrEntity) ? entitiesOrEntity : [entitiesOrEntity];

        entities.forEach((entity: any) => {
          // Additional safety check: ensure entity is an object with an id
          if (entity && typeof entity === 'object' && 'id' in entity) {
            this.cacheManager.createOrUpdateCacheEntry(entity, entityType, 'sync', Date.now());
          }
        });
      });

      // Update sync stats
      this.cacheManager.setStats({
        syncs: (this.cacheManager.getCacheStats()?.syncs || 0) + 1
      });

      const duration = Date.now() - startTime;
      const entityTypeCount = Object.keys(init).length;
      const totalEntities = Object.values(init).reduce(
        (sum: number, entities: any) => sum + (entities?.length || 0),
        0
      );

      this.logger?.logNormal(`WebSocket synchronization completed`, {
        type: 'websocket_sync_success',
        url: this.config.url,
        userId: this.config.userId,
        duration,
        entityTypeCount,
        totalEntities
      });

      this.logger?.logPerformance(`WebSocket synchronization`, duration, {
        type: 'websocket_sync_complete',
        url: this.config.url,
        userId: this.config.userId,
        entityTypeCount,
        totalEntities
      });

      this.logger?.log(`Cache populated with ${Object.keys(init).length} entity types from sync`);
    }
  }

  /**
   * Sends a request to the TradeAPI WebSocket service with intelligent caching.
   *
   * This method first checks the cache for matching records before making API calls.
   * It handles rate limiting automatically and caches responses for entity-related requests.
   *
   * @param url - The API endpoint to send the request to
   * @param request - The request data (query and body)
   * @returns A promise that resolves to the response data
   *
   * @example
   * ```typescript
   * // Get account information (will use cache if available)
   * const accounts = await socket.send('account/items', {
   *   body: { splitResponses: true }
   * });
   *
   * // Get positions (will use cache if available)
   * const positions = await socket.send('position/items', {
   *   body: { splitResponses: true }
   * });
   * ```
   */
  async send<T extends Endpoint['url']>(url: T, request: any = undefined): Promise<any> {
    const startTime = Date.now();

    // Handle undefined request case
    const requestData = request || ({} as RequestForUrl<T>);

    this.logger?.logNormal(`Sending WebSocket request`, {
      type: 'websocket_request_start',
      url,
      userId: this.config.userId,
      hasRequest: !!request
    });

    // Check if this is a cacheable request and if we have matching data
    if (this.cacheManager.isCacheableRequest(url)) {
      const cacheLookupStart = Date.now();
      const cacheResult = this.lookupCache(url, requestData as CacheRequest);
      const cacheLookupDuration = Date.now() - cacheLookupStart;

      if (cacheResult.found && cacheResult.data) {
        this.cacheManager.updateStats(true); // Cache hit

        const duration = Date.now() - startTime;
        const entityCount = Array.isArray(cacheResult.data) ? cacheResult.data.length : 1;

        this.logger?.logNormal(`WebSocket cache hit`, {
          type: 'websocket_cache_hit',
          url,
          userId: this.config.userId,
          duration,
          entityCount,
          cacheLookupDuration
        });

        this.logger?.logPerformance(`WebSocket request (cache hit)`, duration, {
          type: 'websocket_request_cache_hit',
          url,
          userId: this.config.userId,
          cacheLookupDuration,
          entityCount
        });

        this.logger?.log(
          `Cache hit for ${url}: returning ${Array.isArray(cacheResult.data) ? cacheResult.data.length : 1} cached entities`
        );
        return cacheResult.data as ResponseForUrl<T>;
      }
    }

    // Cache miss - make the actual API call
    this.cacheManager.updateStats(false); // Cache miss

    const apiCallStart = Date.now();
    const response = await this.executeRequest(url, requestData);
    const apiCallDuration = Date.now() - apiCallStart;

    // Cache the response for future use
    const cacheStart = Date.now();
    this.cacheManager.cacheResponse(url, response);
    const cacheDuration = Date.now() - cacheStart;

    const totalDuration = Date.now() - startTime;
    const entityCount = Array.isArray(response) ? response.length : 1;

    this.logger?.logNormal(`WebSocket request completed`, {
      type: 'websocket_request_success',
      url,
      userId: this.config.userId,
      totalDuration,
      apiCallDuration,
      cacheDuration,
      entityCount
    });

    this.logger?.logPerformance(`WebSocket request (cache miss)`, totalDuration, {
      type: 'websocket_request_cache_miss',
      url,
      userId: this.config.userId,
      apiCallDuration,
      cacheDuration,
      entityCount
    });

    return response as ResponseForUrl<T>;
  }

  /**
   * Intelligent cache lookup based on request type and parameters
   */
  private lookupCache(url: string, request: CacheRequest): TypedCacheLookupResult {
    const entityType = url.split('/')[0] as EntityName;
    const cacheEntries = this.cacheManager.getCacheEntries(entityType);

    if (cacheEntries.length === 0) {
      return { found: false, source: 'api' };
    }

    // Handle different request types
    if (url.endsWith('/item') || url.endsWith('/items')) {
      return this.cacheManager.lookupById(url, request, cacheEntries, entityType);
    } else if (url.endsWith('/find') || url.endsWith('/finds')) {
      return this.cacheManager.lookupByName(url, request, cacheEntries, entityType);
    } else if (url.endsWith('/list')) {
      return this.cacheManager.lookupList(url, request, cacheEntries, entityType);
    } else if (url.endsWith('/deps') || url.endsWith('/ldeps')) {
      return this.cacheManager.lookupDependencies(url, request, cacheEntries, entityType);
    }

    return { found: false, source: 'api' };
  }

  /**
   * Enhanced createOrUpdate method for real-time events
   */
  private createOrUpdate({ entity, entityType }: EventType) {
    //@ts-ignore
    if (!entity || !entity.id || entityType === 'OtherEnvAdminAlertSignal') return;

    // Validate entityType before proceeding
    if (!entityType || !entityNames.includes(entityType as EntityName)) {
      return; // Skip invalid entity types
    }

    const now = Date.now();
    this.cacheManager.createOrUpdateCacheEntry(
      entity as CachedEntity,
      entityType as EntityName,
      'realtime',
      now
    );
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cacheManager.getCacheStats();
  }

  /**
   * Clear the cache for a specific entity type or all types
   */
  clearCache(entityType?: EntityName) {
    this.cacheManager.clearCache(entityType);
  }

  /**
   * Get cache entries for a specific entity type
   */
  getCacheEntries(entityType: EntityName): TypedCacheEntry[] {
    return this.cacheManager.getCacheEntries(entityType);
  }

  /**
   * Updates the access token after renewal
   */
  updateAccessToken(newAccessToken: string): void {
    this.config.accessToken = newAccessToken;

    if (this.logger) {
      this.logger.logDebug('WebSocket access token updated', {
        type: 'websocket_token_updated',
        newTokenLength: newAccessToken.length
      });
    }
  }

  /**
   * Get the raw cache data (backward compatibility)
   */
  getCache(): Record<string, CachedEntity[]> {
    return this.cacheManager.getCache();
  }

  /**
   * Get cache configuration (for testing purposes)
   */
  get cacheConfig() {
    return this.cacheManager.getCacheConfig();
  }

  /**
   * Update cache configuration (for testing purposes)
   */
  updateCacheConfig(config: Partial<any>) {
    this.cacheManager.updateCacheConfig(config);
  }

  /**
   * Get cache statistics (for testing purposes)
   */
  get cacheStats() {
    return this.cacheManager.getCacheStats();
  }

  /**
   * Set cache statistics (for testing purposes)
   */
  setCacheStats(
    stats: Partial<{
      hits: number;
      misses: number;
      updates: number;
      syncs: number;
    }>
  ) {
    this.cacheManager.setStats(stats);
  }

  /**
   * Individual lookup methods (for testing purposes)
   */
  lookupById(url: string, request: any, cacheEntries: any[], entityType: EntityName): any {
    return this.cacheManager.lookupById(url, request, cacheEntries, entityType);
  }

  lookupByName(url: string, request: any, cacheEntries: any[], entityType: EntityName): any {
    return this.cacheManager.lookupByName(url, request, cacheEntries, entityType);
  }

  lookupList(url: string, request: any, cacheEntries: any[], entityType: EntityName): any {
    return this.cacheManager.lookupList(url, request, cacheEntries, entityType);
  }

  lookupDependencies(url: string, request: any, cacheEntries: any[], entityType: EntityName): any {
    return this.cacheManager.lookupDependencies(url, request, cacheEntries, entityType);
  }

  /**
   * Cache response method (for testing purposes)
   */
  cacheResponse(url: string, response: any) {
    this.cacheManager.cacheResponse(url, response);
  }

  /**
   * Create or update cache entry method (for testing purposes)
   */
  createOrUpdateCacheEntry(
    entity: any,
    entityType: EntityName,
    source: 'sync' | 'realtime' | 'response',
    timestamp: number
  ) {
    this.cacheManager.createOrUpdateCacheEntry(entity, entityType, source, timestamp);
  }

  /**
   * Convert plural entity name back to singular entity type
   */
  private getEntityTypeFromPlural(pluralName: string): EntityName {
    // Handle special cases
    if (pluralName === 'accounts') return 'account';
    if (pluralName === 'positions') return 'position';
    if (pluralName === 'orders') return 'order';
    if (pluralName === 'products') return 'product';

    // General rule: remove 's' or 'ies' suffix
    if (pluralName.endsWith('ies')) {
      return (pluralName.slice(0, -3) + 'y') as EntityName;
    }
    if (pluralName.endsWith('s')) {
      return pluralName.slice(0, -1) as EntityName;
    }

    return pluralName as EntityName;
  }

  /**
   * Disconnects from the WebSocket service
   */
  async disconnect(): Promise<void> {
    const startTime = Date.now();

    this.logger?.logNormal('Starting WebSocket disconnection', {
      type: 'websocket_disconnect_start',
      url: this.config.url,
      userId: this.config.userId
    });

    if (this.ws) {
      this.ws.close();
    }

    this.ready = false;

    const duration = Date.now() - startTime;

    this.logger?.logNormal('WebSocket disconnected', {
      type: 'websocket_disconnect_success',
      url: this.config.url,
      userId: this.config.userId,
      duration
    });

    this.logger?.logPerformance(`WebSocket disconnection`, duration, {
      type: 'websocket_disconnect_complete',
      url: this.config.url,
      userId: this.config.userId
    });
  }

  private async executeRequest<T extends Endpoint['url']>(url: T, request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = ++this.counter;

      // Special handling for authorize endpoint - it expects the access token directly
      if (url === 'authorize') {
        const messageString = this.formatMessage(url, index, '', request);

        if (this.logger) {
          this.logger.logDebug(`OUT ->\n${messageString}\n`);
        }

        const timeout = this.setupTimeout(reject);
        const responseHandler = this.createResponseHandler(url, index, timeout, resolve, request);

        this.on(responseHandler);
        this.ws.send(messageString);
        return;
      }

      // WebSocket format for other endpoints: ${operation}\n${messageId}\n${queryParameters}\n${jsonBody}
      let queryParams = '';
      let body = {};

      if (request && typeof request === 'object') {
        if (request.query && typeof request.query === 'object') {
          // Format query parameters as key=value pairs (e.g., id=855569)
          queryParams = Object.entries(request.query)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        }
        if (request.body) {
          body = request.body;
        } else if (!request.query) {
          // If no query, treat the entire request as body
          body = request;
        }
      }

      const messageString = this.formatMessage(url, index, queryParams, body);

      if (this.logger) {
        this.logger.logDebug(`OUT ->\n${messageString}\n`);
      }

      const timeout = this.setupTimeout(reject);
      const responseHandler = this.createResponseHandler(url, index, timeout, resolve, request);

      this.on(responseHandler);
      this.ws.send(messageString);
    });
  }

  private formatMessage(url: string, index: number, query: string, body: unknown): string {
    // Special handling for authorize endpoint - send raw access token
    if (url === 'authorize') {
      const accessToken = this.extractAccessToken(body);
      return `${url}\n${index}\n\n${accessToken}`;
    }

    // For all other endpoints, use standard format
    const bodyString = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';

    return `${url}\n${index}\n${query || ''}\n${bodyString}`;
  }

  /**
   * Type-safe access token extraction for authorize endpoint
   */
  private extractAccessToken(body: unknown): string {
    if (typeof body === 'string') {
      return body;
    }

    if (body && typeof body === 'object' && 'body' in body) {
      const bodyValue = (body as { body: unknown }).body;
      if (typeof bodyValue === 'string') {
        return bodyValue;
      }
    }

    // Fallback - log warning and return empty string
    this.logger?.logError('Invalid access token format for authorize endpoint', undefined, {
      body
    });
    return '';
  }

  private setupTimeout(reject: TimeoutReject): ReturnType<typeof setTimeout> {
    return setTimeout(() => reject('Response took longer than 30 seconds.'), 30 * 60 * 1000);
  }

  private createResponseHandler<T extends Endpoint['url']>(
    url: T,
    index: number,
    timeout: ReturnType<typeof setTimeout>,
    resolve: PromiseResolve<any>,
    request: any
  ) {
    const handler = (data: SocketMessage[]) => {
      if (!data || data.length === 0) return;

      data.forEach((datum: SocketMessage) => {
        const { i } = datum;
        if (i && i === index) {
          clearTimeout(timeout);
          this.handleResponse(datum, url, resolve, request);
          this.off(handler);
        }
      });
    };

    return handler;
  }

  private handleResponse<T extends Endpoint['url']>(
    datum: SocketMessage,
    url: T,
    resolve: PromiseResolve<any>,
    request: any
  ) {
    //@ts-ignore
    if (datum.d && isPTicketBody(datum.d)) {
      this.handleRateLimit(datum.d, url, resolve, request);
    } else {
      this.handleNormalResponse(datum, url, resolve);
    }
  }

  private handleRateLimit<T extends Endpoint['url']>(
    pTicketData: PTicketBody,
    url: T,
    resolve: PromiseResolve<ResponseForUrl<T>>,
    _request: RequestForUrl<T>
  ) {
    const time = pTicketData['p-time'] || 1;
    const ticket = pTicketData['p-ticket'];
    const captcha = pTicketData['p-captcha'];

    if (!ticket) {
      throw new RateLimitError('No ticket found in rate limit response', {
        context: { endpoint: 'socket', reason: 'no_ticket' }
      });
    }

    // Handle rate limiting - could implement retry logic here
    // For rate limits, we need to return a structure that matches the expected endpoint response type
    // Create a properly typed rate limit response
    const _rateLimitResponse = {
      ok: false,
      error: 'Rate limited',
      ticket,
      time,
      captcha
    };

    // For rate limit responses, we need to handle the type mismatch properly
    // Since this is a rate limit scenario, we'll resolve with a generic error response
    resolve({
      ok: false,
      error: 'Rate limited',
      ticket,
      time,
      captcha
    } as unknown as ResponseForUrl<T>);
  }

  private handleNormalResponse<T extends Endpoint['url']>(
    datum: SocketMessage,
    url: T,
    resolve: PromiseResolve<ResponseForUrl<T>>
  ) {
    // Special case for authorize endpoint - return the full response structure
    if (url === 'authorize') {
      resolve(datum as ResponseForUrl<T>);
      return;
    }

    // For all other endpoints, extract the actual response data from datum.d
    // This abstracts away the raw WebSocket message structure
    if (datum.d) {
      // Validate that datum.d has the expected structure before casting
      if (typeof datum.d === 'object' && datum.d !== null) {
        resolve(datum.d as ResponseForUrl<T>);
      } else {
        // Fallback for malformed data
        resolve({
          ok: false,
          error: 'Invalid response data'
        } as unknown as ResponseForUrl<T>);
      }
    } else {
      // No datum.d - this suggests the message structure is different than expected
      // Check if the response data is in a different field or if the entire message is the response
      if (typeof datum === 'object' && datum !== null) {
        // Try to find the actual response data in the message
        const responseData = this.extractResponseData(datum, url);
        if (responseData) {
          resolve(responseData as ResponseForUrl<T>);
          return;
        }
      }

      // If we can't extract the data, resolve with an error
      resolve({
        ok: false,
        error: 'Could not extract response data from WebSocket message'
      } as unknown as ResponseForUrl<T>);
    }
  }

  /**
   * Extract response data from WebSocket message when datum.d is not present
   */
  private extractResponseData(datum: SocketMessage, url: string): any {
    // Check if the entire message is the response (for some endpoints)
    if (url !== 'authorize' && typeof datum === 'object' && datum !== null) {
      // Remove WebSocket-specific fields and see if what remains looks like response data
      const { i: _i, s: _s, e: _e, d: _d, ...rest } = datum;

      // If we have meaningful data in the rest, it might be the response
      if (Object.keys(rest).length > 0) {
        // Check if this looks like an Account object (has id, name, etc.)
        if ((rest as any).id && (rest as any).name && (rest as any).userId) {
          return rest;
        }
        // Check if this looks like other entity types
        if (
          (rest as any).id &&
          ((rest as any).symbol || (rest as any).accountId || (rest as any).orderId)
        ) {
          return rest;
        }
      }
    }

    return null;
  }

  /**
   * Subscribe to WebSocket messages (raw subscription)
   */
  on(handler: MessageEventHandler) {
    this.subscribers.push(handler);
  }

  /**
   * Unsubscribe from WebSocket messages (raw subscription)
   */
  off(handler: MessageEventHandler) {
    const index = this.subscribers.indexOf(handler);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  /**
   * Subscribe to entity type events (high-level subscription)
   *
   * @param entityType - The entity type to subscribe to (e.g., 'account', 'position')
   * @param callback - Callback function to handle entity events
   * @returns An unsubscribe function that can be called to remove the subscription
   *
   * @example
   * ```typescript
   * const unsubscribe = socket.subscribe('account', (message) => {
   *   console.log('Account event:', message);
   * });
   *
   * // Later, to unsubscribe:
   * unsubscribe();
   * ```
   */
  subscribe(entityType: EntityName, callback: (message: EventType) => void): () => void {
    // Create a message handler that filters for the specific entity type
    const messageHandler = (messages: SocketMessage[]) => {
      messages.forEach(message => {
        if (message.e === 'props' && message.d) {
          const eventData = message.d as EventType;
          if (eventData.entityType === entityType) {
            callback(eventData);
          }
        }
      });
    };

    // Subscribe to raw WebSocket messages
    this.on(messageHandler);

    // Return an unsubscribe function
    return () => {
      this.off(messageHandler);
    };
  }
}

//type guard for PTicketBody
function isPTicketBody(
  maybePTicket: EventType | MarketDataEvent | PTicketBody
): maybePTicket is PTicketBody {
  return (
    (maybePTicket as PTicketBody)['p-ticket'] !== undefined &&
    (maybePTicket as PTicketBody)['p-time'] !== undefined
  );
}

function decode(raw: string): [string, SocketMessage[]] {
  const T = raw[0];
  if (!T)
    throw new ValidationError('Unexpected socket message - no type found:\n' + raw, {
      context: { endpoint: 'socket', messageType: 'decode_error' }
    });
  let data;
  if (raw.length > 1) {
    data = JSON.parse(raw.slice(1));
  }
  return [T!, data];
}

let lastTime: number;
function checkHeartbeat(ws: WebSocket) {
  if (!lastTime) {
    lastTime = new Date().getTime();
  }
  const now = new Date().getTime();
  if (now - lastTime > 2500) {
    ws.send('[]');
  }
}
