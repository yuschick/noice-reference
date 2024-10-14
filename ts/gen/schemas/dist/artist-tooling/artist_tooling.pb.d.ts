import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export type Settings = {
    avatarPartsDir?: string;
    animationDir?: string;
    assetDir?: string;
};
export type SetSettingsRequest = {
    settings?: Settings;
};
export type GetSettingsRequest = {};
export type EventAvatarPartFileUpdated = {
    path?: string;
};
export type EventAnimationFileUpdated = {
    path?: string;
};
export type EventAssetFileUpdated = {
    path?: string;
};
type BaseEvent = {};
export type Event = BaseEvent & OneOf<{
    avatarPartFileUpdated: EventAvatarPartFileUpdated;
    animationFileUpdated: EventAnimationFileUpdated;
    assetFileUpdated: EventAssetFileUpdated;
}>;
export type SendEventRequest = {
    event?: Event;
};
export type ListAssetsResponse = {
    assets?: string[];
};
export interface IEventEventDelegate<C> {
    onAvatarPartFileUpdated(ctx: C, ev: EventAvatarPartFileUpdated): void;
    onAnimationFileUpdated(ctx: C, ev: EventAnimationFileUpdated): void;
    onAssetFileUpdated(ctx: C, ev: EventAssetFileUpdated): void;
}
export declare function routeEventEventDelegate<C>(ctx: C, val: Event, delegate: IEventEventDelegate<C>): void;
export declare class ArtistToolingService {
    static SetSettings(req: SetSettingsRequest, initReq?: fm.InitReq): Promise<Settings>;
    static GetSettings(req: GetSettingsRequest, initReq?: fm.InitReq): Promise<Settings>;
    static Events(req: GoogleProtobufEmpty.Empty, entityNotifier?: fm.NotifyStreamEntityArrival<Event>, initReq?: fm.InitReq): Promise<void>;
    static SendEvent(req: SendEventRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListAssets(req: GoogleProtobufEmpty.Empty, initReq?: fm.InitReq): Promise<ListAssetsResponse>;
}
export {};
//# sourceMappingURL=artist_tooling.pb.d.ts.map