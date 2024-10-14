import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum Gender {
    GENDER_UNSPECIFIED = "GENDER_UNSPECIFIED",
    GENDER_MALE = "GENDER_MALE",
    GENDER_FEMALE = "GENDER_FEMALE"
}
export declare enum AvatarPartCategory {
    CATEGORY_UNSPECIFIED = "CATEGORY_UNSPECIFIED",
    CATEGORY_BODY = "CATEGORY_BODY",
    CATEGORY_HEAD = "CATEGORY_HEAD",
    CATEGORY_HEAD_ITEM = "CATEGORY_HEAD_ITEM",
    CATEGORY_FACE_ITEM = "CATEGORY_FACE_ITEM",
    CATEGORY_HAIR = "CATEGORY_HAIR",
    CATEGORY_TORSO = "CATEGORY_TORSO",
    CATEGORY_HANDS = "CATEGORY_HANDS",
    CATEGORY_LEGS = "CATEGORY_LEGS",
    CATEGORY_SHOES = "CATEGORY_SHOES",
    CATEGORY_EYES = "CATEGORY_EYES",
    CATEGORY_EYELASHES = "CATEGORY_EYELASHES",
    CATEGORY_EYEBROWS = "CATEGORY_EYEBROWS",
    CATEGORY_TEETH = "CATEGORY_TEETH",
    CATEGORY_SKIN_COLOR = "CATEGORY_SKIN_COLOR",
    CATEGORY_HAIR_COLOR = "CATEGORY_HAIR_COLOR",
    CATEGORY_EYELASHES_COLOR = "CATEGORY_EYELASHES_COLOR",
    CATEGORY_EYEBROWS_COLOR = "CATEGORY_EYEBROWS_COLOR",
    CATEGORY_COLOR_PRESET = "CATEGORY_COLOR_PRESET"
}
export declare enum ValidateAvatarCompositionResponseChangeReason {
    REASON_UNSPECIFIED = "REASON_UNSPECIFIED",
    REASON_AVATAR_PART_HEAD_REQUIRED = "REASON_AVATAR_PART_HEAD_REQUIRED",
    REASON_AVATAR_PART_BODY_REQUIRED = "REASON_AVATAR_PART_BODY_REQUIRED",
    REASON_AVATAR_PART_TORSO_REQUIRED = "REASON_AVATAR_PART_TORSO_REQUIRED",
    REASON_AVATAR_PART_LEGS_REQUIRED = "REASON_AVATAR_PART_LEGS_REQUIRED",
    REASON_AVATAR_PART_EYES_REQUIRED = "REASON_AVATAR_PART_EYES_REQUIRED",
    REASON_AVATAR_PART_UNAVAILABLE = "REASON_AVATAR_PART_UNAVAILABLE",
    REASON_AVATAR_PART_UNKNOWN = "REASON_AVATAR_PART_UNKNOWN"
}
export type AvatarBuilderOptions = {
    serializeShoeOffset?: boolean;
    applyShoeOffset?: boolean;
    deformNormalsAndTangents?: boolean;
    smoothFaceItemDeformations?: boolean;
    removeDeformationUvs?: boolean;
};
export type AvatarOptimizerOptions = {
    removeHiddenGeometry?: boolean;
};
export type AvatarGeneratorOptions = {
    builderOptions?: AvatarBuilderOptions;
    optimizerOptions?: AvatarOptimizerOptions;
    simplifyAvatar?: boolean;
};
export type AvatarGenerationRequestEvent = {
    avatarId?: string;
    composition?: AvatarComposition;
    disableTextureOptimization?: boolean;
    retryOnFailure?: boolean;
    builderOptions?: AvatarBuilderOptions;
    optimizerOptions?: AvatarOptimizerOptions;
    generatorOptions?: AvatarGeneratorOptions;
};
export type AvatarPartColorGroup = {
    colors?: string[];
};
export type AvatarPartGlbUrlOverride = {
    category?: AvatarPartCategory;
    glbUrl?: string;
};
export type AvatarPart = {
    id?: string;
    enabled?: boolean;
    category?: AvatarPartCategory;
    name?: string;
    glbUrl?: string;
    previewImgUrl?: string;
    categoryOverride?: AvatarPartCategory[];
    gender?: Gender;
    default?: boolean;
    clothingSet?: string;
    color?: string;
    url?: string;
    colors?: string[];
    experimental?: boolean;
    colorPresetOptions?: string[];
    glbUrlOverride?: AvatarPartGlbUrlOverride;
};
export type AvatarPartList = {
    avatarParts?: AvatarPart[];
};
export type AvatarPartCustomization = {
    partId?: string;
    colorPreset?: string;
};
export type AvatarComposition = {
    partIds?: string[];
    generatorVersion?: string;
    partCustomizations?: AvatarPartCustomization[];
};
export type Avatar = {
    id?: string;
    gender?: string;
    face?: string;
    body?: string;
    avatar3D?: string;
    avatarLods?: string[];
    avatarComposition?: AvatarComposition;
    selectable?: boolean;
};
export type ListAvatarsRequest = {
    cursor?: ApiCursor.Cursor;
    listAll?: boolean;
};
export type ListAvatarsResponse = {
    avatars?: Avatar[];
    pageInfo?: ApiCursor.PageInfo;
};
export type GetAvatarRequest = {
    avatarId?: string;
};
export type BatchGetAvatarsRequest = {
    ids?: string[];
};
export type BatchGetAvatarsResponse = {
    avatars?: Avatar[];
};
export type ListAvatarPartsRequest = {};
export type ListAvatarPartsResponse = {
    avatarParts?: AvatarPart[];
};
export type GetAvatarPartRequest = {
    avatarPartId?: string;
};
export type BatchGetAvatarPartsRequest = {
    ids?: string[];
};
export type BatchGetAvatarPartsResponse = {
    avatarParts?: AvatarPart[];
};
export type GenerateAvatarRequest = {
    composition?: AvatarComposition;
    disableTextureOptimization?: boolean;
};
export type UpdateAvatarRequest = {
    body?: Avatar;
};
export type GenerateAvatarEventCompleted = {
    avatar?: Avatar;
};
export type GenerateAvatarEventProgress = {
    progress?: number;
    stepName?: string;
    stepIndex?: number;
    stepCount?: number;
};
export type GenerateAvatarEventError = {
    message?: string;
    code?: number;
};
type BaseGenerateAvatarEvent = {
    id?: string;
};
export type GenerateAvatarEvent = BaseGenerateAvatarEvent & OneOf<{
    completed: GenerateAvatarEventCompleted;
    progress: GenerateAvatarEventProgress;
    error: GenerateAvatarEventError;
}>;
export type ValidateAvatarCompositionRequest = {
    composition?: AvatarComposition;
};
export type ValidateAvatarCompositionResponseChangeAvatarPartAdded = {
    id?: string;
    reason?: ValidateAvatarCompositionResponseChangeReason;
};
export type ValidateAvatarCompositionResponseChangeAvatarPartRemoved = {
    id?: string;
    reason?: ValidateAvatarCompositionResponseChangeReason;
};
export type ValidateAvatarCompositionResponseChangeAvatarPartReplaced = {
    id?: string;
    replacementId?: string;
    reason?: ValidateAvatarCompositionResponseChangeReason;
};
type BaseValidateAvatarCompositionResponseChange = {};
export type ValidateAvatarCompositionResponseChange = BaseValidateAvatarCompositionResponseChange & OneOf<{
    added: ValidateAvatarCompositionResponseChangeAvatarPartAdded;
    removed: ValidateAvatarCompositionResponseChangeAvatarPartRemoved;
    replaced: ValidateAvatarCompositionResponseChangeAvatarPartReplaced;
}>;
export type ValidateAvatarCompositionResponse = {
    missingPartCategories?: AvatarPartCategory[];
    missingPartIds?: string[];
    duplicatePartIds?: string[];
    composition?: AvatarComposition;
    changes?: ValidateAvatarCompositionResponseChange[];
    isDefault?: boolean;
};
export type RegenerateAvatarRequest = {
    avatarId?: string;
};
export interface IGenerateAvatarEventEventDelegate<C> {
    onCompleted(ctx: C, ev: GenerateAvatarEventCompleted): void;
    onProgress(ctx: C, ev: GenerateAvatarEventProgress): void;
    onError(ctx: C, ev: GenerateAvatarEventError): void;
}
export declare function routeGenerateAvatarEventEventDelegate<C>(ctx: C, val: GenerateAvatarEvent, delegate: IGenerateAvatarEventEventDelegate<C>): void;
export interface IValidateAvatarCompositionResponseChangeActionDelegate<C> {
    onAdded(ctx: C, ev: ValidateAvatarCompositionResponseChangeAvatarPartAdded): void;
    onRemoved(ctx: C, ev: ValidateAvatarCompositionResponseChangeAvatarPartRemoved): void;
    onReplaced(ctx: C, ev: ValidateAvatarCompositionResponseChangeAvatarPartReplaced): void;
}
export declare function routeValidateAvatarCompositionResponseChangeActionDelegate<C>(ctx: C, val: ValidateAvatarCompositionResponseChange, delegate: IValidateAvatarCompositionResponseChangeActionDelegate<C>): void;
export declare class AvatarService {
    static ListAvatars(req: ListAvatarsRequest, initReq?: fm.InitReq): Promise<ListAvatarsResponse>;
    static GetAvatar(req: GetAvatarRequest, initReq?: fm.InitReq): Promise<Avatar>;
    static UpdateAvatar(req: UpdateAvatarRequest, initReq?: fm.InitReq): Promise<Avatar>;
    static BatchGetAvatars(req: BatchGetAvatarsRequest, initReq?: fm.InitReq): Promise<BatchGetAvatarsResponse>;
    static ListAvatarParts(req: ListAvatarPartsRequest, initReq?: fm.InitReq): Promise<ListAvatarPartsResponse>;
    static GetAvatarPart(req: GetAvatarPartRequest, initReq?: fm.InitReq): Promise<AvatarPart>;
    static BatchGetAvatarParts(req: BatchGetAvatarPartsRequest, initReq?: fm.InitReq): Promise<BatchGetAvatarPartsResponse>;
    static GenerateAvatar(req: GenerateAvatarRequest, entityNotifier?: fm.NotifyStreamEntityArrival<GenerateAvatarEvent>, initReq?: fm.InitReq): Promise<void>;
    static RegenerateAvatar(req: RegenerateAvatarRequest, entityNotifier?: fm.NotifyStreamEntityArrival<GenerateAvatarEvent>, initReq?: fm.InitReq): Promise<void>;
    static ValidateAvatarComposition(req: ValidateAvatarCompositionRequest, initReq?: fm.InitReq): Promise<ValidateAvatarCompositionResponse>;
}
export {};
//# sourceMappingURL=avatar.pb.d.ts.map