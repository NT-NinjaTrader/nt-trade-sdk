# TradeAPI SDK - Complete API Reference

This document provides comprehensive API reference for the TradeAPI SDK TypeScript library.

## Table of Contents

- [PartnerSdk Class](#partnersdk-class)
- [ApiClient Class](#apiclient-class)
- [MdApiClient Class](#mdapiclient-class)
- [Configuration](#configuration)
  - [Configuration Interfaces](#configuration-interfaces)
  - [Preset Configuration System](#preset-configuration-system)
  - [Configuration Helpers](#configuration-helpers)
- [Error System](#error-system)
- [Event Types](#event-types)
- [Utility Functions](#utility-functions)
  - [Configuration Utilities](#configuration-utilities)
  - [Authentication](#authentication)
  - [Maintenance Utilities](#maintenance-utilities)
  - [OpenPLCalculator](#openplcalculator)
- [Constants](#constants)
- [Type Definitions](#type-definitions)

## PartnerSdk Class

The main SDK class that provides a unified interface for connecting to and interacting with the
TradeAPI service.

### Public Properties

#### `live`

API client for live trading operations.

**Type:** `ApiClient`

**Access:** Read-only

**Example:**

```typescript
const accounts = await sdk.live.account.list();
```

#### `sim`

API client for simulation trading operations.

**Type:** `ApiClient`

**Access:** Read-only

**Example:**

```typescript
const positions = await sdk.sim.position.list();
```

#### `md`

Market data API client (if enabled).

**Type:** `MdApiClient | undefined`

**Access:** Read-only

**Example:**

```typescript
if (sdk.md) {
  const subscription = await sdk.md.quote.subscribe({ symbol: 'ESM7' });
}
```

### Public Methods

#### `connect()`

Establishes connection to TradeAPI.

**Signature:**

```typescript
async connect(): Promise<void>
```

**Returns:** Promise that resolves when connection is established

**Throws:**

- `AuthError` - When credentials are invalid
- `NetworkError` - When network connection fails
- `ConfigError` - When configuration is invalid

**Example:**

```typescript
try {
  await sdk.connect();
  console.log('Connected to TradeAPI');
} catch (error) {
  console.error('Connection failed:', error.message);
}
```

#### `disconnect()`

Disconnects from TradeAPI and cleans up resources.

**Signature:**

```typescript
async disconnect(): Promise<void>
```

**Returns:** Promise that resolves when disconnection is complete

**Example:**

```typescript
await sdk.disconnect();
console.log('Disconnected from TradeAPI');
```

#### `getStats()`

Retrieves essential SDK statistics and health information.

**Signature:**

```typescript
getStats(): {
  connected: boolean;
  healthy: boolean;
  cacheHitRate: number;
  queueSize: number;
  stage: string;
  timestamp: number;
}
```

**Returns:** Object containing SDK statistics

**Example:**

```typescript
const stats = sdk.getStats();
console.log('Connected:', stats.connected);
console.log('Healthy:', stats.healthy);
console.log('Cache hit rate:', (stats.cacheHitRate * 100).toFixed(1) + '%');
```

#### `on()`, `once()`, `off()`

Event listener methods for monitoring SDK state.

**Signature:**

```typescript
on(event: string, listener: (...args: any[]) => void): PartnerSdk
once(event: string, listener: (...args: any[]) => void): PartnerSdk
off(event: string, listener: (...args: any[]) => void): PartnerSdk
```

**Example:**

```typescript
sdk.on('connection', (event) => {
  console.log('Connection event:', event.type);
});
```

## ApiClient Class

The ApiClient provides type-safe access to all TradeAPI endpoints. It automatically chooses between
WebSocket and REST API based on configuration and endpoint type.

### Account Methods

Access account information and management operations.

**Common Methods:**

- `list()` - Get all accounts
- `item(id)` - Get specific account  
- `items(ids)` - Get multiple accounts
- `find(criteria)` - Search accounts
- `suggest(text)` - Get account suggestions
- `deps(id)` - Get account dependencies
- `ldeps(ids)` - Get list dependencies

**Special Methods:**

- `resetDemoAccountState` - Reset demo account(s) to initial state with specified trade date *(admin only)*

**Examples:**

```typescript
// List all accounts
const accounts = await sdk.live.account.list();

// Get specific account
const account = await sdk.live.account.item({ query: { id: 123 } });

// Find accounts by name
const demoAccounts = await sdk.live.account.find({
  body: { name: 'Demo' }
});

// Reset demo accounts to specific trade date (admin only)
await sdk.sim.account.resetDemoAccountState({
  body: {
    accountIds: [123, 456],
    resetTradeDate: { year: 2024, month: 1, day: 15 }
  }
});
```

### Order Methods

Place, modify, and manage trading orders.

**Common Methods:**

- `list()` - Get all orders
- `item(id)` - Get specific order
- `items(ids)` - Get multiple orders
- `deps(id)` - Get order dependencies
- `ldeps(ids)` - Get list dependencies

**Order Operations:**

- `placeOrder(params)` - Place a new order
- `modifyOrder(orderId, params)` - Modify existing order
- `cancelOrder(orderId)` - Cancel an order

**Advanced Order Types:**

- `placeOCO(params)` - Place One-Cancels-Other order
- `placeOSO(params)` - Place One-Sends-Other order

**Position Management:**

- `liquidatePosition` - Close a specific position
- `liquidatePositions` - Close multiple positions

**Validation:**

- `dryRun` - Validate order without placing

**Examples:**

```typescript
// Place a market order
const order = await sdk.live.order.placeOrder({
  body: {
    symbol: 'ESM7',
    orderQty: 1,
    action: 'Buy',
    orderType: 'Market'
  }
});

// Modify order price
await sdk.live.order.modifyOrder({
  body: {
    orderId: 123,
    orderQty: 1,
    orderType: 'Limit',
    price: 4500.5
  }
});

// Cancel order
await sdk.live.order.cancelOrder({ body: { orderId: 123 } });

// Liquidate single position
await sdk.live.order.liquidatePosition({
  body: { accountId: 123, contractId: 456, admin: false }
});

// Liquidate multiple positions
await sdk.live.order.liquidatePositions({
  body: { positions: [789, 790], admin: false }
});

// Dry run to validate order
const validation = await sdk.live.order.dryRun({
  body: {
    symbol: 'ESM7',
    orderQty: 1,
    action: 'Buy',
    orderType: 'Limit',
    price: 4500
  }
});
```

### Order Strategy Methods

Manage complex order strategies like bracket orders and multi-leg positions.

**Common Methods:**

- `list()` - Get all strategies
- `item(id)` - Get specific strategy
- `items(ids)` - Get multiple strategies
- `deps(id)` - Get strategy dependencies
- `ldeps(ids)` - Get list dependencies

**Strategy Operations:**

- `startOrderStrategy(params)` - Start a new order strategy (bracket, scaling, etc.)
- `modifyOrderStrategy(strategyId, params)` - Modify active strategy
- `interruptOrderStrategy(strategyId)` - Stop a running strategy

**Examples:**

```typescript
// Start an order strategy
const strategy = await sdk.live.orderStrategy.startOrderStrategy({
  body: {
    accountId: 123,
    symbol: 'ESM7',
    orderStrategyTypeId: 1,  // e.g., 1 = Bracket
    action: 'Buy',
    params: JSON.stringify({
      qty: 2,
      stopLoss: 4480,
      takeProfit: 4550
    })
  }
});

// Modify running strategy
await sdk.live.orderStrategy.modifyOrderStrategy({
  body: { orderStrategyId: strategy.id, command: 'Cancel' }
});

// Stop strategy execution
await sdk.live.orderStrategy.interruptOrderStrategy({
  body: { orderStrategyId: strategy.id }
});
```

### Position Methods

View and manage open positions.

**Common Methods:**

- `list()` - Get all positions
- `item(id)` - Get specific position
- `items(ids)` - Get multiple positions
- `deps(id)` - Get position dependencies
- `ldeps(ids)` - Get list dependencies

**Examples:**

```typescript
// List all positions
const positions = await sdk.live.position.list();

// Get specific position
const position = await sdk.live.position.item({ query: { id: 123 } });
```

### User Methods

Manage user accounts and permissions.

**Common Methods:**

- `list()` - Get all users
- `item(id)` - Get specific user
- `items(ids)` - Get multiple users
- `find(criteria)` - Search users
- `suggest(text)` - Get user suggestions
- `me()` - Get current user info

**Subscription Management:**

- `addMarketDataSubscription(userId, plan)` - Add market data subscription
- `addTradovateSubscription(userId, plan)` - Add platform subscription
- `cancelTradovateSubscription(subscriptionId)` - Cancel subscription

**Trading Permissions:**

- `createTradingPermission(params)` - Grant trading permission *(preferred for Prop Firms)*
- `revokeTradingPermission(permissionId)` - Revoke trading permission
- `revokeTradingPermissions(permissionIds)` - Revoke multiple permissions
- `getAccountTradingPermissions(accountId)` - Get account permissions
- `accountPermissions(accountId)` - Alias for getAccountTradingPermissions

**Special Operations:**

- `cancelEverything` - Cancel subscriptions, permissions, plugins for user(s)
- `createNewTrial` - Create new trial account *(admin only)*
- `createEvaluationUsers` - Create multiple evaluation users *(admin only)*
- `createEvaluationAccounts` - Create evaluation accounts *(Prop Firm use)*

**Note for Prop Firms:** For Prop Firm operations, much of the permission management is handled through 
`createEvaluationAccounts`. When you need to manually grant permissions, prefer using `createTradingPermission`.

**Examples:**

```typescript
// Get current user
const currentUser = await sdk.live.user.me();

// Add market data subscription
await sdk.live.user.addMarketDataSubscription({
  body: { userId: 123, planId: 456 }
});

// Grant trading permission
await sdk.live.user.createTradingPermission({
  body: { userId: 123, accountId: 456 }
});

// Cancel everything for user(s)
await sdk.live.user.cancelEverything({
  body: {
    userIds: [123, 456],
    tradovateSubscriptions: true,
    tradingPermissions: true,
    userPlugins: true,
    marketDataSubscriptions: true
  }
});

// Create new trial (admin only)
await sdk.live.user.createNewTrial({ body: {} });
```

### UserPlugin Methods

Manage user plugin entitlements and permissions.

**Common Methods:**

- `list()` - Get all user plugins
- `item(id)` - Get specific user plugin
- `items(ids)` - Get multiple user plugins
- `create(params)` - Create user plugin *(admin only)*
- `update(id, params)` - Update user plugin *(admin only)*
- `deps(id)` - Get dependencies
- `ldeps(ids)` - Get list dependencies

**Entitlement Management:**

- `addEntitlementSubscription` - Add entitlement subscription
- `cancelPluginAutorenewal` - Cancel auto-renewal
- `changePluginPermission` - Change plugin permissions
- `getEntitlementEligibilityInfo` - Check eligibility

**Examples:**

```typescript
// Add entitlement subscription
await sdk.live.userPlugin.addEntitlementSubscription({
  body: {
    entitlementId: 456,
    userId: 123,          // optional
    accountId: 789,       // optional
    creditCardId: 101,    // optional
    nonProSigned: true    // optional
  }
});

// Change plugin permissions
await sdk.live.userPlugin.changePluginPermission({
  body: {
    pluginName: 'MyPlugin',
    approval: true,
    userId: 123           // optional
  }
});

// Check eligibility
const eligibility = await sdk.live.userPlugin.getEntitlementEligibilityInfo({
  body: { entitlementId: 456 }
});
```

### Auth Methods

Authentication and token management.

**Methods:**

- `me()` - Get current authenticated user
- `oauthToken(params)` - Get OAuth token
- `renewAccessToken(refreshToken)` - Renew expired access token

**Examples:**

```typescript
const currentUser = await sdk.live.auth.me();
```

### Contract Methods

Access futures and options contract information.

**Common Methods:**

- `item(id)` - Get specific contract
- `items(ids)` - Get multiple contracts
- `find(criteria)` - Search contracts
- `suggest(text)` - Get contract suggestions
- `deps(id)` - Get dependencies
- `ldeps(ids)` - Get list dependencies

**Special Operations:**

- `getEventProducts` - Get event-based contracts
- `getOptionsChain` - Get options chain for underlying contract
- `getProductFeeParams` - Get fee parameters for product(s)
- `rollContract` - Roll expiring contract to new contract
- `rollContracts` - Roll multiple contracts

**Examples:**

```typescript
// Find ES contracts
const contracts = await sdk.live.contract.find({ body: { name: 'ES' } });

// Get options chain for contract
const chain = await sdk.live.contract.getOptionsChain({
  body: { contractId: 123 }
});

// Roll contract forward
await sdk.live.contract.rollContract({
  body: { name: 'ESM4', forward: true }
});

// Get fee parameters for products
const fees = await sdk.live.contract.getProductFeeParams({
  body: { productIds: [789, 790] }
});
```

### Product, Exchange, Currency, Country Methods

Access reference data for trading.

**Product:**

- `list()`, `item(id)`, `items(ids)`, `find(criteria)`, `deps(id)`, `ldeps(ids)`

**Markets:**

- `products()` - Get all market products

**Exchange:**

- `list()`, `item(id)`, `items(ids)`, `find(criteria)`, `suggest(text)`

**Currency:**

- `list()`, `item(id)`, `items(ids)`, `find(criteria)`, `suggest(text)`

**Country:**

- `list()`, `item(id)`, `items(ids)`, `find(criteria)`, `suggest(text)`

### Alert, AlertSignal Methods

Create and manage trading alerts.

**Alert:** *(admin only)*

- `create(params)` - Create new alert
- `deps(id)`, `item(id)`, `items(ids)`, `ldeps(ids)`, `list()`

**AlertSignal:** *(admin only)*

- Standard CRUD operations

### CashBalance, Fill, ExecutionReport Methods

Access account financial data and trade history.

**CashBalance:**

- `list()`, `item(id)`, `items(ids)`, `deps(id)`, `ldeps(ids)`
- `getCashBalanceSnapshot` - Get balance snapshot for account
- `changeDemoBalance` - Adjust demo account cash balance *(demo only)*

**Examples:**

```typescript
// List all cash balances
const balances = await sdk.live.cashBalance.list();

// Get balance snapshot for account
const snapshot = await sdk.live.cashBalance.getCashBalanceSnapshot({
  body: { accountId: 123 }
});

// Change demo balance (demo accounts only)
await sdk.sim.cashBalance.changeDemoBalance({
  body: { accountId: 123, cashChange: 5000 }
});
```

**Fill:**

- `list()`, `item(id)`, `items(ids)`, `deps(id)`, `ldeps(ids)`

**ExecutionReport:**

- `list()`, `item(id)`, `items(ids)`, `deps(id)`, `ldeps(ids)`, `find(criteria)`, `suggest(text)`

### TradingPermission Methods

Manage trading permissions.

**Methods:**

- `list()`, `item(id)`, `items(ids)`, `deps(id)`, `ldeps(ids)`

**Note for Prop Firms:** For Prop Firm operations, much of the permission management is handled through 
`user.createEvaluationAccounts`. When you need to manually grant permissions, prefer using `user.createTradingPermission`.

### MarketDataSubscription Methods

Manage market data subscriptions.

**Methods:**

- `list()`, `item(id)`, `items(ids)`, `deps(id)`, `ldeps(ids)`
- `create(params)` - Create subscription *(admin only)*
- `update(id, params)` - Update subscription *(admin only)*
- `add(userId, plan)` - Add subscription for user

### FundTransaction Methods

Manage account funding and transfers. *(admin only)*

**Common Methods:**

- `list()`, `item(id)`, `items(ids)`, `deps(id)`, `ldeps(ids)`

**Special Operations:**

- `walletTransfer` - Transfer funds between accounts
- `checkStripeFundingEligibility` - Check Stripe funding eligibility

**Examples:**

```typescript
// List all fund transactions
const transactions = await sdk.live.fundTransaction.list();

// Transfer funds between accounts
await sdk.live.fundTransaction.walletTransfer({
  body: {
    accountId: 123,
    fundAmount: 1000,
    fundCurrencyId: 1,
    fundDescription: 'Account funding',
    senderId: 456        // optional
  }
});

// Check Stripe funding eligibility
const eligibility = await sdk.live.fundTransaction.checkStripeFundingEligibility({
  body: { userId: 123 }
});
```

### Replay Methods

Market replay and simulation controls.

**Methods:**

- `changeSpeed(speed)` - Change replay speed
- `checkSession()` - Check replay session status
- `initializeClock(params)` - Initialize replay clock

**Examples:**

```typescript
// Change replay speed
await sdk.live.replay.changeSpeed({
  body: { speed: 2.0 }
});

// Initialize replay
await sdk.live.replay.initializeClock({
  body: { startDate: '2024-01-01', startTime: '09:30:00' }
});
```

### Support Methods

Support and utility operations.

**Methods:**

- `getTimestamp()` - Get server timestamp

### ContactInfo Methods

Manage user contact information.

**Common Methods:**

- `item` - Get specific contact info
- `items` - Get multiple contact info items
- `deps` - Get contact info dependencies
- `ldeps` - Get list dependencies

**Special Methods:**

- `updateContactInfo` - Update complete contact information (address, phone, etc.)

**Examples:**

```typescript
// Get contact info for a user
const contactInfo = await sdk.live.contactInfo.item({ query: { id: 123 } });

// Update complete contact information
await sdk.live.contactInfo.updateContactInfo({
  body: {
    userId: 123,
    firstName: 'John',
    lastName: 'Doe',
    streetAddress1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postCode: '10001',
    country: 'USA',
    phone: '+1-555-123-4567'
  }
});
```

### AccountRiskStatus Methods

Monitor and manage account risk parameters. *(admin operations)*

**Common Methods:**

- `list()`, `item(id)`, `items(ids)`, `deps(id)`, `ldeps(ids)`

**Risk Management:**

- `updateMaxNetLiq(accountId, maxNetLiq)` - Update max net liquidation value
- `setAdminAutoLiqAction(accountId, action)` - Set auto-liquidation action
- `resetAutoLiqStatus(accountId)` - Reset auto-liquidation status
- `setAccountNotes(accountId, notes)` - Add risk notes
- `setDemoHalt(accountId, reason)` - Halt demo account
- `switchRiskCategory(accountId, category)` - Change risk category

**Examples:**

```typescript
// Set max net liquidation
await sdk.live.accountRiskStatus.updateMaxNetLiq({
  body: { accountId: 123, maxNetLiquidation: 50000 }
});

// Set auto-liquidation
await sdk.live.accountRiskStatus.setAdminAutoLiqAction({
  body: { accountId: 123, autoLiqAction: 'Liquidate' }
});
```

### Additional Methods

**TradovateSubscription, TradovateSubscriptionPlan:**

- Standard CRUD operations and list/find methods
- *(admin only for create/update)*

**AgreementDocumentTemplate, CustomerApplication:**

- `create(params)`, `update(id, params)` *(admin only)*

**UserAccountAutoLiq:**

- `create(params)`, `update(id, params)`, `updateUserAutoLiq(params)`
- **Note:** `create()` is available to non-admin users (exception to the general rule)

**UserAccountPositionLimit:**

- `create(params)`, `update(id, params)`
- `deleteUserAccountPositionLimit(id)`
- `deleteUserAccountRiskParameter(id)`
- **Note:** `create()` is available to non-admin users (exception to the general rule)

**UserAccountRiskParameter:**

- `create(params)`, `update(id, params)`
- **Note:** `create()` is available to non-admin users (exception to the general rule)

## MdApiClient Class

The MdApiClient provides real-time market data access through WebSocket connections.
It supports quote data, DOM (Depth of Market), histogram data, and chart data.

### Quote Methods

The quote methods provide real-time quote data including bid/ask prices, last trade price,
volume, and other market indicators.

#### `quote.subscribe()`

Subscribe to quote data for a symbol.

**Signature:**

```typescript
subscribe(request: SubscribeQuoteRequest): Promise<ResponseForUrl<'md/subscribeQuote'>>
```

**Example:**

```typescript
const sub = await sdk.md.quote.subscribe({ symbol: 'ESM7' });
console.log('Quote subscription confirmed:', sub.subscriptionId);
```

#### `quote.unsubscribe()`

Unsubscribe from quote data for a symbol.

**Signature:**

```typescript
unsubscribe(symbol: string | number): Promise<ResponseForUrl<'md/unsubscribeQuote'>>
```

**Example:**

```typescript
await sdk.md.quote.unsubscribe('ESM7');
console.log('Quote subscription cancelled for ESM7');
```

### DOM Methods

The DOM methods provide real-time order book data showing bid and ask orders at
different price levels.

#### `dom.subscribe()`

Subscribe to DOM data for a symbol.

**Signature:**

```typescript
subscribe(request: SubscribeDOMRequest): Promise<ResponseForUrl<'md/subscribeDOM'>>
```

**Example:**

```typescript
const sub = await sdk.md.dom.subscribe({ symbol: 'ESM7' });
console.log('DOM subscription confirmed:', sub.subscriptionId);
```

#### `dom.unsubscribe()`

Unsubscribe from DOM data for a symbol.

**Signature:**

```typescript
unsubscribe(symbol: string | number): Promise<ResponseForUrl<'md/unsubscribeDOM'>>
```

### Histogram Methods

The histogram methods provide volume profile data showing trading activity at different
price levels.

#### `histogram.subscribe()`

Subscribe to histogram data for a symbol.

**Signature:**

```typescript
subscribe(request: SubscribeHistogramRequest): Promise<ResponseForUrl<'md/subscribeHistogram'>>
```

**Example:**

```typescript
const sub = await sdk.md.histogram.subscribe({ symbol: 'ESM7' });
console.log('Histogram subscription confirmed:', sub.subscriptionId);
```

#### `histogram.unsubscribe()`

Unsubscribe from histogram data for a symbol.

**Signature:**

```typescript
unsubscribe(symbol: string | number): Promise<ResponseForUrl<'md/unsubscribeHistogram'>>
```

### Chart Methods

The chart methods provide time-series data for technical analysis including OHLC bars,
candlesticks, and other chart patterns.

#### `chart.subscribe()`

Subscribe to chart data for a symbol.

**Signature:**

```typescript
subscribe(request: GetChartRequest): Promise<ResponseForUrl<'md/getChart'>>
```

**Example:**

```typescript
const sub = await sdk.md.chart.subscribe({
  symbol: 'ESM7',
  chartDescription: {
    underlyingType: 'MinuteBar',
    elementSize: 1
  },
  timeRange: {
    asMuchAsElements: 100
  }
});
console.log('Chart subscription confirmed:', sub.subscriptionId);
```

#### `chart.unsubscribe()`

Unsubscribe from chart data using subscription ID.

**Signature:**

```typescript
unsubscribe(subscriptionId: number): Promise<ResponseForUrl<'md/cancelChart'>>
```

### Utility Methods

#### `listen()`

Listen to market data entity type events for real-time updates.

**Signature:**

```typescript
listen(entityType: 'quote' | 'dom' | 'histogram' | 'chart', callback: (message: MdEvent) => void): Listener
```

**Returns:** A `Listener` object with an `unlisten()` method to stop listening.

**Example:**

```typescript
const listener = sdk.md.listen('quote', (quoteEvent) => {
  quoteEvent.quotes.forEach(quote => {
    console.log(`${quote.contractId}: Bid ${quote.entries.Bid?.price}, Ask ${quote.entries.Offer?.price}`);
  });
});

// Later, stop listening
listener.unlisten();
```

## Configuration

### Configuration Interfaces

The SDK provides two configuration interfaces to accommodate different use cases:

#### SimplePartnerSdkConfig

For most partners - covers common configuration options:

```typescript
interface SimplePartnerSdkConfig {
  // Required
  stage: TdvStage;
  credentials: Credentials;

  // Preset (recommended)
  preset?: PresetType;

  // Client configuration
  liveClient?: 'socket' | 'rest';
  simClient?: 'socket' | 'rest';

  // Feature flags
  enableMdSocket?: boolean;
  enableMultiplexing?: boolean;

  // Connection settings
  connectionTimeout?: number;

  // Health monitoring
  healthCheckInterval?: number;

  // Reconnection settings
  maxReconnectAttempts?: number;
  reconnectDelay?: number;

  // Basic rate limiting
  rateLimiting?: {
    requestsPerSecond?: number;
    requestsPerMinute?: number;
    requestsPerHour?: number;
  };

  // Basic cache configuration
  cache?: {
    maxAge?: number;
    maxEntries?: {
      account?: number;
      position?: number;
      order?: number;
      fill?: number;
      accountRiskStatus?: number;
      fillPair?: number;
      cashBalance?: number;
      default?: number;
    };
  };

  // Error handlers
  onError?: (error: SdkError) => void;
  onAuthError?: (error: SdkError) => void;
  onRateLimitError?: (error: SdkError) => void;
}
```

#### AdvancedPartnerSdkConfig

For power users needing full control:

```typescript
interface AdvancedPartnerSdkConfig extends SimplePartnerSdkConfig {
  // Advanced connection settings
  shardingDivisor?: number;
  shardingType?: 'modUserId' | 'modAccountId';
  entityTypes?: EntityName[];

  // Advanced sync settings
  syncImmediate?: boolean;
  fullOrgSnapshot?: boolean;

  // Advanced health monitoring
  healthCheckTimeout?: number;
  enableVerboseLogging?: boolean;

  // Advanced reconnection settings
  exponentialBackoff?: boolean;

  // Full rate limiting configuration
  rateLimiting?: RateLimitConfig;

  // Message queue configuration
  messageQueue?: EnhancedMessageQueueConfig;

  // Maintenance configuration
  maintenance?: MaintenanceConfig;

  // Logger configuration
  logger?: WinstonLoggerConfig;
}
```

#### Credentials

API credentials interface.

```typescript
interface Credentials {
  name: string;
  password: string;
  appId?: string;
  appVersion?: string;
  cid?: number;
  sec?: string;
  chl?: string;
  deviceId?: string;
  environment?: 'demo' | 'live';
  enc?: boolean;
}
```

#### RateLimitConfig

Full rate limiting configuration:

```typescript
interface RateLimitConfig {
  requestsPerSecond: number;
  requestsPerMinute: number;
  requestsPerHour: number;
  burstMultiplier: number;
  enableBackoff: boolean;
  maxBackoffTime: number;
  logViolations: boolean;
}
```

#### EnhancedMessageQueueConfig

Message queue configuration:

```typescript
interface EnhancedMessageQueueConfig {
  maxSize: number;
  enableRetries: boolean;
  maxRetries: number;
  retryDelay: number;
  enableMaintenanceQueuing: boolean;
  queueTimeout: number;
  enableDeduplication: boolean;
  deduplicationWindow: number;
  clearDeduplicationAfterResolution?: boolean;
  deduplicationClearStrategy?: 'immediate' | 'delayed' | 'manual';
  deduplicationClearDelay?: number;
}
```

#### MaintenanceConfig

Maintenance window configuration:

```typescript
interface MaintenanceConfig {
  enableMaintenanceDetection: boolean;
  enableAutomaticQueuing: boolean;
  maintenanceWindows: MaintenanceWindow[];
  timezone: 'CT' | 'ET' | 'PT' | 'UTC';
  queueTimeout: number;
  retryAttempts: number;
}

interface MaintenanceWindow {
  id: string;
  name: string;
  description: string;
  isActive: (date?: Date) => boolean;
  priority: 'low' | 'medium' | 'high';
  affectedEndpoints: string[];
  queueBehavior: 'queue_all' | 'queue_specific' | 'queue_none';
}
```

#### WinstonLoggerConfig

Logger configuration:

```typescript
interface WinstonLoggerConfig {
  stage: TdvStage;
  level?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  logFilePath?: string;
  maxFileSize?: number;
  maxFiles?: number;
  format?: 'json' | 'simple' | 'detailed';
  enableColors?: boolean;
  logVerbosity?: 'minimal' | 'normal' | 'verbose' | 'debug';
}
```

### Preset Configuration System

The SDK provides preset configurations for common use cases. Using presets is the recommended approach for most partners.

#### Available Presets


| Preset           | Description                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `standard`       | Recommended for most partners. WebSocket clients, comprehensive entity updates, intelligent caching, market data enabled. |
| `minimal`        | Simplest configuration. Basic WebSocket clients, essential entity updates only.                                           |
| `high-frequency` | Optimized for high-frequency trading with aggressive caching and higher rate limits.                                      |
| `development`    | For development and testing. REST clients, verbose logging, relaxed rate limits.                                          |


#### PresetType

```typescript
type PresetType = 'standard' | 'minimal' | 'high-frequency' | 'development';
```

#### PRESET_TYPES

Runtime constant for preset validation:

```typescript
const PRESET_TYPES = ['standard', 'minimal', 'high-frequency', 'development'] as const;
```

#### `getPreset()`

Get a specific preset configuration.

**Signature:**

```typescript
function getPreset(preset: PresetType): Partial<AdvancedPartnerSdkConfig>
```

**Example:**

```typescript
import { getPreset } from './index';

const standardConfig = getPreset('standard');
console.log('Standard preset rate limits:', standardConfig.rateLimiting);
```

#### `listPresets()`

List all available presets with descriptions.

**Signature:**

```typescript
function listPresets(): Array<{ name: PresetType; description: string }>
```

**Example:**

```typescript
import { listPresets } from './index';

const presets = listPresets();
presets.forEach(p => console.log(`${p.name}: ${p.description}`));
```

#### Using Presets

```typescript
// Recommended: Use preset configuration
const sdk = new PartnerSdk({
  stage: 'staging',
  credentials: {
    name: 'your-username',
    password: 'your-password',
    appId: 'your-app-id',
    appVersion: '1.0.0',
    cid: 123,
    sec: 'your-secret'
  },
  preset: 'standard'  // Apply standard preset
});
```

### Configuration Helpers

#### `createSimpleConfig()`

Helper function that creates a simple configuration with sensible defaults.

**Signature:**

```typescript
function createSimpleConfig(options: {
  stage: TdvStage;
  credentials: Credentials;
  enableMarketData?: boolean;
  mode?: 'standard' | 'minimal' | 'advanced';
  clientType?: 'websocket' | 'rest';
}): SimplePartnerSdkConfig
```

**Parameters:**

- `stage` - Environment to connect to
- `credentials` - Your API credentials
- `enableMarketData` - Enable market data socket (default: `false`)
- `mode` - Configuration mode maps to presets (default: `'standard'`)
- `clientType` - Client transport type (default: `'websocket'`)

**Example:**

```typescript
import { createSimpleConfig, PartnerSdk } from './index';

// Basic usage with defaults
const config = createSimpleConfig({
  stage: 'staging',
  credentials: {
    name: 'your-username',
    password: 'your-password',
    appId: 'your-app-id',
    appVersion: '1.0.0',
    cid: 123,
    sec: 'your-secret'
  }
});

const sdk = new PartnerSdk(config);
```

```typescript
// With market data enabled
const config = createSimpleConfig({
  stage: 'prod',
  credentials: { /* ... */ },
  enableMarketData: true,
  mode: 'standard'
});
```

#### `createConfigFromEnv()`

Creates a PartnerSdk configuration from environment variables with validation.

**Signature:**

```typescript
function createConfigFromEnv(env?: NodeJS.ProcessEnv): PartnerSdkConfig
```

**Example:**

```typescript
import { createConfigFromEnv, PartnerSdk } from './index';

// Direct usage
const sdk = new PartnerSdk(createConfigFromEnv());

// With overrides
const sdk = new PartnerSdk({
  ...createConfigFromEnv(),
  enableMdSocket: true,
  preset: 'standard'
});
```

#### `createSampleEnvFile()`

Returns a sample .env file template with all configuration options.

**Signature:**

```typescript
function createSampleEnvFile(): string
```

**Example:**

```typescript
import { createSampleEnvFile } from './index';
import fs from 'fs';

const template = createSampleEnvFile();
fs.writeFileSync('.env.example', template);
```

## Error System

The SDK uses a streamlined error hierarchy for all error conditions.

### ErrorCode

Error codes for categorizing errors:

```typescript
enum ErrorCode {
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
```

### SdkError (Base Class)

Base class for all SDK errors.

```typescript
class SdkError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly retryable: boolean;
  readonly retryAfter?: number;
  readonly requestId?: string;
  readonly context?: Record<string, unknown>;
  readonly timestamp: Date;

  constructor(message: string, code?: string, options?: ErrorOptions);

  shouldRetry(): boolean;
  getRetryDelay(): number;
  toJSON(): Record<string, unknown>;
}
```

### AuthError

Thrown for authentication/authorization failures (401, 403).

```typescript
class AuthError extends SdkError
```

**Example:**

```typescript
try {
  await sdk.connect();
} catch (error) {
  if (error instanceof AuthError) {
    console.error('Authentication failed:', error.message);
    // Handle re-authentication
  }
}
```

### NetworkError

Thrown for network/connection failures.

```typescript
class NetworkError extends SdkError
```

**Properties:**

- `retryable: true`
- `retryAfter: 5000` (default)

### ValidationError

Thrown for invalid input or parameters (400s).

```typescript
class ValidationError extends SdkError
```

**Properties:**

- `retryable: false`

### RateLimitError

Thrown when rate limits are exceeded (429).

```typescript
class RateLimitError extends SdkError
```

**Properties:**

- `retryable: true`
- `retryAfter: 60000` (default, or from server response)

### ServerError

Thrown for server-side errors (500s).

```typescript
class ServerError extends SdkError
```

**Properties:**

- `retryable: true`
- `retryAfter: 30000` (default)

### ConfigError

Thrown for configuration/setup issues.

```typescript
class ConfigError extends SdkError
```

**Properties:**

- `retryable: false`

### ErrorUtils

Utility object for error handling:

```typescript
const ErrorUtils = {
  isRetryable(error: Error): boolean;
  getRetryDelay(error: Error): number;
  isAuthError(error: Error): boolean;
  isNetworkError(error: Error): boolean;
  isRateLimitError(error: Error): boolean;
  isValidationError(error: Error): boolean;
  isServerError(error: Error): boolean;
  isConfigError(error: Error): boolean;
  format(error: Error): string;
};
```

**Example:**

```typescript
import { ErrorUtils } from './index';

try {
  await sdk.live.order.placeOrder({ /* ... */ });
} catch (error) {
  if (ErrorUtils.isRetryable(error)) {
    const delay = ErrorUtils.getRetryDelay(error);
    console.log(`Retrying in ${delay}ms...`);
    await sleep(delay);
    // Retry logic
  } else {
    console.error('Non-retryable error:', ErrorUtils.format(error));
  }
}
```

### createErrorFromResponse()

Factory function to create appropriate error from HTTP response:

```typescript
function createErrorFromResponse(
  statusCode: number,
  responseData: { message?: string; retry_after?: number } | null,
  requestId?: string,
  context?: Record<string, unknown>
): SdkError
```

## Event Types

The SDK emits events for monitoring connection state, health, and performance.

### Event Names

```typescript
sdk.on('connection', (event: ConnectionEvent) => {});
sdk.on('health', (event: HealthEvent) => {});
sdk.on('rateLimit', (event: RateLimitEvent) => {});
sdk.on('cache', (event: CacheEvent) => {});
sdk.on('queue', (event: QueueEvent) => {});
```

### ConnectionEvent

```typescript
interface ConnectionEvent {
  type: 'connecting' | 'connected' | 'disconnected' | 'connection_failed';
  timestamp: number;
  stage: TdvStage;
  error?: string;
}
```

**Example:**

```typescript
sdk.on('connection', (event) => {
  switch (event.type) {
    case 'connecting':
      console.log('🔄 Connecting...');
      break;
    case 'connected':
      console.log('✅ Connected');
      break;
    case 'disconnected':
      console.log('🔌 Disconnected');
      break;
    case 'connection_failed':
      console.error('❌ Failed:', event.error);
      break;
  }
});
```

### HealthEvent

```typescript
interface HealthEvent {
  type: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  components: Record<string, boolean>;
  message?: string;
}
```

### RateLimitEvent

```typescript
interface RateLimitEvent {
  type: 'limit_exceeded' | 'limit_reset';
  timestamp: number;
  endpoint?: string;
  retryAfter?: number;
}
```

### CacheEvent

```typescript
interface CacheEvent {
  type: 'hit' | 'miss' | 'update';
  timestamp: number;
  entityType: string;
  hitRate: number;
}
```

### QueueEvent

```typescript
interface QueueEvent {
  type: 'queued' | 'processed' | 'expired';
  timestamp: number;
  queueSize: number;
  reason?: string;
}
```

## Utility Functions

### Configuration Utilities

See [Configuration Helpers](#configuration-helpers) section above.

### Authentication

#### `authenticate()`

Direct authentication function for obtaining access tokens.

**Signature:**

```typescript
function authenticate(credentials: Credentials, stage: TdvStage): Promise<AccessTokenResponse>
```

**Returns:**

```typescript
interface AccessTokenResponse {
  accessToken: string;
  expirationTime: string;
  userId: number;
  // ... other token data
}
```

**Example:**

```typescript
import authenticate from './utils/authenticate';

const tokenData = await authenticate(
  {
    name: 'your-username',
    password: 'your-password',
    appId: 'your-app-id',
    appVersion: '1.0.0',
    cid: 123,
    sec: 'your-secret'
  },
  'staging'
);

console.log('Access token:', tokenData.accessToken);
console.log('Expires:', tokenData.expirationTime);
```

### Maintenance Utilities

Functions for handling maintenance windows.

#### `isMaintenanceActive()`

Check if any maintenance window is currently active.

**Signature:**

```typescript
function isMaintenanceActive(config: MaintenanceConfig, date?: Date): boolean
```

#### `getActiveMaintenanceWindows()`

Get currently active maintenance windows.

**Signature:**

```typescript
function getActiveMaintenanceWindows(config: MaintenanceConfig, date?: Date): MaintenanceWindow[]
```

#### `shouldQueueDuringMaintenance()`

Check if an endpoint should be queued during maintenance.

**Signature:**

```typescript
function shouldQueueDuringMaintenance(
  endpoint: string,
  config: MaintenanceConfig,
  date?: Date
): boolean
```

#### `getMaintenanceInfoForEndpoint()`

Get maintenance window information for a specific endpoint.

**Signature:**

```typescript
function getMaintenanceInfoForEndpoint(
  endpoint: string,
  config: MaintenanceConfig,
  date?: Date
): MaintenanceWindow | null
```

#### Default Maintenance Windows

The SDK includes predefined Central Time maintenance windows:

```typescript
const CENTRAL_TIME_MAINTENANCE_WINDOWS: MaintenanceWindow[] = [
  // Monday-Friday 4PM-5PM CT
  { id: 'weekday_evening', ... },
  // Friday 4PM-8PM CT (extended)
  { id: 'friday_extended', ... },
  // Saturday 10PM - Sunday 6AM CT
  { id: 'weekend_maintenance', ... }
];

const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  enableMaintenanceDetection: true,
  enableAutomaticQueuing: true,
  maintenanceWindows: CENTRAL_TIME_MAINTENANCE_WINDOWS,
  timezone: 'CT',
  queueTimeout: 10 * 60 * 60 * 1000, // 10 hours
  retryAttempts: 3
};
```

### OpenPLCalculator

Real-time P&L calculator for monitoring position profitability.

**Requires:** Market data socket enabled (`enableMdSocket: true`)

#### CalculatorConfig

```typescript
interface CalculatorConfig {
  products?: string[];        // Filter to specific products (e.g., ['ES', 'NQ'])
  accounts?: number[];        // Filter to specific account IDs
  updateInterval?: number | 'tick';  // Update frequency in ms or on every tick
}
```

#### Calculator Interface

```typescript
interface Calculator {
  listen: (callback: (pl: PLEvent) => void) => PLListener;
  destroy: () => void;
}

interface PLEvent {
  totalPL: number;
  allPositions: Record<string, number>;  // P&L by product
}

interface PLListener {
  unlisten: () => void;
}
```

#### `OpenPLCalculator()`

Create a real-time P&L calculator.

**Signature:**

```typescript
async function OpenPLCalculator(
  sdk: PartnerSdk,
  mode: 'sim' | 'live',
  config: CalculatorConfig
): Promise<Calculator>
```

**Example:**

```typescript
import { PartnerSdk, OpenPLCalculator } from './index';

const sdk = new PartnerSdk({
  stage: 'staging',
  credentials: { /* ... */ },
  enableMdSocket: true  // Required for P&L calculator
});

await sdk.connect();

// Create calculator for simulation accounts
const calculator = await OpenPLCalculator(sdk, 'sim', {
  products: ['ES', 'NQ'],  // Only track ES and NQ
  updateInterval: 1000     // Update every second
});

// Listen to P&L updates
const listener = calculator.listen((pl) => {
  console.log('Total P&L:', pl.totalPL.toFixed(2));
  console.log('By product:', pl.allPositions);
});

// Later, cleanup
listener.unlisten();
calculator.destroy();
```

## Constants

### URLS

Environment URL mappings:

```typescript
const URLS: {
  devel: UrlDomain;
  staging: UrlDomain;
  prod: UrlDomain;
}

interface UrlDomain {
  raw: string;      // Base API URL
  sim: string;      // Simulation API URL
  live: string;     // Live API URL
  simWs: string;    // Simulation WebSocket URL
  liveWs: string;   // Live WebSocket URL
  mdWs: string;     // Market data WebSocket URL
}
```

**Example:**

```typescript
import { URLS } from './index';

console.log('Staging live URL:', URLS.staging.live);
// Output: https://live-api.staging.ninjatrader.dev/v1
```

### entityNames

List of all entity types:

```typescript
const entityNames: EntityName[] = [
  'account', 'accountRiskStatus', 'adminAlertSignal', 'adminAlert',
  'cashBalance', 'cashBalanceLog', 'command', 'commandReport',
  'contract', 'contractMaturity', 'contractMargin', 'currency',
  'exchange', 'executionReport', 'fill', 'fillPair',
  'marketDataSubscription', 'marketDataSubscriptionPlan', 'order',
  'orderStrategy', 'OtherEnvAdminAlertSignal', 'position', 'product',
  'productMargin', 'tradingPermission', 'tradovateSubscription',
  'tradovateSubscriptionPlan', 'user'
];
```

## Type Definitions

### TdvStage

```typescript
type TdvStage = 'devel' | 'prod' | 'staging';
```

### EntityName

```typescript
type EntityName =
  | 'account'
  | 'accountRiskStatus'
  | 'adminAlertSignal'
  | 'adminAlert'
  | 'alert'
  | 'alertSignal'
  | 'cashBalance'
  | 'cashBalanceLog'
  | 'contract'
  | 'contractMargin'
  | 'contractMaturity'
  | 'command'
  | 'commandReport'
  | 'currency'
  | 'exchange'
  | 'executionReport'
  | 'fill'
  | 'fillPair'
  | 'marginSnapshot'
  | 'marketDataSubscription'
  | 'marketDataSubscriptionPlan'
  | 'marketDataSubscriptionExchangeScope'
  | 'order'
  | 'orderStrategy'
  | 'OtherEnvAdminAlertSignal'
  | 'position'
  | 'positionLog'
  | 'product'
  | 'productMargin'
  | 'productSession'
  | 'tradingPermission'
  | 'tradovateSubscription'
  | 'tradovateSubscriptionPlan'
  | 'user'
  | 'userAccountAutoLiq';
```

### PluralEntityName

```typescript
type PluralEntityName =
  | 'accounts'
  | 'accountRiskStatuses'
  | 'orders'
  | 'positions'
  | 'fills'
  // ... etc
```

### Listener

Return type from `listen()` methods:

```typescript
class Listener {
  unlisten(): void;
}
```

This completes the comprehensive API reference for the TradeAPI SDK TypeScript library.