import * as ConfigMetagame from "../config/metagame.pb";
import * as Game_cardGame_card from "../game-card/game_card.pb";
import * as Game_logicGame_logic from "../game-logic/game_logic.pb";
import * as Stream_infoStream_info from "../stream/stream_info.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum StringComparisonOperator {
    STRING_COMPARISON_OPERATOR_UNSPECIFIED = "STRING_COMPARISON_OPERATOR_UNSPECIFIED",
    STRING_COMPARISON_OPERATOR_EQUAL = "STRING_COMPARISON_OPERATOR_EQUAL",
    STRING_COMPARISON_OPERATOR_NOT_EQUAL = "STRING_COMPARISON_OPERATOR_NOT_EQUAL",
    STRING_COMPARISON_OPERATOR_IN = "STRING_COMPARISON_OPERATOR_IN",
    STRING_COMPARISON_OPERATOR_NOT_IN = "STRING_COMPARISON_OPERATOR_NOT_IN"
}
export declare enum IntComparisonOperator {
    INT_COMPARISON_OPERATOR_UNSPECIFIED = "INT_COMPARISON_OPERATOR_UNSPECIFIED",
    INT_COMPARISON_OPERATOR_EQUAL = "INT_COMPARISON_OPERATOR_EQUAL",
    INT_COMPARISON_OPERATOR_GREATER = "INT_COMPARISON_OPERATOR_GREATER",
    INT_COMPARISON_OPERATOR_GREATER_OR_EQUAL = "INT_COMPARISON_OPERATOR_GREATER_OR_EQUAL",
    INT_COMPARISON_OPERATOR_LESS = "INT_COMPARISON_OPERATOR_LESS",
    INT_COMPARISON_OPERATOR_LESS_OR_EQUAL = "INT_COMPARISON_OPERATOR_LESS_OR_EQUAL",
    INT_COMPARISON_OPERATOR_NOT_EQUAL = "INT_COMPARISON_OPERATOR_NOT_EQUAL"
}
export declare enum CALModuleBinaryOp {
    BINARY_OP_UNSPECIFIED = "BINARY_OP_UNSPECIFIED",
    BINARY_OP_AND = "BINARY_OP_AND",
    BINARY_OP_OR = "BINARY_OP_OR"
}
export declare enum CALModuleUnaryOp {
    UNARY_OP_UNSPECIFIED = "UNARY_OP_UNSPECIFIED",
    UNARY_OP_NOT = "UNARY_OP_NOT"
}
export type BoosterState = {
    booster?: Game_logicGame_logic.Booster;
    activeBooster?: Game_logicGame_logic.ActiveBooster;
    sourcePlayerId?: string;
    targetPlayerId?: string;
};
export type CardDealingStateCALModulesList = {
    modules?: CALModule[];
};
export type CardDealingState = {
    cards?: {
        [key: string]: Game_logicGame_logic.Card;
    };
    cardDealingModules?: {
        [key: string]: CardDealingStateCALModulesList;
    };
    cardAvailability?: {
        [key: string]: boolean;
    };
};
export type CardState = {
    successModules?: CALModule[];
    failureModules?: CALModule[];
};
export type CardEventCardSucceeded = {
    cardId?: string;
    points?: number;
};
export type CardEventCardFailed = {
    cardId?: string;
    points?: number;
    reason?: Game_logicGame_logic.ActiveCardFailedMsgReason;
};
export type CardEventCardTargetValueChanged = {
    cardId?: string;
    value?: number;
    timerDuration?: number;
    isFailureModule?: boolean;
    values?: {
        [key: string]: number;
    };
};
export type CardEventShouldCollectAONPoints = {
    totalPoints?: number;
    cardActivations?: Game_logicGame_logic.CardActivationResult[];
};
type BaseCardEvent = {};
export type CardEvent = BaseCardEvent & OneOf<{
    cardSucceeded: CardEventCardSucceeded;
    cardFailed: CardEventCardFailed;
    cardTargetValueChanged: CardEventCardTargetValueChanged;
    shouldCollectAonPoints: CardEventShouldCollectAONPoints;
}>;
export type PlayerState = {
    player?: Game_logicGame_logic.Player;
    cardState?: CardState;
    cardDealingState?: CardDealingState;
    streamId?: string;
    groupId?: string;
    lastHeldBoosterId?: number;
    debugEvents?: boolean;
};
export type TimeTrackerStateTimeTrackerEntry = {
    online?: boolean;
    lastOnlineTimestamp?: string;
    totalTime?: string;
    disconnectedTimestamp?: string;
    idleTimestamp?: string;
    idle?: boolean;
    totalIdleTime?: string;
};
export type TimeTrackerState = {
    matchActive?: boolean;
    entries?: {
        [key: string]: TimeTrackerStateTimeTrackerEntry;
    };
};
export type ContextualTeamActionState = {
    participants?: {
        [key: string]: boolean;
    };
    deadlineMs?: string;
    type?: Game_logicGame_logic.ContextualTeamActionType;
    status?: Game_logicGame_logic.ContextualTeamActionStatus;
};
export type GroupStateBoosterUsage = {
    sourcePlayerId?: string;
    targetPlayerId?: string;
    boosterState?: BoosterState;
};
export type GroupState = {
    group?: Game_logicGame_logic.Group;
    timeTrackerState?: TimeTrackerState;
    players?: {
        [key: string]: PlayerState;
    };
    boosterUsages?: GroupStateBoosterUsage[];
    streamInfo?: Stream_infoStream_info.StreamInfo;
    contextualTeamActionState?: ContextualTeamActionState;
    removedPlayers?: PlayerState[];
    matchBonusActivationRule?: CALModule;
    addedPlayers?: {
        [key: string]: PlayerState;
    };
};
export type RandomState = {
    seed?: string;
};
export type GameStateAttributes = {
    intAttributes?: {
        [key: string]: number;
    };
    stringAttributes?: {
        [key: string]: string;
    };
    boolAttributes?: {
        [key: string]: boolean;
    };
};
export type CALModuleGlobalIntAttributeCheck = {
    operator?: IntComparisonOperator;
    attribute?: string;
    value?: number;
};
export type CALModuleGlobalIntAttributeSumCheck = {
    operator?: IntComparisonOperator;
    attributes?: string[];
    value?: number;
};
export type CALModuleGlobalStringAttributeCheck = {
    operator?: StringComparisonOperator;
    attribute?: string;
    values?: string[];
};
export type CALModuleGlobalBoolAttributeCheck = {
    attribute?: string;
    value?: boolean;
};
export type CALModuleGlobalAnyBoolAttributeCheck = {
    attributes?: string[];
    value?: boolean;
};
export type CALModuleEventTypeCheck = {
    eventNames?: string[];
};
export type CALModuleEventIntAttributeCheck = {
    operator?: IntComparisonOperator;
    attribute?: string;
    value?: number;
    eventName?: string;
};
export type CALModuleEventStringAttributeCheck = {
    operator?: StringComparisonOperator;
    attribute?: string;
    values?: string[];
    eventName?: string;
};
export type CALModuleEventBoolAttributeCheck = {
    attribute?: string;
    value?: boolean;
    eventName?: string;
};
export type CALModuleCountEventIntAttributeCheck = {
    attributes?: string[];
    targetValue?: number;
    calculateNegative?: boolean;
    initialValue?: number;
    eventName?: string;
};
export type CALModuleRepeatedEventTypeCheck = {
    check?: CALModuleEventTypeCheck;
    targetValue?: number;
    initialValue?: number;
};
export type CALModuleRepeatedEventIntAttributeCheck = {
    check?: CALModuleEventIntAttributeCheck;
    targetValue?: number;
    initialValue?: number;
};
export type CALModuleRepeatedEventStringAttributeCheck = {
    check?: CALModuleEventStringAttributeCheck;
    targetValue?: number;
    initialValue?: number;
};
export type CALModuleRepeatedEventBoolAttributeCheck = {
    check?: CALModuleEventBoolAttributeCheck;
    targetValue?: number;
    initialValue?: number;
};
export type CALModuleEventTypeCheckAfterEventIntAttributeCheck = {
    firstCheck?: CALModuleEventIntAttributeCheck;
    secondCheck?: CALModuleEventTypeCheck;
    timerDuration?: string;
    firstCheckSuccessTime?: string;
};
export type CALModuleTimeoutCheck = {
    duration?: string;
    lastTimestamp?: string;
    timeLeft?: string;
    lastStateChangeTimestamp?: string;
};
type BaseCALModuleCheckParam = {};
export type CALModuleCheckParam = BaseCALModuleCheckParam & OneOf<{
    intValue: number;
    stringValue: string;
}>;
type BaseCALModuleCheck = {
    label?: string;
};
export type CALModuleCheck = BaseCALModuleCheck & OneOf<{
    globalIntAttributeCheck: CALModuleGlobalIntAttributeCheck;
    globalIntAttributeSumCheck: CALModuleGlobalIntAttributeSumCheck;
    globalStringAttributeCheck: CALModuleGlobalStringAttributeCheck;
    globalBoolAttributeCheck: CALModuleGlobalBoolAttributeCheck;
    globalAnyBoolAttributeCheck: CALModuleGlobalAnyBoolAttributeCheck;
    eventTypeCheck: CALModuleEventTypeCheck;
    eventIntAttributeCheck: CALModuleEventIntAttributeCheck;
    eventStringAttributeCheck: CALModuleEventStringAttributeCheck;
    eventBoolAttributeCheck: CALModuleEventBoolAttributeCheck;
    countEventIntAttributeCheck: CALModuleCountEventIntAttributeCheck;
    repeatedEventTypeCheck: CALModuleRepeatedEventTypeCheck;
    repeatedEventIntAttributeCheck: CALModuleRepeatedEventIntAttributeCheck;
    repeatedEventStringAttributeCheck: CALModuleRepeatedEventStringAttributeCheck;
    repeatedEventBoolAttributeCheck: CALModuleRepeatedEventBoolAttributeCheck;
    eventTypeCheckAfterEventIntAttributeCheck: CALModuleEventTypeCheckAfterEventIntAttributeCheck;
    timeoutCheck: CALModuleTimeoutCheck;
}>;
export type CALModuleCheckSequence = {
    expressions?: CALModuleExpression[];
    intervals?: number[];
    activationTimes?: string[];
    label?: string;
};
export type CALModuleBinaryExpression = {
    left?: CALModuleExpression;
    right?: CALModuleExpression;
    op?: CALModuleBinaryOp;
};
export type CALModuleUnaryExpression = {
    expression?: CALModuleExpression;
    op?: CALModuleUnaryOp;
};
export type CALModuleGroup = {
    expression?: CALModuleExpression;
};
export type CALModuleForDuration = {
    expression?: CALModuleExpression;
    timeout?: CALModuleExpression;
    resetting?: boolean;
};
export type CALModuleRepeat = {
    expression?: CALModuleExpression;
    targetValue?: number;
    initialValue?: number;
    label?: string;
};
type BaseCALModuleExpression = {};
export type CALModuleExpression = BaseCALModuleExpression & OneOf<{
    check: CALModuleCheck;
    binaryExpression: CALModuleBinaryExpression;
    unaryExpression: CALModuleUnaryExpression;
    group: CALModuleGroup;
    checkSequence: CALModuleCheckSequence;
    forDuration: CALModuleForDuration;
    repeat: CALModuleRepeat;
}>;
export type CALModule = {
    expression?: CALModuleExpression;
};
export type AttributesState = {
    intAttributes?: {
        [key: string]: number;
    };
    stringAttributes?: {
        [key: string]: string;
    };
    boolAttributes?: {
        [key: string]: boolean;
    };
};
export type StreamTrackerState = {
    streamState?: Game_logicGame_logic.StreamState;
    globalAttributes?: AttributesState;
    matchStateChanged?: boolean;
    matchStartTime?: string;
    previousMatchState?: Game_logicGame_logic.StreamStateMatchState;
    matchEndTime?: string;
    matchPauseStartTime?: string;
    matchPauseTimeTotal?: string;
};
export type GameConfigHighScoringCardConfig = {
    highScoringCardConfigs?: Game_cardGame_card.HighScoringCardConfig[];
    highScoringCardTimings?: Game_cardGame_card.HighScoringCardTimings[];
};
export type GameConfig = {
    matchConfiguration?: Game_logicGame_logic.MatchConfiguration;
    boosters?: {
        [key: number]: Game_logicGame_logic.Booster;
    };
    highScoringCardConfig?: GameConfigHighScoringCardConfig;
    uiTimings?: ConfigMetagame.MetagameConfigUiTimings;
    inactivityTimeouts?: ConfigMetagame.MetagameConfigInactivityTimeouts;
    featureFlags?: {
        [key: string]: string;
    };
};
export type StreamGroupsTrackerState = {
    bestGroup?: Game_logicGame_logic.GroupDetails;
    bestPlayer?: Game_logicGame_logic.PlayerDetails;
    bestCard?: Game_logicGame_logic.CardDetails;
};
export type HighScoringCardState = {
    activeGroups?: {
        [key: string]: boolean;
    };
    deadline?: string;
    userId?: string;
    groupId?: string;
    card?: Game_logicGame_logic.HighScoringCard;
};
export type ClientSession = {
    timestamp?: string;
    token?: string;
    mailbox?: string;
};
export type ClientSessionList = {
    sessions?: ClientSession[];
};
export type SessionTrackerState = {
    playerSessions?: {
        [key: string]: ClientSessionList;
    };
    spectatorSessions?: {
        [key: string]: ClientSessionList;
    };
};
export type TimerStateMetadata = {
    source?: string;
};
export type TimerStateTimeout = {
    expirationTimestamp?: string;
    metadata?: TimerStateMetadata;
};
export type TimerState = {
    activeTimerDeadline?: string;
    timeouts?: string[];
    timeoutsWithMetadata?: TimerStateTimeout[];
    activeTimeout?: TimerStateTimeout;
};
export type GroupRunnerState = {
    started?: boolean;
    gameConfig?: GameConfig;
    groupState?: GroupState;
    streamTrackerState?: StreamTrackerState;
    randomState?: RandomState;
    timeOffset?: string;
    timer?: TimerState;
    players?: {
        [key: string]: boolean;
    };
    matchEndTime?: string;
    stepTimestamp?: string;
    groupStartTime?: string;
    matchPauseStartTime?: string;
    matchPauseTimeTotal?: string;
    sessionTrackerState?: SessionTrackerState;
};
export type StreamRunnerState = {
    started?: boolean;
    streamInfo?: Stream_infoStream_info.StreamInfo;
    groups?: string[];
    gameConfig?: GameConfig;
    streamTracker?: StreamTrackerState;
    streamGroupsTracker?: StreamGroupsTrackerState;
    highScoringCard?: HighScoringCardState;
    contextualTeamActionLastActivatedAt?: string;
    observers?: {
        [key: string]: boolean;
    };
    groupsToRemove?: string[];
    waitingMatchEndDeadline?: string;
};
export type StreamState = {
    streamInfo?: Stream_infoStream_info.StreamInfo;
    groups?: string[];
    streamTracker?: StreamTrackerState;
    streamGroupsTracker?: StreamGroupsTrackerState;
};
export type StatsRunnerState = {
    started?: boolean;
    streamInfo?: Stream_infoStream_info.StreamInfo;
    gameConfig?: GameConfig;
    groups?: {
        [key: string]: Game_logicGame_logic.GroupDetails;
    };
    streamGroupsTracker?: StreamGroupsTrackerState;
    highScoringCard?: HighScoringCardState;
};
export interface ICardEventEventDelegate<C> {
    onCardSucceeded(ctx: C, ev: CardEventCardSucceeded): void;
    onCardFailed(ctx: C, ev: CardEventCardFailed): void;
    onCardTargetValueChanged(ctx: C, ev: CardEventCardTargetValueChanged): void;
    onShouldCollectAonPoints(ctx: C, ev: CardEventShouldCollectAONPoints): void;
}
export declare function routeCardEventEventDelegate<C>(ctx: C, val: CardEvent, delegate: ICardEventEventDelegate<C>): void;
export interface ICALModuleCheckParamValueDelegate<C> {
    onIntValue(ctx: C, ev: number): void;
    onStringValue(ctx: C, ev: string): void;
}
export declare function routeCALModuleCheckParamValueDelegate<C>(ctx: C, val: CALModuleCheckParam, delegate: ICALModuleCheckParamValueDelegate<C>): void;
export interface ICALModuleCheckCheckDelegate<C> {
    onGlobalIntAttributeCheck(ctx: C, ev: CALModuleGlobalIntAttributeCheck): void;
    onGlobalIntAttributeSumCheck(ctx: C, ev: CALModuleGlobalIntAttributeSumCheck): void;
    onGlobalStringAttributeCheck(ctx: C, ev: CALModuleGlobalStringAttributeCheck): void;
    onGlobalBoolAttributeCheck(ctx: C, ev: CALModuleGlobalBoolAttributeCheck): void;
    onGlobalAnyBoolAttributeCheck(ctx: C, ev: CALModuleGlobalAnyBoolAttributeCheck): void;
    onEventTypeCheck(ctx: C, ev: CALModuleEventTypeCheck): void;
    onEventIntAttributeCheck(ctx: C, ev: CALModuleEventIntAttributeCheck): void;
    onEventStringAttributeCheck(ctx: C, ev: CALModuleEventStringAttributeCheck): void;
    onEventBoolAttributeCheck(ctx: C, ev: CALModuleEventBoolAttributeCheck): void;
    onCountEventIntAttributeCheck(ctx: C, ev: CALModuleCountEventIntAttributeCheck): void;
    onRepeatedEventTypeCheck(ctx: C, ev: CALModuleRepeatedEventTypeCheck): void;
    onRepeatedEventIntAttributeCheck(ctx: C, ev: CALModuleRepeatedEventIntAttributeCheck): void;
    onRepeatedEventStringAttributeCheck(ctx: C, ev: CALModuleRepeatedEventStringAttributeCheck): void;
    onRepeatedEventBoolAttributeCheck(ctx: C, ev: CALModuleRepeatedEventBoolAttributeCheck): void;
    onEventTypeCheckAfterEventIntAttributeCheck(ctx: C, ev: CALModuleEventTypeCheckAfterEventIntAttributeCheck): void;
    onTimeoutCheck(ctx: C, ev: CALModuleTimeoutCheck): void;
}
export declare function routeCALModuleCheckCheckDelegate<C>(ctx: C, val: CALModuleCheck, delegate: ICALModuleCheckCheckDelegate<C>): void;
export interface ICALModuleExpressionExpressionDelegate<C> {
    onCheck(ctx: C, ev: CALModuleCheck): void;
    onBinaryExpression(ctx: C, ev: CALModuleBinaryExpression): void;
    onUnaryExpression(ctx: C, ev: CALModuleUnaryExpression): void;
    onGroup(ctx: C, ev: CALModuleGroup): void;
    onCheckSequence(ctx: C, ev: CALModuleCheckSequence): void;
    onForDuration(ctx: C, ev: CALModuleForDuration): void;
    onRepeat(ctx: C, ev: CALModuleRepeat): void;
}
export declare function routeCALModuleExpressionExpressionDelegate<C>(ctx: C, val: CALModuleExpression, delegate: ICALModuleExpressionExpressionDelegate<C>): void;
export {};
//# sourceMappingURL=game_state.pb.d.ts.map