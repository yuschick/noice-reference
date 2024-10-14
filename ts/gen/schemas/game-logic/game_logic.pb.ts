/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as Game_stream_eventsGame_stream_events from "../game-stream-events/game_stream_events.pb"
import * as RarityRarity from "../rarity/rarity.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum ClientOpCode {
  CLIENT_OP_CODE_UNSPECIFIED = "CLIENT_OP_CODE_UNSPECIFIED",
  CLIENT_OP_CODE_SET_ACTIVE_CARD = "CLIENT_OP_CODE_SET_ACTIVE_CARD",
  CLIENT_OP_CODE_SHUFFLE_HAND = "CLIENT_OP_CODE_SHUFFLE_HAND",
  CLIENT_OP_CODE_TRIGGER_EMOJI = "CLIENT_OP_CODE_TRIGGER_EMOJI",
  CLIENT_OP_CODE_TRIGGER_EMOTE = "CLIENT_OP_CODE_TRIGGER_EMOTE",
  CLIENT_OP_CODE_USE_BOOSTER = "CLIENT_OP_CODE_USE_BOOSTER",
  CLIENT_OP_CODE_COLLECT_AON_POINTS = "CLIENT_OP_CODE_COLLECT_AON_POINTS",
  CLIENT_OP_CODE_REQUEST_BOOSTER = "CLIENT_OP_CODE_REQUEST_BOOSTER",
  CLIENT_OP_CODE_CANCEL_BOOSTER_REQUEST = "CLIENT_OP_CODE_CANCEL_BOOSTER_REQUEST",
  CLIENT_OP_CODE_VOTE_CARD = "CLIENT_OP_CODE_VOTE_CARD",
  CLIENT_OP_CODE_CANCEL_CARD_VOTE = "CLIENT_OP_CODE_CANCEL_CARD_VOTE",
  CLIENT_OP_CODE_REQUEST_HAND = "CLIENT_OP_CODE_REQUEST_HAND",
  CLIENT_OP_CODE_JOIN_TEAM_ACTION = "CLIENT_OP_CODE_JOIN_TEAM_ACTION",
  CLIENT_OP_CODE_REQUEST_AVAILABLE_CHALLENGES = "CLIENT_OP_CODE_REQUEST_AVAILABLE_CHALLENGES",
  CLIENT_OP_CODE_SET_ACTIVE_CHALLENGE = "CLIENT_OP_CODE_SET_ACTIVE_CHALLENGE",
  CLIENT_OP_CODE_SET_DEBUG = "CLIENT_OP_CODE_SET_DEBUG",
}

