/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as Stream_infoStream_info from "../stream/stream_info.pb"

export enum PartyInvitationUpdateEventUpdateType {
  UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
  UPDATE_TYPE_INVITATION_CREATED = "UPDATE_TYPE_INVITATION_CREATED",
  UPDATE_TYPE_INVITATION_ACCEPTED = "UPDATE_TYPE_INVITATION_ACCEPTED",
  UPDATE_TYPE_INVITATION_DELETED = "UPDATE_TYPE_INVITATION_DELETED",
  UPDATE_TYPE_INVITATION_DECLINED = "UPDATE_TYPE_INVITATION_DECLINED",
}

export type PartyInvitationUpdateEvent = {
  type?: PartyInvitationUpdateEventUpdateType
  partyInvitation?: PartyInvitation
}

export type PartyGroupAssignmentUpdateEvent = {
  partyId?: string
  groupId?: string
  streamId?: string
}

export type PartyUpdateEvent = {
  party?: Party
}

export type PartyMember = {
  userId?: string
}

export type Party = {
  id?: string
  name?: string
  leaderId?: string
  public?: boolean
  members?: PartyMember[]
  streamId?: string
}

export type GetUserPartyRequest = {
  userId?: string
}

export type GetPartyRequest = {
  partyId?: string
}

export type GetPartyStreamRequest = {
  partyId?: string
}

export type GetPartyStreamResponse = {
  streamInfo?: Stream_infoStream_info.StreamInfo
}

export type ListPartiesRequest = {
}

export type ListPartiesResponse = {
  parties?: Party[]
}

export type DeletePartyRequest = {
  partyId?: string
}

export type CreatePartyRequest = {
  inviteeIds?: string[]
}

export type CreatePartyAdminRequest = {
  members?: string[]
}

export type CreatePartyMemberRequest = {
  partyId?: string
  userId?: string
}

export type DeletePartyMemberRequest = {
  partyId?: string
  userId?: string
}

export type CreatePartyInvitationRequest = {
  inviterId?: string
  inviteeId?: string
  partyId?: string
}

export type PartyInvitation = {
  partyId?: string
  inviterId?: string
  inviteeId?: string
}

export type ListSentPartyInvitationsRequest = {
  userId?: string
}

export type ListSentPartyInvitationsResponse = {
  invitations?: PartyInvitation[]
}

export type ListReceivedPartyInvitationsRequest = {
  userId?: string
}

export type ListReceivedPartyInvitationsResponse = {
  invitations?: PartyInvitation[]
}

export type DeleteInvitationRequest = {
  userId?: string
  partyId?: string
}

export type StreamPartyUpdatesRequest = {
  partyId?: string
}

export class PartyService {
  static GetUserParty(req: GetUserPartyRequest, initReq?: fm.InitReq): Promise<Party> {
    return fm.fetchReq<GetUserPartyRequest, Party>(`/v1/users/${req["userId"]}:getParty?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static CreateParty(req: CreatePartyRequest, initReq?: fm.InitReq): Promise<Party> {
    return fm.fetchReq<CreatePartyRequest, Party>(`/v1/parties`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetParty(req: GetPartyRequest, initReq?: fm.InitReq): Promise<Party> {
    return fm.fetchReq<GetPartyRequest, Party>(`/v1/parties/${req["partyId"]}?${fm.renderURLSearchParams(req, ["partyId"])}`, {...initReq, method: "GET"})
  }
  static GetPartyStream(req: GetPartyStreamRequest, initReq?: fm.InitReq): Promise<GetPartyStreamResponse> {
    return fm.fetchReq<GetPartyStreamRequest, GetPartyStreamResponse>(`/v1/parties/${req["partyId"]}:getPartyStream?${fm.renderURLSearchParams(req, ["partyId"])}`, {...initReq, method: "GET"})
  }
  static StreamPartyUpdates(req: StreamPartyUpdatesRequest, entityNotifier?: fm.NotifyStreamEntityArrival<PartyUpdateEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<StreamPartyUpdatesRequest, PartyUpdateEvent>(`/v1/parties/${req["partyId"]}/updates:stream?${fm.renderURLSearchParams(req, ["partyId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<StreamPartyUpdatesRequest, PartyUpdateEvent>(`/v1/parties/${req["partyId"]}/updates:stream?${fm.renderURLSearchParams(req, ["partyId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static CreatePartyMember(req: CreatePartyMemberRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CreatePartyMemberRequest, GoogleProtobufEmpty.Empty>(`/v1/parties/${req["partyId"]}/members`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeletePartyMember(req: DeletePartyMemberRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeletePartyMemberRequest, GoogleProtobufEmpty.Empty>(`/v1/parties/${req["partyId"]}/members/${req["userId"]}`, {...initReq, method: "DELETE"})
  }
  static CreatePartyInvitation(req: CreatePartyInvitationRequest, initReq?: fm.InitReq): Promise<PartyInvitation> {
    return fm.fetchReq<CreatePartyInvitationRequest, PartyInvitation>(`/v1/users/${req["inviteeId"]}/receivedPartyInvitations`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListReceivedPartyInvitations(req: ListReceivedPartyInvitationsRequest, initReq?: fm.InitReq): Promise<ListReceivedPartyInvitationsResponse> {
    return fm.fetchReq<ListReceivedPartyInvitationsRequest, ListReceivedPartyInvitationsResponse>(`/v1/users/${req["userId"]}/receivedPartyInvitations?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static ListSentPartyInvitations(req: ListSentPartyInvitationsRequest, initReq?: fm.InitReq): Promise<ListSentPartyInvitationsResponse> {
    return fm.fetchReq<ListSentPartyInvitationsRequest, ListSentPartyInvitationsResponse>(`/v1/users/${req["userId"]}/sentPartyInvitations?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static DeletePartyInvitation(req: DeleteInvitationRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteInvitationRequest, GoogleProtobufEmpty.Empty>(`/v1/users/${req["userId"]}/receivedPartyInvitations/${req["partyId"]}`, {...initReq, method: "DELETE"})
  }
}
export class PartyAdminService {
  static CreateParty(req: CreatePartyAdminRequest, initReq?: fm.InitReq): Promise<Party> {
    return fm.fetchReq<CreatePartyAdminRequest, Party>(`/v1/parties:createParty`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListParties(req: ListPartiesRequest, initReq?: fm.InitReq): Promise<ListPartiesResponse> {
    return fm.fetchReq<ListPartiesRequest, ListPartiesResponse>(`/v1/parties?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static DeleteParty(req: DeletePartyRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeletePartyRequest, GoogleProtobufEmpty.Empty>(`/v1/parties/${req["partyId"]}`, {...initReq, method: "DELETE"})
  }
}