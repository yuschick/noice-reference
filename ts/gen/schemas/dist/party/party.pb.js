"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyAdminService = exports.PartyService = exports.PartyInvitationUpdateEventUpdateType = void 0;
const fm = __importStar(require("../fetch.pb"));
var PartyInvitationUpdateEventUpdateType;
(function (PartyInvitationUpdateEventUpdateType) {
    PartyInvitationUpdateEventUpdateType["UPDATE_TYPE_UNSPECIFIED"] = "UPDATE_TYPE_UNSPECIFIED";
    PartyInvitationUpdateEventUpdateType["UPDATE_TYPE_INVITATION_CREATED"] = "UPDATE_TYPE_INVITATION_CREATED";
    PartyInvitationUpdateEventUpdateType["UPDATE_TYPE_INVITATION_ACCEPTED"] = "UPDATE_TYPE_INVITATION_ACCEPTED";
    PartyInvitationUpdateEventUpdateType["UPDATE_TYPE_INVITATION_DELETED"] = "UPDATE_TYPE_INVITATION_DELETED";
    PartyInvitationUpdateEventUpdateType["UPDATE_TYPE_INVITATION_DECLINED"] = "UPDATE_TYPE_INVITATION_DECLINED";
})(PartyInvitationUpdateEventUpdateType || (exports.PartyInvitationUpdateEventUpdateType = PartyInvitationUpdateEventUpdateType = {}));
class PartyService {
    static GetUserParty(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}:getParty?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreateParty(req, initReq) {
        return fm.fetchReq(`/v1/parties`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetParty(req, initReq) {
        return fm.fetchReq(`/v1/parties/${req["partyId"]}?${fm.renderURLSearchParams(req, ["partyId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetPartyStream(req, initReq) {
        return fm.fetchReq(`/v1/parties/${req["partyId"]}:getPartyStream?${fm.renderURLSearchParams(req, ["partyId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static StreamPartyUpdates(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/parties/${req["partyId"]}/updates:stream?${fm.renderURLSearchParams(req, ["partyId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/parties/${req["partyId"]}/updates:stream?${fm.renderURLSearchParams(req, ["partyId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreatePartyMember(req, initReq) {
        return fm.fetchReq(`/v1/parties/${req["partyId"]}/members`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeletePartyMember(req, initReq) {
        return fm.fetchReq(`/v1/parties/${req["partyId"]}/members/${req["userId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static CreatePartyInvitation(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["inviteeId"]}/receivedPartyInvitations`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListReceivedPartyInvitations(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/receivedPartyInvitations?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListSentPartyInvitations(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/sentPartyInvitations?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static DeletePartyInvitation(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/receivedPartyInvitations/${req["partyId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
}
exports.PartyService = PartyService;
class PartyAdminService {
    static CreateParty(req, initReq) {
        return fm.fetchReq(`/v1/parties:createParty`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListParties(req, initReq) {
        return fm.fetchReq(`/v1/parties?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static DeleteParty(req, initReq) {
        return fm.fetchReq(`/v1/parties/${req["partyId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
}
exports.PartyAdminService = PartyAdminService;
//# sourceMappingURL=party.pb.js.map