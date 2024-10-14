/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as RewardReward from "../reward/reward.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum AchievementConfigCounterRuleDefaultType {
  DEFAULT_TYPE_UNSPECIFIED = "DEFAULT_TYPE_UNSPECIFIED",
  DEFAULT_TYPE_ZERO = "DEFAULT_TYPE_ZERO",
  DEFAULT_TYPE_CURRENT_VALUE = "DEFAULT_TYPE_CURRENT_VALUE",
}

export type FilterGame = {
  gameId?: string
}

export type FilterChannel = {
  channelId?: string
}


type BaseFilter = {
}

export type Filter = BaseFilter
  & OneOf<{ game: FilterGame; channel: FilterChannel }>

export type AchievementConfigCounterRule = {
  counterConfigId?: string
  threshold?: number
  default?: AchievementConfigCounterRuleDefaultType
}

export type AchievementConfig = {
  id?: string
  displayName?: string
  enabled?: boolean
  counterRule?: AchievementConfigCounterRule
  filter?: Filter
  startTime?: string
  endTime?: string
  reward?: RewardReward.RewardType
}

export type AchievementProgress = {
  value?: number
  percentage?: number
  started?: boolean
  unlocked?: boolean
  unlockTime?: string
}

export type Achievement = {
  id?: string
  achievementConfig?: AchievementConfig
  progress?: AchievementProgress
}

export type ListUserAchievementsRequest = {
  userId?: string
}

export type ListUserAchievementsResponse = {
  achievements?: Achievement[]
}




export interface IFilterFilterDelegate<C> {
  onGame(ctx: C, ev: FilterGame): void
  onChannel(ctx: C, ev: FilterChannel): void
}

export function routeFilterFilterDelegate<C>(ctx: C, val: Filter, delegate: IFilterFilterDelegate<C>) {
  val?.game && delegate.onGame(ctx, val.game)
  val?.channel && delegate.onChannel(ctx, val.channel)
}

export class AchievementService {
  static ListUserAchievements(req: ListUserAchievementsRequest, initReq?: fm.InitReq): Promise<ListUserAchievementsResponse> {
    return fm.fetchReq<ListUserAchievementsRequest, ListUserAchievementsResponse>(`/achievement.AchievementService/ListUserAchievements`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}