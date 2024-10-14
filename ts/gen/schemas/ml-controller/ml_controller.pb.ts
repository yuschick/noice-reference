/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
export type TriggerMatchEndRequest = {
  streamId?: string
}

export type GetHUDScaleRequest = {
  streamId?: string
}

export type GetHUDScaleResponse = {
  isScaleSufficient?: boolean
  estimatedScale?: number
  suggestedMinimumScale?: number
  mlDisabled?: boolean
}

export class MLControllerService {
  static TriggerMatchEnd(req: TriggerMatchEndRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<TriggerMatchEndRequest, GoogleProtobufEmpty.Empty>(`/v1/ml/streams/${req["streamId"]}:triggerMatchEnd`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetHUDScale(req: GetHUDScaleRequest, initReq?: fm.InitReq): Promise<GetHUDScaleResponse> {
    return fm.fetchReq<GetHUDScaleRequest, GetHUDScaleResponse>(`/v1/ml/streams/${req["streamId"]}:getHUDScale?${fm.renderURLSearchParams(req, ["streamId"])}`, {...initReq, method: "GET"})
  }
  static StreamHUDScaleUpdates(req: GetHUDScaleRequest, entityNotifier?: fm.NotifyStreamEntityArrival<GetHUDScaleResponse>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<GetHUDScaleRequest, GetHUDScaleResponse>(`/v1/ml/streams/${req["streamId"]}:streamHUDScale?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<GetHUDScaleRequest, GetHUDScaleResponse>(`/v1/ml/streams/${req["streamId"]}:streamHUDScale?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
}