/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as Game_logicGame_logic from "../game-logic/game_logic.pb"
import * as Game_stateGame_state from "../game-state/game_state.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as Stream_infoStream_info from "../stream/stream_info.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum Presence {
  UNSPECIFIED = "UNSPECIFIED",
  LEFT = "LEFT",
  JOINED = "JOINED",
}


type BaseClientMessage = {
  opCode?: Game_logicGame_logic.ClientOpCode
  userId?: string
}

export type ClientMessage = BaseClientMessage
  & OneOf<{ setActiveCard: Game_logicGame_logic.SetActiveCardMsg; shuffleHand: Game_logicGame_logic.ShuffleHandMsg; useBooster: Game_logicGame_logic.UseBoosterMsg; requestBooster: Game_logicGame_logic.RequestBoosterMsg; cancelBoosterRequest: Game_logicGame_logic.CancelBoosterRequestMsg; collectAonPoints: Game_logicGame_logic.CollectAONPointsMsg; triggerEmoji: Game_logicGame_logic.TriggerEmojiMsg; triggerEmote: Game_logicGame_logic.TriggerEmoteMsg; requestHand: Game_logicGame_logic.RequestHandMsg; joinTeamAction: Game_logicGame_logic.JoinTeamActionMsg; requestAvailableChallenges: Game_logicGame_logic.RequestAvailableChallengesMsg; setActiveChallenge: Game_logicGame_logic.SetActiveChallengeMsg; setDebug: Game_logicGame_logic.SetDebugMsg }>

export type ClientMessageBatch = {
  messages?: ClientMessage[]
  groupId?: string
}


type BaseServerMessage = {
  targetUserId?: string
  opCode?: Game_logicGame_logic.ServerOpCode
  timestamp?: string
  streamInfo?: Stream_infoStream_info.StreamInfo
  groupId?: string
  matchId?: string
  groupType?: Game_logicGame_logic.GroupType
}

