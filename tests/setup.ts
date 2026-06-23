/**
 * Test setup and configuration for TradeAPI SDK
 * Provides mocks, utilities, and global test configuration
 */

import { afterEach, beforeEach, vi } from 'vitest';
import { createConfigFromEnv } from '../sdks/configLoader';

// Mock WebSocket for browser environment
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.OPEN;
  url = 'ws://localhost:8080';
  protocol = '';
  extensions = '';
  bufferedAmount = 0;
  binaryType: 'blob' | 'arraybuffer' = 'blob';

  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  send = vi.fn();
  close = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  dispatchEvent = vi.fn();
  on = vi.fn();
  off = vi.fn();
  emit = vi.fn();
}

global.WebSocket = MockWebSocket as any;

// Mock fetch for REST API tests
global.fetch = vi.fn() as any;

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  info: vi.fn()
};

// Mock setTimeout and clearTimeout for better test control
const originalSetTimeout = global.setTimeout;
global.setTimeout = vi.fn((callback: Function, delay: number) => {
  const id = Math.random();
  originalSetTimeout(() => callback(), delay);
  return id as any;
}) as any;

global.clearTimeout = vi.fn() as any;

// Mock setInterval and clearInterval
const originalSetInterval = global.setInterval;
global.setInterval = vi.fn((callback: Function, delay: number) => {
  const id = Math.random();
  originalSetInterval(() => callback(), delay);
  return id as any;
}) as any;

global.clearInterval = vi.fn() as any;

// Test utilities
export const createMockLogger = () => ({
  log: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  logMinimal: vi.fn(),
  logNormal: vi.fn(),
  logVerbose: vi.fn(),
  logDebug: vi.fn(),
  stage: 'test' as const,
  verbose: true
});

export const createMockWinstonLogger = () =>
  ({
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    logMinimal: vi.fn(),
    logNormal: vi.fn(),
    logVerbose: vi.fn(),
    logDebug: vi.fn(),
    logHealth: vi.fn(),
    logHealthConsolidated: vi.fn(),
    logPerformance: vi.fn(),
    logPerformanceWarning: vi.fn(),
    logPerformanceAlert: vi.fn(),
    logMemoryUsage: vi.fn(),
    logConnection: vi.fn(),
    logBatchOperation: vi.fn(),
    logApiCall: vi.fn(),
    logWebSocketMessage: vi.fn(),
    logCacheOperation: vi.fn(),
    logQueueOperation: vi.fn(),
    logThroughput: vi.fn(),
    logRateLimit: vi.fn(),
    stage: 'test' as const,
    verbose: true,
    logger: {
      log: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn()
    },
    config: {
      stage: 'test',
      level: 'debug',
      logVerbosity: 'debug'
    },
    createLogger: vi.fn(),
    getConsoleFormat: vi.fn(),
    getFileFormat: vi.fn(),
    getDetailedFormat: vi.fn(),
    getJsonFormat: vi.fn(),
    shouldLog: vi.fn(),
    logTrade: vi.fn(),
    logError: vi.fn(),
    setLevel: vi.fn(),
    addTransport: vi.fn(),
    removeTransport: vi.fn(),
    getWinstonLogger: vi.fn(),
    close: vi.fn()
  }) as any; // Cast to any to allow assignment to WinstonLogger

export const createMockLoggerType = () =>
  ({
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    logMinimal: vi.fn(),
    logNormal: vi.fn(),
    logVerbose: vi.fn(),
    logDebug: vi.fn(),
    stage: 'test' as const,
    verbose: true,
    logTrade: vi.fn(),
    logConnection: vi.fn(),
    logHealth: vi.fn(),
    logRateLimit: vi.fn(),
    logError: vi.fn(),
    logPerformance: vi.fn(),
    logPerformanceWarning: vi.fn(),
    logMemoryUsage: vi.fn(),
    setLevel: vi.fn(),
    addTransport: vi.fn(),
    removeTransport: vi.fn(),
    getWinstonLogger: vi.fn(),
    close: vi.fn()
  }) as const;

