"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeCameraTransitionRequestDetailsDelegate = exports.routeContentModeContentDelegate = exports.routeContentModeUserSpotlightHighlightDelegate = exports.CameraTransitionRequestTransitionTarget = exports.TransitionTarget = exports.ContentModeUserSpotlightMode = void 0;
var ContentModeUserSpotlightMode;
(function (ContentModeUserSpotlightMode) {
    ContentModeUserSpotlightMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    ContentModeUserSpotlightMode["MODE_BEST_PLAYER"] = "MODE_BEST_PLAYER";
    ContentModeUserSpotlightMode["MODE_BEST_CARD"] = "MODE_BEST_CARD";
})(ContentModeUserSpotlightMode || (exports.ContentModeUserSpotlightMode = ContentModeUserSpotlightMode = {}));
var TransitionTarget;
(function (TransitionTarget) {
    TransitionTarget["TARGET_UNSPECIFIED"] = "TARGET_UNSPECIFIED";
    TransitionTarget["TARGET_NOICE_LOGO"] = "TARGET_NOICE_LOGO";
    TransitionTarget["TARGET_NONE"] = "TARGET_NONE";
})(TransitionTarget || (exports.TransitionTarget = TransitionTarget = {}));
var CameraTransitionRequestTransitionTarget;
(function (CameraTransitionRequestTransitionTarget) {
    CameraTransitionRequestTransitionTarget["TRANSITION_TARGET_UNSPECIFIED"] = "TRANSITION_TARGET_UNSPECIFIED";
    CameraTransitionRequestTransitionTarget["TRANSITION_TARGET_ARENA"] = "TRANSITION_TARGET_ARENA";
    CameraTransitionRequestTransitionTarget["TRANSITION_TARGET_CAMERA_DRIVE1"] = "TRANSITION_TARGET_CAMERA_DRIVE1";
    CameraTransitionRequestTransitionTarget["TRANSITION_TARGET_SPOTLIGHT"] = "TRANSITION_TARGET_SPOTLIGHT";
})(CameraTransitionRequestTransitionTarget || (exports.CameraTransitionRequestTransitionTarget = CameraTransitionRequestTransitionTarget = {}));
function routeContentModeUserSpotlightHighlightDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.player) && delegate.onPlayer(ctx, val.player);
    (val === null || val === void 0 ? void 0 : val.card) && delegate.onCard(ctx, val.card);
}
exports.routeContentModeUserSpotlightHighlightDelegate = routeContentModeUserSpotlightHighlightDelegate;
function routeContentModeContentDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.game) && delegate.onGame(ctx, val.game);
    (val === null || val === void 0 ? void 0 : val.matchEnd) && delegate.onMatchEnd(ctx, val.matchEnd);
    (val === null || val === void 0 ? void 0 : val.userSpotlight) && delegate.onUserSpotlight(ctx, val.userSpotlight);
    (val === null || val === void 0 ? void 0 : val.groupSpotlight) && delegate.onGroupSpotlight(ctx, val.groupSpotlight);
    (val === null || val === void 0 ? void 0 : val.cameraDrive) && delegate.onCameraDrive(ctx, val.cameraDrive);
}
exports.routeContentModeContentDelegate = routeContentModeContentDelegate;
function routeCameraTransitionRequestDetailsDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.spotlightDetails) && delegate.onSpotlightDetails(ctx, val.spotlightDetails);
}
exports.routeCameraTransitionRequestDetailsDelegate = routeCameraTransitionRequestDetailsDelegate;
//# sourceMappingURL=transitions.pb.js.map