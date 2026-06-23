export type EntityType =
  | TradeTime
  | TradeDate
  | AcceptTradingPermission
  | Account
  | AccountRiskStatus
  | AccountRiskStatusLog
  | AddEntitlementSubscription
  | AddMarketDataSubscription
  | AddTradovateSubscription
  | AdminAlert
  | AdminAlertSignal
  | AgreedLiquidationPolicy
  | AgreedSentimentDisclaimerPolicy
  | AgreedTermsAndConditions
  | AgreementDocument
  | AgreementDocumentTemplate
  | Alert
  | AlertSignal
  | AnnualReview
  | AsCustomerApplicationDocument
  | AutoLiqTransaction
  | CalculatePlanUpgrade
  | CancelEverything
  | CancelOrder
  | CancelPluginAutorenewal
  | CancelTradovateSubscription
  | CashBalance
  | CashBalanceLog
  | CashBalanceSnapshot
  | CategoryPositionLimit
  | CategoryRiskParameter
  | ChangePluginPermission
  | ChangeUserProperty
  | CheckDuplicate
  | ClearingHouse
  | ClientApp
  | Command
  | CommandReport
  | CommandResult
  | CompleteAlertSignal
  | ContactInfo
  | Contract
  | ContractGroup
  | ContractMargin
  | ContractMaturity
  | CorporateApplicant
  | Country
  | CountryIsBanned
  | CreateAlert
  | CreateEvaluationAccounts
  | CreateEvaluationUsers
  | CreateNewTrial
  | CreateTradingPermission
  | Currency
  | CurrencyRate
  | CustomerApplication
  | CustomerApplicationCheckState
  | CustomerApplicationDocument
  | CustomerApplicationSigningState
  | CustomerMarketingInfo
  | DeleteAlert
  | DeleteUserAccountPositionLimit
  | DeleteUserAccountRiskParameter
  | DismissAlert
  | DownloadUserDocumentPreview
  | DownloadW8CertificationDocument
  | DryRun
  | DryRunOrder
  | DuplicateMetadata
  | EmergencyRisk
  | Entitlement
  | EstimatedFillFee
  | EvaluateFillFee
  | EvaluationAccount
  | EvaluationUser
  | EventProductSpec
  | Exchange
  | ExecutionReport
  | Fee
  | Fill
  | FillFee
  | FillPair
  | FormattedValue
  | FundTransaction
  | GetAccountTradingPermissions
  | GetAgreementDocument
  | GetCashBalanceSnapshot
  | GetCurrentAnnualReviewInfo
  | GetEntitlementEligibilityInfo
  | GetEventProducts
  | GetFundingOptions
  | GetLocalizedAgreementDocument
  | GetOptionsChain
  | GetProcessingFee
  | GetProduct
  | GetProductFeeParams
  | GetTimestamp
  | GetUserSignedDocument
  | IndividualApplicant
  | InterruptOrderStrategy
  | JointApplicant
  | LiquidatePosition
  | LiquidatePositions
  | MFAOptions
  | MarginSnapshot
  | MarkReadAlertSignal
  | MarketDataSubscription
  | MarketDataSubscriptionExchangeScope
  | MarketDataSubscriptionPlan
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
  | Organization
  | PermissionedAccountAutoLiq
  | PlaceOCO
  | PlaceOSO
  | PlaceOcoResult
  | PlaceOrder
  | PlaceOrderResult
  | PlaceOsoResult
  | Position
  | PositionLog
  | PostTradeRisk
  | PreTradeRisk
  | PreTradeRiskParameter
  | PrepareAgreementDocuments
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
  | PulseLiveOptOut
  | RenewAccessToken
  | ResetAlert
  | ResetAutoLiqStatus
  | ResetDemoAccountState
  | RestrainedOrderVersion
  | RevokeTradingPermission
  | RevokeTradingPermissions
  | RiskCategory
  | RiskDiscountContractGroup
  | RiskEvaluationDetails
  | RiskTimePeriod
  | RollContract
  | RollContractBase
  | RollContracts
  | Search
  | SecondMarketDataSubscription
  | SendNotifyAdminAlert
  | SetAccountNotes
  | SetAdminAutoLiqAction
  | SetDemoHalt
  | ShardingExpression
  | SignAgreementDocuments
  | SignNonProCertification
  | SignUpOrganizationMember
  | SignUserDocument
  | SignW8
  | SpreadDefinition
  | StartCustomerApplication
  | StartOrderStrategy
  | SubmitAnnualReview
  | SubmitApplicant
  | SubmitCustomerApplicationDocument
  | SwitchRiskCategory
  | SwitchToProfessional
  | SyncMessage
  | TakeAlertSignalOwnership
  | ThirdPartyDataSharing
  | TradingPermission
  | TradingPermissionConsent
  | TradingSession
  | TradovateSubscription
  | TradovateSubscriptionPlan
  | UpdateContactInfo
  | UpdateContactInfoName
  | UpdateMaxNetLiq
  | UpdateUserAutoLiq
  | User
  | UserAccountAutoLiq
  | UserAccountPositionLimit
  | UserAccountRiskParameter
  | UserCertification
  | UserDevice
  | UserPlugin
  | UserPromoCode
  | UserProperty
  | UserReadStatus
  | UserSession
  | UserSessionStats
  | UserSignedDocument
  | UserStatusMessage
  | WalletTransfer
  | ActivateSecondMarketDataSubscriptionRenewal
  | AddSecondMarketDataSubscription
  | CancelSecondMarketDataSubscription
  | CancelSecondMarketDataSubscriptionRenewal
  | ChangeDemoBalance
  | ChangeSpeed
  | Chat
  | ChatMessage
  | CheckReplaySession
  | CheckStripeFundingEligibility
  | CloseChat
  | GetSecondMarketDataSubscriptionCost
  | InitializeClock
  | MarkAsReadChatMessage
  | PostChatMessage;
export type RequestType =
  | AccessTokenRequest
  | DownloadSubAccountRequestPreview
  | RequestTradingPermission
  | SignSubAccountRequest
  | SubAccountRequest
  | SubAccountRequestPreviewResponse
  | SyncRequest;
export type ResponseType =
  | AccessTokenResponse
  | AccountRiskStatusResponse
  | AdminAlertSignalResponse
  | AgreementDocumentsResponse
  | AlertResponse
  | ApplicantResponse
  | CancelEverythingResponse
  | CertificationContentResponse
  | CountryIsBannedResponse
  | CreateEvaluationAccountResponse
  | CreateEvaluationAccountsResponse
  | CreateEvaluationUserResponse
  | CreateEvaluationUsersResponse
  | CurrentAnnualReviewInfoResponse
  | CustomerApplicationResponse
  | DeleteResultResponse
  | DocumentContentResponse
  | DownloadUserDocumentPreviewResponse
  | DryRunResponse
  | EligibilityInfoResponse
  | EntitlementSubscriptionResponse
  | EvaluateFillFeeResponse
  | EventProductsResponse
  | FundTransactionResponse
  | FundingOptionsResponse
  | MarketDataSubscriptionResponse
  | OAuthMeResponse
  | OAuthTokenResponse
  | OpenDemoAccountResponse
  | OptionsChainResponse
  | OrderStrategyStatusResponse
  | PlanUpgradeResponse
  | ProductFeeParamsResponse
  | PulseLiveOptOutResponse
  | RollContractResponse
  | RollContractsResponse
  | SignUpResponse
  | SignW8Response
  | SimpleResponse
  | SubmitAnnualReviewResponse
  | ThirdPartyDataSharingResponse
  | TimestampResponse
  | TradingPermissionResponse
  | TradingPermissionsResponse
  | TradovateSubscriptionResponse
  | UpdateContactInfoResponse
  | UpdateUserAutoLiqResponse
  | ChatMessageResponse
  | ChatResponse
  | CheckReplaySessionResponse
  | CheckStripeFundingEligibilityResponse
  | SecondMarketDataSubscriptionCostResponse
  | SecondMarketDataSubscriptionResponse;
