/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

export enum BadgeType {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  TYPE_NOICE_STAFF = "TYPE_NOICE_STAFF",
  TYPE_STREAMER = "TYPE_STREAMER",
  TYPE_CHANNEL_MODERATOR = "TYPE_CHANNEL_MODERATOR",
  TYPE_CHANNEL_SUBSCRIBER = "TYPE_CHANNEL_SUBSCRIBER",
  TYPE_CLOSED_BETA_CREATOR = "TYPE_CLOSED_BETA_CREATOR",
  TYPE_SUBS_GIFTER = "TYPE_SUBS_GIFTER",
}

export enum BadgeUpdateEventUpdateType {
  UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
  UPDATE_TYPE_ADDED = "UPDATE_TYPE_ADDED",
  UPDATE_TYPE_REMOVED = "UPDATE_TYPE_REMOVED",
  UPDATE_TYPE_LEVEL_UP = "UPDATE_TYPE_LEVEL_UP",
}

export type Badge = {
  type?: BadgeType
  level?: number
  nextLevelAt?: string
}

export type BadgeUpdateEvent = {
  userId?: string
  channelId?: string
  badge?: Badge
  updateType?: BadgeUpdateEventUpdateType
  updatedAt?: string
}

export type GetUserBadgesRequest = {
  userId?: string
  channelId?: string
}

export type GetUserBadgesResponse = {
  badges?: Badge[]
}

export type BatchGetUserBadgesRequest = {
  userIds?: string[]
  channelId?: string
}

export type UserBadges = {
  userId?: string
  badges?: Badge[]
}

export type BatchGetUserBadgesResponse = {
  badges?: UserBadges[]
}

export class BadgeService {
  static GetUserBadges(req: GetUserBadgesRequest, initReq?: fm.InitReq): Promise<GetUserBadgesResponse> {
    return fm.fetchReq<GetUserBadgesRequest, GetUserBadgesResponse>(`/v1/channels/${req["channelId"]}/users/${req["userId"]}/badges?${fm.renderURLSearchParams(req, ["channelId", "userId"])}`, {...initReq, method: "GET"})
  }
  static BatchGetUserBadges(req: BatchGetUserBadgesRequest, initReq?: fm.InitReq): Promise<BatchGetUserBadgesResponse> {
    return fm.fetchReq<BatchGetUserBadgesRequest, BatchGetUserBadgesResponse>(`/v1/channels/${req["channelId"]}:batchGetUsersBadges`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}