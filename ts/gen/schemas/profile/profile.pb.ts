/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as ApiEntity from "../api/entity.pb"
import * as AvatarAvatar from "../avatar/avatar.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as ModerationPlatform_moderation from "../moderation/platform_moderation.pb"

export enum ProfileVisibility {
  PROFILE_VISIBILITY_UNSPECIFIED = "PROFILE_VISIBILITY_UNSPECIFIED",
  PROFILE_VISIBILITY_PUBLIC = "PROFILE_VISIBILITY_PUBLIC",
  PROFILE_VISIBILITY_PRIVATE = "PROFILE_VISIBILITY_PRIVATE",
}

export enum Color {
  COLOR_UNSPECIFIED = "COLOR_UNSPECIFIED",
  COLOR_F69856 = "COLOR_F69856",
  COLOR_F6CE56 = "COLOR_F6CE56",
  COLOR_F6F656 = "COLOR_F6F656",
  COLOR_63F655 = "COLOR_63F655",
  COLOR_56F6C0 = "COLOR_56F6C0",
  COLOR_6EC9F7 = "COLOR_6EC9F7",
  COLOR_8686F9 = "COLOR_8686F9",
  COLOR_B26AFB = "COLOR_B26AFB",
  COLOR_F76EF7 = "COLOR_F76EF7",
  COLOR_C0F656 = "COLOR_C0F656",
}

export enum PresenceStatus {
  PRESENCE_STATUS_UNSPECIFIED = "PRESENCE_STATUS_UNSPECIFIED",
  PRESENCE_STATUS_OFFLINE = "PRESENCE_STATUS_OFFLINE",
  PRESENCE_STATUS_ONLINE = "PRESENCE_STATUS_ONLINE",
}

export enum UsernameStatus {
  USERNAME_STATUS_UNSPECIFIED = "USERNAME_STATUS_UNSPECIFIED",
  USERNAME_STATUS_OK = "USERNAME_STATUS_OK",
  USERNAME_STATUS_GUIDELINES_VIOLATION = "USERNAME_STATUS_GUIDELINES_VIOLATION",
  USERNAME_STATUS_DUPLICATE = "USERNAME_STATUS_DUPLICATE",
  USERNAME_STATUS_RESERVED = "USERNAME_STATUS_RESERVED",
}

export enum ErrorDetailsCause {
  CAUSE_UNSPECIFIED = "CAUSE_UNSPECIFIED",
  CAUSE_UNACCEPTABLE_USERNAME = "CAUSE_UNACCEPTABLE_USERNAME",
  CAUSE_DUPLICATE_USERNAME = "CAUSE_DUPLICATE_USERNAME",
  CAUSE_RESERVED_USERNAME = "CAUSE_RESERVED_USERNAME",
}

export enum PrivacySettingsVisibility {
  VISIBILITY_UNSPECIFIED = "VISIBILITY_UNSPECIFIED",
  VISIBILITY_ALL = "VISIBILITY_ALL",
  VISIBILITY_FRIENDS = "VISIBILITY_FRIENDS",
  VISIBILITY_ONLY_ME = "VISIBILITY_ONLY_ME",
}

export type ErrorDetails = {
  cause?: ErrorDetailsCause
}

export type ProfileUpdateEvent = {
  profile?: Profile
  updatedAt?: string
}

export type ProfileAvatars = {
  avatar2D?: string
  avatar3D?: string
  avatarFullbody?: string
  avatarGender?: string
}

export type ProfileAvatarConfig = {
  modelId?: string
}

export type Profile = {
  userId?: string
  displayName?: string
  avatarUrl?: string
  userTag?: string
  avatars?: ProfileAvatars
  lastSeen?: string
  bio?: string
  settings?: ProfileSettings
  state?: ApiEntity.EntityState
  onlineStatus?: PresenceStatus
  avatarConfig?: ProfileAvatarConfig
  visibility?: ProfileVisibility
  discordUsername?: string
  temporary?: boolean
  isNewUsername?: boolean
  canChangeUsernameAt?: string
  preferredColor?: Color
}

export type PrivacySettings = {
  hideOnlineStatus?: boolean
  visibility?: PrivacySettingsVisibility
  discordUsernameVisibility?: PrivacySettingsVisibility
  anonymisePurchaseHighlights?: boolean
  showMatureContentWarning?: boolean
}

