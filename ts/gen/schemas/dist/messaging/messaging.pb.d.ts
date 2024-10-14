import * as Game_logicGame_logic from "../game-logic/game_logic.pb";
import * as Game_stateGame_state from "../game-state/game_state.pb";
import * as Stream_infoStream_info from "../stream/stream_info.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum Presence {
    UNSPECIFIED = "UNSPECIFIED",
    LEFT = "LEFT",
    JOINED = "JOINED"
}
type BaseClientMessage = {
    opCode?: Game_logicGame_logic.ClientOpCode;
    userId?: string;
};
export type ClientMessage = BaseClientMessage & OneOf<{
    setActiveCard: Game_logicGame_logic.SetActiveCardMsg;
    shuffleHand: Game_logicGame_logic.ShuffleHandMsg;
    useBooster: Game_logicGame_logic.UseBoosterMsg;
    requestBooster: Game_logicGame_logic.RequestBoosterMsg;
    cancelBoosterRequest: Game_logicGame_logic.CancelBoosterRequestMsg;
    collectAonPoints: Game_logicGame_logic.CollectAONPointsMsg;
    triggerEmoji: Game_logicGame_logic.TriggerEmojiMsg;
    triggerEmote: Game_logicGame_logic.TriggerEmoteMsg;
    requestHand: Game_logicGame_logic.RequestHandMsg;
    joinTeamAction: Game_logicGame_logic.JoinTeamActionMsg;
    setDebug: Game_logicGame_logic.SetDebugMsg;
}>;
export type ClientMessageBatch = {
    messages?: ClientMessage[];
    groupId?: string;
};
type BaseServerMessage = {
    targetUserId?: string;
    opCode?: Game_logicGame_logic.ServerOpCode;
    timestamp?: string;
    streamInfo?: Stream_infoStream_info.StreamInfo;
    groupId?: string;
    matchId?: string;
    groupType?: Game_logicGame_logic.GroupType;
};
export type ServerMessage = BaseServerMessage & OneOf<{
    gameInit: Game_logicGame_logic.GameInitMsg;
    matchStarted: Game_logicGame_logic.MatchStartedMsg;
    matchEnded: Game_logicGame_logic.MatchEndedMsg;
    cardDealingStarted: Game_logicGame_logic.CardDealingStartedMsg;
    cardDealingEnded: Game_logicGame_logic.CardDealingEndedMsg;
    activeCardSet: Game_logicGame_logic.ActiveCardSetMsg;
    activeCardPointsUpdated: Game_logicGame_logic.ActiveCardPointsUpdatedMsg;
    activeCardTargetValueChanged: Game_logicGame_logic.ActiveCardTargetValueChangedMsg;
    settingActiveCardFailed: Game_logicGame_logic.SettingActiveCardFailedMsg;
    handShuffled: Game_logicGame_logic.HandShuffledMsg;
    shufflingHandFailed: Game_logicGame_logic.ShufflingHandFailedMsg;
    playerPointsUpdated: Game_logicGame_logic.PlayerPointsUpdatedMsg;
    playerCoinsUpdated: Game_logicGame_logic.PlayerCoinsUpdatedMsg;
    playerJoined: Game_logicGame_logic.PlayerJoinedMsg;
    playerLeft: Game_logicGame_logic.PlayerLeftMsg;
    groupPointsUpdated: Game_logicGame_logic.GroupPointsUpdatedMsg;
    boosterCooldownStarted: Game_logicGame_logic.BoosterCooldownStartedMsg;
    boosterAvailable: Game_logicGame_logic.BoosterAvailableMsg;
    boosterUsed: Game_logicGame_logic.BoosterUsedMsg;
    boosterRequested: Game_logicGame_logic.BoosterRequestedMsg;
    boosterRequestCancelled: Game_logicGame_logic.BoosterRequestCancelledMsg;
    boosterRemoved: Game_logicGame_logic.BoosterRemovedMsg;
    boosterPointsReceived: Game_logicGame_logic.BoosterPointsReceivedMsg;
    cardSwitchOutTimerStarted: Game_logicGame_logic.CardSwitchOutTimerStartedMsg;
    cardSwitchOutAvailable: Game_logicGame_logic.CardSwitchOutAvailableMsg;
    cardVoteAdded: Game_logicGame_logic.CardVoteAddedMsg;
    cardVoteRemoved: Game_logicGame_logic.CardVoteRemovedMsg;
    bestPlayPointsReceived: Game_logicGame_logic.BestPlayPointsReceivedMsg;
    aonPointsCollected: Game_logicGame_logic.AONPointsCollectedMsg;
    aonPointsCollectFailed: Game_logicGame_logic.AONPointsCollectFailedMsg;
    groupBonusPointsReceived: Game_logicGame_logic.GroupBonusPointsReceivedMsg;
    activeCardSucceeded: Game_logicGame_logic.ActiveCardSucceededMsg;
    activeCardFailed: Game_logicGame_logic.ActiveCardFailedMsg;
    playerCardUpgraded: Game_logicGame_logic.PlayerCardUpgradedMsg;
    reshuffleCostUpdated: Game_logicGame_logic.ReshuffleCostUpdatedMsg;
    groupCreated: Game_logicGame_logic.GroupCreatedMsg;
    streamEnded: Game_logicGame_logic.StreamEndedMsg;
    highScoringCardSucceeded: Game_logicGame_logic.HighScoringCardSucceededMsg;
    highScoringCardPromoted: Game_logicGame_logic.HighScoringCardPromotedMsg;
    contextualTeamActionUpdate: Game_logicGame_logic.ContextualTeamActionUpdateMsg;
    matchBonusReceived: Game_logicGame_logic.MatchBonusReceivedMsg;
    inactivityTimerUpdated: Game_logicGame_logic.InactivityTimerUpdatedMsg;
    inactivityTimerCancelled: Game_logicGame_logic.InactivityTimerCancelledMsg;
    inactivityKickReceived: Game_logicGame_logic.InactivityKickReceivedMsg;
    matchPauseStateChanged: Game_logicGame_logic.MatchPauseStateChangedMsg;
    teamMergeWarningReceived: Game_logicGame_logic.TeamMergeWarningReceivedMsg;
    teamMergeExecuted: Game_logicGame_logic.TeamMergeExecutedMsg;
    debug: Game_logicGame_logic.DebugMsg;
}>;
type BaseStreamerMessage = {
    streamInfo?: Stream_infoStream_info.StreamInfo;
};
export type StreamerMessage = BaseStreamerMessage & OneOf<{
    activateContextualTeamAction: Game_logicGame_logic.ActivateContextualTeamAction;
}>;
export type PlayerRef = {
    userId?: string;
    username?: string;
    groupId?: string;
    fullUser?: boolean;
};
export type PresenceMessage = {
    presence?: Presence;
    players?: PlayerRef[];
};
export type UpdateBestGroupMessage = {
    bestGroup?: Game_logicGame_logic.GroupDetails;
};
export type HighScoringCardMessage = {
    card?: Game_logicGame_logic.HighScoringCard;
    userId?: string;
    groupName?: string;
    groupId?: string;
    timestamp?: string;
};
export type MatchEndHandledMessage = {
    groupId?: string;
};
export type PostMatchEndMessage = {
    bestGroup?: Game_logicGame_logic.GroupDetails;
    bestPlayer?: Game_logicGame_logic.PlayerDetails;
    bestCard?: Game_logicGame_logic.CardDetails;
};
export type StreamStateUpdateMessage = {
    state?: Game_stateGame_state.StreamState;
};
export interface IClientMessagePayloadDelegate<C> {
    onSetActiveCard(ctx: C, ev: Game_logicGame_logic.SetActiveCardMsg): void;
    onShuffleHand(ctx: C, ev: Game_logicGame_logic.ShuffleHandMsg): void;
    onUseBooster(ctx: C, ev: Game_logicGame_logic.UseBoosterMsg): void;
    onRequestBooster(ctx: C, ev: Game_logicGame_logic.RequestBoosterMsg): void;
    onCancelBoosterRequest(ctx: C, ev: Game_logicGame_logic.CancelBoosterRequestMsg): void;
    onCollectAonPoints(ctx: C, ev: Game_logicGame_logic.CollectAONPointsMsg): void;
    onTriggerEmoji(ctx: C, ev: Game_logicGame_logic.TriggerEmojiMsg): void;
    onTriggerEmote(ctx: C, ev: Game_logicGame_logic.TriggerEmoteMsg): void;
    onRequestHand(ctx: C, ev: Game_logicGame_logic.RequestHandMsg): void;
    onJoinTeamAction(ctx: C, ev: Game_logicGame_logic.JoinTeamActionMsg): void;
    onSetDebug(ctx: C, ev: Game_logicGame_logic.SetDebugMsg): void;
}
export declare function routeClientMessagePayloadDelegate<C>(ctx: C, val: ClientMessage, delegate: IClientMessagePayloadDelegate<C>): void;
export interface IServerMessagePayloadDelegate<C> {
    onGameInit(ctx: C, ev: Game_logicGame_logic.GameInitMsg): void;
    onMatchStarted(ctx: C, ev: Game_logicGame_logic.MatchStartedMsg): void;
    onMatchEnded(ctx: C, ev: Game_logicGame_logic.MatchEndedMsg): void;
    onCardDealingStarted(ctx: C, ev: Game_logicGame_logic.CardDealingStartedMsg): void;
    onCardDealingEnded(ctx: C, ev: Game_logicGame_logic.CardDealingEndedMsg): void;
    onActiveCardSet(ctx: C, ev: Game_logicGame_logic.ActiveCardSetMsg): void;
    onActiveCardPointsUpdated(ctx: C, ev: Game_logicGame_logic.ActiveCardPointsUpdatedMsg): void;
    onActiveCardTargetValueChanged(ctx: C, ev: Game_logicGame_logic.ActiveCardTargetValueChangedMsg): void;
    onSettingActiveCardFailed(ctx: C, ev: Game_logicGame_logic.SettingActiveCardFailedMsg): void;
    onHandShuffled(ctx: C, ev: Game_logicGame_logic.HandShuffledMsg): void;
    onShufflingHandFailed(ctx: C, ev: Game_logicGame_logic.ShufflingHandFailedMsg): void;
    onPlayerPointsUpdated(ctx: C, ev: Game_logicGame_logic.PlayerPointsUpdatedMsg): void;
    onPlayerCoinsUpdated(ctx: C, ev: Game_logicGame_logic.PlayerCoinsUpdatedMsg): void;
    onPlayerJoined(ctx: C, ev: Game_logicGame_logic.PlayerJoinedMsg): void;
    onPlayerLeft(ctx: C, ev: Game_logicGame_logic.PlayerLeftMsg): void;
    onGroupPointsUpdated(ctx: C, ev: Game_logicGame_logic.GroupPointsUpdatedMsg): void;
    onBoosterCooldownStarted(ctx: C, ev: Game_logicGame_logic.BoosterCooldownStartedMsg): void;
    onBoosterAvailable(ctx: C, ev: Game_logicGame_logic.BoosterAvailableMsg): void;
    onBoosterUsed(ctx: C, ev: Game_logicGame_logic.BoosterUsedMsg): void;
    onBoosterRequested(ctx: C, ev: Game_logicGame_logic.BoosterRequestedMsg): void;
    onBoosterRequestCancelled(ctx: C, ev: Game_logicGame_logic.BoosterRequestCancelledMsg): void;
    onBoosterRemoved(ctx: C, ev: Game_logicGame_logic.BoosterRemovedMsg): void;
    onBoosterPointsReceived(ctx: C, ev: Game_logicGame_logic.BoosterPointsReceivedMsg): void;
    onCardSwitchOutTimerStarted(ctx: C, ev: Game_logicGame_logic.CardSwitchOutTimerStartedMsg): void;
    onCardSwitchOutAvailable(ctx: C, ev: Game_logicGame_logic.CardSwitchOutAvailableMsg): void;
    onCardVoteAdded(ctx: C, ev: Game_logicGame_logic.CardVoteAddedMsg): void;
    onCardVoteRemoved(ctx: C, ev: Game_logicGame_logic.CardVoteRemovedMsg): void;
    onBestPlayPointsReceived(ctx: C, ev: Game_logicGame_logic.BestPlayPointsReceivedMsg): void;
    onAonPointsCollected(ctx: C, ev: Game_logicGame_logic.AONPointsCollectedMsg): void;
    onAonPointsCollectFailed(ctx: C, ev: Game_logicGame_logic.AONPointsCollectFailedMsg): void;
    onGroupBonusPointsReceived(ctx: C, ev: Game_logicGame_logic.GroupBonusPointsReceivedMsg): void;
    onActiveCardSucceeded(ctx: C, ev: Game_logicGame_logic.ActiveCardSucceededMsg): void;
    onActiveCardFailed(ctx: C, ev: Game_logicGame_logic.ActiveCardFailedMsg): void;
    onPlayerCardUpgraded(ctx: C, ev: Game_logicGame_logic.PlayerCardUpgradedMsg): void;
    onReshuffleCostUpdated(ctx: C, ev: Game_logicGame_logic.ReshuffleCostUpdatedMsg): void;
    onGroupCreated(ctx: C, ev: Game_logicGame_logic.GroupCreatedMsg): void;
    onStreamEnded(ctx: C, ev: Game_logicGame_logic.StreamEndedMsg): void;
    onHighScoringCardSucceeded(ctx: C, ev: Game_logicGame_logic.HighScoringCardSucceededMsg): void;
    onHighScoringCardPromoted(ctx: C, ev: Game_logicGame_logic.HighScoringCardPromotedMsg): void;
    onContextualTeamActionUpdate(ctx: C, ev: Game_logicGame_logic.ContextualTeamActionUpdateMsg): void;
    onMatchBonusReceived(ctx: C, ev: Game_logicGame_logic.MatchBonusReceivedMsg): void;
    onInactivityTimerUpdated(ctx: C, ev: Game_logicGame_logic.InactivityTimerUpdatedMsg): void;
    onInactivityTimerCancelled(ctx: C, ev: Game_logicGame_logic.InactivityTimerCancelledMsg): void;
    onInactivityKickReceived(ctx: C, ev: Game_logicGame_logic.InactivityKickReceivedMsg): void;
    onMatchPauseStateChanged(ctx: C, ev: Game_logicGame_logic.MatchPauseStateChangedMsg): void;
    onTeamMergeWarningReceived(ctx: C, ev: Game_logicGame_logic.TeamMergeWarningReceivedMsg): void;
    onTeamMergeExecuted(ctx: C, ev: Game_logicGame_logic.TeamMergeExecutedMsg): void;
    onDebug(ctx: C, ev: Game_logicGame_logic.DebugMsg): void;
}
export declare function routeServerMessagePayloadDelegate<C>(ctx: C, val: ServerMessage, delegate: IServerMessagePayloadDelegate<C>): void;
export interface IStreamerMessagePayloadDelegate<C> {
    onActivateContextualTeamAction(ctx: C, ev: Game_logicGame_logic.ActivateContextualTeamAction): void;
}
export declare function routeStreamerMessagePayloadDelegate<C>(ctx: C, val: StreamerMessage, delegate: IStreamerMessagePayloadDelegate<C>): void;
export {};
//# sourceMappingURL=messaging.pb.d.ts.map