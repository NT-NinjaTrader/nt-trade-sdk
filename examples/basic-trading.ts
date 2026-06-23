/**
 * Basic Trading Example
 *
 * Demonstrates fundamental operations with the SDK.
 *
 * This example shows how to:
 * - Connect to the API
 * - Get account information
 * - View positions and orders
 * - Look up contract information
 * - Place orders (safely commented out)
 */

import type { Account, CashBalance, Contract, Order, Position, Product } from '../index';
import { createConfigFromEnv, PartnerSdk } from '../index';

async function main() {
  console.log('🚀 Basic Trading Operations Example\n');

  // Initialize SDK
  const sdk = new PartnerSdk({
    ...createConfigFromEnv(),
    syncImmediate: true,
    preset: 'standard',
    enableMdSocket: true
  });

  // Connect to the API
  console.log('📡 Connecting to Tradovate API...');
  await sdk.connect();
  console.log('✅ Connected!\n');

  try {
    // ===================================================================
    // 1. Get Account Information
    // ===================================================================
    console.log('1️⃣  Getting Account Information\n');
    console.log('─'.repeat(70));

    // Get the current user
    const me = await sdk.sim.auth.me();
    console.log(`👤 User: ${me.name} (ID: ${me.userId})`);

    // Get accounts - using items() for specific accounts
    // For prop firms: avoid .list() and use .items() with specific IDs
    const accounts: Account[] = await sdk.sim.account.list();

    if (accounts && accounts.length > 0) {
      console.log(`\n📊 Found ${accounts.length} account(s):\n`);

      for (const account of accounts.slice(0, 3)) {
        // Show first 3
        console.log(`   Account: ${account.name} (ID: ${account.id})`);

        // Get cash balance
        const cashBalance: CashBalance = await sdk.sim.cashBalance.item({
          query: { id: account.id }
        });

        if (cashBalance) {
          console.log(`   Balance: $${cashBalance.amount?.toLocaleString() || 0}`);
        }

        console.log();
      }
    } else {
      console.log('   ℹ️  No accounts found\n');
    }

    // ===================================================================
    // 2. View Positions
    // ===================================================================
    console.log('─'.repeat(70));
    console.log('\n2️⃣  Viewing Positions\n');
    console.log('─'.repeat(70));

    const positions: Position[] = await sdk.sim.position.list();
    const openPositions: Position[] = positions?.filter(p => p.netPos !== 0) || [];

    if (openPositions.length > 0) {
      console.log(`\n📈 Found ${openPositions.length} open position(s):\n`);

      for (const position of openPositions) {
        const contract: Contract = await sdk.sim.contract.item({
          query: { id: position.contractId }
        });

        const direction: string = position.netPos > 0 ? 'LONG' : 'SHORT';
        const qty: number = Math.abs(position.netPos);

        console.log(`   ${direction} ${qty} x ${contract.name}`);
        console.log(`   Entry: $${position.netPrice}`);
        console.log(`   Account ID: ${position.accountId}`);
        console.log();
      }
    } else {
      console.log('   ℹ️  No open positions\n');
    }

    // ===================================================================
    // 3. View Orders
    // ===================================================================
    console.log('─'.repeat(70));
    console.log('\n3️⃣  Viewing Orders\n');
    console.log('─'.repeat(70));

    const orders: Order[] = await sdk.sim.order.list();
    const workingOrders: Order[] =
      orders?.filter(o => o.ordStatus === 'Working' || o.ordStatus === 'Pending') || [];

    if (workingOrders.length > 0) {
      console.log(`\n📋 Found ${workingOrders.length} working order(s):\n`);

      for (const order of workingOrders) {
        console.log(`   Order ID: ${order.id}`);
        console.log(`   Action: ${order.action}`);
        console.log(`   Status: ${order.ordStatus}`);
        console.log();
      }
    } else {
      console.log('   ℹ️  No working orders\n');
    }

    // ===================================================================
    // 4. Look Up Contract Information
    // ===================================================================
    console.log('─'.repeat(70));
    console.log('\n4️⃣  Looking Up Contract Information\n');
    console.log('─'.repeat(70));

    // Search for ES (E-mini S&P 500) contracts
    console.log('\n🔍 Searching for ES contracts...\n');

    const esProduct: Product = await sdk.sim.product.find({
      query: { name: 'ES' }
    });

    const currencies = await sdk.sim.currency.list();

    if (esProduct) {
      console.log(`   Product: ${esProduct.name}`);
      console.log(`   Description: ${esProduct.description || 'N/A'}`);
      console.log(
        `   Currency: ${currencies.find(c => c.id === esProduct.currencyId)?.name || 'USD'}`
      );
      console.log(`   Value per point: $${esProduct.valuePerPoint || 'N/A'}`);
      console.log();
    }

    // ===================================================================
    // 5. Example Order Placement (COMMENTED OUT FOR SAFETY)
    // ===================================================================
    console.log('─'.repeat(70));
    console.log('\n5️⃣  Order Placement Example (COMMENTED OUT)\n');
    console.log('─'.repeat(70));
    console.log('\n⚠️  Order placement is commented out for safety.');
    console.log('   Uncomment and modify the code below to place orders:\n');

    console.log(`
   // Example: Place a limit order
   const order = await sdk.sim.order.placeOrder({
     body: {
       accountId: 123456,           // Your account ID
       accountSpec: user.name,      // Your username
       symbol: 'ESZ4',              // Contract symbol
       orderQty: 1,                 // Quantity
       orderType: 'Limit',          // Order type
       price: 5000.00,              // Limit price
       action: 'Buy',               // Buy or Sell
       isAutomated: true            // Mark as automated
     }
   });
   console.log('Order placed:', order.orderId);
    `);

    // Uncomment below to actually place an order
    /*
    if (accounts && accounts.length > 0) {
      const accountId = accounts[0].id;
      
      console.log('⚠️  PLACING ACTUAL ORDER (DEMO/SIM ONLY)...\n');
      
      const order = await sdk.sim.order.placeOrder({
        body: {
          accountId: accountId,
          accountSpec: user.name,
          symbol: 'MESZ4',        // Micro E-mini S&P 500
          orderQty: 1,
          orderType: 'Limit',
          price: 5000.00,
          action: 'Buy',
          isAutomated: true
        }
      });
      
      console.log('✅ Order placed successfully!');
      console.log('   Order ID:', order.orderId || order.id);
      console.log('   Status:', order.ordStatus);
      console.log();
    }
    */

    // ===================================================================
    // 6. Real-time Event Listening
    // ===================================================================
    console.log('\n─'.repeat(70));
    console.log('\n6️⃣  Real-time Event Listening Example\n');
    console.log('─'.repeat(70));
    console.log('\n💡 You can listen to real-time events using sdk[env].listen():\n');

    console.log(`
   // Listen to position updates
   const positionListener = sdk.sim.listen('position', (event) => {
     const position = event.entity;
     console.log('Position update:', position);
   });
   
   // Listen to order updates
   const orderListener = sdk.sim.listen('order', (event) => {
     const order = event.entity;
     console.log('Order update:', order);
   });
   
   // Don't forget to cleanup
   positionListener.unlisten();
   orderListener.unlisten();
    `);

    console.log('─'.repeat(70));
    console.log('\n✅ Basic operations completed successfully!\n');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('\n❌ Error:', errorMessage);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('   Response:', (error as any).response.data);
    }
  } finally {
    // Disconnect
    await sdk.disconnect();
    console.log('✅ Disconnected from API\n');
  }
}

// Run the example
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
