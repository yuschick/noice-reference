/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ConfigMetagame from "../config/metagame.pb"
import * as Game_cardGame_card from "../game-card/game_card.pb"
import * as Game_logicGame_logic from "../game-logic/game_logic.pb"
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

export enum StringComparisonOperator {
  STRING_COMPARISON_OPERATOR_UNSPECIFIED = "STRING_COMPARISON_OPERATOR_UNSPECIFIED",
  STRING_COMPARISON_OPERATOR_EQUAL = "STRING_COMPARISON_OPERATOR_EQUAL",
  STRING_COMPARISON_OPERATOR_NOT_EQUAL = "STRING_COMPARISON_OPERATOR_NOT_EQUAL",
  STRING_COMPARISON_OPERATOR_IN = "STRING_COMPARISON_OPERATOR_IN",
  STRING_COMPARISON_OPERATOR_NOT_IN = "STRING_COMPARISON_OPERATOR_NOT_IN",
}

export enum IntComparisonOperator {
  INT_COMPARISON_OPERATOR_UNSPECIFIED = "INT_COMPARISON_OPERATOR_UNSPECIFIED",
  INT_COMPARISON_OPERATOR_EQUAL = "INT_COMPARISON_OPERATOR_EQUAL",
  INT_COMPARISON_OPERATOR_GREATER = "INT_COMPARISON_OPERATOR_GREATER",
  INT_COMPARISON_OPERATOR_GREATER_OR_EQUAL = "INT_COMPARISON_OPERATOR_GREATER_OR_EQUAL",
  INT_COMPARISON_OPERATOR_LESS = "INT_COMPARISON_OPERATOR_LESS",
  INT_COMPARISON_OPERATOR_LESS_OR_EQUAL = "INT_COMPARISON_OPERATOR_LESS_OR_EQUAL",
  INT_COMPARISON_OPERATOR_NOT_EQUAL = "INT_COMPARISON_OPERATOR_NOT_EQUAL",
}

export enum ComparisonOperator {
  COMPARISON_OPERATOR_UNSPECIFIED = "COMPARISON_OPERATOR_UNSPECIFIED",
  COMPARISON_OPERATOR_EQUAL = "COMPARISON_OPERATOR_EQUAL",
  COMPARISON_OPERATOR_GREATER = "COMPARISON_OPERATOR_GREATER",
  COMPARISON_OPERATOR_GREATER_OR_EQUAL = "COMPARISON_OPERATOR_GREATER_OR_EQUAL",
  COMPARISON_OPERATOR_LESS = "COMPARISON_OPERATOR_LESS",
  COMPARISON_OPERATOR_LESS_OR_EQUAL = "COMPARISON_OPERATOR_LESS_OR_EQUAL",
  COMPARISON_OPERATOR_NOT_EQUAL = "COMPARISON_OPERATOR_NOT_EQUAL",
  COMPARISON_OPERATOR_IN = "COMPARISON_OPERATOR_IN",
  COMPARISON_OPERATOR_NOT_IN = "COMPARISON_OPERATOR_NOT_IN",
  COMPARISON_OPERATOR_EXISTS = "COMPARISON_OPERATOR_EXISTS",
  COMPARISON_OPERATOR_NOT_EXISTS = "COMPARISON_OPERATOR_NOT_EXISTS",
}

export enum CALModuleBinaryOp {
  BINARY_OP_UNSPECIFIED = "BINARY_OP_UNSPECIFIED",
  BINARY_OP_AND = "BINARY_OP_AND",
  BINARY_OP_OR = "BINARY_OP_OR",
}

export enum CALModuleUnaryOp {
  UNARY_OP_UNSPECIFIED = "UNARY_OP_UNSPECIFIED",
  UNARY_OP_NOT = "UNARY_OP_NOT",
}

