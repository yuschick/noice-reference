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
exports.FeatureFlagService = exports.routeFeatureFlagGroupConditionRuleDelegate = void 0;
const fm = __importStar(require("../fetch.pb"));
function routeFeatureFlagGroupConditionRuleDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.eq) && delegate.onEq(ctx, val.eq);
    (val === null || val === void 0 ? void 0 : val.any) && delegate.onAny(ctx, val.any);
}
exports.routeFeatureFlagGroupConditionRuleDelegate = routeFeatureFlagGroupConditionRuleDelegate;
class FeatureFlagService {
    static GetFeatureFlagConfig(req, initReq) {
        return fm.fetchReq(`/v1/flags/config?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static StreamConfigUpdates(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/flags/config:stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        return fm.fetchStreamingRequest(`/v1/flags/config:stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static SetFeatureFlagConfig(req, initReq) {
        return fm.fetchReq(`/v1/flags/config`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetUserFeatureFlag(req, initReq) {
        return fm.fetchReq(`/v1/flags/user/${req["userId"]}/${req["flagName"]}?${fm.renderURLSearchParams(req, ["userId", "flagName"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListUserFeatureFlags(req, initReq) {
        return fm.fetchReq(`/v1/flags/user/${req["userId"]}?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetChannelFeatureFlag(req, initReq) {
        return fm.fetchReq(`/v1/flags/channel/${req["channelId"]}/${req["flagName"]}?${fm.renderURLSearchParams(req, ["channelId", "flagName"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListChannelFeatureFlags(req, initReq) {
        return fm.fetchReq(`/v1/flags/channel/${req["channelId"]}?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetFeatureFlagSchema(req, initReq) {
        return fm.fetchReq(`/v1/flags/schema?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.FeatureFlagService = FeatureFlagService;
//# sourceMappingURL=flag.pb.js.map