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
exports.FriendsService = exports.routeListMutuallyBlockedUsersRequestFilterFilterDelegate = exports.routeListFriendsRequestFilterFilterDelegate = exports.FriendshipStatusStatus = exports.FriendStatusUpdateEventUpdateType = void 0;
const fm = __importStar(require("../fetch.pb"));
var FriendStatusUpdateEventUpdateType;
(function (FriendStatusUpdateEventUpdateType) {
    FriendStatusUpdateEventUpdateType["UPDATE_TYPE_UNSPECIFIED"] = "UPDATE_TYPE_UNSPECIFIED";
    FriendStatusUpdateEventUpdateType["UPDATE_TYPE_FRIEND_INVITATION"] = "UPDATE_TYPE_FRIEND_INVITATION";
    FriendStatusUpdateEventUpdateType["UPDATE_TYPE_INVITATION_ACCEPTED"] = "UPDATE_TYPE_INVITATION_ACCEPTED";
    FriendStatusUpdateEventUpdateType["UPDATE_TYPE_USER_UNFRIENDED"] = "UPDATE_TYPE_USER_UNFRIENDED";
    FriendStatusUpdateEventUpdateType["UPDATE_TYPE_USER_BLOCKED"] = "UPDATE_TYPE_USER_BLOCKED";
    FriendStatusUpdateEventUpdateType["UPDATE_TYPE_USER_UNBLOCKED"] = "UPDATE_TYPE_USER_UNBLOCKED";
    FriendStatusUpdateEventUpdateType["UPDATE_TYPE_INVITATION_CANCELLED"] = "UPDATE_TYPE_INVITATION_CANCELLED";
})(FriendStatusUpdateEventUpdateType || (exports.FriendStatusUpdateEventUpdateType = FriendStatusUpdateEventUpdateType = {}));
var FriendshipStatusStatus;
(function (FriendshipStatusStatus) {
    FriendshipStatusStatus["STATUS_UNSPECIFIED"] = "STATUS_UNSPECIFIED";
    FriendshipStatusStatus["STATUS_FRIEND"] = "STATUS_FRIEND";
    FriendshipStatusStatus["STATUS_FRIEND_REQUEST_SENT"] = "STATUS_FRIEND_REQUEST_SENT";
    FriendshipStatusStatus["STATUS_FRIEND_REQUEST_RECEIVED"] = "STATUS_FRIEND_REQUEST_RECEIVED";
    FriendshipStatusStatus["STATUS_BLOCKED"] = "STATUS_BLOCKED";
    FriendshipStatusStatus["STATUS_BLOCKED_BY"] = "STATUS_BLOCKED_BY";
})(FriendshipStatusStatus || (exports.FriendshipStatusStatus = FriendshipStatusStatus = {}));
function routeListFriendsRequestFilterFilterDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.isOnline) && delegate.onIsOnline(ctx, val.isOnline);
    (val === null || val === void 0 ? void 0 : val.channelId) && delegate.onChannelId(ctx, val.channelId);
    (val === null || val === void 0 ? void 0 : val.streamId) && delegate.onStreamId(ctx, val.streamId);
}
exports.routeListFriendsRequestFilterFilterDelegate = routeListFriendsRequestFilterFilterDelegate;
function routeListMutuallyBlockedUsersRequestFilterFilterDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.channelId) && delegate.onChannelId(ctx, val.channelId);
}
exports.routeListMutuallyBlockedUsersRequestFilterFilterDelegate = routeListMutuallyBlockedUsersRequestFilterFilterDelegate;
class FriendsService {
    static SendFriendRequest(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["friendId"]}/friendRequests`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListFriends(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/friends?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListSentFriendRequests(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/sentFriendRequests?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListReceivedFriendRequests(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/friendRequests?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListBlockedUsers(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/blockedUsers?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListMutuallyBlockedUsers(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/mutuallyBlockedUsers?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static AddFriend(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/friends`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteFriend(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/friends/${req["friendId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static AcceptFriendRequest(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/friendRequests:accept`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteFriendRequest(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/friendRequests/${req["friendId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static BlockUser(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/blockedUsers`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UnblockUser(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/blockedUsers/${req["blockedUserId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static GetFriendshipStatus(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/friendshipStatus?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetFriendsSettings(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/settings/friends?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static UpdateFriendsSettings(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/settings/friends`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static GetChannelActiveFriends(req, initReq) {
        return fm.fetchReq(`/v1/users:channelActiveFriends?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.FriendsService = FriendsService;
//# sourceMappingURL=friends.pb.js.map