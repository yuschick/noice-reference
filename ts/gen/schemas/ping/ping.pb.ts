/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
export type PingRequest = {
  message?: string
}

export type PingResponse = {
  message?: string
}

export class PingService {
  static Ping(req: PingRequest, initReq?: fm.InitReq): Promise<PingResponse> {
    return fm.fetchReq<PingRequest, PingResponse>(`/ping.PingService/Ping`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}