export type BoosterState = {
  booster?: Game_logicGame_logic.Booster
  activeBooster?: Game_logicGame_logic.ActiveBooster
  sourcePlayerId?: string
  targetPlayerId?: string
}

export type CardDealingStateCALModulesList = {
  modules?: CALModule[]
}

export type CardDealingState = {
  cards?: {[key: string]: Game_logicGame_logic.Card}
  cardDealingModules?: {[key: string]: CardDealingStateCALModulesList}
  cardAvailability?: {[key: string]: boolean}
}

export type CardState = {
  successModules?: CALModule[]
  failureModules?: CALModule[]
}

export type CardEventCardSucceeded = {
  cardId?: string
  points?: number
}

export type CardEventCardFailed = {
  cardId?: string
  points?: number
  reason?: Game_logicGame_logic.ActiveCardFailedMsgReason
}

export type CardEventCardTargetValueChanged = {
  cardId?: string
  value?: number
  timerDuration?: number
  isFailureModule?: boolean
  values?: {[key: string]: number}
}

export type CardEventShouldCollectAONPoints = {
  totalPoints?: number
  cardActivations?: Game_logicGame_logic.CardActivationResult[]
}


type BaseCardEvent = {
}

export type CardEvent = BaseCardEvent
  & OneOf<{ cardSucceeded: CardEventCardSucceeded; cardFailed: CardEventCardFailed; cardTargetValueChanged: CardEventCardTargetValueChanged; shouldCollectAonPoints: CardEventShouldCollectAONPoints }>

export type PlayerState = {
  player?: Game_logicGame_logic.Player
  cardState?: CardState
  cardDealingState?: CardDealingState
  streamId?: string
  groupId?: string
  lastHeldBoosterId?: number
  debugEvents?: boolean
}

export type TimeTrackerStateTimeTrackerEntry = {
  online?: boolean
  lastOnlineTimestamp?: string
  totalTime?: string
  disconnectedTimestamp?: string
  idleTimestamp?: string
  idle?: boolean
  totalIdleTime?: string
}

export type TimeTrackerState = {
  matchActive?: boolean
  entries?: {[key: string]: TimeTrackerStateTimeTrackerEntry}
}

export type ContextualTeamActionState = {
  participants?: {[key: string]: boolean}
  deadlineMs?: string
  type?: Game_logicGame_logic.ContextualTeamActionType
  status?: Game_logicGame_logic.ContextualTeamActionStatus
}

export type GroupStateBoosterUsage = {
  sourcePlayerId?: string
  targetPlayerId?: string
  boosterState?: BoosterState
}

export type GroupState = {
  group?: Game_logicGame_logic.Group
  timeTrackerState?: TimeTrackerState
  players?: {[key: string]: PlayerState}
  boosterUsages?: GroupStateBoosterUsage[]
  streamInfo?: Stream_infoStream_info.StreamInfo
  contextualTeamActionState?: ContextualTeamActionState
  removedPlayers?: PlayerState[]
  matchBonusActivationRule?: CALModule
  addedPlayers?: {[key: string]: PlayerState}
  activeChallenges?: ChallengeState[]
}

export type RandomState = {
  seed?: string
}

export type GameStateAttributes = {
  intAttributes?: {[key: string]: number}
  stringAttributes?: {[key: string]: string}
  boolAttributes?: {[key: string]: boolean}
}

export type CALModuleIs = {
  op?: ComparisonOperator
  checkParams?: CALModuleCheckParam[]
}

export type CALModuleGlobalIntAttributeCheck = {
  operator?: IntComparisonOperator
  attribute?: string
  value?: number
}

export type CALModuleGlobalIntAttributeSumCheck = {
  operator?: IntComparisonOperator
  attributes?: string[]
  value?: number
}

export type CALModuleGlobalStringAttributeCheck = {
  operator?: StringComparisonOperator
  attribute?: string
  values?: string[]
}

export type CALModuleGlobalBoolAttributeCheck = {
  attribute?: string
  value?: boolean
}

