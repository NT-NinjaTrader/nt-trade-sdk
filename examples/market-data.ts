/**
 * Market Data Example
 *
 * Demonstrates how to consume real-time market data with the SDK.
 *
 * This example shows how to:
 * - Enable the market data socket
 * - Subscribe to real-time quotes (bid/ask/last)
 * - Subscribe to Depth of Market (DOM / order book)
 * - Listen for streaming updates and clean up subscriptions
 *
 * Usage:
 *   bun run examples/market-data.ts <symbol> [<symbol> ...]
 *
 * Example:
 *   bun run examples/market-data.ts ESU6 NQU6
 *
 * Notes:
 * - Symbols are front-month futures contract symbols (e.g. ESU6, NQU6, MNQU6).
 *   Update them to the current active contract month before running.
 * - Market data requires that your account is provisioned for the relevant
 *   exchange. If you see "This symbol is not available", the account is not
 *   entitled to that product's data.
 */

import type { DOMEvent, QuoteEvent } from '../index';
import { createConfigFromEnv, TradeClient } from '../index';

// Symbols to stream — pass on the command line or edit this default.
const symbols = process.argv.slice(2);
if (symbols.length === 0) {
  symbols.push('ESU6'); // <-- update to the current front-month contract
}

async function main() {
  console.log('🚀 Market Data Example\n');
  console.log(`📈 Streaming: ${symbols.join(', ')}\n`);

  // Market data requires enableMdSocket: true
  const sdk = new TradeClient({
    ...createConfigFromEnv(),
    preset: 'standard',
    enableMdSocket: true
  });

  await sdk.connect();
  console.log('✅ Connected\n');

  if (!sdk.md) {
    console.error('❌ Market data client unavailable. Set enableMdSocket: true.');
    await sdk.disconnect();
    process.exit(1);
  }

  const md = sdk.md;

  // ===================================================================
  // 1. Listen for streaming updates
  // ===================================================================

  // Throttle quote logging so a fast tape stays readable.
  const lastLogged = new Map<number, number>();

  const quoteListener = md.listen('quote', (event: QuoteEvent) => {
    for (const quote of event.quotes) {
      const now = Date.now();
      if (now - (lastLogged.get(quote.contractId) ?? 0) < 1000) continue;
      lastLogged.set(quote.contractId, now);

      const bid = quote.entries.Bid?.price;
      const ask = quote.entries.Offer?.price;
      const last = quote.entries.Trade?.price;
      console.log(
        `💱 [${quote.contractId}] bid ${bid ?? '—'} / ask ${ask ?? '—'}  last ${last ?? '—'}`
      );
    }
  });

  const domListener = md.listen('dom', (event: DOMEvent) => {
    for (const dom of event.doms) {
      const topBid = dom.bids[0];
      const topOffer = dom.offers[0];
      console.log(
        `📖 [${dom.contractId}] DOM  best bid ${topBid?.price ?? '—'} x ${topBid?.size ?? 0}` +
          `  |  best ask ${topOffer?.price ?? '—'} x ${topOffer?.size ?? 0}`
      );
    }
  });

  // ===================================================================
  // 2. Subscribe to quotes and DOM for each symbol
  // ===================================================================
  for (const symbol of symbols) {
    try {
      await md.quote.subscribe({ symbol });
      await md.dom.subscribe({ symbol });
      console.log(`   ✅ Subscribed: ${symbol}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`   ❌ Failed to subscribe ${symbol}:`, message);
    }
  }

  console.log('\n💡 Streaming market data. Press Ctrl+C to exit...\n');

  // ===================================================================
  // 3. Graceful shutdown — unsubscribe, unlisten, disconnect
  // ===================================================================
  process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down...');
    quoteListener.unlisten();
    domListener.unlisten();

    for (const symbol of symbols) {
      try {
        await md.quote.unsubscribe(symbol);
        await md.dom.unsubscribe(symbol);
      } catch {
        // ignore unsubscribe errors during shutdown
      }
    }

    await sdk.disconnect();
    console.log('✅ Disconnected\n');
    process.exit(0);
  });

  // Keep the process alive while streaming.
  await new Promise(() => {});
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
