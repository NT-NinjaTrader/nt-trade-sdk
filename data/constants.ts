import { type EntityName, type TDVSocketUrl } from '../types/common';

export const URLS: TdvUrlConstants = {
  devel: {
    raw: 'https://live-d.tradovateapi.com',
    sim: 'https://demo-d.tradovateapi.com/v1',
    live: 'https://live-d.tradovateapi.com/v1',
    simWs: 'wss://demo-d.tradovateapi.com/v1/websocket',
    liveWs: 'wss://live-d.tradovateapi.com/v1/websocket',
    mdWs: 'wss://md-d.tradovateapi.com/v1/websocket'
  },
  staging: {
    raw: 'https://live-api.staging.ninjatrader.dev',
    sim: 'https://demo-api.staging.ninjatrader.dev/v1',
    live: 'https://live-api.staging.ninjatrader.dev/v1',
    simWs: 'wss://demo-api.staging.ninjatrader.dev/v1/websocket',
    liveWs: 'wss://live-api.staging.ninjatrader.dev/v1/websocket',
    mdWs: 'wss://md-api.staging.ninjatrader.dev/v1/websocket'
  },
  prod: {
    raw: 'https://live.tradovateapi.com',
    sim: 'https://demo.tradovateapi.com/v1',
    live: 'https://live.tradovateapi.com/v1',
    simWs: 'wss://demo.tradovateapi.com/v1/websocket',
    liveWs: 'wss://live.tradovateapi.com/v1/websocket',
    mdWs: 'wss://md.tradovateapi.com/v1/websocket'
  }
};

export type TDVRawUrl =
  | 'https://live.tradovateapi.com'
  | 'https://live-d.tradovateapi.com'
  | 'https://live-api.staging.ninjatrader.dev';

export type TDVLiveUrl =
  | 'https://live-d.tradovateapi.com/v1'
  | 'https://live.tradovateapi.com/v1'
  | 'https://live-api.staging.ninjatrader.dev/v1';

export type TDVSimUrl =
  | 'https://demo-d.tradovateapi.com/v1'
  | 'https://demo.tradovateapi.com/v1'
  | 'https://demo-api.staging.ninjatrader.dev/v1';

export interface UrlDomain {
  raw: TDVRawUrl;
  sim: TDVSimUrl;
  live: TDVLiveUrl;
  simWs: TDVSocketUrl;
  liveWs: TDVSocketUrl;
  mdWs: TDVSocketUrl;
}

interface TdvUrlConstants {
  devel: UrlDomain;
  staging: UrlDomain;
  prod: UrlDomain;
}

export const entityNames: EntityName[] = [
  'account',
  'accountRiskStatus',
  'cashBalance',
  'cashBalanceLog',
  'command',
  'commandReport',
  'contract',
  'contractMaturity',
  'contractMargin',
  'currency',
  'exchange',
  'executionReport',
  'fill',
  'fillPair',
  'order',
  'orderStrategy',
  'position',
  'product',
  'productMargin',
  'user'
];
