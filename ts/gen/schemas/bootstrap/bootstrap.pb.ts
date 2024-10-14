/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
export type BootstrapUserRequest = {
  userId?: string
  gameId?: string
  channelId?: string
  seasonId?: string
}

export type BootstrapUserResponse = {
  new?: boolean
}

export class BootstrapService {
  static BootstrapUser(req: BootstrapUserRequest, initReq?: fm.InitReq): Promise<BootstrapUserResponse> {
    return fm.fetchReq<BootstrapUserRequest, BootstrapUserResponse>(`/bootstrap.BootstrapService/BootstrapUser`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}