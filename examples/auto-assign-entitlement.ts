/**
 * Auto-Assign Entitlements Example
 *
 * Demonstrates automatic entitlement assignment when users sign
 * the non-professional market data agreement.
 *
 * This example shows how to:
 * - Listen for OtherEnvAdminAlertSignal events
 * - Extract username from alert text
 * - Find user ID by username
 * - Search for entitlement by name
 * - Assign entitlement subscription to user
 */

import type { Entitlement, EventType, User, UserPlugin } from '../index';
import { createConfigFromEnv, PartnerSdk } from '../index';

async function main() {
  console.log('🚀 Starting Auto-Entitlement Assignment Monitor...\n');

  // Initialize SDK with socket support for event listening
  const sdk = new PartnerSdk({
    ...createConfigFromEnv(),
    syncImmediate: true,
    preset: 'standard',
    enableMdSocket: false // Not needed for this example
  });

  // Connect to the API
  await sdk.connect();
  console.log('✅ Connected to Tradovate API\n');

  try {
    // Search for the simulationPlan entitlement
    // Note: The ID varies by environment, so we search by name
    console.log('🔍 Searching for "simulationPlan" entitlement...');
    const allEntitlements = await sdk.live.entitlement.list();
    const entitlement: Entitlement | undefined = allEntitlements.find(
      (e: Entitlement) => e.name === 'simulationPlan'
    );

    if (!entitlement) {
      console.error('❌ simulationPlan entitlement not found in this environment');
      return;
    }

    console.log(`✅ Found entitlement: ${entitlement.name} (ID: ${entitlement.id})\n`);

    // Listen for OtherEnvAdminAlertSignal events
    console.log('👂 Listening for non-pro market data agreement signatures...\n');
    console.log('─'.repeat(70));

    const listener = sdk.sim.listen('OtherEnvAdminAlertSignal', async (event: EventType) => {
      try {
        const alert = event.entity as any; // Alert type varies, using any here
        console.log(`\n📢 Alert received: ${alert.text}`);

        // Check if this is a non-pro market data agreement signature
        if (alert.text && alert.text.includes('signed') && alert.text.includes('agreement')) {
          // Extract username - typically the second word in the alert text
          // Example: "User john_doe signed the non-professional market data agreement"
          const words = alert.text.split(' ');
          const username = words[1]; // Second word is typically the username

          console.log(`   👤 Username extracted: ${username}`);

          // Find the user by username
          console.log(`   🔍 Looking up user ID...`);
          const user: User = await sdk.sim.user.find({
            query: { name: username }
          });

          if (!user) {
            console.error(`   ❌ User not found: ${username}`);
            return;
          }

          console.log(`   ✅ Found user: ${user.name} (ID: ${user.id})`);

          // Check if user already has the entitlement
          const existingEntitlements: UserPlugin[] = await sdk.sim.userPlugin.list();

          const hasEntitlement = existingEntitlements?.some(
            (plugin: UserPlugin) => plugin.entitlementId === entitlement.id
          );

          if (hasEntitlement) {
            console.log(`   ℹ️  User already has simulationPlan entitlement`);
            return;
          }

          // Assign the entitlement subscription
          console.log(`   🎁 Assigning simulationPlan entitlement...`);
          const result = await sdk.sim.userPlugin.addEntitlementSubscription({
            body: {
              userId: user.id,
              entitlementId: entitlement.id,
              nonProSigned: true // Required: user has signed non-pro agreement
            }
          });

          console.log(`   ✅ Entitlement assigned successfully!`);
          console.log(`   📋 Subscription details:`, result);
        }
      } catch (error: any) {
        console.error(`   ❌ Error processing alert:`, error.message);
      }

      console.log('─'.repeat(70));
    });

    // Keep the process running
    console.log('\n💡 Monitor is running. Press Ctrl+C to exit...\n');

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down gracefully...');
      listener.unlisten();
      await sdk.disconnect();
      console.log('✅ Disconnected. Goodbye!\n');
      process.exit(0);
    });

    // Keep alive
    await new Promise(() => {});
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Run the example
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
