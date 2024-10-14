/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as AttributeAttribute from "../attribute/attribute.pb"
import * as fm from "../fetch.pb"
import * as Game_logicGame_logic from "../game-logic/game_logic.pb"
import * as Game_stateGame_state from "../game-state/game_state.pb"
import * as GoogleProtobufDuration from "../google/protobuf/duration.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as MessagingMessaging from "../messaging/messaging.pb"
import * as Stream_infoStream_info from "../stream/stream_info.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum StreamMatchStateOpCode {
  STREAM_MATCH_STATE_OP_CODE_UNSPECIFIED = "STREAM_MATCH_STATE_OP_CODE_UNSPECIFIED",
  STREAM_MATCH_STATE_OP_CODE_MATCH_STARTED = "STREAM_MATCH_STATE_OP_CODE_MATCH_STARTED",
  STREAM_MATCH_STATE_OP_CODE_STREAM_ENDED = "STREAM_MATCH_STATE_OP_CODE_STREAM_ENDED",
  STREAM_MATCH_STATE_OP_CODE_MATCH_ENDED = "STREAM_MATCH_STATE_OP_CODE_MATCH_ENDED",
  STREAM_MATCH_STATE_OP_CODE_MATCH_PAUSED = "STREAM_MATCH_STATE_OP_CODE_MATCH_PAUSED",
  STREAM_MATCH_STATE_OP_CODE_MATCH_UNPAUSED = "STREAM_MATCH_STATE_OP_CODE_MATCH_UNPAUSED",
}

export enum MatchGroupErrorCode {
  UNSPECIFIED = "UNSPECIFIED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  USER_ALREADY_PRESENT = "USER_ALREADY_PRESENT",
  USER_HAS_NO_RESERVATION = "USER_HAS_NO_RESERVATION",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  SERVER_SHUTTING_DOWN = "SERVER_SHUTTING_DOWN",
}

export type MatchGroupMatchEndEventPlayer = {
  userId?: string
  timeSpentInGroup?: string
  bestScoringCardPoints?: string
  points?: string
}

export type MatchGroupMatchEndEvent = {
  groupId?: string
  matchDuration?: string
  players?: MatchGroupMatchEndEventPlayer[]
  streamInfo?: Stream_infoStream_info.StreamInfo
  matchId?: string
  isSolo?: boolean
  isParty?: boolean
}

export type MatchMakingMatchMadeEvent = {
  userId?: string
  streamId?: string
  groupId?: string
  solo?: boolean
}

export type StreamMatchStateEventMatchStarted = {
  streamId?: string
}

export type StreamMatchStateEventMatchEnded = {
  streamId?: string
}

export type StreamMatchStateEventStreamEnded = {
  streamId?: string
}

export type StreamMatchStateEventMatchPaused = {
  streamId?: string
}

export type StreamMatchStateEventMatchUnpaused = {
  streamId?: string
}


type BaseStreamMatchStateEvent = {
  opCode?: StreamMatchStateOpCode
}

export type StreamMatchStateEvent = BaseStreamMatchStateEvent
  & OneOf<{ matchStarted: StreamMatchStateEventMatchStarted; streamEnded: StreamMatchStateEventStreamEnded; matchEnded: StreamMatchStateEventMatchEnded; matchPaused: StreamMatchStateEventMatchPaused; matchUnpaused: StreamMatchStateEventMatchUnpaused }>

export type MatchRewardEventRewardCurrency = {
  id?: string
  amount?: string
}

export type MatchRewardEventRewardExperiencePoints = {
  amount?: string
}


type BaseMatchRewardEventReward = {
  metadata?: AttributeAttribute.AttributeMap
}

export type MatchRewardEventReward = BaseMatchRewardEventReward
  & OneOf<{ currency: MatchRewardEventRewardCurrency; experiencePoints: MatchRewardEventRewardExperiencePoints }>

export type MatchRewardEvent = {
  streamInfo?: Stream_infoStream_info.StreamInfo
  groupId?: string
  userId?: string
  rewards?: MatchRewardEventReward[]
}

export type FindMatchGroupRequest = {
  streamId?: string
  solo?: boolean
}

export type FindMatchGroupResponse = {
  matchGroupId?: string
  teamChangeAvailableAt?: string
}

