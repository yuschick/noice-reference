/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as AttributeAttribute from "../attribute/attribute.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as PaymentPayment from "../payment/payment.pb"
import * as StoreStore from "../store/store.pb"
import * as StoreV2Storev2 from "../store/storev2.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum ReasonMetadataField {
  UNSPECIFIED = "UNSPECIFIED",
  TEAM_PLAYER_BONUS_XP = "TEAM_PLAYER_BONUS_XP",
  TEAM_PLAYER_BONUS_COINS = "TEAM_PLAYER_BONUS_COINS",
  PARTICIPATION_BONUS_XP = "PARTICIPATION_BONUS_XP",
  PARTICIPATION_BONUS_COINS = "PARTICIPATION_BONUS_COINS",
  DAILY_BOOST_XP = "DAILY_BOOST_XP",
}

export enum RevenueRecipientKind {
  KIND_UNSPECIFIED = "KIND_UNSPECIFIED",
  KIND_PLATFORM = "KIND_PLATFORM",
  KIND_CHANNEL = "KIND_CHANNEL",
}

export type RevenueRecipient = {
  kind?: RevenueRecipientKind
  recipientId?: string
}

export type RevenueShare = {
  recipient?: RevenueRecipient
  percent?: string
}

export type ReasonGoalCardComplete = {
  goalCardSlotId?: string
  goalCardId?: string
}

export type ReasonMatchEnd = {
  groupId?: string
}

export type ReasonStorePurchase = {
  storeItemId?: string
  itemIds?: string[]
  storeItemType?: StoreStore.StoreItemType
}

export type ReasonRewardClaimed = {
  rewardId?: string
  rewardReason?: Reason
}

export type ReasonAdministrative = {
  reason?: string
  userId?: string
}

export type ReasonGoalCardSlotReshuffle = {
  goalCardSlotId?: string
}

export type ReasonReshuffle = {
  streamId?: string
  groupId?: string
  matchId?: string
}

export type ReasonLevelUp = {
  level?: string
  seasonId?: string
}

export type ReasonAdWatched = {
  placementId?: string
}

export type ReasonProvision = {
  seasonId?: string
  rev?: string
}

export type ReasonPurchaseWithInGameCurrency = {
  sku?: string
  orderId?: string
  revenueShares?: RevenueShare[]
  itemType?: StoreV2Storev2.ItemType
  adRevenueShares?: RevenueShare[]
}

export type ReasonPurchaseWithPayment = {
  sku?: string
  orderId?: string
  timestamp?: string
  reference?: string
  price?: PaymentPayment.Amount
  cardIssuingCountry?: string
}

export type ReasonChannelSubscription = {
  channelId?: string
}

export type ReasonChannelOwner = {
  channelId?: string
}

export type ReasonStoreOrderPayment = {
  sku?: string
  orderId?: string
  revenueShares?: RevenueShare[]
  itemType?: StoreV2Storev2.ItemType
  adRevenueShares?: RevenueShare[]
}

export type ReasonGiftPurchaseWithInGameCurrency = {
  sku?: string
  orderId?: string
  revenueShares?: RevenueShare[]
  itemType?: StoreV2Storev2.ItemType
  adRevenueShares?: RevenueShare[]
  senderId?: string
}

export type ReasonGiftPurchaseWithPayment = {
  sku?: string
  orderId?: string
  timestamp?: string
  reference?: string
  price?: PaymentPayment.Amount
  cardIssuingCountry?: string
  senderId?: string
}

export type ReasonChallengeSuccessful = {
  challengeId?: string
}


type BaseReason = {
  metadata?: AttributeAttribute.AttributeMap
}