export type CALModuleGlobalAnyBoolAttributeCheck = {
  attributes?: string[]
  value?: boolean
}

export type CALModuleEventTypeCheck = {
  eventNames?: string[]
}

export type CALModuleEventIntAttributeCheck = {
  operator?: IntComparisonOperator
  attribute?: string
  value?: number
  eventName?: string
}

export type CALModuleEventStringAttributeCheck = {
  operator?: StringComparisonOperator
  attribute?: string
  values?: string[]
  eventName?: string
}

export type CALModuleEventBoolAttributeCheck = {
  attribute?: string
  value?: boolean
  eventName?: string
}

export type CALModuleCountEventIntAttributeCheck = {
  attributes?: string[]
  targetValue?: number
  calculateNegative?: boolean
  initialValue?: number
  eventName?: string
}

export type CALModuleRepeatedEventTypeCheck = {
  check?: CALModuleEventTypeCheck
  targetValue?: number
  initialValue?: number
}

export type CALModuleRepeatedEventIntAttributeCheck = {
  check?: CALModuleEventIntAttributeCheck
  targetValue?: number
  initialValue?: number
}

export type CALModuleRepeatedEventStringAttributeCheck = {
  check?: CALModuleEventStringAttributeCheck
  targetValue?: number
  initialValue?: number
}

export type CALModuleRepeatedEventBoolAttributeCheck = {
  check?: CALModuleEventBoolAttributeCheck
  targetValue?: number
  initialValue?: number
}

export type CALModuleEventTypeCheckAfterEventIntAttributeCheck = {
  firstCheck?: CALModuleEventIntAttributeCheck
  secondCheck?: CALModuleEventTypeCheck
  timerDuration?: string
  firstCheckSuccessTime?: string
}

export type CALModuleTimeoutCheck = {
  duration?: string
  lastTimestamp?: string
  timeLeft?: string
  lastStateChangeTimestamp?: string
}

export type CALModuleBinding = {
  ident?: string
  selector?: CALModuleBinding
}


type BaseCALModuleCheckParam = {
}

export type CALModuleCheckParam = BaseCALModuleCheckParam
  & OneOf<{ intValue: number; stringValue: string; boolValue: boolean; binding: CALModuleBinding }>


type BaseCALModuleCheck = {
  label?: string
}

export type CALModuleCheck = BaseCALModuleCheck
  & OneOf<{ globalIntAttributeCheck: CALModuleGlobalIntAttributeCheck; globalIntAttributeSumCheck: CALModuleGlobalIntAttributeSumCheck; globalStringAttributeCheck: CALModuleGlobalStringAttributeCheck; globalBoolAttributeCheck: CALModuleGlobalBoolAttributeCheck; globalAnyBoolAttributeCheck: CALModuleGlobalAnyBoolAttributeCheck; eventTypeCheck: CALModuleEventTypeCheck; eventIntAttributeCheck: CALModuleEventIntAttributeCheck; eventStringAttributeCheck: CALModuleEventStringAttributeCheck; eventBoolAttributeCheck: CALModuleEventBoolAttributeCheck; countEventIntAttributeCheck: CALModuleCountEventIntAttributeCheck; repeatedEventTypeCheck: CALModuleRepeatedEventTypeCheck; repeatedEventIntAttributeCheck: CALModuleRepeatedEventIntAttributeCheck; repeatedEventStringAttributeCheck: CALModuleRepeatedEventStringAttributeCheck; repeatedEventBoolAttributeCheck: CALModuleRepeatedEventBoolAttributeCheck; eventTypeCheckAfterEventIntAttributeCheck: CALModuleEventTypeCheckAfterEventIntAttributeCheck; timeoutCheck: CALModuleTimeoutCheck; is: CALModuleIs }>

export type CALModuleCheckSequence = {
  expressions?: CALModuleExpression[]
  intervals?: number[]
  activationTimes?: string[]
  label?: string
}

