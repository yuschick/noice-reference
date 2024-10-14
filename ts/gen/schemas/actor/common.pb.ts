/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as GoogleProtobufAny from "../google/protobuf/any.pb"
export type Init = {
  actorId?: string
  actorType?: string
}

export type Terminate = {
  actorId?: string
  actorType?: string
}

export type Invoke = {
  method?: string
  payload?: GoogleProtobufAny.Any
}

export type Error = {
  message?: string
  code?: number
}

export type Response = {
  error?: Error
  payload?: GoogleProtobufAny.Any
}

export type ActorPID = {
  actorId?: string
  actorType?: string
}