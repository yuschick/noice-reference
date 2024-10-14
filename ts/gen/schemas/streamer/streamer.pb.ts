/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"
import * as Game_logicGame_logic from "../game-logic/game_logic.pb"
import * as Game_stateGame_state from "../game-state/game_state.pb"
import * as GoogleProtobufDuration from "../google/protobuf/duration.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as RenderingTransitions from "../rendering/transitions.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum ChannelActivityEventFilterEventType {
  EVENT_TYPE_UNSPECIFIED = "EVENT_TYPE_UNSPECIFIED",
  EVENT_TYPE_STREAM_STARTED = "EVENT_TYPE_STREAM_STARTED",
  EVENT_TYPE_STREAM_ENDED = "EVENT_TYPE_STREAM_ENDED",
  EVENT_TYPE_MATCH_STARTED = "EVENT_TYPE_MATCH_STARTED",
  EVENT_TYPE_MATCH_ENDED = "EVENT_TYPE_MATCH_ENDED",
  EVENT_TYPE_PLAYER_JOINED = "EVENT_TYPE_PLAYER_JOINED",
  EVENT_TYPE_CHANNEL_FOLLOWED = "EVENT_TYPE_CHANNEL_FOLLOWED",
  EVENT_TYPE_CHANNEL_SUBSCRIBED = "EVENT_TYPE_CHANNEL_SUBSCRIBED",
  EVENT_TYPE_CHANNEL_SUBSCRIPTION_GIFTED = "EVENT_TYPE_CHANNEL_SUBSCRIPTION_GIFTED",
  EVENT_TYPE_CHANNEL_SUBSCRIPTION_RENEWED = "EVENT_TYPE_CHANNEL_SUBSCRIPTION_RENEWED",
  EVENT_TYPE_BUNDLE_PURCHASED = "EVENT_TYPE_BUNDLE_PURCHASED",
  EVENT_TYPE_STREAMER_CARD_PURCHASED = "EVENT_TYPE_STREAMER_CARD_PURCHASED",
  EVENT_TYPE_STREAM_TITLE_CHANGED = "EVENT_TYPE_STREAM_TITLE_CHANGED",
  EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED = "EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED",
  EVENT_TYPE_AVATAR_ITEM_PURCHASED = "EVENT_TYPE_AVATAR_ITEM_PURCHASED",
}

export enum StreamEventFilterEventType {
  EVENT_TYPE_UNSPECIFIED = "EVENT_TYPE_UNSPECIFIED",
  EVENT_TYPE_ACTIVE_CARD_SUCCEEDED = "EVENT_TYPE_ACTIVE_CARD_SUCCEEDED",
  EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED = "EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED",
  EVENT_TYPE_PLAYER_JOINED = "EVENT_TYPE_PLAYER_JOINED",
  EVENT_TYPE_CHANNEL_FOLLOWED = "EVENT_TYPE_CHANNEL_FOLLOWED",
  EVENT_TYPE_CHANNEL_SUBSCRIBED = "EVENT_TYPE_CHANNEL_SUBSCRIBED",
  EVENT_TYPE_CHANNEL_SUBSCRIPTION_GIFTED = "EVENT_TYPE_CHANNEL_SUBSCRIPTION_GIFTED",
}

export type TriggerCameraTransitionRequest = {
  streamId?: string
  cameraTransitionTarget?: RenderingTransitions.CameraTransitionRequestTransitionTarget
}

export type TriggerCameraTransitionResponse = {
  success?: boolean
}

export type ChannelActivityEventsRequest = {
  channelId?: string
  filter?: ChannelActivityEventFilter
  after?: string
}

export type ListChannelActivityEventsRequest = {
  channelId?: string
  filter?: ChannelActivityEventFilter
  cursor?: ApiCursor.Cursor
}

export type ListChannelActivityEventsResponse = {
  events?: ChannelActivityEvent[]
  pageInfo?: ApiCursor.PageInfo
}

export type StreamEventsRequest = {
  streamId?: string
  filter?: StreamEventFilter
}

export type ChannelFollowed = {
  userId?: string
}

export type ChannelSubscribed = {
  userId?: string
}

export type SubscriptionRenewed = {
  userId?: string
}

export type SubscriptionGifted = {
  userId?: string
  tier?: number
  recipientUserIds?: string[]
}

export type StreamerCardPurchased = {
  userId?: string
  streamerCardId?: string
}

