/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufDuration from "../google/protobuf/duration.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);
export type EncodingSettingsClip = {
  start?: string
  end?: string
}

export type EncodingSettings = {
  clip?: EncodingSettingsClip
}

export type RecordingEncodingRequest = {
  streamId?: string
  settings?: EncodingSettings
}

export type RecordingEncodingRequestEvent = {
  streamId?: string
  sourceUrl?: string
  encodingId?: string
  settings?: EncodingSettings
}

export type RecordingEncodingEventAccepted = {
}

export type RecordingEncodingEventStarted = {
  settings?: EncodingSettings
}

export type RecordingEncodingEventFailed = {
  error?: string
}

export type RecordingEncodingEventProgress = {
  progress?: number
}

export type RecordingEncodingEventFinished = {
  videoUrl?: string
}


type BaseRecordingEncodingEvent = {
  streamId?: string
  encodingId?: string
}

export type RecordingEncodingEvent = BaseRecordingEncodingEvent
  & OneOf<{ accepted: RecordingEncodingEventAccepted; started: RecordingEncodingEventStarted; failed: RecordingEncodingEventFailed; progress: RecordingEncodingEventProgress; finished: RecordingEncodingEventFinished }>




export interface IRecordingEncodingEventEventDelegate<C> {
  onAccepted(ctx: C, ev: RecordingEncodingEventAccepted): void
  onStarted(ctx: C, ev: RecordingEncodingEventStarted): void
  onFailed(ctx: C, ev: RecordingEncodingEventFailed): void
  onProgress(ctx: C, ev: RecordingEncodingEventProgress): void
  onFinished(ctx: C, ev: RecordingEncodingEventFinished): void
}

export function routeRecordingEncodingEventEventDelegate<C>(ctx: C, val: RecordingEncodingEvent, delegate: IRecordingEncodingEventEventDelegate<C>) {
  val?.accepted && delegate.onAccepted(ctx, val.accepted)
  val?.started && delegate.onStarted(ctx, val.started)
  val?.failed && delegate.onFailed(ctx, val.failed)
  val?.progress && delegate.onProgress(ctx, val.progress)
  val?.finished && delegate.onFinished(ctx, val.finished)
}

export class RecordingProcessor {
  static EncodeRecording(req: RecordingEncodingRequest, entityNotifier?: fm.NotifyStreamEntityArrival<RecordingEncodingEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<RecordingEncodingRequest, RecordingEncodingEvent>(`/v1/streams/${req["streamId"]}/encodeRecording`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<RecordingEncodingRequest, RecordingEncodingEvent>(`/v1/streams/${req["streamId"]}/encodeRecording`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}