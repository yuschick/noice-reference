/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb"
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

export enum ItemType {
  ITEM_TYPE_UNSPECIFIED = "ITEM_TYPE_UNSPECIFIED",
  ITEM_TYPE_CURRENCY_PACK = "ITEM_TYPE_CURRENCY_PACK",
  ITEM_TYPE_STANDARD_CARD_BUNDLE = "ITEM_TYPE_STANDARD_CARD_BUNDLE",
  ITEM_TYPE_PREMIUM_CARD_BUNDLE = "ITEM_TYPE_PREMIUM_CARD_BUNDLE",
  ITEM_TYPE_STREAMER_CARD = "ITEM_TYPE_STREAMER_CARD",
  ITEM_TYPE_GIFT_SUBSCRIPTION = "ITEM_TYPE_GIFT_SUBSCRIPTION",
  ITEM_TYPE_AVATAR_PART = "ITEM_TYPE_AVATAR_PART",
}

export enum PriceTier {
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
  PRICE_TIER_10 = "PRICE_TIER_10",
}

export enum RecipientRestriction {
  RECIPIENT_RESTRICTION_UNSPECIFIED = "RECIPIENT_RESTRICTION_UNSPECIFIED",
  RECIPIENT_RESTRICTION_GIFT_ONLY = "RECIPIENT_RESTRICTION_GIFT_ONLY",
  RECIPIENT_RESTRICTION_SELF_ONLY = "RECIPIENT_RESTRICTION_SELF_ONLY",
}

export enum OrderStatus {
  ORDER_STATUS_UNSPECIFIED = "ORDER_STATUS_UNSPECIFIED",
  ORDER_STATUS_PENDING = "ORDER_STATUS_PENDING",
  ORDER_STATUS_COMPLETED = "ORDER_STATUS_COMPLETED",
  ORDER_STATUS_FAILED = "ORDER_STATUS_FAILED",
  ORDER_STATUS_REFUNDED = "ORDER_STATUS_REFUNDED",
  ORDER_STATUS_REVERSED = "ORDER_STATUS_REVERSED",
  ORDER_STATUS_CANCELLED = "ORDER_STATUS_CANCELLED",
}

export enum StoreType {
  STORE_TYPE_UNSPECIFIED = "STORE_TYPE_UNSPECIFIED",
  STORE_TYPE_PLATFORM = "STORE_TYPE_PLATFORM",
  STORE_TYPE_CHANNEL = "STORE_TYPE_CHANNEL",
  STORE_TYPE_AVATAR_EDITOR = "STORE_TYPE_AVATAR_EDITOR",
}

export enum PaymentMethod {
  PAYMENT_METHOD_UNSPECIFIED = "PAYMENT_METHOD_UNSPECIFIED",
  PAYMENT_METHOD_ADYEN = "PAYMENT_METHOD_ADYEN",
  PAYMENT_METHOD_APPSTORE = "PAYMENT_METHOD_APPSTORE",
}

export enum SellableItemConfigPriceType {
  PRICE_TYPE_UNSPECIFIED = "PRICE_TYPE_UNSPECIFIED",
  PRICE_TYPE_TOTAL = "PRICE_TYPE_TOTAL",
  PRICE_TYPE_UNIT = "PRICE_TYPE_UNIT",
}

export type PurchaseLimits = {
  perUser?: string
  perItem?: string
}

export type Period = {
  from?: string
  until?: string
}

export type PriceConfig = {
  currencyId?: string
  amount?: string
  default?: boolean
}

export type SellableItemOptionsCurrencyPack = {
  currencyId?: string
  amount?: string
}

export type SellableItemOptionsCardBundle = {
  cardBundleId?: string
}

export type SellableItemOptionsSubscription = {
  tier?: string
  amount?: string
}


type BaseSellableItemOptions = {
}

export type SellableItemOptions = BaseSellableItemOptions
  & OneOf<{ currencyPack: SellableItemOptionsCurrencyPack; cardBundle: SellableItemOptionsCardBundle; subscription: SellableItemOptionsSubscription }>

export type SellableItemConfig = {
  id?: string
  type?: ItemType
  name?: string
  imageUrl?: string
  enabled?: boolean
  purchaseLimits?: PurchaseLimits
  priceTier?: PriceTier
  igcPrices?: PriceConfig[]
  options?: SellableItemOptions
  recipientRestriction?: RecipientRestriction
  priceType?: SellableItemConfigPriceType
}