export type ServerMessage = BaseServerMessage
  & OneOf<{ gameInit: Game_logicGame_logic.GameInitMsg; matchStarted: Game_logicGame_logic.MatchStartedMsg; matchEnded: Game_logicGame_logic.MatchEndedMsg; cardDealingStarted: Game_logicGame_logic.CardDealingStartedMsg; cardDealingEnded: Game_logicGame_logic.CardDealingEndedMsg; activeCardSet: Game_logicGame_logic.ActiveCardSetMsg; activeCardPointsUpdated: Game_logicGame_logic.ActiveCardPointsUpdatedMsg; activeCardTargetValueChanged: Game_logicGame_logic.ActiveCardTargetValueChangedMsg; settingActiveCardFailed: Game_logicGame_logic.SettingActiveCardFailedMsg; handShuffled: Game_logicGame_logic.HandShuffledMsg; shufflingHandFailed: Game_logicGame_logic.ShufflingHandFailedMsg; playerPointsUpdated: Game_logicGame_logic.PlayerPointsUpdatedMsg; playerCoinsUpdated: Game_logicGame_logic.PlayerCoinsUpdatedMsg; playerJoined: Game_logicGame_logic.PlayerJoinedMsg; playerLeft: Game_logicGame_logic.PlayerLeftMsg; groupPointsUpdated: Game_logicGame_logic.GroupPointsUpdatedMsg; boosterCooldownStarted: Game_logicGame_logic.BoosterCooldownStartedMsg; boosterAvailable: Game_logicGame_logic.BoosterAvailableMsg; boosterUsed: Game_logicGame_logic.BoosterUsedMsg; boosterRequested: Game_logicGame_logic.BoosterRequestedMsg; boosterRequestCancelled: Game_logicGame_logic.BoosterRequestCancelledMsg; boosterRemoved: Game_logicGame_logic.BoosterRemovedMsg; boosterPointsReceived: Game_logicGame_logic.BoosterPointsReceivedMsg; cardSwitchOutTimerStarted: Game_logicGame_logic.CardSwitchOutTimerStartedMsg; cardSwitchOutAvailable: Game_logicGame_logic.CardSwitchOutAvailableMsg; cardVoteAdded: Game_logicGame_logic.CardVoteAddedMsg; cardVoteRemoved: Game_logicGame_logic.CardVoteRemovedMsg; bestPlayPointsReceived: Game_logicGame_logic.BestPlayPointsReceivedMsg; aonPointsCollected: Game_logicGame_logic.AONPointsCollectedMsg; aonPointsCollectFailed: Game_logicGame_logic.AONPointsCollectFailedMsg; groupBonusPointsReceived: Game_logicGame_logic.GroupBonusPointsReceivedMsg; activeCardSucceeded: Game_logicGame_logic.ActiveCardSucceededMsg; activeCardFailed: Game_logicGame_logic.ActiveCardFailedMsg; playerCardUpgraded: Game_logicGame_logic.PlayerCardUpgradedMsg; reshuffleCostUpdated: Game_logicGame_logic.ReshuffleCostUpdatedMsg; groupCreated: Game_logicGame_logic.GroupCreatedMsg; streamEnded: Game_logicGame_logic.StreamEndedMsg; highScoringCardSucceeded: Game_logicGame_logic.HighScoringCardSucceededMsg; highScoringCardPromoted: Game_logicGame_logic.HighScoringCardPromotedMsg; contextualTeamActionUpdate: Game_logicGame_logic.ContextualTeamActionUpdateMsg; matchBonusReceived: Game_logicGame_logic.MatchBonusReceivedMsg; inactivityTimerUpdated: Game_logicGame_logic.InactivityTimerUpdatedMsg; inactivityTimerCancelled: Game_logicGame_logic.InactivityTimerCancelledMsg; inactivityKickReceived: Game_logicGame_logic.InactivityKickReceivedMsg; matchPauseStateChanged: Game_logicGame_logic.MatchPauseStateChangedMsg; teamMergeWarningReceived: Game_logicGame_logic.TeamMergeWarningReceivedMsg; teamMergeExecuted: Game_logicGame_logic.TeamMergeExecutedMsg; roundPhaseChanged: Game_logicGame_logic.RoundPhaseChangedMsg; availableChallenges: Game_logicGame_logic.AvailableChallengesMsg; setActiveChallenge: Game_logicGame_logic.SetActiveChallengeMsg; challengeEvent: Game_logicGame_logic.ChallengeEventMsg; challengePickRatesUpdate: Game_logicGame_logic.ChallengePickRatesUpdateMsg; challengePicksLocked: Game_logicGame_logic.ChallengePicksLockedMsg; settingActiveChallengeFailed: Game_logicGame_logic.SettingActiveChallengeFailedMsg; globalsUpdated: Game_logicGame_logic.GlobalsUpdatedMsg; debug: Game_logicGame_logic.DebugMsg }>


type BaseStreamerMessage = {
  streamInfo?: Stream_infoStream_info.StreamInfo
}

export type StreamerMessage = BaseStreamerMessage
  & OneOf<{ activateContextualTeamAction: Game_logicGame_logic.ActivateContextualTeamAction }>

export type PlayerRef = {
  userId?: string
  username?: string
  groupId?: string
  fullUser?: boolean
}

export type PresenceMessage = {
  presence?: Presence
  players?: PlayerRef[]
}

export type UpdateBestGroupMessage = {
  bestGroup?: Game_logicGame_logic.GroupDetails
}

export type HighScoringCardMessage = {
  card?: Game_logicGame_logic.HighScoringCard
  userId?: string
  groupName?: string
  groupId?: string
  timestamp?: string
  streamId?: string
  channelId?: string
}

export type MatchEndHandledMessage = {
  groupId?: string
}

export type PostMatchEndMessage = {
  bestGroup?: Game_logicGame_logic.GroupDetails
  bestPlayer?: Game_logicGame_logic.PlayerDetails
  bestCard?: Game_logicGame_logic.CardDetails
  streamId?: string
  channelId?: string
  challengeStatuses?: Game_logicGame_logic.ChallengeStatus[]
}

export type StreamStateUpdateMessage = {
  state?: Game_stateGame_state.StreamState
}

export type ChallengePickRatesUpdateMessage = {
  streamId?: string
  challengePickRates?: {[key: string]: number}
}

export type ChallengeStatusUpdateMessage = {
  streamId?: string
  challengeStatus?: Game_logicGame_logic.ChallengeStatus
}




