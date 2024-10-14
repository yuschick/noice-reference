import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
export declare enum Violation {
    VIOLATION_UNSPECIFIED = "VIOLATION_UNSPECIFIED",
    VIOLATION_SPAM = "VIOLATION_SPAM",
    VIOLATION_CHILD_SAFETY = "VIOLATION_CHILD_SAFETY",
    VIOLATION_VIOLENCE = "VIOLATION_VIOLENCE",
    VIOLATION_HATEFUL_BEHAVIOR = "VIOLATION_HATEFUL_BEHAVIOR",
    VIOLATION_HARASSMENT_TARGETED_ABUSE = "VIOLATION_HARASSMENT_TARGETED_ABUSE",
    VIOLATION_ILLEGAL_HARMFUL_AND_RESTRICTED_ACTIVITY = "VIOLATION_ILLEGAL_HARMFUL_AND_RESTRICTED_ACTIVITY",
    VIOLATION_SEXUAL_BEHAVIOR = "VIOLATION_SEXUAL_BEHAVIOR",
    VIOLATION_SELF_HARM = "VIOLATION_SELF_HARM",
    VIOLATION_GRAPHIC_REAL_WORLD_MEDIA = "VIOLATION_GRAPHIC_REAL_WORLD_MEDIA",
    VIOLATION_OFF_PLATFORM_BEHAVIOR = "VIOLATION_OFF_PLATFORM_BEHAVIOR",
    VIOLATION_RESTRICTED_GAMES_AND_GAMES_WITH_GRAPHIC_FOOTAGE = "VIOLATION_RESTRICTED_GAMES_AND_GAMES_WITH_GRAPHIC_FOOTAGE",
    VIOLATION_RESPONSIBLE_STREAMING = "VIOLATION_RESPONSIBLE_STREAMING",
    VIOLATION_CIRCUMVENTION_EVASION = "VIOLATION_CIRCUMVENTION_EVASION",
    VIOLATION_PLATFORM_MANIPULATION = "VIOLATION_PLATFORM_MANIPULATION",
    VIOLATION_REPEATED_COPYRIGHT_INFRINGEMENT = "VIOLATION_REPEATED_COPYRIGHT_INFRINGEMENT",
    VIOLATION_EXTREMISM = "VIOLATION_EXTREMISM",
    VIOLATION_OTHER = "VIOLATION_OTHER"
}
export declare enum BanStatus {
    BAN_STATUS_UNSPECIFIED = "BAN_STATUS_UNSPECIFIED",
    BAN_STATUS_ACTIVE = "BAN_STATUS_ACTIVE",
    BAN_STATUS_INACTIVE = "BAN_STATUS_INACTIVE"
}
export declare enum AppealStatus {
    APPEAL_STATUS_UNSPECIFIED = "APPEAL_STATUS_UNSPECIFIED",
    APPEAL_STATUS_PENDING = "APPEAL_STATUS_PENDING",
    APPEAL_STATUS_ACCEPTED = "APPEAL_STATUS_ACCEPTED",
    APPEAL_STATUS_DECLINED = "APPEAL_STATUS_DECLINED"
}
export type PlatformBan = {
    banId?: string;
    userId?: string;
    status?: BanStatus;
    moderatorId?: string;
    violation?: Violation;
    description?: string;
    bannedAt?: string;
    expiresAt?: string;
    unbannedBy?: string;
    unbannedAt?: string;
    appealApproved?: boolean;
};
export type BanUserRequest = {
    userId?: string;
    violation?: Violation;
    description?: string;
    duration?: string;
};
export type PlatformBanUpdateEvent = {
    ban?: PlatformBan;
    updatedAt?: string;
};
export type PlatformBanAppealUpdateEvent = {
    appeal?: PlatformBanAppeal;
    updatedAt?: string;
};
export type PlatformUserBannedNotification = {
    userId?: string;
    violation?: Violation;
    description?: string;
    bannedAt?: string;
    expiresAt?: string;
};
export type UnbanUserRequest = {
    userId?: string;
};
export type GetUserPlatformBanRequest = {
    userId?: string;
};
export type BatchGetPlatformBansRequest = {
    banIds?: string[];
};
export type BatchGetPlatformBansResponse = {
    bans?: PlatformBan[];
};
export type PlatformBanAppeal = {
    banId?: string;
    status?: AppealStatus;
    createdAt?: string;
    appealText?: string;
    reviewerId?: string;
    reviewerComment?: string;
    closedAt?: string;
    userId?: string;
};
export type ListPlatformBanAppealsRequest = {
    status?: AppealStatus;
    cursor?: ApiCursor.Cursor;
};
export type ListPlatformBanAppealsResponse = {
    appeals?: PlatformBanAppeal[];
    pageInfo?: ApiCursor.PageInfo;
};
export type CreateUserPlatformBanAppealRequest = {
    userId?: string;
    appealText?: string;
};
export type UpdatePlatformBanAppealRequest = {
    banId?: string;
    status?: AppealStatus;
    comment?: string;
};
export type GetPlatformBanAppealRequest = {
    banId?: string;
};
export declare class PlatformModerationService {
    static BanUser(req: BanUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UnbanUser(req: UnbanUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetUserPlatformBan(req: GetUserPlatformBanRequest, initReq?: fm.InitReq): Promise<PlatformBan>;
    static ListPlatformBanAppeals(req: ListPlatformBanAppealsRequest, initReq?: fm.InitReq): Promise<ListPlatformBanAppealsResponse>;
    static BatchGetPlatformBans(req: BatchGetPlatformBansRequest, initReq?: fm.InitReq): Promise<BatchGetPlatformBansResponse>;
    static GetPlatformBanAppeal(req: GetPlatformBanAppealRequest, initReq?: fm.InitReq): Promise<PlatformBanAppeal>;
    static CreateUserPlatformBanAppeal(req: CreateUserPlatformBanAppealRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UpdatePlatformBanAppeal(req: UpdatePlatformBanAppealRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
//# sourceMappingURL=platform_moderation.pb.d.ts.map