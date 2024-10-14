import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
import * as PaymentPayment from "../payment/payment.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum ItemType {
    ITEM_TYPE_UNSPECIFIED = "ITEM_TYPE_UNSPECIFIED",
    ITEM_TYPE_CURRENCY_PACK = "ITEM_TYPE_CURRENCY_PACK",
    ITEM_TYPE_STANDARD_CARD_BUNDLE = "ITEM_TYPE_STANDARD_CARD_BUNDLE",
    ITEM_TYPE_PREMIUM_CARD_BUNDLE = "ITEM_TYPE_PREMIUM_CARD_BUNDLE",
    ITEM_TYPE_STREAMER_CARD = "ITEM_TYPE_STREAMER_CARD",
    ITEM_TYPE_GIFT_SUBSCRIPTION = "ITEM_TYPE_GIFT_SUBSCRIPTION"
}
export declare enum PriceTier {
    PRICE_TIER_UNSPECIFIED = "PRICE_TIER_UNSPECIFIED",
    PRICE_TIER_1 = "PRICE_TIER_1",
    PRICE_TIER_2 = "PRICE_TIER_2",
    PRICE_TIER_3 = "PRICE_TIER_3",
    PRICE_TIER_4 = "PRICE_TIER_4",
    PRICE_TIER_5 = "PRICE_TIER_5",
    PRICE_TIER_6 = "PRICE_TIER_6",
    PRICE_TIER_7 = "PRICE_TIER_7",
    PRICE_TIER_8 = "PRICE_TIER_8",
    PRICE_TIER_9 = "PRICE_TIER_9",
    PRICE_TIER_10 = "PRICE_TIER_10"
}
export declare enum RecipientRestriction {
    RECIPIENT_RESTRICTION_UNSPECIFIED = "RECIPIENT_RESTRICTION_UNSPECIFIED",
    RECIPIENT_RESTRICTION_GIFT_ONLY = "RECIPIENT_RESTRICTION_GIFT_ONLY",
    RECIPIENT_RESTRICTION_SELF_ONLY = "RECIPIENT_RESTRICTION_SELF_ONLY"
}
export declare enum OrderStatus {
    ORDER_STATUS_UNSPECIFIED = "ORDER_STATUS_UNSPECIFIED",
    ORDER_STATUS_PENDING = "ORDER_STATUS_PENDING",
    ORDER_STATUS_COMPLETED = "ORDER_STATUS_COMPLETED",
    ORDER_STATUS_FAILED = "ORDER_STATUS_FAILED",
    ORDER_STATUS_REFUNDED = "ORDER_STATUS_REFUNDED",
    ORDER_STATUS_REVERSED = "ORDER_STATUS_REVERSED",
    ORDER_STATUS_CANCELLED = "ORDER_STATUS_CANCELLED"
}
export declare enum StoreType {
    STORE_TYPE_UNSPECIFIED = "STORE_TYPE_UNSPECIFIED",
    STORE_TYPE_PLATFORM = "STORE_TYPE_PLATFORM",
    STORE_TYPE_CHANNEL = "STORE_TYPE_CHANNEL"
}
export type PurchaseLimits = {
    perUser?: string;
    perItem?: string;
};
export type Period = {
    from?: string;
    until?: string;
};
export type PriceConfig = {
    currencyId?: string;
    amount?: string;
    default?: boolean;
};
export type SellableItemOptionsCurrencyPack = {
    currencyId?: string;
    amount?: string;
};
export type SellableItemOptionsCardBundle = {
    cardBundleId?: string;
};
type BaseSellableItemOptions = {};
export type SellableItemOptions = BaseSellableItemOptions & OneOf<{
    currencyPack: SellableItemOptionsCurrencyPack;
    cardBundle: SellableItemOptionsCardBundle;
}>;
export type SellableItemConfig = {
    id?: string;
    type?: ItemType;
    name?: string;
    imageUrl?: string;
    enabled?: boolean;
    purchaseLimits?: PurchaseLimits;
    priceTier?: PriceTier;
    igcPrices?: PriceConfig[];
    options?: SellableItemOptions;
    recipientRestriction?: RecipientRestriction;
};
export type PromotionCondition = {
    period?: Period;
    itemType?: ItemType;
    purchasesLessThan?: string;
};
export type Promotion = {
    id?: string;
    name?: string;
    conditions?: PromotionCondition[];
    discountPercent?: string;
};
export type Price = {
    currency?: PaymentPayment.Currency;
    amount?: string;
    amountWithoutDiscount?: string;
};
export type InGameCurrencyPrice = {
    currencyId?: string;
    amount?: string;
    amountWithoutDiscount?: string;
    default?: boolean;
};
export type ItemRef = {
    id?: string;
    count?: string;
};
export type CurrencyRef = {
    id?: string;
    amount?: string;
};
export type SubscriptionRef = {
    id?: string;
    channelId?: string;
    tier?: string;
    amount?: string;
};
type BaseContent = {};
export type Content = BaseContent & OneOf<{
    item: ItemRef;
    currency: CurrencyRef;
    subscription: SubscriptionRef;
}>;
export type SellableItemMeta = {
    storeType?: StoreType;
    storeFrontId?: string;
    channelId?: string;
    promotionId?: string;
    configId?: string;
    itemType?: ItemType;
};
export type SellableItem = {
    id?: string;
    sku?: string;
    name?: string;
    type?: ItemType;
    price?: Price;
    igcPrices?: InGameCurrencyPrice[];
    content?: Content[];
    promotionName?: string;
    signature?: string;
    discountPercent?: string;
    purchaseLimits?: PurchaseLimits;
    availableUntil?: string;
    meta?: SellableItemMeta;
    recipientRestriction?: RecipientRestriction;
};
export type PaymentInfo = {
    reference?: string;
    cardIssueCountry?: string;
};
type BaseOrder = {
    orderId?: string;
    status?: OrderStatus;
    userId?: string;
    createdAt?: string;
    sku?: string;
    content?: Content[];
    paymentInfo?: PaymentInfo;
    description?: string;
    sellableItemMeta?: SellableItemMeta;
    giftOptions?: GiftOptions;
};
export type Order = BaseOrder & OneOf<{
    price: Price;
    igcPrice: InGameCurrencyPrice;
}>;
export type ContentList = {
    content?: Content[];
};
type BaseOrderTotal = {};
export type OrderTotal = BaseOrderTotal & OneOf<{
    price: Price;
    igcPrice: InGameCurrencyPrice;
}>;
export type OrderUpdateEvent = {
    order?: Order;
    updatedAt?: string;
};
export type StoreFrontConfig = {
    id?: string;
    type?: StoreType;
    channelId?: string;
    categories?: StoreFrontCategoryConfig[];
};
export type StoreFrontCategoryConfig = {
    id?: string;
    itemType?: ItemType;
    sellableItemConfigIds?: string[];
};
export type StoreFrontCategory = {
    id?: string;
    itemType?: ItemType;
    sellableItems?: SellableItem[];
};
export type StoreFront = {
    id?: string;
    type?: StoreType;
    categories?: StoreFrontCategory[];
    gameId?: string;
};
export type GetPlatformStoreFrontRequest = {
    gameId?: string;
};
export type GetChannelStoreFrontRequest = {
    channelId?: string;
    gameId?: string;
};
export type GetSellableItemRequest = {
    id?: string;
};
export type ListTopUpSellableItemsRequest = {
    currencyId?: string;
    minAmount?: string;
};
export type ListTopUpSellableItemsResponse = {
    items?: SellableItem[];
};
export type ListGiftSellableItemsRequest = {
    itemType?: ItemType;
    channelId?: string;
};
export type ListGiftSellableItemsResponse = {
    items?: SellableItem[];
};
export type ListSellableItemsRequestPlatformStoreFilter = {
    gameId?: string;
    itemType?: ItemType;
};
export type ListSellableItemsRequestChannelStoreFilter = {
    channelId?: string;
    gameId?: string;
    itemType?: ItemType;
};
type BaseListSellableItemsRequestFilter = {};
export type ListSellableItemsRequestFilter = BaseListSellableItemsRequestFilter & OneOf<{
    platform: ListSellableItemsRequestPlatformStoreFilter;
    channel: ListSellableItemsRequestChannelStoreFilter;
}>;
export type ListSellableItemsRequest = {
    filter?: ListSellableItemsRequestFilter;
    cursor?: ApiCursor.Cursor;
};
export type ListSellableItemsResponse = {
    items?: SellableItem[];
    pageInfo?: ApiCursor.PageInfo;
};
export type GiftOptions = {
    recipientIds?: string[];
    giftAnonymously?: boolean;
};
export type BuyWithInGameCurrencyRequest = {
    itemId?: string;
    signature?: string;
    currencyId?: string;
    giftOptions?: GiftOptions;
};
export type BuyWithInGameCurrencyResponse = {
    orderId?: string;
};
export type BuyWithPaymentRequest = {
    itemId?: string;
    signature?: string;
    giftOptions?: GiftOptions;
};
export type BuyWithPaymentResponse = {
    session?: PaymentPayment.Session;
    orderId?: string;
};
export type CreateStreamerCardSaleConfigRequest = {
    channelId?: string;
    cardId?: string;
    enabled?: boolean;
    period?: Period;
    excludeFromBundles?: boolean;
};
export type StreamerCardSaleConfig = {
    channelId?: string;
    cardId?: string;
    enabled?: boolean;
    period?: Period;
    excludeFromBundles?: boolean;
};
export type StreamerCardSaleConfigUpdate = {
    channelId?: string;
    cardId?: string;
    enabled?: boolean;
    period?: Period;
    excludeFromBundles?: boolean;
    unsetPeriod?: boolean;
};
export type UpdateStreamerCardSaleConfigRequest = {
    body?: StreamerCardSaleConfigUpdate;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type ListStreamerCardSaleConfigsRequest = {
    channelId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListStreamerCardSaleConfigsResponse = {
    configs?: StreamerCardSaleConfig[];
    pageInfo?: ApiCursor.PageInfo;
};
export type CancelOrderRequest = {
    orderId?: string;
};
export type BatchGetStreamerCardSaleConfigsRequest = {
    channelId?: string;
    cardIds?: string[];
};
export type BatchGetStreamerCardSaleConfigsResponse = {
    configs?: StreamerCardSaleConfig[];
};
export interface ISellableItemOptionsValueDelegate<C> {
    onCurrencyPack(ctx: C, ev: SellableItemOptionsCurrencyPack): void;
    onCardBundle(ctx: C, ev: SellableItemOptionsCardBundle): void;
}
export declare function routeSellableItemOptionsValueDelegate<C>(ctx: C, val: SellableItemOptions, delegate: ISellableItemOptionsValueDelegate<C>): void;
export interface IContentValueDelegate<C> {
    onItem(ctx: C, ev: ItemRef): void;
    onCurrency(ctx: C, ev: CurrencyRef): void;
    onSubscription(ctx: C, ev: SubscriptionRef): void;
}
export declare function routeContentValueDelegate<C>(ctx: C, val: Content, delegate: IContentValueDelegate<C>): void;
export interface IOrderOrderTotalDelegate<C> {
    onPrice(ctx: C, ev: Price): void;
    onIgcPrice(ctx: C, ev: InGameCurrencyPrice): void;
}
export declare function routeOrderOrderTotalDelegate<C>(ctx: C, val: Order, delegate: IOrderOrderTotalDelegate<C>): void;
export interface IOrderTotalValueDelegate<C> {
    onPrice(ctx: C, ev: Price): void;
    onIgcPrice(ctx: C, ev: InGameCurrencyPrice): void;
}
export declare function routeOrderTotalValueDelegate<C>(ctx: C, val: OrderTotal, delegate: IOrderTotalValueDelegate<C>): void;
export interface IListSellableItemsRequestFilterFilterDelegate<C> {
    onPlatform(ctx: C, ev: ListSellableItemsRequestPlatformStoreFilter): void;
    onChannel(ctx: C, ev: ListSellableItemsRequestChannelStoreFilter): void;
}
export declare function routeListSellableItemsRequestFilterFilterDelegate<C>(ctx: C, val: ListSellableItemsRequestFilter, delegate: IListSellableItemsRequestFilterFilterDelegate<C>): void;
export declare class StoreServiceV2 {
    static GetPlatformStoreFront(req: GetPlatformStoreFrontRequest, initReq?: fm.InitReq): Promise<StoreFront>;
    static GetChannelStoreFront(req: GetChannelStoreFrontRequest, initReq?: fm.InitReq): Promise<StoreFront>;
    static GetSellableItem(req: GetSellableItemRequest, initReq?: fm.InitReq): Promise<SellableItem>;
    static ListTopUpSellableItems(req: ListTopUpSellableItemsRequest, initReq?: fm.InitReq): Promise<ListTopUpSellableItemsResponse>;
    static ListGiftSellableItems(req: ListGiftSellableItemsRequest, initReq?: fm.InitReq): Promise<ListGiftSellableItemsResponse>;
    static ListSellableItems(req: ListSellableItemsRequest, initReq?: fm.InitReq): Promise<ListSellableItemsResponse>;
    static BuyWithInGameCurrency(req: BuyWithInGameCurrencyRequest, initReq?: fm.InitReq): Promise<BuyWithInGameCurrencyResponse>;
    static BuyWithPayment(req: BuyWithPaymentRequest, initReq?: fm.InitReq): Promise<BuyWithPaymentResponse>;
    static CancelOrder(req: CancelOrderRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static CreateStreamerCardSaleConfig(req: CreateStreamerCardSaleConfigRequest, initReq?: fm.InitReq): Promise<StreamerCardSaleConfig>;
    static UpdateStreamerCardSaleConfig(req: UpdateStreamerCardSaleConfigRequest, initReq?: fm.InitReq): Promise<StreamerCardSaleConfig>;
    static ListStreamerCardSaleConfigs(req: ListStreamerCardSaleConfigsRequest, initReq?: fm.InitReq): Promise<ListStreamerCardSaleConfigsResponse>;
    static BatchGetStreamerCardSaleConfigs(req: BatchGetStreamerCardSaleConfigsRequest, initReq?: fm.InitReq): Promise<BatchGetStreamerCardSaleConfigsResponse>;
}
export {};
//# sourceMappingURL=storev2.pb.d.ts.map