export enum ServerOpCode {
  SERVER_OP_CODE_UNSPECIFIED = "SERVER_OP_CODE_UNSPECIFIED",
  SERVER_OP_CODE_GAME_INIT = "SERVER_OP_CODE_GAME_INIT",
  SERVER_OP_CODE_MATCH_STARTED = "SERVER_OP_CODE_MATCH_STARTED",
  SERVER_OP_CODE_MATCH_ENDED = "SERVER_OP_CODE_MATCH_ENDED",
  SERVER_OP_CODE_ACTIVE_CARD_SET = "SERVER_OP_CODE_ACTIVE_CARD_SET",
  SERVER_OP_CODE_ACTIVE_CARD_SUCCEEDED = "SERVER_OP_CODE_ACTIVE_CARD_SUCCEEDED",
  SERVER_OP_CODE_ACTIVE_CARD_FAILED = "SERVER_OP_CODE_ACTIVE_CARD_FAILED",
  SERVER_OP_CODE_SETTING_ACTIVE_CARD_FAILED = "SERVER_OP_CODE_SETTING_ACTIVE_CARD_FAILED",
  SERVER_OP_CODE_HAND_SHUFFLED = "SERVER_OP_CODE_HAND_SHUFFLED",
  SERVER_OP_CODE_SHUFFLING_HAND_FAILED = "SERVER_OP_CODE_SHUFFLING_HAND_FAILED",
  SERVER_OP_CODE_PLAYER_POINTS_UPDATED = "SERVER_OP_CODE_PLAYER_POINTS_UPDATED",
  SERVER_OP_CODE_PLAYER_COINS_UPDATED = "SERVER_OP_CODE_PLAYER_COINS_UPDATED",
  SERVER_OP_CODE_PLAYER_JOINED = "SERVER_OP_CODE_PLAYER_JOINED",
  SERVER_OP_CODE_PLAYER_LEFT = "SERVER_OP_CODE_PLAYER_LEFT",
  SERVER_OP_CODE_GROUP_POINTS_UPDATED = "SERVER_OP_CODE_GROUP_POINTS_UPDATED",
  SERVER_OP_CODE_BOOSTER_COOLDOWN_STARTED = "SERVER_OP_CODE_BOOSTER_COOLDOWN_STARTED",
  SERVER_OP_CODE_BOOSTER_AVAILABLE = "SERVER_OP_CODE_BOOSTER_AVAILABLE",
  SERVER_OP_CODE_BOOSTER_USED = "SERVER_OP_CODE_BOOSTER_USED",
  SERVER_OP_CODE_CARD_SWITCH_OUT_TIMER_STARTED = "SERVER_OP_CODE_CARD_SWITCH_OUT_TIMER_STARTED",
  SERVER_OP_CODE_CARD_SWITCH_OUT_AVAILABLE = "SERVER_OP_CODE_CARD_SWITCH_OUT_AVAILABLE",
  SERVER_OP_CODE_CARD_VOTE_ADDED = "SERVER_OP_CODE_CARD_VOTE_ADDED",
  SERVER_OP_CODE_CARD_VOTE_REMOVED = "SERVER_OP_CODE_CARD_VOTE_REMOVED",
  SERVER_OP_CODE_ACTIVE_CARD_POINTS_UPDATED = "SERVER_OP_CODE_ACTIVE_CARD_POINTS_UPDATED",
  SERVER_OP_CODE_BOOSTER_REQUESTED = "SERVER_OP_CODE_BOOSTER_REQUESTED",
  SERVER_OP_CODE_BOOSTER_REQUEST_CANCELLED = "SERVER_OP_CODE_BOOSTER_REQUEST_CANCELLED",
  SERVER_OP_CODE_BOOSTER_REMOVED = "SERVER_OP_CODE_BOOSTER_REMOVED",
  SERVER_OP_CODE_BOOSTER_POINTS_RECEIVED = "SERVER_OP_CODE_BOOSTER_POINTS_RECEIVED",
  SERVER_OP_CODE_ACTIVE_CARD_TARGET_VALUE_CHANGED = "SERVER_OP_CODE_ACTIVE_CARD_TARGET_VALUE_CHANGED",
  SERVER_OP_CODE_AON_POINTS_COLLECTED = "SERVER_OP_CODE_AON_POINTS_COLLECTED",
  SERVER_OP_CODE_BEST_PLAY_POINTS_RECEIVED = "SERVER_OP_CODE_BEST_PLAY_POINTS_RECEIVED",
  SERVER_OP_CODE_GROUP_BONUS_POINTS_RECEIVED = "SERVER_OP_CODE_GROUP_BONUS_POINTS_RECEIVED",
  SERVER_OP_CODE_CARD_DEALING_STARTED = "SERVER_OP_CODE_CARD_DEALING_STARTED",
  SERVER_OP_CODE_CARD_DEALING_ENDED = "SERVER_OP_CODE_CARD_DEALING_ENDED",
  SERVER_OP_CODE_AON_POINTS_COLLECT_FAILED = "SERVER_OP_CODE_AON_POINTS_COLLECT_FAILED",
  SERVER_OP_CODE_DEBUG_MSG = "SERVER_OP_CODE_DEBUG_MSG",
  SERVER_OP_CODE_PLAYER_CARD_UPGRADED = "SERVER_OP_CODE_PLAYER_CARD_UPGRADED",
  SERVER_OP_CODE_RESHUFFLE_COST_UPDATED = "SERVER_OP_CODE_RESHUFFLE_COST_UPDATED",
  SERVER_OP_CODE_GROUP_CREATED = "SERVER_OP_CODE_GROUP_CREATED",
  SERVER_OP_CODE_STREAM_ENDED = "SERVER_OP_CODE_STREAM_ENDED",
  SERVER_OP_CODE_HIGH_SCORING_CARD_SUCCEEDED = "SERVER_OP_CODE_HIGH_SCORING_CARD_SUCCEEDED",
  SERVER_OP_CODE_HIGH_SCORING_CARD_TIMER_UPDATED = "SERVER_OP_CODE_HIGH_SCORING_CARD_TIMER_UPDATED",
  SERVER_OP_CODE_HIGH_SCORING_CARD_PROMOTED = "SERVER_OP_CODE_HIGH_SCORING_CARD_PROMOTED",
  SERVER_OP_CODE_CONTEXTUAL_TEAM_ACTION_UPDATED = "SERVER_OP_CODE_CONTEXTUAL_TEAM_ACTION_UPDATED",
  SERVER_OP_CODE_MATCH_BONUS_RECEIVED = "SERVER_OP_CODE_MATCH_BONUS_RECEIVED",
  SERVER_OP_CODE_INACTIVITY_TIMER_UPDATED = "SERVER_OP_CODE_INACTIVITY_TIMER_UPDATED",
  SERVER_OP_CODE_INACTIVITY_TIMER_CANCELLED = "SERVER_OP_CODE_INACTIVITY_TIMER_CANCELLED",
  SERVER_OP_CODE_INACTIVITY_KICK_RECEIVED = "SERVER_OP_CODE_INACTIVITY_KICK_RECEIVED",
  SERVER_OP_CODE_MATCH_PAUSE_STATE_CHANGED = "SERVER_OP_CODE_MATCH_PAUSE_STATE_CHANGED",
  SERVER_OP_CODE_TEAM_MERGE_WARNING_RECEIVED = "SERVER_OP_CODE_TEAM_MERGE_WARNING_RECEIVED",
  SERVER_OP_CODE_TEAM_MERGE_EXECUTED = "SERVER_OP_CODE_TEAM_MERGE_EXECUTED",
  SERVER_OP_CODE_ROUND_PHASE_CHANGED = "SERVER_OP_CODE_ROUND_PHASE_CHANGED",
  SERVER_OP_CODE_AVAILABLE_CHALLENGES = "SERVER_OP_CODE_AVAILABLE_CHALLENGES",
  SERVER_OP_CODE_SET_ACTIVE_CHALLENGE = "SERVER_OP_CODE_SET_ACTIVE_CHALLENGE",
  SERVER_OP_CODE_CHALLENGE_EVENT = "SERVER_OP_CODE_CHALLENGE_EVENT",
  SERVER_OP_CODE_CHALLENGE_PICK_RATES_UPDATE = "SERVER_OP_CODE_CHALLENGE_PICK_RATES_UPDATE",
  SERVER_OP_CODE_CHALLENGE_PICKS_LOCKED = "SERVER_OP_CODE_CHALLENGE_PICKS_LOCKED",
  SERVER_OP_CODE_SETTING_ACTIVE_CHALLENGE_FAILED = "SERVER_OP_CODE_SETTING_ACTIVE_CHALLENGE_FAILED",
  SERVER_OP_CODE_GLOBALS_UPDATED = "SERVER_OP_CODE_GLOBALS_UPDATED",
}