export interface IClientMessagePayloadDelegate<C> {
  onSetActiveCard(ctx: C, ev: Game_logicGame_logic.SetActiveCardMsg): void
  onShuffleHand(ctx: C, ev: Game_logicGame_logic.ShuffleHandMsg): void
  onUseBooster(ctx: C, ev: Game_logicGame_logic.UseBoosterMsg): void
  onRequestBooster(ctx: C, ev: Game_logicGame_logic.RequestBoosterMsg): void
  onCancelBoosterRequest(ctx: C, ev: Game_logicGame_logic.CancelBoosterRequestMsg): void
  onCollectAonPoints(ctx: C, ev: Game_logicGame_logic.CollectAONPointsMsg): void
  onTriggerEmoji(ctx: C, ev: Game_logicGame_logic.TriggerEmojiMsg): void
  onTriggerEmote(ctx: C, ev: Game_logicGame_logic.TriggerEmoteMsg): void
  onRequestHand(ctx: C, ev: Game_logicGame_logic.RequestHandMsg): void
  onJoinTeamAction(ctx: C, ev: Game_logicGame_logic.JoinTeamActionMsg): void
  onRequestAvailableChallenges(ctx: C, ev: Game_logicGame_logic.RequestAvailableChallengesMsg): void
  onSetActiveChallenge(ctx: C, ev: Game_logicGame_logic.SetActiveChallengeMsg): void
  onSetDebug(ctx: C, ev: Game_logicGame_logic.SetDebugMsg): void
}

export function routeClientMessagePayloadDelegate<C>(ctx: C, val: ClientMessage, delegate: IClientMessagePayloadDelegate<C>) {
  val?.setActiveCard && delegate.onSetActiveCard(ctx, val.setActiveCard)
  val?.shuffleHand && delegate.onShuffleHand(ctx, val.shuffleHand)
  val?.useBooster && delegate.onUseBooster(ctx, val.useBooster)
  val?.requestBooster && delegate.onRequestBooster(ctx, val.requestBooster)
  val?.cancelBoosterRequest && delegate.onCancelBoosterRequest(ctx, val.cancelBoosterRequest)
  val?.collectAonPoints && delegate.onCollectAonPoints(ctx, val.collectAonPoints)
  val?.triggerEmoji && delegate.onTriggerEmoji(ctx, val.triggerEmoji)
  val?.triggerEmote && delegate.onTriggerEmote(ctx, val.triggerEmote)
  val?.requestHand && delegate.onRequestHand(ctx, val.requestHand)
  val?.joinTeamAction && delegate.onJoinTeamAction(ctx, val.joinTeamAction)
  val?.requestAvailableChallenges && delegate.onRequestAvailableChallenges(ctx, val.requestAvailableChallenges)
  val?.setActiveChallenge && delegate.onSetActiveChallenge(ctx, val.setActiveChallenge)
  val?.setDebug && delegate.onSetDebug(ctx, val.setDebug)
}




