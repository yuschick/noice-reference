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
exports.AnnouncementService = exports.AnnouncementStatus = exports.AnnouncementTarget = exports.AnnouncementCategory = void 0;
const fm = __importStar(require("../fetch.pb"));
var AnnouncementCategory;
(function (AnnouncementCategory) {
    AnnouncementCategory["ANNOUNCEMENT_CATEGORY_UNSPECIFIED"] = "ANNOUNCEMENT_CATEGORY_UNSPECIFIED";
    AnnouncementCategory["ANNOUNCEMENT_CATEGORY_SYSTEM"] = "ANNOUNCEMENT_CATEGORY_SYSTEM";
    AnnouncementCategory["ANNOUNCEMENT_CATEGORY_PLATFORM"] = "ANNOUNCEMENT_CATEGORY_PLATFORM";
    AnnouncementCategory["ANNOUNCEMENT_CATEGORY_GAME_FORTNITE"] = "ANNOUNCEMENT_CATEGORY_GAME_FORTNITE";
    AnnouncementCategory["ANNOUNCEMENT_CATEGORY_GAME_DBD"] = "ANNOUNCEMENT_CATEGORY_GAME_DBD";
    AnnouncementCategory["ANNOUNCEMENT_CATEGORY_GAME_DOTA2"] = "ANNOUNCEMENT_CATEGORY_GAME_DOTA2";
    AnnouncementCategory["ANNOUNCEMENT_CATEGORY_GAME_APEX_LEGENDS"] = "ANNOUNCEMENT_CATEGORY_GAME_APEX_LEGENDS";
    AnnouncementCategory["ANNOUNCEMENT_CATEGORY_GAME_LEAGUE_OF_LEGENDS"] = "ANNOUNCEMENT_CATEGORY_GAME_LEAGUE_OF_LEGENDS";
})(AnnouncementCategory || (exports.AnnouncementCategory = AnnouncementCategory = {}));
var AnnouncementTarget;
(function (AnnouncementTarget) {
    AnnouncementTarget["ANNOUNCEMENT_TARGET_UNSPECIFIED"] = "ANNOUNCEMENT_TARGET_UNSPECIFIED";
    AnnouncementTarget["ANNOUNCEMENT_TARGET_WEB"] = "ANNOUNCEMENT_TARGET_WEB";
    AnnouncementTarget["ANNOUNCEMENT_TARGET_STUDIO"] = "ANNOUNCEMENT_TARGET_STUDIO";
    AnnouncementTarget["ANNOUNCEMENT_TARGET_MOBILE"] = "ANNOUNCEMENT_TARGET_MOBILE";
})(AnnouncementTarget || (exports.AnnouncementTarget = AnnouncementTarget = {}));
var AnnouncementStatus;
(function (AnnouncementStatus) {
    AnnouncementStatus["ANNOUNCEMENT_STATUS_UNSPECIFIED"] = "ANNOUNCEMENT_STATUS_UNSPECIFIED";
    AnnouncementStatus["ANNOUNCEMENT_STATUS_ACTIVE"] = "ANNOUNCEMENT_STATUS_ACTIVE";
    AnnouncementStatus["ANNOUNCEMENT_STATUS_SCHEDULED"] = "ANNOUNCEMENT_STATUS_SCHEDULED";
    AnnouncementStatus["ANNOUNCEMENT_STATUS_DRAFT"] = "ANNOUNCEMENT_STATUS_DRAFT";
    AnnouncementStatus["ANNOUNCEMENT_STATUS_PAST"] = "ANNOUNCEMENT_STATUS_PAST";
})(AnnouncementStatus || (exports.AnnouncementStatus = AnnouncementStatus = {}));
class AnnouncementService {
    static ListUserAnnouncements(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/announcements?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreateAnnouncement(req, initReq) {
        return fm.fetchReq(`/v1/announcements`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateAnnouncement(req, initReq) {
        return fm.fetchReq(`/v1/announcements/${req["body"]["id"]}`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static CreateAnnouncementImageUploadToken(req, initReq) {
        return fm.fetchReq(`/v1/announcements/${req["announcementId"]}:imageUploadToken`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteAnnouncement(req, initReq) {
        return fm.fetchReq(`/v1/announcements/${req["id"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static DeleteAnnouncementImage(req, initReq) {
        return fm.fetchReq(`/v1/announcements/${req["announcementId"]}/assets/image`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static ListAnnouncements(req, initReq) {
        return fm.fetchReq(`/v1/announcements?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.AnnouncementService = AnnouncementService;
//# sourceMappingURL=announcement.pb.js.map