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
exports.CSiftProxyService = exports.routeModerationEventTargetDelegate = exports.ModerationEventModerationDecision = void 0;
const fm = __importStar(require("../fetch.pb"));
var ModerationEventModerationDecision;
(function (ModerationEventModerationDecision) {
    ModerationEventModerationDecision["MODERATION_DECISION_UNSPECIFIED"] = "MODERATION_DECISION_UNSPECIFIED";
    ModerationEventModerationDecision["MODERATION_DECISION_APPROVED"] = "MODERATION_DECISION_APPROVED";
    ModerationEventModerationDecision["MODERATION_DECISION_REJECTED"] = "MODERATION_DECISION_REJECTED";
})(ModerationEventModerationDecision || (exports.ModerationEventModerationDecision = ModerationEventModerationDecision = {}));
function routeModerationEventTargetDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.chatMessage) && delegate.onChatMessage(ctx, val.chatMessage);
}
exports.routeModerationEventTargetDelegate = routeModerationEventTargetDelegate;
class CSiftProxyService {
    static SearchPlayer(req, initReq) {
        return fm.fetchReq(`/v1/csiftProxy/players:search`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static BanPlayer(req, initReq) {
        return fm.fetchReq(`/v1/csiftProxy/players:ban`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UnbanPlayer(req, initReq) {
        return fm.fetchReq(`/v1/csiftProxy/players:unban`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ApproveContent(req, initReq) {
        return fm.fetchReq(`/v1/csiftProxy/content/${req["contentId"]}:approve`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static RejectContent(req, initReq) {
        return fm.fetchReq(`/v1/csiftProxy/content/${req["contentId"]}:reject`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.CSiftProxyService = CSiftProxyService;
//# sourceMappingURL=csift.pb.js.map