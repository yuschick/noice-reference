/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as PaymentPayment from "../payment/payment.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum TaskStatus {
  TASK_STATUS_UNSPECIFIED = "TASK_STATUS_UNSPECIFIED",
  TASK_STATUS_PENDING = "TASK_STATUS_PENDING",
  TASK_STATUS_COMPLETED = "TASK_STATUS_COMPLETED",
  TASK_STATUS_FAILED = "TASK_STATUS_FAILED",
}

export enum TaskUpdateType {
  TASK_UPDATE_TYPE_UNSPECIFIED = "TASK_UPDATE_TYPE_UNSPECIFIED",
  TASK_UPDATE_TYPE_CREATED = "TASK_UPDATE_TYPE_CREATED",
  TASK_UPDATE_TYPE_COMPLETED = "TASK_UPDATE_TYPE_COMPLETED",
  TASK_UPDATE_TYPE_FAILED = "TASK_UPDATE_TYPE_FAILED",
}

export enum TaskFailureAction {
  TASK_FAILURE_ACTION_UNSPECIFIED = "TASK_FAILURE_ACTION_UNSPECIFIED",
  TASK_FAILURE_ACTION_CANCEL = "TASK_FAILURE_ACTION_CANCEL",
  TASK_FAILURE_ACTION_REALLOCATE = "TASK_FAILURE_ACTION_REALLOCATE",
}

export enum ErrorDetailsErrorType {
  ERROR_TYPE_UNSPECIFIED = "ERROR_TYPE_UNSPECIFIED",
  ERROR_TYPE_PAYMENT_FAILED = "ERROR_TYPE_PAYMENT_FAILED",
}

export enum SubscriptionPricePeriod {
  PERIOD_UNSPECIFIED = "PERIOD_UNSPECIFIED",
  PERIOD_MONTH = "PERIOD_MONTH",
  PERIOD_YEAR = "PERIOD_YEAR",
}

export enum ChannelSubscriptionState {
  STATE_UNSPECIFIED = "STATE_UNSPECIFIED",
  STATE_PENDING = "STATE_PENDING",
  STATE_ACTIVE = "STATE_ACTIVE",
  STATE_CANCELLED = "STATE_CANCELLED",
  STATE_EXPIRED = "STATE_EXPIRED",
  STATE_TERMINATED = "STATE_TERMINATED",
  STATE_LOCKED = "STATE_LOCKED",
}

export enum ChannelSubscriptionCancelReason {
  CANCEL_REASON_UNSPECIFIED = "CANCEL_REASON_UNSPECIFIED",
  CANCEL_REASON_NOT_PAID = "CANCEL_REASON_NOT_PAID",
  CANCEL_REASON_NO_CARD = "CANCEL_REASON_NO_CARD",
  CANCEL_REASON_FRAUD_REVIEW_FAILED = "CANCEL_REASON_FRAUD_REVIEW_FAILED",
  CANCEL_REASON_NON_COMPLIANT_EU_CUSTOMER = "CANCEL_REASON_NON_COMPLIANT_EU_CUSTOMER",
  CANCEL_REASON_TAX_CALCULATION_FAILED = "CANCEL_REASON_TAX_CALCULATION_FAILED",
  CANCEL_REASON_CURRENCY_INCOMPATIBLE_WITH_GATEWAY = "CANCEL_REASON_CURRENCY_INCOMPATIBLE_WITH_GATEWAY",
  CANCEL_REASON_NON_COMPLIANT_CUSTOMER = "CANCEL_REASON_NON_COMPLIANT_CUSTOMER",
}

export enum ChannelSubscriptionProvider {
  PROVIDER_UNSPECIFIED = "PROVIDER_UNSPECIFIED",
  PROVIDER_CHARGEBEE = "PROVIDER_CHARGEBEE",
  PROVIDER_APPLE = "PROVIDER_APPLE",
}

