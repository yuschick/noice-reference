"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelModerationService = exports.routeModerationEventContentContentDelegate = exports.ModerationEventType = exports.BanStatus = exports.AppealStatus = exports.Violation = void 0;
const fm = __importStar(require("../fetch.pb"));
var Violation;
(function (Violation) {
    Violation["VIOLATION_UNSPECIFIED"] = "VIOLATION_UNSPECIFIED";
    Violation["VIOLATION_SPAM"] = "VIOLATION_SPAM";
    Violation["VIOLATION_OTHER"] = "VIOLATION_OTHER";
})(Violation || (exports.Violation = Violation = {}));
var AppealStatus;
(function (AppealStatus) {
    AppealStatus["APPEAL_STATUS_UNSPECIFIED"] = "APPEAL_STATUS_UNSPECIFIED";
    AppealStatus["APPEAL_STATUS_PENDING"] = "APPEAL_STATUS_PENDING";
    AppealStatus["APPEAL_STATUS_ACCEPTED"] = "APPEAL_STATUS_ACCEPTED";
    AppealStatus["APPEAL_STATUS_DECLINED"] = "APPEAL_STATUS_DECLINED";
})(AppealStatus || (exports.AppealStatus = AppealStatus = {}));
var BanStatus;
(function (BanStatus) {
    BanStatus["BAN_STATUS_UNSPECIFIED"] = "BAN_STATUS_UNSPECIFIED";
    BanStatus["BAN_STATUS_ACTIVE"] = "BAN_STATUS_ACTIVE";
    BanStatus["BAN_STATUS_INACTIVE"] = "BAN_STATUS_INACTIVE";
})(BanStatus || (exports.BanStatus = BanStatus = {}));
var ModerationEventType;
(function (ModerationEventType) {
    ModerationEventType["MODERATION_EVENT_TYPE_UNSPECIFIED"] = "MODERATION_EVENT_TYPE_UNSPECIFIED";
    ModerationEventType["MODERATION_EVENT_TYPE_USER_MUTED"] = "MODERATION_EVENT_TYPE_USER_MUTED";
    ModerationEventType["MODERATION_EVENT_TYPE_USER_BANNED"] = "MODERATION_EVENT_TYPE_USER_BANNED";
    ModerationEventType["MODERATION_EVENT_TYPE_USER_UNBANNED"] = "MODERATION_EVENT_TYPE_USER_UNBANNED";
    ModerationEventType["MODERATION_EVENT_TYPE_BAN_APPEAL_ACCEPTED"] = "MODERATION_EVENT_TYPE_BAN_APPEAL_ACCEPTED";
    ModerationEventType["MODERATION_EVENT_TYPE_BAN_APPEAL_REJECTED"] = "MODERATION_EVENT_TYPE_BAN_APPEAL_REJECTED";
    ModerationEventType["MODERATION_EVENT_TYPE_AUTOMOD_ITEM_ACCEPTED"] = "MODERATION_EVENT_TYPE_AUTOMOD_ITEM_ACCEPTED";
    ModerationEventType["MODERATION_EVENT_TYPE_AUTOMOD_ITEM_REJECTED"] = "MODERATION_EVENT_TYPE_AUTOMOD_ITEM_REJECTED";
})(ModerationEventType || (exports.ModerationEventType = ModerationEventType = {}));
function routeModerationEventContentContentDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.userMuted) && delegate.onUserMuted(ctx, val.userMuted);
    (val === null || val === void 0 ? void 0 : val.userBanned) && delegate.onUserBanned(ctx, val.userBanned);
    (val === null || val === void 0 ? void 0 : val.userUnbanned) && delegate.onUserUnbanned(ctx, val.userUnbanned);
    (val === null || val === void 0 ? void 0 : val.banAppealAccepted) && delegate.onBanAppealAccepted(ctx, val.banAppealAccepted);
    (val === null || val === void 0 ? void 0 : val.banAppealRejected) && delegate.onBanAppealRejected(ctx, val.banAppealRejected);
    (val === null || val === void 0 ? void 0 : val.automodItemAccepted) && delegate.onAutomodItemAccepted(ctx, val.automodItemAccepted);
    (val === null || val === void 0 ? void 0 : val.automodItemRejected) && delegate.onAutomodItemRejected(ctx, val.automodItemRejected);
}
exports.routeModerationEventContentContentDelegate = routeModerationEventContentContentDelegate;
class ChannelModerationService {
    static BanUser(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/bannedUsers/${req["userId"]}`, Object.assign(Object.assign({}, initReq), { method: "PUT", body: JSON.stringify(req) }));
    }
    static UnbanUser(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/bannedUsers/${req["userId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static GetUserBanStatus(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/bannedUsers/${req["userId"]}?${fm.renderURLSearchParams(req, ["channelId", "userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetUserBanStatus(req, initReq) {
        return fm.fetchReq(`/v1/bannedUsers:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListBannedUsers(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/bannedUsers?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListUserChannelBans(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/channelBans?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreateBanAppeal(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/appeals`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListBanAppeals(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/appeals?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetBanAppeal(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/appeals:batchGet?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static UpdateBanAppeal(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/appeals`, Object.assign(Object.assign({}, initReq), { method: "PUT" }));
    }
    static ListModerationEvents(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/moderationEvents?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ModerationEventsStream(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/channels/${req["channelId"]}/moderationEvents:stream?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/channels/${req["channelId"]}/moderationEvents:stream?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static UpdateModerationSettings(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["body"]["channelId"]}/moderationSettings`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static GetModerationSettings(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/moderationSettings?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static SuspendChannelFeature(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/features/${req["feature"]}/suspension`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UnsuspendChannelFeature(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/features/${req["feature"]}/suspension`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
}
exports.ChannelModerationService = ChannelModerationService;
//# sourceMappingURL=moderation.pb.js.map