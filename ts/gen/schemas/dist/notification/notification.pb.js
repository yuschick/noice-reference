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
exports.NotificationSenderService = exports.NotificationService = exports.routeNotificationContentContentDelegate = void 0;
const fm = __importStar(require("../fetch.pb"));
function routeNotificationContentContentDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.ping) && delegate.onPing(ctx, val.ping);
    (val === null || val === void 0 ? void 0 : val.reward) && delegate.onReward(ctx, val.reward);
    (val === null || val === void 0 ? void 0 : val.goalCardProgress) && delegate.onGoalCardProgress(ctx, val.goalCardProgress);
    (val === null || val === void 0 ? void 0 : val.progressionUpdate) && delegate.onProgressionUpdate(ctx, val.progressionUpdate);
    (val === null || val === void 0 ? void 0 : val.inventoryUpdate) && delegate.onInventoryUpdate(ctx, val.inventoryUpdate);
    (val === null || val === void 0 ? void 0 : val.placementStateUpdate) && delegate.onPlacementStateUpdate(ctx, val.placementStateUpdate);
    (val === null || val === void 0 ? void 0 : val.friendStatusUpdate) && delegate.onFriendStatusUpdate(ctx, val.friendStatusUpdate);
    (val === null || val === void 0 ? void 0 : val.partyInvitationUpdate) && delegate.onPartyInvitationUpdate(ctx, val.partyInvitationUpdate);
    (val === null || val === void 0 ? void 0 : val.userDataExportComplete) && delegate.onUserDataExportComplete(ctx, val.userDataExportComplete);
    (val === null || val === void 0 ? void 0 : val.channelUserBanned) && delegate.onChannelUserBanned(ctx, val.channelUserBanned);
    (val === null || val === void 0 ? void 0 : val.platformUserBanned) && delegate.onPlatformUserBanned(ctx, val.platformUserBanned);
    (val === null || val === void 0 ? void 0 : val.channelSubscriptionUpdate) && delegate.onChannelSubscriptionUpdate(ctx, val.channelSubscriptionUpdate);
    (val === null || val === void 0 ? void 0 : val.walletTransaction) && delegate.onWalletTransaction(ctx, val.walletTransaction);
    (val === null || val === void 0 ? void 0 : val.forcedSignout) && delegate.onForcedSignout(ctx, val.forcedSignout);
    (val === null || val === void 0 ? void 0 : val.invitationCodeUpdate) && delegate.onInvitationCodeUpdate(ctx, val.invitationCodeUpdate);
    (val === null || val === void 0 ? void 0 : val.giftSubscription) && delegate.onGiftSubscription(ctx, val.giftSubscription);
}
exports.routeNotificationContentContentDelegate = routeNotificationContentContentDelegate;
class NotificationService {
    static ListNotifications(req, initReq) {
        return fm.fetchReq(`/v1/notifications?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static MarkNotificationsRead(req, initReq) {
        return fm.fetchReq(`/v1/notifications/read`, Object.assign(Object.assign({}, initReq), { method: "POST" }));
    }
    static MarkNotificationRead(req, initReq) {
        return fm.fetchReq(`/v1/notifications/${req["id"]}:markRead`, Object.assign(Object.assign({}, initReq), { method: "POST" }));
    }
    static BatchMarkNotificationsRead(req, initReq) {
        return fm.fetchReq(`/v1/notifications:batchMarkRead`, Object.assign(Object.assign({}, initReq), { method: "POST" }));
    }
    static DeleteNotification(req, initReq) {
        return fm.fetchReq(`/v1/notifications/${req["id"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static BatchDeleteNotifications(req, initReq) {
        return fm.fetchReq(`/v1/notifications:batchDelete`, Object.assign(Object.assign({}, initReq), { method: "POST" }));
    }
    static Notifications(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/notifications/stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/notifications/stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.NotificationService = NotificationService;
class NotificationSenderService {
    static SendNotification(req, initReq) {
        return fm.fetchReq(`/notification.NotificationSenderService/SendNotification`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.NotificationSenderService = NotificationSenderService;
//# sourceMappingURL=notification.pb.js.map