export enum ChannelSubscriptionUpdateEventUpdateType {
  UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
  UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
  UPDATE_TYPE_ACTIVATED = "UPDATE_TYPE_ACTIVATED",
  UPDATE_TYPE_RENEWED = "UPDATE_TYPE_RENEWED",
  UPDATE_TYPE_EXPIRED = "UPDATE_TYPE_EXPIRED",
  UPDATE_TYPE_CANCELLED = "UPDATE_TYPE_CANCELLED",
  UPDATE_TYPE_TERMINATED = "UPDATE_TYPE_TERMINATED",
  UPDATE_TYPE_PAYMENT_FAILED = "UPDATE_TYPE_PAYMENT_FAILED",
  UPDATE_TYPE_CANCELLATION_REQUESTED = "UPDATE_TYPE_CANCELLATION_REQUESTED",
  UPDATE_TYPE_UPGRADED = "UPDATE_TYPE_UPGRADED",
  UPDATE_TYPE_CANCELLATION_REMOVED = "UPDATE_TYPE_CANCELLATION_REMOVED",
  UPDATE_TYPE_PAYMENT_SUCCEEDED = "UPDATE_TYPE_PAYMENT_SUCCEEDED",
}

export type ErrorDetails = {
  type?: ErrorDetailsErrorType
  message?: string
}

export type ChannelSubscriptionEntitlement = {
  itemId?: string
  amount?: number
}

export type SubscriptionPrice = {
  period?: SubscriptionPricePeriod
  price?: number
  currency?: PaymentPayment.Currency
}

export type ChannelSubscriptionTier = {
  level?: number
  name?: string
  description?: string
  entitlements?: ChannelSubscriptionEntitlement[]
  prices?: SubscriptionPrice[]
}

export type ListChannelSubscriptionTiersRequest = {
  channelId?: string
}

export type ListChannelSubscriptionTiersResponse = {
  tiers?: ChannelSubscriptionTier[]
}

export type ChannelSubscriptionConfig = {
  channelId?: string
  subscriptionsEnabled?: boolean
  tiers?: ChannelSubscriptionTier[]
}

export type ChannelSubscriptionTierUpdateEvent = {
  channelId?: string
  tier?: number
  name?: string
  description?: string
  subscriptionItemId?: string
  updatedAt?: string
  enabled?: boolean
}

export type GetChannelSubscriptionConfigRequest = {
  channelId?: string
}

export type UpdateChannelSubscriptionConfigRequest = {
  channelId?: string
  subscriptionsEnabled?: boolean
}

export type CheckoutNewSubscriptionRequest = {
  channelId?: string
  tier?: number
}

export type CheckoutNewSubscriptionResponse = {
  sessionData?: string
}

export type UpdateSubscriptionPaymentMethodRequest = {
}

export type UpdateSubscriptionPaymentMethodResponse = {
  sessionData?: string
}

export type CheckoutExistingSubscriptionRequest = {
  channelId?: string
}

export type CheckoutExistingSubscriptionResponse = {
  sessionData?: string
}

export type CancelSubscriptionRequest = {
  channelId?: string
}

export type ReactivateSubscriptionRequest = {
  channelId?: string
}

export type GetUserChannelSubscriptionRequest = {
  userId?: string
  channelId?: string
}

export type ChannelSubscription = {
  id?: string
  channelId?: string
  userId?: string
  tier?: number
  state?: ChannelSubscriptionState
  createdAt?: string
  activatedAt?: string
  renewedAt?: string
  expiresAt?: string
  cancelledAt?: string
  terminatedAt?: string
  paymentFailedAt?: string
  giverId?: string
  cancelReason?: ChannelSubscriptionCancelReason
  provider?: ChannelSubscriptionProvider
  externalReference?: string
  paymentSucceededAt?: string
}

export type SubscriptionUpdateMeta = {
  giverId?: string
}

export type ChannelSubscriptionUpdateEvent = {
  subscription?: ChannelSubscription
  updateType?: ChannelSubscriptionUpdateEventUpdateType
  updatedAt?: string
  meta?: SubscriptionUpdateMeta
}

