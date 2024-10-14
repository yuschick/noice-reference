/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum StreamingStatus {
  STREAMING_STATUS_UNSPECIFIED = "STREAMING_STATUS_UNSPECIFIED",
  STREAMING_STATUS_USER_SUSPENDED = "STREAMING_STATUS_USER_SUSPENDED",
  STREAMING_STATUS_STREAMING_DISABLED = "STREAMING_STATUS_STREAMING_DISABLED",
}

export type IngestConfigFTLConfig = {
  streamId?: number
  sharedKey?: string
  streamKey?: string
}


type BaseIngestConfig = {
}

export type IngestConfig = BaseIngestConfig
  & OneOf<{ ftl: IngestConfigFTLConfig }>

export type ChannelIngestConfigs = {
  channelId?: string
  configs?: IngestConfig[]
}

export type ChannelIngestConfig = {
  channelId?: string
  config?: IngestConfig
  streamingStatus?: StreamingStatus
}

export type CreateIngestConfigsRequest = {
  channelId?: string
}

export type RefreshIngestConfigsRequest = {
  channelId?: string
}

export type DeleteIngestConfigsRequest = {
  channelId?: string
}

export type ListIngestConfigsRequest = {
  channelId?: string
}


type BaseGetIngestConfigRequest = {
}

export type GetIngestConfigRequest = BaseGetIngestConfigRequest
  & OneOf<{ ftlId: number }>




export interface IIngestConfigIngestDelegate<C> {
  onFtl(ctx: C, ev: IngestConfigFTLConfig): void
}

export function routeIngestConfigIngestDelegate<C>(ctx: C, val: IngestConfig, delegate: IIngestConfigIngestDelegate<C>) {
  val?.ftl && delegate.onFtl(ctx, val.ftl)
}




export interface IGetIngestConfigRequestIdDelegate<C> {
  onFtlId(ctx: C, ev: number): void
}

export function routeGetIngestConfigRequestIdDelegate<C>(ctx: C, val: GetIngestConfigRequest, delegate: IGetIngestConfigRequestIdDelegate<C>) {
  val?.ftlId && delegate.onFtlId(ctx, val.ftlId)
}

export class StreamIngestConfigService {
  static CreateIngestConfigs(req: CreateIngestConfigsRequest, initReq?: fm.InitReq): Promise<ChannelIngestConfigs> {
    return fm.fetchReq<CreateIngestConfigsRequest, ChannelIngestConfigs>(`/stream_ingest_config.StreamIngestConfigService/CreateIngestConfigs`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static RefreshIngestConfigs(req: RefreshIngestConfigsRequest, initReq?: fm.InitReq): Promise<ChannelIngestConfigs> {
    return fm.fetchReq<RefreshIngestConfigsRequest, ChannelIngestConfigs>(`/stream_ingest_config.StreamIngestConfigService/RefreshIngestConfigs`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteIngestConfigs(req: DeleteIngestConfigsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteIngestConfigsRequest, GoogleProtobufEmpty.Empty>(`/stream_ingest_config.StreamIngestConfigService/DeleteIngestConfigs`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetIngestConfig(req: GetIngestConfigRequest, initReq?: fm.InitReq): Promise<ChannelIngestConfig> {
    return fm.fetchReq<GetIngestConfigRequest, ChannelIngestConfig>(`/stream_ingest_config.StreamIngestConfigService/GetIngestConfig`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListIngestConfigs(req: ListIngestConfigsRequest, initReq?: fm.InitReq): Promise<ChannelIngestConfigs> {
    return fm.fetchReq<ListIngestConfigsRequest, ChannelIngestConfigs>(`/stream_ingest_config.StreamIngestConfigService/ListIngestConfigs`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}