export enum DebugMsgType {
  DEBUG_MSG_TYPE_UNSPECIFIED = "DEBUG_MSG_TYPE_UNSPECIFIED",
  DEBUG_MSG_TYPE_ML_EVENTS = "DEBUG_MSG_TYPE_ML_EVENTS",
  DEBUG_MSG_TYPE_DEBUG_ENABLED = "DEBUG_MSG_TYPE_DEBUG_ENABLED",
  DEBUG_MSG_TYPE_CR = "DEBUG_MSG_TYPE_CR",
}

export enum GroupType {
  GROUP_TYPE_UNSPECIFIED = "GROUP_TYPE_UNSPECIFIED",
  GROUP_TYPE_TEAM = "GROUP_TYPE_TEAM",
  GROUP_TYPE_SOLO = "GROUP_TYPE_SOLO",
  GROUP_TYPE_PARTY = "GROUP_TYPE_PARTY",
}

export enum ContextualTeamActionType {
  CONTEXTUAL_TEAM_ACTION_TYPE_UNSPECIFIED = "CONTEXTUAL_TEAM_ACTION_TYPE_UNSPECIFIED",
  CONTEXTUAL_TEAM_ACTION_TYPE_HIGH_SCORING_CARD_PROMOTED = "CONTEXTUAL_TEAM_ACTION_TYPE_HIGH_SCORING_CARD_PROMOTED",
  CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED = "CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED",
}

export enum ContextualTeamActionStatus {
  CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED = "CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED",
  CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING = "CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING",
  CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED = "CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED",
  CONTEXTUAL_TEAM_ACTION_STATUS_FAILED = "CONTEXTUAL_TEAM_ACTION_STATUS_FAILED",
}

