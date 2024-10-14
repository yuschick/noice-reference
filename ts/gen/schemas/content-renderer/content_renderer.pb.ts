/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as RenderingConfig from "../rendering/config.pb"
import * as RenderingEvents from "../rendering/events.pb"
import * as RenderingTransitions from "../rendering/transitions.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum ContentUpdateKeyValueOpOperation {
  OPERATION_UNSPECIFIED = "OPERATION_UNSPECIFIED",
  OPERATION_SET = "OPERATION_SET",
  OPERATION_UNSET = "OPERATION_UNSET",
  OPERATION_PATCH = "OPERATION_PATCH",
  OPERATION_PRUNE = "OPERATION_PRUNE",
}

export enum CandidateTarget {
  TARGET_UNSPECIFIED = "TARGET_UNSPECIFIED",
  TARGET_SUBSCRIBER = "TARGET_SUBSCRIBER",
  TARGET_PUBLISHER = "TARGET_PUBLISHER",
}

export enum VideoLayerVideoQuality {
  VIDEO_QUALITY_UNSPECIFIED = "VIDEO_QUALITY_UNSPECIFIED",
  VIDEO_QUALITY_LOW = "VIDEO_QUALITY_LOW",
  VIDEO_QUALITY_MEDIUM = "VIDEO_QUALITY_MEDIUM",
  VIDEO_QUALITY_HIGH = "VIDEO_QUALITY_HIGH",
}

export type ContentUpdatePosition = {
  normX?: number
  normY?: number
  normZ?: number
  normWidth?: number
  normHeight?: number
}

export type ContentUpdateAvatarPlacement = {
  userId?: string
  groupTrackId?: string
  crowdPosition?: ContentUpdatePosition
  groupTrackPosition?: ContentUpdatePosition
}

export type ContentUpdateGroupPlacement = {
  groupId?: string
  trackId?: string
}

export type ContentUpdateAvatarRemoval = {
  userId?: string
  trackId?: string
}

export type ContentUpdateGroupRemoval = {
  groupId?: string
  trackId?: string
}

export type ContentUpdateKeyValueOp = {
  groupId?: string
  key?: string
  seqIndex?: string
  operation?: ContentUpdateKeyValueOpOperation
  value?: string
  ageMs?: string
}

export type ContentUpdateSignal = {
  groupId?: string
  payload?: string
}


type BaseContentUpdate = {
  streamId?: string
  instanceId?: string
}

export type ContentUpdate = BaseContentUpdate
  & OneOf<{ groupPlacement: ContentUpdateGroupPlacement; avatarPlacement: ContentUpdateAvatarPlacement; avatarRemoval: ContentUpdateAvatarRemoval; groupRemoval: ContentUpdateGroupRemoval; keyValueOp: ContentUpdateKeyValueOp; signal: ContentUpdateSignal }>

export type HealthCheckResponse = {
  healthy?: boolean
}

export type StartCameraTransitionResponse = {
  success?: boolean
}

export type Offer = {
  sdp?: string
}

export type Answer = {
  sdp?: string
}

export type Candidate = {
  candidate?: string
  target?: CandidateTarget
}

export type VideoLayer = {
  quality?: VideoLayerVideoQuality
  height?: number
  width?: number
  ssrc?: number
}

export type AddTrack = {
  cid?: string
  name?: string
  kind?: string
  videoLayers?: VideoLayer[]
}

export type StartSession = {
  url?: string
  token?: string
  subscribeParticipant?: string
}

export type StopSession = {
}


type BaseWebrtcSignalingResponse = {
  sessionId?: string
}

export type WebrtcSignalingResponse = BaseWebrtcSignalingResponse
  & OneOf<{ start: StartSession; stop: StopSession; offer: Offer; answer: Answer; candidate: Candidate; addTrack: AddTrack }>


type BaseWebrtcSignalingRequest = {
  sessionId?: string
}

export type WebrtcSignalingRequest = BaseWebrtcSignalingRequest
  & OneOf<{ offer: Offer; answer: Answer; candidate: Candidate }>




export interface IContentUpdateUpdateDelegate<C> {
  onGroupPlacement(ctx: C, ev: ContentUpdateGroupPlacement): void
  onAvatarPlacement(ctx: C, ev: ContentUpdateAvatarPlacement): void
  onAvatarRemoval(ctx: C, ev: ContentUpdateAvatarRemoval): void
  onGroupRemoval(ctx: C, ev: ContentUpdateGroupRemoval): void
  onKeyValueOp(ctx: C, ev: ContentUpdateKeyValueOp): void
  onSignal(ctx: C, ev: ContentUpdateSignal): void
}

export function routeContentUpdateUpdateDelegate<C>(ctx: C, val: ContentUpdate, delegate: IContentUpdateUpdateDelegate<C>) {
  val?.groupPlacement && delegate.onGroupPlacement(ctx, val.groupPlacement)
  val?.avatarPlacement && delegate.onAvatarPlacement(ctx, val.avatarPlacement)
  val?.avatarRemoval && delegate.onAvatarRemoval(ctx, val.avatarRemoval)
  val?.groupRemoval && delegate.onGroupRemoval(ctx, val.groupRemoval)
  val?.keyValueOp && delegate.onKeyValueOp(ctx, val.keyValueOp)
  val?.signal && delegate.onSignal(ctx, val.signal)
}