export interface IServerMessagePayloadDelegate<C> {
  onGameInit(ctx: C, ev: Game_logicGame_logic.GameInitMsg): void
  onMatchStarted(ctx: C, ev: Game_logicGame_logic.MatchStartedMsg): void
  onMatchEnded(ctx: C, ev: Game_logicGame_logic.MatchEndedMsg): void
  onCardDealingStarted(ctx: C, ev: Game_logicGame_logic.CardDealingStartedMsg): void
  onCardDealingEnded(ctx: C, ev: Game_logicGame_logic.CardDealingEndedMsg): void
  onActiveCardSet(ctx: C, ev: Game_logicGame_logic.ActiveCardSetMsg): void
  onActiveCardPointsUpdated(ctx: C, ev: Game_logicGame_logic.ActiveCardPointsUpdatedMsg): void
  onActiveCardTargetValueChanged(ctx: C, ev: Game_logicGame_logic.ActiveCardTargetValueChangedMsg): void
  onSettingActiveCardFailed(ctx: C, ev: Game_logicGame_logic.SettingActiveCardFailedMsg): void
  onHandShuffled(ctx: C, ev: Game_logicGame_logic.HandShuffledMsg): void
  onShufflingHandFailed(ctx: C, ev: Game_logicGame_logic.ShufflingHandFailedMsg): void
  onPlayerPointsUpdated(ctx: C, ev: Game_logicGame_logic.PlayerPointsUpdatedMsg): void
  onPlayerCoinsUpdated(ctx: C, ev: Game_logicGame_logic.PlayerCoinsUpdatedMsg): void
  onPlayerJoined(ctx: C, ev: Game_logicGame_logic.PlayerJoinedMsg): void
  onPlayerLeft(ctx: C, ev: Game_logicGame_logic.PlayerLeftMsg): void
  onGroupPointsUpdated(ctx: C, ev: Game_logicGame_logic.GroupPointsUpdatedMsg): void
  onBoosterCooldownStarted(ctx: C, ev: Game_logicGame_logic.BoosterCooldownStartedMsg): void
  onBoosterAvailable(ctx: C, ev: Game_logicGame_logic.BoosterAvailableMsg): void
  onBoosterUsed(ctx: C, ev: Game_logicGame_logic.BoosterUsedMsg): void
  onBoosterRequested(ctx: C, ev: Game_logicGame_logic.BoosterRequestedMsg): void
  onBoosterRequestCancelled(ctx: C, ev: Game_logicGame_logic.BoosterRequestCancelledMsg): void
  onBoosterRemoved(ctx: C, ev: Game_logicGame_logic.BoosterRemovedMsg): void
  onBoosterPointsReceived(ctx: C, ev: Game_logicGame_logic.BoosterPointsReceivedMsg): void
  onCardSwitchOutTimerStarted(ctx: C, ev: Game_logicGame_logic.CardSwitchOutTimerStartedMsg): void
  onCardSwitchOutAvailable(ctx: C, ev: Game_logicGame_logic.CardSwitchOutAvailableMsg): void
  onCardVoteAdded(ctx: C, ev: Game_logicGame_logic.CardVoteAddedMsg): void
  onCardVoteRemoved(ctx: C, ev: Game_logicGame_logic.CardVoteRemovedMsg): void
  onBestPlayPointsReceived(ctx: C, ev: Game_logicGame_logic.BestPlayPointsReceivedMsg): void
  onAonPointsCollected(ctx: C, ev: Game_logicGame_logic.AONPointsCollectedMsg): void
  onAonPointsCollectFailed(ctx: C, ev: Game_logicGame_logic.AONPointsCollectFailedMsg): void
  onGroupBonusPointsReceived(ctx: C, ev: Game_logicGame_logic.GroupBonusPointsReceivedMsg): void
  onActiveCardSucceeded(ctx: C, ev: Game_logicGame_logic.ActiveCardSucceededMsg): void
  onActiveCardFailed(ctx: C, ev: Game_logicGame_logic.ActiveCardFailedMsg): void
  onPlayerCardUpgraded(ctx: C, ev: Game_logicGame_logic.PlayerCardUpgradedMsg): void
  onReshuffleCostUpdated(ctx: C, ev: Game_logicGame_logic.ReshuffleCostUpdatedMsg): void
  onGroupCreated(ctx: C, ev: Game_logicGame_logic.GroupCreatedMsg): void
  onStreamEnded(ctx: C, ev: Game_logicGame_logic.StreamEndedMsg): void
  onHighScoringCardSucceeded(ctx: C, ev: Game_logicGame_logic.HighScoringCardSucceededMsg): void
  onHighScoringCardPromoted(ctx: C, ev: Game_logicGame_logic.HighScoringCardPromotedMsg): void
  onContextualTeamActionUpdate(ctx: C, ev: Game_logicGame_logic.ContextualTeamActionUpdateMsg): void
  onMatchBonusReceived(ctx: C, ev: Game_logicGame_logic.MatchBonusReceivedMsg): void
  onInactivityTimerUpdated(ctx: C, ev: Game_logicGame_logic.InactivityTimerUpdatedMsg): void
  onInactivityTimerCancelled(ctx: C, ev: Game_logicGame_logic.InactivityTimerCancelledMsg): void
  onInactivityKickReceived(ctx: C, ev: Game_logicGame_logic.InactivityKickReceivedMsg): void
  onMatchPauseStateChanged(ctx: C, ev: Game_logicGame_logic.MatchPauseStateChangedMsg): void
  onTeamMergeWarningReceived(ctx: C, ev: Game_logicGame_logic.TeamMergeWarningReceivedMsg): void
  onTeamMergeExecuted(ctx: C, ev: Game_logicGame_logic.TeamMergeExecutedMsg): void
  onRoundPhaseChanged(ctx: C, ev: Game_logicGame_logic.RoundPhaseChangedMsg): void
  onAvailableChallenges(ctx: C, ev: Game_logicGame_logic.AvailableChallengesMsg): void
  onSetActiveChallenge(ctx: C, ev: Game_logicGame_logic.SetActiveChallengeMsg): void
  onChallengeEvent(ctx: C, ev: Game_logicGame_logic.ChallengeEventMsg): void
  onChallengePickRatesUpdate(ctx: C, ev: Game_logicGame_logic.ChallengePickRatesUpdateMsg): void
  onChallengePicksLocked(ctx: C, ev: Game_logicGame_logic.ChallengePicksLockedMsg): void
  onSettingActiveChallengeFailed(ctx: C, ev: Game_logicGame_logic.SettingActiveChallengeFailedMsg): void
  onGlobalsUpdated(ctx: C, ev: Game_logicGame_logic.GlobalsUpdatedMsg): void
  onDebug(ctx: C, ev: Game_logicGame_logic.DebugMsg): void
}

