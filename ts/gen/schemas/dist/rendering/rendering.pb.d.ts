type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum LightType {
    TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
    TYPE_POINT = "TYPE_POINT",
    TYPE_SPOT = "TYPE_SPOT",
    TYPE_DIRECTIONAL = "TYPE_DIRECTIONAL"
}
export declare enum PostFxComponentDepthOfFieldFxDataDepthOfFieldMode {
    DEPTH_OF_FIELD_MODE_UNSPECIFIED = "DEPTH_OF_FIELD_MODE_UNSPECIFIED",
    DEPTH_OF_FIELD_MODE_OFF = "DEPTH_OF_FIELD_MODE_OFF",
    DEPTH_OF_FIELD_MODE_GAUSSIAN = "DEPTH_OF_FIELD_MODE_GAUSSIAN",
    DEPTH_OF_FIELD_MODE_BOKEH = "DEPTH_OF_FIELD_MODE_BOKEH"
}
export declare enum PostFxComponentFilmGrainFxDataFilmGrainLookup {
    FILM_GRAIN_LOOKUP_UNSPECIFIED = "FILM_GRAIN_LOOKUP_UNSPECIFIED",
    FILM_GRAIN_LOOKUP_THIN_1 = "FILM_GRAIN_LOOKUP_THIN_1",
    FILM_GRAIN_LOOKUP_THIN_2 = "FILM_GRAIN_LOOKUP_THIN_2",
    FILM_GRAIN_LOOKUP_MEDIUM_1 = "FILM_GRAIN_LOOKUP_MEDIUM_1",
    FILM_GRAIN_LOOKUP_MEDIUM_2 = "FILM_GRAIN_LOOKUP_MEDIUM_2",
    FILM_GRAIN_LOOKUP_MEDIUM_3 = "FILM_GRAIN_LOOKUP_MEDIUM_3",
    FILM_GRAIN_LOOKUP_MEDIUM_4 = "FILM_GRAIN_LOOKUP_MEDIUM_4",
    FILM_GRAIN_LOOKUP_MEDIUM_5 = "FILM_GRAIN_LOOKUP_MEDIUM_5",
    FILM_GRAIN_LOOKUP_MEDIUM_6 = "FILM_GRAIN_LOOKUP_MEDIUM_6",
    FILM_GRAIN_LOOKUP_LARGE_01 = "FILM_GRAIN_LOOKUP_LARGE_01",
    FILM_GRAIN_LOOKUP_LARGE_02 = "FILM_GRAIN_LOOKUP_LARGE_02",
    FILM_GRAIN_LOOKUP_CUSTOM = "FILM_GRAIN_LOOKUP_CUSTOM"
}
export declare enum PostFxComponentMotionBlurFxDataMotionBlurMode {
    MOTION_BLUR_MODE_UNSPECIFIED = "MOTION_BLUR_MODE_UNSPECIFIED",
    MOTION_BLUR_MODE_CAMERA_ONLY = "MOTION_BLUR_MODE_CAMERA_ONLY",
    MOTION_BLUR_MODE_CAMERA_AND_OBJECTS = "MOTION_BLUR_MODE_CAMERA_AND_OBJECTS"
}
export declare enum PostFxComponentMotionBlurFxDataMotionBlurQuality {
    MOTION_BLUR_QUALITY_UNSPECIFIED = "MOTION_BLUR_QUALITY_UNSPECIFIED",
    MOTION_BLUR_QUALITY_LOW = "MOTION_BLUR_QUALITY_LOW",
    MOTION_BLUR_QUALITY_MEDIUM = "MOTION_BLUR_QUALITY_MEDIUM",
    MOTION_BLUR_QUALITY_HIGH = "MOTION_BLUR_QUALITY_HIGH"
}
export declare enum PostFxComponentTonemappingFxDataTonemappingMode {
    TONEMAPPING_MODE_UNSPECIFIED = "TONEMAPPING_MODE_UNSPECIFIED",
    TONEMAPPING_MODE_NONE = "TONEMAPPING_MODE_NONE",
    TONEMAPPING_MODE_NEUTRAL = "TONEMAPPING_MODE_NEUTRAL",
    TONEMAPPING_MODE_ACES = "TONEMAPPING_MODE_ACES"
}
export type Vector2 = {
    x?: number;
    y?: number;
};
export type Vector3 = {
    x?: number;
    y?: number;
    z?: number;
};
export type Vector4 = {
    x?: number;
    y?: number;
    z?: number;
    w?: number;
};
export type Rotation = {
    x?: number;
    y?: number;
    z?: number;
    w?: number;
};
export type Scale = {
    x?: number;
    y?: number;
    z?: number;
};
export type Color = {
    r?: number;
    g?: number;
    b?: number;
    a?: number;
};
export type Transform = {
    position?: Vector3;
    rotation?: Rotation;
    scale?: Scale;
};
export type Light = {
    type?: LightType;
    transform?: Transform;
    angle?: Vector2;
    range?: number;
    color?: Color;
    intensity?: number;
};
export type Camera = {
    name?: string;
    transform?: Transform;
    frustum?: Frustum;
};
export type Frustum = {
    nearClip?: number;
    farClip?: number;
    focalLength?: number;
    sensorSize?: Vector2;
    lensShift?: Vector2;
    broadcastWidth?: number;
    broadcastHeight?: number;
};
export type PostFxComponentBloomFxData = {
    threshold?: number;
    intensity?: number;
    scatter?: number;
    clamp?: number;
    tint?: Color;
    highQualityFiltering?: boolean;
    skipIterations?: number;
    dirtTextureUri?: string;
    dirtIntensity?: number;
};
export type PostFxComponentChannelMixerFxData = {
    redOutRedIn?: number;
    redOutGreenIn?: number;
    redOutBlueIn?: number;
    greenOutRedIn?: number;
    greenOutGreenIn?: number;
    greenOutBlueIn?: number;
    blueOutRedIn?: number;
    blueOutGreenIn?: number;
    blueOutBlueIn?: number;
};
export type PostFxComponentChromaticAberrationFxData = {
    intensity?: number;
};
export type PostFxComponentColorAdjustmentsFxData = {
    postExposure?: number;
    contrast?: number;
    colorFilter?: Color;
    hueShift?: number;
    saturation?: number;
};
export type PostFxComponentColorCurvesFxData = {
    masterUri?: string;
    redUri?: string;
    greenUri?: string;
    blueUri?: string;
    hueVsHueUri?: string;
    hueVsSatUri?: string;
    satVsSatUri?: string;
    lumVsSatUri?: string;
};
export type PostFxComponentColorLookupFxData = {
    textureUri?: string;
    contribution?: number;
};
export type PostFxComponentDepthOfFieldFxData = {
    mode?: PostFxComponentDepthOfFieldFxDataDepthOfFieldMode;
    gaussianStart?: number;
    gaussianEnd?: number;
    gaussianMaxRadius?: number;
    highQualitySampling?: boolean;
    focusDistance?: number;
    aperture?: number;
    focalLength?: number;
    bladeCount?: number;
    bladeCurvature?: number;
    bladeRotation?: number;
};
export type PostFxComponentFilmGrainFxData = {
    type?: PostFxComponentFilmGrainFxDataFilmGrainLookup;
    intensity?: number;
    response?: number;
    textureUri?: string;
};
export type PostFxComponentLensDistortionFxData = {
    intensity?: number;
    xMultiplier?: number;
    yMultiplier?: number;
    center?: Vector2;
    scale?: number;
};
export type PostFxComponentLiftGammaGainFxData = {
    lift?: Vector4;
    gamma?: Vector4;
    gain?: Vector4;
};
export type PostFxComponentMotionBlurFxData = {
    mode?: PostFxComponentMotionBlurFxDataMotionBlurMode;
    quality?: PostFxComponentMotionBlurFxDataMotionBlurQuality;
    intensity?: number;
    clamp?: number;
};
export type PostFxComponentPaniniProjectionFxData = {
    distance?: number;
    cropToFit?: number;
};
export type PostFxComponentShadowsMidtonesHighlightsFxData = {
    shadows?: Vector4;
    midtones?: Vector4;
    highlights?: Vector4;
    shadowsStart?: number;
    shadowsEnd?: number;
    highlightsStart?: number;
    highlightsEnd?: number;
};
export type PostFxComponentSplitToningFxData = {
    shadows?: Color;
    highlights?: Color;
    balance?: number;
};
export type PostFxComponentTonemappingFxData = {
    mode?: PostFxComponentTonemappingFxDataTonemappingMode;
};
export type PostFxComponentVignetteFxData = {
    color?: Color;
    center?: Vector2;
    intensity?: number;
    smoothness?: number;
    rounded?: boolean;
};
export type PostFxComponentWhiteBalanceFxData = {
    temperature?: number;
    tint?: number;
};
type BasePostFxComponent = {
    name?: string;
};
export type PostFxComponent = BasePostFxComponent & OneOf<{
    bloomFx: PostFxComponentBloomFxData;
    channelMixerFx: PostFxComponentChannelMixerFxData;
    chromaticAberrationFx: PostFxComponentChromaticAberrationFxData;
    colorAdjustmentsFx: PostFxComponentColorAdjustmentsFxData;
    colorCurvesFx: PostFxComponentColorCurvesFxData;
    colorLookupFx: PostFxComponentColorLookupFxData;
    depthOfFieldFx: PostFxComponentDepthOfFieldFxData;
    filmGrainFx: PostFxComponentFilmGrainFxData;
    lensDistortionFx: PostFxComponentLensDistortionFxData;
    liftGammaGainFx: PostFxComponentLiftGammaGainFxData;
    motionBlurFx: PostFxComponentMotionBlurFxData;
    paniniProjectionFx: PostFxComponentPaniniProjectionFxData;
    shadowsMidtonesHighlightsFx: PostFxComponentShadowsMidtonesHighlightsFxData;
    splitToningFx: PostFxComponentSplitToningFxData;
    tonemappingFx: PostFxComponentTonemappingFxData;
    vignetteFx: PostFxComponentVignetteFxData;
    whiteBalanceFx: PostFxComponentWhiteBalanceFxData;
}>;
export interface IPostFxComponentDataDelegate<C> {
    onBloomFx(ctx: C, ev: PostFxComponentBloomFxData): void;
    onChannelMixerFx(ctx: C, ev: PostFxComponentChannelMixerFxData): void;
    onChromaticAberrationFx(ctx: C, ev: PostFxComponentChromaticAberrationFxData): void;
    onColorAdjustmentsFx(ctx: C, ev: PostFxComponentColorAdjustmentsFxData): void;
    onColorCurvesFx(ctx: C, ev: PostFxComponentColorCurvesFxData): void;
    onColorLookupFx(ctx: C, ev: PostFxComponentColorLookupFxData): void;
    onDepthOfFieldFx(ctx: C, ev: PostFxComponentDepthOfFieldFxData): void;
    onFilmGrainFx(ctx: C, ev: PostFxComponentFilmGrainFxData): void;
    onLensDistortionFx(ctx: C, ev: PostFxComponentLensDistortionFxData): void;
    onLiftGammaGainFx(ctx: C, ev: PostFxComponentLiftGammaGainFxData): void;
    onMotionBlurFx(ctx: C, ev: PostFxComponentMotionBlurFxData): void;
    onPaniniProjectionFx(ctx: C, ev: PostFxComponentPaniniProjectionFxData): void;
    onShadowsMidtonesHighlightsFx(ctx: C, ev: PostFxComponentShadowsMidtonesHighlightsFxData): void;
    onSplitToningFx(ctx: C, ev: PostFxComponentSplitToningFxData): void;
    onTonemappingFx(ctx: C, ev: PostFxComponentTonemappingFxData): void;
    onVignetteFx(ctx: C, ev: PostFxComponentVignetteFxData): void;
    onWhiteBalanceFx(ctx: C, ev: PostFxComponentWhiteBalanceFxData): void;
}
export declare function routePostFxComponentDataDelegate<C>(ctx: C, val: PostFxComponent, delegate: IPostFxComponentDataDelegate<C>): void;
export {};
//# sourceMappingURL=rendering.pb.d.ts.map