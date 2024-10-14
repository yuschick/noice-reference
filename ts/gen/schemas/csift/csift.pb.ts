/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ChatChat from "../chat/chat.pb"
import * as fm from "../fetch.pb"
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

export enum ModerationEventModerationDecision {
  MODERATION_DECISION_UNSPECIFIED = "MODERATION_DECISION_UNSPECIFIED",
  MODERATION_DECISION_APPROVED = "MODERATION_DECISION_APPROVED",
  MODERATION_DECISION_REJECTED = "MODERATION_DECISION_REJECTED",
}


type BaseModerationEvent = {
  targetId?: string
  moderator?: Moderator
  moderationDecision?: ModerationEventModerationDecision
  timestamp?: string
}

export type ModerationEvent = BaseModerationEvent
  & OneOf<{ chatMessage: ChatChat.ChatMessage }>

export type SearchPlayerRequest = {
  query?: string
}

export type SearchPlayerResponse = {
  username?: string
  firstName?: string
  lastName?: string
  userTag?: string
  email?: string
  lastLogin?: string
  registrationDate?: string
  suspendedDate?: string
  currentAccountStatus?: string
}

export type Moderator = {
  name?: string
  email?: string
}

export type BanPlayerRequest = {
  playerId?: string
  privacyLevel?: number
  moderator?: Moderator
  length?: number
}

export type UnbanPlayerRequest = {
  playerId?: string
  privacyLevel?: number
  moderator?: Moderator
}

export type ApproveContentRequest = {
  contentId?: string
  moderator?: Moderator
}

export type RejectionPayload = {
  userId?: string
  username?: string
  text?: string
}

export type RejectContentRequest = {
  contentId?: string
  moderator?: Moderator
  fields?: RejectionPayload
}




export interface IModerationEventTargetDelegate<C> {
  onChatMessage(ctx: C, ev: ChatChat.ChatMessage): void
}

export function routeModerationEventTargetDelegate<C>(ctx: C, val: ModerationEvent, delegate: IModerationEventTargetDelegate<C>) {
  val?.chatMessage && delegate.onChatMessage(ctx, val.chatMessage)
}

export class CSiftProxyService {
  static SearchPlayer(req: SearchPlayerRequest, initReq?: fm.InitReq): Promise<SearchPlayerResponse> {
    return fm.fetchReq<SearchPlayerRequest, SearchPlayerResponse>(`/v1/csiftProxy/players:search`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static BanPlayer(req: BanPlayerRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<BanPlayerRequest, GoogleProtobufEmpty.Empty>(`/v1/csiftProxy/players:ban`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UnbanPlayer(req: UnbanPlayerRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<UnbanPlayerRequest, GoogleProtobufEmpty.Empty>(`/v1/csiftProxy/players:unban`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ApproveContent(req: ApproveContentRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<ApproveContentRequest, GoogleProtobufEmpty.Empty>(`/v1/csiftProxy/content/${req["contentId"]}:approve`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static RejectContent(req: RejectContentRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RejectContentRequest, GoogleProtobufEmpty.Empty>(`/v1/csiftProxy/content/${req["contentId"]}:reject`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}