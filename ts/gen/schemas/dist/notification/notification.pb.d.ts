import * as AdsAds from "../ads/ads.pb";
import * as ChannelModeration from "../channel/moderation.pb";
import * as fm from "../fetch.pb";
import * as FriendsFriends from "../friends/friends.pb";
import * as Goal_cardGoal_card from "../goal-card/goal_card.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as InventoryInventory from "../inventory/inventory.pb";
import * as InvitationInvitation from "../invitation/invitation.pb";
import * as ModerationPlatform_moderation from "../moderation/platform_moderation.pb";
import * as PartyParty from "../party/party.pb";
import * as PrivacyPrivacy from "../privacy/privacy.pb";
import * as ProgressionProgression from "../progression/progression.pb";
import * as RewardReward from "../reward/reward.pb";
import * as SubscriptionSubscription from "../subscription/subscription.pb";
import * as WalletWallet from "../wallet/wallet.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
type BaseNotificationContent = {};
export type NotificationContent = BaseNotificationContent & OneOf<{
    ping: number;
    reward: RewardReward.Reward;
    goalCardProgress: Goal_cardGoal_card.GoalCardSlot;
    progressionUpdate: ProgressionProgression.ProgressionUpdateEvent;
    inventoryUpdate: InventoryInventory.InventoryUpdateEvent;
    placementStateUpdate: AdsAds.PlacementStateEvent;
    friendStatusUpdate: FriendsFriends.FriendStatusUpdateEvent;
    partyInvitationUpdate: PartyParty.PartyInvitationUpdateEvent;
    userDataExportComplete: PrivacyPrivacy.UserDataExportCompleteEvent;
    channelUserBanned: ChannelModeration.UserBannedNotification;
    platformUserBanned: ModerationPlatform_moderation.PlatformUserBannedNotification;
    channelSubscriptionUpdate: SubscriptionSubscription.ChannelSubscriptionUpdateEvent;
    walletTransaction: WalletWallet.TransactionEvent;
    forcedSignout: ForcedSignoutEvent;
    invitationCodeUpdate: InvitationInvitation.InvitationCodeUpdateEvent;
    giftSubscription: GiftSubscription;
}>;
export type ForcedSignoutEvent = {};
export type GiftSubscription = {
    giverId?: string;
    channelId?: string;
    tier?: number;
};
export type Notification = {
    id?: string;
    new?: boolean;
    persisted?: boolean;
    createdAt?: string;
    content?: NotificationContent;
};
export type NotificationEvent = {
    userId?: string;
    notification?: Notification;
};
export type ListNotificationsRequest = {
    cursor?: string;
};
export type ListNotificationsResponse = {
    notifications?: Notification[];
};
export type MarkNotificationsReadRequest = {
    notificationIds?: string[];
};
export type MarkNotificationReadRequest = {
    id?: string;
};
export type BatchMarkNotificationsReadRequest = {
    notificationIds?: string[];
};
export type DeleteNotificationRequest = {
    id?: string;
};
export type BatchDeleteNotificationsRequest = {
    notificationIds?: string[];
};
export type NotificationsRequest = {
    cursor?: string;
};
export type SendNotificationRequest = {
    userId?: string;
    persisted?: boolean;
    content?: NotificationContent;
};
export type SendNotificationResponse = {};
export interface INotificationContentContentDelegate<C> {
    onPing(ctx: C, ev: number): void;
    onReward(ctx: C, ev: RewardReward.Reward): void;
    onGoalCardProgress(ctx: C, ev: Goal_cardGoal_card.GoalCardSlot): void;
    onProgressionUpdate(ctx: C, ev: ProgressionProgression.ProgressionUpdateEvent): void;
    onInventoryUpdate(ctx: C, ev: InventoryInventory.InventoryUpdateEvent): void;
    onPlacementStateUpdate(ctx: C, ev: AdsAds.PlacementStateEvent): void;
    onFriendStatusUpdate(ctx: C, ev: FriendsFriends.FriendStatusUpdateEvent): void;
    onPartyInvitationUpdate(ctx: C, ev: PartyParty.PartyInvitationUpdateEvent): void;
    onUserDataExportComplete(ctx: C, ev: PrivacyPrivacy.UserDataExportCompleteEvent): void;
    onChannelUserBanned(ctx: C, ev: ChannelModeration.UserBannedNotification): void;
    onPlatformUserBanned(ctx: C, ev: ModerationPlatform_moderation.PlatformUserBannedNotification): void;
    onChannelSubscriptionUpdate(ctx: C, ev: SubscriptionSubscription.ChannelSubscriptionUpdateEvent): void;
    onWalletTransaction(ctx: C, ev: WalletWallet.TransactionEvent): void;
    onForcedSignout(ctx: C, ev: ForcedSignoutEvent): void;
    onInvitationCodeUpdate(ctx: C, ev: InvitationInvitation.InvitationCodeUpdateEvent): void;
    onGiftSubscription(ctx: C, ev: GiftSubscription): void;
}
export declare function routeNotificationContentContentDelegate<C>(ctx: C, val: NotificationContent, delegate: INotificationContentContentDelegate<C>): void;
export declare class NotificationService {
    static ListNotifications(req: ListNotificationsRequest, initReq?: fm.InitReq): Promise<ListNotificationsResponse>;
    static MarkNotificationsRead(req: MarkNotificationsReadRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static MarkNotificationRead(req: MarkNotificationReadRequest, initReq?: fm.InitReq): Promise<Notification>;
    static BatchMarkNotificationsRead(req: BatchMarkNotificationsReadRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DeleteNotification(req: DeleteNotificationRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static BatchDeleteNotifications(req: BatchDeleteNotificationsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static Notifications(req: NotificationsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<Notification>, initReq?: fm.InitReq): Promise<void>;
}
export declare class NotificationSenderService {
    static SendNotification(req: SendNotificationRequest, initReq?: fm.InitReq): Promise<SendNotificationResponse>;
}
export {};
//# sourceMappingURL=notification.pb.d.ts.map