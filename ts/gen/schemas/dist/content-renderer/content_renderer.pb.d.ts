import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as RenderingConfig from "../rendering/config.pb";
import * as RenderingEvents from "../rendering/events.pb";
import * as RenderingTransitions from "../rendering/transitions.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum ContentUpdateKeyValueOpOperation {
    OPERATION_UNSPECIFIED = "OPERATION_UNSPECIFIED",
    OPERATION_SET = "OPERATION_SET",
    OPERATION_UNSET = "OPERATION_UNSET",
    OPERATION_PATCH = "OPERATION_PATCH",
    OPERATION_PRUNE = "OPERATION_PRUNE"
}
export declare enum CandidateTarget {
    TARGET_UNSPECIFIED = "TARGET_UNSPECIFIED",
    TARGET_SUBSCRIBER = "TARGET_SUBSCRIBER",
    TARGET_PUBLISHER = "TARGET_PUBLISHER"
}
export declare enum VideoLayerVideoQuality {
    VIDEO_QUALITY_UNSPECIFIED = "VIDEO_QUALITY_UNSPECIFIED",
    VIDEO_QUALITY_LOW = "VIDEO_QUALITY_LOW",
    VIDEO_QUALITY_MEDIUM = "VIDEO_QUALITY_MEDIUM",
    VIDEO_QUALITY_HIGH = "VIDEO_QUALITY_HIGH"
}
export type ContentUpdatePosition = {
    normX?: number;
    normY?: number;
    normZ?: number;
    normWidth?: number;
    normHeight?: number;
};
export type ContentUpdateAvatarPlacement = {
    userId?: string;
    groupTrackId?: string;
    crowdPosition?: ContentUpdatePosition;
    groupTrackPosition?: ContentUpdatePosition;
};
export type ContentUpdateGroupPlacement = {
    groupId?: string;
    trackId?: string;
};
export type ContentUpdateAvatarRemoval = {
    userId?: string;
    trackId?: string;
};
export type ContentUpdateGroupRemoval = {
    groupId?: string;
    trackId?: string;
};
export type ContentUpdateKeyValueOp = {
    groupId?: string;
    key?: string;
    seqIndex?: string;
    operation?: ContentUpdateKeyValueOpOperation;
    value?: string;
    ageMs?: string;
};
export type ContentUpdateSignal = {
    groupId?: string;
    payload?: string;
};
type BaseContentUpdate = {
    streamId?: string;
    instanceId?: string;
};
export type ContentUpdate = BaseContentUpdate & OneOf<{
    groupPlacement: ContentUpdateGroupPlacement;
    avatarPlacement: ContentUpdateAvatarPlacement;
    avatarRemoval: ContentUpdateAvatarRemoval;
    groupRemoval: ContentUpdateGroupRemoval;
    keyValueOp: ContentUpdateKeyValueOp;
    signal: ContentUpdateSignal;
}>;
export type HealthCheckResponse = {
    healthy?: boolean;
};
export type StartCameraTransitionResponse = {
    success?: boolean;
};
export type Offer = {
    sdp?: string;
};
export type Answer = {
    sdp?: string;
};
export type Candidate = {
    candidate?: string;
    target?: CandidateTarget;
};
export type VideoLayer = {
    quality?: VideoLayerVideoQuality;
    height?: number;
    width?: number;
    ssrc?: number;
};
export type AddTrack = {
    cid?: string;
    name?: string;
    kind?: string;
    videoLayers?: VideoLayer[];
};
export type StartSession = {
    url?: string;
    token?: string;
    subscribeParticipant?: string;
};
export type StopSession = {};
type BaseWebrtcSignalingResponse = {
    sessionId?: string;
};
export type WebrtcSignalingResponse = BaseWebrtcSignalingResponse & OneOf<{
    start: StartSession;
    stop: StopSession;
    offer: Offer;
    answer: Answer;
    candidate: Candidate;
    addTrack: AddTrack;
}>;
type BaseWebrtcSignalingRequest = {
    sessionId?: string;
};
export type WebrtcSignalingRequest = BaseWebrtcSignalingRequest & OneOf<{
    offer: Offer;
    answer: Answer;
    candidate: Candidate;
}>;
export interface IContentUpdateUpdateDelegate<C> {
    onGroupPlacement(ctx: C, ev: ContentUpdateGroupPlacement): void;
    onAvatarPlacement(ctx: C, ev: ContentUpdateAvatarPlacement): void;
    onAvatarRemoval(ctx: C, ev: ContentUpdateAvatarRemoval): void;
    onGroupRemoval(ctx: C, ev: ContentUpdateGroupRemoval): void;
    onKeyValueOp(ctx: C, ev: ContentUpdateKeyValueOp): void;
    onSignal(ctx: C, ev: ContentUpdateSignal): void;
}
export declare function routeContentUpdateUpdateDelegate<C>(ctx: C, val: ContentUpdate, delegate: IContentUpdateUpdateDelegate<C>): void;
export interface IWebrtcSignalingResponseActionDelegate<C> {
    onStart(ctx: C, ev: StartSession): void;
    onStop(ctx: C, ev: StopSession): void;
    onOffer(ctx: C, ev: Offer): void;
    onAnswer(ctx: C, ev: Answer): void;
    onCandidate(ctx: C, ev: Candidate): void;
    onAddTrack(ctx: C, ev: AddTrack): void;
}
export declare function routeWebrtcSignalingResponseActionDelegate<C>(ctx: C, val: WebrtcSignalingResponse, delegate: IWebrtcSignalingResponseActionDelegate<C>): void;
export interface IWebrtcSignalingRequestActionDelegate<C> {
    onOffer(ctx: C, ev: Offer): void;
    onAnswer(ctx: C, ev: Answer): void;
    onCandidate(ctx: C, ev: Candidate): void;
}
export declare function routeWebrtcSignalingRequestActionDelegate<C>(ctx: C, val: WebrtcSignalingRequest, delegate: IWebrtcSignalingRequestActionDelegate<C>): void;
export declare class ContentRendererService {
    static LoadArena(req: RenderingConfig.ArenaLoadRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static LoadAnimations(req: RenderingConfig.AnimationLoadRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleJoiningPlayer(req: RenderingEvents.PlayerJoinEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleLeavingPlayer(req: RenderingEvents.PlayerLeaveEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleMatchStart(req: RenderingEvents.MatchStartEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleMatchEnd(req: RenderingEvents.MatchEndEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleEmote(req: RenderingEvents.EmoteEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleEmoji(req: RenderingEvents.EmojiEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleGroupCheer(req: RenderingEvents.GroupCheerEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleGroupCheerParticipation(req: RenderingEvents.GroupCheerParticipationEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleCardSuccess(req: RenderingEvents.CardSuccessEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleCardFailure(req: RenderingEvents.CardFailureEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleActiveCardSet(req: RenderingEvents.CardSetActiveEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleUsedBooster(req: RenderingEvents.BoosterUsedEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleRequestedBooster(req: RenderingEvents.BoosterRequestedEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleChatMessageSent(req: RenderingEvents.ChatMessageSentEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleHighScoringCard(req: RenderingEvents.HighScoringCardEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static HandleSetDebug(req: RenderingEvents.SetDebugEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static Updates(req: GoogleProtobufEmpty.Empty, entityNotifier?: fm.NotifyStreamEntityArrival<ContentUpdate>, initReq?: fm.InitReq): Promise<void>;
    static HealthCheck(req: GoogleProtobufEmpty.Empty, initReq?: fm.InitReq): Promise<HealthCheckResponse>;
    static StartCameraTransition(req: RenderingTransitions.CameraTransitionRequest, initReq?: fm.InitReq): Promise<StartCameraTransitionResponse>;
    static SetActiveContentMode(req: RenderingTransitions.ContentMode, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static SetActiveTransition(req: RenderingTransitions.Transition, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static WebrtcSignaling(entityNotifier?: fm.NotifyStreamEntityArrival<WebrtcSignalingResponse>, errorCallback?: fm.NotifyStreamErrorArrival, initReq?: fm.InitReq): Promise<fm.StreamEntityPusher<WebrtcSignalingRequest>>;
}
export {};
//# sourceMappingURL=content_renderer.pb.d.ts.map