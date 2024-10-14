/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as AvatarAvatar from "../avatar/avatar.pb"
import * as Game_logicGame_logic from "../game-logic/game_logic.pb"
import * as RarityRarity from "../rarity/rarity.pb"
export type PlayerJoinEvent = {
  userId?: string
  username?: string
  groupId?: string
  avatarUrl2D?: string
  avatarUrl3D?: string
  gender?: string
  avatarLods?: string[]
  lods?: AvatarAvatar.AvatarAssetsLod[]
  generatorVersion?: string
}

export type PlayerLeaveEvent = {
  userId?: string
  username?: string
  groupId?: string
}

export type CardSetActiveEvent = {
  userId?: string
  cardId?: string
  cardRarity?: RarityRarity.Rarity
}

export type CardSuccessEvent = {
  userId?: string
  cardId?: string
  cardRarity?: RarityRarity.Rarity
  points?: number
}

export type CardFailureEvent = {
  userId?: string
  cardId?: string
  cardRarity?: RarityRarity.Rarity
  points?: number
  reason?: Game_logicGame_logic.ActiveCardFailedMsgReason
}

export type BoosterRequestedEvent = {
  userId?: string
  targetUserId?: string
  boosterId?: number
}

export type BoosterUsedEvent = {
  userId?: string
  targetUserId?: string
  boosterId?: number
}

export type EmojiEvent = {
  userId?: string
  prefabName?: string
  emojiUrl?: string
  emojiName?: string
}

export type EmoteEvent = {
  userId?: string
  animationStateName?: string
  animationId?: string
}

export type GroupCheerEvent = {
  participantIds?: string[]
}

export type GroupCheerParticipationEvent = {
  userId?: string
  state?: boolean
}

export type HighScoringCardEvent = {
  userId?: string
  groupId?: string
  cardId?: string
  points?: number
}

export type ChatMessageSentEvent = {
  userId?: string
}

export type MatchStartEvent = {
}

export type MatchEndEvent = {
  bestGroupId?: string
}

export type SetDebugEvent = {
  enabled?: boolean
  jsonData?: string
}