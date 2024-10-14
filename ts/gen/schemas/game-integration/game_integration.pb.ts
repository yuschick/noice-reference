/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
export type PublishGameEventRequest = {
  streamKey?: string
  gameId?: string
  eventName?: string
  payload?: string
}

export type PublishGameEventResponse = {
}

export type GameEvent = {
  gameId?: string
  streamId?: string
  eventName?: string
  payload?: string
}

export class GameIntegrationService {
  static PublishGameEvent(req: PublishGameEventRequest, initReq?: fm.InitReq): Promise<PublishGameEventResponse> {
    return fm.fetchReq<PublishGameEventRequest, PublishGameEventResponse>(`/v1/gameintegration/gameevents`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}