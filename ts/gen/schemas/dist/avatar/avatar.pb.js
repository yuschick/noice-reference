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
exports.AvatarService = exports.routeValidateAvatarCompositionResponseChangeActionDelegate = exports.routeGenerateAvatarEventEventDelegate = exports.ValidateAvatarCompositionResponseChangeReason = exports.AvatarPartCategory = exports.Gender = void 0;
const fm = __importStar(require("../fetch.pb"));
var Gender;
(function (Gender) {
    Gender["GENDER_UNSPECIFIED"] = "GENDER_UNSPECIFIED";
    Gender["GENDER_MALE"] = "GENDER_MALE";
    Gender["GENDER_FEMALE"] = "GENDER_FEMALE";
})(Gender || (exports.Gender = Gender = {}));
var AvatarPartCategory;
(function (AvatarPartCategory) {
    AvatarPartCategory["CATEGORY_UNSPECIFIED"] = "CATEGORY_UNSPECIFIED";
    AvatarPartCategory["CATEGORY_BODY"] = "CATEGORY_BODY";
    AvatarPartCategory["CATEGORY_HEAD"] = "CATEGORY_HEAD";
    AvatarPartCategory["CATEGORY_HEAD_ITEM"] = "CATEGORY_HEAD_ITEM";
    AvatarPartCategory["CATEGORY_FACE_ITEM"] = "CATEGORY_FACE_ITEM";
    AvatarPartCategory["CATEGORY_HAIR"] = "CATEGORY_HAIR";
    AvatarPartCategory["CATEGORY_TORSO"] = "CATEGORY_TORSO";
    AvatarPartCategory["CATEGORY_HANDS"] = "CATEGORY_HANDS";
    AvatarPartCategory["CATEGORY_LEGS"] = "CATEGORY_LEGS";
    AvatarPartCategory["CATEGORY_SHOES"] = "CATEGORY_SHOES";
    AvatarPartCategory["CATEGORY_EYES"] = "CATEGORY_EYES";
    AvatarPartCategory["CATEGORY_EYELASHES"] = "CATEGORY_EYELASHES";
    AvatarPartCategory["CATEGORY_EYEBROWS"] = "CATEGORY_EYEBROWS";
    AvatarPartCategory["CATEGORY_TEETH"] = "CATEGORY_TEETH";
    AvatarPartCategory["CATEGORY_SKIN_COLOR"] = "CATEGORY_SKIN_COLOR";
    AvatarPartCategory["CATEGORY_HAIR_COLOR"] = "CATEGORY_HAIR_COLOR";
    AvatarPartCategory["CATEGORY_EYELASHES_COLOR"] = "CATEGORY_EYELASHES_COLOR";
    AvatarPartCategory["CATEGORY_EYEBROWS_COLOR"] = "CATEGORY_EYEBROWS_COLOR";
    AvatarPartCategory["CATEGORY_COLOR_PRESET"] = "CATEGORY_COLOR_PRESET";
})(AvatarPartCategory || (exports.AvatarPartCategory = AvatarPartCategory = {}));
var ValidateAvatarCompositionResponseChangeReason;
(function (ValidateAvatarCompositionResponseChangeReason) {
    ValidateAvatarCompositionResponseChangeReason["REASON_UNSPECIFIED"] = "REASON_UNSPECIFIED";
    ValidateAvatarCompositionResponseChangeReason["REASON_AVATAR_PART_HEAD_REQUIRED"] = "REASON_AVATAR_PART_HEAD_REQUIRED";
    ValidateAvatarCompositionResponseChangeReason["REASON_AVATAR_PART_BODY_REQUIRED"] = "REASON_AVATAR_PART_BODY_REQUIRED";
    ValidateAvatarCompositionResponseChangeReason["REASON_AVATAR_PART_TORSO_REQUIRED"] = "REASON_AVATAR_PART_TORSO_REQUIRED";
    ValidateAvatarCompositionResponseChangeReason["REASON_AVATAR_PART_LEGS_REQUIRED"] = "REASON_AVATAR_PART_LEGS_REQUIRED";
    ValidateAvatarCompositionResponseChangeReason["REASON_AVATAR_PART_EYES_REQUIRED"] = "REASON_AVATAR_PART_EYES_REQUIRED";
    ValidateAvatarCompositionResponseChangeReason["REASON_AVATAR_PART_UNAVAILABLE"] = "REASON_AVATAR_PART_UNAVAILABLE";
    ValidateAvatarCompositionResponseChangeReason["REASON_AVATAR_PART_UNKNOWN"] = "REASON_AVATAR_PART_UNKNOWN";
})(ValidateAvatarCompositionResponseChangeReason || (exports.ValidateAvatarCompositionResponseChangeReason = ValidateAvatarCompositionResponseChangeReason = {}));
function routeGenerateAvatarEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.completed) && delegate.onCompleted(ctx, val.completed);
    (val === null || val === void 0 ? void 0 : val.progress) && delegate.onProgress(ctx, val.progress);
    (val === null || val === void 0 ? void 0 : val.error) && delegate.onError(ctx, val.error);
}
exports.routeGenerateAvatarEventEventDelegate = routeGenerateAvatarEventEventDelegate;
function routeValidateAvatarCompositionResponseChangeActionDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.added) && delegate.onAdded(ctx, val.added);
    (val === null || val === void 0 ? void 0 : val.removed) && delegate.onRemoved(ctx, val.removed);
    (val === null || val === void 0 ? void 0 : val.replaced) && delegate.onReplaced(ctx, val.replaced);
}
exports.routeValidateAvatarCompositionResponseChangeActionDelegate = routeValidateAvatarCompositionResponseChangeActionDelegate;
class AvatarService {
    static ListAvatars(req, initReq) {
        return fm.fetchReq(`/v1/avatars?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetAvatar(req, initReq) {
        return fm.fetchReq(`/v1/avatars/${req["avatarId"]}?${fm.renderURLSearchParams(req, ["avatarId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static UpdateAvatar(req, initReq) {
        return fm.fetchReq(`/v1/avatars/${req["body"]["id"]}`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static BatchGetAvatars(req, initReq) {
        return fm.fetchReq(`/v1/avatars:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListAvatarParts(req, initReq) {
        return fm.fetchReq(`/v1/avatarParts?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetAvatarPart(req, initReq) {
        return fm.fetchReq(`/v1/avatarParts/${req["avatarPartId"]}?${fm.renderURLSearchParams(req, ["avatarPartId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetAvatarParts(req, initReq) {
        return fm.fetchReq(`/v1/avatarParts:batchGet`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GenerateAvatar(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/generateAvatar`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
        }
        return fm.fetchStreamingRequest(`/v1/generateAvatar`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static RegenerateAvatar(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/avatars/${req["avatarId"]}:regenerate`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST" }));
        }
        return fm.fetchStreamingRequest(`/v1/avatars/${req["avatarId"]}:regenerate`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST" }));
    }
    static ValidateAvatarComposition(req, initReq) {
        return fm.fetchReq(`/v1/validateAvatarComposition`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.AvatarService = AvatarService;
//# sourceMappingURL=avatar.pb.js.map