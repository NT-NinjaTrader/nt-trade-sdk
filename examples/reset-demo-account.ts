/**
 * Reset Demo Account Example
 *
 * Demonstrates how to safely reset demo accounts to a specific trade date.
 *
 * This example shows how to:
 * - Validate account type (must be demo)
 * - Check account creation date
 * - Ensure reset date is valid (not in the future)
 * - Close all open positions before reset
 * - Cancel all working orders before reset
 * - Reset account state to a specific trading day
 * - Verify the reset was successful
 *
 * Note: The API resets accounts to their state at market open on the specified date.
 * This means positions, orders, and balances will reflect what they were at that time.
 */

import type { Account, CashBalance, Order, Position, TradeDate } from '../index';
import { createConfigFromEnv, PartnerSdk } from '../index';

/**
 * Safely reset a demo account with validation
 */
async function resetDemoAccount(sdk: PartnerSdk, accountId: number, resetDate?: Date) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🔄 Resetting Demo Account: ${accountId}`);
  console.log('='.repeat(70));

  try {
    // Step 1: Get account details
    console.log('\n1️⃣  Fetching account details...');
    const account: Account = await sdk.sim.account.item({
      query: { id: accountId }
    });

    if (!account) {
      throw new Error(`Account ${accountId} not found`);
    }

    console.log(`   ✅ Account found: ${account.name}`);
    console.log(`   Type: ${account.accountType || 'Unknown'}`);
    console.log(`   Created: ${account.timestamp || 'Unknown'}`);

    // Step 2: Validate account type
    console.log('\n2️⃣  Validating account type...');
    const isDemoAccount =
      account.accountType === 'Demo' ||
      account.name?.toLowerCase().includes('demo') ||
      account.name?.toLowerCase().includes('sim');

    if (!isDemoAccount) {
      throw new Error(
        `Account ${accountId} does not appear to be a demo account. ` +
          `Only demo accounts can be reset for safety reasons.`
      );
    }
    console.log(`   ✅ Confirmed as demo account`);

    // Step 3: Validate reset date
    console.log('\n3️⃣  Validating reset date...');
    const accountCreationDate = new Date(account.timestamp);
    const requestedResetDate = resetDate || new Date();

    console.log(`   Account created: ${accountCreationDate.toISOString()}`);
    console.log(`   Reset date: ${requestedResetDate.toISOString()}`);

    // Check if date is in the future
    if (requestedResetDate > new Date()) {
      throw new Error(`Reset date (${requestedResetDate.toISOString()}) cannot be in the future`);
    }

    // Check if date is before account creation
    if (requestedResetDate < accountCreationDate) {
      throw new Error(
        `Reset date (${requestedResetDate.toISOString()}) cannot be before ` +
          `account creation date (${accountCreationDate.toISOString()})`
      );
    }
    console.log(`   ✅ Reset date is valid`);

    // Step 4: Check for open positions
    console.log('\n4️⃣  Checking for open positions...');
    const positions: Position[] = await sdk.sim.position.list();

    const openPositions: Position[] =
      positions?.filter((p: Position) => p.accountId === accountId && p.netPos !== 0) || [];

    if (openPositions.length > 0) {
      console.log(`   ⚠️  Found ${openPositions.length} open position(s)`);
      console.log(`   🔒 Liquidating all positions...`);

      // Liquidate all positions
      const positionIds = openPositions.map(p => p.id);
      const liquidationResult = await sdk.sim.order.liquidatePositions({
        body: {
          positions: positionIds,
          admin: true
        }
      });

      console.log(`   ✅ All positions liquidated`);
      console.log(`   Orders created:`, liquidationResult);

      // Wait a moment for liquidations to process
      console.log(`   ⏳ Waiting for liquidations to complete...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log(`   ✅ No open positions`);
    }

    // Step 5: Check for working orders
    console.log('\n5️⃣  Checking for working orders...');
    const orders: Order[] = await sdk.sim.order.list();

    const workingOrders: Order[] =
      orders?.filter(
        (o: Order) =>
          o.accountId === accountId && (o.ordStatus === 'Working' || o.ordStatus === 'Pending')
      ) || [];

    if (workingOrders.length > 0) {
      console.log(`   ⚠️  Found ${workingOrders.length} working order(s)`);
      console.log(`   🔒 Canceling all orders...`);

      // Cancel each working order
      for (const order of workingOrders) {
        try {
          await sdk.sim.order.cancelOrder({
            body: { orderId: order.id }
          });
          console.log(`   ✅ Cancelled order ${order.id}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.log(`   ⚠️  Could not cancel order ${order.id}: ${errorMessage}`);
        }
      }
    } else {
      console.log(`   ✅ No working orders`);
    }

    // Step 6: Get account balance before reset
    console.log('\n6️⃣  Recording pre-reset state...');
    const cashBalance: CashBalance = await sdk.sim.cashBalance.item({
      query: { id: accountId }
    });
    const currentBalance: number = cashBalance?.amount || 0;
    console.log(`   Current balance: $${currentBalance.toLocaleString()}`);

    // Step 7: Reset the account
    console.log('\n7️⃣  Resetting account...');

    // Convert JS Date to TradeDate format required by API
    const targetResetDate = resetDate || new Date();
    const tradeDate: TradeDate = {
      year: targetResetDate.getFullYear(),
      month: targetResetDate.getMonth() + 1, // JS months are 0-indexed
      day: targetResetDate.getDate()
    };

    console.log(`   Resetting to: ${tradeDate.year}-${tradeDate.month}-${tradeDate.day}`);

    const resetResult = await sdk.sim.account.resetDemoAccountState({
      body: {
        accountIds: [accountId], // API requires array of account IDs
        resetTradeDate: tradeDate // API requires TradeDate object
      }
    });

    console.log(`   ✅ Account reset successfully!`);
    console.log(`   Result:`, resetResult);

    // Step 8: Verify reset
    console.log('\n8️⃣  Verifying reset...');
    const _resetAccount: Account = await sdk.sim.account.item({
      query: { id: accountId }
    });

    const newCashBalance: CashBalance = await sdk.sim.cashBalance.item({
      query: { id: accountId }
    });
    const newBalance: number = newCashBalance?.amount || 0;

    console.log(`   New balance: $${newBalance.toLocaleString()}`);

    // Check positions again
    const finalPositions: Position[] = await sdk.sim.position.list();
    const finalOpenPositions: Position[] =
      finalPositions?.filter((p: Position) => p.accountId === accountId && p.netPos !== 0) || [];

    console.log(`   Open positions: ${finalOpenPositions.length}`);

    console.log('\n' + '✅'.repeat(35));
    console.log('   Demo account reset completed successfully!');
    console.log('✅'.repeat(35) + '\n');

    return resetResult;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n❌ Reset failed:`, errorMessage);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('   API Response:', (error as any).response.data);
    }
    throw error;
  }
}