export type CALModuleBinaryExpression = {
  left?: CALModuleExpression
  right?: CALModuleExpression
  op?: CALModuleBinaryOp
}

export type CALModuleUnaryExpression = {
  expression?: CALModuleExpression
  op?: CALModuleUnaryOp
}

export type CALModuleGroup = {
  expression?: CALModuleExpression
}

export type CALModuleForDuration = {
  expression?: CALModuleExpression
  timeout?: CALModuleExpression
  resetting?: boolean
}

export type CALModuleRepeat = {
  expression?: CALModuleExpression
  targetValue?: number
  initialValue?: number
  label?: string
}

export type CALModuleWhenCaseDefault = {
}


type BaseCALModuleWhenCase = {
  expression?: CALModuleExpression
}

export type CALModuleWhenCase = BaseCALModuleWhenCase
  & OneOf<{ intValue: number; stringValue: string; boolValue: boolean; defaultValue: CALModuleWhenCaseDefault }>

export type CALModuleWhen = {
  attribute?: string
  cases?: CALModuleWhenCase[]
}


type BaseCALModuleExpression = {
}

export type CALModuleExpression = BaseCALModuleExpression
  & OneOf<{ check: CALModuleCheck; binaryExpression: CALModuleBinaryExpression; unaryExpression: CALModuleUnaryExpression; group: CALModuleGroup; checkSequence: CALModuleCheckSequence; forDuration: CALModuleForDuration; repeat: CALModuleRepeat; when: CALModuleWhen }>

export type CALModule = {
  expression?: CALModuleExpression
}

export type AttributesState = {
  intAttributes?: {[key: string]: number}
  stringAttributes?: {[key: string]: string}
  boolAttributes?: {[key: string]: boolean}
}

export type StreamTrackerState = {
  streamState?: Game_logicGame_logic.StreamState
  globalAttributes?: AttributesState
  matchStateChanged?: boolean
  matchStartTime?: string
  previousMatchState?: Game_logicGame_logic.StreamStateMatchState
  matchEndTime?: string
  matchPauseStartTime?: string
  matchPauseTimeTotal?: string
  roundPhaseChanged?: boolean
  globalAttributesHash?: string
  globalsChanged?: boolean
}

export type GameConfigHighScoringCardConfig = {
  highScoringCardConfigs?: Game_cardGame_card.HighScoringCardConfig[]
  highScoringCardTimings?: Game_cardGame_card.HighScoringCardTimings[]
}

export type GameConfigChallengeConfig = {
  challenges?: {[key: string]: Game_logicGame_logic.Challenge}
  availableChallengesCount?: number
  isEnabled?: boolean
}

export type GameConfig = {
  matchConfiguration?: Game_logicGame_logic.MatchConfiguration
  boosters?: {[key: number]: Game_logicGame_logic.Booster}
  highScoringCardConfig?: GameConfigHighScoringCardConfig
  uiTimings?: ConfigMetagame.MetagameConfigUiTimings
  inactivityTimeouts?: ConfigMetagame.MetagameConfigInactivityTimeouts
  featureFlags?: {[key: string]: string}
  challengeConfig?: GameConfigChallengeConfig
}

export type StreamGroupsTrackerState = {
  bestGroup?: Game_logicGame_logic.GroupDetails
  bestPlayer?: Game_logicGame_logic.PlayerDetails
  bestCard?: Game_logicGame_logic.CardDetails
}

export type HighScoringCardState = {
  activeGroups?: {[key: string]: boolean}
  deadline?: string
  userId?: string
  groupId?: string
  card?: Game_logicGame_logic.HighScoringCard
}

export type ClientSession = {
  timestamp?: string
  token?: string
  mailbox?: string
}

export type ClientSessionList = {
  sessions?: ClientSession[]
}

