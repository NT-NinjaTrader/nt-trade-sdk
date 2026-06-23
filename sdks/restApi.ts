import axios from 'axios';
import type { Endpoint, RequestForUrl, ResponseForUrl } from '../api/endpoints';
import { ConfigError, createErrorFromResponse } from '../api/errors';
import type { EntityName } from '../types/common';
import type {
  CachedEntity,
  CacheRequest,
  LoggerType,
  TypedCacheEntry,
  TypedCacheLookupResult
} from '../types/runtime';
import { CacheManager } from './cacheManager';
import { WinstonLogger } from './winstonLogger';

export interface RestApiConfig {
  baseUrl: string;
  accessToken: string;
  userId: number;
  entityTypes?: EntityName[];
  logger?: LoggerType;
  sharedCacheManager?: CacheManager;
}

export class RestApi {
  private config: RestApiConfig;
  private cacheManager: CacheManager;
  private logger: LoggerType;

  constructor(config: RestApiConfig) {
    this.config = config;
    this.logger = config.logger || new WinstonLogger({ stage: 'prod' });

    // Use shared cache manager if provided, otherwise create a new one
    if (config.sharedCacheManager) {
      this.cacheManager = config.sharedCacheManager;
    } else {
      // Fallback: create a new cache manager with defaults
      this.cacheManager = new CacheManager(undefined, this.logger);
    }

    if (config.entityTypes) {
      this.cacheManager.initializeCache(config.entityTypes);
    }
  }

  /**
   * Make a GET request to the REST API
   */
  async get<T extends Endpoint['url']>(
    url: T,
    request: RequestForUrl<T> | undefined = undefined
  ): Promise<ResponseForUrl<T>> {
    // Handle undefined request case
    const requestData = request || ({} as RequestForUrl<T>);

    // Check if this is a cacheable request and if we have matching data
    if (this.cacheManager.isCacheableRequest(url)) {
      const cacheResult = this.lookupCache(url, requestData as CacheRequest);
      if (cacheResult.found && cacheResult.data) {
        this.cacheManager.updateStats(true); // Cache hit
        this.logger.logVerbose(
          `Cache hit for ${url}: returning ${Array.isArray(cacheResult.data) ? cacheResult.data.length : 1} cached entities`
        );
        return cacheResult.data as ResponseForUrl<T>;
      }
    }

    // Cache miss - make the actual API call
    this.cacheManager.updateStats(false); // Cache miss
    const response = await this.executeRequest(url, requestData, 'GET');

    // Cache the response for future use
    this.cacheManager.cacheResponse(url, response);

    return response as ResponseForUrl<T>;
  }

