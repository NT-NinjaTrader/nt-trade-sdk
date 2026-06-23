export type EntityType =
  | TradeTime
  | TradeDate
  | Account
  | AccountRiskStatus
  | AccountRiskStatusLog
  | Alert
  | AlertSignal
  | CancelOrder
  | CashBalance
  | CashBalanceLog
  | CashBalanceSnapshot
  | CategoryPositionLimit
  | CategoryRiskParameter
  | ClearingHouse
  | Command
  | CommandReport
  | CommandResult
  | Contract
  | ContractGroup
  | ContractMargin
  | ContractMaturity
  | Country
  | CreateAlert
  | Currency
  | CurrencyRate
  | DeleteAlert
  | DismissAlert
  | DryRun
  | DryRunOrder
  | EstimatedFillFee
  | EvaluateFillFee
  | EventProductSpec
  | Exchange
  | ExecutionReport
  | Fee
  | Fill
  | FillFee
  | FillPair
  | FormattedValue
  | GetCashBalanceSnapshot
  | GetEventProducts
  | GetOptionsChain
  | GetProcessingFee
  | GetProduct
  | GetProductFeeParams
  | GetTimestamp
  | InterruptOrderStrategy
  | LiquidatePosition
  | LiquidatePositions
  | MFAOptions
  | MarginSnapshot
  | MarkReadAlertSignal
  | Me
  | ModifyAlert
  | ModifyCredentials
  | ModifyEmailAddress
  | ModifyOrder
  | ModifyOrderStrategy
  | ModifyPassword
  | OAuthToken
  | OpenDemoAccount
  | Order
  | OrderStrategy
  | OrderStrategyLink
  | OrderStrategyType
  | OrderVersion
  | PlaceOCO
  | PlaceOSO
  | PlaceOcoResult
  | PlaceOrder
  | PlaceOrderResult
  | PlaceOsoResult
  | Position
  | PositionLog
  | ProcessingFee
  | Product
  | ProductDetails
  | ProductExtended
  | ProductFeeParams
  | ProductList
  | ProductMargin
  | ProductSession
  | Products
  | Property
  | RenewAccessToken
  | ResetAlert
  | ResetDemoAccountState
  | RestrainedOrderVersion
  | RiskDiscountContractGroup
  | RiskEvaluationDetails
  | RollContract
  | RollContractBase
  | RollContracts
  | Search
  | ShardingExpression
  | SpreadDefinition
  | StartOrderStrategy
  | SyncMessage
  | TradingSession
  | User
  | UserAccountAutoLiq
  | UserPlugin
  | UserPromoCode
  | UserProperty
  | UserReadStatus
  | UserStatusMessage
  | ChangeDemoBalance
  | ChangeSpeed
  | CheckReplaySession
  | InitializeClock;
export type RequestType =
  | AccessTokenRequest
  | SyncRequest;
export type ResponseType =
  | AccessTokenResponse
  | AlertResponse
  | DeleteResultResponse
  | DryRunResponse
  | EvaluateFillFeeResponse
  | EventProductsResponse
  | OAuthMeResponse
  | OAuthTokenResponse
  | OpenDemoAccountResponse
  | OptionsChainResponse
  | OrderStrategyStatusResponse
  | ProductFeeParamsResponse
  | RollContractResponse
  | RollContractsResponse
  | SimpleResponse
  | TimestampResponse
  | CheckReplaySessionResponse;
