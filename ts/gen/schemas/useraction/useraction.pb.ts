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
export type UserActionTriggerEmoji = {
  emojiId?: string
}

export type UserActionTriggerEmote = {
  emoteId?: string
}


type BaseUserAction = {
}

export type UserAction = BaseUserAction
  & OneOf<{ triggerEmoji: UserActionTriggerEmoji; triggerEmote: UserActionTriggerEmote }>

export type UserActionEvent = {
  streamId?: string
  userId?: string
  action?: UserAction
}

export type TriggerEmojiRequest = {
  streamId?: string
  emojiId?: string
}

export type TriggerEmoteRequest = {
  streamId?: string
  emoteId?: string
}




export interface IUserActionActionDelegate<C> {
  onTriggerEmoji(ctx: C, ev: UserActionTriggerEmoji): void
  onTriggerEmote(ctx: C, ev: UserActionTriggerEmote): void
}

export function routeUserActionActionDelegate<C>(ctx: C, val: UserAction, delegate: IUserActionActionDelegate<C>) {
  val?.triggerEmoji && delegate.onTriggerEmoji(ctx, val.triggerEmoji)
  val?.triggerEmote && delegate.onTriggerEmote(ctx, val.triggerEmote)
}

export class UserActionService {
  static TriggerEmoji(req: TriggerEmojiRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<TriggerEmojiRequest, GoogleProtobufEmpty.Empty>(`/v1/streams/${req["streamId"]}/useractions/emoji:trigger`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static TriggerEmote(req: TriggerEmoteRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<TriggerEmoteRequest, GoogleProtobufEmpty.Empty>(`/v1/streams/${req["streamId"]}/useractions/emote:trigger`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}