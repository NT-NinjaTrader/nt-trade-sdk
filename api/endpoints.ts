import {
  type AccessTokenResponse,
  type Account,
  type AccountRiskStatus,
  type AccountRiskStatusLog,
  type SimpleResponse,
  type Alert,
  type AlertSignal,
  type CommandResult,
  type CashBalance,
  type CashBalanceLog,
  type CategoryPositionLimit,
  type CategoryRiskParameter,
  type ClearingHouse,
  type Command,
  type CommandReport,
  type Contract,
  type ContractGroup,
  type ContractMargin,
  type ContractMaturity,
  type Country,
  type AlertResponse,
  type Currency,
  type CurrencyRate,
  type DryRunResponse,
  type EvaluateFillFeeResponse,
  type Exchange,
  type ExecutionReport,
  type Fee,
  type Fill,
  type FillFee,
  type FillPair,
  type CashBalanceSnapshot,
  type EventProductsResponse,
  type OptionsChainResponse,
  type ProcessingFee,
  type ProductDetails,
  type ProductFeeParamsResponse,
  type TimestampResponse,
  type OrderStrategyStatusResponse,
  type PlaceOrderResult,
  type MarginSnapshot,
  type OAuthMeResponse,
  type UserStatusMessage,
  type OAuthTokenResponse,
  type OpenDemoAccountResponse,
  type Order,
  type OrderStrategy,
  type OrderStrategyLink,
  type OrderStrategyType,
  type OrderVersion,
  type PlaceOcoResult,
  type PlaceOsoResult,
  type Position,
  type PositionLog,
  type Product,
  type ProductMargin,
  type ProductSession,
  type ProductList,
  type Property,
  type RiskDiscountContractGroup,
  type RollContractResponse,
  type RollContractsResponse,
  type SpreadDefinition,
  type SyncMessage,
  type TradingSession,
  type UserAccountAutoLiq,
  type User,
  type UserProperty,
  type UserReadStatus,
  type CheckReplaySessionResponse,
  type AccessTokenRequest,
  type CancelOrder,
  type CreateAlert,
  type DeleteAlert,
  type DismissAlert,
  type DryRun,
  type EvaluateFillFee,
  type GetCashBalanceSnapshot,
  type GetOptionsChain,
  type GetProcessingFee,
  type GetProduct,
  type GetProductFeeParams,
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
  type ResetAlert,
  type ResetDemoAccountState,
  type RollContract,
  type RollContracts,
  type Search,
  type StartOrderStrategy,
  type SyncRequest,
  type ChangeDemoBalance,
  type ChangeSpeed,
  type CheckReplaySession,
  type InitializeClock,
} from './types';
export type Endpoint =
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
      url: 'order/cancelorder';
      request: {
        body: CancelOrder;
      };
      response: CommandResult;
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
      url: 'alert/deletealert';
      request: {
        body: DeleteAlert;
      };
      response: AlertResponse;
    }
  | {
      url: 'alert/dismissalert';
      request: {
        body: DismissAlert;
      };
      response: AlertResponse;
    }
  | {
      url: 'order/dryrun';
      request: {
        body: DryRun;
      };
      response: DryRunResponse;
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
      url: 'cashBalance/getcashbalancesnapshot';
      request: {
        body: GetCashBalanceSnapshot;
      };
      response: CashBalanceSnapshot;
    }
  | {
      url: 'contract/geteventproducts';
      request: {
        body?: {};
      };
      response: EventProductsResponse;
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
      url: 'orderStrategy/interruptorderstrategy';
      request: {
        body: InterruptOrderStrategy;
      };
      response: OrderStrategyStatusResponse;
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
      url: 'auth/renewaccesstoken';
      request: {
        body?: {};
      };
      response: AccessTokenResponse;
    }
  | {
      url: 'alert/resetalert';
      request: {
        body: ResetAlert;
      };
      response: AlertResponse;
    }
  | {
      url: 'account/resetdemoaccountstate';
      request: {
        body: ResetDemoAccountState;
      };
      response: SimpleResponse;
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
      url: 'orderStrategy/startorderstrategy';
      request: {
        body: StartOrderStrategy;
      };
      response: OrderStrategyStatusResponse;
    }
  | {
      url: 'user/syncrequest';
      request: {
        body: SyncRequest;
      };
      response: SyncMessage;
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
  'alert/deps': Alert[];
  'alert/item': Alert;
  'alert/items': Alert[];
  'alert/ldeps': Alert[];
  'alertSignal/deps': AlertSignal[];
  'alertSignal/item': AlertSignal;
  'alertSignal/items': AlertSignal[];
  'alertSignal/ldeps': AlertSignal[];
  'order/cancelorder': CommandResult;
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
  'clearingHouse/find': ClearingHouse;
  'clearingHouse/item': ClearingHouse;
  'clearingHouse/items': ClearingHouse[];
  'clearingHouse/list': ClearingHouse[];
  'clearingHouse/suggest': ClearingHouse[];
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
  'country/find': Country;
  'country/item': Country;
  'country/items': Country[];
  'country/list': Country[];
  'country/suggest': Country[];
  'alert/createalert': AlertResponse;
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
  'alert/deletealert': AlertResponse;
  'alert/dismissalert': AlertResponse;
  'order/dryrun': DryRunResponse;
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
  'cashBalance/getcashbalancesnapshot': CashBalanceSnapshot;
  'contract/geteventproducts': EventProductsResponse;
  'contract/getoptionschain': OptionsChainResponse;
  'user/getprocessingfee': ProcessingFee;
  'markets/getproduct': ProductDetails;
  'contract/getproductfeeparams': ProductFeeParamsResponse;
  'support/gettimestamp': TimestampResponse;
  'orderStrategy/interruptorderstrategy': OrderStrategyStatusResponse;
  'order/liquidateposition': PlaceOrderResult;
  'order/liquidatepositions': SimpleResponse;
  'marginSnapshot/deps': MarginSnapshot[];
  'marginSnapshot/item': MarginSnapshot;
  'marginSnapshot/items': MarginSnapshot[];
  'marginSnapshot/ldeps': MarginSnapshot[];
  'marginSnapshot/list': MarginSnapshot[];
  'alert/markreadalertsignal': AlertResponse;
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
  'auth/renewaccesstoken': AccessTokenResponse;
  'alert/resetalert': AlertResponse;
  'account/resetdemoaccountstate': SimpleResponse;
  'riskDiscountContractGroup/find': RiskDiscountContractGroup;
  'riskDiscountContractGroup/item': RiskDiscountContractGroup;
  'riskDiscountContractGroup/items': RiskDiscountContractGroup[];
  'riskDiscountContractGroup/list': RiskDiscountContractGroup[];
  'riskDiscountContractGroup/suggest': RiskDiscountContractGroup[];
  'contract/rollcontract': RollContractResponse;
  'contract/rollcontracts': RollContractsResponse;
  'markets/search': ProductList;
  'spreadDefinition/item': SpreadDefinition;
  'spreadDefinition/items': SpreadDefinition[];
  'orderStrategy/startorderstrategy': OrderStrategyStatusResponse;
  'user/syncrequest': SyncMessage;
  'tradingSession/deps': TradingSession[];
  'tradingSession/item': TradingSession;
  'tradingSession/items': TradingSession[];
  'tradingSession/ldeps': TradingSession[];
  'userAccountAutoLiq/deps': UserAccountAutoLiq[];
  'userAccountAutoLiq/item': UserAccountAutoLiq;
  'userAccountAutoLiq/items': UserAccountAutoLiq[];
  'userAccountAutoLiq/ldeps': UserAccountAutoLiq[];
  'userAccountAutoLiq/list': UserAccountAutoLiq[];
  'user/find': User;
  'user/item': User;
  'user/items': User[];
  'user/list': User[];
  'userProperty/deps': UserProperty[];
  'userProperty/item': UserProperty;
  'userProperty/items': UserProperty[];
  'userProperty/ldeps': UserProperty[];
  'userReadStatus/deps': UserReadStatus[];
  'userReadStatus/item': UserReadStatus;
  'userReadStatus/items': UserReadStatus[];
  'userReadStatus/ldeps': UserReadStatus[];
  'userReadStatus/list': UserReadStatus[];
  'user/suggest': User[];
  'cashBalance/changeDemoBalance': CashBalance;
  'replay/changespeed': SimpleResponse;
  'replay/checkreplaysession': CheckReplaySessionResponse;
  'replay/initializeclock': SimpleResponse;
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
  'alert/deps': GetRequest;
  'alert/item': GetRequest;
  'alert/items': GetRequest;
  'alert/ldeps': GetRequest;
  'alertSignal/deps': GetRequest;
  'alertSignal/item': GetRequest;
  'alertSignal/items': GetRequest;
  'alertSignal/ldeps': GetRequest;
  'order/cancelorder': PostRequest;
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
  'clearingHouse/find': GetRequest;
  'clearingHouse/item': GetRequest;
  'clearingHouse/items': GetRequest;
  'clearingHouse/list': GetRequest;
  'clearingHouse/suggest': GetRequest;
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
  'country/find': GetRequest;
  'country/item': GetRequest;
  'country/items': GetRequest;
  'country/list': GetRequest;
  'country/suggest': GetRequest;
  'alert/createalert': PostRequest;
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
  'alert/deletealert': PostRequest;
  'alert/dismissalert': PostRequest;
  'order/dryrun': PostRequest;
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
  'cashBalance/getcashbalancesnapshot': PostRequest;
  'contract/geteventproducts': GetRequest;
  'contract/getoptionschain': PostRequest;
  'user/getprocessingfee': PostRequest;
  'markets/getproduct': PostRequest;
  'contract/getproductfeeparams': PostRequest;
  'support/gettimestamp': GetRequest;
  'orderStrategy/interruptorderstrategy': PostRequest;
  'order/liquidateposition': PostRequest;
  'order/liquidatepositions': PostRequest;
  'marginSnapshot/deps': GetRequest;
  'marginSnapshot/item': GetRequest;
  'marginSnapshot/items': GetRequest;
  'marginSnapshot/ldeps': GetRequest;
  'marginSnapshot/list': GetRequest;
  'alert/markreadalertsignal': PostRequest;
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
  'auth/renewaccesstoken': GetRequest;
  'alert/resetalert': PostRequest;
  'account/resetdemoaccountstate': PostRequest;
  'riskDiscountContractGroup/find': GetRequest;
  'riskDiscountContractGroup/item': GetRequest;
  'riskDiscountContractGroup/items': GetRequest;
  'riskDiscountContractGroup/list': GetRequest;
  'riskDiscountContractGroup/suggest': GetRequest;
  'contract/rollcontract': PostRequest;
  'contract/rollcontracts': PostRequest;
  'markets/search': PostRequest;
  'spreadDefinition/item': GetRequest;
  'spreadDefinition/items': GetRequest;
  'orderStrategy/startorderstrategy': PostRequest;
  'user/syncrequest': PostRequest;
  'tradingSession/deps': GetRequest;
  'tradingSession/item': GetRequest;
  'tradingSession/items': GetRequest;
  'tradingSession/ldeps': GetRequest;
  'userAccountAutoLiq/deps': GetRequest;
  'userAccountAutoLiq/item': GetRequest;
  'userAccountAutoLiq/items': GetRequest;
  'userAccountAutoLiq/ldeps': GetRequest;
  'userAccountAutoLiq/list': GetRequest;
  'user/find': GetRequest;
  'user/item': GetRequest;
  'user/items': GetRequest;
  'user/list': GetRequest;
  'userProperty/deps': GetRequest;
  'userProperty/item': GetRequest;
  'userProperty/items': GetRequest;
  'userProperty/ldeps': GetRequest;
  'userReadStatus/deps': GetRequest;
  'userReadStatus/item': GetRequest;
  'userReadStatus/items': GetRequest;
  'userReadStatus/ldeps': GetRequest;
  'userReadStatus/list': GetRequest;
  'user/suggest': GetRequest;
  'cashBalance/changeDemoBalance': PostRequest;
  'replay/changespeed': PostRequest;
  'replay/checkreplaysession': PostRequest;
  'replay/initializeclock': PostRequest;
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
