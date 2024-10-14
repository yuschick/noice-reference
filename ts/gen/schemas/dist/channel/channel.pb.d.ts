import * as ApiCursor from "../api/cursor.pb";
import * as ApiEntity from "../api/entity.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
import * as ChannelCommon from "./common.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum ChannelFeature {
    CHANNEL_FEATURE_UNSPECIFIED = "CHANNEL_FEATURE_UNSPECIFIED",
    CHANNEL_FEATURE_STREAMING = "CHANNEL_FEATURE_STREAMING",
    CHANNEL_FEATURE_NOICE_PREDICTIONS = "CHANNEL_FEATURE_NOICE_PREDICTIONS"
}
export declare enum ChannelRole {
    CHANNEL_ROLE_UNSPECIFIED = "CHANNEL_ROLE_UNSPECIFIED",
    CHANNEL_ROLE_STREAMER = "CHANNEL_ROLE_STREAMER",
    CHANNEL_ROLE_MODERATOR = "CHANNEL_ROLE_MODERATOR",
    CHANNEL_ROLE_PLATFORM_MODERATOR = "CHANNEL_ROLE_PLATFORM_MODERATOR"
}
export declare enum AssetType {
    ASSET_TYPE_UNSPECIFIED = "ASSET_TYPE_UNSPECIFIED",
    ASSET_TYPE_LOGO = "ASSET_TYPE_LOGO",
    ASSET_TYPE_BANNER = "ASSET_TYPE_BANNER"
}
export declare enum SuspensionReason {
    REASON_UNSPECIFIED = "REASON_UNSPECIFIED",
    REASON_CHANNEL_DELETED = "REASON_CHANNEL_DELETED"
}
export declare enum ChannelLinkLinkType {
    LINK_TYPE_UNSPECIFIED = "LINK_TYPE_UNSPECIFIED",
    LINK_TYPE_CUSTOM = "LINK_TYPE_CUSTOM",
    LINK_TYPE_DISCORD = "LINK_TYPE_DISCORD",
    LINK_TYPE_YOUTUBE = "LINK_TYPE_YOUTUBE",
    LINK_TYPE_TWITTER = "LINK_TYPE_TWITTER",
    LINK_TYPE_FACEBOOK = "LINK_TYPE_FACEBOOK",
    LINK_TYPE_INSTAGRAM = "LINK_TYPE_INSTAGRAM",
    LINK_TYPE_TIKTOK = "LINK_TYPE_TIKTOK"
}
export declare enum ChannelUpdateEventUpdateType {
    UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
    UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
    UPDATE_TYPE_UPDATED = "UPDATE_TYPE_UPDATED"
}
export declare enum ChannelFollowerUpdateEventUpdateType {
    UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
    UPDATE_TYPE_FOLLOWED = "UPDATE_TYPE_FOLLOWED",
    UPDATE_TYPE_UNFOLLOWED = "UPDATE_TYPE_UNFOLLOWED"
}
export type LiveStatusEvent = {
    channelId?: string;
    liveStatus?: ChannelCommon.LiveStatus;
    streamId?: string;
};
export type ChannelStreamDetailEvent = {
    channelId?: string;
    streamId?: string;
    noicePredictionsEnabled?: boolean;
    liveStatus?: ChannelCommon.LiveStatus;
    gameId?: string;
    matureRatedContent?: boolean;
};
export type ViewerCountEvent = {
    channelId?: string;
    viewerCount?: number;
};
export type Suspension = {
    reason?: SuspensionReason;
    until?: string;
    description?: string;
    suspendedBy?: string;
    suspendedAt?: string;
};
export type StreamingFeatureStatus = {
    enabled?: boolean;
    suspension?: Suspension;
};
export type NoicePredictionsFeatureStatus = {
    enabled?: boolean;
};
export type ChannelFeatures = {
    streaming?: StreamingFeatureStatus;
    noicePredictions?: NoicePredictionsFeatureStatus;
};
export type ChannelLink = {
    type?: ChannelLinkLinkType;
    url?: string;
    name?: string;
};
export type ChannelLinkList = {
    links?: ChannelLink[];
};
export type ChannelUpdateEvent = {
    channel?: Channel;
    updatedAt?: string;
    type?: ChannelUpdateEventUpdateType;
};
export type ChannelFollowerUpdateEvent = {
    channelId?: string;
    userId?: string;
    type?: ChannelFollowerUpdateEventUpdateType;
    updatedAt?: string;
};
export type UserChannelRoleUpdateEvent = {
    channelId?: string;
    userId?: string;
    roles?: ChannelRole[];
    updatedAt?: string;
};
export type ChannelMonetizationSettingsUpdateEvent = {
    monetizationSettings?: MonetizationSettings;
    updatedAt?: string;
};
export type MonetizationSettings = {
    channelId?: string;
    enabled?: boolean;
};
export type Channel = {
    id?: string;
    name?: string;
    title?: string;
    description?: string;
    logoUrl?: string;
    gameId?: string;
    streamerId?: string;
    liveStatus?: ChannelCommon.LiveStatus;
    viewerCount?: string;
    suspension?: Suspension;
    subscriberCount?: string;
    followerCount?: string;
    thumbnailUrl?: string;
    offlineBannerUrl?: string;
    links?: ChannelLink[];
    currentStreamId?: string;
    playedGameIds?: string[];
    state?: ApiEntity.EntityState;
    isPublic?: boolean;
    features?: ChannelFeatures;
    matureRatedContent?: boolean;
};
export type ListChannelsRequest = {
    liveStatus?: ChannelCommon.LiveStatus;
    gameId?: string;
    name?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListChannelsResponse = {
    channels?: Channel[];
    pageInfo?: ApiCursor.PageInfo;
};
export type GetChannelRequest = {
    id?: string;
};
export type GetChannelByNameRequest = {
    name?: string;
};
export type GetUserChannelRequest = {
    userId?: string;
};
export type BatchGetUserChannelsRequest = {
    userIds?: string[];
};
export type BatchGetUserChannelsResponse = {
    channels?: Channel[];
};
export type CreateChannelRequest = {
    name?: string;
    streamerId?: string;
};
export type InsertFixedChannelRequest = {
    id?: string;
    name?: string;
    streamerId?: string;
};
export type DeleteChannelRequest = {
    id?: string;
};
export type ChannelDetailsUpdate = {
    id?: string;
    title?: string;
    description?: string;
    links?: ChannelLink[];
    isPublic?: boolean;
    featureNoicePredictionsEnabled?: boolean;
    matureRatedContent?: boolean;
};
export type UpdateChannelDetailsRequest = {
    body?: ChannelDetailsUpdate;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type UserDefaultsItem = {
    itemId?: string;
    itemCount?: string;
    rev?: string;
};
export type UserDefaults = {
    items?: UserDefaultsItem[];
};
export type SetUserChannelRolesRequest = {
    channelId?: string;
    userId?: string;
    roles?: ChannelRole[];
};
export type ListUserPrivilegedChannelsRequest = {
    userId?: string;
};
export type ChannelRoles = {
    channelId?: string;
    roles?: ChannelRole[];
};
export type ListUserPrivilegedChannelsResponse = {
    channels?: ChannelRoles[];
};
export type ListUserChannelRolesRequest = {
    userId?: string;
    channelId?: string;
};
export type ListUserChannelRolesResponse = {
    roles?: ChannelRole[];
};
export type ListChannelPrivilegedUsersRequest = {
    channelId?: string;
    cursor?: ApiCursor.Cursor;
};
export type PrivilegedUser = {
    userId?: string;
    roles?: ChannelRole[];
};
export type ListChannelPrivilegedUsersResponse = {
    users?: PrivilegedUser[];
    pageInfo?: ApiCursor.PageInfo;
};
export type FollowChannelRequest = {
    channelId?: string;
    userId?: string;
};
export type UnfollowChannelRequest = {
    channelId?: string;
    userId?: string;
};
export type GetUserFollowedChannelsRequest = {
    userId?: string;
};
export type GetUserFollowedChannelsResponse = {
    channelIds?: string[];
};
export type GetFollowStatusRequest = {
    userId?: string;
    channelIds?: string[];
};
export type GetFollowStatusResponse = {
    following?: boolean[];
};
export type GetChannelFollowerStatusRequest = {
    channelId?: string;
    userId?: string;
};
export type GetChannelFollowerStatusResponse = {
    following?: boolean;
    followedAt?: string;
};
export type LiveStatusUpdateRequest = {
    channelId?: string;
};
export type ChannelStreamDetailRequest = {
    channelId?: string;
};
export type ViewerCountUpdateRequest = {
    channelId?: string;
};
export type ListStreamsRequest = {
    channelId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListStreamsResponse = {
    streams?: ChannelCommon.Stream[];
    pageInfo?: ApiCursor.PageInfo;
};
export type GetStreamRequest = {
    id?: string;
};
export type StreamGetChannelRequest = {
    streamId?: string;
};
export type BatchStreamGetChannelRequest = {
    streamIds?: string[];
};
export type BatchStreamGetChannelResponse = {
    channels?: Channel[];
};
export type BatchGetChannelsRequest = {
    channelIds?: string[];
};
export type BatchGetChannelsResponse = {
    channels?: Channel[];
};
export type CreateChannelAssetUploadTokenRequest = {
    channelId?: string;
    assetType?: AssetType;
};
export type CreateChannelAssetUploadTokenResponse = {
    token?: string;
};
export type CreateStreamThumbnailUploadTokenRequest = {
    streamId?: string;
    mediaId?: string;
    maxAgeSec?: number;
};
export type CreateStreamThumbnailUploadTokenResponse = {
    token?: string;
};
export type DeleteChannelAssetRequest = {
    channelId?: string;
    assetType?: AssetType;
};
export type BundlePurchase = {
    userId?: string;
    bundleName?: string;
    streamerCardIds?: string[];
};
export type SubscriptionPurchase = {
    userId?: string;
    tier?: number;
};
export type StreamerCardPurchase = {
    userId?: string;
    streamerCardId?: string;
};
export type GiftSubscriptionPurchase = {
    userId?: string;
    tier?: number;
    recipientUserIds?: string[];
};
type BaseChannelEventContent = {};
export type ChannelEventContent = BaseChannelEventContent & OneOf<{
    bundlePurchase: BundlePurchase;
    subscriptionPurchase: SubscriptionPurchase;
    streamerCardPurchase: StreamerCardPurchase;
    giftSubscriptionPurchase: GiftSubscriptionPurchase;
}>;
export type ChannelEvent = {
    id?: string;
    channelId?: string;
    createdAt?: string;
    content?: ChannelEventContent;
};
export type ChannelEventStreamRequest = {
    channelId?: string;
};
export type UpdateMonetizationSettingsRequest = {
    body?: MonetizationSettings;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type EnableNightbotRequest = {
    channelId?: string;
};
export type DisableNightbotRequest = {
    channelId?: string;
};
export type ActivateNightbotRequest = {
    channelId?: string;
};
export type DeactivateNightbotRequest = {
    channelId?: string;
};
export type BatchGetChannelMonetizationSettingsRequest = {
    channelIds?: string[];
};
export type BatchGetChannelMonetizationSettingsResponse = {
    monetizationSettings?: MonetizationSettings[];
};
export interface IChannelEventContentContentDelegate<C> {
    onBundlePurchase(ctx: C, ev: BundlePurchase): void;
    onSubscriptionPurchase(ctx: C, ev: SubscriptionPurchase): void;
    onStreamerCardPurchase(ctx: C, ev: StreamerCardPurchase): void;
    onGiftSubscriptionPurchase(ctx: C, ev: GiftSubscriptionPurchase): void;
}
export declare function routeChannelEventContentContentDelegate<C>(ctx: C, val: ChannelEventContent, delegate: IChannelEventContentContentDelegate<C>): void;
export declare class ChannelService {
    static ListChannels(req: ListChannelsRequest, initReq?: fm.InitReq): Promise<ListChannelsResponse>;
    static GetChannel(req: GetChannelRequest, initReq?: fm.InitReq): Promise<Channel>;
    static GetChannelByName(req: GetChannelByNameRequest, initReq?: fm.InitReq): Promise<Channel>;
    static BatchGetChannels(req: BatchGetChannelsRequest, initReq?: fm.InitReq): Promise<BatchGetChannelsResponse>;
    static GetUserChannel(req: GetUserChannelRequest, initReq?: fm.InitReq): Promise<Channel>;
    static BatchGetUserChannels(req: BatchGetUserChannelsRequest, initReq?: fm.InitReq): Promise<BatchGetUserChannelsResponse>;
    static StreamGetChannel(req: StreamGetChannelRequest, initReq?: fm.InitReq): Promise<Channel>;
    static BatchStreamGetChannel(req: BatchStreamGetChannelRequest, initReq?: fm.InitReq): Promise<BatchStreamGetChannelResponse>;
    static CreateChannel(req: CreateChannelRequest, initReq?: fm.InitReq): Promise<Channel>;
    static InsertFixedChannel(req: InsertFixedChannelRequest, initReq?: fm.InitReq): Promise<Channel>;
    static DeleteChannel(req: DeleteChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UpdateChannelDetails(req: UpdateChannelDetailsRequest, initReq?: fm.InitReq): Promise<Channel>;
    static CreateChannelAssetUploadToken(req: CreateChannelAssetUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateChannelAssetUploadTokenResponse>;
    static DeleteChannelAsset(req: DeleteChannelAssetRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static SetUserChannelRoles(req: SetUserChannelRolesRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListUserPrivilegedChannels(req: ListUserPrivilegedChannelsRequest, initReq?: fm.InitReq): Promise<ListUserPrivilegedChannelsResponse>;
    static ListUserChannelRoles(req: ListUserChannelRolesRequest, initReq?: fm.InitReq): Promise<ListUserChannelRolesResponse>;
    static ListChannelPrivilegedUsers(req: ListChannelPrivilegedUsersRequest, initReq?: fm.InitReq): Promise<ListChannelPrivilegedUsersResponse>;
    static ChannelEventStream(req: ChannelEventStreamRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChannelEvent>, initReq?: fm.InitReq): Promise<void>;
    static LiveStatusUpdates(req: LiveStatusUpdateRequest, entityNotifier?: fm.NotifyStreamEntityArrival<LiveStatusEvent>, initReq?: fm.InitReq): Promise<void>;
    static ChannelStreamDetailUpdates(req: ChannelStreamDetailRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChannelStreamDetailEvent>, initReq?: fm.InitReq): Promise<void>;
    static ViewerCountUpdates(req: ViewerCountUpdateRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ViewerCountEvent>, initReq?: fm.InitReq): Promise<void>;
    static FollowChannel(req: FollowChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UnfollowChannel(req: UnfollowChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetUserFollowedChannels(req: GetUserFollowedChannelsRequest, initReq?: fm.InitReq): Promise<GetUserFollowedChannelsResponse>;
    static GetFollowStatus(req: GetFollowStatusRequest, initReq?: fm.InitReq): Promise<GetFollowStatusResponse>;
    static GetChannelFollowerStatus(req: GetChannelFollowerStatusRequest, initReq?: fm.InitReq): Promise<GetChannelFollowerStatusResponse>;
    static ListStreams(req: ListStreamsRequest, initReq?: fm.InitReq): Promise<ListStreamsResponse>;
    static GetStream(req: GetStreamRequest, initReq?: fm.InitReq): Promise<ChannelCommon.Stream>;
    static CreateStreamThumbnailUploadToken(req: CreateStreamThumbnailUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateStreamThumbnailUploadTokenResponse>;
    static UpdateMonetizationSettings(req: UpdateMonetizationSettingsRequest, initReq?: fm.InitReq): Promise<MonetizationSettings>;
}
export declare class ChannelInternalService {
    static GetChannelFollowerStatus(req: GetChannelFollowerStatusRequest, initReq?: fm.InitReq): Promise<GetChannelFollowerStatusResponse>;
    static BatchGetChannelMonetizationSettings(req: BatchGetChannelMonetizationSettingsRequest, initReq?: fm.InitReq): Promise<BatchGetChannelMonetizationSettingsResponse>;
}
export {};
//# sourceMappingURL=channel.pb.d.ts.map