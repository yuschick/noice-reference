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
exports.StreamerService = exports.routeStreamEventContentDelegate = exports.StreamEventFilterEventType = void 0;
const fm = __importStar(require("../fetch.pb"));
var StreamEventFilterEventType;
(function (StreamEventFilterEventType) {
    StreamEventFilterEventType["EVENT_TYPE_UNSPECIFIED"] = "EVENT_TYPE_UNSPECIFIED";
    StreamEventFilterEventType["EVENT_TYPE_ACTIVE_CARD_SUCCEEDED"] = "EVENT_TYPE_ACTIVE_CARD_SUCCEEDED";
    StreamEventFilterEventType["EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED"] = "EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED";
    StreamEventFilterEventType["EVENT_TYPE_PLAYER_JOINED"] = "EVENT_TYPE_PLAYER_JOINED";
    StreamEventFilterEventType["EVENT_TYPE_CHANNEL_FOLLOWED"] = "EVENT_TYPE_CHANNEL_FOLLOWED";
    StreamEventFilterEventType["EVENT_TYPE_CHANNEL_SUBSCRIBED"] = "EVENT_TYPE_CHANNEL_SUBSCRIBED";
    StreamEventFilterEventType["EVENT_TYPE_CHANNEL_SUBSCRIPTION_GIFTED"] = "EVENT_TYPE_CHANNEL_SUBSCRIPTION_GIFTED";
})(StreamEventFilterEventType || (exports.StreamEventFilterEventType = StreamEventFilterEventType = {}));
function routeStreamEventContentDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.ping) && delegate.onPing(ctx, val.ping);
    (val === null || val === void 0 ? void 0 : val.gameCardSucceeded) && delegate.onGameCardSucceeded(ctx, val.gameCardSucceeded);
    (val === null || val === void 0 ? void 0 : val.highScoringCardPromoted) && delegate.onHighScoringCardPromoted(ctx, val.highScoringCardPromoted);
    (val === null || val === void 0 ? void 0 : val.matchEnded) && delegate.onMatchEnded(ctx, val.matchEnded);
    (val === null || val === void 0 ? void 0 : val.matchStarted) && delegate.onMatchStarted(ctx, val.matchStarted);
    (val === null || val === void 0 ? void 0 : val.playerJoined) && delegate.onPlayerJoined(ctx, val.playerJoined);
    (val === null || val === void 0 ? void 0 : val.channelFollowed) && delegate.onChannelFollowed(ctx, val.channelFollowed);
    (val === null || val === void 0 ? void 0 : val.stateUpdated) && delegate.onStateUpdated(ctx, val.stateUpdated);
    (val === null || val === void 0 ? void 0 : val.channelSubscribed) && delegate.onChannelSubscribed(ctx, val.channelSubscribed);
    (val === null || val === void 0 ? void 0 : val.subscriptionGifted) && delegate.onSubscriptionGifted(ctx, val.subscriptionGifted);
}
exports.routeStreamEventContentDelegate = routeStreamEventContentDelegate;
class StreamerService {
    static StreamEvents(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/streamer/streams/${req["streamId"]}/events?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/streamer/streams/${req["streamId"]}/events?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ActivateContextualTeamAction(req, initReq) {
        return fm.fetchReq(`/v1/streamer/streams/${req["streamId"]}:invokeContextualTeamAction`, Object.assign(Object.assign({}, initReq), { method: "POST" }));
    }
    static TriggerCameraTransition(req, initReq) {
        return fm.fetchReq(`/v1/streamer/streams/${req["streamId"]}:triggerCameraTransition`, Object.assign(Object.assign({}, initReq), { method: "POST" }));
    }
}
exports.StreamerService = StreamerService;
//# sourceMappingURL=streamer.pb.js.map