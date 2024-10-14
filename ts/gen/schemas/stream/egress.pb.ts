/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as Content_rendererContent_renderer from "../content-renderer/content_renderer.pb"
import * as fm from "../fetch.pb"
import * as GoogleApiHttpbody from "../google/api/httpbody.pb"
import * as GoogleProtobufDuration from "../google/protobuf/duration.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum StreamType {
  STREAM_TYPE_UNSPECIFIED = "STREAM_TYPE_UNSPECIFIED",
  STREAM_TYPE_CR = "STREAM_TYPE_CR",
  STREAM_TYPE_SOURCE = "STREAM_TYPE_SOURCE",
  STREAM_TYPE_TRANSCODER = "STREAM_TYPE_TRANSCODER",
}

export enum StreamPlacement {
  STREAM_PLACEMENT_UNSPECIFIED = "STREAM_PLACEMENT_UNSPECIFIED",
  STREAM_PLACEMENT_GAME_VIEW = "STREAM_PLACEMENT_GAME_VIEW",
  STREAM_PLACEMENT_CHANNEL_VIEW = "STREAM_PLACEMENT_CHANNEL_VIEW",
  STREAM_PLACEMENT_STUDIO = "STREAM_PLACEMENT_STUDIO",
  STREAM_PLACEMENT_HIGHLIGHT = "STREAM_PLACEMENT_HIGHLIGHT",
  STREAM_PLACEMENT_SPECTATOR = "STREAM_PLACEMENT_SPECTATOR",
}

export enum IceTransportPolicy {
  ICE_TRANSPORT_POLICY_UNSPECIFIED = "ICE_TRANSPORT_POLICY_UNSPECIFIED",
  ICE_TRANSPORT_POLICY_ALL = "ICE_TRANSPORT_POLICY_ALL",
  ICE_TRANSPORT_POLICY_RELAY = "ICE_TRANSPORT_POLICY_RELAY",
}

export enum MediaKind {
  MEDIA_KIND_UNSPECIFIED = "MEDIA_KIND_UNSPECIFIED",
  MEDIA_KIND_AUDIO = "MEDIA_KIND_AUDIO",
  MEDIA_KIND_VIDEO = "MEDIA_KIND_VIDEO",
}

export enum WatchActionProgressUpdateState {
  STATE_UNSPECIFIED = "STATE_UNSPECIFIED",
  STATE_PEER_CONNECTION_CREATED = "STATE_PEER_CONNECTION_CREATED",
  STATE_SIGNALING_COMPLETE = "STATE_SIGNALING_COMPLETE",
  STATE_ICE_CONNECTED = "STATE_ICE_CONNECTED",
  STATE_MEDIA_STREAM_CREATED = "STATE_MEDIA_STREAM_CREATED",
  STATE_FIRST_FRAME_RENDERED = "STATE_FIRST_FRAME_RENDERED",
}

export type Stream = {
  id?: string
  channelId?: string
  thumbnailUrl?: string
  createdAt?: string
  viewerCount?: number
}

export type Position = {
  normX?: number
  normY?: number
  normZ?: number
  normWidth?: number
  normHeight?: number
}

export type QualityLayer = {
  width?: number
  height?: number
  framerate?: number
  displayName?: string
}

export type AvatarUpdateAvatarPlacement = {
  userId?: string
  groupTrackId?: string
  crowdPosition?: Position
  groupTrackPosition?: Position
}

export type AvatarUpdateAvatarRemoval = {
  userId?: string
}


type BaseAvatarUpdate = {
}

export type AvatarUpdate = BaseAvatarUpdate
  & OneOf<{ placement: AvatarUpdateAvatarPlacement; removal: AvatarUpdateAvatarRemoval }>

export type ListStreamsRequest = {
}

export type ListStreamsResponse = {
  streams?: Stream[]
}

export type WatchActionWatch = {
  streamId?: string
  streamType?: StreamType
  streamPlacement?: StreamPlacement
}

export type WatchActionSelectGroup = {
  groupId?: string
}

export type WatchActionStart = {
  offerId?: string
  jsepSdpAnwser?: string
}

export type WatchActionOffer = {
  sdp?: string
  resolvedUrl?: string
}

export type WatchActionStop = {
  error?: string
}

export type WatchActionICECandidate = {
  candidate?: string
}

export type WatchActionSelectQualityLayer = {
  trackId?: string
  layer?: QualityLayer
}

export type WatchActionProgressUpdate = {
  state?: WatchActionProgressUpdateState
  duration?: number
}


type BaseWatchAction = {
  cid?: number
  sessionId?: string
}

