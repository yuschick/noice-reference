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
exports.AvatarAnimationService = exports.AnimationHandedness = exports.AnimationCategory = void 0;
const fm = __importStar(require("../fetch.pb"));
var AnimationCategory;
(function (AnimationCategory) {
    AnimationCategory["CATEGORY_UNSPECIFIED"] = "CATEGORY_UNSPECIFIED";
    AnimationCategory["CATEGORY_EMOTE"] = "CATEGORY_EMOTE";
    AnimationCategory["CATEGORY_IDLE"] = "CATEGORY_IDLE";
    AnimationCategory["CATEGORY_CHAT_MESSAGE"] = "CATEGORY_CHAT_MESSAGE";
    AnimationCategory["CATEGORY_PLAYER_JOIN"] = "CATEGORY_PLAYER_JOIN";
    AnimationCategory["CATEGORY_VICTORY"] = "CATEGORY_VICTORY";
    AnimationCategory["CATEGORY_DEFEAT"] = "CATEGORY_DEFEAT";
    AnimationCategory["CATEGORY_BOOSTER_RECEIVED"] = "CATEGORY_BOOSTER_RECEIVED";
    AnimationCategory["CATEGORY_BOOSTER_REQUESTED"] = "CATEGORY_BOOSTER_REQUESTED";
    AnimationCategory["CATEGORY_BOOSTER_SENT"] = "CATEGORY_BOOSTER_SENT";
    AnimationCategory["CATEGORY_FS_IN_CHAT"] = "CATEGORY_FS_IN_CHAT";
    AnimationCategory["CATEGORY_PLAYER_PICK_CARD"] = "CATEGORY_PLAYER_PICK_CARD";
    AnimationCategory["CATEGORY_CHEER"] = "CATEGORY_CHEER";
    AnimationCategory["CATEGORY_EMOJI"] = "CATEGORY_EMOJI";
    AnimationCategory["CATEGORY_DANCE"] = "CATEGORY_DANCE";
    AnimationCategory["CATEGORY_MESSAGE"] = "CATEGORY_MESSAGE";
    AnimationCategory["CATEGORY_EXCITED"] = "CATEGORY_EXCITED";
    AnimationCategory["CATEGORY_ANGRY"] = "CATEGORY_ANGRY";
    AnimationCategory["CATEGORY_SAD"] = "CATEGORY_SAD";
    AnimationCategory["CATEGORY_CARD_FAILURE"] = "CATEGORY_CARD_FAILURE";
    AnimationCategory["CATEGORY_CARD_SUCCESS"] = "CATEGORY_CARD_SUCCESS";
    AnimationCategory["CATEGORY_CARD_MAXED_OUT"] = "CATEGORY_CARD_MAXED_OUT";
    AnimationCategory["CATEGORY_PLAYER_EXIT"] = "CATEGORY_PLAYER_EXIT";
    AnimationCategory["CATEGORY_WS_IN_CHAT"] = "CATEGORY_WS_IN_CHAT";
    AnimationCategory["CATEGORY_PLAYER_SWAP_CARD"] = "CATEGORY_PLAYER_SWAP_CARD";
    AnimationCategory["CATEGORY_CAMERA_DRIVE"] = "CATEGORY_CAMERA_DRIVE";
    AnimationCategory["CATEGORY_CAMERA_DRIVE_EXCITED"] = "CATEGORY_CAMERA_DRIVE_EXCITED";
    AnimationCategory["CATEGORY_SPOTLIGHT_CROWD"] = "CATEGORY_SPOTLIGHT_CROWD";
    AnimationCategory["CATEGORY_SPOTLIGHT_PODIUM"] = "CATEGORY_SPOTLIGHT_PODIUM";
    AnimationCategory["CATEGORY_PHOTO_POSES"] = "CATEGORY_PHOTO_POSES";
    AnimationCategory["CATEGORY_EDITOR_PICK_BODY"] = "CATEGORY_EDITOR_PICK_BODY";
    AnimationCategory["CATEGORY_EDITOR_PICK_FACE"] = "CATEGORY_EDITOR_PICK_FACE";
    AnimationCategory["CATEGORY_EDITOR_PICK_HAT"] = "CATEGORY_EDITOR_PICK_HAT";
    AnimationCategory["CATEGORY_EDITOR_PICK_JACKET"] = "CATEGORY_EDITOR_PICK_JACKET";
    AnimationCategory["CATEGORY_EDITOR_PICK_PANTS"] = "CATEGORY_EDITOR_PICK_PANTS";
    AnimationCategory["CATEGORY_EDITOR_PICK_SHOES"] = "CATEGORY_EDITOR_PICK_SHOES";
    AnimationCategory["CATEGORY_EDITOR_IDLE"] = "CATEGORY_EDITOR_IDLE";
    AnimationCategory["CATEGORY_EDITOR_PICK_GLOVES"] = "CATEGORY_EDITOR_PICK_GLOVES";
})(AnimationCategory || (exports.AnimationCategory = AnimationCategory = {}));
var AnimationHandedness;
(function (AnimationHandedness) {
    AnimationHandedness["HANDEDNESS_UNSPECIFIED"] = "HANDEDNESS_UNSPECIFIED";
    AnimationHandedness["HANDEDNESS_LEFT"] = "HANDEDNESS_LEFT";
    AnimationHandedness["HANDEDNESS_RIGHT"] = "HANDEDNESS_RIGHT";
    AnimationHandedness["HANDEDNESS_BOTH"] = "HANDEDNESS_BOTH";
})(AnimationHandedness || (exports.AnimationHandedness = AnimationHandedness = {}));
class AvatarAnimationService {
    static ListAnimations(req, initReq) {
        return fm.fetchReq(`/v1/avatarAnimations?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetAnimation(req, initReq) {
        return fm.fetchReq(`/v1/avatarAnimations/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetAnimations(req, initReq) {
        return fm.fetchReq(`/v1/avatarAnimations:batchGet`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.AvatarAnimationService = AvatarAnimationService;
//# sourceMappingURL=animation.pb.js.map