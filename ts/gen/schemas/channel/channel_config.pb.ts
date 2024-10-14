/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as AuthAuth from "../auth/auth.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as Stream_deploymentDeployment from "../stream/deployment.pb"
import * as ChannelCommon from "./common.pb"
export type StreamCreatedEvent = {
  stream?: ChannelCommon.Stream
}

export type StreamEndedEvent = {
  channelId?: string
  streamId?: string
  channelName?: string
}

export type StreamBackendConfigUpdateEvent = {
  config?: StreamBackendConfig
  updatedAt?: string
}

export type StreamBackendConfig = {
  id?: string
  channelId?: string
  gameId?: string
  crConfig?: ChannelCommon.ContentRendererConfig
  mlConfig?: ChannelCommon.MachineLearningConfig
  recConfig?: ChannelCommon.StreamRecorderConfig
  transcoderConfig?: ChannelCommon.StreamTranscoderConfig
}

export type CreateStreamBackendConfigRequest = {
  channelId?: string
  gameId?: string
  crConfig?: ChannelCommon.ContentRendererConfig
  mlConfig?: ChannelCommon.MachineLearningConfig
  recConfig?: ChannelCommon.StreamRecorderConfig
  transcoderConfig?: ChannelCommon.StreamTranscoderConfig
}

export type DeleteStreamBackendConfigRequest = {
  channelId?: string
  id?: string
}

export type UpdateStreamBackendConfigRequest = {
  body?: StreamBackendConfig
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type GetStreamBackendConfigRequest = {
  channelId?: string
  id?: string
}

export type GetSelectedStreamBackendConfigRequest = {
  channelId?: string
}

export type ListStreamBackendConfigsRequest = {
  channelId?: string
}

export type ListStreamBackendConfigsResponse = {
  configs?: StreamBackendConfig[]
}

export type SelectStreamBackendConfigRequest = {
  channelId?: string
  configId?: string
}

export type CreateStreamRequestFeatureFlag = {
  key?: string
  value?: string
}

export type CreateStreamRequest = {
  channelId?: string
  streamId?: string
  featureFlags?: CreateStreamRequestFeatureFlag[]
}

export type EndStreamRequest = {
  streamId?: string
}

export type StreamStatusUpdateRequest = {
  channelId?: string
  streamId?: string
}

export type StreamStatusEvent = {
  channelId?: string
  streamId?: string
  liveStatus?: ChannelCommon.LiveStatus
  crStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus
  mlStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus
  recStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus
  restreamingStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus
  egressStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus
  gameRunnerStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus
  transcoderStatus?: Stream_deploymentDeployment.StreamDeploymentStatusComponentStatus
}

export type IngestStatsUpdateRequest = {
  channelId?: string
}

export type IngestStatsEvent = {
  channelId?: string
  streamId?: string
  width?: number
  height?: number
  framerate?: number
  bitrate?: number
  bSlices?: number
  audioSampleRate?: number
  audioChannelCnt?: number
}

export type RestreamingConfig = {
  channelId?: string
  enabled?: boolean
  rtmpEndpoint?: string
  rtmpKey?: string
  bitrate?: number
}

export type GetRestreamingConfigRequest = {
  channelId?: string
}

export type UpdateRestreamingConfigRequest = {
  body?: RestreamingConfig
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type GetRestreamingAccountRequest = {
  channelId?: string
}

export class ChannelConfigService {
  static CreateStreamBackendConfig(req: CreateStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<StreamBackendConfig> {
    return fm.fetchReq<CreateStreamBackendConfigRequest, StreamBackendConfig>(`/channel.ChannelConfigService/CreateStreamBackendConfig`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteStreamBackendConfig(req: DeleteStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteStreamBackendConfigRequest, GoogleProtobufEmpty.Empty>(`/channel.ChannelConfigService/DeleteStreamBackendConfig`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetStreamBackendConfig(req: GetStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<StreamBackendConfig> {
    return fm.fetchReq<GetStreamBackendConfigRequest, StreamBackendConfig>(`/channel.ChannelConfigService/GetStreamBackendConfig`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetSelectedStreamBackendConfig(req: GetSelectedStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<StreamBackendConfig> {
    return fm.fetchReq<GetSelectedStreamBackendConfigRequest, StreamBackendConfig>(`/channel.ChannelConfigService/GetSelectedStreamBackendConfig`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListStreamBackendConfigs(req: ListStreamBackendConfigsRequest, initReq?: fm.InitReq): Promise<ListStreamBackendConfigsResponse> {
    return fm.fetchReq<ListStreamBackendConfigsRequest, ListStreamBackendConfigsResponse>(`/channel.ChannelConfigService/ListStreamBackendConfigs`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateStreamBackendConfig(req: UpdateStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<StreamBackendConfig> {
    return fm.fetchReq<UpdateStreamBackendConfigRequest, StreamBackendConfig>(`/v1/channelconfig/${req["body"]["id"]}`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static SelectStreamBackendConfig(req: SelectStreamBackendConfigRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<SelectStreamBackendConfigRequest, GoogleProtobufEmpty.Empty>(`/channel.ChannelConfigService/SelectStreamBackendConfig`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CreateStream(req: CreateStreamRequest, initReq?: fm.InitReq): Promise<ChannelCommon.Stream> {
    return fm.fetchReq<CreateStreamRequest, ChannelCommon.Stream>(`/channel.ChannelConfigService/CreateStream`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static EndStream(req: EndStreamRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<EndStreamRequest, GoogleProtobufEmpty.Empty>(`/channel.ChannelConfigService/EndStream`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static StreamStatusUpdates(req: StreamStatusUpdateRequest, entityNotifier?: fm.NotifyStreamEntityArrival<StreamStatusEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<StreamStatusUpdateRequest, StreamStatusEvent>(`/channel.ChannelConfigService/StreamStatusUpdates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<StreamStatusUpdateRequest, StreamStatusEvent>(`/channel.ChannelConfigService/StreamStatusUpdates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static IngestStatsUpdates(req: IngestStatsUpdateRequest, entityNotifier?: fm.NotifyStreamEntityArrival<IngestStatsEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<IngestStatsUpdateRequest, IngestStatsEvent>(`/channel.ChannelConfigService/IngestStatsUpdates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<IngestStatsUpdateRequest, IngestStatsEvent>(`/channel.ChannelConfigService/IngestStatsUpdates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetRestreamingConfig(req: GetRestreamingConfigRequest, initReq?: fm.InitReq): Promise<RestreamingConfig> {
    return fm.fetchReq<GetRestreamingConfigRequest, RestreamingConfig>(`/v1/channelconfig/restreaming/${req["channelId"]}?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
  static UpdateRestreamingConfig(req: UpdateRestreamingConfigRequest, initReq?: fm.InitReq): Promise<RestreamingConfig> {
    return fm.fetchReq<UpdateRestreamingConfigRequest, RestreamingConfig>(`/v1/channelconfig/restreaming/${req["body"]["channelId"]}`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static GetRestreamingAccount(req: GetRestreamingAccountRequest, initReq?: fm.InitReq): Promise<AuthAuth.Account> {
    return fm.fetchReq<GetRestreamingAccountRequest, AuthAuth.Account>(`/v1/streams/${req["channelId"]}/restreamingAccount?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
}