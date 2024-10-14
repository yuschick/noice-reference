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
exports.ProgressionAdminService = exports.ProgressionService = exports.routeLevelTargetDelegate = exports.routeExperiencePointsTargetDelegate = exports.routeProgressionUpdateEventUpdateUpdateDelegate = void 0;
const fm = __importStar(require("../fetch.pb"));
function routeProgressionUpdateEventUpdateUpdateDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.experiencePoints) && delegate.onExperiencePoints(ctx, val.experiencePoints);
    (val === null || val === void 0 ? void 0 : val.level) && delegate.onLevel(ctx, val.level);
}
exports.routeProgressionUpdateEventUpdateUpdateDelegate = routeProgressionUpdateEventUpdateUpdateDelegate;
function routeExperiencePointsTargetDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.fan) && delegate.onFan(ctx, val.fan);
    (val === null || val === void 0 ? void 0 : val.season) && delegate.onSeason(ctx, val.season);
    (val === null || val === void 0 ? void 0 : val.channel) && delegate.onChannel(ctx, val.channel);
}
exports.routeExperiencePointsTargetDelegate = routeExperiencePointsTargetDelegate;
function routeLevelTargetDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.fan) && delegate.onFan(ctx, val.fan);
    (val === null || val === void 0 ? void 0 : val.season) && delegate.onSeason(ctx, val.season);
    (val === null || val === void 0 ? void 0 : val.channel) && delegate.onChannel(ctx, val.channel);
}
exports.routeLevelTargetDelegate = routeLevelTargetDelegate;
class ProgressionService {
    static GetUserProgression(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/progression?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetSeasonProgression(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/seasonProgression/${req["seasonId"]}?${fm.renderURLSearchParams(req, ["userId", "seasonId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListSeasonProgression(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/seasonProgression?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetSeasonProgression(req, initReq) {
        return fm.fetchReq(`/v1/seasonProgression:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListLevelConfigs(req, initReq) {
        return fm.fetchReq(`/v1/levelConfigs?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetDailyXPBoostLimit(req, initReq) {
        return fm.fetchReq(`/v1/progression/limits/dailyXPBoost?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetDailyParticipationLimit(req, initReq) {
        return fm.fetchReq(`/v1/progression/limits/dailyParticipation?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetDailyXPEarningsLimit(req, initReq) {
        return fm.fetchReq(`/v1/progression/limits/dailyXPEarnings?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.ProgressionService = ProgressionService;
class ProgressionAdminService {
    static ResetUserProgression(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/progression`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static AddExperiencePoints(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/progression:addXP`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ResetUserSeasonProgression(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/progression/${req["seasonId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
}
exports.ProgressionAdminService = ProgressionAdminService;
//# sourceMappingURL=progression.pb.js.map