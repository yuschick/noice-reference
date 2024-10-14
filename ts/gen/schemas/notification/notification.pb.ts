/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as AdsAds from "../ads/ads.pb"
import * as ChannelModeration from "../channel/moderation.pb"
import * as fm from "../fetch.pb"
import * as FriendsFriends from "../friends/friends.pb"
import * as Goal_cardGoal_card from "../goal-card/goal_card.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as InventoryInventory from "../inventory/inventory.pb"
import * as InvitationInvitation from "../invitation/invitation.pb"
import * as ModerationPlatform_moderation from "../moderation/platform_moderation.pb"
import * as PartyParty from "../party/party.pb"
import * as PrivacyPrivacy from "../privacy/privacy.pb"
import * as ProfileProfile from "../profile/profile.pb"
import * as ProgressionProgression from "../progression/progression.pb"
import * as RewardReward from "../reward/reward.pb"
import * as SubscriptionSubscription from "../subscription/subscription.pb"
import * as WalletWallet from "../wallet/wallet.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum PushNotificationTokenType {
  PUSH_NOTIFICATION_TOKEN_TYPE_UNSPECIFIED = "PUSH_NOTIFICATION_TOKEN_TYPE_UNSPECIFIED",
  PUSH_NOTIFICATION_TOKEN_TYPE_FIREBASE = "PUSH_NOTIFICATION_TOKEN_TYPE_FIREBASE",
}

export enum PushNotificationSubscriptionState {
  PUSH_NOTIFICATION_SUBSCRIPTION_STATE_UNSPECIFIED = "PUSH_NOTIFICATION_SUBSCRIPTION_STATE_UNSPECIFIED",
  PUSH_NOTIFICATION_SUBSCRIPTION_STATE_ACTIVE = "PUSH_NOTIFICATION_SUBSCRIPTION_STATE_ACTIVE",
  PUSH_NOTIFICATION_SUBSCRIPTION_STATE_INACTIVE = "PUSH_NOTIFICATION_SUBSCRIPTION_STATE_INACTIVE",
  PUSH_NOTIFICATION_SUBSCRIPTION_STATE_USER_SUSPENDED = "PUSH_NOTIFICATION_SUBSCRIPTION_STATE_USER_SUSPENDED",
  PUSH_NOTIFICATION_SUBSCRIPTION_STATE_DELETION_REQUESTED = "PUSH_NOTIFICATION_SUBSCRIPTION_STATE_DELETION_REQUESTED",
  PUSH_NOTIFICATION_SUBSCRIPTION_STATE_USER_CHANNEL_BANNED = "PUSH_NOTIFICATION_SUBSCRIPTION_STATE_USER_CHANNEL_BANNED",
}

export enum PushNotificationTokenUpdateEventUpdateType {
  UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
  UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
  UPDATE_TYPE_DELETED = "UPDATE_TYPE_DELETED",
}

export enum PushNotificationSubscriptionUpdateEventUpdateType {
  UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
  UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
  UPDATE_TYPE_DEACTIVATED = "UPDATE_TYPE_DEACTIVATED",
  UPDATE_TYPE_ACTIVATED = "UPDATE_TYPE_ACTIVATED",
  UPDATE_TYPE_DELETED = "UPDATE_TYPE_DELETED",
}


type BaseNotificationContent = {
}

export type NotificationContent = BaseNotificationContent
  & OneOf<{ ping: number; reward: RewardReward.Reward; goalCardProgress: Goal_cardGoal_card.GoalCardSlot; progressionUpdate: ProgressionProgression.ProgressionUpdateEvent; inventoryUpdate: InventoryInventory.InventoryUpdateEvent; placementStateUpdate: AdsAds.PlacementStateEvent; friendStatusUpdate: FriendsFriends.FriendStatusUpdateEvent; partyInvitationUpdate: PartyParty.PartyInvitationUpdateEvent; userDataExportComplete: PrivacyPrivacy.UserDataExportCompleteEvent; channelUserBanned: ChannelModeration.UserBannedNotification; platformUserBanned: ModerationPlatform_moderation.PlatformUserBannedNotification; channelSubscriptionUpdate: SubscriptionSubscription.ChannelSubscriptionUpdateEvent; walletTransaction: WalletWallet.TransactionEvent; forcedSignout: ForcedSignoutEvent; invitationCodeUpdate: InvitationInvitation.InvitationCodeUpdateEvent; giftSubscription: GiftSubscription; usernameChange: ProfileProfile.UsernameChange }>

export type ForcedSignoutEvent = {
}

export type GiftSubscription = {
  giverId?: string
  channelId?: string
  tier?: number
}

export type Notification = {
  id?: string
  new?: boolean
  persisted?: boolean
  createdAt?: string
  content?: NotificationContent
}

