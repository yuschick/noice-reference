/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as GoogleProtobufSource_context from "./source_context.pb"
import * as GoogleProtobufType from "./type.pb"
export type Api = {
  name?: string
  methods?: Method[]
  options?: GoogleProtobufType.Option[]
  version?: string
  sourceContext?: GoogleProtobufSource_context.SourceContext
  mixins?: Mixin[]
  syntax?: GoogleProtobufType.Syntax
}

export type Method = {
  name?: string
  requestTypeUrl?: string
  requestStreaming?: boolean
  responseTypeUrl?: string
  responseStreaming?: boolean
  options?: GoogleProtobufType.Option[]
  syntax?: GoogleProtobufType.Syntax
}

export type Mixin = {
  name?: string
  root?: string
}