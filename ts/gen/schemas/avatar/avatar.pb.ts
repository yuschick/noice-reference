/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum Gender {
  GENDER_UNSPECIFIED = "GENDER_UNSPECIFIED",
  GENDER_MALE = "GENDER_MALE",
  GENDER_FEMALE = "GENDER_FEMALE",
}

export enum AvatarPartCategory {
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
  CATEGORY_COLOR_PRESET = "CATEGORY_COLOR_PRESET",
  CATEGORY_SKIN = "CATEGORY_SKIN",
  CATEGORY_BEARD = "CATEGORY_BEARD",
}

export enum AvatarAssetsLodSkeletonType {
  SKELETON_TYPE_UNSPECIFIED = "SKELETON_TYPE_UNSPECIFIED",
  SKELETON_TYPE_COMPLEX = "SKELETON_TYPE_COMPLEX",
  SKELETON_TYPE_SIMPLE = "SKELETON_TYPE_SIMPLE",
}

export enum AvatarAssetsImageCategory {
  CATEGORY_UNSPECIFIED = "CATEGORY_UNSPECIFIED",
  CATEGORY_PROFILE_FACE = "CATEGORY_PROFILE_FACE",
  CATEGORY_PROFILE_BODY = "CATEGORY_PROFILE_BODY",
  CATEGORY_POSE_COOL = "CATEGORY_POSE_COOL",
  CATEGORY_POSE_CRYING = "CATEGORY_POSE_CRYING",
  CATEGORY_POSE_JUST_JOKING = "CATEGORY_POSE_JUST_JOKING",
  CATEGORY_POSE_LOL = "CATEGORY_POSE_LOL",
  CATEGORY_POSE_LOVE = "CATEGORY_POSE_LOVE",
  CATEGORY_POSE_NOICE = "CATEGORY_POSE_NOICE",
  CATEGORY_POSE_OHNO = "CATEGORY_POSE_OHNO",
  CATEGORY_POSE_PARTY = "CATEGORY_POSE_PARTY",
  CATEGORY_POSE_RAGE = "CATEGORY_POSE_RAGE",
  CATEGORY_POSE_SAD = "CATEGORY_POSE_SAD",
  CATEGORY_POSE_SHOCKED = "CATEGORY_POSE_SHOCKED",
  CATEGORY_POSE_SICK = "CATEGORY_POSE_SICK",
  CATEGORY_POSE_SMILE = "CATEGORY_POSE_SMILE",
  CATEGORY_POSE_SURPRISED = "CATEGORY_POSE_SURPRISED",
  CATEGORY_POSE_SWEAT = "CATEGORY_POSE_SWEAT",
  CATEGORY_POSE_WHOA = "CATEGORY_POSE_WHOA",
  CATEGORY_POSE_CONFUSED = "CATEGORY_POSE_CONFUSED",
}

export enum ValidateAvatarCompositionResponseChangeReason {
  REASON_UNSPECIFIED = "REASON_UNSPECIFIED",
  REASON_AVATAR_PART_HEAD_REQUIRED = "REASON_AVATAR_PART_HEAD_REQUIRED",
  REASON_AVATAR_PART_BODY_REQUIRED = "REASON_AVATAR_PART_BODY_REQUIRED",
  REASON_AVATAR_PART_TORSO_REQUIRED = "REASON_AVATAR_PART_TORSO_REQUIRED",
  REASON_AVATAR_PART_LEGS_REQUIRED = "REASON_AVATAR_PART_LEGS_REQUIRED",
  REASON_AVATAR_PART_EYES_REQUIRED = "REASON_AVATAR_PART_EYES_REQUIRED",
  REASON_AVATAR_PART_UNAVAILABLE = "REASON_AVATAR_PART_UNAVAILABLE",
  REASON_AVATAR_PART_UNKNOWN = "REASON_AVATAR_PART_UNKNOWN",
}

export type AvatarBuilderOptions = {
  serializeShoeOffset?: boolean
  applyShoeOffset?: boolean
  deformNormalsAndTangents?: boolean
  smoothFaceItemDeformations?: boolean
  removeDeformationUvs?: boolean
}

export type AvatarOptimizerOptions = {
  removeHiddenGeometry?: boolean
  removeTeeth?: boolean
}

export type AvatarGeneratorOptions = {
  builderOptions?: AvatarBuilderOptions
  optimizerOptions?: AvatarOptimizerOptions
  simplifyAvatar?: boolean
  renderPoses?: boolean
  poseFacialExpressions?: boolean
}

export type AvatarGenerationRequestEvent = {
  avatarId?: string
  composition?: AvatarComposition
  disableTextureOptimization?: boolean
  retryOnFailure?: boolean
  builderOptions?: AvatarBuilderOptions
  optimizerOptions?: AvatarOptimizerOptions
  generatorOptions?: AvatarGeneratorOptions
}

export type AvatarPartColorGroup = {
  colors?: string[]
}

