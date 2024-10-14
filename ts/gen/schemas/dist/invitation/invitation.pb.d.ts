import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
export declare enum InvitationCodeUpdateEventUpdateType {
    UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
    UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
    UPDATE_TYPE_USED = "UPDATE_TYPE_USED"
}
export type InvitationCode = {
    code?: string;
    ownerId?: string;
    createdAt?: string;
    usedById?: string;
    usedAt?: string;
};
export type InvitationCodeUpdateEvent = {
    codes?: InvitationCode[];
    updateType?: InvitationCodeUpdateEventUpdateType;
    updatedAt?: string;
};
export type ListInvitationCodesRequest = {
    userId?: string;
    includeUsed?: boolean;
};
export type ListInvitationCodesResponse = {
    codes?: InvitationCode[];
};
export type CreateInvitationCodesRequest = {
    userId?: string;
    amount?: number;
};
export type CreateInvitationCodesResponse = {
    codes?: InvitationCode[];
};
export type UseInvitationCodeRequest = {
    code?: string;
};
export declare class InvitationService {
    static ListInvitationCodes(req: ListInvitationCodesRequest, initReq?: fm.InitReq): Promise<ListInvitationCodesResponse>;
    static CreateInvitationCodes(req: CreateInvitationCodesRequest, initReq?: fm.InitReq): Promise<CreateInvitationCodesResponse>;
    static UseInvitationCode(req: UseInvitationCodeRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
//# sourceMappingURL=invitation.pb.d.ts.map