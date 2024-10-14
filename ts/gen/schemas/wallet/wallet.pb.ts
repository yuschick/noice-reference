/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as ReasonReason from "../reason/reason.pb"

export enum TransactionState {
  TRANSACTION_STATE_UNSPECIFIED = "TRANSACTION_STATE_UNSPECIFIED",
  TRANSACTION_STATE_PENDING = "TRANSACTION_STATE_PENDING",
  TRANSACTION_STATE_COMMITTED = "TRANSACTION_STATE_COMMITTED",
  TRANSACTION_STATE_CANCELLED = "TRANSACTION_STATE_CANCELLED",
}

export enum TransactionReason {
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
  TRANSACTION_REASON_STORE_ORDER_PAYMENT = "TRANSACTION_REASON_STORE_ORDER_PAYMENT",
}

export enum OperationType {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  TYPE_ADD = "TYPE_ADD",
  TYPE_SUBTRACT = "TYPE_SUBTRACT",
}

export type Operation = {
  type?: OperationType
  currencyId?: string
  currencyAmount?: string
  currencyBalance?: string
}

export type Transaction = {
  id?: string
  userId?: string
  createdAt?: string
  reason?: ReasonReason.Reason
  operations?: Operation[]
  state?: TransactionState
  expiresAt?: string
}

export type TransactionEvent = {
  transaction?: Transaction
}

export type OperationList = {
  operations?: Operation[]
}

export type WalletCurrency = {
  currencyId?: string
  currencyAmount?: string
}

export type Wallet = {
  userId?: string
  currencies?: WalletCurrency[]
}

export type GetWalletRequest = {
  userId?: string
}

export type GetWalletResponse = {
  wallet?: Wallet
}

export type ListWalletTransactionsRequestFilter = {
  from?: string
  to?: string
  reasons?: TransactionReason[]
}

export type ListWalletTransactionsRequest = {
  userId?: string
  filter?: ListWalletTransactionsRequestFilter
  cursor?: ApiCursor.Cursor
}

export type ListWalletTransactionsResponse = {
  transactions?: Transaction[]
  pageInfo?: ApiCursor.PageInfo
}

export type AddCurrenciesRequest = {
  userId?: string
  reason?: ReasonReason.Reason
  currencies?: WalletCurrency[]
}

export type AddCurrenciesResponse = {
}

export type SubtractCurrenciesRequest = {
  userId?: string
  reason?: ReasonReason.Reason
  currencies?: WalletCurrency[]
}

export type SubtractCurrenciesResponse = {
}

export type Hold = {
  id?: string
  userId?: string
  createdAt?: string
  reason?: ReasonReason.Reason
  operations?: Operation[]
  expiresAt?: string
}

export type HoldEvent = {
  transaction?: Transaction
}

export type CreateHoldRequest = {
  userId?: string
  reason?: ReasonReason.Reason
  currencies?: WalletCurrency[]
  expiresAt?: string
}

export type UpdateHoldRequest = {
  id?: string
  currencies?: WalletCurrency[]
}

export type ReleaseHoldRequest = {
  id?: string
}

export type CommitHoldRequest = {
  id?: string
}

export class WalletService {
  static GetWallet(req: GetWalletRequest, initReq?: fm.InitReq): Promise<GetWalletResponse> {
    return fm.fetchReq<GetWalletRequest, GetWalletResponse>(`/v1/users/${req["userId"]}/wallet?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static ListWalletTransactions(req: ListWalletTransactionsRequest, initReq?: fm.InitReq): Promise<ListWalletTransactionsResponse> {
    return fm.fetchReq<ListWalletTransactionsRequest, ListWalletTransactionsResponse>(`/v1/users/${req["userId"]}/wallet/transactions?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
}
export class WalletAdminService {
  static AddCurrencies(req: AddCurrenciesRequest, initReq?: fm.InitReq): Promise<AddCurrenciesResponse> {
    return fm.fetchReq<AddCurrenciesRequest, AddCurrenciesResponse>(`/wallet.WalletAdminService/AddCurrencies`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SubtractCurrencies(req: SubtractCurrenciesRequest, initReq?: fm.InitReq): Promise<SubtractCurrenciesResponse> {
    return fm.fetchReq<SubtractCurrenciesRequest, SubtractCurrenciesResponse>(`/wallet.WalletAdminService/SubtractCurrencies`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class WalletInternalService {
  static CreateHold(req: CreateHoldRequest, initReq?: fm.InitReq): Promise<Hold> {
    return fm.fetchReq<CreateHoldRequest, Hold>(`/wallet.WalletInternalService/CreateHold`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateHold(req: UpdateHoldRequest, initReq?: fm.InitReq): Promise<Hold> {
    return fm.fetchReq<UpdateHoldRequest, Hold>(`/wallet.WalletInternalService/UpdateHold`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ReleaseHold(req: ReleaseHoldRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<ReleaseHoldRequest, GoogleProtobufEmpty.Empty>(`/wallet.WalletInternalService/ReleaseHold`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CommitHold(req: CommitHoldRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CommitHoldRequest, GoogleProtobufEmpty.Empty>(`/wallet.WalletInternalService/CommitHold`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}