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
exports.StreamIngestService = exports.routeStreamIngestEndpointDelegate = void 0;
const fm = __importStar(require("../fetch.pb"));
function routeStreamIngestEndpointDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.janus) && delegate.onJanus(ctx, val.janus);
    (val === null || val === void 0 ? void 0 : val.livekit) && delegate.onLivekit(ctx, val.livekit);
}
exports.routeStreamIngestEndpointDelegate = routeStreamIngestEndpointDelegate;
class StreamIngestService {
    static RegisterStreamIngest(req, initReq) {
        return fm.fetchReq(`/stream_ingest.StreamIngestService/RegisterStreamIngest`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeregisterStreamIngest(req, initReq) {
        return fm.fetchReq(`/stream_ingest.StreamIngestService/DeregisterStreamIngest`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static RegisterStreamIngestv2(req, initReq) {
        return fm.fetchReq(`/stream_ingest.StreamIngestService/RegisterStreamIngestv2`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static RefreshStreamIngest(req, initReq) {
        return fm.fetchReq(`/stream_ingest.StreamIngestService/RefreshStreamIngest`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeregisterStreamIngestv2(req, initReq) {
        return fm.fetchReq(`/stream_ingest.StreamIngestService/DeregisterStreamIngestv2`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.StreamIngestService = StreamIngestService;
//# sourceMappingURL=stream_ingest.pb.js.map