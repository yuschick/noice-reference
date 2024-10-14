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
exports.StreamIngestConfigService = exports.routeGetIngestConfigRequestIdDelegate = exports.routeIngestConfigIngestDelegate = exports.StreamingStatus = void 0;
const fm = __importStar(require("../fetch.pb"));
var StreamingStatus;
(function (StreamingStatus) {
    StreamingStatus["STREAMING_STATUS_UNSPECIFIED"] = "STREAMING_STATUS_UNSPECIFIED";
    StreamingStatus["STREAMING_STATUS_USER_SUSPENDED"] = "STREAMING_STATUS_USER_SUSPENDED";
    StreamingStatus["STREAMING_STATUS_STREAMING_DISABLED"] = "STREAMING_STATUS_STREAMING_DISABLED";
})(StreamingStatus || (exports.StreamingStatus = StreamingStatus = {}));
function routeIngestConfigIngestDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.ftl) && delegate.onFtl(ctx, val.ftl);
}
exports.routeIngestConfigIngestDelegate = routeIngestConfigIngestDelegate;
function routeGetIngestConfigRequestIdDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.ftlId) && delegate.onFtlId(ctx, val.ftlId);
}
exports.routeGetIngestConfigRequestIdDelegate = routeGetIngestConfigRequestIdDelegate;
class StreamIngestConfigService {
    static CreateIngestConfigs(req, initReq) {
        return fm.fetchReq(`/stream_ingest_config.StreamIngestConfigService/CreateIngestConfigs`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static RefreshIngestConfigs(req, initReq) {
        return fm.fetchReq(`/stream_ingest_config.StreamIngestConfigService/RefreshIngestConfigs`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteIngestConfigs(req, initReq) {
        return fm.fetchReq(`/stream_ingest_config.StreamIngestConfigService/DeleteIngestConfigs`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetIngestConfig(req, initReq) {
        return fm.fetchReq(`/stream_ingest_config.StreamIngestConfigService/GetIngestConfig`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListIngestConfigs(req, initReq) {
        return fm.fetchReq(`/stream_ingest_config.StreamIngestConfigService/ListIngestConfigs`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.StreamIngestConfigService = StreamIngestConfigService;
//# sourceMappingURL=ingest_config.pb.js.map