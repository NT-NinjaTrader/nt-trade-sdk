import {
  type TradingPermissionResponse,
  type AccessTokenResponse,
  type Account,
  type AccountRiskStatus,
  type AccountRiskStatusLog,
  type EntitlementSubscriptionResponse,
  type MarketDataSubscriptionResponse,
  type TradovateSubscriptionResponse,
  type AdminAlert,
  type AdminAlertSignal,
  type SimpleResponse,
  type AgreementDocument,
  type AgreementDocumentTemplate,
  type Alert,
  type AlertSignal,
  type AnnualReview,
  type AutoLiqTransaction,
  type PlanUpgradeResponse,
  type CancelEverythingResponse,
  type CommandResult,
  type CashBalance,
  type CashBalanceLog,
  type CategoryPositionLimit,
  type CategoryRiskParameter,
  type ClearingHouse,
  type ClientApp,
  type Command,
  type CommandReport,
  type AdminAlertSignalResponse,
  type ContactInfo,
  type Contract,
  type ContractGroup,
  type ContractMargin,
  type ContractMaturity,
  type CorporateApplicant,
  type Country,
  type CountryIsBannedResponse,
  type AlertResponse,
  type CreateEvaluationAccountsResponse,
  type CreateEvaluationUsersResponse,
  type Currency,
  type CurrencyRate,
  type CustomerApplicationCheckState,
  type CustomerApplication,
  type CustomerApplicationDocument,
  type CustomerApplicationSigningState,
  type CustomerMarketingInfo,
  type DeleteResultResponse,
  type SubAccountRequestPreviewResponse,
  type DownloadUserDocumentPreviewResponse,
  type CertificationContentResponse,
  type DryRunResponse,
  type EmergencyRisk,
  type Entitlement,
  type EvaluateFillFeeResponse,
  type Exchange,
  type ExecutionReport,
  type Fee,
  type Fill,
  type FillFee,
  type FillPair,
  type FundTransaction,
  type TradingPermissionsResponse,
  type DocumentContentResponse,
  type CashBalanceSnapshot,
  type CurrentAnnualReviewInfoResponse,
  type EligibilityInfoResponse,
  type EventProductsResponse,
  type FundingOptionsResponse,
  type OptionsChainResponse,
  type ProcessingFee,
  type ProductDetails,
  type ProductFeeParamsResponse,
  type TimestampResponse,
  type IndividualApplicant,
  type OrderStrategyStatusResponse,
  type JointApplicant,
  type PlaceOrderResult,
  type MarginSnapshot,
  type MarketDataSubscription,
  type MarketDataSubscriptionExchangeScope,
  type MarketDataSubscriptionPlan,
  type OAuthMeResponse,
  type UserStatusMessage,
  type OAuthTokenResponse,
  type OpenDemoAccountResponse,
  type Order,
  type OrderStrategy,
  type OrderStrategyLink,
  type OrderStrategyType,
  type OrderVersion,
  type Organization,
  type PermissionedAccountAutoLiq,
  type PlaceOcoResult,
  type PlaceOsoResult,
  type Position,
  type PositionLog,
  type AgreementDocumentsResponse,
  type Product,
  type ProductMargin,
  type ProductSession,
  type ProductList,
  type Property,
  type PulseLiveOptOutResponse,
  type AccountRiskStatusResponse,
  type RiskCategory,
  type RiskDiscountContractGroup,
  type RiskTimePeriod,
  type RollContractResponse,
  type RollContractsResponse,
  type SecondMarketDataSubscription,
  type SignUpResponse,
  type SignW8Response,
  type SpreadDefinition,
  type CustomerApplicationResponse,
  type SubAccountRequest,
  type SubmitAnnualReviewResponse,
  type ApplicantResponse,
  type SyncMessage,
  type ThirdPartyDataSharingResponse,
  type TradingPermissionConsent,
  type TradingPermission,
  type TradingSession,
  type TradovateSubscription,
  type TradovateSubscriptionPlan,
  type UpdateContactInfoResponse,
  type UpdateUserAutoLiqResponse,
  type UserAccountAutoLiq,
  type UserAccountPositionLimit,
  type UserAccountRiskParameter,
  type UserCertification,
  type UserDevice,
  type User,
  type UserPlugin,
  type UserPromoCode,
  type UserProperty,
  type UserReadStatus,
  type UserSession,
  type UserSessionStats,
  type UserSignedDocument,
  type FundTransactionResponse,
  type CheckReplaySessionResponse,
  type SecondMarketDataSubscriptionResponse,
  type SecondMarketDataSubscriptionCostResponse,
  type CheckStripeFundingEligibilityResponse,
  type ChatResponse,
  type Chat,
  type ChatMessageResponse,
  type ChatMessage,
  type AcceptTradingPermission,
  type AccessTokenRequest,
  type AddEntitlementSubscription,
  type AddMarketDataSubscription,
  type AddTradovateSubscription,
  type AgreedLiquidationPolicy,
  type AgreedSentimentDisclaimerPolicy,
  type AgreedTermsAndConditions,
  type CalculatePlanUpgrade,
  type CancelEverything,
  type CancelOrder,
  type CancelPluginAutorenewal,
  type CancelTradovateSubscription,
  type ChangePluginPermission,
  type ChangeUserProperty,
  type CheckDuplicate,
  type CompleteAlertSignal,
  type CountryIsBanned,
  type CreateAlert,
  type CreateEvaluationAccounts,
  type CreateEvaluationUsers,
  type CreateTradingPermission,
  type DeleteAlert,
  type DeleteUserAccountPositionLimit,
  type DeleteUserAccountRiskParameter,
  type DismissAlert,
  type DownloadSubAccountRequestPreview,
  type DownloadUserDocumentPreview,
  type DryRun,
  type EvaluateFillFee,
  type GetAccountTradingPermissions,
  type GetAgreementDocument,
  type GetCashBalanceSnapshot,
  type GetCurrentAnnualReviewInfo,
  type GetEntitlementEligibilityInfo,
  type GetFundingOptions,
  type GetLocalizedAgreementDocument,
  type GetOptionsChain,
  type GetProcessingFee,
  type GetProduct,
  type GetProductFeeParams,
  type GetUserSignedDocument,
  type InterruptOrderStrategy,
  type LiquidatePosition,
  type LiquidatePositions,
  type MarkReadAlertSignal,
  type ModifyAlert,
  type ModifyCredentials,
  type ModifyEmailAddress,
  type ModifyOrder,
  type ModifyOrderStrategy,
  type ModifyPassword,
  type OAuthToken,
  type OpenDemoAccount,
  type PlaceOCO,
  type PlaceOSO,
  type PlaceOrder,
  type PrepareAgreementDocuments,
  type PulseLiveOptOut,
  type RequestTradingPermission,
  type ResetAlert,
  type ResetAutoLiqStatus,
  type ResetDemoAccountState,
  type RevokeTradingPermission,
  type RevokeTradingPermissions,
  type RollContract,
  type RollContracts,
  type Search,
  type SendNotifyAdminAlert,
  type SetAccountNotes,
  type SetAdminAutoLiqAction,
  type SetDemoHalt,
  type SignAgreementDocuments,
  type SignNonProCertification,
  type SignSubAccountRequest,
  type SignUpOrganizationMember,
  type SignUserDocument,
  type SignW8,
  type StartCustomerApplication,
  type StartOrderStrategy,
  type SubmitAnnualReview,
  type SubmitApplicant,
  type SubmitCustomerApplicationDocument,
  type SwitchRiskCategory,
  type SwitchToProfessional,
  type SyncRequest,
  type TakeAlertSignalOwnership,
  type ThirdPartyDataSharing,
  type UpdateContactInfo,
  type UpdateContactInfoName,
  type UpdateMaxNetLiq,
  type UpdateUserAutoLiq,
  type WalletTransfer,
  type ChangeDemoBalance,
  type ChangeSpeed,
  type CheckReplaySession,
  type InitializeClock,
  type ActivateSecondMarketDataSubscriptionRenewal,
  type AddSecondMarketDataSubscription,
  type CancelSecondMarketDataSubscription,
  type CancelSecondMarketDataSubscriptionRenewal,
  type GetSecondMarketDataSubscriptionCost,
  type CheckStripeFundingEligibility,
  type CloseChat,
  type MarkAsReadChatMessage,
  type PostChatMessage
} from './types';
export type Endpoint =
  | {
      url: 'user/accepttradingpermission';
      request: {
        body: AcceptTradingPermission;
      };
      response: TradingPermissionResponse;
    }
  | {
      url: 'auth/accesstokenrequest';
      request: {
        body: AccessTokenRequest;
      };
      response: AccessTokenResponse;
    }
  | {
      url: 'account/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: Account[];
    }
  | {
      url: 'account/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: Account;
    }
  | {
      url: 'account/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Account;
    }
  | {
      url: 'account/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Account[];
    }
  | {
      url: 'account/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: Account[];
    }
  | {
      url: 'account/list';
      request: {
        body?: {};
      };
      response: Account[];
    }
  | {
      url: 'accountRiskStatus/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: AccountRiskStatus[];
    }
  | {
      url: 'accountRiskStatus/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: AccountRiskStatus;
    }
  | {
      url: 'accountRiskStatus/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: AccountRiskStatus[];
    }
  | {
      url: 'accountRiskStatus/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: AccountRiskStatus[];
    }
  | {
      url: 'accountRiskStatus/list';
      request: {
        body?: {};
      };
      response: AccountRiskStatus[];
    }
  | {
      url: 'accountRiskStatusLog/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: AccountRiskStatusLog[];
    }
  | {
      url: 'accountRiskStatusLog/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: AccountRiskStatusLog;
    }
  | {
      url: 'accountRiskStatusLog/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: AccountRiskStatusLog[];
    }
  | {
      url: 'accountRiskStatusLog/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: AccountRiskStatusLog[];
    }
  | {
      url: 'account/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: Account[];
    }
  | {
      url: 'userPlugin/addentitlementsubscription';
      request: {
        body: AddEntitlementSubscription;
      };
      response: EntitlementSubscriptionResponse;
    }
  | {
      url: 'user/addmarketdatasubscription';
      request: {
        body: AddMarketDataSubscription;
      };
      response: MarketDataSubscriptionResponse;
    }
  | {
      url: 'user/addtradovatesubscription';
      request: {
        body: AddTradovateSubscription;
      };
      response: TradovateSubscriptionResponse;
    }
  | {
      url: 'adminAlert/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: AdminAlert;
    }
  | {
      url: 'adminAlert/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: AdminAlert;
    }
  | {
      url: 'adminAlert/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: AdminAlert[];
    }
  | {
      url: 'adminAlert/list';
      request: {
        body?: {};
      };
      response: AdminAlert[];
    }
  | {
      url: 'adminAlertSignal/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: AdminAlertSignal[];
    }
  | {
      url: 'adminAlertSignal/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: AdminAlertSignal;
    }
  | {
      url: 'adminAlertSignal/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: AdminAlertSignal[];
    }
  | {
      url: 'adminAlertSignal/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: AdminAlertSignal[];
    }
  | {
      url: 'adminAlertSignal/list';
      request: {
        body?: {};
      };
      response: AdminAlertSignal[];
    }
  | {
      url: 'adminAlert/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: AdminAlert[];
    }
  | {
      url: 'user/agreedliquidationpolicy';
      request: {
        body: AgreedLiquidationPolicy;
      };
      response: SimpleResponse;
    }
  | {
      url: 'user/agreedsentimentdisclaimerpolicy';
      request: {
        body: AgreedSentimentDisclaimerPolicy;
      };
      response: SimpleResponse;
    }
  | {
      url: 'user/agreedtermsandconditions';
      request: {
        body: AgreedTermsAndConditions;
      };
      response: SimpleResponse;
    }
  | {
      url: 'agreementDocument/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: AgreementDocument[];
    }
  | {
      url: 'agreementDocument/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: AgreementDocument;
    }
  | {
      url: 'agreementDocument/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: AgreementDocument[];
    }
  | {
      url: 'agreementDocument/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: AgreementDocument[];
    }
  | {
      url: 'agreementDocumentTemplate/create';
      request: {
        body: AgreementDocumentTemplate;
      };
      response: AgreementDocumentTemplate;
    }
  | {
      url: 'agreementDocumentTemplate/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: AgreementDocumentTemplate;
    }
  | {
      url: 'agreementDocumentTemplate/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: AgreementDocumentTemplate;
    }
  | {
      url: 'agreementDocumentTemplate/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: AgreementDocumentTemplate[];
    }
  | {
      url: 'agreementDocumentTemplate/list';
      request: {
        body?: {};
      };
      response: AgreementDocumentTemplate[];
    }
  | {
      url: 'agreementDocumentTemplate/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: AgreementDocumentTemplate[];
    }
  | {
      url: 'agreementDocumentTemplate/update';
      request: {
        body: AgreementDocumentTemplate;
      };
      response: AgreementDocumentTemplate;
    }
  | {
      url: 'alert/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: Alert[];
    }
  | {
      url: 'alert/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Alert;
    }
  | {
      url: 'alert/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Alert[];
    }
  | {
      url: 'alert/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: Alert[];
    }
  | {
      url: 'alertSignal/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: AlertSignal[];
    }
  | {
      url: 'alertSignal/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: AlertSignal;
    }
  | {
      url: 'alertSignal/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: AlertSignal[];
    }
  | {
      url: 'alertSignal/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: AlertSignal[];
    }
  | {
      url: 'annualReview/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: AnnualReview[];
    }
  | {
      url: 'annualReview/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: AnnualReview;
    }
  | {
      url: 'annualReview/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: AnnualReview[];
    }
  | {
      url: 'annualReview/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: AnnualReview[];
    }
  | {
      url: 'autoLiqTransaction/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: AutoLiqTransaction[];
    }
  | {
      url: 'autoLiqTransaction/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: AutoLiqTransaction;
    }
  | {
      url: 'autoLiqTransaction/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: AutoLiqTransaction[];
    }
  | {
      url: 'autoLiqTransaction/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: AutoLiqTransaction[];
    }
  | {
      url: 'autoLiqTransaction/list';
      request: {
        body?: {};
      };
      response: AutoLiqTransaction[];
    }
  | {
      url: 'user/calculateplanupgrade';
      request: {
        body: CalculatePlanUpgrade;
      };
      response: PlanUpgradeResponse;
    }
  | {
      url: 'user/canceleverything';
      request: {
        body: CancelEverything;
      };
      response: CancelEverythingResponse;
    }
  | {
      url: 'order/cancelorder';
      request: {
        body: CancelOrder;
      };
      response: CommandResult;
    }
  | {
      url: 'userPlugin/cancelpluginautorenewal';
      request: {
        body: CancelPluginAutorenewal;
      };
      response: EntitlementSubscriptionResponse;
    }
  | {
      url: 'user/canceltradovatesubscription';
      request: {
        body: CancelTradovateSubscription;
      };
      response: TradovateSubscriptionResponse;
    }
  | {
      url: 'cashBalance/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CashBalance[];
    }
  | {
      url: 'cashBalance/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CashBalance;
    }
  | {
      url: 'cashBalance/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CashBalance[];
    }
  | {
      url: 'cashBalance/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CashBalance[];
    }
  | {
      url: 'cashBalance/list';
      request: {
        body?: {};
      };
      response: CashBalance[];
    }
  | {
      url: 'cashBalanceLog/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CashBalanceLog[];
    }
  | {
      url: 'cashBalanceLog/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CashBalanceLog;
    }
  | {
      url: 'cashBalanceLog/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CashBalanceLog[];
    }
  | {
      url: 'cashBalanceLog/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CashBalanceLog[];
    }
  | {
      url: 'categoryPositionLimit/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CategoryPositionLimit[];
    }
  | {
      url: 'categoryPositionLimit/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CategoryPositionLimit;
    }
  | {
      url: 'categoryPositionLimit/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CategoryPositionLimit[];
    }
  | {
      url: 'categoryPositionLimit/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CategoryPositionLimit[];
    }
  | {
      url: 'categoryRiskParameter/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CategoryRiskParameter[];
    }
  | {
      url: 'categoryRiskParameter/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CategoryRiskParameter;
    }
  | {
      url: 'categoryRiskParameter/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CategoryRiskParameter[];
    }
  | {
      url: 'categoryRiskParameter/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CategoryRiskParameter[];
    }
  | {
      url: 'userPlugin/changepluginpermission';
      request: {
        body: ChangePluginPermission;
      };
      response: SimpleResponse;
    }
  | {
      url: 'userProperty/changeuserproperty';
      request: {
        body: ChangeUserProperty;
      };
      response: SimpleResponse;
    }
  | {
      url: 'customerApplication/checkduplicate';
      request: {
        body: CheckDuplicate;
      };
      response: SimpleResponse;
    }
  | {
      url: 'clearingHouse/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: ClearingHouse;
    }
  | {
      url: 'clearingHouse/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: ClearingHouse;
    }
  | {
      url: 'clearingHouse/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: ClearingHouse[];
    }
  | {
      url: 'clearingHouse/list';
      request: {
        body?: {};
      };
      response: ClearingHouse[];
    }
  | {
      url: 'clearingHouse/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: ClearingHouse[];
    }
  | {
      url: 'clientApp/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: ClientApp;
    }
  | {
      url: 'clientApp/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: ClientApp;
    }
  | {
      url: 'clientApp/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: ClientApp[];
    }
  | {
      url: 'clientApp/list';
      request: {
        body?: {};
      };
      response: ClientApp[];
    }
  | {
      url: 'clientApp/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: ClientApp[];
    }
  | {
      url: 'command/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: Command[];
    }
  | {
      url: 'command/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Command;
    }
  | {
      url: 'command/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Command[];
    }
  | {
      url: 'command/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: Command[];
    }
  | {
      url: 'command/list';
      request: {
        body?: {};
      };
      response: Command[];
    }
  | {
      url: 'commandReport/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CommandReport[];
    }
  | {
      url: 'commandReport/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CommandReport;
    }
  | {
      url: 'commandReport/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CommandReport[];
    }
  | {
      url: 'commandReport/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CommandReport[];
    }
  | {
      url: 'commandReport/list';
      request: {
        body?: {};
      };
      response: CommandReport[];
    }
  | {
      url: 'adminAlertSignal/completealertsignal';
      request: {
        body: CompleteAlertSignal;
      };
      response: AdminAlertSignalResponse;
    }
  | {
      url: 'contactInfo/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: ContactInfo[];
    }
  | {
      url: 'contactInfo/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: ContactInfo;
    }
  | {
      url: 'contactInfo/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: ContactInfo[];
    }
  | {
      url: 'contactInfo/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: ContactInfo[];
    }
  | {
      url: 'contract/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: Contract[];
    }
  | {
      url: 'contract/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: Contract;
    }
  | {
      url: 'contractGroup/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: ContractGroup;
    }
  | {
      url: 'contractGroup/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: ContractGroup;
    }
  | {
      url: 'contractGroup/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: ContractGroup[];
    }
  | {
      url: 'contractGroup/list';
      request: {
        body?: {};
      };
      response: ContractGroup[];
    }
  | {
      url: 'contractGroup/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: ContractGroup[];
    }
  | {
      url: 'contract/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Contract;
    }
  | {
      url: 'contract/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Contract[];
    }
  | {
      url: 'contract/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: Contract[];
    }
  | {
      url: 'contractMargin/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: ContractMargin[];
    }
  | {
      url: 'contractMargin/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: ContractMargin;
    }
  | {
      url: 'contractMargin/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: ContractMargin[];
    }
  | {
      url: 'contractMargin/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: ContractMargin[];
    }
  | {
      url: 'contractMaturity/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: ContractMaturity[];
    }
  | {
      url: 'contractMaturity/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: ContractMaturity;
    }
  | {
      url: 'contractMaturity/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: ContractMaturity[];
    }
  | {
      url: 'contractMaturity/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: ContractMaturity[];
    }
  | {
      url: 'contract/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: Contract[];
    }
  | {
      url: 'corporateApplicant/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CorporateApplicant[];
    }
  | {
      url: 'corporateApplicant/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CorporateApplicant;
    }
  | {
      url: 'corporateApplicant/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CorporateApplicant[];
    }
  | {
      url: 'corporateApplicant/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CorporateApplicant[];
    }
  | {
      url: 'corporateApplicant/list';
      request: {
        body?: {};
      };
      response: CorporateApplicant[];
    }
  | {
      url: 'country/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: Country;
    }
  | {
      url: 'countries/countryisbanned';
      request: {
        body: CountryIsBanned;
      };
      response: CountryIsBannedResponse;
    }
  | {
      url: 'country/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Country;
    }
  | {
      url: 'country/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Country[];
    }
  | {
      url: 'country/list';
      request: {
        body?: {};
      };
      response: Country[];
    }
  | {
      url: 'country/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: Country[];
    }
  | {
      url: 'alert/createalert';
      request: {
        body: CreateAlert;
      };
      response: AlertResponse;
    }
  | {
      url: 'user/createevaluationaccounts';
      request: {
        body: CreateEvaluationAccounts;
      };
      response: CreateEvaluationAccountsResponse;
    }
  | {
      url: 'user/createevaluationusers';
      request: {
        body: CreateEvaluationUsers;
      };
      response: CreateEvaluationUsersResponse;
    }
  | {
      url: 'user/createnewtrial';
      request: {
        body?: {};
      };
      response: SimpleResponse;
    }
  | {
      url: 'user/createtradingpermission';
      request: {
        body: CreateTradingPermission;
      };
      response: TradingPermissionResponse;
    }
  | {
      url: 'currency/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: Currency;
    }
  | {
      url: 'currency/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Currency;
    }
  | {
      url: 'currency/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Currency[];
    }
  | {
      url: 'currency/list';
      request: {
        body?: {};
      };
      response: Currency[];
    }
  | {
      url: 'currencyRate/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CurrencyRate[];
    }
  | {
      url: 'currencyRate/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CurrencyRate;
    }
  | {
      url: 'currencyRate/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CurrencyRate[];
    }
  | {
      url: 'currencyRate/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CurrencyRate[];
    }
  | {
      url: 'currencyRate/list';
      request: {
        body?: {};
      };
      response: CurrencyRate[];
    }
  | {
      url: 'currency/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: Currency[];
    }
  | {
      url: 'customerApplicationCheckState/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CustomerApplicationCheckState[];
    }
  | {
      url: 'customerApplicationCheckState/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CustomerApplicationCheckState;
    }
  | {
      url: 'customerApplicationCheckState/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CustomerApplicationCheckState[];
    }
  | {
      url: 'customerApplicationCheckState/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CustomerApplicationCheckState[];
    }
  | {
      url: 'customerApplicationCheckState/list';
      request: {
        body?: {};
      };
      response: CustomerApplicationCheckState[];
    }
  | {
      url: 'customerApplication/create';
      request: {
        body: CustomerApplication;
      };
      response: CustomerApplication;
    }
  | {
      url: 'customerApplication/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CustomerApplication[];
    }
  | {
      url: 'customerApplicationDocument/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CustomerApplicationDocument[];
    }
  | {
      url: 'customerApplicationDocument/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CustomerApplicationDocument;
    }
  | {
      url: 'customerApplicationDocument/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CustomerApplicationDocument[];
    }
  | {
      url: 'customerApplicationDocument/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CustomerApplicationDocument[];
    }
  | {
      url: 'customerApplication/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CustomerApplication;
    }
  | {
      url: 'customerApplication/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CustomerApplication[];
    }
  | {
      url: 'customerApplication/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CustomerApplication[];
    }
  | {
      url: 'customerApplication/list';
      request: {
        body?: {};
      };
      response: CustomerApplication[];
    }
  | {
      url: 'customerApplicationSigningState/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CustomerApplicationSigningState[];
    }
  | {
      url: 'customerApplicationSigningState/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CustomerApplicationSigningState;
    }
  | {
      url: 'customerApplicationSigningState/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CustomerApplicationSigningState[];
    }
  | {
      url: 'customerApplicationSigningState/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CustomerApplicationSigningState[];
    }
  | {
      url: 'customerApplicationSigningState/list';
      request: {
        body?: {};
      };
      response: CustomerApplicationSigningState[];
    }
  | {
      url: 'customerApplication/update';
      request: {
        body: CustomerApplication;
      };
      response: CustomerApplication;
    }
  | {
      url: 'customerMarketingInfo/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: CustomerMarketingInfo[];
    }
  | {
      url: 'customerMarketingInfo/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: CustomerMarketingInfo;
    }
  | {
      url: 'customerMarketingInfo/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: CustomerMarketingInfo[];
    }
  | {
      url: 'customerMarketingInfo/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: CustomerMarketingInfo[];
    }
  | {
      url: 'alert/deletealert';
      request: {
        body: DeleteAlert;
      };
      response: AlertResponse;
    }
  | {
      url: 'userAccountPositionLimit/deleteuseraccountpositionlimit';
      request: {
        body: DeleteUserAccountPositionLimit;
      };
      response: DeleteResultResponse;
    }
  | {
      url: 'userAccountPositionLimit/deleteuseraccountriskparameter';
      request: {
        body: DeleteUserAccountRiskParameter;
      };
      response: DeleteResultResponse;
    }
  | {
      url: 'alert/dismissalert';
      request: {
        body: DismissAlert;
      };
      response: AlertResponse;
    }
  | {
      url: 'agreementDocumentContent/downloadsubaccountrequestpreview';
      request: {
        body: DownloadSubAccountRequestPreview;
      };
      response: SubAccountRequestPreviewResponse;
    }
  | {
      url: 'agreementDocumentContent/downloaduserdocumentpreview';
      request: {
        body: DownloadUserDocumentPreview;
      };
      response: DownloadUserDocumentPreviewResponse;
    }
  | {
      url: 'userCertification/downloadw8certificationdocument';
      request: {
        body?: {};
      };
      response: CertificationContentResponse;
    }
  | {
      url: 'order/dryrun';
      request: {
        body: DryRun;
      };
      response: DryRunResponse;
    }
  | {
      url: 'emergencyRisk/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: EmergencyRisk[];
    }
  | {
      url: 'emergencyRisk/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: EmergencyRisk;
    }
  | {
      url: 'emergencyRisk/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: EmergencyRisk[];
    }
  | {
      url: 'emergencyRisk/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: EmergencyRisk[];
    }
  | {
      url: 'emergencyRisk/list';
      request: {
        body?: {};
      };
      response: EmergencyRisk[];
    }
  | {
      url: 'entitlement/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Entitlement;
    }
  | {
      url: 'entitlement/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Entitlement[];
    }
  | {
      url: 'entitlement/list';
      request: {
        body?: {};
      };
      response: Entitlement[];
    }
  | {
      url: 'fee/evaluatefillfee';
      request: {
        body: EvaluateFillFee;
      };
      response: EvaluateFillFeeResponse;
    }
  | {
      url: 'exchange/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: Exchange;
    }
  | {
      url: 'exchange/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Exchange;
    }
  | {
      url: 'exchange/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Exchange[];
    }
  | {
      url: 'exchange/list';
      request: {
        body?: {};
      };
      response: Exchange[];
    }
  | {
      url: 'exchange/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: Exchange[];
    }
  | {
      url: 'executionReport/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: ExecutionReport[];
    }
  | {
      url: 'executionReport/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: ExecutionReport;
    }
  | {
      url: 'executionReport/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: ExecutionReport;
    }
  | {
      url: 'executionReport/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: ExecutionReport[];
    }
  | {
      url: 'executionReport/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: ExecutionReport[];
    }
  | {
      url: 'executionReport/list';
      request: {
        body?: {};
      };
      response: ExecutionReport[];
    }
  | {
      url: 'fee/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Fee;
    }
  | {
      url: 'fee/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Fee[];
    }
  | {
      url: 'fee/list';
      request: {
        body?: {};
      };
      response: Fee[];
    }
  | {
      url: 'fill/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: Fill[];
    }
  | {
      url: 'fillFee/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: FillFee[];
    }
  | {
      url: 'fillFee/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: FillFee;
    }
  | {
      url: 'fillFee/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: FillFee[];
    }
  | {
      url: 'fillFee/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: FillFee[];
    }
  | {
      url: 'fillFee/list';
      request: {
        body?: {};
      };
      response: FillFee[];
    }
  | {
      url: 'fill/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Fill;
    }
  | {
      url: 'fill/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Fill[];
    }
  | {
      url: 'fill/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: Fill[];
    }
  | {
      url: 'fill/list';
      request: {
        body?: {};
      };
      response: Fill[];
    }
  | {
      url: 'fillPair/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: FillPair[];
    }
  | {
      url: 'fillPair/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: FillPair;
    }
  | {
      url: 'fillPair/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: FillPair[];
    }
  | {
      url: 'fillPair/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: FillPair[];
    }
  | {
      url: 'fillPair/list';
      request: {
        body?: {};
      };
      response: FillPair[];
    }
  | {
      url: 'fundTransaction/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: FundTransaction[];
    }
  | {
      url: 'fundTransaction/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: FundTransaction;
    }
  | {
      url: 'fundTransaction/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: FundTransaction[];
    }
  | {
      url: 'fundTransaction/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: FundTransaction[];
    }
  | {
      url: 'fundTransaction/list';
      request: {
        body?: {};
      };
      response: FundTransaction[];
    }
  | {
      url: 'user/getaccounttradingpermissions';
      request: {
        body: GetAccountTradingPermissions;
      };
      response: TradingPermissionsResponse;
    }
  | {
      url: 'agreementDocumentContent/getagreementdocument';
      request: {
        body: GetAgreementDocument;
      };
      response: DocumentContentResponse;
    }
  | {
      url: 'cashBalance/getcashbalancesnapshot';
      request: {
        body: GetCashBalanceSnapshot;
      };
      response: CashBalanceSnapshot;
    }
  | {
      url: 'customerApplication/getcurrentannualreviewinfo';
      request: {
        body: GetCurrentAnnualReviewInfo;
      };
      response: CurrentAnnualReviewInfoResponse;
    }
  | {
      url: 'userPlugin/getentitlementeligibilityinfo';
      request: {
        body: GetEntitlementEligibilityInfo;
      };
      response: EligibilityInfoResponse;
    }
  | {
      url: 'contract/geteventproducts';
      request: {
        body?: {};
      };
      response: EventProductsResponse;
    }
  | {
      url: 'user/getfundingoptions';
      request: {
        body: GetFundingOptions;
      };
      response: FundingOptionsResponse;
    }
  | {
      url: 'agreementDocumentContent/getlocalizedagreementdocument';
      request: {
        body: GetLocalizedAgreementDocument;
      };
      response: DocumentContentResponse;
    }
  | {
      url: 'contract/getoptionschain';
      request: {
        body: GetOptionsChain;
      };
      response: OptionsChainResponse;
    }
  | {
      url: 'user/getprocessingfee';
      request: {
        body: GetProcessingFee;
      };
      response: ProcessingFee;
    }
  | {
      url: 'markets/getproduct';
      request: {
        body: GetProduct;
      };
      response: ProductDetails;
    }
  | {
      url: 'contract/getproductfeeparams';
      request: {
        body: GetProductFeeParams;
      };
      response: ProductFeeParamsResponse;
    }
  | {
      url: 'support/gettimestamp';
      request: {
        body?: {};
      };
      response: TimestampResponse;
    }
  | {
      url: 'userSignedDocumentContent/getusersigneddocument';
      request: {
        body: GetUserSignedDocument;
      };
      response: DocumentContentResponse;
    }
  | {
      url: 'individualApplicant/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: IndividualApplicant[];
    }
  | {
      url: 'individualApplicant/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: IndividualApplicant;
    }
  | {
      url: 'individualApplicant/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: IndividualApplicant[];
    }
  | {
      url: 'individualApplicant/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: IndividualApplicant[];
    }
  | {
      url: 'individualApplicant/list';
      request: {
        body?: {};
      };
      response: IndividualApplicant[];
    }
  | {
      url: 'orderStrategy/interruptorderstrategy';
      request: {
        body: InterruptOrderStrategy;
      };
      response: OrderStrategyStatusResponse;
    }
  | {
      url: 'jointApplicant/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: JointApplicant[];
    }
  | {
      url: 'jointApplicant/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: JointApplicant;
    }
  | {
      url: 'jointApplicant/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: JointApplicant[];
    }
  | {
      url: 'jointApplicant/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: JointApplicant[];
    }
  | {
      url: 'jointApplicant/list';
      request: {
        body?: {};
      };
      response: JointApplicant[];
    }
  | {
      url: 'order/liquidateposition';
      request: {
        body: LiquidatePosition;
      };
      response: PlaceOrderResult;
    }
  | {
      url: 'order/liquidatepositions';
      request: {
        body: LiquidatePositions;
      };
      response: SimpleResponse;
    }
  | {
      url: 'marginSnapshot/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: MarginSnapshot[];
    }
  | {
      url: 'marginSnapshot/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: MarginSnapshot;
    }
  | {
      url: 'marginSnapshot/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: MarginSnapshot[];
    }
  | {
      url: 'marginSnapshot/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: MarginSnapshot[];
    }
  | {
      url: 'marginSnapshot/list';
      request: {
        body?: {};
      };
      response: MarginSnapshot[];
    }
  | {
      url: 'alert/markreadalertsignal';
      request: {
        body: MarkReadAlertSignal;
      };
      response: AlertResponse;
    }
  | {
      url: 'marketDataSubscription/create';
      request: {
        body: MarketDataSubscription;
      };
      response: MarketDataSubscription;
    }
  | {
      url: 'marketDataSubscription/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: MarketDataSubscription[];
    }
  | {
      url: 'marketDataSubscriptionExchangeScope/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: MarketDataSubscriptionExchangeScope;
    }
  | {
      url: 'marketDataSubscriptionExchangeScope/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: MarketDataSubscriptionExchangeScope;
    }
  | {
      url: 'marketDataSubscriptionExchangeScope/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: MarketDataSubscriptionExchangeScope[];
    }
  | {
      url: 'marketDataSubscriptionExchangeScope/list';
      request: {
        body?: {};
      };
      response: MarketDataSubscriptionExchangeScope[];
    }
  | {
      url: 'marketDataSubscriptionExchangeScope/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: MarketDataSubscriptionExchangeScope[];
    }
  | {
      url: 'marketDataSubscription/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: MarketDataSubscription;
    }
  | {
      url: 'marketDataSubscription/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: MarketDataSubscription[];
    }
  | {
      url: 'marketDataSubscription/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: MarketDataSubscription[];
    }
  | {
      url: 'marketDataSubscription/list';
      request: {
        body?: {};
      };
      response: MarketDataSubscription[];
    }
  | {
      url: 'marketDataSubscriptionPlan/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: MarketDataSubscriptionPlan;
    }
  | {
      url: 'marketDataSubscriptionPlan/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: MarketDataSubscriptionPlan;
    }
  | {
      url: 'marketDataSubscriptionPlan/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: MarketDataSubscriptionPlan[];
    }
  | {
      url: 'marketDataSubscriptionPlan/list';
      request: {
        body?: {};
      };
      response: MarketDataSubscriptionPlan[];
    }
  | {
      url: 'marketDataSubscriptionPlan/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: MarketDataSubscriptionPlan[];
    }
  | {
      url: 'marketDataSubscription/update';
      request: {
        body: MarketDataSubscription;
      };
      response: MarketDataSubscription;
    }
  | {
      url: 'auth/me';
      request: {
        body?: {};
      };
      response: OAuthMeResponse;
    }
  | {
      url: 'alert/modifyalert';
      request: {
        body: ModifyAlert;
      };
      response: AlertResponse;
    }
  | {
      url: 'user/modifycredentials';
      request: {
        body: ModifyCredentials;
      };
      response: AccessTokenResponse;
    }
  | {
      url: 'user/modifyemailaddress';
      request: {
        body: ModifyEmailAddress;
      };
      response: UserStatusMessage;
    }
  | {
      url: 'order/modifyorder';
      request: {
        body: ModifyOrder;
      };
      response: CommandResult;
    }
  | {
      url: 'orderStrategy/modifyorderstrategy';
      request: {
        body: ModifyOrderStrategy;
      };
      response: OrderStrategyStatusResponse;
    }
  | {
      url: 'user/modifypassword';
      request: {
        body: ModifyPassword;
      };
      response: AccessTokenResponse;
    }
  | {
      url: 'auth/oauthtoken';
      request: {
        body: OAuthToken;
      };
      response: OAuthTokenResponse;
    }
  | {
      url: 'user/opendemoaccount';
      request: {
        body: OpenDemoAccount;
      };
      response: OpenDemoAccountResponse;
    }
  | {
      url: 'order/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: Order[];
    }
  | {
      url: 'order/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Order;
    }
  | {
      url: 'order/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Order[];
    }
  | {
      url: 'order/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: Order[];
    }
  | {
      url: 'order/list';
      request: {
        body?: {};
      };
      response: Order[];
    }
  | {
      url: 'orderStrategy/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: OrderStrategy[];
    }
  | {
      url: 'orderStrategy/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: OrderStrategy;
    }
  | {
      url: 'orderStrategy/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: OrderStrategy[];
    }
  | {
      url: 'orderStrategy/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: OrderStrategy[];
    }
  | {
      url: 'orderStrategyLink/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: OrderStrategyLink[];
    }
  | {
      url: 'orderStrategyLink/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: OrderStrategyLink;
    }
  | {
      url: 'orderStrategyLink/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: OrderStrategyLink[];
    }
  | {
      url: 'orderStrategyLink/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: OrderStrategyLink[];
    }
  | {
      url: 'orderStrategyLink/list';
      request: {
        body?: {};
      };
      response: OrderStrategyLink[];
    }
  | {
      url: 'orderStrategy/list';
      request: {
        body?: {};
      };
      response: OrderStrategy[];
    }
  | {
      url: 'orderStrategyType/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: OrderStrategyType;
    }
  | {
      url: 'orderStrategyType/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: OrderStrategyType;
    }
  | {
      url: 'orderStrategyType/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: OrderStrategyType[];
    }
  | {
      url: 'orderStrategyType/list';
      request: {
        body?: {};
      };
      response: OrderStrategyType[];
    }
  | {
      url: 'orderStrategyType/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: OrderStrategyType[];
    }
  | {
      url: 'orderVersion/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: OrderVersion[];
    }
  | {
      url: 'orderVersion/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: OrderVersion;
    }
  | {
      url: 'orderVersion/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: OrderVersion[];
    }
  | {
      url: 'orderVersion/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: OrderVersion[];
    }
  | {
      url: 'orderVersion/list';
      request: {
        body?: {};
      };
      response: OrderVersion[];
    }
  | {
      url: 'organization/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: Organization;
    }
  | {
      url: 'organization/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Organization;
    }
  | {
      url: 'organization/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Organization[];
    }
  | {
      url: 'organization/list';
      request: {
        body?: {};
      };
      response: Organization[];
    }
  | {
      url: 'organization/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: Organization[];
    }
  | {
      url: 'permissionedAccountAutoLiq/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: PermissionedAccountAutoLiq[];
    }
  | {
      url: 'permissionedAccountAutoLiq/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: PermissionedAccountAutoLiq;
    }
  | {
      url: 'permissionedAccountAutoLiq/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: PermissionedAccountAutoLiq[];
    }
  | {
      url: 'permissionedAccountAutoLiq/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: PermissionedAccountAutoLiq[];
    }
  | {
      url: 'permissionedAccountAutoLiq/list';
      request: {
        body?: {};
      };
      response: PermissionedAccountAutoLiq[];
    }
  | {
      url: 'order/placeoco';
      request: {
        body: PlaceOCO;
      };
      response: PlaceOcoResult;
    }
  | {
      url: 'order/placeoso';
      request: {
        body: PlaceOSO;
      };
      response: PlaceOsoResult;
    }
  | {
      url: 'order/placeorder';
      request: {
        body: PlaceOrder;
      };
      response: PlaceOrderResult;
    }
  | {
      url: 'position/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: Position[];
    }
  | {
      url: 'position/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: Position;
    }
  | {
      url: 'position/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Position;
    }
  | {
      url: 'position/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Position[];
    }
  | {
      url: 'position/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: Position[];
    }
  | {
      url: 'position/list';
      request: {
        body?: {};
      };
      response: Position[];
    }
  | {
      url: 'positionLog/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: PositionLog[];
    }
  | {
      url: 'positionLog/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: PositionLog;
    }
  | {
      url: 'positionLog/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: PositionLog[];
    }
  | {
      url: 'positionLog/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: PositionLog[];
    }
  | {
      url: 'customerApplication/prepareagreementdocuments';
      request: {
        body: PrepareAgreementDocuments;
      };
      response: AgreementDocumentsResponse;
    }
  | {
      url: 'product/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: Product[];
    }
  | {
      url: 'product/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: Product;
    }
  | {
      url: 'product/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Product;
    }
  | {
      url: 'product/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Product[];
    }
  | {
      url: 'product/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: Product[];
    }
  | {
      url: 'product/list';
      request: {
        body?: {};
      };
      response: Product[];
    }
  | {
      url: 'productMargin/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: ProductMargin[];
    }
  | {
      url: 'productMargin/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: ProductMargin;
    }
  | {
      url: 'productMargin/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: ProductMargin[];
    }
  | {
      url: 'productMargin/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: ProductMargin[];
    }
  | {
      url: 'productMargin/list';
      request: {
        body?: {};
      };
      response: ProductMargin[];
    }
  | {
      url: 'productSession/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: ProductSession[];
    }
  | {
      url: 'productSession/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: ProductSession;
    }
  | {
      url: 'productSession/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: ProductSession[];
    }
  | {
      url: 'productSession/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: ProductSession[];
    }
  | {
      url: 'product/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: Product[];
    }
  | {
      url: 'markets/products';
      request: {
        body?: {};
      };
      response: ProductList;
    }
  | {
      url: 'property/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: Property;
    }
  | {
      url: 'property/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Property;
    }
  | {
      url: 'property/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Property[];
    }
  | {
      url: 'property/list';
      request: {
        body?: {};
      };
      response: Property[];
    }
  | {
      url: 'property/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: Property[];
    }
  | {
      url: 'userCertification/pulseliveoptout';
      request: {
        body: PulseLiveOptOut;
      };
      response: PulseLiveOptOutResponse;
    }
  | {
      url: 'auth/renewaccesstoken';
      request: {
        body?: {};
      };
      response: AccessTokenResponse;
    }
  | {
      url: 'user/requesttradingpermission';
      request: {
        body: RequestTradingPermission;
      };
      response: TradingPermissionResponse;
    }
  | {
      url: 'alert/resetalert';
      request: {
        body: ResetAlert;
      };
      response: AlertResponse;
    }
  | {
      url: 'accountRiskStatus/resetautoliqstatus';
      request: {
        body: ResetAutoLiqStatus;
      };
      response: AccountRiskStatusResponse;
    }
  | {
      url: 'account/resetdemoaccountstate';
      request: {
        body: ResetDemoAccountState;
      };
      response: SimpleResponse;
    }
  | {
      url: 'user/revoketradingpermission';
      request: {
        body: RevokeTradingPermission;
      };
      response: TradingPermissionResponse;
    }
  | {
      url: 'user/revoketradingpermissions';
      request: {
        body: RevokeTradingPermissions;
      };
      response: SimpleResponse;
    }
  | {
      url: 'riskCategory/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: RiskCategory;
    }
  | {
      url: 'riskCategory/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: RiskCategory;
    }
  | {
      url: 'riskCategory/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: RiskCategory[];
    }
  | {
      url: 'riskCategory/list';
      request: {
        body?: {};
      };
      response: RiskCategory[];
    }
  | {
      url: 'riskCategory/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: RiskCategory[];
    }
  | {
      url: 'riskDiscountContractGroup/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: RiskDiscountContractGroup;
    }
  | {
      url: 'riskDiscountContractGroup/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: RiskDiscountContractGroup;
    }
  | {
      url: 'riskDiscountContractGroup/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: RiskDiscountContractGroup[];
    }
  | {
      url: 'riskDiscountContractGroup/list';
      request: {
        body?: {};
      };
      response: RiskDiscountContractGroup[];
    }
  | {
      url: 'riskDiscountContractGroup/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: RiskDiscountContractGroup[];
    }
  | {
      url: 'riskTimePeriod/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: RiskTimePeriod;
    }
  | {
      url: 'riskTimePeriod/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: RiskTimePeriod;
    }
  | {
      url: 'riskTimePeriod/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: RiskTimePeriod[];
    }
  | {
      url: 'riskTimePeriod/list';
      request: {
        body?: {};
      };
      response: RiskTimePeriod[];
    }
  | {
      url: 'riskTimePeriod/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: RiskTimePeriod[];
    }
  | {
      url: 'contract/rollcontract';
      request: {
        body: RollContract;
      };
      response: RollContractResponse;
    }
  | {
      url: 'contract/rollcontracts';
      request: {
        body: RollContracts;
      };
      response: RollContractsResponse;
    }
  | {
      url: 'markets/search';
      request: {
        body: Search;
      };
      response: ProductList;
    }
  | {
      url: 'secondMarketDataSubscription/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: SecondMarketDataSubscription[];
    }
  | {
      url: 'secondMarketDataSubscription/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: SecondMarketDataSubscription;
    }
  | {
      url: 'secondMarketDataSubscription/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: SecondMarketDataSubscription[];
    }
  | {
      url: 'secondMarketDataSubscription/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: SecondMarketDataSubscription[];
    }
  | {
      url: 'secondMarketDataSubscription/list';
      request: {
        body?: {};
      };
      response: SecondMarketDataSubscription[];
    }
  | {
      url: 'user/sendnotifyadminalert';
      request: {
        body: SendNotifyAdminAlert;
      };
      response: SimpleResponse;
    }
  | {
      url: 'accountRiskStatus/setaccountnotes';
      request: {
        body: SetAccountNotes;
      };
      response: SimpleResponse;
    }
  | {
      url: 'accountRiskStatus/setadminautoliqaction';
      request: {
        body: SetAdminAutoLiqAction;
      };
      response: AccountRiskStatusResponse;
    }
  | {
      url: 'accountRiskStatus/setdemohalt';
      request: {
        body: SetDemoHalt;
      };
      response: SimpleResponse;
    }
  | {
      url: 'customerApplication/signagreementdocuments';
      request: {
        body: SignAgreementDocuments;
      };
      response: AgreementDocumentsResponse;
    }
  | {
      url: 'customerApplication/signnonprocertification';
      request: {
        body: SignNonProCertification;
      };
      response: AgreementDocumentsResponse;
    }
  | {
      url: 'customerApplication/signsubaccountrequest';
      request: {
        body: SignSubAccountRequest;
      };
      response: AgreementDocumentsResponse;
    }
  | {
      url: 'user/signuporganizationmember';
      request: {
        body: SignUpOrganizationMember;
      };
      response: SignUpResponse;
    }
  | {
      url: 'customerApplication/signuserdocument';
      request: {
        body: SignUserDocument;
      };
      response: AgreementDocumentsResponse;
    }
  | {
      url: 'userCertification/signw8';
      request: {
        body: SignW8;
      };
      response: SignW8Response;
    }
  | {
      url: 'spreadDefinition/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: SpreadDefinition;
    }
  | {
      url: 'spreadDefinition/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: SpreadDefinition[];
    }
  | {
      url: 'customerApplication/startcustomerapplication';
      request: {
        body: StartCustomerApplication;
      };
      response: CustomerApplicationResponse;
    }
  | {
      url: 'orderStrategy/startorderstrategy';
      request: {
        body: StartOrderStrategy;
      };
      response: OrderStrategyStatusResponse;
    }
  | {
      url: 'subAccountRequest/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: SubAccountRequest[];
    }
  | {
      url: 'subAccountRequest/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: SubAccountRequest;
    }
  | {
      url: 'subAccountRequest/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: SubAccountRequest[];
    }
  | {
      url: 'subAccountRequest/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: SubAccountRequest[];
    }
  | {
      url: 'subAccountRequest/list';
      request: {
        body?: {};
      };
      response: SubAccountRequest[];
    }
  | {
      url: 'customerApplication/submitannualreview';
      request: {
        body: SubmitAnnualReview;
      };
      response: SubmitAnnualReviewResponse;
    }
  | {
      url: 'customerApplication/submitapplicant';
      request: {
        body: SubmitApplicant;
      };
      response: ApplicantResponse;
    }
  | {
      url: 'customerApplication/submitcustomerapplicationdocument';
      request: {
        body: SubmitCustomerApplicationDocument;
      };
      response: SimpleResponse;
    }
  | {
      url: 'accountRiskStatus/switchriskcategory';
      request: {
        body: SwitchRiskCategory;
      };
      response: SimpleResponse;
    }
  | {
      url: 'user/switchtoprofessional';
      request: {
        body: SwitchToProfessional;
      };
      response: SimpleResponse;
    }
  | {
      url: 'user/syncrequest';
      request: {
        body: SyncRequest;
      };
      response: SyncMessage;
    }
  | {
      url: 'adminAlertSignal/takealertsignalownership';
      request: {
        body: TakeAlertSignalOwnership;
      };
      response: AdminAlertSignalResponse;
    }
  | {
      url: 'userCertification/thirdpartydatasharing';
      request: {
        body: ThirdPartyDataSharing;
      };
      response: ThirdPartyDataSharingResponse;
    }
  | {
      url: 'tradingPermissionConsent/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: TradingPermissionConsent[];
    }
  | {
      url: 'tradingPermissionConsent/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: TradingPermissionConsent;
    }
  | {
      url: 'tradingPermissionConsent/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: TradingPermissionConsent[];
    }
  | {
      url: 'tradingPermissionConsent/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: TradingPermissionConsent[];
    }
  | {
      url: 'tradingPermissionConsent/list';
      request: {
        body?: {};
      };
      response: TradingPermissionConsent[];
    }
  | {
      url: 'tradingPermission/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: TradingPermission[];
    }
  | {
      url: 'tradingPermission/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: TradingPermission;
    }
  | {
      url: 'tradingPermission/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: TradingPermission[];
    }
  | {
      url: 'tradingPermission/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: TradingPermission[];
    }
  | {
      url: 'tradingPermission/list';
      request: {
        body?: {};
      };
      response: TradingPermission[];
    }
  | {
      url: 'tradingSession/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: TradingSession[];
    }
  | {
      url: 'tradingSession/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: TradingSession;
    }
  | {
      url: 'tradingSession/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: TradingSession[];
    }
  | {
      url: 'tradingSession/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: TradingSession[];
    }
  | {
      url: 'tradovateSubscription/create';
      request: {
        body: TradovateSubscription;
      };
      response: TradovateSubscription;
    }
  | {
      url: 'tradovateSubscription/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: TradovateSubscription[];
    }
  | {
      url: 'tradovateSubscription/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: TradovateSubscription;
    }
  | {
      url: 'tradovateSubscription/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: TradovateSubscription[];
    }
  | {
      url: 'tradovateSubscription/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: TradovateSubscription[];
    }
  | {
      url: 'tradovateSubscription/list';
      request: {
        body?: {};
      };
      response: TradovateSubscription[];
    }
  | {
      url: 'tradovateSubscriptionPlan/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: TradovateSubscriptionPlan;
    }
  | {
      url: 'tradovateSubscriptionPlan/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: TradovateSubscriptionPlan;
    }
  | {
      url: 'tradovateSubscriptionPlan/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: TradovateSubscriptionPlan[];
    }
  | {
      url: 'tradovateSubscriptionPlan/list';
      request: {
        body?: {};
      };
      response: TradovateSubscriptionPlan[];
    }
  | {
      url: 'tradovateSubscriptionPlan/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: TradovateSubscriptionPlan[];
    }
  | {
      url: 'tradovateSubscription/update';
      request: {
        body: TradovateSubscription;
      };
      response: TradovateSubscription;
    }
  | {
      url: 'contactInfo/updatecontactinfo';
      request: {
        body: UpdateContactInfo;
      };
      response: UpdateContactInfoResponse;
    }
  | {
      url: 'contactInfo/updatecontactinfoname';
      request: {
        body: UpdateContactInfoName;
      };
      response: UpdateContactInfoResponse;
    }
  | {
      url: 'accountRiskStatus/updatemaxnetliq';
      request: {
        body: UpdateMaxNetLiq;
      };
      response: AccountRiskStatusResponse;
    }
  | {
      url: 'userAccountAutoLiq/updateuserautoliq';
      request: {
        body: UpdateUserAutoLiq;
      };
      response: UpdateUserAutoLiqResponse;
    }
  | {
      url: 'userAccountAutoLiq/create';
      request: {
        body: UserAccountAutoLiq;
      };
      response: UserAccountAutoLiq;
    }
  | {
      url: 'userAccountAutoLiq/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserAccountAutoLiq[];
    }
  | {
      url: 'userAccountAutoLiq/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserAccountAutoLiq;
    }
  | {
      url: 'userAccountAutoLiq/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserAccountAutoLiq[];
    }
  | {
      url: 'userAccountAutoLiq/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserAccountAutoLiq[];
    }
  | {
      url: 'userAccountAutoLiq/list';
      request: {
        body?: {};
      };
      response: UserAccountAutoLiq[];
    }
  | {
      url: 'userAccountAutoLiq/update';
      request: {
        body: UserAccountAutoLiq;
      };
      response: UserAccountAutoLiq;
    }
  | {
      url: 'userAccountPositionLimit/create';
      request: {
        body: UserAccountPositionLimit;
      };
      response: UserAccountPositionLimit;
    }
  | {
      url: 'userAccountPositionLimit/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserAccountPositionLimit[];
    }
  | {
      url: 'userAccountPositionLimit/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserAccountPositionLimit;
    }
  | {
      url: 'userAccountPositionLimit/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserAccountPositionLimit[];
    }
  | {
      url: 'userAccountPositionLimit/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserAccountPositionLimit[];
    }
  | {
      url: 'userAccountPositionLimit/update';
      request: {
        body: UserAccountPositionLimit;
      };
      response: UserAccountPositionLimit;
    }
  | {
      url: 'userAccountRiskParameter/create';
      request: {
        body: UserAccountRiskParameter;
      };
      response: UserAccountRiskParameter;
    }
  | {
      url: 'userAccountRiskParameter/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserAccountRiskParameter[];
    }
  | {
      url: 'userAccountRiskParameter/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserAccountRiskParameter;
    }
  | {
      url: 'userAccountRiskParameter/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserAccountRiskParameter[];
    }
  | {
      url: 'userAccountRiskParameter/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserAccountRiskParameter[];
    }
  | {
      url: 'userAccountRiskParameter/update';
      request: {
        body: UserAccountRiskParameter;
      };
      response: UserAccountRiskParameter;
    }
  | {
      url: 'userCertification/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserCertification[];
    }
  | {
      url: 'userCertification/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserCertification;
    }
  | {
      url: 'userCertification/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserCertification[];
    }
  | {
      url: 'userCertification/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserCertification[];
    }
  | {
      url: 'userDevice/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserDevice[];
    }
  | {
      url: 'userDevice/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserDevice;
    }
  | {
      url: 'userDevice/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserDevice[];
    }
  | {
      url: 'userDevice/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserDevice[];
    }
  | {
      url: 'user/find';
      request: {
        body?: {};
        query: {
          name: string;
        };
      };
      response: User;
    }
  | {
      url: 'user/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: User;
    }
  | {
      url: 'user/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: User[];
    }
  | {
      url: 'user/list';
      request: {
        body?: {};
      };
      response: User[];
    }
  | {
      url: 'userPlugin/create';
      request: {
        body: UserPlugin;
      };
      response: UserPlugin;
    }
  | {
      url: 'userPlugin/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserPlugin[];
    }
  | {
      url: 'userPlugin/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserPlugin;
    }
  | {
      url: 'userPlugin/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserPlugin[];
    }
  | {
      url: 'userPlugin/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserPlugin[];
    }
  | {
      url: 'userPlugin/list';
      request: {
        body?: {};
      };
      response: UserPlugin[];
    }
  | {
      url: 'userPlugin/update';
      request: {
        body: UserPlugin;
      };
      response: UserPlugin;
    }
  | {
      url: 'userPromoCode/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserPromoCode[];
    }
  | {
      url: 'userPromoCode/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserPromoCode;
    }
  | {
      url: 'userPromoCode/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserPromoCode[];
    }
  | {
      url: 'userPromoCode/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserPromoCode[];
    }
  | {
      url: 'userProperty/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserProperty[];
    }
  | {
      url: 'userProperty/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserProperty;
    }
  | {
      url: 'userProperty/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserProperty[];
    }
  | {
      url: 'userProperty/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserProperty[];
    }
  | {
      url: 'userReadStatus/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserReadStatus[];
    }
  | {
      url: 'userReadStatus/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserReadStatus;
    }
  | {
      url: 'userReadStatus/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserReadStatus[];
    }
  | {
      url: 'userReadStatus/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserReadStatus[];
    }
  | {
      url: 'userReadStatus/list';
      request: {
        body?: {};
      };
      response: UserReadStatus[];
    }
  | {
      url: 'userSession/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserSession;
    }
  | {
      url: 'userSession/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserSession[];
    }
  | {
      url: 'userSessionStats/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserSessionStats[];
    }
  | {
      url: 'userSessionStats/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserSessionStats;
    }
  | {
      url: 'userSessionStats/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserSessionStats[];
    }
  | {
      url: 'userSessionStats/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserSessionStats[];
    }
  | {
      url: 'userSessionStats/list';
      request: {
        body?: {};
      };
      response: UserSessionStats[];
    }
  | {
      url: 'userSignedDocument/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: UserSignedDocument[];
    }
  | {
      url: 'userSignedDocument/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: UserSignedDocument;
    }
  | {
      url: 'userSignedDocument/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: UserSignedDocument[];
    }
  | {
      url: 'userSignedDocument/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: UserSignedDocument[];
    }
  | {
      url: 'user/suggest';
      request: {
        body?: {};
        query: {
          t: string;
          l: number;
        };
      };
      response: User[];
    }
  | {
      url: 'fundTransaction/wallettransfer';
      request: {
        body: WalletTransfer;
      };
      response: FundTransactionResponse;
    }
  | {
      url: 'cashBalance/changeDemoBalance';
      request: {
        body: ChangeDemoBalance;
      };
      response: CashBalance;
    }
  | {
      url: 'replay/changespeed';
      request: {
        body: ChangeSpeed;
      };
      response: SimpleResponse;
    }
  | {
      url: 'replay/checkreplaysession';
      request: {
        body: CheckReplaySession;
      };
      response: CheckReplaySessionResponse;
    }
  | {
      url: 'replay/initializeclock';
      request: {
        body: InitializeClock;
      };
      response: SimpleResponse;
    }
  | {
      url: 'user/activatesecondmarketdatasubscriptionrenewal';
      request: {
        body: ActivateSecondMarketDataSubscriptionRenewal;
      };
      response: SecondMarketDataSubscriptionResponse;
    }
  | {
      url: 'user/addsecondmarketdatasubscription';
      request: {
        body: AddSecondMarketDataSubscription;
      };
      response: SecondMarketDataSubscriptionResponse;
    }
  | {
      url: 'user/cancelsecondmarketdatasubscription';
      request: {
        body: CancelSecondMarketDataSubscription;
      };
      response: SecondMarketDataSubscriptionResponse;
    }
  | {
      url: 'user/cancelsecondmarketdatasubscriptionrenewal';
      request: {
        body: CancelSecondMarketDataSubscriptionRenewal;
      };
      response: SecondMarketDataSubscriptionResponse;
    }
  | {
      url: 'user/getsecondmarketdatasubscriptioncost';
      request: {
        body: GetSecondMarketDataSubscriptionCost;
      };
      response: SecondMarketDataSubscriptionCostResponse;
    }
  | {
      url: 'fundTransaction/checkstripefundingeligibility';
      request: {
        body: CheckStripeFundingEligibility;
      };
      response: CheckStripeFundingEligibilityResponse;
    }
  | {
      url: 'chat/closechat';
      request: {
        body: CloseChat;
      };
      response: ChatResponse;
    }
  | {
      url: 'chat/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: Chat[];
    }
  | {
      url: 'chat/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: Chat;
    }
  | {
      url: 'chat/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: Chat[];
    }
  | {
      url: 'chat/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: Chat[];
    }
  | {
      url: 'chat/list';
      request: {
        body?: {};
      };
      response: Chat[];
    }
  | {
      url: 'chat/markasreadchatmessage';
      request: {
        body: MarkAsReadChatMessage;
      };
      response: ChatMessageResponse;
    }
  | {
      url: 'chat/postchatmessage';
      request: {
        body: PostChatMessage;
      };
      response: ChatMessageResponse;
    }
  | {
      url: 'chatMessage/deps';
      request: {
        body?: {};
        query: {
          masterid: number;
        };
      };
      response: ChatMessage[];
    }
  | {
      url: 'chatMessage/item';
      request: {
        body?: {};
        query: {
          id: number;
        };
      };
      response: ChatMessage;
    }
  | {
      url: 'chatMessage/items';
      request: {
        body?: {};
        query: {
          ids: number[];
        };
      };
      response: ChatMessage[];
    }
  | {
      url: 'chatMessage/ldeps';
      request: {
        body?: {};
        query: {
          masterids: number[];
        };
      };
      response: ChatMessage[];
    }
  | {
      url: 'md/subscribeQuote';
      request: {
        body: any;
      };
      response: any;
    }
  | {
      url: 'md/unsubscribeQuote';
      request: {
        body: any;
      };
      response: any;
    }
  | {
      url: 'md/subscribeDOM';
      request: {
        body: any;
      };
      response: any;
    }
  | {
      url: 'md/unsubscribeDOM';
      request: {
        body: any;
      };
      response: any;
    }
  | {
      url: 'md/subscribeHistogram';
      request: {
        body: any;
      };
      response: any;
    }
  | {
      url: 'md/unsubscribeHistogram';
      request: {
        body: any;
      };
      response: any;
    }
  | {
      url: 'md/getChart';
      request: {
        body: any;
      };
      response: any;
    }
  | {
      url: 'md/cancelChart';
      request: {
        body: any;
      };
      response: any;
    }
  | {
      url: 'authorize';
      request:
        | string
        | {
            body: string;
          };
      response: any;
    };
