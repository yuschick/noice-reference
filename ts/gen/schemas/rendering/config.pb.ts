/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as AvatarAnimation from "../avatar/animation.pb"
import * as AvatarAvatar from "../avatar/avatar.pb"
import * as RenderingRendering from "./rendering.pb"

export enum ArenaConfigArenaType {
  ARENA_TYPE_UNSPECIFIED = "ARENA_TYPE_UNSPECIFIED",
  ARENA_TYPE_SERVER_SIDE = "ARENA_TYPE_SERVER_SIDE",
  ARENA_TYPE_CLEINT_SIDE_STATIC = "ARENA_TYPE_CLEINT_SIDE_STATIC",
}

export enum ArenaConfigRenderSettingsSkyboxMode {
  SKYBOX_MODE_UNSPECIFIED = "SKYBOX_MODE_UNSPECIFIED",
  SKYBOX_MODE_CUBEMAP = "SKYBOX_MODE_CUBEMAP",
  SKYBOX_MODE_LATLONG = "SKYBOX_MODE_LATLONG",
}

export enum ArenaConfigRenderSettingsAmbientMode {
  AMBIENT_MODE_UNSPECIFIED = "AMBIENT_MODE_UNSPECIFIED",
  AMBIENT_MODE_SKYBOX = "AMBIENT_MODE_SKYBOX",
  AMBIENT_MODE_TRILIGHT = "AMBIENT_MODE_TRILIGHT",
  AMBIENT_MODE_FLAT = "AMBIENT_MODE_FLAT",
  AMBIENT_MODE_CUSTOM = "AMBIENT_MODE_CUSTOM",
}

export enum ArenaConfigRenderSettingsFogMode {
  FOG_MODE_UNSPECIFIED = "FOG_MODE_UNSPECIFIED",
  FOG_MODE_LINEAR = "FOG_MODE_LINEAR",
  FOG_MODE_EXPONENTIAL = "FOG_MODE_EXPONENTIAL",
  FOG_MODE_EXPONENTIALSQUARED = "FOG_MODE_EXPONENTIALSQUARED",
}

export type ArenaConfigFeatures = {
  spotlights?: boolean
  cameraDrives?: boolean
}

export type ArenaConfigTeamLocator = {
  teamIndex?: number
  isLocalTeam?: boolean
  avatarSlots?: ArenaConfigAvatarSlot[]
}

export type ArenaConfigAvatarSlot = {
  slotIndex?: number
  position?: RenderingRendering.Vector3
  rotation?: RenderingRendering.Rotation
}

export type ArenaConfigRenderSettings = {
  skyboxTintColor?: RenderingRendering.Color
  skyboxExposure?: number
  skyboxRotation?: number
  skyboxMode?: ArenaConfigRenderSettingsSkyboxMode
  skyboxTexturePath?: string
  ambientMode?: ArenaConfigRenderSettingsAmbientMode
  ambientSkyColor?: RenderingRendering.Color
  ambientEquatorColor?: RenderingRendering.Color
  ambientGroundColor?: RenderingRendering.Color
  ambientIntensity?: number
  fogEnabled?: boolean
  fogColor?: RenderingRendering.Color
  fogMode?: ArenaConfigRenderSettingsFogMode
  fogStartDistance?: number
  fogEndDistance?: number
  fogDensity?: number
}

export type ArenaConfigPostProcessData = {
  components?: RenderingRendering.PostFxComponent[]
}

export type ArenaConfig = {
  name?: string
  teamLocators?: ArenaConfigTeamLocator[]
  lights?: RenderingRendering.Light[]
  cameras?: RenderingRendering.Camera[]
  renderSettings?: ArenaConfigRenderSettings
  postProcessData?: ArenaConfigPostProcessData
  gameviewScreenshotUrl?: string
  features?: ArenaConfigFeatures
  ingestTextureTransforms?: RenderingRendering.Transform[]
  arenaType?: ArenaConfigArenaType
}

export type AvatarConfigsAvatar = {
  userId?: string
  groupId?: string
  url?: string
  slotIndex?: number
  lodUrls?: string[]
  lods?: AvatarAvatar.AvatarAssetsLod[]
  generatorVersion?: string
}

export type AvatarConfigs = {
  avatars?: AvatarConfigsAvatar[]
}

export type ArenaLoadRequest = {
  name?: string
  contentCatalogUri?: string
}

export type AnimationLoadRequest = {
  animations?: AvatarAnimation.Animation[]
}