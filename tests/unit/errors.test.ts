/**
 * Unit tests for simplified error handling system
 */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  AuthError,
  ConfigError,
  createErrorFromResponse,
  ErrorCode,
  ErrorUtils,
  NetworkError,
  RateLimitError,
  SdkError,
  ServerError,
  ValidationError
} from '../../api/errors';

describe('Error Handling System', () => {
  describe('ErrorCode Enum', () => {
    it('should have auth error codes', () => {
      expect(ErrorCode.AUTH_FAILED).toBe('AUTH_001');
      expect(ErrorCode.AUTH_DENIED).toBe('AUTH_002');
      expect(ErrorCode.TOKEN_EXPIRED).toBe('AUTH_003');
    });

    it('should have network error codes', () => {
      expect(ErrorCode.NETWORK_FAILED).toBe('NET_001');
      expect(ErrorCode.TIMEOUT).toBe('NET_002');
      expect(ErrorCode.WEBSOCKET_FAILED).toBe('NET_003');
    });

    it('should have validation error codes', () => {
      expect(ErrorCode.INVALID_INPUT).toBe('VAL_001');
      expect(ErrorCode.INVALID_CONFIG).toBe('VAL_002');
    });

    it('should have rate limit error codes', () => {
      expect(ErrorCode.RATE_LIMITED).toBe('RATE_001');
    });

    it('should have server error codes', () => {
      expect(ErrorCode.SERVER_ERROR).toBe('SRV_001');
      expect(ErrorCode.SERVICE_UNAVAILABLE).toBe('SRV_002');
    });
  });

  describe('SdkError Base Class', () => {
    let error: SdkError;

    beforeEach(() => {
      error = new SdkError('Test error message', ErrorCode.UNKNOWN, {
        statusCode: 500,
        retryable: true,
        retryAfter: 5000,
        context: { test: true }
      });
    });

    it('should have all required properties', () => {
      expect(error.name).toBe('SdkError');
      expect(error.code).toBe(ErrorCode.UNKNOWN);
      expect(error.message).toBe('Test error message');
      expect(error.statusCode).toBe(500);
      expect(error.retryable).toBe(true);
      expect(error.retryAfter).toBe(5000);
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.context).toEqual({ test: true });
    });

    it('should check if retryable', () => {
      expect(error.shouldRetry()).toBe(true);

      const nonRetryable = new SdkError('Test', ErrorCode.UNKNOWN, { retryable: false });
      expect(nonRetryable.shouldRetry()).toBe(false);
    });

    it('should get retry delay', () => {
      expect(error.getRetryDelay()).toBe(5000);

      const nonRetryable = new SdkError('Test', ErrorCode.UNKNOWN, { retryable: false });
      expect(nonRetryable.getRetryDelay()).toBe(0);
    });

    it('should serialize to JSON', () => {
      const json = error.toJSON();
      expect(json.name).toBe('SdkError');
      expect(json.code).toBe(ErrorCode.UNKNOWN);
      expect(json.message).toBe('Test error message');
      expect(json.statusCode).toBe(500);
      expect(json.retryable).toBe(true);
      expect(json.retryAfter).toBe(5000);
      expect(json.timestamp).toBeDefined();
    });
  });

  describe('AuthError', () => {
    let authError: AuthError;

    beforeEach(() => {
      authError = new AuthError('Invalid credentials');
    });

    it('should have correct properties', () => {
      expect(authError.code).toBe(ErrorCode.AUTH_FAILED);
      expect(authError.statusCode).toBe(401);
      expect(authError.retryable).toBe(false);
    });

    it('should be instanceof AuthError and SdkError', () => {
      expect(authError).toBeInstanceOf(AuthError);
      expect(authError).toBeInstanceOf(SdkError);
    });
  });

  describe('NetworkError', () => {
    let networkError: NetworkError;

    beforeEach(() => {
      networkError = new NetworkError('Connection failed');
    });

    it('should have correct properties', () => {
      expect(networkError.code).toBe(ErrorCode.NETWORK_FAILED);
      expect(networkError.retryable).toBe(true);
      expect(networkError.retryAfter).toBe(5000);
    });

    it('should be retryable by default', () => {
      expect(networkError.shouldRetry()).toBe(true);
      expect(networkError.getRetryDelay()).toBe(5000);
    });
  });

  describe('ValidationError', () => {
    let validationError: ValidationError;

    beforeEach(() => {
      validationError = new ValidationError('Invalid input');
    });

    it('should have correct properties', () => {
      expect(validationError.code).toBe(ErrorCode.INVALID_INPUT);
      expect(validationError.statusCode).toBe(400);
      expect(validationError.retryable).toBe(false);
    });
  });

  describe('RateLimitError', () => {
    let rateLimitError: RateLimitError;

    beforeEach(() => {
      rateLimitError = new RateLimitError('Rate limit exceeded', { retryAfter: 30000 });
    });

    it('should have correct properties', () => {
      expect(rateLimitError.code).toBe(ErrorCode.RATE_LIMITED);
      expect(rateLimitError.statusCode).toBe(429);
      expect(rateLimitError.retryable).toBe(true);
      expect(rateLimitError.retryAfter).toBe(30000);
    });

    it('should default to 60s retry', () => {
      const defaultError = new RateLimitError('Rate limit');
      expect(defaultError.retryAfter).toBe(60000);
    });
  });

  describe('ServerError', () => {
    let serverError: ServerError;

    beforeEach(() => {
      serverError = new ServerError('Internal server error');
    });

    it('should have correct properties', () => {
      expect(serverError.code).toBe(ErrorCode.SERVER_ERROR);
      expect(serverError.statusCode).toBe(500);
      expect(serverError.retryable).toBe(true);
      expect(serverError.retryAfter).toBe(30000);
    });
  });

  describe('ConfigError', () => {
    let configError: ConfigError;

    beforeEach(() => {
      configError = new ConfigError('Missing configuration');
    });

    it('should have correct properties', () => {
      expect(configError.code).toBe(ErrorCode.INVALID_CONFIG);
      expect(configError.retryable).toBe(false);
    });
  });

  describe('createErrorFromResponse', () => {
    it('should create auth error for 401', () => {
      const error = createErrorFromResponse(401, { message: 'Unauthorized' }, 'req_123');
      expect(error).toBeInstanceOf(AuthError);
      expect(error.statusCode).toBe(401);
    });

    it('should create auth error for 403', () => {
      const error = createErrorFromResponse(403, { message: 'Forbidden' }, 'req_123');
      expect(error).toBeInstanceOf(AuthError);
      expect(error.statusCode).toBe(403);
    });

    it('should create rate limit error for 429', () => {
      const error = createErrorFromResponse(
        429,
        { message: 'Too many requests', retry_after: 30000 },
        'req_123'
      );
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.retryAfter).toBe(30000);
    });

    it('should create validation error for 4xx', () => {
      const error = createErrorFromResponse(400, { message: 'Bad request' }, 'req_123');
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should create server error for 5xx', () => {
      const error = createErrorFromResponse(500, { message: 'Server error' }, 'req_123');
      expect(error).toBeInstanceOf(ServerError);
    });

    it('should create network error for unknown status', () => {
      const error = createErrorFromResponse(0, null, 'req_123');
      expect(error).toBeInstanceOf(NetworkError);
    });
  });

  describe('ErrorUtils', () => {
    it('should identify retryable errors', () => {
      const retryable = new NetworkError('Test');
      const nonRetryable = new AuthError('Test');

      expect(ErrorUtils.isRetryable(retryable)).toBe(true);
      expect(ErrorUtils.isRetryable(nonRetryable)).toBe(false);
    });

    it('should get retry delay', () => {
      const networkError = new NetworkError('Test');
      expect(ErrorUtils.getRetryDelay(networkError)).toBe(5000);
    });

    it('should identify auth errors', () => {
      const authError = new AuthError('Test');
      const networkError = new NetworkError('Test');

      expect(ErrorUtils.isAuthError(authError)).toBe(true);
      expect(ErrorUtils.isAuthError(networkError)).toBe(false);
    });

    it('should identify network errors', () => {
      const networkError = new NetworkError('Test');
      const authError = new AuthError('Test');

      expect(ErrorUtils.isNetworkError(networkError)).toBe(true);
      expect(ErrorUtils.isNetworkError(authError)).toBe(false);
    });

    it('should identify rate limit errors', () => {
      const rateLimitError = new RateLimitError('Test');
      const authError = new AuthError('Test');

      expect(ErrorUtils.isRateLimitError(rateLimitError)).toBe(true);
      expect(ErrorUtils.isRateLimitError(authError)).toBe(false);
    });

    it('should format errors for logging', () => {
      const authError = new AuthError('Test auth error');
      const formatted = ErrorUtils.format(authError);

      expect(formatted).toContain('AuthError');
      expect(formatted).toContain('AUTH_001');
      expect(formatted).toContain('Test auth error');
    });
  });
});
