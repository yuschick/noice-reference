/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as ReasonReason from "../reason/reason.pb"
import * as RewardReward from "../reward/reward.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);
export type ProgressionUpdateEventUpdateExperiencePointUpdate = {
  oldPoints?: ExperiencePoints
  newPoints?: ExperiencePoints
}

export type ProgressionUpdateEventUpdateLevelUpdate = {
  oldLevel?: Level
  newLevel?: Level
}


type BaseProgressionUpdateEventUpdate = {
}

export type ProgressionUpdateEventUpdate = BaseProgressionUpdateEventUpdate
  & OneOf<{ experiencePoints: ProgressionUpdateEventUpdateExperiencePointUpdate; level: ProgressionUpdateEventUpdateLevelUpdate }>

export type ProgressionUpdateEvent = {
  updates?: ProgressionUpdateEventUpdate[]
  reason?: ReasonReason.Reason
}

export type LevelConfig = {
  number?: string
  threshold?: string
  seasonId?: string
  channelId?: string
  rewards?: RewardReward.RewardType[]
}

export type Fan = {
  userId?: string
}

export type Season = {
  userId?: string
  seasonId?: string
}

export type Channel = {
  userId?: string
  channelId?: string
}


type BaseExperiencePoints = {
  amount?: string
}

export type ExperiencePoints = BaseExperiencePoints
  & OneOf<{ fan: Fan; season: Season; channel: Channel }>


type BaseLevel = {
  number?: string
}

export type Level = BaseLevel
  & OneOf<{ fan: Fan; season: Season; channel: Channel }>

export type GetUserProgressionRequest = {
  userId?: string
}

export type GetUserProgressionResponse = {
  experiencePoints?: ExperiencePoints[]
  levels?: Level[]
}

export type SeasonProgression = {
  seasonId?: string
  xpAmount?: string
  level?: string
  nextLevelThreshold?: string
  nextLevel?: string
}

export type GetSeasonProgressionRequest = {
  userId?: string
  seasonId?: string
}

export type ListSeasonProgressionRequest = {
  userId?: string
}

export type ListSeasonProgressionResponse = {
  progression?: SeasonProgression[]
}

export type BatchGetSeasonProgressionRequestQuery = {
  userId?: string
  seasonId?: string
}

export type BatchGetSeasonProgressionRequest = {
  queries?: BatchGetSeasonProgressionRequestQuery[]
}

export type BatchGetSeasonProgressionResponse = {
  progression?: SeasonProgression[]
}

export type ListLevelConfigsRequest = {
  seasonId?: string
  minLevel?: number
  maxLevel?: number
}

export type ListLevelConfigsResponse = {
  levelConfigs?: LevelConfig[]
}

export type GetDailyXPBoostLimitRequest = {
}

export type GetDailyXPBoostLimitResponse = {
  remainingDailyXpBoost?: string
}

export type GetDailyParticipationLimitRequest = {
}

export type GetDailyParticipationLimitResponse = {
  remainingDailyParticipationMinutes?: string
}

export type GetDailyXPEarningsLimitRequest = {
}

export type GetDailyXPEarningsLimitResponse = {
  remainingDailyXpEarningsMinutes?: string
}

export type ResetUserProgressionRequest = {
  userId?: string
}

export type ResetUserProgressionResponse = {
}

export type AddExperiencePointsRequest = {
  userId?: string
  seasonId?: string
  xpAmount?: string
  reason?: string
}

export type AddExperiencePointsResponse = {
  totalXp?: string
}

export type ResetUserSeasonProgressionRequest = {
  userId?: string
  seasonId?: string
}

export type ResetUserSeasonProgressionResponse = {
}




export interface IProgressionUpdateEventUpdateUpdateDelegate<C> {
  onExperiencePoints(ctx: C, ev: ProgressionUpdateEventUpdateExperiencePointUpdate): void
  onLevel(ctx: C, ev: ProgressionUpdateEventUpdateLevelUpdate): void
}

export function routeProgressionUpdateEventUpdateUpdateDelegate<C>(ctx: C, val: ProgressionUpdateEventUpdate, delegate: IProgressionUpdateEventUpdateUpdateDelegate<C>) {
  val?.experiencePoints && delegate.onExperiencePoints(ctx, val.experiencePoints)
  val?.level && delegate.onLevel(ctx, val.level)
}




export interface IExperiencePointsTargetDelegate<C> {
  onFan(ctx: C, ev: Fan): void
  onSeason(ctx: C, ev: Season): void
  onChannel(ctx: C, ev: Channel): void
}