export type ChangeMatchGroupRequest = {
  streamId?: string
  solo?: boolean
}

export type ChangeMatchGroupResponse = {
  matchGroupId?: string
  teamChangeAvailableAt?: string
}

export type JoinMatchGroup = {
  spectator?: boolean
}

export type LeaveMatchGroup = {
  leavingMatch?: boolean
}

export type MatchGroupEvent = {
  cid?: number
  groupId?: string
  event?: MessagingMessaging.ServerMessage
  error?: MatchGroupError
}


type BaseMatchGroupAction = {
  cid?: number
  groupId?: string
  streamId?: string
}

export type MatchGroupAction = BaseMatchGroupAction
  & OneOf<{ joinMatchGroup: JoinMatchGroup; leaveMatchGroup: LeaveMatchGroup; setActiveCard: Game_logicGame_logic.SetActiveCardMsg; shuffleHand: Game_logicGame_logic.ShuffleHandMsg; triggerEmoji: Game_logicGame_logic.TriggerEmojiMsg; triggerEmote: Game_logicGame_logic.TriggerEmoteMsg; useBooster: Game_logicGame_logic.UseBoosterMsg; requestBooster: Game_logicGame_logic.RequestBoosterMsg; cancelBoosterRequest: Game_logicGame_logic.CancelBoosterRequestMsg; voteCard: Game_logicGame_logic.VoteCardMsg; cancelCardVote: Game_logicGame_logic.CancelCardVoteMsg; collectAonPoints: Game_logicGame_logic.CollectAONPointsMsg; requestHand: Game_logicGame_logic.RequestHandMsg; joinTeamAction: Game_logicGame_logic.JoinTeamActionMsg; requestAvailableChallenges: Game_logicGame_logic.RequestAvailableChallengesMsg; setActiveChallenge: Game_logicGame_logic.SetActiveChallengeMsg; setDebug: Game_logicGame_logic.SetDebugMsg }>

export type MatchGroupError = {
  reason?: MatchGroupErrorCode
}

export type LeaderboardRequest = {
  streamId?: string
}

export type LeaderboardUpdateReset = {
}

export type LeaderboardUpdateGroupUpdatePlayer = {
  userId?: string
  points?: number
}

export type LeaderboardUpdateGroupUpdate = {
  id?: string
  name?: string
  points?: number
  players?: LeaderboardUpdateGroupUpdatePlayer[]
}

export type LeaderboardUpdatePlayerUpdate = {
  groupId?: string
  groupName?: string
  userId?: string
  points?: number
  delta?: number
}

export type LeaderboardUpdatePlayerLeft = {
  groupId?: string
  userId?: string
}


type BaseLeaderboardUpdate = {
}

export type LeaderboardUpdate = BaseLeaderboardUpdate
  & OneOf<{ ping: number; reset: LeaderboardUpdateReset; groupUpdate: LeaderboardUpdateGroupUpdate; playerUpdate: LeaderboardUpdatePlayerUpdate; playerLeft: LeaderboardUpdatePlayerLeft }>

export type TopCardsRequest = {
  streamId?: string
}

export type CardCount = {
  cardId?: string
  count?: number
}

export type TopCardsUpdateReset = {
}

export type TopCardsUpdateCardCountUpdate = {
  cards?: CardCount[]
}


type BaseTopCardsUpdate = {
}

export type TopCardsUpdate = BaseTopCardsUpdate
  & OneOf<{ reset: TopCardsUpdateReset; countUpdate: TopCardsUpdateCardCountUpdate }>

export type ChallengeUpdatesRequest = {
  streamId?: string
}

export type ChallengeUpdateReset = {
}

export type ChallengeUpdateStatusUpdate = {
  challenges?: Game_logicGame_logic.ChallengeStatus[]
}


type BaseChallengeUpdate = {
}

export type ChallengeUpdate = BaseChallengeUpdate
  & OneOf<{ reset: ChallengeUpdateReset; statusUpdate: ChallengeUpdateStatusUpdate }>

export type AssignMatchGroupRequest = {
  streamId?: string
  userId?: string
  groupId?: string
}

export type AssignMatchGroupResponse = {
}

export type GetGroupChatIDRequest = {
  streamId?: string
  groupId?: string
}

