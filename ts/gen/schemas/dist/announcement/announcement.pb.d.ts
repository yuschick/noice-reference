import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
export declare enum AnnouncementCategory {
    ANNOUNCEMENT_CATEGORY_UNSPECIFIED = "ANNOUNCEMENT_CATEGORY_UNSPECIFIED",
    ANNOUNCEMENT_CATEGORY_SYSTEM = "ANNOUNCEMENT_CATEGORY_SYSTEM",
    ANNOUNCEMENT_CATEGORY_PLATFORM = "ANNOUNCEMENT_CATEGORY_PLATFORM",
    ANNOUNCEMENT_CATEGORY_GAME_FORTNITE = "ANNOUNCEMENT_CATEGORY_GAME_FORTNITE",
    ANNOUNCEMENT_CATEGORY_GAME_DBD = "ANNOUNCEMENT_CATEGORY_GAME_DBD",
    ANNOUNCEMENT_CATEGORY_GAME_DOTA2 = "ANNOUNCEMENT_CATEGORY_GAME_DOTA2",
    ANNOUNCEMENT_CATEGORY_GAME_APEX_LEGENDS = "ANNOUNCEMENT_CATEGORY_GAME_APEX_LEGENDS",
    ANNOUNCEMENT_CATEGORY_GAME_LEAGUE_OF_LEGENDS = "ANNOUNCEMENT_CATEGORY_GAME_LEAGUE_OF_LEGENDS"
}
export declare enum AnnouncementTarget {
    ANNOUNCEMENT_TARGET_UNSPECIFIED = "ANNOUNCEMENT_TARGET_UNSPECIFIED",
    ANNOUNCEMENT_TARGET_WEB = "ANNOUNCEMENT_TARGET_WEB",
    ANNOUNCEMENT_TARGET_STUDIO = "ANNOUNCEMENT_TARGET_STUDIO",
    ANNOUNCEMENT_TARGET_MOBILE = "ANNOUNCEMENT_TARGET_MOBILE"
}
export declare enum AnnouncementStatus {
    ANNOUNCEMENT_STATUS_UNSPECIFIED = "ANNOUNCEMENT_STATUS_UNSPECIFIED",
    ANNOUNCEMENT_STATUS_ACTIVE = "ANNOUNCEMENT_STATUS_ACTIVE",
    ANNOUNCEMENT_STATUS_SCHEDULED = "ANNOUNCEMENT_STATUS_SCHEDULED",
    ANNOUNCEMENT_STATUS_DRAFT = "ANNOUNCEMENT_STATUS_DRAFT",
    ANNOUNCEMENT_STATUS_PAST = "ANNOUNCEMENT_STATUS_PAST"
}
export type Targets = {
    web?: boolean;
    studio?: boolean;
    mobile?: boolean;
};
export type Announcement = {
    id?: string;
    category?: AnnouncementCategory;
    title?: string;
    text?: string;
    imageUrl?: string;
    published?: boolean;
    startTime?: string;
    endTime?: string;
    createdAt?: string;
    creatorId?: string;
    status?: AnnouncementStatus;
    targets?: Targets;
};
export type ListUserAnnouncementsRequest = {
    userId?: string;
    target?: AnnouncementTarget;
    cursor?: ApiCursor.Cursor;
};
export type ListUserAnnouncementsResponse = {
    announcements?: Announcement[];
    pageInfo?: ApiCursor.PageInfo;
};
export type CreateAnnouncementRequest = {
    category?: AnnouncementCategory;
    title?: string;
    text?: string;
    imageUrl?: string;
    published?: boolean;
    startTime?: string;
    endTime?: string;
    targets?: Targets;
};
export type UpdateAnnouncementRequest = {
    body?: Announcement;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type DeleteAnnouncementRequest = {
    id?: string;
};
export type DeleteAnnouncementImageRequest = {
    announcementId?: string;
};
export type AnnouncementFilter = {
    statuses?: AnnouncementStatus[];
    targets?: AnnouncementTarget[];
};
export type ListAnnouncementsRequest = {
    filter?: AnnouncementFilter;
    cursor?: ApiCursor.Cursor;
};
export type ListAnnouncementsResponse = {
    announcements?: Announcement[];
    pageInfo?: ApiCursor.PageInfo;
    totalCount?: string;
};
export type CreateAnnouncementImageUploadTokenRequest = {
    announcementId?: string;
};
export type CreateAnnouncementImageUploadTokenResponse = {
    token?: string;
};
export declare class AnnouncementService {
    static ListUserAnnouncements(req: ListUserAnnouncementsRequest, initReq?: fm.InitReq): Promise<ListUserAnnouncementsResponse>;
    static CreateAnnouncement(req: CreateAnnouncementRequest, initReq?: fm.InitReq): Promise<Announcement>;
    static UpdateAnnouncement(req: UpdateAnnouncementRequest, initReq?: fm.InitReq): Promise<Announcement>;
    static CreateAnnouncementImageUploadToken(req: CreateAnnouncementImageUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateAnnouncementImageUploadTokenResponse>;
    static DeleteAnnouncement(req: DeleteAnnouncementRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DeleteAnnouncementImage(req: DeleteAnnouncementImageRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListAnnouncements(req: ListAnnouncementsRequest, initReq?: fm.InitReq): Promise<ListAnnouncementsResponse>;
}
//# sourceMappingURL=announcement.pb.d.ts.map