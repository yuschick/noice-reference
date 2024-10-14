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
exports.ContentRendererService = exports.routeWebrtcSignalingRequestActionDelegate = exports.routeWebrtcSignalingResponseActionDelegate = exports.routeContentUpdateUpdateDelegate = exports.VideoLayerVideoQuality = exports.CandidateTarget = exports.ContentUpdateKeyValueOpOperation = void 0;
const fm = __importStar(require("../fetch.pb"));
var ContentUpdateKeyValueOpOperation;
(function (ContentUpdateKeyValueOpOperation) {
    ContentUpdateKeyValueOpOperation["OPERATION_UNSPECIFIED"] = "OPERATION_UNSPECIFIED";
    ContentUpdateKeyValueOpOperation["OPERATION_SET"] = "OPERATION_SET";
    ContentUpdateKeyValueOpOperation["OPERATION_UNSET"] = "OPERATION_UNSET";
    ContentUpdateKeyValueOpOperation["OPERATION_PATCH"] = "OPERATION_PATCH";
    ContentUpdateKeyValueOpOperation["OPERATION_PRUNE"] = "OPERATION_PRUNE";
})(ContentUpdateKeyValueOpOperation || (exports.ContentUpdateKeyValueOpOperation = ContentUpdateKeyValueOpOperation = {}));
var CandidateTarget;
(function (CandidateTarget) {
    CandidateTarget["TARGET_UNSPECIFIED"] = "TARGET_UNSPECIFIED";
    CandidateTarget["TARGET_SUBSCRIBER"] = "TARGET_SUBSCRIBER";
    CandidateTarget["TARGET_PUBLISHER"] = "TARGET_PUBLISHER";
})(CandidateTarget || (exports.CandidateTarget = CandidateTarget = {}));
var VideoLayerVideoQuality;
(function (VideoLayerVideoQuality) {
    VideoLayerVideoQuality["VIDEO_QUALITY_UNSPECIFIED"] = "VIDEO_QUALITY_UNSPECIFIED";
    VideoLayerVideoQuality["VIDEO_QUALITY_LOW"] = "VIDEO_QUALITY_LOW";
    VideoLayerVideoQuality["VIDEO_QUALITY_MEDIUM"] = "VIDEO_QUALITY_MEDIUM";
    VideoLayerVideoQuality["VIDEO_QUALITY_HIGH"] = "VIDEO_QUALITY_HIGH";
})(VideoLayerVideoQuality || (exports.VideoLayerVideoQuality = VideoLayerVideoQuality = {}));
function routeContentUpdateUpdateDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.groupPlacement) && delegate.onGroupPlacement(ctx, val.groupPlacement);
    (val === null || val === void 0 ? void 0 : val.avatarPlacement) && delegate.onAvatarPlacement(ctx, val.avatarPlacement);
    (val === null || val === void 0 ? void 0 : val.avatarRemoval) && delegate.onAvatarRemoval(ctx, val.avatarRemoval);
    (val === null || val === void 0 ? void 0 : val.groupRemoval) && delegate.onGroupRemoval(ctx, val.groupRemoval);
    (val === null || val === void 0 ? void 0 : val.keyValueOp) && delegate.onKeyValueOp(ctx, val.keyValueOp);
    (val === null || val === void 0 ? void 0 : val.signal) && delegate.onSignal(ctx, val.signal);
}
exports.routeContentUpdateUpdateDelegate = routeContentUpdateUpdateDelegate;
function routeWebrtcSignalingResponseActionDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.start) && delegate.onStart(ctx, val.start);
    (val === null || val === void 0 ? void 0 : val.stop) && delegate.onStop(ctx, val.stop);
    (val === null || val === void 0 ? void 0 : val.offer) && delegate.onOffer(ctx, val.offer);
    (val === null || val === void 0 ? void 0 : val.answer) && delegate.onAnswer(ctx, val.answer);
    (val === null || val === void 0 ? void 0 : val.candidate) && delegate.onCandidate(ctx, val.candidate);
    (val === null || val === void 0 ? void 0 : val.addTrack) && delegate.onAddTrack(ctx, val.addTrack);
}
exports.routeWebrtcSignalingResponseActionDelegate = routeWebrtcSignalingResponseActionDelegate;
function routeWebrtcSignalingRequestActionDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.offer) && delegate.onOffer(ctx, val.offer);
    (val === null || val === void 0 ? void 0 : val.answer) && delegate.onAnswer(ctx, val.answer);
    (val === null || val === void 0 ? void 0 : val.candidate) && delegate.onCandidate(ctx, val.candidate);
}
exports.routeWebrtcSignalingRequestActionDelegate = routeWebrtcSignalingRequestActionDelegate;
class ContentRendererService {
    static LoadArena(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/LoadArena`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static LoadAnimations(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/LoadAnimations`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleJoiningPlayer(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleJoiningPlayer`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleLeavingPlayer(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleLeavingPlayer`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleMatchStart(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleMatchStart`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleMatchEnd(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleMatchEnd`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleEmote(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleEmote`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleEmoji(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleEmoji`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleGroupCheer(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleGroupCheer`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleGroupCheerParticipation(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleGroupCheerParticipation`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleCardSuccess(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleCardSuccess`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleCardFailure(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleCardFailure`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleActiveCardSet(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleActiveCardSet`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleUsedBooster(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleUsedBooster`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleRequestedBooster(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleRequestedBooster`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleChatMessageSent(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleChatMessageSent`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleHighScoringCard(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleHighScoringCard`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HandleSetDebug(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HandleSetDebug`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static Updates(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/content_renderer.ContentRendererService/Updates`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
        }
        return fm.fetchStreamingRequest(`/content_renderer.ContentRendererService/Updates`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static HealthCheck(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/HealthCheck`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static StartCameraTransition(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/StartCameraTransition`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SetActiveContentMode(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/SetActiveContentMode`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SetActiveTransition(req, initReq) {
        return fm.fetchReq(`/content_renderer.ContentRendererService/SetActiveTransition`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static WebrtcSignaling(entityNotifier, errorCallback, initReq) {
        return fm.biDirectionalStreamingRequest(`/content_renderer.ContentRendererService/WebrtcSignaling`, entityNotifier, errorCallback, Object.assign({}, initReq));
    }
}
exports.ContentRendererService = ContentRendererService;
//# sourceMappingURL=content_renderer.pb.js.map