export type Reason = BaseReason
  & OneOf<{ goalCardComplete: ReasonGoalCardComplete; matchEnd: ReasonMatchEnd; rewardClaimed: ReasonRewardClaimed; administrative: ReasonAdministrative; goalCardSlotReshuffle: ReasonGoalCardSlotReshuffle; levelUp: ReasonLevelUp; reshuffle: ReasonReshuffle; adWatched: ReasonAdWatched; provision: ReasonProvision; purchaseWithInGameCurrency: ReasonPurchaseWithInGameCurrency; purchaseWithPayment: ReasonPurchaseWithPayment; channelSubscription: ReasonChannelSubscription; storeOrderPayment: ReasonStoreOrderPayment; channelOwner: ReasonChannelOwner; giftPurchaseWithInGameCurrency: ReasonGiftPurchaseWithInGameCurrency; giftPurchaseWithPayment: ReasonGiftPurchaseWithPayment; challengeSuccessful: ReasonChallengeSuccessful }>




export interface IReasonReasonDelegate<C> {
  onGoalCardComplete(ctx: C, ev: ReasonGoalCardComplete): void
  onMatchEnd(ctx: C, ev: ReasonMatchEnd): void
  onRewardClaimed(ctx: C, ev: ReasonRewardClaimed): void
  onAdministrative(ctx: C, ev: ReasonAdministrative): void
  onGoalCardSlotReshuffle(ctx: C, ev: ReasonGoalCardSlotReshuffle): void
  onLevelUp(ctx: C, ev: ReasonLevelUp): void
  onReshuffle(ctx: C, ev: ReasonReshuffle): void
  onAdWatched(ctx: C, ev: ReasonAdWatched): void
  onProvision(ctx: C, ev: ReasonProvision): void
  onPurchaseWithInGameCurrency(ctx: C, ev: ReasonPurchaseWithInGameCurrency): void
  onPurchaseWithPayment(ctx: C, ev: ReasonPurchaseWithPayment): void
  onChannelSubscription(ctx: C, ev: ReasonChannelSubscription): void
  onStoreOrderPayment(ctx: C, ev: ReasonStoreOrderPayment): void
  onChannelOwner(ctx: C, ev: ReasonChannelOwner): void
  onGiftPurchaseWithInGameCurrency(ctx: C, ev: ReasonGiftPurchaseWithInGameCurrency): void
  onGiftPurchaseWithPayment(ctx: C, ev: ReasonGiftPurchaseWithPayment): void
  onChallengeSuccessful(ctx: C, ev: ReasonChallengeSuccessful): void
}

export function routeReasonReasonDelegate<C>(ctx: C, val: Reason, delegate: IReasonReasonDelegate<C>) {
  val?.goalCardComplete && delegate.onGoalCardComplete(ctx, val.goalCardComplete)
  val?.matchEnd && delegate.onMatchEnd(ctx, val.matchEnd)
  val?.rewardClaimed && delegate.onRewardClaimed(ctx, val.rewardClaimed)
  val?.administrative && delegate.onAdministrative(ctx, val.administrative)
  val?.goalCardSlotReshuffle && delegate.onGoalCardSlotReshuffle(ctx, val.goalCardSlotReshuffle)
  val?.levelUp && delegate.onLevelUp(ctx, val.levelUp)
  val?.reshuffle && delegate.onReshuffle(ctx, val.reshuffle)
  val?.adWatched && delegate.onAdWatched(ctx, val.adWatched)
  val?.provision && delegate.onProvision(ctx, val.provision)
  val?.purchaseWithInGameCurrency && delegate.onPurchaseWithInGameCurrency(ctx, val.purchaseWithInGameCurrency)
  val?.purchaseWithPayment && delegate.onPurchaseWithPayment(ctx, val.purchaseWithPayment)
  val?.channelSubscription && delegate.onChannelSubscription(ctx, val.channelSubscription)
  val?.storeOrderPayment && delegate.onStoreOrderPayment(ctx, val.storeOrderPayment)
  val?.channelOwner && delegate.onChannelOwner(ctx, val.channelOwner)
  val?.giftPurchaseWithInGameCurrency && delegate.onGiftPurchaseWithInGameCurrency(ctx, val.giftPurchaseWithInGameCurrency)
  val?.giftPurchaseWithPayment && delegate.onGiftPurchaseWithPayment(ctx, val.giftPurchaseWithPayment)
  val?.challengeSuccessful && delegate.onChallengeSuccessful(ctx, val.challengeSuccessful)
}