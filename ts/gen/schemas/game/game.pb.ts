/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as RarityRarity from "../rarity/rarity.pb"

export enum GameEventsSource {
  GAME_EVENTS_SOURCE_UNSPECIFIED = "GAME_EVENTS_SOURCE_UNSPECIFIED",
  GAME_EVENTS_SOURCE_ML = "GAME_EVENTS_SOURCE_ML",
  GAME_EVENTS_SOURCE_GAME_INTEGRATION = "GAME_EVENTS_SOURCE_GAME_INTEGRATION",
}

export type UserProgression = {
  experiencePoints?: string
  level?: string
  userId?: string
}

export type Game = {
  id?: string
  name?: string
  iconUrl?: string
  backdropUrl?: string
  activeSeasonId?: string
  publicAccess?: boolean
  noicePredictionsEnabled?: boolean
  gameEventsSource?: GameEventsSource
  challengesEnabled?: boolean
  otherNames?: string[]
  coverImageUrl?: string
}

export type SeasonCardBackgroundAsset = {
  rarity?: RarityRarity.Rarity
  url?: string
}

export type Season = {
  id?: string
  gameId?: string
  name?: string
  startTime?: string
  endTime?: string
  cardBackgroundUrls?: SeasonCardBackgroundAsset[]
  badgeUrl?: string
  progressionPaused?: boolean
  progressionPauseReason?: string
  seasonBreak?: boolean
  seasonBreakReason?: string
  seasonPaused?: boolean
  seasonPauseReason?: string
}

export type GetGameRequest = {
  id?: string
}

export type BatchGetGamesRequest = {
  ids?: string[]
}

export type BatchGetGamesResponse = {
  games?: Game[]
}

export type GetSeasonRequest = {
  id?: string
}

export type BatchGetSeasonsRequest = {
  ids?: string[]
}

export type BatchGetSeasonsResponse = {
  seasons?: Season[]
}

export type ListGamesRequest = {
  gameName?: string
}

export type ListGamesResponse = {
  games?: Game[]
}

export type ListSeasonsRequest = {
  gameId?: string
}

export type ListSeasonsResponse = {
  seasons?: Season[]
}

export class GameService {
  static GetGame(req: GetGameRequest, initReq?: fm.InitReq): Promise<Game> {
    return fm.fetchReq<GetGameRequest, Game>(`/v1/games/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static BatchGetGames(req: BatchGetGamesRequest, initReq?: fm.InitReq): Promise<BatchGetGamesResponse> {
    return fm.fetchReq<BatchGetGamesRequest, BatchGetGamesResponse>(`/v1/games:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListGames(req: ListGamesRequest, initReq?: fm.InitReq): Promise<ListGamesResponse> {
    return fm.fetchReq<ListGamesRequest, ListGamesResponse>(`/v1/games?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetSeason(req: GetSeasonRequest, initReq?: fm.InitReq): Promise<Season> {
    return fm.fetchReq<GetSeasonRequest, Season>(`/v1/seasons/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static BatchGetSeasons(req: BatchGetSeasonsRequest, initReq?: fm.InitReq): Promise<BatchGetSeasonsResponse> {
    return fm.fetchReq<BatchGetSeasonsRequest, BatchGetSeasonsResponse>(`/v1/seasons:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListSeasons(req: ListSeasonsRequest, initReq?: fm.InitReq): Promise<ListSeasonsResponse> {
    return fm.fetchReq<ListSeasonsRequest, ListSeasonsResponse>(`/v1/seasons?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}