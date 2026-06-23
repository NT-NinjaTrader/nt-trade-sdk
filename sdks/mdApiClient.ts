import type { ResponseForUrl } from '../api/endpoints';
import type { ChartEvent, DOMEvent, HistogramEvent, QuoteEvent } from '../api/mdTypes';
import type {
  GetChartRequest,
  SubscribeDOMRequest,
  SubscribeHistogramRequest,
  SubscribeQuoteRequest
} from '../api/types';
import type { EnhancedMessageQueue } from './enhancedMessageQueue';
import { Listener } from './listener';
import type { RateLimiter } from './rateLimiter';
import type { Socket, SocketMessage } from './socket';

// Union type for all market data events
type MdEvent = QuoteEvent | DOMEvent | HistogramEvent | ChartEvent;

// Utility type to extract the specific market data event type based on entity name
type MdEventForEntity<T extends 'quote' | 'dom' | 'histogram' | 'chart'> = T extends 'quote'
  ? QuoteEvent
  : T extends 'dom'
    ? DOMEvent
    : T extends 'histogram'
      ? HistogramEvent
      : T extends 'chart'
        ? ChartEvent
        : never;

/**
 * Market Data API Client that provides a clean interface for MD operations.
 *
 * This client exposes only Market Data domains (histogram, quote, chart, DOM)
 * with subscribe and unsubscribe functions that use the Socket class's
 * subscribeMd and unsubscribeMd methods. It's designed for high-performance
 * market data consumption with automatic reconnection and error handling.
 *
 * The client automatically manages subscriptions, handles connection failures,
 * and provides real-time market data streams for trading applications.
 *
 * @example
 * ```typescript
 * // Subscribe to quote data for real-time pricing
 * const quoteSub = await mdApi.quote.subscribe({ symbol: 'ESM7' });
 *
 * // Subscribe to DOM data for order book depth
 * const domSub = await mdApi.dom.subscribe({ symbol: 'ESM7' });
 *
 * // Subscribe to histogram data for volume analysis
 * const histSub = await mdApi.histogram.subscribe({ symbol: 'ESM7' });
 *
 * // Subscribe to chart data for technical analysis
 * const chartSub = await mdApi.chart.subscribe({
 *   symbol: 'ESM7',
 *   chartDescription: {
 *     underlyingType: 'MinuteBar',
 *     elementSize: 1
 *   },
 *   timeRange: {
 *     asMuchAsElements: 100
 *   }
 * });
 *
 * // Unsubscribe from specific data streams
 * await mdApi.quote.unsubscribe('ESM7');
 * await mdApi.dom.unsubscribe('ESM7');
 * ```
 *
 * @example
 * ```typescript
 * // Listen to entity events for real-time updates
 * const unlisten = mdApi.listen('quote', (event) => {
 *   console.log('Quote update received:', event);
 * });
 *
 * // Later, stop listening to events
 * unlisten();
 * ```
 */
export class MdApiClient {
  /**
   * Creates a new Market Data API Client instance.
   *
   * @param socket - WebSocket client for market data operations
   * @param rateLimiter - Optional rate limiter for subscription management
   * @param messageQueue - Optional message queue for handling network outages
   *
   * @example
   * ```typescript
   * const mdApi = new MdApiClient(
   *   socketClient,
   *   rateLimiter,
   *   messageQueue
   * );
   * ```
   */
  constructor(
    private socket: Socket,
    private rateLimiter?: RateLimiter,
    private messageQueue?: EnhancedMessageQueue
  ) {}

