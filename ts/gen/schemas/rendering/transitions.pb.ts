/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as Game_logicGame_logic from "../game-logic/game_logic.pb"
import * as GoogleProtobufDuration from "../google/protobuf/duration.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum ContentModeUserSpotlightMode {
  MODE_UNSPECIFIED = "MODE_UNSPECIFIED",
  MODE_BEST_PLAYER = "MODE_BEST_PLAYER",
  MODE_BEST_CARD = "MODE_BEST_CARD",
}

export enum TransitionTarget {
  TARGET_UNSPECIFIED = "TARGET_UNSPECIFIED",
  TARGET_NOICE_LOGO = "TARGET_NOICE_LOGO",
  TARGET_NONE = "TARGET_NONE",
}

export enum CameraTransitionRequestTransitionTarget {
  TRANSITION_TARGET_UNSPECIFIED = "TRANSITION_TARGET_UNSPECIFIED",
  TRANSITION_TARGET_ARENA = "TRANSITION_TARGET_ARENA",
  TRANSITION_TARGET_CAMERA_DRIVE1 = "TRANSITION_TARGET_CAMERA_DRIVE1",
  TRANSITION_TARGET_SPOTLIGHT = "TRANSITION_TARGET_SPOTLIGHT",
}

export type ContentModeGame = {
}

export type ContentModeMatchEnd = {
}


type BaseContentModeUserSpotlight = {
  userId?: string
  mode?: ContentModeUserSpotlightMode
}

export type ContentModeUserSpotlight = BaseContentModeUserSpotlight
  & OneOf<{ player: Game_logicGame_logic.PlayerDetails; card: Game_logicGame_logic.CardDetails }>

export type ContentModeGroupSpotlightPlayer = {
  userId?: string
  points?: number
}

export type ContentModeGroupSpotlight = {
  groupId?: string
  groupName?: string
  points?: number
  players?: ContentModeGroupSpotlightPlayer[]
}

export type ContentModeCameraDrive = {
}


type BaseContentMode = {
  introDuration?: string
  outroDuration?: string
}

export type ContentMode = BaseContentMode
  & OneOf<{ game: ContentModeGame; matchEnd: ContentModeMatchEnd; userSpotlight: ContentModeUserSpotlight; groupSpotlight: ContentModeGroupSpotlight; cameraDrive: ContentModeCameraDrive }>

export type Transition = {
  target?: TransitionTarget
  duration?: string
}


type BaseCameraTransitionRequest = {
  transitionTarget?: CameraTransitionRequestTransitionTarget
  transitionLength?: number
}

export type CameraTransitionRequest = BaseCameraTransitionRequest
  & OneOf<{ spotlightDetails: SpotlightDetails }>

export type Shot = {
  name?: string
  duration?: number
  participants?: ShotParticipant[]
}

export type ShotParticipant = {
  userId?: string
  name?: string
}

export type MatchEndData = {
  bestGroup?: Game_logicGame_logic.GroupDetails
  bestPlayer?: Game_logicGame_logic.PlayerDetails
  bestCard?: Game_logicGame_logic.CardDetails
}

export type SpotlightDetails = {
  shots?: Shot[]
  shotTransitionDuration?: number
  introDuration?: number
  matchEndData?: MatchEndData
}




export interface IContentModeUserSpotlightHighlightDelegate<C> {
  onPlayer(ctx: C, ev: Game_logicGame_logic.PlayerDetails): void
  onCard(ctx: C, ev: Game_logicGame_logic.CardDetails): void
}

export function routeContentModeUserSpotlightHighlightDelegate<C>(ctx: C, val: ContentModeUserSpotlight, delegate: IContentModeUserSpotlightHighlightDelegate<C>) {
  val?.player && delegate.onPlayer(ctx, val.player)
  val?.card && delegate.onCard(ctx, val.card)
}




export interface IContentModeContentDelegate<C> {
  onGame(ctx: C, ev: ContentModeGame): void
  onMatchEnd(ctx: C, ev: ContentModeMatchEnd): void
  onUserSpotlight(ctx: C, ev: ContentModeUserSpotlight): void
  onGroupSpotlight(ctx: C, ev: ContentModeGroupSpotlight): void
  onCameraDrive(ctx: C, ev: ContentModeCameraDrive): void
}

export function routeContentModeContentDelegate<C>(ctx: C, val: ContentMode, delegate: IContentModeContentDelegate<C>) {
  val?.game && delegate.onGame(ctx, val.game)
  val?.matchEnd && delegate.onMatchEnd(ctx, val.matchEnd)
  val?.userSpotlight && delegate.onUserSpotlight(ctx, val.userSpotlight)
  val?.groupSpotlight && delegate.onGroupSpotlight(ctx, val.groupSpotlight)
  val?.cameraDrive && delegate.onCameraDrive(ctx, val.cameraDrive)
}




export interface ICameraTransitionRequestDetailsDelegate<C> {
  onSpotlightDetails(ctx: C, ev: SpotlightDetails): void
}

export function routeCameraTransitionRequestDetailsDelegate<C>(ctx: C, val: CameraTransitionRequest, delegate: ICameraTransitionRequestDetailsDelegate<C>) {
  val?.spotlightDetails && delegate.onSpotlightDetails(ctx, val.spotlightDetails)
}