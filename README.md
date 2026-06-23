# NinjaTrader Trade API SDK (TypeScript)

A TypeScript SDK for the **NinjaTrader Trade API** and **Market Data API**, with WebSocket
and REST support, automated reconnection, health monitoring, rate limiting, and message
queueing.

This SDK is focused on retail trading use cases: managing accounts, placing and tracking
orders, monitoring positions and balances, and streaming real-time market data.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0 (or Node.js >= 18)
- Valid API credentials (username, password, appId, cid, sec)

### 1. Clone and Install

```bash
git clone https://github.com/NT-NinjaTrader/nt-trade-sdk.git
cd nt-trade-sdk
bun install
```

### 2. Configure Credentials

Generate a `.env` template and fill in your credentials:

```bash
bun run generate:env
```

Or copy the example below into `.env`:

```bash
TRADE_SDK_STAGE=staging
TRADE_SDK_USERNAME=your_username
TRADE_SDK_PASSWORD=your_password
TRADE_SDK_APP_ID=your_app_id
TRADE_SDK_APP_VERSION=1.0.0
TRADE_SDK_CLIENT_ID=your_client_id
TRADE_SDK_SEC=your_api_secret

# Recommended: applies sensible defaults
TRADE_SDK_PRESET=standard
```

### 3. Run an Example

```bash
bun run example:basic        # accounts, positions, orders, contracts
bun run example:md ESU6      # stream real-time quotes + DOM
bun run example:pl           # real-time P&L
```

See the [examples directory](./examples/) for all available examples:

- **[Basic Trading](./examples/basic-trading.ts)** — accounts, positions, orders, contract lookup
- **[Market Data](./examples/market-data.ts)** — real-time quotes and Depth of Market
- **[Simple P&L Calculator](./examples/simple-pl-calculator.ts)** — real-time profit/loss monitoring
- **[Liquidate Positions](./examples/liquidate-positions.ts)** — close your own positions for risk management

## Quick Start

### Using Presets (Recommended)

```typescript
import { createConfigFromEnv, TradeClient } from './index';

const sdk = new TradeClient({
  ...createConfigFromEnv(),
  preset: 'standard'
});

await sdk.connect();

const accounts = await sdk.sim.account.list();
console.log('Accounts:', accounts);

await sdk.disconnect();
```

### Manual Configuration

```typescript
import { TradeClient } from './index';

const sdk = new TradeClient({
  stage: 'staging',
  credentials: {
    name: 'your-username',
    password: 'your-password',
    appId: 'your-app-id',
    appVersion: '1.0.0',
    cid: 123,
    sec: 'your-sec'
  },
  preset: 'standard'
});

await sdk.connect();
```

### Available Presets

| Preset | Use Case |
|--------|----------|
| `standard` | Recommended for most developers. WebSocket clients, comprehensive entity updates, caching. |
| `minimal` | Simplest configuration. Basic WebSocket clients, essential entity updates only. |
| `high-frequency` | Optimized performance, comprehensive real-time updates, higher rate limits. |

## SDK Properties

- **`live`** — API client for live trading operations (real money)
- **`sim`** — API client for simulation trading operations
- **`md`** — Market data API client (requires `enableMdSocket: true`)

## Market Data

```typescript
const sdk = new TradeClient({
  ...createConfigFromEnv(),
  preset: 'standard',
  enableMdSocket: true
});

await sdk.connect();

if (sdk.md) {
  await sdk.md.quote.subscribe({ symbol: 'ESU6' });
  await sdk.md.dom.subscribe({ symbol: 'ESU6' });

  sdk.md.listen('quote', event => {
    const quote = event.quotes[0];
    console.log(`Bid ${quote.entries.Bid?.price} / Ask ${quote.entries.Offer?.price}`);
  });
}
```

## Events

```typescript
sdk.on('connection', event => {
  // 'connecting' | 'connected' | 'disconnected' | 'connection_failed'
  console.log(event.type);
});

sdk.on('health', event => {
  // 'healthy' | 'degraded' | 'unhealthy'
  console.log(event.type, event.message);
});

sdk.on('rateLimit', event => {
  console.log(`Rate limit hit for ${event.endpoint}`);
});
```

## Error Handling

All errors extend `SdkError` and include error codes, retry information, and context:

```typescript
import { AuthError, SdkError } from './index';

try {
  await sdk.connect();
} catch (error) {
  if (error instanceof AuthError) {
    console.error('Auth failed:', error.message);
  }
  if (error instanceof SdkError && error.retryable) {
    console.log(`Retry in ${error.getRetryDelay()}ms`);
  }
}
```

Error types: `AuthError`, `NetworkError`, `ValidationError`, `RateLimitError`, `ServerError`, `ConfigError`.

## Configuration Reference

For advanced socket, REST, reconnection, rate limiting, message queue, and maintenance
configuration, see the [API Reference](docs/public/API_REFERENCE.md).

All configuration options can be set via environment variables (`TRADE_SDK_*`) or passed
directly to the `TradeClient` constructor. Run `bun run generate:env` to see all available options.

## Testing

```bash
bun test                    # run all tests
bun run test:watch          # watch mode
bun run test:coverage       # with coverage
```

## Documentation

- [API Reference](docs/public/API_REFERENCE.md) — complete API documentation
- [Examples](./examples/) — working code examples
- [Contributing](CONTRIBUTING.md) — development setup and guidelines

To generate full TypeDoc documentation (optional):

```bash
bun run docs           # markdown output to docs/api/
bun run docs:html      # HTML output to docs/html/
```
