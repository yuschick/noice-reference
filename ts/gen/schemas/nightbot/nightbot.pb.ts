/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufDuration from "../google/protobuf/duration.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum Badge {
  BADGE_UNSPECIFIED = "BADGE_UNSPECIFIED",
  BADGE_NOICE_STAFF = "BADGE_NOICE_STAFF",
  BADGE_PLATFORM_MODERATOR = "BADGE_PLATFORM_MODERATOR",
  BADGE_STREAMER = "BADGE_STREAMER",
  BADGE_CHANNEL_MODERATOR = "BADGE_CHANNEL_MODERATOR",
  BADGE_SUBSCRIBER = "BADGE_SUBSCRIBER",
  BADGE_FOLLOWER = "BADGE_FOLLOWER",
}

export type UserInfo = {
  userId?: string
  username?: string
  displayName?: string
  avatarUrl?: string
  channelId?: string
  email?: string
}

export type GetUserInfoRequest = {
}

export type EnableNightbotRequest = {
  channelId?: string
}

export type JoinChannelRequest = {
  channelId?: string
}

export type LeaveChannelRequest = {
  channelId?: string
}

export type ChannelInfo = {
  channelId?: string
  name?: string
  title?: string
  enabled?: boolean
  logoUrl?: string
}

export type GetChannelInfoRequest = {
  channelId?: string
}

export type SendMessageRequest = {
  channelId?: string
  content?: string
}

export type DeleteMessageRequest = {
  channelId?: string
  messageId?: string
}

export type ChatUser = {
  userId?: string
  username?: string
  displayName?: string
  avatarUrl?: string
  badges?: Badge[]
  followedAt?: string
}

export type ChatMessage = {
  user?: ChatUser
  channelId?: string
  messageId?: string
  content?: string
  timestamp?: string
  emotes?: string[]
}

export type Ping = {
}


type BaseChatEvent = {
}

export type ChatEvent = BaseChatEvent
  & OneOf<{ message: ChatMessage; ping: Ping }>

export type EventStreamRequest = {
}

export type BanUserRequest = {
  channelId?: string
  userId?: string
  reason?: string
  duration?: string
}


type BaseUserIdentity = {
}

export type UserIdentity = BaseUserIdentity
  & OneOf<{ userId: string; username: string }>

export type GetChatUserRequest = {
  channelId?: string
  identity?: UserIdentity
}

export type UpdateChannelInfoRequest = {
  channelId?: string
  title?: string
}




export interface IChatEventEventDelegate<C> {
  onMessage(ctx: C, ev: ChatMessage): void
  onPing(ctx: C, ev: Ping): void
}

export function routeChatEventEventDelegate<C>(ctx: C, val: ChatEvent, delegate: IChatEventEventDelegate<C>) {
  val?.message && delegate.onMessage(ctx, val.message)
  val?.ping && delegate.onPing(ctx, val.ping)
}




export interface IUserIdentityIdentityDelegate<C> {
  onUserId(ctx: C, ev: string): void
  onUsername(ctx: C, ev: string): void
}

export function routeUserIdentityIdentityDelegate<C>(ctx: C, val: UserIdentity, delegate: IUserIdentityIdentityDelegate<C>) {
  val?.userId && delegate.onUserId(ctx, val.userId)
  val?.username && delegate.onUsername(ctx, val.username)
}

export class NightbotService {
  static GetUserInfo(req: GetUserInfoRequest, initReq?: fm.InitReq): Promise<UserInfo> {
    return fm.fetchReq<GetUserInfoRequest, UserInfo>(`/nightbot.NightbotService/GetUserInfo`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static EnableNightbot(req: EnableNightbotRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<EnableNightbotRequest, GoogleProtobufEmpty.Empty>(`/nightbot.NightbotService/EnableNightbot`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static JoinChannel(req: JoinChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<JoinChannelRequest, GoogleProtobufEmpty.Empty>(`/nightbot.NightbotService/JoinChannel`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static LeaveChannel(req: LeaveChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<LeaveChannelRequest, GoogleProtobufEmpty.Empty>(`/nightbot.NightbotService/LeaveChannel`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetChannelInfo(req: GetChannelInfoRequest, initReq?: fm.InitReq): Promise<ChannelInfo> {
    return fm.fetchReq<GetChannelInfoRequest, ChannelInfo>(`/nightbot.NightbotService/GetChannelInfo`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateChannelInfo(req: UpdateChannelInfoRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<UpdateChannelInfoRequest, GoogleProtobufEmpty.Empty>(`/nightbot.NightbotService/UpdateChannelInfo`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetChatUser(req: GetChatUserRequest, initReq?: fm.InitReq): Promise<ChatUser> {
    return fm.fetchReq<GetChatUserRequest, ChatUser>(`/nightbot.NightbotService/GetChatUser`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static EventStream(req: EventStreamRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChatEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<EventStreamRequest, ChatEvent>(`/nightbot.NightbotService/EventStream`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<EventStreamRequest, ChatEvent>(`/nightbot.NightbotService/EventStream`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SendMessage(req: SendMessageRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<SendMessageRequest, GoogleProtobufEmpty.Empty>(`/nightbot.NightbotService/SendMessage`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteMessage(req: DeleteMessageRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteMessageRequest, GoogleProtobufEmpty.Empty>(`/nightbot.NightbotService/DeleteMessage`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static BanUser(req: BanUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<BanUserRequest, GoogleProtobufEmpty.Empty>(`/nightbot.NightbotService/BanUser`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}