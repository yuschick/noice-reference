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
exports.OAuthService = exports.AuthInternalService = exports.AuthServiceV4 = exports.routeAddExternalAccountRequestMethodDelegate = exports.routeSignInRequestMethodDelegate = exports.ErrorDetailsCause = exports.EmailStatus = exports.EmailVerificationMode = void 0;
const fm = __importStar(require("../fetch.pb"));
var EmailVerificationMode;
(function (EmailVerificationMode) {
    EmailVerificationMode["EMAIL_VERIFICATION_MODE_UNSPECIFIED"] = "EMAIL_VERIFICATION_MODE_UNSPECIFIED";
    EmailVerificationMode["EMAIL_VERIFICATION_MODE_SIGNIN"] = "EMAIL_VERIFICATION_MODE_SIGNIN";
    EmailVerificationMode["EMAIL_VERIFICATION_MODE_SIGNUP"] = "EMAIL_VERIFICATION_MODE_SIGNUP";
})(EmailVerificationMode || (exports.EmailVerificationMode = EmailVerificationMode = {}));
var EmailStatus;
(function (EmailStatus) {
    EmailStatus["EMAIL_STATUS_UNSPECIFIED"] = "EMAIL_STATUS_UNSPECIFIED";
    EmailStatus["EMAIL_STATUS_ACCEPTED"] = "EMAIL_STATUS_ACCEPTED";
    EmailStatus["EMAIL_STATUS_REJECTED"] = "EMAIL_STATUS_REJECTED";
})(EmailStatus || (exports.EmailStatus = EmailStatus = {}));
var ErrorDetailsCause;
(function (ErrorDetailsCause) {
    ErrorDetailsCause["CAUSE_UNSPECIFIED"] = "CAUSE_UNSPECIFIED";
    ErrorDetailsCause["CAUSE_WRONG_VERIFICATION_MODE"] = "CAUSE_WRONG_VERIFICATION_MODE";
    ErrorDetailsCause["CAUSE_USER_ALREADY_EXISTS"] = "CAUSE_USER_ALREADY_EXISTS";
    ErrorDetailsCause["CAUSE_USER_NOT_FOUND"] = "CAUSE_USER_NOT_FOUND";
    ErrorDetailsCause["CAUSE_INVALID_TOKEN"] = "CAUSE_INVALID_TOKEN";
    ErrorDetailsCause["CAUSE_CAPTCHA"] = "CAUSE_CAPTCHA";
    ErrorDetailsCause["CAUSE_CHANNEL_OFFLINE"] = "CAUSE_CHANNEL_OFFLINE";
    ErrorDetailsCause["CAUSE_WAITLIST"] = "CAUSE_WAITLIST";
    ErrorDetailsCause["CAUSE_OAUTH2_CONSENT"] = "CAUSE_OAUTH2_CONSENT";
})(ErrorDetailsCause || (exports.ErrorDetailsCause = ErrorDetailsCause = {}));
function routeSignInRequestMethodDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.email) && delegate.onEmail(ctx, val.email);
    (val === null || val === void 0 ? void 0 : val.discordToken) && delegate.onDiscordToken(ctx, val.discordToken);
    (val === null || val === void 0 ? void 0 : val.appleIdToken) && delegate.onAppleIdToken(ctx, val.appleIdToken);
}
exports.routeSignInRequestMethodDelegate = routeSignInRequestMethodDelegate;
function routeAddExternalAccountRequestMethodDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.discordToken) && delegate.onDiscordToken(ctx, val.discordToken);
    (val === null || val === void 0 ? void 0 : val.appleIdToken) && delegate.onAppleIdToken(ctx, val.appleIdToken);
}
exports.routeAddExternalAccountRequestMethodDelegate = routeAddExternalAccountRequestMethodDelegate;
class AuthServiceV4 {
    static VerifyEmail(req, initReq) {
        return fm.fetchReq(`/v4/auth:verify_email`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ExchangeExtAuthCode(req, initReq) {
        return fm.fetchReq(`/v4/auth:exchangeExtAuthCode`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SignIn(req, initReq) {
        return fm.fetchReq(`/v4/auth:signin`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SignOut(req, initReq) {
        return fm.fetchReq(`/v4/auth/session/session:signout`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static RefreshToken(req, initReq) {
        return fm.fetchReq(`/v4/auth/session/session:refresh`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetAccount(req, initReq) {
        return fm.fetchReq(`/v4/auth/accounts/${req["userId"]}?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static AccessChannel(req, initReq) {
        return fm.fetchReq(`/v4/auth/account:access_channel`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static AddExternalAccount(req, initReq) {
        return fm.fetchReq(`/v4/auth/account:add_external_account`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteExternalAccount(req, initReq) {
        return fm.fetchReq(`/v4/auth/account:delete_external_account`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SignUp(req, initReq) {
        return fm.fetchReq(`/v4/auth:signup`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CreateTemporaryAccount(req, initReq) {
        return fm.fetchReq(`/v4/auth:signupTemporary`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CompleteTemporaryAccount(req, initReq) {
        return fm.fetchReq(`/v4/auth:completeTemporary`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static VerifySignup(req, initReq) {
        return fm.fetchReq(`/v4/auth:verify_signup`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static VerifyCaptcha(req, initReq) {
        return fm.fetchReq(`/v4/auth:verify_captcha`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SignAgreements(req, initReq) {
        return fm.fetchReq(`/v4/auth:sign_agreements`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SetBirthday(req, initReq) {
        return fm.fetchReq(`/v4/auth:set_birthday`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateMarketingConsent(req, initReq) {
        return fm.fetchReq(`/v4/auth:marketing_consent`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetOAuth2Consent(req, initReq) {
        return fm.fetchReq(`/v4/auth/accounts/${req["userId"]}/oauth2consent/${req["clientId"]}?${fm.renderURLSearchParams(req, ["userId", "clientId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static AddOAuth2Consent(req, initReq) {
        return fm.fetchReq(`/v4/auth/accounts/${req["userId"]}/oauth2consent:add`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteOAuth2Consent(req, initReq) {
        return fm.fetchReq(`/v4/auth/accounts/${req["userId"]}/oauth2consent/${req["clientId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
}
exports.AuthServiceV4 = AuthServiceV4;
class AuthInternalService {
    static PasswordSignIn(req, initReq) {
        return fm.fetchReq(`/auth.v4.AuthInternalService/PasswordSignIn`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.AuthInternalService = AuthInternalService;
class OAuthService {
    static CreateOAuthCode(req, initReq) {
        return fm.fetchReq(`/auth.v4.OAuthService/CreateOAuthCode`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static VerifyOAuthClient(req, initReq) {
        return fm.fetchReq(`/auth.v4.OAuthService/VerifyOAuthClient`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ExchangeOAuthCode(req, initReq) {
        return fm.fetchReq(`/auth.v4.OAuthService/ExchangeOAuthCode`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.OAuthService = OAuthService;
//# sourceMappingURL=authv4.pb.js.map