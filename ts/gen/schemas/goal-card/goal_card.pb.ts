/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as RarityRarity from "../rarity/rarity.pb"
import * as RewardReward from "../reward/reward.pb"

export enum GoalCardTargetType {
  TARGET_TYPE_UNSPECIFIED = "TARGET_TYPE_UNSPECIFIED",
  TARGET_TYPE_TOTAL = "TARGET_TYPE_TOTAL",
  TARGET_TYPE_SINGLE_UPDATE = "TARGET_TYPE_SINGLE_UPDATE",
  TARGET_TYPE_UPDATE_COUNT = "TARGET_TYPE_UPDATE_COUNT",
}

export type GoalCard = {
  id?: string
  description?: string
  counterConfigIds?: string[]
  target?: number
  targetType?: GoalCardTargetType
  reward?: RewardReward.RewardType
  gameId?: string
  cardGoalGroup?: string
  rarity?: RarityRarity.Rarity
  requiredItemIds?: string[]
  requiresTeam?: boolean
  disabled?: boolean
}

export type GoalCardSetEvent = {
  userId?: string
  goalCardSlotId?: string
  goalCardId?: string
}

export type GoalCardProgressEvent = {
  userId?: string
  goalCardSlot?: GoalCardSlot
}

export type GoalCardsDealtEvent = {
  userId?: string
  slotId?: string
  cardIds?: string[]
  reshuffle?: boolean
}

export type GoalCardSlotProgress = {
  value?: number
  percentage?: number
  completed?: boolean
}

export type GoalCardSlot = {
  id?: string
  goalCardId?: string
  progress?: GoalCardSlotProgress
  resetTime?: string
  cardOptions?: string[]
}

export type ListGoalCardSlotsRequest = {
}

export type ListGoalCardSlotsResponse = {
  slots?: GoalCardSlot[]
}

export type SetGoalCardSlotRequest = {
  goalCardSlotId?: string
  goalCardId?: string
}

export type SetGoalCardSlotResponse = {
}

export type GetSlotOptionsRequest = {
  slotId?: string
}

export type GetSlotOptionsResponse = {
  cardOptions?: GoalCard[]
}

export type ReshuffleSlotRequest = {
  slotId?: string
}

export type ReshuffleSlotResponse = {
  cardOptions?: GoalCard[]
}

export type GetGoalCardRequest = {
  id?: string
}

export type BatchGetGoalCardsRequest = {
  ids?: string[]
}

export type BatchGetGoalCardsResponse = {
  goalCards?: GoalCard[]
}

export type ListAllGoalCardsRequest = {
}

export type ListAllGoalCardsResponse = {
  goalCards?: GoalCard[]
}

export class GoalCardService {
  static GetGoalCard(req: GetGoalCardRequest, initReq?: fm.InitReq): Promise<GoalCard> {
    return fm.fetchReq<GetGoalCardRequest, GoalCard>(`/v1/goalcards/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static BatchGetGoalCards(req: BatchGetGoalCardsRequest, initReq?: fm.InitReq): Promise<BatchGetGoalCardsResponse> {
    return fm.fetchReq<BatchGetGoalCardsRequest, BatchGetGoalCardsResponse>(`/v1/goalcards:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListGoalCardSlots(req: ListGoalCardSlotsRequest, initReq?: fm.InitReq): Promise<ListGoalCardSlotsResponse> {
    return fm.fetchReq<ListGoalCardSlotsRequest, ListGoalCardSlotsResponse>(`/goal_card.GoalCardService/ListGoalCardSlots`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SetGoalCardSlot(req: SetGoalCardSlotRequest, initReq?: fm.InitReq): Promise<SetGoalCardSlotResponse> {
    return fm.fetchReq<SetGoalCardSlotRequest, SetGoalCardSlotResponse>(`/goal_card.GoalCardService/SetGoalCardSlot`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetSlotOptions(req: GetSlotOptionsRequest, initReq?: fm.InitReq): Promise<GetSlotOptionsResponse> {
    return fm.fetchReq<GetSlotOptionsRequest, GetSlotOptionsResponse>(`/goal_card.GoalCardService/GetSlotOptions`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ReshuffleSlot(req: ReshuffleSlotRequest, initReq?: fm.InitReq): Promise<ReshuffleSlotResponse> {
    return fm.fetchReq<ReshuffleSlotRequest, ReshuffleSlotResponse>(`/goal_card.GoalCardService/ReshuffleSlot`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class GoalCardAdminService {
  static ListAllGoalCards(req: ListAllGoalCardsRequest, initReq?: fm.InitReq): Promise<ListAllGoalCardsResponse> {
    return fm.fetchReq<ListAllGoalCardsRequest, ListAllGoalCardsResponse>(`/goal_card.GoalCardAdminService/ListAllGoalCards`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}