export type SessionTrackerState = {
  playerSessions?: {[key: string]: ClientSessionList}
  spectatorSessions?: {[key: string]: ClientSessionList}
}

export type TimerStateMetadata = {
  source?: string
}

export type TimerStateTimeout = {
  expirationTimestamp?: string
  metadata?: TimerStateMetadata
}

export type TimerState = {
  activeTimerDeadline?: string
  timeouts?: string[]
  timeoutsWithMetadata?: TimerStateTimeout[]
  activeTimeout?: TimerStateTimeout
}

export type GroupRunnerState = {
  started?: boolean
  gameConfig?: GameConfig
  groupState?: GroupState
  streamTrackerState?: StreamTrackerState
  randomState?: RandomState
  timeOffset?: string
  timer?: TimerState
  players?: {[key: string]: boolean}
  matchEndTime?: string
  stepTimestamp?: string
  groupStartTime?: string
  matchPauseStartTime?: string
  matchPauseTimeTotal?: string
  sessionTrackerState?: SessionTrackerState
  matchTimeTrackerState?: MatchTimeTrackerState
}

export type StreamRunnerState = {
  started?: boolean
  streamInfo?: Stream_infoStream_info.StreamInfo
  groups?: string[]
  gameConfig?: GameConfig
  streamTracker?: StreamTrackerState
  streamGroupsTracker?: StreamGroupsTrackerState
  highScoringCard?: HighScoringCardState
  contextualTeamActionLastActivatedAt?: string
  observers?: {[key: string]: boolean}
  groupsToRemove?: string[]
  waitingMatchEndDeadline?: string
}

export type StreamState = {
  streamInfo?: Stream_infoStream_info.StreamInfo
  groups?: string[]
  streamTracker?: StreamTrackerState
  streamGroupsTracker?: StreamGroupsTrackerState
}

export type StatsRunnerState = {
  started?: boolean
  streamInfo?: Stream_infoStream_info.StreamInfo
  gameConfig?: GameConfig
  groups?: {[key: string]: Game_logicGame_logic.GroupDetails}
  streamGroupsTracker?: StreamGroupsTrackerState
  highScoringCard?: HighScoringCardState
  challengeTrackerState?: ChallengeTrackerState
  nextPickRateUpdate?: string
  streamTrackerState?: StreamTrackerState
  matchTimeTrackerState?: MatchTimeTrackerState
}

export type ChallengeState = {
  challengeId?: string
  successModule?: CALModule
  failureModule?: CALModule
  targetValues?: {[key: string]: number}
  pickRate?: number
  challengeState?: Game_logicGame_logic.ChallengeState
}

export type ChallengeTrackerStatePickRatesState = {
  pickRatesPerChallenge?: {[key: string]: number}
  totalPicks?: number
  locked?: boolean
}

export type ChallengeTrackerState = {
  pickRatesState?: ChallengeTrackerStatePickRatesState
  availableChallenges?: string[]
  activeChallenges?: ChallengeState[]
}

export type MatchTimeTrackerState = {
  time?: string
  timeOffset?: string
  timer?: TimerState
}




export interface ICardEventEventDelegate<C> {
  onCardSucceeded(ctx: C, ev: CardEventCardSucceeded): void
  onCardFailed(ctx: C, ev: CardEventCardFailed): void
  onCardTargetValueChanged(ctx: C, ev: CardEventCardTargetValueChanged): void
  onShouldCollectAonPoints(ctx: C, ev: CardEventShouldCollectAONPoints): void
}

export function routeCardEventEventDelegate<C>(ctx: C, val: CardEvent, delegate: ICardEventEventDelegate<C>) {
  val?.cardSucceeded && delegate.onCardSucceeded(ctx, val.cardSucceeded)
  val?.cardFailed && delegate.onCardFailed(ctx, val.cardFailed)
  val?.cardTargetValueChanged && delegate.onCardTargetValueChanged(ctx, val.cardTargetValueChanged)
  val?.shouldCollectAonPoints && delegate.onShouldCollectAonPoints(ctx, val.shouldCollectAonPoints)
}




