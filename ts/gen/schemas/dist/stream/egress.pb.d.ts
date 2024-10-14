import * as Content_rendererContent_renderer from "../content-renderer/content_renderer.pb";
import * as fm from "../fetch.pb";
import * as GoogleApiHttpbody from "../google/api/httpbody.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum StreamType {
    STREAM_TYPE_UNSPECIFIED = "STREAM_TYPE_UNSPECIFIED",
    STREAM_TYPE_CR = "STREAM_TYPE_CR",
    STREAM_TYPE_SOURCE = "STREAM_TYPE_SOURCE"
}
export declare enum IceTransportPolicy {
    ICE_TRANSPORT_POLICY_UNSPECIFIED = "ICE_TRANSPORT_POLICY_UNSPECIFIED",
    ICE_TRANSPORT_POLICY_ALL = "ICE_TRANSPORT_POLICY_ALL",
    ICE_TRANSPORT_POLICY_RELAY = "ICE_TRANSPORT_POLICY_RELAY"
}
export declare enum MediaKind {
    MEDIA_KIND_UNSPECIFIED = "MEDIA_KIND_UNSPECIFIED",
    MEDIA_KIND_AUDIO = "MEDIA_KIND_AUDIO",
    MEDIA_KIND_VIDEO = "MEDIA_KIND_VIDEO"
}
export type Stream = {
    id?: string;
    channelId?: string;
    thumbnailUrl?: string;
    createdAt?: string;
    viewerCount?: number;
};
export type Position = {
    normX?: number;
    normY?: number;
    normZ?: number;
    normWidth?: number;
    normHeight?: number;
};
export type QualityLayer = {
    width?: number;
    height?: number;
    framerate?: number;
    displayName?: string;
};
export type AvatarUpdateAvatarPlacement = {
    userId?: string;
    groupTrackId?: string;
    crowdPosition?: Position;
    groupTrackPosition?: Position;
};
export type AvatarUpdateAvatarRemoval = {
    userId?: string;
};
type BaseAvatarUpdate = {};
export type AvatarUpdate = BaseAvatarUpdate & OneOf<{
    placement: AvatarUpdateAvatarPlacement;
    removal: AvatarUpdateAvatarRemoval;
}>;
export type ListStreamsRequest = {};
export type ListStreamsResponse = {
    streams?: Stream[];
};
export type WatchActionWatch = {
    streamId?: string;
    channelId?: string;
    streamType?: StreamType;
};
export type WatchActionSelectGroup = {
    groupId?: string;
};
export type WatchActionStart = {
    offerId?: string;
    jsepSdpAnwser?: string;
};
export type WatchActionOffer = {
    sdp?: string;
};
export type WatchActionStop = {};
export type WatchActionICECandidate = {
    candidate?: string;
};
export type WatchActionSelectQualityLayer = {
    trackId?: string;
    layer?: QualityLayer;
};
type BaseWatchAction = {
    cid?: number;
    sessionId?: string;
};
export type WatchAction = BaseWatchAction & OneOf<{
    start: WatchActionStart;
    stop: WatchActionStop;
    candidate: WatchActionICECandidate;
    selectQualityLayer: WatchActionSelectQualityLayer;
    watch: WatchActionWatch;
    selectGroup: WatchActionSelectGroup;
    offer: WatchActionOffer;
}>;
export type ICEServer = {
    urls?: string[];
    username?: string;
    credential?: string;
};
export type TrackInfo = {
    id?: string;
    mid?: string;
    kind?: MediaKind;
    qualityLayers?: QualityLayer[];
};
export type StreamInfo = {
    label?: string;
    tracks?: TrackInfo[];
};
export type WatchEventAck = {};
export type WatchEventError = {
    message?: string;
    code?: number;
};
export type WatchEventInitPeerConnection = {
    iceServers?: ICEServer[];
    transportPolicy?: IceTransportPolicy;
    clientSendsOffer?: boolean;
    egressType?: string;
};
export type WatchEventOffer = {
    id?: string;
    jsepSdpOffer?: string;
    streams?: StreamInfo[];
};
export type WatchEventAvatarPlacement = {
    userId?: string;
    position?: Position;
};
export type WatchEventAvatarRemoval = {
    userId?: string;
};
export type WatchEventKeyValueOp = {
    op?: Content_rendererContent_renderer.ContentUpdateKeyValueOp;
};
export type WatchEventSignal = {
    signal?: string;
};
export type WatchEventServerShuttingDown = {};
export type WatchEventICECandidate = {
    candidate?: string;
};
export type WatchEventQualityLayerSelected = {
    trackId?: string;
    layer?: QualityLayer;
};
export type WatchEventAnswer = {
    sdp?: string;
    streams?: StreamInfo[];
};
type BaseWatchEvent = {
    cid?: number;
    sessionId?: string;
};
export type WatchEvent = BaseWatchEvent & OneOf<{
    ack: WatchEventAck;
    error: WatchEventError;
    offer: WatchEventOffer;
    avatarPlacement: WatchEventAvatarPlacement;
    avatarRemoval: WatchEventAvatarRemoval;
    serverShuttingDown: WatchEventServerShuttingDown;
    keyValueOp: WatchEventKeyValueOp;
    signal: WatchEventSignal;
    iceCandidate: WatchEventICECandidate;
    qualityLayerSelected: WatchEventQualityLayerSelected;
    initPeerConnection: WatchEventInitPeerConnection;
    answer: WatchEventAnswer;
}>;
export type WatchRecordingRequest = {
    channelId?: string;
    streamId?: string;
    offsetMs?: string;
};
export type UserEventWatchStart = {
    channelId?: string;
    streamId?: string;
    userId?: string;
    sessionId?: string;
    streamType?: StreamType;
};
export type UserEventWatchStop = {
    channelId?: string;
    streamId?: string;
    userId?: string;
    sessionId?: string;
    streamType?: StreamType;
};
type BaseUserEvent = {};
export type UserEvent = BaseUserEvent & OneOf<{
    watchStart: UserEventWatchStart;
    watchStop: UserEventWatchStop;
}>;
export interface IAvatarUpdateUpdateDelegate<C> {
    onPlacement(ctx: C, ev: AvatarUpdateAvatarPlacement): void;
    onRemoval(ctx: C, ev: AvatarUpdateAvatarRemoval): void;
}
export declare function routeAvatarUpdateUpdateDelegate<C>(ctx: C, val: AvatarUpdate, delegate: IAvatarUpdateUpdateDelegate<C>): void;
export interface IWatchActionActionDelegate<C> {
    onStart(ctx: C, ev: WatchActionStart): void;
    onStop(ctx: C, ev: WatchActionStop): void;
    onCandidate(ctx: C, ev: WatchActionICECandidate): void;
    onSelectQualityLayer(ctx: C, ev: WatchActionSelectQualityLayer): void;
    onWatch(ctx: C, ev: WatchActionWatch): void;
    onSelectGroup(ctx: C, ev: WatchActionSelectGroup): void;
    onOffer(ctx: C, ev: WatchActionOffer): void;
}
export declare function routeWatchActionActionDelegate<C>(ctx: C, val: WatchAction, delegate: IWatchActionActionDelegate<C>): void;
export interface IWatchEventEventDelegate<C> {
    onAck(ctx: C, ev: WatchEventAck): void;
    onError(ctx: C, ev: WatchEventError): void;
    onOffer(ctx: C, ev: WatchEventOffer): void;
    onAvatarPlacement(ctx: C, ev: WatchEventAvatarPlacement): void;
    onAvatarRemoval(ctx: C, ev: WatchEventAvatarRemoval): void;
    onServerShuttingDown(ctx: C, ev: WatchEventServerShuttingDown): void;
    onKeyValueOp(ctx: C, ev: WatchEventKeyValueOp): void;
    onSignal(ctx: C, ev: WatchEventSignal): void;
    onIceCandidate(ctx: C, ev: WatchEventICECandidate): void;
    onQualityLayerSelected(ctx: C, ev: WatchEventQualityLayerSelected): void;
    onInitPeerConnection(ctx: C, ev: WatchEventInitPeerConnection): void;
    onAnswer(ctx: C, ev: WatchEventAnswer): void;
}
export declare function routeWatchEventEventDelegate<C>(ctx: C, val: WatchEvent, delegate: IWatchEventEventDelegate<C>): void;
export interface IUserEventEventDelegate<C> {
    onWatchStart(ctx: C, ev: UserEventWatchStart): void;
    onWatchStop(ctx: C, ev: UserEventWatchStop): void;
}
export declare function routeUserEventEventDelegate<C>(ctx: C, val: UserEvent, delegate: IUserEventEventDelegate<C>): void;
export declare class StreamEgressService {
    static Watch(entityNotifier?: fm.NotifyStreamEntityArrival<WatchEvent>, errorCallback?: fm.NotifyStreamErrorArrival, initReq?: fm.InitReq): Promise<fm.StreamEntityPusher<WatchAction>>;
    static WatchRecording(req: WatchRecordingRequest, entityNotifier?: fm.NotifyStreamEntityArrival<GoogleApiHttpbody.HttpBody>, initReq?: fm.InitReq): Promise<void>;
}
export {};
//# sourceMappingURL=egress.pb.d.ts.map