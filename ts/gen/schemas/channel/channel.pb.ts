/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiAddress from "../api/address.pb"
import * as ApiCursor from "../api/cursor.pb"
import * as ApiDate from "../api/date.pb"
import * as ApiEntity from "../api/entity.pb"
import * as fm from "../fetch.pb"
import * as GoogleApiHttpbody from "../google/api/httpbody.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as ChannelCommon from "./common.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum ChannelFeature {
  CHANNEL_FEATURE_UNSPECIFIED = "CHANNEL_FEATURE_UNSPECIFIED",
  CHANNEL_FEATURE_STREAMING = "CHANNEL_FEATURE_STREAMING",
  CHANNEL_FEATURE_NOICE_PREDICTIONS = "CHANNEL_FEATURE_NOICE_PREDICTIONS",
  CHANNEL_FEATURE_CHALLENGES = "CHANNEL_FEATURE_CHALLENGES",
}

export enum ChannelRole {
  CHANNEL_ROLE_UNSPECIFIED = "CHANNEL_ROLE_UNSPECIFIED",
  CHANNEL_ROLE_STREAMER = "CHANNEL_ROLE_STREAMER",
  CHANNEL_ROLE_MODERATOR = "CHANNEL_ROLE_MODERATOR",
  CHANNEL_ROLE_PLATFORM_MODERATOR = "CHANNEL_ROLE_PLATFORM_MODERATOR",
}

export enum AssetType {
  ASSET_TYPE_UNSPECIFIED = "ASSET_TYPE_UNSPECIFIED",
  ASSET_TYPE_LOGO = "ASSET_TYPE_LOGO",
  ASSET_TYPE_BANNER = "ASSET_TYPE_BANNER",
}

export enum Gender {
  GENDER_UNSPECIFIED = "GENDER_UNSPECIFIED",
  GENDER_MALE = "GENDER_MALE",
  GENDER_FEMALE = "GENDER_FEMALE",
}

export enum RiskTier {
  RISK_TIER_UNSPECIFIED = "RISK_TIER_UNSPECIFIED",
  RISK_TIER_0 = "RISK_TIER_0",
  RISK_TIER_1 = "RISK_TIER_1",
  RISK_TIER_2 = "RISK_TIER_2",
}

export enum ErrorDetailsCause {
  CAUSE_UNSPECIFIED = "CAUSE_UNSPECIFIED",
  CAUSE_NAME_RESERVED = "CAUSE_NAME_RESERVED",
  CAUSE_GUIDELINE_VIOLATION = "CAUSE_GUIDELINE_VIOLATION",
}

export enum SuspensionReason {
  REASON_UNSPECIFIED = "REASON_UNSPECIFIED",
  REASON_CHANNEL_DELETED = "REASON_CHANNEL_DELETED",
}

export enum ChannelLinkLinkType {
  LINK_TYPE_UNSPECIFIED = "LINK_TYPE_UNSPECIFIED",
  LINK_TYPE_CUSTOM = "LINK_TYPE_CUSTOM",
  LINK_TYPE_DISCORD = "LINK_TYPE_DISCORD",
  LINK_TYPE_YOUTUBE = "LINK_TYPE_YOUTUBE",
  LINK_TYPE_TWITTER = "LINK_TYPE_TWITTER",
  LINK_TYPE_FACEBOOK = "LINK_TYPE_FACEBOOK",
  LINK_TYPE_INSTAGRAM = "LINK_TYPE_INSTAGRAM",
  LINK_TYPE_TIKTOK = "LINK_TYPE_TIKTOK",
}

export enum ChannelUpdateEventUpdateType {
  UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
  UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
  UPDATE_TYPE_UPDATED = "UPDATE_TYPE_UPDATED",
}

export enum ChannelFollowerUpdateEventUpdateType {
  UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
  UPDATE_TYPE_FOLLOWED = "UPDATE_TYPE_FOLLOWED",
  UPDATE_TYPE_UNFOLLOWED = "UPDATE_TYPE_UNFOLLOWED",
}

export type ErrorDetails = {
  cause?: ErrorDetailsCause
}

export type LiveStatusEvent = {
  channelId?: string
  liveStatus?: ChannelCommon.LiveStatus
  streamId?: string
}

