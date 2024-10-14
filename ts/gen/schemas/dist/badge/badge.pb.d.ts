import * as fm from "../fetch.pb";
export declare enum BadgeType {
    TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
    TYPE_NOICE_STAFF = "TYPE_NOICE_STAFF",
    TYPE_STREAMER = "TYPE_STREAMER",
    TYPE_CHANNEL_MODERATOR = "TYPE_CHANNEL_MODERATOR",
    TYPE_CHANNEL_SUBSCRIBER = "TYPE_CHANNEL_SUBSCRIBER",
    TYPE_CLOSED_BETA_CREATOR = "TYPE_CLOSED_BETA_CREATOR",
    TYPE_SUBS_GIFTER = "TYPE_SUBS_GIFTER"
}
export type Badge = {
    type?: BadgeType;
    level?: number;
    nextLevelAt?: string;
};
export type BatchGetUserBadgesRequest = {
    userIds?: string[];
    channelId?: string;
};
export type UserBadges = {
    userId?: string;
    badges?: Badge[];
};
export type BatchGetUserBadgesResponse = {
    badges?: UserBadges[];
};
export declare class BadgeService {
    static BatchGetUserBadges(req: BatchGetUserBadgesRequest, initReq?: fm.InitReq): Promise<BatchGetUserBadgesResponse>;
}
//# sourceMappingURL=badge.pb.d.ts.map