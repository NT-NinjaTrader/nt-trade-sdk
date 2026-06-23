# Vendor Operations Guide

This guide covers common operations that prop firm vendors and administrators perform using the Trade SDK. These examples demonstrate real-world scenarios and best practices.

## Quick Start

All examples can be run using bun:

```bash
# Auto-assign entitlements
bun run example:entitlement

# Monitor and switch risk categories
bun run example:risk

# Reset a demo account
bun run example:reset <accountId>

# Liquidate positions
bun run example:liquidate <command> <accountId> [symbol]
```

## Examples Overview

### 1. Auto-Assign Entitlements

**File:** `auto-assign-entitlement.ts`  
**Script:** `bun run example:entitlement`

Automatically assigns the `simulationPlan` entitlement when users sign the non-professional market data agreement.

**Key Features:**
- Real-time event monitoring
- Automatic user lookup
- Environment-agnostic entitlement search
- Duplicate prevention

**How It Works:**
1. Searches for the `simulationPlan` entitlement by name
2. Listens for `OtherEnvAdminAlertSignal` events
3. Extracts username from alert text
4. Looks up user ID by username
5. Checks for existing entitlements
6. Assigns entitlement with non-pro status

**Use Cases:**
- Automated onboarding workflows
- Market data subscription management
- Compliance automation

### 2. Switch Risk Category

**File:** `switch-risk-category.ts`  
**Script:** `bun run example:risk`

Automatically switches account risk categories based on account balance thresholds.

**Key Features:**
- Configurable scaling rules
- Real-time balance monitoring
- Automatic risk category transitions
- State tracking

**Configuration:**
Edit the `SCALING_RULES` array to define your tiers:

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
  // Add more tiers...
];
```

**Use Cases:**
- Progressive scaling programs
- Performance-based tier upgrades
- Risk-based account management
- Automated challenge progression

### 3. Reset Demo Account

**File:** `reset-demo-account.ts`  
**Script:** `bun run example:reset <accountId>`

Safely resets demo accounts with comprehensive validation and cleanup.

**Key Features:**
- Account type validation
- Creation date verification
- Automatic position liquidation
- Working order cancellation
- Post-reset verification

**Safety Checks:**
1. Validates account is demo/simulation only
2. Ensures reset date is not before account creation
3. Liquidates all open positions first
4. Cancels all working orders
5. Verifies reset completion

**Use Cases:**
- Challenge resets
- Account recycling
- Testing and development
- Educational training resets

**Example:**
```bash
# Reset demo account 123456
bun run example:reset 123456
```

### 4. Liquidate Positions

**File:** `liquidate-positions.ts`  
**Script:** `bun run example:liquidate <command> <accountId> [symbol]`

Close open positions for risk management and account maintenance.

**Commands:**

**Liquidate one position:**
```bash
bun run example:liquidate one 123456 ESZ4
```

**Liquidate all positions:**
```bash
bun run example:liquidate all 123456
```

**Monitor positions:**
```bash
bun run example:liquidate monitor 123456
```

**Key Features:**
- Single position liquidation by symbol
- Bulk position liquidation
- Real-time position monitoring
- Liquidation verification
- Detailed progress reporting

**Use Cases:**
- End-of-day risk management
- Challenge rule violations
- Account closure procedures
- Emergency liquidations
- Drawdown limit enforcement

## Best Practices

### Event Listening

When monitoring events, always implement graceful shutdown:

```typescript
const listener = sdk.sim.listen('entityType', callback);

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  listener.unlisten();
  await sdk.disconnect();
  process.exit(0);
});
```

### Error Handling

Always wrap operations in try-catch blocks:

```typescript
try {
  const result = await sdk.sim.someOperation();
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error.message);
  if (error.response) {
    console.error('API Response:', error.response.data);
  }
}
```

### Account Safety

Always validate account types before destructive operations:

```typescript
const account = await sdk.sim.account.item({ query: { id: accountId } });

const isDemoAccount = 
  account.accountType === 'Demo' ||
  account.name?.toLowerCase().includes('demo');

if (!isDemoAccount) {
  throw new Error('Operation only allowed on demo accounts');
}
```

### Rate Limiting

For bulk operations, consider rate limiting:

```typescript
// Process accounts in batches
const BATCH_SIZE = 10;
for (let i = 0; i < accountIds.length; i += BATCH_SIZE) {
  const batch = accountIds.slice(i, i + BATCH_SIZE);
  await Promise.all(batch.map(id => processAccount(id)));
  
  // Wait between batches
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

## Common Patterns

### Finding Entities by Name

When IDs vary by environment, search by name:

```typescript
// Find entitlement by name
const entitlement = await sdk.sim.entitlement.find({
  query: { name: 'simulationPlan' }
});

// Find user by username
const user = await sdk.sim.user.find({
  query: { name: username }
});

// Find product by name
const product = await sdk.sim.product.find({
  query: { name: 'ES' }
});
```

### Monitoring Multiple Event Types

You can listen to multiple event types simultaneously:

```typescript
const listeners = [];

// Listen to accounts
listeners.push(sdk.sim.listen('account', handleAccount));

// Listen to positions
listeners.push(sdk.sim.listen('position', handlePosition));

// Listen to orders
listeners.push(sdk.sim.listen('order', handleOrder));

// Cleanup all listeners
process.on('SIGINT', () => {
  listeners.forEach(l => l.unlisten());
});
```

### Bulk Operations

Process multiple items with proper error handling:

```typescript
const results = [];
const errors = [];

for (const accountId of accountIds) {
  try {
    const result = await processAccount(accountId);
    results.push({ accountId, success: true, result });
  } catch (error) {
    errors.push({ accountId, error: error.message });
  }
}

console.log(`Successful: ${results.length}`);
console.log(`Failed: ${errors.length}`);
```

## Troubleshooting

### "User not found"

- Verify username spelling and case sensitivity
- Check that user exists in the current environment
- Ensure you have permission to query users

### "Entitlement not found"

- Verify entitlement name matches exactly
- Check entitlement exists in current environment
- Confirm entitlement is active and available

### "Account reset failed"

- Ensure account is a demo/simulation account
- Verify all positions are closed
- Check all orders are cancelled
- Confirm reset date is valid

### "Position liquidation timeout"

- Market may be closed
- Check for sufficient liquidity
- Verify account has no trading restrictions
- Check if position is locked for other reasons

## Security Considerations

### Admin Operations

Most vendor operations require admin-level access. Ensure:
- Credentials have appropriate permissions
- Operations are logged for audit purposes
- Sensitive data is handled securely

### Demo Account Protection

Always validate account types before:
- Resetting accounts
- Bulk liquidations
- Risk category changes
- Any destructive operations

### Rate Limiting

Respect API rate limits:
- Use the SDK's built-in rate limiting
- Implement exponential backoff
- Monitor rate limit violations
- Batch operations when possible

## Support

For questions or issues:
1. Check the main [README](../README.md)
2. Review the [API Reference](../docs/public/API_REFERENCE.md)
3. Examine [test files](../tests/) for more patterns
4. Contact your integration support team








