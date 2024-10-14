/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

export enum LiveStatus {
  LIVE_STATUS_UNSPECIFIED = "LIVE_STATUS_UNSPECIFIED",
  LIVE_STATUS_OFFLINE = "LIVE_STATUS_OFFLINE",
  LIVE_STATUS_UNLISTED = "LIVE_STATUS_UNLISTED",
  LIVE_STATUS_LIVE = "LIVE_STATUS_LIVE",
}

export type StreamSegment = {
  segmentId?: string
  startTime?: string
  endTime?: string
  title?: string
  gameId?: string
  crConfig?: ContentRendererConfig
  mlConfig?: MachineLearningConfig
}

export type Stream = {
  channelId?: string
  streamId?: string
  segments?: StreamSegment[]
  noicePredictionsEnabled?: boolean
  matureRatedContent?: boolean
  challengesEnabled?: boolean
  serverRenderingEnabled?: boolean
  transcodingEnabled?: boolean
}

export type StreamSummary = {
  channelId?: string
  streamId?: string
  noicePredictionsEnabled?: boolean
  matureRatedContent?: boolean
  startTime?: string
  endTime?: string
  challengesEnabled?: boolean
  serverRenderingEnabled?: boolean
  transcodingEnabled?: boolean
  gameId?: string
}

export type ContentRendererConfig = {
  arenaId?: string
  containerImage?: string
  controllerContainerImage?: string
}

export type MachineLearningConfig = {
  containerImage?: string
  disabled?: boolean
}

export type StreamRecorderConfig = {
  containerImage?: string
}

export type StreamTranscoderConfig = {
  containerImage?: string
}