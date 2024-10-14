/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum ReactionType {
  REACTION_TYPE_UNSPECIFIED = "REACTION_TYPE_UNSPECIFIED",
  REACTION_TYPE_LIKE = "REACTION_TYPE_LIKE",
}

export type ReactionState = {
  resourceId?: string
  resourceType?: string
  reactions?: {[key: string]: number}
  userHasReacted?: boolean
}

export type ReactionList = {
  parentId?: string
  parentType?: string
  states?: ReactionState[]
}

export type ReactionEventInitial = {
  states?: ReactionState[]
}

export type ReactionEventAdd = {
  resourceId?: string
  resourceType?: string
  reactionType?: ReactionType
  userId?: string
}

export type ReactionEventRemove = {
  resourceId?: string
  resourceType?: string
  reactionType?: ReactionType
  userId?: string
}


type BaseReactionEvent = {
  parentId?: string
  parentType?: string
}

export type ReactionEvent = BaseReactionEvent
  & OneOf<{ initial: ReactionEventInitial; add: ReactionEventAdd; remove: ReactionEventRemove }>

export type StreamReactionsRequest = {
  parentId?: string
  parentType?: string
}

export type AddReactionRequest = {
  parentId?: string
  parentType?: string
  resourceId?: string
  resourceType?: string
  reactionType?: ReactionType
}

export type RemoveReactionRequest = {
  parentId?: string
  parentType?: string
  resourceId?: string
  resourceType?: string
}




export interface IReactionEventEventDelegate<C> {
  onInitial(ctx: C, ev: ReactionEventInitial): void
  onAdd(ctx: C, ev: ReactionEventAdd): void
  onRemove(ctx: C, ev: ReactionEventRemove): void
}

export function routeReactionEventEventDelegate<C>(ctx: C, val: ReactionEvent, delegate: IReactionEventEventDelegate<C>) {
  val?.initial && delegate.onInitial(ctx, val.initial)
  val?.add && delegate.onAdd(ctx, val.add)
  val?.remove && delegate.onRemove(ctx, val.remove)
}

export class ReactionService {
  static StreamReactions(req: StreamReactionsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ReactionEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<StreamReactionsRequest, ReactionEvent>(`/v1/reactions/${req["parentType"]}/${req["parentId"]}:stream?${fm.renderURLSearchParams(req, ["parentType", "parentId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<StreamReactionsRequest, ReactionEvent>(`/v1/reactions/${req["parentType"]}/${req["parentId"]}:stream?${fm.renderURLSearchParams(req, ["parentType", "parentId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static AddReaction(req: AddReactionRequest, initReq?: fm.InitReq): Promise<ReactionState> {
    return fm.fetchReq<AddReactionRequest, ReactionState>(`/v1/reactions/${req["parentType"]}/${req["parentId"]}:add`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static RemoveReaction(req: RemoveReactionRequest, initReq?: fm.InitReq): Promise<ReactionState> {
    return fm.fetchReq<RemoveReactionRequest, ReactionState>(`/v1/reactions/${req["parentType"]}/${req["parentId"]}:remove`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}