export type PrivacySettingsUpdateEvent = {
  userId?: string
  settings?: PrivacySettings
  updatedAt?: string
}

export type ProfileSettings = {
  privacy?: PrivacySettings
}

export type GetProfileRequest = {
  userId?: string
}

export type BatchGetProfilesRequest = {
  userIds?: string[]
}

export type BatchGetProfilesResponse = {
  profiles?: Profile[]
}

export type ProfileUpdate = {
  userId?: string
  displayName?: string
  userTag?: string
  bio?: string
  discordUsername?: string
  preferredColor?: Color
}

export type UpdateProfileRequestOptions = {
  omitNameValidation?: boolean
  omitRankValidation?: boolean
}

export type UpdateProfileRequest = {
  body?: ProfileUpdate
  updateMask?: GoogleProtobufField_mask.FieldMask
  options?: UpdateProfileRequestOptions
}

export type UpdateTemporaryProfileRequest = {
  userId?: string
  username?: string
  discordUsername?: string
}

export type UpdateProfileAvatarRequest = {
  userId?: string
  modelId?: string
}

export type GetPrivacySettingsRequest = {
  userId?: string
}

export type UpdatePrivacySettingsRequest = {
  userId?: string
  body?: PrivacySettings
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type ResolveUserTagsRequest = {
  userTags?: string[]
}

export type ResolveUserTagsResponse = {
  userIds?: {[key: string]: string}
}

export type ResolveUserRequest = {
  userKey?: string
}

export type PresenceHeartbeat = {
  userId?: string
}

export type PresenceMessage = {
  userId?: string
  status?: PresenceStatus
}

export type ListPlayedGamesRequest = {
  userId?: string
  cursor?: ApiCursor.Cursor
}

export type PlayedGame = {
  id?: string
  lastPlayedAt?: string
  seasonId?: string
  userId?: string
}

export type ListPlayedGamesResponse = {
  games?: PlayedGame[]
  pageInfo?: ApiCursor.PageInfo
}

export type ListProfilesRequest = {
  cursor?: ApiCursor.Cursor
}

export type ListProfilesResponse = {
  profiles?: Profile[]
  pageInfo?: ApiCursor.PageInfo
}

export type RejectUsernameRequest = {
  userId?: string
  reason?: ModerationPlatform_moderation.Violation
  currentUsername?: string
}

export type UsernameChange = {
  newUsername?: string
  oldUsername?: string
  changedAt?: string
  reason?: ModerationPlatform_moderation.Violation
  changedBy?: string
}

export type UsernameChangeEvent = {
  userId?: string
  change?: UsernameChange
}

export type GetUsernameHistoryRequest = {
  userId?: string
  limit?: number
}

export type GetUsernameHistoryResponse = {
  changes?: UsernameChange[]
}

export type CreateProfileRequestOptions = {
  omitNameValidation?: boolean
  omitRankValidation?: boolean
}

export type CreateProfileRequest = {
  userId?: string
  username?: string
  displayName?: string
  options?: CreateProfileRequestOptions
  discordUsername?: string
  temporary?: boolean
}

export type ResolveEmailsRequest = {
  emails?: string[]
}

export type ResolveEmailsResponse = {
  userIds?: {[key: string]: string}
}

export type VerifyUsernameRequest = {
  username?: string
  displayName?: string
  userId?: string
}

export type VerifyUsernameResponse = {
  usernameStatus?: UsernameStatus
  displayNameStatus?: UsernameStatus
}

export type GetUsernameAvailabilityRequest = {
  username?: string
}

export type GetUsernameAvailabilityResponse = {
  usernameOwnerId?: string
  usernameReserved?: boolean
}

export class ProfileService {
  static GetProfile(req: GetProfileRequest, initReq?: fm.InitReq): Promise<Profile> {
    return fm.fetchReq<GetProfileRequest, Profile>(`/v1/users/${req["userId"]}?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static BatchGetProfiles(req: BatchGetProfilesRequest, initReq?: fm.InitReq): Promise<BatchGetProfilesResponse> {
    return fm.fetchReq<BatchGetProfilesRequest, BatchGetProfilesResponse>(`/v1/users:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static UpdateProfile(req: UpdateProfileRequest, initReq?: fm.InitReq): Promise<Profile> {
    return fm.fetchReq<UpdateProfileRequest, Profile>(`/v1/users/${req["body"]["userId"]}`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static UpdateProfileAvatar(req: UpdateProfileAvatarRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<UpdateProfileAvatarRequest, GoogleProtobufEmpty.Empty>(`/v1/users/${req["userId"]}/avatar:update`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateProfileAvatarV2(req: UpdateProfileAvatarRequest, initReq?: fm.InitReq): Promise<AvatarAvatar.Avatar> {
    return fm.fetchReq<UpdateProfileAvatarRequest, AvatarAvatar.Avatar>(`/v2/users/${req["userId"]}/avatar`, {...initReq, method: "PATCH", body: JSON.stringify(req)})
  }
  static UpdatePrivacySettings(req: UpdatePrivacySettingsRequest, initReq?: fm.InitReq): Promise<PrivacySettings> {
    return fm.fetchReq<UpdatePrivacySettingsRequest, PrivacySettings>(`/v1/users/${req["userId"]}/settings/privacy`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static GetPrivacySettings(req: GetPrivacySettingsRequest, initReq?: fm.InitReq): Promise<PrivacySettings> {
    return fm.fetchReq<GetPrivacySettingsRequest, PrivacySettings>(`/v1/users/${req["userId"]}/settings/privacy?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static ResolveUserTags(req: ResolveUserTagsRequest, initReq?: fm.InitReq): Promise<ResolveUserTagsResponse> {
    return fm.fetchReq<ResolveUserTagsRequest, ResolveUserTagsResponse>(`/profile.ProfileService/ResolveUserTags`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ResolveUser(req: ResolveUserRequest, initReq?: fm.InitReq): Promise<Profile> {
    return fm.fetchReq<ResolveUserRequest, Profile>(`/v1/users:resolve`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListPlayedGames(req: ListPlayedGamesRequest, initReq?: fm.InitReq): Promise<ListPlayedGamesResponse> {
    return fm.fetchReq<ListPlayedGamesRequest, ListPlayedGamesResponse>(`/v1/users/${req["userId"]}/played_games?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static ListProfiles(req: ListProfilesRequest, initReq?: fm.InitReq): Promise<ListProfilesResponse> {
    return fm.fetchReq<ListProfilesRequest, ListProfilesResponse>(`/v1/users?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static RejectUsername(req: RejectUsernameRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RejectUsernameRequest, GoogleProtobufEmpty.Empty>(`/v1/users/${req["userId"]}:rejectUsername`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetUsernameHistory(req: GetUsernameHistoryRequest, initReq?: fm.InitReq): Promise<GetUsernameHistoryResponse> {
    return fm.fetchReq<GetUsernameHistoryRequest, GetUsernameHistoryResponse>(`/v1/users/${req["userId"]}/usernameHistory?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
}
export class ProfileAdminService {
  static CreateProfile(req: CreateProfileRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CreateProfileRequest, GoogleProtobufEmpty.Empty>(`/profile.ProfileAdminService/CreateProfile`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateTemporaryProfile(req: UpdateTemporaryProfileRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<UpdateTemporaryProfileRequest, GoogleProtobufEmpty.Empty>(`/profile.ProfileAdminService/UpdateTemporaryProfile`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ResolveEmails(req: ResolveEmailsRequest, initReq?: fm.InitReq): Promise<ResolveEmailsResponse> {
    return fm.fetchReq<ResolveEmailsRequest, ResolveEmailsResponse>(`/profile.ProfileAdminService/ResolveEmails`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static VerifyUsername(req: VerifyUsernameRequest, initReq?: fm.InitReq): Promise<VerifyUsernameResponse> {
    return fm.fetchReq<VerifyUsernameRequest, VerifyUsernameResponse>(`/v1/users:verifyUsernames`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetUsernameAvailability(req: GetUsernameAvailabilityRequest, initReq?: fm.InitReq): Promise<GetUsernameAvailabilityResponse> {
    return fm.fetchReq<GetUsernameAvailabilityRequest, GetUsernameAvailabilityResponse>(`/profile.ProfileAdminService/GetUsernameAvailability`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}