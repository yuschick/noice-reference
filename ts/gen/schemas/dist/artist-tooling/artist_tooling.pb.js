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
exports.ArtistToolingService = exports.routeEventEventDelegate = void 0;
const fm = __importStar(require("../fetch.pb"));
function routeEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.avatarPartFileUpdated) && delegate.onAvatarPartFileUpdated(ctx, val.avatarPartFileUpdated);
    (val === null || val === void 0 ? void 0 : val.animationFileUpdated) && delegate.onAnimationFileUpdated(ctx, val.animationFileUpdated);
    (val === null || val === void 0 ? void 0 : val.assetFileUpdated) && delegate.onAssetFileUpdated(ctx, val.assetFileUpdated);
}
exports.routeEventEventDelegate = routeEventEventDelegate;
class ArtistToolingService {
    static SetSettings(req, initReq) {
        return fm.fetchReq(`/artist_tooling.ArtistToolingService/SetSettings`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetSettings(req, initReq) {
        return fm.fetchReq(`/artist_tooling.ArtistToolingService/GetSettings`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static Events(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/artist_tooling.ArtistToolingService/Events`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
        }
        return fm.fetchStreamingRequest(`/artist_tooling.ArtistToolingService/Events`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SendEvent(req, initReq) {
        return fm.fetchReq(`/artist_tooling.ArtistToolingService/SendEvent`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListAssets(req, initReq) {
        return fm.fetchReq(`/artist_tooling.ArtistToolingService/ListAssets`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.ArtistToolingService = ArtistToolingService;
//# sourceMappingURL=artist_tooling.pb.js.map