export type WatchAction = BaseWatchAction
  & OneOf<{ start: WatchActionStart; stop: WatchActionStop; candidate: WatchActionICECandidate; selectQualityLayer: WatchActionSelectQualityLayer; watch: WatchActionWatch; selectGroup: WatchActionSelectGroup; offer: WatchActionOffer; progressUpdate: WatchActionProgressUpdate }>

export type ICEServer = {
  urls?: string[]
  username?: string
  credential?: string
}

export type TrackInfo = {
  id?: string
  mid?: string
  kind?: MediaKind
  qualityLayers?: QualityLayer[]
}

export type StreamInfo = {
  label?: string
  tracks?: TrackInfo[]
}

export type WatchEventAck = {
}

export type WatchEventError = {
  message?: string
  code?: number
}

export type WatchEventInitPeerConnection = {
  iceServers?: ICEServer[]
  transportPolicy?: IceTransportPolicy
  clientSendsOffer?: boolean
  egressType?: string
  rawUrl?: string
  channelId?: string
}

export type WatchEventOffer = {
  id?: string
  jsepSdpOffer?: string
  streams?: StreamInfo[]
}

export type WatchEventAvatarPlacement = {
  userId?: string
  position?: Position
}

export type WatchEventAvatarRemoval = {
  userId?: string
}

export type WatchEventKeyValueOp = {
  op?: Content_rendererContent_renderer.ContentUpdateKeyValueOp
}

export type WatchEventSignal = {
  signal?: string
}

export type WatchEventServerShuttingDown = {
}

export type WatchEventICECandidate = {
  candidate?: string
}

export type WatchEventQualityLayerSelected = {
  trackId?: string
  layer?: QualityLayer
}

export type WatchEventAnswer = {
  sdp?: string
  streams?: StreamInfo[]
}


type BaseWatchEvent = {
  cid?: number
  sessionId?: string
}

export type WatchEvent = BaseWatchEvent
  & OneOf<{ ack: WatchEventAck; error: WatchEventError; offer: WatchEventOffer; avatarPlacement: WatchEventAvatarPlacement; avatarRemoval: WatchEventAvatarRemoval; serverShuttingDown: WatchEventServerShuttingDown; keyValueOp: WatchEventKeyValueOp; signal: WatchEventSignal; iceCandidate: WatchEventICECandidate; qualityLayerSelected: WatchEventQualityLayerSelected; initPeerConnection: WatchEventInitPeerConnection; answer: WatchEventAnswer }>

export type WatchRecordingRequest = {
  channelId?: string
  streamId?: string
  offsetMs?: string
}

export type UserEventWatchStart = {
  channelId?: string
  streamId?: string
  userId?: string
  sessionId?: string
  streamType?: StreamType
  egressType?: string
  streamPlacement?: StreamPlacement
}

export type UserEventWatchStop = {
  channelId?: string
  streamId?: string
  userId?: string
  sessionId?: string
  streamType?: StreamType
  duration?: string
  egressType?: string
  isError?: boolean
  streamPlacement?: StreamPlacement
  error?: string
}

export type UserEventMediaInitialized = {
  channelId?: string
  streamId?: string
  userId?: string
  sessionId?: string
  streamType?: StreamType
  egressType?: string
  streamPlacement?: StreamPlacement
  peerConnectionCreated?: string
  signalingComplete?: string
  iceConnected?: string
  mediaStreamCreated?: string
  firstFrameRendered?: string
  serverTotalDuration?: string
}


type BaseUserEvent = {
}

export type UserEvent = BaseUserEvent
  & OneOf<{ watchStart: UserEventWatchStart; watchStop: UserEventWatchStop; mediaInitialized: UserEventMediaInitialized }>




export interface IAvatarUpdateUpdateDelegate<C> {
  onPlacement(ctx: C, ev: AvatarUpdateAvatarPlacement): void
  onRemoval(ctx: C, ev: AvatarUpdateAvatarRemoval): void
}

export function routeAvatarUpdateUpdateDelegate<C>(ctx: C, val: AvatarUpdate, delegate: IAvatarUpdateUpdateDelegate<C>) {
  val?.placement && delegate.onPlacement(ctx, val.placement)
  val?.removal && delegate.onRemoval(ctx, val.removal)
}




export interface IWatchActionActionDelegate<C> {
  onStart(ctx: C, ev: WatchActionStart): void
  onStop(ctx: C, ev: WatchActionStop): void
  onCandidate(ctx: C, ev: WatchActionICECandidate): void
  onSelectQualityLayer(ctx: C, ev: WatchActionSelectQualityLayer): void
  onWatch(ctx: C, ev: WatchActionWatch): void
  onSelectGroup(ctx: C, ev: WatchActionSelectGroup): void
  onOffer(ctx: C, ev: WatchActionOffer): void
  onProgressUpdate(ctx: C, ev: WatchActionProgressUpdate): void
}

