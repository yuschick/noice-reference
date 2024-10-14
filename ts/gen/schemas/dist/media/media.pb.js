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
exports.MediaService = exports.routeUploadMediaRequestContentDelegate = exports.routeUploadConstraintConstraintDelegate = exports.UploadMediaRequestDoneStatus = exports.MediaType = void 0;
const fm = __importStar(require("../fetch.pb"));
var MediaType;
(function (MediaType) {
    MediaType["MEDIA_TYPE_UNSPECIFIED"] = "MEDIA_TYPE_UNSPECIFIED";
    MediaType["MEDIA_TYPE_IMAGE"] = "MEDIA_TYPE_IMAGE";
    MediaType["MEDIA_TYPE_VIDEO"] = "MEDIA_TYPE_VIDEO";
    MediaType["MEDIA_TYPE_3D_MODEL"] = "MEDIA_TYPE_3D_MODEL";
})(MediaType || (exports.MediaType = MediaType = {}));
var UploadMediaRequestDoneStatus;
(function (UploadMediaRequestDoneStatus) {
    UploadMediaRequestDoneStatus["DONE_STATUS_UNSPECIFIED"] = "DONE_STATUS_UNSPECIFIED";
    UploadMediaRequestDoneStatus["DONE_STATUS_CLIENT_FAILURE"] = "DONE_STATUS_CLIENT_FAILURE";
    UploadMediaRequestDoneStatus["DONE_STATUS_UPLOAD_COMPLETE"] = "DONE_STATUS_UPLOAD_COMPLETE";
})(UploadMediaRequestDoneStatus || (exports.UploadMediaRequestDoneStatus = UploadMediaRequestDoneStatus = {}));
function routeUploadConstraintConstraintDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.minWidth) && delegate.onMinWidth(ctx, val.minWidth);
    (val === null || val === void 0 ? void 0 : val.maxWidth) && delegate.onMaxWidth(ctx, val.maxWidth);
    (val === null || val === void 0 ? void 0 : val.minHeight) && delegate.onMinHeight(ctx, val.minHeight);
    (val === null || val === void 0 ? void 0 : val.maxHeight) && delegate.onMaxHeight(ctx, val.maxHeight);
    (val === null || val === void 0 ? void 0 : val.maxFileSizeBytes) && delegate.onMaxFileSizeBytes(ctx, val.maxFileSizeBytes);
}
exports.routeUploadConstraintConstraintDelegate = routeUploadConstraintConstraintDelegate;
function routeUploadMediaRequestContentDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.token) && delegate.onToken(ctx, val.token);
    (val === null || val === void 0 ? void 0 : val.meta) && delegate.onMeta(ctx, val.meta);
    (val === null || val === void 0 ? void 0 : val.data) && delegate.onData(ctx, val.data);
    (val === null || val === void 0 ? void 0 : val.done) && delegate.onDone(ctx, val.done);
}
exports.routeUploadMediaRequestContentDelegate = routeUploadMediaRequestContentDelegate;
class MediaService {
    static CreateUploadToken(req, initReq) {
        return fm.fetchReq(`/v1/mediaUploadTokens`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UploadMedia(initReq) {
        return fm.clientStreamingRequest(`/v1/media`, Object.assign({}, initReq));
    }
    static CreateMediaReference(req, initReq) {
        return fm.fetchReq(`/v1/media/${req["mediaId"]}/references`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteMediaReference(req, initReq) {
        return fm.fetchReq(`/v1/media/${req["mediaId"]}/references`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static GetMedia(req, initReq) {
        return fm.fetchReq(`/v1/media/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetMediaUrl(req, initReq) {
        return fm.fetchReq(`/v1/media:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListMedia(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/media?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.MediaService = MediaService;
//# sourceMappingURL=media.pb.js.map