  /**
   * Quote-related Market Data operations.
   *
   * Provides real-time quote data including bid/ask prices, last trade price,
   * volume, and other market indicators. Essential for live pricing and
   * market monitoring.
   *
   * @example
   * ```typescript
   * // Subscribe to real-time quotes
   * const quoteSub = await mdApi.quote.subscribe({ symbol: 'ESM7' });
   *
   * // Monitor quote updates through entity listening
   * mdApi.listen('quote', (quoteEvent) => {
   *   quoteEvent.quotes.forEach(quote => {
   *     console.log(`${quote.contractId}: Bid ${quote.entries.Bid?.price}, Ask ${quote.entries.Offer?.price}`);
   *   });
   * });
   * ```
   */
  get quote() {
    return {
      /**
       * Subscribe to quote data for a symbol.
       *
       * Establishes a real-time quote stream for the specified symbol.
       * Quote data includes bid/ask prices, last trade price, volume,
       * and other market indicators.
       *
       * @param request - Quote subscription request with symbol and optional parameters
       * @returns Promise resolving to subscription result with confirmation details
       * @throws {WebSocketError} When subscription fails or connection is unavailable
       *
       * @example
       * ```typescript
       * // Basic quote subscription
       * const sub = await mdApi.quote.subscribe({ symbol: 'ESM7' });
       * console.log('Quote subscription confirmed:', sub.subscriptionId);
       *
       * // Handle subscription errors
       * try {
       *   await mdApi.quote.subscribe({ symbol: 'INVALID' });
       * } catch (error) {
       *   console.error('Subscription failed:', error.message);
       * }
       * ```
       */
      subscribe: (request: SubscribeQuoteRequest): Promise<ResponseForUrl<'md/subscribeQuote'>> =>
        this.socket.send('md/subscribeQuote', { body: request }),

      /**
       * Unsubscribe from quote data for a symbol.
       *
       * Terminates the quote data stream for the specified symbol.
       * This method is idempotent - calling it multiple times for the
       * same symbol is safe.
       *
       * @param symbol - Symbol to unsubscribe from (string or numeric ID)
       * @returns Promise resolving to unsubscribe confirmation
       * @throws {WebSocketError} When unsubscription fails
       *
       * @example
       * ```typescript
       * // Unsubscribe from quote data
       * await mdApi.quote.unsubscribe('ESM7');
       * console.log('Quote subscription cancelled for ESM7');
       *
       * // Unsubscribe using numeric symbol ID
       * await mdApi.quote.unsubscribe(12345);
       * ```
       */
      unsubscribe: (symbol: string | number): Promise<ResponseForUrl<'md/unsubscribeQuote'>> =>
        this.socket.send('md/unsubscribeQuote', { body: { symbol } })
    };
  }

  /**
   * DOM (Depth of Market) related Market Data operations.
   *
   * Provides real-time order book data showing bid and ask orders at
   * different price levels. Essential for understanding market liquidity
   * and order flow analysis.
   *
   * @example
   * ```typescript
   * // Subscribe to DOM data
   * const domSub = await mdApi.dom.subscribe({ symbol: 'ESM7' });
   *
   * // Monitor DOM updates
   * mdApi.listen('dom', (domEvent) => {
   *   domEvent.doms.forEach(dom => {
   *     console.log(`${dom.contractId} DOM:`, {
   *       bids: dom.bids.slice(0, 5), // Top 5 bids
   *       offers: dom.offers.slice(0, 5)  // Top 5 offers
   *     });
   *   });
   * });
   * ```
   */
  get dom() {
    return {
      /**
       * Subscribe to DOM data for a symbol.
       *
       * Establishes a real-time order book stream showing bid and ask
       * orders at different price levels. Essential for understanding
       * market liquidity and order flow.
       *
       * @param request - DOM subscription request with symbol and optional parameters
       * @returns Promise resolving to subscription result with confirmation details
       * @throws {WebSocketError} When subscription fails or connection is unavailable
       *
       * @example
       * ```typescript
       * // Basic DOM subscription
       * const sub = await mdApi.dom.subscribe({ symbol: 'ESM7' });
       * console.log('DOM subscription confirmed:', sub.subscriptionId);
       *
       * // Monitor DOM updates for analysis
       * mdApi.listen('dom', (domEvent) => {
       *   domEvent.doms.forEach(dom => {
       *     const totalBidVolume = dom.bids.reduce((sum, bid) => sum + bid.size, 0);
       *     const totalAskVolume = dom.offers.reduce((sum, ask) => sum + ask.size, 0);
       *     console.log(`Bid volume: ${totalBidVolume}, Ask volume: ${totalAskVolume}`);
       *   });
       * });
       * ```
       */
      subscribe: (request: SubscribeDOMRequest): Promise<ResponseForUrl<'md/subscribeDOM'>> =>
        this.socket.send('md/subscribeDOM', { body: request }),

      /**
       * Unsubscribe from DOM data for a symbol.
       *
       * Terminates the DOM data stream for the specified symbol.
       * This method is idempotent and safe to call multiple times.
       *
       * @param symbol - Symbol to unsubscribe from (string or numeric ID)
       * @returns Promise resolving to unsubscribe confirmation
       * @throws {WebSocketError} When unsubscription fails
       *
       * @example
       * ```typescript
       * // Unsubscribe from DOM data
       * await mdApi.dom.unsubscribe('ESM7');
       * console.log('DOM subscription cancelled for ESM7');
       * ```
       */
      unsubscribe: (symbol: string | number): Promise<ResponseForUrl<'md/unsubscribeDOM'>> =>
        this.socket.send('md/unsubscribeDOM', { body: { symbol } })
    };
  }