export type GetGroupChatIDResponse = {
  chatId?: string
}

export type StreamSpectatorCoordinationEventsRequest = {
  streamId?: string
}

export type StreamSpectatorChangeGroupEvent = {
  groupId?: string
}


type BaseStreamSpectatorCoordinationEvent = {
}

export type StreamSpectatorCoordinationEvent = BaseStreamSpectatorCoordinationEvent
  & OneOf<{ changeGroup: StreamSpectatorChangeGroupEvent }>

export type GetMatchStateRequest = {
  streamId?: string
}

export type GetMatchStateResponse = {
  matchState?: Game_logicGame_logic.StreamStateMatchState
}

export type GetTopActiveCardsRequest = {
  streamId?: string
}

export type GetTopActiveCardsResponse = {
  topCards?: CardCount[]
}

export type GetStreamStateRequest = {
  streamId?: string
}

export type GetStreamStateResponse = {
  started?: boolean
  streamInfo?: Stream_infoStream_info.StreamInfo
  groups?: string[]
  gameConfig?: Game_stateGame_state.GameConfig
  streamTracker?: Game_stateGame_state.StreamTrackerState
  streamGroupsTracker?: Game_stateGame_state.StreamGroupsTrackerState
  highScoringCard?: Game_stateGame_state.HighScoringCardState
}

export type GetGroupStateRequest = {
  groupId?: string
  streamId?: string
}

export type GetGroupStateResponse = {
  state?: Game_stateGame_state.GroupState
  runnerState?: Game_stateGame_state.GroupRunnerState
}

export type AdvanceGroupTimeRequest = {
  groupId?: string
  seconds?: number
  streamId?: string
}

export type AdvanceGroupTimeResponse = {
}

export type SetGroupRandomSeedRequest = {
  groupId?: string
  seed?: string
  streamId?: string
}

export type SetGroupRandomSeedResponse = {
}

export type SendMessageRequest = {
  event?: MatchGroupEvent
  message?: MailboxMessage
}

export type SendMessageResponse = {
}

export type PublishGameEventRequest = {
  streamKey?: string
  gameId?: string
  eventName?: string
  payload?: string
}

export type PublishGameEventResponse = {
}


type BaseMailboxMessage = {
  traceId?: string
}

export type MailboxMessage = BaseMailboxMessage
  & OneOf<{ event: MatchGroupEvent; streamStateUpdate: MessagingMessaging.StreamStateUpdateMessage }>




export interface IStreamMatchStateEventPayloadDelegate<C> {
  onMatchStarted(ctx: C, ev: StreamMatchStateEventMatchStarted): void
  onStreamEnded(ctx: C, ev: StreamMatchStateEventStreamEnded): void
  onMatchEnded(ctx: C, ev: StreamMatchStateEventMatchEnded): void
  onMatchPaused(ctx: C, ev: StreamMatchStateEventMatchPaused): void
  onMatchUnpaused(ctx: C, ev: StreamMatchStateEventMatchUnpaused): void
}

export function routeStreamMatchStateEventPayloadDelegate<C>(ctx: C, val: StreamMatchStateEvent, delegate: IStreamMatchStateEventPayloadDelegate<C>) {
  val?.matchStarted && delegate.onMatchStarted(ctx, val.matchStarted)
  val?.streamEnded && delegate.onStreamEnded(ctx, val.streamEnded)
  val?.matchEnded && delegate.onMatchEnded(ctx, val.matchEnded)
  val?.matchPaused && delegate.onMatchPaused(ctx, val.matchPaused)
  val?.matchUnpaused && delegate.onMatchUnpaused(ctx, val.matchUnpaused)
}




export interface IMatchRewardEventRewardContentDelegate<C> {
  onCurrency(ctx: C, ev: MatchRewardEventRewardCurrency): void
  onExperiencePoints(ctx: C, ev: MatchRewardEventRewardExperiencePoints): void
}

export function routeMatchRewardEventRewardContentDelegate<C>(ctx: C, val: MatchRewardEventReward, delegate: IMatchRewardEventRewardContentDelegate<C>) {
  val?.currency && delegate.onCurrency(ctx, val.currency)
  val?.experiencePoints && delegate.onExperiencePoints(ctx, val.experiencePoints)
}