export function routeServerMessagePayloadDelegate<C>(ctx: C, val: ServerMessage, delegate: IServerMessagePayloadDelegate<C>) {
  val?.gameInit && delegate.onGameInit(ctx, val.gameInit)
  val?.matchStarted && delegate.onMatchStarted(ctx, val.matchStarted)
  val?.matchEnded && delegate.onMatchEnded(ctx, val.matchEnded)
  val?.cardDealingStarted && delegate.onCardDealingStarted(ctx, val.cardDealingStarted)
  val?.cardDealingEnded && delegate.onCardDealingEnded(ctx, val.cardDealingEnded)
  val?.activeCardSet && delegate.onActiveCardSet(ctx, val.activeCardSet)
  val?.activeCardPointsUpdated && delegate.onActiveCardPointsUpdated(ctx, val.activeCardPointsUpdated)
  val?.activeCardTargetValueChanged && delegate.onActiveCardTargetValueChanged(ctx, val.activeCardTargetValueChanged)
  val?.settingActiveCardFailed && delegate.onSettingActiveCardFailed(ctx, val.settingActiveCardFailed)
  val?.handShuffled && delegate.onHandShuffled(ctx, val.handShuffled)
  val?.shufflingHandFailed && delegate.onShufflingHandFailed(ctx, val.shufflingHandFailed)
  val?.playerPointsUpdated && delegate.onPlayerPointsUpdated(ctx, val.playerPointsUpdated)
  val?.playerCoinsUpdated && delegate.onPlayerCoinsUpdated(ctx, val.playerCoinsUpdated)
  val?.playerJoined && delegate.onPlayerJoined(ctx, val.playerJoined)
  val?.playerLeft && delegate.onPlayerLeft(ctx, val.playerLeft)
  val?.groupPointsUpdated && delegate.onGroupPointsUpdated(ctx, val.groupPointsUpdated)
  val?.boosterCooldownStarted && delegate.onBoosterCooldownStarted(ctx, val.boosterCooldownStarted)
  val?.boosterAvailable && delegate.onBoosterAvailable(ctx, val.boosterAvailable)
  val?.boosterUsed && delegate.onBoosterUsed(ctx, val.boosterUsed)
  val?.boosterRequested && delegate.onBoosterRequested(ctx, val.boosterRequested)
  val?.boosterRequestCancelled && delegate.onBoosterRequestCancelled(ctx, val.boosterRequestCancelled)
  val?.boosterRemoved && delegate.onBoosterRemoved(ctx, val.boosterRemoved)
  val?.boosterPointsReceived && delegate.onBoosterPointsReceived(ctx, val.boosterPointsReceived)
  val?.cardSwitchOutTimerStarted && delegate.onCardSwitchOutTimerStarted(ctx, val.cardSwitchOutTimerStarted)
  val?.cardSwitchOutAvailable && delegate.onCardSwitchOutAvailable(ctx, val.cardSwitchOutAvailable)
  val?.cardVoteAdded && delegate.onCardVoteAdded(ctx, val.cardVoteAdded)
  val?.cardVoteRemoved && delegate.onCardVoteRemoved(ctx, val.cardVoteRemoved)
  val?.bestPlayPointsReceived && delegate.onBestPlayPointsReceived(ctx, val.bestPlayPointsReceived)
  val?.aonPointsCollected && delegate.onAonPointsCollected(ctx, val.aonPointsCollected)
  val?.aonPointsCollectFailed && delegate.onAonPointsCollectFailed(ctx, val.aonPointsCollectFailed)
  val?.groupBonusPointsReceived && delegate.onGroupBonusPointsReceived(ctx, val.groupBonusPointsReceived)
  val?.activeCardSucceeded && delegate.onActiveCardSucceeded(ctx, val.activeCardSucceeded)
  val?.activeCardFailed && delegate.onActiveCardFailed(ctx, val.activeCardFailed)
  val?.playerCardUpgraded && delegate.onPlayerCardUpgraded(ctx, val.playerCardUpgraded)
  val?.reshuffleCostUpdated && delegate.onReshuffleCostUpdated(ctx, val.reshuffleCostUpdated)
  val?.groupCreated && delegate.onGroupCreated(ctx, val.groupCreated)
  val?.streamEnded && delegate.onStreamEnded(ctx, val.streamEnded)
  val?.highScoringCardSucceeded && delegate.onHighScoringCardSucceeded(ctx, val.highScoringCardSucceeded)
  val?.highScoringCardPromoted && delegate.onHighScoringCardPromoted(ctx, val.highScoringCardPromoted)
  val?.contextualTeamActionUpdate && delegate.onContextualTeamActionUpdate(ctx, val.contextualTeamActionUpdate)
  val?.matchBonusReceived && delegate.onMatchBonusReceived(ctx, val.matchBonusReceived)
  val?.inactivityTimerUpdated && delegate.onInactivityTimerUpdated(ctx, val.inactivityTimerUpdated)
  val?.inactivityTimerCancelled && delegate.onInactivityTimerCancelled(ctx, val.inactivityTimerCancelled)
  val?.inactivityKickReceived && delegate.onInactivityKickReceived(ctx, val.inactivityKickReceived)
  val?.matchPauseStateChanged && delegate.onMatchPauseStateChanged(ctx, val.matchPauseStateChanged)
  val?.teamMergeWarningReceived && delegate.onTeamMergeWarningReceived(ctx, val.teamMergeWarningReceived)
  val?.teamMergeExecuted && delegate.onTeamMergeExecuted(ctx, val.teamMergeExecuted)
  val?.roundPhaseChanged && delegate.onRoundPhaseChanged(ctx, val.roundPhaseChanged)
  val?.availableChallenges && delegate.onAvailableChallenges(ctx, val.availableChallenges)
  val?.setActiveChallenge && delegate.onSetActiveChallenge(ctx, val.setActiveChallenge)
  val?.challengeEvent && delegate.onChallengeEvent(ctx, val.challengeEvent)
  val?.challengePickRatesUpdate && delegate.onChallengePickRatesUpdate(ctx, val.challengePickRatesUpdate)
  val?.challengePicksLocked && delegate.onChallengePicksLocked(ctx, val.challengePicksLocked)
  val?.settingActiveChallengeFailed && delegate.onSettingActiveChallengeFailed(ctx, val.settingActiveChallengeFailed)
  val?.globalsUpdated && delegate.onGlobalsUpdated(ctx, val.globalsUpdated)
  val?.debug && delegate.onDebug(ctx, val.debug)
}




export interface IStreamerMessagePayloadDelegate<C> {
  onActivateContextualTeamAction(ctx: C, ev: Game_logicGame_logic.ActivateContextualTeamAction): void
}

export function routeStreamerMessagePayloadDelegate<C>(ctx: C, val: StreamerMessage, delegate: IStreamerMessagePayloadDelegate<C>) {
  val?.activateContextualTeamAction && delegate.onActivateContextualTeamAction(ctx, val.activateContextualTeamAction)
}