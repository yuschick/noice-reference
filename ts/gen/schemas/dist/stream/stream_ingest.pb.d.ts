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
export type RegisterStreamIngestv2Request = {
    channelId?: string;
};
export type RegisterStreamIngestv2Response = {
    streamId?: string;
    url?: string;
};
export type RefreshStreamIngestRequest = {
    channelId?: string;
    streamId?: string;
};
export type DeregisterStreamIngestv2Request = {
    channelId?: string;
    streamId?: string;
};
export type JanusIngest = {
    url?: string;
    janusChannelId?: string;
};
export type LivekitIngest = {
    url?: string;
};
type BaseStreamIngest = {
    channelId?: string;
    streamId?: string;
};
export type StreamIngest = BaseStreamIngest & OneOf<{
    janus: JanusIngest;
    livekit: LivekitIngest;
}>;
export type RegisterStreamIngestRequest = {
    body?: StreamIngest;
};
export type RegisterStreamIngestResponse = {};
export type DeregisterStreamIngestRequest = {
    body?: StreamIngest;
};
export type DeregisterStreamIngestResponse = {};
export interface IStreamIngestEndpointDelegate<C> {
    onJanus(ctx: C, ev: JanusIngest): void;
    onLivekit(ctx: C, ev: LivekitIngest): void;
}
export declare function routeStreamIngestEndpointDelegate<C>(ctx: C, val: StreamIngest, delegate: IStreamIngestEndpointDelegate<C>): void;
export declare class StreamIngestService {
    static RegisterStreamIngest(req: RegisterStreamIngestRequest, initReq?: fm.InitReq): Promise<RegisterStreamIngestResponse>;
    static DeregisterStreamIngest(req: DeregisterStreamIngestRequest, initReq?: fm.InitReq): Promise<DeregisterStreamIngestResponse>;
    static RegisterStreamIngestv2(req: RegisterStreamIngestv2Request, initReq?: fm.InitReq): Promise<RegisterStreamIngestv2Response>;
    static RefreshStreamIngest(req: RefreshStreamIngestRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DeregisterStreamIngestv2(req: DeregisterStreamIngestv2Request, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
export {};
//# sourceMappingURL=stream_ingest.pb.d.ts.map