export function routeWatchActionActionDelegate<C>(ctx: C, val: WatchAction, delegate: IWatchActionActionDelegate<C>) {
  val?.start && delegate.onStart(ctx, val.start)
  val?.stop && delegate.onStop(ctx, val.stop)
  val?.candidate && delegate.onCandidate(ctx, val.candidate)
  val?.selectQualityLayer && delegate.onSelectQualityLayer(ctx, val.selectQualityLayer)
  val?.watch && delegate.onWatch(ctx, val.watch)
  val?.selectGroup && delegate.onSelectGroup(ctx, val.selectGroup)
  val?.offer && delegate.onOffer(ctx, val.offer)
  val?.progressUpdate && delegate.onProgressUpdate(ctx, val.progressUpdate)
}




export interface IWatchEventEventDelegate<C> {
  onAck(ctx: C, ev: WatchEventAck): void
  onError(ctx: C, ev: WatchEventError): void
  onOffer(ctx: C, ev: WatchEventOffer): void
  onAvatarPlacement(ctx: C, ev: WatchEventAvatarPlacement): void
  onAvatarRemoval(ctx: C, ev: WatchEventAvatarRemoval): void
  onServerShuttingDown(ctx: C, ev: WatchEventServerShuttingDown): void
  onKeyValueOp(ctx: C, ev: WatchEventKeyValueOp): void
  onSignal(ctx: C, ev: WatchEventSignal): void
  onIceCandidate(ctx: C, ev: WatchEventICECandidate): void
  onQualityLayerSelected(ctx: C, ev: WatchEventQualityLayerSelected): void
  onInitPeerConnection(ctx: C, ev: WatchEventInitPeerConnection): void
  onAnswer(ctx: C, ev: WatchEventAnswer): void
}

export function routeWatchEventEventDelegate<C>(ctx: C, val: WatchEvent, delegate: IWatchEventEventDelegate<C>) {
  val?.ack && delegate.onAck(ctx, val.ack)
  val?.error && delegate.onError(ctx, val.error)
  val?.offer && delegate.onOffer(ctx, val.offer)
  val?.avatarPlacement && delegate.onAvatarPlacement(ctx, val.avatarPlacement)
  val?.avatarRemoval && delegate.onAvatarRemoval(ctx, val.avatarRemoval)
  val?.serverShuttingDown && delegate.onServerShuttingDown(ctx, val.serverShuttingDown)
  val?.keyValueOp && delegate.onKeyValueOp(ctx, val.keyValueOp)
  val?.signal && delegate.onSignal(ctx, val.signal)
  val?.iceCandidate && delegate.onIceCandidate(ctx, val.iceCandidate)
  val?.qualityLayerSelected && delegate.onQualityLayerSelected(ctx, val.qualityLayerSelected)
  val?.initPeerConnection && delegate.onInitPeerConnection(ctx, val.initPeerConnection)
  val?.answer && delegate.onAnswer(ctx, val.answer)
}




export interface IUserEventEventDelegate<C> {
  onWatchStart(ctx: C, ev: UserEventWatchStart): void
  onWatchStop(ctx: C, ev: UserEventWatchStop): void
  onMediaInitialized(ctx: C, ev: UserEventMediaInitialized): void
}

export function routeUserEventEventDelegate<C>(ctx: C, val: UserEvent, delegate: IUserEventEventDelegate<C>) {
  val?.watchStart && delegate.onWatchStart(ctx, val.watchStart)
  val?.watchStop && delegate.onWatchStop(ctx, val.watchStop)
  val?.mediaInitialized && delegate.onMediaInitialized(ctx, val.mediaInitialized)
}

export class StreamEgressService {
  static Watch(entityNotifier?: fm.NotifyStreamEntityArrival<WatchEvent>, errorCallback?: fm.NotifyStreamErrorArrival, initReq?: fm.InitReq): Promise<fm.StreamEntityPusher<WatchAction>> {
    return fm.biDirectionalStreamingRequest<WatchAction, WatchEvent>(`/stream_egress.StreamEgressService/Watch`, entityNotifier, errorCallback, {...initReq})
  }
  static WatchRecording(req: WatchRecordingRequest, entityNotifier?: fm.NotifyStreamEntityArrival<GoogleApiHttpbody.HttpBody>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<WatchRecordingRequest, GoogleApiHttpbody.HttpBody>(`/v1/channels/${req["channelId"]}/streams/${req["streamId"]}/hls?${fm.renderURLSearchParams(req, ["channelId", "streamId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<WatchRecordingRequest, GoogleApiHttpbody.HttpBody>(`/v1/channels/${req["channelId"]}/streams/${req["streamId"]}/hls?${fm.renderURLSearchParams(req, ["channelId", "streamId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
}