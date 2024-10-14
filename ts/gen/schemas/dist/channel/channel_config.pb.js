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
exports.ChannelConfigService = void 0;
const fm = __importStar(require("../fetch.pb"));
class ChannelConfigService {
    static CreateStreamBackendConfig(req, initReq) {
        return fm.fetchReq(`/channel.ChannelConfigService/CreateStreamBackendConfig`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteStreamBackendConfig(req, initReq) {
        return fm.fetchReq(`/channel.ChannelConfigService/DeleteStreamBackendConfig`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetStreamBackendConfig(req, initReq) {
        return fm.fetchReq(`/channel.ChannelConfigService/GetStreamBackendConfig`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetSelectedStreamBackendConfig(req, initReq) {
        return fm.fetchReq(`/channel.ChannelConfigService/GetSelectedStreamBackendConfig`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListStreamBackendConfigs(req, initReq) {
        return fm.fetchReq(`/channel.ChannelConfigService/ListStreamBackendConfigs`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateStreamBackendConfig(req, initReq) {
        return fm.fetchReq(`/v1/channelconfig/${req["body"]["id"]}`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static SelectStreamBackendConfig(req, initReq) {
        return fm.fetchReq(`/channel.ChannelConfigService/SelectStreamBackendConfig`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CreateStream(req, initReq) {
        return fm.fetchReq(`/channel.ChannelConfigService/CreateStream`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static EndStream(req, initReq) {
        return fm.fetchReq(`/channel.ChannelConfigService/EndStream`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static StreamStatusUpdates(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/channel.ChannelConfigService/StreamStatusUpdates`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
        }
        return fm.fetchStreamingRequest(`/channel.ChannelConfigService/StreamStatusUpdates`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static IngestStatsUpdates(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/channel.ChannelConfigService/IngestStatsUpdates`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
        }
        return fm.fetchStreamingRequest(`/channel.ChannelConfigService/IngestStatsUpdates`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetRestreamingConfig(req, initReq) {
        return fm.fetchReq(`/v1/channelconfig/restreaming/${req["channelId"]}?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static UpdateRestreamingConfig(req, initReq) {
        return fm.fetchReq(`/v1/channelconfig/restreaming/${req["body"]["channelId"]}`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static GetRestreamingAccount(req, initReq) {
        return fm.fetchReq(`/v1/streams/${req["channelId"]}/restreamingAccount?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.ChannelConfigService = ChannelConfigService;
//# sourceMappingURL=channel_config.pb.js.map