export type BundlePurchased = {
  userId?: string
  bundleName?: string
}

export type AvatarItemPurchased = {
  userId?: string
  itemId?: string
}

export type StreamTitleChanged = {
  title?: string
}

export type StreamStarted = {
  streamId?: string
}

export type StreamEnded = {
  streamId?: string
}

export type MatchStarted = {
  streamId?: string
}

export type MatchEnded = {
  streamId?: string
  bestGroup?: Game_logicGame_logic.GroupDetails
  bestPlayer?: Game_logicGame_logic.PlayerDetails
  bestCard?: Game_logicGame_logic.CardDetails
  challengeStatuses?: Game_logicGame_logic.ChallengeStatus[]
}

export type PlayerJoined = {
  userId?: string
}


type BaseChannelActivityEvent = {
  timestamp?: string
  id?: string
}

export type ChannelActivityEvent = BaseChannelActivityEvent
  & OneOf<{ streamStarted: StreamStarted; streamEnded: StreamEnded; matchStarted: MatchStarted; matchEnded: MatchEnded; playerJoined: PlayerJoined; channelFollowed: ChannelFollowed; channelSubscribed: ChannelSubscribed; subscriptionGifted: SubscriptionGifted; subscriptionRenewed: SubscriptionRenewed; bundlePurchased: BundlePurchased; streamerCardPurchased: StreamerCardPurchased; streamTitleChanged: StreamTitleChanged; highScoringCardPromoted: Game_logicGame_logic.HighScoringCardPromotedMsg; avatarItemPurchased: AvatarItemPurchased }>

export type ChannelActivityEventFilter = {
  eventTypes?: ChannelActivityEventFilterEventType[]
}


type BaseStreamEvent = {
  timestamp?: string
}

export type StreamEvent = BaseStreamEvent
  & OneOf<{ ping: number; gameCardSucceeded: Game_logicGame_logic.ActiveCardSucceededMsg; highScoringCardPromoted: Game_logicGame_logic.HighScoringCardPromotedMsg; matchEnded: Game_logicGame_logic.MatchEndedMsg; matchStarted: Game_logicGame_logic.MatchStartedMsg; playerJoined: Game_logicGame_logic.PlayerJoinedMsg; channelFollowed: ChannelFollowed; stateUpdated: Game_stateGame_state.StreamState; channelSubscribed: ChannelSubscribed; subscriptionGifted: SubscriptionGifted; matchPauseChange: Game_logicGame_logic.MatchPauseStateChangedMsg }>

export type StreamDiagnosticsUpdatesRequest = {
  streamId?: string
}


type BaseStreamDiagnosticsUpdate = {
}

export type StreamDiagnosticsUpdate = BaseStreamDiagnosticsUpdate
  & OneOf<{ ping: number; event: StreamDiagnosticsEvent }>

export type StreamEventFilter = {
  eventTypes?: StreamEventFilterEventType[]
}

export type ActivateContextualTeamActionRequest = {
  streamId?: string
}

export type ActivateContextualTeamActionResponse = {
  activated?: boolean
  cooldown?: string
}

export type GetStreamAudienceInsightsRequest = {
  streamId?: string
}

export type StreamAudienceInsights = {
  viewers?: string
  followers?: string
  subscribers?: string
  chatters?: string
  players?: string
}

export type StreamDiagnosticsEventObsPluginInfo = {
  pluginVersion?: string
  obsVersion?: string
}

export type StreamDiagnosticsEventObsNoiceValidator = {
  missingValidator?: boolean
  occludingSourceNames?: string[]
}

export type StreamDiagnosticsEvent = {
  streamId?: string
  channelId?: string
  obsPluginInfo?: StreamDiagnosticsEventObsPluginInfo
  obsNoiceValidator?: StreamDiagnosticsEventObsNoiceValidator
}

export type SendStreamDiagnosticsEventRequest = {
  event?: StreamDiagnosticsEvent
}

export type SendStreamDiagnosticsEventResponse = {
}

export type GetSelectedGameRequest = {
}

export type GetSelectedGameResponse = {
  gameId?: string
  needsValidator?: boolean
}




