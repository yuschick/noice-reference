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
exports.StreamEgressService = exports.routeUserEventEventDelegate = exports.routeWatchEventEventDelegate = exports.routeWatchActionActionDelegate = exports.routeAvatarUpdateUpdateDelegate = exports.MediaKind = exports.IceTransportPolicy = exports.StreamType = void 0;
const fm = __importStar(require("../fetch.pb"));
var StreamType;
(function (StreamType) {
    StreamType["STREAM_TYPE_UNSPECIFIED"] = "STREAM_TYPE_UNSPECIFIED";
    StreamType["STREAM_TYPE_CR"] = "STREAM_TYPE_CR";
    StreamType["STREAM_TYPE_SOURCE"] = "STREAM_TYPE_SOURCE";
})(StreamType || (exports.StreamType = StreamType = {}));
var IceTransportPolicy;
(function (IceTransportPolicy) {
    IceTransportPolicy["ICE_TRANSPORT_POLICY_UNSPECIFIED"] = "ICE_TRANSPORT_POLICY_UNSPECIFIED";
    IceTransportPolicy["ICE_TRANSPORT_POLICY_ALL"] = "ICE_TRANSPORT_POLICY_ALL";
    IceTransportPolicy["ICE_TRANSPORT_POLICY_RELAY"] = "ICE_TRANSPORT_POLICY_RELAY";
})(IceTransportPolicy || (exports.IceTransportPolicy = IceTransportPolicy = {}));
var MediaKind;
(function (MediaKind) {
    MediaKind["MEDIA_KIND_UNSPECIFIED"] = "MEDIA_KIND_UNSPECIFIED";
    MediaKind["MEDIA_KIND_AUDIO"] = "MEDIA_KIND_AUDIO";
    MediaKind["MEDIA_KIND_VIDEO"] = "MEDIA_KIND_VIDEO";
})(MediaKind || (exports.MediaKind = MediaKind = {}));
function routeAvatarUpdateUpdateDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.placement) && delegate.onPlacement(ctx, val.placement);
    (val === null || val === void 0 ? void 0 : val.removal) && delegate.onRemoval(ctx, val.removal);
}
exports.routeAvatarUpdateUpdateDelegate = routeAvatarUpdateUpdateDelegate;
function routeWatchActionActionDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.start) && delegate.onStart(ctx, val.start);
    (val === null || val === void 0 ? void 0 : val.stop) && delegate.onStop(ctx, val.stop);
    (val === null || val === void 0 ? void 0 : val.candidate) && delegate.onCandidate(ctx, val.candidate);
    (val === null || val === void 0 ? void 0 : val.selectQualityLayer) && delegate.onSelectQualityLayer(ctx, val.selectQualityLayer);
    (val === null || val === void 0 ? void 0 : val.watch) && delegate.onWatch(ctx, val.watch);
    (val === null || val === void 0 ? void 0 : val.selectGroup) && delegate.onSelectGroup(ctx, val.selectGroup);
    (val === null || val === void 0 ? void 0 : val.offer) && delegate.onOffer(ctx, val.offer);
}
exports.routeWatchActionActionDelegate = routeWatchActionActionDelegate;
function routeWatchEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.ack) && delegate.onAck(ctx, val.ack);
    (val === null || val === void 0 ? void 0 : val.error) && delegate.onError(ctx, val.error);
    (val === null || val === void 0 ? void 0 : val.offer) && delegate.onOffer(ctx, val.offer);
    (val === null || val === void 0 ? void 0 : val.avatarPlacement) && delegate.onAvatarPlacement(ctx, val.avatarPlacement);
    (val === null || val === void 0 ? void 0 : val.avatarRemoval) && delegate.onAvatarRemoval(ctx, val.avatarRemoval);
    (val === null || val === void 0 ? void 0 : val.serverShuttingDown) && delegate.onServerShuttingDown(ctx, val.serverShuttingDown);
    (val === null || val === void 0 ? void 0 : val.keyValueOp) && delegate.onKeyValueOp(ctx, val.keyValueOp);
    (val === null || val === void 0 ? void 0 : val.signal) && delegate.onSignal(ctx, val.signal);
    (val === null || val === void 0 ? void 0 : val.iceCandidate) && delegate.onIceCandidate(ctx, val.iceCandidate);
    (val === null || val === void 0 ? void 0 : val.qualityLayerSelected) && delegate.onQualityLayerSelected(ctx, val.qualityLayerSelected);
    (val === null || val === void 0 ? void 0 : val.initPeerConnection) && delegate.onInitPeerConnection(ctx, val.initPeerConnection);
    (val === null || val === void 0 ? void 0 : val.answer) && delegate.onAnswer(ctx, val.answer);
}
exports.routeWatchEventEventDelegate = routeWatchEventEventDelegate;
function routeUserEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.watchStart) && delegate.onWatchStart(ctx, val.watchStart);
    (val === null || val === void 0 ? void 0 : val.watchStop) && delegate.onWatchStop(ctx, val.watchStop);
}
exports.routeUserEventEventDelegate = routeUserEventEventDelegate;
class StreamEgressService {
    static Watch(entityNotifier, errorCallback, initReq) {
        return fm.biDirectionalStreamingRequest(`/stream_egress.StreamEgressService/Watch`, entityNotifier, errorCallback, Object.assign({}, initReq));
    }
    static WatchRecording(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/channels/${req["channelId"]}/streams/${req["streamId"]}/hls?${fm.renderURLSearchParams(req, ["channelId", "streamId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/channels/${req["channelId"]}/streams/${req["streamId"]}/hls?${fm.renderURLSearchParams(req, ["channelId", "streamId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.StreamEgressService = StreamEgressService;
//# sourceMappingURL=egress.pb.js.map