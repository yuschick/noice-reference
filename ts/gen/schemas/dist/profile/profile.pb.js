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
exports.ProfileAdminService = exports.ProfileService = exports.PrivacySettingsVisibility = exports.ErrorDetailsCause = exports.UsernameStatus = exports.PresenceStatus = exports.ProfileVisibility = void 0;
const fm = __importStar(require("../fetch.pb"));
var ProfileVisibility;
(function (ProfileVisibility) {
    ProfileVisibility["PROFILE_VISIBILITY_UNSPECIFIED"] = "PROFILE_VISIBILITY_UNSPECIFIED";
    ProfileVisibility["PROFILE_VISIBILITY_PUBLIC"] = "PROFILE_VISIBILITY_PUBLIC";
    ProfileVisibility["PROFILE_VISIBILITY_PRIVATE"] = "PROFILE_VISIBILITY_PRIVATE";
})(ProfileVisibility || (exports.ProfileVisibility = ProfileVisibility = {}));
var PresenceStatus;
(function (PresenceStatus) {
    PresenceStatus["PRESENCE_STATUS_UNSPECIFIED"] = "PRESENCE_STATUS_UNSPECIFIED";
    PresenceStatus["PRESENCE_STATUS_OFFLINE"] = "PRESENCE_STATUS_OFFLINE";
    PresenceStatus["PRESENCE_STATUS_ONLINE"] = "PRESENCE_STATUS_ONLINE";
})(PresenceStatus || (exports.PresenceStatus = PresenceStatus = {}));
var UsernameStatus;
(function (UsernameStatus) {
    UsernameStatus["USERNAME_STATUS_UNSPECIFIED"] = "USERNAME_STATUS_UNSPECIFIED";
    UsernameStatus["USERNAME_STATUS_OK"] = "USERNAME_STATUS_OK";
    UsernameStatus["USERNAME_STATUS_GUIDELINES_VIOLATION"] = "USERNAME_STATUS_GUIDELINES_VIOLATION";
    UsernameStatus["USERNAME_STATUS_DUPLICATE"] = "USERNAME_STATUS_DUPLICATE";
    UsernameStatus["USERNAME_STATUS_RESERVED"] = "USERNAME_STATUS_RESERVED";
})(UsernameStatus || (exports.UsernameStatus = UsernameStatus = {}));
var ErrorDetailsCause;
(function (ErrorDetailsCause) {
    ErrorDetailsCause["CAUSE_UNSPECIFIED"] = "CAUSE_UNSPECIFIED";
    ErrorDetailsCause["CAUSE_UNACCEPTABLE_USERNAME"] = "CAUSE_UNACCEPTABLE_USERNAME";
    ErrorDetailsCause["CAUSE_DUPLICATE_USERNAME"] = "CAUSE_DUPLICATE_USERNAME";
    ErrorDetailsCause["CAUSE_RESERVED_USERNAME"] = "CAUSE_RESERVED_USERNAME";
})(ErrorDetailsCause || (exports.ErrorDetailsCause = ErrorDetailsCause = {}));
var PrivacySettingsVisibility;
(function (PrivacySettingsVisibility) {
    PrivacySettingsVisibility["VISIBILITY_UNSPECIFIED"] = "VISIBILITY_UNSPECIFIED";
    PrivacySettingsVisibility["VISIBILITY_ALL"] = "VISIBILITY_ALL";
    PrivacySettingsVisibility["VISIBILITY_FRIENDS"] = "VISIBILITY_FRIENDS";
    PrivacySettingsVisibility["VISIBILITY_ONLY_ME"] = "VISIBILITY_ONLY_ME";
})(PrivacySettingsVisibility || (exports.PrivacySettingsVisibility = PrivacySettingsVisibility = {}));
class ProfileService {
    static GetProfile(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetProfiles(req, initReq) {
        return fm.fetchReq(`/v1/users:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static UpdateProfile(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["body"]["userId"]}`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static UpdateProfileAvatar(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/avatar:update`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateProfileAvatarV2(req, initReq) {
        return fm.fetchReq(`/v2/users/${req["userId"]}/avatar`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req) }));
    }
    static UpdatePrivacySettings(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/settings/privacy`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static GetPrivacySettings(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/settings/privacy?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ResolveUserTags(req, initReq) {
        return fm.fetchReq(`/profile.ProfileService/ResolveUserTags`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ResolveUser(req, initReq) {
        return fm.fetchReq(`/v1/users:resolve`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListPlayedGames(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/played_games?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListProfiles(req, initReq) {
        return fm.fetchReq(`/v1/users?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.ProfileService = ProfileService;
class ProfileAdminService {
    static CreateProfile(req, initReq) {
        return fm.fetchReq(`/profile.ProfileAdminService/CreateProfile`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateTemporaryProfile(req, initReq) {
        return fm.fetchReq(`/profile.ProfileAdminService/UpdateTemporaryProfile`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ResolveEmails(req, initReq) {
        return fm.fetchReq(`/profile.ProfileAdminService/ResolveEmails`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static VerifyUsername(req, initReq) {
        return fm.fetchReq(`/v1/users:verifyUsernames`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.ProfileAdminService = ProfileAdminService;
//# sourceMappingURL=profile.pb.js.map