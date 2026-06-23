# TradeAPI SDK Examples

This directory contains practical examples demonstrating how to use the TradeAPI SDK for various trading operations.

## Prerequisites

Before running any examples, you need to:

1. **Configure your environment variables**
   ```bash
   bun run generate:env
   # Edit the generated .env with your credentials
   ```

2. **Required environment variables:**
   - `TRADE_SDK_STAGE` - Environment: `'devel'`, `'staging'`, or `'prod'`
   - `TRADE_SDK_USERNAME` - Your Tradovate username
   - `TRADE_SDK_PASSWORD` - Your Tradovate password
   - `TRADE_SDK_APP_ID` - Your application ID
   - `TRADE_SDK_APP_VERSION` - Your application version

3. **Optional environment variables:**
   - `TRADE_SDK_CLIENT_ID` - OAuth client ID
   - `TRADE_SDK_SEC` - Security token

## Examples

### 1. Simple P&L Calculator (`simple-pl-calculator.ts`)

A lightweight, simplified P&L calculator integrated directly into the ApiClient. Perfect for getting started with real-time P&L monitoring.

**Features:**
- Direct integration with ApiClient - no external dependencies
- Automatic position and quote subscriptions
- Real-time P&L updates as prices change
- Optional filtering by products and accounts
- Simple API: just create, listen, and destroy

**Requirements:**
- Market data subscription enabled (`enableMdSocket: true`)
- Active positions in your account

**Run:**
```bash
bun run examples/simple-pl-calculator.ts
```

**Example code:**
```typescript
// Create calculator from ApiClient
const calculator = await sdk.sim.createOpenPLCalculator({
  products: ['ES', 'NQ'],  // Optional filter
  accounts: [123456]        // Optional filter
});

// Listen to P&L updates
calculator.listen((plEvent) => {
  console.log(`Total P&L: $${plEvent.totalPL.toFixed(2)}`);
});

// Clean up when done
calculator.destroy();
```

### 2. Basic Trading (`basic-trading.ts`)

Fundamental operations to get started with the SDK.

**Features:**
- Connecting to the platform
- Getting account information
- Viewing positions and orders
- Contract information lookup
- Example order placement (commented out for safety)

**Run:**
```bash
bun run examples/basic-trading.ts
```

## Vendor Operations Examples

The following examples demonstrate common operations that prop firm vendors and administrators perform:

### 4. Auto-Assign Entitlements (`auto-assign-entitlement.ts`)

Automatically assign entitlements when users sign the non-professional market data agreement.

**Features:**
- Listen for `OtherEnvAdminAlertSignal` events
- Extract username from alert text
- Find user by username
- Search for entitlement by name (handles environment-specific IDs)
- Assign entitlement subscription with non-pro status
- Real-time monitoring and processing

**Requirements:**
- Admin-level access
- Entitlement must exist in environment

**Run:**
```bash
bun run example:entitlement
# or
bun run examples/auto-assign-entitlement.ts
```

**What you'll see:**
```
🚀 Starting Auto-Entitlement Assignment Monitor...

✅ Connected to Tradovate API

🔍 Searching for "simulationPlan" entitlement...
✅ Found entitlement: simulationPlan (ID: 12345)

👂 Listening for non-pro market data agreement signatures...

──────────────────────────────────────────────────────────────────

📢 Alert received: User john_doe signed the non-professional market data agreement
   👤 Username extracted: john_doe
   🔍 Looking up user ID...
   ✅ Found user: john_doe (ID: 67890)
   🎁 Assigning simulationPlan entitlement...
   ✅ Entitlement assigned successfully!
   📋 Subscription details: {...}
──────────────────────────────────────────────────────────────────

💡 Monitor is running. Press Ctrl+C to exit...
```

### 5. Switch Risk Category (`switch-risk-category.ts`)

Automatically switch account risk categories based on scaling conditions (typically account balance).

**Features:**
- Define scaling rules based on balance thresholds
- Monitor account balance changes in real-time
- Automatically switch risk categories when conditions are met
- Track risk category transitions
- Configurable scaling tiers

