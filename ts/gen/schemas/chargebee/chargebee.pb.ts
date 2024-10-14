/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleApiHttpbody from "../google/api/httpbody.pb"
import * as GoogleProtobufStruct from "../google/protobuf/struct.pb"
export type Event = {
  id?: string
  occurredAt?: string
  source?: string
  user?: string
  webhookStatus?: string
  webhookFailureReason?: string
  eventType?: string
  apiVersion?: string
  content?: {[key: string]: GoogleProtobufStruct.Value}
}

export class ChargebeeProxyService {
  static CreateEvent(req: Event, initReq?: fm.InitReq): Promise<GoogleApiHttpbody.HttpBody> {
    return fm.fetchReq<Event, GoogleApiHttpbody.HttpBody>(`/v1/chargebee/events`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}