export type NotificationEvent = {
  userId?: string
  notification?: Notification
}

export type ListNotificationsRequest = {
  cursor?: string
}

export type ListNotificationsResponse = {
  notifications?: Notification[]
}

export type MarkNotificationsReadRequest = {
  notificationIds?: string[]
}

export type MarkNotificationReadRequest = {
  id?: string
}

export type BatchMarkNotificationsReadRequest = {
  notificationIds?: string[]
}

export type DeleteNotificationRequest = {
  id?: string
}

export type BatchDeleteNotificationsRequest = {
  notificationIds?: string[]
}

export type NotificationsRequest = {
  cursor?: string
}

export type SendNotificationRequest = {
  userId?: string
  persisted?: boolean
  content?: NotificationContent
}

export type SendNotificationResponse = {
}

export type CreatePushNotificationTokenRequest = {
  token?: string
  tokenType?: PushNotificationTokenType
}

export type DeletePushNotificationTokenRequest = {
  token?: string
}

export type GetPushNotificationTokenRequest = {
  token?: string
}

export type ClearPushNotificationsRequest = {
}

export type PushNotificationToken = {
  userId?: string
  token?: string
  tokenType?: PushNotificationTokenType
}

export type PushNotificationSubscription = {
  userId?: string
  topic?: string
  state?: PushNotificationSubscriptionState
}

export type PushNotificationTokenUpdateEvent = {
  token?: PushNotificationToken
  updateType?: PushNotificationTokenUpdateEventUpdateType
}

export type PushNotificationSubscriptionUpdateEvent = {
  subscription?: PushNotificationSubscription
  updateType?: PushNotificationSubscriptionUpdateEventUpdateType
}

export type PushNotificationPayloadChannelLive = {
  channelId?: string
  channelName?: string
}


type BasePushNotificationPayload = {
}

export type PushNotificationPayload = BasePushNotificationPayload
  & OneOf<{ channelLive: PushNotificationPayloadChannelLive }>

export type SendPushNotificationRequest = {
  topic?: string
  title?: string
  body?: string
  imageUrl?: string
  link?: string
  payload?: PushNotificationPayload
}




export interface INotificationContentContentDelegate<C> {
  onPing(ctx: C, ev: number): void
  onReward(ctx: C, ev: RewardReward.Reward): void
  onGoalCardProgress(ctx: C, ev: Goal_cardGoal_card.GoalCardSlot): void
  onProgressionUpdate(ctx: C, ev: ProgressionProgression.ProgressionUpdateEvent): void
  onInventoryUpdate(ctx: C, ev: InventoryInventory.InventoryUpdateEvent): void
  onPlacementStateUpdate(ctx: C, ev: AdsAds.PlacementStateEvent): void
  onFriendStatusUpdate(ctx: C, ev: FriendsFriends.FriendStatusUpdateEvent): void
  onPartyInvitationUpdate(ctx: C, ev: PartyParty.PartyInvitationUpdateEvent): void
  onUserDataExportComplete(ctx: C, ev: PrivacyPrivacy.UserDataExportCompleteEvent): void
  onChannelUserBanned(ctx: C, ev: ChannelModeration.UserBannedNotification): void
  onPlatformUserBanned(ctx: C, ev: ModerationPlatform_moderation.PlatformUserBannedNotification): void
  onChannelSubscriptionUpdate(ctx: C, ev: SubscriptionSubscription.ChannelSubscriptionUpdateEvent): void
  onWalletTransaction(ctx: C, ev: WalletWallet.TransactionEvent): void
  onForcedSignout(ctx: C, ev: ForcedSignoutEvent): void
  onInvitationCodeUpdate(ctx: C, ev: InvitationInvitation.InvitationCodeUpdateEvent): void
  onGiftSubscription(ctx: C, ev: GiftSubscription): void
  onUsernameChange(ctx: C, ev: ProfileProfile.UsernameChange): void
}

