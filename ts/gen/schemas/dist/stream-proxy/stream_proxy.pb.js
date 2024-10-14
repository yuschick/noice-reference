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
exports.ProxyService = exports.VideoQuality = void 0;
const fm = __importStar(require("../fetch.pb"));
var VideoQuality;
(function (VideoQuality) {
    VideoQuality["VIDEO_QUALITY_UNSPECIFIED"] = "VIDEO_QUALITY_UNSPECIFIED";
    VideoQuality["VIDEO_QUALITY_LOW"] = "VIDEO_QUALITY_LOW";
    VideoQuality["VIDEO_QUALITY_MEDIUM"] = "VIDEO_QUALITY_MEDIUM";
    VideoQuality["VIDEO_QUALITY_HIGH"] = "VIDEO_QUALITY_HIGH";
    VideoQuality["VIDEO_QUALITY_OFF"] = "VIDEO_QUALITY_OFF";
})(VideoQuality || (exports.VideoQuality = VideoQuality = {}));
class ProxyService {
    static StartProxy(req, initReq) {
        return fm.fetchReq(`/stream_proxy.ProxyService/StartProxy`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static StopProxy(req, initReq) {
        return fm.fetchReq(`/stream_proxy.ProxyService/StopProxy`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ProxyExists(req, initReq) {
        return fm.fetchReq(`/stream_proxy.ProxyService/ProxyExists`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static EnsureProxy(req, initReq) {
        return fm.fetchReq(`/stream_proxy.ProxyService/EnsureProxy`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.ProxyService = ProxyService;
//# sourceMappingURL=stream_proxy.pb.js.map