  /**
   * Histogram-related Market Data operations.
   *
   * Provides volume profile data showing trading activity at different
   * price levels. Useful for understanding market structure and identifying
   * support/resistance levels.
   *
   * @example
   * ```typescript
   * // Subscribe to histogram data
   * const histSub = await mdApi.histogram.subscribe({ symbol: 'ESM7' });
   *
   * // Analyze volume profile
   * mdApi.listen('histogram', (histogramEvent) => {
   *   histogramEvent.histograms.forEach(histogram => {
   *     console.log(`${histogram.contractId} volume profile:`, histogram.items);
   *   });
   * });
   * ```
   */
  get histogram() {
    return {
      /**
       * Subscribe to histogram data for a symbol.
       *
       * Establishes a real-time volume profile stream showing trading
       * activity at different price levels. Useful for technical analysis
       * and market structure identification.
       *
       * @param request - Histogram subscription request with symbol and optional parameters
       * @returns Promise resolving to subscription result with confirmation details
       * @throws {WebSocketError} When subscription fails or connection is unavailable
       *
       * @example
       * ```typescript
       * // Basic histogram subscription
       * const sub = await mdApi.histogram.subscribe({ symbol: 'ESM7' });
       * console.log('Histogram subscription confirmed:', sub.subscriptionId);
       *
       * // Subscribe with custom parameters
       * const customHist = await mdApi.histogram.subscribe({
       *   symbol: 'ESM7',
       *   interval: '1Minute',
       *   lookbackPeriod: 24 // 24 periods of data
       * });
       *
       * // Analyze volume profile for trading decisions
       * mdApi.listen('histogram', (histogramEvent) => {
       *   histogramEvent.histograms.forEach(histogram => {
       *     const highVolumeLevels = Object.entries(histogram.items)
       *       .filter(([price, volume]) => volume > 1000) // High volume threshold
       *       .map(([price]) => parseFloat(price));
       *
       *     console.log('High volume price levels:', highVolumeLevels);
       *   });
       * });
       * ```
       */
      subscribe: (
        request: SubscribeHistogramRequest
      ): Promise<ResponseForUrl<'md/subscribeHistogram'>> =>
        this.socket.send('md/subscribeHistogram', { body: request }),

      /**
       * Unsubscribe from histogram data for a symbol.
       *
       * Terminates the histogram data stream for the specified symbol.
       * This method is idempotent and safe to call multiple times.
       *
       * @param symbol - Symbol to unsubscribe from (string or numeric ID)
       * @returns Promise resolving to unsubscribe confirmation
       * @throws {WebSocketError} When unsubscription fails
       *
       * @example
       * ```typescript
       * // Unsubscribe from histogram data
       * await mdApi.histogram.unsubscribe('ESM7');
       * console.log('Histogram subscription cancelled for ESM7');
       * ```
       */
      unsubscribe: (symbol: string | number): Promise<ResponseForUrl<'md/unsubscribeHistogram'>> =>
        this.socket.send('md/unsubscribeHistogram', { body: { symbol } })
    };
  }