export interface IMatchGroupActionActionDelegate<C> {
  onJoinMatchGroup(ctx: C, ev: JoinMatchGroup): void
  onLeaveMatchGroup(ctx: C, ev: LeaveMatchGroup): void
  onSetActiveCard(ctx: C, ev: Game_logicGame_logic.SetActiveCardMsg): void
  onShuffleHand(ctx: C, ev: Game_logicGame_logic.ShuffleHandMsg): void
  onTriggerEmoji(ctx: C, ev: Game_logicGame_logic.TriggerEmojiMsg): void
  onTriggerEmote(ctx: C, ev: Game_logicGame_logic.TriggerEmoteMsg): void
  onUseBooster(ctx: C, ev: Game_logicGame_logic.UseBoosterMsg): void
  onRequestBooster(ctx: C, ev: Game_logicGame_logic.RequestBoosterMsg): void
  onCancelBoosterRequest(ctx: C, ev: Game_logicGame_logic.CancelBoosterRequestMsg): void
  onVoteCard(ctx: C, ev: Game_logicGame_logic.VoteCardMsg): void
  onCancelCardVote(ctx: C, ev: Game_logicGame_logic.CancelCardVoteMsg): void
  onCollectAonPoints(ctx: C, ev: Game_logicGame_logic.CollectAONPointsMsg): void
  onRequestHand(ctx: C, ev: Game_logicGame_logic.RequestHandMsg): void
  onJoinTeamAction(ctx: C, ev: Game_logicGame_logic.JoinTeamActionMsg): void
  onRequestAvailableChallenges(ctx: C, ev: Game_logicGame_logic.RequestAvailableChallengesMsg): void
  onSetActiveChallenge(ctx: C, ev: Game_logicGame_logic.SetActiveChallengeMsg): void
  onSetDebug(ctx: C, ev: Game_logicGame_logic.SetDebugMsg): void
}

export function routeMatchGroupActionActionDelegate<C>(ctx: C, val: MatchGroupAction, delegate: IMatchGroupActionActionDelegate<C>) {
  val?.joinMatchGroup && delegate.onJoinMatchGroup(ctx, val.joinMatchGroup)
  val?.leaveMatchGroup && delegate.onLeaveMatchGroup(ctx, val.leaveMatchGroup)
  val?.setActiveCard && delegate.onSetActiveCard(ctx, val.setActiveCard)
  val?.shuffleHand && delegate.onShuffleHand(ctx, val.shuffleHand)
  val?.triggerEmoji && delegate.onTriggerEmoji(ctx, val.triggerEmoji)
  val?.triggerEmote && delegate.onTriggerEmote(ctx, val.triggerEmote)
  val?.useBooster && delegate.onUseBooster(ctx, val.useBooster)
  val?.requestBooster && delegate.onRequestBooster(ctx, val.requestBooster)
  val?.cancelBoosterRequest && delegate.onCancelBoosterRequest(ctx, val.cancelBoosterRequest)
  val?.voteCard && delegate.onVoteCard(ctx, val.voteCard)
  val?.cancelCardVote && delegate.onCancelCardVote(ctx, val.cancelCardVote)
  val?.collectAonPoints && delegate.onCollectAonPoints(ctx, val.collectAonPoints)
  val?.requestHand && delegate.onRequestHand(ctx, val.requestHand)
  val?.joinTeamAction && delegate.onJoinTeamAction(ctx, val.joinTeamAction)
  val?.requestAvailableChallenges && delegate.onRequestAvailableChallenges(ctx, val.requestAvailableChallenges)
  val?.setActiveChallenge && delegate.onSetActiveChallenge(ctx, val.setActiveChallenge)
  val?.setDebug && delegate.onSetDebug(ctx, val.setDebug)
}




export interface ILeaderboardUpdateContentDelegate<C> {
  onPing(ctx: C, ev: number): void
  onReset(ctx: C, ev: LeaderboardUpdateReset): void
  onGroupUpdate(ctx: C, ev: LeaderboardUpdateGroupUpdate): void
  onPlayerUpdate(ctx: C, ev: LeaderboardUpdatePlayerUpdate): void
  onPlayerLeft(ctx: C, ev: LeaderboardUpdatePlayerLeft): void
}

