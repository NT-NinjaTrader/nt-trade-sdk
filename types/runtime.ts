import type { WinstonLogger } from '../sdks';
import type { EntityName, PluralEntityName } from './common';

/**
 * Runtime-safe types to replace 'any' declarations
 */

// Logger type
export type LoggerType = WinstonLogger;

// Entity types for caching - these are the actual interface types, not the string literals
export type CachedEntity =
  | import('../api/types').Account
  | import('../api/types').Position
  | import('../api/types').Order
  | import('../api/types').Contract
  | import('../api/types').Product
  | import('../api/types').Exchange
  | import('../api/types').Currency
  | import('../api/types').Country
  | import('../api/types').Alert
  | import('../api/types').AlertSignal
  | import('../api/types').CashBalance
  | import('../api/types').Fill
  | import('../api/types').ExecutionReport
  | import('../api/types').TradingPermission
  | import('../api/types').MarketDataSubscription
  | import('../api/types').FundTransaction
  | import('../api/types').Chat
  | import('../api/types').ChatMessage
  | import('../api/types').OrderStrategy
  | import('../api/types').User;

// Cache entry with proper typing
export interface TypedCacheEntry {
  entity: CachedEntity;
  entityType: EntityName;
  lastUpdated: number;
  source: 'sync' | 'realtime' | 'response';
  accessCount: number;
}

// Cache lookup result with proper typing
export interface TypedCacheLookupResult {
  found: boolean;
  data?: CachedEntity | CachedEntity[];
  source: 'cache' | 'api';
  cacheHit?: boolean;
  entityType?: EntityName;
}

// Request types for cache operations
export interface CacheRequest {
  query?: string;
  body?: Record<string, unknown>;
  [key: string]: unknown;
}

// Response types for cache operations
export type CacheResponse = CachedEntity | CachedEntity[] | Record<string, unknown>;

// Rate limiter check result
export interface RateLimitCheckResult {
  allowed: boolean;
  tokensRemaining: number;
  retryAfter?: number;
  endpoint: string;
  reason?: string;
  [key: string]: unknown;
}

// Socket message types
export type SocketMessageData =
  | { success: boolean; message?: string }
  | CachedEntity
  | CachedEntity[]
  | Record<string, unknown>
  | null;

// Event data types
export type EventDataType =
  | CachedEntity
  | CachedEntity[]
  | Record<string, unknown>
  | string
  | number
  | boolean;

// Test mock types
export type MockData =
  | CachedEntity
  | CachedEntity[]
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null;

// Test event types
export type TestEventData =
  | CachedEntity
  | CachedEntity[]
  | Record<string, unknown>
  | Error
  | { code: number; reason: string };

// Test config types
export type TestConfig = Record<string, unknown>;

// Generic unknown types for flexible but safe typing
export type UnknownRecord = Record<string, unknown>;
export type UnknownArray = unknown[];
export type UnknownValue = unknown;

// Function types
export type GenericFunction = (...args: unknown[]) => unknown;
export type EventHandler = (data: unknown) => void;
export type MessageHandler = (message: unknown) => void;

// Promise types
export type PromiseResolve<T> = (value: T) => void;
export type PromiseReject = (reason: unknown) => void;

// Timeout types
export type TimeoutHandler = ReturnType<typeof setTimeout>;
export type TimeoutReject = (reason: unknown) => void;

// WebSocket types
export type WebSocketMessage = {
  data: string | Buffer | ArrayBuffer | Buffer[];
  type: string;
  [key: string]: unknown;
};

// API request/response types
export type ApiRequest = {
  query?: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  [key: string]: unknown;
};

export type ApiResponse = {
  data?: unknown;
  status?: number;
  message?: string;
  [key: string]: unknown;
};

// Market data types
export type MarketDataRequest = {
  symbol: string;
  exchange?: string;
  interval?: string;
  startTime?: string;
  endTime?: string;
  count?: number;
  depth?: number;
  [key: string]: unknown;
};

export type MarketDataResponse = {
  success: boolean;
  data?: unknown;
  message?: string;
  [key: string]: unknown;
};

// Health check types
export type HealthCheckResult = {
  healthy: boolean;
  details?: Record<string, unknown>;
  timestamp: number;
  [key: string]: unknown;
};

// Configuration types
export type ConfigValue = string | number | boolean | Record<string, unknown> | unknown[];

export type ConfigObject = Record<string, ConfigValue>;

// Error context types
export type ErrorContext = Record<string, unknown>;

// Validation types
export type ValidationResult = {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
  [key: string]: unknown;
};

// Cache configuration types
export type CacheConfigValue = number | boolean | Record<string, number> | string;

export type TypedCacheConfig = Record<string, CacheConfigValue>;

// Logger configuration types
export type LoggerConfigValue = string | boolean | number | Record<string, unknown>;

export type TypedLoggerConfig = Record<string, LoggerConfigValue>;

