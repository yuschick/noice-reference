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
exports.PlatformModerationService = exports.AppealStatus = exports.BanStatus = exports.Violation = void 0;
const fm = __importStar(require("../fetch.pb"));
var Violation;
(function (Violation) {
    Violation["VIOLATION_UNSPECIFIED"] = "VIOLATION_UNSPECIFIED";
    Violation["VIOLATION_SPAM"] = "VIOLATION_SPAM";
    Violation["VIOLATION_CHILD_SAFETY"] = "VIOLATION_CHILD_SAFETY";
    Violation["VIOLATION_VIOLENCE"] = "VIOLATION_VIOLENCE";
    Violation["VIOLATION_HATEFUL_BEHAVIOR"] = "VIOLATION_HATEFUL_BEHAVIOR";
    Violation["VIOLATION_HARASSMENT_TARGETED_ABUSE"] = "VIOLATION_HARASSMENT_TARGETED_ABUSE";
    Violation["VIOLATION_ILLEGAL_HARMFUL_AND_RESTRICTED_ACTIVITY"] = "VIOLATION_ILLEGAL_HARMFUL_AND_RESTRICTED_ACTIVITY";
    Violation["VIOLATION_SEXUAL_BEHAVIOR"] = "VIOLATION_SEXUAL_BEHAVIOR";
    Violation["VIOLATION_SELF_HARM"] = "VIOLATION_SELF_HARM";
    Violation["VIOLATION_GRAPHIC_REAL_WORLD_MEDIA"] = "VIOLATION_GRAPHIC_REAL_WORLD_MEDIA";
    Violation["VIOLATION_OFF_PLATFORM_BEHAVIOR"] = "VIOLATION_OFF_PLATFORM_BEHAVIOR";
    Violation["VIOLATION_RESTRICTED_GAMES_AND_GAMES_WITH_GRAPHIC_FOOTAGE"] = "VIOLATION_RESTRICTED_GAMES_AND_GAMES_WITH_GRAPHIC_FOOTAGE";
    Violation["VIOLATION_RESPONSIBLE_STREAMING"] = "VIOLATION_RESPONSIBLE_STREAMING";
    Violation["VIOLATION_CIRCUMVENTION_EVASION"] = "VIOLATION_CIRCUMVENTION_EVASION";
    Violation["VIOLATION_PLATFORM_MANIPULATION"] = "VIOLATION_PLATFORM_MANIPULATION";
    Violation["VIOLATION_REPEATED_COPYRIGHT_INFRINGEMENT"] = "VIOLATION_REPEATED_COPYRIGHT_INFRINGEMENT";
    Violation["VIOLATION_EXTREMISM"] = "VIOLATION_EXTREMISM";
    Violation["VIOLATION_OTHER"] = "VIOLATION_OTHER";
})(Violation || (exports.Violation = Violation = {}));
var BanStatus;
(function (BanStatus) {
    BanStatus["BAN_STATUS_UNSPECIFIED"] = "BAN_STATUS_UNSPECIFIED";
    BanStatus["BAN_STATUS_ACTIVE"] = "BAN_STATUS_ACTIVE";
    BanStatus["BAN_STATUS_INACTIVE"] = "BAN_STATUS_INACTIVE";
})(BanStatus || (exports.BanStatus = BanStatus = {}));
var AppealStatus;
(function (AppealStatus) {
    AppealStatus["APPEAL_STATUS_UNSPECIFIED"] = "APPEAL_STATUS_UNSPECIFIED";
    AppealStatus["APPEAL_STATUS_PENDING"] = "APPEAL_STATUS_PENDING";
    AppealStatus["APPEAL_STATUS_ACCEPTED"] = "APPEAL_STATUS_ACCEPTED";
    AppealStatus["APPEAL_STATUS_DECLINED"] = "APPEAL_STATUS_DECLINED";
})(AppealStatus || (exports.AppealStatus = AppealStatus = {}));
class PlatformModerationService {
    static BanUser(req, initReq) {
        return fm.fetchReq(`/accounts/${req["userId"]}/moderation:ban`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UnbanUser(req, initReq) {
        return fm.fetchReq(`/accounts/${req["userId"]}/moderation:unban`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetUserPlatformBan(req, initReq) {
        return fm.fetchReq(`/accounts/${req["userId"]}/moderation:getPlatformBan`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListPlatformBanAppeals(req, initReq) {
        return fm.fetchReq(`/moderation/platformBanAppeals?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetPlatformBans(req, initReq) {
        return fm.fetchReq(`/moderation/platformBans:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetPlatformBanAppeal(req, initReq) {
        return fm.fetchReq(`/moderation/platformBansAppeals/${req["banId"]}?${fm.renderURLSearchParams(req, ["banId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreateUserPlatformBanAppeal(req, initReq) {
        return fm.fetchReq(`/accounts/${req["userId"]}/moderation:appeal`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdatePlatformBanAppeal(req, initReq) {
        return fm.fetchReq(`/moderation/platformBanAppeals/${req["banId"]}`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.PlatformModerationService = PlatformModerationService;
//# sourceMappingURL=platform_moderation.pb.js.map