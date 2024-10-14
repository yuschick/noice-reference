/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);
export type FeatureFlagConfigUpdate = {
  config?: FeatureFlagConfig
}

export type UserInfo = {
  userId?: string
  roles?: string[]
  createdAt?: string
}

export type ChannelInfo = {
  channelId?: string
  gameId?: string
  isPublic?: boolean
  priority?: number
}

export type CallerInfo = {
  userId?: string
  channelId?: string
}

export type FeatureFlagGroupValue = {
  value?: string
  weight?: number
}

export type FeatureFlagGroupConditionEq = {
  field?: string
  value?: string
}

export type FeatureFlagGroupConditionAny = {
  field?: string
  values?: string[]
}

export type FeatureFlagGroupConditionLte = {
  field?: string
  value?: string
}

export type FeatureFlagGroupConditionGte = {
  field?: string
  value?: string
}


type BaseFeatureFlagGroupCondition = {
}

export type FeatureFlagGroupCondition = BaseFeatureFlagGroupCondition
  & OneOf<{ eq: FeatureFlagGroupConditionEq; any: FeatureFlagGroupConditionAny; lte: FeatureFlagGroupConditionLte; gte: FeatureFlagGroupConditionGte }>

export type FeatureFlagGroup = {
  id?: string
  enabled?: boolean
  conditions?: FeatureFlagGroupCondition[]
  values?: FeatureFlagGroupValue[]
  default?: boolean
}

export type FeatureFlag = {
  name?: string
  description?: string
  enabled?: boolean
  groups?: FeatureFlagGroup[]
}

export type FeatureFlagState = {
  name?: string
  value?: string
  revision?: string
}

export type FeatureFlagList = {
  flags?: FeatureFlag[]
}

export type FeatureFlagConfig = {
  revision?: string
  createdAt?: string
  userFlags?: FeatureFlagList
  channelFlags?: FeatureFlagList
}

export type GetFeatureFlagConfigRequest = {
  revision?: string
}

export type GetFeatureFlagConfigResponse = {
  config?: FeatureFlagConfig
}

export type SetFeatureFlagConfigRequest = {
  previousRevision?: string
  config?: FeatureFlagConfig
  validateSchema?: boolean
}

export type GetUserFeatureFlagRequest = {
  userId?: string
  flagName?: string
}

export type ListUserFeatureFlagsRequest = {
  userId?: string
}

export type ListUserFeatureFlagsResponse = {
  flags?: FeatureFlagState[]
}

export type GetChannelFeatureFlagRequest = {
  channelId?: string
  flagName?: string
}

export type ListChannelFeatureFlagsRequest = {
  channelId?: string
}

export type ListChannelFeatureFlagsResponse = {
  flags?: FeatureFlagState[]
}

export type JSONSchema = {
  description?: string
  type?: string
  enum?: string[]
  pattern?: string
  minimum?: number
  maximum?: number
  multipleOf?: number
  properties?: {[key: string]: JSONSchema}
  patternProperties?: {[key: string]: JSONSchema}
  items?: JSONSchema
}

export type FeatureFlagSchema = {
  flags?: {[key: string]: JSONSchema}
}

export type GetFeatureFlagSchemaRequest = {
}

export type ChannelFeatureFlagValueUpdateEvent = {
  channelId?: string
  flags?: FeatureFlagState[]
}

export type UserFeatureFlagValueUpdateEvent = {
  userId?: string
  flags?: FeatureFlagState[]
}




export interface IFeatureFlagGroupConditionRuleDelegate<C> {
  onEq(ctx: C, ev: FeatureFlagGroupConditionEq): void
  onAny(ctx: C, ev: FeatureFlagGroupConditionAny): void
  onLte(ctx: C, ev: FeatureFlagGroupConditionLte): void
  onGte(ctx: C, ev: FeatureFlagGroupConditionGte): void
}

export function routeFeatureFlagGroupConditionRuleDelegate<C>(ctx: C, val: FeatureFlagGroupCondition, delegate: IFeatureFlagGroupConditionRuleDelegate<C>) {
  val?.eq && delegate.onEq(ctx, val.eq)
  val?.any && delegate.onAny(ctx, val.any)
  val?.lte && delegate.onLte(ctx, val.lte)
  val?.gte && delegate.onGte(ctx, val.gte)
}

export class FeatureFlagService {
  static GetFeatureFlagConfig(req: GetFeatureFlagConfigRequest, initReq?: fm.InitReq): Promise<FeatureFlagConfig> {
    return fm.fetchReq<GetFeatureFlagConfigRequest, FeatureFlagConfig>(`/v1/flags/config?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static StreamConfigUpdates(req: GetFeatureFlagConfigRequest, entityNotifier?: fm.NotifyStreamEntityArrival<FeatureFlagConfig>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<GetFeatureFlagConfigRequest, FeatureFlagConfig>(`/v1/flags/config:stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<GetFeatureFlagConfigRequest, FeatureFlagConfig>(`/v1/flags/config:stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static SetFeatureFlagConfig(req: SetFeatureFlagConfigRequest, initReq?: fm.InitReq): Promise<FeatureFlagConfig> {
    return fm.fetchReq<SetFeatureFlagConfigRequest, FeatureFlagConfig>(`/v1/flags/config`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetUserFeatureFlag(req: GetUserFeatureFlagRequest, initReq?: fm.InitReq): Promise<FeatureFlagState> {
    return fm.fetchReq<GetUserFeatureFlagRequest, FeatureFlagState>(`/v1/flags/user/${req["userId"]}/${req["flagName"]}?${fm.renderURLSearchParams(req, ["userId", "flagName"])}`, {...initReq, method: "GET"})
  }
  static ListUserFeatureFlags(req: ListUserFeatureFlagsRequest, initReq?: fm.InitReq): Promise<ListUserFeatureFlagsResponse> {
    return fm.fetchReq<ListUserFeatureFlagsRequest, ListUserFeatureFlagsResponse>(`/v1/flags/user/${req["userId"]}?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static GetChannelFeatureFlag(req: GetChannelFeatureFlagRequest, initReq?: fm.InitReq): Promise<FeatureFlagState> {
    return fm.fetchReq<GetChannelFeatureFlagRequest, FeatureFlagState>(`/v1/flags/channel/${req["channelId"]}/${req["flagName"]}?${fm.renderURLSearchParams(req, ["channelId", "flagName"])}`, {...initReq, method: "GET"})
  }
  static ListChannelFeatureFlags(req: ListChannelFeatureFlagsRequest, initReq?: fm.InitReq): Promise<ListChannelFeatureFlagsResponse> {
    return fm.fetchReq<ListChannelFeatureFlagsRequest, ListChannelFeatureFlagsResponse>(`/v1/flags/channel/${req["channelId"]}?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
  static GetFeatureFlagSchema(req: GetFeatureFlagSchemaRequest, initReq?: fm.InitReq): Promise<FeatureFlagSchema> {
    return fm.fetchReq<GetFeatureFlagSchemaRequest, FeatureFlagSchema>(`/v1/flags/schema?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}