// Specific entity type mappings for better type safety
export type EntityTypeMap = {
  // Core trading entities
  account: import('../api/types').Account;
  accountRiskStatus: import('../api/types').AccountRiskStatus;
  position: import('../api/types').Position;
  positionLog: import('../api/types').PositionLog;
  order: import('../api/types').Order;
  orderVersion: import('../api/types').OrderVersion;
  orderStrategy: import('../api/types').OrderStrategy;
  orderStrategyLink: import('../api/types').OrderStrategyLink;
  orderStrategyType: import('../api/types').OrderStrategyType;
  orderStrategyStatusResponse: import('../api/types').OrderStrategyStatusResponse;

  // Market data and contracts
  contract: import('../api/types').Contract;
  contractGroup: import('../api/types').ContractGroup;
  contractMargin: import('../api/types').ContractMargin;
  contractMaturity: import('../api/types').ContractMaturity;
  product: import('../api/types').Product;
  productDetails: import('../api/types').ProductDetails;
  productExtended: import('../api/types').ProductExtended;
  productFeeParams: import('../api/types').ProductFeeParams;
  productMargin: import('../api/types').ProductMargin;
  productSession: import('../api/types').ProductSession;
  productList: import('../api/types').ProductList;
  products: import('../api/types').Products;

  // Exchange and currency
  exchange: import('../api/types').Exchange;
  currency: import('../api/types').Currency;
  currencyRate: import('../api/types').CurrencyRate;
  country: import('../api/types').Country;
  countryIsBanned: import('../api/types').CountryIsBanned;
  countryIsBannedResponse: import('../api/types').CountryIsBannedResponse;

  // Trading and execution
  fill: import('../api/types').Fill;
  fillFee: import('../api/types').FillFee;
  fillPair: import('../api/types').FillPair;
  executionReport: import('../api/types').ExecutionReport;
  tradingPermission: import('../api/types').TradingPermission;
  tradingPermissionConsent: import('../api/types').TradingPermissionConsent;
  tradingPermissionResponse: import('../api/types').TradingPermissionResponse;
  tradingPermissionsResponse: import('../api/types').TradingPermissionsResponse;

  // Market data subscriptions
  marketDataSubscription: import('../api/types').MarketDataSubscription;
  marketDataSubscriptionPlan: import('../api/types').MarketDataSubscriptionPlan;
  marketDataSubscriptionExchangeScope: import('../api/types').MarketDataSubscriptionExchangeScope;
  marketDataSubscriptionResponse: import('../api/types').MarketDataSubscriptionResponse;

  // Financial and user management
  fundTransaction: import('../api/types').FundTransaction;
  fundTransactionResponse: import('../api/types').FundTransactionResponse;
  cashBalance: import('../api/types').CashBalance;
  cashBalanceLog: import('../api/types').CashBalanceLog;
  cashBalanceSnapshot: import('../api/types').CashBalanceSnapshot;
  marginSnapshot: import('../api/types').MarginSnapshot;

  // User and account management
  user: import('../api/types').User;
  userAccountAutoLiq: import('../api/types').UserAccountAutoLiq;
  userAccountPositionLimit: import('../api/types').UserAccountPositionLimit;
  userAccountRiskParameter: import('../api/types').UserAccountRiskParameter;
  userCertification: import('../api/types').UserCertification;
  userDevice: import('../api/types').UserDevice;
  userPlugin: import('../api/types').UserPlugin;
  userPromoCode: import('../api/types').UserPromoCode;
  userProperty: import('../api/types').UserProperty;
  userReadStatus: import('../api/types').UserReadStatus;
  userSession: import('../api/types').UserSession;
  userSessionStats: import('../api/types').UserSessionStats;
  userSignedDocument: import('../api/types').UserSignedDocument;
  userStatusMessage: import('../api/types').UserStatusMessage;

  // Alerts and notifications
  alert: import('../api/types').Alert;
  alertResponse: import('../api/types').AlertResponse;
  alertSignal: import('../api/types').AlertSignal;
  adminAlert: import('../api/types').AdminAlert;
  adminAlertSignal: import('../api/types').AdminAlertSignal;
  // Note: OtherEnvAdminAlertSignal interface doesn't exist in api/types.ts
  // Using a generic type for now
  OtherEnvAdminAlertSignal: Record<string, unknown>;

  // Communication
  chatMessage: import('../api/types').ChatMessage;
  chatMessageResponse: import('../api/types').ChatMessageResponse;

  // Commands and reports
  command: import('../api/types').Command;
  commandReport: import('../api/types').CommandReport;

  // Tradovate subscriptions
  tradovateSubscription: import('../api/types').TradovateSubscription;
  tradovateSubscriptionPlan: import('../api/types').TradovateSubscriptionPlan;
};

// Type-safe entity lookup
export type EntityForType<T extends EntityName> = EntityTypeMap[T];

// Cache entries with proper typing
export type TypedCacheEntries = {
  [K in PluralEntityName]: TypedCacheEntry[];
};

// Index types for O(1) lookups
export type TypedIndexes = {
  byId: Map<string, TypedCacheEntry>;
  byName: Map<string, TypedCacheEntry[]>;
  byAccount: Map<number, TypedCacheEntry[]>;
};

// Helper types for entity property access
export type EntityWithId = { id: number | string };
export type EntityWithName = { name: string };
export type EntityWithAccountId = { accountId: number };