export interface IChannelActivityEventContentDelegate<C> {
  onStreamStarted(ctx: C, ev: StreamStarted): void
  onStreamEnded(ctx: C, ev: StreamEnded): void
  onMatchStarted(ctx: C, ev: MatchStarted): void
  onMatchEnded(ctx: C, ev: MatchEnded): void
  onPlayerJoined(ctx: C, ev: PlayerJoined): void
  onChannelFollowed(ctx: C, ev: ChannelFollowed): void
  onChannelSubscribed(ctx: C, ev: ChannelSubscribed): void
  onSubscriptionGifted(ctx: C, ev: SubscriptionGifted): void
  onSubscriptionRenewed(ctx: C, ev: SubscriptionRenewed): void
  onBundlePurchased(ctx: C, ev: BundlePurchased): void
  onStreamerCardPurchased(ctx: C, ev: StreamerCardPurchased): void
  onStreamTitleChanged(ctx: C, ev: StreamTitleChanged): void
  onHighScoringCardPromoted(ctx: C, ev: Game_logicGame_logic.HighScoringCardPromotedMsg): void
  onAvatarItemPurchased(ctx: C, ev: AvatarItemPurchased): void
}

export function routeChannelActivityEventContentDelegate<C>(ctx: C, val: ChannelActivityEvent, delegate: IChannelActivityEventContentDelegate<C>) {
  val?.streamStarted && delegate.onStreamStarted(ctx, val.streamStarted)
  val?.streamEnded && delegate.onStreamEnded(ctx, val.streamEnded)
  val?.matchStarted && delegate.onMatchStarted(ctx, val.matchStarted)
  val?.matchEnded && delegate.onMatchEnded(ctx, val.matchEnded)
  val?.playerJoined && delegate.onPlayerJoined(ctx, val.playerJoined)
  val?.channelFollowed && delegate.onChannelFollowed(ctx, val.channelFollowed)
  val?.channelSubscribed && delegate.onChannelSubscribed(ctx, val.channelSubscribed)
  val?.subscriptionGifted && delegate.onSubscriptionGifted(ctx, val.subscriptionGifted)
  val?.subscriptionRenewed && delegate.onSubscriptionRenewed(ctx, val.subscriptionRenewed)
  val?.bundlePurchased && delegate.onBundlePurchased(ctx, val.bundlePurchased)
  val?.streamerCardPurchased && delegate.onStreamerCardPurchased(ctx, val.streamerCardPurchased)
  val?.streamTitleChanged && delegate.onStreamTitleChanged(ctx, val.streamTitleChanged)
  val?.highScoringCardPromoted && delegate.onHighScoringCardPromoted(ctx, val.highScoringCardPromoted)
  val?.avatarItemPurchased && delegate.onAvatarItemPurchased(ctx, val.avatarItemPurchased)
}




export interface IStreamEventContentDelegate<C> {
  onPing(ctx: C, ev: number): void
  onGameCardSucceeded(ctx: C, ev: Game_logicGame_logic.ActiveCardSucceededMsg): void
  onHighScoringCardPromoted(ctx: C, ev: Game_logicGame_logic.HighScoringCardPromotedMsg): void
  onMatchEnded(ctx: C, ev: Game_logicGame_logic.MatchEndedMsg): void
  onMatchStarted(ctx: C, ev: Game_logicGame_logic.MatchStartedMsg): void
  onPlayerJoined(ctx: C, ev: Game_logicGame_logic.PlayerJoinedMsg): void
  onChannelFollowed(ctx: C, ev: ChannelFollowed): void
  onStateUpdated(ctx: C, ev: Game_stateGame_state.StreamState): void
  onChannelSubscribed(ctx: C, ev: ChannelSubscribed): void
  onSubscriptionGifted(ctx: C, ev: SubscriptionGifted): void
  onMatchPauseChange(ctx: C, ev: Game_logicGame_logic.MatchPauseStateChangedMsg): void
}

export function routeStreamEventContentDelegate<C>(ctx: C, val: StreamEvent, delegate: IStreamEventContentDelegate<C>) {
  val?.ping && delegate.onPing(ctx, val.ping)
  val?.gameCardSucceeded && delegate.onGameCardSucceeded(ctx, val.gameCardSucceeded)
  val?.highScoringCardPromoted && delegate.onHighScoringCardPromoted(ctx, val.highScoringCardPromoted)
  val?.matchEnded && delegate.onMatchEnded(ctx, val.matchEnded)
  val?.matchStarted && delegate.onMatchStarted(ctx, val.matchStarted)
  val?.playerJoined && delegate.onPlayerJoined(ctx, val.playerJoined)
  val?.channelFollowed && delegate.onChannelFollowed(ctx, val.channelFollowed)
  val?.stateUpdated && delegate.onStateUpdated(ctx, val.stateUpdated)
  val?.channelSubscribed && delegate.onChannelSubscribed(ctx, val.channelSubscribed)
  val?.subscriptionGifted && delegate.onSubscriptionGifted(ctx, val.subscriptionGifted)
  val?.matchPauseChange && delegate.onMatchPauseChange(ctx, val.matchPauseChange)
}