export function routeExperiencePointsTargetDelegate<C>(ctx: C, val: ExperiencePoints, delegate: IExperiencePointsTargetDelegate<C>) {
  val?.fan && delegate.onFan(ctx, val.fan)
  val?.season && delegate.onSeason(ctx, val.season)
  val?.channel && delegate.onChannel(ctx, val.channel)
}




export interface ILevelTargetDelegate<C> {
  onFan(ctx: C, ev: Fan): void
  onSeason(ctx: C, ev: Season): void
  onChannel(ctx: C, ev: Channel): void
}

export function routeLevelTargetDelegate<C>(ctx: C, val: Level, delegate: ILevelTargetDelegate<C>) {
  val?.fan && delegate.onFan(ctx, val.fan)
  val?.season && delegate.onSeason(ctx, val.season)
  val?.channel && delegate.onChannel(ctx, val.channel)
}

export class ProgressionService {
  static GetUserProgression(req: GetUserProgressionRequest, initReq?: fm.InitReq): Promise<GetUserProgressionResponse> {
    return fm.fetchReq<GetUserProgressionRequest, GetUserProgressionResponse>(`/v1/users/${req["userId"]}/progression?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static GetSeasonProgression(req: GetSeasonProgressionRequest, initReq?: fm.InitReq): Promise<SeasonProgression> {
    return fm.fetchReq<GetSeasonProgressionRequest, SeasonProgression>(`/v1/users/${req["userId"]}/seasonProgression/${req["seasonId"]}?${fm.renderURLSearchParams(req, ["userId", "seasonId"])}`, {...initReq, method: "GET"})
  }
  static ListSeasonProgression(req: ListSeasonProgressionRequest, initReq?: fm.InitReq): Promise<ListSeasonProgressionResponse> {
    return fm.fetchReq<ListSeasonProgressionRequest, ListSeasonProgressionResponse>(`/v1/users/${req["userId"]}/seasonProgression?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static BatchGetSeasonProgression(req: BatchGetSeasonProgressionRequest, initReq?: fm.InitReq): Promise<BatchGetSeasonProgressionResponse> {
    return fm.fetchReq<BatchGetSeasonProgressionRequest, BatchGetSeasonProgressionResponse>(`/v1/seasonProgression:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListLevelConfigs(req: ListLevelConfigsRequest, initReq?: fm.InitReq): Promise<ListLevelConfigsResponse> {
    return fm.fetchReq<ListLevelConfigsRequest, ListLevelConfigsResponse>(`/v1/levelConfigs?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetDailyXPBoostLimit(req: GetDailyXPBoostLimitRequest, initReq?: fm.InitReq): Promise<GetDailyXPBoostLimitResponse> {
    return fm.fetchReq<GetDailyXPBoostLimitRequest, GetDailyXPBoostLimitResponse>(`/v1/progression/limits/dailyXPBoost?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetDailyParticipationLimit(req: GetDailyParticipationLimitRequest, initReq?: fm.InitReq): Promise<GetDailyParticipationLimitResponse> {
    return fm.fetchReq<GetDailyParticipationLimitRequest, GetDailyParticipationLimitResponse>(`/v1/progression/limits/dailyParticipation?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetDailyXPEarningsLimit(req: GetDailyXPEarningsLimitRequest, initReq?: fm.InitReq): Promise<GetDailyXPEarningsLimitResponse> {
    return fm.fetchReq<GetDailyXPEarningsLimitRequest, GetDailyXPEarningsLimitResponse>(`/v1/progression/limits/dailyXPEarnings?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}
export class ProgressionAdminService {
  static ResetUserProgression(req: ResetUserProgressionRequest, initReq?: fm.InitReq): Promise<ResetUserProgressionResponse> {
    return fm.fetchReq<ResetUserProgressionRequest, ResetUserProgressionResponse>(`/v1/users/${req["userId"]}/progression`, {...initReq, method: "DELETE"})
  }
  static AddExperiencePoints(req: AddExperiencePointsRequest, initReq?: fm.InitReq): Promise<AddExperiencePointsResponse> {
    return fm.fetchReq<AddExperiencePointsRequest, AddExperiencePointsResponse>(`/v1/users/${req["userId"]}/progression:addXP`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ResetUserSeasonProgression(req: ResetUserSeasonProgressionRequest, initReq?: fm.InitReq): Promise<ResetUserSeasonProgressionResponse> {
    return fm.fetchReq<ResetUserSeasonProgressionRequest, ResetUserSeasonProgressionResponse>(`/v1/users/${req["userId"]}/progression/${req["seasonId"]}`, {...initReq, method: "DELETE"})
  }
}