  /**
   * Make a POST request to the REST API
   */
  async post<T extends Endpoint['url']>(
    url: T,
    request: RequestForUrl<T> | undefined = undefined
  ): Promise<ResponseForUrl<T>> {
    // Handle undefined request case
    const requestData = request || ({} as RequestForUrl<T>);

    // Check if this is a cacheable request and if we have matching data
    if (this.cacheManager.isCacheableRequest(url)) {
      const cacheResult = this.lookupCache(url, requestData as CacheRequest);
      if (cacheResult.found && cacheResult.data) {
        this.cacheManager.updateStats(true); // Cache hit
        this.logger.logVerbose(
          `Cache hit for ${url}: returning ${Array.isArray(cacheResult.data) ? cacheResult.data.length : 1} cached entities`
        );
        return cacheResult.data as ResponseForUrl<T>;
      }
    }

    // Cache miss - make the actual API call
    this.cacheManager.updateStats(false); // Cache miss
    const response = await this.executeRequest(url, requestData, 'POST');

    // Cache the response for future use
    this.cacheManager.cacheResponse(url, response);

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
   * Execute the actual HTTP request using axios
   */
  private async executeRequest<T extends Endpoint['url']>(
    url: T,
    request: RequestForUrl<T>,
    method: 'GET' | 'POST' = 'GET'
  ): Promise<ResponseForUrl<T>> {
    // Validate that this endpoint can be called via REST
    this.validateRestEndpoint(url);

    const startTime = Date.now();

    try {
      // Build the full URL
      const fullUrl = this.buildFullUrl(url, request);

      // Prepare request configuration
      const axiosConfig: any = {
        method,
        url: fullUrl,
        headers: this.buildHeaders(url),
        timeout: 30000 // 30 second timeout
      };

      // Handle request data based on method and type
      if (method === 'POST' && request && typeof request === 'object' && 'body' in request) {
        axiosConfig.data = request.body;
      } else if (
        method === 'GET' &&
        request &&
        typeof request === 'object' &&
        'query' in request &&
        request.query
      ) {
        // Query parameters are already handled in buildFullUrl
      }

      this.logger.logNormal(`Making ${method} request to: ${fullUrl}`);

      // Execute the request
      const response = await axios(axiosConfig);
      const duration = Date.now() - startTime;

      // Log performance metrics
      this.logger.logApiCall(url, method, duration, response.status, {
        url: fullUrl,
        dataSize:
          request && typeof request === 'object' && 'body' in request
            ? JSON.stringify(request.body).length
            : 0,
        responseSize: response.data ? JSON.stringify(response.data).length : 0
      });

      this.logger.logNormal(`Request successful: ${response.status} ${response.statusText}`);

      // Log performance warnings for slow requests
      if (duration > 5000) {
        // 5 seconds
        this.logger.logPerformanceWarning(`API ${method} ${url}`, duration, 5000, {
          url: fullUrl,
          statusCode: response.status
        });
      }

      // Return the response data
      return response.data as ResponseForUrl<T>;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Build the full URL for error logging
      const fullUrl = this.buildFullUrl(url, request);

      // Handle axios errors and convert to our error types
      // Check if this is an axios error by looking for axios-specific properties
      if (
        error &&
        typeof error === 'object' &&
        'isAxiosError' in error &&
        error.isAxiosError === true
      ) {
        const axiosError = error as any;
        const statusCode = axiosError.response?.status || 0;
        const responseData = axiosError.response?.data;
        const requestId = this.generateRequestId();

        // Log performance metrics for failed requests
        this.logger.logApiCall(url, method, duration, statusCode, {
          url: fullUrl,
          error: axiosError.message,
          dataSize:
            request && typeof request === 'object' && 'body' in request
              ? JSON.stringify(request.body).length
              : 0
        });

        this.logger.logError(`Request failed: ${statusCode} - ${axiosError.message}`);

        // Log performance warnings for slow failed requests
        if (duration > 5000) {
          // 5 seconds
          this.logger.logPerformanceWarning(`API ${method} ${url}`, duration, 5000, {
            url: fullUrl,
            statusCode
          });
        }

        // Use ErrorFactory to create appropriate error types
        throw createErrorFromResponse(statusCode, responseData, requestId, {
          url,
          method,
          request,
          originalError: axiosError.message
        });
      }

      // Handle other types of errors
      this.logger.logVerbose(
        `Request failed with unexpected error: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Validate that an endpoint can be called via REST API
   * Throws an error for WebSocket-only endpoints
   */
  private validateRestEndpoint(url: Endpoint['url']): void {
    // List of WebSocket-only endpoints that cannot be called via REST
    const wsOnlyEndpoints = [
      'authorize',
      'md/subscribeQuote',
      'md/unsubscribeQuote',
      'md/subscribeDOM',
      'md/unsubscribeDOM',
      'md/subscribeHistogram',
      'md/unsubscribeHistogram',
      'md/getChart',
      'md/cancelChart'
    ];

    if (wsOnlyEndpoints.includes(url)) {
      throw new ConfigError(
        `Endpoint '${url}' is WebSocket-only and cannot be called via REST API. Use the WebSocket connection instead.`,
        {
          context: { client: 'RestApi', expectedClient: 'Socket | MultiplexSocket', endpoint: url }
        }
      );
    }
  }

  async simpleHealthCheck(): Promise<boolean> {
    const response = await axios.get(this.config.baseUrl.slice(0, -3));
    if (response.status === 200) {
      return true;
    }
    return false;
  }

  /**
   * Build the full URL including query parameters
   */
  private buildFullUrl<T extends Endpoint['url']>(url: T, request: RequestForUrl<T>): string {
    let fullUrl = `${this.config.baseUrl}/${url}`;

    // Handle query parameters for GET requests
    if (request && typeof request === 'object' && 'query' in request && request.query) {
      const separator = fullUrl.includes('?') ? '&' : '?';
      fullUrl += `${separator}${request.query}`;
    }

    return fullUrl;
  }

  /**
   * Build request headers including authentication
   */
  private buildHeaders(url: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'TradeAPI-SDK-TypeScript/1.0.0'
    };

    // Special case: auth/accesstokenrequest requires no authorization header
    if (url === 'auth/accesstokenrequest' || url === this.config.baseUrl.slice(0, -3)) {
      return headers;
    }

    // All other requests require Bearer token authentication
    if (this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    return headers;
  }

  /**
   * Generate a unique request ID for error tracking
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
   * Get the raw cache data (backward compatibility)
   */
  getCache(): Record<string, CachedEntity[]> {
    return this.cacheManager.getCache();
  }

  /**
   * Update the access token (called after renewal)
   */
  updateAccessToken(newToken: string): void {
    this.config.accessToken = newToken;

    this.logger.logNormal('Access token updated', {
      type: 'token_updated',
      tokenLength: newToken.length
    });
  }
}