export type PromotionCondition = {
  period?: Period
  itemType?: ItemType
  purchasesLessThan?: string
}

export type Promotion = {
  id?: string
  name?: string
  conditions?: PromotionCondition[]
  discountPercent?: string
}

export type Price = {
  currency?: PaymentPayment.Currency
  amount?: string
  amountWithoutDiscount?: string
}

export type InGameCurrencyPrice = {
  currencyId?: string
  amount?: string
  amountWithoutDiscount?: string
  default?: boolean
}

export type ItemRef = {
  id?: string
  count?: string
}

export type CurrencyRef = {
  id?: string
  amount?: string
}

export type SubscriptionRef = {
  id?: string
  channelId?: string
  tier?: string
  amount?: string
}


type BaseContent = {
}

export type Content = BaseContent
  & OneOf<{ item: ItemRef; currency: CurrencyRef; subscription: SubscriptionRef }>

export type SellableItemMeta = {
  storeType?: StoreType
  storeFrontId?: string
  channelId?: string
  promotionId?: string
  configId?: string
  itemType?: ItemType
}

export type SellableItem = {
  id?: string
  sku?: string
  name?: string
  type?: ItemType
  price?: Price
  igcPrices?: InGameCurrencyPrice[]
  content?: Content[]
  promotionName?: string
  signature?: string
  discountPercent?: string
  purchaseLimits?: PurchaseLimits
  availableUntil?: string
  meta?: SellableItemMeta
  recipientRestriction?: RecipientRestriction
}

export type PaymentInfo = {
  reference?: string
  cardIssueCountry?: string
  amount?: PaymentPayment.Amount
}


type BaseOrder = {
  orderId?: string
  status?: OrderStatus
  userId?: string
  createdAt?: string
  sku?: string
  content?: Content[]
  paymentInfo?: PaymentInfo
  description?: string
  sellableItemMeta?: SellableItemMeta
  giftOptions?: GiftOptions
}

export type Order = BaseOrder
  & OneOf<{ price: Price; igcPrice: InGameCurrencyPrice }>

export type ContentList = {
  content?: Content[]
}


type BaseOrderTotal = {
}

export type OrderTotal = BaseOrderTotal
  & OneOf<{ price: Price; igcPrice: InGameCurrencyPrice }>

export type OrderUpdateEvent = {
  order?: Order
  updatedAt?: string
}

export type StoreFrontConfig = {
  id?: string
  type?: StoreType
  channelId?: string
  categories?: StoreFrontCategoryConfig[]
}

export type StoreFrontCategoryConfig = {
  id?: string
  itemType?: ItemType
  sellableItemConfigIds?: string[]
}

export type StoreFrontCategory = {
  id?: string
  itemType?: ItemType
  sellableItems?: SellableItem[]
}

export type StoreFront = {
  id?: string
  type?: StoreType
  categories?: StoreFrontCategory[]
  gameId?: string
}

export type GetPlatformStoreFrontRequest = {
  gameId?: string
}

export type GetChannelStoreFrontRequest = {
  channelId?: string
  gameId?: string
}

export type GetAvatarEditorStoreFrontRequest = {
}

export type GetSellableItemRequest = {
  id?: string
}

export type ListTopUpSellableItemsRequest = {
  currencyId?: string
  minAmount?: string
}

export type ListTopUpSellableItemsResponse = {
  items?: SellableItem[]
}

export type ListGiftSellableItemsRequest = {
  itemType?: ItemType
  channelId?: string
}

export type ListGiftSellableItemsResponse = {
  items?: SellableItem[]
}

export type ListSellableItemsRequestPlatformStoreFilter = {
  gameId?: string
  itemType?: ItemType
  categoryId?: string
}

export type ListSellableItemsRequestChannelStoreFilter = {
  channelId?: string
  gameId?: string
  itemType?: ItemType
  categoryId?: string
}


type BaseListSellableItemsRequestFilter = {
}

export type ListSellableItemsRequestFilter = BaseListSellableItemsRequestFilter
  & OneOf<{ platform: ListSellableItemsRequestPlatformStoreFilter; channel: ListSellableItemsRequestChannelStoreFilter }>

export type ListSellableItemsRequest = {
  filter?: ListSellableItemsRequestFilter
  cursor?: ApiCursor.Cursor
}

export type ListSellableItemsResponse = {
  items?: SellableItem[]
  pageInfo?: ApiCursor.PageInfo
}

export type GiftOptions = {
  recipientIds?: string[]
  giftAnonymously?: boolean
}

