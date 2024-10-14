import * as fm from "../fetch.pb";
import * as Game_logicGame_logic from "../game-logic/game_logic.pb";
import * as Game_stateGame_state from "../game-state/game_state.pb";
import * as RenderingTransitions from "../rendering/transitions.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum StreamEventFilterEventType {
    EVENT_TYPE_UNSPECIFIED = "EVENT_TYPE_UNSPECIFIED",
    EVENT_TYPE_ACTIVE_CARD_SUCCEEDED = "EVENT_TYPE_ACTIVE_CARD_SUCCEEDED",
    EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED = "EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED",
    EVENT_TYPE_PLAYER_JOINED = "EVENT_TYPE_PLAYER_JOINED",
    EVENT_TYPE_CHANNEL_FOLLOWED = "EVENT_TYPE_CHANNEL_FOLLOWED",
    EVENT_TYPE_CHANNEL_SUBSCRIBED = "EVENT_TYPE_CHANNEL_SUBSCRIBED",
    EVENT_TYPE_CHANNEL_SUBSCRIPTION_GIFTED = "EVENT_TYPE_CHANNEL_SUBSCRIPTION_GIFTED"
}
export type TriggerCameraTransitionRequest = {
    streamId?: string;
    cameraTransitionTarget?: RenderingTransitions.CameraTransitionRequestTransitionTarget;
};
export type TriggerCameraTransitionResponse = {
    success?: boolean;
};
export type StreamEventsRequest = {
    streamId?: string;
    filter?: StreamEventFilter;
};
export type ChannelFollowed = {
    userId?: string;
};
export type ChannelSubscribed = {
    userId?: string;
};
export type SubscriptionGifted = {
    userId?: string;
    tier?: number;
    recipientUserIds?: string[];
};
type BaseStreamEvent = {
    timestamp?: string;
};
export type StreamEvent = BaseStreamEvent & OneOf<{
    ping: number;
    gameCardSucceeded: Game_logicGame_logic.ActiveCardSucceededMsg;
    highScoringCardPromoted: Game_logicGame_logic.HighScoringCardPromotedMsg;
    matchEnded: Game_logicGame_logic.MatchEndedMsg;
    matchStarted: Game_logicGame_logic.MatchStartedMsg;
    playerJoined: Game_logicGame_logic.PlayerJoinedMsg;
    channelFollowed: ChannelFollowed;
    stateUpdated: Game_stateGame_state.StreamState;
    channelSubscribed: ChannelSubscribed;
    subscriptionGifted: SubscriptionGifted;
}>;
export type StreamEventFilter = {
    eventTypes?: StreamEventFilterEventType[];
};
export type ActivateContextualTeamActionRequest = {
    streamId?: string;
};
export type ActivateContextualTeamActionResponse = {
    activated?: boolean;
    cooldown?: string;
};
export interface IStreamEventContentDelegate<C> {
    onPing(ctx: C, ev: number): void;
    onGameCardSucceeded(ctx: C, ev: Game_logicGame_logic.ActiveCardSucceededMsg): void;
    onHighScoringCardPromoted(ctx: C, ev: Game_logicGame_logic.HighScoringCardPromotedMsg): void;
    onMatchEnded(ctx: C, ev: Game_logicGame_logic.MatchEndedMsg): void;
    onMatchStarted(ctx: C, ev: Game_logicGame_logic.MatchStartedMsg): void;
    onPlayerJoined(ctx: C, ev: Game_logicGame_logic.PlayerJoinedMsg): void;
    onChannelFollowed(ctx: C, ev: ChannelFollowed): void;
    onStateUpdated(ctx: C, ev: Game_stateGame_state.StreamState): void;
    onChannelSubscribed(ctx: C, ev: ChannelSubscribed): void;
    onSubscriptionGifted(ctx: C, ev: SubscriptionGifted): void;
}
export declare function routeStreamEventContentDelegate<C>(ctx: C, val: StreamEvent, delegate: IStreamEventContentDelegate<C>): void;
export declare class StreamerService {
    static StreamEvents(req: StreamEventsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<StreamEvent>, initReq?: fm.InitReq): Promise<void>;
    static ActivateContextualTeamAction(req: ActivateContextualTeamActionRequest, initReq?: fm.InitReq): Promise<ActivateContextualTeamActionResponse>;
    static TriggerCameraTransition(req: TriggerCameraTransitionRequest, initReq?: fm.InitReq): Promise<TriggerCameraTransitionResponse>;
}
export {};
//# sourceMappingURL=streamer.pb.d.ts.map