export type AvatarPartGlbUrlOverride = {
  category?: AvatarPartCategory
  glbUrl?: string
}

export type AvatarPartSkinData = {
  baseMapUrl?: string
  normalMapUrl?: string
  ormMapUrl?: string
  emissionMapUrl?: string
}

export type AvatarPart = {
  id?: string
  enabled?: boolean
  category?: AvatarPartCategory
  name?: string
  glbUrl?: string
  previewImgUrl?: string
  categoryOverride?: AvatarPartCategory[]
  gender?: Gender
  default?: boolean
  clothingSet?: string
  color?: string
  url?: string
  colors?: string[]
  experimental?: boolean
  colorPresetOptions?: string[]
  glbUrlOverride?: AvatarPartGlbUrlOverride
  userDefault?: boolean
  uniqueBootstrap?: boolean
  skinOptions?: string[]
  skinData?: AvatarPartSkinData
  channelId?: string
  sellable?: boolean
}

export type AvatarPartList = {
  avatarParts?: AvatarPart[]
}

export type AvatarPartCustomization = {
  partId?: string
  colorPreset?: string
  skin?: string
}

export type AvatarComposition = {
  partIds?: string[]
  generatorVersion?: string
  partCustomizations?: AvatarPartCustomization[]
}

export type AvatarAssetsLod = {
  skeletonType?: AvatarAssetsLodSkeletonType
  glbUrl?: string
}

export type AvatarAssetsImage = {
  category?: AvatarAssetsImageCategory
  url?: string
}

export type AvatarAssets = {
  lods?: AvatarAssetsLod[]
  images?: AvatarAssetsImage[]
}

export type Avatar = {
  id?: string
  gender?: string
  face?: string
  body?: string
  avatar3D?: string
  avatarLods?: string[]
  avatarComposition?: AvatarComposition
  selectable?: boolean
  assets?: AvatarAssets
}

export type ListAvatarsRequest = {
  cursor?: ApiCursor.Cursor
  listAll?: boolean
}

export type ListAvatarsResponse = {
  avatars?: Avatar[]
  pageInfo?: ApiCursor.PageInfo
}

export type GetAvatarRequest = {
  avatarId?: string
}

export type BatchGetAvatarsRequest = {
  ids?: string[]
}

export type BatchGetAvatarsResponse = {
  avatars?: Avatar[]
}

export type ListAvatarPartsRequest = {
}

export type ListAvatarPartsResponse = {
  avatarParts?: AvatarPart[]
}

export type GetAvatarPartRequest = {
  avatarPartId?: string
}

export type BatchGetAvatarPartsRequest = {
  ids?: string[]
}

export type BatchGetAvatarPartsResponse = {
  avatarParts?: AvatarPart[]
}

export type GenerateAvatarRequest = {
  composition?: AvatarComposition
  disableTextureOptimization?: boolean
}

export type UpdateAvatarRequest = {
  body?: Avatar
}

export type GenerateAvatarEventCompleted = {
  avatar?: Avatar
}

export type GenerateAvatarEventProgress = {
  progress?: number
  stepName?: string
  stepIndex?: number
  stepCount?: number
}

export type GenerateAvatarEventError = {
  message?: string
  code?: number
}


type BaseGenerateAvatarEvent = {
  id?: string
}

export type GenerateAvatarEvent = BaseGenerateAvatarEvent
  & OneOf<{ completed: GenerateAvatarEventCompleted; progress: GenerateAvatarEventProgress; error: GenerateAvatarEventError }>

export type ValidateAvatarCompositionRequest = {
  composition?: AvatarComposition
}

export type ValidateAvatarCompositionResponseChangeAvatarPartAdded = {
  id?: string
  reason?: ValidateAvatarCompositionResponseChangeReason
}

export type ValidateAvatarCompositionResponseChangeAvatarPartRemoved = {
  id?: string
  reason?: ValidateAvatarCompositionResponseChangeReason
}

export type ValidateAvatarCompositionResponseChangeAvatarPartReplaced = {
  id?: string
  replacementId?: string
  reason?: ValidateAvatarCompositionResponseChangeReason
}


type BaseValidateAvatarCompositionResponseChange = {
}

export type ValidateAvatarCompositionResponseChange = BaseValidateAvatarCompositionResponseChange
  & OneOf<{ added: ValidateAvatarCompositionResponseChangeAvatarPartAdded; removed: ValidateAvatarCompositionResponseChangeAvatarPartRemoved; replaced: ValidateAvatarCompositionResponseChangeAvatarPartReplaced }>

export type ValidateAvatarCompositionResponse = {
  missingPartCategories?: AvatarPartCategory[]
  missingPartIds?: string[]
  duplicatePartIds?: string[]
  composition?: AvatarComposition
  changes?: ValidateAvatarCompositionResponseChange[]
  isDefault?: boolean
}

export type RegenerateAvatarRequest = {
  avatarId?: string
}




