# Examples

Practical examples for the NinjaTrader Trade API + Market Data SDK, aimed at retail
developers building trading tools and integrations.

## Prerequisites

1. **Configure your environment variables**

   ```bash
   npm run generate:env
   # then edit the generated .env with your credentials
   ```

2. **Required environment variables:**
   - `TRADE_SDK_STAGE` — `'devel'`, `'staging'`, or `'prod'`
   - `TRADE_SDK_USERNAME` — your username
   - `TRADE_SDK_PASSWORD` — your password
   - `TRADE_SDK_APP_ID` — your application ID
   - `TRADE_SDK_APP_VERSION` — your application version

3. **Optional:**
   - `TRADE_SDK_CLIENT_ID` — OAuth client ID
   - `TRADE_SDK_SEC` — API secret

> All examples default to the **simulation** environment (`sdk.sim`). Switch to
> `sdk.live` only when you intend to trade real money.

## Examples

### 1. Basic Trading (`basic-trading.ts`)

Fundamental Trade API operations — the place to start.

- Connect and fetch the current user
- List accounts and cash balances
- View open positions and working orders
- Look up contracts and products
- A safely commented-out order-placement snippet

```bash
npm run example:basic
```

### 2. Market Data (`market-data.ts`)

Stream real-time market data over the market-data socket.

- Subscribe to real-time **quotes** (bid/ask/last)
- Subscribe to **Depth of Market** (DOM / order book)
- Listen for streaming updates and clean up on exit

```bash
npm run example:md ESU6 NQU6
```

> Pass one or more front-month contract symbols. Update them to the current
> active contract month before running.

### 3. Simple P&L Calculator (`simple-pl-calculator.ts`)

Real-time profit/loss monitoring, combining positions with market data.

- Automatic position + quote subscriptions
- Live unrealized P&L as prices move
- Optional filtering by product and account

```bash
npm run example:pl
```

Requires market data (`enableMdSocket: true`) and at least one open position.

### 4. Liquidate Positions (`liquidate-positions.ts`)

Close your own open positions — useful for risk management and end-of-session flattening.

- Close a single position by symbol
- Close all open positions for an account
- Monitor positions in real time

```bash
# Close one position
npm run example:liquidate one <accountId> <symbol>

# Close all positions for an account
npm run example:liquidate all <accountId>

# Monitor position updates
npm run example:liquidate monitor <accountId>
```

## Key Concepts

### Real-time P&L

Unrealized P&L uses bid/ask pricing, matching how trading platforms display it:

- **Long** positions are marked at the **bid** (what you can sell at)
- **Short** positions are marked at the **ask** (what you'd pay to buy back)

```
P&L = netPos × valuePerPoint × (currentPrice − entryPrice)
```

### Event listening

`sim` / `live` and `md` all expose `listen()`, which returns a handle with
`unlisten()`:

```typescript
const listener = sdk.sim.listen('position', event => {
  console.log('Position update:', event.entity);
});

// later
listener.unlisten();
```

### Clean shutdown

Always disconnect and remove listeners on exit:

```typescript
process.on('SIGINT', async () => {
  listener.unlisten();
  await sdk.disconnect();
  process.exit(0);
});
```

## Next Steps

- See the [main README](../README.md) for setup and configuration.
- Review the [API Reference](../docs/public/API_REFERENCE.md) for the full surface.
