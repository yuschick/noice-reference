/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as Game_logicGame_logic from "../game-logic/game_logic.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb"
import * as RewardReward from "../reward/reward.pb"
export type ChallengeConfig = {
  gameId?: string
  availableChallengesCount?: number
  isEnabled?: boolean
}

export type ChallengeReward = {
  minPickRate?: number
  maxPickRate?: number
  reward?: RewardReward.RewardType
  gameId?: string
}

export type GetChallengeRequest = {
  challengeId?: string
}

export type ListChallengesRequest = {
  channelId?: string
  gameId?: string
}

export type CreateChallengeRequest = {
  channelId?: string
  gameId?: string
  description?: string
  disabled?: boolean
}

export type ChallengeUpdate = {
  challengeId?: string
  channelId?: string
  gameId?: string
  description?: string
  disabled?: boolean
}

export type UpdateChallengeRequest = {
  body?: ChallengeUpdate
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type DeleteChallengeRequest = {
  channelId?: string
  challengeId?: string
}

export type BatchGetChallengesRequest = {
  challengeIds?: string[]
}

export type GetChallengeRewardsRequest = {
  gameId?: string
}

export type GetChallengeRewardsResponse = {
  rewards?: ChallengeReward[]
}

export type ListChallengesResponse = {
  challenges?: Game_logicGame_logic.Challenge[]
}

export class ChallengeService {
  static GetChallenge(req: GetChallengeRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.Challenge> {
    return fm.fetchReq<GetChallengeRequest, Game_logicGame_logic.Challenge>(`/v1/challenge/${req["challengeId"]}?${fm.renderURLSearchParams(req, ["challengeId"])}`, {...initReq, method: "GET"})
  }
  static BatchGetChallenges(req: BatchGetChallengesRequest, initReq?: fm.InitReq): Promise<ListChallengesResponse> {
    return fm.fetchReq<BatchGetChallengesRequest, ListChallengesResponse>(`/v1/challenges:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetChallengeRewards(req: GetChallengeRewardsRequest, initReq?: fm.InitReq): Promise<GetChallengeRewardsResponse> {
    return fm.fetchReq<GetChallengeRewardsRequest, GetChallengeRewardsResponse>(`/v1/challengeRewards/${req["gameId"]}?${fm.renderURLSearchParams(req, ["gameId"])}`, {...initReq, method: "GET"})
  }
  static ListChallenges(req: ListChallengesRequest, initReq?: fm.InitReq): Promise<ListChallengesResponse> {
    return fm.fetchReq<ListChallengesRequest, ListChallengesResponse>(`/v1/challenge?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static CreateChallenge(req: CreateChallengeRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.Challenge> {
    return fm.fetchReq<CreateChallengeRequest, Game_logicGame_logic.Challenge>(`/v1/challenge`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateChallenge(req: UpdateChallengeRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.Challenge> {
    return fm.fetchReq<UpdateChallengeRequest, Game_logicGame_logic.Challenge>(`/v1/challenge/${req["body"]["challengeId"]}`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static DeleteChallenge(req: DeleteChallengeRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteChallengeRequest, GoogleProtobufEmpty.Empty>(`/v1/challenge/${req["challengeId"]}`, {...initReq, method: "DELETE"})
  }
}