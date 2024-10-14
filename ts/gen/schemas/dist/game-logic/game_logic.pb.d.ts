import * as Game_stream_eventsGame_stream_events from "../game-stream-events/game_stream_events.pb";
import * as RarityRarity from "../rarity/rarity.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum ClientOpCode {
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
    CLIENT_OP_CODE_SET_DEBUG = "CLIENT_OP_CODE_SET_DEBUG"
}
export declare enum ServerOpCode {
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
    SERVER_OP_CODE_TEAM_MERGE_EXECUTED = "SERVER_OP_CODE_TEAM_MERGE_EXECUTED"
}
export declare enum DebugMsgType {
    DEBUG_MSG_TYPE_UNSPECIFIED = "DEBUG_MSG_TYPE_UNSPECIFIED",
    DEBUG_MSG_TYPE_ML_EVENTS = "DEBUG_MSG_TYPE_ML_EVENTS",
    DEBUG_MSG_TYPE_DEBUG_ENABLED = "DEBUG_MSG_TYPE_DEBUG_ENABLED",
    DEBUG_MSG_TYPE_CR = "DEBUG_MSG_TYPE_CR"
}
export declare enum GroupType {
    GROUP_TYPE_UNSPECIFIED = "GROUP_TYPE_UNSPECIFIED",
    GROUP_TYPE_TEAM = "GROUP_TYPE_TEAM",
    GROUP_TYPE_SOLO = "GROUP_TYPE_SOLO",
    GROUP_TYPE_PARTY = "GROUP_TYPE_PARTY"
}
export declare enum ContextualTeamActionType {
    CONTEXTUAL_TEAM_ACTION_TYPE_UNSPECIFIED = "CONTEXTUAL_TEAM_ACTION_TYPE_UNSPECIFIED",
    CONTEXTUAL_TEAM_ACTION_TYPE_HIGH_SCORING_CARD_PROMOTED = "CONTEXTUAL_TEAM_ACTION_TYPE_HIGH_SCORING_CARD_PROMOTED",
    CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED = "CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED"
}
export declare enum ContextualTeamActionStatus {
    CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED = "CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED",
    CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING = "CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING",
    CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED = "CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED",
    CONTEXTUAL_TEAM_ACTION_STATUS_FAILED = "CONTEXTUAL_TEAM_ACTION_STATUS_FAILED"
}
export declare enum BoosterType {
    BOOSTER_TYPE_UNSPECIFIED = "BOOSTER_TYPE_UNSPECIFIED",
    BOOSTER_TYPE_SPEED_UP = "BOOSTER_TYPE_SPEED_UP",
    BOOSTER_TYPE_SCAVENGE = "BOOSTER_TYPE_SCAVENGE",
    BOOSTER_TYPE_GOOD_CALL = "BOOSTER_TYPE_GOOD_CALL",
    BOOSTER_TYPE_LETS_GO = "BOOSTER_TYPE_LETS_GO",
    BOOSTER_TYPE_DOUBT = "BOOSTER_TYPE_DOUBT",
    BOOSTER_TYPE_NEXT_UP = "BOOSTER_TYPE_NEXT_UP"
}
export declare enum MatchBonusType {
    MATCH_BONUS_TYPE_UNSPECIFIED = "MATCH_BONUS_TYPE_UNSPECIFIED",
    MATCH_BONUS_TYPE_VICTORY_ROYAL = "MATCH_BONUS_TYPE_VICTORY_ROYAL"
}
export declare enum ActiveCardFailedMsgReason {
    REASON_UNSPECIFIED = "REASON_UNSPECIFIED",
    REASON_CARD_FAILED = "REASON_CARD_FAILED",
    REASON_SWITCHED_OUT = "REASON_SWITCHED_OUT",
    REASON_MATCH_ENDED = "REASON_MATCH_ENDED",
    REASON_DISCARDED = "REASON_DISCARDED"
}
export declare enum SettingActiveCardFailedMsgErrorCode {
    ERROR_CODE_CARD_UNSPECIFIED = "ERROR_CODE_CARD_UNSPECIFIED",
    ERROR_CODE_CARD_NOT_IN_HAND = "ERROR_CODE_CARD_NOT_IN_HAND",
    ERROR_CODE_SWITCH_OUT_TIMER_RUNNING = "ERROR_CODE_SWITCH_OUT_TIMER_RUNNING",
    ERROR_CODE_CARD_IS_MATCH_CARD = "ERROR_CODE_CARD_IS_MATCH_CARD",
    ERROR_CODE_MATCH_NOT_ACTIVE = "ERROR_CODE_MATCH_NOT_ACTIVE"
}
export declare enum ShufflingHandFailedMsgErrorCode {
    ERROR_CODE_UNSPECIFIED = "ERROR_CODE_UNSPECIFIED",
    ERROR_CODE_NOT_ENOUGH_TOKENS = "ERROR_CODE_NOT_ENOUGH_TOKENS"
}
export declare enum AONPointsCollectFailedMsgErrorCode {
    ERROR_CODE_UNSPECIFIED = "ERROR_CODE_UNSPECIFIED",
    ERROR_CODE_AON_NOT_ACTIVE = "ERROR_CODE_AON_NOT_ACTIVE",
    ERROR_CODE_AON_TIMER_RUNNING = "ERROR_CODE_AON_TIMER_RUNNING"
}
export declare enum StreamStateMatchState {
    MATCH_STATE_UNSPECIFIED = "MATCH_STATE_UNSPECIFIED",
    MATCH_STATE_ACTIVE = "MATCH_STATE_ACTIVE",
    MATCH_STATE_ENDED = "MATCH_STATE_ENDED",
    MATCH_STATE_PAUSED = "MATCH_STATE_PAUSED"
}
export declare enum StreamStateMatchType {
    MATCH_TYPE_UNSPECIFIED = "MATCH_TYPE_UNSPECIFIED",
    MATCH_TYPE_SINGLE_ROUND = "MATCH_TYPE_SINGLE_ROUND",
    MATCH_TYPE_MULTI_ROUND = "MATCH_TYPE_MULTI_ROUND"
}
export declare enum StreamStateRoundPhase {
    ROUND_PHASE_UNSPECIFIED = "ROUND_PHASE_UNSPECIFIED",
    ROUND_PHASE_BUYING = "ROUND_PHASE_BUYING",
    ROUND_PHASE_COMPETING = "ROUND_PHASE_COMPETING",
    ROUND_PHASE_ENDED = "ROUND_PHASE_ENDED"
}
export type SetActiveCardMsg = {
    cardId?: string;
};
export type ShuffleHandMsg = {};
export type TriggerEmojiMsg = {
    emojiId?: string;
};
export type TriggerEmoteMsg = {
    emoteId?: string;
};
export type UseBoosterMsg = {
    targetUserId?: string;
    boosterId?: number;
};
export type RequestBoosterMsg = {
    targetUserId?: string;
    boosterId?: number;
};
export type CancelBoosterRequestMsg = {
    targetUserId?: string;
    boosterId?: number;
};
export type VoteCardMsg = {
    targetUserId?: string;
    cardId?: string;
};
export type CancelCardVoteMsg = {
    targetUserId?: string;
    cardId?: string;
};
export type SetDebugMsg = {
    msgType?: DebugMsgType;
    enabled?: boolean;
    jsonData?: string;
};
export type CollectAONPointsMsg = {};
export type RequestHandMsg = {};
export type JoinTeamActionMsg = {};
export type GameInitMsg = {
    serverTime?: string;
    matchConfiguration?: MatchConfiguration;
    matchData?: MatchData;
    matchStateData?: MatchStateData;
    streamId?: string;
};
export type MatchStartedMsg = {
    streamId?: string;
    groupId?: string;
    matchId?: string;
};
export type MatchPauseStateChangedMsg = {
    streamId?: string;
    groupId?: string;
    matchId?: string;
    paused?: boolean;
};
export type MatchEndedMsg = {
    streamId?: string;
    groupId?: string;
    players?: Player[];
    group?: Group;
    bestGroup?: GroupDetails;
    bestPlayer?: PlayerDetails;
    bestCard?: CardDetails;
    matchId?: string;
};
export type CardDealingStartedMsg = {
    userId?: string;
    cardId?: string;
};
export type CardDealingEndedMsg = {
    userId?: string;
    cardId?: string;
};
export type ActiveCardSetMsg = {
    userId?: string;
    cardId?: string;
    allOrNothing?: AllOrNothing;
    pointsUpdateDuration?: string;
};
export type ActiveCardSucceededMsg = {
    userId?: string;
    cardId?: string;
    points?: number;
    boosterPoints?: PlayerBoosterPoints[];
    bestPlay?: BestPlay;
    allOrNothing?: AllOrNothing;
    groupId?: string;
    streamId?: string;
};
export type ActiveCardFailedMsg = {
    userId?: string;
    cardId?: string;
    points?: number;
    boosterPoints?: PlayerBoosterPoints[];
    reason?: ActiveCardFailedMsgReason;
};
export type ActiveCardPointsUpdatedMsg = {
    userId?: string;
    cardId?: string;
    points?: number;
    pointsUpdateDuration?: string;
};
export type ActiveCardTargetValueChangedMsg = {
    userId?: string;
    cardId?: string;
    targetValue?: number;
    timerDuration?: number;
    isFailureModule?: boolean;
    targetValues?: {
        [key: string]: number;
    };
};
export type SettingActiveCardFailedMsg = {
    userId?: string;
    cardId?: string;
    errorCode?: SettingActiveCardFailedMsgErrorCode;
};
export type HandShuffledMsg = {
    userId?: string;
    cardIds?: string[];
    matchEndCardIds?: string[];
    userRequestedShuffle?: boolean;
};
export type ShufflingHandFailedMsg = {
    userId?: string;
    errorCode?: ShufflingHandFailedMsgErrorCode;
};
export type PlayerPointsUpdatedMsg = {
    streamId?: string;
    groupId?: string;
    userId?: string;
    points?: number;
    diff?: number;
};
export type PlayerCoinsUpdatedMsg = {
    userId?: string;
    coins?: number;
};
export type PlayerJoinedMsg = {
    streamId?: string;
    groupId?: string;
    userId?: string;
    player?: Player;
    serverTime?: string;
    playerCardIds?: string[];
};
export type PlayerLeftMsg = {
    streamId?: string;
    groupId?: string;
    userId?: string;
    permanent?: boolean;
};
export type GroupPointsUpdatedMsg = {
    userId?: string;
    groupId?: string;
    points?: number;
    diff?: number;
    activeUserIds?: string[];
};
export type BoosterCooldownStartedMsg = {
    userId?: string;
    startTime?: string;
    endTime?: string;
};
export type BoosterAvailableMsg = {
    userId?: string;
    boosterId?: number;
};
export type BoosterUsedMsg = {
    userId?: string;
    targetUserId?: string;
    boosterId?: number;
};
export type BoosterRequestedMsg = {
    userId?: string;
    targetUserId?: string;
    boosterId?: number;
};
export type BoosterRequestCancelledMsg = {
    userId?: string;
    targetUserId?: string;
    boosterId?: number;
};
export type BoosterRemovedMsg = {
    activatorUserId?: string;
    targetUserId?: string;
};
export type BoosterPointsReceivedMsg = {
    boosterPoints?: PlayerBoosterPoints;
};
export type CardSwitchOutTimerStartedMsg = {
    userId?: string;
    startTime?: string;
    endTime?: string;
};
export type CardSwitchOutAvailableMsg = {
    userId?: string;
};
export type CardVoteAddedMsg = {
    cardId?: string;
    sourceUserId?: string;
    targetUserId?: string;
};
export type CardVoteRemovedMsg = {
    cardId?: string;
    userId?: string;
};
export type BestPlayPointsReceivedMsg = {
    userId?: string;
    bestPlay?: BestPlay;
};
export type AONPointsCollectedMsg = {
    userId?: string;
    bestPlay?: BestPlay;
    points?: number;
    lastActivationResult?: CardActivationResult;
    groupId?: string;
    cardId?: string;
};
export type AONPointsCollectFailedMsg = {
    userId?: string;
    errorCode?: AONPointsCollectFailedMsgErrorCode;
};
export type GroupBonusPointsReceivedMsg = {
    points?: number;
};
export type StreamEndedMsg = {
    streamId?: string;
    groupId?: string;
};
export type HighScoringCard = {
    cardId?: string;
    points?: number;
    boosterPoints?: PlayerBoosterPoints[];
};
export type HighScoringCardSucceededMsg = {
    card?: HighScoringCard;
    userId?: string;
    groupName?: string;
    countdownMs?: number;
    groupId?: string;
};
export type HighScoringCardPromotedMsg = {
    card?: HighScoringCard;
    userId?: string;
    groupName?: string;
    groupId?: string;
};
export type ContextualTeamActionUpdateMsg = {
    participants?: {
        [key: string]: boolean;
    };
    deadlineMs?: string;
    status?: ContextualTeamActionStatus;
    type?: ContextualTeamActionType;
};
export type MatchBonusReceivedMsg = {
    userId?: string;
    bonusType?: MatchBonusType;
    points?: number;
};
export type TeamMergeWarningReceivedMsg = {
    countdownMs?: number;
};
export type TeamMergeExecutedMsg = {
    newGroupId?: string;
};
type BaseDebugMsg = {
    userId?: string;
    type?: DebugMsgType;
};
export type DebugMsg = BaseDebugMsg & OneOf<{
    gameStreamEvent: Game_stream_eventsGame_stream_events.GameStreamEvent;
}>;
export type MatchConfiguration = {
    handSize?: number;
    cardSwitchOutTimerDuration?: string;
    pointsGainTime?: number;
    reshuffleBaseCost?: number;
    reshuffleCostMultiplier?: number;
    boosterCooldowns?: string[];
    aonPointMultipliers?: number[];
    gameId?: string;
    matchBonusType?: MatchBonusType;
    matchBonusActivationRule?: string;
    matchBonusPoints?: number;
    seasonId?: string;
    freeReshuffleCount?: number;
    matchType?: StreamStateMatchType;
};
export type StreamerCard = {
    id?: string;
    channelId?: string;
    videoUrl?: string;
    imageUrl?: string;
    facecamUrl?: string;
    gameId?: string;
    familyId?: string;
    name?: string;
    draft?: boolean;
};
export type CardLeveling = {
    currentLevel?: number;
    progressToNextLevel?: number;
    nextLevelLimit?: number;
};
export type CardTargetValue = {
    label?: string;
    value?: number;
};
export type Card = {
    id?: string;
    name?: string;
    rarity?: RarityRarity.Rarity;
    leveling?: CardLeveling;
    description?: string;
    pointsMin?: number;
    pointsMax?: number;
    pointsTimeTarget?: number;
    frontImage?: string;
    backImage?: string;
    isMatchCard?: boolean;
    isAllOrNothing?: boolean;
    successModules?: string[];
    failureModules?: string[];
    dealingModules?: string[];
    targetValue?: number;
    isEnabled?: boolean;
    timerDuration?: number;
    isDealtAtStart?: boolean;
    scoredCounterIds?: string[];
    activeStreamerCard?: StreamerCard;
    icon?: string;
    seasonId?: string;
    matchCardId?: number;
    gameModes?: string[];
    sides?: string[];
    roleCharacters?: string[];
    failureTargetValue?: number;
    familyId?: string;
    unlockLevel?: number;
    targetValues?: CardTargetValue[];
};
export type Booster = {
    id?: number;
    name?: string;
    description?: string;
    descriptionCondition?: string;
    descriptionTargetSelf?: string;
    descriptionDefaultBenefit?: string;
    descriptionOtherBenefit?: string;
    descriptionTargetNoneBenefit?: string;
    image?: string;
    valueSelf?: number;
    valueOther?: number;
    timeActive?: number;
    canTargetSelf?: boolean;
    isAvailableSolo?: boolean;
    triggersOn?: string[];
    removeOn?: string[];
    isSelfAndOtherEffect?: boolean;
};
export type BestPlay = {
    points?: number;
    cardId?: string;
    activeBoosters?: ActiveBooster[];
};
export type Player = {
    userId?: string;
    userName?: string;
    name?: string;
    isOnline?: boolean;
    points?: number;
    hand?: Hand;
    activeCard?: ActiveCard;
    boosterCooldownTimer?: Timer;
    cardSwitchOutTimer?: Timer;
    heldBoosterId?: number;
    usedBoosterCount?: number;
    selfUsedBoosterCount?: number;
    bestPlay?: BestPlay;
    allOrNothing?: AllOrNothing;
    reshuffleCount?: number;
    remainingInactiveSeconds?: number;
    usedMatchCards?: {
        [key: number]: boolean;
    };
    fullUser?: boolean;
};
export type Hand = {
    cardIds?: string[];
    votes?: Vote[];
    matchEndCardIds?: string[];
};
export type Timer = {
    startTime?: string;
    endTime?: string;
};
export type ActiveBooster = {
    boosterId?: number;
    activatorUserId?: string;
    activationTime?: string;
};
export type ActiveCard = {
    cardId?: string;
    setTime?: string;
    pointsUpdateTime?: string;
    points?: number;
    pointsMin?: number;
    pointsMax?: number;
    pointsTimeTarget?: number;
    pointsUpdateTimer?: Timer;
    targetValue?: number;
    activeBoosters?: {
        [key: string]: ActiveBooster;
    };
    timerDuration?: number;
    failureTargetValue?: number;
    targetValues?: {
        [key: string]: number;
    };
};
export type AllOrNothing = {
    cardId?: string;
    totalRounds?: number;
    round?: number;
    totalPoints?: number;
    nextPoints?: number;
    bestPlay?: BestPlay;
    cardActivations?: CardActivationResult[];
};
export type CardActivationResult = {
    cardId?: string;
    points?: number;
    boosterPoints?: PlayerBoosterPoints[];
};
export type Vote = {
    userId?: string;
    cardId?: string;
};
export type Group = {
    id?: string;
    name?: string;
    points?: number;
    isSolo?: boolean;
    isParty?: boolean;
};
export type MatchData = {
    cards?: Card[];
    boosters?: Booster[];
    cardIds?: string[];
    boosterIds?: number[];
};
export type MatchStateData = {
    streamState?: StreamState;
    players?: Player[];
    group?: Group;
};
export type StreamState = {
    matchState?: StreamStateMatchState;
    matchSeqNum?: number;
    matchType?: StreamStateMatchType;
    roundPhase?: StreamStateRoundPhase;
};
export type PlayerBoosterPoints = {
    userId?: string;
    cardUserId?: string;
    donatorUserId?: string;
    boosterId?: number;
    points?: number;
};
export type CardUpgrade = {
    oldCard?: Card;
    newCard?: Card;
};
export type PlayerCardUpgradedMsg = {
    userId?: string;
    upgrade?: CardUpgrade;
    allOrNothing?: AllOrNothing;
};
export type ReshuffleCostUpdatedMsg = {
    userId?: string;
    nextReshuffleCost?: number;
};
export type GroupCreatedMsg = {
    streamId?: string;
    groupId?: string;
    name?: string;
    isSolo?: boolean;
};
export type ActivateContextualTeamAction = {};
export type PlayerDetails = {
    id?: string;
    points?: number;
    groupName?: string;
};
export type GroupDetails = {
    group?: Group;
    players?: PlayerDetails[];
    streamId?: string;
};
export type CardDetails = {
    succeedingCard?: ActiveCardSucceededMsg;
    groupName?: string;
};
export type InactivityTimerUpdatedMsg = {
    userId?: string;
    secondsRemaining?: number;
};
export type InactivityTimerCancelledMsg = {
    userId?: string;
};
export type InactivityKickReceivedMsg = {
    userId?: string;
};
export interface IDebugMsgPayloadDelegate<C> {
    onGameStreamEvent(ctx: C, ev: Game_stream_eventsGame_stream_events.GameStreamEvent): void;
}
export declare function routeDebugMsgPayloadDelegate<C>(ctx: C, val: DebugMsg, delegate: IDebugMsgPayloadDelegate<C>): void;
export {};
//# sourceMappingURL=game_logic.pb.d.ts.map