export function routeNotificationContentContentDelegate<C>(ctx: C, val: NotificationContent, delegate: INotificationContentContentDelegate<C>) {
  val?.ping && delegate.onPing(ctx, val.ping)
  val?.reward && delegate.onReward(ctx, val.reward)
  val?.goalCardProgress && delegate.onGoalCardProgress(ctx, val.goalCardProgress)
  val?.progressionUpdate && delegate.onProgressionUpdate(ctx, val.progressionUpdate)
  val?.inventoryUpdate && delegate.onInventoryUpdate(ctx, val.inventoryUpdate)
  val?.placementStateUpdate && delegate.onPlacementStateUpdate(ctx, val.placementStateUpdate)
  val?.friendStatusUpdate && delegate.onFriendStatusUpdate(ctx, val.friendStatusUpdate)
  val?.partyInvitationUpdate && delegate.onPartyInvitationUpdate(ctx, val.partyInvitationUpdate)
  val?.userDataExportComplete && delegate.onUserDataExportComplete(ctx, val.userDataExportComplete)
  val?.channelUserBanned && delegate.onChannelUserBanned(ctx, val.channelUserBanned)
  val?.platformUserBanned && delegate.onPlatformUserBanned(ctx, val.platformUserBanned)
  val?.channelSubscriptionUpdate && delegate.onChannelSubscriptionUpdate(ctx, val.channelSubscriptionUpdate)
  val?.walletTransaction && delegate.onWalletTransaction(ctx, val.walletTransaction)
  val?.forcedSignout && delegate.onForcedSignout(ctx, val.forcedSignout)
  val?.invitationCodeUpdate && delegate.onInvitationCodeUpdate(ctx, val.invitationCodeUpdate)
  val?.giftSubscription && delegate.onGiftSubscription(ctx, val.giftSubscription)
  val?.usernameChange && delegate.onUsernameChange(ctx, val.usernameChange)
}




export interface IPushNotificationPayloadPayloadDelegate<C> {
  onChannelLive(ctx: C, ev: PushNotificationPayloadChannelLive): void
}

export function routePushNotificationPayloadPayloadDelegate<C>(ctx: C, val: PushNotificationPayload, delegate: IPushNotificationPayloadPayloadDelegate<C>) {
  val?.channelLive && delegate.onChannelLive(ctx, val.channelLive)
}

export class NotificationService {
  static ListNotifications(req: ListNotificationsRequest, initReq?: fm.InitReq): Promise<ListNotificationsResponse> {
    return fm.fetchReq<ListNotificationsRequest, ListNotificationsResponse>(`/v1/notifications?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static MarkNotificationsRead(req: MarkNotificationsReadRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<MarkNotificationsReadRequest, GoogleProtobufEmpty.Empty>(`/v1/notifications/read`, {...initReq, method: "POST"})
  }
  static MarkNotificationRead(req: MarkNotificationReadRequest, initReq?: fm.InitReq): Promise<Notification> {
    return fm.fetchReq<MarkNotificationReadRequest, Notification>(`/v1/notifications/${req["id"]}:markRead`, {...initReq, method: "POST"})
  }
  static BatchMarkNotificationsRead(req: BatchMarkNotificationsReadRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<BatchMarkNotificationsReadRequest, GoogleProtobufEmpty.Empty>(`/v1/notifications:batchMarkRead`, {...initReq, method: "POST"})
  }
  static DeleteNotification(req: DeleteNotificationRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteNotificationRequest, GoogleProtobufEmpty.Empty>(`/v1/notifications/${req["id"]}`, {...initReq, method: "DELETE"})
  }
  static BatchDeleteNotifications(req: BatchDeleteNotificationsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<BatchDeleteNotificationsRequest, GoogleProtobufEmpty.Empty>(`/v1/notifications:batchDelete`, {...initReq, method: "POST"})
  }
  static Notifications(req: NotificationsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<Notification>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<NotificationsRequest, Notification>(`/v1/notifications/stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<NotificationsRequest, Notification>(`/v1/notifications/stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, {...initReq, method: "GET"})
  }
}
export class NotificationSenderService {
  static SendNotification(req: SendNotificationRequest, initReq?: fm.InitReq): Promise<SendNotificationResponse> {
    return fm.fetchReq<SendNotificationRequest, SendNotificationResponse>(`/notification.NotificationSenderService/SendNotification`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class PushNotificationService {
  static CreatePushNotificationToken(req: CreatePushNotificationTokenRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CreatePushNotificationTokenRequest, GoogleProtobufEmpty.Empty>(`/v1/pushNotificationTokens`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeletePushNotificationToken(req: DeletePushNotificationTokenRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeletePushNotificationTokenRequest, GoogleProtobufEmpty.Empty>(`/v1/pushNotificationTokens`, {...initReq, method: "DELETE"})
  }
  static GetNotificationToken(req: GetPushNotificationTokenRequest, initReq?: fm.InitReq): Promise<PushNotificationToken> {
    return fm.fetchReq<GetPushNotificationTokenRequest, PushNotificationToken>(`/v1/pushNotificationTokens/${req["token"]}?${fm.renderURLSearchParams(req, ["token"])}`, {...initReq, method: "GET"})
  }
  static ClearPushNotifications(req: ClearPushNotificationsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<ClearPushNotificationsRequest, GoogleProtobufEmpty.Empty>(`/v1/notifications:clearPushNotifications`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SendPushNotification(req: SendPushNotificationRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<SendPushNotificationRequest, GoogleProtobufEmpty.Empty>(`/v1/notifications:sendPushNotification`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}