export interface IWebrtcSignalingResponseActionDelegate<C> {
  onStart(ctx: C, ev: StartSession): void
  onStop(ctx: C, ev: StopSession): void
  onOffer(ctx: C, ev: Offer): void
  onAnswer(ctx: C, ev: Answer): void
  onCandidate(ctx: C, ev: Candidate): void
  onAddTrack(ctx: C, ev: AddTrack): void
}

export function routeWebrtcSignalingResponseActionDelegate<C>(ctx: C, val: WebrtcSignalingResponse, delegate: IWebrtcSignalingResponseActionDelegate<C>) {
  val?.start && delegate.onStart(ctx, val.start)
  val?.stop && delegate.onStop(ctx, val.stop)
  val?.offer && delegate.onOffer(ctx, val.offer)
  val?.answer && delegate.onAnswer(ctx, val.answer)
  val?.candidate && delegate.onCandidate(ctx, val.candidate)
  val?.addTrack && delegate.onAddTrack(ctx, val.addTrack)
}




export interface IWebrtcSignalingRequestActionDelegate<C> {
  onOffer(ctx: C, ev: Offer): void
  onAnswer(ctx: C, ev: Answer): void
  onCandidate(ctx: C, ev: Candidate): void
}

export function routeWebrtcSignalingRequestActionDelegate<C>(ctx: C, val: WebrtcSignalingRequest, delegate: IWebrtcSignalingRequestActionDelegate<C>) {
  val?.offer && delegate.onOffer(ctx, val.offer)
  val?.answer && delegate.onAnswer(ctx, val.answer)
  val?.candidate && delegate.onCandidate(ctx, val.candidate)
}

export class ContentRendererService {
  static LoadArena(req: RenderingConfig.ArenaLoadRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingConfig.ArenaLoadRequest, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/LoadArena`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static LoadAnimations(req: RenderingConfig.AnimationLoadRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingConfig.AnimationLoadRequest, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/LoadAnimations`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleJoiningPlayer(req: RenderingEvents.PlayerJoinEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.PlayerJoinEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleJoiningPlayer`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleLeavingPlayer(req: RenderingEvents.PlayerLeaveEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.PlayerLeaveEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleLeavingPlayer`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleMatchStart(req: RenderingEvents.MatchStartEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.MatchStartEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleMatchStart`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleMatchEnd(req: RenderingEvents.MatchEndEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.MatchEndEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleMatchEnd`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleEmote(req: RenderingEvents.EmoteEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.EmoteEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleEmote`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleEmoji(req: RenderingEvents.EmojiEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.EmojiEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleEmoji`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleGroupCheer(req: RenderingEvents.GroupCheerEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.GroupCheerEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleGroupCheer`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleGroupCheerParticipation(req: RenderingEvents.GroupCheerParticipationEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.GroupCheerParticipationEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleGroupCheerParticipation`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleCardSuccess(req: RenderingEvents.CardSuccessEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.CardSuccessEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleCardSuccess`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleCardFailure(req: RenderingEvents.CardFailureEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.CardFailureEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleCardFailure`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleActiveCardSet(req: RenderingEvents.CardSetActiveEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.CardSetActiveEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleActiveCardSet`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleUsedBooster(req: RenderingEvents.BoosterUsedEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.BoosterUsedEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleUsedBooster`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleRequestedBooster(req: RenderingEvents.BoosterRequestedEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.BoosterRequestedEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleRequestedBooster`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleChatMessageSent(req: RenderingEvents.ChatMessageSentEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.ChatMessageSentEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleChatMessageSent`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleHighScoringCard(req: RenderingEvents.HighScoringCardEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.HighScoringCardEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleHighScoringCard`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HandleSetDebug(req: RenderingEvents.SetDebugEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingEvents.SetDebugEvent, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/HandleSetDebug`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static Updates(req: GoogleProtobufEmpty.Empty, entityNotifier?: fm.NotifyStreamEntityArrival<ContentUpdate>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<GoogleProtobufEmpty.Empty, ContentUpdate>(`/content_renderer.ContentRendererService/Updates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<GoogleProtobufEmpty.Empty, ContentUpdate>(`/content_renderer.ContentRendererService/Updates`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static HealthCheck(req: GoogleProtobufEmpty.Empty, initReq?: fm.InitReq): Promise<HealthCheckResponse> {
    return fm.fetchReq<GoogleProtobufEmpty.Empty, HealthCheckResponse>(`/content_renderer.ContentRendererService/HealthCheck`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static StartCameraTransition(req: RenderingTransitions.CameraTransitionRequest, initReq?: fm.InitReq): Promise<StartCameraTransitionResponse> {
    return fm.fetchReq<RenderingTransitions.CameraTransitionRequest, StartCameraTransitionResponse>(`/content_renderer.ContentRendererService/StartCameraTransition`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SetActiveContentMode(req: RenderingTransitions.ContentMode, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingTransitions.ContentMode, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/SetActiveContentMode`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SetActiveTransition(req: RenderingTransitions.Transition, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RenderingTransitions.Transition, GoogleProtobufEmpty.Empty>(`/content_renderer.ContentRendererService/SetActiveTransition`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static WebrtcSignaling(entityNotifier?: fm.NotifyStreamEntityArrival<WebrtcSignalingResponse>, errorCallback?: fm.NotifyStreamErrorArrival, initReq?: fm.InitReq): Promise<fm.StreamEntityPusher<WebrtcSignalingRequest>> {
    return fm.biDirectionalStreamingRequest<WebrtcSignalingRequest, WebrtcSignalingResponse>(`/content_renderer.ContentRendererService/WebrtcSignaling`, entityNotifier, errorCallback, {...initReq})
  }
}