export interface TradeTime {
  hour: number;
  minute: number;
}
export interface TradeDate {
  year: number;
  month: number;
  day: number;
}
export interface AcceptTradingPermission {
  tradingPermissionId: number;
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
export interface AddEntitlementSubscription {
  entitlementId: number;
  creditCardId?: number;
  accountId?: number;
  userId?: number;
  nonProSigned?: boolean;
}
export interface AddMarketDataSubscription {
  marketDataSubscriptionPlanIds: number[];
  year: number;
  month: number;
  creditCardId?: number;
  accountId?: number;
  userId?: number;
}
export interface AddTradovateSubscription {
  tradovateSubscriptionPlanId: number;
  creditCardId?: number;
  accountId?: number;
  userId?: number;
}
export interface AdminAlert {
  id: number;
  name: string;
  timestamp: string;
}
export interface AdminAlertSignal {
  id: number;
  timestamp: string;
  adminAlertId: number;
  relatedToAccountId?: number;
  relatedToUserId?: number;
  ownedByAdminId?: number;
  completed?: string;
  text: string;
  emailSent: boolean;
  subjectId: number;
}
export interface AgreedLiquidationPolicy {
  version: string;
}
export interface AgreedSentimentDisclaimerPolicy {
  version: string;
}
export interface AgreedTermsAndConditions {
  version: string;
}
export interface AgreementDocument {
  id: number;
  customerApplicationId: number;
  timestamp: string;
  agreementDocumentTemplateId: number;
  signedTimestamp?: string;
  locale?: string;
}
export interface AgreementDocumentTemplate {
  id: number;
  name: string;
  timestamp: string;
  adminUseOnly: boolean;
  individual: boolean;
  joint: boolean;
  IRA: boolean;
  trust: boolean;
  LLC: boolean;
  ACH: boolean;
  externalRef: string;
  highRisk: boolean;
  hedging: boolean;
  personalGuarantor: boolean;
  corporation: boolean;
  partnership: boolean;
  professional?: boolean;
  usaCustomer?: boolean;
  usaJointCustomer?: boolean;
  optionalSignature?: boolean;
  otherEntityControl?: boolean;
  genericSignWhitelist?: boolean;
  priority?: number;
  clearingHouseId?: number;
  countryId?: number;
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
export interface AnnualReview {
  id: number;
  userId: number;
  firstEmail?: string;
  secondEmail?: string;
  jointFirstEmail?: string;
  jointSecondEmail?: string;
  firstEmailSent?: string;
  secondEmailSent?: string;
  finished?: string;
  jointFinished?: string;
  riskDisclosureNeeded: boolean;
  identityCheckResult?: string;
  jointIdentityCheckResult?: string;
  archived: boolean;
  contactInfoId?: number;
  status: string;
}
export interface AsCustomerApplicationDocument {
  process: string;
  documentType: string;
  personType?: string;
  customerApplicationId?: number;
}
export interface AutoLiqTransaction {
  id: number;
  accountId: number;
  contractId: number;
  timestamp: string;
  liquidatedNetPos: number;
  liquidatedNetPrice?: number;
  cancelledSellLimitQty: number;
  cancelledSellLimitAvgPrice?: number;
  cancelledSellStopQty: number;
  cancelledSellStopAvgPrice?: number;
  cancelledBuyLimitQty: number;
  cancelledBuyLimitAvgPrice?: number;
  cancelledBuyStopQty: number;
  cancelledBuyStopAvgPrice?: number;
  initiator: string;
  adminAction: string;
  marketPriceSnapshot?: number;
  exitFilledQty: number;
  exitAvgFillPrice?: number;
  exitOrderId?: number;
  exitOrdStatus?: string;
  ownedByAdminId?: number;
  completed?: string;
}
export interface CalculatePlanUpgrade {
  tradovateSubscriptionPlanId: number;
}
export interface CancelEverything {
  userIds: number[];
  tradovateSubscriptions?: boolean;
  tradingPermissions?: boolean;
  userPlugins?: boolean;
  marketDataSubscriptions?: boolean;
}
export interface CancelOrder {
  orderId: number;
  clOrdId?: string;
  activationTime?: string;
  customTag50?: string;
  isAutomated?: boolean;
}
export interface CancelPluginAutorenewal {
  pluginName: string;
  userId?: number;
}
export interface CancelTradovateSubscription {
  tradovateSubscriptionId: number;
  cancelReason?: string;
  expire?: boolean;
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
export interface ChangePluginPermission {
  userId?: number;
  pluginName: string;
  approval: boolean;
}
export interface ChangeUserProperty {
  userId?: number;
  name: string;
  value?: string;
}
export interface CheckDuplicate {
  userId?: number;
  taxIdentifier?: string;
  nationalId?: string;
  countryCode?: string;
}
export interface ClearingHouse {
  id: number;
  name: string;
}
export interface ClientApp {
  id: number;
  name: string;
  timestamp: string;
  active: boolean;
  clientAuthType: string;
  internal: boolean;
  locked: boolean;
  allowTradeNoMD: boolean;
  archived: boolean;
  redirectURI?: string;
  scope?: string;
  logo?: string;
  privacyPolicyLink?: string;
  termsAndConditionsLink?: string;
  userId?: number;
  allowMD?: boolean;
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
export interface CompleteAlertSignal {
  adminAlertSignalId: number;
}
export interface ContactInfo {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state?: string;
  postCode?: string;
  country: string;
  phone: string;
  mailingIsDifferent?: boolean;
  mailingStreetAddress1?: string;
  mailingStreetAddress2?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingPostCode?: string;
  mailingCountry?: string;
  approvedId?: number;
  jointFirstName?: string;
  jointLastName?: string;
  iraCustodianName?: string;
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
export interface CorporateApplicant {
  id: number;
  name: string;
  entityType?: string;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state?: string;
  postCode?: string;
  country: string;
  phone: string;
  mailingIsDifferent?: boolean;
  mailingStreetAddress1?: string;
  mailingStreetAddress2?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingPostCode?: string;
  mailingCountry?: string;
  taxIdentifier?: string;
  openerPassportExpiry?: string;
  openerNationalId?: string;
  incorporationState?: string;
  incorporationCountry: string;
  incorporationDate?: string;
  dba?: string;
  companyWebsite?: string;
  natureOfBusiness: string;
  foreignInvestmentVehicle?: boolean;
  corporationType?: string;
  managers?: string;
  stakeholders?: string;
  otherInfo?: string;
  annualIncome?: string;
  netWorth?: string;
  marginType?: string;
  hedgeRepresentation?: string;
  professional?: boolean;
  riskOfLossCert?: boolean;
  leverageCert?: boolean;
  debitRiskCert?: boolean;
  addDepositCert?: boolean;
  othersInterest?: boolean;
  otherEntityControl?: boolean;
  debtorInBankruptcy?: boolean;
  annualIncomeNT?: string;
  netWorthNT?: string;
  liquidNetWorthNT?: string;
  riskCapitalSource?: string;
  otherFirms?: boolean;
  otherFirmsExplanation?: string;
  cftcRegistration?: boolean;
  chapter11?: boolean;
  personalGuarantorPrimary?: boolean;
  personalGuarantorEmail?: string;
  personalGuarantorName?: string;
  registeredAgent?: string;
  agentAddress?: string;
  agentCity?: string;
  agentState?: string;
  agentZip?: string;
  agentCountry?: string;
  numberOfMembers?: number;
  authorizedTraderFirstName?: string;
  authorizedTraderLastName?: string;
  authorizedTraderSSN?: string;
  authorizedTraderAddress?: string;
  authorizedTraderCity?: string;
  authorizedTraderState?: string;
  authorizedTraderZip?: string;
  authorizedTraderCountry?: string;
  authorizedMember?: boolean;
  depositAmount?: number;
  bankName?: string;
  bankAccount?: string;
  bankAddress?: string;
  bankCity?: string;
  bankCountry?: string;
  bankState?: string;
  bankZip?: string;
  commodityPool?: boolean;
  poolStatus?: string;
  offeringCircular?: boolean;
  financialInterest?: boolean;
  financialInterestExplanation?: string;
  companyDeposits?: boolean;
  exchangeMember?: boolean;
  nfaMember?: boolean;
  cftcMember?: boolean;
  cftcMemberDetails?: string;
  relatedToBroker?: boolean;
  relatedToBrokerExplanation?: string;
  othersSharePL?: boolean;
  othersSharePLExplanation?: string;
  pendingComplaints?: boolean;
  pendingComplaintsExplanation?: string;
  brokerTransferFunds?: boolean;
  brokerTransferFundsExplanation?: string;
  usaCorporation?: boolean;
  claimOfTaxTreatyResident?: boolean;
  claimOfTaxTreatyTINCert?: boolean;
  claimOfTaxTreatyTIN?: string;
  claimOfTaxTreatyNonIndividual?: boolean;
  openerFirstName?: string;
  openerLastName?: string;
  openerMiddleInitial?: string;
  openerMiddleName?: string;
  openerAddress?: string;
  openerAddress2?: string;
  openerCity?: string;
  openerState?: string;
  openerZip?: string;
  openerCountry?: string;
  openerPhone?: string;
  openerSecondaryPhone?: string;
  openerEmail?: string;
  openerUsaCitizen?: boolean;
  openerJobTitle?: string;
  openerBirthDate?: string;
  openerTaxIdentifier?: string;
  openerDriverLicense?: string;
  openerDriverLicenseState?: string;
  openerForeignCountryOfResidence?: string;
  openerPassport?: string;
  hdyhau?: string;
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
export interface CountryIsBanned {
  countryCode: string;
}
export interface CreateAlert {
  expression: string;
  validUntil?: string;
  triggerLimits?: number;
  message?: string;
}
export interface CreateEvaluationAccounts {
  accounts: EvaluationAccount[];
}
export interface CreateEvaluationUsers {
  users: EvaluationUser[];
}
export interface CreateNewTrial {}
export interface CreateTradingPermission {
  accountId: number;
  userId: number;
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
export interface CustomerApplication {
  id: number;
  userId: number;
  accountType: string;
  legalStatus: string;
  startDate: string;
  applicationStatus: string;
  archived: boolean;
  rejectReason?: string;
  additionalNotes?: string;
  accountId?: number;
  rejectDate?: string;
  clearingHouseId?: number;
  autoApprovalType?: string;
}
export interface CustomerApplicationCheckState {
  id: number;
  adminNotificationDate?: TradeDate;
  highRisk?: boolean;
  identityAutoCheckAttempts?: number;
  identityAutoCheck?: string;
  identityAutoCheckTransactionId?: string;
  identityQuestionCheck?: string;
  jointIdentityAutoCheckAttempts?: number;
  jointIdentityAutoCheck?: string;
  jointIdentityAutoCheckTransactionId?: string;
  jointIdentityQuestionCheck?: string;
  journeyApplicationToken?: string;
  jointJourneyApplicationToken?: string;
  identityCheck?: string;
  identityCheckDate?: TradeDate;
  agreementsPrepared?: string;
  nfaCheck?: string;
  nfaCheckDate?: TradeDate;
  bankruptcyCheck?: string;
  bankruptcyCheckDate?: TradeDate;
  complianceCheck?: string;
  complianceCheckDate?: TradeDate;
  submissionDate?: string;
  signedAdminAlertSignalId?: number;
  principalSignedAdminAlertSignalId?: number;
  pendingCommissionSheetTimestamp?: string;
  identityAutoCheckProvider?: string;
  jointIdentityAutoCheckProvider?: string;
  duplicateCheckEnabled?: boolean;
  ecbsvAuthorized?: boolean;
  identityCheckDocumentDownload?: string;
}
export interface CustomerApplicationDocument {
  id: number;
  timestamp: string;
  userId: number;
  process: string;
  documentType: string;
  filename: string;
  uploadUserId?: number;
  archived: boolean;
  requestSignalId?: number;
  complete?: boolean;
  signedTimestamp?: string;
  externalDocumentId?: string;
}
export interface CustomerApplicationSigningState {
  id: number;
  primarySignedTimestamp?: string;
  primarySignId?: number;
  jointNotificationDate?: string;
  jointSignedTimestamp?: string;
  jointSignId?: number;
  personalGuarantorNotificationDate?: string;
  personalGuarantorSignedTimestamp?: string;
  personalGuarantorSignId?: number;
  initialReviewDate?: string;
  initialReviewSubmitterId?: number;
  complianceReviewDate?: string;
  complianceReviewSubmitterId?: number;
  escalatedToAMLDate?: string;
  escalatedToAMLSubmitterId?: number;
  inAMLReviewDate?: string;
  inAMLReviewSubmitterId?: number;
}
export interface CustomerMarketingInfo {
  id: number;
  jsonData?: string;
  annualIncome?: string;
  netWorth?: string;
  liquidNetWorth?: string;
  occupation?: string;
  employer?: string;
  workInFinances?: boolean;
  corporateAnnualIncome?: string;
  corporateNetWorth?: string;
  cftcMember?: boolean;
  annualIncomeNT?: string;
  netWorthNT?: string;
  liquidNetWorthNT?: string;
  hdyhau?: string;
}
export interface DeleteAlert {
  alertId: number;
}
export interface DeleteUserAccountPositionLimit {
  userAccountPositionLimitId: number;
}
export interface DeleteUserAccountRiskParameter {
  userAccountRiskParameterId: number;
}
export interface DismissAlert {
  alertId: number;
}
export interface DownloadUserDocumentPreview {
  agreementDocumentTemplateId: number;
  pdfFields: object;
}
export interface DownloadW8CertificationDocument {}
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
export interface DuplicateMetadata {
  duplicateFound: boolean;
  customerApplicationId?: number;
  accountId?: number;
}
export interface EmergencyRisk {
  id: number;
  mode: string;
  multiplier: number;
  initiatorId: number;
  cosignerId?: number;
}
export interface Entitlement {
  id: number;
  title: string;
  price: number;
  startDate?: TradeDate;
  discontinuedDate?: TradeDate;
  name: string;
  duration?: number;
  durationUnits?: string;
  autorenewal?: boolean;
  legalEntityType?: string;
  requiredNonProCertification?: boolean;
  isUpgradable?: boolean;
  freeForFirstTime?: boolean;
  minDaysBetweenUse?: number;
  purchaseType?: string;
  rebateContractsThreshold?: number;
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
export interface EvaluationAccount {
  userId: number;
  templateAccountId: number;
  name: string;
  initialBalance: number;
  preTradeRisk?: PreTradeRisk[];
  postTradeRisk?: PostTradeRisk;
}
export interface EvaluationUser {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tradovateSubscriptionPlanId?: number;
  entitlementIds?: number[];
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
export interface FundTransaction {
  id: number;
  accountId: number;
  timestamp: string;
  submitterId: number;
  outgoing: boolean;
  fundPaymentType: string;
  fundAmount: number;
  fundCurrencyId: number;
  fundDescription?: string;
  feePaymentType?: string;
  feeAmount?: number;
  feeCurrencyId?: number;
  feeDescription?: string;
  bankAccountId?: number;
  approved?: boolean;
  status?: string;
  autoApprovalDate?: TradeDate;
  suspendReason?: string;
  suspendReasonNotes?: string;
  fullBalance?: boolean;
  approvalDate?: string;
  submissionSignalId?: number;
  achId?: number;
  achrSecondCheckResult?: string;
  achrSecondCheckTimestamp?: string;
  achrSecondCheckComments?: string;
  returnCode?: string;
}
export interface GetAccountTradingPermissions {
  accountId: number;
}
export interface GetAgreementDocument {
  agreementDocumentId: number;
}
export interface GetCashBalanceSnapshot {
  accountId: number;
}
export interface GetCurrentAnnualReviewInfo {
  userId: number;
}
export interface GetEntitlementEligibilityInfo {
  entitlementId: number;
}
export interface GetEventProducts {}
export interface GetFundingOptions {
  userId: number;
}
export interface GetLocalizedAgreementDocument {
  localizedAgreementDocumentTemplateContentId: number;
}
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
export interface GetUserSignedDocument {
  userSignedDocumentId: number;
}
export interface IndividualApplicant {
  id: number;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state?: string;
  postCode?: string;
  country: string;
  phone: string;
  mailingIsDifferent?: boolean;
  mailingStreetAddress1?: string;
  mailingStreetAddress2?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingPostCode?: string;
  mailingCountry?: string;
  secondaryPhone?: string;
  taxIdentifier?: string;
  usaCitizen: boolean;
  foreignCountryOfResidence?: string;
  birthDate?: string;
  driverLicense?: string;
  driverLicenseState?: string;
  passport?: string;
  passportExpiry?: string;
  nationalId?: string;
  annualIncome?: string;
  netWorth?: string;
  liquidNetWorth?: string;
  annualIncomeNT?: string;
  netWorthNT?: string;
  liquidNetWorthNT?: string;
  residence?: string;
  depositAmount?: number;
  riskCapitalSource?: string;
  marginType?: string;
  hedgeRepresentation?: string;
  retired?: boolean;
  employmentStatus?: string;
  occupation?: string;
  employer?: string;
  jobTitle?: string;
  employerAddress?: string;
  employerCity?: string;
  employerState?: string;
  employerPostCode?: string;
  employerCountry?: string;
  employerPhone?: string;
  employerEmail?: string;
  formerOccupation?: string;
  formerEmployer?: string;
  formerJobTitle?: string;
  formerEmployerAddress?: string;
  formerEmployerCity?: string;
  formerEmployerState?: string;
  formerEmployerPostCode?: string;
  formerEmployerCountry?: string;
  formerEmployerPhone?: string;
  formerEmployerEmail?: string;
  professional?: boolean;
  interestInFuturesAccount?: boolean;
  brokerName?: string;
  brokerAccountSpec?: string;
  outsideFunds?: boolean;
  outsideFundsExplanation?: string;
  relatedToBroker?: boolean;
  relatedToBrokerExplanation?: string;
  othersSharePL?: boolean;
  othersSharePLExplanation?: string;
  othersAccountControl?: boolean;
  othersAccountControlDetails?: string;
  complaints?: boolean;
  complaintsExplanation?: string;
  pendingComplaints?: boolean;
  pendingComplaintsExplanation?: string;
  cftcMember?: boolean;
  cftcMemberDetails?: string;
  nfaMember?: boolean;
  nfaMemberExplanation?: string;
  brokerTransferFunds?: boolean;
  brokerTransferFundsExplanation?: string;
  riskOfLossCert?: boolean;
  leverageCert?: boolean;
  debitRiskCert?: boolean;
  addDepositCert?: boolean;
  claimOfTaxTreatyResident?: boolean;
  claimOfTaxTreatyTINCert?: boolean;
  claimOfTaxTreatyTIN?: string;
  claimOfTaxTreatyNonIndividual?: boolean;
  iraCustodian?: string;
  jointAccountType?: string;
  jointInterestPercentage?: number;
  debtorInBankruptcy?: boolean;
  debtorInBankruptcyDetails?: string;
  bankruptcyResolved?: boolean;
  bankruptcyResolvedDate?: string;
  otherFirms?: boolean;
  otherFirmsExplanation?: string;
  cftcRegistration?: boolean;
  cftcId?: string;
  othersInterest?: boolean;
  otherEntityInterestFirstName?: string;
  otherEntityInterestLastName?: string;
  otherEntityInterestName?: string;
  otherEntityInterestRelationship?: string;
  otherEntityInterestCountry?: string;
  otherEntityInterestAddress?: string;
  otherEntityInterestCity?: string;
  otherEntityInterestState?: string;
  otherEntityInterestPostCode?: string;
  nfaOrCftcAffiliation?: boolean;
  nfaId?: string;
  nfaOrCftcAffiliationExplanation?: string;
  otherEntityControl?: boolean;
  otherEntityControlFirstName?: string;
  otherEntityControlLastName?: string;
  otherEntityControlMiddleName?: string;
  otherEntityControlRelationship?: string;
  otherEntityControlCitizenship?: string;
  otherEntityControlTaxIdentifier?: string;
  otherEntityControlNationalId?: string;
  otherEntityControlCompensation?: boolean;
  otherEntityControlCompensationExplanation?: string;
  otherEntityControlManagersPhone?: string;
  otherEntityControlManagersEmail?: string;
  otherEntityControlAffiliation?: boolean;
  otherEntityControlAffiliatedWith?: string;
  otherEntityControlDateOfBirth?: string;
  otherEntityControlCountry?: string;
  otherEntityControlAddress?: string;
  otherEntityControlAddress2?: string;
  otherEntityControlCity?: string;
  otherEntityControlState?: string;
  otherEntityControlPostCode?: string;
  otherEntityControlPhone?: string;
  otherEntityControlPassport?: string;
  officialPosition?: boolean;
  tradingDecision?: string;
  otherInfo?: string;
  middleName?: string;
  hdyhau?: string;
  adviceComp?: boolean;
  poolSolicitation?: boolean;
}
export interface InterruptOrderStrategy {
  orderStrategyId: number;
}
export interface JointApplicant {
  email: string;
  jointApplicantRelationship?: string;
  id: number;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state?: string;
  postCode?: string;
  country: string;
  phone: string;
  mailingIsDifferent?: boolean;
  mailingStreetAddress1?: string;
  mailingStreetAddress2?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingPostCode?: string;
  mailingCountry?: string;
  secondaryPhone?: string;
  taxIdentifier?: string;
  usaCitizen: boolean;
  foreignCountryOfResidence?: string;
  birthDate?: string;
  driverLicense?: string;
  driverLicenseState?: string;
  passport?: string;
  passportExpiry?: string;
  nationalId?: string;
  annualIncome?: string;
  netWorth?: string;
  liquidNetWorth?: string;
  annualIncomeNT?: string;
  netWorthNT?: string;
  liquidNetWorthNT?: string;
  residence?: string;
  depositAmount?: number;
  riskCapitalSource?: string;
  marginType?: string;
  hedgeRepresentation?: string;
  retired?: boolean;
  employmentStatus?: string;
  occupation?: string;
  employer?: string;
  jobTitle?: string;
  employerAddress?: string;
  employerCity?: string;
  employerState?: string;
  employerPostCode?: string;
  employerCountry?: string;
  employerPhone?: string;
  employerEmail?: string;
  formerOccupation?: string;
  formerEmployer?: string;
  formerJobTitle?: string;
  formerEmployerAddress?: string;
  formerEmployerCity?: string;
  formerEmployerState?: string;
  formerEmployerPostCode?: string;
  formerEmployerCountry?: string;
  formerEmployerPhone?: string;
  formerEmployerEmail?: string;
  interestInFuturesAccount?: boolean;
  brokerName?: string;
  brokerAccountSpec?: string;
  outsideFunds?: boolean;
  outsideFundsExplanation?: string;
  relatedToBroker?: boolean;
  relatedToBrokerExplanation?: string;
  othersSharePL?: boolean;
  othersSharePLExplanation?: string;
  othersAccountControl?: boolean;
  othersAccountControlDetails?: string;
  complaints?: boolean;
  complaintsExplanation?: string;
  pendingComplaints?: boolean;
  pendingComplaintsExplanation?: string;
  cftcMember?: boolean;
  cftcMemberDetails?: string;
  nfaMember?: boolean;
  nfaMemberExplanation?: string;
  brokerTransferFunds?: boolean;
  brokerTransferFundsExplanation?: string;
  riskOfLossCert?: boolean;
  leverageCert?: boolean;
  debitRiskCert?: boolean;
  addDepositCert?: boolean;
  claimOfTaxTreatyResident?: boolean;
  claimOfTaxTreatyTINCert?: boolean;
  claimOfTaxTreatyTIN?: string;
  claimOfTaxTreatyNonIndividual?: boolean;
  iraCustodian?: string;
  debtorInBankruptcy?: boolean;
  debtorInBankruptcyDetails?: string;
  bankruptcyResolved?: boolean;
  bankruptcyResolvedDate?: string;
  otherFirms?: boolean;
  otherFirmsExplanation?: string;
  cftcRegistration?: boolean;
  cftcId?: string;
  othersInterest?: boolean;
  otherEntityInterestFirstName?: string;
  otherEntityInterestLastName?: string;
  otherEntityInterestName?: string;
  otherEntityInterestRelationship?: string;
  otherEntityInterestCountry?: string;
  otherEntityInterestAddress?: string;
  otherEntityInterestCity?: string;
  otherEntityInterestState?: string;
  otherEntityInterestPostCode?: string;
  nfaOrCftcAffiliation?: boolean;
  nfaId?: string;
  nfaOrCftcAffiliationExplanation?: string;
  otherEntityControl?: boolean;
  otherEntityControlFirstName?: string;
  otherEntityControlLastName?: string;
  otherEntityControlMiddleName?: string;
  otherEntityControlRelationship?: string;
  otherEntityControlCitizenship?: string;
  otherEntityControlTaxIdentifier?: string;
  otherEntityControlNationalId?: string;
  otherEntityControlCompensation?: boolean;
  otherEntityControlCompensationExplanation?: string;
  otherEntityControlManagersPhone?: string;
  otherEntityControlManagersEmail?: string;
  otherEntityControlAffiliation?: boolean;
  otherEntityControlAffiliatedWith?: string;
  otherEntityControlDateOfBirth?: string;
  otherEntityControlCountry?: string;
  otherEntityControlAddress?: string;
  otherEntityControlAddress2?: string;
  otherEntityControlCity?: string;
  otherEntityControlState?: string;
  otherEntityControlPostCode?: string;
  otherEntityControlPhone?: string;
  otherEntityControlPassport?: string;
  officialPosition?: boolean;
  tradingDecision?: string;
  otherInfo?: string;
  middleName?: string;
  hdyhau?: string;
  adviceComp?: boolean;
  poolSolicitation?: boolean;
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
export interface MarketDataSubscription {
  id: number;
  userId: number;
  timestamp: string;
  planPrice: number;
  cashBalanceLogId?: number;
  accountId?: number;
  marketDataSubscriptionPlanId: number;
  year: number;
  month: number;
  expired: boolean;
  renewalCreditCardId?: number;
  renewalAccountId?: number;
}
export interface MarketDataSubscriptionExchangeScope {
  id: number;
  name: string;
  bundleOf?: string;
}
export interface MarketDataSubscriptionPlan {
  id: number;
  name: string;
  title: string;
  price: number;
  startDate?: TradeDate;
  discontinuedDate?: TradeDate;
  exchangeScopeId: number;
  dataType: string;
  professional: string;
  tooltip?: string;
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
  defaultAutoLiq?: PostTradeRisk;
  preTradeRisk?: PreTradeRisk[];
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
export interface Organization {
  id: number;
  name: string;
  relianceAgreement?: boolean;
}
export interface PermissionedAccountAutoLiq {
  id: number;
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
  dailyProfitAutoLiq?: number;
  weeklyProfitAutoLiq?: number;
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
export interface PostTradeRisk {
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
export interface PreTradeRisk {
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
  parameters: PreTradeRiskParameter[];
}
export interface PreTradeRiskParameter {
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
}
export interface PrepareAgreementDocuments {
  customerApplicationId: number;
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
export interface PulseLiveOptOut {
  optOut: boolean;
  userId?: number;
}
export interface RenewAccessToken {}
export interface ResetAlert {
  alertId: number;
}
export interface ResetAutoLiqStatus {
  accountId: number;
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
export interface RevokeTradingPermission {
  tradingPermissionId: number;
}
export interface RevokeTradingPermissions {
  tradingPermissionIds: number[];
}
export interface RiskCategory {
  id: number;
  name: string;
  riskCredit?: number;
  organizationId?: number;
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
export interface RiskTimePeriod {
  id: number;
  name: string;
  startTime: TradeTime;
  stopTime: TradeTime;
  organizationId?: number;
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
export interface SecondMarketDataSubscription {
  id: number;
  userId: number;
  timestamp: string;
  year: number;
  month: number;
  cancelledRenewal?: boolean;
  cancellationTimestamp?: string;
}
export interface SendNotifyAdminAlert {
  userIds: number[];
  text: string;
  withExpiration?: boolean;
  expiresAt?: string;
  showAsPopup?: boolean;
}
export interface SetAccountNotes {
  accountId: number;
}
export interface SetAdminAutoLiqAction {
  accountId: number;
  adminAction: string;
  adminActionReasonCode: string;
  adminActionReason?: string;
}
export interface SetDemoHalt {
  riskCategoryId: number;
  halt: boolean;
}
export interface ShardingExpression {
  expressionType: string;
  divisor: number;
  remainder: number;
}
export interface SignAgreementDocuments {
  customerApplicationId: number;
  agreementReadConfirmation: boolean;
  signature: string;
  date: string;
  agreementIds: number[];
}
export interface SignNonProCertification {
  signature: string;
  date: string;
  userId?: number;
}
export interface SignUpOrganizationMember {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tradovateSubscriptionPlanId?: number;
  entitlementIds?: number[];
}
export interface SignUserDocument {
  signature: string;
  date: string;
  agreementDocumentTemplateId: number;
  pdfFields: object;
  allowMultiple?: boolean;
  asCustomerApplicationDocument?: AsCustomerApplicationDocument;
}
export interface SignW8 {
  agreementReadConfirmation: boolean;
  signature: string;
  date: TradeDate;
  W8ClaimOfTaxTreatyResident: boolean;
  W8ClaimOfTaxTreatyTINCert: boolean;
  W8ClaimOfTaxTreatyTIN?: string;
  W8ClaimOfTaxTreatyNonIndividual: boolean;
}
export interface SpreadDefinition {
  id: number;
  timestamp: string;
  spreadType: string;
  uds: boolean;
}
export interface StartCustomerApplication {
  accountType: string;
  legalStatus: string;
  clearingHouseId?: number;
  userId?: number;
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
export interface SubmitAnnualReview {
  userId: number;
  yearsInTrading?: number;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state?: string;
  country: string;
  postCode?: string;
  phone: string;
  occupation?: string;
  employmentStatus?: string;
  annualIncomeNT?: string;
  netWorthNT?: string;
  liquidNetWorthNT?: string;
  nfaOrCftcAffiliation?: boolean;
  nfaId?: string;
  nfaOrCftcAffiliationExplanation?: string;
}
export interface SubmitApplicant {
  customerApplicationId: number;
  individual?: IndividualApplicant;
  jointApplicant?: JointApplicant;
  corporate?: CorporateApplicant;
  dryRun?: boolean;
  ecbsvAuthorized?: boolean;
}
export interface SubmitCustomerApplicationDocument {
  process: string;
  documentType: string;
  filename: string;
  base64data: string;
  userId?: number;
  personType?: string;
  customerApplicationId?: number;
}
export interface SwitchRiskCategory {
  accountIds: number[];
  riskCategoryId: number;
}
export interface SwitchToProfessional {
  userId?: number;
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
  annualReviews?: AnnualReview[];
  userReadStatuses?: UserReadStatus[];
  userPromoCodes?: UserPromoCode[];
  contractGroups: ContractGroup[];
  orderStrategyTypes?: OrderStrategyType[];
}
export interface TakeAlertSignalOwnership {
  adminAlertSignalId: number;
}
export interface ThirdPartyDataSharing {
  optimizeMarketing?: boolean;
  measureMarketing?: boolean;
  manageSurveys?: boolean;
  userId?: number;
}
export interface TradingPermission {
  id: number;
  userId: number;
  accountId: number;
  accountHolderContact: string;
  accountHolderEmail: string;
  ctaContact: string;
  ctaEmail: string;
  status: string;
  updated?: string;
  approvedById?: number;
}
export interface TradingPermissionConsent {
  id: number;
  userId: number;
  timestamp: string;
  orgAdminId: number;
  status: string;
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
export interface TradovateSubscription {
  id: number;
  userId: number;
  timestamp: string;
  planPrice: number;
  cashBalanceLogId?: number;
  accountId?: number;
  tradovateSubscriptionPlanId: number;
  startDate: TradeDate;
  expirationDate: TradeDate;
  paidAmount: number;
  cancelledRenewal?: boolean;
  cancelReason?: string;
}
export interface TradovateSubscriptionPlan {
  id: number;
  name: string;
  title: string;
  price: number;
  startDate?: TradeDate;
  discontinuedDate?: TradeDate;
  category: string;
  trial: boolean;
  duration: number;
  durationUnits: string;
  riskCategoryId?: number;
  multipleAccounts?: boolean;
  organizationId?: number;
  replaySessions?: number;
  footnote?: string;
  simOnly?: boolean;
}
export interface UpdateContactInfo {
  userId: number;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state?: string;
  postCode?: string;
  country: string;
  phone: string;
  mailingIsDifferent?: boolean;
  mailingStreetAddress1?: string;
  mailingStreetAddress2?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingPostCode?: string;
  mailingCountry?: string;
  approvedId?: number;
  jointFirstName?: string;
  jointLastName?: string;
}
export interface UpdateContactInfoName {
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
}
export interface UpdateMaxNetLiq {
  accountId: number;
  maxNetLiq: number;
}
export interface UpdateUserAutoLiq {
  accountId: number;
  asOwner?: boolean;
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
export interface UserAccountPositionLimit {
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
  accountId: number;
}
export interface UserAccountRiskParameter {
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
  userAccountPositionLimitId: number;
}
export interface UserCertification {
  id: number;
  timestamp: string;
  W8Required: string;
  W8SignedTimestamp?: string;
  W8SignedDocumentId?: number;
  W8LegacySignedDocumentId?: number;
  W8ExpirationDate?: TradeDate;
  W8ClaimOfTaxTreatyResident?: boolean;
  W8ClaimOfTaxTreatyTINCert?: boolean;
  W8ClaimOfTaxTreatyTIN?: string;
  W8ClaimOfTaxTreatyNonIndividual?: boolean;
  tacVersion?: TradeDate;
  pulseLiveOptOut?: boolean;
  optimizeMarketing?: boolean;
  measureMarketing?: boolean;
  manageSurveys?: boolean;
}
export interface UserDevice {
  id: number;
  userId: number;
  timestamp: string;
  deviceId: string;
  updateTimestamp: string;
  clientAppId: number;
  appId?: string;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  approval?: boolean;
  personalAccessApprovalExpiration?: string;
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
export interface UserSession {
  id: number;
  userId: number;
  startTime: string;
  endTime?: string;
  ipAddress?: string;
  appId?: string;
  appVersion?: string;
  clientAppId: number;
}
export interface UserSessionStats {
  id: number;
  lastSessionTime: string;
  failedPasswords: number;
}
export interface UserSignedDocument {
  id: number;
  userId: number;
  timestamp: string;
  agreementDocumentTemplateId: number;
  documentName: string;
  signedTimestamp?: string;
}
export interface UserStatusMessage {
  errorText?: string;
  status?: string;
}
export interface WalletTransfer {
  accountId: number;
  fundAmount: number;
  fundCurrencyId: number;
  fundDescription?: string;
  fullBalance?: boolean;
  senderId?: number;
}
export interface ActivateSecondMarketDataSubscriptionRenewal {
  secondMarketDataSubscriptionId: number;
}
export interface AddSecondMarketDataSubscription {
  year: number;
  month: number;
  creditCardId?: number;
  accountId?: number;
  userId?: number;
}
export interface CancelSecondMarketDataSubscription {
  secondMarketDataSubscriptionId: number;
}
export interface CancelSecondMarketDataSubscriptionRenewal {
  secondMarketDataSubscriptionId: number;
}
export interface ChangeDemoBalance {
  cashChange: number;
  accountId: number;
}
export interface ChangeSpeed {
  speed: number;
}
export interface Chat {
  id: number;
  userId: number;
  timestamp: string;
  category: string;
  assignedSupportId?: number;
  closedById?: number;
  closeTimestamp?: string;
  updatedTimestamp?: string;
}
export interface ChatMessage {
  id: number;
  timestamp: string;
  chatId: number;
  senderId: number;
  senderName?: string;
  text: string;
  readStatus: boolean;
}
export interface CheckReplaySession {
  startTimestamp: string;
}
export interface CheckStripeFundingEligibility {
  accountId: number;
  amount?: number;
  currencyId: number;
}
export interface CloseChat {
  chatId: number;
}
export interface GetSecondMarketDataSubscriptionCost {
  year: number;
  month: number;
  userId?: number;
}
export interface InitializeClock {
  startTimestamp: string;
  speed: number;
  initialBalance?: number;
}
export interface MarkAsReadChatMessage {
  chatMessageId: number;
}
export interface PostChatMessage {
  userId?: number;
  category: string;
  text: string;
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
export interface DownloadSubAccountRequestPreview {
  accountId: number;
  marginType: string;
  transferAmount: number;
  authorizedIndividual: boolean;
  reason: string;
}
export interface RequestTradingPermission {
  accountId: number;
  ctaContact: string;
  ctaEmail: string;
}
export interface SignSubAccountRequest {
  signature: string;
  date: string;
  accountId: number;
  marginType: string;
  transferAmount: number;
  authorizedIndividual: boolean;
  reason: string;
}
export interface SubAccountRequest {
  id: number;
  timestamp: string;
  customerApplicationId: number;
  agreementDocumentId?: number;
  approvalStatus: string;
  marginType: string;
  transferAmount: number;
  authorizedIndividual: boolean;
  reason: string;
  createdAccountId?: number;
  outPubSubMessageId?: string;
  submittedTimestamp?: string;
  inPubSubMessageId?: string;
  decision?: string;
  decisionTimestamp?: string;
  decisionNotes?: string;
}
export interface SubAccountRequestPreviewResponse {
  errorText?: string;
  content?: string;
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
export interface AccountRiskStatusResponse {
  errorText?: string;
  accountRiskStatus?: AccountRiskStatus;
}
export interface AdminAlertSignalResponse {
  errorText?: string;
  adminAlertSignal?: AdminAlertSignal;
}
export interface AgreementDocumentsResponse {
  errorText?: string;
  successHashCode?: number;
}
export interface AlertResponse {
  errorText?: string;
  alert?: Alert;
}
export interface ApplicantResponse {
  errorText?: string;
  individualApplicantId?: number;
  corporateApplicantId?: number;
  duplicateMetadata?: DuplicateMetadata;
  ecbsvAuthorized?: boolean;
}
export interface CancelEverythingResponse {
  tradovateSubscriptionIds: number[];
  tradingPermissionIds: number[];
  userPluginIds: number[];
  marketDataSubscriptionIds: number[];
}
export interface CertificationContentResponse {
  errorText?: string;
  filename?: string;
  content?: string;
}
export interface CountryIsBannedResponse {
  errorText?: string;
  isBanned?: boolean;
}
export interface CreateEvaluationAccountResponse {
  errorText?: string;
  accountId?: number;
  tradingPermissionId?: number;
}
export interface CreateEvaluationAccountsResponse {
  errorText?: string;
  results: CreateEvaluationAccountResponse[];
}
export interface CreateEvaluationUserResponse {
  errorText?: string;
  userId?: number;
}
export interface CreateEvaluationUsersResponse {
  errorText?: string;
  results: CreateEvaluationUserResponse[];
}
export interface CurrentAnnualReviewInfoResponse {
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  postCode?: string;
  country?: string;
  phone?: string;
  fullName?: string;
  birthDate?: string;
  taxIdentifier?: string;
  passport?: string;
  nationalId?: string;
  yearsInTrading?: number;
  occupation?: string;
  employmentStatus?: string;
  annualIncomeNT?: string;
  netWorthNT?: string;
  liquidNetWorthNT?: string;
  nfaOrCftcAffiliation?: boolean;
  nfaId?: string;
  nfaOrCftcAffiliationExplanation?: string;
}
export interface CustomerApplicationResponse {
  errorText?: string;
  customerApplication?: CustomerApplication;
}
export interface DeleteResultResponse {
  errorText?: string;
  success?: boolean;
}
export interface DocumentContentResponse {
  errorText?: string;
  filename?: string;
  content?: string;
}
export interface DownloadUserDocumentPreviewResponse {
  errorText?: string;
  content?: string;
}
export interface DryRunResponse {
  errorText?: string;
  rejectReason?: string;
  comment?: string;
  details?: RiskEvaluationDetails;
  fees?: EstimatedFillFee;
}
export interface EligibilityInfoResponse {
  errorText?: string;
  lastStartDate?: TradeDate;
  nextEligibleDate?: TradeDate;
  lastExpirationDate?: TradeDate;
}
export interface EntitlementSubscriptionResponse {
  errorText?: string;
  errorCode?: string;
  entitlementSubscription?: UserPlugin;
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
export interface FundTransactionResponse {
  errorText?: string;
  fundTransaction?: FundTransaction;
}
export interface FundingOptionsResponse {
  remessaOnline: boolean;
}
export interface MarketDataSubscriptionResponse {
  errorText?: string;
  errorCode?: string;
  marketDataSubscription?: MarketDataSubscription;
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
export interface PlanUpgradeResponse {
  errorText?: string;
  errorCode?: string;
  startDate: TradeDate;
  expirationDate: TradeDate;
  estimatedAmount?: number;
  current?: TradovateSubscription;
  refund?: number;
}
export interface ProductFeeParamsResponse {
  params: ProductFeeParams[];
}
export interface PulseLiveOptOutResponse {
  errorText?: string;
}
export interface RollContractResponse {
  errorText?: string;
  contract?: Contract;
}
export interface RollContractsResponse {
  errorText?: string;
  contracts: object;
}
export interface SignUpResponse {
  errorText?: string;
  errorCode: string;
  userId?: number;
  emailVerified: boolean;
}
export interface SignW8Response {
  errorText?: string;
  userCertificationId?: number;
}
export interface SimpleResponse {
  errorText?: string;
  ok: boolean;
}
export interface SubmitAnnualReviewResponse {
  errorText?: string;
  annualReviewId?: number;
}
export interface ThirdPartyDataSharingResponse {
  errorText?: string;
}
export interface TimestampResponse {
  timestamp: string;
}
export interface TradingPermissionResponse {
  errorText?: string;
  tradingPermission?: TradingPermission;
}
export interface TradingPermissionsResponse {
  tradingPermissions: TradingPermission[];
}
export interface TradovateSubscriptionResponse {
  errorText?: string;
  errorCode?: string;
  tradovateSubscription?: TradovateSubscription;
}
export interface UpdateContactInfoResponse {
  errorText?: string;
  contactInfo?: ContactInfo;
}
export interface UpdateUserAutoLiqResponse {
  errorText?: string;
  userAccountAutoLiq?: UserAccountAutoLiq;
  permissionedAccountAutoLiq?: PermissionedAccountAutoLiq;
}
export interface ChatMessageResponse {
  errorText?: string;
  chatMessage?: ChatMessage;
}
export interface ChatResponse {
  errorText?: string;
  chat?: Chat;
}
export interface CheckReplaySessionResponse {
  checkStatus: string;
  startTimestamp?: string;
}
export interface CheckStripeFundingEligibilityResponse {
  errorText?: string;
  minimumAmount?: number;
  maximumAmount?: number;
}
export interface SecondMarketDataSubscriptionCostResponse {
  errorText?: string;
  monthlyCost?: number;
}
export interface SecondMarketDataSubscriptionResponse {
  errorText?: string;
  errorCode?: string;
  secondMarketDataSubscription?: SecondMarketDataSubscription;
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
      entityType: 'accepttradingpermission';
      entity: AcceptTradingPermission;
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
      entityType: 'addentitlementsubscription';
      entity: AddEntitlementSubscription;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'addmarketdatasubscription';
      entity: AddMarketDataSubscription;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'addtradovatesubscription';
      entity: AddTradovateSubscription;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'adminalert';
      entity: AdminAlert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'adminalertsignal';
      entity: AdminAlertSignal;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'agreedliquidationpolicy';
      entity: AgreedLiquidationPolicy;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'agreedsentimentdisclaimerpolicy';
      entity: AgreedSentimentDisclaimerPolicy;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'agreedtermsandconditions';
      entity: AgreedTermsAndConditions;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'agreementdocument';
      entity: AgreementDocument;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'agreementdocumenttemplate';
      entity: AgreementDocumentTemplate;
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
      entityType: 'annualreview';
      entity: AnnualReview;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'ascustomerapplicationdocument';
      entity: AsCustomerApplicationDocument;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'autoliqtransaction';
      entity: AutoLiqTransaction;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'calculateplanupgrade';
      entity: CalculatePlanUpgrade;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'canceleverything';
      entity: CancelEverything;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'cancelorder';
      entity: CancelOrder;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'cancelpluginautorenewal';
      entity: CancelPluginAutorenewal;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'canceltradovatesubscription';
      entity: CancelTradovateSubscription;
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
      entityType: 'changepluginpermission';
      entity: ChangePluginPermission;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'changeuserproperty';
      entity: ChangeUserProperty;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'checkduplicate';
      entity: CheckDuplicate;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'clearinghouse';
      entity: ClearingHouse;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'clientapp';
      entity: ClientApp;
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
      entityType: 'completealertsignal';
      entity: CompleteAlertSignal;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'contactinfo';
      entity: ContactInfo;
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
      entityType: 'corporateapplicant';
      entity: CorporateApplicant;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'country';
      entity: Country;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'countryisbanned';
      entity: CountryIsBanned;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'createalert';
      entity: CreateAlert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'createevaluationaccounts';
      entity: CreateEvaluationAccounts;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'createevaluationusers';
      entity: CreateEvaluationUsers;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'createnewtrial';
      entity: CreateNewTrial;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'createtradingpermission';
      entity: CreateTradingPermission;
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
      entityType: 'customerapplication';
      entity: CustomerApplication;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'customerapplicationcheckstate';
      entity: CustomerApplicationCheckState;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'customerapplicationdocument';
      entity: CustomerApplicationDocument;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'customerapplicationsigningstate';
      entity: CustomerApplicationSigningState;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'customermarketinginfo';
      entity: CustomerMarketingInfo;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'deletealert';
      entity: DeleteAlert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'deleteuseraccountpositionlimit';
      entity: DeleteUserAccountPositionLimit;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'deleteuseraccountriskparameter';
      entity: DeleteUserAccountRiskParameter;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'dismissalert';
      entity: DismissAlert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'downloaduserdocumentpreview';
      entity: DownloadUserDocumentPreview;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'downloadw8certificationdocument';
      entity: DownloadW8CertificationDocument;
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
      entityType: 'duplicatemetadata';
      entity: DuplicateMetadata;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'emergencyrisk';
      entity: EmergencyRisk;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'entitlement';
      entity: Entitlement;
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
      entityType: 'evaluationaccount';
      entity: EvaluationAccount;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'evaluationuser';
      entity: EvaluationUser;
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
      entityType: 'fundtransaction';
      entity: FundTransaction;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getaccounttradingpermissions';
      entity: GetAccountTradingPermissions;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getagreementdocument';
      entity: GetAgreementDocument;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getcashbalancesnapshot';
      entity: GetCashBalanceSnapshot;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getcurrentannualreviewinfo';
      entity: GetCurrentAnnualReviewInfo;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getentitlementeligibilityinfo';
      entity: GetEntitlementEligibilityInfo;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'geteventproducts';
      entity: GetEventProducts;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getfundingoptions';
      entity: GetFundingOptions;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getlocalizedagreementdocument';
      entity: GetLocalizedAgreementDocument;
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
      entityType: 'getusersigneddocument';
      entity: GetUserSignedDocument;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'individualapplicant';
      entity: IndividualApplicant;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'interruptorderstrategy';
      entity: InterruptOrderStrategy;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'jointapplicant';
      entity: JointApplicant;
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
      entityType: 'marketdatasubscription';
      entity: MarketDataSubscription;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'marketdatasubscriptionexchangescope';
      entity: MarketDataSubscriptionExchangeScope;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'marketdatasubscriptionplan';
      entity: MarketDataSubscriptionPlan;
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
      entityType: 'organization';
      entity: Organization;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'permissionedaccountautoliq';
      entity: PermissionedAccountAutoLiq;
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
      entityType: 'posttraderisk';
      entity: PostTradeRisk;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'pretraderisk';
      entity: PreTradeRisk;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'pretraderiskparameter';
      entity: PreTradeRiskParameter;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'prepareagreementdocuments';
      entity: PrepareAgreementDocuments;
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
      entityType: 'pulseliveoptout';
      entity: PulseLiveOptOut;
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
      entityType: 'resetautoliqstatus';
      entity: ResetAutoLiqStatus;
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
      entityType: 'revoketradingpermission';
      entity: RevokeTradingPermission;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'revoketradingpermissions';
      entity: RevokeTradingPermissions;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'riskcategory';
      entity: RiskCategory;
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
      entityType: 'risktimeperiod';
      entity: RiskTimePeriod;
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
      entityType: 'secondmarketdatasubscription';
      entity: SecondMarketDataSubscription;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'sendnotifyadminalert';
      entity: SendNotifyAdminAlert;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'setaccountnotes';
      entity: SetAccountNotes;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'setadminautoliqaction';
      entity: SetAdminAutoLiqAction;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'setdemohalt';
      entity: SetDemoHalt;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'shardingexpression';
      entity: ShardingExpression;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'signagreementdocuments';
      entity: SignAgreementDocuments;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'signnonprocertification';
      entity: SignNonProCertification;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'signuporganizationmember';
      entity: SignUpOrganizationMember;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'signuserdocument';
      entity: SignUserDocument;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'signw8';
      entity: SignW8;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'spreaddefinition';
      entity: SpreadDefinition;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'startcustomerapplication';
      entity: StartCustomerApplication;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'startorderstrategy';
      entity: StartOrderStrategy;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'submitannualreview';
      entity: SubmitAnnualReview;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'submitapplicant';
      entity: SubmitApplicant;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'submitcustomerapplicationdocument';
      entity: SubmitCustomerApplicationDocument;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'switchriskcategory';
      entity: SwitchRiskCategory;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'switchtoprofessional';
      entity: SwitchToProfessional;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'syncmessage';
      entity: SyncMessage;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'takealertsignalownership';
      entity: TakeAlertSignalOwnership;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'thirdpartydatasharing';
      entity: ThirdPartyDataSharing;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'tradingpermission';
      entity: TradingPermission;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'tradingpermissionconsent';
      entity: TradingPermissionConsent;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'tradingsession';
      entity: TradingSession;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'tradovatesubscription';
      entity: TradovateSubscription;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'tradovatesubscriptionplan';
      entity: TradovateSubscriptionPlan;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'updatecontactinfo';
      entity: UpdateContactInfo;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'updatecontactinfoname';
      entity: UpdateContactInfoName;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'updatemaxnetliq';
      entity: UpdateMaxNetLiq;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'updateuserautoliq';
      entity: UpdateUserAutoLiq;
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
      entityType: 'useraccountpositionlimit';
      entity: UserAccountPositionLimit;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'useraccountriskparameter';
      entity: UserAccountRiskParameter;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'usercertification';
      entity: UserCertification;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'userdevice';
      entity: UserDevice;
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
      entityType: 'usersession';
      entity: UserSession;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'usersessionstats';
      entity: UserSessionStats;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'usersigneddocument';
      entity: UserSignedDocument;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'userstatusmessage';
      entity: UserStatusMessage;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'wallettransfer';
      entity: WalletTransfer;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'activatesecondmarketdatasubscriptionrenewal';
      entity: ActivateSecondMarketDataSubscriptionRenewal;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'addsecondmarketdatasubscription';
      entity: AddSecondMarketDataSubscription;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'cancelsecondmarketdatasubscription';
      entity: CancelSecondMarketDataSubscription;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'cancelsecondmarketdatasubscriptionrenewal';
      entity: CancelSecondMarketDataSubscriptionRenewal;
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
      entityType: 'chat';
      entity: Chat;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'chatmessage';
      entity: ChatMessage;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'checkreplaysession';
      entity: CheckReplaySession;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'checkstripefundingeligibility';
      entity: CheckStripeFundingEligibility;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'closechat';
      entity: CloseChat;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'getsecondmarketdatasubscriptioncost';
      entity: GetSecondMarketDataSubscriptionCost;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'initializeclock';
      entity: InitializeClock;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'markasreadchatmessage';
      entity: MarkAsReadChatMessage;
    }
  | {
      eventType: 'Created' | 'Updated' | 'Deleted';
      entityType: 'postchatmessage';
      entity: PostChatMessage;
    };