export interface IGenerateAvatarEventEventDelegate<C> {
  onCompleted(ctx: C, ev: GenerateAvatarEventCompleted): void
  onProgress(ctx: C, ev: GenerateAvatarEventProgress): void
  onError(ctx: C, ev: GenerateAvatarEventError): void
}

export function routeGenerateAvatarEventEventDelegate<C>(ctx: C, val: GenerateAvatarEvent, delegate: IGenerateAvatarEventEventDelegate<C>) {
  val?.completed && delegate.onCompleted(ctx, val.completed)
  val?.progress && delegate.onProgress(ctx, val.progress)
  val?.error && delegate.onError(ctx, val.error)
}




export interface IValidateAvatarCompositionResponseChangeActionDelegate<C> {
  onAdded(ctx: C, ev: ValidateAvatarCompositionResponseChangeAvatarPartAdded): void
  onRemoved(ctx: C, ev: ValidateAvatarCompositionResponseChangeAvatarPartRemoved): void
  onReplaced(ctx: C, ev: ValidateAvatarCompositionResponseChangeAvatarPartReplaced): void
}

export function routeValidateAvatarCompositionResponseChangeActionDelegate<C>(ctx: C, val: ValidateAvatarCompositionResponseChange, delegate: IValidateAvatarCompositionResponseChangeActionDelegate<C>) {
  val?.added && delegate.onAdded(ctx, val.added)
  val?.removed && delegate.onRemoved(ctx, val.removed)
  val?.replaced && delegate.onReplaced(ctx, val.replaced)
}

export class AvatarService {
  static ListAvatars(req: ListAvatarsRequest, initReq?: fm.InitReq): Promise<ListAvatarsResponse> {
    return fm.fetchReq<ListAvatarsRequest, ListAvatarsResponse>(`/v1/avatars?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetAvatar(req: GetAvatarRequest, initReq?: fm.InitReq): Promise<Avatar> {
    return fm.fetchReq<GetAvatarRequest, Avatar>(`/v1/avatars/${req["avatarId"]}?${fm.renderURLSearchParams(req, ["avatarId"])}`, {...initReq, method: "GET"})
  }
  static UpdateAvatar(req: UpdateAvatarRequest, initReq?: fm.InitReq): Promise<Avatar> {
    return fm.fetchReq<UpdateAvatarRequest, Avatar>(`/v1/avatars/${req["body"]["id"]}`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static BatchGetAvatars(req: BatchGetAvatarsRequest, initReq?: fm.InitReq): Promise<BatchGetAvatarsResponse> {
    return fm.fetchReq<BatchGetAvatarsRequest, BatchGetAvatarsResponse>(`/v1/avatars:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListAvatarParts(req: ListAvatarPartsRequest, initReq?: fm.InitReq): Promise<ListAvatarPartsResponse> {
    return fm.fetchReq<ListAvatarPartsRequest, ListAvatarPartsResponse>(`/v1/avatarParts?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetAvatarPart(req: GetAvatarPartRequest, initReq?: fm.InitReq): Promise<AvatarPart> {
    return fm.fetchReq<GetAvatarPartRequest, AvatarPart>(`/v1/avatarParts/${req["avatarPartId"]}?${fm.renderURLSearchParams(req, ["avatarPartId"])}`, {...initReq, method: "GET"})
  }
  static BatchGetAvatarParts(req: BatchGetAvatarPartsRequest, initReq?: fm.InitReq): Promise<BatchGetAvatarPartsResponse> {
    return fm.fetchReq<BatchGetAvatarPartsRequest, BatchGetAvatarPartsResponse>(`/v1/avatarParts:batchGet`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GenerateAvatar(req: GenerateAvatarRequest, entityNotifier?: fm.NotifyStreamEntityArrival<GenerateAvatarEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<GenerateAvatarRequest, GenerateAvatarEvent>(`/v1/generateAvatar`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<GenerateAvatarRequest, GenerateAvatarEvent>(`/v1/generateAvatar`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static RegenerateAvatar(req: RegenerateAvatarRequest, entityNotifier?: fm.NotifyStreamEntityArrival<GenerateAvatarEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<RegenerateAvatarRequest, GenerateAvatarEvent>(`/v1/avatars/${req["avatarId"]}:regenerate`, entityNotifier, {...initReq, method: "POST"})
    }
    return fm.fetchStreamingRequest<RegenerateAvatarRequest, GenerateAvatarEvent>(`/v1/avatars/${req["avatarId"]}:regenerate`, entityNotifier, {...initReq, method: "POST"})
  }
  static ValidateAvatarComposition(req: ValidateAvatarCompositionRequest, initReq?: fm.InitReq): Promise<ValidateAvatarCompositionResponse> {
    return fm.fetchReq<ValidateAvatarCompositionRequest, ValidateAvatarCompositionResponse>(`/v1/validateAvatarComposition`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}