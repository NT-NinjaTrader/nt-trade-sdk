import type { TradeClient } from '.';
import type { Account, Contract, Position, Product, Quote } from '../index';

export interface PLListener {
  unlisten: () => void;
}

export interface Calculator {
  listen: (callback: (pl: PLEvent) => void) => PLListener;
  destroy: () => void;
}

export interface CalculatorConfig {
  products?: string[];
  accounts?: number[];
  updateInterval?: number | 'tick';
}

interface PLEvent {
  totalPL: number;
  allPositions: Record<string, number>;
}

interface PLSubscriber {
  callback: (pl: PLEvent) => void;
  unsubscribe: () => void;
}

export const OpenPLCalculator = async (
  sdk: TradeClient,
  mode: 'sim' | 'live',
  config: CalculatorConfig
) => {
  let lastTs = 0;
  const client = sdk[mode];
  const subscribers: PLSubscriber[] = [];
  const positions: Record<string, Position> = {};
  const contracts: Record<string, Contract> = {};
  const products: Record<string, Product> = {};
  const quotes: Record<string, { symbol: string }> = {};
  const pls: Record<string, number> = {};

  let accounts: Account[] = [];
  const initialPositions = await client.position.list();
  initialPositions.forEach(pos => (positions[pos.id] = pos));

  const initialContracts = initialPositions.reduce((a, b) => {
    a.add(b.contractId);
    return a;
  }, new Set());

  let reifiedContracts = await client.contract.items({
    query: { ids: Array.from(initialContracts.values()) as number[] }
  });

  if (config.products && config.products.length > 0) {
    reifiedContracts = reifiedContracts.filter(c => config.products!.includes(c.name.slice(0, -2)));
  }

  reifiedContracts.forEach(c => (contracts[c.id] = c));

  const productNames = Object.values(contracts).reduce(
    (a, b) => a.concat(b.name.slice(0, -2)),
    [] as string[]
  );

  for (const pname of productNames) {
    products[pname] = await client.product.find({
      query: { name: pname }
    });
  }

  if (config.accounts && config.accounts.length > 0) {
    accounts = await client.account.items({
      query: { ids: config.accounts }
    });
  } else if (initialPositions) {
    const detectedSet = new Set();
    initialPositions.forEach(pos => detectedSet.add(pos.accountId));
    const ids = Array.from(detectedSet.values()) as number[];
    accounts = await client.account.items({ query: { ids } });
  } else {
    accounts = await client.account.list();
  }
  if (accounts.length === 0) {
    // No accounts found - caller should verify configuration
  }

  const positionListener = sdk[mode].listen('position', async e => {
    const position = e.entity as Position;
    positions[position.id] = position;
    if (!contracts[position.contractId]) {
      const contract = await client.contract.item({
        query: { id: position.contractId }
      });
      contracts[position.contractId] = contract;
      const productName = contract.name.slice(0, -2);
      const product = await client.product.find({
        query: { name: productName }
      });
      products[productName] = product;
    }
    const name = contracts[position.contractId]?.name;
    if (name && !quotes[name]) {
      quotes[name] = await sdk.md!.quote.subscribe({ symbol: name });
    }
  });

  // Subscribe to quotes for all contracts
  await Promise.all(
    Object.values(contracts).map(async c => {
      const quoteResponse = await sdk.md!.quote.subscribe({
        symbol: c.name
      });
      // Store subscription info by symbol
      quotes[quoteResponse.symbol] = quoteResponse;
    })
  );

  sdk.md!.listen('quote', e => {
    const now = Date.now();
    if (
      config.updateInterval &&
      config.updateInterval !== 'tick' &&
      now - lastTs < config.updateInterval
    )
      return;

    lastTs = now;
    const nextPls: Record<string, number> = {};
    for (const quote of e.quotes) {
      const contract = contracts[`${quote.contractId}`];
      if (!contract) continue;
      const pname = contract.name.slice(0, -2);
      const product = products[pname];
      if (!product) continue;
      const relatedPositions = Object.values(positions).filter(p => p.contractId === contract.id);
      nextPls[pname] = relatedPositions
        .map(pos => calculatePL(pos, product, quote))
        .reduce((a, b) => a + b, 0);
      pls[pname] = nextPls[pname];
    }

    for (const sub of subscribers) {
      sub.callback({
        totalPL: Object.values(pls).reduce((a, b) => a + b, 0),
        allPositions: pls
      });
    }
  });

  const listen = (callback: (pl: PLEvent) => void) => {
    const subscriber = {
      callback,
      unsubscribe: () => {
        subscribers.splice(subscribers.indexOf(subscriber), 1);
      }
    };
    subscribers.push(subscriber);
    return {
      unlisten() {
        subscribers.splice(subscribers.indexOf(subscriber), 1);
      }
    };
  };

  const destroy = () => {
    positionListener.unlisten();
    Object.values(quotes).forEach(({ symbol }) => sdk.md?.quote.unsubscribe(symbol));
  };

  const calculator: Calculator = {
    listen,
    destroy
  };

  return calculator;
};

function calculatePL(position: Position, product: Product, latest: Quote) {
  if (position.netPos === 0) return 0;
  const { netPos, netPrice } = position;
  const quoteKey = netPos > 0 ? 'Bid' : 'Offer';
  // const avgPrice = netPrice! / Math.abs(netPos);
  const vpp = product.valuePerPoint;
  const currentPrice = latest.entries[quoteKey]?.price || 0;
  const priceDiff = currentPrice - netPrice!;
  const pl = netPos * vpp * priceDiff;
  return pl;
}