export enum BoosterType {
  BOOSTER_TYPE_UNSPECIFIED = "BOOSTER_TYPE_UNSPECIFIED",
  BOOSTER_TYPE_SPEED_UP = "BOOSTER_TYPE_SPEED_UP",
  BOOSTER_TYPE_SCAVENGE = "BOOSTER_TYPE_SCAVENGE",
  BOOSTER_TYPE_GOOD_CALL = "BOOSTER_TYPE_GOOD_CALL",
  BOOSTER_TYPE_LETS_GO = "BOOSTER_TYPE_LETS_GO",
  BOOSTER_TYPE_DOUBT = "BOOSTER_TYPE_DOUBT",
  BOOSTER_TYPE_NEXT_UP = "BOOSTER_TYPE_NEXT_UP",
}

export enum MatchBonusType {
  MATCH_BONUS_TYPE_UNSPECIFIED = "MATCH_BONUS_TYPE_UNSPECIFIED",
  MATCH_BONUS_TYPE_VICTORY_ROYAL = "MATCH_BONUS_TYPE_VICTORY_ROYAL",
}

export enum ChallengeState {
  CHALLENGE_STATE_UNSPECIFIED = "CHALLENGE_STATE_UNSPECIFIED",
  CHALLENGE_STATE_SUCCESS = "CHALLENGE_STATE_SUCCESS",
  CHALLENGE_STATE_FAILURE = "CHALLENGE_STATE_FAILURE",
  CHALLENGE_STATE_UNRESOLVED = "CHALLENGE_STATE_UNRESOLVED",
}

export enum ActiveCardFailedMsgReason {
  REASON_UNSPECIFIED = "REASON_UNSPECIFIED",
  REASON_CARD_FAILED = "REASON_CARD_FAILED",
  REASON_SWITCHED_OUT = "REASON_SWITCHED_OUT",
  REASON_MATCH_ENDED = "REASON_MATCH_ENDED",
  REASON_DISCARDED = "REASON_DISCARDED",
}

export enum SettingActiveCardFailedMsgErrorCode {
  ERROR_CODE_CARD_UNSPECIFIED = "ERROR_CODE_CARD_UNSPECIFIED",
  ERROR_CODE_CARD_NOT_IN_HAND = "ERROR_CODE_CARD_NOT_IN_HAND",
  ERROR_CODE_SWITCH_OUT_TIMER_RUNNING = "ERROR_CODE_SWITCH_OUT_TIMER_RUNNING",
  ERROR_CODE_CARD_IS_MATCH_CARD = "ERROR_CODE_CARD_IS_MATCH_CARD",
  ERROR_CODE_MATCH_NOT_ACTIVE = "ERROR_CODE_MATCH_NOT_ACTIVE",
  ERROR_CODE_INVALID_ROUND_PHASE = "ERROR_CODE_INVALID_ROUND_PHASE",
}

export enum ShufflingHandFailedMsgErrorCode {
  ERROR_CODE_UNSPECIFIED = "ERROR_CODE_UNSPECIFIED",
  ERROR_CODE_NOT_ENOUGH_TOKENS = "ERROR_CODE_NOT_ENOUGH_TOKENS",
}

export enum AONPointsCollectFailedMsgErrorCode {
  ERROR_CODE_UNSPECIFIED = "ERROR_CODE_UNSPECIFIED",
  ERROR_CODE_AON_NOT_ACTIVE = "ERROR_CODE_AON_NOT_ACTIVE",
  ERROR_CODE_AON_TIMER_RUNNING = "ERROR_CODE_AON_TIMER_RUNNING",
}

export enum LastActiveCardStatus {
  STATUS_UNSPECIFIED = "STATUS_UNSPECIFIED",
  STATUS_SUCCEEDED = "STATUS_SUCCEEDED",
  STATUS_FAILED = "STATUS_FAILED",
}

export enum StreamStateMatchState {
  MATCH_STATE_UNSPECIFIED = "MATCH_STATE_UNSPECIFIED",
  MATCH_STATE_ACTIVE = "MATCH_STATE_ACTIVE",
  MATCH_STATE_ENDED = "MATCH_STATE_ENDED",
  MATCH_STATE_PAUSED = "MATCH_STATE_PAUSED",
}

export enum StreamStateMatchType {
  MATCH_TYPE_UNSPECIFIED = "MATCH_TYPE_UNSPECIFIED",
  MATCH_TYPE_SINGLE_ROUND = "MATCH_TYPE_SINGLE_ROUND",
  MATCH_TYPE_MULTI_ROUND = "MATCH_TYPE_MULTI_ROUND",
}

export enum StreamStateRoundPhase {
  ROUND_PHASE_UNSPECIFIED = "ROUND_PHASE_UNSPECIFIED",
  ROUND_PHASE_PREPARATION = "ROUND_PHASE_PREPARATION",
  ROUND_PHASE_COMPETITION = "ROUND_PHASE_COMPETITION",
  ROUND_PHASE_ENDED = "ROUND_PHASE_ENDED",
}

