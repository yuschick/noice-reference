/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

export enum InvitationCodeUpdateEventUpdateType {
  UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
  UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
  UPDATE_TYPE_USED = "UPDATE_TYPE_USED",
}

export type InvitationCode = {
  code?: string
  ownerId?: string
  createdAt?: string
  usedById?: string
  usedAt?: string
}

export type InvitationCodeUpdateEvent = {
  codes?: InvitationCode[]
  updateType?: InvitationCodeUpdateEventUpdateType
  updatedAt?: string
}

export type ListInvitationCodesRequest = {
  userId?: string
  includeUsed?: boolean
}

export type ListInvitationCodesResponse = {
  codes?: InvitationCode[]
}

export type CreateInvitationCodesRequest = {
  userId?: string
  amount?: number
}

export type CreateInvitationCodesResponse = {
  codes?: InvitationCode[]
}

export type UseInvitationCodeRequest = {
  code?: string
}

export class InvitationService {
  static ListInvitationCodes(req: ListInvitationCodesRequest, initReq?: fm.InitReq): Promise<ListInvitationCodesResponse> {
    return fm.fetchReq<ListInvitationCodesRequest, ListInvitationCodesResponse>(`/v1/invitationCodes?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static CreateInvitationCodes(req: CreateInvitationCodesRequest, initReq?: fm.InitReq): Promise<CreateInvitationCodesResponse> {
    return fm.fetchReq<CreateInvitationCodesRequest, CreateInvitationCodesResponse>(`/v1/invitationCodes:batchCreate`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UseInvitationCode(req: UseInvitationCodeRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<UseInvitationCodeRequest, GoogleProtobufEmpty.Empty>(`/v1/invitationCodes/${req["code"]}:use`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}