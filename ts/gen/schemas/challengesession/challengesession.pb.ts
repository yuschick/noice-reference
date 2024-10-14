/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum ChallengeSessionPhase {
  PHASE_UNSPECIFIED = "PHASE_UNSPECIFIED",
  PHASE_DRAFT = "PHASE_DRAFT",
  PHASE_SUBMISSION = "PHASE_SUBMISSION",
  PHASE_ACTIVE = "PHASE_ACTIVE",
  PHASE_COMPLETED = "PHASE_COMPLETED",
  PHASE_CANCELLED = "PHASE_CANCELLED",
}

export enum ChallengeChallengeState {
  CHALLENGE_STATE_UNSPECIFIED = "CHALLENGE_STATE_UNSPECIFIED",
  CHALLENGE_STATE_UNRESOLVED = "CHALLENGE_STATE_UNRESOLVED",
  CHALLENGE_STATE_SUCCEEDED = "CHALLENGE_STATE_SUCCEEDED",
  CHALLENGE_STATE_FAILED = "CHALLENGE_STATE_FAILED",
}

export type ChallengeSession = {
  id?: string
  streamId?: string
  gameId?: string
  submissionWindowLength?: string
  submissionDeadline?: string
  phase?: ChallengeSessionPhase
  challenges?: Challenge[]
}

export type Challenge = {
  id?: string
  description?: string
  sessionId?: string
  state?: ChallengeChallengeState
}

export type Stake = {
  currencyId?: string
  currencyAmount?: string
}

export type ChallengePick = {
  sessionId?: string
  challengeId?: string
  userId?: string
  stake?: Stake
}

export type ChallengeStats = {
  sessionId?: string
  challengeId?: string
  highestStakePick?: ChallengePick
  totalStake?: Stake
  totalPicks?: number
}

export type ChallengeSessionEventInitial = {
  session?: ChallengeSession
  stats?: ChallengeStats[]
  userPick?: ChallengePick
}

export type ChallengeSessionEventStakeChange = {
  sessionId?: string
  stats?: ChallengeStats[]
}

export type ChallengeSessionEventPhaseChange = {
  session?: ChallengeSession
}

export type ChallengeSessionEventChallengeStatusChange = {
  sessionId?: string
  challenge?: Challenge
}


type BaseChallengeSessionEvent = {
  streamId?: string
}

export type ChallengeSessionEvent = BaseChallengeSessionEvent
  & OneOf<{ initial: ChallengeSessionEventInitial; stakeChange: ChallengeSessionEventStakeChange; phaseChange: ChallengeSessionEventPhaseChange; challengeStatusChange: ChallengeSessionEventChallengeStatusChange }>

export type ChallengeSessionUpdate = {
  streamId?: string
  gameId?: string
  submissionWindowLength?: string
  challenges?: Challenge[]
}

export type CreateChallengeSessionRequest = {
  streamId?: string
  gameId?: string
  submissionWindowLength?: string
  challenges?: Challenge[]
}

export type GetChallengeSessionRequest = {
  streamId?: string
}

export type UpdateChallengeSessionRequest = {
  body?: ChallengeSessionUpdate
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type PickChallengeRequest = {
  streamId?: string
  challengeId?: string
  stake?: Stake
}

export type ChallengeSessionEventsRequest = {
  streamId?: string
}

export type ResolveChallengeRequest = {
  streamId?: string
  challenge?: Challenge
}

export type ProgressChallengeSessionRequest = {
  streamId?: string
  phase?: ChallengeSessionPhase
}




export interface IChallengeSessionEventEventDelegate<C> {
  onInitial(ctx: C, ev: ChallengeSessionEventInitial): void
  onStakeChange(ctx: C, ev: ChallengeSessionEventStakeChange): void
  onPhaseChange(ctx: C, ev: ChallengeSessionEventPhaseChange): void
  onChallengeStatusChange(ctx: C, ev: ChallengeSessionEventChallengeStatusChange): void
}

export function routeChallengeSessionEventEventDelegate<C>(ctx: C, val: ChallengeSessionEvent, delegate: IChallengeSessionEventEventDelegate<C>) {
  val?.initial && delegate.onInitial(ctx, val.initial)
  val?.stakeChange && delegate.onStakeChange(ctx, val.stakeChange)
  val?.phaseChange && delegate.onPhaseChange(ctx, val.phaseChange)
  val?.challengeStatusChange && delegate.onChallengeStatusChange(ctx, val.challengeStatusChange)
}

export class ChallengeSessionService {
  static CreateChallengeSession(req: CreateChallengeSessionRequest, initReq?: fm.InitReq): Promise<ChallengeSession> {
    return fm.fetchReq<CreateChallengeSessionRequest, ChallengeSession>(`/v1/streams/${req["streamId"]}/challengesession`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetChallengeSession(req: GetChallengeSessionRequest, initReq?: fm.InitReq): Promise<ChallengeSession> {
    return fm.fetchReq<GetChallengeSessionRequest, ChallengeSession>(`/v1/streams/${req["streamId"]}/challengesession?${fm.renderURLSearchParams(req, ["streamId"])}`, {...initReq, method: "GET"})
  }
  static UpdateChallengeSession(req: UpdateChallengeSessionRequest, initReq?: fm.InitReq): Promise<ChallengeSession> {
    return fm.fetchReq<UpdateChallengeSessionRequest, ChallengeSession>(`/v1/streams/${req["body"]["streamId"]}/challengesession`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static PickChallenge(req: PickChallengeRequest, initReq?: fm.InitReq): Promise<ChallengePick> {
    return fm.fetchReq<PickChallengeRequest, ChallengePick>(`/v1/streams/${req["streamId"]}/challengesession:pick`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ChallengeSessionEvents(req: ChallengeSessionEventsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChallengeSessionEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<ChallengeSessionEventsRequest, ChallengeSessionEvent>(`/challengesession.ChallengeSessionService/ChallengeSessionEvents`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
    }
    return fm.fetchStreamingRequest<ChallengeSessionEventsRequest, ChallengeSessionEvent>(`/challengesession.ChallengeSessionService/ChallengeSessionEvents`, entityNotifier, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ProgressChallengeSession(req: ProgressChallengeSessionRequest, initReq?: fm.InitReq): Promise<ChallengeSession> {
    return fm.fetchReq<ProgressChallengeSessionRequest, ChallengeSession>(`/v1/streams/${req["streamId"]}/challengesession:progress`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ResolveChallenge(req: ResolveChallengeRequest, initReq?: fm.InitReq): Promise<ChallengeSession> {
    return fm.fetchReq<ResolveChallengeRequest, ChallengeSession>(`/v1/streams/${req["streamId"]}/challenge:resolve`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}