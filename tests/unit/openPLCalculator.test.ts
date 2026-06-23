/**
 * Unit tests for openPLCalculator
 * Tests simplified P&L calculator functionality
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenPLCalculator, type Calculator } from '../../sdks/openPLCalculator';
import type { Contract, Position, Product } from '../../api/types';
import type { Quote } from '../../api/mdTypes';
import type { PartnerSdk } from '../../sdks/partnerSdk';

describe('openPLCalculator', () => {
  let mockSdk: Partial<PartnerSdk>;
  let mockClient: any;
  let mockMdClient: any;
  let calculator: Calculator;

  const mockPosition: Position = {
    id: 1,
    accountId: 12345,
    contractId: 100,
    timestamp: '2025-11-10T12:00:00Z',
    tradeDate: { year: 2025, month: 11, day: 10 },
    netPos: 2,
    netPrice: 5000.0,
    bought: 2,
    boughtValue: 10000,
    sold: 0,
    soldValue: 0,
    prevPos: 0,
    prevPrice: undefined
  };

  const mockContract: Contract = {
    id: 100,
    name: 'ESZ5',
    contractMaturityId: 200
  };

  const mockProduct: Product = {
    id: 300,
    name: 'ES',
    currencyId: 1,
    productType: 'Future',
    description: 'E-mini S&P 500',
    exchangeId: 1,
    contractGroupId: 1,
    status: 'Active',
    valuePerPoint: 50,
    priceFormatType: 'Decimal',
    priceFormat: 2,
    tickSize: 0.25
  };

  const mockQuote: Quote = {
    timestamp: '2025-11-10T12:00:01Z',
    contractId: 100,
    entries: {
      Bid: { price: 5010.0, size: 10 },
      Offer: { price: 5010.25, size: 10 },
      Trade: { price: 5010.0, size: 1 }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock client
    mockClient = {
      position: {
        list: vi.fn().mockResolvedValue([mockPosition])
      },
      contract: {
        items: vi.fn().mockResolvedValue([mockContract]),
        item: vi.fn().mockResolvedValue(mockContract)
      },
      product: {
        find: vi.fn().mockResolvedValue(mockProduct)
      },
      account: {
        items: vi.fn().mockResolvedValue([{ id: 12345, name: 'Test Account' }])
      },
      listen: vi.fn().mockReturnValue({ unlisten: vi.fn() })
    };

    // Create mock MD client
    mockMdClient = {
      quote: {
        subscribe: vi.fn().mockResolvedValue({ symbol: 'ESZ5' }),
        unsubscribe: vi.fn()
      },
      listen: vi.fn().mockReturnValue({ unlisten: vi.fn() })
    };

    // Create mock SDK
    mockSdk = {
      sim: mockClient,
      live: mockClient,
      md: mockMdClient
    } as any;
  });

  afterEach(() => {
    // Clean up calculator if it was created
    if (calculator) {
      calculator.destroy();
      calculator = undefined as any;
    }
  });

  describe('Initialization', () => {
    it('should create calculator successfully', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      expect(calculator).toBeDefined();
      expect(calculator.listen).toBeDefined();
      expect(calculator.destroy).toBeDefined();
    });

    it('should load initial positions', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      expect(mockClient.position.list).toHaveBeenCalled();
    });

    it('should load contracts for positions', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      expect(mockClient.contract.items).toHaveBeenCalled();
    });

    it('should subscribe to quotes for contracts', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      expect(mockMdClient.quote.subscribe).toHaveBeenCalledWith({ symbol: 'ESZ5' });
    });

    it('should set up position listener', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      expect(mockClient.listen).toHaveBeenCalledWith('position', expect.any(Function));
    });

    it('should set up quote listener', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      expect(mockMdClient.listen).toHaveBeenCalledWith('quote', expect.any(Function));
    });
  });

  describe('Product Filtering', () => {
    it('should filter positions by products', async () => {
      const esContract = { id: 100, name: 'ESZ5', contractMaturityId: 200 };
      const nqContract = { id: 101, name: 'NQH6', contractMaturityId: 201 };

      mockClient.contract.items = vi.fn().mockResolvedValue([esContract, nqContract]);

      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {
        products: ['ES'] // Only ES products
      });

      // Should only subscribe to ES contract
      expect(mockMdClient.quote.subscribe).toHaveBeenCalledTimes(1);
      expect(mockMdClient.quote.subscribe).toHaveBeenCalledWith({ symbol: 'ESZ5' });
    });
  });

  describe('Account Filtering', () => {
    it('should load specific accounts when provided', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {
        accounts: [12345, 67890]
      });

      expect(mockClient.account.items).toHaveBeenCalledWith({
        query: { ids: [12345, 67890] }
      });
    });

    it('should auto-detect accounts from positions when not provided', async () => {
      const position1 = { ...mockPosition, accountId: 11111 };
      const position2 = { ...mockPosition, accountId: 22222 };
      mockClient.position.list = vi.fn().mockResolvedValue([position1, position2]);

      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      expect(mockClient.account.items).toHaveBeenCalledWith({
        query: { ids: [11111, 22222] }
      });
    });
  });

  describe('Position Listener', () => {
    it('should handle new position events', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      // Get the position listener callback
      const positionListenerCall = (mockClient.listen as any).mock.calls.find(
        (call: any) => call[0] === 'position'
      );
      const positionCallback = positionListenerCall?.[1];

      // Simulate new position
      const newPosition = { ...mockPosition, id: 2, contractId: 101 };
      const newContract = { id: 101, name: 'NQH6', contractMaturityId: 201 };
      mockClient.contract.item = vi.fn().mockResolvedValue(newContract);

      await positionCallback({
        entity: newPosition,
        entityType: 'position',
        eventType: 'Created'
      });

      // Should load contract for new position
      expect(mockClient.contract.item).toHaveBeenCalledWith({ query: { id: 101 } });
      // Should subscribe to quotes for new contract
      expect(mockMdClient.quote.subscribe).toHaveBeenCalledWith({ symbol: 'NQH6' });
    });

    it('should not resubscribe to existing contracts', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      // Clear previous calls
      (mockMdClient.quote.subscribe as any).mockClear();

      // Get the position listener callback
      const positionListenerCall = (mockClient.listen as any).mock.calls.find(
        (call: any) => call[0] === 'position'
      );
      const positionCallback = positionListenerCall?.[1];

      // Simulate position update for existing contract
      await positionCallback({
        entity: mockPosition,
        entityType: 'position',
        eventType: 'Updated'
      });

      // Should not subscribe again
      expect(mockMdClient.quote.subscribe).not.toHaveBeenCalled();
    });
  });

  describe('Quote Listener', () => {
    it('should process quote updates', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      // Get the quote listener callback
      const quoteListenerCall = (mockMdClient.listen as any).mock.calls.find(
        (call: any) => call[0] === 'quote'
      );
      const quoteCallback = quoteListenerCall?.[1];

      // Set up calculator listener to verify events
      const plCallback = vi.fn();
      calculator.listen(plCallback);

      // Simulate quote update
      quoteCallback({ quotes: [mockQuote] });

      // Should emit P&L update
      expect(plCallback).toHaveBeenCalled();
      const plEvent = plCallback.mock.calls[0][0];
      expect(plEvent).toHaveProperty('totalPL');
      expect(plEvent).toHaveProperty('allPositions');
    });

    it('should calculate P&L correctly', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      // Get the quote listener callback
      const quoteListenerCall = (mockMdClient.listen as any).mock.calls.find(
        (call: any) => call[0] === 'quote'
      );
      const quoteCallback = quoteListenerCall?.[1];

      // Set up calculator listener
      const plCallback = vi.fn();
      calculator.listen(plCallback);

      // Simulate quote update
      quoteCallback({ quotes: [mockQuote] });

      // Verify P&L calculation
      const plEvent = plCallback.mock.calls[0][0];
      // netPos=2, valuePerPoint=50, priceDiff=(5010-5000)=10
      // P&L = 2 * 50 * 10 = 1000
      expect(plEvent.totalPL).toBe(1000);
      expect(plEvent.allPositions).toHaveProperty('ES', 1000);
    });
  });

  describe('Update Interval', () => {
    it('should respect update interval for throttling', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {
        updateInterval: 100 // 100ms throttle
      });

      const plCallback = vi.fn();
      calculator.listen(plCallback);

      // Get the quote listener callback
      const quoteListenerCall = (mockMdClient.listen as any).mock.calls.find(
        (call: any) => call[0] === 'quote'
      );
      const quoteCallback = quoteListenerCall?.[1];

      // First call should go through (lastTs starts at 0)
      quoteCallback({ quotes: [mockQuote] });
      expect(plCallback).toHaveBeenCalledTimes(1);

      // Rapid subsequent calls within throttle window should be ignored
      quoteCallback({ quotes: [mockQuote] });
      quoteCallback({ quotes: [mockQuote] });
      expect(plCallback).toHaveBeenCalledTimes(1); // Still just 1

      // Wait for throttle window to pass
      await new Promise(resolve => setTimeout(resolve, 110));

      // Next call should go through
      quoteCallback({ quotes: [mockQuote] });
      expect(plCallback).toHaveBeenCalledTimes(2);
    });

    it('should emit on every tick when updateInterval is "tick"', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {
        updateInterval: 'tick'
      });

      const plCallback = vi.fn();
      calculator.listen(plCallback);

      // Get the quote listener callback
      const quoteListenerCall = (mockMdClient.listen as any).mock.calls.find(
        (call: any) => call[0] === 'quote'
      );
      const quoteCallback = quoteListenerCall?.[1];

      // Simulate rapid quote updates
      quoteCallback({ quotes: [mockQuote] });
      quoteCallback({ quotes: [mockQuote] });
      quoteCallback({ quotes: [mockQuote] });

      // Should emit on every tick
      expect(plCallback).toHaveBeenCalledTimes(3);
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe from position events on destroy', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      const positionListener = (mockClient.listen as any).mock.results[0].value;
      calculator.destroy();

      expect(positionListener.unlisten).toHaveBeenCalled();
    });

    it('should unsubscribe from quotes on destroy', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      calculator.destroy();

      expect(mockMdClient.quote.unsubscribe).toHaveBeenCalledWith('ESZ5');
    });
  });

  describe('Multiple Subscribers', () => {
    it('should support multiple listeners', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      const callback1 = vi.fn();
      const callback2 = vi.fn();

      calculator.listen(callback1);
      calculator.listen(callback2);

      // Get the quote listener callback
      const quoteListenerCall = (mockMdClient.listen as any).mock.calls.find(
        (call: any) => call[0] === 'quote'
      );
      const quoteCallback = quoteListenerCall?.[1];

      // Simulate quote update
      quoteCallback({ quotes: [mockQuote] });

      // Both callbacks should be called
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should allow listeners to unsubscribe independently', async () => {
      calculator = await OpenPLCalculator(mockSdk as PartnerSdk, 'sim', {});

      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const listener1 = calculator.listen(callback1);
      calculator.listen(callback2);

      // Unsubscribe first listener
      listener1.unlisten();

      // Get the quote listener callback
      const quoteListenerCall = (mockMdClient.listen as any).mock.calls.find(
        (call: any) => call[0] === 'quote'
      );
      const quoteCallback = quoteListenerCall?.[1];

      // Simulate quote update
      quoteCallback({ quotes: [mockQuote] });

      // Only second callback should be called
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });
});
