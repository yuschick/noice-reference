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
exports.AuthAdminService = exports.routeGenerateAccessTokenRequestIdentifierDelegate = exports.routeSignupOriginOriginDelegate = exports.AppConsentUpdateEventUpdateType = exports.AccountUpdateEventUpdateType = exports.AccountStatusFlag = exports.SessionTokenMode = exports.IdentityProvider = exports.IdentityType = exports.ConsentStatus = exports.PlatformRole = void 0;
const fm = __importStar(require("../fetch.pb"));
var PlatformRole;
(function (PlatformRole) {
    PlatformRole["PLATFORM_ROLE_UNSPECIFIED"] = "PLATFORM_ROLE_UNSPECIFIED";
    PlatformRole["PLATFORM_ROLE_GUEST"] = "PLATFORM_ROLE_GUEST";
    PlatformRole["PLATFORM_ROLE_USER"] = "PLATFORM_ROLE_USER";
    PlatformRole["PLATFORM_ROLE_BOT"] = "PLATFORM_ROLE_BOT";
    PlatformRole["PLATFORM_ROLE_ADMIN"] = "PLATFORM_ROLE_ADMIN";
    PlatformRole["PLATFORM_ROLE_MODERATOR"] = "PLATFORM_ROLE_MODERATOR";
    PlatformRole["PLATFORM_ROLE_PX_AGENT"] = "PLATFORM_ROLE_PX_AGENT";
    PlatformRole["PLATFORM_ROLE_ROOT"] = "PLATFORM_ROLE_ROOT";
    PlatformRole["PLATFORM_ROLE_FULL_USER"] = "PLATFORM_ROLE_FULL_USER";
})(PlatformRole || (exports.PlatformRole = PlatformRole = {}));
var ConsentStatus;
(function (ConsentStatus) {
    ConsentStatus["CONSENT_STATUS_UNSPECIFIED"] = "CONSENT_STATUS_UNSPECIFIED";
    ConsentStatus["CONSENT_STATUS_ACCEPTED"] = "CONSENT_STATUS_ACCEPTED";
    ConsentStatus["CONSENT_STATUS_DECLINED"] = "CONSENT_STATUS_DECLINED";
})(ConsentStatus || (exports.ConsentStatus = ConsentStatus = {}));
var IdentityType;
(function (IdentityType) {
    IdentityType["IDENTITY_TYPE_UNSPECIFIED"] = "IDENTITY_TYPE_UNSPECIFIED";
    IdentityType["IDENTITY_TYPE_EMAIL"] = "IDENTITY_TYPE_EMAIL";
    IdentityType["IDENTITY_TYPE_DISCORD"] = "IDENTITY_TYPE_DISCORD";
    IdentityType["IDENTITY_TYPE_APPLE"] = "IDENTITY_TYPE_APPLE";
})(IdentityType || (exports.IdentityType = IdentityType = {}));
var IdentityProvider;
(function (IdentityProvider) {
    IdentityProvider["IDENTITY_PROVIDER_UNSPECIFIED"] = "IDENTITY_PROVIDER_UNSPECIFIED";
    IdentityProvider["IDENTITY_PROVIDER_APPLE"] = "IDENTITY_PROVIDER_APPLE";
})(IdentityProvider || (exports.IdentityProvider = IdentityProvider = {}));
var SessionTokenMode;
(function (SessionTokenMode) {
    SessionTokenMode["SESSION_TOKEN_MODE_UNSPECIFIED"] = "SESSION_TOKEN_MODE_UNSPECIFIED";
    SessionTokenMode["SESSION_TOKEN_MODE_SESSION_COOKIE"] = "SESSION_TOKEN_MODE_SESSION_COOKIE";
    SessionTokenMode["SESSION_TOKEN_MODE_PERSISTENT_COOKIE"] = "SESSION_TOKEN_MODE_PERSISTENT_COOKIE";
    SessionTokenMode["SESSION_TOKEN_MODE_RESPONSE"] = "SESSION_TOKEN_MODE_RESPONSE";
})(SessionTokenMode || (exports.SessionTokenMode = SessionTokenMode = {}));
var AccountStatusFlag;
(function (AccountStatusFlag) {
    AccountStatusFlag["STATUS_FLAG_UNSPECIFIED"] = "STATUS_FLAG_UNSPECIFIED";
    AccountStatusFlag["STATUS_FLAG_WAITLIST"] = "STATUS_FLAG_WAITLIST";
    AccountStatusFlag["STATUS_FLAG_BANNED"] = "STATUS_FLAG_BANNED";
    AccountStatusFlag["STATUS_FLAG_DELETION_SCHEDULED"] = "STATUS_FLAG_DELETION_SCHEDULED";
})(AccountStatusFlag || (exports.AccountStatusFlag = AccountStatusFlag = {}));
var AccountUpdateEventUpdateType;
(function (AccountUpdateEventUpdateType) {
    AccountUpdateEventUpdateType["UPDATE_TYPE_UNSPECIFIED"] = "UPDATE_TYPE_UNSPECIFIED";
    AccountUpdateEventUpdateType["UPDATE_TYPE_CREATED"] = "UPDATE_TYPE_CREATED";
    AccountUpdateEventUpdateType["UPDATE_TYPE_UPDATED"] = "UPDATE_TYPE_UPDATED";
    AccountUpdateEventUpdateType["UPDATE_TYPE_DELETED"] = "UPDATE_TYPE_DELETED";
    AccountUpdateEventUpdateType["UPDATE_TYPE_COMPLETED"] = "UPDATE_TYPE_COMPLETED";
})(AccountUpdateEventUpdateType || (exports.AccountUpdateEventUpdateType = AccountUpdateEventUpdateType = {}));
var AppConsentUpdateEventUpdateType;
(function (AppConsentUpdateEventUpdateType) {
    AppConsentUpdateEventUpdateType["UPDATE_TYPE_UNSPECIFIED"] = "UPDATE_TYPE_UNSPECIFIED";
    AppConsentUpdateEventUpdateType["UPDATE_TYPE_CREATED"] = "UPDATE_TYPE_CREATED";
    AppConsentUpdateEventUpdateType["UPDATE_TYPE_DELETED"] = "UPDATE_TYPE_DELETED";
})(AppConsentUpdateEventUpdateType || (exports.AppConsentUpdateEventUpdateType = AppConsentUpdateEventUpdateType = {}));
function routeSignupOriginOriginDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.page) && delegate.onPage(ctx, val.page);
    (val === null || val === void 0 ? void 0 : val.channel) && delegate.onChannel(ctx, val.channel);
    (val === null || val === void 0 ? void 0 : val.campaign) && delegate.onCampaign(ctx, val.campaign);
}
exports.routeSignupOriginOriginDelegate = routeSignupOriginOriginDelegate;
function routeGenerateAccessTokenRequestIdentifierDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.userId) && delegate.onUserId(ctx, val.userId);
    (val === null || val === void 0 ? void 0 : val.email) && delegate.onEmail(ctx, val.email);
}
exports.routeGenerateAccessTokenRequestIdentifierDelegate = routeGenerateAccessTokenRequestIdentifierDelegate;
class AuthAdminService {
    static ResolveEmails(req, initReq) {
        return fm.fetchReq(`/v1/auth/admin:resolveEmails`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CreateInvitation(req, initReq) {
        return fm.fetchReq(`/v1/auth/invitations`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static BatchGetAccounts(req, initReq) {
        return fm.fetchReq(`/v1/auth/accounts:batchGet`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetAccountByEmail(req, initReq) {
        return fm.fetchReq(`/v1/auth/account:getByEmail`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static BatchGetInvitations(req, initReq) {
        return fm.fetchReq(`/v1/auth/invitations:batchGet`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListAccounts(req, initReq) {
        return fm.fetchReq(`/v1/accounts?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static UpdateAccount(req, initReq) {
        return fm.fetchReq(`/v1/accounts/${req["body"]["userId"]}`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static CreateAccount(req, initReq) {
        return fm.fetchReq(`/v1/accounts`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GenerateAccessToken(req, initReq) {
        return fm.fetchReq(`/v1/auth/admin:generateAccessToken`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.AuthAdminService = AuthAdminService;
//# sourceMappingURL=auth.pb.js.map