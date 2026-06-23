/**
 * Switch Risk Category Example
 *
 * Demonstrates how to automatically switch account risk categories
 * based on scaling conditions (typically account balance).
 *
 * This example shows how to:
 * - Retrieve risk categories from the API
 * - Monitor account balance changes
 * - Switch risk categories when conditions are met
 */

import type { Account, CashBalance, EventType, RiskCategory } from '../index';
import { createConfigFromEnv, PartnerSdk } from '../index';

interface ScalingRule {
  category: RiskCategory;
  minBalance: number;
  maxBalance: number;
}

async function main() {
  console.log('🚀 Starting Risk Category Monitor...\n');

  const sdk = new PartnerSdk({
    ...createConfigFromEnv(),
    syncImmediate: true,
    preset: 'standard',
    enableMdSocket: false
  });

  await sdk.connect();
  console.log('✅ Connected to Tradovate API\n');

  try {
    // Fetch risk categories from the API
    console.log('📊 Fetching risk categories from API...\n');
    const riskCategories = await sdk.sim.riskCategory.list();

    if (!riskCategories.length) {
      console.log('⚠️  No risk categories found. Exiting.');
      await sdk.disconnect();
      return;
    }

    // Sort categories by riskCredit (balance threshold) ascending
    const sortedCategories = [...riskCategories].sort(
      (a, b) => (a.riskCredit ?? 0) - (b.riskCredit ?? 0)
    );

    // Build scaling rules from categories
    // Each category's riskCredit represents the minimum balance for that tier
    const scalingRules: ScalingRule[] = sortedCategories.map((category, index) => ({
      category,
      minBalance: category.riskCredit ?? 0,
      maxBalance: sortedCategories[index + 1]?.riskCredit ?? Infinity
    }));

    // Display fetched categories
    console.log('📋 Risk Categories:\n');
    scalingRules.forEach(rule => {
      const maxStr = rule.maxBalance === Infinity ? '∞' : `$${rule.maxBalance.toLocaleString()}`;
      console.log(
        `   ${rule.category.name.padEnd(20)} ID: ${String(rule.category.id).padEnd(4)} ` +
          `Balance: $${rule.minBalance.toLocaleString().padEnd(10)} - ${maxStr}`
      );
    });
    console.log('\n' + '─'.repeat(70) + '\n');

    // Determine target category based on balance
    const determineRiskCategory = (balance: number): ScalingRule | undefined =>
      scalingRules.find(rule => balance >= rule.minBalance && balance < rule.maxBalance);

    // Track previous categories to detect changes
    const accountRiskCategories = new Map<number, number>();

    console.log('👂 Monitoring account balance changes...\n');

    const balanceListener = sdk.sim.listen('cashBalance', async (event: EventType) => {
      try {
        const cashBalance = event.entity as CashBalance;
        const accountId = cashBalance.accountId;
        const currentBalance = cashBalance.amount ?? 0;

        const account: Account = await sdk.sim.account.item({ query: { id: accountId } });
        if (!account) {
          console.log(`   ⚠️  Account ${accountId} not found`);
          return;
        }

        const currentRiskCategoryId = account.riskCategoryId;
        accountRiskCategories.set(accountId, currentRiskCategoryId);

        const targetRule = determineRiskCategory(currentBalance);
        if (!targetRule) {
          console.log(`   ⚠️  No risk category matched for balance $${currentBalance}`);
          return;
        }

        const currentCategory = riskCategories.find(
          (c: RiskCategory) => c.id === currentRiskCategoryId
        );
        console.log(
          `💰 Account ${account.name} (ID: ${accountId}): Balance = $${currentBalance.toLocaleString()}`
        );
        console.log(
          `   Current: ${currentCategory?.name ?? 'Unknown'} (ID: ${currentRiskCategoryId})`
        );
        console.log(`   Target:  ${targetRule.category.name} (ID: ${targetRule.category.id})`);

        if (currentRiskCategoryId !== targetRule.category.id) {
          console.log(
            `   🔄 Switching: ${currentCategory?.name ?? currentRiskCategoryId} → ${targetRule.category.name}...`
          );

          const result = await sdk.sim.accountRiskStatus.switchRiskCategory({
            body: { accountIds: [account.id], riskCategoryId: targetRule.category.id }
          });

          console.log(`   ✅ Risk category switched!`);
          console.log(`   📋 Result:`, result);
          accountRiskCategories.set(accountId, targetRule.category.id);
        } else {
          console.log(`   ✓ Already in correct risk category`);
        }

        console.log('─'.repeat(70) + '\n');
      } catch (error: any) {
        console.error(`   ❌ Error processing balance update:`, error.message);
        error.response && console.error('   Response:', error.response.data);
        console.log('─'.repeat(70) + '\n');
      }
    });

    const accountListener = sdk.sim.listen('account', async (event: EventType) => {
      const account = event.entity as Account;
      console.log(`📊 Account update: ${account.name} (ID: ${account.id})`);
    });

    console.log('💡 Monitor is running. Press Ctrl+C to exit...\n');

    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down gracefully...');
      balanceListener.unlisten();
      accountListener.unlisten();
      await sdk.disconnect();
      console.log('✅ Disconnected. Goodbye!\n');
      process.exit(0);
    });

    await new Promise(() => {});
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    error.response && console.error('   Response:', error.response.data);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
