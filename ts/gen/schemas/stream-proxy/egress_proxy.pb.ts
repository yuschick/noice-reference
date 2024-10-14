/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
export type EnsureEgressProxyRequest = {
  streamId?: string
  streamType?: string
  channelId?: string
  ingestLivekitAddr?: string
}

export type EnsureEgressProxyResponseTrack = {
  id?: string
}

export type EnsureEgressProxyResponse = {
  tracks?: EnsureEgressProxyResponseTrack[]
}

export class EgressProxyService {
  static EnsureEgressProxy(req: EnsureEgressProxyRequest, initReq?: fm.InitReq): Promise<EnsureEgressProxyResponse> {
    return fm.fetchReq<EnsureEgressProxyRequest, EnsureEgressProxyResponse>(`/egress_proxy.EgressProxyService/EnsureEgressProxy`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}