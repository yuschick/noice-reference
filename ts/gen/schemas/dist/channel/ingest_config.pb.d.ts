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
export declare enum StreamingStatus {
    STREAMING_STATUS_UNSPECIFIED = "STREAMING_STATUS_UNSPECIFIED",
    STREAMING_STATUS_USER_SUSPENDED = "STREAMING_STATUS_USER_SUSPENDED",
    STREAMING_STATUS_STREAMING_DISABLED = "STREAMING_STATUS_STREAMING_DISABLED"
}
export type IngestConfigFTLConfig = {
    streamId?: number;
    sharedKey?: string;
    streamKey?: string;
};
type BaseIngestConfig = {};
export type IngestConfig = BaseIngestConfig & OneOf<{
    ftl: IngestConfigFTLConfig;
}>;
export type ChannelIngestConfigs = {
    channelId?: string;
    configs?: IngestConfig[];
};
export type ChannelIngestConfig = {
    channelId?: string;
    config?: IngestConfig;
    streamingStatus?: StreamingStatus;
};
export type CreateIngestConfigsRequest = {
    channelId?: string;
};
export type RefreshIngestConfigsRequest = {
    channelId?: string;
};
export type DeleteIngestConfigsRequest = {
    channelId?: string;
};
export type ListIngestConfigsRequest = {
    channelId?: string;
};
type BaseGetIngestConfigRequest = {};
export type GetIngestConfigRequest = BaseGetIngestConfigRequest & OneOf<{
    ftlId: number;
}>;
export interface IIngestConfigIngestDelegate<C> {
    onFtl(ctx: C, ev: IngestConfigFTLConfig): void;
}
export declare function routeIngestConfigIngestDelegate<C>(ctx: C, val: IngestConfig, delegate: IIngestConfigIngestDelegate<C>): void;
export interface IGetIngestConfigRequestIdDelegate<C> {
    onFtlId(ctx: C, ev: number): void;
}
export declare function routeGetIngestConfigRequestIdDelegate<C>(ctx: C, val: GetIngestConfigRequest, delegate: IGetIngestConfigRequestIdDelegate<C>): void;
export declare class StreamIngestConfigService {
    static CreateIngestConfigs(req: CreateIngestConfigsRequest, initReq?: fm.InitReq): Promise<ChannelIngestConfigs>;
    static RefreshIngestConfigs(req: RefreshIngestConfigsRequest, initReq?: fm.InitReq): Promise<ChannelIngestConfigs>;
    static DeleteIngestConfigs(req: DeleteIngestConfigsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetIngestConfig(req: GetIngestConfigRequest, initReq?: fm.InitReq): Promise<ChannelIngestConfig>;
    static ListIngestConfigs(req: ListIngestConfigsRequest, initReq?: fm.InitReq): Promise<ChannelIngestConfigs>;
}
export {};
//# sourceMappingURL=ingest_config.pb.d.ts.map