**Use Cases:**
- Progressive account scaling programs
- Risk-based account management
- Automated tier upgrades based on performance

**Run:**
```bash
bun run example:risk
# or
bun run examples/switch-risk-category.ts
```

**Configuration:**
Edit the `SCALING_RULES` in the file to match your risk categories:

```typescript
const SCALING_RULES = [
  {
    name: 'Starter',
    minBalance: 0,
    maxBalance: 25000,
    riskCategoryId: 1,
    description: 'Entry level traders'
  },
  {
    name: 'Intermediate',
    minBalance: 25000,
    maxBalance: 50000,
    riskCategoryId: 2,
    description: 'Growing accounts'
  },
  // ... add your tiers
];
```

**What you'll see:**
```
🚀 Starting Risk Category Monitor...

✅ Connected to Tradovate API

📊 Configured Scaling Rules:

   Starter         $0         - $25,000      (Risk Category 1)
   Intermediate    $25,000    - $50,000      (Risk Category 2)
   Advanced        $50,000    - $100,000     (Risk Category 3)
   Professional    $100,000   - ∞            (Risk Category 4)

──────────────────────────────────────────────────────────────────

👂 Monitoring account balance changes...

💰 Account TestAccount (ID: 123456): Balance = $26,500
   Current: Risk Category 1
   Target:  Intermediate (Risk Category 2)
   🔄 Switching from Risk Category 1 → 2...
   ✅ Risk category switched successfully!
──────────────────────────────────────────────────────────────────
```

### 6. Reset Demo Account (`reset-demo-account.ts`)

Safely reset demo accounts with comprehensive validation and pre-cleanup.

**Features:**
- Validate account type (demo only)
- Check account creation date
- Prevent reset before account existed
- Automatically liquidate open positions
- Cancel all working orders
- Verify reset completion
- Detailed progress reporting

**Important:**
- Only works on demo/simulation accounts
- All trading data is permanently lost
- Operation is irreversible

**Run:**
```bash
bun run example:reset <accountId>
# or
bun run examples/reset-demo-account.ts <accountId>
```

**Example:**
```bash
bun run example:reset 123456
```

**What you'll see:**
```
🚀 Demo Account Reset Tool

✅ Connected to Tradovate API

======================================================================
🔄 Resetting Demo Account: 123456
======================================================================

1️⃣  Fetching account details...
   ✅ Account found: Demo_Account_001
   Type: Demo
   Created: 2024-01-15T10:30:00.000Z

2️⃣  Validating account type...
   ✅ Confirmed as demo account

3️⃣  Validating reset date...
   Account created: 2024-01-15T10:30:00.000Z
   Reset date: 2024-11-12T15:45:00.000Z
   ✅ Reset date is valid

4️⃣  Checking for open positions...
   ⚠️  Found 2 open position(s)
   🔒 Liquidating all positions...
   ✅ All positions liquidated
   ⏳ Waiting for liquidations to complete...

5️⃣  Checking for working orders...
   ✅ No working orders

6️⃣  Recording pre-reset state...
   Current balance: $48,250

7️⃣  Resetting account...
   ✅ Account reset successfully!

8️⃣  Verifying reset...
   New balance: $50,000
   Open positions: 0

✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅
   Demo account reset completed successfully!
✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅
```

### 7. Liquidate Positions (`liquidate-positions.ts`)

Close open positions for risk management and account maintenance.

**Features:**
- Liquidate a specific position by symbol
- Liquidate all positions at once
- Monitor positions in real-time
- Verify liquidation completion
- Detailed position information display

**Commands:**

**Liquidate one position:**
```bash
bun run example:liquidate one <accountId> <symbol>
```

**Liquidate all positions:**
```bash
bun run example:liquidate all <accountId>
```

**Monitor positions:**
```bash
bun run example:liquidate monitor <accountId>
```

**Examples:**
```bash
# Close a specific position
bun run example:liquidate one 123456 ESZ4

# Close all positions for an account
bun run example:liquidate all 123456

# Watch position updates in real-time
bun run example:liquidate monitor 123456
```