export interface TradeTime {
  hour: number;
  minute: number;
}
export interface TradeDate {
  year: number;
  month: number;
  day: number;
}
export interface Account {
  id: number;
  name: string;
  userId: number;
  accountType: string;
  restricted: boolean;
  closed: boolean;
  clearingHouseId: number;
  riskCategoryId: number;
  autoLiqProfileId: number;
  marginAccountType: string;
  legalStatus: string;
  timestamp: string;
  evaluationSize?: number;
  readonly?: boolean;
  ccEmail?: string;
}
export interface AccountRiskStatus {
  id: number;
  adminAction?: string;
  adminTimestamp?: string;
  liquidateOnly?: string;
  userTriggeredLiqOnly?: boolean;
}
export interface AccountRiskStatusLog {
  id: number;
  accountId: number;
  timestamp: string;
  adminAction?: string;
  adminTimestamp?: string;
  liquidateOnly?: string;
  userTriggeredLiqOnly?: boolean;
}
export interface Alert {
  id: number;
  timestamp: string;
  userId: number;
  status: string;
  expression: string;
  validUntil?: string;
  triggerLimits?: number;
  triggeredCounter?: number;
  failure?: string;
  message?: string;
}
export interface AlertSignal {
  id: number;
  timestamp: string;
  alertId: number;
  isRead: boolean;
  text: string;
}
export interface CancelOrder {
  orderId: number;
  clOrdId?: string;
  activationTime?: string;
  customTag50?: string;
  isAutomated?: boolean;
}
export interface CashBalance {
  id: number;
  accountId: number;
  timestamp: string;
  tradeDate: TradeDate;
  currencyId: number;
  amount: number;
  realizedPnL?: number;
  weekRealizedPnL?: number;
  amountSOD?: number;
}
export interface CashBalanceLog {
  id: number;
  accountId: number;
  timestamp: string;
  tradeDate: TradeDate;
  currencyId: number;
  amount: number;
  realizedPnL?: number;
  weekRealizedPnL?: number;
  cashChangeType: string;
  fillPairId?: number;
  fillId?: number;
  fundTransactionId?: number;
  comment?: string;
  delta: number;
  senderId?: number;
}
export interface CashBalanceSnapshot {
  errorText?: string;
  totalCashValue?: number;
  totalPnL?: number;
  initialMargin?: number;
  maintenanceMargin?: number;
  netLiq?: number;
  openPnL?: number;
  realizedPnL?: number;
  weekRealizedPnL?: number;
  withdrawalRejectReason?: string;
  currencyCashAvailWithdrawalUSD?: number;
  netLiqSOD?: number;
  totalCashValueSOD?: number;
  cashUSD?: number;
  cashSODUSD?: number;
  fullInitialMargin?: number;
  fullInitialMarginSOD?: number;
  autoLiqLevel?: number;
}
export interface CategoryPositionLimit {
  id: number;
  contractId?: number;
  productId?: number;
  exchangeId?: number;
  productType?: string;
  riskDiscountContractGroupId?: number;
  productVerificationStatus?: string;
  contractGroupId?: number;
  active: boolean;
  riskTimePeriodId?: number;
  totalBy: string;
  shortLimit?: number;
  longLimit?: number;
  exposedLimit?: number;
  description?: string;
  riskCategoryId: number;
}
export interface CategoryRiskParameter {
  id: number;
  contractId?: number;
  productId?: number;
  exchangeId?: number;
  productType?: string;
  riskDiscountContractGroupId?: number;
  productVerificationStatus?: string;
  contractGroupId?: number;
  maxOpeningOrderQty?: number;
  maxClosingOrderQty?: number;
  maxBackMonth?: number;
  preExpirationDays?: number;
  marginPercentage?: number;
  marginDollarValue?: number;
  hardLimit?: boolean;
  categoryPositionLimitId: number;
}
export interface ClearingHouse {
  id: number;
  name: string;
}
export interface Command {
  id: number;
  orderId: number;
  timestamp: string;
  clOrdId?: string;
  commandType: string;
  commandStatus: string;
  senderId?: number;
  userSessionId?: number;
  activationTime?: string;
  customTag50?: string;
  isAutomated?: boolean;
}
export interface CommandReport {
  id: number;
  commandId: number;
  timestamp: string;
  commandStatus: string;
  rejectReason?: string;
  text?: string;
  ordStatus?: string;
}
export interface CommandResult {
  failureReason?: string;
  failureText?: string;
  commandId?: number;
}
export interface Contract {
  id: number;
  name: string;
  contractMaturityId: number;
}
export interface ContractGroup {
  id: number;
  name: string;
}
export interface ContractMargin {
  id: number;
  initialMargin: number;
  maintenanceMargin: number;
  timestamp: string;
}
export interface ContractMaturity {
  id: number;
  productId: number;
  expirationMonth: number;
  expirationDate: string;
  firstIntentDate?: string;
  underlyingId?: number;
  isFront: boolean;
}
export interface Country {
  id: number;
  name: string;
  code: string;
  nationalIdLabel?: string;
  nationalIdTooltip?: string;
  nationalIdFormat?: string;
  nationalIdRegex?: string;
}
export interface CreateAlert {
  expression: string;
  validUntil?: string;
  triggerLimits?: number;
  message?: string;
}
export interface Currency {
  id: number;
  name: string;
  symbol?: string;
}
export interface CurrencyRate {
  id: number;
  timestamp: string;
  rate: number;
}
export interface DeleteAlert {
  alertId: number;
}
export interface DismissAlert {
  alertId: number;
}
export interface DryRun {
  accountId: number;
  orders: DryRunOrder[];
}
export interface DryRunOrder {
  contractId: number;
  action: string;
  orderQty: number;
  orderType: string;
  price?: number;
  stopPrice?: number;
}
export interface EstimatedFillFee {
  clearingFee?: number;
  clearingCurrencyId?: number;
  exchangeFee?: number;
  exchangeCurrencyId?: number;
  nfaFee?: number;
  nfaCurrencyId?: number;
  brokerageFee?: number;
  brokerageCurrencyId?: number;
  ipFee?: number;
  ipCurrencyId?: number;
  commission?: number;
  commissionCurrencyId?: number;
  orderRoutingFee?: number;
  orderRoutingCurrencyId?: number;
  commissionNotionalValueBPS?: number;
}
export interface EvaluateFillFee {
  productId: number;
  accountId?: number;
}
export interface EventProductSpec {
  ecProduct: Product;
  futuresProduct: Product;
  frontMaturity: ContractMaturity;
  strikes: Contract[];
}
export interface Exchange {
  id: number;
  name: string;
}
export interface ExecutionReport {
  id: number;
  commandId: number;
  name: string;
  accountId: number;
  contractId: number;
  timestamp: string;
  tradeDate?: TradeDate;
  orderId: number;
  execType: string;
  execRefId?: string;
  ordStatus?: string;
  action: string;
  cumQty?: number;
  avgPx?: number;
  lastQty?: number;
  lastPx?: number;
  rejectReason?: string;
  text?: string;
  exchangeOrderId?: string;
}
export interface Fee {
  id: number;
  exchangeId?: number;
  productId?: number;
  accountId?: number;
  tradovateSubscriptionPlanId?: number;
  clearingHouseId?: number;
  productType?: string;
  salesCode?: string;
  isMicro?: boolean;
  clearingFee?: number;
  clearingCurrencyId?: number;
  exchangeFee?: number;
  exchangeCurrencyId?: number;
  nfaFee?: number;
  nfaCurrencyId?: number;
  brokerageFee?: number;
  brokerageCurrencyId?: number;
  ipFee?: number;
  ipCurrencyId?: number;
  commission?: number;
  commissionCurrencyId?: number;
  orderRoutingFee?: number;
  orderRoutingCurrencyId?: number;
  commissionMode?: string;
}
export interface Fill {
  id: number;
  orderId: number;
  contractId: number;
  timestamp: string;
  tradeDate: TradeDate;
  action: string;
  qty: number;
  price: number;
  active: boolean;
  finallyPaired: number;
}
export interface FillFee {
  id: number;
  clearingFee?: number;
  clearingCurrencyId?: number;
  exchangeFee?: number;
  exchangeCurrencyId?: number;
  nfaFee?: number;
  nfaCurrencyId?: number;
  brokerageFee?: number;
  brokerageCurrencyId?: number;
  ipFee?: number;
  ipCurrencyId?: number;
  commission?: number;
  commissionCurrencyId?: number;
  orderRoutingFee?: number;
  orderRoutingCurrencyId?: number;
}
export interface FillPair {
  id: number;
  positionId: number;
  buyFillId: number;
  sellFillId: number;
  qty: number;
  buyPrice: number;
  sellPrice: number;
  active: boolean;
}
export interface FormattedValue {
  value: number;
  formattedValue: string;
}
export interface GetCashBalanceSnapshot {
  accountId: number;
}
export interface GetEventProducts {}
export interface GetOptionsChain {
  contractId: number;
}
export interface GetProcessingFee {
  accountId?: number;
  creditCardId?: number;
}
export interface GetProduct {
  id: string;
}
export interface GetProductFeeParams {
  productIds: number[];
}
export interface GetTimestamp {}
export interface InterruptOrderStrategy {
  orderStrategyId: number;
}
export interface LiquidatePosition {
  accountId: number;
  contractId: number;
  admin: boolean;
  customTag50?: string;
  isAutomated?: boolean;
}
export interface LiquidatePositions {
  positions: number[];
  admin: boolean;
  customTag50?: string;
  isAutomated?: boolean;
}
export interface MFAOptions {
  h: string;
  trustedSignInEnabled: boolean;
  totpEnabled: boolean;
  webAuthnEnabled: boolean;
  smsEnabled: boolean;
  phoneNumber?: string;
}
export interface MarginSnapshot {
  id: number;
  timestamp: string;
  riskTimePeriodId: number;
  initialMargin: number;
  maintenanceMargin: number;
  autoLiqLevel?: number;
  liqOnlyLevel?: number;
  totalUsedMargin: number;
  fullInitialMargin: number;
  positionMargin: number;
  totalUsedFullMargin: number;
}
export interface MarkReadAlertSignal {
  alertId: number;
  alertSignalId: number;
}
export interface Me {}
export interface ModifyAlert {
  alertId: number;
  expression: string;
  validUntil?: string;
  triggerLimits?: number;
  message?: string;
}
export interface ModifyCredentials {
  userId?: number;
  name: string;
  password: string;
  currentPassword: string;
}
export interface ModifyEmailAddress {
  userId?: number;
  email: string;
}
export interface ModifyOrder {
  orderId: number;
  clOrdId?: string;
  orderQty: number;
  orderType: string;
  price?: number;
  stopPrice?: number;
  maxShow?: number;
  pegDifference?: number;
  timeInForce?: string;
  expireTime?: string;
  text?: string;
  activationTime?: string;
  customTag50?: string;
  isAutomated?: boolean;
}
export interface ModifyOrderStrategy {
  orderStrategyId: number;
  command: string;
  customTag50?: string;
}
export interface ModifyPassword {
  userId?: number;
  password: string;
  currentPassword: string;
}
export interface OAuthToken {
  grant_type: string;
  code?: string;
  redirect_uri?: string;
  client_id?: string;
  client_secret?: string;
  httpAuth?: string;
}
export interface OpenDemoAccount {
  templateAccountId?: number;
  name?: string;
  initialBalance?: number;
}
export interface Order {
  id: number;
  accountId: number;
  contractId?: number;
  spreadDefinitionId?: number;
  timestamp: string;
  action: string;
  ordStatus: string;
  executionProviderId?: number;
  ocoId?: number;
  parentId?: number;
  linkedId?: number;
  admin: boolean;
}
export interface OrderStrategy {
  id: number;
  accountId: number;
  timestamp: string;
  contractId: number;
  orderStrategyTypeId: number;
  initiatorId?: number;
  action: string;
  params?: string;
  uuid?: string;
  status: string;
  failureMessage?: string;
  senderId?: number;
  customTag50?: string;
  userSessionId?: number;
}
export interface OrderStrategyLink {
  id: number;
  orderStrategyId: number;
  orderId: number;
  label: string;
}
export interface OrderStrategyType {
  id: number;
  name: string;
  enabled: boolean;
}
export interface OrderVersion {
  id: number;
  orderId: number;
  orderQty: number;
  orderType: string;
  price?: number;
  stopPrice?: number;
  maxShow?: number;
  pegDifference?: number;
  timeInForce?: string;
  expireTime?: string;
  text?: string;
}
export interface PlaceOCO {
  accountSpec?: string;
  accountId?: number;
  clOrdId?: string;
  action: string;
  symbol: string;
  orderQty: number;
  orderType: string;
  price?: number;
  stopPrice?: number;
  maxShow?: number;
  pegDifference?: number;
  timeInForce?: string;
  expireTime?: string;
  text?: string;
  activationTime?: string;
  customTag50?: string;
  isAutomated?: boolean;
  other: RestrainedOrderVersion;
}
export interface PlaceOSO {
  accountSpec?: string;
  accountId?: number;
  clOrdId?: string;
  action: string;
  symbol: string;
  orderQty: number;
  orderType: string;
  price?: number;
  stopPrice?: number;
  maxShow?: number;
  pegDifference?: number;
  timeInForce?: string;
  expireTime?: string;
  text?: string;
  activationTime?: string;
  customTag50?: string;
  isAutomated?: boolean;
  bracket1: RestrainedOrderVersion;
  bracket2?: RestrainedOrderVersion;
}
export interface PlaceOcoResult {
  failureReason?: string;
  failureText?: string;
  orderId?: number;
  ocoId?: number;
}
export interface PlaceOrder {
  accountSpec?: string;
  accountId?: number;
  clOrdId?: string;
  action: string;
  symbol: string;
  orderQty: number;
  orderType: string;
  price?: number;
  stopPrice?: number;
  maxShow?: number;
  pegDifference?: number;
  timeInForce?: string;
  expireTime?: string;
  text?: string;
  activationTime?: string;
  customTag50?: string;
  isAutomated?: boolean;
}
export interface PlaceOrderResult {
  failureReason?: string;
  failureText?: string;
  orderId?: number;
}
export interface PlaceOsoResult {
  failureReason?: string;
  failureText?: string;
  orderId?: number;
  oso1Id?: number;
  oso2Id?: number;
}
export interface Position {
  id: number;
  accountId: number;
  contractId: number;
  timestamp: string;
  tradeDate: TradeDate;
  netPos: number;
  netPrice?: number;
  bought: number;
  boughtValue: number;
  sold: number;
  soldValue: number;
  prevPos: number;
  prevPrice?: number;
}
export interface PositionLog {
  id: number;
  accountId: number;
  contractId: number;
  timestamp: string;
  tradeDate: TradeDate;
  netPos: number;
  netPrice?: number;
  bought: number;
  boughtValue: number;
  sold: number;
  soldValue: number;
  positionChangeType: string;
  fillId?: number;
}
export interface ProcessingFee {
  errorText?: string;
  amount?: number;
}
export interface Product {
  id: number;
  name: string;
  currencyId: number;
  productType: string;
  description: string;
  exchangeId: number;
  contractGroupId: number;
  riskDiscountContractGroupId?: number;
  status: string;
  months?: string;
  isSecured?: boolean;
  valuePerPoint: number;
  priceFormatType: string;
  priceFormat: number;
  tickSize: number;
}
export interface ProductDetails {
  product: ProductExtended;
}
export interface ProductExtended {
  id: number;
  name: string;
  description: string;
  months?: string;
  tickSize: FormattedValue;
  valuePerPoint: FormattedValue;
  exchange: string;
  group: string;
  initialMargin?: FormattedValue;
  maintenanceMargin?: FormattedValue;
  dayMargin?: FormattedValue;
  nightMargin?: FormattedValue;
  clearingFee?: FormattedValue;
  exchangeFee?: FormattedValue;
  nfaFee?: FormattedValue;
  brokerageFee?: FormattedValue;
  commission?: FormattedValue;
  orderRoutingFee?: FormattedValue;
  sundayOpenTime?: string;
  openTime?: string;
  closeTime?: string;
}
export interface ProductFeeParams {
  clearingFee?: number;
  clearingCurrencyId?: number;
  exchangeFee?: number;
  exchangeCurrencyId?: number;
  nfaFee?: number;
  nfaCurrencyId?: number;
  brokerageFee?: number;
  brokerageCurrencyId?: number;
  ipFee?: number;
  ipCurrencyId?: number;
  commission?: number;
  commissionCurrencyId?: number;
  orderRoutingFee?: number;
  orderRoutingCurrencyId?: number;
  productId: number;
  dayMargin?: number;
  nightMargin?: number;
  fullMargin?: ProductMargin;
  commissionNotionalValueBPS?: number;
}
export interface ProductList {
  items: ProductExtended[];
}
export interface ProductMargin {
  id: number;
  initialMargin: number;
  maintenanceMargin: number;
  timestamp: string;
}
export interface ProductSession {
  id: number;
  openTime: TradeTime;
  startTime: TradeTime;
  stopTime: TradeTime;
  closeTime: TradeTime;
  sundayOpenTime?: TradeTime;
}
export interface Products {}
export interface Property {
  id: number;
  name: string;
  propertyType: string;
  enumOptions?: string;
  defaultValue?: string;
}
export interface RenewAccessToken {}
export interface ResetAlert {
  alertId: number;
}
export interface ResetDemoAccountState {
  accountIds: number[];
  resetTradeDate: TradeDate;
}
export interface RestrainedOrderVersion {
  action: string;
  clOrdId?: string;
  orderType: string;
  price?: number;
  stopPrice?: number;
  maxShow?: number;
  pegDifference?: number;
  timeInForce?: string;
  expireTime?: string;
  text?: string;
}
export interface RiskDiscountContractGroup {
  id: number;
  name: string;
}
export interface RiskEvaluationDetails {
  beforeInitialMarginReq: number;
  beforeInitialFullMarginReq: number;
  beforeOpenCollateralReq: number;
  beforeNetPos: number;
  isExitOrder: boolean;
  initialMarginReq: number;
  initialFullMarginReq: number;
  openCollateralReq: number;
  totalCash: number;
  futuresOpenPnL: number;
  optionsOpenPnL: number;
  riskCredit: number;
  netLiqValue: number;
  futureCommAndFees: number;
  totalCashRequired: number;
  excess: number;
  hypoLongPos: number;
  hypoShortPos: number;
}
export interface RollContract {
  name: string;
  forward: boolean;
  ifExpired?: boolean;
}
export interface RollContractBase {
  name: string;
  forward: boolean;
  ifExpired?: boolean;
}
export interface RollContracts {
  rollContracts: RollContractBase[];
}
export interface Search {
  text?: string;
  exchange?: string;
  group?: string;
}
export interface ShardingExpression {
  expressionType: string;
  divisor: number;
  remainder: number;
}
export interface SpreadDefinition {
  id: number;
  timestamp: string;
  spreadType: string;
  uds: boolean;
}
export interface StartOrderStrategy {
  accountId?: number;
  accountSpec?: string;
  symbol: string;
  orderStrategyTypeId: number;
  action: string;
  params?: string;
  uuid?: string;
  customTag50?: string;
  isAutomated?: boolean;
}
export interface SyncMessage {
  users: User[];
  accounts?: Account[];
  accountRiskStatuses?: AccountRiskStatus[];
  marginSnapshots?: MarginSnapshot[];
  userAccountAutoLiqs?: UserAccountAutoLiq[];
  cashBalances?: CashBalance[];
  currencies?: Currency[];
  positions?: Position[];
  fillPairs?: FillPair[];
  orders?: Order[];
  contracts?: Contract[];
  contractMaturities?: ContractMaturity[];
  products?: Product[];
  exchanges?: Exchange[];
  spreadDefinitions?: SpreadDefinition[];
  commands?: Command[];
  commandReports?: CommandReport[];
  executionReports?: ExecutionReport[];
  orderVersions?: OrderVersion[];
  fills?: Fill[];
  orderStrategies?: OrderStrategy[];
  orderStrategyLinks?: OrderStrategyLink[];
  userProperties?: UserProperty[];
  properties?: Property[];
  userPlugins?: UserPlugin[];
  userReadStatuses?: UserReadStatus[];
  userPromoCodes?: UserPromoCode[];
  contractGroups: ContractGroup[];
  orderStrategyTypes?: OrderStrategyType[];
}
export interface TradingSession {
  id: number;
  contractMaturityId: number;
  tradeDate: TradeDate;
  startTime: string;
  openTime: string;
  closeTime: string;
  endTime: string;
}
export interface User {
  id: number;
  name: string;
  timestamp: string;
  email: string;
  status: string;
  professional: boolean;
  organizationId?: number;
  introducingPartnerId?: number;
}
export interface UserAccountAutoLiq {
  id: number;
  changesLocked?: boolean;
  marginPercentageAlert?: number;
  dailyLossPercentageAlert?: number;
  dailyLossAlert?: number;
  marginPercentageLiqOnly?: number;
  dailyLossPercentageLiqOnly?: number;
  dailyLossLiqOnly?: number;
  marginPercentageAutoLiq?: number;
  dailyLossPercentageAutoLiq?: number;
  dailyLossAutoLiq?: number;
  weeklyLossAutoLiq?: number;
  flattenTimestamp?: string;
  trailingMaxDrawdown?: number;
  trailingMaxDrawdownLimit?: number;
  trailingMaxDrawdownMode?: string;
  dailyProfitAutoLiq?: number;
  weeklyProfitAutoLiq?: number;
  doNotUnlock?: boolean;
}
export interface UserPlugin {
  id: number;
  userId: number;
  timestamp: string;
  planPrice: number;
  cashBalanceLogId?: number;
  accountId?: number;
  pluginName: string;
  approval: boolean;
  entitlementId?: number;
  startDate: TradeDate;
  expirationDate?: TradeDate;
  paidAmount: number;
  autorenewal?: boolean;
  planCategories?: string;
  rebate?: number;
}
export interface UserPromoCode {
  id: number;
  userId: number;
  promoCodeId: number;
  accountId?: number;
  source: string;
  comments?: string;
}
export interface UserProperty {
  id: number;
  userId: number;
  propertyId: number;
  value?: string;
}
export interface UserReadStatus {
  id: number;
  newsStoryId?: number;
}
export interface UserStatusMessage {
  errorText?: string;
  status?: string;
}
export interface ChangeDemoBalance {
  cashChange: number;
  accountId: number;
}
export interface ChangeSpeed {
  speed: number;
}
export interface CheckReplaySession {
  startTimestamp: string;
}
export interface InitializeClock {
  startTimestamp: string;
  speed: number;
  initialBalance?: number;
}
export interface AccessTokenRequest {
  name: string;
  password: string;
  appId?: string;
  appVersion?: string;
  deviceId?: string;
  cid?: string;
  sec?: string;
}
export interface SyncRequest {
  users?: number[];
  accounts?: number[];
  splitResponses?: boolean;
  cutoffTimestamp?: string;
  entityTypes?: string[];
  shardingExpression?: ShardingExpression;
  fullOrgSnapshot?: boolean;
}
export interface AccessTokenResponse {
  errorText?: string;
  accessToken?: string;
  expirationTime?: string;
  passwordExpirationTime?: string;
  userStatus?: string;
  userId?: number;
  name?: string;
  hasLive?: boolean;
  hasSimPlus?: boolean;
}
export interface AlertResponse {
  errorText?: string;
  alert?: Alert;
}
export interface DeleteResultResponse {
  errorText?: string;
  success?: boolean;
}
export interface DryRunResponse {
  errorText?: string;
  rejectReason?: string;
  comment?: string;
  details?: RiskEvaluationDetails;
  fees?: EstimatedFillFee;
}
export interface EvaluateFillFeeResponse {
  clearingFee?: number;
  clearingCurrencyId?: number;
  exchangeFee?: number;
  exchangeCurrencyId?: number;
  nfaFee?: number;
  nfaCurrencyId?: number;
  brokerageFee?: number;
  brokerageCurrencyId?: number;
  ipFee?: number;
  ipCurrencyId?: number;
  commission?: number;
  commissionCurrencyId?: number;
  orderRoutingFee?: number;
  orderRoutingCurrencyId?: number;
  commissionNotionalValueBPS?: number;
  exchangeFeeId?: number;
  clearingFeeId?: number;
  nfaFeeId?: number;
  brokerageFeeId?: number;
  ipFeeId?: number;
  commissionFeeId?: number;
  orderRoutingFeeId?: number;
}
export interface EventProductsResponse {
  errorText?: string;
  products: EventProductSpec[];
}
export interface OAuthMeResponse {
  errorText?: string;
  userId?: number;
  name?: string;
  fullName?: string;
  email?: string;
  emailVerified?: boolean;
  isTrial?: boolean;
  organizationName?: string;
  currentAccountPlan?: string;
  currentMDSubs?: string[];
  currentBalance?: number;
  activePlugins?: string[];
}
export interface OAuthTokenResponse {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
  error?: string;
  error_description?: string;
}
export interface OpenDemoAccountResponse {
  errorText?: string;
  accountId?: number;
}
export interface OptionsChainResponse {
  errorText?: string;
  products: Product[];
  contractMaturities: ContractMaturity[];
  contracts: Contract[];
}
export interface OrderStrategyStatusResponse {
  errorText?: string;
  orderStrategy?: OrderStrategy;
}
export interface ProductFeeParamsResponse {
  params: ProductFeeParams[];
}
export interface RollContractResponse {
  errorText?: string;
  contract?: Contract;
}
export interface RollContractsResponse {
  errorText?: string;
  contracts: object;
}
export interface SimpleResponse {
  errorText?: string;
  ok: boolean;
}
export interface TimestampResponse {
  timestamp: string;
}
export interface CheckReplaySessionResponse {
  checkStatus: string;
  startTimestamp?: string;
}
export interface MdSubscription {
  symbol: string;
  subscriptionId: number;
}
export interface SubscribeQuoteRequest {
  symbol: string;
}
export interface SubscribeQuoteResponse {
  symbol: string;
  subscriptionId: number;
}
export interface UnsubscribeQuoteRequest {
  symbol: string | number;
}
export interface UnsubscribeQuoteResponse {
  symbol: string;
  subscriptionId: number;
}
export interface SubscribeDOMRequest {
  symbol: string;
  depth?: number;
}
export interface SubscribeDOMResponse {
  symbol: string;
  subscriptionId: number;
}
export interface UnsubscribeDOMRequest {
  symbol: string | number;
}
export interface UnsubscribeDOMResponse {
  symbol: string;
  subscriptionId: number;
}
export interface SubscribeHistogramRequest {
  symbol: string;
  interval?: string;
  lookbackPeriod?: number;
}
export interface SubscribeHistogramResponse {
  symbol: string;
  subscriptionId: number;
}
export interface UnsubscribeHistogramRequest {
  symbol: string | number;
}
export interface UnsubscribeHistogramResponse {
  symbol: string;
  subscriptionId: number;
}
export interface ChartDescription {
  underlyingType:
    | 'MinuteBar'
    | 'DailyBar'
    | 'WeeklyBar'
    | 'MonthlyBar'
    | 'YearlyBar'
    | 'CandleStick'
    | 'Tick'
    | string;
  elementSize: number;
  withHistogram?: boolean;
}
export interface TimeRange {
  asMuchAsElements?: number;
  closestTimestamp?: string;
  closestTickId?: number;
}
export interface GetChartRequest {
  symbol: string;
  chartDescription: ChartDescription;
  timeRange: TimeRange;
}
export interface GetChartResponse {
  subscriptionId: number;
  realtimeId: number;
  historicalId: number;
  symbol: string;
  charts?: any[];
}
export interface CancelChartRequest {
  subscriptionId: number;
}
export interface CancelChartResponse {
  subscriptionId: number;
}
export type EventType =
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'tradetime';
      entity: TradeTime;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'tradedate';
      entity: TradeDate;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'account';
      entity: Account;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'accountriskstatus';
      entity: AccountRiskStatus;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'accountriskstatuslog';
      entity: AccountRiskStatusLog;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'alert';
      entity: Alert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'alertsignal';
      entity: AlertSignal;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'cancelorder';
      entity: CancelOrder;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'cashbalance';
      entity: CashBalance;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'cashbalancelog';
      entity: CashBalanceLog;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'cashbalancesnapshot';
      entity: CashBalanceSnapshot;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'categorypositionlimit';
      entity: CategoryPositionLimit;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'categoryriskparameter';
      entity: CategoryRiskParameter;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'clearinghouse';
      entity: ClearingHouse;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'command';
      entity: Command;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'commandreport';
      entity: CommandReport;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'commandresult';
      entity: CommandResult;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'contract';
      entity: Contract;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'contractgroup';
      entity: ContractGroup;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'contractmargin';
      entity: ContractMargin;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'contractmaturity';
      entity: ContractMaturity;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'country';
      entity: Country;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'createalert';
      entity: CreateAlert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'currency';
      entity: Currency;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'currencyrate';
      entity: CurrencyRate;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'deletealert';
      entity: DeleteAlert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'dismissalert';
      entity: DismissAlert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'dryrun';
      entity: DryRun;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'dryrunorder';
      entity: DryRunOrder;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'estimatedfillfee';
      entity: EstimatedFillFee;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'evaluatefillfee';
      entity: EvaluateFillFee;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'eventproductspec';
      entity: EventProductSpec;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'exchange';
      entity: Exchange;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'executionreport';
      entity: ExecutionReport;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'fee';
      entity: Fee;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'fill';
      entity: Fill;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'fillfee';
      entity: FillFee;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'fillpair';
      entity: FillPair;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'formattedvalue';
      entity: FormattedValue;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getcashbalancesnapshot';
      entity: GetCashBalanceSnapshot;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'geteventproducts';
      entity: GetEventProducts;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getoptionschain';
      entity: GetOptionsChain;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getprocessingfee';
      entity: GetProcessingFee;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getproduct';
      entity: GetProduct;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getproductfeeparams';
      entity: GetProductFeeParams;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'gettimestamp';
      entity: GetTimestamp;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'interruptorderstrategy';
      entity: InterruptOrderStrategy;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'liquidateposition';
      entity: LiquidatePosition;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'liquidatepositions';
      entity: LiquidatePositions;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'mfaoptions';
      entity: MFAOptions;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'marginsnapshot';
      entity: MarginSnapshot;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'markreadalertsignal';
      entity: MarkReadAlertSignal;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'me';
      entity: Me;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'modifyalert';
      entity: ModifyAlert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'modifycredentials';
      entity: ModifyCredentials;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'modifyemailaddress';
      entity: ModifyEmailAddress;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'modifyorder';
      entity: ModifyOrder;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'modifyorderstrategy';
      entity: ModifyOrderStrategy;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'modifypassword';
      entity: ModifyPassword;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'oauthtoken';
      entity: OAuthToken;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'opendemoaccount';
      entity: OpenDemoAccount;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'order';
      entity: Order;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'orderstrategy';
      entity: OrderStrategy;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'orderstrategylink';
      entity: OrderStrategyLink;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'orderstrategytype';
      entity: OrderStrategyType;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'orderversion';
      entity: OrderVersion;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'placeoco';
      entity: PlaceOCO;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'placeoso';
      entity: PlaceOSO;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'placeocoresult';
      entity: PlaceOcoResult;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'placeorder';
      entity: PlaceOrder;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'placeorderresult';
      entity: PlaceOrderResult;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'placeosoresult';
      entity: PlaceOsoResult;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'position';
      entity: Position;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'positionlog';
      entity: PositionLog;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'processingfee';
      entity: ProcessingFee;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'product';
      entity: Product;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'productdetails';
      entity: ProductDetails;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'productextended';
      entity: ProductExtended;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'productfeeparams';
      entity: ProductFeeParams;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'productlist';
      entity: ProductList;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'productmargin';
      entity: ProductMargin;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'productsession';
      entity: ProductSession;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'products';
      entity: Products;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'property';
      entity: Property;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'renewaccesstoken';
      entity: RenewAccessToken;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'resetalert';
      entity: ResetAlert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'resetdemoaccountstate';
      entity: ResetDemoAccountState;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'restrainedorderversion';
      entity: RestrainedOrderVersion;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'riskdiscountcontractgroup';
      entity: RiskDiscountContractGroup;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'riskevaluationdetails';
      entity: RiskEvaluationDetails;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'rollcontract';
      entity: RollContract;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'rollcontractbase';
      entity: RollContractBase;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'rollcontracts';
      entity: RollContracts;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'search';
      entity: Search;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'shardingexpression';
      entity: ShardingExpression;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'spreaddefinition';
      entity: SpreadDefinition;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'startorderstrategy';
      entity: StartOrderStrategy;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'syncmessage';
      entity: SyncMessage;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'tradingsession';
      entity: TradingSession;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'user';
      entity: User;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'useraccountautoliq';
      entity: UserAccountAutoLiq;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'userplugin';
      entity: UserPlugin;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'userpromocode';
      entity: UserPromoCode;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'userproperty';
      entity: UserProperty;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'userreadstatus';
      entity: UserReadStatus;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'userstatusmessage';
      entity: UserStatusMessage;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'changedemobalance';
      entity: ChangeDemoBalance;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'changespeed';
      entity: ChangeSpeed;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'checkreplaysession';
      entity: CheckReplaySession;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'initializeclock';
      entity: InitializeClock;
    }
