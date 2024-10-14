/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"

export enum AnimationCategory {
  CATEGORY_UNSPECIFIED = "CATEGORY_UNSPECIFIED",
  CATEGORY_EMOTE = "CATEGORY_EMOTE",
  CATEGORY_IDLE = "CATEGORY_IDLE",
  CATEGORY_CHAT_MESSAGE = "CATEGORY_CHAT_MESSAGE",
  CATEGORY_PLAYER_JOIN = "CATEGORY_PLAYER_JOIN",
  CATEGORY_VICTORY = "CATEGORY_VICTORY",
  CATEGORY_DEFEAT = "CATEGORY_DEFEAT",
  CATEGORY_BOOSTER_RECEIVED = "CATEGORY_BOOSTER_RECEIVED",
  CATEGORY_BOOSTER_REQUESTED = "CATEGORY_BOOSTER_REQUESTED",
  CATEGORY_BOOSTER_SENT = "CATEGORY_BOOSTER_SENT",
  CATEGORY_FS_IN_CHAT = "CATEGORY_FS_IN_CHAT",
  CATEGORY_PLAYER_PICK_CARD = "CATEGORY_PLAYER_PICK_CARD",
  CATEGORY_CHEER = "CATEGORY_CHEER",
  CATEGORY_EMOJI = "CATEGORY_EMOJI",
  CATEGORY_DANCE = "CATEGORY_DANCE",
  CATEGORY_MESSAGE = "CATEGORY_MESSAGE",
  CATEGORY_EXCITED = "CATEGORY_EXCITED",
  CATEGORY_ANGRY = "CATEGORY_ANGRY",
  CATEGORY_SAD = "CATEGORY_SAD",
  CATEGORY_CARD_FAILURE = "CATEGORY_CARD_FAILURE",
  CATEGORY_CARD_SUCCESS = "CATEGORY_CARD_SUCCESS",
  CATEGORY_CARD_MAXED_OUT = "CATEGORY_CARD_MAXED_OUT",
  CATEGORY_PLAYER_EXIT = "CATEGORY_PLAYER_EXIT",
  CATEGORY_WS_IN_CHAT = "CATEGORY_WS_IN_CHAT",
  CATEGORY_PLAYER_SWAP_CARD = "CATEGORY_PLAYER_SWAP_CARD",
  CATEGORY_CAMERA_DRIVE = "CATEGORY_CAMERA_DRIVE",
  CATEGORY_CAMERA_DRIVE_EXCITED = "CATEGORY_CAMERA_DRIVE_EXCITED",
  CATEGORY_SPOTLIGHT_CROWD = "CATEGORY_SPOTLIGHT_CROWD",
  CATEGORY_SPOTLIGHT_PODIUM = "CATEGORY_SPOTLIGHT_PODIUM",
  CATEGORY_PHOTO_POSES = "CATEGORY_PHOTO_POSES",
  CATEGORY_EDITOR_PICK_BODY = "CATEGORY_EDITOR_PICK_BODY",
  CATEGORY_EDITOR_PICK_FACE = "CATEGORY_EDITOR_PICK_FACE",
  CATEGORY_EDITOR_PICK_HAT = "CATEGORY_EDITOR_PICK_HAT",
  CATEGORY_EDITOR_PICK_JACKET = "CATEGORY_EDITOR_PICK_JACKET",
  CATEGORY_EDITOR_PICK_PANTS = "CATEGORY_EDITOR_PICK_PANTS",
  CATEGORY_EDITOR_PICK_SHOES = "CATEGORY_EDITOR_PICK_SHOES",
  CATEGORY_EDITOR_IDLE = "CATEGORY_EDITOR_IDLE",
  CATEGORY_EDITOR_PICK_GLOVES = "CATEGORY_EDITOR_PICK_GLOVES",
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
  CATEGORY_POSE_DEFAULT = "CATEGORY_POSE_DEFAULT",
}

export enum AnimationHandedness {
  HANDEDNESS_UNSPECIFIED = "HANDEDNESS_UNSPECIFIED",
  HANDEDNESS_LEFT = "HANDEDNESS_LEFT",
  HANDEDNESS_RIGHT = "HANDEDNESS_RIGHT",
  HANDEDNESS_BOTH = "HANDEDNESS_BOTH",
}

export type AnimationConfig = {
  clamp?: boolean
  fadeInTimeSec?: number
  maxLoops?: number
  randomizeLoops?: boolean
  interruptible?: boolean
  handedness?: AnimationHandedness
}

export type Animation = {
  id?: string
  enabled?: boolean
  category?: AnimationCategory[]
  name?: string
  chatCommand?: string
  iconUrl?: string
  glbUrl?: string
  mirroredGlbUrl?: string
  config?: AnimationConfig
}

export type AnimationList = {
  animations?: Animation[]
}

export type ListAnimationsRequest = {
}

export type ListAnimationsResponse = {
  animations?: Animation[]
}

export type GetAnimationRequest = {
  id?: string
}

export type BatchGetAnimationsRequest = {
  ids?: string[]
}

export type BatchGetAnimationsResponse = {
  animations?: Animation[]
}

export class AvatarAnimationService {
  static ListAnimations(req: ListAnimationsRequest, initReq?: fm.InitReq): Promise<ListAnimationsResponse> {
    return fm.fetchReq<ListAnimationsRequest, ListAnimationsResponse>(`/v1/avatarAnimations?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetAnimation(req: GetAnimationRequest, initReq?: fm.InitReq): Promise<Animation> {
    return fm.fetchReq<GetAnimationRequest, Animation>(`/v1/avatarAnimations/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static BatchGetAnimations(req: BatchGetAnimationsRequest, initReq?: fm.InitReq): Promise<BatchGetAnimationsResponse> {
    return fm.fetchReq<BatchGetAnimationsRequest, BatchGetAnimationsResponse>(`/v1/avatarAnimations:batchGet`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}