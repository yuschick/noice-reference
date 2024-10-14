import * as AuthAuth from "../auth/auth.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
import * as Stream_deploymentDeployment from "../stream/deployment.pb";
import * as ChannelCommon from "./common.pb";
export type StreamCreatedEvent = {
    stream?: ChannelCommon.Stream;
};
export type StreamBackendConfigUpdateEvent = {
    config?: StreamBackendConfig;
    updatedAt?: string;
};
export type StreamBackendConfig = {
    id?: string;
    channelId?: string;
    gameId?: string;
    crConfig?: ChannelCommon.ContentRendererConfig;
    mlConfig?: ChannelCommon.MachineLearningConfig;
    recConfig?: ChannelCommon.StreamRecorderConfig;
};
export type CreateStreamBackendConfigRequest = {
    channelId?: string;
    gameId?: string;
    crConfig?: ChannelCommon.ContentRendererConfig;
    mlConfig?: ChannelCommon.MachineLearningConfig;
    recConfig?: ChannelCommon.StreamRecorderConfig;
};
export type DeleteStreamBackendConfigRequest = {
    channelId?: string;
    id?: string;
};
export type UpdateStreamBackendConfigRequest = {
    body?: StreamBackendConfig;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type GetStreamBackendConfigRequest = {
    channelId?: string;
    id?: string;
};
export type GetSelectedStreamBackendConfigRequest = {
    channelId?: string;
};
export type ListStreamBackendConfigsRequest = {
    channelId?: string;
};
export type ListStreamBackendConfigsResponse = {
    configs?: StreamBackendConfig[];
};
export type SelectStreamBackendConfigRequest = {
    channelId?: string;
    configId?: string;
};
export type CreateStreamRequest = {
    channelId?: string;
    streamId?: string;
};
export type EndStreamRequest = {
    streamId?: string;
};
export type StreamStatusUpdateRequest = {
    channelId?: string;
    streamId?: string;
};
export type StreamStatusEvent = {
    channelId?: string;
    streamId?: string;
    liveStatus?: ChannelCommon.LiveStatus;
    crStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus;
    mlStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus;
    recStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus;
    restreamingStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus;
    egressStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus;
    gameRunnerStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus;
};
export type IngestStatsUpdateRequest = {
    channelId?: string;
};
export type IngestStatsEvent = {
    channelId?: string;
    streamId?: string;
    width?: number;
    height?: number;
    framerate?: number;
    bitrate?: number;
    bSlices?: number;
    audioSampleRate?: number;
};
export type RestreamingConfig = {
    channelId?: string;
    enabled?: boolean;
    rtmpEndpoint?: string;
    rtmpKey?: string;
    bitrate?: number;
};
export type GetRestreamingConfigRequest = {
    channelId?: string;
};
export type UpdateRestreamingConfigRequest = {
    body?: RestreamingConfig;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type GetRestreamingAccountRequest = {
    channelId?: string;
};
export declare class ChannelConfigService {
    static CreateStreamBackendConfig(req: CreateStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<StreamBackendConfig>;
    static DeleteStreamBackendConfig(req: DeleteStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetStreamBackendConfig(req: GetStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<StreamBackendConfig>;
    static GetSelectedStreamBackendConfig(req: GetSelectedStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<StreamBackendConfig>;
    static ListStreamBackendConfigs(req: ListStreamBackendConfigsRequest, initReq?: fm.InitReq): Promise<ListStreamBackendConfigsResponse>;
    static UpdateStreamBackendConfig(req: UpdateStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<StreamBackendConfig>;
    static SelectStreamBackendConfig(req: SelectStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static CreateStream(req: CreateStreamRequest, initReq?: fm.InitReq): Promise<ChannelCommon.Stream>;
    static EndStream(req: EndStreamRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static StreamStatusUpdates(req: StreamStatusUpdateRequest, entityNotifier?: fm.NotifyStreamEntityArrival<StreamStatusEvent>, initReq?: fm.InitReq): Promise<void>;
    static IngestStatsUpdates(req: IngestStatsUpdateRequest, entityNotifier?: fm.NotifyStreamEntityArrival<IngestStatsEvent>, initReq?: fm.InitReq): Promise<void>;
    static GetRestreamingConfig(req: GetRestreamingConfigRequest, initReq?: fm.InitReq): Promise<RestreamingConfig>;
    static UpdateRestreamingConfig(req: UpdateRestreamingConfigRequest, initReq?: fm.InitReq): Promise<RestreamingConfig>;
    static GetRestreamingAccount(req: GetRestreamingAccountRequest, initReq?: fm.InitReq): Promise<AuthAuth.Account>;
}
//# sourceMappingURL=channel_config.pb.d.ts.map