**What you'll see (liquidate all):**
```
🚀 Position Liquidation Tool

✅ Connected to Tradovate API

======================================================================
🔒 Liquidating ALL Positions for Account 123456
======================================================================

1️⃣  Fetching open positions...
   ✅ Found 3 open position(s):

   📈 LONG 2 x ESZ4 @ $5025.50
   📉 SHORT 1 x NQZ4 @ $19450.00
   📈 LONG 5 x MESZ4 @ $5010.25

2️⃣  Liquidating all positions...
   ✅ Liquidation orders placed!
   📋 Result: {...}

3️⃣  Waiting for fills...
   ✅ All positions closed successfully!

✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅
```

## Key Concepts

### P&L Calculation

The SDK calculates unrealized P&L using professional trading platform standards:

- **Long positions**: Use **BID** price (what you can sell at)
- **Short positions**: Use **ASK/OFFER** price (what you'd pay to buy back)

This provides a realistic P&L that accounts for the bid-ask spread.

**Formula:**
```
P&L = netPos × valuePerPoint × (currentPrice - entryPrice)
```

Where:
- `netPos`: Number of contracts (positive for long, negative for short)
- `valuePerPoint`: Dollar value per 1.0 point of price movement (from product)
- `currentPrice`: Bid (for longs) or Ask (for shorts)
- `entryPrice`: Your average entry price

### Update Modes

The P&L calculator supports different update intervals:

```typescript
// Real-time updates on every quote (highest accuracy, most CPU)
updateInterval: 'tick'

// Periodic updates (lower CPU usage)
updateInterval: 1000  // Update every 1 second
updateInterval: 5000  // Update every 5 seconds
```

### Caching

For optimal performance, especially with many positions:

```typescript
{
  useCache: true,   // Use local cache for fast startup
  lazyLoad: false   // Load positions immediately
}
```

### Filtering

Track specific accounts or symbols:

```typescript
// Track only specific accounts
calculateOpenPL({ 
  accountIds: [123456, 123457] 
})

// Track specific symbols
calculateOpenPL({ 
  symbols: ['ESZ5', 'NQZ5'] 
})
```

## Best Practices

1. **Always disconnect cleanly:**
   ```typescript
   process.on('SIGINT', async () => {
     await plCalc.stop();
     await sdk.disconnect();
     process.exit(0);
   });
   ```

2. **Handle errors gracefully:**
   ```typescript
   plCalc.on('error', error => {
     console.error('Error:', error.message);
   });
   ```

3. **Use appropriate update intervals:**
   - `'tick'` for dashboards and real-time monitoring
   - `1000-5000ms` for background processing
   - Higher intervals for reduced CPU usage

4. **Enable market data for P&L:**
   ```typescript
   const sdk = new PartnerSdk({
     preset: 'standard',
     enableMdSocket: true  // Required for P&L calculator
   });
   ```

## Troubleshooting

### "No positions with available market data"

This usually means:
1. Quotes haven't arrived yet (wait 5-10 seconds)
2. You don't have a market data subscription for the product
3. Market is closed

### "Missing required environment variables"

Make sure your `.env` file is configured correctly:
```bash
TRADE_SDK_STAGE=devel
TRADE_SDK_USERNAME=your_username
TRADE_SDK_PASSWORD=your_password
TRADE_SDK_APP_ID=your_app_id
TRADE_SDK_APP_VERSION=1.0.0
```

### P&L values don't match Tradovate

The SDK now uses bid/ask prices like Tradovate. If values still differ:
1. Enable debug mode: `DEBUG_PL=true bun run examples/realtime-pl-monitor.ts`
2. Check that you have active quotes flowing
3. Verify your entry prices match what Tradovate shows

## Next Steps

- Check the [main README](../README.md) for setup and configuration
- Review the [API Reference](../docs/public/API_REFERENCE.md) for complete documentation
- Explore the [test files](../tests/) for more usage patterns

