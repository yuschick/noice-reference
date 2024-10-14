/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as GoogleProtobufDescriptor from "../descriptor.pb"

export enum CodeGeneratorResponseFeature {
  FEATURE_NONE = "FEATURE_NONE",
  FEATURE_PROTO3_OPTIONAL = "FEATURE_PROTO3_OPTIONAL",
}

export type Version = {
  major?: number
  minor?: number
  patch?: number
  suffix?: string
}

export type CodeGeneratorRequest = {
  fileToGenerate?: string[]
  parameter?: string
  protoFile?: GoogleProtobufDescriptor.FileDescriptorProto[]
  compilerVersion?: Version
}

export type CodeGeneratorResponseFile = {
  name?: string
  insertionPoint?: string
  content?: string
  generatedCodeInfo?: GoogleProtobufDescriptor.GeneratedCodeInfo
}

export type CodeGeneratorResponse = {
  error?: string
  supportedFeatures?: string
  file?: CodeGeneratorResponseFile[]
}