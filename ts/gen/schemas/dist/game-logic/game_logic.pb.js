"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeDebugMsgPayloadDelegate = exports.StreamStateRoundPhase = exports.StreamStateMatchType = exports.StreamStateMatchState = exports.AONPointsCollectFailedMsgErrorCode = exports.ShufflingHandFailedMsgErrorCode = exports.SettingActiveCardFailedMsgErrorCode = exports.ActiveCardFailedMsgReason = exports.MatchBonusType = exports.BoosterType = exports.ContextualTeamActionStatus = exports.ContextualTeamActionType = exports.GroupType = exports.DebugMsgType = exports.ServerOpCode = exports.ClientOpCode = void 0;
var ClientOpCode;
(function (ClientOpCode) {
    ClientOpCode["CLIENT_OP_CODE_UNSPECIFIED"] = "CLIENT_OP_CODE_UNSPECIFIED";
    ClientOpCode["CLIENT_OP_CODE_SET_ACTIVE_CARD"] = "CLIENT_OP_CODE_SET_ACTIVE_CARD";
    ClientOpCode["CLIENT_OP_CODE_SHUFFLE_HAND"] = "CLIENT_OP_CODE_SHUFFLE_HAND";
    ClientOpCode["CLIENT_OP_CODE_TRIGGER_EMOJI"] = "CLIENT_OP_CODE_TRIGGER_EMOJI";
    ClientOpCode["CLIENT_OP_CODE_TRIGGER_EMOTE"] = "CLIENT_OP_CODE_TRIGGER_EMOTE";
    ClientOpCode["CLIENT_OP_CODE_USE_BOOSTER"] = "CLIENT_OP_CODE_USE_BOOSTER";
    ClientOpCode["CLIENT_OP_CODE_COLLECT_AON_POINTS"] = "CLIENT_OP_CODE_COLLECT_AON_POINTS";
    ClientOpCode["CLIENT_OP_CODE_REQUEST_BOOSTER"] = "CLIENT_OP_CODE_REQUEST_BOOSTER";
    ClientOpCode["CLIENT_OP_CODE_CANCEL_BOOSTER_REQUEST"] = "CLIENT_OP_CODE_CANCEL_BOOSTER_REQUEST";
    ClientOpCode["CLIENT_OP_CODE_VOTE_CARD"] = "CLIENT_OP_CODE_VOTE_CARD";
    ClientOpCode["CLIENT_OP_CODE_CANCEL_CARD_VOTE"] = "CLIENT_OP_CODE_CANCEL_CARD_VOTE";
    ClientOpCode["CLIENT_OP_CODE_REQUEST_HAND"] = "CLIENT_OP_CODE_REQUEST_HAND";
    ClientOpCode["CLIENT_OP_CODE_JOIN_TEAM_ACTION"] = "CLIENT_OP_CODE_JOIN_TEAM_ACTION";
    ClientOpCode["CLIENT_OP_CODE_SET_DEBUG"] = "CLIENT_OP_CODE_SET_DEBUG";
})(ClientOpCode || (exports.ClientOpCode = ClientOpCode = {}));
var ServerOpCode;
(function (ServerOpCode) {
    ServerOpCode["SERVER_OP_CODE_UNSPECIFIED"] = "SERVER_OP_CODE_UNSPECIFIED";
    ServerOpCode["SERVER_OP_CODE_GAME_INIT"] = "SERVER_OP_CODE_GAME_INIT";
    ServerOpCode["SERVER_OP_CODE_MATCH_STARTED"] = "SERVER_OP_CODE_MATCH_STARTED";
    ServerOpCode["SERVER_OP_CODE_MATCH_ENDED"] = "SERVER_OP_CODE_MATCH_ENDED";
    ServerOpCode["SERVER_OP_CODE_ACTIVE_CARD_SET"] = "SERVER_OP_CODE_ACTIVE_CARD_SET";
    ServerOpCode["SERVER_OP_CODE_ACTIVE_CARD_SUCCEEDED"] = "SERVER_OP_CODE_ACTIVE_CARD_SUCCEEDED";
    ServerOpCode["SERVER_OP_CODE_ACTIVE_CARD_FAILED"] = "SERVER_OP_CODE_ACTIVE_CARD_FAILED";
    ServerOpCode["SERVER_OP_CODE_SETTING_ACTIVE_CARD_FAILED"] = "SERVER_OP_CODE_SETTING_ACTIVE_CARD_FAILED";
    ServerOpCode["SERVER_OP_CODE_HAND_SHUFFLED"] = "SERVER_OP_CODE_HAND_SHUFFLED";
    ServerOpCode["SERVER_OP_CODE_SHUFFLING_HAND_FAILED"] = "SERVER_OP_CODE_SHUFFLING_HAND_FAILED";
    ServerOpCode["SERVER_OP_CODE_PLAYER_POINTS_UPDATED"] = "SERVER_OP_CODE_PLAYER_POINTS_UPDATED";
    ServerOpCode["SERVER_OP_CODE_PLAYER_COINS_UPDATED"] = "SERVER_OP_CODE_PLAYER_COINS_UPDATED";
    ServerOpCode["SERVER_OP_CODE_PLAYER_JOINED"] = "SERVER_OP_CODE_PLAYER_JOINED";
    ServerOpCode["SERVER_OP_CODE_PLAYER_LEFT"] = "SERVER_OP_CODE_PLAYER_LEFT";
    ServerOpCode["SERVER_OP_CODE_GROUP_POINTS_UPDATED"] = "SERVER_OP_CODE_GROUP_POINTS_UPDATED";
    ServerOpCode["SERVER_OP_CODE_BOOSTER_COOLDOWN_STARTED"] = "SERVER_OP_CODE_BOOSTER_COOLDOWN_STARTED";
    ServerOpCode["SERVER_OP_CODE_BOOSTER_AVAILABLE"] = "SERVER_OP_CODE_BOOSTER_AVAILABLE";
    ServerOpCode["SERVER_OP_CODE_BOOSTER_USED"] = "SERVER_OP_CODE_BOOSTER_USED";
    ServerOpCode["SERVER_OP_CODE_CARD_SWITCH_OUT_TIMER_STARTED"] = "SERVER_OP_CODE_CARD_SWITCH_OUT_TIMER_STARTED";
    ServerOpCode["SERVER_OP_CODE_CARD_SWITCH_OUT_AVAILABLE"] = "SERVER_OP_CODE_CARD_SWITCH_OUT_AVAILABLE";
    ServerOpCode["SERVER_OP_CODE_CARD_VOTE_ADDED"] = "SERVER_OP_CODE_CARD_VOTE_ADDED";
    ServerOpCode["SERVER_OP_CODE_CARD_VOTE_REMOVED"] = "SERVER_OP_CODE_CARD_VOTE_REMOVED";
    ServerOpCode["SERVER_OP_CODE_ACTIVE_CARD_POINTS_UPDATED"] = "SERVER_OP_CODE_ACTIVE_CARD_POINTS_UPDATED";
    ServerOpCode["SERVER_OP_CODE_BOOSTER_REQUESTED"] = "SERVER_OP_CODE_BOOSTER_REQUESTED";
    ServerOpCode["SERVER_OP_CODE_BOOSTER_REQUEST_CANCELLED"] = "SERVER_OP_CODE_BOOSTER_REQUEST_CANCELLED";
    ServerOpCode["SERVER_OP_CODE_BOOSTER_REMOVED"] = "SERVER_OP_CODE_BOOSTER_REMOVED";
    ServerOpCode["SERVER_OP_CODE_BOOSTER_POINTS_RECEIVED"] = "SERVER_OP_CODE_BOOSTER_POINTS_RECEIVED";
    ServerOpCode["SERVER_OP_CODE_ACTIVE_CARD_TARGET_VALUE_CHANGED"] = "SERVER_OP_CODE_ACTIVE_CARD_TARGET_VALUE_CHANGED";
    ServerOpCode["SERVER_OP_CODE_AON_POINTS_COLLECTED"] = "SERVER_OP_CODE_AON_POINTS_COLLECTED";
    ServerOpCode["SERVER_OP_CODE_BEST_PLAY_POINTS_RECEIVED"] = "SERVER_OP_CODE_BEST_PLAY_POINTS_RECEIVED";
    ServerOpCode["SERVER_OP_CODE_GROUP_BONUS_POINTS_RECEIVED"] = "SERVER_OP_CODE_GROUP_BONUS_POINTS_RECEIVED";
    ServerOpCode["SERVER_OP_CODE_CARD_DEALING_STARTED"] = "SERVER_OP_CODE_CARD_DEALING_STARTED";
    ServerOpCode["SERVER_OP_CODE_CARD_DEALING_ENDED"] = "SERVER_OP_CODE_CARD_DEALING_ENDED";
    ServerOpCode["SERVER_OP_CODE_AON_POINTS_COLLECT_FAILED"] = "SERVER_OP_CODE_AON_POINTS_COLLECT_FAILED";
    ServerOpCode["SERVER_OP_CODE_DEBUG_MSG"] = "SERVER_OP_CODE_DEBUG_MSG";
    ServerOpCode["SERVER_OP_CODE_PLAYER_CARD_UPGRADED"] = "SERVER_OP_CODE_PLAYER_CARD_UPGRADED";
    ServerOpCode["SERVER_OP_CODE_RESHUFFLE_COST_UPDATED"] = "SERVER_OP_CODE_RESHUFFLE_COST_UPDATED";
    ServerOpCode["SERVER_OP_CODE_GROUP_CREATED"] = "SERVER_OP_CODE_GROUP_CREATED";
    ServerOpCode["SERVER_OP_CODE_STREAM_ENDED"] = "SERVER_OP_CODE_STREAM_ENDED";
    ServerOpCode["SERVER_OP_CODE_HIGH_SCORING_CARD_SUCCEEDED"] = "SERVER_OP_CODE_HIGH_SCORING_CARD_SUCCEEDED";
    ServerOpCode["SERVER_OP_CODE_HIGH_SCORING_CARD_TIMER_UPDATED"] = "SERVER_OP_CODE_HIGH_SCORING_CARD_TIMER_UPDATED";
    ServerOpCode["SERVER_OP_CODE_HIGH_SCORING_CARD_PROMOTED"] = "SERVER_OP_CODE_HIGH_SCORING_CARD_PROMOTED";
    ServerOpCode["SERVER_OP_CODE_CONTEXTUAL_TEAM_ACTION_UPDATED"] = "SERVER_OP_CODE_CONTEXTUAL_TEAM_ACTION_UPDATED";
    ServerOpCode["SERVER_OP_CODE_MATCH_BONUS_RECEIVED"] = "SERVER_OP_CODE_MATCH_BONUS_RECEIVED";
    ServerOpCode["SERVER_OP_CODE_INACTIVITY_TIMER_UPDATED"] = "SERVER_OP_CODE_INACTIVITY_TIMER_UPDATED";
    ServerOpCode["SERVER_OP_CODE_INACTIVITY_TIMER_CANCELLED"] = "SERVER_OP_CODE_INACTIVITY_TIMER_CANCELLED";
    ServerOpCode["SERVER_OP_CODE_INACTIVITY_KICK_RECEIVED"] = "SERVER_OP_CODE_INACTIVITY_KICK_RECEIVED";
    ServerOpCode["SERVER_OP_CODE_MATCH_PAUSE_STATE_CHANGED"] = "SERVER_OP_CODE_MATCH_PAUSE_STATE_CHANGED";
    ServerOpCode["SERVER_OP_CODE_TEAM_MERGE_WARNING_RECEIVED"] = "SERVER_OP_CODE_TEAM_MERGE_WARNING_RECEIVED";
    ServerOpCode["SERVER_OP_CODE_TEAM_MERGE_EXECUTED"] = "SERVER_OP_CODE_TEAM_MERGE_EXECUTED";
})(ServerOpCode || (exports.ServerOpCode = ServerOpCode = {}));
var DebugMsgType;
(function (DebugMsgType) {
    DebugMsgType["DEBUG_MSG_TYPE_UNSPECIFIED"] = "DEBUG_MSG_TYPE_UNSPECIFIED";
    DebugMsgType["DEBUG_MSG_TYPE_ML_EVENTS"] = "DEBUG_MSG_TYPE_ML_EVENTS";
    DebugMsgType["DEBUG_MSG_TYPE_DEBUG_ENABLED"] = "DEBUG_MSG_TYPE_DEBUG_ENABLED";
    DebugMsgType["DEBUG_MSG_TYPE_CR"] = "DEBUG_MSG_TYPE_CR";
})(DebugMsgType || (exports.DebugMsgType = DebugMsgType = {}));
var GroupType;
(function (GroupType) {
    GroupType["GROUP_TYPE_UNSPECIFIED"] = "GROUP_TYPE_UNSPECIFIED";
    GroupType["GROUP_TYPE_TEAM"] = "GROUP_TYPE_TEAM";
    GroupType["GROUP_TYPE_SOLO"] = "GROUP_TYPE_SOLO";
    GroupType["GROUP_TYPE_PARTY"] = "GROUP_TYPE_PARTY";
})(GroupType || (exports.GroupType = GroupType = {}));
var ContextualTeamActionType;
(function (ContextualTeamActionType) {
    ContextualTeamActionType["CONTEXTUAL_TEAM_ACTION_TYPE_UNSPECIFIED"] = "CONTEXTUAL_TEAM_ACTION_TYPE_UNSPECIFIED";
    ContextualTeamActionType["CONTEXTUAL_TEAM_ACTION_TYPE_HIGH_SCORING_CARD_PROMOTED"] = "CONTEXTUAL_TEAM_ACTION_TYPE_HIGH_SCORING_CARD_PROMOTED";
    ContextualTeamActionType["CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED"] = "CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED";
})(ContextualTeamActionType || (exports.ContextualTeamActionType = ContextualTeamActionType = {}));
var ContextualTeamActionStatus;
(function (ContextualTeamActionStatus) {
    ContextualTeamActionStatus["CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED"] = "CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED";
    ContextualTeamActionStatus["CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING"] = "CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING";
    ContextualTeamActionStatus["CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED"] = "CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED";
    ContextualTeamActionStatus["CONTEXTUAL_TEAM_ACTION_STATUS_FAILED"] = "CONTEXTUAL_TEAM_ACTION_STATUS_FAILED";
})(ContextualTeamActionStatus || (exports.ContextualTeamActionStatus = ContextualTeamActionStatus = {}));
var BoosterType;
(function (BoosterType) {
    BoosterType["BOOSTER_TYPE_UNSPECIFIED"] = "BOOSTER_TYPE_UNSPECIFIED";
    BoosterType["BOOSTER_TYPE_SPEED_UP"] = "BOOSTER_TYPE_SPEED_UP";
    BoosterType["BOOSTER_TYPE_SCAVENGE"] = "BOOSTER_TYPE_SCAVENGE";
    BoosterType["BOOSTER_TYPE_GOOD_CALL"] = "BOOSTER_TYPE_GOOD_CALL";
    BoosterType["BOOSTER_TYPE_LETS_GO"] = "BOOSTER_TYPE_LETS_GO";
    BoosterType["BOOSTER_TYPE_DOUBT"] = "BOOSTER_TYPE_DOUBT";
    BoosterType["BOOSTER_TYPE_NEXT_UP"] = "BOOSTER_TYPE_NEXT_UP";
})(BoosterType || (exports.BoosterType = BoosterType = {}));
var MatchBonusType;
(function (MatchBonusType) {
    MatchBonusType["MATCH_BONUS_TYPE_UNSPECIFIED"] = "MATCH_BONUS_TYPE_UNSPECIFIED";
    MatchBonusType["MATCH_BONUS_TYPE_VICTORY_ROYAL"] = "MATCH_BONUS_TYPE_VICTORY_ROYAL";
})(MatchBonusType || (exports.MatchBonusType = MatchBonusType = {}));
var ActiveCardFailedMsgReason;
(function (ActiveCardFailedMsgReason) {
    ActiveCardFailedMsgReason["REASON_UNSPECIFIED"] = "REASON_UNSPECIFIED";
    ActiveCardFailedMsgReason["REASON_CARD_FAILED"] = "REASON_CARD_FAILED";
    ActiveCardFailedMsgReason["REASON_SWITCHED_OUT"] = "REASON_SWITCHED_OUT";
    ActiveCardFailedMsgReason["REASON_MATCH_ENDED"] = "REASON_MATCH_ENDED";
    ActiveCardFailedMsgReason["REASON_DISCARDED"] = "REASON_DISCARDED";
})(ActiveCardFailedMsgReason || (exports.ActiveCardFailedMsgReason = ActiveCardFailedMsgReason = {}));
var SettingActiveCardFailedMsgErrorCode;
(function (SettingActiveCardFailedMsgErrorCode) {
    SettingActiveCardFailedMsgErrorCode["ERROR_CODE_CARD_UNSPECIFIED"] = "ERROR_CODE_CARD_UNSPECIFIED";
    SettingActiveCardFailedMsgErrorCode["ERROR_CODE_CARD_NOT_IN_HAND"] = "ERROR_CODE_CARD_NOT_IN_HAND";
    SettingActiveCardFailedMsgErrorCode["ERROR_CODE_SWITCH_OUT_TIMER_RUNNING"] = "ERROR_CODE_SWITCH_OUT_TIMER_RUNNING";
    SettingActiveCardFailedMsgErrorCode["ERROR_CODE_CARD_IS_MATCH_CARD"] = "ERROR_CODE_CARD_IS_MATCH_CARD";
    SettingActiveCardFailedMsgErrorCode["ERROR_CODE_MATCH_NOT_ACTIVE"] = "ERROR_CODE_MATCH_NOT_ACTIVE";
})(SettingActiveCardFailedMsgErrorCode || (exports.SettingActiveCardFailedMsgErrorCode = SettingActiveCardFailedMsgErrorCode = {}));
var ShufflingHandFailedMsgErrorCode;
(function (ShufflingHandFailedMsgErrorCode) {
    ShufflingHandFailedMsgErrorCode["ERROR_CODE_UNSPECIFIED"] = "ERROR_CODE_UNSPECIFIED";
    ShufflingHandFailedMsgErrorCode["ERROR_CODE_NOT_ENOUGH_TOKENS"] = "ERROR_CODE_NOT_ENOUGH_TOKENS";
})(ShufflingHandFailedMsgErrorCode || (exports.ShufflingHandFailedMsgErrorCode = ShufflingHandFailedMsgErrorCode = {}));
var AONPointsCollectFailedMsgErrorCode;
(function (AONPointsCollectFailedMsgErrorCode) {
    AONPointsCollectFailedMsgErrorCode["ERROR_CODE_UNSPECIFIED"] = "ERROR_CODE_UNSPECIFIED";
    AONPointsCollectFailedMsgErrorCode["ERROR_CODE_AON_NOT_ACTIVE"] = "ERROR_CODE_AON_NOT_ACTIVE";
    AONPointsCollectFailedMsgErrorCode["ERROR_CODE_AON_TIMER_RUNNING"] = "ERROR_CODE_AON_TIMER_RUNNING";
})(AONPointsCollectFailedMsgErrorCode || (exports.AONPointsCollectFailedMsgErrorCode = AONPointsCollectFailedMsgErrorCode = {}));
var StreamStateMatchState;
(function (StreamStateMatchState) {
    StreamStateMatchState["MATCH_STATE_UNSPECIFIED"] = "MATCH_STATE_UNSPECIFIED";
    StreamStateMatchState["MATCH_STATE_ACTIVE"] = "MATCH_STATE_ACTIVE";
    StreamStateMatchState["MATCH_STATE_ENDED"] = "MATCH_STATE_ENDED";
    StreamStateMatchState["MATCH_STATE_PAUSED"] = "MATCH_STATE_PAUSED";
})(StreamStateMatchState || (exports.StreamStateMatchState = StreamStateMatchState = {}));
var StreamStateMatchType;
(function (StreamStateMatchType) {
    StreamStateMatchType["MATCH_TYPE_UNSPECIFIED"] = "MATCH_TYPE_UNSPECIFIED";
    StreamStateMatchType["MATCH_TYPE_SINGLE_ROUND"] = "MATCH_TYPE_SINGLE_ROUND";
    StreamStateMatchType["MATCH_TYPE_MULTI_ROUND"] = "MATCH_TYPE_MULTI_ROUND";
})(StreamStateMatchType || (exports.StreamStateMatchType = StreamStateMatchType = {}));
var StreamStateRoundPhase;
(function (StreamStateRoundPhase) {
    StreamStateRoundPhase["ROUND_PHASE_UNSPECIFIED"] = "ROUND_PHASE_UNSPECIFIED";
    StreamStateRoundPhase["ROUND_PHASE_BUYING"] = "ROUND_PHASE_BUYING";
    StreamStateRoundPhase["ROUND_PHASE_COMPETING"] = "ROUND_PHASE_COMPETING";
    StreamStateRoundPhase["ROUND_PHASE_ENDED"] = "ROUND_PHASE_ENDED";
})(StreamStateRoundPhase || (exports.StreamStateRoundPhase = StreamStateRoundPhase = {}));
function routeDebugMsgPayloadDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.gameStreamEvent) && delegate.onGameStreamEvent(ctx, val.gameStreamEvent);
}
exports.routeDebugMsgPayloadDelegate = routeDebugMsgPayloadDelegate;
//# sourceMappingURL=game_logic.pb.js.map