export enum SettingActiveChallengeFailedMsgErrorCode {
  ERROR_CODE_UNSPECIFIED = "ERROR_CODE_UNSPECIFIED",
  ERROR_CODE_CHALLENGE_NOT_ACTIVE = "ERROR_CODE_CHALLENGE_NOT_ACTIVE",
  ERROR_CODE_CHALLENGE_PICKS_LOCKED = "ERROR_CODE_CHALLENGE_PICKS_LOCKED",
}

export type SetActiveCardMsg = {
  cardId?: string
}

export type ShuffleHandMsg = {
}

export type TriggerEmojiMsg = {
  emojiId?: string
}

export type TriggerEmoteMsg = {
  emoteId?: string
}

export type UseBoosterMsg = {
  targetUserId?: string
  boosterId?: number
}

export type RequestBoosterMsg = {
  targetUserId?: string
  boosterId?: number
}

export type CancelBoosterRequestMsg = {
  targetUserId?: string
  boosterId?: number
}

export type VoteCardMsg = {
  targetUserId?: string
  cardId?: string
}

export type CancelCardVoteMsg = {
  targetUserId?: string
  cardId?: string
}

export type SetDebugMsg = {
  msgType?: DebugMsgType
  enabled?: boolean
  jsonData?: string
}

export type CollectAONPointsMsg = {
}

export type RequestHandMsg = {
}

export type JoinTeamActionMsg = {
}

export type GameInitMsg = {
  serverTime?: string
  matchConfiguration?: MatchConfiguration
  matchData?: MatchData
  matchStateData?: MatchStateData
  streamId?: string
  channelId?: string
  challengeStatesData?: ChallengeStatesData
}

export type MatchStartedMsg = {
  streamId?: string
  groupId?: string
  matchId?: string
}

export type MatchPauseStateChangedMsg = {
  streamId?: string
  groupId?: string
  matchId?: string
  paused?: boolean
}

export type MatchEndedMsg = {
  streamId?: string
  groupId?: string
  players?: Player[]
  group?: Group
  bestGroup?: GroupDetails
  bestPlayer?: PlayerDetails
  bestCard?: CardDetails
  matchId?: string
  channelId?: string
  gameId?: string
  challengeStatuses?: ChallengeStatus[]
}

export type RoundPhaseChangedMsg = {
  streamId?: string
  groupId?: string
  matchId?: string
  roundPhase?: StreamStateRoundPhase
  roundPhaseDeadline?: string
  roundNumber?: number
}

export type CardDealingStartedMsg = {
  userId?: string
  cardId?: string
}

export type CardDealingEndedMsg = {
  userId?: string
  cardId?: string
}

export type ActiveCardSetMsg = {
  userId?: string
  cardId?: string
  allOrNothing?: AllOrNothing
  pointsUpdateDuration?: string
}

export type ActiveCardSucceededMsg = {
  userId?: string
  cardId?: string
  points?: number
  boosterPoints?: PlayerBoosterPoints[]
  bestPlay?: BestPlay
  allOrNothing?: AllOrNothing
  groupId?: string
  streamId?: string
}

export type ActiveCardFailedMsg = {
  userId?: string
  cardId?: string
  points?: number
  boosterPoints?: PlayerBoosterPoints[]
  reason?: ActiveCardFailedMsgReason
}

export type ActiveCardPointsUpdatedMsg = {
  userId?: string
  cardId?: string
  points?: number
  pointsUpdateDuration?: string
}

export type ActiveCardTargetValueChangedMsg = {
  userId?: string
  cardId?: string
  targetValue?: number
  timerDuration?: number
  isFailureModule?: boolean
  targetValues?: {[key: string]: number}
}

export type SettingActiveCardFailedMsg = {
  userId?: string
  cardId?: string
  errorCode?: SettingActiveCardFailedMsgErrorCode
}


type BaseAttribute = {
  name?: string
}

export type Attribute = BaseAttribute
  & OneOf<{ intValue: number; stringValue: string; boolValue: boolean }>

export type HandShuffledMsg = {
  userId?: string
  cardIds?: string[]
  matchEndCardIds?: string[]
  userRequestedShuffle?: boolean
  globals?: Attribute[]
}

export type ShufflingHandFailedMsg = {
  userId?: string
  errorCode?: ShufflingHandFailedMsgErrorCode
}

export type PlayerPointsUpdatedMsg = {
  streamId?: string
  groupId?: string
  userId?: string
  points?: number
  diff?: number
}

