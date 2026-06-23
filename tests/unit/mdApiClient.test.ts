/**
 * Unit tests for MdApiClient
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MdApiClient } from '../../sdks/mdApiClient';

const createMockSocket = () => ({
  send: vi.fn()
});

describe('MdApiClient', () => {
  let mdApiClient: MdApiClient;
  let mockSocket: ReturnType<typeof createMockSocket>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSocket = createMockSocket();
  });

  describe('Initialization', () => {
    it('should initialize with socket instance', () => {
      mdApiClient = new MdApiClient(mockSocket as any);
      expect(mdApiClient).toBeInstanceOf(MdApiClient);
    });

    it('should have all required market data domains', () => {
      mdApiClient = new MdApiClient(mockSocket as any);
      expect(mdApiClient.quote).toBeDefined();
      expect(mdApiClient.dom).toBeDefined();
      expect(mdApiClient.histogram).toBeDefined();
      expect(mdApiClient.chart).toBeDefined();
    });
  });

  describe('Quote Operations', () => {
    beforeEach(() => {
      mdApiClient = new MdApiClient(mockSocket as any);
    });

    it('should subscribe to quote data', async () => {
      const mockResponse = { subscriptionId: 'quote-123', success: true };
      mockSocket.send.mockResolvedValue(mockResponse);

      const request = { symbol: 'ESM7' };
      const result = await mdApiClient.quote.subscribe(request);

      expect(mockSocket.send).toHaveBeenCalledWith('md/subscribeQuote', { body: request });
      expect(result).toEqual(mockResponse);
    });

    it('should unsubscribe from quote data', async () => {
      const mockResponse = { success: true };
      mockSocket.send.mockResolvedValue(mockResponse);

      const result = await mdApiClient.quote.unsubscribe('ESM7');

      expect(mockSocket.send).toHaveBeenCalledWith('md/unsubscribeQuote', {
        body: { symbol: 'ESM7' }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DOM Operations', () => {
    beforeEach(() => {
      mdApiClient = new MdApiClient(mockSocket as any);
    });

    it('should subscribe to DOM data', async () => {
      const mockResponse = { realtimeId: 'dom-456', success: true };
      mockSocket.send.mockResolvedValue(mockResponse);

      const request = { symbol: 'ESM7' };
      const result = await mdApiClient.dom.subscribe(request);

      expect(mockSocket.send).toHaveBeenCalledWith('md/subscribeDOM', { body: request });
      expect(result).toEqual(mockResponse);
    });

    it('should unsubscribe from DOM data', async () => {
      const mockResponse = { success: true };
      mockSocket.send.mockResolvedValue(mockResponse);

      const result = await mdApiClient.dom.unsubscribe('ESM7');

      expect(mockSocket.send).toHaveBeenCalledWith('md/unsubscribeDOM', {
        body: { symbol: 'ESM7' }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Histogram Operations', () => {
    beforeEach(() => {
      mdApiClient = new MdApiClient(mockSocket as any);
    });

    it('should subscribe to histogram data', async () => {
      const mockResponse = { realtimeId: 'hist-789', success: true };
      mockSocket.send.mockResolvedValue(mockResponse);

      const request = { symbol: 'ESM7' };
      const result = await mdApiClient.histogram.subscribe(request);

      expect(mockSocket.send).toHaveBeenCalledWith('md/subscribeHistogram', { body: request });
      expect(result).toEqual(mockResponse);
    });

    it('should unsubscribe from histogram data', async () => {
      const mockResponse = { success: true };
      mockSocket.send.mockResolvedValue(mockResponse);

      const result = await mdApiClient.histogram.unsubscribe('ESM7');

      expect(mockSocket.send).toHaveBeenCalledWith('md/unsubscribeHistogram', {
        body: { symbol: 'ESM7' }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Chart Operations', () => {
    beforeEach(() => {
      mdApiClient = new MdApiClient(mockSocket as any);
    });

    it('should subscribe to chart data', async () => {
      const mockResponse = { subscriptionId: 'chart-101', success: true };
      mockSocket.send.mockResolvedValue(mockResponse);

      const request = {
        symbol: 'ESM7',
        chartDescription: {
          underlyingType: 'MinuteBar',
          elementSize: 15,
          elementSizeUnit: 'UnderlyingUnits' as any,
          withHistogram: true
        },
        timeRange: {
          asMuchAsElements: 100
        }
      };

      const result = await mdApiClient.chart.subscribe(request);

      expect(mockSocket.send).toHaveBeenCalledWith('md/getChart', { body: request });
      expect(result).toEqual(mockResponse);
    });

    it('should unsubscribe from chart data using chart ID', async () => {
      const mockResponse = { success: true };
      mockSocket.send.mockResolvedValue(mockResponse);

      const subscriptionId = 12345;
      const result = await mdApiClient.chart.unsubscribe(subscriptionId);

      expect(mockSocket.send).toHaveBeenCalledWith('md/cancelChart', { body: { subscriptionId } });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      mdApiClient = new MdApiClient(mockSocket as any);
    });

    it('should propagate socket errors from operations', async () => {
      const mockError = new Error('Network error');
      mockSocket.send.mockRejectedValue(mockError);

      await expect(mdApiClient.quote.subscribe({ symbol: 'ESM7' })).rejects.toThrow(
        'Network error'
      );
      await expect(mdApiClient.quote.unsubscribe('ESM7')).rejects.toThrow('Network error');
    });
  });

  describe('Instance Properties', () => {
    it('should have the correct constructor name', () => {
      mdApiClient = new MdApiClient(mockSocket as any);
      expect(mdApiClient.constructor.name).toBe('MdApiClient');
    });

    it('should be a valid MdApiClient instance', () => {
      mdApiClient = new MdApiClient(mockSocket as any);
      expect(mdApiClient).toBeInstanceOf(MdApiClient);
    });
  });
});
