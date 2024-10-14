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
exports.ChannelInternalService = exports.ChannelService = exports.routeChannelEventContentContentDelegate = exports.ChannelFollowerUpdateEventUpdateType = exports.ChannelUpdateEventUpdateType = exports.ChannelLinkLinkType = exports.SuspensionReason = exports.AssetType = exports.ChannelRole = exports.ChannelFeature = void 0;
const fm = __importStar(require("../fetch.pb"));
var ChannelFeature;
(function (ChannelFeature) {
    ChannelFeature["CHANNEL_FEATURE_UNSPECIFIED"] = "CHANNEL_FEATURE_UNSPECIFIED";
    ChannelFeature["CHANNEL_FEATURE_STREAMING"] = "CHANNEL_FEATURE_STREAMING";
    ChannelFeature["CHANNEL_FEATURE_NOICE_PREDICTIONS"] = "CHANNEL_FEATURE_NOICE_PREDICTIONS";
})(ChannelFeature || (exports.ChannelFeature = ChannelFeature = {}));
var ChannelRole;
(function (ChannelRole) {
    ChannelRole["CHANNEL_ROLE_UNSPECIFIED"] = "CHANNEL_ROLE_UNSPECIFIED";
    ChannelRole["CHANNEL_ROLE_STREAMER"] = "CHANNEL_ROLE_STREAMER";
    ChannelRole["CHANNEL_ROLE_MODERATOR"] = "CHANNEL_ROLE_MODERATOR";
    ChannelRole["CHANNEL_ROLE_PLATFORM_MODERATOR"] = "CHANNEL_ROLE_PLATFORM_MODERATOR";
})(ChannelRole || (exports.ChannelRole = ChannelRole = {}));
var AssetType;
(function (AssetType) {
    AssetType["ASSET_TYPE_UNSPECIFIED"] = "ASSET_TYPE_UNSPECIFIED";
    AssetType["ASSET_TYPE_LOGO"] = "ASSET_TYPE_LOGO";
    AssetType["ASSET_TYPE_BANNER"] = "ASSET_TYPE_BANNER";
})(AssetType || (exports.AssetType = AssetType = {}));
var SuspensionReason;
(function (SuspensionReason) {
    SuspensionReason["REASON_UNSPECIFIED"] = "REASON_UNSPECIFIED";
    SuspensionReason["REASON_CHANNEL_DELETED"] = "REASON_CHANNEL_DELETED";
})(SuspensionReason || (exports.SuspensionReason = SuspensionReason = {}));
var ChannelLinkLinkType;
(function (ChannelLinkLinkType) {
    ChannelLinkLinkType["LINK_TYPE_UNSPECIFIED"] = "LINK_TYPE_UNSPECIFIED";
    ChannelLinkLinkType["LINK_TYPE_CUSTOM"] = "LINK_TYPE_CUSTOM";
    ChannelLinkLinkType["LINK_TYPE_DISCORD"] = "LINK_TYPE_DISCORD";
    ChannelLinkLinkType["LINK_TYPE_YOUTUBE"] = "LINK_TYPE_YOUTUBE";
    ChannelLinkLinkType["LINK_TYPE_TWITTER"] = "LINK_TYPE_TWITTER";
    ChannelLinkLinkType["LINK_TYPE_FACEBOOK"] = "LINK_TYPE_FACEBOOK";
    ChannelLinkLinkType["LINK_TYPE_INSTAGRAM"] = "LINK_TYPE_INSTAGRAM";
    ChannelLinkLinkType["LINK_TYPE_TIKTOK"] = "LINK_TYPE_TIKTOK";
})(ChannelLinkLinkType || (exports.ChannelLinkLinkType = ChannelLinkLinkType = {}));
var ChannelUpdateEventUpdateType;
(function (ChannelUpdateEventUpdateType) {
    ChannelUpdateEventUpdateType["UPDATE_TYPE_UNSPECIFIED"] = "UPDATE_TYPE_UNSPECIFIED";
    ChannelUpdateEventUpdateType["UPDATE_TYPE_CREATED"] = "UPDATE_TYPE_CREATED";
    ChannelUpdateEventUpdateType["UPDATE_TYPE_UPDATED"] = "UPDATE_TYPE_UPDATED";
})(ChannelUpdateEventUpdateType || (exports.ChannelUpdateEventUpdateType = ChannelUpdateEventUpdateType = {}));
var ChannelFollowerUpdateEventUpdateType;
(function (ChannelFollowerUpdateEventUpdateType) {
    ChannelFollowerUpdateEventUpdateType["UPDATE_TYPE_UNSPECIFIED"] = "UPDATE_TYPE_UNSPECIFIED";
    ChannelFollowerUpdateEventUpdateType["UPDATE_TYPE_FOLLOWED"] = "UPDATE_TYPE_FOLLOWED";
    ChannelFollowerUpdateEventUpdateType["UPDATE_TYPE_UNFOLLOWED"] = "UPDATE_TYPE_UNFOLLOWED";
})(ChannelFollowerUpdateEventUpdateType || (exports.ChannelFollowerUpdateEventUpdateType = ChannelFollowerUpdateEventUpdateType = {}));
function routeChannelEventContentContentDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.bundlePurchase) && delegate.onBundlePurchase(ctx, val.bundlePurchase);
    (val === null || val === void 0 ? void 0 : val.subscriptionPurchase) && delegate.onSubscriptionPurchase(ctx, val.subscriptionPurchase);
    (val === null || val === void 0 ? void 0 : val.streamerCardPurchase) && delegate.onStreamerCardPurchase(ctx, val.streamerCardPurchase);
    (val === null || val === void 0 ? void 0 : val.giftSubscriptionPurchase) && delegate.onGiftSubscriptionPurchase(ctx, val.giftSubscriptionPurchase);
}
exports.routeChannelEventContentContentDelegate = routeChannelEventContentContentDelegate;
class ChannelService {
    static ListChannels(req, initReq) {
        return fm.fetchReq(`/v1/channels?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetChannel(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetChannelByName(req, initReq) {
        return fm.fetchReq(`/v1/channels:getByName`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static BatchGetChannels(req, initReq) {
        return fm.fetchReq(`/v1/channels:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetUserChannel(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/channel?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetUserChannels(req, initReq) {
        return fm.fetchReq(`/v1/channels:batchGetByUser?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static StreamGetChannel(req, initReq) {
        return fm.fetchReq(`/v1/streams/${req["streamId"]}:getChannel?${fm.renderURLSearchParams(req, ["streamId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchStreamGetChannel(req, initReq) {
        return fm.fetchReq(`/v1/streams:batchGetChannel?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreateChannel(req, initReq) {
        return fm.fetchReq(`/v1/channels`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static InsertFixedChannel(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["id"]}:fixedChannel`, Object.assign(Object.assign({}, initReq), { method: "PUT", body: JSON.stringify(req) }));
    }
    static DeleteChannel(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["id"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static UpdateChannelDetails(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["body"]["id"]}`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static CreateChannelAssetUploadToken(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}:assetUploadToken`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteChannelAsset(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/assets/${req["assetType"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static SetUserChannelRoles(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/roles/${req["userId"]}`, Object.assign(Object.assign({}, initReq), { method: "PUT", body: JSON.stringify(req) }));
    }
    static ListUserPrivilegedChannels(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/channel_roles?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListUserChannelRoles(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/roles/${req["userId"]}?${fm.renderURLSearchParams(req, ["channelId", "userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListChannelPrivilegedUsers(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/privilegedUsers?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ChannelEventStream(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/channels/${req["channelId"]}/events:stream?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/channels/${req["channelId"]}/events:stream?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static LiveStatusUpdates(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/channels/${req["channelId"]}/liveStatus?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/channels/${req["channelId"]}/liveStatus?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ChannelStreamDetailUpdates(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/channels/${req["channelId"]}/streamDetails?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/channels/${req["channelId"]}/streamDetails?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ViewerCountUpdates(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/channels/${req["channelId"]}/viewerCount?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/channels/${req["channelId"]}/viewerCount?${fm.renderURLSearchParams(req, ["channelId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static FollowChannel(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/followers/${req["userId"]}`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UnfollowChannel(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/followers/${req["userId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static GetUserFollowedChannels(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/followedChannels?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetFollowStatus(req, initReq) {
        return fm.fetchReq(`/v1/channels/followStatus?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetChannelFollowerStatus(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/followers/${req["userId"]}?${fm.renderURLSearchParams(req, ["channelId", "userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListStreams(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/streams?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetStream(req, initReq) {
        return fm.fetchReq(`/v1/streams/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreateStreamThumbnailUploadToken(req, initReq) {
        return fm.fetchReq(`/v1/streams/${req["streamId"]}:thumbnailUploadToken`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateMonetizationSettings(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["body"]["channelId"]}/monetizationSettings`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
}
exports.ChannelService = ChannelService;
class ChannelInternalService {
    static GetChannelFollowerStatus(req, initReq) {
        return fm.fetchReq(`/channel.ChannelInternalService/GetChannelFollowerStatus`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static BatchGetChannelMonetizationSettings(req, initReq) {
        return fm.fetchReq(`/channel.ChannelInternalService/BatchGetChannelMonetizationSettings`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.ChannelInternalService = ChannelInternalService;
//# sourceMappingURL=channel.pb.js.map