export type PlayerCoinsUpdatedMsg = {
  userId?: string
  coins?: number
}

export type PlayerJoinedMsg = {
  streamId?: string
  groupId?: string
  userId?: string
  player?: Player
  serverTime?: string
  playerCardIds?: string[]
}

export type PlayerLeftMsg = {
  streamId?: string
  groupId?: string
  userId?: string
  permanent?: boolean
}

export type GroupPointsUpdatedMsg = {
  userId?: string
  groupId?: string
  points?: number
  diff?: number
  activeUserIds?: string[]
}

export type BoosterCooldownStartedMsg = {
  userId?: string
  startTime?: string
  endTime?: string
}

export type BoosterAvailableMsg = {
  userId?: string
  boosterId?: number
}

export type BoosterUsedMsg = {
  userId?: string
  targetUserId?: string
  boosterId?: number
}

export type BoosterRequestedMsg = {
  userId?: string
  targetUserId?: string
  boosterId?: number
}

export type BoosterRequestCancelledMsg = {
  userId?: string
  targetUserId?: string
  boosterId?: number
}

export type BoosterRemovedMsg = {
  activatorUserId?: string
  targetUserId?: string
}

export type BoosterPointsReceivedMsg = {
  boosterPoints?: PlayerBoosterPoints
}

export type CardSwitchOutTimerStartedMsg = {
  userId?: string
  startTime?: string
  endTime?: string
}

export type CardSwitchOutAvailableMsg = {
  userId?: string
}

export type CardVoteAddedMsg = {
  cardId?: string
  sourceUserId?: string
  targetUserId?: string
}

export type CardVoteRemovedMsg = {
  cardId?: string
  userId?: string
}

export type BestPlayPointsReceivedMsg = {
  userId?: string
  bestPlay?: BestPlay
}

export type AONPointsCollectedMsg = {
  userId?: string
  bestPlay?: BestPlay
  points?: number
  lastActivationResult?: CardActivationResult
  groupId?: string
  cardId?: string
}

export type AONPointsCollectFailedMsg = {
  userId?: string
  errorCode?: AONPointsCollectFailedMsgErrorCode
}

export type GroupBonusPointsReceivedMsg = {
  points?: number
}

export type StreamEndedMsg = {
  streamId?: string
  groupId?: string
}

export type HighScoringCard = {
  cardId?: string
  points?: number
  boosterPoints?: PlayerBoosterPoints[]
}

export type HighScoringCardSucceededMsg = {
  card?: HighScoringCard
  userId?: string
  groupName?: string
  countdownMs?: number
  groupId?: string
}

export type HighScoringCardPromotedMsg = {
  card?: HighScoringCard
  userId?: string
  groupName?: string
  groupId?: string
}

export type ContextualTeamActionUpdateMsg = {
  participants?: {[key: string]: boolean}
  deadlineMs?: string
  status?: ContextualTeamActionStatus
  type?: ContextualTeamActionType
}

export type MatchBonusReceivedMsg = {
  userId?: string
  bonusType?: MatchBonusType
  points?: number
}

export type TeamMergeWarningReceivedMsg = {
  countdownMs?: number
}

export type TeamMergeExecutedMsg = {
  newGroupId?: string
}

export type GlobalsUpdatedMsg = {
  globals?: Attribute[]
}


type BaseDebugMsg = {
  userId?: string
  type?: DebugMsgType
}

export type DebugMsg = BaseDebugMsg
  & OneOf<{ gameStreamEvent: Game_stream_eventsGame_stream_events.GameStreamEvent }>

export type MatchConfiguration = {
  handSize?: number
  cardSwitchOutTimerDuration?: string
  pointsGainTime?: number
  reshuffleBaseCost?: number
  reshuffleCostMultiplier?: number
  boosterCooldowns?: string[]
  aonPointMultipliers?: number[]
  gameId?: string
  matchBonusType?: MatchBonusType
  matchBonusActivationRule?: string
  matchBonusPoints?: number
  seasonId?: string
  freeReshuffleCount?: number
  matchType?: StreamStateMatchType
  cardGlobalRefs?: string[]
}

export type StreamerCard = {
  id?: string
  channelId?: string
  videoUrl?: string
  imageUrl?: string
  facecamUrl?: string
  gameId?: string
  familyId?: string
  name?: string
  draft?: boolean
}

export type TargetValueSelectorDefaultValue = {
}


type BaseTargetValueSelector = {
  attribute?: string
}

