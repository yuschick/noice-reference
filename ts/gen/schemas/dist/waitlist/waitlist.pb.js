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
exports.WaitlistService = exports.routeWaitlistFilterFilterDelegate = exports.WaitlistUpdateEventOperation = void 0;
const fm = __importStar(require("../fetch.pb"));
var WaitlistUpdateEventOperation;
(function (WaitlistUpdateEventOperation) {
    WaitlistUpdateEventOperation["OPERATION_UNSPECIFIED"] = "OPERATION_UNSPECIFIED";
    WaitlistUpdateEventOperation["OPERATION_CREATED"] = "OPERATION_CREATED";
    WaitlistUpdateEventOperation["OPERATION_DELETED"] = "OPERATION_DELETED";
})(WaitlistUpdateEventOperation || (exports.WaitlistUpdateEventOperation = WaitlistUpdateEventOperation = {}));
function routeWaitlistFilterFilterDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.channelId) && delegate.onChannelId(ctx, val.channelId);
    (val === null || val === void 0 ? void 0 : val.channels) && delegate.onChannels(ctx, val.channels);
}
exports.routeWaitlistFilterFilterDelegate = routeWaitlistFilterFilterDelegate;
class WaitlistService {
    static ListWaitlistUsers(req, initReq) {
        return fm.fetchReq(`/v1/waitlist/users?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static DeleteWaitlistUser(req, initReq) {
        return fm.fetchReq(`/v1/waitlist/users/${req["userId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static GetChannelWaitlistSettings(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/settings/waitlist?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListWaitlistOrigins(req, initReq) {
        return fm.fetchReq(`/v1/waitlist/origins?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static UpdateChannelWaitlistSettings(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/settings/waitlist`, Object.assign(Object.assign({}, initReq), { method: "PUT" }));
    }
}
exports.WaitlistService = WaitlistService;
//# sourceMappingURL=waitlist.pb.js.map