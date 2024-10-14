/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
export type KillStreamRequest = {
  streamId?: string
  channelId?: string
}

export class StreamIngestControllerService {
  static KillStream(req: KillStreamRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<KillStreamRequest, GoogleProtobufEmpty.Empty>(`/ingest_controller.StreamIngestControllerService/KillStream`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}