export type ChannelStreamDetailEvent = {
  channelId?: string
  streamId?: string
  noicePredictionsEnabled?: boolean
  liveStatus?: ChannelCommon.LiveStatus
  gameId?: string
  matureRatedContent?: boolean
  challengesEnabled?: boolean
  serverRenderingEnabled?: boolean
  transcodingEnabled?: boolean
}

export type ViewerCountEvent = {
  channelId?: string
  viewerCount?: number
}

export type FollowerCountEvent = {
  channelId?: string
  followerCount?: number
}

export type Suspension = {
  reason?: SuspensionReason
  until?: string
  description?: string
  suspendedBy?: string
  suspendedAt?: string
}

export type StreamingFeatureStatus = {
  enabled?: boolean
  suspension?: Suspension
}

export type NoicePredictionsFeatureStatus = {
  enabled?: boolean
}

export type ChallengesFeatureStatus = {
  enabled?: boolean
}

export type ChannelFeatures = {
  streaming?: StreamingFeatureStatus
  noicePredictions?: NoicePredictionsFeatureStatus
  challenges?: ChallengesFeatureStatus
}

export type ChannelLink = {
  type?: ChannelLinkLinkType
  url?: string
  name?: string
}

export type ChannelLinkList = {
  links?: ChannelLink[]
}

export type ChannelUpdateEvent = {
  channel?: Channel
  updatedAt?: string
  type?: ChannelUpdateEventUpdateType
}

export type ChannelFollowerUpdateEvent = {
  channelId?: string
  userId?: string
  type?: ChannelFollowerUpdateEventUpdateType
  updatedAt?: string
}

export type ChannelLiveNotificationSettingsUpdateEvent = {
  channelId?: string
  userId?: string
  liveNotificationsEnabled?: boolean
}

export type UserChannelRoleUpdateEvent = {
  channelId?: string
  userId?: string
  roles?: ChannelRole[]
  updatedAt?: string
}

export type MonetizationSettingsUpdateMeta = {
  eligibilityChanged?: boolean
}

export type ChannelMonetizationSettingsUpdateEvent = {
  monetizationSettings?: MonetizationSettings
  updatedAt?: string
  meta?: MonetizationSettingsUpdateMeta
}

export type MonetizationSettings = {
  channelId?: string
  enabled?: boolean
  eligible?: boolean
}

export type Channel = {
  id?: string
  name?: string
  title?: string
  description?: string
  logoUrl?: string
  gameId?: string
  streamerId?: string
  liveStatus?: ChannelCommon.LiveStatus
  viewerCount?: string
  suspension?: Suspension
  subscriberCount?: string
  followerCount?: string
  thumbnailUrl?: string
  offlineBannerUrl?: string
  links?: ChannelLink[]
  currentStreamId?: string
  playedGameIds?: string[]
  state?: ApiEntity.EntityState
  isPublic?: boolean
  features?: ChannelFeatures
  matureRatedContent?: boolean
  matchOngoing?: boolean
  reportingId?: string
  priority?: number
  riskTier?: RiskTier
  createdAt?: string
}

export type ListChannelsRequest = {
  liveStatus?: ChannelCommon.LiveStatus
  gameId?: string
  name?: string
  cursor?: ApiCursor.Cursor
}

export type ListHighlightedChannelsRequest = {
  gameId?: string
  limit?: number
}

export type ListChannelsResponse = {
  channels?: Channel[]
  pageInfo?: ApiCursor.PageInfo
}

export type ListHighlightedChannelsResponse = {
  channels?: Channel[]
}

export type GetChannelRequest = {
  id?: string
}

export type GetChannelByNameRequest = {
  name?: string
}

export type GetUserChannelRequest = {
  userId?: string
}

export type BatchGetUserChannelsRequest = {
  userIds?: string[]
}

export type BatchGetUserChannelsResponse = {
  channels?: Channel[]
}

export type CreateChannelRequest = {
  name?: string
  streamerId?: string
}

export type InsertFixedChannelRequest = {
  id?: string
  name?: string
  streamerId?: string
}

export type DeleteChannelRequest = {
  id?: string
}

export type GameStats = {
  gameId?: string
  liveStreams?: number
}


type BaseListGameStatsRequestFilter = {
}

export type ListGameStatsRequestFilter = BaseListGameStatsRequestFilter
  & OneOf<{ live: boolean }>