export type TargetValueSelector = BaseTargetValueSelector
  & OneOf<{ stringValue: string; intValue: number; boolValue: boolean; defaultValue: TargetValueSelectorDefaultValue }>

export type TargetValue = {
  label?: string
  value?: number
  selector?: TargetValueSelector
}

export type TargetValues = {
  targetValues?: TargetValue[]
}

export type CardLeveling = {
  currentLevel?: number
  progressToNextLevel?: number
  nextLevelLimit?: number
}

export type Card = {
  id?: string
  name?: string
  rarity?: RarityRarity.Rarity
  leveling?: CardLeveling
  description?: string
  pointsMin?: number
  pointsMax?: number
  pointsTimeTarget?: number
  frontImage?: string
  backImage?: string
  isMatchCard?: boolean
  isAllOrNothing?: boolean
  successModules?: string[]
  failureModules?: string[]
  dealingModules?: string[]
  targetValue?: number
  isEnabled?: boolean
  timerDuration?: number
  isDealtAtStart?: boolean
  scoredCounterIds?: string[]
  activeStreamerCard?: StreamerCard
  icon?: string
  seasonId?: string
  matchCardId?: number
  gameModes?: string[]
  sides?: string[]
  roleCharacters?: string[]
  failureTargetValue?: number
  familyId?: string
  unlockLevel?: number
  targetValues?: TargetValue[]
}

export type Booster = {
  id?: number
  name?: string
  description?: string
  descriptionCondition?: string
  descriptionTargetSelf?: string
  descriptionDefaultBenefit?: string
  descriptionOtherBenefit?: string
  descriptionTargetNoneBenefit?: string
  image?: string
  valueSelf?: number
  valueOther?: number
  timeActive?: number
  canTargetSelf?: boolean
  isAvailableSolo?: boolean
  triggersOn?: string[]
  removeOn?: string[]
  isSelfAndOtherEffect?: boolean
}

export type BestPlay = {
  points?: number
  cardId?: string
  activeBoosters?: ActiveBooster[]
}

export type Player = {
  userId?: string
  userName?: string
  name?: string
  isOnline?: boolean
  points?: number
  hand?: Hand
  activeCard?: ActiveCard
  boosterCooldownTimer?: Timer
  cardSwitchOutTimer?: Timer
  heldBoosterId?: number
  usedBoosterCount?: number
  selfUsedBoosterCount?: number
  bestPlay?: BestPlay
  allOrNothing?: AllOrNothing
  reshuffleCount?: number
  remainingInactiveSeconds?: number
  usedMatchCards?: {[key: number]: boolean}
  fullUser?: boolean
  lastActiveCard?: LastActiveCard
  inactivityWarningOn?: boolean
  activeChallengeId?: string
}

export type Hand = {
  cardIds?: string[]
  votes?: Vote[]
  matchEndCardIds?: string[]
  previousCardIds?: string[]
}

export type Timer = {
  startTime?: string
  endTime?: string
}

export type ActiveBooster = {
  boosterId?: number
  activatorUserId?: string
  activationTime?: string
}

export type ActiveCard = {
  cardId?: string
  setTime?: string
  pointsUpdateTime?: string
  points?: number
  pointsMin?: number
  pointsMax?: number
  pointsTimeTarget?: number
  pointsUpdateTimer?: Timer
  targetValue?: number
  activeBoosters?: {[key: string]: ActiveBooster}
  timerDuration?: number
  failureTargetValue?: number
  targetValues?: {[key: string]: number}
}

export type LastActiveCard = {
  activeCard?: ActiveCard
  status?: LastActiveCardStatus
}

export type AllOrNothing = {
  cardId?: string
  totalRounds?: number
  round?: number
  totalPoints?: number
  nextPoints?: number
  bestPlay?: BestPlay
  cardActivations?: CardActivationResult[]
}

export type CardActivationResult = {
  cardId?: string
  points?: number
  boosterPoints?: PlayerBoosterPoints[]
}

export type Vote = {
  userId?: string
  cardId?: string
}

export type Group = {
  id?: string
  name?: string
  points?: number
  isSolo?: boolean
  isParty?: boolean
}

export type MatchData = {
  cards?: Card[]
  boosters?: Booster[]
  cardIds?: string[]
  boosterIds?: number[]
}

export type MatchStateData = {
  streamState?: StreamState
  players?: Player[]
  group?: Group
  globals?: Attribute[]
}

export type StreamState = {
  matchState?: StreamStateMatchState
  matchSeqNum?: number
  matchType?: StreamStateMatchType
  roundPhase?: StreamStateRoundPhase
  roundPhaseDeadline?: string
  roundNumber?: number
}