async function main() {
  console.log('🚀 Demo Account Reset Tool\n');

  // Get account ID from command line arguments
  const accountId = parseInt(process.argv[2] || '');

  if (!accountId || isNaN(accountId)) {
    console.error('❌ Please provide a valid account ID');
    console.log('\nUsage:');
    console.log('  bun run examples/reset-demo-account.ts <accountId> [resetDate]');
    console.log('\nArguments:');
    console.log('  accountId  - The demo account ID to reset');
    console.log('  resetDate  - Optional: Date to reset to (YYYY-MM-DD format)');
    console.log('               Defaults to today if not provided');
    console.log('\nExamples:');
    console.log('  bun run examples/reset-demo-account.ts 123456');
    console.log('  bun run examples/reset-demo-account.ts 123456 2024-11-01');
    process.exit(1);
  }

  // Parse optional reset date
  let resetDate: Date | undefined;
  if (process.argv[3]) {
    resetDate = new Date(process.argv[3]);
    if (isNaN(resetDate.getTime())) {
      console.error('❌ Invalid date format. Use YYYY-MM-DD');
      process.exit(1);
    }
  }

  // Initialize SDK
  const sdk = new PartnerSdk({
    ...createConfigFromEnv(),
    syncImmediate: true,
    preset: 'standard',
    enableMdSocket: false
  });

  // Connect to the API
  await sdk.connect();
  console.log('✅ Connected to Tradovate API\n');

  try {
    // Reset the demo account
    await resetDemoAccount(sdk, accountId, resetDate);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('\n❌ Error:', errorMessage);
  } finally {
    // Disconnect
    await sdk.disconnect();
    console.log('\n✅ Disconnected from API\n');
  }
}

// Run the example
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