export interface UrlInMap {
  'user/accepttradingpermission': TradingPermissionResponse;
  'auth/accesstokenrequest': AccessTokenResponse;
  'account/deps': Account[];
  'account/find': Account;
  'account/item': Account;
  'account/items': Account[];
  'account/ldeps': Account[];
  'account/list': Account[];
  'accountRiskStatus/deps': AccountRiskStatus[];
  'accountRiskStatus/item': AccountRiskStatus;
  'accountRiskStatus/items': AccountRiskStatus[];
  'accountRiskStatus/ldeps': AccountRiskStatus[];
  'accountRiskStatus/list': AccountRiskStatus[];
  'accountRiskStatusLog/deps': AccountRiskStatusLog[];
  'accountRiskStatusLog/item': AccountRiskStatusLog;
  'accountRiskStatusLog/items': AccountRiskStatusLog[];
  'accountRiskStatusLog/ldeps': AccountRiskStatusLog[];
  'account/suggest': Account[];
  'userPlugin/addentitlementsubscription': EntitlementSubscriptionResponse;
  'user/addmarketdatasubscription': MarketDataSubscriptionResponse;
  'user/addtradovatesubscription': TradovateSubscriptionResponse;
  'adminAlert/find': AdminAlert;
  'adminAlert/item': AdminAlert;
  'adminAlert/items': AdminAlert[];
  'adminAlert/list': AdminAlert[];
  'adminAlertSignal/deps': AdminAlertSignal[];
  'adminAlertSignal/item': AdminAlertSignal;
  'adminAlertSignal/items': AdminAlertSignal[];
  'adminAlertSignal/ldeps': AdminAlertSignal[];
  'adminAlertSignal/list': AdminAlertSignal[];
  'adminAlert/suggest': AdminAlert[];
  'user/agreedliquidationpolicy': SimpleResponse;
  'user/agreedsentimentdisclaimerpolicy': SimpleResponse;
  'user/agreedtermsandconditions': SimpleResponse;
  'agreementDocument/deps': AgreementDocument[];
  'agreementDocument/item': AgreementDocument;
  'agreementDocument/items': AgreementDocument[];
  'agreementDocument/ldeps': AgreementDocument[];
  'agreementDocumentTemplate/create': AgreementDocumentTemplate;
  'agreementDocumentTemplate/find': AgreementDocumentTemplate;
  'agreementDocumentTemplate/item': AgreementDocumentTemplate;
  'agreementDocumentTemplate/items': AgreementDocumentTemplate[];
  'agreementDocumentTemplate/list': AgreementDocumentTemplate[];
  'agreementDocumentTemplate/suggest': AgreementDocumentTemplate[];
  'agreementDocumentTemplate/update': AgreementDocumentTemplate;
  'alert/deps': Alert[];
  'alert/item': Alert;
  'alert/items': Alert[];
  'alert/ldeps': Alert[];
  'alertSignal/deps': AlertSignal[];
  'alertSignal/item': AlertSignal;
  'alertSignal/items': AlertSignal[];
  'alertSignal/ldeps': AlertSignal[];
  'annualReview/deps': AnnualReview[];
  'annualReview/item': AnnualReview;
  'annualReview/items': AnnualReview[];
  'annualReview/ldeps': AnnualReview[];
  'autoLiqTransaction/deps': AutoLiqTransaction[];
  'autoLiqTransaction/item': AutoLiqTransaction;
  'autoLiqTransaction/items': AutoLiqTransaction[];
  'autoLiqTransaction/ldeps': AutoLiqTransaction[];
  'autoLiqTransaction/list': AutoLiqTransaction[];
  'user/calculateplanupgrade': PlanUpgradeResponse;
  'user/canceleverything': CancelEverythingResponse;
  'order/cancelorder': CommandResult;
  'userPlugin/cancelpluginautorenewal': EntitlementSubscriptionResponse;
  'user/canceltradovatesubscription': TradovateSubscriptionResponse;
  'cashBalance/deps': CashBalance[];
  'cashBalance/item': CashBalance;
  'cashBalance/items': CashBalance[];
  'cashBalance/ldeps': CashBalance[];
  'cashBalance/list': CashBalance[];
  'cashBalanceLog/deps': CashBalanceLog[];
  'cashBalanceLog/item': CashBalanceLog;
  'cashBalanceLog/items': CashBalanceLog[];
  'cashBalanceLog/ldeps': CashBalanceLog[];
  'categoryPositionLimit/deps': CategoryPositionLimit[];
  'categoryPositionLimit/item': CategoryPositionLimit;
  'categoryPositionLimit/items': CategoryPositionLimit[];
  'categoryPositionLimit/ldeps': CategoryPositionLimit[];
  'categoryRiskParameter/deps': CategoryRiskParameter[];
  'categoryRiskParameter/item': CategoryRiskParameter;
  'categoryRiskParameter/items': CategoryRiskParameter[];
  'categoryRiskParameter/ldeps': CategoryRiskParameter[];
  'userPlugin/changepluginpermission': SimpleResponse;
  'userProperty/changeuserproperty': SimpleResponse;
  'customerApplication/checkduplicate': SimpleResponse;
  'clearingHouse/find': ClearingHouse;
  'clearingHouse/item': ClearingHouse;
  'clearingHouse/items': ClearingHouse[];
  'clearingHouse/list': ClearingHouse[];
  'clearingHouse/suggest': ClearingHouse[];
  'clientApp/find': ClientApp;
  'clientApp/item': ClientApp;
  'clientApp/items': ClientApp[];
  'clientApp/list': ClientApp[];
  'clientApp/suggest': ClientApp[];
  'command/deps': Command[];
  'command/item': Command;
  'command/items': Command[];
  'command/ldeps': Command[];
  'command/list': Command[];
  'commandReport/deps': CommandReport[];
  'commandReport/item': CommandReport;
  'commandReport/items': CommandReport[];
  'commandReport/ldeps': CommandReport[];
  'commandReport/list': CommandReport[];
  'adminAlertSignal/completealertsignal': AdminAlertSignalResponse;
  'contactInfo/deps': ContactInfo[];
  'contactInfo/item': ContactInfo;
  'contactInfo/items': ContactInfo[];
  'contactInfo/ldeps': ContactInfo[];
  'contract/deps': Contract[];
  'contract/find': Contract;
  'contractGroup/find': ContractGroup;
  'contractGroup/item': ContractGroup;
  'contractGroup/items': ContractGroup[];
  'contractGroup/list': ContractGroup[];
  'contractGroup/suggest': ContractGroup[];
  'contract/item': Contract;
  'contract/items': Contract[];
  'contract/ldeps': Contract[];
  'contractMargin/deps': ContractMargin[];
  'contractMargin/item': ContractMargin;
  'contractMargin/items': ContractMargin[];
  'contractMargin/ldeps': ContractMargin[];
  'contractMaturity/deps': ContractMaturity[];
  'contractMaturity/item': ContractMaturity;
  'contractMaturity/items': ContractMaturity[];
  'contractMaturity/ldeps': ContractMaturity[];
  'contract/suggest': Contract[];
  'corporateApplicant/deps': CorporateApplicant[];
  'corporateApplicant/item': CorporateApplicant;
  'corporateApplicant/items': CorporateApplicant[];
  'corporateApplicant/ldeps': CorporateApplicant[];
  'corporateApplicant/list': CorporateApplicant[];
  'country/find': Country;
  'countries/countryisbanned': CountryIsBannedResponse;
  'country/item': Country;
  'country/items': Country[];
  'country/list': Country[];
  'country/suggest': Country[];
  'alert/createalert': AlertResponse;
  'user/createevaluationaccounts': CreateEvaluationAccountsResponse;
  'user/createevaluationusers': CreateEvaluationUsersResponse;
  'user/createnewtrial': SimpleResponse;
  'user/createtradingpermission': TradingPermissionResponse;
  'currency/find': Currency;
  'currency/item': Currency;
  'currency/items': Currency[];
  'currency/list': Currency[];
  'currencyRate/deps': CurrencyRate[];
  'currencyRate/item': CurrencyRate;
  'currencyRate/items': CurrencyRate[];
  'currencyRate/ldeps': CurrencyRate[];
  'currencyRate/list': CurrencyRate[];
  'currency/suggest': Currency[];
  'customerApplicationCheckState/deps': CustomerApplicationCheckState[];
  'customerApplicationCheckState/item': CustomerApplicationCheckState;
  'customerApplicationCheckState/items': CustomerApplicationCheckState[];
  'customerApplicationCheckState/ldeps': CustomerApplicationCheckState[];
  'customerApplicationCheckState/list': CustomerApplicationCheckState[];
  'customerApplication/create': CustomerApplication;
  'customerApplication/deps': CustomerApplication[];
  'customerApplicationDocument/deps': CustomerApplicationDocument[];
  'customerApplicationDocument/item': CustomerApplicationDocument;
  'customerApplicationDocument/items': CustomerApplicationDocument[];
  'customerApplicationDocument/ldeps': CustomerApplicationDocument[];
  'customerApplication/item': CustomerApplication;
  'customerApplication/items': CustomerApplication[];
  'customerApplication/ldeps': CustomerApplication[];
  'customerApplication/list': CustomerApplication[];
  'customerApplicationSigningState/deps': CustomerApplicationSigningState[];
  'customerApplicationSigningState/item': CustomerApplicationSigningState;
  'customerApplicationSigningState/items': CustomerApplicationSigningState[];
  'customerApplicationSigningState/ldeps': CustomerApplicationSigningState[];
  'customerApplicationSigningState/list': CustomerApplicationSigningState[];
  'customerApplication/update': CustomerApplication;
  'customerMarketingInfo/deps': CustomerMarketingInfo[];
  'customerMarketingInfo/item': CustomerMarketingInfo;
  'customerMarketingInfo/items': CustomerMarketingInfo[];
  'customerMarketingInfo/ldeps': CustomerMarketingInfo[];
  'alert/deletealert': AlertResponse;
  'userAccountPositionLimit/deleteuseraccountpositionlimit': DeleteResultResponse;
  'userAccountPositionLimit/deleteuseraccountriskparameter': DeleteResultResponse;
  'alert/dismissalert': AlertResponse;
  'agreementDocumentContent/downloadsubaccountrequestpreview': SubAccountRequestPreviewResponse;
  'agreementDocumentContent/downloaduserdocumentpreview': DownloadUserDocumentPreviewResponse;
  'userCertification/downloadw8certificationdocument': CertificationContentResponse;
  'order/dryrun': DryRunResponse;
  'emergencyRisk/deps': EmergencyRisk[];
  'emergencyRisk/item': EmergencyRisk;
  'emergencyRisk/items': EmergencyRisk[];
  'emergencyRisk/ldeps': EmergencyRisk[];
  'emergencyRisk/list': EmergencyRisk[];
  'entitlement/item': Entitlement;
  'entitlement/items': Entitlement[];
  'entitlement/list': Entitlement[];
  'fee/evaluatefillfee': EvaluateFillFeeResponse;
  'exchange/find': Exchange;
  'exchange/item': Exchange;
  'exchange/items': Exchange[];
  'exchange/list': Exchange[];
  'exchange/suggest': Exchange[];
  'executionReport/deps': ExecutionReport[];
  'executionReport/find': ExecutionReport;
  'executionReport/item': ExecutionReport;
  'executionReport/items': ExecutionReport[];
  'executionReport/ldeps': ExecutionReport[];
  'executionReport/list': ExecutionReport[];
  'fee/item': Fee;
  'fee/items': Fee[];
  'fee/list': Fee[];
  'fill/deps': Fill[];
  'fillFee/deps': FillFee[];
  'fillFee/item': FillFee;
  'fillFee/items': FillFee[];
  'fillFee/ldeps': FillFee[];
  'fillFee/list': FillFee[];
  'fill/item': Fill;
  'fill/items': Fill[];
  'fill/ldeps': Fill[];
  'fill/list': Fill[];
  'fillPair/deps': FillPair[];
  'fillPair/item': FillPair;
  'fillPair/items': FillPair[];
  'fillPair/ldeps': FillPair[];
  'fillPair/list': FillPair[];
  'fundTransaction/deps': FundTransaction[];
  'fundTransaction/item': FundTransaction;
  'fundTransaction/items': FundTransaction[];
  'fundTransaction/ldeps': FundTransaction[];
  'fundTransaction/list': FundTransaction[];
  'user/getaccounttradingpermissions': TradingPermissionsResponse;
  'agreementDocumentContent/getagreementdocument': DocumentContentResponse;
  'cashBalance/getcashbalancesnapshot': CashBalanceSnapshot;
  'customerApplication/getcurrentannualreviewinfo': CurrentAnnualReviewInfoResponse;
  'userPlugin/getentitlementeligibilityinfo': EligibilityInfoResponse;
  'contract/geteventproducts': EventProductsResponse;
  'user/getfundingoptions': FundingOptionsResponse;
  'agreementDocumentContent/getlocalizedagreementdocument': DocumentContentResponse;
  'contract/getoptionschain': OptionsChainResponse;
  'user/getprocessingfee': ProcessingFee;
  'markets/getproduct': ProductDetails;
  'contract/getproductfeeparams': ProductFeeParamsResponse;
  'support/gettimestamp': TimestampResponse;
  'userSignedDocumentContent/getusersigneddocument': DocumentContentResponse;
  'individualApplicant/deps': IndividualApplicant[];
  'individualApplicant/item': IndividualApplicant;
  'individualApplicant/items': IndividualApplicant[];
  'individualApplicant/ldeps': IndividualApplicant[];
  'individualApplicant/list': IndividualApplicant[];
  'orderStrategy/interruptorderstrategy': OrderStrategyStatusResponse;
  'jointApplicant/deps': JointApplicant[];
  'jointApplicant/item': JointApplicant;
  'jointApplicant/items': JointApplicant[];
  'jointApplicant/ldeps': JointApplicant[];
  'jointApplicant/list': JointApplicant[];
  'order/liquidateposition': PlaceOrderResult;
  'order/liquidatepositions': SimpleResponse;
  'marginSnapshot/deps': MarginSnapshot[];
  'marginSnapshot/item': MarginSnapshot;
  'marginSnapshot/items': MarginSnapshot[];
  'marginSnapshot/ldeps': MarginSnapshot[];
  'marginSnapshot/list': MarginSnapshot[];
  'alert/markreadalertsignal': AlertResponse;
  'marketDataSubscription/create': MarketDataSubscription;
  'marketDataSubscription/deps': MarketDataSubscription[];
  'marketDataSubscriptionExchangeScope/find': MarketDataSubscriptionExchangeScope;
  'marketDataSubscriptionExchangeScope/item': MarketDataSubscriptionExchangeScope;
  'marketDataSubscriptionExchangeScope/items': MarketDataSubscriptionExchangeScope[];
  'marketDataSubscriptionExchangeScope/list': MarketDataSubscriptionExchangeScope[];
  'marketDataSubscriptionExchangeScope/suggest': MarketDataSubscriptionExchangeScope[];
  'marketDataSubscription/item': MarketDataSubscription;
  'marketDataSubscription/items': MarketDataSubscription[];
  'marketDataSubscription/ldeps': MarketDataSubscription[];
  'marketDataSubscription/list': MarketDataSubscription[];
  'marketDataSubscriptionPlan/find': MarketDataSubscriptionPlan;
  'marketDataSubscriptionPlan/item': MarketDataSubscriptionPlan;
  'marketDataSubscriptionPlan/items': MarketDataSubscriptionPlan[];
  'marketDataSubscriptionPlan/list': MarketDataSubscriptionPlan[];
  'marketDataSubscriptionPlan/suggest': MarketDataSubscriptionPlan[];
  'marketDataSubscription/update': MarketDataSubscription;
  'auth/me': OAuthMeResponse;
  'alert/modifyalert': AlertResponse;
  'user/modifycredentials': AccessTokenResponse;
  'user/modifyemailaddress': UserStatusMessage;
  'order/modifyorder': CommandResult;
  'orderStrategy/modifyorderstrategy': OrderStrategyStatusResponse;
  'user/modifypassword': AccessTokenResponse;
  'auth/oauthtoken': OAuthTokenResponse;
  'user/opendemoaccount': OpenDemoAccountResponse;
  'order/deps': Order[];
  'order/item': Order;
  'order/items': Order[];
  'order/ldeps': Order[];
  'order/list': Order[];
  'orderStrategy/deps': OrderStrategy[];
  'orderStrategy/item': OrderStrategy;
  'orderStrategy/items': OrderStrategy[];
  'orderStrategy/ldeps': OrderStrategy[];
  'orderStrategyLink/deps': OrderStrategyLink[];
  'orderStrategyLink/item': OrderStrategyLink;
  'orderStrategyLink/items': OrderStrategyLink[];
  'orderStrategyLink/ldeps': OrderStrategyLink[];
  'orderStrategyLink/list': OrderStrategyLink[];
  'orderStrategy/list': OrderStrategy[];
  'orderStrategyType/find': OrderStrategyType;
  'orderStrategyType/item': OrderStrategyType;
  'orderStrategyType/items': OrderStrategyType[];
  'orderStrategyType/list': OrderStrategyType[];
  'orderStrategyType/suggest': OrderStrategyType[];
  'orderVersion/deps': OrderVersion[];
  'orderVersion/item': OrderVersion;
  'orderVersion/items': OrderVersion[];
  'orderVersion/ldeps': OrderVersion[];
  'orderVersion/list': OrderVersion[];
  'organization/find': Organization;
  'organization/item': Organization;
  'organization/items': Organization[];
  'organization/list': Organization[];
  'organization/suggest': Organization[];
  'permissionedAccountAutoLiq/deps': PermissionedAccountAutoLiq[];
  'permissionedAccountAutoLiq/item': PermissionedAccountAutoLiq;
  'permissionedAccountAutoLiq/items': PermissionedAccountAutoLiq[];
  'permissionedAccountAutoLiq/ldeps': PermissionedAccountAutoLiq[];
  'permissionedAccountAutoLiq/list': PermissionedAccountAutoLiq[];
  'order/placeoco': PlaceOcoResult;
  'order/placeoso': PlaceOsoResult;
  'order/placeorder': PlaceOrderResult;
  'position/deps': Position[];
  'position/find': Position;
  'position/item': Position;
  'position/items': Position[];
  'position/ldeps': Position[];
  'position/list': Position[];
  'positionLog/deps': PositionLog[];
  'positionLog/item': PositionLog;
  'positionLog/items': PositionLog[];
  'positionLog/ldeps': PositionLog[];
  'customerApplication/prepareagreementdocuments': AgreementDocumentsResponse;
  'product/deps': Product[];
  'product/find': Product;
  'product/item': Product;
  'product/items': Product[];
  'product/ldeps': Product[];
  'product/list': Product[];
  'productMargin/deps': ProductMargin[];
  'productMargin/item': ProductMargin;
  'productMargin/items': ProductMargin[];
  'productMargin/ldeps': ProductMargin[];
  'productMargin/list': ProductMargin[];
  'productSession/deps': ProductSession[];
  'productSession/item': ProductSession;
  'productSession/items': ProductSession[];
  'productSession/ldeps': ProductSession[];
  'product/suggest': Product[];
  'markets/products': ProductList;
  'property/find': Property;
  'property/item': Property;
  'property/items': Property[];
  'property/list': Property[];
  'property/suggest': Property[];
  'userCertification/pulseliveoptout': PulseLiveOptOutResponse;
  'auth/renewaccesstoken': AccessTokenResponse;
  'user/requesttradingpermission': TradingPermissionResponse;
  'alert/resetalert': AlertResponse;
  'accountRiskStatus/resetautoliqstatus': AccountRiskStatusResponse;
  'account/resetdemoaccountstate': SimpleResponse;
  'user/revoketradingpermission': TradingPermissionResponse;
  'user/revoketradingpermissions': SimpleResponse;
  'riskCategory/find': RiskCategory;
  'riskCategory/item': RiskCategory;
  'riskCategory/items': RiskCategory[];
  'riskCategory/list': RiskCategory[];
  'riskCategory/suggest': RiskCategory[];
  'riskDiscountContractGroup/find': RiskDiscountContractGroup;
  'riskDiscountContractGroup/item': RiskDiscountContractGroup;
  'riskDiscountContractGroup/items': RiskDiscountContractGroup[];
  'riskDiscountContractGroup/list': RiskDiscountContractGroup[];
  'riskDiscountContractGroup/suggest': RiskDiscountContractGroup[];
  'riskTimePeriod/find': RiskTimePeriod;
  'riskTimePeriod/item': RiskTimePeriod;
  'riskTimePeriod/items': RiskTimePeriod[];
  'riskTimePeriod/list': RiskTimePeriod[];
  'riskTimePeriod/suggest': RiskTimePeriod[];
  'contract/rollcontract': RollContractResponse;
  'contract/rollcontracts': RollContractsResponse;
  'markets/search': ProductList;
  'secondMarketDataSubscription/deps': SecondMarketDataSubscription[];
  'secondMarketDataSubscription/item': SecondMarketDataSubscription;
  'secondMarketDataSubscription/items': SecondMarketDataSubscription[];
  'secondMarketDataSubscription/ldeps': SecondMarketDataSubscription[];
  'secondMarketDataSubscription/list': SecondMarketDataSubscription[];
  'user/sendnotifyadminalert': SimpleResponse;
  'accountRiskStatus/setaccountnotes': SimpleResponse;
  'accountRiskStatus/setadminautoliqaction': AccountRiskStatusResponse;
  'accountRiskStatus/setdemohalt': SimpleResponse;
  'customerApplication/signagreementdocuments': AgreementDocumentsResponse;
  'customerApplication/signnonprocertification': AgreementDocumentsResponse;
  'customerApplication/signsubaccountrequest': AgreementDocumentsResponse;
  'user/signuporganizationmember': SignUpResponse;
  'customerApplication/signuserdocument': AgreementDocumentsResponse;
  'userCertification/signw8': SignW8Response;
  'spreadDefinition/item': SpreadDefinition;
  'spreadDefinition/items': SpreadDefinition[];
  'customerApplication/startcustomerapplication': CustomerApplicationResponse;
  'orderStrategy/startorderstrategy': OrderStrategyStatusResponse;
  'subAccountRequest/deps': SubAccountRequest[];
  'subAccountRequest/item': SubAccountRequest;
  'subAccountRequest/items': SubAccountRequest[];
  'subAccountRequest/ldeps': SubAccountRequest[];
  'subAccountRequest/list': SubAccountRequest[];
  'customerApplication/submitannualreview': SubmitAnnualReviewResponse;
  'customerApplication/submitapplicant': ApplicantResponse;
  'customerApplication/submitcustomerapplicationdocument': SimpleResponse;
  'accountRiskStatus/switchriskcategory': SimpleResponse;
  'user/switchtoprofessional': SimpleResponse;
  'user/syncrequest': SyncMessage;
  'adminAlertSignal/takealertsignalownership': AdminAlertSignalResponse;
  'userCertification/thirdpartydatasharing': ThirdPartyDataSharingResponse;
  'tradingPermissionConsent/deps': TradingPermissionConsent[];
  'tradingPermissionConsent/item': TradingPermissionConsent;
  'tradingPermissionConsent/items': TradingPermissionConsent[];
  'tradingPermissionConsent/ldeps': TradingPermissionConsent[];
  'tradingPermissionConsent/list': TradingPermissionConsent[];
  'tradingPermission/deps': TradingPermission[];
  'tradingPermission/item': TradingPermission;
  'tradingPermission/items': TradingPermission[];
  'tradingPermission/ldeps': TradingPermission[];
  'tradingPermission/list': TradingPermission[];
  'tradingSession/deps': TradingSession[];
  'tradingSession/item': TradingSession;
  'tradingSession/items': TradingSession[];
  'tradingSession/ldeps': TradingSession[];
  'tradovateSubscription/create': TradovateSubscription;
  'tradovateSubscription/deps': TradovateSubscription[];
  'tradovateSubscription/item': TradovateSubscription;
  'tradovateSubscription/items': TradovateSubscription[];
  'tradovateSubscription/ldeps': TradovateSubscription[];
  'tradovateSubscription/list': TradovateSubscription[];
  'tradovateSubscriptionPlan/find': TradovateSubscriptionPlan;
  'tradovateSubscriptionPlan/item': TradovateSubscriptionPlan;
  'tradovateSubscriptionPlan/items': TradovateSubscriptionPlan[];
  'tradovateSubscriptionPlan/list': TradovateSubscriptionPlan[];
  'tradovateSubscriptionPlan/suggest': TradovateSubscriptionPlan[];
  'tradovateSubscription/update': TradovateSubscription;
  'contactInfo/updatecontactinfo': UpdateContactInfoResponse;
  'contactInfo/updatecontactinfoname': UpdateContactInfoResponse;
  'accountRiskStatus/updatemaxnetliq': AccountRiskStatusResponse;
  'userAccountAutoLiq/updateuserautoliq': UpdateUserAutoLiqResponse;
  'userAccountAutoLiq/create': UserAccountAutoLiq;
  'userAccountAutoLiq/deps': UserAccountAutoLiq[];
  'userAccountAutoLiq/item': UserAccountAutoLiq;
  'userAccountAutoLiq/items': UserAccountAutoLiq[];
  'userAccountAutoLiq/ldeps': UserAccountAutoLiq[];
  'userAccountAutoLiq/list': UserAccountAutoLiq[];
  'userAccountAutoLiq/update': UserAccountAutoLiq;
  'userAccountPositionLimit/create': UserAccountPositionLimit;
  'userAccountPositionLimit/deps': UserAccountPositionLimit[];
  'userAccountPositionLimit/item': UserAccountPositionLimit;
  'userAccountPositionLimit/items': UserAccountPositionLimit[];
  'userAccountPositionLimit/ldeps': UserAccountPositionLimit[];
  'userAccountPositionLimit/update': UserAccountPositionLimit;
  'userAccountRiskParameter/create': UserAccountRiskParameter;
  'userAccountRiskParameter/deps': UserAccountRiskParameter[];
  'userAccountRiskParameter/item': UserAccountRiskParameter;
  'userAccountRiskParameter/items': UserAccountRiskParameter[];
  'userAccountRiskParameter/ldeps': UserAccountRiskParameter[];
  'userAccountRiskParameter/update': UserAccountRiskParameter;
  'userCertification/deps': UserCertification[];
  'userCertification/item': UserCertification;
  'userCertification/items': UserCertification[];
  'userCertification/ldeps': UserCertification[];
  'userDevice/deps': UserDevice[];
  'userDevice/item': UserDevice;
  'userDevice/items': UserDevice[];
  'userDevice/ldeps': UserDevice[];
  'user/find': User;
  'user/item': User;
  'user/items': User[];
  'user/list': User[];
  'userPlugin/create': UserPlugin;
  'userPlugin/deps': UserPlugin[];
  'userPlugin/item': UserPlugin;
  'userPlugin/items': UserPlugin[];
  'userPlugin/ldeps': UserPlugin[];
  'userPlugin/list': UserPlugin[];
  'userPlugin/update': UserPlugin;
  'userPromoCode/deps': UserPromoCode[];
  'userPromoCode/item': UserPromoCode;
  'userPromoCode/items': UserPromoCode[];
  'userPromoCode/ldeps': UserPromoCode[];
  'userProperty/deps': UserProperty[];
  'userProperty/item': UserProperty;
  'userProperty/items': UserProperty[];
  'userProperty/ldeps': UserProperty[];
  'userReadStatus/deps': UserReadStatus[];
  'userReadStatus/item': UserReadStatus;
  'userReadStatus/items': UserReadStatus[];
  'userReadStatus/ldeps': UserReadStatus[];
  'userReadStatus/list': UserReadStatus[];
  'userSession/item': UserSession;
  'userSession/items': UserSession[];
  'userSessionStats/deps': UserSessionStats[];
  'userSessionStats/item': UserSessionStats;
  'userSessionStats/items': UserSessionStats[];
  'userSessionStats/ldeps': UserSessionStats[];
  'userSessionStats/list': UserSessionStats[];
  'userSignedDocument/deps': UserSignedDocument[];
  'userSignedDocument/item': UserSignedDocument;
  'userSignedDocument/items': UserSignedDocument[];
  'userSignedDocument/ldeps': UserSignedDocument[];
  'user/suggest': User[];
  'fundTransaction/wallettransfer': FundTransactionResponse;
  'cashBalance/changeDemoBalance': CashBalance;
  'replay/changespeed': SimpleResponse;
  'replay/checkreplaysession': CheckReplaySessionResponse;
  'replay/initializeclock': SimpleResponse;
  'user/activatesecondmarketdatasubscriptionrenewal': SecondMarketDataSubscriptionResponse;
  'user/addsecondmarketdatasubscription': SecondMarketDataSubscriptionResponse;
  'user/cancelsecondmarketdatasubscription': SecondMarketDataSubscriptionResponse;
  'user/cancelsecondmarketdatasubscriptionrenewal': SecondMarketDataSubscriptionResponse;
  'user/getsecondmarketdatasubscriptioncost': SecondMarketDataSubscriptionCostResponse;
  'fundTransaction/checkstripefundingeligibility': CheckStripeFundingEligibilityResponse;
  'chat/closechat': ChatResponse;
  'chat/deps': Chat[];
  'chat/item': Chat;
  'chat/items': Chat[];
  'chat/ldeps': Chat[];
  'chat/list': Chat[];
  'chat/markasreadchatmessage': ChatMessageResponse;
  'chat/postchatmessage': ChatMessageResponse;
  'chatMessage/deps': ChatMessage[];
  'chatMessage/item': ChatMessage;
  'chatMessage/items': ChatMessage[];
  'chatMessage/ldeps': ChatMessage[];
  'md/subscribeQuote': any;
  'md/unsubscribeQuote': any;
  'md/subscribeDOM': any;
  'md/unsubscribeDOM': any;
  'md/subscribeHistogram': any;
  'md/unsubscribeHistogram': any;
  'md/getChart': any;
  'md/cancelChart': any;
  authorize: any;
}
export interface UrlOutMap {
  'user/accepttradingpermission': PostRequest;
  'auth/accesstokenrequest': PostRequest;
  'account/deps': GetRequest;
  'account/find': GetRequest;
  'account/item': GetRequest;
  'account/items': GetRequest;
  'account/ldeps': GetRequest;
  'account/list': GetRequest;
  'accountRiskStatus/deps': GetRequest;
  'accountRiskStatus/item': GetRequest;
  'accountRiskStatus/items': GetRequest;
  'accountRiskStatus/ldeps': GetRequest;
  'accountRiskStatus/list': GetRequest;
  'accountRiskStatusLog/deps': GetRequest;
  'accountRiskStatusLog/item': GetRequest;
  'accountRiskStatusLog/items': GetRequest;
  'accountRiskStatusLog/ldeps': GetRequest;
  'account/suggest': GetRequest;
  'userPlugin/addentitlementsubscription': PostRequest;
  'user/addmarketdatasubscription': PostRequest;
  'user/addtradovatesubscription': PostRequest;
  'adminAlert/find': GetRequest;
  'adminAlert/item': GetRequest;
  'adminAlert/items': GetRequest;
  'adminAlert/list': GetRequest;
  'adminAlertSignal/deps': GetRequest;
  'adminAlertSignal/item': GetRequest;
  'adminAlertSignal/items': GetRequest;
  'adminAlertSignal/ldeps': GetRequest;
  'adminAlertSignal/list': GetRequest;
  'adminAlert/suggest': GetRequest;
  'user/agreedliquidationpolicy': PostRequest;
  'user/agreedsentimentdisclaimerpolicy': PostRequest;
  'user/agreedtermsandconditions': PostRequest;
  'agreementDocument/deps': GetRequest;
  'agreementDocument/item': GetRequest;
  'agreementDocument/items': GetRequest;
  'agreementDocument/ldeps': GetRequest;
  'agreementDocumentTemplate/create': PostRequest;
  'agreementDocumentTemplate/find': GetRequest;
  'agreementDocumentTemplate/item': GetRequest;
  'agreementDocumentTemplate/items': GetRequest;
  'agreementDocumentTemplate/list': GetRequest;
  'agreementDocumentTemplate/suggest': GetRequest;
  'agreementDocumentTemplate/update': PostRequest;
  'alert/deps': GetRequest;
  'alert/item': GetRequest;
  'alert/items': GetRequest;
  'alert/ldeps': GetRequest;
  'alertSignal/deps': GetRequest;
  'alertSignal/item': GetRequest;
  'alertSignal/items': GetRequest;
  'alertSignal/ldeps': GetRequest;
  'annualReview/deps': GetRequest;
  'annualReview/item': GetRequest;
  'annualReview/items': GetRequest;
  'annualReview/ldeps': GetRequest;
  'autoLiqTransaction/deps': GetRequest;
  'autoLiqTransaction/item': GetRequest;
  'autoLiqTransaction/items': GetRequest;
  'autoLiqTransaction/ldeps': GetRequest;
  'autoLiqTransaction/list': GetRequest;
  'user/calculateplanupgrade': PostRequest;
  'user/canceleverything': PostRequest;
  'order/cancelorder': PostRequest;
  'userPlugin/cancelpluginautorenewal': PostRequest;
  'user/canceltradovatesubscription': PostRequest;
  'cashBalance/deps': GetRequest;
  'cashBalance/item': GetRequest;
  'cashBalance/items': GetRequest;
  'cashBalance/ldeps': GetRequest;
  'cashBalance/list': GetRequest;
  'cashBalanceLog/deps': GetRequest;
  'cashBalanceLog/item': GetRequest;
  'cashBalanceLog/items': GetRequest;
  'cashBalanceLog/ldeps': GetRequest;
  'categoryPositionLimit/deps': GetRequest;
  'categoryPositionLimit/item': GetRequest;
  'categoryPositionLimit/items': GetRequest;
  'categoryPositionLimit/ldeps': GetRequest;
  'categoryRiskParameter/deps': GetRequest;
  'categoryRiskParameter/item': GetRequest;
  'categoryRiskParameter/items': GetRequest;
  'categoryRiskParameter/ldeps': GetRequest;
  'userPlugin/changepluginpermission': PostRequest;
  'userProperty/changeuserproperty': PostRequest;
  'customerApplication/checkduplicate': PostRequest;
  'clearingHouse/find': GetRequest;
  'clearingHouse/item': GetRequest;
  'clearingHouse/items': GetRequest;
  'clearingHouse/list': GetRequest;
  'clearingHouse/suggest': GetRequest;
  'clientApp/find': GetRequest;
  'clientApp/item': GetRequest;
  'clientApp/items': GetRequest;
  'clientApp/list': GetRequest;
  'clientApp/suggest': GetRequest;
  'command/deps': GetRequest;
  'command/item': GetRequest;
  'command/items': GetRequest;
  'command/ldeps': GetRequest;
  'command/list': GetRequest;
  'commandReport/deps': GetRequest;
  'commandReport/item': GetRequest;
  'commandReport/items': GetRequest;
  'commandReport/ldeps': GetRequest;
  'commandReport/list': GetRequest;
  'adminAlertSignal/completealertsignal': PostRequest;
  'contactInfo/deps': GetRequest;
  'contactInfo/item': GetRequest;
  'contactInfo/items': GetRequest;
  'contactInfo/ldeps': GetRequest;
  'contract/deps': GetRequest;
  'contract/find': GetRequest;
  'contractGroup/find': GetRequest;
  'contractGroup/item': GetRequest;
  'contractGroup/items': GetRequest;
  'contractGroup/list': GetRequest;
  'contractGroup/suggest': GetRequest;
  'contract/item': GetRequest;
  'contract/items': GetRequest;
  'contract/ldeps': GetRequest;
  'contractMargin/deps': GetRequest;
  'contractMargin/item': GetRequest;
  'contractMargin/items': GetRequest;
  'contractMargin/ldeps': GetRequest;
  'contractMaturity/deps': GetRequest;
  'contractMaturity/item': GetRequest;
  'contractMaturity/items': GetRequest;
  'contractMaturity/ldeps': GetRequest;
  'contract/suggest': GetRequest;
  'corporateApplicant/deps': GetRequest;
  'corporateApplicant/item': GetRequest;
  'corporateApplicant/items': GetRequest;
  'corporateApplicant/ldeps': GetRequest;
  'corporateApplicant/list': GetRequest;
  'country/find': GetRequest;
  'countries/countryisbanned': PostRequest;
  'country/item': GetRequest;
  'country/items': GetRequest;
  'country/list': GetRequest;
  'country/suggest': GetRequest;
  'alert/createalert': PostRequest;
  'user/createevaluationaccounts': PostRequest;
  'user/createevaluationusers': PostRequest;
  'user/createnewtrial': GetRequest;
  'user/createtradingpermission': PostRequest;
  'currency/find': GetRequest;
  'currency/item': GetRequest;
  'currency/items': GetRequest;
  'currency/list': GetRequest;
  'currencyRate/deps': GetRequest;
  'currencyRate/item': GetRequest;
  'currencyRate/items': GetRequest;
  'currencyRate/ldeps': GetRequest;
  'currencyRate/list': GetRequest;
  'currency/suggest': GetRequest;
  'customerApplicationCheckState/deps': GetRequest;
  'customerApplicationCheckState/item': GetRequest;
  'customerApplicationCheckState/items': GetRequest;
  'customerApplicationCheckState/ldeps': GetRequest;
  'customerApplicationCheckState/list': GetRequest;
  'customerApplication/create': PostRequest;
  'customerApplication/deps': GetRequest;
  'customerApplicationDocument/deps': GetRequest;
  'customerApplicationDocument/item': GetRequest;
  'customerApplicationDocument/items': GetRequest;
  'customerApplicationDocument/ldeps': GetRequest;
  'customerApplication/item': GetRequest;
  'customerApplication/items': GetRequest;
  'customerApplication/ldeps': GetRequest;
  'customerApplication/list': GetRequest;
  'customerApplicationSigningState/deps': GetRequest;
  'customerApplicationSigningState/item': GetRequest;
  'customerApplicationSigningState/items': GetRequest;
  'customerApplicationSigningState/ldeps': GetRequest;
  'customerApplicationSigningState/list': GetRequest;
  'customerApplication/update': PostRequest;
  'customerMarketingInfo/deps': GetRequest;
  'customerMarketingInfo/item': GetRequest;
  'customerMarketingInfo/items': GetRequest;
  'customerMarketingInfo/ldeps': GetRequest;
  'alert/deletealert': PostRequest;
  'userAccountPositionLimit/deleteuseraccountpositionlimit': PostRequest;
  'userAccountPositionLimit/deleteuseraccountriskparameter': PostRequest;
  'alert/dismissalert': PostRequest;
  'agreementDocumentContent/downloadsubaccountrequestpreview': PostRequest;
  'agreementDocumentContent/downloaduserdocumentpreview': PostRequest;
  'userCertification/downloadw8certificationdocument': GetRequest;
  'order/dryrun': PostRequest;
  'emergencyRisk/deps': GetRequest;
  'emergencyRisk/item': GetRequest;
  'emergencyRisk/items': GetRequest;
  'emergencyRisk/ldeps': GetRequest;
  'emergencyRisk/list': GetRequest;
  'entitlement/item': GetRequest;
  'entitlement/items': GetRequest;
  'entitlement/list': GetRequest;
  'fee/evaluatefillfee': PostRequest;
  'exchange/find': GetRequest;
  'exchange/item': GetRequest;
  'exchange/items': GetRequest;
  'exchange/list': GetRequest;
  'exchange/suggest': GetRequest;
  'executionReport/deps': GetRequest;
  'executionReport/find': GetRequest;
  'executionReport/item': GetRequest;
  'executionReport/items': GetRequest;
  'executionReport/ldeps': GetRequest;
  'executionReport/list': GetRequest;
  'fee/item': GetRequest;
  'fee/items': GetRequest;
  'fee/list': GetRequest;
  'fill/deps': GetRequest;
  'fillFee/deps': GetRequest;
  'fillFee/item': GetRequest;
  'fillFee/items': GetRequest;
  'fillFee/ldeps': GetRequest;
  'fillFee/list': GetRequest;
  'fill/item': GetRequest;
  'fill/items': GetRequest;
  'fill/ldeps': GetRequest;
  'fill/list': GetRequest;
  'fillPair/deps': GetRequest;
  'fillPair/item': GetRequest;
  'fillPair/items': GetRequest;
  'fillPair/ldeps': GetRequest;
  'fillPair/list': GetRequest;
  'fundTransaction/deps': GetRequest;
  'fundTransaction/item': GetRequest;
  'fundTransaction/items': GetRequest;
  'fundTransaction/ldeps': GetRequest;
  'fundTransaction/list': GetRequest;
  'user/getaccounttradingpermissions': PostRequest;
  'agreementDocumentContent/getagreementdocument': PostRequest;
  'cashBalance/getcashbalancesnapshot': PostRequest;
  'customerApplication/getcurrentannualreviewinfo': PostRequest;
  'userPlugin/getentitlementeligibilityinfo': PostRequest;
  'contract/geteventproducts': GetRequest;
  'user/getfundingoptions': PostRequest;
  'agreementDocumentContent/getlocalizedagreementdocument': PostRequest;
  'contract/getoptionschain': PostRequest;
  'user/getprocessingfee': PostRequest;
  'markets/getproduct': PostRequest;
  'contract/getproductfeeparams': PostRequest;
  'support/gettimestamp': GetRequest;
  'userSignedDocumentContent/getusersigneddocument': PostRequest;
  'individualApplicant/deps': GetRequest;
  'individualApplicant/item': GetRequest;
  'individualApplicant/items': GetRequest;
  'individualApplicant/ldeps': GetRequest;
  'individualApplicant/list': GetRequest;
  'orderStrategy/interruptorderstrategy': PostRequest;
  'jointApplicant/deps': GetRequest;
  'jointApplicant/item': GetRequest;
  'jointApplicant/items': GetRequest;
  'jointApplicant/ldeps': GetRequest;
  'jointApplicant/list': GetRequest;
  'order/liquidateposition': PostRequest;
  'order/liquidatepositions': PostRequest;
  'marginSnapshot/deps': GetRequest;
  'marginSnapshot/item': GetRequest;
  'marginSnapshot/items': GetRequest;
  'marginSnapshot/ldeps': GetRequest;
  'marginSnapshot/list': GetRequest;
  'alert/markreadalertsignal': PostRequest;
  'marketDataSubscription/create': PostRequest;
  'marketDataSubscription/deps': GetRequest;
  'marketDataSubscriptionExchangeScope/find': GetRequest;
  'marketDataSubscriptionExchangeScope/item': GetRequest;
  'marketDataSubscriptionExchangeScope/items': GetRequest;
  'marketDataSubscriptionExchangeScope/list': GetRequest;
  'marketDataSubscriptionExchangeScope/suggest': GetRequest;
  'marketDataSubscription/item': GetRequest;
  'marketDataSubscription/items': GetRequest;
  'marketDataSubscription/ldeps': GetRequest;
  'marketDataSubscription/list': GetRequest;
  'marketDataSubscriptionPlan/find': GetRequest;
  'marketDataSubscriptionPlan/item': GetRequest;
  'marketDataSubscriptionPlan/items': GetRequest;
  'marketDataSubscriptionPlan/list': GetRequest;
  'marketDataSubscriptionPlan/suggest': GetRequest;
  'marketDataSubscription/update': PostRequest;
  'auth/me': GetRequest;
  'alert/modifyalert': PostRequest;
  'user/modifycredentials': PostRequest;
  'user/modifyemailaddress': PostRequest;
  'order/modifyorder': PostRequest;
  'orderStrategy/modifyorderstrategy': PostRequest;
  'user/modifypassword': PostRequest;
  'auth/oauthtoken': PostRequest;
  'user/opendemoaccount': PostRequest;
  'order/deps': GetRequest;
  'order/item': GetRequest;
  'order/items': GetRequest;
  'order/ldeps': GetRequest;
  'order/list': GetRequest;
  'orderStrategy/deps': GetRequest;
  'orderStrategy/item': GetRequest;
  'orderStrategy/items': GetRequest;
  'orderStrategy/ldeps': GetRequest;
  'orderStrategyLink/deps': GetRequest;
  'orderStrategyLink/item': GetRequest;
  'orderStrategyLink/items': GetRequest;
  'orderStrategyLink/ldeps': GetRequest;
  'orderStrategyLink/list': GetRequest;
  'orderStrategy/list': GetRequest;
  'orderStrategyType/find': GetRequest;
  'orderStrategyType/item': GetRequest;
  'orderStrategyType/items': GetRequest;
  'orderStrategyType/list': GetRequest;
  'orderStrategyType/suggest': GetRequest;
  'orderVersion/deps': GetRequest;
  'orderVersion/item': GetRequest;
  'orderVersion/items': GetRequest;
  'orderVersion/ldeps': GetRequest;
  'orderVersion/list': GetRequest;
  'organization/find': GetRequest;
  'organization/item': GetRequest;
  'organization/items': GetRequest;
  'organization/list': GetRequest;
  'organization/suggest': GetRequest;
  'permissionedAccountAutoLiq/deps': GetRequest;
  'permissionedAccountAutoLiq/item': GetRequest;
  'permissionedAccountAutoLiq/items': GetRequest;
  'permissionedAccountAutoLiq/ldeps': GetRequest;
  'permissionedAccountAutoLiq/list': GetRequest;
  'order/placeoco': PostRequest;
  'order/placeoso': PostRequest;
  'order/placeorder': PostRequest;
  'position/deps': GetRequest;
  'position/find': GetRequest;
  'position/item': GetRequest;
  'position/items': GetRequest;
  'position/ldeps': GetRequest;
  'position/list': GetRequest;
  'positionLog/deps': GetRequest;
  'positionLog/item': GetRequest;
  'positionLog/items': GetRequest;
  'positionLog/ldeps': GetRequest;
  'customerApplication/prepareagreementdocuments': PostRequest;
  'product/deps': GetRequest;
  'product/find': GetRequest;
  'product/item': GetRequest;
  'product/items': GetRequest;
  'product/ldeps': GetRequest;
  'product/list': GetRequest;
  'productMargin/deps': GetRequest;
  'productMargin/item': GetRequest;
  'productMargin/items': GetRequest;
  'productMargin/ldeps': GetRequest;
  'productMargin/list': GetRequest;
  'productSession/deps': GetRequest;
  'productSession/item': GetRequest;
  'productSession/items': GetRequest;
  'productSession/ldeps': GetRequest;
  'product/suggest': GetRequest;
  'markets/products': GetRequest;
  'property/find': GetRequest;
  'property/item': GetRequest;
  'property/items': GetRequest;
  'property/list': GetRequest;
  'property/suggest': GetRequest;
  'userCertification/pulseliveoptout': PostRequest;
  'auth/renewaccesstoken': GetRequest;
  'user/requesttradingpermission': PostRequest;
  'alert/resetalert': PostRequest;
  'accountRiskStatus/resetautoliqstatus': PostRequest;
  'account/resetdemoaccountstate': PostRequest;
  'user/revoketradingpermission': PostRequest;
  'user/revoketradingpermissions': PostRequest;
  'riskCategory/find': GetRequest;
  'riskCategory/item': GetRequest;
  'riskCategory/items': GetRequest;
  'riskCategory/list': GetRequest;
  'riskCategory/suggest': GetRequest;
  'riskDiscountContractGroup/find': GetRequest;
  'riskDiscountContractGroup/item': GetRequest;
  'riskDiscountContractGroup/items': GetRequest;
  'riskDiscountContractGroup/list': GetRequest;
  'riskDiscountContractGroup/suggest': GetRequest;
  'riskTimePeriod/find': GetRequest;
  'riskTimePeriod/item': GetRequest;
  'riskTimePeriod/items': GetRequest;
  'riskTimePeriod/list': GetRequest;
  'riskTimePeriod/suggest': GetRequest;
  'contract/rollcontract': PostRequest;
  'contract/rollcontracts': PostRequest;
  'markets/search': PostRequest;
  'secondMarketDataSubscription/deps': GetRequest;
  'secondMarketDataSubscription/item': GetRequest;
  'secondMarketDataSubscription/items': GetRequest;
  'secondMarketDataSubscription/ldeps': GetRequest;
  'secondMarketDataSubscription/list': GetRequest;
  'user/sendnotifyadminalert': PostRequest;
  'accountRiskStatus/setaccountnotes': PostRequest;
  'accountRiskStatus/setadminautoliqaction': PostRequest;
  'accountRiskStatus/setdemohalt': PostRequest;
  'customerApplication/signagreementdocuments': PostRequest;
  'customerApplication/signnonprocertification': PostRequest;
  'customerApplication/signsubaccountrequest': PostRequest;
  'user/signuporganizationmember': PostRequest;
  'customerApplication/signuserdocument': PostRequest;
  'userCertification/signw8': PostRequest;
  'spreadDefinition/item': GetRequest;
  'spreadDefinition/items': GetRequest;
  'customerApplication/startcustomerapplication': PostRequest;
  'orderStrategy/startorderstrategy': PostRequest;
  'subAccountRequest/deps': GetRequest;
  'subAccountRequest/item': GetRequest;
  'subAccountRequest/items': GetRequest;
  'subAccountRequest/ldeps': GetRequest;
  'subAccountRequest/list': GetRequest;
  'customerApplication/submitannualreview': PostRequest;
  'customerApplication/submitapplicant': PostRequest;
  'customerApplication/submitcustomerapplicationdocument': PostRequest;
  'accountRiskStatus/switchriskcategory': PostRequest;
  'user/switchtoprofessional': PostRequest;
  'user/syncrequest': PostRequest;
  'adminAlertSignal/takealertsignalownership': PostRequest;
  'userCertification/thirdpartydatasharing': PostRequest;
  'tradingPermissionConsent/deps': GetRequest;
  'tradingPermissionConsent/item': GetRequest;
  'tradingPermissionConsent/items': GetRequest;
  'tradingPermissionConsent/ldeps': GetRequest;
  'tradingPermissionConsent/list': GetRequest;
  'tradingPermission/deps': GetRequest;
  'tradingPermission/item': GetRequest;
  'tradingPermission/items': GetRequest;
  'tradingPermission/ldeps': GetRequest;
  'tradingPermission/list': GetRequest;
  'tradingSession/deps': GetRequest;
  'tradingSession/item': GetRequest;
  'tradingSession/items': GetRequest;
  'tradingSession/ldeps': GetRequest;
  'tradovateSubscription/create': PostRequest;
  'tradovateSubscription/deps': GetRequest;
  'tradovateSubscription/item': GetRequest;
  'tradovateSubscription/items': GetRequest;
  'tradovateSubscription/ldeps': GetRequest;
  'tradovateSubscription/list': GetRequest;
  'tradovateSubscriptionPlan/find': GetRequest;
  'tradovateSubscriptionPlan/item': GetRequest;
  'tradovateSubscriptionPlan/items': GetRequest;
  'tradovateSubscriptionPlan/list': GetRequest;
  'tradovateSubscriptionPlan/suggest': GetRequest;
  'tradovateSubscription/update': PostRequest;
  'contactInfo/updatecontactinfo': PostRequest;
  'contactInfo/updatecontactinfoname': PostRequest;
  'accountRiskStatus/updatemaxnetliq': PostRequest;
  'userAccountAutoLiq/updateuserautoliq': PostRequest;
  'userAccountAutoLiq/create': PostRequest;
  'userAccountAutoLiq/deps': GetRequest;
  'userAccountAutoLiq/item': GetRequest;
  'userAccountAutoLiq/items': GetRequest;
  'userAccountAutoLiq/ldeps': GetRequest;
  'userAccountAutoLiq/list': GetRequest;
  'userAccountAutoLiq/update': PostRequest;
  'userAccountPositionLimit/create': PostRequest;
  'userAccountPositionLimit/deps': GetRequest;
  'userAccountPositionLimit/item': GetRequest;
  'userAccountPositionLimit/items': GetRequest;
  'userAccountPositionLimit/ldeps': GetRequest;
  'userAccountPositionLimit/update': PostRequest;
  'userAccountRiskParameter/create': PostRequest;
  'userAccountRiskParameter/deps': GetRequest;
  'userAccountRiskParameter/item': GetRequest;
  'userAccountRiskParameter/items': GetRequest;
  'userAccountRiskParameter/ldeps': GetRequest;
  'userAccountRiskParameter/update': PostRequest;
  'userCertification/deps': GetRequest;
  'userCertification/item': GetRequest;
  'userCertification/items': GetRequest;
  'userCertification/ldeps': GetRequest;
  'userDevice/deps': GetRequest;
  'userDevice/item': GetRequest;
  'userDevice/items': GetRequest;
  'userDevice/ldeps': GetRequest;
  'user/find': GetRequest;
  'user/item': GetRequest;
  'user/items': GetRequest;
  'user/list': GetRequest;
  'userPlugin/create': PostRequest;
  'userPlugin/deps': GetRequest;
  'userPlugin/item': GetRequest;
  'userPlugin/items': GetRequest;
  'userPlugin/ldeps': GetRequest;
  'userPlugin/list': GetRequest;
  'userPlugin/update': PostRequest;
  'userPromoCode/deps': GetRequest;
  'userPromoCode/item': GetRequest;
  'userPromoCode/items': GetRequest;
  'userPromoCode/ldeps': GetRequest;
  'userProperty/deps': GetRequest;
  'userProperty/item': GetRequest;
  'userProperty/items': GetRequest;
  'userProperty/ldeps': GetRequest;
  'userReadStatus/deps': GetRequest;
  'userReadStatus/item': GetRequest;
  'userReadStatus/items': GetRequest;
  'userReadStatus/ldeps': GetRequest;
  'userReadStatus/list': GetRequest;
  'userSession/item': GetRequest;
  'userSession/items': GetRequest;
  'userSessionStats/deps': GetRequest;
  'userSessionStats/item': GetRequest;
  'userSessionStats/items': GetRequest;
  'userSessionStats/ldeps': GetRequest;
  'userSessionStats/list': GetRequest;
  'userSignedDocument/deps': GetRequest;
  'userSignedDocument/item': GetRequest;
  'userSignedDocument/items': GetRequest;
  'userSignedDocument/ldeps': GetRequest;
  'user/suggest': GetRequest;
  'fundTransaction/wallettransfer': PostRequest;
  'cashBalance/changeDemoBalance': PostRequest;
  'replay/changespeed': PostRequest;
  'replay/checkreplaysession': PostRequest;
  'replay/initializeclock': PostRequest;
  'user/activatesecondmarketdatasubscriptionrenewal': PostRequest;
  'user/addsecondmarketdatasubscription': PostRequest;
  'user/cancelsecondmarketdatasubscription': PostRequest;
  'user/cancelsecondmarketdatasubscriptionrenewal': PostRequest;
  'user/getsecondmarketdatasubscriptioncost': PostRequest;
  'fundTransaction/checkstripefundingeligibility': PostRequest;
  'chat/closechat': PostRequest;
  'chat/deps': GetRequest;
  'chat/item': GetRequest;
  'chat/items': GetRequest;
  'chat/ldeps': GetRequest;
  'chat/list': GetRequest;
  'chat/markasreadchatmessage': PostRequest;
  'chat/postchatmessage': PostRequest;
  'chatMessage/deps': GetRequest;
  'chatMessage/item': GetRequest;
  'chatMessage/items': GetRequest;
  'chatMessage/ldeps': GetRequest;
  'md/subscribeQuote': PostRequest;
  'md/unsubscribeQuote': PostRequest;
  'md/subscribeDOM': PostRequest;
  'md/unsubscribeDOM': PostRequest;
  'md/subscribeHistogram': PostRequest;
  'md/unsubscribeHistogram': PostRequest;
  'md/getChart': PostRequest;
  'md/cancelChart': PostRequest;
  authorize: PostRequest;
}
export type GetRequest = {
  body?: {};
};
export type PostRequest = {
  body?: any;
};
export type EndpointUrl = Endpoint['url'];
export type RequestForUrl<T> = Extract<Endpoint, { url: T }>['request'];
export type ResponseForUrl<T> = Extract<Endpoint, { url: T }>['response'];
export type EndpointForUrl<T> = Extract<Endpoint, { url: T }>;