export interface IStreamDiagnosticsUpdateContentDelegate<C> {
  onPing(ctx: C, ev: number): void
  onEvent(ctx: C, ev: StreamDiagnosticsEvent): void
}

export function routeStreamDiagnosticsUpdateContentDelegate<C>(ctx: C, val: StreamDiagnosticsUpdate, delegate: IStreamDiagnosticsUpdateContentDelegate<C>) {
  val?.ping && delegate.onPing(ctx, val.ping)
  val?.event && delegate.onEvent(ctx, val.event)
}

export class StreamerService {
  static StreamEvents(req: StreamEventsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<StreamEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<StreamEventsRequest, StreamEvent>(`/v1/streamer/streams/${req["streamId"]}/events?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<StreamEventsRequest, StreamEvent>(`/v1/streamer/streams/${req["streamId"]}/events?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static GetStreamAudienceInsights(req: GetStreamAudienceInsightsRequest, initReq?: fm.InitReq): Promise<StreamAudienceInsights> {
    return fm.fetchReq<GetStreamAudienceInsightsRequest, StreamAudienceInsights>(`/v1/streamer/streams/${req["streamId"]}/audienceInsights?${fm.renderURLSearchParams(req, ["streamId"])}`, {...initReq, method: "GET"})
  }
  static ActivateContextualTeamAction(req: ActivateContextualTeamActionRequest, initReq?: fm.InitReq): Promise<ActivateContextualTeamActionResponse> {
    return fm.fetchReq<ActivateContextualTeamActionRequest, ActivateContextualTeamActionResponse>(`/v1/streamer/streams/${req["streamId"]}:invokeContextualTeamAction`, {...initReq, method: "POST"})
  }
  static TriggerCameraTransition(req: TriggerCameraTransitionRequest, initReq?: fm.InitReq): Promise<TriggerCameraTransitionResponse> {
    return fm.fetchReq<TriggerCameraTransitionRequest, TriggerCameraTransitionResponse>(`/v1/streamer/streams/${req["streamId"]}:triggerCameraTransition`, {...initReq, method: "POST"})
  }
  static ListChannelActivityEvents(req: ListChannelActivityEventsRequest, initReq?: fm.InitReq): Promise<ListChannelActivityEventsResponse> {
    return fm.fetchReq<ListChannelActivityEventsRequest, ListChannelActivityEventsResponse>(`/v1/streamer/streams/${req["channelId"]}/activity?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
  static ChannelActivityEvents(req: ChannelActivityEventsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChannelActivityEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<ChannelActivityEventsRequest, ChannelActivityEvent>(`/v1/streamer/streams/${req["channelId"]}/activity:stream?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<ChannelActivityEventsRequest, ChannelActivityEvent>(`/v1/streamer/streams/${req["channelId"]}/activity:stream?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static SendStreamDiagnosticsEvent(req: SendStreamDiagnosticsEventRequest, initReq?: fm.InitReq): Promise<SendStreamDiagnosticsEventResponse> {
    return fm.fetchReq<SendStreamDiagnosticsEventRequest, SendStreamDiagnosticsEventResponse>(`/v1/streamer/diagnostics`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static StreamDiagnosticsUpdates(req: StreamDiagnosticsUpdatesRequest, entityNotifier?: fm.NotifyStreamEntityArrival<StreamDiagnosticsUpdate>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<StreamDiagnosticsUpdatesRequest, StreamDiagnosticsUpdate>(`/v1/streamer/streams/${req["streamId"]}/diagnostics_updates?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<StreamDiagnosticsUpdatesRequest, StreamDiagnosticsUpdate>(`/v1/streamer/streams/${req["streamId"]}/diagnostics_updates?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static GetSelectedGame(req: GetSelectedGameRequest, initReq?: fm.InitReq): Promise<GetSelectedGameResponse> {
    return fm.fetchReq<GetSelectedGameRequest, GetSelectedGameResponse>(`/v1/streamer/selected_game?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}