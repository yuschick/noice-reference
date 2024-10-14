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
exports.RTC = exports.routeReplyPayloadDelegate = exports.routeRequestPayloadDelegate = exports.TrackEventState = exports.MediaType = exports.Target = void 0;
const fm = __importStar(require("../fetch.pb"));
var Target;
(function (Target) {
    Target["PUBLISHER"] = "PUBLISHER";
    Target["SUBSCRIBER"] = "SUBSCRIBER";
})(Target || (exports.Target = Target = {}));
var MediaType;
(function (MediaType) {
    MediaType["MediaUnknown"] = "MediaUnknown";
    MediaType["UserMedia"] = "UserMedia";
    MediaType["ScreenCapture"] = "ScreenCapture";
    MediaType["Canvas"] = "Canvas";
    MediaType["Streaming"] = "Streaming";
    MediaType["VoIP"] = "VoIP";
})(MediaType || (exports.MediaType = MediaType = {}));
var TrackEventState;
(function (TrackEventState) {
    TrackEventState["ADD"] = "ADD";
    TrackEventState["UPDATE"] = "UPDATE";
    TrackEventState["REMOVE"] = "REMOVE";
})(TrackEventState || (exports.TrackEventState = TrackEventState = {}));
function routeRequestPayloadDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.join) && delegate.onJoin(ctx, val.join);
    (val === null || val === void 0 ? void 0 : val.description) && delegate.onDescription(ctx, val.description);
    (val === null || val === void 0 ? void 0 : val.trickle) && delegate.onTrickle(ctx, val.trickle);
    (val === null || val === void 0 ? void 0 : val.subscription) && delegate.onSubscription(ctx, val.subscription);
    (val === null || val === void 0 ? void 0 : val.getOffer) && delegate.onGetOffer(ctx, val.getOffer);
}
exports.routeRequestPayloadDelegate = routeRequestPayloadDelegate;
function routeReplyPayloadDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.join) && delegate.onJoin(ctx, val.join);
    (val === null || val === void 0 ? void 0 : val.description) && delegate.onDescription(ctx, val.description);
    (val === null || val === void 0 ? void 0 : val.trickle) && delegate.onTrickle(ctx, val.trickle);
    (val === null || val === void 0 ? void 0 : val.trackEvent) && delegate.onTrackEvent(ctx, val.trackEvent);
    (val === null || val === void 0 ? void 0 : val.subscription) && delegate.onSubscription(ctx, val.subscription);
    (val === null || val === void 0 ? void 0 : val.error) && delegate.onError(ctx, val.error);
    (val === null || val === void 0 ? void 0 : val.getOffer) && delegate.onGetOffer(ctx, val.getOffer);
}
exports.routeReplyPayloadDelegate = routeReplyPayloadDelegate;
class RTC {
    static Signal(entityNotifier, errorCallback, initReq) {
        return fm.biDirectionalStreamingRequest(`/rtc.RTC/Signal`, entityNotifier, errorCallback, Object.assign({}, initReq));
    }
}
exports.RTC = RTC;
//# sourceMappingURL=ion_rtc.pb.js.map