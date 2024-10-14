import * as ApiCursor from "../api/cursor.pb";
import * as ApiEntity from "../api/entity.pb";
import * as AvatarAvatar from "../avatar/avatar.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
export declare enum ProfileVisibility {
    PROFILE_VISIBILITY_UNSPECIFIED = "PROFILE_VISIBILITY_UNSPECIFIED",
    PROFILE_VISIBILITY_PUBLIC = "PROFILE_VISIBILITY_PUBLIC",
    PROFILE_VISIBILITY_PRIVATE = "PROFILE_VISIBILITY_PRIVATE"
}
export declare enum PresenceStatus {
    PRESENCE_STATUS_UNSPECIFIED = "PRESENCE_STATUS_UNSPECIFIED",
    PRESENCE_STATUS_OFFLINE = "PRESENCE_STATUS_OFFLINE",
    PRESENCE_STATUS_ONLINE = "PRESENCE_STATUS_ONLINE"
}
export declare enum UsernameStatus {
    USERNAME_STATUS_UNSPECIFIED = "USERNAME_STATUS_UNSPECIFIED",
    USERNAME_STATUS_OK = "USERNAME_STATUS_OK",
    USERNAME_STATUS_GUIDELINES_VIOLATION = "USERNAME_STATUS_GUIDELINES_VIOLATION",
    USERNAME_STATUS_DUPLICATE = "USERNAME_STATUS_DUPLICATE",
    USERNAME_STATUS_RESERVED = "USERNAME_STATUS_RESERVED"
}
export declare enum ErrorDetailsCause {
    CAUSE_UNSPECIFIED = "CAUSE_UNSPECIFIED",
    CAUSE_UNACCEPTABLE_USERNAME = "CAUSE_UNACCEPTABLE_USERNAME",
    CAUSE_DUPLICATE_USERNAME = "CAUSE_DUPLICATE_USERNAME",
    CAUSE_RESERVED_USERNAME = "CAUSE_RESERVED_USERNAME"
}
export declare enum PrivacySettingsVisibility {
    VISIBILITY_UNSPECIFIED = "VISIBILITY_UNSPECIFIED",
    VISIBILITY_ALL = "VISIBILITY_ALL",
    VISIBILITY_FRIENDS = "VISIBILITY_FRIENDS",
    VISIBILITY_ONLY_ME = "VISIBILITY_ONLY_ME"
}
export type ErrorDetails = {
    cause?: ErrorDetailsCause;
};
export type ProfileUpdateEvent = {
    profile?: Profile;
    updatedAt?: string;
};
export type ProfileAvatars = {
    avatar2D?: string;
    avatar3D?: string;
    avatarFullbody?: string;
    avatarGender?: string;
};
export type ProfileAvatarConfig = {
    modelId?: string;
};
export type Profile = {
    userId?: string;
    displayName?: string;
    avatarUrl?: string;
    userTag?: string;
    avatars?: ProfileAvatars;
    lastSeen?: string;
    bio?: string;
    settings?: ProfileSettings;
    state?: ApiEntity.EntityState;
    onlineStatus?: PresenceStatus;
    avatarConfig?: ProfileAvatarConfig;
    visibility?: ProfileVisibility;
    discordUsername?: string;
    temporary?: boolean;
};
export type PrivacySettings = {
    hideOnlineStatus?: boolean;
    visibility?: PrivacySettingsVisibility;
    discordUsernameVisibility?: PrivacySettingsVisibility;
    anonymisePurchaseHighlights?: boolean;
    showMatureContentWarning?: boolean;
};
export type PrivacySettingsUpdateEvent = {
    userId?: string;
    settings?: PrivacySettings;
    updatedAt?: string;
};
export type ProfileSettings = {
    privacy?: PrivacySettings;
};
export type GetProfileRequest = {
    userId?: string;
};
export type BatchGetProfilesRequest = {
    userIds?: string[];
};
export type BatchGetProfilesResponse = {
    profiles?: Profile[];
};
export type ProfileUpdate = {
    userId?: string;
    displayName?: string;
    userTag?: string;
    bio?: string;
    discordUsername?: string;
};
export type UpdateProfileRequest = {
    body?: ProfileUpdate;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type UpdateTemporaryProfileRequest = {
    userId?: string;
    username?: string;
    discordUsername?: string;
};
export type UpdateProfileAvatarRequest = {
    userId?: string;
    modelId?: string;
};
export type GetPrivacySettingsRequest = {
    userId?: string;
};
export type UpdatePrivacySettingsRequest = {
    userId?: string;
    body?: PrivacySettings;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type ResolveUserTagsRequest = {
    userTags?: string[];
};
export type ResolveUserTagsResponse = {
    userIds?: {
        [key: string]: string;
    };
};
export type ResolveUserRequest = {
    userKey?: string;
};
export type PresenceHeartbeat = {
    userId?: string;
};
export type PresenceMessage = {
    userId?: string;
    status?: PresenceStatus;
};
export type ListPlayedGamesRequest = {
    userId?: string;
    cursor?: ApiCursor.Cursor;
};
export type PlayedGame = {
    id?: string;
    lastPlayedAt?: string;
    seasonId?: string;
    userId?: string;
};
export type ListPlayedGamesResponse = {
    games?: PlayedGame[];
    pageInfo?: ApiCursor.PageInfo;
};
export type ListProfilesRequest = {
    cursor?: ApiCursor.Cursor;
};
export type ListProfilesResponse = {
    profiles?: Profile[];
    pageInfo?: ApiCursor.PageInfo;
};
export type CreateProfileRequestOptions = {
    omitNameValidation?: boolean;
    omitRankValidation?: boolean;
};
export type CreateProfileRequest = {
    userId?: string;
    username?: string;
    displayName?: string;
    options?: CreateProfileRequestOptions;
    discordUsername?: string;
    temporary?: boolean;
};
export type ResolveEmailsRequest = {
    emails?: string[];
};
export type ResolveEmailsResponse = {
    userIds?: {
        [key: string]: string;
    };
};
export type VerifyUsernameRequest = {
    username?: string;
    displayName?: string;
};
export type VerifyUsernameResponse = {
    usernameStatus?: UsernameStatus;
    displayNameStatus?: UsernameStatus;
};
export declare class ProfileService {
    static GetProfile(req: GetProfileRequest, initReq?: fm.InitReq): Promise<Profile>;
    static BatchGetProfiles(req: BatchGetProfilesRequest, initReq?: fm.InitReq): Promise<BatchGetProfilesResponse>;
    static UpdateProfile(req: UpdateProfileRequest, initReq?: fm.InitReq): Promise<Profile>;
    static UpdateProfileAvatar(req: UpdateProfileAvatarRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UpdateProfileAvatarV2(req: UpdateProfileAvatarRequest, initReq?: fm.InitReq): Promise<AvatarAvatar.Avatar>;
    static UpdatePrivacySettings(req: UpdatePrivacySettingsRequest, initReq?: fm.InitReq): Promise<PrivacySettings>;
    static GetPrivacySettings(req: GetPrivacySettingsRequest, initReq?: fm.InitReq): Promise<PrivacySettings>;
    static ResolveUserTags(req: ResolveUserTagsRequest, initReq?: fm.InitReq): Promise<ResolveUserTagsResponse>;
    static ResolveUser(req: ResolveUserRequest, initReq?: fm.InitReq): Promise<Profile>;
    static ListPlayedGames(req: ListPlayedGamesRequest, initReq?: fm.InitReq): Promise<ListPlayedGamesResponse>;
    static ListProfiles(req: ListProfilesRequest, initReq?: fm.InitReq): Promise<ListProfilesResponse>;
}
export declare class ProfileAdminService {
    static CreateProfile(req: CreateProfileRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UpdateTemporaryProfile(req: UpdateTemporaryProfileRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ResolveEmails(req: ResolveEmailsRequest, initReq?: fm.InitReq): Promise<ResolveEmailsResponse>;
    static VerifyUsername(req: VerifyUsernameRequest, initReq?: fm.InitReq): Promise<VerifyUsernameResponse>;
}
//# sourceMappingURL=profile.pb.d.ts.map