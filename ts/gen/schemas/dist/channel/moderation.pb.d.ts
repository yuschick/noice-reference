import * as ApiCursor from "../api/cursor.pb";
import * as ChatChat from "../chat/chat.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
import * as ChannelChannel from "./channel.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum Violation {
    VIOLATION_UNSPECIFIED = "VIOLATION_UNSPECIFIED",
    VIOLATION_SPAM = "VIOLATION_SPAM",
    VIOLATION_OTHER = "VIOLATION_OTHER"
}
export declare enum AppealStatus {
    APPEAL_STATUS_UNSPECIFIED = "APPEAL_STATUS_UNSPECIFIED",
    APPEAL_STATUS_PENDING = "APPEAL_STATUS_PENDING",
    APPEAL_STATUS_ACCEPTED = "APPEAL_STATUS_ACCEPTED",
    APPEAL_STATUS_DECLINED = "APPEAL_STATUS_DECLINED"
}
export declare enum BanStatus {
    BAN_STATUS_UNSPECIFIED = "BAN_STATUS_UNSPECIFIED",
    BAN_STATUS_ACTIVE = "BAN_STATUS_ACTIVE",
    BAN_STATUS_INACTIVE = "BAN_STATUS_INACTIVE"
}
export declare enum ModerationEventType {
    MODERATION_EVENT_TYPE_UNSPECIFIED = "MODERATION_EVENT_TYPE_UNSPECIFIED",
    MODERATION_EVENT_TYPE_USER_MUTED = "MODERATION_EVENT_TYPE_USER_MUTED",
    MODERATION_EVENT_TYPE_USER_BANNED = "MODERATION_EVENT_TYPE_USER_BANNED",
    MODERATION_EVENT_TYPE_USER_UNBANNED = "MODERATION_EVENT_TYPE_USER_UNBANNED",
    MODERATION_EVENT_TYPE_BAN_APPEAL_ACCEPTED = "MODERATION_EVENT_TYPE_BAN_APPEAL_ACCEPTED",
    MODERATION_EVENT_TYPE_BAN_APPEAL_REJECTED = "MODERATION_EVENT_TYPE_BAN_APPEAL_REJECTED",
    MODERATION_EVENT_TYPE_AUTOMOD_ITEM_ACCEPTED = "MODERATION_EVENT_TYPE_AUTOMOD_ITEM_ACCEPTED",
    MODERATION_EVENT_TYPE_AUTOMOD_ITEM_REJECTED = "MODERATION_EVENT_TYPE_AUTOMOD_ITEM_REJECTED"
}
export type BanUserRequest = {
    channelId?: string;
    userId?: string;
    violation?: Violation;
    description?: string;
    keepRecentMessages?: boolean;
};
export type UnbanUserRequest = {
    channelId?: string;
    userId?: string;
};
export type GetUserBanStatusRequest = {
    channelId?: string;
    userId?: string;
};
export type UserBanStatus = {
    channelId?: string;
    userId?: string;
    banned?: boolean;
    bannedAt?: string;
    moderatorId?: string;
    violation?: Violation;
    description?: string;
};
export type BatchGetUserBanStatusRequest = {
    userId?: string;
    channelIds?: string[];
};
export type BatchGetUserBanStatusResponse = {
    statuses?: UserBanStatus[];
};
export type ListBannedUsersRequest = {
    channelId?: string;
    cursor?: ApiCursor.Cursor;
};
export type UserBannedNotification = {
    channelId?: string;
    userId?: string;
    moderatorId?: string;
    violation?: Violation;
    description?: string;
};
export type ChannelBan = {
    channelId?: string;
    userId?: string;
    status?: BanStatus;
    moderatorId?: string;
    bannedAt?: string;
    violation?: Violation;
    description?: string;
    unbannedBy?: string;
    unbannedAt?: string;
    keepRecentMessages?: boolean;
};
export type ChannelBanUpdateEvent = {
    channelBan?: ChannelBan;
    updatedAt?: string;
};
export type BannedUser = {
    channelId?: string;
    userId?: string;
    bannedAt?: string;
    moderatorId?: string;
    violation?: Violation;
    description?: string;
    keepRecentMessages?: boolean;
};
export type ListBannedUsersResponse = {
    users?: BannedUser[];
    pageInfo?: ApiCursor.PageInfo;
};
export type ListUserChannelBansRequest = {
    userId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListUserChannelBansResponse = {
    bans?: BannedUser[];
    pageInfo?: ApiCursor.PageInfo;
};
export type CreateBanAppealRequest = {
    channelId?: string;
    text?: string;
};
export type ListBanAppealsRequest = {
    channelId?: string;
    cursor?: ApiCursor.Cursor;
};
export type BanAppealInfo = {
    status?: AppealStatus;
    createdAt?: string;
    appealText?: string;
    reviewerId?: string;
    reviewerComment?: string;
    channelId?: string;
    userId?: string;
};
export type BanAppeal = {
    channelId?: string;
    userId?: string;
    bannedAt?: string;
    moderatorId?: string;
    violation?: Violation;
    description?: string;
    status?: AppealStatus;
    createdAt?: string;
    appealText?: string;
    reviewerId?: string;
    reviewerComment?: string;
};
export type ListBanAppealsResponse = {
    appeals?: BanAppeal[];
    pageInfo?: ApiCursor.PageInfo;
};
export type UpdateBanAppealRequest = {
    channelId?: string;
    userId?: string;
    status?: AppealStatus;
    text?: string;
};
export type BanAppealDecisionEvent = {
    channelId?: string;
    userId?: string;
    status?: AppealStatus;
    moderatorId?: string;
    comment?: string;
};
export type BatchGetBanAppealRequest = {
    channelId?: string;
    userIds?: string[];
};
export type BatchGetBanAppealResponse = {
    banAppeals?: BanAppealInfo[];
};
export type AutomodSettings = {
    level?: ChatChat.AutomodLevel;
    defaultDecision?: ChatChat.AutomodDecision;
};
export type ModerationSettings = {
    channelId?: string;
    automod?: AutomodSettings;
    banAppealsEnabled?: boolean;
};
export type ModerationSettingsUpdateEvent = {
    moderationSettings?: ModerationSettings;
    updatedAt?: string;
};
export type UpdateModerationSettingsRequest = {
    body?: ModerationSettings;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type GetModerationSettingsRequest = {
    channelId?: string;
};
export type SuspendChannelFeatureRequest = {
    channelId?: string;
    feature?: ChannelChannel.ChannelFeature;
    reason?: ChannelChannel.SuspensionReason;
    duration?: string;
    description?: string;
};
export type UnsuspendChannelFeatureRequest = {
    channelId?: string;
    feature?: ChannelChannel.ChannelFeature;
};
export type ModerationEventsFilter = {
    eventTypes?: ModerationEventType[];
};
export type ListModerationEventsRequest = {
    channelId?: string;
    filter?: ModerationEventsFilter;
    cursor?: ApiCursor.Cursor;
};
export type ListModerationEventsResponse = {
    events?: ModerationEvent[];
    pageInfo?: ApiCursor.PageInfo;
};
export type ModerationEventsStreamRequest = {
    channelId?: string;
    filter?: ModerationEventsFilter;
};
export type UserMuted = {
    userId?: string;
    duration?: string;
    reason?: ChatChat.Reason;
    description?: string;
};
export type UserBanned = {
    userId?: string;
    violation?: Violation;
    description?: string;
};
export type UserUnbanned = {
    userId?: string;
};
export type BanAppealAccepted = {
    userId?: string;
    comment?: string;
};
export type BanAppealRejected = {
    userId?: string;
    comment?: string;
};
export type AutomodItemAccepted = {
    userId?: string;
    message?: ChatChat.MessageContent;
};
export type AutomodItemRejected = {
    userId?: string;
    message?: ChatChat.MessageContent;
};
type BaseModerationEventContent = {};
export type ModerationEventContent = BaseModerationEventContent & OneOf<{
    userMuted: UserMuted;
    userBanned: UserBanned;
    userUnbanned: UserUnbanned;
    banAppealAccepted: BanAppealAccepted;
    banAppealRejected: BanAppealRejected;
    automodItemAccepted: AutomodItemAccepted;
    automodItemRejected: AutomodItemRejected;
}>;
export type ModerationEvent = {
    id?: string;
    channelId?: string;
    moderatorId?: string;
    timestamp?: string;
    content?: ModerationEventContent;
};
export interface IModerationEventContentContentDelegate<C> {
    onUserMuted(ctx: C, ev: UserMuted): void;
    onUserBanned(ctx: C, ev: UserBanned): void;
    onUserUnbanned(ctx: C, ev: UserUnbanned): void;
    onBanAppealAccepted(ctx: C, ev: BanAppealAccepted): void;
    onBanAppealRejected(ctx: C, ev: BanAppealRejected): void;
    onAutomodItemAccepted(ctx: C, ev: AutomodItemAccepted): void;
    onAutomodItemRejected(ctx: C, ev: AutomodItemRejected): void;
}
export declare function routeModerationEventContentContentDelegate<C>(ctx: C, val: ModerationEventContent, delegate: IModerationEventContentContentDelegate<C>): void;
export declare class ChannelModerationService {
    static BanUser(req: BanUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UnbanUser(req: UnbanUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetUserBanStatus(req: GetUserBanStatusRequest, initReq?: fm.InitReq): Promise<UserBanStatus>;
    static BatchGetUserBanStatus(req: BatchGetUserBanStatusRequest, initReq?: fm.InitReq): Promise<BatchGetUserBanStatusResponse>;
    static ListBannedUsers(req: ListBannedUsersRequest, initReq?: fm.InitReq): Promise<ListBannedUsersResponse>;
    static ListUserChannelBans(req: ListUserChannelBansRequest, initReq?: fm.InitReq): Promise<ListUserChannelBansResponse>;
    static CreateBanAppeal(req: CreateBanAppealRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListBanAppeals(req: ListBanAppealsRequest, initReq?: fm.InitReq): Promise<ListBanAppealsResponse>;
    static BatchGetBanAppeal(req: BatchGetBanAppealRequest, initReq?: fm.InitReq): Promise<BatchGetBanAppealResponse>;
    static UpdateBanAppeal(req: UpdateBanAppealRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListModerationEvents(req: ListModerationEventsRequest, initReq?: fm.InitReq): Promise<ListModerationEventsResponse>;
    static ModerationEventsStream(req: ModerationEventsStreamRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ModerationEvent>, initReq?: fm.InitReq): Promise<void>;
    static UpdateModerationSettings(req: UpdateModerationSettingsRequest, initReq?: fm.InitReq): Promise<ModerationSettings>;
    static GetModerationSettings(req: GetModerationSettingsRequest, initReq?: fm.InitReq): Promise<ModerationSettings>;
    static SuspendChannelFeature(req: SuspendChannelFeatureRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UnsuspendChannelFeature(req: UnsuspendChannelFeatureRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
export {};
//# sourceMappingURL=moderation.pb.d.ts.map