export type GiftSubscriptionOrderTask = {
  id?: string
  channelId?: string
  tier?: number
  orderId?: string
  giverId?: string
  recipientIds?: string[]
  amount?: number
  allocatedIds?: string[]
  status?: TaskStatus
  createdAt?: string
  updatedAt?: string
  giftAnonymously?: boolean
  failureAction?: TaskFailureAction
  failedIds?: string[]
}

export type GiftSubscriptionOrderTaskUpdateEvent = {
  task?: GiftSubscriptionOrderTask
  updateType?: TaskUpdateType
  updatedAt?: string
}

export type GiftSubscriptionAllocationTask = {
  taskId?: string
  parentTaskId?: string
  channelId?: string
  tier?: number
  recipientId?: string
  giverId?: string
  subscriptionId?: string
  createdAt?: string
  updatedAt?: string
  status?: TaskStatus
}

export type GiftSubscriptionAllocationTaskUpdateEvent = {
  task?: GiftSubscriptionAllocationTask
  updateType?: TaskUpdateType
  updatedAt?: string
}


type BaseListUserChannelSubscriptionsRequestFilter = {
}

export type ListUserChannelSubscriptionsRequestFilter = BaseListUserChannelSubscriptionsRequestFilter
  & OneOf<{ state: ChannelSubscriptionState; paymentFailed: boolean }>

export type ListUserChannelSubscriptionsRequest = {
  userId?: string
  cursor?: ApiCursor.Cursor
  filters?: ListUserChannelSubscriptionsRequestFilter[]
}

export type ListUserChannelSubscriptionsResponse = {
  subscriptions?: ChannelSubscription[]
  pageInfo?: ApiCursor.PageInfo
}


type BaseListChannelSubscriptionsRequestFilter = {
}

export type ListChannelSubscriptionsRequestFilter = BaseListChannelSubscriptionsRequestFilter
  & OneOf<{ state: ChannelSubscriptionState }>

export type ListChannelSubscriptionsRequest = {
  channelId?: string
  cursor?: ApiCursor.Cursor
  filters?: ListChannelSubscriptionsRequestFilter[]
}

export type ListChannelSubscriptionsResponse = {
  subscriptions?: ChannelSubscription[]
  pageInfo?: ApiCursor.PageInfo
}

export type CreateGiftSubscriptionTaskRequest = {
  id?: string
  channelId?: string
  tier?: number
  orderId?: string
  giverId?: string
  recipientIds?: string[]
  amount?: number
  giftAnonymously?: boolean
}




export interface IListUserChannelSubscriptionsRequestFilterFilterDelegate<C> {
  onState(ctx: C, ev: ChannelSubscriptionState): void
  onPaymentFailed(ctx: C, ev: boolean): void
}

export function routeListUserChannelSubscriptionsRequestFilterFilterDelegate<C>(ctx: C, val: ListUserChannelSubscriptionsRequestFilter, delegate: IListUserChannelSubscriptionsRequestFilterFilterDelegate<C>) {
  val?.state && delegate.onState(ctx, val.state)
  val?.paymentFailed && delegate.onPaymentFailed(ctx, val.paymentFailed)
}




export interface IListChannelSubscriptionsRequestFilterFilterDelegate<C> {
  onState(ctx: C, ev: ChannelSubscriptionState): void
}

export function routeListChannelSubscriptionsRequestFilterFilterDelegate<C>(ctx: C, val: ListChannelSubscriptionsRequestFilter, delegate: IListChannelSubscriptionsRequestFilterFilterDelegate<C>) {
  val?.state && delegate.onState(ctx, val.state)
}

