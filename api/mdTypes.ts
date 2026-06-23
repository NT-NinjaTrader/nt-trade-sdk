export type MarketDataEvent = QuoteEvent | DOMEvent | HistogramEvent | ChartEvent;

export interface Bar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  upVolume: number;
  downVolume: number;
  upTicks: number;
  downTicks: number;
  bidVolume: number;
  offerVolume: number;
}

export interface BarChart {
  id: number; // "id" matches either historicalId or realtimeId values from response
  td: number; // Trade date as a number with value YYYYMMDD
  bars: Bar[];
}

export interface Tick {
  t: number;
  p: number;
  s: number;
  b: number;
  a: number;
  bs: number;
  as: number;
  id: number;
}

export interface EOH {
  id: number;
  eoh: boolean;
}

export interface TickChart {
  id: number;
  td: number;
  s: string;
  bp: number;
  bt: number;
  ts: number;
  tks: Tick[];
}

export interface QuoteEntry {
  price?: number;
  size?: number;
}
export interface Quote {
  timestamp: string;
  contractId: number;
  entries: {
    Bid: QuoteEntry;
    TotalTradeVolume: QuoteEntry;
    Offer: QuoteEntry;
    LowPrice: QuoteEntry;
    Trade: QuoteEntry;
    OpenInterest: QuoteEntry;
    OpeningPrice: QuoteEntry;
    HighPrice: QuoteEntry;
    SettlementPrice: QuoteEntry;
  };
}

export interface DOMEntry {
  price: number;
  size: number;
}
export interface DOM {
  contractId: number; // ID of the DOM contract
  timestamp: string;
  bids: DOMEntry[];
  offers: DOMEntry[];
}

export interface ChartEvent {
  charts: BarChart[] | TickChart[];
}

export interface DOMEvent {
  doms: DOM[];
}

export interface HistogramItems {
  [key: string]: number;
}

export interface Histogram {
  contractId: number; // ID of the histogram contract
  timestamp: string;
  tradeDate: {
    year: number;
    month: number;
    day: number;
  };
  base: number;
  items: HistogramItems;
  refresh: boolean;
}

export interface HistogramEvent {
  histograms: Histogram[];
}

export interface QuoteEvent {
  quotes: Quote[];
}