export function routeLeaderboardUpdateContentDelegate<C>(ctx: C, val: LeaderboardUpdate, delegate: ILeaderboardUpdateContentDelegate<C>) {
  val?.ping && delegate.onPing(ctx, val.ping)
  val?.reset && delegate.onReset(ctx, val.reset)
  val?.groupUpdate && delegate.onGroupUpdate(ctx, val.groupUpdate)
  val?.playerUpdate && delegate.onPlayerUpdate(ctx, val.playerUpdate)
  val?.playerLeft && delegate.onPlayerLeft(ctx, val.playerLeft)
}




export interface ITopCardsUpdateContentDelegate<C> {
  onReset(ctx: C, ev: TopCardsUpdateReset): void
  onCountUpdate(ctx: C, ev: TopCardsUpdateCardCountUpdate): void
}

export function routeTopCardsUpdateContentDelegate<C>(ctx: C, val: TopCardsUpdate, delegate: ITopCardsUpdateContentDelegate<C>) {
  val?.reset && delegate.onReset(ctx, val.reset)
  val?.countUpdate && delegate.onCountUpdate(ctx, val.countUpdate)
}




export interface IChallengeUpdateContentDelegate<C> {
  onReset(ctx: C, ev: ChallengeUpdateReset): void
  onStatusUpdate(ctx: C, ev: ChallengeUpdateStatusUpdate): void
}

export function routeChallengeUpdateContentDelegate<C>(ctx: C, val: ChallengeUpdate, delegate: IChallengeUpdateContentDelegate<C>) {
  val?.reset && delegate.onReset(ctx, val.reset)
  val?.statusUpdate && delegate.onStatusUpdate(ctx, val.statusUpdate)
}




export interface IStreamSpectatorCoordinationEventEventDelegate<C> {
  onChangeGroup(ctx: C, ev: StreamSpectatorChangeGroupEvent): void
}

export function routeStreamSpectatorCoordinationEventEventDelegate<C>(ctx: C, val: StreamSpectatorCoordinationEvent, delegate: IStreamSpectatorCoordinationEventEventDelegate<C>) {
  val?.changeGroup && delegate.onChangeGroup(ctx, val.changeGroup)
}




export interface IMailboxMessagePayloadDelegate<C> {
  onEvent(ctx: C, ev: MatchGroupEvent): void
  onStreamStateUpdate(ctx: C, ev: MessagingMessaging.StreamStateUpdateMessage): void
}

export function routeMailboxMessagePayloadDelegate<C>(ctx: C, val: MailboxMessage, delegate: IMailboxMessagePayloadDelegate<C>) {
  val?.event && delegate.onEvent(ctx, val.event)
  val?.streamStateUpdate && delegate.onStreamStateUpdate(ctx, val.streamStateUpdate)
}