export const createSimpleMockLogger = () =>
  ({
    log: vi.fn(),
    stage: 'test' as const,
    verbose: true,
    logCacheOperation: vi.fn(),
    logPerformance: vi.fn(),
    logPerformanceWarning: vi.fn(),
    logPerformanceAlert: vi.fn(),
    logThroughput: vi.fn(),
    logRateLimit: vi.fn(),
    logMemoryUsage: vi.fn(),
    logTrade: vi.fn(),
    logConnection: vi.fn(),
    logHealth: vi.fn(),
    logError: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    logMinimal: vi.fn(),
    logNormal: vi.fn(),
    logVerbose: vi.fn(),
    logDebug: vi.fn(),
    setLevel: vi.fn(),
    addTransport: vi.fn(),
    removeTransport: vi.fn(),
    getWinstonLogger: vi.fn(),
    close: vi.fn()
  }) as const;

export const createMockWebSocket = () => ({
  readyState: 1,
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn()
});

export const createMockResponse = (data: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  json: vi.fn().mockResolvedValue(data),
  text: vi.fn().mockResolvedValue(JSON.stringify(data)),
  headers: new Map(),
  clone: vi.fn()
});

export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create test environment variables
export const createTestEnv = (overrides: Record<string, string> = {}) => ({
  // Required credentials
  TRADE_SDK_USERNAME: 'test-user',
  TRADE_SDK_PASSWORD: 'test-password',
  TRADE_SDK_APP_ID: 'test-app',
  TRADE_SDK_APP_VERSION: '1.0.0',
  TRADE_SDK_CLIENT_ID: '12345',
  TRADE_SDK_SEC: 'test-sec',

  // Required stage
  TRADE_SDK_STAGE: 'devel',

  // Optional configurations
  TRADE_SDK_LOGGER_TYPE: 'winston',
  TRADE_SDK_LOGGER_LEVEL: 'debug',

  TRADE_SDK_ENABLE_MD_SOCKET: 'false',
  TRADE_SDK_USE_REPLAY_SOCKET: 'false',
  TRADE_SDK_SOCKET_ENABLE_MULTIPLEXING: 'false',
  TRADE_SDK_SOCKET_SYNC_IMMEDIATE: 'true',
  TRADE_SDK_SOCKET_FULL_ORG_SNAPSHOT: 'false',
  TRADE_SDK_LIVE_CLIENT: 'socket',
  TRADE_SDK_SIM_CLIENT: 'socket',
  TRADE_SDK_SOCKET_CONNECTION_TIMEOUT: '10000',
  TRADE_SDK_SOCKET_SHARDING_DIVISOR: '4',
  TRADE_SDK_SOCKET_SHARDING_EXPRESSION_TYPE: 'modUserId',
  TRADE_SDK_SOCKET_ENTITY_TYPES: '["account", "position", "order", "fill"]',

  // Rate limiting
  TRADE_SDK_RATE_LIMIT_GLOBAL_RPS: '10',
  TRADE_SDK_RATE_LIMIT_GLOBAL_RPM: '500',
  TRADE_SDK_RATE_LIMIT_GLOBAL_RPH: '10000',
  TRADE_SDK_RATE_LIMIT_BURST_MULTIPLIER: '2',
  TRADE_SDK_RATE_LIMIT_ENABLE_MONITORING: 'true',
  TRADE_SDK_RATE_LIMIT_LOG_VIOLATIONS: 'true',

  // Message queue
  TRADE_SDK_MQ_MAX_RETRIES: '3',
  TRADE_SDK_MQ_RETRY_DELAY: '1000',
  TRADE_SDK_MQ_ENABLE_PRIORITY: 'true',
  TRADE_SDK_MQ_ENABLE_RETRIES: 'true',
  TRADE_SDK_MESSAGE_QUEUE_CATEGORIES: '["system", "trading", "account", "market-data"]',

  ...overrides
});

// Create test configuration using the actual SDK config loader
export const createTestConfig = (overrides: Record<string, string> = {}) => {
  const testEnv = createTestEnv(overrides);
  return createConfigFromEnv(testEnv);
};

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
});

// Global test timeout
beforeEach(() => {
  vi.setConfig({ testTimeout: 10000 });
});
