/**
 * Liquidate Positions Example
 *
 * Demonstrates how to close open positions for risk management.
 *
 * This example shows how to:
 * - Get all open positions for an account
 * - Liquidate a specific position by symbol
 * - Liquidate all positions at once
 * - Monitor liquidation progress
 * - Handle liquidation errors
 */

import type { Contract, EventType, Position } from '../index';
import { createConfigFromEnv, TradeClient } from '../index';

/**
 * Display position information
 */
function displayPosition(position: Position, contract: Contract): void {
  const direction = position.netPos > 0 ? '📈 LONG' : '📉 SHORT';
  const qty = Math.abs(position.netPos);
  console.log(`   ${direction} ${qty} x ${contract.name} @ $${position.netPrice}`);
}

/**
 * Liquidate a specific position by symbol
 */
async function liquidatePosition(sdk: TradeClient, accountId: number, symbol: string) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🔒 Liquidating Position: ${symbol} for Account ${accountId}`);
  console.log('='.repeat(70));

  try {
    // Get the position
    console.log('\n1️⃣  Finding position...');
    const positions: Position[] = await sdk.sim.position.list();

    const position: Position | undefined = positions?.find(
      (p: Position) => p.accountId === accountId && p.netPos !== 0
    );

    if (!position) {
      throw new Error(`No open position found for ${symbol}`);
    }

    // Get contract details
    const contract: Contract = await sdk.sim.contract.item({
      query: { id: position.contractId }
    });

    console.log(`   ✅ Found position:`);
    displayPosition(position, contract);

    // Liquidate the position
    console.log('\n2️⃣  Liquidating position...');
    const result = await sdk.sim.order.liquidatePosition({
      body: {
        accountId: accountId,
        contractId: position.contractId,
        admin: false
      }
    });

    console.log(`   ✅ Liquidation order placed!`);
    console.log(`   📋 Order ID:`, (result as any).orderId || (result as any).id);
    console.log(`   📋 Details:`, result);

    // Wait a moment for order to fill
    console.log('\n3️⃣  Waiting for fill...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify position is closed
    const updatedPositions: Position[] = await sdk.sim.position.list();

    const stillOpen: Position | undefined = updatedPositions?.find(
      (p: Position) => p.contractId === position.contractId && p.netPos !== 0
    );

    if (stillOpen) {
      console.log(`   ⚠️  Position may still be open (netPos: ${stillOpen.netPos})`);
    } else {
      console.log(`   ✅ Position closed successfully!`);
    }

    console.log('\n' + '✅'.repeat(35) + '\n');
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n❌ Liquidation failed:`, errorMessage);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('   API Response:', (error as any).response.data);
    }
    throw error;
  }
}

/**
 * Liquidate all positions for an account
 */
async function liquidateAllPositions(sdk: TradeClient, accountId: number) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🔒 Liquidating ALL Positions for Account ${accountId}`);
  console.log('='.repeat(70));

  try {
    // Get all open positions
    console.log('\n1️⃣  Fetching open positions...');
    const positions: Position[] = await sdk.sim.position.list();

    const openPositions: Position[] =
      positions?.filter((p: Position) => p.accountId === accountId && p.netPos !== 0) || [];

    if (openPositions.length === 0) {
      console.log(`   ℹ️  No open positions to liquidate`);
      return;
    }

    console.log(`   ✅ Found ${openPositions.length} open position(s):\n`);

    // Display all positions
    for (const position of openPositions) {
      const contract: Contract = await sdk.sim.contract.item({
        query: { id: position.contractId }
      });
      displayPosition(position, contract);
    }

    // Confirm before liquidating (in a real app, you might want user confirmation)
    console.log('\n2️⃣  Liquidating all positions...');

    // Liquidate all positions at once
    const positionIds = openPositions.map(p => p.id);
    const result = await sdk.sim.order.liquidatePositions({
      body: {
        positions: positionIds,
        admin: false
      }
    });

    console.log(`   ✅ Liquidation orders placed!`);
    console.log(`   📋 Result:`, result);

    // Wait for orders to fill
    console.log('\n3️⃣  Waiting for fills...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verify all positions are closed
    const updatedPositions: Position[] = await sdk.sim.position.list();

    const stillOpenPositions: Position[] =
      updatedPositions?.filter((p: Position) => p.netPos !== 0) || [];

    if (stillOpenPositions.length > 0) {
      console.log(`   ⚠️  ${stillOpenPositions.length} position(s) may still be open`);
      for (const position of stillOpenPositions) {
        const contract: Contract = await sdk.sim.contract.item({
          query: { id: position.contractId }
        });
        displayPosition(position, contract);
      }
    } else {
      console.log(`   ✅ All positions closed successfully!`);
    }

    console.log('\n' + '✅'.repeat(35) + '\n');
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n❌ Liquidation failed:`, errorMessage);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('   API Response:', (error as any).response.data);
    }
    throw error;
  }
}