export class MatchMakingServiceV2 {
  static FindMatchGroup(req: FindMatchGroupRequest, initReq?: fm.InitReq): Promise<FindMatchGroupResponse> {
    return fm.fetchReq<FindMatchGroupRequest, FindMatchGroupResponse>(`/match.MatchMakingServiceV2/FindMatchGroup`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ChangeMatchGroup(req: ChangeMatchGroupRequest, initReq?: fm.InitReq): Promise<ChangeMatchGroupResponse> {
    return fm.fetchReq<ChangeMatchGroupRequest, ChangeMatchGroupResponse>(`/match.MatchMakingServiceV2/ChangeMatchGroup`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class MatchMakingAdminService {
  static AssignMatchGroup(req: AssignMatchGroupRequest, initReq?: fm.InitReq): Promise<AssignMatchGroupResponse> {
    return fm.fetchReq<AssignMatchGroupRequest, AssignMatchGroupResponse>(`/match.MatchMakingAdminService/AssignMatchGroup`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class MatchServiceV2 {
  static MatchGroup(entityNotifier?: fm.NotifyStreamEntityArrival<MatchGroupEvent>, errorCallback?: fm.NotifyStreamErrorArrival, initReq?: fm.InitReq): Promise<fm.StreamEntityPusher<MatchGroupAction>> {
    return fm.biDirectionalStreamingRequest<MatchGroupAction, MatchGroupEvent>(`/match.MatchServiceV2/MatchGroup`, entityNotifier, errorCallback, {...initReq})
  }
  static StreamSpectatorCoordinationEvents(req: StreamSpectatorCoordinationEventsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<StreamSpectatorCoordinationEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<StreamSpectatorCoordinationEventsRequest, StreamSpectatorCoordinationEvent>(`/v1/streams/${req["streamId"]}/spectator/events?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<StreamSpectatorCoordinationEventsRequest, StreamSpectatorCoordinationEvent>(`/v1/streams/${req["streamId"]}/spectator/events?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static LeaderboardUpdates(req: LeaderboardRequest, entityNotifier?: fm.NotifyStreamEntityArrival<LeaderboardUpdate>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<LeaderboardRequest, LeaderboardUpdate>(`/match.MatchServiceV2/LeaderboardUpdates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<LeaderboardRequest, LeaderboardUpdate>(`/match.MatchServiceV2/LeaderboardUpdates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetTopActiveCards(req: GetTopActiveCardsRequest, initReq?: fm.InitReq): Promise<GetTopActiveCardsResponse> {
    return fm.fetchReq<GetTopActiveCardsRequest, GetTopActiveCardsResponse>(`/v1/streams/${req["streamId"]}/topActiveCards?${fm.renderURLSearchParams(req, ["streamId"])}`, {...initReq, method: "GET"})
  }
  static TopCardUpdates(req: TopCardsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<TopCardsUpdate>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<TopCardsRequest, TopCardsUpdate>(`/match.MatchServiceV2/TopCardUpdates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<TopCardsRequest, TopCardsUpdate>(`/match.MatchServiceV2/TopCardUpdates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ChallengeUpdates(req: ChallengeUpdatesRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChallengeUpdate>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<ChallengeUpdatesRequest, ChallengeUpdate>(`/match.MatchServiceV2/ChallengeUpdates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<ChallengeUpdatesRequest, ChallengeUpdate>(`/match.MatchServiceV2/ChallengeUpdates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetGroupChatID(req: GetGroupChatIDRequest, initReq?: fm.InitReq): Promise<GetGroupChatIDResponse> {
    return fm.fetchReq<GetGroupChatIDRequest, GetGroupChatIDResponse>(`/v1/streams/${req["streamId"]}/groups/${req["groupId"]}/chat?${fm.renderURLSearchParams(req, ["streamId", "groupId"])}`, {...initReq, method: "GET"})
  }
  static GetMatchState(req: GetMatchStateRequest, initReq?: fm.InitReq): Promise<GetMatchStateResponse> {
    return fm.fetchReq<GetMatchStateRequest, GetMatchStateResponse>(`/v1/streams/${req["streamId"]}/match_state?${fm.renderURLSearchParams(req, ["streamId"])}`, {...initReq, method: "GET"})
  }
}
export class MatchAdminService {
  static GetStreamState(req: GetStreamStateRequest, initReq?: fm.InitReq): Promise<GetStreamStateResponse> {
    return fm.fetchReq<GetStreamStateRequest, GetStreamStateResponse>(`/match.MatchAdminService/GetStreamState`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetGroupState(req: GetGroupStateRequest, initReq?: fm.InitReq): Promise<GetGroupStateResponse> {
    return fm.fetchReq<GetGroupStateRequest, GetGroupStateResponse>(`/match.MatchAdminService/GetGroupState`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static AdvanceGroupTime(req: AdvanceGroupTimeRequest, initReq?: fm.InitReq): Promise<AdvanceGroupTimeResponse> {
    return fm.fetchReq<AdvanceGroupTimeRequest, AdvanceGroupTimeResponse>(`/match.MatchAdminService/AdvanceGroupTime`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SetGroupRandomSeed(req: SetGroupRandomSeedRequest, initReq?: fm.InitReq): Promise<SetGroupRandomSeedResponse> {
    return fm.fetchReq<SetGroupRandomSeedRequest, SetGroupRandomSeedResponse>(`/match.MatchAdminService/SetGroupRandomSeed`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class ClientMailboxService {
  static SendMessage(req: SendMessageRequest, initReq?: fm.InitReq): Promise<SendMessageResponse> {
    return fm.fetchReq<SendMessageRequest, SendMessageResponse>(`/match.ClientMailboxService/SendMessage`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}