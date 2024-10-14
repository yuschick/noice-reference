"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routePostFxComponentDataDelegate = exports.PostFxComponentTonemappingFxDataTonemappingMode = exports.PostFxComponentMotionBlurFxDataMotionBlurQuality = exports.PostFxComponentMotionBlurFxDataMotionBlurMode = exports.PostFxComponentFilmGrainFxDataFilmGrainLookup = exports.PostFxComponentDepthOfFieldFxDataDepthOfFieldMode = exports.LightType = void 0;
var LightType;
(function (LightType) {
    LightType["TYPE_UNSPECIFIED"] = "TYPE_UNSPECIFIED";
    LightType["TYPE_POINT"] = "TYPE_POINT";
    LightType["TYPE_SPOT"] = "TYPE_SPOT";
    LightType["TYPE_DIRECTIONAL"] = "TYPE_DIRECTIONAL";
})(LightType || (exports.LightType = LightType = {}));
var PostFxComponentDepthOfFieldFxDataDepthOfFieldMode;
(function (PostFxComponentDepthOfFieldFxDataDepthOfFieldMode) {
    PostFxComponentDepthOfFieldFxDataDepthOfFieldMode["DEPTH_OF_FIELD_MODE_UNSPECIFIED"] = "DEPTH_OF_FIELD_MODE_UNSPECIFIED";
    PostFxComponentDepthOfFieldFxDataDepthOfFieldMode["DEPTH_OF_FIELD_MODE_OFF"] = "DEPTH_OF_FIELD_MODE_OFF";
    PostFxComponentDepthOfFieldFxDataDepthOfFieldMode["DEPTH_OF_FIELD_MODE_GAUSSIAN"] = "DEPTH_OF_FIELD_MODE_GAUSSIAN";
    PostFxComponentDepthOfFieldFxDataDepthOfFieldMode["DEPTH_OF_FIELD_MODE_BOKEH"] = "DEPTH_OF_FIELD_MODE_BOKEH";
})(PostFxComponentDepthOfFieldFxDataDepthOfFieldMode || (exports.PostFxComponentDepthOfFieldFxDataDepthOfFieldMode = PostFxComponentDepthOfFieldFxDataDepthOfFieldMode = {}));
var PostFxComponentFilmGrainFxDataFilmGrainLookup;
(function (PostFxComponentFilmGrainFxDataFilmGrainLookup) {
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_UNSPECIFIED"] = "FILM_GRAIN_LOOKUP_UNSPECIFIED";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_THIN_1"] = "FILM_GRAIN_LOOKUP_THIN_1";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_THIN_2"] = "FILM_GRAIN_LOOKUP_THIN_2";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_MEDIUM_1"] = "FILM_GRAIN_LOOKUP_MEDIUM_1";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_MEDIUM_2"] = "FILM_GRAIN_LOOKUP_MEDIUM_2";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_MEDIUM_3"] = "FILM_GRAIN_LOOKUP_MEDIUM_3";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_MEDIUM_4"] = "FILM_GRAIN_LOOKUP_MEDIUM_4";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_MEDIUM_5"] = "FILM_GRAIN_LOOKUP_MEDIUM_5";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_MEDIUM_6"] = "FILM_GRAIN_LOOKUP_MEDIUM_6";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_LARGE_01"] = "FILM_GRAIN_LOOKUP_LARGE_01";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_LARGE_02"] = "FILM_GRAIN_LOOKUP_LARGE_02";
    PostFxComponentFilmGrainFxDataFilmGrainLookup["FILM_GRAIN_LOOKUP_CUSTOM"] = "FILM_GRAIN_LOOKUP_CUSTOM";
})(PostFxComponentFilmGrainFxDataFilmGrainLookup || (exports.PostFxComponentFilmGrainFxDataFilmGrainLookup = PostFxComponentFilmGrainFxDataFilmGrainLookup = {}));
var PostFxComponentMotionBlurFxDataMotionBlurMode;
(function (PostFxComponentMotionBlurFxDataMotionBlurMode) {
    PostFxComponentMotionBlurFxDataMotionBlurMode["MOTION_BLUR_MODE_UNSPECIFIED"] = "MOTION_BLUR_MODE_UNSPECIFIED";
    PostFxComponentMotionBlurFxDataMotionBlurMode["MOTION_BLUR_MODE_CAMERA_ONLY"] = "MOTION_BLUR_MODE_CAMERA_ONLY";
    PostFxComponentMotionBlurFxDataMotionBlurMode["MOTION_BLUR_MODE_CAMERA_AND_OBJECTS"] = "MOTION_BLUR_MODE_CAMERA_AND_OBJECTS";
})(PostFxComponentMotionBlurFxDataMotionBlurMode || (exports.PostFxComponentMotionBlurFxDataMotionBlurMode = PostFxComponentMotionBlurFxDataMotionBlurMode = {}));
var PostFxComponentMotionBlurFxDataMotionBlurQuality;
(function (PostFxComponentMotionBlurFxDataMotionBlurQuality) {
    PostFxComponentMotionBlurFxDataMotionBlurQuality["MOTION_BLUR_QUALITY_UNSPECIFIED"] = "MOTION_BLUR_QUALITY_UNSPECIFIED";
    PostFxComponentMotionBlurFxDataMotionBlurQuality["MOTION_BLUR_QUALITY_LOW"] = "MOTION_BLUR_QUALITY_LOW";
    PostFxComponentMotionBlurFxDataMotionBlurQuality["MOTION_BLUR_QUALITY_MEDIUM"] = "MOTION_BLUR_QUALITY_MEDIUM";
    PostFxComponentMotionBlurFxDataMotionBlurQuality["MOTION_BLUR_QUALITY_HIGH"] = "MOTION_BLUR_QUALITY_HIGH";
})(PostFxComponentMotionBlurFxDataMotionBlurQuality || (exports.PostFxComponentMotionBlurFxDataMotionBlurQuality = PostFxComponentMotionBlurFxDataMotionBlurQuality = {}));
var PostFxComponentTonemappingFxDataTonemappingMode;
(function (PostFxComponentTonemappingFxDataTonemappingMode) {
    PostFxComponentTonemappingFxDataTonemappingMode["TONEMAPPING_MODE_UNSPECIFIED"] = "TONEMAPPING_MODE_UNSPECIFIED";
    PostFxComponentTonemappingFxDataTonemappingMode["TONEMAPPING_MODE_NONE"] = "TONEMAPPING_MODE_NONE";
    PostFxComponentTonemappingFxDataTonemappingMode["TONEMAPPING_MODE_NEUTRAL"] = "TONEMAPPING_MODE_NEUTRAL";
    PostFxComponentTonemappingFxDataTonemappingMode["TONEMAPPING_MODE_ACES"] = "TONEMAPPING_MODE_ACES";
})(PostFxComponentTonemappingFxDataTonemappingMode || (exports.PostFxComponentTonemappingFxDataTonemappingMode = PostFxComponentTonemappingFxDataTonemappingMode = {}));
function routePostFxComponentDataDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.bloomFx) && delegate.onBloomFx(ctx, val.bloomFx);
    (val === null || val === void 0 ? void 0 : val.channelMixerFx) && delegate.onChannelMixerFx(ctx, val.channelMixerFx);
    (val === null || val === void 0 ? void 0 : val.chromaticAberrationFx) && delegate.onChromaticAberrationFx(ctx, val.chromaticAberrationFx);
    (val === null || val === void 0 ? void 0 : val.colorAdjustmentsFx) && delegate.onColorAdjustmentsFx(ctx, val.colorAdjustmentsFx);
    (val === null || val === void 0 ? void 0 : val.colorCurvesFx) && delegate.onColorCurvesFx(ctx, val.colorCurvesFx);
    (val === null || val === void 0 ? void 0 : val.colorLookupFx) && delegate.onColorLookupFx(ctx, val.colorLookupFx);
    (val === null || val === void 0 ? void 0 : val.depthOfFieldFx) && delegate.onDepthOfFieldFx(ctx, val.depthOfFieldFx);
    (val === null || val === void 0 ? void 0 : val.filmGrainFx) && delegate.onFilmGrainFx(ctx, val.filmGrainFx);
    (val === null || val === void 0 ? void 0 : val.lensDistortionFx) && delegate.onLensDistortionFx(ctx, val.lensDistortionFx);
    (val === null || val === void 0 ? void 0 : val.liftGammaGainFx) && delegate.onLiftGammaGainFx(ctx, val.liftGammaGainFx);
    (val === null || val === void 0 ? void 0 : val.motionBlurFx) && delegate.onMotionBlurFx(ctx, val.motionBlurFx);
    (val === null || val === void 0 ? void 0 : val.paniniProjectionFx) && delegate.onPaniniProjectionFx(ctx, val.paniniProjectionFx);
    (val === null || val === void 0 ? void 0 : val.shadowsMidtonesHighlightsFx) && delegate.onShadowsMidtonesHighlightsFx(ctx, val.shadowsMidtonesHighlightsFx);
    (val === null || val === void 0 ? void 0 : val.splitToningFx) && delegate.onSplitToningFx(ctx, val.splitToningFx);
    (val === null || val === void 0 ? void 0 : val.tonemappingFx) && delegate.onTonemappingFx(ctx, val.tonemappingFx);
    (val === null || val === void 0 ? void 0 : val.vignetteFx) && delegate.onVignetteFx(ctx, val.vignetteFx);
    (val === null || val === void 0 ? void 0 : val.whiteBalanceFx) && delegate.onWhiteBalanceFx(ctx, val.whiteBalanceFx);
}
exports.routePostFxComponentDataDelegate = routePostFxComponentDataDelegate;
//# sourceMappingURL=rendering.pb.js.map