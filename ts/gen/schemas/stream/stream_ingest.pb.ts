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
export type RegisterStreamIngestv2Request = {
  channelId?: string
}

export type RegisterStreamIngestv2Response = {
  streamId?: string
  url?: string
  externalUrl?: string
  hostname?: string
  internalIp?: string
  externalIp?: string
  cluster?: string
  port?: number
  proxyPort?: number
}

export type RefreshStreamIngestRequest = {
  channelId?: string
  streamId?: string
}

export type DeregisterStreamIngestv2Request = {
  channelId?: string
  streamId?: string
}

export type LivekitIngest = {
  url?: string
}


type BaseStreamIngest = {
  channelId?: string
  streamId?: string
}

export type StreamIngest = BaseStreamIngest
  & OneOf<{ livekit: LivekitIngest }>

export type RegisterStreamIngestRequest = {
  body?: StreamIngest
}

export type RegisterStreamIngestResponse = {
}

export type DeregisterStreamIngestRequest = {
  body?: StreamIngest
}

export type DeregisterStreamIngestResponse = {
}




export interface IStreamIngestEndpointDelegate<C> {
  onLivekit(ctx: C, ev: LivekitIngest): void
}

export function routeStreamIngestEndpointDelegate<C>(ctx: C, val: StreamIngest, delegate: IStreamIngestEndpointDelegate<C>) {
  val?.livekit && delegate.onLivekit(ctx, val.livekit)
}

export class StreamIngestService {
  static RegisterStreamIngest(req: RegisterStreamIngestRequest, initReq?: fm.InitReq): Promise<RegisterStreamIngestResponse> {
    return fm.fetchReq<RegisterStreamIngestRequest, RegisterStreamIngestResponse>(`/stream_ingest.StreamIngestService/RegisterStreamIngest`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeregisterStreamIngest(req: DeregisterStreamIngestRequest, initReq?: fm.InitReq): Promise<DeregisterStreamIngestResponse> {
    return fm.fetchReq<DeregisterStreamIngestRequest, DeregisterStreamIngestResponse>(`/stream_ingest.StreamIngestService/DeregisterStreamIngest`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static RegisterStreamIngestv2(req: RegisterStreamIngestv2Request, initReq?: fm.InitReq): Promise<RegisterStreamIngestv2Response> {
    return fm.fetchReq<RegisterStreamIngestv2Request, RegisterStreamIngestv2Response>(`/stream_ingest.StreamIngestService/RegisterStreamIngestv2`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static RefreshStreamIngest(req: RefreshStreamIngestRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RefreshStreamIngestRequest, GoogleProtobufEmpty.Empty>(`/stream_ingest.StreamIngestService/RefreshStreamIngest`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeregisterStreamIngestv2(req: DeregisterStreamIngestv2Request, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeregisterStreamIngestv2Request, GoogleProtobufEmpty.Empty>(`/stream_ingest.StreamIngestService/DeregisterStreamIngestv2`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}