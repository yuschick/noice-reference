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
exports.SupportService = exports.routeReportContextValueDelegate = exports.ReportContextChannelTarget = exports.ReportContextUserTarget = exports.ReportReason = exports.ReportCaseResolution = exports.ReportCaseStatus = void 0;
const fm = __importStar(require("../fetch.pb"));
var ReportCaseStatus;
(function (ReportCaseStatus) {
    ReportCaseStatus["REPORT_CASE_STATUS_UNSPECIFIED"] = "REPORT_CASE_STATUS_UNSPECIFIED";
    ReportCaseStatus["REPORT_CASE_STATUS_OPEN"] = "REPORT_CASE_STATUS_OPEN";
    ReportCaseStatus["REPORT_CASE_STATUS_CLOSED"] = "REPORT_CASE_STATUS_CLOSED";
})(ReportCaseStatus || (exports.ReportCaseStatus = ReportCaseStatus = {}));
var ReportCaseResolution;
(function (ReportCaseResolution) {
    ReportCaseResolution["REPORT_CASE_RESOLUTION_UNSPECIFIED"] = "REPORT_CASE_RESOLUTION_UNSPECIFIED";
    ReportCaseResolution["REPORT_CASE_RESOLUTION_ALLOW_CONTENT"] = "REPORT_CASE_RESOLUTION_ALLOW_CONTENT";
    ReportCaseResolution["REPORT_CASE_RESOLUTION_REMOVE_CONTENT"] = "REPORT_CASE_RESOLUTION_REMOVE_CONTENT";
})(ReportCaseResolution || (exports.ReportCaseResolution = ReportCaseResolution = {}));
var ReportReason;
(function (ReportReason) {
    ReportReason["REPORT_REASON_UNSPECIFIED"] = "REPORT_REASON_UNSPECIFIED";
    ReportReason["REPORT_REASON_CHILD_SAFETY_CHILD_ABUSE"] = "REPORT_REASON_CHILD_SAFETY_CHILD_ABUSE";
    ReportReason["REPORT_REASON_CHILD_SAFETY_DANGEROUS"] = "REPORT_REASON_CHILD_SAFETY_DANGEROUS";
    ReportReason["REPORT_REASON_CHILD_SAFETY_UNDERAGE_USER"] = "REPORT_REASON_CHILD_SAFETY_UNDERAGE_USER";
    ReportReason["REPORT_REASON_CHILD_SAFETY_CSE"] = "REPORT_REASON_CHILD_SAFETY_CSE";
    ReportReason["REPORT_REASON_GRAPHIC_MEDIA_ANIMAL_ABUSE"] = "REPORT_REASON_GRAPHIC_MEDIA_ANIMAL_ABUSE";
    ReportReason["REPORT_REASON_GRAPHIC_MEDIA_GORE"] = "REPORT_REASON_GRAPHIC_MEDIA_GORE";
    ReportReason["REPORT_REASON_GRAPHIC_MEDIA_VIOLENCE"] = "REPORT_REASON_GRAPHIC_MEDIA_VIOLENCE";
    ReportReason["REPORT_REASON_HARASSMENT"] = "REPORT_REASON_HARASSMENT";
    ReportReason["REPORT_REASON_HARASSMENT_BLACKMAIL"] = "REPORT_REASON_HARASSMENT_BLACKMAIL";
    ReportReason["REPORT_REASON_HARASSMENT_INCITEMENT"] = "REPORT_REASON_HARASSMENT_INCITEMENT";
    ReportReason["REPORT_REASON_HARASSMENT_NON_CONSENSUAL_INTIMATE_IMAGES"] = "REPORT_REASON_HARASSMENT_NON_CONSENSUAL_INTIMATE_IMAGES";
    ReportReason["REPORT_REASON_HARASSMENT_SEXUAL_NON_CONSENSUAL"] = "REPORT_REASON_HARASSMENT_SEXUAL_NON_CONSENSUAL";
    ReportReason["REPORT_REASON_HARASSMENT_STALKING"] = "REPORT_REASON_HARASSMENT_STALKING";
    ReportReason["REPORT_REASON_HATEFUL_BEHAVIOR"] = "REPORT_REASON_HATEFUL_BEHAVIOR";
    ReportReason["REPORT_REASON_ILLEGAL_ALCOHOL_NICOTINE"] = "REPORT_REASON_ILLEGAL_ALCOHOL_NICOTINE";
    ReportReason["REPORT_REASON_ILLEGAL_DRUGS"] = "REPORT_REASON_ILLEGAL_DRUGS";
    ReportReason["REPORT_REASON_ILLEGAL_MANIPULATION"] = "REPORT_REASON_ILLEGAL_MANIPULATION";
    ReportReason["REPORT_REASON_ILLEGAL_SPAM"] = "REPORT_REASON_ILLEGAL_SPAM";
    ReportReason["REPORT_REASON_ILLEGAL_ACTIVITY_SALE"] = "REPORT_REASON_ILLEGAL_ACTIVITY_SALE";
    ReportReason["REPORT_REASON_ILLEGAL_ACTIVITY_WEAPONS"] = "REPORT_REASON_ILLEGAL_ACTIVITY_WEAPONS";
    ReportReason["REPORT_REASON_IMPERSONATION"] = "REPORT_REASON_IMPERSONATION";
    ReportReason["REPORT_REASON_INAUTHENTIC_GAMEPLAY"] = "REPORT_REASON_INAUTHENTIC_GAMEPLAY";
    ReportReason["REPORT_REASON_POSSIBLE_ILLEGAL_ACTIVITY"] = "REPORT_REASON_POSSIBLE_ILLEGAL_ACTIVITY";
    ReportReason["REPORT_REASON_OFF_PLATFORM"] = "REPORT_REASON_OFF_PLATFORM";
    ReportReason["REPORT_REASON_RESTRICTED_GAMES_INHERENTLY_VIOLATIVE"] = "REPORT_REASON_RESTRICTED_GAMES_INHERENTLY_VIOLATIVE";
    ReportReason["REPORT_REASON_RESTRICTED_GAMES_MATURE"] = "REPORT_REASON_RESTRICTED_GAMES_MATURE";
    ReportReason["REPORT_REASON_SELF_HARM"] = "REPORT_REASON_SELF_HARM";
    ReportReason["REPORT_REASON_SEXUAL_BEHAVIOR_EXPLICIT"] = "REPORT_REASON_SEXUAL_BEHAVIOR_EXPLICIT";
    ReportReason["REPORT_REASON_SEXUAL_BEHAVIOR_SUGGESTIVE"] = "REPORT_REASON_SEXUAL_BEHAVIOR_SUGGESTIVE";
    ReportReason["REPORT_REASON_SPAM"] = "REPORT_REASON_SPAM";
    ReportReason["REPORT_REASON_SPAM_SUSPENSION_EVASION"] = "REPORT_REASON_SPAM_SUSPENSION_EVASION";
    ReportReason["REPORT_REASON_UNKNOWN"] = "REPORT_REASON_UNKNOWN";
    ReportReason["REPORT_REASON_VIOLENCE_EXTREMISM"] = "REPORT_REASON_VIOLENCE_EXTREMISM";
    ReportReason["REPORT_REASON_PLATFORM_RULES_VIOLATION"] = "REPORT_REASON_PLATFORM_RULES_VIOLATION";
})(ReportReason || (exports.ReportReason = ReportReason = {}));
var ReportContextUserTarget;
(function (ReportContextUserTarget) {
    ReportContextUserTarget["TARGET_UNSPECIFIED"] = "TARGET_UNSPECIFIED";
    ReportContextUserTarget["TARGET_NAME"] = "TARGET_NAME";
})(ReportContextUserTarget || (exports.ReportContextUserTarget = ReportContextUserTarget = {}));
var ReportContextChannelTarget;
(function (ReportContextChannelTarget) {
    ReportContextChannelTarget["TARGET_UNSPECIFIED"] = "TARGET_UNSPECIFIED";
    ReportContextChannelTarget["TARGET_NAME"] = "TARGET_NAME";
    ReportContextChannelTarget["TARGET_DESCRIPTION"] = "TARGET_DESCRIPTION";
})(ReportContextChannelTarget || (exports.ReportContextChannelTarget = ReportContextChannelTarget = {}));
function routeReportContextValueDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.user) && delegate.onUser(ctx, val.user);
    (val === null || val === void 0 ? void 0 : val.channel) && delegate.onChannel(ctx, val.channel);
    (val === null || val === void 0 ? void 0 : val.stream) && delegate.onStream(ctx, val.stream);
    (val === null || val === void 0 ? void 0 : val.chatMessage) && delegate.onChatMessage(ctx, val.chatMessage);
}
exports.routeReportContextValueDelegate = routeReportContextValueDelegate;
class SupportService {
    static CreateTicket(req, initReq) {
        return fm.fetchReq(`/v1/support/tickets`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetArticle(req, initReq) {
        return fm.fetchReq(`/v1/support/articles/${req["locale"]}/${req["id"]}?${fm.renderURLSearchParams(req, ["locale", "id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetAttachment(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/support/attachments/${req["locale"]}/${req["id"]}?${fm.renderURLSearchParams(req, ["locale", "id"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/support/attachments/${req["locale"]}/${req["id"]}?${fm.renderURLSearchParams(req, ["locale", "id"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreateZendeskToken(req, initReq) {
        return fm.fetchReq(`/v1/support/zendesk:token`, Object.assign(Object.assign({}, initReq), { method: "POST" }));
    }
    static CreateReport(req, initReq) {
        return fm.fetchReq(`/v1/support/reports`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListReports(req, initReq) {
        return fm.fetchReq(`/v1/support/reports?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetReportCase(req, initReq) {
        return fm.fetchReq(`/v1/support/cases/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetReports(req, initReq) {
        return fm.fetchReq(`/v1/support/reports:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ResolveReportCase(req, initReq) {
        return fm.fetchReq(`/v1/support/cases/${req["id"]}:resolve`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.SupportService = SupportService;
//# sourceMappingURL=support.pb.js.map