export interface ICALModuleCheckParamValueDelegate<C> {
  onIntValue(ctx: C, ev: number): void
  onStringValue(ctx: C, ev: string): void
  onBoolValue(ctx: C, ev: boolean): void
  onBinding(ctx: C, ev: CALModuleBinding): void
}

export function routeCALModuleCheckParamValueDelegate<C>(ctx: C, val: CALModuleCheckParam, delegate: ICALModuleCheckParamValueDelegate<C>) {
  val?.intValue && delegate.onIntValue(ctx, val.intValue)
  val?.stringValue && delegate.onStringValue(ctx, val.stringValue)
  val?.boolValue && delegate.onBoolValue(ctx, val.boolValue)
  val?.binding && delegate.onBinding(ctx, val.binding)
}




export interface ICALModuleCheckCheckDelegate<C> {
  onGlobalIntAttributeCheck(ctx: C, ev: CALModuleGlobalIntAttributeCheck): void
  onGlobalIntAttributeSumCheck(ctx: C, ev: CALModuleGlobalIntAttributeSumCheck): void
  onGlobalStringAttributeCheck(ctx: C, ev: CALModuleGlobalStringAttributeCheck): void
  onGlobalBoolAttributeCheck(ctx: C, ev: CALModuleGlobalBoolAttributeCheck): void
  onGlobalAnyBoolAttributeCheck(ctx: C, ev: CALModuleGlobalAnyBoolAttributeCheck): void
  onEventTypeCheck(ctx: C, ev: CALModuleEventTypeCheck): void
  onEventIntAttributeCheck(ctx: C, ev: CALModuleEventIntAttributeCheck): void
  onEventStringAttributeCheck(ctx: C, ev: CALModuleEventStringAttributeCheck): void
  onEventBoolAttributeCheck(ctx: C, ev: CALModuleEventBoolAttributeCheck): void
  onCountEventIntAttributeCheck(ctx: C, ev: CALModuleCountEventIntAttributeCheck): void
  onRepeatedEventTypeCheck(ctx: C, ev: CALModuleRepeatedEventTypeCheck): void
  onRepeatedEventIntAttributeCheck(ctx: C, ev: CALModuleRepeatedEventIntAttributeCheck): void
  onRepeatedEventStringAttributeCheck(ctx: C, ev: CALModuleRepeatedEventStringAttributeCheck): void
  onRepeatedEventBoolAttributeCheck(ctx: C, ev: CALModuleRepeatedEventBoolAttributeCheck): void
  onEventTypeCheckAfterEventIntAttributeCheck(ctx: C, ev: CALModuleEventTypeCheckAfterEventIntAttributeCheck): void
  onTimeoutCheck(ctx: C, ev: CALModuleTimeoutCheck): void
  onIs(ctx: C, ev: CALModuleIs): void
}

