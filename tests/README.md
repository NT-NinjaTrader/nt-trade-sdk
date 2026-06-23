# TradeAPI SDK Test Suite

This directory contains comprehensive tests for the TradeAPI SDK.

## Test Structure

### Unit Tests (`unit/`)

- **`apiClient.test.ts`** - Tests for API client functionality
- **`mdApiClient.test.ts`** - Tests for market data API client
- **`partnerSdk.test.ts`** - Tests for TradeClient class
- **`configLoader.test.ts`** - Tests for configuration loading
- **`socket.test.ts`** - Tests for WebSocket handling
- **`multiplexSocket.test.ts`** - Tests for multiplexed sockets
- **`connectionManager.test.ts`** - Tests for connection management
- **`rateLimiter.test.ts`** - Tests for rate limiting
- **`cacheManager.test.ts`** - Tests for caching
- **`healthMonitor.test.ts`** - Tests for health monitoring
- **`messageQueue.test.ts`** - Tests for message queue
- **`errors.test.ts`** - Tests for error handling
- **`restApi.test.ts`** - Tests for REST API client
- **`openPLCalculator.test.ts`** - Tests for P&L calculation
- **`presetConfigs.test.ts`** - Tests for preset configurations

## Running Tests

### All Tests

```bash
bun run test
```

### Watch Mode

```bash
bun run test:watch
```

### Coverage Report

```bash
bun run test:coverage
```

## Test Coverage

The test suite covers:

### ✅ API Client
- Request/response handling
- Error handling
- Authentication
- Socket and REST API selection

### ✅ Market Data
- Quote subscriptions
- DOM subscriptions
- Chart data
- Event handling

### ✅ Connection Management
- WebSocket connections
- Reconnection logic
- Health monitoring
- Rate limiting

### ✅ Message Queue
- Message prioritization
- Retry logic
- Maintenance window handling
- Deduplication

### ✅ Error Handling
- Error classification
- Recovery strategies
- User-friendly messages
- Logging integration

## Test Utilities

The test suite includes utilities in `setup.ts`:

- Mock WebSocket implementation
- Mock fetch responses
- Mock logger implementations
- Test environment configuration
- Performance timing utilities