export type PlayerBoosterPoints = {
  userId?: string
  cardUserId?: string
  donatorUserId?: string
  boosterId?: number
  points?: number
}

export type CardUpgrade = {
  oldCard?: Card
  newCard?: Card
}

export type PlayerCardUpgradedMsg = {
  userId?: string
  upgrade?: CardUpgrade
  allOrNothing?: AllOrNothing
}

export type ReshuffleCostUpdatedMsg = {
  userId?: string
  nextReshuffleCost?: number
}

export type GroupCreatedMsg = {
  streamId?: string
  groupId?: string
  name?: string
  isSolo?: boolean
}

export type ActivateContextualTeamAction = {
}

export type PlayerDetails = {
  id?: string
  points?: number
  groupName?: string
}

export type GroupDetails = {
  group?: Group
  players?: PlayerDetails[]
  streamId?: string
}

export type CardDetails = {
  succeedingCard?: ActiveCardSucceededMsg
  groupName?: string
}

export type InactivityTimerUpdatedMsg = {
  userId?: string
  secondsRemaining?: number
}

export type InactivityTimerCancelledMsg = {
  userId?: string
}

export type InactivityKickReceivedMsg = {
  userId?: string
}

export type Challenge = {
  id?: string
  name?: string
  description?: string
  disabled?: boolean
  successModule?: string
  failureModule?: string
  gameId?: string
  targetValues?: TargetValue[]
  channelId?: string
}

export type RequestAvailableChallengesMsg = {
}

export type AvailableChallengesMsg = {
  challengeIds?: string[]
}

export type SetActiveChallengeMsg = {
  challengeId?: string
  userId?: string
}

export type SettingActiveChallengeFailedMsg = {
  challengeId?: string
  userId?: string
  errorCode?: SettingActiveChallengeFailedMsgErrorCode
}

export type ChallengeEventMsg = {
  challengeId?: string
  challengeState?: ChallengeState
  targetValues?: TargetValue[]
}

export type ChallengeCompleted = {
  challengeId?: string
  userId?: string
  pickRate?: number
  gameId?: string
}

export type ChallengeCompletedEvent = {
  challengeCompleted?: ChallengeCompleted
}

export type ChallengePickRatesUpdateMsg = {
  pickRates?: {[key: string]: number}
}

export type ChallengePicksLockedMsg = {
  pickRates?: {[key: string]: number}
}

export type ChallengeStatus = {
  challengeId?: string
  pickRate?: number
  challengeState?: ChallengeState
  targetValues?: TargetValue[]
}

export type ChallengeStatesData = {
  isEnabled?: boolean
  challengeStatuses?: ChallengeStatus[]
}




export interface IAttributeValueDelegate<C> {
  onIntValue(ctx: C, ev: number): void
  onStringValue(ctx: C, ev: string): void
  onBoolValue(ctx: C, ev: boolean): void
}

export function routeAttributeValueDelegate<C>(ctx: C, val: Attribute, delegate: IAttributeValueDelegate<C>) {
  val?.intValue && delegate.onIntValue(ctx, val.intValue)
  val?.stringValue && delegate.onStringValue(ctx, val.stringValue)
  val?.boolValue && delegate.onBoolValue(ctx, val.boolValue)
}




export interface IDebugMsgPayloadDelegate<C> {
  onGameStreamEvent(ctx: C, ev: Game_stream_eventsGame_stream_events.GameStreamEvent): void
}

export function routeDebugMsgPayloadDelegate<C>(ctx: C, val: DebugMsg, delegate: IDebugMsgPayloadDelegate<C>) {
  val?.gameStreamEvent && delegate.onGameStreamEvent(ctx, val.gameStreamEvent)
}




export interface ITargetValueSelectorValueDelegate<C> {
  onStringValue(ctx: C, ev: string): void
  onIntValue(ctx: C, ev: number): void
  onBoolValue(ctx: C, ev: boolean): void
  onDefaultValue(ctx: C, ev: TargetValueSelectorDefaultValue): void
}

export function routeTargetValueSelectorValueDelegate<C>(ctx: C, val: TargetValueSelector, delegate: ITargetValueSelectorValueDelegate<C>) {
  val?.stringValue && delegate.onStringValue(ctx, val.stringValue)
  val?.intValue && delegate.onIntValue(ctx, val.intValue)
  val?.boolValue && delegate.onBoolValue(ctx, val.boolValue)
  val?.defaultValue && delegate.onDefaultValue(ctx, val.defaultValue)
}