export type BuyWithInGameCurrencyRequest = {
  itemId?: string
  signature?: string
  currencyId?: string
  giftOptions?: GiftOptions
}

export type BuyWithInGameCurrencyResponse = {
  orderId?: string
}

export type BuyWithPaymentRequest = {
  itemId?: string
  signature?: string
  giftOptions?: GiftOptions
  paymentMethod?: PaymentMethod
}

export type BuyWithPaymentResponse = {
  session?: PaymentPayment.Session
  orderId?: string
}

export type CreateStreamerCardSaleConfigRequest = {
  channelId?: string
  cardId?: string
  enabled?: boolean
  period?: Period
  excludeFromBundles?: boolean
}

export type StreamerCardSaleConfig = {
  channelId?: string
  cardId?: string
  enabled?: boolean
  period?: Period
  excludeFromBundles?: boolean
}

export type StreamerCardSaleConfigUpdate = {
  channelId?: string
  cardId?: string
  enabled?: boolean
  period?: Period
  excludeFromBundles?: boolean
  unsetPeriod?: boolean
}

export type UpdateStreamerCardSaleConfigRequest = {
  body?: StreamerCardSaleConfigUpdate
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type ListStreamerCardSaleConfigsRequest = {
  channelId?: string
  cursor?: ApiCursor.Cursor
}

export type ListStreamerCardSaleConfigsResponse = {
  configs?: StreamerCardSaleConfig[]
  pageInfo?: ApiCursor.PageInfo
}

export type CancelOrderRequest = {
  orderId?: string
}

export type BatchGetStreamerCardSaleConfigsRequest = {
  channelId?: string
  cardIds?: string[]
}

export type BatchGetStreamerCardSaleConfigsResponse = {
  configs?: StreamerCardSaleConfig[]
}




export interface ISellableItemOptionsValueDelegate<C> {
  onCurrencyPack(ctx: C, ev: SellableItemOptionsCurrencyPack): void
  onCardBundle(ctx: C, ev: SellableItemOptionsCardBundle): void
  onSubscription(ctx: C, ev: SellableItemOptionsSubscription): void
}

export function routeSellableItemOptionsValueDelegate<C>(ctx: C, val: SellableItemOptions, delegate: ISellableItemOptionsValueDelegate<C>) {
  val?.currencyPack && delegate.onCurrencyPack(ctx, val.currencyPack)
  val?.cardBundle && delegate.onCardBundle(ctx, val.cardBundle)
  val?.subscription && delegate.onSubscription(ctx, val.subscription)
}




export interface IContentValueDelegate<C> {
  onItem(ctx: C, ev: ItemRef): void
  onCurrency(ctx: C, ev: CurrencyRef): void
  onSubscription(ctx: C, ev: SubscriptionRef): void
}

export function routeContentValueDelegate<C>(ctx: C, val: Content, delegate: IContentValueDelegate<C>) {
  val?.item && delegate.onItem(ctx, val.item)
  val?.currency && delegate.onCurrency(ctx, val.currency)
  val?.subscription && delegate.onSubscription(ctx, val.subscription)
}




export interface IOrderOrderTotalDelegate<C> {
  onPrice(ctx: C, ev: Price): void
  onIgcPrice(ctx: C, ev: InGameCurrencyPrice): void
}

export function routeOrderOrderTotalDelegate<C>(ctx: C, val: Order, delegate: IOrderOrderTotalDelegate<C>) {
  val?.price && delegate.onPrice(ctx, val.price)
  val?.igcPrice && delegate.onIgcPrice(ctx, val.igcPrice)
}




export interface IOrderTotalValueDelegate<C> {
  onPrice(ctx: C, ev: Price): void
  onIgcPrice(ctx: C, ev: InGameCurrencyPrice): void
}

export function routeOrderTotalValueDelegate<C>(ctx: C, val: OrderTotal, delegate: IOrderTotalValueDelegate<C>) {
  val?.price && delegate.onPrice(ctx, val.price)
  val?.igcPrice && delegate.onIgcPrice(ctx, val.igcPrice)
}




export interface IListSellableItemsRequestFilterFilterDelegate<C> {
  onPlatform(ctx: C, ev: ListSellableItemsRequestPlatformStoreFilter): void
  onChannel(ctx: C, ev: ListSellableItemsRequestChannelStoreFilter): void
}

export function routeListSellableItemsRequestFilterFilterDelegate<C>(ctx: C, val: ListSellableItemsRequestFilter, delegate: IListSellableItemsRequestFilterFilterDelegate<C>) {
  val?.platform && delegate.onPlatform(ctx, val.platform)
  val?.channel && delegate.onChannel(ctx, val.channel)
}

export class StoreServiceV2 {
  static GetPlatformStoreFront(req: GetPlatformStoreFrontRequest, initReq?: fm.InitReq): Promise<StoreFront> {
    return fm.fetchReq<GetPlatformStoreFrontRequest, StoreFront>(`/v1/store/storeFront:platform?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetChannelStoreFront(req: GetChannelStoreFrontRequest, initReq?: fm.InitReq): Promise<StoreFront> {
    return fm.fetchReq<GetChannelStoreFrontRequest, StoreFront>(`/v1/store/storeFront:channel?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetAvatarEditorStoreFront(req: GetAvatarEditorStoreFrontRequest, initReq?: fm.InitReq): Promise<StoreFront> {
    return fm.fetchReq<GetAvatarEditorStoreFrontRequest, StoreFront>(`/v1/store/storeFront:avatarEditor?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetSellableItem(req: GetSellableItemRequest, initReq?: fm.InitReq): Promise<SellableItem> {
    return fm.fetchReq<GetSellableItemRequest, SellableItem>(`/v1/store/sellableItems/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static ListTopUpSellableItems(req: ListTopUpSellableItemsRequest, initReq?: fm.InitReq): Promise<ListTopUpSellableItemsResponse> {
    return fm.fetchReq<ListTopUpSellableItemsRequest, ListTopUpSellableItemsResponse>(`/v1/store/sellableItems:topUp?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListGiftSellableItems(req: ListGiftSellableItemsRequest, initReq?: fm.InitReq): Promise<ListGiftSellableItemsResponse> {
    return fm.fetchReq<ListGiftSellableItemsRequest, ListGiftSellableItemsResponse>(`/v1/store/sellableItems:gift?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListSellableItems(req: ListSellableItemsRequest, initReq?: fm.InitReq): Promise<ListSellableItemsResponse> {
    return fm.fetchReq<ListSellableItemsRequest, ListSellableItemsResponse>(`/v1/store/sellableItems?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static BuyWithInGameCurrency(req: BuyWithInGameCurrencyRequest, initReq?: fm.InitReq): Promise<BuyWithInGameCurrencyResponse> {
    return fm.fetchReq<BuyWithInGameCurrencyRequest, BuyWithInGameCurrencyResponse>(`/v1/store/sellableItems:buyWithInGameCurrency`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static BuyWithPayment(req: BuyWithPaymentRequest, initReq?: fm.InitReq): Promise<BuyWithPaymentResponse> {
    return fm.fetchReq<BuyWithPaymentRequest, BuyWithPaymentResponse>(`/v1/store/sellableItems:buyWithPayment`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CancelOrder(req: CancelOrderRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CancelOrderRequest, GoogleProtobufEmpty.Empty>(`/v1/store/orders/${req["orderId"]}:cancel`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CreateStreamerCardSaleConfig(req: CreateStreamerCardSaleConfigRequest, initReq?: fm.InitReq): Promise<StreamerCardSaleConfig> {
    return fm.fetchReq<CreateStreamerCardSaleConfigRequest, StreamerCardSaleConfig>(`/v1/store/streamerCardSaleConfigs`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateStreamerCardSaleConfig(req: UpdateStreamerCardSaleConfigRequest, initReq?: fm.InitReq): Promise<StreamerCardSaleConfig> {
    return fm.fetchReq<UpdateStreamerCardSaleConfigRequest, StreamerCardSaleConfig>(`/v1/store/streamerCardSaleConfigs`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static ListStreamerCardSaleConfigs(req: ListStreamerCardSaleConfigsRequest, initReq?: fm.InitReq): Promise<ListStreamerCardSaleConfigsResponse> {
    return fm.fetchReq<ListStreamerCardSaleConfigsRequest, ListStreamerCardSaleConfigsResponse>(`/v1/store/streamerCardSaleConfigs?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static BatchGetStreamerCardSaleConfigs(req: BatchGetStreamerCardSaleConfigsRequest, initReq?: fm.InitReq): Promise<BatchGetStreamerCardSaleConfigsResponse> {
    return fm.fetchReq<BatchGetStreamerCardSaleConfigsRequest, BatchGetStreamerCardSaleConfigsResponse>(`/v1/store/streamerCardSaleConfigs:batchGet`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}