export function routeCALModuleCheckCheckDelegate<C>(ctx: C, val: CALModuleCheck, delegate: ICALModuleCheckCheckDelegate<C>) {
  val?.globalIntAttributeCheck && delegate.onGlobalIntAttributeCheck(ctx, val.globalIntAttributeCheck)
  val?.globalIntAttributeSumCheck && delegate.onGlobalIntAttributeSumCheck(ctx, val.globalIntAttributeSumCheck)
  val?.globalStringAttributeCheck && delegate.onGlobalStringAttributeCheck(ctx, val.globalStringAttributeCheck)
  val?.globalBoolAttributeCheck && delegate.onGlobalBoolAttributeCheck(ctx, val.globalBoolAttributeCheck)
  val?.globalAnyBoolAttributeCheck && delegate.onGlobalAnyBoolAttributeCheck(ctx, val.globalAnyBoolAttributeCheck)
  val?.eventTypeCheck && delegate.onEventTypeCheck(ctx, val.eventTypeCheck)
  val?.eventIntAttributeCheck && delegate.onEventIntAttributeCheck(ctx, val.eventIntAttributeCheck)
  val?.eventStringAttributeCheck && delegate.onEventStringAttributeCheck(ctx, val.eventStringAttributeCheck)
  val?.eventBoolAttributeCheck && delegate.onEventBoolAttributeCheck(ctx, val.eventBoolAttributeCheck)
  val?.countEventIntAttributeCheck && delegate.onCountEventIntAttributeCheck(ctx, val.countEventIntAttributeCheck)
  val?.repeatedEventTypeCheck && delegate.onRepeatedEventTypeCheck(ctx, val.repeatedEventTypeCheck)
  val?.repeatedEventIntAttributeCheck && delegate.onRepeatedEventIntAttributeCheck(ctx, val.repeatedEventIntAttributeCheck)
  val?.repeatedEventStringAttributeCheck && delegate.onRepeatedEventStringAttributeCheck(ctx, val.repeatedEventStringAttributeCheck)
  val?.repeatedEventBoolAttributeCheck && delegate.onRepeatedEventBoolAttributeCheck(ctx, val.repeatedEventBoolAttributeCheck)
  val?.eventTypeCheckAfterEventIntAttributeCheck && delegate.onEventTypeCheckAfterEventIntAttributeCheck(ctx, val.eventTypeCheckAfterEventIntAttributeCheck)
  val?.timeoutCheck && delegate.onTimeoutCheck(ctx, val.timeoutCheck)
  val?.is && delegate.onIs(ctx, val.is)
}




export interface ICALModuleWhenCaseValueDelegate<C> {
  onIntValue(ctx: C, ev: number): void
  onStringValue(ctx: C, ev: string): void
  onBoolValue(ctx: C, ev: boolean): void
  onDefaultValue(ctx: C, ev: CALModuleWhenCaseDefault): void
}

export function routeCALModuleWhenCaseValueDelegate<C>(ctx: C, val: CALModuleWhenCase, delegate: ICALModuleWhenCaseValueDelegate<C>) {
  val?.intValue && delegate.onIntValue(ctx, val.intValue)
  val?.stringValue && delegate.onStringValue(ctx, val.stringValue)
  val?.boolValue && delegate.onBoolValue(ctx, val.boolValue)
  val?.defaultValue && delegate.onDefaultValue(ctx, val.defaultValue)
}




export interface ICALModuleExpressionExpressionDelegate<C> {
  onCheck(ctx: C, ev: CALModuleCheck): void
  onBinaryExpression(ctx: C, ev: CALModuleBinaryExpression): void
  onUnaryExpression(ctx: C, ev: CALModuleUnaryExpression): void
  onGroup(ctx: C, ev: CALModuleGroup): void
  onCheckSequence(ctx: C, ev: CALModuleCheckSequence): void
  onForDuration(ctx: C, ev: CALModuleForDuration): void
  onRepeat(ctx: C, ev: CALModuleRepeat): void
  onWhen(ctx: C, ev: CALModuleWhen): void
}

export function routeCALModuleExpressionExpressionDelegate<C>(ctx: C, val: CALModuleExpression, delegate: ICALModuleExpressionExpressionDelegate<C>) {
  val?.check && delegate.onCheck(ctx, val.check)
  val?.binaryExpression && delegate.onBinaryExpression(ctx, val.binaryExpression)
  val?.unaryExpression && delegate.onUnaryExpression(ctx, val.unaryExpression)
  val?.group && delegate.onGroup(ctx, val.group)
  val?.checkSequence && delegate.onCheckSequence(ctx, val.checkSequence)
  val?.forDuration && delegate.onForDuration(ctx, val.forDuration)
  val?.repeat && delegate.onRepeat(ctx, val.repeat)
  val?.when && delegate.onWhen(ctx, val.when)
}