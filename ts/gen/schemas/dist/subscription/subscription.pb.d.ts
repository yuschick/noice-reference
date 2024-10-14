import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum TaskStatus {
    TASK_STATUS_UNSPECIFIED = "TASK_STATUS_UNSPECIFIED",
    TASK_STATUS_PENDING = "TASK_STATUS_PENDING",
    TASK_STATUS_COMPLETED = "TASK_STATUS_COMPLETED",
    TASK_STATUS_FAILED = "TASK_STATUS_FAILED"
}
export declare enum TaskUpdateType {
    TASK_UPDATE_TYPE_UNSPECIFIED = "TASK_UPDATE_TYPE_UNSPECIFIED",
    TASK_UPDATE_TYPE_CREATED = "TASK_UPDATE_TYPE_CREATED",
    TASK_UPDATE_TYPE_COMPLETED = "TASK_UPDATE_TYPE_COMPLETED",
    TASK_UPDATE_TYPE_FAILED = "TASK_UPDATE_TYPE_FAILED"
}
export declare enum ErrorDetailsErrorType {
    ERROR_TYPE_UNSPECIFIED = "ERROR_TYPE_UNSPECIFIED",
    ERROR_TYPE_PAYMENT_FAILED = "ERROR_TYPE_PAYMENT_FAILED"
}
export declare enum SubscriptionPricePeriod {
    PERIOD_UNSPECIFIED = "PERIOD_UNSPECIFIED",
    PERIOD_MONTH = "PERIOD_MONTH",
    PERIOD_YEAR = "PERIOD_YEAR"
}
export declare enum ChannelSubscriptionState {
    STATE_UNSPECIFIED = "STATE_UNSPECIFIED",
    STATE_PENDING = "STATE_PENDING",
    STATE_ACTIVE = "STATE_ACTIVE",
    STATE_CANCELLED = "STATE_CANCELLED",
    STATE_EXPIRED = "STATE_EXPIRED",
    STATE_TERMINATED = "STATE_TERMINATED",
    STATE_LOCKED = "STATE_LOCKED"
}
export declare enum ChannelSubscriptionCancelReason {
    CANCEL_REASON_UNSPECIFIED = "CANCEL_REASON_UNSPECIFIED",
    CANCEL_REASON_NOT_PAID = "CANCEL_REASON_NOT_PAID",
    CANCEL_REASON_NO_CARD = "CANCEL_REASON_NO_CARD",
    CANCEL_REASON_FRAUD_REVIEW_FAILED = "CANCEL_REASON_FRAUD_REVIEW_FAILED",
    CANCEL_REASON_NON_COMPLIANT_EU_CUSTOMER = "CANCEL_REASON_NON_COMPLIANT_EU_CUSTOMER",
    CANCEL_REASON_TAX_CALCULATION_FAILED = "CANCEL_REASON_TAX_CALCULATION_FAILED",
    CANCEL_REASON_CURRENCY_INCOMPATIBLE_WITH_GATEWAY = "CANCEL_REASON_CURRENCY_INCOMPATIBLE_WITH_GATEWAY",
    CANCEL_REASON_NON_COMPLIANT_CUSTOMER = "CANCEL_REASON_NON_COMPLIANT_CUSTOMER"
}
export declare enum ChannelSubscriptionProvider {
    PROVIDER_UNSPECIFIED = "PROVIDER_UNSPECIFIED",
    PROVIDER_CHARGEBEE = "PROVIDER_CHARGEBEE",
    PROVIDER_APPLE = "PROVIDER_APPLE"
}
export declare enum ChannelSubscriptionUpdateEventUpdateType {
    UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
    UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
    UPDATE_TYPE_ACTIVATED = "UPDATE_TYPE_ACTIVATED",
    UPDATE_TYPE_RENEWED = "UPDATE_TYPE_RENEWED",
    UPDATE_TYPE_EXPIRED = "UPDATE_TYPE_EXPIRED",
    UPDATE_TYPE_CANCELLED = "UPDATE_TYPE_CANCELLED",
    UPDATE_TYPE_TERMINATED = "UPDATE_TYPE_TERMINATED",
    UPDATE_TYPE_PAYMENT_FAILED = "UPDATE_TYPE_PAYMENT_FAILED",
    UPDATE_TYPE_CANCELLATION_REQUESTED = "UPDATE_TYPE_CANCELLATION_REQUESTED",
    UPDATE_TYPE_UPGRADED = "UPDATE_TYPE_UPGRADED"
}
export type ErrorDetails = {
    type?: ErrorDetailsErrorType;
    message?: string;
};
export type ChannelSubscriptionEntitlement = {
    itemId?: string;
    amount?: number;
};
export type SubscriptionPrice = {
    period?: SubscriptionPricePeriod;
    price?: number;
};
export type ChannelSubscriptionTier = {
    level?: number;
    name?: string;
    description?: string;
    entitlements?: ChannelSubscriptionEntitlement[];
    prices?: SubscriptionPrice[];
};
export type ListChannelSubscriptionTiersRequest = {
    channelId?: string;
};
export type ListChannelSubscriptionTiersResponse = {
    tiers?: ChannelSubscriptionTier[];
};
export type ChannelSubscriptionConfig = {
    channelId?: string;
    subscriptionsEnabled?: boolean;
    tiers?: ChannelSubscriptionTier[];
};
export type ChannelSubscriptionTierUpdateEvent = {
    channelId?: string;
    tier?: number;
    name?: string;
    description?: string;
    subscriptionItemId?: string;
    updatedAt?: string;
    enabled?: boolean;
};
export type GetChannelSubscriptionConfigRequest = {
    channelId?: string;
};
export type UpdateChannelSubscriptionConfigRequest = {
    channelId?: string;
    subscriptionsEnabled?: boolean;
};
export type CheckoutNewSubscriptionRequest = {
    channelId?: string;
    tier?: number;
};
export type CheckoutNewSubscriptionResponse = {
    sessionData?: string;
};
export type UpdateSubscriptionPaymentMethodRequest = {};
export type UpdateSubscriptionPaymentMethodResponse = {
    sessionData?: string;
};
export type CheckoutExistingSubscriptionRequest = {
    channelId?: string;
};
export type CheckoutExistingSubscriptionResponse = {
    sessionData?: string;
};
export type CancelSubscriptionRequest = {
    channelId?: string;
};
export type ReactivateSubscriptionRequest = {
    channelId?: string;
};
export type GetUserChannelSubscriptionRequest = {
    userId?: string;
    channelId?: string;
};
export type ChannelSubscription = {
    id?: string;
    channelId?: string;
    userId?: string;
    tier?: number;
    state?: ChannelSubscriptionState;
    createdAt?: string;
    activatedAt?: string;
    renewedAt?: string;
    expiresAt?: string;
    cancelledAt?: string;
    terminatedAt?: string;
    paymentFailedAt?: string;
    giverId?: string;
    cancelReason?: ChannelSubscriptionCancelReason;
    provider?: ChannelSubscriptionProvider;
    externalReference?: string;
};
export type SubscriptionUpdateMeta = {
    giverId?: string;
};
export type ChannelSubscriptionUpdateEvent = {
    subscription?: ChannelSubscription;
    updateType?: ChannelSubscriptionUpdateEventUpdateType;
    updatedAt?: string;
    meta?: SubscriptionUpdateMeta;
};
export type GiftSubscriptionOrderTask = {
    id?: string;
    channelId?: string;
    tier?: number;
    orderId?: string;
    giverId?: string;
    recipientIds?: string[];
    amount?: number;
    allocatedIds?: string[];
    status?: TaskStatus;
    createdAt?: string;
    updatedAt?: string;
    giftAnonymously?: boolean;
};
export type GiftSubscriptionOrderTaskUpdateEvent = {
    task?: GiftSubscriptionOrderTask;
    updateType?: TaskUpdateType;
    updatedAt?: string;
};
export type GiftSubscriptionAllocationTask = {
    taskId?: string;
    parentTaskId?: string;
    channelId?: string;
    tier?: number;
    recipientId?: string;
    giverId?: string;
    subscriptionId?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: TaskStatus;
};
export type GiftSubscriptionAllocationTaskUpdateEvent = {
    task?: GiftSubscriptionAllocationTask;
    updateType?: TaskUpdateType;
    updatedAt?: string;
};
type BaseListUserChannelSubscriptionsRequestFilter = {};
export type ListUserChannelSubscriptionsRequestFilter = BaseListUserChannelSubscriptionsRequestFilter & OneOf<{
    state: ChannelSubscriptionState;
    paymentFailed: boolean;
}>;
export type ListUserChannelSubscriptionsRequest = {
    userId?: string;
    cursor?: ApiCursor.Cursor;
    filters?: ListUserChannelSubscriptionsRequestFilter[];
};
export type ListUserChannelSubscriptionsResponse = {
    subscriptions?: ChannelSubscription[];
    pageInfo?: ApiCursor.PageInfo;
};
export type CreateGiftSubscriptionTaskRequest = {
    id?: string;
    channelId?: string;
    tier?: number;
    orderId?: string;
    giverId?: string;
    recipientIds?: string[];
    amount?: number;
    giftAnonymously?: boolean;
};
export interface IListUserChannelSubscriptionsRequestFilterFilterDelegate<C> {
    onState(ctx: C, ev: ChannelSubscriptionState): void;
    onPaymentFailed(ctx: C, ev: boolean): void;
}
export declare function routeListUserChannelSubscriptionsRequestFilterFilterDelegate<C>(ctx: C, val: ListUserChannelSubscriptionsRequestFilter, delegate: IListUserChannelSubscriptionsRequestFilterFilterDelegate<C>): void;
export declare class ChannelSubscriptionService {
    static GetChannelSubscriptionConfig(req: GetChannelSubscriptionConfigRequest, initReq?: fm.InitReq): Promise<ChannelSubscriptionConfig>;
    static UpdateChannelSubscriptionConfig(req: UpdateChannelSubscriptionConfigRequest, initReq?: fm.InitReq): Promise<ChannelSubscriptionConfig>;
    static CheckoutNewSubscription(req: CheckoutNewSubscriptionRequest, initReq?: fm.InitReq): Promise<CheckoutNewSubscriptionResponse>;
    static UpdateSubscriptionPaymentMethod(req: UpdateSubscriptionPaymentMethodRequest, initReq?: fm.InitReq): Promise<UpdateSubscriptionPaymentMethodResponse>;
    static CheckoutExistingSubscription(req: CheckoutExistingSubscriptionRequest, initReq?: fm.InitReq): Promise<CheckoutExistingSubscriptionResponse>;
    static CancelSubscription(req: CancelSubscriptionRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ReactivateSubscription(req: ReactivateSubscriptionRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetUserChannelSubscription(req: GetUserChannelSubscriptionRequest, initReq?: fm.InitReq): Promise<ChannelSubscription>;
    static ListChannelSubscriptionTiers(req: ListChannelSubscriptionTiersRequest, initReq?: fm.InitReq): Promise<ListChannelSubscriptionTiersResponse>;
    static ListUserChannelSubscriptions(req: ListUserChannelSubscriptionsRequest, initReq?: fm.InitReq): Promise<ListUserChannelSubscriptionsResponse>;
}
export declare class ChannelSubscriptionInternalService {
    static CreateGiftSubscriptionTask(req: CreateGiftSubscriptionTaskRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
export {};
//# sourceMappingURL=subscription.pb.d.ts.map