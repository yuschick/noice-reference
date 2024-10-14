/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

export enum AnnouncementCategory {
  ANNOUNCEMENT_CATEGORY_UNSPECIFIED = "ANNOUNCEMENT_CATEGORY_UNSPECIFIED",
  ANNOUNCEMENT_CATEGORY_SYSTEM = "ANNOUNCEMENT_CATEGORY_SYSTEM",
  ANNOUNCEMENT_CATEGORY_PLATFORM = "ANNOUNCEMENT_CATEGORY_PLATFORM",
  ANNOUNCEMENT_CATEGORY_GAME_FORTNITE = "ANNOUNCEMENT_CATEGORY_GAME_FORTNITE",
  ANNOUNCEMENT_CATEGORY_GAME_DBD = "ANNOUNCEMENT_CATEGORY_GAME_DBD",
  ANNOUNCEMENT_CATEGORY_GAME_DOTA2 = "ANNOUNCEMENT_CATEGORY_GAME_DOTA2",
  ANNOUNCEMENT_CATEGORY_GAME_APEX_LEGENDS = "ANNOUNCEMENT_CATEGORY_GAME_APEX_LEGENDS",
  ANNOUNCEMENT_CATEGORY_GAME_LEAGUE_OF_LEGENDS = "ANNOUNCEMENT_CATEGORY_GAME_LEAGUE_OF_LEGENDS",
}

export enum AnnouncementTarget {
  ANNOUNCEMENT_TARGET_UNSPECIFIED = "ANNOUNCEMENT_TARGET_UNSPECIFIED",
  ANNOUNCEMENT_TARGET_WEB = "ANNOUNCEMENT_TARGET_WEB",
  ANNOUNCEMENT_TARGET_STUDIO = "ANNOUNCEMENT_TARGET_STUDIO",
  ANNOUNCEMENT_TARGET_MOBILE = "ANNOUNCEMENT_TARGET_MOBILE",
}

export enum AnnouncementStatus {
  ANNOUNCEMENT_STATUS_UNSPECIFIED = "ANNOUNCEMENT_STATUS_UNSPECIFIED",
  ANNOUNCEMENT_STATUS_ACTIVE = "ANNOUNCEMENT_STATUS_ACTIVE",
  ANNOUNCEMENT_STATUS_SCHEDULED = "ANNOUNCEMENT_STATUS_SCHEDULED",
  ANNOUNCEMENT_STATUS_DRAFT = "ANNOUNCEMENT_STATUS_DRAFT",
  ANNOUNCEMENT_STATUS_PAST = "ANNOUNCEMENT_STATUS_PAST",
}

export type Targets = {
  web?: boolean
  studio?: boolean
  mobile?: boolean
}

export type Announcement = {
  id?: string
  category?: AnnouncementCategory
  title?: string
  text?: string
  imageUrl?: string
  published?: boolean
  startTime?: string
  endTime?: string
  createdAt?: string
  creatorId?: string
  status?: AnnouncementStatus
  targets?: Targets
}

export type ListUserAnnouncementsRequest = {
  userId?: string
  target?: AnnouncementTarget
  cursor?: ApiCursor.Cursor
}

export type ListUserAnnouncementsResponse = {
  announcements?: Announcement[]
  pageInfo?: ApiCursor.PageInfo
}

export type CreateAnnouncementRequest = {
  category?: AnnouncementCategory
  title?: string
  text?: string
  imageUrl?: string
  published?: boolean
  startTime?: string
  endTime?: string
  targets?: Targets
}

export type UpdateAnnouncementRequest = {
  body?: Announcement
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type DeleteAnnouncementRequest = {
  id?: string
}

export type DeleteAnnouncementImageRequest = {
  announcementId?: string
}

export type AnnouncementFilter = {
  statuses?: AnnouncementStatus[]
  targets?: AnnouncementTarget[]
}

export type ListAnnouncementsRequest = {
  filter?: AnnouncementFilter
  cursor?: ApiCursor.Cursor
}

export type ListAnnouncementsResponse = {
  announcements?: Announcement[]
  pageInfo?: ApiCursor.PageInfo
  totalCount?: string
}

export type CreateAnnouncementImageUploadTokenRequest = {
  announcementId?: string
}

export type CreateAnnouncementImageUploadTokenResponse = {
  token?: string
}

export class AnnouncementService {
  static ListUserAnnouncements(req: ListUserAnnouncementsRequest, initReq?: fm.InitReq): Promise<ListUserAnnouncementsResponse> {
    return fm.fetchReq<ListUserAnnouncementsRequest, ListUserAnnouncementsResponse>(`/v1/users/${req["userId"]}/announcements?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static CreateAnnouncement(req: CreateAnnouncementRequest, initReq?: fm.InitReq): Promise<Announcement> {
    return fm.fetchReq<CreateAnnouncementRequest, Announcement>(`/v1/announcements`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateAnnouncement(req: UpdateAnnouncementRequest, initReq?: fm.InitReq): Promise<Announcement> {
    return fm.fetchReq<UpdateAnnouncementRequest, Announcement>(`/v1/announcements/${req["body"]["id"]}`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static CreateAnnouncementImageUploadToken(req: CreateAnnouncementImageUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateAnnouncementImageUploadTokenResponse> {
    return fm.fetchReq<CreateAnnouncementImageUploadTokenRequest, CreateAnnouncementImageUploadTokenResponse>(`/v1/announcements/${req["announcementId"]}:imageUploadToken`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteAnnouncement(req: DeleteAnnouncementRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteAnnouncementRequest, GoogleProtobufEmpty.Empty>(`/v1/announcements/${req["id"]}`, {...initReq, method: "DELETE"})
  }
  static DeleteAnnouncementImage(req: DeleteAnnouncementImageRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteAnnouncementImageRequest, GoogleProtobufEmpty.Empty>(`/v1/announcements/${req["announcementId"]}/assets/image`, {...initReq, method: "DELETE"})
  }
  static ListAnnouncements(req: ListAnnouncementsRequest, initReq?: fm.InitReq): Promise<ListAnnouncementsResponse> {
    return fm.fetchReq<ListAnnouncementsRequest, ListAnnouncementsResponse>(`/v1/announcements?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}