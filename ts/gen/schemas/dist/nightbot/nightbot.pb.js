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
exports.NightbotService = exports.routeUserIdentityIdentityDelegate = exports.routeChatEventEventDelegate = exports.Badge = void 0;
const fm = __importStar(require("../fetch.pb"));
var Badge;
(function (Badge) {
    Badge["BADGE_UNSPECIFIED"] = "BADGE_UNSPECIFIED";
    Badge["BADGE_NOICE_STAFF"] = "BADGE_NOICE_STAFF";
    Badge["BADGE_PLATFORM_MODERATOR"] = "BADGE_PLATFORM_MODERATOR";
    Badge["BADGE_STREAMER"] = "BADGE_STREAMER";
    Badge["BADGE_CHANNEL_MODERATOR"] = "BADGE_CHANNEL_MODERATOR";
    Badge["BADGE_SUBSCRIBER"] = "BADGE_SUBSCRIBER";
    Badge["BADGE_FOLLOWER"] = "BADGE_FOLLOWER";
})(Badge || (exports.Badge = Badge = {}));
function routeChatEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.message) && delegate.onMessage(ctx, val.message);
    (val === null || val === void 0 ? void 0 : val.ping) && delegate.onPing(ctx, val.ping);
}
exports.routeChatEventEventDelegate = routeChatEventEventDelegate;
function routeUserIdentityIdentityDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.userId) && delegate.onUserId(ctx, val.userId);
    (val === null || val === void 0 ? void 0 : val.username) && delegate.onUsername(ctx, val.username);
}
exports.routeUserIdentityIdentityDelegate = routeUserIdentityIdentityDelegate;
class NightbotService {
    static GetUserInfo(req, initReq) {
        return fm.fetchReq(`/nightbot.NightbotService/GetUserInfo`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static EnableNightbot(req, initReq) {
        return fm.fetchReq(`/nightbot.NightbotService/EnableNightbot`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static JoinChannel(req, initReq) {
        return fm.fetchReq(`/nightbot.NightbotService/JoinChannel`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static LeaveChannel(req, initReq) {
        return fm.fetchReq(`/nightbot.NightbotService/LeaveChannel`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetChannelInfo(req, initReq) {
        return fm.fetchReq(`/nightbot.NightbotService/GetChannelInfo`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateChannelInfo(req, initReq) {
        return fm.fetchReq(`/nightbot.NightbotService/UpdateChannelInfo`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetChatUser(req, initReq) {
        return fm.fetchReq(`/nightbot.NightbotService/GetChatUser`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static EventStream(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/nightbot.NightbotService/EventStream`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
        }
        return fm.fetchStreamingRequest(`/nightbot.NightbotService/EventStream`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SendMessage(req, initReq) {
        return fm.fetchReq(`/nightbot.NightbotService/SendMessage`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteMessage(req, initReq) {
        return fm.fetchReq(`/nightbot.NightbotService/DeleteMessage`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static BanUser(req, initReq) {
        return fm.fetchReq(`/nightbot.NightbotService/BanUser`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.NightbotService = NightbotService;
//# sourceMappingURL=nightbot.pb.js.map