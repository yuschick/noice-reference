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
exports.ChatModerationService = exports.ChatService = exports.routeAutoModQueueEventEventDelegate = exports.routeChatEventEventDelegate = exports.routeMessageContentContentDelegate = exports.ModerationItemStatus = exports.ContentValidationErrorDetailsCause = exports.UserLabel = exports.AutomodDecision = exports.Reason = exports.AutomodLevel = exports.ModerationStatus = exports.ChatRole = void 0;
const fm = __importStar(require("../fetch.pb"));
var ChatRole;
(function (ChatRole) {
    ChatRole["CHAT_ROLE_UNSPECIFIED"] = "CHAT_ROLE_UNSPECIFIED";
    ChatRole["CHAT_ROLE_MEMBER"] = "CHAT_ROLE_MEMBER";
    ChatRole["CHAT_ROLE_STREAMER"] = "CHAT_ROLE_STREAMER";
    ChatRole["CHAT_ROLE_MODERATOR"] = "CHAT_ROLE_MODERATOR";
    ChatRole["CHAT_ROLE_PLATFORM_MODERATOR"] = "CHAT_ROLE_PLATFORM_MODERATOR";
})(ChatRole || (exports.ChatRole = ChatRole = {}));
var ModerationStatus;
(function (ModerationStatus) {
    ModerationStatus["MODERATION_STATUS_UNSPECIFIED"] = "MODERATION_STATUS_UNSPECIFIED";
    ModerationStatus["MODERATION_STATUS_APPROVED"] = "MODERATION_STATUS_APPROVED";
})(ModerationStatus || (exports.ModerationStatus = ModerationStatus = {}));
var AutomodLevel;
(function (AutomodLevel) {
    AutomodLevel["AUTOMOD_LEVEL_UNSPECIFIED"] = "AUTOMOD_LEVEL_UNSPECIFIED";
    AutomodLevel["AUTOMOD_LEVEL_LOW"] = "AUTOMOD_LEVEL_LOW";
    AutomodLevel["AUTOMOD_LEVEL_HIGH"] = "AUTOMOD_LEVEL_HIGH";
})(AutomodLevel || (exports.AutomodLevel = AutomodLevel = {}));
var Reason;
(function (Reason) {
    Reason["REASON_UNSPECIFIED"] = "REASON_UNSPECIFIED";
    Reason["REASON_SPAM"] = "REASON_SPAM";
    Reason["REASON_OTHER"] = "REASON_OTHER";
})(Reason || (exports.Reason = Reason = {}));
var AutomodDecision;
(function (AutomodDecision) {
    AutomodDecision["AUTOMOD_DECISION_UNSPECIFIED"] = "AUTOMOD_DECISION_UNSPECIFIED";
    AutomodDecision["AUTOMOD_DECISION_ACCEPTED"] = "AUTOMOD_DECISION_ACCEPTED";
    AutomodDecision["AUTOMOD_DECISION_REJECTED"] = "AUTOMOD_DECISION_REJECTED";
})(AutomodDecision || (exports.AutomodDecision = AutomodDecision = {}));
var UserLabel;
(function (UserLabel) {
    UserLabel["USER_LABEL_UNSPECIFIED"] = "USER_LABEL_UNSPECIFIED";
    UserLabel["USER_LABEL_STREAMER"] = "USER_LABEL_STREAMER";
    UserLabel["USER_LABEL_MODERATOR"] = "USER_LABEL_MODERATOR";
    UserLabel["USER_LABEL_STAFF"] = "USER_LABEL_STAFF";
    UserLabel["USER_LABEL_VIEWER"] = "USER_LABEL_VIEWER";
})(UserLabel || (exports.UserLabel = UserLabel = {}));
var ContentValidationErrorDetailsCause;
(function (ContentValidationErrorDetailsCause) {
    ContentValidationErrorDetailsCause["CAUSE_UNSPECIFIED"] = "CAUSE_UNSPECIFIED";
    ContentValidationErrorDetailsCause["CAUSE_GUIDELINES_VIOLATION"] = "CAUSE_GUIDELINES_VIOLATION";
    ContentValidationErrorDetailsCause["CAUSE_REQUIRES_MODERATION"] = "CAUSE_REQUIRES_MODERATION";
})(ContentValidationErrorDetailsCause || (exports.ContentValidationErrorDetailsCause = ContentValidationErrorDetailsCause = {}));
var ModerationItemStatus;
(function (ModerationItemStatus) {
    ModerationItemStatus["STATUS_UNSPECIFIED"] = "STATUS_UNSPECIFIED";
    ModerationItemStatus["STATUS_PENDING"] = "STATUS_PENDING";
    ModerationItemStatus["STATUS_ALLOWED"] = "STATUS_ALLOWED";
    ModerationItemStatus["STATUS_DENIED"] = "STATUS_DENIED";
})(ModerationItemStatus || (exports.ModerationItemStatus = ModerationItemStatus = {}));
function routeMessageContentContentDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.textContent) && delegate.onTextContent(ctx, val.textContent);
    (val === null || val === void 0 ? void 0 : val.tombstone) && delegate.onTombstone(ctx, val.tombstone);
}
exports.routeMessageContentContentDelegate = routeMessageContentContentDelegate;
function routeChatEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.chatDetails) && delegate.onChatDetails(ctx, val.chatDetails);
    (val === null || val === void 0 ? void 0 : val.message) && delegate.onMessage(ctx, val.message);
    (val === null || val === void 0 ? void 0 : val.hideMessage) && delegate.onHideMessage(ctx, val.hideMessage);
    (val === null || val === void 0 ? void 0 : val.userMuted) && delegate.onUserMuted(ctx, val.userMuted);
    (val === null || val === void 0 ? void 0 : val.messageDenied) && delegate.onMessageDenied(ctx, val.messageDenied);
    (val === null || val === void 0 ? void 0 : val.userBanned) && delegate.onUserBanned(ctx, val.userBanned);
    (val === null || val === void 0 ? void 0 : val.userUnmuted) && delegate.onUserUnmuted(ctx, val.userUnmuted);
}
exports.routeChatEventEventDelegate = routeChatEventEventDelegate;
function routeAutoModQueueEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.add) && delegate.onAdd(ctx, val.add);
    (val === null || val === void 0 ? void 0 : val.update) && delegate.onUpdate(ctx, val.update);
    (val === null || val === void 0 ? void 0 : val.remove) && delegate.onRemove(ctx, val.remove);
}
exports.routeAutoModQueueEventEventDelegate = routeAutoModQueueEventEventDelegate;
class ChatService {
    static CreateChat(req, initReq) {
        return fm.fetchReq(`/v1/chats`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetChat(req, initReq) {
        return fm.fetchReq(`/chat.ChatService/GetChat`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListChatUsers(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/chatUsers?${fm.renderURLSearchParams(req, ["chatId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListMessages(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/messages?${fm.renderURLSearchParams(req, ["chatId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ChatMessageStream(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/chats/${req["chatId"]}/messages:stream?${fm.renderURLSearchParams(req, ["chatId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/chats/${req["chatId"]}/messages:stream?${fm.renderURLSearchParams(req, ["chatId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static SendChatMessage(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/messages`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.ChatService = ChatService;
class ChatModerationService {
    static GetChatUserStatus(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/users/${req["userId"]}:chatStatus?${fm.renderURLSearchParams(req, ["chatId", "userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static HideChatMessage(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/messages/${req["messageId"]}:hide`, Object.assign(Object.assign({}, initReq), { method: "PUT" }));
    }
    static MuteChatUser(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/users/${req["userId"]}:mute`, Object.assign(Object.assign({}, initReq), { method: "PUT" }));
    }
    static UnmuteChatUser(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/users/${req["userId"]}:unmute`, Object.assign(Object.assign({}, initReq), { method: "PUT" }));
    }
    static StreamAutoModQueue(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/chats/${req["chatId"]}/automod:stream?${fm.renderURLSearchParams(req, ["chatId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/chats/${req["chatId"]}/automod:stream?${fm.renderURLSearchParams(req, ["chatId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static AllowModerationItem(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/automod/${req["moderationItemId"]}:allow`, Object.assign(Object.assign({}, initReq), { method: "PUT" }));
    }
    static DenyModerationItem(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/automod/${req["moderationItemId"]}:deny`, Object.assign(Object.assign({}, initReq), { method: "PUT" }));
    }
    static ClearModerationItem(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/automod/${req["moderationItemId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static GetMessageContext(req, initReq) {
        return fm.fetchReq(`/v1/chats/${req["chatId"]}/messages/${req["messageId"]}/context?${fm.renderURLSearchParams(req, ["chatId", "messageId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.ChatModerationService = ChatModerationService;
//# sourceMappingURL=chat.pb.js.map