/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);
export type Settings = {
  avatarPartsDir?: string
  animationDir?: string
  assetDir?: string
}

export type SetSettingsRequest = {
  settings?: Settings
}

export type GetSettingsRequest = {
}

export type EventAvatarPartFileUpdated = {
  path?: string
}

export type EventAnimationFileUpdated = {
  path?: string
}

export type EventAssetFileUpdated = {
  path?: string
}


type BaseEvent = {
}

export type Event = BaseEvent
  & OneOf<{ avatarPartFileUpdated: EventAvatarPartFileUpdated; animationFileUpdated: EventAnimationFileUpdated; assetFileUpdated: EventAssetFileUpdated }>

export type SendEventRequest = {
  event?: Event
}

export type ListAssetsResponse = {
  assets?: string[]
}




export interface IEventEventDelegate<C> {
  onAvatarPartFileUpdated(ctx: C, ev: EventAvatarPartFileUpdated): void
  onAnimationFileUpdated(ctx: C, ev: EventAnimationFileUpdated): void
  onAssetFileUpdated(ctx: C, ev: EventAssetFileUpdated): void
}

export function routeEventEventDelegate<C>(ctx: C, val: Event, delegate: IEventEventDelegate<C>) {
  val?.avatarPartFileUpdated && delegate.onAvatarPartFileUpdated(ctx, val.avatarPartFileUpdated)
  val?.animationFileUpdated && delegate.onAnimationFileUpdated(ctx, val.animationFileUpdated)
  val?.assetFileUpdated && delegate.onAssetFileUpdated(ctx, val.assetFileUpdated)
}

export class ArtistToolingService {
  static SetSettings(req: SetSettingsRequest, initReq?: fm.InitReq): Promise<Settings> {
    return fm.fetchReq<SetSettingsRequest, Settings>(`/artist_tooling.ArtistToolingService/SetSettings`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetSettings(req: GetSettingsRequest, initReq?: fm.InitReq): Promise<Settings> {
    return fm.fetchReq<GetSettingsRequest, Settings>(`/artist_tooling.ArtistToolingService/GetSettings`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static Events(req: GoogleProtobufEmpty.Empty, entityNotifier?: fm.NotifyStreamEntityArrival<Event>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<GoogleProtobufEmpty.Empty, Event>(`/artist_tooling.ArtistToolingService/Events`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<GoogleProtobufEmpty.Empty, Event>(`/artist_tooling.ArtistToolingService/Events`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SendEvent(req: SendEventRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<SendEventRequest, GoogleProtobufEmpty.Empty>(`/artist_tooling.ArtistToolingService/SendEvent`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListAssets(req: GoogleProtobufEmpty.Empty, initReq?: fm.InitReq): Promise<ListAssetsResponse> {
    return fm.fetchReq<GoogleProtobufEmpty.Empty, ListAssetsResponse>(`/artist_tooling.ArtistToolingService/ListAssets`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}