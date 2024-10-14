import * as fm from "../fetch.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum Target {
    PUBLISHER = "PUBLISHER",
    SUBSCRIBER = "SUBSCRIBER"
}
export declare enum MediaType {
    MediaUnknown = "MediaUnknown",
    UserMedia = "UserMedia",
    ScreenCapture = "ScreenCapture",
    Canvas = "Canvas",
    Streaming = "Streaming",
    VoIP = "VoIP"
}
export declare enum TrackEventState {
    ADD = "ADD",
    UPDATE = "UPDATE",
    REMOVE = "REMOVE"
}
export type JoinRequest = {
    sid?: string;
    uid?: string;
    config?: {
        [key: string]: string;
    };
    description?: SessionDescription;
};
export type JoinReply = {
    success?: boolean;
    error?: Error;
    description?: SessionDescription;
};
export type TrackInfo = {
    id?: string;
    kind?: string;
    muted?: boolean;
    type?: MediaType;
    streamId?: string;
    label?: string;
    layer?: string;
    width?: number;
    height?: number;
    frameRate?: number;
};
export type SessionDescription = {
    target?: Target;
    type?: string;
    sdp?: string;
    trackInfos?: TrackInfo[];
};
export type Trickle = {
    target?: Target;
    init?: string;
};
export type Error = {
    code?: number;
    reason?: string;
};
export type TrackEvent = {
    state?: TrackEventState;
    uid?: string;
    tracks?: TrackInfo[];
};
export type Subscription = {
    trackId?: string;
    mute?: boolean;
    subscribe?: boolean;
    layer?: string;
};
export type SubscriptionRequest = {
    subscriptions?: Subscription[];
};
export type SubscriptionReply = {
    success?: boolean;
    error?: Error;
};
export type UpdateTrackReply = {
    success?: boolean;
    error?: Error;
};
export type ActiveSpeaker = {
    speakers?: AudioLevelSpeaker[];
};
export type AudioLevelSpeaker = {
    sid?: string;
    level?: number;
    active?: boolean;
};
export type GetOfferRequest = {
    sid?: string;
    uid?: string;
};
type BaseRequest = {};
export type Request = BaseRequest & OneOf<{
    join: JoinRequest;
    description: SessionDescription;
    trickle: Trickle;
    subscription: SubscriptionRequest;
    getOffer: GetOfferRequest;
}>;
type BaseReply = {};
export type Reply = BaseReply & OneOf<{
    join: JoinReply;
    description: SessionDescription;
    trickle: Trickle;
    trackEvent: TrackEvent;
    subscription: SubscriptionReply;
    error: Error;
    getOffer: SessionDescription;
}>;
export interface IRequestPayloadDelegate<C> {
    onJoin(ctx: C, ev: JoinRequest): void;
    onDescription(ctx: C, ev: SessionDescription): void;
    onTrickle(ctx: C, ev: Trickle): void;
    onSubscription(ctx: C, ev: SubscriptionRequest): void;
    onGetOffer(ctx: C, ev: GetOfferRequest): void;
}
export declare function routeRequestPayloadDelegate<C>(ctx: C, val: Request, delegate: IRequestPayloadDelegate<C>): void;
export interface IReplyPayloadDelegate<C> {
    onJoin(ctx: C, ev: JoinReply): void;
    onDescription(ctx: C, ev: SessionDescription): void;
    onTrickle(ctx: C, ev: Trickle): void;
    onTrackEvent(ctx: C, ev: TrackEvent): void;
    onSubscription(ctx: C, ev: SubscriptionReply): void;
    onError(ctx: C, ev: Error): void;
    onGetOffer(ctx: C, ev: SessionDescription): void;
}
export declare function routeReplyPayloadDelegate<C>(ctx: C, val: Reply, delegate: IReplyPayloadDelegate<C>): void;
export declare class RTC {
    static Signal(entityNotifier?: fm.NotifyStreamEntityArrival<Reply>, errorCallback?: fm.NotifyStreamErrorArrival, initReq?: fm.InitReq): Promise<fm.StreamEntityPusher<Request>>;
}
export {};
//# sourceMappingURL=ion_rtc.pb.d.ts.map