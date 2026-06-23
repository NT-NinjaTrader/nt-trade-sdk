/**
 * Simple P&L Calculator Example
 *
 * Demonstrates using the simplified OpenPL calculator integrated into ApiClient.
 * This example shows how to monitor real-time profit & loss for your positions.
 */

import { createConfigFromEnv, PartnerSdk } from '../index';

async function main() {
  // Initialize SDK with your credentials
  const sdk = new PartnerSdk({
    ...createConfigFromEnv(),
    syncImmediate: true,
    preset: 'standard', // Includes market data support
    enableMdSocket: true // Required for P&L calculation
  });

  // Connect to the API
  await sdk.connect();
  console.log('Connected to Tradovate API');

  try {
    // Create a P&L calculator for simulation mode
    // This will automatically subscribe to position updates and market data
    const calculator = await sdk.sim.createOpenPLCalculator({
      // Optional: filter by specific products
      // products: ['ES', 'NQ'],
      // Optional: filter by specific account IDs
      // accounts: [123456]
      updateInterval: 1000
    });

    console.log('P&L Calculator initialized');

    // Listen to real-time P&L updates
    calculator.listen(plEvent => {
      console.log(plEvent);
    });

    await new Promise(() => {});

    calculator.destroy();
    console.log('Calculator destroyed');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect from the API
    await sdk.disconnect();
    console.log('Disconnected');
  }
}

// Run the example
main().catch(console.error);
