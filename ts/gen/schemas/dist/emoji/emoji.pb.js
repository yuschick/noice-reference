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
exports.PlatformEmojiService = exports.ChannelEmojiService = exports.EmojiService = void 0;
const fm = __importStar(require("../fetch.pb"));
class EmojiService {
    static CreateEmojiUploadToken(req, initReq) {
        return fm.fetchReq(`/v1/emojis:uploadToken`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetEmoji(req, initReq) {
        return fm.fetchReq(`/v1/emojis/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetEmojis(req, initReq) {
        return fm.fetchReq(`/v1/emojis:batchGet`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.EmojiService = EmojiService;
class ChannelEmojiService {
    static CreateChannelEmoji(req, initReq) {
        return fm.fetchReq(`/v2/channels/${req["channelId"]}/emojis`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateChannelEmoji(req, initReq) {
        return fm.fetchReq(`/v2/channels/${req["body"]["channelId"]}/emojis/${req["body"]["id"]}`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static DeleteChannelEmoji(req, initReq) {
        return fm.fetchReq(`/v2/channels/${req["channelId"]}/emojis/${req["id"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static ListChannelEmojis(req, initReq) {
        return fm.fetchReq(`/v2/channels/${req["channelId"]}/emojis?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.ChannelEmojiService = ChannelEmojiService;
class PlatformEmojiService {
    static CreatePlatformEmoji(req, initReq) {
        return fm.fetchReq(`/v2/emojis`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdatePlatformEmoji(req, initReq) {
        return fm.fetchReq(`/v2/emojis/${req["body"]["id"]}`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static DeletePlatformEmoji(req, initReq) {
        return fm.fetchReq(`/v2/emojis/${req["id"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static ListPlatformEmojis(req, initReq) {
        return fm.fetchReq(`/v2/emojis?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.PlatformEmojiService = PlatformEmojiService;
//# sourceMappingURL=emoji.pb.js.map