/**
 * Monitor positions in real-time
 */
async function monitorPositions(sdk: TradeClient, accountId: number) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`👀 Monitoring Positions for Account ${accountId}`);
  console.log('='.repeat(70) + '\n');

  // Listen for position updates
  const listener = sdk.sim.listen('position', async (event: EventType) => {
    try {
      const position = event.entity as Position;

      if (position.accountId !== accountId) {
        return; // Skip positions for other accounts
      }

      const contract: Contract = await sdk.sim.contract.item({
        query: { id: position.contractId }
      });

      console.log(`📊 Position Update:`);
      displayPosition(position, contract);
      console.log(`   Net P&L: $${position.netPrice || 0}`);
      console.log('─'.repeat(70));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`   ❌ Error processing position update:`, errorMessage);
    }
  });

  console.log('💡 Monitor is running. Press Ctrl+C to exit...\n');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down...');
    listener.unlisten();
    await sdk.disconnect();
    console.log('✅ Disconnected\n');
    process.exit(0);
  });

  // Keep alive
  await new Promise(() => {});
}

async function main() {
  console.log('🚀 Position Liquidation Tool\n');

  // Parse command line arguments
  const command = process.argv[2]; // 'one', 'all', or 'monitor'
  const accountId = parseInt(process.argv[3] || '');
  const symbol = process.argv[4]; // Only for 'one' command

  if (!command || !accountId || isNaN(accountId)) {
    console.error('❌ Invalid arguments');
    console.log('\nUsage:');
    console.log('  Liquidate one position:');
    console.log('    bun run examples/liquidate-positions.ts one <accountId> <symbol>');
    console.log('\n  Liquidate all positions:');
    console.log('    bun run examples/liquidate-positions.ts all <accountId>');
    console.log('\n  Monitor positions:');
    console.log('    bun run examples/liquidate-positions.ts monitor <accountId>');
    console.log('\nExamples:');
    console.log('  bun run examples/liquidate-positions.ts one 123456 ESZ4');
    console.log('  bun run examples/liquidate-positions.ts all 123456');
    console.log('  bun run examples/liquidate-positions.ts monitor 123456');
    process.exit(1);
  }

  // Initialize SDK
  const sdk = new TradeClient({
    ...createConfigFromEnv(),
    syncImmediate: true,
    preset: 'standard',
    enableMdSocket: false
  });

  // Connect to the API
  await sdk.connect();
  console.log('✅ Connected to Tradovate API\n');

  try {
    switch (command) {
      case 'one':
        if (!symbol) {
          console.error('❌ Symbol required for "one" command');
          process.exit(1);
        }
        await liquidatePosition(sdk, accountId, symbol);
        break;

      case 'all':
        await liquidateAllPositions(sdk, accountId);
        break;

      case 'monitor':
        await monitorPositions(sdk, accountId);
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('Valid commands: one, all, monitor');
        process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('\n❌ Error:', errorMessage);
  } finally {
    if (command !== 'monitor') {
      // Disconnect (monitor handles its own disconnection)
      await sdk.disconnect();
      console.log('✅ Disconnected from API\n');
    }
  }
}

// Run the example
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