  /**
   * Chart-related Market Data operations.
   *
   * Provides time-series data for technical analysis including OHLC bars,
   * candlesticks, and other chart patterns. Supports multiple timeframes
   * and chart types for comprehensive market analysis.
   *
   * @example
   * ```typescript
   * // Subscribe to minute bar chart data
   * const chartSub = await mdApi.chart.subscribe({
   *   symbol: 'ESM7',
   *   chartDescription: {
   *     underlyingType: 'MinuteBar',
   *     elementSize: 1
   *   },
   *   timeRange: {
   *     asMuchAsElements: 100
   *   }
   * });
   *
   * // Monitor chart updates
   * mdApi.listen('chart', (chartEvent) => {
   *   chartEvent.charts.forEach(chart => {
   *     if ('bars' in chart) {
   *       console.log(`${chart.id} chart update:`, chart.bars);
   *     }
   *   });
   * });
   * ```
   */
  get chart() {
    return {
      /**
       * Subscribe to chart data for a symbol.
       *
       * Establishes a real-time chart data stream for technical analysis.
       * Supports multiple chart types including OHLC bars, candlesticks,
       * and other time-series patterns.
       *
       * @param request - Chart subscription request with symbol, chart description, and time range
       * @returns Promise resolving to subscription result with chart data and subscription ID
       * @throws {WebSocketError} When subscription fails or connection is unavailable
       *
       * @example
       * ```typescript
       * // Subscribe to 1-minute bars
       * const minuteBars = await mdApi.chart.subscribe({
       *   symbol: 'ESM7',
       *   chartDescription: {
       *     underlyingType: 'MinuteBar',
       *     elementSize: 1,
       *     withHistogram: true
       *   },
       *   timeRange: {
       *     asMuchAsElements: 100
       *   }
       * });
       *
       * // Subscribe to 5-minute candlesticks
       * const candlesticks = await mdApi.chart.subscribe({
       *   symbol: 'ESM7',
       *   chartDescription: {
       *     underlyingType: 'CandleStick',
       *     elementSize: 5,
       *     withHistogram: false
       *   },
       *   timeRange: {
       *     asMuchAsElements: 200
       *   }
       * });
       *
       * // Subscribe to daily bars for swing trading
       * const dailyBars = await mdApi.chart.subscribe({
       *   symbol: 'ESM7',
       *   chartDescription: {
       *     underlyingType: 'DailyBar',
       *     elementSize: 1
       *   },
       *   timeRange: {
       *     asMuchAsElements: 50
       *   }
       * });
       *
       * console.log('Chart subscriptions active:', {
       *   minuteBars: minuteBars.subscriptionId,
       *   candlesticks: candlesticks.subscriptionId,
       *   dailyBars: dailyBars.subscriptionId
       * });
       * ```
       */
      subscribe: (request: GetChartRequest): Promise<ResponseForUrl<'md/getChart'>> =>
        this.socket.send('md/getChart', { body: request }),

      /**
       * Unsubscribe from chart data using subscription ID.
       *
       * Terminates the chart data stream using the subscription ID
       * returned from the subscribe method. This method is idempotent.
       *
       * @param subscriptionId - Chart subscription ID to cancel
       * @returns Promise resolving to cancellation confirmation
       * @throws {WebSocketError} When cancellation fails
       *
       * @example
       * ```typescript
       * // Store subscription ID when subscribing
       * const chartSub = await mdApi.chart.subscribe({
       *   symbol: 'ESM7',
       *   chartDescription: { underlyingType: 'MinuteBar', elementSize: 1 },
       *   timeRange: { asMuchAsElements: 100 }
       * });
       *
       * // Later, unsubscribe using the stored ID
       * await mdApi.chart.unsubscribe(chartSub.subscriptionId);
       * console.log('Chart subscription cancelled');
       * ```
       */
      unsubscribe: (subscriptionId: number): Promise<ResponseForUrl<'md/cancelChart'>> =>
        this.socket.send('md/cancelChart', { body: { subscriptionId } })
    };
  }

