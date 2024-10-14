/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufAny from "../google/protobuf/any.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as ActorCommon from "./common.pb"
export type RequestActorRequest = {
  pid?: ActorCommon.ActorPID
  message?: GoogleProtobufAny.Any
}

export type RequestActorResponse = {
  response?: GoogleProtobufAny.Any
}

export type MessageActorRequest = {
  pid?: ActorCommon.ActorPID
  message?: GoogleProtobufAny.Any
}

export class ActorService {
  static RequestActor(req: RequestActorRequest, initReq?: fm.InitReq): Promise<RequestActorResponse> {
    return fm.fetchReq<RequestActorRequest, RequestActorResponse>(`/actor.ActorService/RequestActor`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static MessageActor(req: MessageActorRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<MessageActorRequest, GoogleProtobufEmpty.Empty>(`/actor.ActorService/MessageActor`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static MessageStream(initReq?: fm.InitReq): Promise<fm.ClientStreamingCall<MessageActorRequest>> {
    return fm.clientStreamingRequest<MessageActorRequest, GoogleProtobufEmpty.Empty>(`/actor.ActorService/MessageStream`, {...initReq})
  }
}