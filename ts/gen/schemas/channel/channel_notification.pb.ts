/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleApiHttpbody from "../google/api/httpbody.pb"
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb"
export type LiveNotificationWorkflowEvent = {
  channelId?: string
}

export type NotificationStatus = {
  emailEnabled?: boolean
  pushEnabled?: boolean
}

export type NotificationSettings = {
  userId?: string
  channelLiveNotification?: NotificationStatus
}

export type GetNotificationSettingsRequest = {
  userId?: string
}

export type UpdateNotificationSettingsParams = {
  userId?: string
  channelLiveNotification?: NotificationStatus
}

export type UpdateNotificationSettingsRequest = {
  body?: UpdateNotificationSettingsParams
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type UnsubscribeFromChannelNotificationsRequest = {
  token?: string
}

export type FollowerNotificationSettings = {
  channelId?: string
  userId?: string
  channelLiveNotificationEnabled?: boolean
}

export type GetFollowerNotificationSettingsRequest = {
  channelId?: string
  userId?: string
}

export type UpdateFollowerNotificationSettingsParams = {
  channelId?: string
  userId?: string
  channelLiveNotificationEnabled?: boolean
}

export type UpdateFollowerNotificationSettingsRequest = {
  body?: UpdateFollowerNotificationSettingsParams
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export class ChannelNotificationService {
  static GetNotificationSettings(req: GetNotificationSettingsRequest, initReq?: fm.InitReq): Promise<NotificationSettings> {
    return fm.fetchReq<GetNotificationSettingsRequest, NotificationSettings>(`/v1/users/${req["userId"]}/channelNotificationSettings?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static UpdateNotificationSettings(req: UpdateNotificationSettingsRequest, initReq?: fm.InitReq): Promise<NotificationSettings> {
    return fm.fetchReq<UpdateNotificationSettingsRequest, NotificationSettings>(`/v1/users/${req["body"]["userId"]}/channelNotificationSettings`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static UnsubscribeFromChannelNotifications(req: UnsubscribeFromChannelNotificationsRequest, initReq?: fm.InitReq): Promise<GoogleApiHttpbody.HttpBody> {
    return fm.fetchReq<UnsubscribeFromChannelNotificationsRequest, GoogleApiHttpbody.HttpBody>(`/v1/channelNotifications/unsubscribe/${req["token"]}`, {...initReq, method: "POST"})
  }
  static GetFollowerNotificationSettings(req: GetFollowerNotificationSettingsRequest, initReq?: fm.InitReq): Promise<FollowerNotificationSettings> {
    return fm.fetchReq<GetFollowerNotificationSettingsRequest, FollowerNotificationSettings>(`/v1/channels/${req["channelId"]}/followers/${req["userId"]}/notificationSettings?${fm.renderURLSearchParams(req, ["channelId", "userId"])}`, {...initReq, method: "GET"})
  }
  static UpdateFollowerNotificationSettings(req: UpdateFollowerNotificationSettingsRequest, initReq?: fm.InitReq): Promise<FollowerNotificationSettings> {
    return fm.fetchReq<UpdateFollowerNotificationSettingsRequest, FollowerNotificationSettings>(`/v1/channels/${req["body"]["channelId"]}/followers/${req["body"]["userId"]}/notificationSettings`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
}