  /**
   * Listen to market data entity type events for real-time updates.
   *
   * This method creates a custom event listener for market data events
   * that listens for 'md' type messages from the WebSocket. Since market data
   * events are handled differently from regular entity events, this method
   * provides proper type safety and filtering for market data streams.
   *
   * @param entityType - The market data entity type to listen to ('quote', 'dom', 'histogram', 'chart')
   * @param callback - Callback function to handle market data events
   * @returns An unlisten function that can be called to stop listening
   *
   * @example
   * ```typescript
   * // Listen to quote events for real-time pricing
   * const unlistenQuotes = mdApi.listen('quote', (quoteEvent) => {
   *   quoteEvent.quotes.forEach(quote => {
   *     console.log(`${quote.contractId}: Bid ${quote.entries.Bid?.price}, Ask ${quote.entries.Offer?.price}`);
   *   });
   * });
   *
   * // Listen to DOM events for order book analysis
   * const unlistenDOM = mdApi.listen('dom', (domEvent) => {
   *   domEvent.doms.forEach(dom => {
   *     const bidVolume = dom.bids.reduce((sum, bid) => sum + bid.size, 0);
   *     const askVolume = dom.offers.reduce((sum, ask) => sum + ask.size, 0);
   *     console.log(`Bid/Ask volume ratio: ${(bidVolume / askVolume).toFixed(2)}`);
   *   });
   * });
   *
   * // Listen to histogram events for volume analysis
   * const unlistenHistogram = mdApi.listen('histogram', (histogramEvent) => {
   *   histogramEvent.histograms.forEach(histogram => {
   *     console.log(`Volume profile for ${histogram.contractId}:`, histogram.items);
   *   });
   * });
   *
   * // Listen to chart events for technical analysis
   * const unlistenCharts = mdApi.listen('chart', (chartEvent) => {
   *   chartEvent.charts.forEach(chart => {
   *     if ('bars' in chart) {
   *       const latestBar = chart.bars[chart.bars.length - 1];
   *       console.log(`Latest bar:`, {
   *         open: latestBar.open,
   *         high: latestBar.high,
   *         low: latestBar.low,
   *         close: latestBar.close
   *       });
   *     }
   *   });
   * });
   *
   * // Later, stop listening to all events
   * unlistenQuotes();
   * unlistenDOM();
   * unlistenHistogram();
   * unlistenCharts();
   * ```
   */
  listen<T extends 'quote' | 'dom' | 'histogram' | 'chart'>(
    entityType: T,
    callback: (message: MdEventForEntity<T>) => void
  ): Listener {
    // Create a message handler that filters for market data events
    const messageHandler = (messages: SocketMessage[]) => {
      messages.forEach(message => {
        if (message.e === 'md' && message.d) {
          const mdEvent = message.d as MdEvent;

          // Filter based on entity type
          switch (entityType) {
            case 'quote':
              if ('quotes' in mdEvent) {
                callback(mdEvent as MdEventForEntity<T>);
              }
              break;
            case 'dom':
              if ('doms' in mdEvent) {
                callback(mdEvent as MdEventForEntity<T>);
              }
              break;
            case 'histogram':
              if ('histograms' in mdEvent) {
                callback(mdEvent as MdEventForEntity<T>);
              }
              break;
            case 'chart':
              if ('charts' in mdEvent) {
                callback(mdEvent as MdEventForEntity<T>);
              }
              break;
          }
        }
      });
    };

    // Listen to raw WebSocket messages using the socket's internal on method
    this.socket.on(messageHandler);

    // Return an unlisten function
    return new Listener(() => {
      this.socket.off(messageHandler);
    });
  }
}
