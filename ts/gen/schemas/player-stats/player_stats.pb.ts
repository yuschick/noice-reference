/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufDuration from "../google/protobuf/duration.pb"
export type PlayerStatsBoosterUsage = {
  total?: string
  speedUp?: string
  scavenge?: string
  goodCall?: string
  letsGo?: string
  doubt?: string
  nextUp?: string
}

export type PlayerStatsCurrencySpending = {
  softCurrency?: string
  hardCurrency?: string
  channelCurrency?: string
}

export type PlayerStats = {
  matchesPlayed?: string
  timePlayed?: string
  dailyGoalCardsCompleted?: string
  cardsPlayed?: string
  shufflesUsed?: string
  cardBundlesPurchased?: string
  cardsSucceeded?: string
  boosterUsage?: PlayerStatsBoosterUsage
  adsWatched?: string
  currencySpending?: PlayerStatsCurrencySpending
  dailyGoalCardsSet?: string
  cardLevelUps?: string
  soloMatchesPlayed?: string
  partyMatchesPlayed?: string
}

export type GetPlayerStatsRequest = {
  userId?: string
  seasonId?: string
}

export type GetPlayerStatsResponse = {
  stats?: PlayerStats
}

export class PlayerStatsService {
  static GetPlayerStats(req: GetPlayerStatsRequest, initReq?: fm.InitReq): Promise<GetPlayerStatsResponse> {
    return fm.fetchReq<GetPlayerStatsRequest, GetPlayerStatsResponse>(`/v1/users/${req["userId"]}/player_stats?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
}