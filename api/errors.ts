/**
 * SDK Error System
 *
 * Core types:
 * - SdkError: Base class for all SDK errors
 * - AuthError: Authentication/authorization failures (401, 403)
 * - NetworkError: Connection issues, timeouts, WebSocket failures
 * - ValidationError: Bad input, invalid parameters (400s)
 * - RateLimitError: Rate limiting (429)
 * - ServerError: Server-side failures (500s)
 * - ConfigError: Configuration/setup issues
 */

export enum ErrorCode {
  AUTH_FAILED = 'AUTH_001',
  AUTH_DENIED = 'AUTH_002',
  TOKEN_EXPIRED = 'AUTH_003',
  NETWORK_FAILED = 'NET_001',
  TIMEOUT = 'NET_002',
  WEBSOCKET_FAILED = 'NET_003',
  RECONNECT_FAILED = 'NET_004',
  INVALID_INPUT = 'VAL_001',
  INVALID_CONFIG = 'VAL_002',
  RATE_LIMITED = 'RATE_001',
  SERVER_ERROR = 'SRV_001',
  SERVICE_UNAVAILABLE = 'SRV_002',
  UNKNOWN = 'UNK_001'
}

export interface ErrorOptions {
  statusCode?: number;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
  context?: Record<string, unknown>;
  cause?: Error;
}

/**
 * Base class for all SDK errors
 */
export class SdkError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly retryable: boolean;
  readonly retryAfter?: number;
  readonly requestId?: string;
  readonly context?: Record<string, unknown>;
  readonly timestamp: Date;

  constructor(message: string, code: string = ErrorCode.UNKNOWN, options: ErrorOptions = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = options.statusCode ?? 0;
    this.retryable = options.retryable ?? false;
    this.retryAfter = options.retryAfter;
    this.requestId = options.requestId;
    this.context = options.context;
    this.timestamp = new Date();
    if (options.cause) this.cause = options.cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  shouldRetry(): boolean {
    return this.retryable;
  }

  getRetryDelay(): number {
    return this.retryable ? (this.retryAfter ?? 1000) : 0;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      retryable: this.retryable,
      retryAfter: this.retryAfter,
      requestId: this.requestId,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }
}

/** Authentication/Authorization errors (401, 403) */
export class AuthError extends SdkError {
  constructor(message = 'Authentication failed', options: ErrorOptions = {}) {
    super(message, ErrorCode.AUTH_FAILED, { statusCode: 401, retryable: false, ...options });
  }
}

/** Network/Connection errors */
export class NetworkError extends SdkError {
  constructor(message = 'Network request failed', options: ErrorOptions = {}) {
    super(message, ErrorCode.NETWORK_FAILED, {
      statusCode: 0,
      retryable: true,
      retryAfter: 5000,
      ...options
    });
  }
}

/** Validation/Input errors (400s) */
export class ValidationError extends SdkError {
  constructor(message = 'Invalid request', options: ErrorOptions = {}) {
    super(message, ErrorCode.INVALID_INPUT, { statusCode: 400, retryable: false, ...options });
  }
}

/** Rate limiting errors (429) */
export class RateLimitError extends SdkError {
  constructor(message = 'Rate limit exceeded', options: ErrorOptions = {}) {
    super(message, ErrorCode.RATE_LIMITED, {
      statusCode: 429,
      retryable: true,
      retryAfter: options.retryAfter ?? 60000,
      ...options
    });
  }
}

/** Server errors (500s) */
export class ServerError extends SdkError {
  constructor(message = 'Server error', options: ErrorOptions = {}) {
    super(message, ErrorCode.SERVER_ERROR, {
      statusCode: 500,
      retryable: true,
      retryAfter: 30000,
      ...options
    });
  }
}

/** Configuration errors */
export class ConfigError extends SdkError {
  constructor(message = 'Configuration error', options: ErrorOptions = {}) {
    super(message, ErrorCode.INVALID_CONFIG, { statusCode: 0, retryable: false, ...options });
  }
}

/** Create error from HTTP response */
export function createErrorFromResponse(
  statusCode: number,
  responseData: { message?: string; retry_after?: number } | null,
  requestId?: string,
  context?: Record<string, unknown>
): SdkError {
  const message = responseData?.message ?? 'Request failed';
  const opts: ErrorOptions = { statusCode, requestId, context };

  if (statusCode === 401 || statusCode === 403) return new AuthError(message, opts);
  if (statusCode === 429)
    return new RateLimitError(message, { ...opts, retryAfter: responseData?.retry_after ?? 60000 });
  if (statusCode >= 400 && statusCode < 500) return new ValidationError(message, opts);
  if (statusCode >= 500) return new ServerError(message, opts);
  return new NetworkError(message, opts);
}

/** Error type checking utilities */
export const ErrorUtils = {
  isRetryable: (error: Error): boolean => error instanceof SdkError && error.retryable,
  getRetryDelay: (error: Error): number => (error instanceof SdkError ? error.getRetryDelay() : 0),
  isAuthError: (error: Error): boolean => error instanceof AuthError,
  isNetworkError: (error: Error): boolean => error instanceof NetworkError,
  isRateLimitError: (error: Error): boolean => error instanceof RateLimitError,
  isValidationError: (error: Error): boolean => error instanceof ValidationError,
  isServerError: (error: Error): boolean => error instanceof ServerError,
  isConfigError: (error: Error): boolean => error instanceof ConfigError,
  format: (error: Error): string =>
    error instanceof SdkError
      ? `${error.name} [${error.code}]: ${error.message}`
      : `${error.name}: ${error.message}`
};