export type ListGameStatsRequest = {
  filters?: ListGameStatsRequestFilter[]
  cursor?: ApiCursor.Cursor
}

export type BatchGetGameStatsRequest = {
  gameIds?: string[]
}

export type BatchGetGameStatsResponse = {
  gameStats?: GameStats[]
}

export type ListGameStatsResponse = {
  games?: GameStats[]
  pageInfo?: ApiCursor.PageInfo
}

export type ChannelDetailsUpdate = {
  id?: string
  title?: string
  description?: string
  links?: ChannelLink[]
  isPublic?: boolean
  featureNoicePredictionsEnabled?: boolean
  matureRatedContent?: boolean
  featureChallengesEnabled?: boolean
  priority?: number
  riskTier?: RiskTier
}

export type UpdateChannelDetailsRequest = {
  body?: ChannelDetailsUpdate
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type UserDefaultsItem = {
  itemId?: string
  itemCount?: string
  rev?: string
}

export type UserDefaults = {
  items?: UserDefaultsItem[]
}

export type SetUserChannelRolesRequest = {
  channelId?: string
  userId?: string
  roles?: ChannelRole[]
}

export type ListUserPrivilegedChannelsRequest = {
  userId?: string
}

export type ChannelRoles = {
  channelId?: string
  roles?: ChannelRole[]
}

export type ListUserPrivilegedChannelsResponse = {
  channels?: ChannelRoles[]
}

export type ListUserChannelRolesRequest = {
  userId?: string
  channelId?: string
}

export type ListUserChannelRolesResponse = {
  roles?: ChannelRole[]
}

export type ListChannelPrivilegedUsersRequest = {
  channelId?: string
  cursor?: ApiCursor.Cursor
}

export type PrivilegedUser = {
  userId?: string
  roles?: ChannelRole[]
}

export type ListChannelPrivilegedUsersResponse = {
  users?: PrivilegedUser[]
  pageInfo?: ApiCursor.PageInfo
}

export type FollowChannelRequest = {
  channelId?: string
  userId?: string
}

export type UnfollowChannelRequest = {
  channelId?: string
  userId?: string
}

export type GetUserFollowedChannelsRequest = {
  userId?: string
  liveStatus?: ChannelCommon.LiveStatus
  cursor?: ApiCursor.Cursor
}

export type GetUserFollowedChannelsResponse = {
  channelIds?: string[]
  pageInfo?: ApiCursor.PageInfo
}

export type GetFollowStatusRequest = {
  userId?: string
  channelIds?: string[]
}

export type GetFollowStatusResponse = {
  following?: boolean[]
}

export type GetChannelFollowerStatusRequest = {
  channelId?: string
  userId?: string
}

export type GetChannelFollowerStatusResponse = {
  following?: boolean
  followedAt?: string
}

export type LiveStatusUpdateRequest = {
  channelId?: string
}

export type ChannelStreamDetailRequest = {
  channelId?: string
}

export type ViewerCountUpdateRequest = {
  channelId?: string
}

export type FollowerCountUpdateRequest = {
  channelId?: string
}

export type ListStreamsRequest = {
  channelId?: string
  cursor?: ApiCursor.Cursor
}

export type ListStreamsResponse = {
  streams?: ChannelCommon.Stream[]
  pageInfo?: ApiCursor.PageInfo
}

export type GetStreamRequest = {
  id?: string
}

export type GetStreamSummaryRequest = {
  id?: string
}

export type BatchGetStreamSummaryRequest = {
  streamIds?: string[]
}

export type BatchGetStreamSummaryResponse = {
  summaries?: ChannelCommon.StreamSummary[]
}

export type StreamGetChannelRequest = {
  streamId?: string
}

export type BatchStreamGetChannelRequest = {
  streamIds?: string[]
}

export type BatchStreamGetChannelResponse = {
  channels?: Channel[]
}

export type BatchGetChannelsRequest = {
  channelIds?: string[]
}

export type BatchGetChannelsResponse = {
  channels?: Channel[]
}

export type CreateChannelAssetUploadTokenRequest = {
  channelId?: string
  assetType?: AssetType
}

export type CreateChannelAssetUploadTokenResponse = {
  token?: string
}

export type CreateStreamThumbnailUploadTokenRequest = {
  streamId?: string
  mediaId?: string
  maxAgeSec?: number
}

export type CreateStreamThumbnailUploadTokenResponse = {
  token?: string
}

export type DeleteChannelAssetRequest = {
  channelId?: string
  assetType?: AssetType
}

export type BundlePurchase = {
  userId?: string
  bundleName?: string
  streamerCardIds?: string[]
}

export type SubscriptionPurchase = {
  userId?: string
  tier?: number
}

export type StreamerCardPurchase = {
  userId?: string
  streamerCardId?: string
}

export type AvatarItemPurchase = {
  userId?: string
  itemId?: string
}

export type GiftSubscriptionPurchase = {
  userId?: string
  tier?: number
  recipientUserIds?: string[]
}

export type SubscriptionRenewal = {
  userId?: string
  tier?: number
}


type BaseChannelEventContent = {
}

export type ChannelEventContent = BaseChannelEventContent
  & OneOf<{ bundlePurchase: BundlePurchase; subscriptionPurchase: SubscriptionPurchase; streamerCardPurchase: StreamerCardPurchase; giftSubscriptionPurchase: GiftSubscriptionPurchase; subscriptionRenewal: SubscriptionRenewal; avatarItemPurchase: AvatarItemPurchase }>

export type ChannelEvent = {
  id?: string
  channelId?: string
  createdAt?: string
  content?: ChannelEventContent
}

export type ChannelEventStreamRequest = {
  channelId?: string
}

export type UpdateMonetizationSettingsRequest = {
  body?: MonetizationSettings
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type MonetizationTermsAcceptedEvent = {
  channelId?: string
  userId?: string
  firstName?: string
  lastName?: string
  address?: ApiAddress.Address
  birthday?: ApiDate.Date
  gender?: Gender
}

export type AcceptMonetizationTermsRequest = {
  channelId?: string
  firstName?: string
  lastName?: string
  address?: ApiAddress.Address
  birthday?: ApiDate.Date
  gender?: Gender
}

export type GetChannelLiveFeedRequest = {
  channelId?: string
}

export type BatchGetChannelMonetizationSettingsRequest = {
  channelIds?: string[]
}

export type BatchGetChannelMonetizationSettingsResponse = {
  monetizationSettings?: MonetizationSettings[]
}

export type GetChannelCreationEligibilityRequest = {
  userId?: string
}

export type ChannelCreationEligibility = {
  canCreateChannel?: boolean
}

export type ChannelRiskTierUpdateEvent = {
  channelId?: string
  riskTier?: RiskTier
}




export interface IListGameStatsRequestFilterFilterDelegate<C> {
  onLive(ctx: C, ev: boolean): void
}

export function routeListGameStatsRequestFilterFilterDelegate<C>(ctx: C, val: ListGameStatsRequestFilter, delegate: IListGameStatsRequestFilterFilterDelegate<C>) {
  val?.live && delegate.onLive(ctx, val.live)
}




export interface IChannelEventContentContentDelegate<C> {
  onBundlePurchase(ctx: C, ev: BundlePurchase): void
  onSubscriptionPurchase(ctx: C, ev: SubscriptionPurchase): void
  onStreamerCardPurchase(ctx: C, ev: StreamerCardPurchase): void
  onGiftSubscriptionPurchase(ctx: C, ev: GiftSubscriptionPurchase): void
  onSubscriptionRenewal(ctx: C, ev: SubscriptionRenewal): void
  onAvatarItemPurchase(ctx: C, ev: AvatarItemPurchase): void
}

export function routeChannelEventContentContentDelegate<C>(ctx: C, val: ChannelEventContent, delegate: IChannelEventContentContentDelegate<C>) {
  val?.bundlePurchase && delegate.onBundlePurchase(ctx, val.bundlePurchase)
  val?.subscriptionPurchase && delegate.onSubscriptionPurchase(ctx, val.subscriptionPurchase)
  val?.streamerCardPurchase && delegate.onStreamerCardPurchase(ctx, val.streamerCardPurchase)
  val?.giftSubscriptionPurchase && delegate.onGiftSubscriptionPurchase(ctx, val.giftSubscriptionPurchase)
  val?.subscriptionRenewal && delegate.onSubscriptionRenewal(ctx, val.subscriptionRenewal)
  val?.avatarItemPurchase && delegate.onAvatarItemPurchase(ctx, val.avatarItemPurchase)
}

export class ChannelService {
  static ListChannels(req: ListChannelsRequest, initReq?: fm.InitReq): Promise<ListChannelsResponse> {
    return fm.fetchReq<ListChannelsRequest, ListChannelsResponse>(`/v1/channels?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListHighlightedChannels(req: ListHighlightedChannelsRequest, initReq?: fm.InitReq): Promise<ListHighlightedChannelsResponse> {
    return fm.fetchReq<ListHighlightedChannelsRequest, ListHighlightedChannelsResponse>(`/v1/highlightedChannels?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetChannel(req: GetChannelRequest, initReq?: fm.InitReq): Promise<Channel> {
    return fm.fetchReq<GetChannelRequest, Channel>(`/v1/channels/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static GetChannelByName(req: GetChannelByNameRequest, initReq?: fm.InitReq): Promise<Channel> {
    return fm.fetchReq<GetChannelByNameRequest, Channel>(`/v1/channels:getByName`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static BatchGetChannels(req: BatchGetChannelsRequest, initReq?: fm.InitReq): Promise<BatchGetChannelsResponse> {
    return fm.fetchReq<BatchGetChannelsRequest, BatchGetChannelsResponse>(`/v1/channels:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetUserChannel(req: GetUserChannelRequest, initReq?: fm.InitReq): Promise<Channel> {
    return fm.fetchReq<GetUserChannelRequest, Channel>(`/v1/users/${req["userId"]}/channel?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static BatchGetUserChannels(req: BatchGetUserChannelsRequest, initReq?: fm.InitReq): Promise<BatchGetUserChannelsResponse> {
    return fm.fetchReq<BatchGetUserChannelsRequest, BatchGetUserChannelsResponse>(`/v1/channels:batchGetByUser?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static StreamGetChannel(req: StreamGetChannelRequest, initReq?: fm.InitReq): Promise<Channel> {
    return fm.fetchReq<StreamGetChannelRequest, Channel>(`/v1/streams/${req["streamId"]}:getChannel?${fm.renderURLSearchParams(req, ["streamId"])}`, {...initReq, method: "GET"})
  }
  static BatchStreamGetChannel(req: BatchStreamGetChannelRequest, initReq?: fm.InitReq): Promise<BatchStreamGetChannelResponse> {
    return fm.fetchReq<BatchStreamGetChannelRequest, BatchStreamGetChannelResponse>(`/v1/streams:batchGetChannel?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static CreateChannel(req: CreateChannelRequest, initReq?: fm.InitReq): Promise<Channel> {
    return fm.fetchReq<CreateChannelRequest, Channel>(`/v1/channels`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static InsertFixedChannel(req: InsertFixedChannelRequest, initReq?: fm.InitReq): Promise<Channel> {
    return fm.fetchReq<InsertFixedChannelRequest, Channel>(`/v1/channels/${req["id"]}:fixedChannel`, {...initReq, method: "PUT", body: JSON.stringify(req)})
  }
  static DeleteChannel(req: DeleteChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteChannelRequest, GoogleProtobufEmpty.Empty>(`/v1/channels/${req["id"]}`, {...initReq, method: "DELETE"})
  }
  static UpdateChannelDetails(req: UpdateChannelDetailsRequest, initReq?: fm.InitReq): Promise<Channel> {
    return fm.fetchReq<UpdateChannelDetailsRequest, Channel>(`/v1/channels/${req["body"]["id"]}`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static CreateChannelAssetUploadToken(req: CreateChannelAssetUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateChannelAssetUploadTokenResponse> {
    return fm.fetchReq<CreateChannelAssetUploadTokenRequest, CreateChannelAssetUploadTokenResponse>(`/v1/channels/${req["channelId"]}:assetUploadToken`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteChannelAsset(req: DeleteChannelAssetRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteChannelAssetRequest, GoogleProtobufEmpty.Empty>(`/v1/channels/${req["channelId"]}/assets/${req["assetType"]}`, {...initReq, method: "DELETE"})
  }
  static SetUserChannelRoles(req: SetUserChannelRolesRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<SetUserChannelRolesRequest, GoogleProtobufEmpty.Empty>(`/v1/channels/${req["channelId"]}/roles/${req["userId"]}`, {...initReq, method: "PUT", body: JSON.stringify(req)})
  }
  static ListUserPrivilegedChannels(req: ListUserPrivilegedChannelsRequest, initReq?: fm.InitReq): Promise<ListUserPrivilegedChannelsResponse> {
    return fm.fetchReq<ListUserPrivilegedChannelsRequest, ListUserPrivilegedChannelsResponse>(`/v1/users/${req["userId"]}/channel_roles?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static ListUserChannelRoles(req: ListUserChannelRolesRequest, initReq?: fm.InitReq): Promise<ListUserChannelRolesResponse> {
    return fm.fetchReq<ListUserChannelRolesRequest, ListUserChannelRolesResponse>(`/v1/channels/${req["channelId"]}/roles/${req["userId"]}?${fm.renderURLSearchParams(req, ["channelId", "userId"])}`, {...initReq, method: "GET"})
  }
  static ListChannelPrivilegedUsers(req: ListChannelPrivilegedUsersRequest, initReq?: fm.InitReq): Promise<ListChannelPrivilegedUsersResponse> {
    return fm.fetchReq<ListChannelPrivilegedUsersRequest, ListChannelPrivilegedUsersResponse>(`/v1/channels/${req["channelId"]}/privilegedUsers?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
  static ChannelEventStream(req: ChannelEventStreamRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChannelEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<ChannelEventStreamRequest, ChannelEvent>(`/v1/channels/${req["channelId"]}/events:stream?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<ChannelEventStreamRequest, ChannelEvent>(`/v1/channels/${req["channelId"]}/events:stream?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static GetChannelLiveFeed(req: GetChannelLiveFeedRequest, initReq?: fm.InitReq): Promise<GoogleApiHttpbody.HttpBody> {
    return fm.fetchReq<GetChannelLiveFeedRequest, GoogleApiHttpbody.HttpBody>(`/v1/channels/${req["channelId"]}/rss/channel_live.xml?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
  static LiveStatusUpdates(req: LiveStatusUpdateRequest, entityNotifier?: fm.NotifyStreamEntityArrival<LiveStatusEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<LiveStatusUpdateRequest, LiveStatusEvent>(`/v1/channels/${req["channelId"]}/liveStatus?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<LiveStatusUpdateRequest, LiveStatusEvent>(`/v1/channels/${req["channelId"]}/liveStatus?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static ChannelStreamDetailUpdates(req: ChannelStreamDetailRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChannelStreamDetailEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<ChannelStreamDetailRequest, ChannelStreamDetailEvent>(`/v1/channels/${req["channelId"]}/streamDetails?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<ChannelStreamDetailRequest, ChannelStreamDetailEvent>(`/v1/channels/${req["channelId"]}/streamDetails?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static ViewerCountUpdates(req: ViewerCountUpdateRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ViewerCountEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<ViewerCountUpdateRequest, ViewerCountEvent>(`/v1/channels/${req["channelId"]}/viewerCount?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<ViewerCountUpdateRequest, ViewerCountEvent>(`/v1/channels/${req["channelId"]}/viewerCount?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static FollowerCountUpdates(req: FollowerCountUpdateRequest, entityNotifier?: fm.NotifyStreamEntityArrival<FollowerCountEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<FollowerCountUpdateRequest, FollowerCountEvent>(`/v1/channels/${req["channelId"]}/followerCount?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<FollowerCountUpdateRequest, FollowerCountEvent>(`/v1/channels/${req["channelId"]}/followerCount?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static FollowChannel(req: FollowChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<FollowChannelRequest, GoogleProtobufEmpty.Empty>(`/v1/channels/${req["channelId"]}/followers/${req["userId"]}`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UnfollowChannel(req: UnfollowChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<UnfollowChannelRequest, GoogleProtobufEmpty.Empty>(`/v1/channels/${req["channelId"]}/followers/${req["userId"]}`, {...initReq, method: "DELETE"})
  }
  static GetUserFollowedChannels(req: GetUserFollowedChannelsRequest, initReq?: fm.InitReq): Promise<GetUserFollowedChannelsResponse> {
    return fm.fetchReq<GetUserFollowedChannelsRequest, GetUserFollowedChannelsResponse>(`/v1/users/${req["userId"]}/followedChannels?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static GetFollowStatus(req: GetFollowStatusRequest, initReq?: fm.InitReq): Promise<GetFollowStatusResponse> {
    return fm.fetchReq<GetFollowStatusRequest, GetFollowStatusResponse>(`/v1/channels/followStatus?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetChannelFollowerStatus(req: GetChannelFollowerStatusRequest, initReq?: fm.InitReq): Promise<GetChannelFollowerStatusResponse> {
    return fm.fetchReq<GetChannelFollowerStatusRequest, GetChannelFollowerStatusResponse>(`/v1/channels/${req["channelId"]}/followers/${req["userId"]}?${fm.renderURLSearchParams(req, ["channelId", "userId"])}`, {...initReq, method: "GET"})
  }
  static ListStreams(req: ListStreamsRequest, initReq?: fm.InitReq): Promise<ListStreamsResponse> {
    return fm.fetchReq<ListStreamsRequest, ListStreamsResponse>(`/v1/channels/${req["channelId"]}/streams?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
  static GetStream(req: GetStreamRequest, initReq?: fm.InitReq): Promise<ChannelCommon.Stream> {
    return fm.fetchReq<GetStreamRequest, ChannelCommon.Stream>(`/v1/streams/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static GetStreamSummary(req: GetStreamSummaryRequest, initReq?: fm.InitReq): Promise<ChannelCommon.StreamSummary> {
    return fm.fetchReq<GetStreamSummaryRequest, ChannelCommon.StreamSummary>(`/v1/streams/${req["id"]}/summary?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static BatchGetStreamSummary(req: BatchGetStreamSummaryRequest, initReq?: fm.InitReq): Promise<BatchGetStreamSummaryResponse> {
    return fm.fetchReq<BatchGetStreamSummaryRequest, BatchGetStreamSummaryResponse>(`/v1/streams:batchGetSummary?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static CreateStreamThumbnailUploadToken(req: CreateStreamThumbnailUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateStreamThumbnailUploadTokenResponse> {
    return fm.fetchReq<CreateStreamThumbnailUploadTokenRequest, CreateStreamThumbnailUploadTokenResponse>(`/v1/streams/${req["streamId"]}:thumbnailUploadToken`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateMonetizationSettings(req: UpdateMonetizationSettingsRequest, initReq?: fm.InitReq): Promise<MonetizationSettings> {
    return fm.fetchReq<UpdateMonetizationSettingsRequest, MonetizationSettings>(`/v1/channels/${req["body"]["channelId"]}/monetizationSettings`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static AcceptMonetizationTerms(req: AcceptMonetizationTermsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<AcceptMonetizationTermsRequest, GoogleProtobufEmpty.Empty>(`/v1/channels/${req["channelId"]}:acceptMonetizationTerms`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListGameStats(req: ListGameStatsRequest, initReq?: fm.InitReq): Promise<ListGameStatsResponse> {
    return fm.fetchReq<ListGameStatsRequest, ListGameStatsResponse>(`/v1/channelGameStats?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static BatchGetGameStats(req: BatchGetGameStatsRequest, initReq?: fm.InitReq): Promise<BatchGetGameStatsResponse> {
    return fm.fetchReq<BatchGetGameStatsRequest, BatchGetGameStatsResponse>(`/v1/channelGameStats:batchGet`, {...initReq, method: "POST"})
  }
}
export class ChannelInternalService {
  static GetChannelFollowerStatus(req: GetChannelFollowerStatusRequest, initReq?: fm.InitReq): Promise<GetChannelFollowerStatusResponse> {
    return fm.fetchReq<GetChannelFollowerStatusRequest, GetChannelFollowerStatusResponse>(`/channel.ChannelInternalService/GetChannelFollowerStatus`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static BatchGetChannelMonetizationSettings(req: BatchGetChannelMonetizationSettingsRequest, initReq?: fm.InitReq): Promise<BatchGetChannelMonetizationSettingsResponse> {
    return fm.fetchReq<BatchGetChannelMonetizationSettingsRequest, BatchGetChannelMonetizationSettingsResponse>(`/channel.ChannelInternalService/BatchGetChannelMonetizationSettings`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetChannelCreationEligibility(req: GetChannelCreationEligibilityRequest, initReq?: fm.InitReq): Promise<ChannelCreationEligibility> {
    return fm.fetchReq<GetChannelCreationEligibilityRequest, ChannelCreationEligibility>(`/channel.ChannelInternalService/GetChannelCreationEligibility`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}