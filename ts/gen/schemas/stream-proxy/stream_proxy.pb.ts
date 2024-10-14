/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"

export enum VideoQuality {
  VIDEO_QUALITY_UNSPECIFIED = "VIDEO_QUALITY_UNSPECIFIED",
  VIDEO_QUALITY_LOW = "VIDEO_QUALITY_LOW",
  VIDEO_QUALITY_MEDIUM = "VIDEO_QUALITY_MEDIUM",
  VIDEO_QUALITY_HIGH = "VIDEO_QUALITY_HIGH",
  VIDEO_QUALITY_OFF = "VIDEO_QUALITY_OFF",
}

export type VideoLayer = {
  quality?: VideoQuality
  width?: number
  height?: number
  bitrate?: number
  ssrc?: number
}

export type Audio = {
  exists?: boolean
}

export type StartProxyRequest = {
  streamId?: string
  serverUrl?: string
  layers?: VideoLayer[]
  audio?: Audio
  identity?: string
  channelId?: string
}

export type StartProxyResponseVideoPort = {
  port?: number
  layer?: VideoQuality
}

export type StartProxyResponse = {
  host?: string
  audioPort?: number
  videoPorts?: StartProxyResponseVideoPort[]
}

export type StopProxyRequest = {
  streamId?: string
  serverUrl?: string
}

export type ProxyExistsRequest = {
  streamId?: string
  serverUrl?: string
}

export type ProxyExistsResponseTrack = {
  id?: string
}

export type ProxyExistsResponse = {
  exists?: boolean
  tracks?: ProxyExistsResponseTrack[]
}

export class ProxyService {
  static StartProxy(req: StartProxyRequest, initReq?: fm.InitReq): Promise<StartProxyResponse> {
    return fm.fetchReq<StartProxyRequest, StartProxyResponse>(`/stream_proxy.ProxyService/StartProxy`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static StopProxy(req: StopProxyRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<StopProxyRequest, GoogleProtobufEmpty.Empty>(`/stream_proxy.ProxyService/StopProxy`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ProxyExists(req: ProxyExistsRequest, initReq?: fm.InitReq): Promise<ProxyExistsResponse> {
    return fm.fetchReq<ProxyExistsRequest, ProxyExistsResponse>(`/stream_proxy.ProxyService/ProxyExists`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static EnsureProxy(req: StartProxyRequest, initReq?: fm.InitReq): Promise<StartProxyResponse> {
    return fm.fetchReq<StartProxyRequest, StartProxyResponse>(`/stream_proxy.ProxyService/EnsureProxy`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}