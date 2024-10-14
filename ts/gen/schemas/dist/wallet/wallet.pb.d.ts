import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as ReasonReason from "../reason/reason.pb";
export declare enum TransactionReason {
    TRANSACTION_REASON_UNSPECIFIED = "TRANSACTION_REASON_UNSPECIFIED",
    TRANSACTION_REASON_GOAL_CARD_COMPLETE = "TRANSACTION_REASON_GOAL_CARD_COMPLETE",
    TRANSACTION_REASON_MATCH_END = "TRANSACTION_REASON_MATCH_END",
    TRANSACTION_REASON_REWARD_CLAIMED = "TRANSACTION_REASON_REWARD_CLAIMED",
    TRANSACTION_REASON_ADMINISTRATIVE = "TRANSACTION_REASON_ADMINISTRATIVE",
    TRANSACTION_REASON_GOAL_CARD_SLOT_RESHUFFLE = "TRANSACTION_REASON_GOAL_CARD_SLOT_RESHUFFLE",
    TRANSACTION_REASON_LEVEL_UP = "TRANSACTION_REASON_LEVEL_UP",
    TRANSACTION_REASON_RESHUFFLE = "TRANSACTION_REASON_RESHUFFLE",
    TRANSACTION_REASON_AD_WATCHED = "TRANSACTION_REASON_AD_WATCHED",
    TRANSACTION_REASON_PROVISION = "TRANSACTION_REASON_PROVISION",
    TRANSACTION_REASON_PURCHASE_WITH_IN_GAME_CURRENCY = "TRANSACTION_REASON_PURCHASE_WITH_IN_GAME_CURRENCY",
    TRANSACTION_REASON_PURCHASE_WITH_PAYMENT = "TRANSACTION_REASON_PURCHASE_WITH_PAYMENT",
    TRANSACTION_REASON_CHANNEL_SUBSCRIPTION = "TRANSACTION_REASON_CHANNEL_SUBSCRIPTION",
    TRANSACTION_REASON_STORE_ORDER_PAYMENT = "TRANSACTION_REASON_STORE_ORDER_PAYMENT"
}
export declare enum OperationType {
    TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
    TYPE_ADD = "TYPE_ADD",
    TYPE_SUBTRACT = "TYPE_SUBTRACT"
}
export type Operation = {
    type?: OperationType;
    currencyId?: string;
    currencyAmount?: string;
    currencyBalance?: string;
};
export type Transaction = {
    id?: string;
    userId?: string;
    createdAt?: string;
    reason?: ReasonReason.Reason;
    operations?: Operation[];
};
export type TransactionEvent = {
    transaction?: Transaction;
};
export type OperationList = {
    operations?: Operation[];
};
export type WalletCurrency = {
    currencyId?: string;
    currencyAmount?: string;
};
export type Wallet = {
    userId?: string;
    currencies?: WalletCurrency[];
};
export type GetWalletRequest = {
    userId?: string;
};
export type GetWalletResponse = {
    wallet?: Wallet;
};
export type ListWalletTransactionsRequestFilter = {
    from?: string;
    to?: string;
    reasons?: TransactionReason[];
};
export type ListWalletTransactionsRequest = {
    userId?: string;
    filter?: ListWalletTransactionsRequestFilter;
    cursor?: ApiCursor.Cursor;
};
export type ListWalletTransactionsResponse = {
    transactions?: Transaction[];
    pageInfo?: ApiCursor.PageInfo;
};
export type AddCurrenciesRequest = {
    userId?: string;
    reason?: ReasonReason.Reason;
    currencies?: WalletCurrency[];
};
export type AddCurrenciesResponse = {};
export type SubtractCurrenciesRequest = {
    userId?: string;
    reason?: ReasonReason.Reason;
    currencies?: WalletCurrency[];
};
export type SubtractCurrenciesResponse = {};
export declare class WalletService {
    static GetWallet(req: GetWalletRequest, initReq?: fm.InitReq): Promise<GetWalletResponse>;
    static ListWalletTransactions(req: ListWalletTransactionsRequest, initReq?: fm.InitReq): Promise<ListWalletTransactionsResponse>;
}
export declare class WalletAdminService {
    static AddCurrencies(req: AddCurrenciesRequest, initReq?: fm.InitReq): Promise<AddCurrenciesResponse>;
    static SubtractCurrencies(req: SubtractCurrenciesRequest, initReq?: fm.InitReq): Promise<SubtractCurrenciesResponse>;
}
//# sourceMappingURL=wallet.pb.d.ts.map