import * as AttributeAttribute from "../attribute/attribute.pb";
import * as fm from "../fetch.pb";
import * as Game_logicGame_logic from "../game-logic/game_logic.pb";
import * as Game_stateGame_state from "../game-state/game_state.pb";
import * as MessagingMessaging from "../messaging/messaging.pb";
import * as Stream_infoStream_info from "../stream/stream_info.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum StreamMatchStateOpCode {
    STREAM_MATCH_STATE_OP_CODE_UNSPECIFIED = "STREAM_MATCH_STATE_OP_CODE_UNSPECIFIED",
    STREAM_MATCH_STATE_OP_CODE_MATCH_STARTED = "STREAM_MATCH_STATE_OP_CODE_MATCH_STARTED",
    STREAM_MATCH_STATE_OP_CODE_STREAM_ENDED = "STREAM_MATCH_STATE_OP_CODE_STREAM_ENDED"
}
export declare enum MatchGroupErrorCode {
    UNSPECIFIED = "UNSPECIFIED",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    USER_ALREADY_PRESENT = "USER_ALREADY_PRESENT",
    USER_HAS_NO_RESERVATION = "USER_HAS_NO_RESERVATION",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    SERVER_SHUTTING_DOWN = "SERVER_SHUTTING_DOWN"
}
export type MatchGroupMatchEndEventPlayer = {
    userId?: string;
    timeSpentInGroup?: string;
    bestScoringCardPoints?: string;
    points?: string;
};
export type MatchGroupMatchEndEvent = {
    groupId?: string;
    matchDuration?: string;
    players?: MatchGroupMatchEndEventPlayer[];
    streamInfo?: Stream_infoStream_info.StreamInfo;
    matchId?: string;
    isSolo?: boolean;
    isParty?: boolean;
};
export type MatchMakingMatchMadeEvent = {
    userId?: string;
    streamId?: string;
    groupId?: string;
    solo?: boolean;
};
export type StreamMatchStateEventMatchStarted = {
    streamId?: string;
};
export type StreamMatchStateEventStreamEnded = {
    streamId?: string;
};
type BaseStreamMatchStateEvent = {
    opCode?: StreamMatchStateOpCode;
};
export type StreamMatchStateEvent = BaseStreamMatchStateEvent & OneOf<{
    matchStarted: StreamMatchStateEventMatchStarted;
    streamEnded: StreamMatchStateEventStreamEnded;
}>;
export type MatchRewardEventRewardCurrency = {
    id?: string;
    amount?: string;
};
export type MatchRewardEventRewardExperiencePoints = {
    amount?: string;
};
type BaseMatchRewardEventReward = {
    metadata?: AttributeAttribute.AttributeMap;
};
export type MatchRewardEventReward = BaseMatchRewardEventReward & OneOf<{
    currency: MatchRewardEventRewardCurrency;
    experiencePoints: MatchRewardEventRewardExperiencePoints;
}>;
export type MatchRewardEvent = {
    streamInfo?: Stream_infoStream_info.StreamInfo;
    groupId?: string;
    userId?: string;
    rewards?: MatchRewardEventReward[];
};
export type FindMatchGroupRequest = {
    streamId?: string;
    solo?: boolean;
};
export type FindMatchGroupResponse = {
    matchGroupId?: string;
    teamChangeAvailableAt?: string;
};
export type ChangeMatchGroupRequest = {
    streamId?: string;
    solo?: boolean;
};
export type ChangeMatchGroupResponse = {
    matchGroupId?: string;
    teamChangeAvailableAt?: string;
};
export type JoinMatchGroup = {
    spectator?: boolean;
};
export type LeaveMatchGroup = {
    leavingMatch?: boolean;
};
export type MatchGroupEvent = {
    cid?: number;
    groupId?: string;
    event?: MessagingMessaging.ServerMessage;
    error?: MatchGroupError;
};
type BaseMatchGroupAction = {
    cid?: number;
    groupId?: string;
    streamId?: string;
};
export type MatchGroupAction = BaseMatchGroupAction & OneOf<{
    joinMatchGroup: JoinMatchGroup;
    leaveMatchGroup: LeaveMatchGroup;
    setActiveCard: Game_logicGame_logic.SetActiveCardMsg;
    shuffleHand: Game_logicGame_logic.ShuffleHandMsg;
    triggerEmoji: Game_logicGame_logic.TriggerEmojiMsg;
    triggerEmote: Game_logicGame_logic.TriggerEmoteMsg;
    useBooster: Game_logicGame_logic.UseBoosterMsg;
    requestBooster: Game_logicGame_logic.RequestBoosterMsg;
    cancelBoosterRequest: Game_logicGame_logic.CancelBoosterRequestMsg;
    voteCard: Game_logicGame_logic.VoteCardMsg;
    cancelCardVote: Game_logicGame_logic.CancelCardVoteMsg;
    collectAonPoints: Game_logicGame_logic.CollectAONPointsMsg;
    requestHand: Game_logicGame_logic.RequestHandMsg;
    joinTeamAction: Game_logicGame_logic.JoinTeamActionMsg;
    setDebug: Game_logicGame_logic.SetDebugMsg;
}>;
export type MatchGroupError = {
    reason?: MatchGroupErrorCode;
};
export type LeaderboardRequest = {
    streamId?: string;
};
export type LeaderboardUpdateReset = {};
export type LeaderboardUpdateGroupUpdatePlayer = {
    userId?: string;
    points?: number;
};
export type LeaderboardUpdateGroupUpdate = {
    id?: string;
    name?: string;
    points?: number;
    players?: LeaderboardUpdateGroupUpdatePlayer[];
};
export type LeaderboardUpdatePlayerUpdate = {
    groupId?: string;
    groupName?: string;
    userId?: string;
    points?: number;
    delta?: number;
};
export type LeaderboardUpdatePlayerLeft = {
    groupId?: string;
    userId?: string;
};
type BaseLeaderboardUpdate = {};
export type LeaderboardUpdate = BaseLeaderboardUpdate & OneOf<{
    ping: number;
    reset: LeaderboardUpdateReset;
    groupUpdate: LeaderboardUpdateGroupUpdate;
    playerUpdate: LeaderboardUpdatePlayerUpdate;
    playerLeft: LeaderboardUpdatePlayerLeft;
}>;
export type AssignMatchGroupRequest = {
    streamId?: string;
    userId?: string;
    groupId?: string;
};
export type AssignMatchGroupResponse = {};
export type GetGroupChatIDRequest = {
    streamId?: string;
    groupId?: string;
};
export type GetGroupChatIDResponse = {
    chatId?: string;
};
export type StreamSpectatorCoordinationEventsRequest = {
    streamId?: string;
};
export type StreamSpectatorChangeGroupEvent = {
    groupId?: string;
};
type BaseStreamSpectatorCoordinationEvent = {};
export type StreamSpectatorCoordinationEvent = BaseStreamSpectatorCoordinationEvent & OneOf<{
    changeGroup: StreamSpectatorChangeGroupEvent;
}>;
export type GetMatchStateRequest = {
    streamId?: string;
};
export type GetMatchStateResponse = {
    matchState?: Game_logicGame_logic.StreamStateMatchState;
};
export type GetStreamStateRequest = {
    streamId?: string;
};
export type GetStreamStateResponse = {
    started?: boolean;
    streamInfo?: Stream_infoStream_info.StreamInfo;
    groups?: string[];
    gameConfig?: Game_stateGame_state.GameConfig;
    streamTracker?: Game_stateGame_state.StreamTrackerState;
    streamGroupsTracker?: Game_stateGame_state.StreamGroupsTrackerState;
    highScoringCard?: Game_stateGame_state.HighScoringCardState;
};
export type GetGroupStateRequest = {
    groupId?: string;
    streamId?: string;
};
export type GetGroupStateResponse = {
    state?: Game_stateGame_state.GroupState;
    runnerState?: Game_stateGame_state.GroupRunnerState;
};
export type AdvanceGroupTimeRequest = {
    groupId?: string;
    seconds?: number;
    streamId?: string;
};
export type AdvanceGroupTimeResponse = {};
export type SetGroupRandomSeedRequest = {
    groupId?: string;
    seed?: string;
    streamId?: string;
};
export type SetGroupRandomSeedResponse = {};
export type SendMessageRequest = {
    event?: MatchGroupEvent;
    message?: MailboxMessage;
};
export type SendMessageResponse = {};
export type PublishGameEventRequest = {
    streamKey?: string;
    gameId?: string;
    eventName?: string;
    payload?: string;
};
export type PublishGameEventResponse = {};
type BaseMailboxMessage = {
    traceId?: string;
};
export type MailboxMessage = BaseMailboxMessage & OneOf<{
    event: MatchGroupEvent;
    streamStateUpdate: MessagingMessaging.StreamStateUpdateMessage;
}>;
export interface IStreamMatchStateEventPayloadDelegate<C> {
    onMatchStarted(ctx: C, ev: StreamMatchStateEventMatchStarted): void;
    onStreamEnded(ctx: C, ev: StreamMatchStateEventStreamEnded): void;
}
export declare function routeStreamMatchStateEventPayloadDelegate<C>(ctx: C, val: StreamMatchStateEvent, delegate: IStreamMatchStateEventPayloadDelegate<C>): void;
export interface IMatchRewardEventRewardContentDelegate<C> {
    onCurrency(ctx: C, ev: MatchRewardEventRewardCurrency): void;
    onExperiencePoints(ctx: C, ev: MatchRewardEventRewardExperiencePoints): void;
}
export declare function routeMatchRewardEventRewardContentDelegate<C>(ctx: C, val: MatchRewardEventReward, delegate: IMatchRewardEventRewardContentDelegate<C>): void;
export interface IMatchGroupActionActionDelegate<C> {
    onJoinMatchGroup(ctx: C, ev: JoinMatchGroup): void;
    onLeaveMatchGroup(ctx: C, ev: LeaveMatchGroup): void;
    onSetActiveCard(ctx: C, ev: Game_logicGame_logic.SetActiveCardMsg): void;
    onShuffleHand(ctx: C, ev: Game_logicGame_logic.ShuffleHandMsg): void;
    onTriggerEmoji(ctx: C, ev: Game_logicGame_logic.TriggerEmojiMsg): void;
    onTriggerEmote(ctx: C, ev: Game_logicGame_logic.TriggerEmoteMsg): void;
    onUseBooster(ctx: C, ev: Game_logicGame_logic.UseBoosterMsg): void;
    onRequestBooster(ctx: C, ev: Game_logicGame_logic.RequestBoosterMsg): void;
    onCancelBoosterRequest(ctx: C, ev: Game_logicGame_logic.CancelBoosterRequestMsg): void;
    onVoteCard(ctx: C, ev: Game_logicGame_logic.VoteCardMsg): void;
    onCancelCardVote(ctx: C, ev: Game_logicGame_logic.CancelCardVoteMsg): void;
    onCollectAonPoints(ctx: C, ev: Game_logicGame_logic.CollectAONPointsMsg): void;
    onRequestHand(ctx: C, ev: Game_logicGame_logic.RequestHandMsg): void;
    onJoinTeamAction(ctx: C, ev: Game_logicGame_logic.JoinTeamActionMsg): void;
    onSetDebug(ctx: C, ev: Game_logicGame_logic.SetDebugMsg): void;
}
export declare function routeMatchGroupActionActionDelegate<C>(ctx: C, val: MatchGroupAction, delegate: IMatchGroupActionActionDelegate<C>): void;
export interface ILeaderboardUpdateContentDelegate<C> {
    onPing(ctx: C, ev: number): void;
    onReset(ctx: C, ev: LeaderboardUpdateReset): void;
    onGroupUpdate(ctx: C, ev: LeaderboardUpdateGroupUpdate): void;
    onPlayerUpdate(ctx: C, ev: LeaderboardUpdatePlayerUpdate): void;
    onPlayerLeft(ctx: C, ev: LeaderboardUpdatePlayerLeft): void;
}
export declare function routeLeaderboardUpdateContentDelegate<C>(ctx: C, val: LeaderboardUpdate, delegate: ILeaderboardUpdateContentDelegate<C>): void;
export interface IStreamSpectatorCoordinationEventEventDelegate<C> {
    onChangeGroup(ctx: C, ev: StreamSpectatorChangeGroupEvent): void;
}
export declare function routeStreamSpectatorCoordinationEventEventDelegate<C>(ctx: C, val: StreamSpectatorCoordinationEvent, delegate: IStreamSpectatorCoordinationEventEventDelegate<C>): void;
export interface IMailboxMessagePayloadDelegate<C> {
    onEvent(ctx: C, ev: MatchGroupEvent): void;
    onStreamStateUpdate(ctx: C, ev: MessagingMessaging.StreamStateUpdateMessage): void;
}
export declare function routeMailboxMessagePayloadDelegate<C>(ctx: C, val: MailboxMessage, delegate: IMailboxMessagePayloadDelegate<C>): void;
export declare class MatchMakingServiceV2 {
    static FindMatchGroup(req: FindMatchGroupRequest, initReq?: fm.InitReq): Promise<FindMatchGroupResponse>;
    static ChangeMatchGroup(req: ChangeMatchGroupRequest, initReq?: fm.InitReq): Promise<ChangeMatchGroupResponse>;
}
export declare class MatchMakingAdminService {
    static AssignMatchGroup(req: AssignMatchGroupRequest, initReq?: fm.InitReq): Promise<AssignMatchGroupResponse>;
}
export declare class MatchServiceV2 {
    static MatchGroup(entityNotifier?: fm.NotifyStreamEntityArrival<MatchGroupEvent>, errorCallback?: fm.NotifyStreamErrorArrival, initReq?: fm.InitReq): Promise<fm.StreamEntityPusher<MatchGroupAction>>;
    static StreamSpectatorCoordinationEvents(req: StreamSpectatorCoordinationEventsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<StreamSpectatorCoordinationEvent>, initReq?: fm.InitReq): Promise<void>;
    static LeaderboardUpdates(req: LeaderboardRequest, entityNotifier?: fm.NotifyStreamEntityArrival<LeaderboardUpdate>, initReq?: fm.InitReq): Promise<void>;
    static GetGroupChatID(req: GetGroupChatIDRequest, initReq?: fm.InitReq): Promise<GetGroupChatIDResponse>;
    static GetMatchState(req: GetMatchStateRequest, initReq?: fm.InitReq): Promise<GetMatchStateResponse>;
}
export declare class MatchAdminService {
    static GetStreamState(req: GetStreamStateRequest, initReq?: fm.InitReq): Promise<GetStreamStateResponse>;
    static GetGroupState(req: GetGroupStateRequest, initReq?: fm.InitReq): Promise<GetGroupStateResponse>;
    static AdvanceGroupTime(req: AdvanceGroupTimeRequest, initReq?: fm.InitReq): Promise<AdvanceGroupTimeResponse>;
    static SetGroupRandomSeed(req: SetGroupRandomSeedRequest, initReq?: fm.InitReq): Promise<SetGroupRandomSeedResponse>;
}
export declare class ClientMailboxService {
    static SendMessage(req: SendMessageRequest, initReq?: fm.InitReq): Promise<SendMessageResponse>;
}
export declare class GameEventsService {
    static PublishGameEvent(req: PublishGameEventRequest, initReq?: fm.InitReq): Promise<PublishGameEventResponse>;
}
export {};
//# sourceMappingURL=match.pb.d.ts.map