export class ChannelSubscriptionService {
  static GetChannelSubscriptionConfig(req: GetChannelSubscriptionConfigRequest, initReq?: fm.InitReq): Promise<ChannelSubscriptionConfig> {
    return fm.fetchReq<GetChannelSubscriptionConfigRequest, ChannelSubscriptionConfig>(`/v1/channels/${req["channelId"]}/subscriptionConfig?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
  static UpdateChannelSubscriptionConfig(req: UpdateChannelSubscriptionConfigRequest, initReq?: fm.InitReq): Promise<ChannelSubscriptionConfig> {
    return fm.fetchReq<UpdateChannelSubscriptionConfigRequest, ChannelSubscriptionConfig>(`/v1/channels/${req["channelId"]}/subscriptionConfig`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CheckoutNewSubscription(req: CheckoutNewSubscriptionRequest, initReq?: fm.InitReq): Promise<CheckoutNewSubscriptionResponse> {
    return fm.fetchReq<CheckoutNewSubscriptionRequest, CheckoutNewSubscriptionResponse>(`/v1/channels/${req["channelId"]}/subscriptions:checkoutNew`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateSubscriptionPaymentMethod(req: UpdateSubscriptionPaymentMethodRequest, initReq?: fm.InitReq): Promise<UpdateSubscriptionPaymentMethodResponse> {
    return fm.fetchReq<UpdateSubscriptionPaymentMethodRequest, UpdateSubscriptionPaymentMethodResponse>(`/v1/subscriptions:paymentMethod`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CheckoutExistingSubscription(req: CheckoutExistingSubscriptionRequest, initReq?: fm.InitReq): Promise<CheckoutExistingSubscriptionResponse> {
    return fm.fetchReq<CheckoutExistingSubscriptionRequest, CheckoutExistingSubscriptionResponse>(`/v1/channels/${req["channelId"]}/subscriptions:checkoutExisting`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CancelSubscription(req: CancelSubscriptionRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CancelSubscriptionRequest, GoogleProtobufEmpty.Empty>(`/v1/channels/${req["channelId"]}/subscriptions:cancel`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ReactivateSubscription(req: ReactivateSubscriptionRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<ReactivateSubscriptionRequest, GoogleProtobufEmpty.Empty>(`/v1/channels/${req["channelId"]}/subscriptions:reactivate`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetUserChannelSubscription(req: GetUserChannelSubscriptionRequest, initReq?: fm.InitReq): Promise<ChannelSubscription> {
    return fm.fetchReq<GetUserChannelSubscriptionRequest, ChannelSubscription>(`/v1/users/${req["userId"]}/channelSubscription/${req["channelId"]}?${fm.renderURLSearchParams(req, ["userId", "channelId"])}`, {...initReq, method: "GET"})
  }
  static ListChannelSubscriptionTiers(req: ListChannelSubscriptionTiersRequest, initReq?: fm.InitReq): Promise<ListChannelSubscriptionTiersResponse> {
    return fm.fetchReq<ListChannelSubscriptionTiersRequest, ListChannelSubscriptionTiersResponse>(`/v1/channels/${req["channelId"]}/subscriptionTiers?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
  static ListChannelSubscriptions(req: ListChannelSubscriptionsRequest, initReq?: fm.InitReq): Promise<ListChannelSubscriptionsResponse> {
    return fm.fetchReq<ListChannelSubscriptionsRequest, ListChannelSubscriptionsResponse>(`/v1/channels/${req["channelId"]}/subscriptions?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
  static ListUserChannelSubscriptions(req: ListUserChannelSubscriptionsRequest, initReq?: fm.InitReq): Promise<ListUserChannelSubscriptionsResponse> {
    return fm.fetchReq<ListUserChannelSubscriptionsRequest, ListUserChannelSubscriptionsResponse>(`/v1/users/${req["userId"]}/channelSubscriptions?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
}
export class ChannelSubscriptionInternalService {
  static CreateGiftSubscriptionTask(req: CreateGiftSubscriptionTaskRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CreateGiftSubscriptionTaskRequest, GoogleProtobufEmpty.Empty>(`/subscription.ChannelSubscriptionInternalService/CreateGiftSubscriptionTask`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}