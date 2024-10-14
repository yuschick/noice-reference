import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as Stream_infoStream_info from "../stream/stream_info.pb";
export declare enum PartyInvitationUpdateEventUpdateType {
    UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
    UPDATE_TYPE_INVITATION_CREATED = "UPDATE_TYPE_INVITATION_CREATED",
    UPDATE_TYPE_INVITATION_ACCEPTED = "UPDATE_TYPE_INVITATION_ACCEPTED",
    UPDATE_TYPE_INVITATION_DELETED = "UPDATE_TYPE_INVITATION_DELETED",
    UPDATE_TYPE_INVITATION_DECLINED = "UPDATE_TYPE_INVITATION_DECLINED"
}
export type PartyInvitationUpdateEvent = {
    type?: PartyInvitationUpdateEventUpdateType;
    partyInvitation?: PartyInvitation;
};
export type PartyGroupAssignmentUpdateEvent = {
    partyId?: string;
    groupId?: string;
    streamId?: string;
};
export type PartyUpdateEvent = {
    party?: Party;
};
export type PartyMember = {
    userId?: string;
};
export type Party = {
    id?: string;
    name?: string;
    leaderId?: string;
    public?: boolean;
    members?: PartyMember[];
    streamId?: string;
};
export type GetUserPartyRequest = {
    userId?: string;
};
export type GetPartyRequest = {
    partyId?: string;
};
export type GetPartyStreamRequest = {
    partyId?: string;
};
export type GetPartyStreamResponse = {
    streamInfo?: Stream_infoStream_info.StreamInfo;
};
export type ListPartiesRequest = {};
export type ListPartiesResponse = {
    parties?: Party[];
};
export type DeletePartyRequest = {
    partyId?: string;
};
export type CreatePartyRequest = {
    inviteeIds?: string[];
};
export type CreatePartyAdminRequest = {
    members?: string[];
};
export type CreatePartyMemberRequest = {
    partyId?: string;
    userId?: string;
};
export type DeletePartyMemberRequest = {
    partyId?: string;
    userId?: string;
};
export type CreatePartyInvitationRequest = {
    inviterId?: string;
    inviteeId?: string;
    partyId?: string;
};
export type PartyInvitation = {
    partyId?: string;
    inviterId?: string;
    inviteeId?: string;
};
export type ListSentPartyInvitationsRequest = {
    userId?: string;
};
export type ListSentPartyInvitationsResponse = {
    invitations?: PartyInvitation[];
};
export type ListReceivedPartyInvitationsRequest = {
    userId?: string;
};
export type ListReceivedPartyInvitationsResponse = {
    invitations?: PartyInvitation[];
};
export type DeleteInvitationRequest = {
    userId?: string;
    partyId?: string;
};
export type StreamPartyUpdatesRequest = {
    partyId?: string;
};
export declare class PartyService {
    static GetUserParty(req: GetUserPartyRequest, initReq?: fm.InitReq): Promise<Party>;
    static CreateParty(req: CreatePartyRequest, initReq?: fm.InitReq): Promise<Party>;
    static GetParty(req: GetPartyRequest, initReq?: fm.InitReq): Promise<Party>;
    static GetPartyStream(req: GetPartyStreamRequest, initReq?: fm.InitReq): Promise<GetPartyStreamResponse>;
    static StreamPartyUpdates(req: StreamPartyUpdatesRequest, entityNotifier?: fm.NotifyStreamEntityArrival<PartyUpdateEvent>, initReq?: fm.InitReq): Promise<void>;
    static CreatePartyMember(req: CreatePartyMemberRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DeletePartyMember(req: DeletePartyMemberRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static CreatePartyInvitation(req: CreatePartyInvitationRequest, initReq?: fm.InitReq): Promise<PartyInvitation>;
    static ListReceivedPartyInvitations(req: ListReceivedPartyInvitationsRequest, initReq?: fm.InitReq): Promise<ListReceivedPartyInvitationsResponse>;
    static ListSentPartyInvitations(req: ListSentPartyInvitationsRequest, initReq?: fm.InitReq): Promise<ListSentPartyInvitationsResponse>;
    static DeletePartyInvitation(req: DeleteInvitationRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
export declare class PartyAdminService {
    static CreateParty(req: CreatePartyAdminRequest, initReq?: fm.InitReq): Promise<Party>;
    static ListParties(req: ListPartiesRequest, initReq?: fm.InitReq): Promise<ListPartiesResponse>;
    static DeleteParty(req: DeletePartyRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
//# sourceMappingURL=party.pb.d.ts.map