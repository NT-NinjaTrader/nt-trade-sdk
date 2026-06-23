import { type SocketMessage } from '../sdks/socket';
import type { LoggerType } from './runtime';

export type TdvStage = 'devel' | 'prod' | 'staging';

export type Maybe<T> = T | null | undefined;

export type MessageEventHandler = (data: SocketMessage[]) => void;

// Map plural names to singular names for type mapping
type PluralToSingular = {
  accounts: 'account';
  accountRiskStatuses: 'accountRiskStatus';
  adminAlertSignals: 'adminAlertSignal';
  adminAlerts: 'adminAlert';
  cashBalances: 'cashBalance';
  cashBalanceLogs: 'cashBalanceLog';
  contracts: 'contract';
  contractMargins: 'contractMargin';
  contractMaturities: 'contractMaturity';
  commands: 'command';
  commandReports: 'commandReport';
  currencies: 'currency';
  exchanges: 'exchange';
  executionReports: 'executionReport';
  fills: 'fill';
  fillPairs: 'fillPair';
  marginSnapshots: 'marginSnapshot';
  marketDataSubscriptions: 'marketDataSubscription';
  marketDataSubscriptionPlans: 'marketDataSubscriptionPlan';
  marketDataSubscriptionExchangeScopes: 'marketDataSubscriptionExchangeScope';
  orders: 'order';
  orderStrategies: 'orderStrategy';
  OtherEnvAdminAlertSignals: 'OtherEnvAdminAlertSignal';
  positions: 'position';
  positionLogs: 'positionLog';
  products: 'product';
  productMargins: 'productMargin';
  productSessions: 'productSession';
  tradingPermissions: 'tradingPermission';
  tradovateSubscriptions: 'tradovateSubscription';
  tradovateSubscriptionPlans: 'tradovateSubscriptionPlan';
  users: 'user';
  userAccountAutoLiqs: 'userAccountAutoLiq';
};

export type TdvCache = {
  [K in PluralEntityName]?: import('./runtime').EntityTypeMap[PluralToSingular[K]][];
};

export type PluralEntityName =
  | 'accounts'
  | 'accountRiskStatuses'
  | 'adminAlertSignals'
  | 'adminAlerts'
  | 'cashBalances'
  | 'cashBalanceLogs'
  | 'contracts'
  | 'contractMargins'
  | 'contractMaturities'
  | 'commands'
  | 'commandReports'
  | 'currencies'
  | 'exchanges'
  | 'executionReports'
  | 'fills'
  | 'fillPairs'
  | 'marginSnapshots'
  | 'marketDataSubscriptions'
  | 'marketDataSubscriptionPlans'
  | 'marketDataSubscriptionExchangeScopes'
  | 'orders'
  | 'orderStrategies'
  | 'OtherEnvAdminAlertSignals'
  | 'positions'
  | 'positionLogs'
  | 'products'
  | 'productMargins'
  | 'productSessions'
  | 'tradingPermissions'
  | 'tradovateSubscriptions'
  | 'tradovateSubscriptionPlans'
  | 'users'
  | 'userAccountAutoLiqs';

export type EntityName =
  | 'account'
  | 'accountRiskStatus'
  | 'adminAlertSignal'
  | 'adminAlert'
  | 'alert'
  | 'alertSignal'
  | 'cashBalance'
  | 'cashBalanceLog'
  | 'contract'
  | 'contractMargin'
  | 'contractMaturity'
  | 'command'
  | 'commandReport'
  | 'currency'
  | 'exchange'
  | 'executionReport'
  | 'fill'
  | 'fillPair'
  | 'marginSnapshot'
  | 'marketDataSubscription'
  | 'marketDataSubscriptionPlan'
  | 'marketDataSubscriptionExchangeScope'
  | 'order'
  | 'orderStrategy'
  | 'OtherEnvAdminAlertSignal'
  | 'position'
  | 'positionLog'
  | 'product'
  | 'productMargin'
  | 'productSession'
  | 'tradingPermission'
  | 'tradovateSubscription'
  | 'tradovateSubscriptionPlan'
  | 'user'
  | 'userAccountAutoLiq';

export type TDVSocketUrl =
  | 'wss://demo-d.tradovateapi.com/v1/websocket'
  | 'wss://demo.tradovateapi.com/v1/websocket'
  | 'wss://live-d.tradovateapi.com/v1/websocket'
  | 'wss://live.tradovateapi.com/v1/websocket'
  | 'wss://live-api.staging.ninjatrader.dev/v1/websocket'
  | 'wss://demo-api.staging.ninjatrader.dev/v1/websocket'
  | 'wss://md-d.tradovateapi.com/v1/websocket'
  | 'wss://md.tradovateapi.com/v1/websocket'
  | 'wss://md-api.staging.ninjatrader.dev/v1/websocket';

export interface SocketConfig {
  url: TDVSocketUrl;
  accessToken: string;
  userId: number;
  /** Whether to sync entities immediately after connection. Defaults to true. */
  syncImmediate?: boolean;
  shardingExpression?: ShardingExpr;
  entityTypes?: EntityName[];
  fullOrgSnapshot?: boolean;
  connectionTimeout?: number;
  logger?: LoggerType;
  sharedCacheManager?: any; // CacheManager type will be imported where needed
}

export type ShardingExpr = {
  divisor: number;
  remainder: number;
  expressionType: 'modUserId' | 'modAccountId';
};

export interface Credentials {
  name: string;
  password: string;
  appId?: string;
  appVersion?: string;
  sec?: string;
  cid?: number;
  chl?: string;
  deviceId?: string;
  environment?: 'demo' | 'live';
  enc?: boolean;
}
