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
exports.GameEventsService = exports.ClientMailboxService = exports.MatchAdminService = exports.MatchServiceV2 = exports.MatchMakingAdminService = exports.MatchMakingServiceV2 = exports.routeMailboxMessagePayloadDelegate = exports.routeStreamSpectatorCoordinationEventEventDelegate = exports.routeLeaderboardUpdateContentDelegate = exports.routeMatchGroupActionActionDelegate = exports.routeMatchRewardEventRewardContentDelegate = exports.routeStreamMatchStateEventPayloadDelegate = exports.MatchGroupErrorCode = exports.StreamMatchStateOpCode = void 0;
const fm = __importStar(require("../fetch.pb"));
var StreamMatchStateOpCode;
(function (StreamMatchStateOpCode) {
    StreamMatchStateOpCode["STREAM_MATCH_STATE_OP_CODE_UNSPECIFIED"] = "STREAM_MATCH_STATE_OP_CODE_UNSPECIFIED";
    StreamMatchStateOpCode["STREAM_MATCH_STATE_OP_CODE_MATCH_STARTED"] = "STREAM_MATCH_STATE_OP_CODE_MATCH_STARTED";
    StreamMatchStateOpCode["STREAM_MATCH_STATE_OP_CODE_STREAM_ENDED"] = "STREAM_MATCH_STATE_OP_CODE_STREAM_ENDED";
})(StreamMatchStateOpCode || (exports.StreamMatchStateOpCode = StreamMatchStateOpCode = {}));
var MatchGroupErrorCode;
(function (MatchGroupErrorCode) {
    MatchGroupErrorCode["UNSPECIFIED"] = "UNSPECIFIED";
    MatchGroupErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    MatchGroupErrorCode["USER_ALREADY_PRESENT"] = "USER_ALREADY_PRESENT";
    MatchGroupErrorCode["USER_HAS_NO_RESERVATION"] = "USER_HAS_NO_RESERVATION";
    MatchGroupErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    MatchGroupErrorCode["SERVER_SHUTTING_DOWN"] = "SERVER_SHUTTING_DOWN";
})(MatchGroupErrorCode || (exports.MatchGroupErrorCode = MatchGroupErrorCode = {}));
function routeStreamMatchStateEventPayloadDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.matchStarted) && delegate.onMatchStarted(ctx, val.matchStarted);
    (val === null || val === void 0 ? void 0 : val.streamEnded) && delegate.onStreamEnded(ctx, val.streamEnded);
}
exports.routeStreamMatchStateEventPayloadDelegate = routeStreamMatchStateEventPayloadDelegate;
function routeMatchRewardEventRewardContentDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.currency) && delegate.onCurrency(ctx, val.currency);
    (val === null || val === void 0 ? void 0 : val.experiencePoints) && delegate.onExperiencePoints(ctx, val.experiencePoints);
}
exports.routeMatchRewardEventRewardContentDelegate = routeMatchRewardEventRewardContentDelegate;
function routeMatchGroupActionActionDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.joinMatchGroup) && delegate.onJoinMatchGroup(ctx, val.joinMatchGroup);
    (val === null || val === void 0 ? void 0 : val.leaveMatchGroup) && delegate.onLeaveMatchGroup(ctx, val.leaveMatchGroup);
    (val === null || val === void 0 ? void 0 : val.setActiveCard) && delegate.onSetActiveCard(ctx, val.setActiveCard);
    (val === null || val === void 0 ? void 0 : val.shuffleHand) && delegate.onShuffleHand(ctx, val.shuffleHand);
    (val === null || val === void 0 ? void 0 : val.triggerEmoji) && delegate.onTriggerEmoji(ctx, val.triggerEmoji);
    (val === null || val === void 0 ? void 0 : val.triggerEmote) && delegate.onTriggerEmote(ctx, val.triggerEmote);
    (val === null || val === void 0 ? void 0 : val.useBooster) && delegate.onUseBooster(ctx, val.useBooster);
    (val === null || val === void 0 ? void 0 : val.requestBooster) && delegate.onRequestBooster(ctx, val.requestBooster);
    (val === null || val === void 0 ? void 0 : val.cancelBoosterRequest) && delegate.onCancelBoosterRequest(ctx, val.cancelBoosterRequest);
    (val === null || val === void 0 ? void 0 : val.voteCard) && delegate.onVoteCard(ctx, val.voteCard);
    (val === null || val === void 0 ? void 0 : val.cancelCardVote) && delegate.onCancelCardVote(ctx, val.cancelCardVote);
    (val === null || val === void 0 ? void 0 : val.collectAonPoints) && delegate.onCollectAonPoints(ctx, val.collectAonPoints);
    (val === null || val === void 0 ? void 0 : val.requestHand) && delegate.onRequestHand(ctx, val.requestHand);
    (val === null || val === void 0 ? void 0 : val.joinTeamAction) && delegate.onJoinTeamAction(ctx, val.joinTeamAction);
    (val === null || val === void 0 ? void 0 : val.setDebug) && delegate.onSetDebug(ctx, val.setDebug);
}
exports.routeMatchGroupActionActionDelegate = routeMatchGroupActionActionDelegate;
function routeLeaderboardUpdateContentDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.ping) && delegate.onPing(ctx, val.ping);
    (val === null || val === void 0 ? void 0 : val.reset) && delegate.onReset(ctx, val.reset);
    (val === null || val === void 0 ? void 0 : val.groupUpdate) && delegate.onGroupUpdate(ctx, val.groupUpdate);
    (val === null || val === void 0 ? void 0 : val.playerUpdate) && delegate.onPlayerUpdate(ctx, val.playerUpdate);
    (val === null || val === void 0 ? void 0 : val.playerLeft) && delegate.onPlayerLeft(ctx, val.playerLeft);
}
exports.routeLeaderboardUpdateContentDelegate = routeLeaderboardUpdateContentDelegate;
function routeStreamSpectatorCoordinationEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.changeGroup) && delegate.onChangeGroup(ctx, val.changeGroup);
}
exports.routeStreamSpectatorCoordinationEventEventDelegate = routeStreamSpectatorCoordinationEventEventDelegate;
function routeMailboxMessagePayloadDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.event) && delegate.onEvent(ctx, val.event);
    (val === null || val === void 0 ? void 0 : val.streamStateUpdate) && delegate.onStreamStateUpdate(ctx, val.streamStateUpdate);
}
exports.routeMailboxMessagePayloadDelegate = routeMailboxMessagePayloadDelegate;
class MatchMakingServiceV2 {
    static FindMatchGroup(req, initReq) {
        return fm.fetchReq(`/match.MatchMakingServiceV2/FindMatchGroup`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ChangeMatchGroup(req, initReq) {
        return fm.fetchReq(`/match.MatchMakingServiceV2/ChangeMatchGroup`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.MatchMakingServiceV2 = MatchMakingServiceV2;
class MatchMakingAdminService {
    static AssignMatchGroup(req, initReq) {
        return fm.fetchReq(`/match.MatchMakingAdminService/AssignMatchGroup`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.MatchMakingAdminService = MatchMakingAdminService;
class MatchServiceV2 {
    static MatchGroup(entityNotifier, errorCallback, initReq) {
        return fm.biDirectionalStreamingRequest(`/match.MatchServiceV2/MatchGroup`, entityNotifier, errorCallback, Object.assign({}, initReq));
    }
    static StreamSpectatorCoordinationEvents(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/streams/${req["streamId"]}/spectator/events?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/streams/${req["streamId"]}/spectator/events?${fm.renderURLSearchParams(req, ["streamId"])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static LeaderboardUpdates(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/match.MatchServiceV2/LeaderboardUpdates`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
        }
        return fm.fetchStreamingRequest(`/match.MatchServiceV2/LeaderboardUpdates`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetGroupChatID(req, initReq) {
        return fm.fetchReq(`/v1/streams/${req["streamId"]}/groups/${req["groupId"]}/chat?${fm.renderURLSearchParams(req, ["streamId", "groupId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetMatchState(req, initReq) {
        return fm.fetchReq(`/v1/streams/${req["streamId"]}/match_state?${fm.renderURLSearchParams(req, ["streamId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.MatchServiceV2 = MatchServiceV2;
class MatchAdminService {
    static GetStreamState(req, initReq) {
        return fm.fetchReq(`/match.MatchAdminService/GetStreamState`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetGroupState(req, initReq) {
        return fm.fetchReq(`/match.MatchAdminService/GetGroupState`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static AdvanceGroupTime(req, initReq) {
        return fm.fetchReq(`/match.MatchAdminService/AdvanceGroupTime`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SetGroupRandomSeed(req, initReq) {
        return fm.fetchReq(`/match.MatchAdminService/SetGroupRandomSeed`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.MatchAdminService = MatchAdminService;
class ClientMailboxService {
    static SendMessage(req, initReq) {
        return fm.fetchReq(`/match.ClientMailboxService/SendMessage`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.ClientMailboxService = ClientMailboxService;
class GameEventsService {
    static PublishGameEvent(req, initReq) {
        return fm.fetchReq(`/v1/gameevents`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.GameEventsService = GameEventsService;
//# sourceMappingURL=match.pb.js.map